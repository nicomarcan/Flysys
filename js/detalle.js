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
    city: pago.billing_address.city.id,
    state: pago.billing_address.city.state,
    country: pago.billing_address.city.country.id,
    phone: contacto.phones[0],
    email: contacto.email
    });
  $('#confirmar').before(rendered);
}
var vueloejemplo={"price":{"adults":{"base_fare":278.00,"quantity":1},"children":{"base_fare":66.00,"quantity":1},"infants":{"base_fare":0.00,"quantity":1},"total":{"charges":13.76,"taxes":68.80,"fare":344.00,"total":426.56}},"outbound_routes":[{"segments":[{"arrival":{"date":"2016-12-25 07:09:00","airport":{"id":"TUC","description":"Aeropuerto Benjamin Matienzo, San Miguel de Tucuman, Argentina","time_zone":"-03:00","city":{"id":"TUC","name":"San Miguel de Tucuman, Tucuman","country":{"id":"AR","name":"Argentina"}}}},"departure":{"date":"2016-12-25 05:50:00","airport":{"id":"EZE","description":"Aeropuerto Ezeiza Ministro Pistarini, Buenos Aires, Argentina","time_zone":"-03:00","city":{"id":"BUE","name":"Buenos Aires, Ciudad de Buenos Aires","country":{"id":"AR","name":"Argentina"}}}},"id":94588,"number":8700,"cabin_type":"ECONOMY","airline":{"id":"8R","name":"SOL","rating":9.00},"duration":"01:19","stopovers":[]}],"duration":"01:19"}]};

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
      hora_lle_vuelo: vuelo.outbound_routes[0].segments[0].arrival.date,
      origen_vuelo: vuelo.outbound_routes[0].segments[0].arrival.airport.city.name,
      destino_vuelo: vuelo.outbound_routes[0].segments[0].departure.airport.city.name,
      precio_adulto_vuelo: vuelo.price.adults.base_fare,
      precio_chico_vuelo:  vuelo.price.children.base_fare,
      precio_infante_vuelo: vuelo.price.infants.base_fare
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
      bdate: pas.birthdate,
      passport: pas.id_number

      });
    $('#primero').after(rendered);
  }

}

$(document).ready(function(){
  setLocalObject("flights",[vueloejemplo]);
  addFlight();
  addCard();
  addPassagers();
  var final={
    flight_id: "93480",
    passengers: getLocalObject("passengers"),
    payment: getLocalObject("payment"),
    contact: getLocalObject("contact")
  }
  $("#confirmar").click(function(){
      fajax("http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=bookflight",final,console.log,undefined);
  });
});
