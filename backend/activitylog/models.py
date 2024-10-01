from django.db import models


# Create your models here.
class ActivityLog(models.Model):
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    attempt_id = models.ForeignKey('attempts.Attempt', on_delete=models.CASCADE, null=True, blank=True)
    # question_id = models.ForeignKey('exam.Question', on_delete=models.CASCADE, null=True, blank=True)
    type = models.CharField(max_length=255)
    additional_info = models.JSONField(default=dict)
