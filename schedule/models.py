from django.db import models
from django.forms import CharField

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=100)
    color = models.CharField(default='')

    def __str__(self):
        return self.username, color

class Activity(models.Model):
    name = CharField(max_length=100)
    day = CharField(max_length=10)
    hours = CharField(max_length=50) #this will be a json stringify {[10.15, 11.00], ...,  [a, b]}

