import { load_container_activities_template, add_activity , load_fixed_form_template, show_activities} from "./functions.js";

window.onload = ()=>{
	load_fixed_form_template() //default form 
	load_container_activities_template()
	show_activities()

	const form_activities = document.querySelector('.form-activities')
	form_activities.addEventListener('submit', (e)=>{
		e.preventDefault()
		add_activity(form_activities)
	})
}
