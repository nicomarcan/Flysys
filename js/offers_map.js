    var map;
    var geocoder;

    var city_info= new Array();
    function InitializeMap() {
 
 		

        var latlng = new google.maps.LatLng(-34.397, 150.644);
        var myOptions =
        {
            zoom: 8,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
        };
        var bounds = new google.maps.LatLngBounds();
	var service = new google.maps.DistanceMatrixService;
	var depa = new google.maps.LatLng(60, 100);
	var arra = new google.maps.LatLng(-34, -66);
	//$("#map").html("");
	bounds.extend(depa);
	bounds.extend(arra);
        map = new google.maps.Map(document.getElementById("map"), {
    
      zoom: 0,
	  disableDefaultUI: true,
	  draggable: true,
	  disableDoubleClickZoom: true,
	  styles: [
		{
			"featureType" : "road",
			"stylers": [
				{ "visibility": "off" }
			]
		},
		{
			"featureType" : "landscape",
			"stylers": [
				{ "visibility": "off" }
			]
		},
		{
			"featureType" : "administrative.province",
			"stylers": [
				{ "visibility": "off" }
			]
		},
		{
			"featureType" : "administrative.land_parcel",
			"stylers": [
				{ "visibility": "off" }
			]
		},
		{
			featureType: "administrative",
			elementType: "geometry",
			stylers: [
				{ visibility: "off" }
			]
		},
		{
			featureType: "administrative.country",
			elementType: "geometry",
			stylers: [
				{ visibility: "on" }
			]
		}
	  ]
    });
        
        map.fitBounds(bounds);
      
         for(var x = 0 ; x < 9;x++){
       		 addmarker(city_info[x]);
       	}
       	addMyMarker(myCoords);

    }





	//geolocation
			function getLocation() {

			    if(navigator.geolocation)
			        navigator.geolocation.getCurrentPosition(handleGetCurrentPosition, onError);
			    else
			    	alert("cabe");
			}

			function handleGetCurrentPosition(location){
			   console.log(location.coords.latitude);
			    console.log(location.coords.longitude);
			    myCoords["latitude"]=location.coords.latitude;
			    myCoords["longitude"]=location.coords.longitude;
			 //   alert("Gracias por compartirnos su posicion: "+location.coords.latitude+" , "+location.coords.longitude+". Fl      isis apreciará esa información");
			     $.ajax({
					     	type: 'GET',
							url: 'http://hci.it.itba.edu.ar/v1/api/geo.groovy',
							data:{"method":"getcitiesbyposition","latitude":location.coords.latitude,"longitude":location.coords.longitude,"radius":100},
							dataType: 'jsonp',
							success: function (alfa) {
								if(alfa.error==undefined){
									if(alfa.cities.length > 0){
										for(var x=0; x < alfa.cities.length;x++){
											if(alfa.cities[x].has_airport){
												getOffers(alfa.cities[x].id);
											}
										}
									}
								}
						}
					});

			}

			function onError(){
				//alert("No tiene habilitada la geolocalizacion")
				getOffers("BUE");
				 myCoords["latitude"]=-34.603722;
			    myCoords["longitude"]=-58.381592;
				
			}

var first=true;
var myCoords = {};
function addmarker(city) {

	      latilongi = new google.maps.LatLng(city.lat,city.long);
	      var cityCoords = {};
	      cityCoords["latitude"]=city.lat;
	      cityCoords["longitude"]=city.long;
	var distance= getDistance(cityCoords ,myCoords) + " km";

	
	         var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<p id="firstHeading" class="firstHeading">'+city.name+'</p>'+
      '<div id="bodyContent">'+
      '<p>Desde '+city.price+' Dólares</p>'+
      '<p>A '+distance+'</p>'
   
  
      '</div>'+
      '</div>';

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });


   
    var marker = new google.maps.Marker({
        position: latilongi,
        draggable: true,
        map: map,
        title: city.name,
        label:city.name[0]

    });
     marker.addListener('click', function() {
    infowindow.open(map, marker);
     
  });

}

function addMyMarker(coords) {

	      latilongi = new google.maps.LatLng(coords.latitude,coords.longitude);


	
	         var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<p id="firstHeading" class="firstHeading">Usted está aquí</p> '
      +'</div>';

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });
var image= "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";

   
    var marker = new google.maps.Marker({
        position: latilongi,
        draggable: true,
        map: map,
        icon:image
     

    });
     marker.addListener('click', function() {
    infowindow.open(map, marker);
     
  });

}


var rad = function(x) {
  return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.latitude - p1.latitude);
  var dLong = rad(p2.longitude - p1.longitude);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return Math.floor(d / 1000); // returns the distance in meter
};


    //Implementacion de Panoramio
		  var apiurl=new Array();
		  var info = new Array ();
		  


		  function getOffers( from){
			var j = 1;
			var src;
			var photo;
		      $.ajax({
		     	type: 'GET',
				url: 'http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=getflightdeals&from='+from,
				dataType: 'jsonp',
				success: function (alfa) {
						if (alfa.error == undefined) {
							
							var ciudades = alfa.deals;
							var size = ciudades.length;
							var random = parseInt((Math.random() * (ciudades.length-9)), 10) ;
							var limit = random+9;
							for( ; random< limit ; random++ ){
								var city = {};
								info.push({"to":ciudades[random].city.name.split(", ")[0] , "price" : alfa.deals[random].price,"num":limit-random})
								city["name"]=ciudades[random].city.name.split(", ")[0] ;
								city["long"]=ciudades[random].city.longitude;
								city["lat"]=ciudades[random].city.latitude;
								city["price"]= alfa.deals[random].price;
								city_info.push(city);
								//console.log(noSpacesCity);

								apiurl.push("http://www.panoramio.com/map/get_panoramas.php?set=public&from=0&to=100&minx="+ciudades[random].city.longitude+"&miny="+ciudades[random].city.latitude+"&maxx="+(ciudades[random].city.longitude+1)+"&maxy="+(ciudades[random].city.latitude+1)+"&size=medium&mapfilter=false");
							}
					}
					getImages(apiurl);
					api_ready = true;
					
					
				}
			});};



	      function getImages(apiurl){

	      	for(var x = 0;x<9;x++){
		    	   $.ajax({
				    type: 'GET',
				    url: apiurl[x],
				    dataType: 'jsonp',
				    context:info[x],
				    success: function(d){
				   		var random =  parseInt((Math.random() * (90 )), 10) ;
				  		var item = d.photos[4].photo_file_url;
	
						 photo= $('#offer-img-back-'+$(this).attr("num"));
						 photo.next().children("h5").text($(this).attr("to"));
						 photo.next().children("p").text("Desde "+ $(this).attr("price")+ " dolares");
						 photo.attr("src",item);
						 photo.attr("to",$(this).attr("to"));
						 photo.attr("from","Buenos Aires");


				    }
				  });
		      }
		    	// console.log(k);
		   	}

var google_maps_ready = false;
var api_ready = false;



    function initMap() {
		if (api_ready == true) {
			InitializeMap();
		}
		google_maps_ready = true;
	}
