import { load_auto_form_template, load_fixed_form_template } from "./functions.js";
let loaded = false

window.onload = ()=>{

	if(loaded == false){
		load_auto_form_template()
	} 
}
