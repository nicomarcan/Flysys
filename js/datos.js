var i=1;
var form='<div class="container-fluid row passangerform">\
<div class="col s10 offset-s1">\
    <div class="card-panel row">\
    <div class="row" style="padding:5px; margin:0px;">\
    <div class="col s10">\
    Informacion del pasajero '+i+'\
</div>\
</div>\
<form id="pasajero1">\
    <div class="row">\
    <div class="input-field col s6">\
    <input id="nombre" type="text" class="validate"/>\
    <label for="nombre">Nombre</label>\
    </div>\
    <div class="input-field col s6">\
    <input id="apellido'+'feooo'+'" type="text" class="validate"/>\
    <label for="apellido">Apellido</label>\
    </div>\
    <div class="row">\
    <div class="input-field col s8">\
    <input id="Pasaporte" type="text" class="validate"/>\
    <label for="Pasaporte">Pasaporte</label>\
    </div>\
    <div class="date-field col s4">\
    <label for="Destino">Fecha de nacimiento</label>\
<input type="date" class="datepicker"/>\
    </div>\
    </div>\
    <div class="row">\
    <p>\
    <input name="group1" type="radio" id="test1" />\
    <label for="test1">Macho</label>\
    </p>\
    <p>\
    <input name="group1" type="radio" id="test2" />\
    <label for="test2">Hembra</label>\
    </p>\
    </div>\
    </div>\
    </form>\
    </div>\
    </div>\
    </div>';

$(document).ready(function(){


function getCountries(data){
  var paises = data.countries;
  var valores=[];
  var airportObj = {};
  for(var x = 0 ; x<paises.length ; x++ ){
    // airportObj[airports[x].description] = null;
    // airportObj[airports[x].description.split(", ")[1]] = null;
     valores.push(paises[x].name);
    // valores.push(airports[x].description.split(", ")[1]);
    // nameToId[airports[x].description] = airports[x].id;
    // nameToId[airports[x].description.split(", ")[1]] = airports[x].id;
  }
  console.log(valores);
}
function getCities(data){
  var ciudades = data.cities;
  var valores=[];
  var airportObj = {};
  for(var x = 0 ; x<ciudades.length ; x++ ){
    // airportObj[airports[x].description] = null;
    // airportObj[airports[x].description.split(", ")[1]] = null;
     valores.push(ciudades[x].name.split(',')[0]);
    // valores.push(airports[x].description.split(", ")[1]);
    // nameToId[airports[x].description] = airports[x].id;
    // nameToId[airports[x].description.split(", ")[1]] = airports[x].id;
  }
  console.log(valores);
}
fajax("http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getcountries",getCountries,undefined);
fajax("http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getcities",getCities,undefined);

  $('select').material_select();
  var cant_pa=getUrlParameter("pasajeros");
  for (i = 1; i < parseInt(cant_pa); i++) {
    $(".passangerform").after(form);
    console.log(i);
  }
  $('.eliminar').click(function(){
      $(this).closest(".passangerform").remove();
  })
  $('.datepicker').pickadate({
  });
});
