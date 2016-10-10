$(document).ready( function() {
  $("dropdown-button").dropdown();

  $.ajax({
    url: "http://hci.it.itba.edu.ar/v1/api/status.groovy",
    jsonp: "callback",
    dataType: "jsonp",
    data: {
      method: "getflightstatus",
      airline_id: "AR",
      flight_number: "5260"
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
      airline_id: "AR",
      flight_number: "5260"
    },
    success: function(response) {
      var sum = 0;
      for ( var x in response.reviews) {
        $("#reviews-container").append(createReviewCard(response.reviews[x]));
      }
    }
  })
})
