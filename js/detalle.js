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
