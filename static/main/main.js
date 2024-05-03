import { load_container_activities_template, load_previous_activities ,show_activities, add_uncancel_activities_event } from "./functions.js";

window.onload = async (e)=>{
	await load_container_activities_template()
	await load_previous_activities()
	await show_activities()
	await add_uncancel_activities_event()
}

