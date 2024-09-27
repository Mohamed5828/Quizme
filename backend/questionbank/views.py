from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter
from questionbank.models import QuestionBank
from questionbank.serializers import QuestionBankSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.mixins import ListModelMixin

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from authentication.permissions import AUTH_SWAGGER_PARAM
from authentication.permissions import IsInstructor, isOwner


class QuestionBankViewSet(ModelViewSet):
    """
    Endpoint for managing questions inside question bank of the user.
    """
    model = QuestionBank
    serializer_class = QuestionBankSerializer
    permission_classes = [IsAuthenticated , IsInstructor, isOwner]
    filter_backends = [SearchFilter]
    search_fields = ['desc', 'type']
    filterset_fields = ['type', 'difficulty']

    def get_queryset(self):
        user = self.request.user
        return QuestionBank.objects.filter(user_id=user.id)

    @swagger_auto_schema(
        tags=['question banks'],
        operation_description="Creates a new question inside question bank of the user. Requires authentication.",
        request_body=QuestionBankSerializer,
        responses={201: QuestionBankSerializer()},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['question banks'],
        operation_description="Deletes a question inside question bank of the user. Requires authentication.",
        responses={204: "No Content"},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['question banks'],
        operation_description="Updates a question inside question bank of the user. Requires authentication.",
        request_body=QuestionBankSerializer,
        responses={200: QuestionBankSerializer()},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['question banks'],
        operation_description="Lists questions from question bank of the user. Requires authentication.",
        responses={200: QuestionBankSerializer(many=True)},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['question banks'],
        operation_description="Retrieves question from question bank of the user. Requires authentication.",
        responses={200: QuestionBankSerializer()},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=['question banks'],
        operation_description="Partially updates a question inside question bank of the user. Requires authentication.",
        request_body=QuestionBankSerializer,
        responses={200: QuestionBankSerializer()},
        manual_parameters=[AUTH_SWAGGER_PARAM]
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    # @action(detail=True, methods=['post'])
    # def delete(self, request, pk=None):
    #     question = self.get_object()
    #     question.delete()
    #     return Response({"message": "Question deleted successfully"}, status=status.HTTP_200_OK)
