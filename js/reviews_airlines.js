function updateAirlineInfoCard(airline) {
  $("img#info_airline_logo").attr("src", airline.logo);
  $("#info_airline_name").text(airline.name);
  $("#info_airline_code").text(airline.id);
  if (airline.rating == null) {
    $("#info_global_score").text("?");
  }
  else {
    $("#info_global_score").text(airline.rating);
  }
  $("#info_charges").text(airline.charges * 100 + "%");
  $("#info_taxes").text(airline.taxes * 100 + "%");
  $("a#airline_breadcrumb").text(airline.name);
}

$(document).ready(function() {
  var params = parseGET();

  $.ajax({
    url: "http://hci.it.itba.edu.ar/v1/api/review.groovy",
    jsonp: "callback",
    dataType: "jsonp",
    data: {
      method: "getairlinereviews",
      airline_id: params["airline_id"]
    },
    success: function(response) {
      if (response.error) {
        $("#reviews-container").append(displayError(response.error.code, "La busqueda de opiniones por aerolinea no esta andando desde la api"))
      }
      for ( var x in response.reviews) {
        $("#reviews-container").append(createReviewCard(response.reviews[x]));
      }
    }
  })

  $.ajax({
    url: "http://hci.it.itba.edu.ar/v1/api/misc.groovy",
    jsonp: "callback",
    data: {
      method: "getairlinebyid",
      id: params["airline_id"]
    },
    success: function(response) {
      if (response.error) {
        displayError()
      }
      updateAirlineInfoCard(response.airline);
    }
  });
});
