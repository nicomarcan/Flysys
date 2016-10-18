var pageSize = 7 ;

var mode;
var src,dst;
var adults,children,infants;
var d1,d2;
var page,sort_by;
var usdToArs;

var min,max;
var price_slider;
/*
* Airline data
*/
var airlines;
/*
* Airport data
*/
var values=new Array();
var nameToId={};
/*
* First and second flight requests
*/
var req1,req2;
/*
* Segment 1 and Segment 2
*/
var s1,s2;
/*
* All combinations sorted by total price, duration
* and airline names.
*/
var total,duration,airline;
/*
* Filter settings
*/
var multiplier = 1;
var currCrit,currPage;
var currMin,currMax;
var currAirlines = [],currStars;
var applied,result;

$(document).ready(function(){

  var booking = 'http://hci.it.itba.edu.ar/v1/api/booking.groovy' ;
  var geo = 'http://hci.it.itba.edu.ar/v1/api/geo.groovy';
  var misc = 'http://hci.it.itba.edu.ar/v1/api/misc.groovy';

  $(".dropdown-button").dropdown();
  $('select').material_select();

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

  $("#result-description").text("Vuelos de " + src + " a " + dst + " , partiendo el " + d1 + (mode=="one-way" ? "." : " y retornando el " + d2));

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

  $.ajax({
    type: 'GET',
    url: misc,
    dataType: 'json',
    data: {
      method: 'getcurrenciesratio',
      id1: 'USD',
      id2: 'ARS'
    },
    success: function(r){
      usdToArs = r.ratio;
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
                $.ajax({
                  type: 'GET',
                  url: misc,
                  dataType: 'json',
                  data: {
                    method: 'getairlines'
                  },
                  success : function(a){
                    airlines = a.airlines;
                    /*
                    * Begin results request.
                    * Structure of URL parameters expected:
                    * ?mode={one-way;two-way}&src=&dst=&adults=&children=&infants=&d1=&d2=&
                    * page=&sort_by={total;duration;airline}
                    *
                    * d2 is only required when specifying "two-way" as the mode.
                    * All other parameters are mandatory.
                    *
                    * Examples:
                    * ?mode=two-way&src=BUE&dst=MIA&adults=1&children=0&infants=0&d1=2016-12-01&d2=2016-12-20
                    * ?mode=one-way&src=BUE&dst=MAD&adults=1&children=0&infants=0&d1=2016-12-01&d2=2016-12-20
                    */

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
                        req1=d;
                        s1 = d.flights;
                        if(s1 === undefined){
                          noFlightsFound();
                          return;
                        }
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
                          var pages = s1.length/pageSize + (s1.length%pageSize == 0 ? 0:1);
                          insertPaginator(pages);
                          currCrit = 0;
                          min = currMin = req1.filters[2].min;
                          max = currMax = req1.filters[2].max;
                          applied = true ;
                          result = total;
                          setCurrPage(0);
                          initializeSlider(currMin,currMax);

                          var inserted = [];
                          addAirlineS(inserted,result,s1);
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
                              req2=d1;
                              s2 = d1.flights;
                              if(s2 === undefined){
                                noFlightsFound();
                                return;
                              }
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
                              for(var i=0 ; i<s1.length ; i++) {
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
                              var pages = (s1.length*s2.length)/pageSize +
                                          ((s1.length*s2.length)%pageSize == 0 ? 0:1);
                              insertPaginator(pages);
                              currCrit=0;
                              min = currMin = req1.filters[2].min+req2.filters[2].min;
                              max = currMax = req1.filters[2].max+req2.filters[2].max;
                              applied = true ;
                              result = total;
                              setCurrPage(0);
                              initializeSlider(currMin,currMax);

                              var t1 = [] , t2 = [];
                              for(var i = 0; i<result.length ; i++){
                                t1[i]=result[i][0];
                                t2[i]=result[i][1];
                              }
                              var inserted = [];
                              inserted = addAirlineS(inserted,t1,s1);
                              addAirlineS(inserted,t2,s2);
                            }
                          });
                        }
                      }
                    });
                    /*
                    * End results request.
                    */
                  }
                });
              }
            });
          }
        }
      });
    }

  });


  $("div.tool-element.order ul.dropdown-content.select-dropdown li").click(function(event){
    var criterium = $(this).text();
    switch (criterium) {
      case "Precio":
        currCrit = 0;
        break;
      case "Duración":
        currCrit = 1;
        break;
      case "Aerolínea":
        currCrit = 2;
        break;
      default:
        return false;
    }
    applied = false;
    setCurrPage(0);
    return true;
  });

  $("div.tool-element.currency ul.dropdown-content.select-dropdown li").click(function(event){
    var currency = $(this).text();
    switch (currency) {
      case "USD":
        if(multiplier != 1){
          multiplier = 1;
          currMin/=usdToArs;
          currMax/=usdToArs;
          updateSlider(price_slider,min,max,currMin,currMax);
        }
        break;
      case "ARS":
          if(multiplier == 1){
            multiplier = usdToArs;
            currMin*=usdToArs;
            currMax*=usdToArs;
            updateSlider(price_slider,min*usdToArs,max*usdToArs,currMin,currMax);
          }
        break;
      default:
        return false;
    }
    applied = true;
    setCurrPage(currPage);
    return true;
  });

  $("#price-update").click(function(event){
     var bounds = price_slider.noUiSlider.get();
     currMin = bounds[0];
     currMax = bounds[1];
     applied = false;
     setCurrPage(0);
  });

});

function toggleAirline(e){
  var airline = ($(e.target).attr("id"));
  var index = arrIncludes(currAirlines,airline);
  if(index != -1){
    currAirlines.splice(index,1);
  } else {
    currAirlines[currAirlines.length]=airline;
  }
  applied = false ;
  setCurrPage(0);
}

function arrIncludes(arr,val){
  for(var i=0; i<arr.length ; i++){
    if(arr[i] == val){
      return i;
    }
  }
  return -1;
}

function setCurrPage(page){
  var resultsRenderer ;
  switch (mode) {
    case "one-way":
      resultsRenderer = addOWResultS;
      break;
    case "two-way":
      resultsRenderer = addTWResultS;
      break;
    default:
      return false;
  }
  $('#results').empty();
  if(!applied){
    var tmp;
    switch (currCrit) {
      case 0:
        tmp  = total;
        break;
      case 1:
        tmp = duration;
        break;
      case 2:
        tmp = airline;
        break;
      default:
        return false;
    }
    result = [];
    for(var i=0,k=0 ; i<tmp.length ; i++){
      /*
      * Insert the appropriate flights:
      * currMin,currMax,currStars,currAirlines
      * are the criteria to consider
      */
      var price;
      switch (mode) {
        case "one-way":
          price = s1[tmp[i]].price.total.total * multiplier;
          var id = s1[tmp[i]].outbound_routes[0].segments[0].airline.id;
          if (price>=currMin && price<=currMax &&
              arrIncludes(currAirlines,id) == -1){
                result[k++]=tmp[i];
              }
          break;
        case "two-way":
          price = (s1[tmp[i][0]].price.total.total +
                  s2[tmp[i][1]].price.total.total)*multiplier ;
          var id_1,id_2;
          id_1 = s1[tmp[i][0]].outbound_routes[0].segments[0].airline.id;
          id_2 = s2[tmp[i][1]].outbound_routes[0].segments[0].airline.id;

          if(price>=currMin && price<=currMax &&
             arrIncludes(currAirlines,id_1) == -1 &&
             arrIncludes(currAirlines,id_2) == -1){
               result[k++]=tmp[i];
             }
          break;
        default:
      }
    }
    var pages = result.length/pageSize + (result.length%pageSize == 0 ? 0:1);
    insertPaginator(pages);
    applied = true;
  }
  resultsRenderer(result,page,pageSize);
  var paginators = $('#paginator li');
  $(paginators[currPage]).removeClass("active");
  $(paginators[page]).addClass("active");
  currPage=page;
  initializeCollapsibles();
}

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

function insertPaginator(npags){
  $("#paginator").empty();
  var template = $("#paginator-item").html();
  Mustache.parse(template);
  for(var i=1; i<=npags; i++){
    var activeness = i==1 ? "active" : "";
    var rendered = Mustache.render(template, {
      activeness: activeness,
      number: i
    });
    $("#paginator").append(rendered);
  }
}

function addAirlineS(inserted,index_vector,references){
  for( var i=0 , k=0 ; i<index_vector.length ; i++ ) {
    var name = references[index_vector[i]].outbound_routes[0].segments[0].airline.name;
    var id = references[index_vector[i]].outbound_routes[0].segments[0].airline.id;
    if(arrIncludes(inserted,id) == -1){
      addAirline(id,name);
      inserted[inserted.length]=id;
    }
  }
  return inserted;
}

function addAirline(id_aero,name_aero){
  var template = $('#airline').html();
  Mustache.parse(template);
  var rendered = Mustache.render(template, {
    id_aero: id_aero,
    name_aero: name_aero
  });
  $('#airlines-panel').append(rendered);
}

function addOWResult(nstars,total,from,dep,ac,fn,duration,to) {
  total*=multiplier;
  total = Math.floor(total * 100)/100;
  var template = $('#row').html();
  Mustache.parse(template);
  var rep = importantStars(nstars);
  var rendered = Mustache.render(template, {
    i1: rep[0],
    i2: rep[1],
    i3: rep[2],
    i4: rep[3],
    i5: rep[4],
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

function addTWResult(nstars,total,from,dep,ac,fn,duration,to,
                           from1,dep1,ac1,fn1,duration1,to1) {
  total*=multiplier;
  total = Math.floor(total * 100)/100;
  var template = $('#rtw').html();
  Mustache.parse(template);
  var rep = importantStars(nstars);
  var rendered = Mustache.render(template, {
    i1: rep[0],
    i2: rep[1],
    i3: rep[2],
    i4: rep[3],
    i5: rep[4],
    total: total ,
    from_1: from ,
    departure_1: dep,
    airline_code_1: ac,
    flight_number_1: fn ,
    duration_1: duration,
    to_1: to,
    from_2: from1 ,
    departure_2: dep1,
    airline_code_2: ac1,
    flight_number_2: fn1 ,
    duration_2: duration1,
    to_2: to1
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
  for(var i = start; i<length && i < start + pageSize ; i++){
    var id = s1[criterium[i]].outbound_routes[0].segments[0].airline.id;
    var rep = 0;
    for (var j = 0; j<airlines.length ; j++){
      if(airlines[j].id == id){
        if(airlines[j].rating != null){
          rep = airlines[j].rating;
        }
        break;
      }
    }
    var nstars = Math.floor(rep/2) + rep%2;
    addOWResult(
        nstars,
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

function addTWResultS(criterium,pageNo,pageSize){
  var length = criterium.length;
  var start = pageNo*pageSize;
  if(start>=length){
    /*
    * No such page
    */
    return false;
  }
  for(var i = start ; i<length && i < start + pageSize; i++){
    var id_1,id_2;
    id_1 = s1[criterium[i][0]].outbound_routes[0].segments[0].airline.id;
    id_2 = s2[criterium[i][1]].outbound_routes[0].segments[0].airline.id;
    var rep_1,rep_2;
    rep_1 = rep_2 = 0;
    for (var j = 0; j<airlines.length ; j++){
      if(airlines[j].id == id_1){
        if(airlines[j].rating != null){
          rep_1 = airlines[j].rating;
        }
      }
      if (airlines[j].id == id_2) {
        if(airlines[j].rating != null){
          rep_2 = airlines[j].rating;
        }
      }
    }
    var avg = (rep_1 + rep_2)/2;
    var nstars = Math.floor(avg/2) + Math.floor(avg)%2;
    addTWResult(
        nstars,
        s1[criterium[i][0]].price.total.total + s2[criterium[i][1]].price.total.total,
        s1[criterium[i][0]].outbound_routes[0].segments[0].departure.airport.id,
        s1[criterium[i][0]].outbound_routes[0].segments[0].departure.date,
        s1[criterium[i][0]].outbound_routes[0].segments[0].airline.id,
        s1[criterium[i][0]].outbound_routes[0].segments[0].number,
        s1[criterium[i][0]].outbound_routes[0].segments[0].duration,
        s1[criterium[i][0]].outbound_routes[0].segments[0].arrival.airport.id,
        s2[criterium[i][1]].outbound_routes[0].segments[0].departure.airport.id,
        s2[criterium[i][1]].outbound_routes[0].segments[0].departure.date,
        s2[criterium[i][1]].outbound_routes[0].segments[0].airline.id,
        s2[criterium[i][1]].outbound_routes[0].segments[0].number,
        s2[criterium[i][1]].outbound_routes[0].segments[0].duration,
        s2[criterium[i][1]].outbound_routes[0].segments[0].arrival.airport.id
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

  function initializeSlider(min,max){
    price_slider = document.getElementById("price-range");
    noUiSlider.create(price_slider, {
      start: [ min, max ],
      connect: [false, true,false],
      range: {
        'min': [min],
        'max': [max]
      } ,
      tooltips: true
    });
  }

  function updateSlider(slider,min,max,in_min,in_max){
    slider.noUiSlider.updateOptions({
      start: [in_min,in_max],
      range: {
        'min': [min],
        'max': [max]
      }
    });
  }

  function noFlightsFound(){
    $("#results div.preloader").empty();
    $("#results div.preloader").append("<div><p>Su búsqueda no ha arrojado resultados</p></div>");
  }

  function importantStars(rep){
    var ret = [] ;
    for (var i = 0; i < 5 ; i++){
      if(rep > i){
        ret[i] = "important";
      } else {
        ret[i] = "unimportant";
      }
    }
    return ret;
  }
