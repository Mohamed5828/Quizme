from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets

from attempts.models import Attempt
from attempts.serializers import AttemptSerializer
from authentication.permissions import AUTH_SWAGGER_PARAM


# TODO Can make this follow the same convention as exam v2 (make the answers coupled to the attempt)
class AttemptViewSet(viewsets.ModelViewSet):
    serializer_class = AttemptSerializer
    queryset = Attempt.objects.all()

    @swagger_auto_schema(
        operation_summary="Create an attempt",
        operation_description="Allows authenticated users to create an attempt. Requires authentication.",
        request_body=AttemptSerializer,
        responses={201: AttemptSerializer, 400: "Bad Request"},
        manual_parameters=[AUTH_SWAGGER_PARAM],
        tags=['attempts']
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Update an attempt",
        operation_description="Allows authenticated users to update an attempt. Requires authentication.",
        request_body=AttemptSerializer,
        responses={200: AttemptSerializer, 400: "Bad Request"},
        manual_parameters=[AUTH_SWAGGER_PARAM],
        tags=['attempts']
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Delete an attempt",
        operation_description="Allows authenticated users to delete an attempt. Requires authentication.",
        responses={204: "No Content"},
        manual_parameters=[AUTH_SWAGGER_PARAM],
        tags=['attempts']
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Retrieve an attempt",
        operation_description="Allows authenticated users to retrieve an attempt. Requires authentication.",
        responses={200: AttemptSerializer()},
        manual_parameters=[AUTH_SWAGGER_PARAM],
        tags=['attempts']
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Partially update an attempt",
        operation_description="Allows authenticated users to partially update an attempt. Requires authentication.",
        request_body=AttemptSerializer,
        responses={200: AttemptSerializer(), 400: "Bad Request"},
        manual_parameters=[AUTH_SWAGGER_PARAM],
        tags=['attempts']
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="List attempts",
        operation_description="Allows authenticated users to list attempts. Requires authentication.",
        responses={200: AttemptSerializer(many=True)},
        manual_parameters=[AUTH_SWAGGER_PARAM],
        tags=['attempts']
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
