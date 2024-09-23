from django.db import models
from authentication.models import CustomUser
from exam.models import Exam, Question


# Create your models here.
class Answer(models.Model):
    student_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    exam_id = models.ForeignKey(Exam, on_delete=models.CASCADE)
    question_id = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer_body = models.JSONField(default=dict)
    score = models.FloatField(null=True, blank=True)
