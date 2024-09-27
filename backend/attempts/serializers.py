from rest_framework import serializers

from attempts.models import Attempt


# from answers.serializers import AnswerSerializer


class AttemptSerializer(serializers.ModelSerializer):
    # answers = AnswerSerializer(many=True)

    class Meta:
        model = Attempt
        fields = '__all__'
