from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ExamViewSet, UserViewSet

router = DefaultRouter()
router.register("", ExamViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
