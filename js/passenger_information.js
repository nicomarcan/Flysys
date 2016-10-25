
var citiesObj = {};
var countryObj={};
var countryNameToId={};
var citiesIdtoName={};
var passengersList=[];
var passengersDict={};
var misc = 'http://hci.it.itba.edu.ar/v1/api/misc.groovy';
var to = 2000 ;
var airlineNameToId={};
var airlineNames = [];

var airlines = {};
var airlines_id = {};
$(document).ready(function(){

	$.when(
  	  ajaxAirlineSearch(airlines, airlines_id)
    ).then(
  	  airlineSearchSubmit(airlines, airlines_id)
  );

	$(document).on("click", "a.link", function() {
		var base = $(this).attr("href");
		if (base != "#!" && base != "./index.html") {
			window.location = base + location.search;
            return false;
		}
		return true;
	});

  var flights = getLocalObject("flights");

	if (!flights || getUrlParameter("children")==undefined || 	getUrlParameter("infants")==undefined || getUrlParameter("adults")==undefined) {
		$("#contenedor").html("");
		insertErrorCard(
			$("#contenedor"),
			"Ocurrió un error al cargar la información del vuelo.",
			"No se puede seguir con la compra. Por favor, reintente la búsqueda.",
			true,
			"home-link",
			"Volver al inicio."
		);
    	$("#continuador").remove();
    	return;
	}
  var aird = flights[0].outbound_routes[0].segments[0].departure.airport.id;
  var aira = flights[0].outbound_routes[0].segments[0].arrival.airport.id
  $("a#flight-path-breadcrumb").text("Vuelo de "+ aird + " a "+ aira);
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
}

  function addPassager(nombre,num) {
    var numeros=["primer","segundo","tercero","cuarto","quinto","sexto","séptimo","octavo","noveno","décimo","décimoprimero","décimosegundo","décimotercero","décimocuarto","décimoquinto","décimosexto","décimoseptimo","décimooctavo","décimonoveno","vigésimo"];
    var template = $('#pasajero_form').html();
	var err_conv = {
		"infante" : "Ingrese una fecha válida. Recuerde que los infantes deben ser menores de dos años.",
		"chico": "Ingrese una fecha válida. Recuerde que los niños deben ser mayores de dos años y menores de once.",
		"adulto" : "Ingrese una fecha válida. Recuerde que los adultos deben ser mayores de once años"
	};
	var n2=nombre;
	if(n2=="chico"){
		n2="niño";
	}
    Mustache.parse(template);
    var rendered = Mustache.render(template,{
      nombre: nombre,
			nombre2: n2,
      id: numeros[parseInt(num)-1],
      indenti: (nombre+num),
	  data_error: err_conv[nombre]
    });
    $('#header').after(rendered);
  }

  function cargoPasajero(nombre,num){
    var nim=nombre+num;
    addPassager(nombre,num);
    $('select').material_select();
    $(".tipo_id"+nim).mouseleave(function(){
      if($(".selected").text()=="Pasaporte"){
          $("#pasaporte"+nim).removeAttr("pattern");
          $("#pasaporte"+nim).attr("pattern","\\d{1,16}");
          $("#text_id"+nim).text("Pasaporte");
      }else{
          $("#pasaporte"+nim).removeAttr("pattern");
          $("#pasaporte"+nim).attr("pattern","\\d{1,16}");
          $("#text_id"+nim).text("Documento");
      }});
      actionfocusout("#nombre"+nim,checkName);
      actionfocusout("#apellido"+nim,checkName);
      actionfocusout("#pasaporte"+nim,checkPassport);
      actionfocusout("#nacimiento"+nim,checkBirthDate);
      $("#nacimiento"+nim).keyup(function(e){
        if(e.keyCode != 8){
          if($(this).val().length==2 || $(this).val().length==5){
            $(this).val($(this).val()+"/");
          }
          if(e.keyCode==111 && ($(this).val().length==4 || $(this).val().length==7)){
              $(this).val($(this).val().substring(0,$(this).val().length-1))
        }
      }
      });

      var patron=/\w{2}\/\w{2}\/\w{4}/i;
      if(nombre=="infante"){
        $("#nacimiento"+nim).focusout(function(){
          if(!checkBirthDateInfant($(this).val())){
            $(this).removeClass("valid");
            $(this).addClass("invalid");
          }else{
              $(this).removeClass("invalid");
              $(this).addClass("valid");
          }
        });
      }else if(nombre=="chico"){
        $("#nacimiento"+nim).focusout(function(){
        if(!checkBirthDateChildren($(this).val())){
          $(this).removeClass("valid");
          $(this).addClass("invalid");
        }else{
            $(this).removeClass("invalid");
            $(this).addClass("valid");
        }
      });
    }else{
      $("#nacimiento"+nim).focusout(function(){
        if(!checkBirthDateAdult($(this).val())){
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

  function pullPassenger(tipo,numero){
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

  function loadPassenger(nombre,psso, num){
    var string_nombre=nombre;
    setValInput("#nacimiento"+string_nombre,humanDate(psso.birthdate));
    setValInput("#nombre"+string_nombre,psso.first_name);
    setValInput("#apellido"+string_nombre,psso.last_name);
    setValInput("#pasaporte"+string_nombre,psso.id_number);
    setValInput("select#tipo_id"+string_nombre,psso.id_type);
	checkPassenger(nombre, ""); 
  }

  if(existLocalObject("passengersDict")){
    var valores=getLocalObject("passengersList");
    passengersDict=getLocalObject("passengersDict");
    for (var i = 0; i < valores.length; i++) {
      var cache=passengersDict[valores[i]];
      loadPassenger(valores[i],cache);
    }
  }



  $("#continuar").click(function(){
    var failedSend=false;
    var passengers=[];
    for (var i = 0; i < cant_infantes; i++) {
      var numero_actual=cant_infantes - i
      if(checkPassenger("infante",numero_actual)){
        var cache=pullPassenger("infante",numero_actual);
        passengers.push(cache);
        passengersList.push("infante"+numero_actual);
        passengersDict["infante"+numero_actual]=cache;
      }else{
        failedSend=true;
      }
    }
    for (var i = 0; i < cant_chicos; i++) {
      var numero_actual=cant_chicos - i
      if(checkPassenger("chico",numero_actual)){
        var cache=pullPassenger("chico",numero_actual);
        passengers.push(pullPassenger("chico",numero_actual));
        passengersList.push("chico"+numero_actual);
        passengersDict["chico"+numero_actual]=cache;
      }else{
        failedSend=true;
      }
    }
    for (var i = 0; i < cant_adultos; i++) {
      var numero_actual=cant_adultos - i
      if(checkPassenger("adulto",numero_actual)){
        var cache=pullPassenger("adulto",numero_actual);
        passengers.push(pullPassenger("adulto",numero_actual));
        passengersList.push("adulto"+numero_actual);
        passengersDict["adulto"+numero_actual]=cache;
      }else{
        failedSend=true;
      }
    }
    if(failedSend){
      passengers=[];
      return;
    }
    setLocalObject("passengersDict",passengersDict);
    setLocalObject("passengersList",passengersList);
    setLocalObject("passengers",passengers);
    window.location="./detalle.html"+location.search;
  });
  //copypasta
  /*
  if (existLocalObject("cacheNav")){
      loadAirlinesTypeahead(getLocalObject("cacheNav"),airlineNames,airlineNameToId);
  }else{
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
  }
  */
//endcopypasta
});
