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
    user = validate_user(request)
    if(user):
        activities = json.dumps(list(Activity.objects.filter(user=user).values()))
        unshow_activities = Activity.objects.filter(user=user, show=False).values()
        return render(request, 'main/index.html', context={'username':user.username, 'password':user.password, 'activities':activities, 'unshow_activities':unshow_activities})
    else:
        return render(request, 'login/index.html', context={'msg':'Username or password invalid'})


# [container_activity, container_details, container_time, p_details_name, p_details_category, p_time_from, p_time_to, button]
def view_create_schedule(request):
    user = validate_user(request)
    if(user):
        activities = Activity.objects.filter(user=user)
        activities = sort_activities(activities)
        return render(request, 'create/index.html', context={'username':user.username, 'password':user.password, 'days':activities.keys(), 'monday':activities['monday'][0], 'tuesday':activities['tuesday'][0], 'wednesday':activities['wednesday'][0], 'thrusday':activities['thursday'][0], 'friday':activities['friday'][0], 'saturday':activities['saturday'][0], 'sunday':activities['sunday'][0]}) 
    else:
        return render(request, 'login/index.html', context={'msg':'Username or password invalid'})

#functions


def validate_user(request):
    username = request.POST.get('username')
    password = request.POST.get('password')
    try:
        user = User.objects.get(username=username, password=password)
        user.state = 1
        return user
    except ObjectDoesNotExist:
        return False


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

def add_activity(request):
    body = json.loads(request.body)
    user = User.objects.get(username=body['username'], password=body['password'])
    if(user):
        if(body['act_type'] == 'fixed'):
            new_activity = Activity(name=body['name'], day=body['day'], from_time=body['from_time'], to_time=body['to_time'], weight=5, category=body['category'], hours=get_hours(body['from_time'], body['to_time']), act_type='fixed', user=user)
            if(space_avaliable(new_activity, user)):
                new_activity.save()
            return HttpResponse(200)
        else:
            new_activity = Activity(name=body['name'], weight=body['weight'], category=body['category'], hours=body['hours'], act_type='auto', user=user)
            new_activity.save()
            return HttpResponse(200)
    else:
        return HttpResponse(400)


def space_avaliable(activity, user):
    activities = Activity.objects.filter(user=user) 
    auto_activities = []
    fixed_activities = []
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

    #see if there is space avaliable
    counter = 0
    for i in range(len(acts_sorted[activity.day][2])):
        if(counter == activity.hours):
            return True
        if(acts_sorted[activity.day][2][i] == 0):
            counter += 1
        else:
            counter = 0
    return False





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
    user = validate_user(requst)
    if(user):
        user.state = 0
        return render(request, 'login/index.html', context={'msg':'user {0} log out successfully'.format(user.username)})
    else:
        pass

def remove_all_activities_of_user(user):
    for el in Activity.objects.filter(user__lte=user):
        el.delete()

def get_csrf_token(request):
    response = {
        'csrf_token': csrf.get_token(request)
    }
    return JsonResponse(response)

def remove_activity(request):
    user = validate_user(request)
    if(user):
        act_id = request.POST.get('act_id')
        act = Activity.objects.get(pk=act_id)
        act.delete()
        return view_create_schedule(request)
    else:
        return render(request, 'login/index.html', msg='user does not exist')

def sort_activities(activities:list):
    fixed_activities = []
    auto_activities = []
    colors = {
		'sports': '#f26d68',
		'university': '#f2bd68',
		'leasures': '#adf268',
		'study': '#68f294',
		'courses': '#68f2f0',
		'friends': '#6450eb',
		'family': '#c549eb',
		'home': '#eb42b5',
		'workout': '#692637',
    }

    #get all the activities
    for el in activities:
        if (el.act_type == 'auto' and el.show):
            el.color = colors[el.category]
            auto_activities.append(el)
        if (el.act_type == 'fixed' and el.show):
            el.color = colors[el.category]
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
                if(counter == el.hours):
                    from_time = (i - el.hours) + 7 
                    to_time = i + 7 
                    el.from_time = "0{}:00".format(from_time) if from_time < 10 else "{}:00".format(from_time)
                    el.to_time = "0{}:00".format(to_time) if to_time < 10 else "{}:00".format(to_time)
                    mark_hours(acts_sorted[day][2], el.from_time, el.to_time)
                    acts_sorted[day][0].append(el)
                    acts_sorted[day][1] -= el.hours
                    marked = True
                    break
                if(acts_sorted[day][2][i] == 0):
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







