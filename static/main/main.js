import { load_container_activities_template, show_activities, add_uncancel_activities_event } from "./functions.js";

window.onload = async (e)=>{
	await load_container_activities_template()
	await show_activities()
	await add_uncancel_activities_event()
}

