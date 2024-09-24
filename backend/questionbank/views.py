from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter
from questionbank.models import QuestionBank
from questionbank.serializers import QuestionBankSerializer

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class QuestionBankViewSet(ModelViewSet):
    model = QuestionBank
    serializer_class = QuestionBankSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ['desc', 'type']
    filterset_fields = ['type', 'difficulty']


    def get_queryset(self):
        user = self.request.user
        return QuestionBank.objects.filter(user=user)

    @action(detail=True, methods=['post'])
    def delete(self, request, pk=None):
        question = self.get_object()
        question.delete()
        return Response({"message": "Question deleted successfully"}, status=status.HTTP_200_OK)