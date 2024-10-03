from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .tasks import execute_code_async
from .serializers import ExecuteCodeSerializer  
from celery.result import AsyncResult


class TaskViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'])
    def execute_code(self, request, *args, **kwargs):
        serializer = ExecuteCodeSerializer(data=request.data)
        if serializer.is_valid():
            language = request.data.get('language')
            code = request.data.get('code')
            version = request.data.get('version')
            stdin = request.data.get('stdin', '')

            # Async call to the celery task
            task = execute_code_async.delay(language, code, version, stdin)

            return Response({
                "task_id": task.id,
                "message": "Code execution task sent to queue. Use get_task_result to retrieve the result."
            }, status=status.HTTP_202_ACCEPTED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    @action(detail=False, methods=['get'])
    def get_task_result(self, request):
        task_id = request.query_params.get('task_id')
        if not task_id:
            return Response({"error": "Task ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        result = AsyncResult(task_id)
        
        # Handle task states: PENDING, FAILURE, SUCCESS
        if result.state == 'PENDING':
            return Response({"status": "Pending"})
        elif result.state == 'FAILURE':
            return Response({"status": "Failure", "reason": str(result.result)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        elif result.state == 'SUCCESS':
            return Response({"status": "Success", "result": result.result})
        else:
            return Response({"status": result.state})
