from django.db import models
from django.contrib.auth.models import AbstractUser

ROLES = (
    ('instructor', 'instructor'),
    ('student', 'student'),
)


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, default="instructor", choices=ROLES)
    category = models.CharField(max_length=100, null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    ## note : check the fields provided by AbstractUser in migrations/initial.py or google them   
    ## this means you will be logging using the email 
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self) -> str:
        return self.email

    @property
    def is_instructor(self) -> bool:
        return self.role == "instructor"
