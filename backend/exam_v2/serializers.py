from rest_framework import serializers
from exam.models import Exam, Question
from django.db import transaction


class QuestionSerializer2(serializers.ModelSerializer):
    class Meta:
        model = Question
        exclude = ['exam_id']


class ExamSerializer2(serializers.ModelSerializer):
    questions = QuestionSerializer2(many=True)

    class Meta:
        model = Exam
        fields = ['id', 'duration', 'exam_code', 'created_at', 'expiration_date', 'whitelist', 'questions']
        # exclude = ['user_id']

    def create(self, validated_data):
        # remove questions from validated_data
        questions_list = validated_data.pop('questions')
        # create and save the exam
        exam = Exam.objects.create(**validated_data)
        # save the questions
        Question.objects.bulk_create([Question(**question, exam_id=exam.id) for question in questions_list])
        # return the exam
        return exam

    def update(self, instance, validated_data):
        # remove questions from validated_data
        questions_list = validated_data.pop('questions')
        with transaction.atomic():
            # delete all related questions
            Question.objects.filter(exam_id=instance.id).delete()
            # save the new questions
            Question.objects.bulk_create([Question(**question, exam_id=instance.id) for question in questions_list])
        return super().update(instance, validated_data)

    def validate(self, attrs):
        start_date = attrs.get('start_date')
        expiration_date = attrs.get('expiration_date')

        if start_date and expiration_date:
            if start_date > expiration_date:
                raise serializers.ValidationError("Start date must be before expiration date.")

        return super().validate(attrs)
