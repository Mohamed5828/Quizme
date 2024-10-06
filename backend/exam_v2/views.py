import fnmatch
from datetime import timedelta

from django.shortcuts import get_object_or_404
from django.utils import timezone
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.exceptions import NotFound, ParseError, PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework import status, mixins, viewsets

from authentication.permissions import AUTH_SWAGGER_PARAM
from authentication.permissions import IsInstructor, IsOwner
from exam.models import Exam
from exam_v2.serializers import ExamSerializer2
from exam_v2.serializers import ExamDurationSerializer


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

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated(), IsInstructor()]
        elif self.action in ['update', 'partial_update', 'destroy', 'list']:
            return [IsAuthenticated(), IsOwner()]
        return super().get_permissions()

    @swagger_auto_schema(
        tags=['exams', 'v2'],
        operation_summary="Retrieve an exam",
        operation_description="Fetches an exam by its unique code. Requires authentication. allowed for exam owner or whitelisted users",
        manual_parameters=[
            openapi.Parameter('exam_code', openapi.IN_PATH, description="The unique code of the exam",
                              type=openapi.TYPE_STRING),
            AUTH_SWAGGER_PARAM
        ],
        responses={200: ExamSerializer2, 404: "Exam not found", 403: "Forbidden"},
    )
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Check if the user is the owner of the exam
        if instance.user_id == request.user:
            serializer = self.get_serializer(instance)
            return Response(serializer.data)

        if instance.group_name:
            if request.user.category == instance.group_name:
                serializer = self.get_serializer(instance)
                return Response(serializer.data)

        current_time = timezone.now()
        start_time = instance.start_date
        expiration_time = instance.start_date + instance.duration

        # Check if the user is in the whitelist
        whitelist = instance.whitelist
        for pattern in whitelist:
            if fnmatch.fnmatch(request.user.email, pattern):
                if current_time < start_time:
                    raise PermissionDenied("The exam has not started yet. You cannot access it before the start time.")
                if timezone.now() > expiration_time:
                    raise PermissionDenied("You are not authorized to view this exam.")
                
                serializer = self.get_serializer(instance)
                # If the user is in the whitelist, return the exam and remove question answers
                for i, question in enumerate(serializer.data['questions']):
                    if choices := question.get('choices'):
                        serializer.data['questions'][i]['choices'] = [{"desc": choice['desc'], "isCorrect": "****"} for
                                                                      choice in choices]
                    # if test_cases := question.get('test_cases'):
                    #     serializer.data['questions'][i]['test_cases'] = [
                    #         {"input": None, "output": None} for
                    #         test_case in test_cases]

                return Response(serializer.data)
        # If the user is not the owner or in the whitelist, return a 403 error
        raise PermissionDenied("You are not authorized to view this exam.")

    @swagger_auto_schema(
        tags=['exams', 'v2'],
        operation_summary="List exams",
        operation_description="Fetches all exams created by the authenticated user. Requires authentication.",
        manual_parameters=[
            openapi.Parameter('exam_code', openapi.IN_PATH, description="The unique code of the exam",
                              type=openapi.TYPE_STRING),
            AUTH_SWAGGER_PARAM
        ],
        responses={200: ExamSerializer2(), 404: "Exam not found"},
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['exams', 'v2'],
        operation_summary="Create an exam",
        operation_description="Allows authenticated users to create an exam. Requires authentication.",
        request_body=ExamSerializer2,
        responses={201: ExamSerializer2(), 400: "Bad Request"},
        manual_parameters=[AUTH_SWAGGER_PARAM],
    )
    def create(self, request, *args, **kwargs):
        duration_minutes = int(request.data['duration'])
        request.data['duration'] = timedelta(minutes=duration_minutes)

        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['exams', 'v2'],
        operation_summary="Update an exam",
        operation_description="Allows authenticated users to update an exam. Requires authentication.",
        request_body=ExamSerializer2,
        responses={200: ExamSerializer2(), 400: "Bad Request"},
        manual_parameters=[AUTH_SWAGGER_PARAM],
    )
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.start_date and instance.start_date < timezone.now():
            raise ParseError("Cannot update an exam that has already started.")
        if request.data.get('duration') and str.isnumeric(str(request.data.get('duration'))):
            request.data['duration'] = timedelta(minutes=int(request.data['duration']))
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['exams', 'v2'],
        operation_summary="Partially update an exam",
        operation_description="Allows authenticated users to partially update an exam. Requires authentication.",
        request_body=ExamSerializer2,
        responses={200: ExamSerializer2(), 400: "Bad Request"},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['exams', 'v2'],
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
class ExamDurationView(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated, IsOwner | IsInstructor]
    serializer_class = ExamDurationSerializer
    lookup_field = 'exam_code'
    queryset = Exam.objects.all()

    @swagger_auto_schema(
        tags=['exams', 'v2'],
        operation_summary="Retrieve the duration and ID of an exam",
        operation_description="Fetches the duration and ID of an exam by its unique code. Requires authentication. Allowed for exam owner or whitelisted users.",
        manual_parameters=[
            openapi.Parameter('exam_code', openapi.IN_PATH,
                              description="The unique code of the exam",
                              type=openapi.TYPE_STRING),
            openapi.Parameter('Authorization', openapi.IN_HEADER,
                              description="Bearer token for authentication",
                              type=openapi.TYPE_STRING)
        ],
        responses={
            200: ExamDurationSerializer(many=False),
            404: "Exam not found",
            403: "Forbidden"
        },
    )
    def retrieve(self, request, exam_code=None, *args, **kwargs):
        exam = get_object_or_404(Exam, exam_code=exam_code)

        # Check if the user is the owner of the exam
        if exam.user_id == request.user:
            serializer = self.get_serializer(exam)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Check if the user is in the allowed group
        if exam.group_name and request.user.category == exam.group_name:
            serializer = self.get_serializer(exam)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Check if the user is in the whitelist
        whitelist = exam.whitelist
        for pattern in whitelist:
            if fnmatch.fnmatch(request.user.email, pattern):
                serializer = self.get_serializer(exam)
                return Response(serializer.data, status=status.HTTP_200_OK)

        # If the user is not authorized, return a 403 error
        raise PermissionDenied("You are not authorized to view this exam.")
