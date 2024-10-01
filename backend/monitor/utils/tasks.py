from celery import shared_task
from .Detector import DetectWrapper
from monitor.models import CamFrameLog


@shared_task
def evaluate_frame(frame: bytes, attempt_id: int):
    with DetectWrapper() as detector:
        category = detector.categorize(image=frame)

    log = CamFrameLog.objects.get(id=attempt_id)
    log.flag = category
    log.save()
