from decimal import MAX_EMAX
from django.db import models
from django.forms import CharField
from django.core.validators import MaxLengthValidator, MaxValueValidator, MinValueValidator
DEFAULT_USERNAME = 'user123default'
DEFAULT_PASSWORD = 'password123default'

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    user_state = models.IntegerField(default=0) #0:off, 1:on

    def __str__(self):
        return "{}, {}".format(self.username, self.password) 


class Activity(models.Model):
    name = models.CharField(max_length=100, default='')
    day = models.CharField(default='', max_length=9)
    from_time = models.CharField(default='', max_length=5)
    to_time = models.CharField(default='', max_length=5)
    category = models.CharField(default='', max_length=20)
    weight = models.IntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(6)])
    hours = models.IntegerField(default=0) #this will be a json stringify {[10.15, 11.00], ...,  [a, b]}
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)
    show = models.BooleanField(default=True)
    done = models.BooleanField(default=False)

    def __str__(self):
        return self.name


