var misc = 'http://hci.it.itba.edu.ar/v1/api/misc.groovy';
var to = 2000 ;
var airlineNameToId={};
var airlineNames = [];
var airlines = {};
var airlines_id = {};
$(document).ready(function(){

	$.when(
  	  ajaxAirlineSearch(airlines, airlines_id)
    ).then(
  	  airlineSearchSubmit(airlines, airlines_id)
    )
	$(document).on("click", "a.link", function() {
		var base = $(this).attr("href");
		if (base != "#!" && base != "./index.html") {
			window.location = base + location.search;
            return false;
		}
		return true;
	});
  if(!existLocalObject("flights")){
    window.location="./index.html";
  }
  $("#continuar").click(function(){
     localStorage.clear();
     window.location="./index.html";
  })
	var flights=getLocalObject("flights");
	var aird = flights[0].outbound_routes[0].segments[0].departure.airport.id;
	var aira = flights[0].outbound_routes[0].segments[0].arrival.airport.id
	$("a#flight-path-breadcrumb").text("Vuelo de "+ aird + " a "+ aira);
	var flight_detail = getLocalObject(["flight_detail"]);
	if (!flight_detail) {
		$("#data-container").html("");
		insertErrorCard(
			$("#data-container"),
			"Ocurrió un error al cargar la información del vuelo.",
			"No se puede seguir con la compra. Por favor, reintente la búsqueda.",
			true,
			"home-link",
			"Volver al inicio."
		);
	}

  //copypasta
  /*
  $.ajax({
    type: 'GET',
    url: misc,
    dataType: 'json' ,
    timeout: to,
    data : {
      method: 'getairlines'
    },
    error: function(){
      noFlightsFound("Se ha agotado el tiempo de espera");
    },
    success: function(d){
      if(d.total<=d.page_size){
        loadAirlinesTypeahead(d,airlineNames,airlineNameToId);
      } else {
        $.ajax({
          type: 'GET',
          url: misc,
          dataType: 'json',
          timeout: to,
          data: {
            page_size:d.total,
            method: 'getairlines'
          },
          error: function(){
            noFlightsFound("Se ha agotado el tiempo de espera");
          },
          success: function(f){
            loadAirlinesTypeahead(f,airlineNames,airlineNameToId);
          }
        });
      }
    }
  });
  installAirlineSearchHandler()
  */
//endcopypasta
});
