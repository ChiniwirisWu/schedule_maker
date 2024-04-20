import { load_container_activities_template, show_activities } from "./functions.js";

window.onload = async (e)=>{
	await load_container_activities_template()
	await show_activities()
}

