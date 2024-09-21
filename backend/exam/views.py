from datetime import timezone
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import QuestionSerializer , ExamSerializer

from rest_framework import generics, permissions, status
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.response import Response
from django.utils import timezone
from .models import Exam, Question
from rest_framework.pagination import PageNumberPagination
import logging

logger = logging.getLogger(__name__)

class ExamQuestionsView(generics.GenericAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, exam_code):
        try:
            # Fetch exam and related questions efficiently
            exam = Exam.objects.select_related('examiner_id').get(exam_code=exam_code)

            # Check if the exam is expired
            if exam.expiration_date < timezone.now():
                logger.warning(f"User {request.user.id} tried to access an expired exam {exam_code}.")
                raise PermissionDenied("This exam has expired.")
            
            # Optional: Add a permission check (e.g., for examiners or whitelisted students)
            if request.user != exam.examiner_id and request.user.email not in exam.whitelist:
                logger.warning(f"User {request.user.id} attempted unauthorized access to exam {exam_code}.")
                raise PermissionDenied("You are not authorized to view this exam.")
            
            questions = Question.objects.filter(exam_id=exam)
            paginator = PageNumberPagination()
            paginated_questions = paginator.paginate_queryset(questions, request)

            serializer = self.get_serializer(paginated_questions, many=True)

            # Return paginated questions with metadata
            return paginator.get_paginated_response(serializer.data)

        except Exam.DoesNotExist:
            logger.error(f"Exam {exam_code} not found for user {request.user.id}.")
            raise NotFound("Exam not found.")
        except Exception as e:
            logger.exception(f"An unexpected error occurred: {str(e)}")
            return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ExamQuestionsView(generics.GenericAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

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

    def post(self, request):
        # Extract the authenticated examiner (examiner_id)
        examiner = request.user
        request.data['examiner_id'] = examiner.id
        
        serializer = ExamSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class ListExamsView(generics.ListAPIView):
    serializer_class = ExamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Exam.objects.filter(examiner_id=self.request.user)
    
class DeleteExamView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, exam_code):
        try:
            exam = Exam.objects.get(exam_code=exam_code)
            if exam.examiner_id != request.user:
                raise PermissionDenied("You are not authorized to delete this exam.")
            
            logger.info(f"User {request.user.id} is deleting exam {exam_code}.")
            exam.delete()

            return Response({"message": "Exam and related questions successfully deleted."}, status=status.HTTP_204_NO_CONTENT)

        except Exam.DoesNotExist:
            logger.error(f"User {request.user.id} attempted to delete non-existing exam {exam_code}.")
            raise NotFound("Exam not found.")

        except Exception as e:
            logger.exception(f"An unexpected error occurred while deleting exam {exam_code}: {str(e)}")
            return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)