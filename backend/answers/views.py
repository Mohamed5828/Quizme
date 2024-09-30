from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from answers.models import Answer
from answers.serializers import AnswerSerializer
from authentication.permissions import AUTH_SWAGGER_PARAM
from rest_framework import status
from django.db import transaction
from exam.models import Question, Exam
from authentication.models import CustomUser
from code_executor.views import TaskViewSet


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
    # ! Unused for now
    def post(self, request, *args, **kwargs):
        answer_id = kwargs.get('answer_id')
        # TODO: Implement evaluation logic within celery tasks
        return Response()

class EvaluateCode(APIView):
    def post(self, request, *args, **kwargs):
        run_code = request.data.get("code")
        language = request.data.get("language")
        question_id = request.data.get("question_id")
        exam_id = request.data.get("exam_id")
        student_id = request.data.get("student_id")

        try:
            current_question = Question.objects.get(id=question_id)
            exam = Exam.objects.get(id=exam_id)
            student = CustomUser.objects.get(id=student_id)
        except (Question.DoesNotExist, Exam.DoesNotExist, CustomUser.DoesNotExist):
            return Response({"error": "Question, Exam, or Student not found"}, status=status.HTTP_404_NOT_FOUND)

        test_cases = current_question.test_cases

        all_passed = True
        results = []

        for test in test_cases:
            celery_task = TaskViewSet.execute_code(None, language=language, code=run_code, stdin=test.get('input', ''))
            output = celery_task.get("output", {})

            if output.get("stderr"):
                return Response({
                    "error": "Code execution error",
                    "details": output["stderr"]
                }, status=status.HTTP_400_BAD_REQUEST)

            passed = output.get("stdout", "").strip() == test.get('output', '').strip()
            all_passed = all_passed and passed

            results.append({
                "passed": passed,
                "input": test.get('input', ''),
                "expected_output": test.get('output', ''),
                "actual_output": output.get("stdout", "").strip()
            })

            if not passed:
                break  # Stop on first failed test case

        question_score = current_question.grade if all_passed else 0

        with transaction.atomic():
            answer, created = Answer.objects.update_or_create(
                attempt_id__student_id=student,
                attempt_id__exam_id=exam,
                question_id=current_question,
                defaults={
                    'code': run_code,
                    'score': question_score
                }
            )

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