from django.urls import path
from . import views

app_name = 'schedule'

urlpatterns = [
    path('', views.view_login, name='login'),
    path('login', views.view_login, name='login'),
    path('register', views.view_register, name='register'),
    path('create_schedule', views.view_create_schedule, name='create_schedule'),
    path('main', views.view_main, name='main'),
    path('create_user', views.create_user, name='create_user'),
    path('log_out', views.log_out, name='log_out')
]
