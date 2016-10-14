function addCard() {
  var template = $('#detalletarjeta').html();
  Mustache.parse(template);
  var tar=localStorage.getItem("payment");
  var rendered = Mustache.render(template,{
    id: tar["id"],
    dni: tar["dni"]

  });
  $('#facturacion').append(rendered);
}

// $(document).ready(function(){
//
//
// }
