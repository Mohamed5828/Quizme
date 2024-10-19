from celery import shared_task
from .Detector import DetectWrapper
from monitor.models import CamFrameLog


@shared_task
def evaluate_frame(frame: bytes, log_id: int):
    with DetectWrapper(threshold_rad=0.4) as detector:
        category = detector.categorize(image=frame)

    log = CamFrameLog.objects.get(id=log_id)
    log.flag = category
    log.frame = frame
    log.save()
