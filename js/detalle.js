var countryObj=getLocalObject("countryObj");
var countryNameToId=getLocalObject("countryNameToId");
var citiesObj=getLocalObject("citiesObj");
var citiesIdtoName=getLocalObject("citiesIdtoName");
var flights=getLocalObject("flights");

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


function addOWResult(nstars,total,from,dep,ac,fn,duration,to,index) {
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

function addTWResult(nstars,total,from,dep,ac,fn,duration,to,
                           from1,dep1,ac1,fn1,duration1,to1,index) {
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
    to_2: to1,
    index: index
  });
  $('#detalle').append(rendered);
}


$(document).ready(function(){

  var countryObj=getLocalObject("countryObj");
  var countryNameToId=getLocalObject("countryNameToId");
  var citiesObj=getLocalObject("citiesObj");
  var citiesIdtoName=getLocalObject("citiesIdtoName");
  addFlight();
  addCard();
  addPassagers();




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

});
