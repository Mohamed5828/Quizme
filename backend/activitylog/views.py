from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from drf_yasg import openapi
from rest_framework.request import Request
from rest_framework.response import Response

from activitylog.serializers import ActivityLogSerializer
from activitylog.models import ActivityLog

from authentication.permissions import IsInstructor, AUTH_SWAGGER_PARAM

from drf_yasg.utils import swagger_auto_schema


class ActivityLogViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    model = ActivityLog
    serializer_class = ActivityLogSerializer

    def get_queryset(self):
        if not self.request.user.is_authenticated or not self.request.user.is_instructor:
            return ActivityLog.objects.none()
        attempt_id = self.request.query_params.get('attempt_id')
        student_id = self.request.query_params.get('student_id')
        exam_id = self.request.query_params.get('exam_id')
        filter_kwargs = {
            'attempt_id__exam_id__user_id': self.request.user,
        }
        if attempt_id:
            filter_kwargs['attempt_id'] = attempt_id
        if student_id:
            filter_kwargs['attempt_id__student_id'] = student_id
        if exam_id:
            filter_kwargs['attempt_id__exam_id'] = exam_id
        return ActivityLog.objects.filter(**filter_kwargs)

    @swagger_auto_schema(
        tags=["activitylogs"],
        operation_description="Get activity logs",
        responses={200: ActivityLogSerializer(many=True)},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=["activitylogs"],
        operation_description="Get single activity log",
        responses={200: ActivityLogSerializer(many=False)},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=["activitylogs"],
        operation_description="Create an activity log",
        request_body=ActivityLogSerializer,
        responses={201: ActivityLogSerializer()},
        manual_parameters=[AUTH_SWAGGER_PARAM,
                           openapi.Parameter('bulk', openapi.IN_QUERY, type=openapi.TYPE_BOOLEAN, required=False)]
    )
    def create(self, request: Request, *args, **kwargs):
        if request.query_params.get('bulk'):
            return self.bulk_create(request, *args, **kwargs)
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=["activitylogs"],
        operation_description="Update an activity log",
        request_body=ActivityLogSerializer,
        responses={200: ActivityLogSerializer()},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=["activitylogs"],
        operation_description="Partially update an activity log",
        request_body=ActivityLogSerializer,
        responses={200: ActivityLogSerializer()},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=["activitylogs"],
        operation_description="Delete an activity log",
        responses={204: "No Content"},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    def bulk_create(self, request, *args, **kwargs):
        """
        Bulk create activity logs
        Same as create but with serializer
        """
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
