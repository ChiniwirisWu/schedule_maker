import { load_auto_form_template, load_fixed_form_template } from "./functions.js";

let loaded = false

window.onload = async ()=>{

	if(loaded == false){
		await load_auto_form_template()
	} 
	let form_activities = document.querySelector('.form-activities')
	form_activities.onsubmit = async (e)=>{
		e.preventDefault()
		form_activities = document.querySelector('.form-activities')
		const data = new FormData(form_activities)
		//TODO: get how the fuck use formData
		const csrf_token = await fetch('/get_csrf_token').then(data=>data.json())
		const response = await fetch('/add_activity', {
			method: 'POST',
			body: JSON.parse(data),
			headers: {'Content-type':'application/json', 'X-CSRF-Token':csrf_token.csrf_token}
		})	
		if(response.status == 200){
			window.location.reload()
		} else if(response.status == 400){
			username = document.getElementById('username-inp').value
			password = document.getElementById('password-inp').value
			await fetch('/log_out', {
				method: 'POST',
				body: JSON.parse({'username':username, 'password':password}),
				headers: {'Content-type':'application/json'}
			})
			window.location.replace('/view_login')
		}
	}
}
