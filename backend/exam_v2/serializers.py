from rest_framework.serializers import ModelSerializer
from exam.models import Exam, Question

from drf_yasg.utils import swagger_serializer_method
from drf_yasg import openapi


class QuestionSerializer2(ModelSerializer):
    class Meta:
        model = Question
        exclude = ['exam_id']


class ExamSerializer2(ModelSerializer):
    questions = QuestionSerializer2(many=True)

    class Meta:
        model = Exam
        fields = ['id', 'duration', 'exam_code', 'created_at', 'expiration_date', 'whitelist', 'questions']
        # exclude = ['user_id']

    def create(self, validated_data):
        # remove questions from validated_data
        questions_list = validated_data.pop('questions')
        # save the exam
        exam = Exam.objects.create(**validated_data)
        # save the questions
        for question in questions_list:
            question['exam_id'] = exam

        Question.objects.bulk_create(Question(**question) for question in questions_list)
        return exam

    def update(self, instance, validated_data):
        # remove questions from validated_data
        questions_list = validated_data.pop('questions')
        # update the exam
        exam = super().update(instance, validated_data)
        # save the questions
        # TODO: find which operation is better overall (faster, less buggy/actually works)
        # * Operation 1
        for question in questions_list:
            question['exam_id'] = exam
            question_id = question.get('question_id')
            if question_id:
                question = Question.objects.get(question_id=question_id)
                question.__dict__.update(**question)
                question.save()
            else:
                Question.objects.create(**question, exam_id=exam)
        # # * Operation 2
        # # delete all related questions
        # Question.objects.filter(exam_id=exam).delete()
        # # save the new questions
        # Question.objects.bulk_create(Question(**question) for question in questions_list)
        return exam
