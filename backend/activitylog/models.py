from django.db import models

LOG_TYPES = (
    ("QUES_NAV", "QUES_NAV"),
    ("COPY_PASTE", "COPY_PASTE"),
    ("WIN_FOCUS", "WIN_FOCUS"),
)


# Create your models here.
class ActivityLog(models.Model):
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    attempt_id = models.ForeignKey('attempts.Attempt', on_delete=models.CASCADE, null=True, blank=True)
    # question_id = models.ForeignKey('exam.Question', on_delete=models.CASCADE, null=True, blank=True)
    type = models.CharField(max_length=255, choices=LOG_TYPES)
    log_time = models.DateTimeField()
    additional_info = models.JSONField(default=dict)
