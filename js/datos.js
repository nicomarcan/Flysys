
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

function netwrokError(){
  Materialize.toast("Error en la conexion con el servidor",5000)
}


fajax("http://hci.it.itba.edu.ar/v1/api/geo.groovy",{"method": "getcountries"},getCountries,netwrokError);
fajax("http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getcities&page_size=300",undefined,getCities,netwrokError);


  $("#ciudad").focusout(function(){
    if(citiesObj[$(this).val()]==undefined){
        $(this).removeClass("valid");
        $(this).addClass("invalid");
        $("#provincia").val("");
        $("#pais").val("");
    }else{
        $(this).removeClass("invalid");
        $(this).addClass("valid");
        $("#provincia").val(citiesObj[$(this).val()][1]);
        $("#pais").val(countryObj[citiesObj[$(this).val()][2]]);
    }
  });
  actionfocusout("#tarjeta",checkNumberCard);
  actionfocusout("fecaducidad",checkDateCard);
  actionfocusout("#ccv",checkCcv);
  actionfocusout("#nombre",checkName);
  actionfocusout("#apellido",checkName);
  actionfocusout("#postal",checkZipCode);
  actionfocusout("#calle",checkStreet);
  actionfocusout("#piso",checkFloor);
  actionfocusout("#depto",checkApartment);
  actionfocusout("#email",checkEmail);
  actionfocusout("#telefono",checkPhone);




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
    if(!checkPayment()){
      return;
    }
    var payment=pullPayment();
    var contact=pullContact();
    setLocalObject("contact",contact);
    setLocalObject("payment",payment);
    window.location="./detalle.html"+location.search;
  });
//funciones de verifiacion

});
