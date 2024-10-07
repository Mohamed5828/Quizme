from django.db import transaction
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, views, status
from rest_framework.request import Request
from rest_framework.response import Response

from monitor.utils import evaluate_frame
from authentication.permissions import IsStudent, IsInstructor, AUTH_SWAGGER_PARAM
from monitor.serializers import CamFrameLogSerializer
from monitor.models import CamFrameLog


class CamFrameLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CamFrameLog.objects.all()
    serializer_class = CamFrameLogSerializer
    model = CamFrameLog
    permission_classes = [IsInstructor]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return CamFrameLog.objects.none()

        attempt_id = self.request.query_params.get('attempt_id')
        student_id = self.request.query_params.get('student_id')
        exam_id = self.request.query_params.get('exam_id')
        filter_kwargs = {
            'attempt__exam_id__user_id': self.request.user,
        }
        if attempt_id:
            filter_kwargs['attempt'] = attempt_id
        if student_id:
            filter_kwargs['attempt__student_id'] = student_id
        if exam_id:
            filter_kwargs['attempt__exam_id'] = exam_id

        return CamFrameLog.objects.filter(**filter_kwargs)

    @swagger_auto_schema(
        tags=["monitor"],
        operation_description="Get monitor frame",
        responses={200: CamFrameLogSerializer(many=True)},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def list(self, request, *args, **kwargs):
        exam_id = self.request.query_params.get('exam_id')
        attempt_id = self.request.query_params.get('attempt_id')
        student_id = self.request.query_params.get('student_id')
        queryset = self.get_queryset()
        if attempt_id:
            queryset = queryset.filter(attempt_id=attempt_id)
        if exam_id:
            queryset = queryset.filter(attempt__exam_id=exam_id)
        if student_id:
            queryset = queryset.filter(attempt__student_id=student_id)
        self.queryset = queryset
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=["monitor"],
        operation_description="Get monitor frame",
        responses={200: CamFrameLogSerializer(many=False)}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


class MonitorFrame(views.APIView):
    # permission_classes = [IsStudent,IsInstructor]

    @swagger_auto_schema(
        tags=["monitor"],
        request_body=CamFrameLogSerializer,
        operation_description="Get monitor frame",
        responses={200: "OK"}
    )
    def post(self, request: Request, *args, **kwargs):
        blob = request.body
        attempt_id = self.request.query_params.get("attempt_id")
        serializer = CamFrameLogSerializer(data={"attempt": attempt_id})
        serializer.is_valid(raise_exception=True)
        cam_log = serializer.save()
        transaction.on_commit(lambda: evaluate_frame.delay(blob, cam_log.id))
        return Response('Ok')
