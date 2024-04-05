const form_activity = document.getElementById('form-activity')
const select_type = document.getElementById('select-type')


function showAutoForm(){
	form_activity.innerHTML = ''
	const df = document.createDocumentFragment()

	let list_type = ['fixed','auto']
	let list_categories = ['sports','university','leasures','study','courses','friends','family','home','workout']
	let list_days = ['monday','tuesday','wednesday','thrusday','friday','saturday','sunday']
	let h3_welcome = document.createElement('h3')
	let label_name = document.createElement('label')
	let input_name = document.createElement('input')
	let label_from = document.createElement('label')
	let input_from = document.createElement('input')
	let label_to = document.createElement('label')
	let input_to = document.createElement('input')
	let button = document.createElement('button')
	let ital = document.createElement('i')

	//set properties to html elements
	h3_welcome.textContent = 'Create each activities for your week! (˶ᵔ ᵕ ᵔ˶)' 
	let select_type = create_select_elements_list(list_type, 'Type of activity: ', 'type', 'select_type')
	let select_category = create_select_elements_list(list_categories, 'Category: ', 'category', 'select-category')
	let select_day = create_select_elements_list(list_days, 'Days: ', 'day', 'select-day')

	label_name.textContent = 'Name: '
	label_from.textContent = 'From: '
	label_to.textContent = 'To: '
	input_name.setAttribute('name', 'name')
	input_from.setAttribute('name', 'from')
	input_to.setAttribute('name', 'to')
	input_from.setAttribute('type', 'time')
	input_to.setAttribute('type', 'time')
	ital.classList.add('fa-solid','fa-plus')
	button.appendChild(ital)

	//create form
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
	form_activity.appendChild(df)
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

	df.appendChild(label)
	df.appendChild(select)
	return df
	
}

showAutoForm()
