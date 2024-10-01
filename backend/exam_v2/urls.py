from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ExamDurationView, ExamViewSet

router = DefaultRouter()
router.register("", ExamViewSet)
router.register(r'exam-durations', ExamDurationView, basename='exam-duration')

urlpatterns = [
    path("", include(router.urls)),
]
