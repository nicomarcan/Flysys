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
    formatSubmit: 'yyyy-mm-dd' ,
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
          formatSubmit: 'yyyy-mm-dd' ,
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



  /*
  * Begin results request.
  * Structure of URL parameters expected:
  * ?mode={one-way;two-way}&src=&dst=&adults=&children=&infants=&d1=&d2=&
  * page=&sort_by={total;duration;airline}
  *
  * d2 is only required when specifying "two-way" as the mode.
  * All other parameters are mandatory.
  *
  * Example:
  * ?mode=two-way&src=BUE&dst=MIA&adults=1&children=0&infants=0&d1=2016-12-01&d2=2016-12-20&page=1&sort_by=total
  */

  var mode;
  var src,dst;
  var adults,children,infants;
  var d1,d2;
  var page,sort_by;
  var owf_url = 'http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=getonewayflights' ;

  mode=getUrlParameter("mode");
  src=getUrlParameter("src");
  dst=getUrlParameter("dst");
  adults=getUrlParameter("adults");
  children=getUrlParameter("children");
  infants=getUrlParameter("infants");
  d1=getUrlParameter("d1");
  if( mode == "two-way" ) {
    d2=getUrlParameter("d2");
  }
  page=getUrlParameter("page");
  sort_by=getUrlParameter("sort_by");


  var r1,r2;
  $.ajax({
    type: 'GET',
    url: owf_url,
    dataType: 'json',
    data: {
      from: src ,
      to: dst ,
      dep_date: d1,
      adults: adults,
      children: children,
      infants: infants,
      page: page,
      sort_key: sort_by
    },
    success : function(d){
      r1 = d ;
    }
  });

  

  /*
  * End results request.
  */

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

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : sParameterName[1];
      }
  }
};
