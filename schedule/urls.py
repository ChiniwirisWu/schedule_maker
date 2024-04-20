from django.urls import path
from . import views

app_name = 'schedule'

urlpatterns = [
    #views
    path('', views.view_login, name='view_login'),
    path('view_login', views.view_login, name='view_login'),
    path('view_register', views.view_register, name='view_register'),
    path('view_create_schedule', views.view_create_schedule, name='view_create_schedule'),
    path('view_main', views.view_main, name='view_main'),
    #functions
    path('create_user', views.create_user, name='create_user'),
    path('create_schedule', views.create_schedule, name='create_schedule'),
    path('log_out', views.log_out, name='log_out'),
    path('cancel_activity', views.cancel_activity, name='cancel_activity'),
    path('get_csrf_token', views.get_csrf_token, name='get_csrf_token')
]
