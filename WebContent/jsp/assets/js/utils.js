
var numev = 1;
var sliderHeight = "100px";
var allEvents = null;

var start_date = moment().format('YYYY-MM-DD');
var end_date = moment().add(7,'days').format('YYYY-MM-DD');


function printCellEvento(containerId, indiceEvento, cellId, titolo, linkEvento, comune, posto, linkPosto, data, descrizione, distanza, tags, meteo){
	document.getElementById(containerId).innerHTML = 	document.getElementById(containerId).innerHTML + 
			"<a name ='anchor_"+cellId+"' id ='anchor_"+cellId+"'/></a>" +
			" <div class='event_box'><div class='event_info'>" +
			"<div class='event_title' style='font-size:16px'>" +
			"<span style='font-size:24px; color:red;'>"+indiceEvento+".</span>&nbsp;&nbsp;&nbsp;<a href='"+ linkEvento +"' target=_'blank'>"+titolo+"</a></div> " +
			"<div class='speakers'><strong>Luogo: </strong><span> " + comune + "<a href='"+ linkPosto +"' target=_'blank'><b>"+posto+"</b></a></span></div>"
			+ distanza + data + meteo + tags +
			//"<div class='sliderb' style='border:1px solid;padding:10px' id='event"+cellId+"'>"+descrizione+"</div>" +
			//"<div class='slider_menu' id='slider_menu_"+cellId+"'></div></div></div>";
			"<div><a data-toggle='collapse' data-target='#readMore"+cellId+"' aria-expanded='false' aria-controls='readMore"+cellId+"' style='text-decoration:underline; color:#f50136;''/><b>Leggi tutto &#187;</b></a></div>"+
			"<div class='collapse' id='readMore"+cellId+"'><div class ='card card-body'>" + descrizione + "</div>";
}


function printEventi(data,i, cellOffset, container){
	var obj = data;
	
	var dat_da = new Date(obj.data_da);
    var dat_a = new Date(obj.data_a);
    var da = dat_da.getDate()  + "/" + (dat_da.getMonth()+1) + "/" + dat_da.getFullYear();
    var a = dat_a.getDate()  + "/" + (dat_a.getMonth()+1) + "/" + dat_a.getFullYear();
    
    var distanza = "";
    if (obj.distanza != null && obj.distanza != ''){
    	distanza = "<div class='event_distance'><strong style='color: black;'>Distanza: </strong><span> circa "+parseInt(obj.distanza)+" km";
    	if(obj.centro_distanza != null && obj.centro_distanza != '') 
    		distanza = distanza + " da " + obj.centro_distanza;
    	distanza = distanza + "</span></div>";	
    }
    
    
    var meteoSingleLine = "";
    var meteo = "";
    if(obj.previsioni_evento && obj.previsioni_evento.length > 0){
    	if (obj.previsioni_evento.length == 1 && da == a){	
    		meteoSingleLine = "<span style='color:black'> | </span>" + obj.previsioni_evento[0].bollettino.condizioni + "  " + obj.previsioni_evento[0].bollettino.temp + "°C";
    	}
    	else{
    		meteoSingleLine= "<span style='color:black'> | </span><a data-toggle='collapse' data-target='#meteoCard"+cellOffset+"' aria-expanded='false' aria-controls='meteoCard"+cellOffset+"' style='text-decoration:underline;'/>Elenco previsioni meteo &#187;</a>"
    		meteo = "<div class='collapse event_meteo' id='meteoCard"+cellOffset+"'><div class ='col-sm-6 card card-body'><ul class='list-group list-group-flush'>";
    		var z;
    		for ( z = 0; z < obj.previsioni_evento.length; z++){
    			var dat = new Date(obj.previsioni_evento[z].bollettino.data);
    			var dataFormatted = dat.getDate()  + '/' + (dat.getMonth()+1) + '/' + dat.getFullYear();
    			
    			var startDate = new Date(start_date.slice(0,4), start_date.slice(5,7)-1, start_date.slice(8,10));
    			var endDate   = new Date(end_date.slice(0,4), end_date.slice(5,7)-1, end_date.slice(8,10));
    			var date_f  = new Date(dat.getFullYear(), dat.getMonth(), dat.getDate());
    					
    			var evidenzia = "";
    			if (date_f >= startDate && date_f <= endDate && date_f >= dat_da && date_f <= dat_a){
    				evidenzia = "style='color:black;'";
    			}
    			meteo = meteo + "<li class='list-group-item'"+evidenzia+">" + dataFormatted + ": " + obj.previsioni_evento[z].bollettino.condizioni + "  " + obj.previsioni_evento[z].bollettino.temp + "°C</li>";
    		}
    		meteo = meteo + "</ul></div></div>";
    	}
    }
    
    var date = "";
    if (da == a) date = "<div class='event_date'><span style='color:black'>Data:</span> "+da+ meteoSingleLine+"</div>";
    else date = "<div class='event_date'> <span style='color:black'>Dal:</span> "+da+" <span style='color:black'>al:</span> "+a+ meteoSingleLine+"</div>"; 
    
    var tags = "";
    if (obj.tags != null && obj.tags.length > 0){
    	tags = "<div class='event_tags'><span style='color:black'>Tags: </span>";
    	obj.tags.forEach(function(x, i, arr){ 
    		tags = tags + x; 
    		if (i < arr.length - 1) tags = tags + ", ";
    		});
    	tags = tags + "</div>";
    }
    	
    var comune = obj.comune;
    if (obj.posto_nome != "") comune = comune + " | ";
    
    
    
    printCellEvento(container, i+1, cellOffset, obj.titolo, obj.link, comune, obj.posto_nome, obj.posto_link, date, obj.descrizione, distanza, tags, meteo);
}


function pagin(){
$('#pagination-demo').twbsPagination({
        totalPages: numev,
        visiblePages: 7,
        onPageClick: function (event, page) {
            $('#page-content').text('Page ' + page);
            loadPageEvents(page);


        }
    });
  }

function makePages(){
	var numP = parseInt(allEvents.length);
	numev = Math.floor((numP / 10));
    if(numP%10 != 0){
        numev = Math.floor((numP / 10)+1);
    }
    pagin();
}

/*function showNumFoundEvents(n){
	document.getElementById("counterEvents").innerHTML= " ("+ n + " trovati)";
}*/


/*function loadLocation(){
	document.getElementById("comune").value = sessionStorage.getItem('userLocation');
}*/






function loadAllEvents() {
	var noWeatherData = 0;
	if (document.getElementById("checkNoMeteoData").checked) noWeatherData = 1;
	
    $.ajax({
        type: 'post',
        url: 'http://127.0.0.1:8000/api/getAllEvents/',
        data:{
        	//'days':$("input[name=date]:checked").val(),
        	'location':document.getElementsByName('comune')[0].value,
        	'range':document.getElementById("slider-value").innerHTML,
        	'weather': document.getElementById("sliderMeteo-value").innerHTML,
        	'no-weather-data': noWeatherData,
        	'start-date': start_date,
        	'end-date': end_date
        },
        success: function (response) {
        	allEvents = response;
        	makePages();
        	document.getElementById("counterEvents").innerHTML= " ("+ allEvents.length + " trovati)";
        	loadPageEvents(1);
        	
        },
        error: function(e) {
          var je = JSON.parse(e.responseText);
           alert("ko");
        }
    });
};

function loadPageEvents(page){
	var pageOffset =  ((page*10)-10);
	$("#eventiContainer").html("");
	for (var i = pageOffset; i < Math.min((page*10), allEvents.length); i++){
        printEventi(allEvents[i],i, i, "eventiContainer");
      }
      //setMore();
}

function createPayloadData(topicData){	
	 var behavior = 'behavior:{empathy:'+ sessionStorage.getItem('empathy') +
		 			', agreeableness:'+ sessionStorage.getItem('agreeableness') +
		 			', conscientiousness:'+ sessionStorage.getItem('conscientiousness') +
		 			', extroversion:'+ sessionStorage.getItem('extroversion') +
		 			', neuroticism:'+ sessionStorage.getItem('neuroticism') +
		 			', openness:'+ sessionStorage.getItem('openness') +
		 			'}';
 	var topics = 'topics:'+JSON.stringify(topicData.results.entry);
	var payload = '{data:{'+ behavior + ", " + topics + '}}';
	return payload;  
}




$(function() {
	$( "#comune" ).autocomplete({
		source: function( request, response ) {
			$.ajax({
				type: 'get',
				url: 'http://127.0.0.1:8080/PugliaEventi/rest/services/getComuni/'+request.term,
				contentType: "application/json",
                success: function( data ) {
                	response( data );
                }
            });
        },
        change: function (event, ui) {
            if(!ui.item){
                $("#comune").val("");
            }
        },
    });
    $( "#nome" ).autocomplete({
    	source: function( request, response ) {
    		$.ajax({
    			type: 'get',
                url: 'http://127.0.0.1:8080/PugliaEventi/rest/services/getEvento/'+request.term,
                contentType: "application/json",
                success: function( data ) {
                	response( data );
                }
    		});
    	},
    });
});













/*function countEv(){


$.ajax({
    type: 'get',
    url: 'http://127.0.0.1:8080/PugliaEventi/rest/services/countEvents/' + URIConstructor(),
    contentType: "application/json",
    success: function (response) {
        //var obj = response[0];
        var numP = parseInt(allEvents.length);
		
        //mostra numero di eventi trovati
        //showNumFoundEvents(numP);
        
        numev = Math.floor((numP / 10));

        if(numP%10 != 0){
            numev = Math.floor((numP / 10)+1);
        }
        console.log("min " + Math.min(7, numev));
        pagin();
      /*},

    error: function(e) {
      var je = JSON.parse(e.responseText);
       alert("ko");
    }
});
}*/
/*function URIConstructor(){
var radioData = document.getElementsByName('date');
var place = document.getElementsByName('comune')[0].value;
var range = document.getElementById("slider-value").innerHTML;
var interval = null;

if (place == "") place = "all-cities";
for (var i = 0, length = radioData.length; i < length; i++){
 if (radioData[i].checked){
  interval = radioData[i].value;
  break;
 }
}

	var URI = place + "/" + range + "/" + interval;
	console.log(URI);
	return URI;
}*/

/*function changePageEv(page) {
$.ajax({
	type: 'get',
    url: 'http://127.0.0.1:8080/PugliaEventi/rest/services/getEvents/' + URIConstructor()+ '/'+((page*10)-10),
    contentType: "application/json",
    success: function (response) {
          $("#eventiContainer").html("");
        for (var i = 0; i < 10; i++){
        	printEventi(response[i],i+((page*10)-10), i+((page*10)-10), "eventiContainer");
        }
        setMore();
      },
      error: function(e) {
        var je = JSON.parse(e.responseText);
         alert("ko");
      }
  });
};*/


/*function loadEv( ) {
    $.ajax({
        type: 'get',
        url: 'http://127.0.0.1:8080/PugliaEventi/rest/services/getEvents/' + URIConstructor()+ '/0',
        contentType: "application/json",
        success: function (response) {
   
          $("#eventiContainer").html("");
          for (var i = 0; i < Math.min(10, response.length); i++){
            //var obj = response[i];
            printEventi(response[i],i, i+0, "eventiContainer");
          }
          setMore();
        },
        error: function(e) {
          var je = JSON.parse(e.responseText);
           alert("ko");
        }
    });
};*/




/*function setMore(){
  var i = 0;
    $('.sliderb').each(function () {
                var current = $(this);
                current.attr("box_h", current.height()+50);
                current.css("overflow", "hidden");
                //current.css("height", sliderHeight);
                current.css("height", 0);
                current.css("display", "none");
                $("#slider_menu_"+i).html('<a><span style="color:#f50136;"><b>Leggi tutto &#187;</b></span></a>');
                $("#slider_menu_"+i+" span").attr("onclick","openSlider("+i+");");
                  i = i+ 1;
            });
            var url = location.href;               //Save down the URL without hash.
            location.href = "#top";                 //Go to the target element.
            history.replaceState(null,null,url);


}

function openSlider(i){
    var open_height = $("#event"+i).attr("box_h") + "px";
    $("#event"+i).css("display", "block");
    $("#event"+i).animate({"height": open_height}, {duration: "slow" });
    $("#slider_menu_"+i).html('<a><span style="color:black;"><b>Chiudi</b></span></a>');
    $("#slider_menu_"+i+" span").attr("onclick","closeSlider("+i+");");
}

function closeSlider( i){
    $("#event"+i).animate({"height": sliderHeight}, {duration: "slow" });
    $("#slider_menu_"+i).html('<a><span style="color:#f50136;"><b>Leggi tutto &#187;</b></span></a>');
    $("#slider_menu_"+i+" span").attr("onclick","openSlider("+i+");");
    var url = location.href;               //Save down the URL without hash.
    location.href = "#anchor_"+i;                 //Go to the target element.
    history.replaceState(null,null,url);
    window.scrollTo(window.scrollX, window.scrollY - 100);
    $("#event"+i).css("display", "none");
}*/