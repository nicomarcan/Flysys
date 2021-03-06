var spanish_months = [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ];
var spanish_months_short = [ 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic' ];
var spanish_days = [ 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado' ];
var spanish_days_short = [ 'dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb' ];


var pageSize = 7 ;
var intervalHours = 1;
var to = 2000 ;

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
var idToName={};
/*
* Airline data
*/
var airlineNameToId={};
var airlineNames = [];
/*
*
*/
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
var total,duration,airline,reputation;
/*
* Filter settings
*/
var multiplier = 1;
var npages ;
var currCrit,currPage;
var currMin,currMax;
var currAirlines = [],currStars = [];
var applied,result;
var currCurrency = "USD" ;
var airlines = {};
var airlines_id = {};
$(document).ready(function(){
    $.when(
  	  ajaxAirlineSearch(airlines, airlines_id)
    ).then(
  	  airlineSearchSubmit(airlines, airlines_id)
    )
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

  $("#date1 .datepicker ").pickadate({
    monthsFull: spanish_months,
    monthsShort: spanish_months_short,
    weekdaysFull: spanish_days,
    weekdaysShort: spanish_days_short,
    close: 'Cerrar',
    firstDay: 1,
    format: 'd !de mmmm !de yyyy',
    formatSubmit: 'yyyy-mm-dd' ,
    min: 2,
    onRender: function(){
      $("#date1 .picker__footer .picker__button--today").remove();
      $("#date1 .picker__footer .picker__button--clear").remove();
    }
  });

  $("#date1_1 .datepicker ").pickadate({
    monthsFull: spanish_months,
    monthsShort: spanish_months_short,
    weekdaysFull: spanish_days,
    weekdaysShort: spanish_days_short,
    close: 'Cerrar',
    firstDay: 1,
    format: 'd !de mmmm !de yyyy',
    formatSubmit: 'yyyy-mm-dd' ,
    min: 2,
    onRender: function(){
      $("#date1_1 .picker__footer .picker__button--today").remove();
      $("#date1_1 .picker__footer .picker__button--clear").remove();
    }
  });

  var date2_picker = $("#date2 .datepicker").pickadate({
      monthsFull: spanish_months,
      monthsShort: spanish_months_short,
      weekdaysFull: spanish_days,
      weekdaysShort: spanish_days_short,
      close: 'Cerrar',
      firstDay: 1,
      format: 'd !de mmmm !de yyyy',
      formatSubmit: 'yyyy-mm-dd' ,
      min: 2,
      onRender: function(){
        $("#date2 .picker__footer .picker__button--today").remove();
        $("#date2 .picker__footer .picker__button--clear").remove();
      }
    });

  var prevdate = null;
  $("#two-way #date1 input[name='_submit']").attrchange({
    trackValues: true,
    callback: function(event){
      if(event.attributeName != "value"){
        return;
      }
      var d = event.newValue ;
      var date = new Date(d.split("-")[0],d.split("-")[1]-1,d.split("-")[2]);
      if (date == "Invalid Date"){
        return;
      }
      var picker = date2_picker.pickadate('picker');
      picker.set('enable', [{from: [0,0,0], to: prevdate}]);
      picker.set('disable', [{ from: [0,0,0], to: date }]);
      $("#two-way #date2 .picker__input").val("");
      $("#two-way #date2 input[name='_submit']").removeAttr("value");
      prevdate = date ;
    }
  });

  $.ajax({
    type: 'GET',
    url: misc,
    dataType: 'json',
    timeout: to,
    data: {
      method: 'getcurrenciesratio',
      id1: 'USD',
      id2: 'ARS'
    },
    error: function(){
      noFlightsFound("Se ha agotado el tiempo de espera");
    },
    success: function(r){
      usdToArs = r.ratio;
      var conv_ratio = {} ;
      conv_ratio["usdToArs"]=usdToArs;
      setLocalObject("conv_ratio",conv_ratio);
      $.ajax({
        type: 'GET',
        url: geo,
        dataType: 'json' ,
        timeout: to,
        data: {
          method: 'getairports'
        },
        error: function(){
          noFlightsFound("Se ha agotado el tiempo de espera");
        },
        success: function(d){
          if(d.total<=d.page_size){
            fillAirportsAutocomplte(d,values,nameToId);
          } else {
            $.ajax({
              type: 'GET',
              url: geo,
              dataType: 'json',
              timeout: to,
              data: {
                method: 'getairports',
                page_size:d.total
              },
              error: function(){
                noFlightsFound("Se ha agotado el tiempo de espera");
              },
              success: function(f){
                fillAirportsAutocomplte(f,values,nameToId);
                $.ajax({
                  type: 'GET',
                  url: misc,
                  dataType: 'json',
                  timeout: to,
                  data: {
                    method: 'getairlines'
                  },
                  error: function(){
                    noFlightsFound("Se ha agotado el tiempo de espera");
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
                      timeout: to,
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
                      error: function(){
                        noFlightsFound("Se ha agotado el tiempo de espera");
                      },
                      success : function(d){
                        req1=d;
                        if(req1.total == 0 || req1.error != undefined){
                          noFlightsFound();
                          return;
                        }
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
                          var t_reputation = new Tree(function(a,b){
                            return -(owStars(s1[a].outbound_routes[0].segments[0].airline.id)-
                                   owStars(s1[b].outbound_routes[0].segments[0].airline.id));
                          });
                          for(var i = 0; i<s1.length ; i++){
                            t_total.insert(i);
                            t_duration.insert(i);
                            t_airline.insert(i);
                            t_reputation.insert(i);
                          }
                          total = t_total.inOrder() ;
                          duration = t_duration.inOrder();
                          airline = t_airline.inOrder();
                          reputation = t_reputation.inOrder();
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
                          addStars(presentStars());
                          $("#result-description").html(total.length + " vuelos de " + "ida" +" desde " + idToName[src] + " hacia " + idToName[dst]+".");
                        } else {
                          /*
                          * Request return flights from dst to src
                          */
                          $.ajax({
                            type: 'GET',
                            url: booking,
                            dataType: 'json',
                            timeout: to,
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
                            error: function(){
                              noFlightsFound("Se ha agotado el tiempo de espera");
                            },
                            success : function(d1){
                              req2=d1;
                              if(req1.total == 0 || req2.total == 0 ||
                                req1.error != undefined ||
                                req2.error != undefined){
                                noFlightsFound();
                                return;
                              }
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
                              var t_reputation = new Tree(function(a,b){
                                return -(twStars(s1[a[0]].outbound_routes[0].segments[0].airline.id,
                                                 s2[a[1]].outbound_routes[0].segments[0].airline.id) -
                                         twStars(s1[b[0]].outbound_routes[0].segments[0].airline.id,
                                                 s2[b[1]].outbound_routes[0].segments[0].airline.id));

                              });
                              for(var i=0 ; i<s1.length ; i++) {
                                for(var j=0; j<s2.length; j++) {
                                  var a1,d2;
                                  a1= s1[i].outbound_routes[0].segments[0].arrival.date.split(" ");
                                  d2= s2[j].outbound_routes[0].segments[0].departure.date.split(" ");
                                  if(a1[0] == d2[0]){
                                    var sp1=a1[1].split(":"),sp2 = d2[1].split(":");
                                    var h1,h2;
                                    h1 = sp1[0]*3600 + sp1[1]*60 + sp1[2];
                                    h2 = sp2[0]*3600 + sp2[1]*60 + sp2[2];
                                    if(h1>=(h2+intervalHours*3600)){
                                      continue;
                                    }
                                  }
                                  var cmb = [];
                                  cmb[0]=i;cmb[1]=j;
                                  t_total.insert(cmb);
                                  t_duration.insert(cmb);
                                  t_airline.insert(cmb);
                                  t_reputation.insert(cmb);
                                }
                              }
                              total = t_total.inOrder() ;
                              duration = t_duration.inOrder();
                              airline = t_airline.inOrder();
                              reputation = t_reputation.inOrder();
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
                              addStars(presentStars());
                              $("#result-description").html(total.length + " vuelos de " + "ida y vuelta" +" desde " + idToName[src] + " hacia " + idToName[dst]+".");
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
      case "Reputación":
        currCrit = 3;
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
        if(currCurrency != "USD"){
          multiplier = 1;
          currCurrency = "USD";
          currMin/=usdToArs;
          currMax/=usdToArs;
          updateSlider(price_slider,min,max,currMin,currMax);
        }
        break;
      case "ARS":
          if(currCurrency != "ARS"){
            multiplier = usdToArs;
            currCurrency = "ARS";
            currMin*=usdToArs;
            currMax*=usdToArs;
            updateSlider(price_slider,min*usdToArs,max*usdToArs,currMin,currMax);
          }
        break;
      default:
        return false;
    }
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

  $("#delete-filters").click(deleteFilters);


  /*begin passenger selection*/

  $(".btn.minus:not(.adults)").click(function(event){
    var n = $($(event.target).parent().next().children()[0]).text();
    if(n==0){
      return;
    }
    var set = parseInt(n) -1;
    $($(event.target).parent().next().children()[0]).text(set);
    event.stopPropagation();
  });

  $(".btn.minus.adults").click(function(event){
    var n = $($(event.target).parent().next().children()[0]).text();
    if(n==1){
      return;
    }
    var set = parseInt(n) -1;
    $($(event.target).parent().next().children()[0]).text(set);
    event.stopPropagation();
  });

  $(".btn.plus").click(function(event){
    var n = $($(event.target).parent().prev().children()[0]).text();
    var set = parseInt(n) +1;
    $($(event.target).parent().prev().children()[0]).text(set);
    event.stopPropagation();
  });

  /*end passenger selection*/


  /*begin search button*/

  $("#tw_search").click(function(event){
    var src = nameToId[$("#two-way #from_input").val()] ;
    var dst = nameToId[$("#two-way #to_input").val()];
    var d1 = $('#two-way #date1 input[name=_submit]').val();
    var d2 = $('#two-way #date2 input[name=_submit]').val(); ;
    var adults = $("#adults_number").text();
    var children = $("#children_number").text();
    var infants = $("#infants_number").text();

    var errors=false;
    if(src == undefined){
      errors=true;
      showMessage($("#two-way #from_input"));
    }
    if(dst == undefined){
      errors=true;
      showMessage($("#two-way #to_input"));
    }
    if(d1 == ""){
      errors=true;
      showMessage($('#two-way #date1 input'));
    }

    if(d2 == ""){
      errors=true;
      showMessage($('#two-way #date2 input'));
    }

    if(adults + children + infants == 0){
      errors = true;
      showMessage($("#pass_btn_1"));
    }

    var path = "results.html?mode=two-way&src=" + src + "&dst=" + dst +
    "&adults=" + adults +"&children="+children + "&infants=" + infants +
     "&d1=" + d1 + "&d2=" + d2;

    if(!errors){
      window.location = path;
    }
  });

  $("#ow_search").click(function(event){
    var src = nameToId[$("#one-way #from_input_1").val()] ;
    var dst = nameToId[$("#one-way #to_input_1").val()];
    var d1 = $('#one-way #date1_1 input[name=_submit]').val();
    var adults = $("#adults_number_1").text();
    var children = $("#children_number_1").text();
    var infants = $("#infants_number_1").text();

    var errors=false;
    if(src == undefined){
      errors=true;
      showMessage($("#one-way #from_input_1"));
    }
    if(dst == undefined){
      errors=true;
      showMessage($("#one-way #to_input_1"));
    }
    if(d1 == ""){
      errors=true;
      showMessage($('#one-way #date1_1 input'));
    }

    if(adults + children + infants == 0){
      errors = true;
      showMessage($("#pass_btn_2"));
    }

    var path = "results.html?mode=one-way&src=" + src + "&dst=" + dst +
    "&adults=" + adults +"&children="+children + "&infants=" + infants +
     "&d1=" + d1;
    if(!errors){
      window.location = path;
    }
  });

  /*end search button*/

});

function deleteFilters(){
  currMin = min*multiplier;
  currMax = max*multiplier;
  updateSlider(price_slider,currMin,currMax,currMin,currMax);
  currStars = [];
  currAirlines = [];
  applied = false;

  $('#airlines-panel').empty();
  $('#stars-panel').empty();
  switch (mode) {
    case "one-way":
      var inserted = [];
      addAirlineS(inserted,total,s1);
      break;
    case "two-way":
      var t1 = [] , t2 = [];
      for(var i = 0; i<total.length ; i++){
        t1[i]=total[i][0];
        t2[i]=total[i][1];
      }
      var inserted = [];
      inserted = addAirlineS(inserted,t1,s1);
      addAirlineS(inserted,t2,s2);
      break;
    default:
      return false;
  }
  addStars(presentStars());
  setCurrPage(0);
}


function toggleStars(selected){
  var index = arrIncludes(currStars,selected);
  if(index != -1){
    currStars.splice(index,1);
  } else {
    currStars[currStars.length]=selected;
  }
  applied = false;
  setCurrPage(0);
}

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
      case 3:
        tmp = reputation;
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
      var delta = 0.001 * multiplier;
      switch (mode) {
        case "one-way":
          price = s1[tmp[i]].price.total.total * multiplier;
          var id = s1[tmp[i]].outbound_routes[0].segments[0].airline.id;
          if (price + delta>=currMin && price - delta<=currMax &&
              arrIncludes(currAirlines,id) == -1 &&
              arrIncludes(currStars,owStars(id)) == -1){
                result[k++]=tmp[i];
              }
          break;
        case "two-way":
          price = (s1[tmp[i][0]].price.total.total +
                  s2[tmp[i][1]].price.total.total)*multiplier ;
          var id_1,id_2;
          id_1 = s1[tmp[i][0]].outbound_routes[0].segments[0].airline.id;
          id_2 = s2[tmp[i][1]].outbound_routes[0].segments[0].airline.id;

          if(price + delta>=currMin && price - delta<=currMax &&
             arrIncludes(currAirlines,id_1) == -1 &&
             arrIncludes(currAirlines,id_2) == -1 &&
             arrIncludes(currStars,twStars(id_1,id_2)) == -1){
               result[k++]=tmp[i];
             }
          break;
        default:
      }
    }
    var pages = result.length/pageSize + (result.length%pageSize == 0 ? 0:1);
    set=true;
    insertPaginator(pages);
    applied = true;
  }
  resultsRenderer(result,page,pageSize);
  currPage=page;
  initializeCollapsibles();
}

function initializeCollapsibles() {
  $(".collapsible").collapsible({
    accordion : false
  });

  $("div.individual-result .purchase-btn.btn").click(function(event){
    var index = $(event.target).attr("id");
    var flights = [];
    switch (mode) {
      case "one-way":
        flights[0]=s1[index];
        break;
      case "two-way":
        flights[0]=s1[index.split(",")[0]];
        flights[1]=s2[index.split(",")[1]];
        break;
      default:
        return false;
    }
    setLocalObject("multiplier",multiplier);
    setLocalObject("flights",flights);
    var flight_detail = {};
    flight_detail["currency"] = currCurrency;
    flight_detail["adults"] = adults ;
    flight_detail["children"] = children ;
    flight_detail["infants"] = infants ;
    setLocalObject("flight_detail",flight_detail);
    window.location = "datos.html"+location.search;
    event.stopPropagation();
  });

  $("div.individual-result .flight-detail.btn").click(function(event){
    var flight = $(event.target).attr("id").split(",");
    var path = "review.html?airline_id="+ flight[0] +"&flight_number=" + flight[1] ;
    window.location = path;
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

var set=false;
function insertPaginator(npags){
  $("#paginator").empty();
	$("#paginator").materializePagination({
    firstPage:  1,
	  lastPage: npags,
	  align: 'center',
    useUrlParameter: false,
    onClickCallback: function(n){
      if(!set){
        setCurrPage(n-1);
        $("html, body").animate({scrollTop: "0"}, 600);
      }
      set=false;
      $("#paginator ul.pagination li").each(function() {
          if ($(this).hasClass("changed")) {
              return;
          }
          $(this).addClass("page_button");
          $(this).addClass("changed");
          var pnum = $(this).html();
          if (pnum != "...") {
            $(this).html("<a>"+ pnum +"</a>");
          }
          else {
            $(this).html("<a>"+pnum+"</a>");
          }
      });
    }
	});
  $("#paginator ul.pagination li").each(function() {
    var pnum = $(this).html();
    $(this).addClass("page_button");
    $(this).addClass("changed");
    if (pnum != "...") {
      $(this).html("<a>"+ pnum +"</a>");
    }
    else {
      $(this).html("<a>"+pnum+"</a>");
    }
  });
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

function addOWResult(adult,child,infant,taxes,charges,nstars,total,from,dep,ac,fn,duration,to,index,an,arr,airp_1,airp_2) {
  total*=multiplier;
  total = Math.floor(total * 100)/100;
  adult = adult=="--"? "--" : Math.floor(adult * 100*multiplier)/100;
  child = child=="--"? "--" : Math.floor(child * 100*multiplier)/100;
  infant = infant=="--"? "--" : Math.floor(infant * 100*multiplier)/100;
  taxes = Math.floor(taxes * 100*multiplier)/100;
  charges = Math.floor(charges * 100*multiplier)/100;
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
    to_1: to,
    index: index,
    adult: adult,
    child: child,
    infant: infant,
    taxes: taxes,
    charges: charges,
    cmb_code: ac + "," + fn,
    airline_name_1: an,
    arrival_1: arr,
    airp_1: airp_1,
    airp_2: airp_2
  });
  $('#results').append(rendered);
}

function addTWResult(adult,child,infant,taxes,charges,nstars,total,from,dep,ac,fn,duration,to,
                           from1,dep1,ac1,fn1,duration1,to1,index,an,an1,arr,arr1,airp_1,airp_2,airp_3,airp_4) {
  total*=multiplier;
  total = Math.floor(total * 100)/100;
  adult = adult=="--"? "--" : Math.floor(adult * 100*multiplier)/100;
  child = child=="--"? "--" :Math.floor(child * 100*multiplier)/100;
  infant = infant=="--"? "--" :Math.floor(infant * 100*multiplier)/100;
  taxes = Math.floor(taxes * 100*multiplier)/100;
  charges = Math.floor(charges * 100*multiplier)/100;
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
    to_2: to1,
    index: index,
    adult: adult,
    child: child,
    infant: infant,
    taxes: taxes,
    charges: charges,
    cmb_code_1: ac + "," + fn,
    cmb_code_2: ac1 + "," + fn1,
    airline_name_1: an,
    airline_name_2: an1,
    arrival_1: arr,
    arrival_2: arr1,
    airp_1: airp_1,
    airp_2: airp_2,
    airp_3: airp_3,
    airp_4: airp_4
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
    var d = s1[criterium[i]].outbound_routes[0].segments[0].departure.date.split(" ");
    var a = s1[criterium[i]].outbound_routes[0].segments[0].arrival.date.split(" ");
    var adult,child,infant,taxes,charges;
    adult = s1[criterium[i]].price.adults != null ? s1[criterium[i]].price.adults.base_fare : "--";
    child = s1[criterium[i]].price.children != null ? s1[criterium[i]].price.children.base_fare : "--";
    infant = s1[criterium[i]].price.infants != null ? s1[criterium[i]].price.infants.base_fare : "--";
    taxes = s1[criterium[i]].price.total.taxes;
    charges = s1[criterium[i]].price.total.charges;
    addOWResult(
        adult,
        child,
        infant,
        taxes,
        charges,
        owStars(id),
        s1[criterium[i]].price.total.total,
        s1[criterium[i]].outbound_routes[0].segments[0].departure.airport.id,
        humanSpanishDate(d[0]) + "<br/>" + humanHour(d[1]),
        s1[criterium[i]].outbound_routes[0].segments[0].airline.id,
        s1[criterium[i]].outbound_routes[0].segments[0].number,
        "  " + s1[criterium[i]].outbound_routes[0].segments[0].duration + "  ",
        s1[criterium[i]].outbound_routes[0].segments[0].arrival.airport.id,
        criterium[i],
        s1[criterium[i]].outbound_routes[0].segments[0].airline.name,
        humanSpanishDate(a[0]) + "<br/>" + humanHour(a[1]),
        s1[criterium[i]].outbound_routes[0].segments[0].departure.airport.description,
        s1[criterium[i]].outbound_routes[0].segments[0].arrival.airport.description
      );
  }
  return true;
}

function owStars(id){
  var rep = 0;
  for (var j = 0; j<airlines.length ; j++){
    if(airlines[j].id == id){
      if(airlines[j].rating != null){
        rep = airlines[j].rating;
      }
      break;
    }
  }
  return Math.round(rep/2);
}

function twStars(id_1,id_2){
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
  return Math.round(avg/2);
}

function presentStars(){
  var ret = [];
  switch (mode) {
    case "one-way":
      for(var i=0; i<total.length ; i++){
        var id = s1[total[i]].outbound_routes[0].segments[0].airline.id;
        var star = owStars(id);
        if(arrIncludes(ret,star) == -1){
          ret[ret.length]=star;
        }
      }
      break;
    case "two-way":
      for(var i=0; i<total.length ; i++){
        var id_1 = s1[total[i][0]].outbound_routes[0].segments[0].airline.id;
        var id_2 = s2[total[i][1]].outbound_routes[0].segments[0].airline.id;
        var star = twStars(id_1,id_2);
        if(arrIncludes(ret,star) == -1){
          ret[ret.length]=star;
        }
      }
      break;
    default:

  }
  ret.sort();
  return ret;
}


function addStars(stars){
  var template = $('#individual-star-array').html();
  Mustache.parse(template);
  for(var i=0 ; i<stars.length ; i++){
    var rep = importantStars(stars[i]);
    var rendered = Mustache.render(template, {
      n: stars[i],
      i1: rep[0],
      i2: rep[1],
      i3: rep[2],
      i4: rep[3],
      i5: rep[4]
    });
    $('#stars-panel').append(rendered);
  }
  $(".search-panel.filter-element.stars form.filter-tool input").change(function(){
    var selected = $(this).context.getAttribute("id");
    toggleStars(selected);
  });
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

    var d_1,d_2;
    d_1 = s1[criterium[i][0]].outbound_routes[0].segments[0].departure.date.split(" ");
    d_2 = s2[criterium[i][1]].outbound_routes[0].segments[0].departure.date.split(" ");
    var a_1,a_2;
    a_1 = s1[criterium[i][0]].outbound_routes[0].segments[0].arrival.date.split(" ");
    a_2 = s2[criterium[i][1]].outbound_routes[0].segments[0].arrival.date.split(" ");
    var adult,child,infant,taxes,charges;
    adult = s1[criterium[i][0]].price.adults != null ? s1[criterium[i][0]].price.adults.base_fare : "--";
    adult += (adult == "--" ? "" : s2[criterium[i][1]].price.adults.base_fare);
    child = s1[criterium[i][0]].price.children != null ? s1[criterium[i][0]].price.children.base_fare : "--";
    child += (child == "--" ? "" : s2[criterium[i][1]].price.children.base_fare);
    infant = s1[criterium[i][0]].price.infants != null ? s1[criterium[i][0]].price.infants.base_fare : "--";
    infant += (infant == "--" ? "" : s2[criterium[i][1]].price.infants.base_fare);
    taxes = s1[criterium[i][0]].price.total.taxes + s2[criterium[i][1]].price.total.taxes;
    charges = s1[criterium[i][0]].price.total.charges + s2[criterium[i][1]].price.total.charges;
    addTWResult(
        adult,
        child,
        infant,
        taxes,
        charges,
        twStars(id_1,id_2),
        s1[criterium[i][0]].price.total.total + s2[criterium[i][1]].price.total.total,
        s1[criterium[i][0]].outbound_routes[0].segments[0].departure.airport.id,
        humanSpanishDate(d_1[0]) + "<br/>" + humanHour(d_1[1]) ,
        s1[criterium[i][0]].outbound_routes[0].segments[0].airline.id,
        s1[criterium[i][0]].outbound_routes[0].segments[0].number,
        "  " + s1[criterium[i][0]].outbound_routes[0].segments[0].duration + "  ",
        s1[criterium[i][0]].outbound_routes[0].segments[0].arrival.airport.id,
        s2[criterium[i][1]].outbound_routes[0].segments[0].departure.airport.id,
        humanSpanishDate(d_2[0]) + "<br/>" + humanHour(d_2[1]),
        s2[criterium[i][1]].outbound_routes[0].segments[0].airline.id,
        s2[criterium[i][1]].outbound_routes[0].segments[0].number,
        "  " + s2[criterium[i][1]].outbound_routes[0].segments[0].duration + "  ",
        s2[criterium[i][1]].outbound_routes[0].segments[0].arrival.airport.id,
        criterium[i],
        s1[criterium[i][0]].outbound_routes[0].segments[0].airline.name,
        s2[criterium[i][1]].outbound_routes[0].segments[0].airline.name,
        humanSpanishDate(a_1[0]) + "<br/>" + humanHour(a_1[1]),
        humanSpanishDate(a_2[0]) + "<br/>" + humanHour(a_2[1]),
        s1[criterium[i][0]].outbound_routes[0].segments[0].departure.airport.description,
        s1[criterium[i][0]].outbound_routes[0].segments[0].arrival.airport.description,
        s2[criterium[i][1]].outbound_routes[0].segments[0].departure.airport.description,
        s2[criterium[i][1]].outbound_routes[0].segments[0].arrival.airport.description
      );
  }
  return true;
}

function fillAirportsAutocomplte(data,values,nameToId){
  var total = data.total;
  var airports = data.airports;
  var obj = [];
  console.log(data);
  for(var x = 0 ; x<total ; x++ ){
    obj.push(airports[x].description.split(", ")[1]) ;
    values.push(airports[x].description.split(", ")[1]);
    obj.push(airports[x].description) ;
    values.push(airports[x].description);
    nameToId[airports[x].description.split(", ")[1]] = airports[x].city.id;
    nameToId[airports[x].description] = airports[x].id;
    idToName[airports[x].city.id] = airports[x].description.split(", ")[1];
    idToName[airports[x].id] = airports[x].description.split(", ")[1];
  }
  var blood_ciudades = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: obj
  });



      $('#from_input , #to_input , #from_input_1 , #to_input_1 ').typeahead(
              {
                  minLength: 2,
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

  function noFlightsFound(message = "Su búsqueda no ha arrojado resultados"){
    $("#results div.preloader").empty();
    $("#results div.preloader").append("<div><p>"+message+"</p></div>");
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

  function humanSpanishDate(date){
    var d = date.split("-");
    var ret = "";
    ret+=d[2] + " de ";
    ret+=spanish_months[d[1]-1] + " de ";
    ret+=d[0];
    return ret;
  }
  //hh:mm:ss
  function humanHour(hour){
    var h = hour.split(":");
    return h[0] + ":" + h[1];
  }

  function showMessage(elem){
    elem.addClass("tooltipped");
  	elem.tooltip('remove');
		elem.tooltip('add');
		elem.mouseenter();
		setTimeout(function(){
      elem.tooltip('remove');
      elem.removeClass("tooltipped");
    }, 5000);
  }
