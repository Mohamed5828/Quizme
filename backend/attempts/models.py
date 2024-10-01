from django.db import models


# Create your models here.
class Attempt(models.Model):
    student_id = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE)
    exam_id = models.ForeignKey('exam.Exam', on_delete=models.CASCADE)
    score = models.FloatField(null=True, blank=True)
    start_time = models.DateTimeField(auto_now_add=True)  # same as created_at (auto generated now)
    end_time = models.DateTimeField(null=True, blank=True)
    cheating_metric = models.FloatField(null=True, blank=True, )

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['student_id', 'exam_id'], name='unique_attempt')
        ]
        # indexes = [
        #     models.Index(fields=['student_id', 'exam_id']),
        #     models.Index(fields=['exam_id']),
        # ]

    def evaluate(self):
        """
        Evaluate an attempt
        best called inside a celery task
        """
        for answer in self.answers.all():
            answer.evaluate()
        self.score = self.answers.aggregate(models.Sum('score'))['score__sum']
        self.save()
