const container_table = document.getElementById('container-table')
const previous_activities = JSON.parse(document.getElementById('inp-data').value)
let min_hour = 7
let max_hour = 22
let avaliable_hours = max_hour - min_hour
let matrix_space =  avaliable_hours - 1
const activities = {
	'monday': [[],avaliable_hours, Array(matrix_space).fill(0)],
	'tuesday': [[],avaliable_hours, Array(matrix_space).fill(0)],
	'wednesday': [[],avaliable_hours, Array(matrix_space).fill(0)],
	'thrusday': [[],avaliable_hours, Array(matrix_space).fill(0)],
	'friday': [[],avaliable_hours, Array(matrix_space).fill(0)],
	'saturday': [[],avaliable_hours, Array(matrix_space).fill(0)],
	'sunday': [[],avaliable_hours, Array(matrix_space).fill(0)],
}
const activities_auto = []

async function add_uncancel_activities_event(){
	const buttons = document.querySelectorAll('.btn-uncancel')
	const user_id = document.getElementById('user-id').value
	const token = await fetch('get_csrf_token').then(response=>response.json())
	buttons.forEach((el, index)=>{
		el.addEventListener('click', async(e)=>{
			let request = await fetch('uncancel_activity', {
				method: 'POST',
				body: JSON.stringify({user_id, 'day': el.dataset.day, 'from_time': el.dataset.from_time}),
				headers: {
					'Content-type': 'application/json',
					'X-CSRFToken': token.csrf_token
				}
			})
			if (request.status == 200){
				location.reload(true)
			}
		})
	})
}


function round_hour(hour){
	const minutes = parseInt(hour.substring(3,5))
	hour = parseInt(hour.substring(0,2))
	if(minutes > 0){
		return hour + 1
	}
	return hour
}

function is_hours_avaliable(register, from, to){
	from = parseInt(from.substring(0,2))
	to = round_hour(to)
	for(let i = from; i < to; i++){
		if(register[i - 7] == 1){
			return false
		}
	}
	return true
}

function mark_hours(register, from, to){
	from = parseInt(from.substring(0,2))
	to = round_hour(to)
	for(let i = from; i < to; i++){
		register[i - 7] = 1	
	}
}

function sort_activity(a, b){
	return parseInt(a.from_time.substring(0,2)) - parseInt(b.from_time.substring(0,2))
}

function load_previous_activities(){
	const days = ['monday','tuesday','wednesday','thrusday','friday','saturday','sunday']
	for (let el of previous_activities){
		if(el.act_type == 'fixed'){
			activities[el['day']][0].push(el)
			mark_hours(activities[el['day']][2], el['from_time'], el['to_time'])
		}
		if(el.act_type == 'auto'){
			activities_auto.push(el)
		}
	}
	for (let [key, value] of Object.entries(activities)){
		activities[key][0].sort(sort_activity)
	}
}

async function load_container_activities_template(){
	const DATES = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thrusday','Friday','Saturday']
	const df = document.createDocumentFragment()
	for (let date of DATES) {
		const container = document.createElement('div')
		const h3_date = document.createElement('h3')
		h3_date.style.color= '#eee'
		const div_activities = document.createElement('div')
		div_activities.setAttribute('id', `container-${date.toLowerCase()}`)
		h3_date.textContent = date
		container.appendChild(h3_date)
		container.appendChild(div_activities)
		df.appendChild(container)
	}
	container_table.appendChild(df)
}


function fill_activities_to_show(activities_to_show){
	const days = ['monday','tuesday','wednesday','thrusday','friday','saturday','sunday']
	const auto_act = []
	for (let el of previous_activities){
		if(el.act_type == 'auto'){
			auto_act.push(el)
		}
	}

	for (let el of auto_act){
		let setted = false
		for (let day of days){

			if(setted == true) break;
			let counter = 0

			for(let i = 0; i < activities_to_show[day][2].length; i++){
				if(counter == el['hours']){
					let index = i - el['hours']
					el['from_time'] =  index + 7 > 9  ? `${index + 7}:00` : `0${index + 7}:00`
					el['to_time'] = index + 7 + el['hours'] > 9 ? `${index + 7 + el['hours']}:00` : `0${index + 7 + el['hours']}:00` 
					if(is_hours_avaliable(activities_to_show[day][2], el['from_time'],el['to_time'])){
						mark_hours(activities_to_show[day][2], el['from_time'], el['to_time'])
						el['day'] = day
						activities_to_show[day][0].push(el)
						activities_to_show[day][0].sort(sort_activity)
						activities_to_show[day][1] -= el['hours']
						setted = true
						break
					}
				}

				if(activities_to_show[day][2][i] == 0){
					counter += 1
				}

				if(activities_to_show[day][2][i] == 1){
					counter = 0
				}

			}
		}
	}
	console.log(activities_to_show)
}

async function show_activities(){
	const days = ['monday','tuesday','wednesday','thrusday', 'friday', 'saturday','sunday']
	const user_id = document.getElementById('user-id').value
	load_previous_activities()
	const activities_to_show = {}
	Object.assign(activities_to_show, activities)
	fill_activities_to_show(activities_to_show)
	const colors = {
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

	let token = await fetch('get_csrf_token').then(response=>response.json())

	for (let day of days){
		let container = document.getElementById(`container-${day}`)
		container.innerHTML = ''
		
		for(let k = 0; k < activities_to_show[day][0].length;k++){
			let data = activities_to_show[day][0][k]
			
			if(data['show'] == false){
				continue
			}

			let inp_user_id = document.createElement('input')
			let container_activity = document.createElement('div')
			let container_details = document.createElement('div')
			let container_time = document.createElement('div')
			let p_details_name = document.createElement('p')
			let p_details_category = document.createElement('p')
			let p_time_from = document.createElement('p')
			let p_time_to = document.createElement('p')
			let button = document.createElement('button')
			let button2 = document.createElement('button')
			let i2 = document.createElement('i')
			let i = document.createElement('i')

			container_activity.classList.add('day-activity')
			container_details.classList.add('activity-details')
			container_time.classList.add('activity-time')
			p_details_name.classList.add('details-name')
			p_details_category.classList.add('details-category')
			i.classList.add('fa-solid', 'fa-trash')
			i2.classList.add('fa-solid', 'fa-check')
			inp_user_id.setAttribute('name', 'user_id')
			inp_user_id.setAttribute('type', 'hidden')
			inp_user_id.setAttribute('value', user_id)

			p_details_name.textContent = data['name'] 
			p_time_from.textContent = data['from_time']
			p_time_to.textContent = data['to_time']
			p_details_category.innerHTML = `<span style="background-color: ${colors[data['category']]}"></span>${data['category']}` 

			button.appendChild(i)
			button2.appendChild(i2)

			button.addEventListener('click', async()=>{
				let response = await fetch('cancel_activity', {
					method:'POST',
					body: JSON.stringify({user_id,'day':day, 'from_time':data['from_time']}),
					headers: {
						'Content-type': 'application/json',
						'X-CSRFToken': token.csrf_token
					},
				})
				if(response.status == 200){
					location.reload(true)
				}
			})

			container_details.appendChild(p_details_name)
			container_details.appendChild(p_details_category)
			container_time.appendChild(p_time_from)
			container_time.appendChild(p_time_to)
			container_activity.appendChild(container_details)
			container_activity.appendChild(container_time)
			container_time.appendChild(button)
			container_time.appendChild(button2)
			//container_activity.appendChild(button)
			//container_activity.appendChild(button2)
			container.appendChild(container_activity)
		}			 
	}
		
}


export { load_container_activities_template, show_activities, add_uncancel_activities_event, fill_activities_to_show}
