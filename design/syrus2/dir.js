var marker = null; //CREA OBJETO MARCADOR
var polilinea = null;
var geocoder = null;
var position;
var latitude;
var longitude;
var map; 

window.addEventListener("load", init_page, true); 
function init_page(){
    document.getElementById("address").value = "Universidad del Norte, Barranquilla, Atlantico";
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), { //ASOCIAR VARIABLE CON ID
        zoom: 16,
        center: {lat: 11.019010, lng: -74.850505}
    });
}

function send_dir_function(){
    var address = document.getElementById("address").value;
    if(geocoder == null){
        CreateGeocoder(address);
    }
    else{
        UpdateGeocoder(address);
    }
}

function CreateGeocoder(address){
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
        position = results[0].geometry.location;
        latitude = results[0].geometry.location.lat();
        longitude = results[0].geometry.location.lng();
        Get_Datetime(latitude,longitude);
        if(marker == null){
            CreateMarker(position);
        }
        else{
            UpdateMarker(position);
        }
        map.setCenter(position);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
}

function UpdateGeocoder(address){
    geocoder = null;
    CreateGeocoder(address);
}

function Get_Datetime(latitude,longitude){
    var latitude_dir = latitude;
    var longitude_dir = longitude;
    var return_first = function () {
        var tmp = null;
        $.ajax({
            'data': { id_latitude : latitude_dir, id_longitude : longitude_dir }, 
            'async': false,
            'type': "POST",
            'global': false,
            'dataType': 'html',
            'url': "server_dir.php",
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
    table_str = "<tr> <td> Datetime </td> </tr>"

    data.forEach(function(element){
        if(element.datetime != undefined){
            table_str += "<tr> <td> " + element.datetime + " </td> </tr>"
        }
    });
    document.getElementById("table").innerHTML = table_str;
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