from celery import shared_task
from exam.models import Exam
from attempts.tasks import evaluate_attempt


@shared_task
def evaluate_exam_after_expiry(exam_id):
    exam = Exam.objects.get(id=exam_id)
    if exam is None:
        return
    for attempt in exam.attempts.all():
        evaluate_attempt.delay(attempt.id)
