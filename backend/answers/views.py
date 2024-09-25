from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from answers.models import Answer
from answers.serializers import AnswerSerializer
from authentication.permissions import AUTH_SWAGGER_PARAM


class AnswerViewSet(ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Create an answer",
        request_body=AnswerSerializer,
        responses={201: AnswerSerializer},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="List answers",
        responses={200: AnswerSerializer(many=True)},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Retrieve an answer",
        responses={200: AnswerSerializer},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Update an answer",
        request_body=AnswerSerializer,
        responses={200: AnswerSerializer},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Partially update an answer",
        request_body=AnswerSerializer,
        responses={200: AnswerSerializer},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
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
