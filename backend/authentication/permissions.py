from rest_framework.permissions import BasePermission


class IsInstructor(BasePermission):
    def has_permission(self, request, view):
        pass


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        pass


class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
