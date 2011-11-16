// main functionality

var accidentTypes = {"Auto accident":{"icon":"icon_auto_accidents.png","color":"#967154"},
"Bicycle accident":{"icon":"icon_bicycle_accidents.png","color":"#847E1F"},
"Slip, trip, or fall":{"icon":"icon_slips.png","color":"#EF8833"},
"Clinical negligence":{"icon":"icon_clinical_negligence.png","color":"#E05A56"},
"Work-related accident":{"icon":"icon_work_related_accidents.png","color":"#3F7DD4"},
"Animal accident":{"icon":"icon_animal_accidents.png","color":"#46884C"},
"Food poisoning":{"icon":"icon_food_poisoning.png","color":"#7BC4BB"},
"Assault or hijacking":{"icon":"icon_assulates_and_hijacking.png","color":"#A5B342"},
"Sports injury":{"icon":"icon_sports_injury.png","color":"#9665C6"}
};
var colors = ["#967154","#847E1F","#EF8833","#E05A56","#3F7DD4","#46884C","#7BC4BB","#A5B342","#9665C6"];
var months = {"01":'Jan',"02":'Feb',"03":'Mar',"04":'Apr',"05":'May',"06":'Jun',"07":'Jul',"08":'Aug',"09":'Sep',"10":'Oct',"11":'Nov',"12":'Dec'};
var map; // google Map component
var dt; // dataTable component
var chart; // bar chart component

var markersArray = [];	// markers shown on Google Map
var filteredData;

var start_month = 1;  	// changing this value will affect on data filtering. connect this to slider UI
var end_month = 12;	// changing this value will affect on data filtering. connect this to slider UI
var start_hour = 0;	// 
var end_hour = 23;


$(document).ready(function() {
		// toggle help div with button
	$("#help_panel").hide();
	$("#help_button").click(function() {
		$("#help_panel").slideToggle(500);
		if ($("#help_button").attr("value") == "Show Help") {
			$("#help_button").attr("value", "Hide Help");
		} else /* value == Hide Help */ {
			$("#help_button").attr("value", "Show Help");
		}
		return false;
	});

	$("#keywordInput").val("");
	/* initialize main components  */
	init_table(accidentList.aaData);		/* initialize table component */
	init_map(accidentList.aaData);								/* initialize map component */
	drawBarChart(accidentList.aaData);		/* initialize bar chart component */
	updateAll();
		
	$('.monthSlider').selectToUISlider({
		tooltip: false,
		labels: 12,
		labelSrc: 'text',
		sliderOptions: {
			change: function(event, ui) {
				start_month = ui.values[0] + 1; // for some reason, values doesn't use the actual value on the option
				end_month = ui.values[1] + 1;
				updateAll();
			}
		}
	});
	
	$('.hourSlider').selectToUISlider({
		tooltip: false,
		labels: 7,
		sliderOptions: {
			change: function(event, ui) {
				start_hour = ui.values[0]; // spec says these are 0-based
				end_hour = ui.values[1];
				updateAll();
			}
		}
	});	
});

function init_table(data) {
	dt= $('#dTable').dataTable( {		/*  constructor with options */
		"aaData": data,			/* set the data in array format */
		"bPaginate": false,
		/*"sPaginationType": "full_numbers",		 pagination option */
		"bScrollInfinite": true,
		"bScrollCollapse": true,
		"sScrollY": "435px",
		"bJQueryUI": true,		/* use JQuery UI theme */
		"bFilter":false,		/* show keyword search */
		"bSort": true,			/* sorting enabled */
		"bInfo": false,					
		"bDestroy": true		// every time it's called, it destroys previous table and makes new one. 
	});
}
/* create google map object */
function init_map(data) {
    var latlng = new google.maps.LatLng(38.98920665, -76.94282413);	// define initial location
    var options = {
      zoom: 15,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"), options);
    updateMap(data);
}
/* init or redraw barchart */
function drawBarChart(data) {
	var chartData = convertToChartData(data);
	types = [];
	for (t in accidentTypes) types.push(t);
	$("#chart").empty();
	$("#chart").jqBarGraph( {
		data: chartData,	// (array) data to show. e.g [ [[5,2,3,1,...,3],'Jan.'], [[2,..,5],'Feb.'], ... [[...],'Dec.']]
		legends: types,		// (array) text for each colors in legend 
		legend: true,		
		legendWidth:150,
		colors: colors,		// (array) color information for each type
		type:false,			// stacked bar chart 
		width:500,			
		height:200,
		animate:false,  showValues:false
	});
}
function updateMap(data) {
	setMarkers(data);				// set markers on the map
}

/* using keyword filter and month/hour range slider, it filters original dataset and update all the components */ 
function updateAll() {
	filteredData = getFilteredData();
	init_table(filteredData);
	updateMap(filteredData);
	drawBarChart(filteredData);
}

function getMonth(str) {
	if (str == "Jan") {
		return "01";
	} else if (str == "Feb") {
		return "02";
	} else if (str == "Mar") {
		return "03";
	} else if (str == "Apr") {
		return "04";
	} else if (str == "May") {
		return "05";
	} else if (str == "Jun") {
		return "06";
	} else if (str == "Jul") {
		return "07";
	} else if (str == "Aug") {
		return "08";
	} else if (str == "Sep") {
		return "09";
	} else if (str == "Oct") {
		return "10";
	} else if (str == "Nov") {
		return "11";
	} else if (str == "Dec") {
		return "12";
	}
	
	return false;
}

// To use bar chart, accidents need to be aggregated by months and then by types
// e.g.  [[5,'Auto accident','#967154'],[3,'Bicycle accident','#847E1F'],...],'January'],    [[...],'February']   ,...
// To use bar chart, accidents need to be aggregated by months and then by types
// e.g. [[5,'Auto accidents','#967154'],[3,'Bicycle accidents','#847E1F'],...],'January'], [[...],'February'] ,...
function convertToChartData(dataSource) {
	// first, aggregates accident by types for each month
	var aggr = {};
	for (monthIndex in months) aggr[monthIndex]={};
	for (i in dataSource) {
		var accident = dataSource[i];
//		var a_month = accident[0].substr(5,2);
		var a_month = getMonth(accident[0].substring(0,3));
		var a_type = accident[3];
		// create key if it's the first accident for the month and the type
		if (!aggr.hasOwnProperty(a_month)) aggr[a_month]={};
		if (!aggr[a_month].hasOwnProperty(a_type)) aggr[a_month][a_type]=0;
		aggr[a_month][a_type]++;
	}
	// second, write aggr. numbers in result array
	resultArray = [];
	monthArray = [];
	for (monthIndex in months) monthArray.push(monthIndex); // monthArray := ['01','02',...'12']
		monthArray = monthArray.sort();
	for (mI in monthArray) {
		monthIndex = monthArray[mI];
		byMonth = [];
		byType = [];
		for(typeIndex in accidentTypes) {
			if (aggr[monthIndex][typeIndex]!=undefined)
				byType.push(aggr[monthIndex][typeIndex]);
			else
				byType.push(0);
		}
		byMonth.push(byType);
		byMonth.push(months[monthIndex]); // push 'January' instead of '01'
		resultArray.push(byMonth);
		/* the result will look like
		* [[5,8,6,1,...,3],'January'],[[3,2,5,...,1],'February'],...
		*/
		}
	return resultArray;
}

//clear all the markers in the map and show items in the list
function setMarkers(reportList) {
	clearMarkers();
	// format : accidentReport; ["2011-05-27", "20", "A.V. Williams Building", "Clinical negligence", "true", "38.99081609", "-76.93652093"]
	$.each(reportList, function(i,report) {
		// var report = reportList[i];
		var icon = "images/"+accidentTypes[report[3]].icon;
		var lat = parseFloat(report[5]) + (Math.random()*0.00025-0.000125);
		var lng = parseFloat(report[6]) + (Math.random()*0.00025-0.000125);
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat,lng),
			map : map,
			type : report[3],
			date : report[0],
			time : report[1],
			building: report[2],
			icon: icon
		});
		markersArray.push(marker);
		
		var content = '<h3>Accident Details</h3>'
			+ 'Type: ' + marker.type + '<br/>'
			+ 'Date: ' + marker.date + '<br/>'
			+ 'Time: ' + marker.time + '<br/>'
			+ 'Building: ' + marker.building;
		var infoWindow = new google.maps.InfoWindow({
		    content: content
		}); 
		
		google.maps.event.addListener(marker,'click',function() {
			// only open one window per marker
			infoWindow.open(map, marker);
		});
	});
}
// delete all markers from google Map
function clearMarkers() {
	if (markersArray) {
		for (i in markersArray) {
			markersArray[i].setMap(null);
		}
		markersArray.length = 0;
	}
}
//extended feature of datatable.  Retrieve a data array for rows after filtering. Returned in the current sorting order. //
$.fn.dataTableExt.oApi.fnGetFilteredData = function ( oSettings ) {
	var a = [];
	for ( var i=0, iLen=oSettings.aiDisplay.length ; i<iLen ; i++ ) {
		a.push(oSettings.aoData[ oSettings.aiDisplay[i] ]._aData);
	}
	return a;
};

// from the entire dataset, it returns items containing current keyword and within the date/hour range //
function getFilteredData() {
	var dataSource = accidentList.aaData;
	var filteringKeyword = $("#keywordInput").val();
	var filteredData = []; 
	for (var i in dataSource) {
		var item = dataSource[i];
		// check date/hour range first
//		var month = parseInt(item[0].split("-")[1],10);
		var month = parseInt(getMonth(item[0].split("-")[0]),10);
		if (month < start_month || month > end_month) continue;
		var hour = parseInt(item[1],10);
		if (hour < start_hour || hour > end_hour) continue;
		// check keyword filter
		if (filteringKeyword.trim() == "") { 
			filteredData.push(item);
			continue;
		}
		for(var propertyIndex in item) {
			var property = item[propertyIndex];
			if (property.toLowerCase().indexOf(filteringKeyword.toLowerCase()) != -1) {
				filteredData.push(item);
				break;
			}
		}
	}
	return filteredData;
}

// convert 0~12 to "00"~"12"
function intToStr(i) {
	if (i<10) return "0"+i;
	else return ""+i;
}

// string trim function
if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function() 
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}
