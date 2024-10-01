from django.urls import path
from rest_framework import routers
from monitor.views import MonitorFrame, CamFrameLogViewSet

router = routers.DefaultRouter()
router.register(r'cam-frames', CamFrameLogViewSet)

urlpatterns = [
                  path('monitor-frame', MonitorFrame.as_view()),
              ] + router.urls
