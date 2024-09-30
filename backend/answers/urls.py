from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import EvaluateCode

from answers import views

router = DefaultRouter()
router.register('answers', views.AnswerViewSet)
urlpatterns = [
    path('', include(router.urls)),
    path('evaluate-code/', EvaluateCode.as_view(), name='evaluate_code')
]
