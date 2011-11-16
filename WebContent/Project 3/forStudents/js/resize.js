window.onload = checkAvailableWidth;
window.onresize = checkAvailableWidth;
function checkAvailableWidth() {
	var numClientWidth = document.body.clientWidth;
	var bodyWidth;
	var helpWidth
	
	if (numClientWidth  > 1020) {
		bodyWidth = "1015px";
		helpWidth = "943px";
		$("#header").css("text-align", "center");
		$("#help_panel h2").css("text-align", "center");
		$("#chart_panel h2").css("text-align", "center");
		$("#chart_panel h2").css("margin-left", "0px");
		$("#map").css("float", "right");
		$("#map").css("margin-left", "0px");
		$("#map").css("margin-right", "0px");
	} else {
		bodyWidth = "500px";
		helpWidth = "";
		$("#header").css("text-align", "left");
		$("#help_panel h2").css("text-align", "left");
		$("#chart_panel h2").css("text-align", "left");
		$("#chart_panel h2").css("margin-left", "30px");
		$("#map").css("float", "left");
		$("#map").css("margin-left", "5px");
		$("#map").css("margin-right", "auto");
	}
	$("#container").css("width", bodyWidth);
	$("#help_panel").css("width", helpWidth);
}