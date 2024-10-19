from django.db import models


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
        from code_executor.tasks import execute_code_async
        test_cases = self.question_id.test_cases
        language = self.code.get("language", "any")
        version = self.code.get("version", "any")

        evaluation_result = execute_code_async(
            language=language,
            code=self.code["body"],
            version=version,
            test_cases=test_cases
        )

        if 'error' in evaluation_result:
            self.score = 0
            message = f"{evaluation_result['error']}: {evaluation_result['details']}"
        else:
            all_passed = evaluation_result['all_passed']
            self.score = self.question_id.grade if all_passed else 0
            message = "All test cases passed" if all_passed else "Some test cases failed"

        if self.code:
            self.code['body'] = self.code["body"]
        else:
            self.code = {
                'body': self.code["body"],
                'language': language,
                'version': version
            }

        self.save()

        return {
            "message": message,
            "score": self.score,
            "max_score": self.question_id.grade,
            "results": evaluation_result.get('results', [])
        }
    
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
