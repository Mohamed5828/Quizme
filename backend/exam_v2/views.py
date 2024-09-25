from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from exam.models import Exam, Question
from exam_v2.serializers import ExamSerializer2
import fnmatch
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from authentication.permissions import AUTH_SWAGGER_PARAM
from datetime import timedelta


class ExamViewSet(ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer2
    permission_classes = [IsAuthenticated]
    lookup_field = 'exam_code'

    def get_queryset(self):
        return Exam.objects.filter(user_id=self.request.user)

    def get_object(self):
        exam_code = self.kwargs.get('exam_code')
        try:
            return Exam.objects.get(exam_code=exam_code)
        except Exam.DoesNotExist:
            raise NotFound("Exam not found.")

    @swagger_auto_schema(
        operation_summary="Retrieve an exam",
        operation_description="Fetches an exam by its unique code. Requires authentication. allowed for exam owner or whitelisted users",
        manual_parameters=[
            openapi.Parameter('exam_code', openapi.IN_PATH, description="The unique code of the exam",
                              type=openapi.TYPE_STRING),
            AUTH_SWAGGER_PARAM
        ],
        responses={200: ExamSerializer2, 404: "Exam not found", 403: "Forbidden"}
    )
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Check if the user is the owner of the exam
        if instance.user_id == request.user.id:
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        # Check if the user is in the whitelist
        whitelist = instance.whitelist
        for pattern in whitelist:
            if fnmatch.fnmatch(request.user.email, pattern):
                serializer = self.get_serializer(instance)
                return Response(serializer.data)
        # If the user is not the owner or in the whitelist, return a 403 error
        raise PermissionDenied("You are not authorized to view this exam.")

    @swagger_auto_schema(
        operation_summary="List exams",
        operation_description="Fetches all exams created by the authenticated user. Requires authentication.",
        manual_parameters=[
            openapi.Parameter('exam_code', openapi.IN_PATH, description="The unique code of the exam",
                              type=openapi.TYPE_STRING),
            AUTH_SWAGGER_PARAM
        ],
        responses={200: ExamSerializer2, 404: "Exam not found"}
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Create an exam",
        operation_description="Allows authenticated users to create an exam. Requires authentication.",
        request_body=ExamSerializer2,
        responses={201: ExamSerializer2, 400: "Bad Request"},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def create(self, request, *args, **kwargs):
        request.data['duration'] = timedelta(minutes=int(request.data['duration']))
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Update an exam",
        operation_description="Allows authenticated users to update an exam. Requires authentication.",
        request_body=ExamSerializer2,
        responses={200: ExamSerializer2, 400: "Bad Request"},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def update(self, request, *args, **kwargs):
        request.data['duration'] = timedelta(minutes=int(request.data['duration']))
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Partially update an exam",
        operation_description="Allows authenticated users to partially update an exam. Requires authentication.",
        request_body=ExamSerializer2,
        responses={200: ExamSerializer2, 400: "Bad Request"},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def partial_update(self, request, *args, **kwargs):
        if request.data.get('duration'):
            request.data['duration'] = timedelta(minutes=int(request.data['duration']))
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Delete an exam",
        operation_description="Allows authenticated users to delete an exam. Requires authentication.",
        responses={204: "No Content"},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user)

# class QuestionViewSet2(ReadOnlyModelViewSet):
#     queryset = Question.objects.all()
#     serializer_class = QuestionSerializer2
#
#     def get_queryset(self):
#         return Question.objects.filter(exam_id=self.kwargs.get('exam_code'))
#
#
