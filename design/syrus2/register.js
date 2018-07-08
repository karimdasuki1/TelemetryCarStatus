var marker = null; //CREA OBJETO MARCADOR
var polilinea = null;
var geocoder = null;
var position;
var map; 

window.addEventListener("load", init_page, true); 

function init_page(){
    var today = moment().format('YYYY-MM-DD');
    document.getElementById("start_calendar").value = today;
    document.getElementById("end_calendar").value = today;  
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), { //ASOCIAR VARIABLE CON ID
        zoom: 16,
        center: {lat: 11.019010, lng: -74.850505}
    });
}

function send_button_function(){

    var datetime_start = document.getElementById("start_calendar").value + " " + 
        document.getElementById("start_time").value + ":00"; 
    var datetime_end = document.getElementById("end_calendar").value + " " + 
        document.getElementById("end_time").value + ":00"; 

    var return_first = function () {
        var tmp = null;
        $.ajax({
            'data': { date_time_start : datetime_start, date_time_end : datetime_end }, 
            'async': false,
            'type': "POST",
            'global': false,
            'dataType': 'html',
            'url': "server_register.php",
            'success': function (data) {
                tmp = data;
            }
        });
        return tmp;     
    }();
    if (return_first==null) {
        return_first="";
    }

    var data = JSON.parse(return_first);
    var latitude;
    var longitude;
    var route = [];
    
    data.forEach(function(element){
        if(element.latitude != undefined && element.longitude != undefined){
            route.push({lat: parseFloat(element.latitude), lng: parseFloat(element.longitude)})
        }
    });
    var OriginPoint = route[0];
    if(marker == null){
        CreateMarker(OriginPoint);
    }
    else{
        UpdateMarker(OriginPoint);
    }
    if(polilinea == null){
        CreatePolyline(route);
    }
    else{
        UpdatePolyline(route);
    }
}

function CreatePolyline(route){
    polilinea = new google.maps.Polyline({
        path: route,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      polilinea.setMap(map);
}

function UpdatePolyline(route){
    polilinea.setMap(null);
    polilinea = null;    
    CreatePolyline(route);
}

function CreateMarker(OriginPoint){
    marker = new google.maps.Marker({  // función de api para crear marcador
        position: OriginPoint,
        map: map,
        label: 'O'
      });
}

function UpdateMarker(OriginPoint){
    marker.setMap(null);
    marker = null;
    CreateMarker(OriginPoint);
}