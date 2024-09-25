from django.db import models
from authentication import models as authModels


class Exam(models.Model):
    exam_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(authModels.CustomUser, on_delete=models.CASCADE)
    duration = models.DurationField()
    exam_code = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expiration_date = models.DateTimeField()
    whitelist = models.JSONField(default=list)


class Question(models.Model):
    question_id = models.AutoField(primary_key=True)
    exam_id = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='questions')
    question_body = models.JSONField(default=dict)
