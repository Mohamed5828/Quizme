from django.urls import include, path
from rest_framework.routers import DefaultRouter
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

from .views import EvaluateCode, AnswerViewSet

router = DefaultRouter()
router.register('answers', AnswerViewSet)

schema_view = get_schema_view(
    openapi.Info(
        title="Answers API",
        default_version='v1',
        description="API for managing answers and code evaluation",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('', include(router.urls)),
    path('answers/evaluate-code', EvaluateCode.as_view(), name='evaluate_code'),
    
    # Swagger documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]