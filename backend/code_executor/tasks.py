from celery import shared_task

import time
@shared_task
def send():
    for i in range(5):
        print (i) 
        time.sleep(1)

# poetry run celery -A quizme worker --loglevel=info --pool=solo