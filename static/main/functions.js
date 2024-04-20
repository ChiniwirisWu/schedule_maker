const container_table = document.getElementById('container-table')
const previous_activities = JSON.parse(document.getElementById('inp-data').value)
console.log(previous_activities)
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


function sort_activity(a, b){
	console.log(a,b)
	return parseInt(a.from_time.substring(0,2)) - parseInt(b.from_time.substring(0,2))
}

function load_previous_activities(){
	for (let el of previous_activities){
		activities[el['day']][0].push(el)
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


async function show_activities(){
	const days = ['monday','tuesday','wednesday','thrusday', 'friday', 'saturday','sunday']
	const user_id = document.getElementById('user-id').value
	load_previous_activities()
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

	for (let d = 0; d < days.length; d++){
		let container = document.getElementById(`container-${days[d]}`)
		container.innerHTML = ''
		
		for(let k = 0; k < activities[days[d]][0].length;k++){
			let data = activities[days[d]][0][k]
			
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
			p_time_to.textContent = data['to']
			p_details_category.innerHTML = `<span style="background-color: ${colors[data['category']]}"></span>${data['category']}` 

			button.appendChild(i)
			button2.appendChild(i2)

			button.addEventListener('click', async()=>{
				let response = await fetch('cancel_activity', {
					method:'POST',
					body: JSON.stringify({user_id,'day':days[d], 'activity_index':k}),
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
			console.log(container_activity)
			container.appendChild(container_activity)
		}			 
	}
		
}


export { load_container_activities_template, show_activities }
