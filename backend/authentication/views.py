from django.shortcuts import render
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenRefreshView


class UserRegistrationAPIView(GenericAPIView):
    ## access not restricedd
    permission_classes = (AllowAny,)
    ## specifies which serliazer will be used with this vieww
    serializer_class = UserRegistrationSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = RefreshToken.for_user(user)
        data = serializer.data
        data["tokens"] = {"refresh":str(token),
        "access": str(token.access_token)}
        return Response(data, status= status.HTTP_201_CREATED)


class UserLoginAPIView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        
        token = RefreshToken.for_user(user)
        access_token = str(token.access_token)
        refresh_token = str(token)
        
        response = Response(status=status.HTTP_200_OK)
        # Set secure, HttpOnly cookies
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,  # JavaScript can't access this cookie
            secure=True,  # Only send via HTTPS
             
        )
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite='Lax'
        )
        
        response.data = {
            "message": "Login successful",
            "user": CustomUserSerializer(user).data,
            "access_token": access_token,
        }
        
        return response
    
class UserLogoutAPIView(GenericAPIView):
    permission_classes = (IsAuthenticated,)
    
    def post(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_205_RESET_CONTENT)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response

class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = (AllowAny,)