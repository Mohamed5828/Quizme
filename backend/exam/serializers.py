
from rest_framework import serializers

from .models import Exam, Question, UserAnswer

class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['duration', 'exam_code', 'expiration_date', 'whitelist']

    # def create(self, validated_data):
    #     validated_data['examiner_id'] = self.context['request'].user
    #     return super().create(validated_data)

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class UserAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAnswer
        fields = '__all__'
