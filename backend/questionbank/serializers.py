from rest_framework.serializers import ModelSerializer

from code_executor.serializers import CodeValidationMixin
from questionbank.models import QuestionBank


class QuestionBankSerializer(CodeValidationMixin, ModelSerializer):
    class Meta:
        model = QuestionBank
        # fields = '__all__'
        exclude = ['user_id']
        read_only_fields = ['id']
