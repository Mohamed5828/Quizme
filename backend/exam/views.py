from datetime import timezone
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated,AllowAny

from .producer import publish
from .serializers import QuestionSerializer , ExamSerializer

from rest_framework import generics, permissions, status
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.response import Response
from django.utils import timezone
from .models import Exam, Question
from rest_framework.pagination import PageNumberPagination
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from django.http import JsonResponse


class ExamQuestionsView(generics.GenericAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(
        operation_summary="Retrieve questions for an exam",
        operation_description="Fetches a list of questions for a given exam. Requires authentication.",
        manual_parameters=[
            openapi.Parameter('exam_code', openapi.IN_PATH, description="The unique code of the exam", type=openapi.TYPE_STRING)
        ],
        responses={200: QuestionSerializer(many=True), 404: "Exam not found", 403: "Forbidden", 500: "Unexpected error"}
    )
    
    def get(self, request, exam_code):
        try:
            exam = Exam.objects.select_related('examiner_id').get(exam_code=exam_code)

            if exam.expiration_date < timezone.now():
                raise PermissionDenied("This exam has expired.")
            
            if request.user != exam.examiner_id and request.user.email not in exam.whitelist:
                raise PermissionDenied("You are not authorized to view this exam.")
            
            questions = Question.objects.filter(exam_id=exam)
            paginator = PageNumberPagination()
            paginated_questions = paginator.paginate_queryset(questions, request)

            serializer = self.get_serializer(paginated_questions, many=True)

            return paginator.get_paginated_response(serializer.data)

        except Exam.DoesNotExist:
            raise NotFound("Exam not found.")
        except Exception as e:
            return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ExamQuestionsView(generics.GenericAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, exam_code):
        try:
            exam = Exam.objects.get(exam_code=exam_code)

            if exam.expiration_date < timezone.now():
                raise PermissionDenied("This exam has expired.")

            questions = Question.objects.filter(exam_id=exam)

            serializer = self.get_serializer(questions, many=True)
            return Response(serializer.data)

        except Exam.DoesNotExist:
            raise NotFound("Exam not found.")
        

class CreateExamView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Create a new exam",
        operation_description="Allows authenticated users to create an exam. Requires authentication.",
        request_body=ExamSerializer,
        responses={201: ExamSerializer, 400: "Bad Request"}
    )
    
    def post(self, request):
        # Extract the authenticated examiner (examiner_id)
        serializer = ExamSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)        

class ListExamsView(generics.ListAPIView):
    serializer_class = ExamSerializer
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="List all exams for the authenticated user",
        operation_description="Returns a list of all exams created by the authenticated user.",
        responses={200: ExamSerializer(many=True)}
    )
    
    def get_queryset(self):
        return Exam.objects.filter(examiner_id=self.request.user)
    
class DeleteExamView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Delete an exam",
        operation_description="Allows the owner of an exam to delete it. Requires authentication.",
        manual_parameters=[
            openapi.Parameter('exam_code', openapi.IN_PATH, description="The unique code of the exam", type=openapi.TYPE_STRING)
        ],
        responses={204: "Exam successfully deleted", 403: "Forbidden", 404: "Exam not found"}
    )
    
    def delete(self, request, exam_code):
        try:
            exam = Exam.objects.get(exam_code=exam_code)
            if exam.examiner_id != request.user:
                raise PermissionDenied("You are not authorized to delete this exam.")
            
            exam.delete()

            return Response({"message": "Exam and related questions successfully deleted."}, status=status.HTTP_204_NO_CONTENT)

        except Exam.DoesNotExist:
            raise NotFound("Exam not found.")

        except Exception as e:
            return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class UpdateExamQuestionView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Update a question in an exam",
        operation_description="Allows the owner of an exam to update a specific question.",
        request_body=QuestionSerializer,
        manual_parameters=[
            openapi.Parameter('exam_code', openapi.IN_PATH, description="The unique code of the exam", type=openapi.TYPE_STRING),
            openapi.Parameter('question_id', openapi.IN_PATH, description="The ID of the question to update", type=openapi.TYPE_INTEGER)
        ],
        responses={200: QuestionSerializer, 404: "Question or Exam not found", 403: "Forbidden"}
    )
    
    def put(self, request, exam_code, question_id):
        try:
            exam = Exam.objects.get(exam_code=exam_code)

            if request.user != exam.examiner_id:
                raise PermissionDenied("You are not authorized to update this exam.")
            
            try:
                question = Question.objects.get(question_id=question_id, exam_id=exam)
            except Question.DoesNotExist:
                return Response({"error": f"Question with ID {question_id} not found."}, status=status.HTTP_404_NOT_FOUND)

            serializer = QuestionSerializer(question, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exam.DoesNotExist:
            raise NotFound("Exam not found.")
        except Exception as e:
            return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        


class CodeExecutionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            body = request.data
            language = body.get("language")
            code = body.get("code")
            stdin = body.get("stdin", "")

            if not language or not code:
                return JsonResponse({"error": "Missing 'language' or 'code' in request body"}, status=400)

            message = {
                "language": language,
                "code": code,
                "stdin": stdin
            }
            
            publish(message)

            return JsonResponse({"status": "Code execution request submitted successfully"}, status=200)

        except Exception as e:
            print(f"Error: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)

    def get(self, request):
        return JsonResponse({"error": "Invalid request method"}, status=400)