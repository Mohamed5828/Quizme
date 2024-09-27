from rest_framework.permissions import BasePermission
from drf_yasg import openapi

AUTH_SWAGGER_PARAM = openapi.Parameter('Authorization', openapi.IN_HEADER, description="Authorization token",
                                       type=openapi.TYPE_STRING, required=True)


class isWhitelisted(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_whitelisted

class isOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user_id == request.user.id


class IsInstructor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_instructor


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and not request.user.is_instructor
        


class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
