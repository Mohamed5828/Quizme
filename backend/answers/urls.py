from django.urls import include, path
from rest_framework.routers import DefaultRouter

from answers import views

router = DefaultRouter()
router.register('answers', views.AnswerViewSet)
urlpatterns = [
    path('', include(router.urls)),
]
