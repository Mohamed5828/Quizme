from django.db import models
from authentication.models import CustomUser

# Create your models here.

QUESTION_TYPES = (
    ('code', 'code'), ('mcq', 'mcq')
)


class QuestionBank(models.Model):
    desc = models.TextField()
    type = models.CharField(max_length=4, choices=QUESTION_TYPES)
    question_body = models.JSONField(default=dict)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.type} {self.id} {self.user.username}"
