const form_activity = document.querySelector('.form-activities')

function add_activity(form){
	const form_data = new FormData(form)
	const data = Object.fromEntries(form_data.entries())
	console.log(data)
	const container = document.getElementById(`container-${data['day']}`)
	const h3 = data['day']
	container.innerHTML = h3
}

/* Determina cuál formulario se muestra entre "FIXED" y "AUTO" */
function change_form_template(template_name){
	if(template_name == 'fixed'){
		load_fixed_form_template()
	} else{
		load_auto_form_template()
	}
}

/* Crea cada contenedor donde irán guardadas las actividades a agregar en la base de datos */
async function load_container_activities_template(){
	const DATES = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thrusday','Friday','Saturday']
	const parent_node = document.getElementById('container')
	const df = document.createDocumentFragment()
	for (let date of DATES) {
		const container = document.createElement('div')
		const h3_date = document.createElement('h3')
		container.setAttribute('id', `container-${date.toLowerCase()}`)
		h3_date.textContent = date
		container.appendChild(h3_date)
		df.appendChild(container)
	}
	const container_submit = document.createElement('div')
	const button = document.createElement('button')
	container_submit.setAttribute('id', 'container-submit')
	button.textContent = 'Create New Schedule'
	container_submit.appendChild(button)
	df.appendChild(container_submit)
	parent_node.appendChild(df)
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
	button.setAttribute('form', 'form-activities')
	label_hours.textContent = 'Hours: '
	label_importance.textContent = 'Importance: '
	input_hours.setAttribute('type', 'number')
	input_importance.setAttribute('type', 'number')
	input_hours.setAttribute('name', 'hours')
	input_importance.setAttribute('name', 'importance')

	select_type.addEventListener('change', (e)=>{
		change_form_template(e.target.value)
	})

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
	button.setAttribute('form', 'form-activities')
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


export {load_container_activities_template, add_activity, load_fixed_form_template}

