from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from .tasks import send

class TaskViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def send_celery_task(self,request):
        # call celery task
        send.delay()
        return Response({"message": "Task sent successfully."})
