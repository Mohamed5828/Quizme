from celery import shared_task
from exam.models import Exam
from attempts.tasks import evaluate_attempt


@shared_task
def evaluate_exam_after_expiry(exam_id):
    try:
        exam = Exam.objects.get(id=exam_id)

        for attempt in exam.attempts.all():
            evaluate_attempt.delay(attempt.id)
    except Exam.DoesNotExist:
        print(f"Exam with {exam_id=} does not exist evaluation task will abort ")
