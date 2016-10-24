var misc = 'http://hci.it.itba.edu.ar/v1/api/misc.groovy';
var to = 2000 ;
var airlineNameToId={};
var airlineNames = [];

$(document).ready(function(){
  $("#continuar").click(function(){
     localStorage.clear();
     window.location="./index.html";
  })
  //copypasta
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
//endcopypasta
});
