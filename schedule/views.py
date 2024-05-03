from re import A
from django.http import HttpResponseNotAllowed, JsonResponse
from django.http import HttpResponse
from django.shortcuts import render
import json
from .models import User, Activity
from django.core.exceptions import ObjectDoesNotExist
from django.middleware import csrf

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
        activities = json.dumps(list(Activity.objects.filter(user=user).values()))
        unshow_activities = Activity.objects.filter(user=user, show=False).values()
        return render(request, 'main/index.html', context={'user_id': user.id, 'activities':activities, 'unshow_activities':unshow_activities})
    except ObjectDoesNotExist:
        return render(request, 'login/index.html', context={'msg':'Username or password invalid'})


# [container_activity, container_details, container_time, p_details_name, p_details_category, p_time_from, p_time_to, button]
def view_create_schedule(request):
    user_id = request.POST.get('user_id')
    this_user = User.objects.get(pk=user_id)
    activities = Activity.objects.filter(user=this_user)
    print(activities)
    activities = sort_activities(activities)
    print(activities)
    return render(request, 'create/index.html', context={'user_id': this_user.id, 'username':this_user.username, 'password':this_user.password, 'activities':activities})

#functions
def create_user(request): #request: user, password
    username = request.POST.get('username')
    password = request.POST.get('password')
    new_user = User(username=username, password=password)
    new_user.save()
    return render(request, 'login/index.html', context={'msg':'user {0} created successfully'.format(username)})

def cancel_activity(request):
    data = json.loads(request.body)
    user = User.objects.get(pk=data['user_id'])
    activity = Activity.objects.get(user=user, day=data['day'], from_time=data['from_time'])
    activity.show = False
    activity.save()
    return HttpResponse(status=200)


def uncancel_activity(request):
    data = json.loads(request.body)
    user = User.objects.get(pk=data['user_id'])
    activity = Activity.objects.get(user=user, day=data['day'], from_time=data['from_time'])
    activity.show = True
    activity.save()
    return HttpResponse(status=200)

def create_schedule(request):
    data:dict = json.loads(request.POST.get('data'))
    user = User.objects.get(username=request.POST.get('username'), password=request.POST.get('password'))
    remove_all_activities_of_user(user)
    for el in data:
        for act in data[el][0]:
            print(act)
            if(act['act_type'] == 'fixed'):
                #fixed status
                activity = Activity(name=act['name'], act_type=act['act_type'], day=act['day'], weight=act['weight'], from_time=act['from_time'], to_time=act['to_time'], show=True, category=act['category'], user=user)
            else:
                #auto status
                activity = Activity(name=act['name'], act_type=act['act_type'], weight=act['weight'], hours=act['hours'], show=True, category=act['category'], user=user)
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

def get_csrf_token(request):
    response = {
        'csrf_token': csrf.get_token(request)
    }
    return JsonResponse(response)


def sort_activities(activities:list):
    fixed_activities = []
    auto_activities = []

    #get all the activities
    for el in activities:
        if (el.act_type == 'auto' and el.show):
            auto_activities.append(el)
        if (el.act_type == 'fixed' and el.show):
            fixed_activities.append(el)

    acts_sorted = {
        'sunday':    [[],16,[0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
        'monday':    [[],16,[0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
        'tuesday':   [[],16,[0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
        'wednesday': [[],16,[0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
        'thursday':  [[],16,[0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
        'friday':    [[],16,[0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
        'saturday':  [[],16,[0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
    }
    #fill acts_sorted, this dict is the template of activities to show
    for el in fixed_activities:
        if(mark_hours(acts_sorted[el.day][2], el.from_time, el.to_time)):
            el.hours = get_hours(el.from_time, el.to_time)
            acts_sorted[el.day][0].append(el)
            acts_sorted[el.day][1] -= el.hours
    #fill acts_sorted with auto activities
    for el in auto_activities:
        marked = False
        for day in acts_sorted:
            counter = 0
            if(marked):break
            for i in range(len(acts_sorted[day][2])):
                if(counter == el['hours']):
                    from_time = (i - el['hours']) + 7 
                    to_time = i + 7 
                    el['from_time'] = "0{}:00".format(from_time) if from_time < 10 else "{}:00".format(from_time)
                    el['to_time'] = "0{}:00".format(to_time) if to_time < 10 else "{}:00".format(to_time)
                    mark_hours(acts_sorted[day][2], el['from_time'], el['to_time'])
                    acts_sorted[day][0].append(el)
                    acts_sorted[day][1] -= el['hours']
                    marked = True
                    break
                if(hour == 0):
                    counter += 1
                else:
                    counter = 0
    return acts_sorted

def get_hours(from_time, to_time):
    from_time = int(from_time[1]) if from_time[0] == 0 else int(from_time[0:2]) 
    to_time = int(to_time[1]) if to_time[0] == 0 else int(to_time[0:2]) 
    return to_time - from_time

def mark_hours(register, from_time, to_time):
    from_time = from_time[0:2] 
    to_time = to_time[0:2]
    counter = 0

    from_time = int(from_time[1]) if from_time[0] == 0 else int(from_time[0:2]) 
    to_time = int(to_time[1]) if to_time[0] == 0 else int(to_time[0:2]) 
    
    i = from_time - 7
    k = to_time - 7

    print(i, k)

    #look if there is space avaliable
    for hour in range(i, k, 1):
        if(register[hour] == 0):
            counter += 1
        else:
            counter = 0

    #mark the hours in the register
    if(counter == (to_time - from_time)):
        print('si')
        for hour in range(i, k, 1):
            register[hour] = 1 
            i += 1
        return True
    else: 
        return False







