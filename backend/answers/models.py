from django.db import models


# Create your models here.
class Answer(models.Model):
    attempt_id = models.ForeignKey('attempts.Attempt', on_delete=models.CASCADE, related_name='answers')
    created_at = models.DateTimeField(auto_now_add=True)
    question_id = models.ForeignKey('exam.Question', on_delete=models.CASCADE)
    score = models.FloatField(null=True, blank=True)
    # optional fields dependent on question type
    choices = models.JSONField(default=list)
    code = models.TextField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['attempt_id', 'question_id'], name='unique_answer')
        ]
        # indexes = [
        #     models.Index(fields=['attempt_id', 'question_id']),
        #     models.Index(fields=['attempt_id']),
        # ]
