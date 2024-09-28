from rest_framework import serializers

class ExecuteCodeSerializer(serializers.Serializer):
    language = serializers.CharField(max_length=50)
    version = serializers.CharField(max_length=50)
    code = serializers.CharField()
    stdin = serializers.CharField(required=False, allow_blank=True)
