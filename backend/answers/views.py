from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, APIView

from answers.models import Answer
from answers.serializers import AnswerSerializer


class AnswerViewSet(ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer


class EvaluateAnswerView(APIView):
    def post(self, request, format=None):
        answer_id = request.data.get("answer_id")
        # TODO: Implement evaluation logic within celery tasks
        return Response()
