from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter
from questionbank.models import QuestionBank
from questionbank.serializers import QuestionBankSerializer


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
