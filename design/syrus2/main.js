var marker = null; //CREA OBJETO MARCADOR
var route = [];
var map;

window.addEventListener("load", refresh, true); 

function initMap(){
    map = new google.maps.Map(document.getElementById('map'), { //ASOCIAR VARIABLE CON ID
        zoom: 16,
        center: {lat: 11.019010, lng: -74.850505}
    });
    refresh();  // FUNCION PARA REFRESCAR PAGINA
    setInterval(refresh,1000); //LLAMA LA FUNCION REFRESH CADA 1 SEGUNDOS    
}
//refresh();  // FUNCION PARA REFRESCAR PAGINA
//setInterval(refresh,1000); //LLAMA LA FUNCION REFRESH CADA 1 SEGUNDOS
function refresh(){
    var return_first = function () {
         var tmp = null;
         $.ajax({
             'async': false,
             'type': "POST",
             'global': false,
             'dataType': 'html',
             'url': "server.php",
             'success': function (data) {
                 tmp = data;
             }
         });
         return tmp;
    }();
    if (return_first==null) {
       return_first="";
    }
    var data = return_first.split("\n"); // Los datos que me importan (Lat, Long, Tiem) se encuentran en el salto 9, por eso guardo en una variable esa linea y a su vez divido ese string cada que encuentre un espacio
    
    var latitudeElement = document.getElementById("lat"); // Voy a mostrar un texto en donde esté el id "Latitud"
    //latitudeElement.textContent = "Latitud: " + data[0]; // Muestro Lat + la coordenada guardada en 0 que se dividio con el split
    latitudeElement.innerHTML = "<p>Latitude: " + data[0] + "</p>";
    var longitudeElement = document.getElementById("lon");
    //longitudeElement.textContent = "Longitud: " + data[1];
    longitudeElement.innerHTML = "<p>Longitude: " + data[1] + "</p>";
    var timeElement = document.getElementById("time");
    timeElement.innerHTML = "<p>Time: " + data[2] + "</p>"
    //timeElement.textContent =  "Tiempo: " + data[3];

    latitude = parseFloat(data[0]);
    longitude = parseFloat(data[1]);

    if(marker==null){
        CreateMarker(latitude, longitude);
    }
    else{
        UpdateMarker(latitude, longitude);
    }
    route.push(new google.maps.LatLng(latitude, longitude));
    polilinea();
}

function polilinea(){
    var flightPath = new google.maps.Polyline({
       path:route,
       strokeColor:"",
       strokeOpacity:0.8,
       strokeWeight:2
    });
    flightPath.setMap(map);
}

function CreateMarker(latitude, longitude){
    marker = new google.maps.Marker({  // función de api para crear marcador
        position: new google.maps.LatLng(latitude, longitude),
        map: map,
        title: 'Syrus2G. Lat: ' + latitude + ' Lon: ' + longitude,
        label: 'S'
    });
    //map.setCenter(new google.maps.LatLng(latitude, longitude)); // Movemos el centro hacia donde se encuentren los nuevos valores de coor[0] y coor[1]
}

function UpdateMarker(latitude, longitude){
    marker.setMap(null);
    marker = null;
    CreateMarker(latitude, longitude);
}