const form_activity = document.querySelector('.form-activities')
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

function add_activity(form){
	const form_data = new FormData(form)
	const data = Object.fromEntries(form_data)
	if (data['from'] == undefined){
		// I am in a automatic form

	} else{
		// I am at fixed form
		const hours = diference_of_time(data['from'], data['to']) 
		if (activities[data['day']][1] - hours >= 0 && is_hours_avaliable(activities[data['day']][2], data['from'], data['to'])){
			mark_hours(activities[data['day']][2], data['from'], data['to'])	
			activities[data['day']][0].push(data)
			activities[data['day']][1] -= hours
			console.log(activities)
			activities[data['day']][0].sort(sort_activity)
			show_activities()
		}
	}
}

function sort_activity(a, b){
	console.log(a,b)
	return parseInt(a.from.substring(0,2)) - parseInt(b.from.substring(0,2))
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


function unmark_hours(register, from, to){
	from = parseInt(from.substring(0,2))
	to = round_hour(to)
	for(let i = from; i < to; i++){
		register[i - 7] = 0	
	}
}

//crea cada una de las actividades definidas en el formulario y lo agrupa en un contenedor por dia
function show_activities(){
	const days = ['monday','tuesday','wednesday','thrusday', 'friday', 'saturday','sunday']
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

	for (let d = 0; d < days.length; d++){
		let container = document.getElementById(`container-${days[d]}`)
		container.innerHTML = ''
		
		for(let k = 0; k < activities[days[d]][0].length;k++){
			let container_activity = document.createElement('div')
			let container_details = document.createElement('div')
			let container_time = document.createElement('div')
			let p_details_name = document.createElement('p')
			let p_details_category = document.createElement('p')
			let p_time_from = document.createElement('p')
			let p_time_to = document.createElement('p')
			let button = document.createElement('button')
			let i = document.createElement('i')
			let data = activities[days[d]][0][k]

			container_activity.classList.add('day-activity')
			container_details.classList.add('activity-details')
			container_time.classList.add('activity-time')
			p_details_name.classList.add('details-name')
			p_details_category.classList.add('details-category')
			i.classList.add('fa-solid', 'fa-trash')

			p_details_name.textContent = data['name'] 
			p_time_from.textContent = data['from']
			p_time_to.textContent = data['to']
			p_details_category.innerHTML = `<span style="background-color: ${colors[data['category']]}"></span>${data['category']}` 

			button.addEventListener('click', (e)=>{
				activities[days[d]][0].splice(k, 1)
				unmark_hours(activities[days[d]][2], data['from'], data['to'])
				button.parentNode.parentNode.removeChild(button.parentNode)
			})

			button.appendChild(i)
			container_details.appendChild(p_details_name)
			container_details.appendChild(p_details_category)
			container_time.appendChild(p_time_from)
			container_time.appendChild(p_time_to)
			container_activity.appendChild(container_details)
			container_activity.appendChild(container_time)
			container_activity.appendChild(button)
			console.log(container_activity)
			container.appendChild(container_activity)
		}			 
	}
		
}


//calcula la diferencia de horas entre dos horas en formato militar
function diference_of_time(from, to){
	const from_hours = from.substring(0,2)
	const from_minutes = from.substring(3,5)
	const to_hours = to.substring(0,2)
	const to_minutes = to.substring(3,5)
	const from_total_minutes = (parseInt(from_hours) * 60) + parseInt(from_minutes)
	const to_total_minutes = (parseInt(to_hours) * 60) + parseInt(to_minutes)
	return Math.ceil((to_total_minutes - from_total_minutes) / 60)
}

/* Determina cuál formulario se muestra entre "FIXED" y "AUTO" */
function change_form_template(template_name){
	if(template_name == 'fixed'){
		load_fixed_form_template()
	} else{
		load_auto_form_template()
	}
}

function round_hour(hour){
	const minutes = parseInt(hour.substring(3,5))
	hour = parseInt(hour.substring(0,2))
	if(minutes > 0){
		return hour + 1
	}
	return hour
}


/* Crea cada contenedor donde irán guardadas las actividades a agregar en la base de datos */
async function load_container_activities_template(){
	const DATES = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thrusday','Friday','Saturday']
	const parent_node = document.getElementById('container')
	const container_submit = document.createElement('div')
	const button = document.getElementById('btn-create-schedule')
	const form = document.getElementById('form-create-schedule')
	const df = document.createDocumentFragment()

	for (let date of DATES) {
		const container = document.createElement('div')
		const h3_date = document.createElement('h3')
		const div_activities = document.createElement('div')
		div_activities.setAttribute('id', `container-${date.toLowerCase()}`)
		h3_date.textContent = date
		container.appendChild(h3_date)
		container.appendChild(div_activities)
		df.appendChild(container)
	}

	button.addEventListener('click', (e)=>{
			document.getElementById('inp-data').value = JSON.stringify(activities)
	})

	parent_node.insertBefore(df, form)
}

// Formulario para actividades que tengan horario automatico
async function load_auto_form_template(){
	form_activity.innerHTML = ''
	const df = document.createDocumentFragment()

	let list_type = ['auto','fixed'] 
	let list_categories = ['sports','university','leasures','study','courses','friends','family','home','workout']
	let list_days = ['monday','tuesday','wednesday','thrusday','friday','saturday','sunday']
	let h3_welcome = document.createElement('h3')
	let label_name = document.createElement('label')
	let input_name = document.createElement('input')
	let button = document.createElement('button')
	let ital = document.createElement('i')
	let label_hours = document.createElement('label')
	let input_hours = document.createElement('input')
	let label_importance = document.createElement('label')
	let input_importance = document.createElement('input')

	//set properties to html elements
	h3_welcome.textContent = 'Create each activities for your week! (˶ᵔ ᵕ ᵔ˶)' 
	let select_type = create_select_elements_list_type(list_type, 'Type of activity: ', 'type', 'select-type')
	let select_category = create_select_elements_list(list_categories, 'Category: ', 'category', 'select-category')
	let select_day = create_select_elements_list(list_days, 'Days: ', 'day', 'select-day')

	label_name.textContent = 'Name: '
	input_name.setAttribute('name', 'name')
	ital.classList.add('fa-solid','fa-plus')
	button.setAttribute('id', 'btn-submit')
	label_hours.textContent = 'Hours: '
	label_importance.textContent = 'Importance: '
	input_hours.setAttribute('type', 'number')
	input_importance.setAttribute('type', 'number')
	input_hours.setAttribute('name', 'hours')
	input_importance.setAttribute('name', 'importance')

	button.appendChild(ital)
	df.appendChild(h3_welcome)	
	df.appendChild(select_type)
	df.appendChild(select_category)
	df.appendChild(select_day)
	df.appendChild(label_name)
	df.appendChild(input_name)
	df.appendChild(label_hours)
	df.appendChild(input_hours)
	df.appendChild(label_importance)
	df.appendChild(input_importance)
	df.appendChild(button)
	form_activity.removeAttribute('id')
	form_activity.setAttribute('id', 'form-auto')
	form_activity.appendChild(df)

}


// Formulario para actividades que tengan horario automatico
async function load_fixed_form_template(){
	form_activity.innerHTML = ''
	const df = document.createDocumentFragment()

	let list_type = ['fixed','auto']
	let list_categories = ['sports','university','leasures','study','courses','friends','family','home','workout']
	let list_days = ['monday','tuesday','wednesday','thrusday','friday','saturday','sunday']
	let h3_welcome = document.createElement('h3')
	let label_name = document.createElement('label')
	let input_name = document.createElement('input')
	let button = document.createElement('button')
	let ital = document.createElement('i')
	let label_from = document.createElement('label')
	let input_from = document.createElement('input')
	let label_to = document.createElement('label')
	let input_to = document.createElement('input')

	//set properties to html elements
	h3_welcome.textContent = 'Create each activities for your week! (˶ᵔ ᵕ ᵔ˶)' 
	let select_type = create_select_elements_list_type(list_type, 'Type of activity: ', 'type', 'select-type')
	let select_category = create_select_elements_list(list_categories, 'Category: ', 'category', 'select-category')
	let select_day = create_select_elements_list(list_days, 'Days: ', 'day', 'select-day')

	label_name.textContent = 'Name: '
	input_name.setAttribute('name', 'name')
	ital.classList.add('fa-solid','fa-plus')
	button.setAttribute('id', 'btn-submit')
	label_from.textContent = 'From: '
	label_to.textContent = 'To: '
	input_from.setAttribute('type', 'time')
	input_to.setAttribute('type', 'time')
	input_from.setAttribute('name', 'from')
	input_to.setAttribute('name', 'to')
	button.appendChild(ital)

	df.appendChild(h3_welcome)	
	df.appendChild(select_type)
	df.appendChild(select_category)
	df.appendChild(select_day)
	df.appendChild(label_name)
	df.appendChild(input_name)
	df.appendChild(label_from)
	df.appendChild(input_from)
	df.appendChild(label_to)
	df.appendChild(input_to)
	df.appendChild(button)
	form_activity.removeAttribute('id')
	form_activity.setAttribute('id', 'form-fixed')
	form_activity.appendChild(df)

}

function create_select_elements_list_type(list, label_text, name, id){
	let df = document.createDocumentFragment()
	let label = document.createElement('label')
	let select = document.createElement('select')
	select.setAttribute('name', name)
	label.textContent = label_text
	select.setAttribute('id', id)

	for(let i = 0; i < list.length; i++){
		let option = document.createElement('option')
		option.setAttribute('name', name)
		option.setAttribute('value', list[i])
		option.textContent = list[i]
		select.appendChild(option)
	}

	select.addEventListener('change', (e)=>{
		change_form_template(e.target.value)
	})

	df.appendChild(label)
	df.appendChild(select)
	return df
	
}

function create_select_elements_list(list, label_text, name, id){
	let df = document.createDocumentFragment()
	let label = document.createElement('label')
	let select = document.createElement('select')
	select.setAttribute('name', name)
	label.textContent = label_text
	select.setAttribute('id', id)

	for(let i = 0; i < list.length; i++){
		let option = document.createElement('option')
		option.setAttribute('name', name)
		option.setAttribute('value', list[i])
		option.textContent = list[i]
		select.appendChild(option)
	}

	df.appendChild(label)
	df.appendChild(select)
	return df
	
}


export {load_container_activities_template, add_activity, load_fixed_form_template, show_activities}

