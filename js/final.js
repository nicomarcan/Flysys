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

  if(!existLocalObject("flights")){
    window.location="./index.html";
  }
  $("#continuar").click(function(){
     localStorage.clear();
     window.location="./index.html";
  })
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
