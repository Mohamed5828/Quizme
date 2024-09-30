from django.shortcuts import render
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenRefreshView

from rest_framework import viewsets
from .models import CustomUser

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CustomUserSerializer

    def get_queryset(self):
        category = self.request.query_params.get('category', None)
        return CustomUser.objects.filter(category=category)
    
class UserRegistrationAPIView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

    @swagger_auto_schema(
        tags=["authentication"],
        operation_description="Register a new user",
        responses={201: UserRegistrationSerializer(many=False)}
    )
    # def post(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     print(request.data)
    #     serializer.is_valid(raise_exception=True)
    #     user = serializer.save()
    #     token = RefreshToken.for_user(user)
    #     data = serializer.data

    #     data["tokens"] = {"refresh": str(token),
    #                       "access": str(token.access_token)}
    #     return Response(data, status=status.HTTP_201_CREATED)
    
    def post(self, request, *args, **kwargs):
        # Print the incoming request data for debugging
        print("Request Data:", request.data)

        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)  # This will raise an exception if validation fails
            user = serializer.save()  # Save the new user

            # Generate JWT tokens
            token = RefreshToken.for_user(user)
            data = serializer.data
            data["tokens"] = {
                "refresh": str(token),
                "access": str(token.access_token)
            }

            return Response(data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            print("Validation Error:", str(e))  # Print the error for debugging
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginAPIView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer

    @swagger_auto_schema(
        tags=["authentication"],
        operation_description="Login a user",
        responses={200: CustomUserSerializer(many=False)}
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        token = RefreshToken.for_user(user)

        access_token = str(token.access_token)
        refresh_token = str(token)

        response = Response(status=status.HTTP_200_OK)
        response.set_cookie(
            key='accessToken',
            value=access_token,
            httponly=True,
            secure=True,
            samesite='none'
        )
        response.set_cookie(
            key='refreshToken',
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite='none'
        )

        response.data = {
            "message": "Login successful",
            "user": CustomUserSerializer(user).data,
            "access_token": access_token,
            "refresh_token": refresh_token,
        }

        return response


class UserLogoutAPIView(GenericAPIView):
    permission_classes = (IsAuthenticated,)

    @swagger_auto_schema(
        tags=["authentication"],
        operation_description="Logout a user",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['refresh'],
            properties={
                'refresh': openapi.Schema(type=openapi.TYPE_STRING)
            }
        ),
        responses={205: "Successfully logged out"}
    )
    def post(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_205_RESET_CONTENT)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')

        return response


class UserInfoAPIView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomUserSerializer

    @swagger_auto_schema(
        tags=["authentication"],
        operation_description="Get user information",
        responses={200: CustomUserSerializer(many=False)}
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_object(self):
        return self.request.user


class CustomTokenRefreshView(TokenRefreshView):
    @swagger_auto_schema(
        tags=["authentication"],
        operation_description="Refresh access token",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['refresh'],
            properties={
                'refresh': openapi.Schema(type=openapi.TYPE_STRING)
            }
        ),
        responses={
            200: openapi.Response(
                description="Successful token refresh",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'access': openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            )
        }
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


