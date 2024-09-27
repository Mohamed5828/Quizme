from django.db import models
from django.utils.text import slugify


class Exam(models.Model):
    # id = models.AutoField(primary_key=True) # this is auto created
    user_id = models.ForeignKey("authentication.CustomUser", on_delete=models.CASCADE)
    duration = models.DurationField()
    title = models.CharField(max_length=100)
    exam_code = models.SlugField(max_length=120, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    start_date = models.DateTimeField()
    expiration_date = models.DateTimeField()
    max_grade = models.IntegerField()
    whitelist = models.JSONField(default=list)

    def save(self, *args, **kwargs):
        if not self.exam_code:
            self.exam_code = self.generate_exam_code()
        super().save(*args, **kwargs)

    def generate_exam_code(self):
        return f"exam{self.id}-{slugify(self.title)}"
    # class Meta:
    #     indexes = [
    #         models.Index(fields=['user_id'])
    #     ]


QUESTION_TYPES = (
    ('code', 'code'),
    ('mcq', 'mcq')
)

DIFFICULTY_LEVELS = (
    ('easy', 'Easy'),
    ('medium', 'Medium'),
    ('hard', 'Hard')
)


class Question(models.Model):
    # id = models.AutoField(primary_key=True) # this is auto created
    exam_id = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='questions')
    desc = models.TextField()
    type = models.CharField(max_length=4, choices=QUESTION_TYPES)
    difficulty = models.CharField(max_length=6, choices=DIFFICULTY_LEVELS, null=True, blank=True)
    tags = models.JSONField(default=list)
    grade = models.IntegerField()
    choices = models.JSONField(default=list)
    test_cases = models.JSONField(default=list)
    code = models.TextField(null=True, blank=True)

    # question_body = models.JSONField(default=dict)
    # class Meta:
    #     indexes = [
    #         models.Index(fields=['exam_id'])
    #     ]
