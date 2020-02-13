var meniu_phone;
var meniu_open = 0;
var menu_options;
var appended = 0;

window.addEventListener('load', function() {

	meniu_button = document.getElementsByClassName("phone-view");
	meniu_phone = document.querySelector(".phone-view>ul");
	
	meniu_button[0].onclick = menuClick;

	menu_options = document.getElementsByClassName("menu-option");
	var listitems = [];

	for (i = 0; i < menu_options.length; i++)
	{
		listitems[i] = document.createElement("li");
		listitems[i].innerHTML = menu_options[i].innerHTML;
		meniu_phone.appendChild(listitems[i]);
	}
})

function menuClick(){
	console.log("asdasd");
	if(meniu_open == 0)
	{
		meniu_phone.style.display = "block";
		meniu_open = 1;
	}
	else {
		meniu_phone.style.display = "none";
		meniu_open = 0;
	}
}



