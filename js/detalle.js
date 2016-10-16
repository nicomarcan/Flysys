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
  $('#facturacion').append(rendered);
}
function addPassagers() {
  var template = $('#detallepasajero').html();
  Mustache.parse(template);
  var pasajeros=getLocalObject("passengers");
  for (var i = 0; i < pasajeros.length; i++) {
    console.log(pasajeros[i]);
    var pas=pasajeros[i];
    var rendered = Mustache.render(template,{
      idpasajero:i,
      fname: pas.first_name,
      lname: pas.last_name,
      bdate: pas.birthdate,
      passport: pas.id_number

      });
    $('#correcto').before(rendered);
  }

}

$(document).ready(function(){
  addCard();
  addPassagers();
});
