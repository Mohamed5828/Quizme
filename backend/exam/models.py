from django.db import models
from authentication import models as authModels


class Exam(models.Model):
    exam_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(authModels.CustomUser, on_delete=models.CASCADE)
    duration = models.DurationField()
    # TODO make exam_code slug field
    exam_code = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expiration_date = models.DateTimeField()
    whitelist = models.JSONField(default=list)


# QUESTION_TYPES = (
#     ('code', 'code'),
#     ('mcq', 'mcq')
# )
#
# DIFFICULTY_LEVELS = (
#     ('easy', 'Easy'),
#     ('medium', 'Medium'),
#     ('hard', 'Hard')
# )


class Question(models.Model):
    # TODO move fields out of question_body into nullables like questionbank
    # desc = models.TextField()
    # type = models.CharField(max_length=4, choices=QUESTION_TYPES)
    # difficulty = models.CharField(max_length=6, choices=DIFFICULTY_LEVELS, null=True, blank=True)
    # tags = models.JSONField(default=list)
    # grade = models.CharField(max_length=10, null=True, blank=True)
    # choices = models.JSONField(default=list)
    # test_cases = models.JSONField(default=list)
    # code = models.TextField(null=True, blank=True)
    question_id = models.AutoField(primary_key=True)
    exam_id = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='questions')
    question_body = models.JSONField(default=dict)
