$(document).ready(function(){
  $(".dropdown-button").dropdown();
  $('select').material_select();
  noUiSlider.create(document.getElementById('price-range'), {
    start: [ 1000, 9000 ],
    connect: [false, true,false],
    range: {
      'min': [  0 ],
      'max': [ 10000 ]
    }
  });
  $(".datepicker").pickadate({
    monthsFull: [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
    monthsShort: [ 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic' ],
    weekdaysFull: [ 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado' ],
    weekdaysShort: [ 'dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb' ],
    today: 'Hoy',
    clear: 'Borrar',
    close: 'Cerrar',
    firstDay: 1,
    format: 'd !de mmmm !de yyyy',
    formatSubmit: 'yyyy/mm/dd'
  });

  var airports_url = 'http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getairports';
  $.ajax({
    type: 'GET',
    url: airports_url,
    dataType: 'json' ,
    success: function(d){
      if(d.total<=d.page_size){
        fillAirportsAutocomplte(d);
      } else {
        $.ajax({
          type: 'GET',
          url: airports_url,
          dataType: 'json',
          data: {page_size:d.total},
          success: function(f){
            fillAirportsAutocomplte(f);
          }
        });
      }
    }
  });


  $(".collapsible").collapsible({
    accordion : false
  });

  $(".btn").click(function(event){
    event.stopPropagation();
  });

  $("ul.collapsible").click(function(event){
    collapseAll($(this));
    event.stopPropagation();
  });

  $("ul.collapsible li").click(function(event){
    if($(this).is(".active")){
      collapseAll();
      event.stopPropagation();
    }
  })

  $(window).click(function(){
    collapseAll();
  });

});

function collapseAll(o = null){
  $(".collapsible-header").not(o).removeClass("active");
  $(".collapsible").not(o).collapsible({accordion: true});
}

function fillAirportsAutocomplte(data){
  console.log(data.total);
  var total = data.total;
  var airports = data.airports;
  var airportObj = {};
  for(var x = 0 ; x<total ; x++ ){
    var city = airports[x].description.split(", ")[1];
    airportObj[city] = null;
    airportObj[airports[x].description] = null;
  }
  $('#Origen,#Destino').autocomplete({
    data: airportObj,
  });
}
