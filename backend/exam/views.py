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


class ExamQuestionsView(generics.GenericAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
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
        serializer = ExamSerializer(data=request.data, context={'request': request})
        
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
            
            exam.delete()

            return Response({"message": "Exam and related questions successfully deleted."}, status=status.HTTP_204_NO_CONTENT)

        except Exam.DoesNotExist:
            raise NotFound("Exam not found.")

        except Exception as e:
            return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class UpdateExamQuestionView(APIView):
    permission_classes = [IsAuthenticated]

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