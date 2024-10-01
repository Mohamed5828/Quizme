from django.db import models

from code_executor.tasks import execute_code_async


# Create your models here.
class Answer(models.Model):
    attempt_id = models.ForeignKey('attempts.Attempt', on_delete=models.CASCADE, related_name='answers')
    created_at = models.DateTimeField(auto_now_add=True)
    question_id = models.ForeignKey('exam.Question', on_delete=models.CASCADE)
    score = models.FloatField(null=True, blank=True)
    # optional fields dependent on question type
    choices = models.JSONField(default=list)
    code = models.JSONField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['attempt_id', 'question_id'], name='unique_answer')
        ]
        # indexes = [
        #     models.Index(fields=['attempt_id', 'question_id']),
        #     models.Index(fields=['attempt_id']),
        # ]

    def _eval_code(self):
        test_cases = self.question_id.test_cases

        all_passed = True
        results = []

        for test_case in test_cases:
            result = execute_code_async(language=self.code["language"], code=self.code["body"],
                                        version=self.code["version"],
                                        stdin=test_case.get('input', ''))
            if result.get("output") != test_case.get('output', ''):
                all_passed = False

        if all_passed:
            self.score = self.question_id.grade
        else:
            self.score = 0

    def _eval_mcq(self):
        correct_choices = {c["desc"] for c in self.question_id.choices if c["is_correct"]}
        if set(self.choices) == correct_choices:
            self.score = self.question_id.grade
        else:
            self.score = 0

    def evaluate(self):
        """
        Evaluates answer based on question type
        best called within a delayed celery task
        """
        if self.question_id.type == 'mcq':
            self._eval_mcq()
        elif self.question_id.type == 'code':
            self._eval_code()

        self.save()
