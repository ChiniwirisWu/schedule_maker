from django.shortcuts import render
import json
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
        user = User.objects.get(username=username, password=password)
        user.state = 1
        activities = json.dumps(list(Activity.objects.filter(user__lte=user).values()))
        return render(request, 'main/index.html', context={'user_id': user.id, 'activities':activities})
    except ObjectDoesNotExist:
        return render(request, 'login/index.html', context={'msg':'Username or password invalid'})

def view_create_schedule(request):
    user = User.objects.get(pk=request.POST.get('user_id'))
    activities = json.dumps(list(Activity.objects.filter(user__lte=user).values())) 
    return render(request, 'create/index.html', context={'user_id': user.id, 'username':user.username, 'password':user.password, 'activities':activities})

#functions
def create_user(request): #request: user, password
    username = request.POST.get('username')
    password = request.POST.get('password')
    new_user = User(username=username, password=password)
    new_user.save()
    return render(request, 'login/index.html', context={'msg':'user {0} created successfully'.format(username)})

def create_schedule(request):
    data:dict = json.loads(request.POST.get('data'))
    user = User.objects.get(username=request.POST.get('username'), password=request.POST.get('password'))
    remove_all_activities_of_user(user)
    for el in data:
        for act in data[el][0]:
            if('from_time' in act.keys()):
                #fixed status
                activity = Activity(name=act['name'], day=act['day'], weight=act['weight'], from_time=act['from_time'], to_time=act['to_time'], show=True, category=act['category'], user=user)
            else:
                #auto status
                activity = Activity(name=act['name'], day=act['day'], weight=act['weight'], hours=act['hours'], show=True, category=act['category'], user=user)
            activity.save()            
    return render(request, 'main/index.html', context={'user_id':user.id, 'username':user.username, 'password':user.password,'activities': json.dumps(list(Activity.objects.filter(user__lte=user).values()))})

def log_out(request):
    user_id = request.POST.get('user_id')
    user = User.objects.get(pk=user_id)
    user.state = 0
    return render(request, 'login/index.html', context={'msg':'user {0} log out successfully'.format(user.username)})

def remove_all_activities_of_user(user):
    for el in Activity.objects.filter(user__lte=user):
        el.delete()









