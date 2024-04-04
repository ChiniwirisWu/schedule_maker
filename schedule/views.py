from django.shortcuts import render
from .models import User, Activity
from django.core.exceptions import ObjectDoesNotExist

# Create your views here.
def view_login(request):
    return render(request, 'login/index.html')

def view_register(request):
    return render(request, 'register/index.html')

def view_main(request):
    username = request.POST.get('username')
    password = request.POST.get('password')
    try:
        user = User.objects.get(username=username)
        if(user.password == password):
            user.state = 1
            return render(request, 'main/index.html', context={'user_id': user.id})
        return render(request, 'login/index.html', context={'msg':'Username or password invalid'})
    except ObjectDoesNotExist:
        return render(request, 'login/index.html', context={'msg':'Username or password invalid'})

def view_create_schedule(request):
    user = User.objects.get(pk=request.POST.get('user_id'))
    return render(request, 'create/index.html', context={'user_id': user.id, 'username':user.username, 'password':user.password})

#functions
def create_user(request): #request: user, password
    username = request.POST.get('username')
    password = request.POST.get('password')
    new_user = User(username=username, password=password)
    new_user.save()
    return render(request, 'login/index.html', context={'msg':'user {0} created successfully'.format(username)})

def log_out(request):
    user_id = request.POST.get('user_id')
    user = User.objects.get(pk=user_id)
    user.state = 0
    return render(request, 'login/index.html', context={'msg':'user {0} log out successfully'.format(user.username)})
