from rest_framework import serializers

from monitor.models import CamFrameLog


class CamFrameLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = CamFrameLog
        fields = '__all__'
