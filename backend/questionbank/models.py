from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

QUESTION_TYPES = (
    ('code', 'code'),
    ('mcq', 'mcq')
)

DIFFICULTY_LEVELS = (
    ('easy', 'Easy'),
    ('medium', 'Medium'),
    ('hard', 'Hard')
)

class QuestionBank(models.Model):
    id = models.AutoField(primary_key=True)
    desc = models.TextField()
    type = models.CharField(max_length=4, choices=QUESTION_TYPES)
    difficulty = models.CharField(max_length=6, choices=DIFFICULTY_LEVELS, null=True, blank=True)
    tags = models.JSONField(default=list)
    grade = models.CharField(max_length=10, null=True, blank=True)
    choices = models.JSONField(default=list)
    test_cases = models.JSONField(default=list)
    code = models.TextField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.type} {self.id} {self.user.username}"