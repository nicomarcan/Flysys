var google_maps_ready = false;
var api_ready = false;

var map;
var flight_info;
function loadMap() {
	var dep_airport = flight_info.departure.airport;
	var arv_airport = flight_info.arrival.airport;
	var bounds = new google.maps.LatLngBounds();

	var service = new google.maps.DistanceMatrixService;
	var depa = new google.maps.LatLng(dep_airport.latitude, dep_airport.longitude);
	var arra = new google.maps.LatLng(arv_airport.latitude, arv_airport.longitude);
	$("#map").html("");
	bounds.extend(depa);
	bounds.extend(arra);
	map = new google.maps.Map(document.getElementById('map'), {
      center: bounds.getCenter(),
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
	var arrow = {
    	path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
  	};


	/* SVG from https://upload.wikimedia.org/wikipedia/commons/e/ee/Aircraft_Airport_ecomo.svg*/
	var plane = {
		path: 'M 250.2 59.002 c 11.001 0 20.176 9.165 20.176 20.777 v 122.24 l 171.12 95.954 v 42.779 l -171.12 -49.501 v 89.227 l 40.337 29.946 v 35.446 l -60.52 -20.18 l -60.502 20.166 v -35.45 l 40.341 -29.946 v -89.227 l -171.14 49.51 v -42.779 l 171.14 -95.954 v -122.24 c 0 -11.612 9.15 -20.777 20.16 -20.777 Z',
		scale: .1,
		strokeColor: 'black',
		strokeWeight: 1,
		strokeOpacity: 1,
		color: 'black',
		anchor: new google.maps.Point(250, 250),
		fillColor: 'white',
		fillOpacity: 1
	};

	var flight_path = new google.maps.Polyline({
		path: [ {lat: dep_airport.latitude, lng: dep_airport.longitude},
				{lat: arv_airport.latitude, lng: arv_airport.longitude}
		],
		map: map,
		icons: [
			{
				icon: arrow,
				offset: '100%'
			},
			{
				icon: plane,
				offset: '0'
			}
		],
		strokeColor: 'red',
		strokeOpacity: 1,
		strokeWeight: 2
	});
	animatePlane(flight_path);

}




// Use the DOM setInterval() function to change the offset of the symbol
// at fixed intervals.
// from https://developers.google.com/maps/documentation/javascript/examples/overlay-symbol-animate?hl=es
function animatePlane(line) {
    var count = 0;
    window.setInterval(function() {
      count = (count + 1) % 200;

      var icons = line.get('icons');
      icons[1].offset = (count / 2) + '%';
      line.set('icons', icons);
  }, 20);
}
function initMap() {
	if (api_ready == true) {
		loadMap();
	}
	google_maps_ready = true;
}

$(document).ready( function() {
  $("dropdown-button").dropdown();
  var params = parseGET();

  $.ajax({
    url: "http://hci.it.itba.edu.ar/v1/api/status.groovy",
    jsonp: "callback",
    dataType: "jsonp",
    data: {
      method: "getflightstatus",
      airline_id: params["airline_id"],
      flight_number: params["flight_number"]
    },
    success: function(response) {
      insertFlightInfoCard(response);
	  flight_info = response.status;
	  api_ready = true;
	  if (google_maps_ready == true) {
		  loadMap();
	  }
    }
  })

  $.ajax({
    url: "http://hci.it.itba.edu.ar/v1/api/review.groovy",
    jsonp: "callback",
    dataType: "jsonp",
    data: {
      method: "getairlinereviews",
      airline_id: params["airline_id"],
      flight_number: params["flight_number"]
    },
    success: function(response) {
      var sum = 0;
      for ( var x in response.reviews) {
        $("#reviews-container").append(createReviewCard(response.reviews[x]));
      }
    }
  });
})
