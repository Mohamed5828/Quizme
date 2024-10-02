from datetime import timedelta

from django.db import models
from django.utils.text import slugify
from quizme.celery import app


class Exam(models.Model):
    # id = models.AutoField(primary_key=True) # this is auto created
    user_id = models.ForeignKey("authentication.CustomUser", on_delete=models.CASCADE)
    duration = models.DurationField()
    title = models.CharField(max_length=100)
    exam_code = models.SlugField(max_length=120, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    start_date = models.DateTimeField()
    expiration_date = models.DateTimeField()
    max_grade = models.IntegerField()
    whitelist = models.JSONField(default=list)
    group_name = models.CharField(max_length=100, blank=True, null=True)
    scheduled_task_id = models.CharField(max_length=255, null=True, blank=True)

    def save(self, *args, **kwargs):
        # leave this here to prevent circular imports error
        from exam_v2.tasks import evaluate_exam_after_expiry

        is_new = self.pk is None

        if is_new:
            # For new instances, save with minimal data to get an ID
            self.exam_code = f"placeholder-exam-{self.user_id.username}"
            super().save(*args, **kwargs)

            # Now that we have an ID, generate the real exam code
            self.exam_code = self.generate_exam_code()
        else:
            # For existing instances, check if expiration date changed
            old_expiration = Exam.objects.get(pk=self.pk).expiration_date
            if self.scheduled_task_id and old_expiration != self.expiration_date:
                app.control.revoke(self.scheduled_task_id, terminate=True)
                self.scheduled_task_id = None

        # Schedule new task and set its id
        if not self.scheduled_task_id:
            self.scheduled_task_id = evaluate_exam_after_expiry.apply_async(
                eta=self.expiration_date + timedelta(minutes=10),
                args=(self.id,)
            ).id

        # Save all changes
        super().save()

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
    code = models.JSONField(null=True, blank=True)
    # question_body = models.JSONField(default=dict)
    # class Meta:
    #     indexes = [
    #         models.Index(fields=['exam_id'])
    #     ]
