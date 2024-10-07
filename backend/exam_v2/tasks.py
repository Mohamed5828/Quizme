from celery import shared_task, group
from exam.models import Exam
from attempts.tasks import evaluate_attempt, send_attempts_csv


@shared_task
def evaluate_exam_after_expiry(exam_id):
    try:
        exam = Exam.objects.get(id=exam_id)
        task_group = group(evaluate_attempt.s(attempt.id) for attempt in exam.attempts.all())
        result = task_group.apply_async()
        result.join()
        send_attempts_csv.delay(exam_id, exam.user_id.email)

    except Exam.DoesNotExist:
        print(f"Exam with {exam_id=} does not exist evaluation task will abort ")
