var color_scheme = ["#ff6f31", "#ff9f02", "#cabc0b", "#99cc00", "#88b131"];

function insertFlightInfoCard(info) {
	var template = $("#flight_info_card").html();
	var airline = info.status.airline;
	var departing_city = info.status.departure.airport.city;
	var departing_airport = info.status.departure.airport;
	var arriving_city = info.status.arrival.airport.city;
	var arriving_airport = info.status.arrival.airport;
	Mustache.parse(template);
	var render = Mustache.render(template, {
		logo: airline.logo,
		name: airline.name,
		code: airline.id,
		number: info.status.number,
		departing_city: departing_city.name,
		departing_airport: departing_airport.description.split(',')[0]+ ' (' + departing_airport.id+ ')',
		arriving_city: arriving_city.name,
		arriving_airport: arriving_airport.description.split(',')[0] + ' (' + arriving_airport.id+ ')',
		distance: getDistance(departing_airport, arriving_airport) + " km"
	});
	$("#flight-info-card").append(render);

}

function insertErrorCard(container, header, description) {
	var template = $("#error_card").html();
	Mustache.parse(template);
	var render = Mustache.render(template, {
		header: header,
		description: description
	});
	container.append(render);
}

function insertAirlineInfoCard(airline) {
	var template = $("#airline_card_info").html();
	Mustache.parse(template);
	var rating;
	var rating_color;
	if (airline.rating) {
		rating = Math.round(airline.rating);
		rating_color = color_scheme[parseInt((rating+1) / 2) - 1];
	}
	else {
		rating = "?";
		rating_color = "grey";
	}
	var charges = parseInt(airline.charges * 100) + "%";
	var taxes = parseInt(airline.taxes * 100) + "%";
	var star_array_length = (rating == '?') ? 0 : parseInt(rating / 2);
	var render = Mustache.render(template, {
		logo: airline.logo,
		name: airline.name,
		code: airline.id,
		rating: rating,
		active_stars: Array.apply(null, Array(star_array_length)).map(function (_, i) {return i;}),
		inactive_stars: Array.apply(null, Array(5 - star_array_length)).map(function (_, i) {return i;}),
		rating_color: rating_color,
		charges: charges,
		taxes: taxes
	});
	$("#flight-info-card").append(render);
}

function startPagination(pages, page) {
	var el = '<li id="left_chevron" class="disabled "><a href="#opinion_header"><i class="material-icons">chevron_left</i></a></li>';
	for (var i = 1; i <= pages; i++) {
		if (i == page) {
			el += '<li class="page_button active" value="'+ i +'"><a href="#opinion_header">'+ i +'</a></li>';
		}
		else {
			el += '<li class="waves-effect page_button" value="'+ i +'"><a href="#opinion_header">'+ i +'</a></li>';
		}
	}
	if (pages == 1) {
		el += '<li id="right_chevron" class=" disabled" ><a href="#opinion_header"><i class="material-icons">chevron_right</i></a></li>'
	}
	else {
		el += '<li id="right_chevron"><a href="#opinion_header"><i class="material-icons">chevron_right</i></a></li>';
	}
	return el;
}

function ajaxAirlineInfo(params) {
	$.ajax({
		url: "http://hci.it.itba.edu.ar/v1/api/misc.groovy",
		jsonp: "callback",
		data: {
			method: "getairlinebyid",
			id: params["airline_id"],
		},
		success: function(response) {
			if (response.error) {
			displayError()
			}
			else {
				if (response.total == 0) {
					insertErrorCard($("#flight-info-card"), "No se encontraron reviews", "");
				}
				else {
					insertAirlineInfoCard(response.airline);
				}
			}
		}
	});
}

function ajaxFlightInfo(params, airline_id) {
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
			if (response.error) {
				insertErrorCard($("#flight-info-card"), "El vuelo no existe.", "Es posible que la api este rota.")
			}
			else if (response.total == 0) {
				insertErrorCard($("#reviews-container"), "No se encontraron reviews", "");
			}
			else {
				insertFlightInfoCard(response);
				flight_info = response.status;
				api_ready = true;
				if (google_maps_ready == true) {
					loadMap();
				}
			}
		}
  })
}

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

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

var airline_search_ready = $.Deferred();
$(document).ready(function() {
	var params = parseGET();
	var options = [{
			option: 0,
			sort_key: 'rating',
			sort_order: 'asc',
			pages: []
		},
		{
			option: 1,
			sort_key: 'rating',
			sort_order: 'desc',
			pages: []
		}
	];
	var page = 1;
	var op = 0;
	var airlines = {};
	var airlines_id = {};
	/* wait for airline search */
	$.when(
		ajaxAirlineSearch(airlines, airlines_id)
	).then(function(response, errorMsg, error) {
		if (response.error || errorMsg == "error") {
			handle_error(response.error);
		}
		else {
			airlineSearchSubmit(airlines, airlines_id);
			if (!params["airline_id"] || !airlines_id[params["airline_id"]]) {
				/* display airline not found error */
				insertErrorCard($("#flight-info-card"), "La aerolinea es invalida.", "Si este error persiste, por favor contactenos a mota@itba.edu.ar.");
			}
			else{
				/* airline is valid */
				$("a#airline_breadcrumb").text(airlines_id[params["airline_id"]]);
				$("a#airline_breadcrumb").attr("href","./reviews_airlines.html?airline_id="+params["airline_id"]);
				if (params["flight_number"] && !(isNumber(params["flight_number"]) && params["flight_number"] === parseInt(params["flight_number"]).toString())) {
					/* wrong flight number */
					insertErrorCard($("#flight-info-card"), "El numero de vuelo es invalido.", "Eso ni siquera es un entero :| .");
				}
				else {
					if (params["flight_number"]) {
						/* searching for a specific flight */
						$("a#flight_breadcrumb").text("Vuelo " + params["flight_number"]);
						$("a#flight_breadcrumb").css("visibility", "visible");
						$("body").append("<script async defer src='https://maps.googleapis.com/maps/api/js?key=AIzaSyDW8Zq1p2J_A1tExsMjmcov8t4b4ZAqFko&callback=initMap' \
											type='text/javascript'></script>");
						ajaxFlightInfo(params);
					}
					else {
						/* searching for airline */
						$('select#order_select').append('<option class="order_option" value="3">Mayor numero de vuelo</option>');
						$("select#order_select").append('<option class="order_option" value="2">Menor numero de vuelo</option>');
						$('select').material_select();
						options[2] = {
							option: 2,
							sort_key: 'flight',
							sort_order: 'asc',
							pages: []
						};
						options[3] = {
							option: 3,
							sort_key: 'flight',
							sort_order: 'desc',
							pages: []
						}
						/* ajax airline info */
						ajaxAirlineInfo( params );
					}
					/* ajax airline reviews */
					ajaxReviews(
						params,
						options[op].sort_key,
						options[op].sort_order,
						page,
						options[op]
					);
				}
			}
		}
	});

	$(document).on("click", "li.page_button", function(){
		var auxpage = parseInt($(this).attr('value'));
		if (auxpage == page) {
			return false;
		}
		page = auxpage;
		$("li.page_button.active").removeClass('active');
		$(this).addClass("active");
		if (page == 1) {
			$("li#left_chevron").addClass("disabled");
		}
		else {
			$("li#left_chevron").removeClass("disabled")
		}
		if (page == total_pages) {
			$("li#right_chevron").addClass("disabled");
		}
		else {
			$("li#right_chevron").removeClass("disabled");
		}
		if (options[op].pages[page]) {
			loadReviews(options[op].pages[page]);
		}
		else {
			ajaxReviews(
				params,
				options[op].sort_key,
				options[op].sort_order,
				page,
				options[op]
			)
		}
		return true;
	});

	$(document).on('click', 'li#left_chevron', function() {
		if ($(this).hasClass('disabled')) {
			return false;
		}
		$("li.page_button").filter( function(index) {
			return $(this).attr("value") == page - 1;
		}).click();
		return true;
	});

	$(document).on('click', 'li#right_chevron', function() {
		if ($(this).hasClass('disabled')) {
			return false;
		}
		$("li.page_button").filter( function(index) {
			return $(this).attr("value") == (page + 1);
		}).click();
		return true;
	});

	$('select#order_select').on('change', function() {
		op = $(this).children('option.order_option:selected').attr('value');
		page = 1;
		$("li.page_button.active").removeClass('active');
		$("li.page_button[value="+page+"]").addClass('active');
		$("li#left_chevron").addClass("disabled");
		if (total_pages == 1) {
			$("li#right_chevron").addClass("disabled");
		}
		else {
			$("li#right_chevron").removeClass("disabled");
		}
		if (options[op].pages[page]) {
			loadReviews(options[op].pages[page])
		}
		else {
			ajaxReviews(
				params,
				options[op].sort_key,
				options[op].sort_order,
				page,
				options[op]
			);
		}
		return true;
	});
	$(document).on('click', "a.back-link", function() {
		history.back();
	});
});
