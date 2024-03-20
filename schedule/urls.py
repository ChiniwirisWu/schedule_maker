from django.urls import path
from . import views

app_name = 'schedule'

urlpatterns = [
    path('', views.view_index, name='index')
]
