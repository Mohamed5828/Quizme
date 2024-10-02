from django.db import models

choices = (
    ('good', 'good'),
    ('looked_away', 'looked_away'),
    ('another_person_detected', 'another_person_detected'),
    ('no_person_detected', 'no_person_detected'),
)


# Create your models here.
class CamFrameLog(models.Model):
    frame = models.BinaryField()
    attempt = models.ForeignKey('attempts.Attempt', on_delete=models.CASCADE, related_name='frames')
    flag = models.CharField(max_length=23, null=True, blank=True, choices=choices)
    timestamp = models.DateTimeField(auto_now_add=True)  # timestamp = models.DateTimeField(auto_now_add=True)
