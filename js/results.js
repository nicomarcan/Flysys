
var mode;
var src,dst;
var adults,children,infants;
var d1,d2;
var page,sort_by;

/*
* Segment 1 and Segment 2
*/
var s1,s2;
/*
* All combinations sorted by total price, duration
* and airline names.
*/
var total,duration,airline;

$(document).ready(function(){

  var booking = 'http://hci.it.itba.edu.ar/v1/api/booking.groovy' ;
  var geo = 'http://hci.it.itba.edu.ar/v1/api/geo.groovy';

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
  var values=new Array();
	var nameToId={};
  $.ajax({
    type: 'GET',
    url: geo,
    dataType: 'json' ,
    data: {
      method: 'getairports'
    },
    success: function(d){
      if(d.total<=d.page_size){
        fillAirportsAutocomplte(d,values,nameToId);
      } else {
        $.ajax({
          type: 'GET',
          url: geo,
          dataType: 'json',
          data: {
            method: 'getairports',
            page_size:d.total
          },
          success: function(f){
            fillAirportsAutocomplte(f,values,nameToId);
          }
        });
      }
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

  $.ajax({
    type: 'GET',
    url: booking,
    dataType: 'json',
    data: {
      method: 'getonewayflights',
      from: src ,
      to: dst ,
      dep_date: d1,
      adults: adults,
      children: children,
      infants: infants,
      /*
      * TODO: CHANGE
      */
      page_size:'1000'
    },
    success : function(d){
      s1 = d.flights;
      if(mode == "one-way"){
        var t_total = new Tree(function(a,b){
          return s1[a].price.total.total - s1[b].price.total.total;
        });
        var t_duration = new Tree(function(a,b){
          return timeToMins(s1[a].outbound_routes[0].segments[0].duration)-
                 timeToMins(s1[b].outbound_routes[0].segments[0].duration);
        });
        var t_airline = new Tree(function(a,b){
          return s1[a].outbound_routes[0].segments[0].airline.name.localeCompare(
                 s1[b].outbound_routes[0].segments[0].airline.name
          );
        });
        for(var i = 0; i<s1.length ; i++){
          t_total.insert(i);
          t_duration.insert(i);
          t_airline.insert(i);
        }
        total = t_total.inOrder() ;
        duration = t_duration.inOrder();
        airline = t_airline.inOrder();
        addOWResultS(total,0,4);
        initializeCollapsibles();
      } else {
        /*
        * Request return flights from dst to src
        */
        $.ajax({
          type: 'GET',
          url: booking,
          dataType: 'json',
          data: {
            method: 'getonewayflights',
            from: dst ,
            to: src ,
            dep_date: d2,
            adults: adults,
            children: children,
            infants: infants,
            /*
            * TODO: CHANGE
            */
            page_size: '1000'
          },
          success : function(d1){
            s2 = d1.flights;
            var t_total = new Tree(function(a,b){
              return (s1[a[0]].price.total.total + s2[a[1]].price.total.total)-
                     (s1[b[0]].price.total.total + s2[b[1]].price.total.total);
            });
            var t_duration = new Tree(function(a,b){
              return (timeToMins(s1[a[0]].outbound_routes[0].segments[0].duration) +
                      timeToMins(s2[a[1]].outbound_routes[0].segments[0].duration)) -
                     (timeToMins(s1[b[0]].outbound_routes[0].segments[0].duration) +
                      timeToMins(s2[b[1]].outbound_routes[0].segments[0].duration));
            });
            var t_airline = new Tree(function(a,b){
              return s1[a[0]].outbound_routes[0].segments[0].airline.name.concat(
                     s2[a[1]].outbound_routes[0].segments[0].airline.name).localeCompare(
                     s1[b[0]].outbound_routes[0].segments[0].airline.name.concat(
                     s2[b[1]].outbound_routes[0].segments[0].airline.name));
            });
            for(var i=0, total=0 ; i<s1.length ; i++) {
              for(var j=0; j<s2.length; j++) {
                var cmb = [];
                cmb[0]=i;cmb[1]=j;
                t_total.insert(cmb);
                t_duration.insert(cmb);
                t_airline.insert(cmb);
              }
            }
            total = t_total.inOrder() ;
            duration = t_duration.inOrder();
            airline = t_airline.inOrder();
            /*
            * TODO: Print here results
            */
            initializeCollapsibles();
          }
        });
      }
    }
  });
  /*
  * End results request.
  */


  var date2_picker = null ;
  var prevdate = null;
  $("#two-way #date1 input[name='_submit']").attrchange({
    trackValues: true,
    callback: function(event){
      var d = event.newValue ;
      var date = new Date(d.split("-")[0],d.split("-")[1]-1,d.split("-")[2]);
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

});

function initializeCollapsibles() {
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
}

function collapseAll(o = null){
  $(".collapsible-header").not(o).removeClass("active");
  $(".collapsible").not(o).collapsible({accordion: true});
}

function getUrlParameter(sParam) {
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
}


function addOWResult(total,from,dep,ac,fn,duration,to) {
  var template = $('#row').html();
  Mustache.parse(template);
  var rendered = Mustache.render(template, {
    total: total ,
    from_1: from ,
    departure_1: dep,
    airline_code_1: ac,
    flight_number_1: fn ,
    duration_1: duration,
    to_1: to
  });
  $('#results').append(rendered);
}

function addOWResultS(criterium,pageNo,pageSize){
  var length = criterium.length;
  var start = pageNo*pageSize;
  if(start>=length){
    /*
    * No such page
    */
    return false;
  }
  for(var i = start ; i<length && i < start + pageSize ; i++){
    addOWResult(
      s1[criterium[i]].price.total.total,
      s1[criterium[i]].outbound_routes[0].segments[0].departure.airport.id,
      s1[criterium[i]].outbound_routes[0].segments[0].departure.date,
      s1[criterium[i]].outbound_routes[0].segments[0].airline.id,
      s1[criterium[i]].outbound_routes[0].segments[0].number,
      s1[criterium[i]].outbound_routes[0].segments[0].duration,
      s1[criterium[i]].outbound_routes[0].segments[0].arrival.airport.id
    );
  }
  return true;
}

function fillAirportsAutocomplte(data,values,nameToId){
  var total = data.total;
  var airports = data.airports;
  var obj = [];
  for(var x = 0 ; x<total ; x++ ){
    obj.push(airports[x].description.split(", ")[1]) ;
    values.push(airports[x].description.split(", ")[1]);
    obj.push(airports[x].description) ;
    values.push(airports[x].description);
    nameToId[airports[x].description.split(", ")[1]] = airports[x].id;
    nameToId[airports[x].description] = airports[x].id;
  }
  console.log(obj);
  var blood_ciudades = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: obj
  });



  $('.typeahead').typeahead(
          {
              minLength: 3,
              highlight: true
          },
          {
              name: 'Ciudades',
              limit: 3,
              source: blood_ciudades,
          }
        );
  };

  function timeToMins(t){
    var s = t.split(":");
    return parseInt(s[0])*60 + parseInt(s[1]);
  }
