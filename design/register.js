var marker1 = null;
var marker2 = null;
var polilinea1 = null;
var polilinea2 = null;
var circles1 = null;
var circles2 = null;
var Datetime1 = [];
var Datetime2 = [];
var rpm1 = [];
var rpm2 = [];
var ROWS1 = [];
var ROWS2 = [];
var geocoder = null;
var svalue;
var position;
var latitude;
var longitude;
var map; 

window.addEventListener("load", init_page, true); 

function init_page(){
    var today = moment().format('YYYY-MM-DD');
    document.getElementById("start_calendar").value = today;
    document.getElementById("end_calendar").value = today;
    google.charts.load('current', {'packages':['corechart']});
    SwitchVehicle();  
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: {lat: 11.019010, lng: -74.850505}
    });
}

function SwitchVehicle(){
    var sw = document.getElementById("switch");
    svalue = sw.options[sw.selectedIndex].value;
}

function send_button_function(){

    Hide(marker1,polilinea1,circles1);
    Hide(marker2,polilinea2,circles2);

    var sw = document.getElementById("switch");
    svalue = sw.options[sw.selectedIndex].value;
    
    var datetime_start = document.getElementById("start_calendar").value + " " + 
        document.getElementById("start_time").value + ":00"; 
    var datetime_end = document.getElementById("end_calendar").value + " " + 
        document.getElementById("end_time").value + ":00"; 

    if (svalue == "1"){
        
        data1 = return_data("1");
        process_data("1",data1,marker1,polilinea1,circles1);
        //console.log(Datetime1);
        //console.log(rpm1);
        chart_draw1( "1", Datetime1 , rpm1);

    }else if (svalue == "2"){
        
        data2 = return_data("2");
        process_data("2",data2,marker2,polilinea2,circles2);
        chart_draw1("2", Datetime2 , rpm2);

    }else{
        data1 = return_data("1");
        data2 = return_data("2");
        process_data("1",data1,marker1,polilinea1,circles1);
        process_data("2",data2,marker2,polilinea2,circles2);
        chart_draw2(Datetime1 , Datetime2, rpm1, rpm2);
    }
}

function return_data(id){

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
            'url': "server_register"+id+".php",
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
    return data
}

function process_data(id,data,marker,polilinea,circles){
    
    var latitude;
    var longitude;
    var route = [];
    var time = [];
    var rpm = [];

    data.forEach(function(element){
        if(element.latitude != undefined && element.longitude != undefined){
            route.push({lat: parseFloat(element.latitude), lng: parseFloat(element.longitude)})
            time.push(element.datetime)
            rpm.push(element.rpm)
        }
    });

    var OriginPoint = route[0];
    if(marker == null){
        CreateMarker(marker,id,OriginPoint);
    }
    else{
        UpdateMarker(marker,id,OriginPoint);
    }
    if(polilinea == null){
        CreatePolyline(polilinea,id,route);
    }
    else{
        UpdatePolyline(polilinea,id,route);
    }

    if(circles == null){
        CreateCircle(circles,id,route,time,rpm);
    }
    else{
        UpdateCircle(circles,id,route,time,rpm);
    }

    if(id == "1"){
        Datetime1 = time;
        rpm1 = rpm;
    }else{
        Datetime2 = time;
        rpm2 = rpm;
    }
}


function CreatePolyline(polilinea,id,route){
    var color;
    if (id == "1"){
        color = '#FF0000'
    }else if (id == "2"){
        color = '#0000FF'
    }
    polilinea = new google.maps.Polyline({
        path: route,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    polilinea.setMap(map);
    if (id =="1"){
        polilinea1 = polilinea;
    }else if(id == "2"){
        polilinea2 = polilinea;
    }
}

function UpdatePolyline(polilinea,id,route){
    polilinea.setMap(null);
    polilinea = null;    
    CreatePolyline(polilinea,id,route);
}

function CreateMarker(marker, id, OriginPoint){
    marker = new google.maps.Marker({  // función de api para crear marcador
        position: OriginPoint,
        map: map,
        label: 'VH'+id
      });
    map.setCenter(OriginPoint);
    if (id =="1"){
        marker1 = marker;
    }else if(id == "2"){
        marker2 = marker;
    }
}

function UpdateMarker(marker, id, OriginPoint){
    marker.setMap(null);
    marker = null;
    CreateMarker(marker, id, OriginPoint);
}

function CreateCircle(circles,id,route,time,rpm){
    circles = [];
    for (var i = 1; i < route.length; i++){
        textL = ' Datetime: ' + time[i] + ' ;' + ' RPM: ' + rpm[i];
        circle = new google.maps.Marker({  // función de api para crear marcador
            position: route[i],
            title: textL,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 2,
                strokeWeight: 2
                },
            map: map,
        });
        circles.push(circle);
    }
    if (id =="1"){
        circles1 = circles;
    }else if(id == "2"){
        circles2 = circles;
    }
}

function UpdateCircle(circles,id,route,time,rpm){
    for (var i = 0; i < circles.length; i++) {
        circles[i].setMap(null);
    }
    CreateCircle(circles,id,route,time,rpm);
}

function Hide(marker,polilinea,circles){
    if(marker !== null){
        hideMarker(marker);
    }
    if(polilinea !== null){
        hidePolyline(polilinea);
    }
    if(circles !== null){
        hideCircle(circles);
    }
}

function hideMarker(marker){
    marker.setMap(null);
    marker = null;
}

function hidePolyline(polilinea){
    polilinea.setMap(null);
    polilinea = null;
}

function hideCircle(circles){
    for (var i = 0; i < circles.length; i++) {
        circles[i].setMap(null);
    }
}

/* mapa de calor y busqueda por geocoder */

function send_dir_function(){

    var sw = document.getElementById("switch");
    svalue = sw.options[sw.selectedIndex].value;

    var address = document.getElementById("address").value;

    if(svalue=="1"){
        if(geocoder == null){
            CreateGeocoder(address,marker1,"1");
        }
        else{
            UpdateGeocoder(address,marker1,"1");
        }    
    }else if(svalue=="2"){
        if(geocoder == null){
            CreateGeocoder(address,marker2,"2");
        }
        else{
            UpdateGeocoder(address,marker2,"2");
        }
    }

}

function CreateGeocoder(address,marker,id){
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
        position = results[0].geometry.location;
        latitude = results[0].geometry.location.lat();
        longitude = results[0].geometry.location.lng();
        
            Get_Datetime(latitude,longitude,id);
            if(marker == null){
                //CreateMarker(position);
                CreateMarker(marker, id, position);
            }
            else{
                UpdateMarker(marker, id, position);
            }
            map.setCenter(position);    
        }
      else {    
      alert('Geocode was not successful for the following reason: ' + status);
      }
    });
}

function UpdateGeocoder(address,marker,id){
    geocoder = null;
    CreateGeocoder(address,marker,id);
}

function Get_Datetime(latitude,longitude,id){

    var latitude_dir = latitude;
    var longitude_dir = longitude;

    var datetime_start = document.getElementById("start_calendar").value + " " + 
    document.getElementById("start_time").value + ":00"; 
    var datetime_end = document.getElementById("end_calendar").value + " " + 
    document.getElementById("end_time").value + ":00"; 


    var return_first = function () {
        var tmp = null;
        $.ajax({
            'data': { id_latitude : latitude_dir, id_longitude : longitude_dir, date_time_start : datetime_start, date_time_end : datetime_end }, 
            'async': false,
            'type': "POST",
            'global': false,
            'dataType': 'html',
            'url': "server_dir"+id+".php",
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

//chart

function chart_draw1(id, datetime , rpm){

    var Rows = [];
    Rows.push(['Datetime', 'Vehicle#'+id]);

    for (i = 0; i < datetime.length;i++){
        Rows.push( [datetime[i], parseInt(rpm[i]) ]);
    }

    ROWS1 = Rows;

    console.log(ROWS1);

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart1);
}

function chart_draw2(date1, date2, r1, r2){
      
      if ( date1.length >= date2.length ){
        ROWS2 = filar1(date1,r1,date2,r2);
      }else{
        ROWS2 = filar2(date2,r2,date1,r1);
      }

      google.charts.load('current', {packages: ['corechart']});
        google.charts.setOnLoadCallback(drawChart2);

    }

    function filar1(date1,r1,date2,r2){
    	
      Rows = [];
      Rows.push(['Datetime', 'Vehicle#1', 'Vehicle#2']);
      n = date1.length;
      m = date2.length;
      j = 0;
      for (i = 0; i < n;i++){
      
      var d1 = new Date( date1[i] );
      var d2 = new Date( date2[j] );
      
      dif = d1.getTime() - d2.getTime();
      
      if (Math.abs(dif) <= 10000){
        Rows.push([ date1[i], parseInt(r1[i]), parseInt(r2[j]) ]);
          if (j < m){
            j++;
          }
      }
      else if(dif < 0){
      	Rows.push([ date1[i], parseInt(r1[i]), 0 ]);
      }
      else{
      	Rows.push([ date1[i], parseInt(r1[i]) ,parseInt(r2[j]) ]);
        if (j < m){
            j++;
          }
      }
    }
    return Rows;
    }
    
    function filar2(date1,r1,date2,r2){
    	
        Rows = [];
        Rows.push(['Datetime', 'Vehicle#2', 'Vehicle#1']);
        n = date1.length;
        m = date2.length;
        j = 0;
        for (i = 0; i < n;i++){
        
        var d1 = new Date( date1[i] );
        var d2 = new Date( date2[j] );
        
        dif = d1.getTime() - d2.getTime();
        
        if (Math.abs(dif) <= 10000){
          Rows.push([ date1[i], parseInt(r1[i]), parseInt(r2[j]) ]);
            if (j < m){
              j++;
            }
        }
        else if(dif < 0){
            Rows.push([ date1[i], parseInt(r1[i]), 0 ]);
        }
        else{
            Rows.push([ date1[i], parseInt(r1[i]) ,parseInt(r2[j]) ]);
          if (j < m){
              j++;
            }
        }
      }
      return Rows;
      }
    /*
    var Rows = [];
      Rows.push(['Datetime', 'Vehicle#1', 'Vehicle#2']);
      
      if ( date1.length >= date2.length ){
        n = date1.length;
        m = date2.length;
        j = 0;
      }
        
    for (i = 0; i < n;i++){
      
      var d1 = new Date(date1[i]);
      var d2 = new Date(date2[j]);
      
      dif = Math.abs( d1.getTime() - d2.getTime() )
      
      if (dif <= 10000){
      
        Rows.push([ date1[i], parseInt(r1[i]), parseInt(r2[j]) ]);
        if (j < m){
        	j++;
        }
      }
      else {
      	Rows.push([ datetime1[i], parseInt(rpm1[i]), 0 ]);
      }
    }

    ROWS2 = Rows;
    google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(drawChart2);

    */


function drawChart1() {
  var data = google.visualization.arrayToDataTable(ROWS1);

  var options = {
    title: 'Historicos RPM',
    hAxis: {title: 'Datetime',  titleTextStyle: {color: '#333'}},
    vAxis: {minValue: 0}
  };

  var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}

function drawChart2() {
    var data = google.visualization.arrayToDataTable(ROWS2);
  
    var options = {
      title: 'Historicos RPM',
      hAxis: {title: 'Datetime',  titleTextStyle: {color: '#333'}},
      vAxis: {minValue: 0}
    };
  
    var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }