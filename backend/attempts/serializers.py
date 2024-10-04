from rest_framework import serializers
from django.db import transaction
from authentication.serializers import CustomUserSerializer
from answers.models import Answer
from answers.serializers import AnswerSerializer
from attempts.models import Attempt


class AttemptSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)
    student = CustomUserSerializer(source='student_id', read_only=True)

    class Meta:
        model = Attempt
        fields = '__all__'

    def create(self, validated_data):
        # remove answers from validated_data
        answers = validated_data.pop('answers')
        # create and save the attempt
        attempt = Attempt.objects.create(**validated_data)
        # save the answers
        Answer.objects.bulk_create([Answer(**answer, attempt_id=attempt.id) for answer in answers])
        # return the attempt
        return attempt

    def update(self, instance, validated_data):
        answers_list = validated_data.pop('answers')
        # delete all related
        with transaction.atomic():
            Answer.objects.filter(attempt_id=instance.id).delete()
            Answer.objects.bulk_create([Answer(**answer, attempt_id=instance.id) for answer in answers_list])
        return super().update(instance, validated_data)
