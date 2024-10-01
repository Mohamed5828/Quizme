from rest_framework import serializers


class ExecuteCodeSerializer(serializers.Serializer):
    language = serializers.CharField(max_length=50)
    version = serializers.CharField(max_length=50)
    code = serializers.CharField()
    stdin = serializers.CharField(required=False, allow_blank=True)


class CodeValidationMixin:
    class CodeSerializer(serializers.Serializer):
        body = serializers.CharField()
        language = serializers.CharField()
        version = serializers.CharField()

    def validate_code(self, value):
        """
        Custom validation for the `code` JSON field.
        """
        if not value:
            return value
        code_serializer = self.CodeSerializer(data=value)
        if code_serializer.is_valid():
            return code_serializer.validated_data
        else:
            raise serializers.ValidationError(code_serializer.errors)

    def validate(self, data):
        data['code'] = self.validate_code(data.get('code', None))
        return super().validate(data)
