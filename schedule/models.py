from django.db import models
from django.forms import CharField
from django.core.validators import MaxValueValidator, MinValueValidator
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
    day = models.IntegerField(default=1)
    time = models.CharField(max_length=50, default='')
    weight = models.IntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(5)])
    hours = models.IntegerField(default=0) #this will be a json stringify {[10.15, 11.00], ...,  [a, b]}
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)




