from django.shortcuts import render
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import PasswordResetRequestSerializer,PasswordResetConfirmSerializer, UserLoginSerializer, UserRegistrationSerializer,CustomUserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.conf import settings

CustomUser = get_user_model()





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
            serializer.is_valid(raise_exception=True)
            user = serializer.save()  # Save the new user
            
            ## creating email verification  link! 
            token_generator = PasswordResetTokenGenerator()
            token = token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            # Construct the email verification link
            verification_url = f"{settings.FRONTEND_URL}/api/v1/auth/verify-email/{uid}/{token}/"
            subject = 'Email Verification'
            message = f'Hello {user.username},\n\nclick the link below to verifiy your email:\n{verification_url}\n\nThank you!'
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
            
            # Generate JWT tokens
            token = RefreshToken.for_user(user)
            data = serializer.data
            data["tokens"] = {
                "refresh": str(token),
                "access": str(token.access_token)
            }

            return Response(data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            # Extract only the string part of the error details
            error_messages = []
            for field, errors in serializer.errors.items():
                for error in errors:
                    error_messages.append(str(error))  # Convert ErrorDetail to string

            return Response({
                "message": error_messages  # Return only the string parts of the errors
            }, status=status.HTTP_400_BAD_REQUEST)

## email verification view 
class EmailVerificationView(GenericAPIView):
    permission_classes = (AllowAny,)

    def get(self, request, uidb64, token, *args, **kwargs):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            user.is_verified = True  
            user.save()
            return Response({'message': 'Email verified successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid link or token'}, status=status.HTTP_400_BAD_REQUEST)


###
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
        
        if not user.is_verified:
            return Response({'error': 'Email is  not verified. Please verify your email '}, status=status.HTTP_400_BAD_REQUEST)

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



class PasswordResetRequestView(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetRequestSerializer

    def post(self, request):
        print("hello world")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        user = CustomUser.objects.filter(email=email).first()
        if user:
            token_generator = PasswordResetTokenGenerator()
            token = token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_url = f"{settings.FRONTEND_URL}/api/v1/auth/reset-password/{uid}/{token}/"
            subject = 'Password Reset Request'
            message = f'Hello {user.username},\n\nTo reset your password, click the link below:\n{reset_url}\n\nThank you!'
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])

        return Response({'message': ' password reset link has been sent.'}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = CustomUser.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            new_password = serializer.validated_data['new_password']
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid link or token'}, status=status.HTTP_400_BAD_REQUEST)