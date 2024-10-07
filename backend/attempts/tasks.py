from celery import shared_task
from .models import Attempt
import csv
from io import StringIO
from django.core.mail import send_mail
from django.conf import settings
from exam.models import Exam
from django.utils import timezone
from django.core.mail import EmailMessage

from django.core.mail import send_mail
from django.conf import settings
from io import StringIO
import csv


@shared_task
def send_attempts_csv(exam_id, instructor_email):
    attempts = Attempt.objects.filter(exam_id=exam_id).select_related('student_id')
    csv_file = StringIO()
    writer = csv.writer(csv_file)

    writer.writerow(['Student ID', 'Student Email', 'Exam ID', 'Score', 'Start Time', 'End Time'])

    for attempt in attempts:
        student_email = attempt.student_id.email
        writer.writerow([attempt.student_id.id, student_email, attempt.exam_id.id, attempt.score, attempt.start_time,
                         attempt.end_time])

    subject = f"Exam {exam_id} Attempts CSV"
    message = "Please find attached the CSV file containing all student attempts for the exam."
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [instructor_email]

    csv_content = csv_file.getvalue()

    # Prepare the email with an attachment
    email = EmailMessage(
        subject=subject,
        body=message,
        from_email=from_email,
        to=recipient_list,
    )

    email.attach('exam_attempts.csv', csv_content, 'text/csv')

    # Send the email
    email.send(fail_silently=False)

    return f'CSV file sent to {instructor_email}'


@shared_task
def check_exam_expiration():
    # * This is unused
    # Fetch exams that have expired and haven't had their CSV sent
    expired_exams = Exam.objects.filter(expiration_date=timezone.now(), csv_sent=False)

    for exam in expired_exams:
        # Queue the task to send the CSV to the instructor email
        send_attempts_csv.delay(exam.id, exam.instructor.email)
        exam.csv_sent = True
        exam.save()


@shared_task
def evaluate_attempt(attempt_id):
    """
    Evaluate an attempt
    """
    attempt = Attempt.objects.get(id=attempt_id)
    # if attempt.score is None:
    attempt.evaluate()
