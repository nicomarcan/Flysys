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
      updateFlightInfoCard(response);
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
  })
})
