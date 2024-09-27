from django.db import models

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
    # id = models.AutoField(primary_key=True) # this is auto created
    desc = models.TextField()
    type = models.CharField(max_length=4, choices=QUESTION_TYPES)
    difficulty = models.CharField(max_length=6, choices=DIFFICULTY_LEVELS, null=True, blank=True)
    tags = models.JSONField(default=list)
    grade = models.IntegerField()
    choices = models.JSONField(default=list)
    test_cases = models.JSONField(default=list)
    code = models.TextField(null=True, blank=True)
    user_id = models.ForeignKey("authentication.CustomUser", on_delete=models.CASCADE, related_name='question_banks')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user_id', 'id'], name='unique_question')
        ]
        # indexes = [
        #     models.Index(fields=['user'])
        #
        # ]

    def __str__(self):
        return f"{self.type} {self.id} {self.user_id.username}"
