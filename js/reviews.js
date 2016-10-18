function displayError(errorcode, errormsg) {
  var errorstr = $("#error_message_"+errorcode).html();
  var errorel = $.parseHTML(errorstr);
  $(errorel).children(".error_description").text(errormsg);
  return errorel;
}

color_scheme = [
  "#ff6f31",
  "#ff9f02",
  "#cabc0b",
  "#99cc00",
  "#88b131"
];

function parseGET() {
  var ret = {};
  var arr = location.search.substr(1).split("&");
  var tmp = [];
  for (var i = 0; i < arr.length; i++ ) {
    tmp = arr[i].split("=");
    ret[tmp[0]] = tmp[1];
  }
  return ret;
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

function insertReviewCards(reviews) {
	var template = $("#review_card").html();
	Mustache.parse(template);
	var render = Mustache.render(template, {
		reviews: reviews
	});
	$("#reviews-container").html(render);
}

var total_pages;
function ajaxReviews(params, sort_key, sort_order, page, option) {
	$("#reviews-container").css("opacity", "0.5");
  var data = {
    method: "getairlinereviews",
    airline_id: params["airline_id"],
    sort_key: sort_key,
    sort_order: sort_order,
    page: page,
    page_size: 5
  };
  if (params["flight_number"]) {
    data["flight_number"] = params["flight_number"];
  }
	$.ajax({
		url: "http://hci.it.itba.edu.ar/v1/api/review.groovy",
		jsonp: "callback",
		dataType: "jsonp",
		data: data,
		success: function(response) {
			if (response.error) {
				$("#reviews-container").append(displayError(response.error.code, "La busqueda de opiniones por aerolinea no esta andando desde la api"))
			}
      else if (response.total == 0) {
        insertErrorCard($("#reviews-container"), "No se encontraron opiniones.", "");
      }
      else {
        var reviews = response.reviews;
  			for (var r in reviews) {
  				for (var s in reviews[r].rating) {
  					var int_score = parseInt((reviews[r].rating[s] + 1)/ 2 - 1);
  					reviews[r].rating[s+"_color"] = color_scheme[int_score];
  					reviews[r].rating[s] = parseInt(reviews[r].rating[s] * 10);
  				}
  				reviews[r].comments = decodeURIComponent(reviews[r].comments);
  			}
  			insertReviewCards(reviews);
      }
			option.pages[page] = response.reviews;
			if ($("ul#page_sel").html() == false) {
				total_pages = parseInt(response.total / response.page_size) + 1;
				$("ul#page_sel").html(startPagination( total_pages , response.page));
			}
			$("#reviews-container").css("opacity", "1");
		}
	})
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
		departing_airport: departing_airport.description.split(',')[0]+ '(' + departing_airport.id+ ')',
		arriving_city: arriving_city.name,
		arriving_airport: arriving_airport.description.split(',')[0] + '(' + arriving_airport.id+ ')',
		distance: getDistance(departing_airport, arriving_airport) + " km"
	});
	$("#flight-info-card").append(render);
	$("a#airline_breadcrumb").text(airline.name);
	$("a#airline_breadcrumb").attr("href","./reviews_airlines.html?airline_id="+airline.id);
	$("a#flight_breadcrumb").text("Vuelo " +info.status.number);
}

function loadReviews(reviews) {
	$("#reviews-container").html('');
	$("#reviews-container").css("opacity", "1");
	insertReviewCards(reviews);
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

	$('select').material_select();
  /*
  $.ajax({
    url: "http://hci.it.itba.edu.ar/v1/api/misc.groovy",
    jsonp: "callback",
    dataType: "jsonp",
    data: {
      method: "getairlines"
    },
    success: function(response) {
      var airline_data = response.airlines;
      var ret = [];
      for (var i=0; i<response.total; i++) {
        ret[airline_data[i].name] = airline_data[i].logo;
        airlines[airline_data[i].name.toLowerCase()] = airline_data[i].id;
      }
      $("input#airline_search").autocomplete({
        data :  ret,
        select: function(event, ui) {
          $("input#airline_search").val(ui.item.value);
          $("form#airline_search_form").submit();
          return false;
        }
      });
      $("ul.autocomplete-content.dropdown-content").css("position","absolute").css("width", "100%");
    }
  });
  */


  
})
