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
		$("#head_img").css("margin-left", "30px");
		$("#help_panel h2").css("text-align", "center");

		$("#filter_panel").css("float", "left");
		$("#filter_panel").css("position", "relative");

		$("#container_right").css("float", "right");
		$("#chart_panel h2").css("text-align", "center");
		$("#chart_panel h2").css("margin-left", "0px");
		$("#map").css("margin-left", "0px");
		$("#map").css("margin-right", "0px");
	} else {
		bodyWidth = "500px";
		helpWidth = "";
		$("#header").css("text-align", "left");
		$("#head_img").css("margin-left", "0px");
		$("#help_panel h2").css("text-align", "left");

		$("#filter_panel").css("float", "none");
		$("#filter_panel").css("position", "fixed");

		$("#container_right").css("float", "left");
		$("#chart_panel h2").css("text-align", "left");
		$("#chart_panel h2").css("margin-left", "30px");
		$("#map").css("margin-left", "5px");
		$("#map").css("margin-right", "auto");
	}
	$("#container").css("width", bodyWidth);
	$("#help_panel").css("width", helpWidth);
}