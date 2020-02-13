window.addEventListener('load', function() {
	
    var content = document.getElementsByClassName("grid-container");
	var navigatie_height = document.getElementById("navigatie").offsetHeight;
	content[0].style.marginTop = navigatie_height + "px";

	//Pentru rezolvarea restului de cerinte 
	var meniu = document.getElementsByTagName("nav");
	var grid_element = document.getElementById("grid-item-1"); //fotografia principala
	console.log(grid_element);

	var element_nou = document.createElement("div");
	element_nou.className = "menu-option";
	var text = document.createTextNode("TEST");
	element_nou.appendChild(text);

	meniu[0].appendChild(element_nou);
	meniu[0].removeChild(element_nou);
})


