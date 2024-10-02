from code_executor.tasks import evaluate_test_cases, update_answer_and_attempt
from celery.result import AsyncResult

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from answers.models import Answer
from answers.serializers import AnswerSerializer
from authentication.permissions import AUTH_SWAGGER_PARAM
from exam.models import Question, Exam
from authentication.models import CustomUser
from attempts.models import Attempt
from celery import chain


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

        # Validate input data
        if not all([run_code, language, version, question_id, exam_code, student_id]):
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if objects exist
        try:
            question = Question.objects.get(id=question_id)
            exam = Exam.objects.get(exam_code=exam_code)
            student = CustomUser.objects.get(id=student_id)
        except (Question.DoesNotExist, Exam.DoesNotExist, CustomUser.DoesNotExist) as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

        # Get or create attempt
        attempt, _ = Attempt.objects.get_or_create(student_id=student, exam_id=exam)

        # Chain Celery tasks
        task_chain = chain(
            evaluate_test_cases.s(language, run_code, question.test_cases, version),
            update_answer_and_attempt.s(attempt.id, question_id, run_code)
        )
        result = task_chain.apply_async()

        return Response({"task_id": result.id}, status=status.HTTP_202_ACCEPTED)
    def get(self, request, *args, **kwargs):
        task_id = request.query_params.get('task_id')
        if not task_id:
            return Response({"error": "Task ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        result = AsyncResult(task_id)
        
        if result.ready():
            if result.successful():
                task_result = result.result
                if "error" in task_result:
                    return Response({
                        "status": "Error",
                        "error_type": task_result["error"],
                        "details": task_result.get("details"),
                        "test_case": task_result.get("test_case")
                    }, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({"status": "Success", "result": task_result})
            else:
                return Response({"status": "Failure", "reason": str(result.result)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"status": result.state})