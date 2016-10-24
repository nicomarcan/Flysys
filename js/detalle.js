var countryObj=getLocalObject("countryObj");
var countryNameToId=getLocalObject("countryNameToId");
var citiesObj=getLocalObject("citiesObj");
var citiesIdtoName=getLocalObject("citiesIdtoName");
var flights=getLocalObject("flights");
var spanish_months = [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ];
var spanish_months_short = [ 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic' ];
var spanish_days = [ 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado' ];
var spanish_days_short = [ 'dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb' ];
var misc = 'http://hci.it.itba.edu.ar/v1/api/misc.groovy';
var to = 2000 ;
var airlineNameToId={};
var airlineNames = [];


function addCard() {
  var template = $('#detalletarjeta').html();
  Mustache.parse(template);
  var pago=getLocalObject("payment");
  var contacto=getLocalObject("contact");
  var rendered = Mustache.render(template,{
    id: pago.credit_card.number,
    expira: pago.credit_card.expiration,
    cuotas: pago.installments,
    sec_code: pago.credit_card.security_code,
    fname: pago.credit_card.first_name,
    lname: pago.credit_card.last_name,
    street: pago.billing_address.street,
    floor: pago.billing_address.floor,
    section: pago.billing_address.apartment,
    city: citiesIdtoName[pago.billing_address.city.id][0],
    state: pago.billing_address.city.state,
    country: countryObj[pago.billing_address.city.country.id],
    phone: contacto.phones[0],
    email: contacto.email
    });
  $('#botones').before(rendered);
}

function addFlight(){
  var template = $('#detallevuelo').html();
  Mustache.parse(template);
  var vuelos=getLocalObject("flights");
  for (var i = 0; i < vuelos.length; i++) {
    var vuelo=vuelos[i];
    var rendered = Mustache.render(template,{
      id_vuelo: vuelo.outbound_routes[0].segments[0].id,
      fecha_vuelo: vuelo.outbound_routes[0].segments[0].arrival.date,
      hora_sal_vuelo: vuelo.outbound_routes[0].segments[0].arrival.date,
      hora_lle_vuelo: vuelo.outbound_routes[0].segments[0].departure.date,
      origen_vuelo: vuelo.outbound_routes[0].segments[0].arrival.airport.city.name,
      destino_vuelo: vuelo.outbound_routes[0].segments[0].departure.airport.city.name,
       precio_adulto_vuelo: vuelo.price.adults.base_fare
      // precio_chico_vuelo:  vuelo.price.children.base_fare,
      // precio_infante_vuelo: vuelo.price.infants.base_fare
      });
    $('#detalle').append(rendered);
  }
}
function addPassagers() {
  var template = $('#detallepasajero').html();
  Mustache.parse(template);
  var pasajeros=getLocalObject("passengers");
  for (var i = 0; i < pasajeros.length; i++) {
    var pas=pasajeros[i];
    var rendered = Mustache.render(template,{
      idpasajero:i,
      fname: pas.first_name,
      lname: pas.last_name,
      bdate: humanDate(pas.birthdate),
      passport: pas.id_number

      });
    $('#primero').after(rendered);
  }

}

function finalizado(){
  window.location="./final.html"
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

function twStars(id_1,id_2){
  // var rep_1,rep_2;
  // rep_1 = rep_2 = 0;
  // for (var j = 0; j<airlines.length ; j++){
  //   if(airlines[j].id == id_1){
  //     if(airlines[j].rating != null){
  //       rep_1 = airlines[j].rating;
  //     }
  //   }
  //   if (airlines[j].id == id_2) {
  //     if(airlines[j].rating != null){
  //       rep_2 = airlines[j].rating;
  //     }
  //   }
  // }
  // var avg = (rep_1 + rep_2)/2;
  // return Math.round(avg/2);
  return Math.round(7/2);
}

function addOW(nstars,total,from,dep,ac,fn,duration,to,index) {
  total*=10;
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
    to_1: to,
    index: index
  });
  $('#detalle').append(rendered);
}

function addTW(nstars,total,from,dep,ac,fn,duration,to,
                           from1,dep1,ac1,fn1,duration1,to1,index) {
  total*=1; //fix
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
    to_2: to1,
    index: index
  });
  $('#detalle').append(rendered);
}


$(document).ready(function(){


  //addFlight();
  addCard();
  addPassagers();

  // addOWResult(
  //     owStars(id),
  //     s1[criterium[i]].price.total.total,
  //     s1[criterium[i]].outbound_routes[0].segments[0].departure.airport.id,
  //     humanSpanishDate(d[0]) + "<br/>" + humanHour(d[1]),
  //     s1[criterium[i]].outbound_routes[0].segments[0].airline.id,
  //     s1[criterium[i]].outbound_routes[0].segments[0].number,
  //     "  " + s1[criterium[i]].outbound_routes[0].segments[0].duration + "  ",
  //     s1[criterium[i]].outbound_routes[0].segments[0].arrival.airport.id,
  //     criterium[i]
  //   );
  //var rep = importantStars(stars[i]);
  if(flights.length==1){
    var vuelo=flights[0];
    var id = vuelo.outbound_routes[0].segments[0].airline.id;
    var d = vuelo.outbound_routes[0].segments[0].departure.date.split(" ");
    addOW(
      id,
        vuelo.price.total.total,
        vuelo.outbound_routes[0].segments[0].departure.airport.id,
        humanDate(d[0]) + "<br/>" + humanHour(d[1]),
        vuelo.outbound_routes[0].segments[0].airline.id,
        vuelo.outbound_routes[0].segments[0].number,
        "  " + vuelo.outbound_routes[0].segments[0].duration + "  ",
        vuelo.outbound_routes[0].segments[0].arrival.airport.id,
        vuelo
    )
  }else{
    var id_1,id_2;
    id_1 = flights[0].outbound_routes[0].segments[0].airline.id;
    id_2 = flights[1].outbound_routes[0].segments[0].airline.id;

    var d_1,d_2;
    d_1 = flights[0].outbound_routes[0].segments[0].departure.date.split(" ");
    d_2 = flights[1].outbound_routes[0].segments[0].departure.date.split(" ");
    addTW(
        twStars(id_1,id_2),
        flights[0].price.total.total + flights[1].price.total.total,
        flights[0].outbound_routes[0].segments[0].departure.airport.id,
        humanDate(d_1[0]) + "<br/>" + humanHour(d_1[1]) ,
        flights[0].outbound_routes[0].segments[0].airline.id,
        flights[0].outbound_routes[0].segments[0].number,
        "  " + flights[0].outbound_routes[0].segments[0].duration + "  ",
        flights[0].outbound_routes[0].segments[0].arrival.airport.id,
        flights[1].outbound_routes[0].segments[0].departure.airport.id,
        humanDate(d_2[0]) + "<br/>" + humanHour(d_2[1]),
        flights[1].outbound_routes[0].segments[0].airline.id,
        flights[1].outbound_routes[0].segments[0].number,
        "  " + flights[1].outbound_routes[0].segments[0].duration + "  ",
        flights[1].outbound_routes[0].segments[0].arrival.airport.id,
        1
      );
  }



  $("#confirmar").click(function(){
    //getLocalObject("flights")[0].outbound_routes[0].segments[0].id
      for (var i = 0; i < flights.length; i++) {
        var fe=flights[i];
        var final={
          flight_id: fe.outbound_routes[0].segments[0].id,
          passengers: getLocalObject("passengers"),
          payment: getLocalObject("payment"),
          contact: getLocalObject("contact")
        }
        fajax("http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=bookflight2",{booking: JSON.stringify(final)},undefined,undefined);
      }

      finalizado();
  });
  $("#back").click(function(){
     window.location="./datos.html"+location.search;
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
