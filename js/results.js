$(document).ready(function(){
  $(".dropdown-button").dropdown();
  $('select').material_select();
  noUiSlider.create(document.getElementById('price-range'), {
    start: [ 1000, 9000 ],
    connect: [false, true,false],
    range: {
      'min': [  0 ],
      'max': [ 10000 ]
    } ,
    tooltips: true
  });

  $("#date1 .datepicker").pickadate({
    monthsFull: [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
    monthsShort: [ 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic' ],
    weekdaysFull: [ 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado' ],
    weekdaysShort: [ 'dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb' ],
    today: 'Hoy',
    clear: 'Borrar',
    close: 'Cerrar',
    firstDay: 1,
    format: 'd !de mmmm !de yyyy',
    formatSubmit: 'yyyy/mm/dd' ,
    min: true
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


  var date2_picker = null ;
  var prevdate = null;
  $("#two-way #date1 input[name='_submit']").attrchange({
    trackValues: true,
    callback: function(event){
      var d = event.newValue ;
      var date = new Date(d.split("/")[0],d.split("/")[1]-1,d.split("/")[2]);
      $("#date2 > input").removeAttr("disabled");
      if(date2_picker == null){
        date2_picker = $("#date2 .datepicker").pickadate({
          monthsFull: [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
          monthsShort: [ 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic' ],
          weekdaysFull: [ 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado' ],
          weekdaysShort: [ 'dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb' ],
          today: 'Hoy',
          clear: 'Borrar',
          close: 'Cerrar',
          firstDay: 1,
          format: 'd !de mmmm !de yyyy',
          formatSubmit: 'yyyy/mm/dd' ,
          disable: [{ from: [0,0,0], to: date }]
        });
      } else {
        var picker = date2_picker.pickadate('picker');
        picker.set('enable', [{from: [0,0,0], to: prevdate}]);
        picker.set('disable', [{ from: [0,0,0], to: date }]);
        $("#two-way #date2 .picker__input").val("");
        $("#two-way #date2 input[name='_submit']").removeAttr("value");
      }
      prevdate = date ;
    }
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
