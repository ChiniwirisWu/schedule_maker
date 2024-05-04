//crea cada una de las actividades definidas en el formulario y lo agrupa en un contenedor por dia
const form_activity = document.getElementById('form-activities')
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
	for (let day of days){
		let container = document.getElementById(`container-${day}`)
		container.innerHTML = ''
		
		for(let k = 0; k < activities_to_show[day][0].length;k++){
			let container_activity = document.createElement('div')
			let container_details = document.createElement('div')
			let container_time = document.createElement('div')
			let p_details_name = document.createElement('p')
			let p_details_category = document.createElement('p')
			let p_time_from = document.createElement('p')
			let p_time_to = document.createElement('p')
			let button = document.createElement('button')
			let i = document.createElement('i')
			let data = activities_to_show[day][0][k]


			container_activity.classList.add('day-activity')
			container_details.classList.add('activity-details')
			container_time.classList.add('activity-time')
			p_details_name.classList.add('details-name')
			p_details_category.classList.add('details-category')
			i.classList.add('fa-solid', 'fa-trash')

			p_details_name.textContent = data['name'] 
			p_time_from.textContent = data['from_time']
			p_time_to.textContent = data['to_time']
			p_details_category.innerHTML = `<span style="background-color: ${colors[data['category']]}"></span>${data['category']}` 

			button.addEventListener('click', (e)=>{
				//TODO: Remove elements from the automatic activities and from activities
				if(data['act_type'] == 'fixed'){
					activities[day][0].splice(activities[day][0].indexOf(data),1)
					show_activities()
				}
				else if(data['act_type'] == 'auto'){
					activities['auto'][0].splice(activities['auto'][0].indexOf(data), 1)
					show_activities()
				}
			})
			container_details.appendChild(p_details_name)

			container_details.appendChild(p_details_category)
			container_time.appendChild(p_time_from)
			container_time.appendChild(p_time_to)
			button.appendChild(i)
			container_activity.appendChild(container_details)
			container_activity.appendChild(container_time)
			container_activity.appendChild(button)

			container.appendChild(container_activity)
	}
}
}




// Formulario para actividades que tengan horario automatico
async function load_auto_form_template(){
	form_activity.innerHTML = ''
	const df = document.createDocumentFragment()

	let list_type = ['auto','fixed'] 
	let list_categories = ['sports','university','leasures','study','courses','friends','family','home','workout']
	let h3_welcome = document.createElement('h3')
	let label_name = document.createElement('label')
	let input_name = document.createElement('input')
	let button = document.createElement('button')
	let ital = document.createElement('i')
	let label_hours = document.createElement('label')
	let input_hours = document.createElement('input')
	let label_weight = document.createElement('label')
	let input_weight = document.createElement('input')
	let username_inp = document.createElement('input')
	let password_inp = document.createElement('input')
	username_inp.setAttribute('name', 'username')
	username_inp.setAttribute('type', 'hidden')
	username_inp.setAttribute('value', document.getElementById('username-inp').value)
	password_inp.setAttribute('name', 'password')
	password_inp.setAttribute('type', 'hidden')
	password_inp.setAttribute('value', document.getElementById('password-inp').value)


	//set properties to html elements
	h3_welcome.textContent = 'Create each activities for your week! (˶ᵔ ᵕ ᵔ˶)' 
	let select_type = create_select_elements_list_type(list_type, 'Type of activity: ', 'act_type', 'select-type')
	let select_category = create_select_elements_list(list_categories, 'Category: ', 'category', 'select-category')

	label_name.textContent = 'Name: '
	input_name.setAttribute('name', 'name')
	ital.classList.add('fa-solid','fa-plus')
	button.setAttribute('id', 'btn-submit')
	label_hours.textContent = 'Hours: '
	label_weight.textContent = 'weight: '
	input_hours.setAttribute('type', 'number')
	input_weight.setAttribute('type', 'number')
	input_hours.setAttribute('name', 'hours')
	input_weight.setAttribute('name', 'weight')

	button.appendChild(ital)
	df.appendChild(h3_welcome)	
	df.appendChild(select_type)
	df.appendChild(select_category)
	df.appendChild(label_name)
	df.appendChild(input_name)
	df.appendChild(label_hours)
	df.appendChild(input_hours)
	df.appendChild(label_weight)
	df.appendChild(input_weight)
	df.appendChild(username_inp)
	df.appendChild(password_inp)
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
	let username_inp = document.createElement('input')
	let password_inp = document.createElement('input')
	username_inp.setAttribute('name', 'username')
	username_inp.setAttribute('type', 'hidden')
	username_inp.setAttribute('value', document.getElementById('username-inp').value)
	password_inp.setAttribute('name', 'password')
	password_inp.setAttribute('type', 'hidden')
	password_inp.setAttribute('value', document.getElementById('password-inp').value)

	//set properties to html elements
	h3_welcome.textContent = 'Create each activities for your week! (˶ᵔ ᵕ ᵔ˶)' 
	let select_type = create_select_elements_list_type(list_type, 'Type of activity: ', 'act_type', 'select-type')
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
	input_from.setAttribute('name', 'from_time')
	input_to.setAttribute('name', 'to_time')
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
	df.appendChild(username_inp)
	df.appendChild(password_inp)
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

	select.addEventListener('change', (e)=>{
		change_form_template(e.target.value)
	})

	df.appendChild(label)
	df.appendChild(select)
	return df
	
}

/* Determina cuál formulario se muestra entre "FIXED" y "AUTO" */
function change_form_template(template_name){
	if(template_name == 'fixed'){
		load_fixed_form_template()
	} else{
		load_auto_form_template()
	}
}


export { load_auto_form_template, load_fixed_form_template }

