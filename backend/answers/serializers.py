from rest_framework.serializers import ModelSerializer
from code_executor.serializers import CodeValidationMixin

from answers.models import Answer


class AnswerSerializer(CodeValidationMixin, ModelSerializer):
    class Meta:
        model = Answer
        # fields = '__all__'
        exclude = ['attempt_id']
