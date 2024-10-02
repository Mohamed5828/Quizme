from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.shortcuts import get_object_or_404

from answers.models import Answer
from answers.serializers import AnswerSerializer
from authentication.permissions import AUTH_SWAGGER_PARAM
from exam.models import Question, Exam
from authentication.models import CustomUser
from code_executor.views import TaskViewSet
from attempts.models import Attempt

class AnswerViewSet(ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        tags=['answers'],
        operation_description="Create an answer",
        request_body=AnswerSerializer,
        responses={201: AnswerSerializer()},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['answers'],
        operation_description="List answers",
        responses={200: AnswerSerializer(many=True)},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['answers'],
        operation_description="Retrieve an answer",
        responses={200: AnswerSerializer()},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['answers'],
        operation_description="Update an answer",
        request_body=AnswerSerializer,
        responses={200: AnswerSerializer()},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['answers'],
        operation_description="Partially update an answer",
        request_body=AnswerSerializer,
        responses={200: AnswerSerializer()},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['answers'],
        operation_description="Delete an answer",
        responses={204: "No Content"},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

class EvaluateAnswerView(APIView):
    # TODO: Implement this view or remove if not needed
    pass

class EvaluateCode(APIView):
    @swagger_auto_schema(
        operation_description="Evaluate submitted code for a given question",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['code', 'language', 'question_id', 'exam_code', 'student_id','version'],
            properties={
                'code': openapi.Schema(type=openapi.TYPE_STRING, description="Code to be evaluated"),
                'language': openapi.Schema(type=openapi.TYPE_STRING, description="Programming language of the code"),
                'question_id': openapi.Schema(type=openapi.TYPE_INTEGER, description="ID of the question"),
                'exam_code': openapi.Schema(type=openapi.TYPE_STRING, description="Code of the exam"),
                'student_id': openapi.Schema(type=openapi.TYPE_INTEGER, description="ID of the student"),
                'version': openapi.Schema(type=openapi.TYPE_STRING, description="language version on pistonAPI"),
            },
        ),
        manual_parameters=[
            AUTH_SWAGGER_PARAM
        ],
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Code evaluation successful",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'message': openapi.Schema(type=openapi.TYPE_STRING),
                        'score': openapi.Schema(type=openapi.TYPE_NUMBER),
                        'max_score': openapi.Schema(type=openapi.TYPE_NUMBER),
                    },
                ),
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Code evaluation failed or some test cases failed",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'message': openapi.Schema(type=openapi.TYPE_STRING),
                        'results': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_OBJECT)),
                    },
                ),
            ),
            status.HTTP_404_NOT_FOUND: openapi.Response(
                description="Question, Exam, or Student not found",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING),
                    },
                ),
            ),
        },
    )
    def post(self, request, *args, **kwargs):
        run_code = request.data.get("code")
        language = request.data.get("language")
        version = request.data.get("version")
        question_id = request.data.get("question_id")
        exam_code = request.data.get("exam_code")
        student_id = request.data.get("student_id")

        current_question = get_object_or_404(Question, id=question_id)
        exam = get_object_or_404(Exam, exam_code=exam_code)
        student = get_object_or_404(CustomUser, id=student_id)

        attempt, _ = Attempt.objects.get_or_create(student_id=student, exam_id=exam)
        test_cases = current_question.test_cases

        results = self.evaluate_test_cases(language, run_code, test_cases , version)
        all_passed = all(result['passed'] for result in results)

        question_score = current_question.grade if all_passed else 0

        self.update_answer_and_attempt(attempt, current_question, run_code, question_score)

        if all_passed:
            return Response({
                "message": "All test cases passed",
                "score": question_score,
                "max_score": current_question.grade,
            })
        else:
            return Response({
                "message": "Some test cases failed",
                "results": results
            }, status=status.HTTP_400_BAD_REQUEST)

    def evaluate_test_cases(self, language, run_code, test_cases,version):
        results = []
        for test in test_cases:
            celery_task = TaskViewSet.execute_code(None, language=language, code=run_code, stdin=test.get('input', ''),version=version)
            output = celery_task.get("output", {})

            if output.get("stderr"):
                return Response({
                    "error": "Code execution error",
                    "details": output["stderr"]
                }, status=status.HTTP_400_BAD_REQUEST)

            passed = output.get("stdout", "").strip() == test.get('output', '').strip()
            results.append({
                "passed": passed,
                "input": test.get('input', ''),
                "expected_output": test.get('output', ''),
                "actual_output": output.get("stdout", "").strip()
            })

            if not passed:
                break  # Stop on first failed test case

        return results

    @transaction.atomic
    def update_answer_and_attempt(self, attempt, current_question, run_code, question_score):
        answer, created = Answer.objects.update_or_create(
            attempt_id=attempt,
            question_id=current_question,
            defaults={
                'code': run_code,
                'score': question_score
            }
        )

        # Update the attempt's total score
        attempt_answers = Answer.objects.filter(attempt_id=attempt)
        attempt.score = sum(a.score or 0 for a in attempt_answers)
        attempt.save()