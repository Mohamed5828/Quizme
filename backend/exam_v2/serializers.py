from rest_framework import serializers
from exam.models import Exam, Question
from django.db import transaction
from code_executor.serializers import CodeValidationMixin


class QuestionSerializer2(CodeValidationMixin, serializers.ModelSerializer):
    class Meta:
        model = Question
        exclude = ['exam_id']


class ExamSerializer2(serializers.ModelSerializer):
    questions = QuestionSerializer2(many=True)
    participants = serializers.ListField(write_only=True)

    class Meta:
        model = Exam
        fields = ['exam_code', 'duration', 'max_grade', 'start_date', 'expiration_date', 'questions', 'participants']
        # add ,'title','group_name' according to khaled but still need fix

    def create(self, validated_data):
        # Extract questions and participants (whitelist)
        questions_list = validated_data.pop('questions')
        participants = validated_data.pop('participants', [])

        # Create and save the exam
        exam = Exam.objects.create(**validated_data, whitelist=participants)

        # Save the questions
        Question.objects.bulk_create([Question(**question, exam_id=exam) for question in questions_list])

        return exam

    def update(self, instance, validated_data):
        # Extract questions and participants (whitelist)
        questions_list = validated_data.pop('questions')
        participants = validated_data.pop('participants', [])

        with transaction.atomic():
            # Delete all related questions
            Question.objects.filter(exam_id=instance.id).delete()

            # Save new questions
            Question.objects.bulk_create([Question(**question, exam_id=instance) for question in questions_list])

        # Update exam instance
        instance.whitelist = participants
        return super().update(instance, validated_data)

    def validate(self, attrs):
        start_date = attrs.get('start_date')
        expiration_date = attrs.get('expiration_date')

        if start_date and expiration_date and start_date > expiration_date:
            raise serializers.ValidationError("Start date must be before expiration date.")

        return super().validate(attrs)


class ExamDurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['duration']
