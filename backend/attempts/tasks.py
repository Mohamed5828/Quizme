from celery import shared_task
from .models import Attempt


@shared_task
def evaluate_attempt(attempt_id):
    """
    Evaluate an attempt
    """
    attempt = Attempt.objects.get(id=attempt_id)
    attempt.evaluate()
