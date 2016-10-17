
var citiesObj = {};
var countryObj={};
var countryNameToId={};
var citiesIdtoName={};

$(document).ready(function(){


function getCountries(data){
  var paises = data.countries;
  var valores=[];
  for(var x = 0 ; x<paises.length ; x++ ){
     valores.push(paises[x].name);
     countryObj[paises[x].id]=paises[x].name;
     countryNameToId[paises[x].name]=paises[x].id;
  }
  setLocalObject("countryObj",countryObj);
  setLocalObject("countryNameToId",countryNameToId);
  var paises = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: valores
  });

  $('.typeaheadpaises').typeahead(
          {
              minLength: 1,
              highlight: true
          },
          {
              name: 'Paises',
              limit: 3,
              source: paises,
          }
  );
  }

function getCities(data){
  var ciudades = data.cities;
  var valores=[];
  for(var x = 0 ; x<ciudades.length ; x++ ){
     valores.push(ciudades[x].name.split(',')[0]);
     citiesObj[ciudades[x].name.split(',')[0]]=[ciudades[x].id,ciudades[x].name.split(',')[1],ciudades[x].country.id];
     citiesIdtoName[ciudades[x].id]=[ciudades[x].name.split(', ')[0],ciudades[x].id,ciudades[x].name.split(', ')[1],ciudades[x].country.id];
   }
   setLocalObject("citiesObj",citiesObj);
   setLocalObject("citiesIdtoName",citiesIdtoName);
  var ciudades = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: valores
  });

  $('.typeaheadciudades').typeahead(
          {
              minLength: 1,
              highlight: true
          },
          {
              name: 'Ciudades',
              limit: 3,
              source: ciudades,
          }
  );
  };

  $.ajax({
    type: 'GET',
    url: 'http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getcities',
    dataType: 'json' ,
    success: function(d){
      if(d.total<=d.page_size){
        getCities(d);
      } else {
        $.ajax({
          type: 'GET',
          url: 'http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getcities',
          dataType: 'json',
          data: {page_size:d.total},
          success: function(f){
            //fillAirportsAutocomplte(f);
            getCities(f);
          }
        });
      }
    }
  });

fajax("http://hci.it.itba.edu.ar/v1/api/geo.groovy",{"method": "getcountries"},getCountries,undefined);
//fajax("http://hci.it.itba.edu.ar/v1/api/geo.groovy",{"method": "getcities"},getCities,undefined);

  $("#pais").focusout(function(){
    if(countryObj[$(this).val()]==undefined){
        $(this).removeClass("valid");
        $(this).addClass("invalid");
    }else{
        $(this).removeClass("invalid");
        $(this).addClass("valid");
    }
  });
  $("#ciudad").focusout(function(){
    if(citiesObj[$(this).val()]==undefined){
        $(this).removeClass("valid");
        $(this).addClass("invalid");
    }else{
        $(this).removeClass("invalid");
        $(this).addClass("valid");
        $("#provincia").val(citiesObj[$(this).val()][1]);
        $("#pais").val(countryObj[citiesObj[$(this).val()][2]]);
    }
  });
  function addPassager(num) {
    var template = $('#pasajero_form').html();
    Mustache.parse(template);
    var rendered = Mustache.render(template,{
      indenti: num
    });
    $('nav').after(rendered);
  }

  function cargoPasajero(nombre,num){
    var nim=nombre+num;
    addPassager(nim);
    $('select').material_select();
    $(".tipo_id"+nim).mouseleave(function(){
      if($(".selected").text()=="Pasaporte"){
          $("#pasaporte"+nim).removeAttr("pattern");
          $("#pasaporte"+nim).attr("pattern","\\w{1,16}");
          $("#text_id"+nim).text("Pasaporte");
      }else{
          $("#pasaporte"+nim).removeAttr("pattern");
          $("#pasaporte"+nim).attr("pattern","\\d{1,16}");
          $("#text_id"+nim).text("Documento");
      }});
      var patron=/\w{2}\/\w{2}\/\w{4}/i;
      if(nombre=="infante"){
        $("#nacimiento"+nim).focusout(function(){
          if(!patron.test($(this).val())){
            $(this).removeClass("valid");
            $(this).addClass("invalid");
          }else if(parseInt($(this).val().split("/")[2])<2014){
            $(this).removeClass("valid");
            $(this).addClass("invalid");
          }else{
              $(this).removeClass("invalid");
              $(this).addClass("valid");
          }
        });
      }else if(nombre=="chico"){
        $("#nacimiento"+nim).focusout(function(){
        if(!patron.test($(this).val())){
          $(this).removeClass("valid");
          $(this).addClass("invalid");
        }else if(parseInt($(this).val().split("/")[2])<2014){
            $(this).removeClass("valid");
            $(this).addClass("invalid");
        }else{
            $(this).removeClass("invalid");
            $(this).addClass("valid");
        }
      });
    }else{
      $("#nacimiento"+nim).focusout(function(){
        if(!patron.test($(this).val())){
          $(this).removeClass("valid");
          $(this).addClass("invalid");
        }else{
            $(this).removeClass("invalid");
            $(this).addClass("valid");
        }
    });
  }
  }


  var cant_adultos=parseInt(getUrlParameter("adults"));
  var cant_chicos=parseInt(getUrlParameter("children"));
  var cant_infantes=parseInt(getUrlParameter("infants"));

  for (var i = 0; i < cant_infantes; i++) {
    var numero_actual=cant_infantes - i
    cargoPasajero("infante",numero_actual);
  }
  for (var i = 0; i < cant_chicos; i++) {
    var numero_actual=cant_chicos - i
    cargoPasajero("chico",numero_actual);
  }
  for (var i = 0; i < cant_adultos; i++) {
    var numero_actual=cant_adultos - i
    cargoPasajero("adulto",numero_actual);
  }

  function pullPassager(tipo,numero){
    var string_nombre=tipo+numero;
    var fesplit=$("#nacimiento"+string_nombre).val().split("/");
    var fecha_obj=fesplit[2]+"-"+fesplit[1]+"-"+fesplit[0];
    var passeger={
      "first_name": $("#nombre"+string_nombre).val(),
      "birthdate": fecha_obj,
      "id_type": parseInt($("select#tipo_id"+string_nombre).val()),
      "last_name": $("#apellido"+string_nombre).val(),
      "id_number": $("#pasaporte"+string_nombre).val()
    }
    return passeger;
  }

  function pullPayment(){
    var paisid=citiesObj[$("#ciudad").val()][0];
    var payment={
          installments:1, //cantidad de cuotas
          credit_card:{
            number: $("#tarjeta").val(),
            expiration: $("#fecaducidad").val().split("/")[0]+$("#fecaducidad").val().split("/")[1],
            security_code: $("#ccv").val(),
            first_name: $("#nombre").val(),
            last_name: $("#apellido").val(),
          },
          billing_address:{
            city:{
              id: citiesObj[$("#ciudad").val()][0],
              state: $("#provincia").val(),
              country:{
                id: countryNameToId[$("#pais").val()]
              }
            },
            zip_code:  $("#postal").val(),
            street: ($("#calle").val() + " " + $("#callnro").val()),
            floor: $("#piso").val(),
            apartment: $("#depto").val()
          }
        };
        return payment;
  }

  function pullContact(){
    var contact={
      email: $("#email").val(),
      phones: [ $("#telefono").val() ]
    }
    return contact;
  }

  $("#continuar").click(function(){
// TODO FALTA CHEQUYEAR LOS DATOS
    var payment=pullPayment();
    var contact=pullContact();
    var passengers=[];
    for (var i = 0; i < cant_infantes; i++) {
      var numero_actual=cant_infantes - i
      passengers.push(pullPassager("infante",numero_actual));
    }
    for (var i = 0; i < cant_chicos; i++) {
      var numero_actual=cant_chicos - i
      passengers.push(pullPassager("chico",numero_actual));
    }
    for (var i = 0; i < cant_adultos; i++) {
      var numero_actual=cant_adultos - i
      passengers.push(pullPassager("adulto",numero_actual));
    }
    setLocalObject("contact",contact);
    setLocalObject("payment",payment);
    setLocalObject("passengers",passengers);
    window.location="./detalle.html"+location.search;
  });
//funciones de verifiacion
var dia=new Date().getDate();
var mes=new Date().getMonth();
var anio=new Date().getYear()-100;

function checkNumberCard(dato){
  var patron=/^(((34)|(37))\d{13})|^(36\d{12})|((5[1-3])\d{14})|^(4\d{12,15})/i;
  return patron.test(dato);
}
function checkDateCard(dato){
  var patron=/^((3\d)|([0-2][0-9]))\/\d{2}/i;
  if(patron.test(dato)){
    return true; //TODO
  }
  return false;
}

function checkCcv(dato){
  var patron=/^\d{3,4}/i;
  return patron.test(dato);
}
function checkName(dato){
  var patron=/^([a-z]|[A-Z]|\s){1,80}/i;
  return patron.test(dato);
}
function checkStreet(dato){
  var patron=/^(.){1,70}/i;
  return patron.test(dato);
}
function checkStreetNumber(dato){
  var patron=/^(\d){1,10}/i;
  return patron.test(dato);
}
function checkFloor(dato){
  var patron=/^(\w){0,3}/i;
  return patron.test(dato);
}
function checkApartment(dato){
  var patron=/^\w{0,2}/i;
  return patron.test(dato);
}

function checkZipCode(dato){
  var patron=/^\w{1,10}/i;
  return patron.test(dato);
}

function checkCity(dato){
  var patron=/^\.{1,80}/i;
  if(patron.test(dato)){
    if(citiesObj[dato]!=undefined){
      return true;
    }
  }
  return false;
}

function checkPhone(dato){
  var patron=/^.{1,25}/i; //TODO
  return patron.test(dato);
}
function checkEmail(dato){
  var patron=/(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)/i;
  return patron.test(dato);
}
function checkIdType(dato){
  var patron=/(^(1|2))/i;
  return patron.test(dato);
}
function checkPassport(dato){
  var patron=/^\d{1,18}/i;
  return patron.test(dato);
}
function checkBirthDate(dato){
  var patron=/\d{2}\/\d{2}\/\d{4}/i;
  return patron.test(dato); //TODO
}

//fin de funciones de verificacion
});
