window.onload = checkAvailableWidth;
window.onresize = checkAvailableWidth;
function checkAvailableWidth() {
	var numClientWidth = document.body.clientWidth;
	var bodyWidth;
	var helpWidth
	
	if (numClientWidth  > 1010) {
		bodyWidth = "1010px";
		helpWidth = "941px";
		$("#header").css("text-align", "center");
		$("#head_img").css("margin-left", "30px");
		$("#help_panel h2").css("text-align", "center");
		$("#help_panel").css({"position": "", "bottom" : ""});

		$("#container_right").css("float", "right");
		$("#chart_panel h2").css({"text-align": "center","margin-left": "0px"});
		$("#map").css("margin-left", "0px");
	} else {
		bodyWidth = "500px";
		helpWidth = "436px";
		$("#header").css("text-align", "left");
		$("#head_img").css("margin-left", "0px");
		$("#help_panel h2").css("text-align", "left");
		$("#help_panel").css({"position": "fixed", "bottom" : "0px"});

		$("#container_right").css("float", "left");
		$("#chart_panel h2").css({"text-align": "left","margin-left": "30px"});
		$("#map").css("margin-left", "5px");
	}
	$("#container").css("width", bodyWidth);
	$("#help_panel").css("width", helpWidth);
}