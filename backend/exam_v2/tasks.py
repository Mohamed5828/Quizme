from celery import shared_task, group
from exam.models import Exam
from attempts.tasks import evaluate_attempt
from django.conf import settings
from django.core.mail import send_mail
from attempts.tasks import send_attempts_csv


@shared_task
def send_exam_invitation_email(email, exam_title, exam_code, start_date):
    subject = f"You're invited to participate in the {exam_title} exam"
    message = f"You have been added to the {exam_title} exam. The exam starts on {start_date}.\n\nExam Code: {exam_code}"
    email_from = settings.DEFAULT_FROM_EMAIL
    recipient_list = [email]
    send_mail(subject, message, email_from, recipient_list)
    
    
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
