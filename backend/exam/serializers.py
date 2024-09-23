
from rest_framework import serializers

from .models import Exam, Question, UserAnswer

class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['exam_id', 'examiner_id', 'duration', 'exam_code', 'created_at', 'expiration_date', 'whitelist']
        
    # here is to add the examiner_id before saving
    def create(self, validated_data):
        validated_data['examiner_id'] = self.context['request'].user
        return super().create(validated_data)


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class UserAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAnswer
        fields = '__all__'
        

class CodeExecutionSerializer(serializers.Serializer):
    language = serializers.CharField(required=True)
    code = serializers.CharField(required=True)
    stdin = serializers.CharField(required=False, default="")


