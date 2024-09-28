from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import TaskViewSet

router = DefaultRouter()
router.register("tasks", TaskViewSet , basename="task")

from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="Code Execution App API",
        default_version='v1',
        description="API for managing code execution",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    # permission_classes=(permissions.IsAuthenticated,),
)

urlpatterns = [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path("", include(router.urls)),
]