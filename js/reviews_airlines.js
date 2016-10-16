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
    $("#info_global_score").css("background-color", color_scheme[parseInt((r_score+1) / 2) - 1]);
  }
  $("#info_charges").text(parseInt(airline.charges * 100) + "%");
  $("#info_taxes").text(parseInt(airline.taxes * 100) + "%");
  $("a#airline_breadcrumb").text(airline.name);
}

function startPagination(pages, page) {
	var el = '<li id="left_chevron" class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>';
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
	for ( var x in reviews) {
		$("#reviews-container").append(createReviewCard(reviews[x]));
	}
}

$(document).ready(function() {
	var params = parseGET();
	var pages = [];
	var total_pages;
	var page = 1;
  $.ajax({
    url: "http://hci.it.itba.edu.ar/v1/api/review.groovy",
    jsonp: "callback",
    dataType: "jsonp",
    data: {
      method: "getairlinereviews",
      airline_id: params["airline_id"],
	  page: 1,
	  page_size: 5
    },
    success: function(response) {
      if (response.error) {
        $("#reviews-container").append(displayError(response.error.code, "La busqueda de opiniones por aerolinea no esta andando desde la api"))
      }
      for ( var x in response.reviews) {
        $("#reviews-container").append(createReviewCard(response.reviews[x]));
      }
	  pages[1] = response.reviews;
	  total_pages = parseInt(response.total / response.page_size) + 1;
	  $("ul#page_sel").append(startPagination( total_pages , response.page));
    }
  })

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
      updateAirlineInfoCard(response.airline);
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
		$("#reviews-container").css("opacity", "0.5");
		if (pages[page]) {
			loadReviews(pages[page]);
		}
		else {
			$.ajax({
				url: "http://hci.it.itba.edu.ar/v1/api/review.groovy",
			    jsonp: "callback",
			    dataType: "jsonp",
			    data: {
			      method: "getairlinereviews",
			      airline_id: params["airline_id"],
				  page: page,
				  page_size: 5
			    },
			    success: function(response) {
					if (response.error) {
						$("#reviews-container").append(displayError(response.error.code, "La busqueda de opiniones por aerolinea no esta andando desde la api"))
					}
					else {
						loadReviews(response.reviews);
						pages[page] = response.reviews;
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
	})

	$(document).on('click', 'li#right_chevron', function() {
		if ($(this).hasClass('disabled')) {
			return false;
		}
		$("li.page_button").filter( function(index) {
			return $(this).attr("value") == (page + 1);
		}).click();
		return true;
	})


});
