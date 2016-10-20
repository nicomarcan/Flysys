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

function insertNotFoundCard(container, header, description, link_description, link_class) {
	var template = $("#not_found_card").html();
	Mustache.parse(template);
	var render = Mustache.render(template, {
		header: header,
		description: description,
		link_description: link_description,
		link_class: link_class
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
	if (pages == 1 || pages == 0) {
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
		dataType: "jsonp",
		data: {
			method: "getairlinebyid",
			id: params["airline_id"],
		},
		success: function(response) {
			if (response.error) {
				insertErrorCard(
					$("#flight-info-card"),
					"Err..",
					"No debería estar acá. Si hasta aquí sin modificar el código, por favor, comuníquese con mota@itba.edu.ar para que lo solucione."
				);
				$("#review-head").hide();
			}
			else {
				insertAirlineInfoCard(response.airline);
			}
		},
		error: function(error) {
			insertErrorCard(
				$("#flight-info-card"),
				"Hubo un error de conexión.",
				"El servidor no responde :(  ."
			)
			$("#review-head").hide();
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
				insertErrorCard(
					$("#flight-info-card"),
					"El vuelo no existe.",
					"Es posible que la api este rota."
				);
			}
			else {
				insertFlightInfoCard(response);
				flight_info = response.status;
				api_ready = true;
				if (google_maps_ready == true) {
					loadMap();
				}
			}
		},
		error: function(response) {
			insertErrorCard(
				$("#flight-info-card"),
				"Hubo un error de conexion.",
				"El servidor no responde :(  ."
			);
			$("#review-head").hide();
		}
  })
}

var google_maps_ready = false;
var api_ready = false;

var map;
var flight_info;

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
				insertErrorCard(
					$("#flight-info-card"),
					"La aerolinea es inválida.",
					"Si este error persiste, por favor contactenos a mota@itba.edu.ar."
				);
				$("#review-head").hide();
			}
			else{
				/* airline is valid */
				$("a#airline_breadcrumb").text(airlines_id[params["airline_id"]]);
				$("a#airline_breadcrumb").attr("title", airlines_id[params["airline_id"]])
				$("a#airline_breadcrumb").attr("href","./review.html?airline_id="+params["airline_id"]);

				if (params["flight_number"] && !(isNumber(params["flight_number"]) && params["flight_number"] === parseInt(params["flight_number"]).toString())) {
					/* wrong flight number */
					insertErrorCard(
						$("#flight-info-card"),
						"El número de vuelo es inválido.",
						"Eso ni siquera es un entero :| ."
					);
					$("#review-head").hide();
				}
				else {
					if (params["flight_number"]) {
						/* searching for a specific flight */
						$("a#flight_breadcrumb").text("Vuelo " + params["flight_number"]);
						$("a#flight_breadcrumb").attr("title", "Vuelo " + params["flight_number"]);
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
