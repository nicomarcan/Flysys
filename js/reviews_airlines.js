color_scheme = ["#ff6f31", "#ff9f02", "#cabc0b", "#99cc00", "#88b131"];

function updateAirlineInfoCard(airline) {
  $("img#info_airline_logo").attr("src", airline.logo);
  $("#info_airline_name").text(airline.name);
  $("#info_airline_code").text(airline.id);
  if (airline.rating == null) {
    $("#info_global_score").text("?");
    $("#info_global_score").css("background-color", "grey");
  }
  else {
    var r_score = Math.round(airline.rating);
    $("#info_global_score").text(r_score);
  }

  $("a#airline_breadcrumb").text(airline.name);
}

function insertFlightInfoCard(info) {
	var template = $("#flight_info_card").html();
	var airline = info.status.airline;
	var departing_city = info.status.arrival.airport.city;
	var departing_airport = info.status.departure.airport;
	var arriving_city = info.status.arrival.airport.city;
	var arriving_airport = info.status.arrival.airport;
	Mustache.parse(template);
	var render = Mustache.render(template, {
		logo: airline.logo,
		name: airline.name,
		number: airline.id,
		departing_city: departing_city.name,
		departing_airport: departing_airport.description+ '(' + departing_airport.id+ ')',
		arriving_city: arriving_city.name,
		arriving_airport: arriving_airport.description + '(' + arriving_airport.id+ ')',
		distance: getDistance(departing_airport, arriving_airport) + " km"
	});
	$("#flight-info-card").append(render);
	$("a#airline_breadcrumb").text(airline.name);
	$("a#airline_breadcrumb").attr("href","./reviews_airlines.html?airline_id="+airline.id);
	$("a#flight_breadcrumb").text("Vuelo " +info.status.number);
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
	var render = Mustache.render(template, {
		logo: airline.logo,
		name: airline.name,
		code: airline.id,
		rating: rating,
		rating_color: rating_color,
		charges: charges,
		taxes: taxes
	});
	$("#flight-info-card").append(render);
}

function insertReviewCards(reviews) {
	for (var r in reviews) {
		for (var s in reviews[r].rating) {
			var int_score = parseInt((reviews[r].rating[s] + 1)/ 2 - 1);
			reviews[r].rating[s+"_color"] = color_scheme[int_score];
			reviews[r].rating[s] = parseInt(reviews[r].rating[s] * 10);
		}
		reviews[r].comments = decodeURIComponent(reviews[r].comments);
	}
	var template = $("#review_card").html();
	Mustache.parse(template);
	var render = Mustache.render(template, {
		reviews: reviews
	});
	$("#reviews-container").append(render);
}

function startPagination(pages, page) {
	var el = '<li id="left_chevron" class="disabled"><a href="#opinion_header"><i class="material-icons">chevron_left</i></a></li>';
	for (var i = 1; i <= pages; i++) {
		if (i == page) {
			el += '<li class="page_button active" value="'+ i +'"><a href="#opinion_header">'+ i +'</a></li>';
		}
		else {
			el += '<li class="waves-effect page_button" value="'+ i +'"><a href="#opinion_header">'+ i +'</a></li>';
		}
	}
	if (pages == 1) {
		el += '<li id="right_chevron" class="waves-effect disabled" ><a href="#opinion_header"><i class="material-icons">chevron_right</i></a></li>'
	}
	else {
		el += '<li id="right_chevron" class="waves-effect"><a href="#opinion_header"><i class="material-icons">chevron_right</i></a></li>';
	}
	return el;
}

function loadReviews(reviews) {
	$("#reviews-container").html('');
	$("#reviews-container").css("opacity", "1");
	insertReviewCards(reviews);
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
		$("a#airline_breadcrumb").html(response.airline.name);
        insertAirlineInfoCard(response.airline);
      }
    });
}

function ajaxFlightInfo(params) {
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
}

var total_pages;
function ajaxAirlineReviews(params, sort_key, sort_order, page, option) {
	$.ajax({
		url: "http://hci.it.itba.edu.ar/v1/api/review.groovy",
		jsonp: "callback",
		dataType: "jsonp",
		data: {
			method: "getairlinereviews",
			airline_id: params["airline_id"],
			sort_key: sort_key,
			sort_order: sort_order,
			page: page,
			page_size: 5
		},
		success: function(response) {
			if (response.error) {
				$("#reviews-container").append(displayError(response.error.code, "La busqueda de opiniones por aerolinea no esta andando desde la api"))
			}
			insertReviewCards(response.reviews);

			option.pages[page] = response.reviews;
			if ($("ul#page_sel").html() == false) {
				total_pages = parseInt(response.total / response.page_size) + 1;
				$("ul#page_sel").html(startPagination( total_pages , response.page));
			}
		}
	})
}

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

	if (params["flight_number"] && params["flight_number"] != "") {
		/* searching for a specific flight */
		options[op].pages[page] = ajaxFlightInfo(
			params,
			options[op].sort_key,
			options[op].sort_order,
			page
		);
	}
	else {
		/* searching for airline */

		/* add aditional search options */
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
		ajaxAirlineInfo(
			params
		);

		/* ajax airline reviews */
		ajaxAirlineReviews(
			params,
			options[op].sort_key,
			options[op].sort_order,
			page,
			options[op]
		);
	}


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
		$("#reviews-container").css("opacity", "0.5");
		if (options[op].pages[page]) {
			loadReviews(options[op].pages[page]);
		}
		else {
			$.ajax({
				url: "http://hci.it.itba.edu.ar/v1/api/review.groovy",
			    jsonp: "callback",
			    dataType: "jsonp",
			    data: {
			      method: "getairlinereviews",
			      airline_id: params["airline_id"],
				  sort_key: options[op].sort_key,
				  sort_order: options[op].sort_order,
				  page: page,
				  page_size: 5
			    },
			    success: function(response) {
					if (response.error) {
						$("#reviews-container").append(displayError(response.error.code, "La busqueda de opiniones por aerolinea no esta andando desde la api"))
					}
					else {
						loadReviews(response.reviews);
						options[op].pages[page] = response.reviews;
					}
				}
			});
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
		$("#reviews-container").css("opacity", "0.5");
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
			$.ajax({
				url: "http://hci.it.itba.edu.ar/v1/api/review.groovy",
			    jsonp: "callback",
			    dataType: "jsonp",
			    data: {
			      method: "getairlinereviews",
			      airline_id: params["airline_id"],
				  sort_key: options[op].sort_key,
				  sort_order: options[op].sort_order,
				  page: page,
				  page_size: 5
			    },
			    success: function(response) {
					if (response.error) {
						$("#reviews-container").append(displayError(response.error.code, "La busqueda de opiniones por aerolinea no esta andando desde la api"))
					}
					else {
						loadReviews(response.reviews);
						options[op].pages[page] = response.reviews;
					}
				}
			});
		}
	});

});
