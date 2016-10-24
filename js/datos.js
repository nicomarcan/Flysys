
var citiesObj = {};
var countryObj={};
var countryNameToId={};
var citiesIdtoName={};
var to = 2000 ;
var airlineNameToId={};
var airlineNames = [];
var misc = 'http://hci.it.itba.edu.ar/v1/api/misc.groovy';

function loadPayment(){

	if(existLocalObject("payment") && existLocalObject("contact")){
		var lpayment=getLocalObject("payment");
		var lcontact=getLocalObject("contact");
		setValInput("#tarjeta",lpayment.credit_card.number);
		setValInput("#fecaducidad",humanExpirationDate(lpayment.credit_card.expiration));
		setValInput("#ccv",lpayment.credit_card.security_code);
		setValInput("#nombre",lpayment.credit_card.first_name);
		setValInput("#apellido",lpayment.credit_card.last_name);
		setValInput("#calle",lpayment.billing_address.street_name);
		setValInput("#callnro",lpayment.billing_address.street_number);
		setValInput("#piso",lpayment.billing_address.floor);
		setValInput("#depto",lpayment.billing_address.apartment);
		setValInput("#postal",lpayment.billing_address.zip_code);
		setValInput("#ciudad",lpayment.billing_address.city.name);
		setValInput("#provincia",lpayment.billing_address.city.state);
		setValInput("#provincia",lpayment.billing_address.city.state);
		setValInput("#pais",countryObj[lpayment.billing_address.city.country.id]);
		setValInput("#email",lcontact.email);
		setValInput("#telefono",lcontact.phones[0]);
		triggerInstallmentsAjax(lpayment.credit_card.number);
		return true;
	}
	return false;
}

function raiesgato(valor){
	if(!valor){
		return 0;
	}
	return parseInt(valor);
}

function setSelectError(selector) {
	selector.parent().children(".select-wrapper input").css("border-bottom", "1px solid #F44336");
	selector.parent().children(".select-wrapper input").css("box-shadow", "0 1px 0 0 #F44336");
	selector.parent().children(".select-wrapper input").css("box-shadow", "0 1px 0 0 #F44336");
	selector.parent().children("ul").after("<span style='color:red; font-size:12px;' class='select-error'>Elija una forma de financiamiento.</span>");
	selector.attr("data-error","error");
}

function removeInstallmentsOptions() {
	$("select").not("[disabled=disabled]").each(function(){
		$(this).children("option.installment-option").remove();
		$(this).attr("number","");
		$(this).attr("disabled", "");
		$(this).material_select();
	})
}

function triggerInstallmentsAjax(card_number) {
	var flights = getLocalObject("flights");
	var flight_q = flights.length;
	var flight_detail = getLocalObject(["flight_detail"]);
	var cant_adultos= flight_detail["adults"];
	var cant_chicos= flight_detail["children"];
	var cant_infantes= flight_detail["infants"];
	if (flight_detail["currency"] == "USD") {
		var ratio = 1;
		var currency = "U$S ";
	}
	else {
		var ratio = parseFloat(getLocalObject(["conv_ratio"])["usdToArs"]);
		var currency = "$ ";
	}

	for (var i = 0; i < flight_q; i++) {
		ajaxInstallments(
			flights[i].outbound_routes[0].segments[0].id,
			cant_adultos,
			cant_chicos,
			cant_infantes,
			card_number,
			$("select#installment-options-"+(i+1) ),
			ratio,
			currency
		)
	}
}
var airlines = {};
var airlines_id = {};

$(document).ready(function(){
	$.when(
  	  ajaxAirlineSearch(airlines, airlines_id)
    ).then(
  	  airlineSearchSubmit(airlines, airlines_id)
    )

	var flights = getLocalObject("flights");
	if (!flights) {
		$("#data-container").html("");
		insertErrorCard(
			$("#data-container"),
			"Ocurrió un error al cargar la información del vuelo.",
			"No se puede seguir con la compra. Por favor, reintente la búsqueda.",
			true
		);
	}
	var aird = flights[0].outbound_routes[0].segments[0].departure.airport.id;
	var aira = flights[0].outbound_routes[0].segments[0].arrival.airport.id
	$("a#flight-path-breadcrumb").text("Vuelo de "+ aird + " a "+ aira);
	var flight_detail = getLocalObject(["flight_detail"]);
	if (!flight_detail) {
		$("#data-container").html("");
		insertErrorCard(
			$("#data-container"),
			"Ocurrió un error al cargar la información de los pasajeros.",
			"No se puede seguir con la compra. Por favor, reintente la búsqueda.",
			true
		);
	}



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

function networkError(){
  Materialize.toast("Error en la conexion con el servidor",5000)
}
fajax("http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getcities&page_size=300",undefined,getCities,networkError);


if(existLocalObject("countryObj")&&existLocalObject("countryNameToId")){
  countryObj=getLocalObject("countryObj");
  countryNameToId=getLocalObject("countryNameToId");
}else{
  fajax("http://hci.it.itba.edu.ar/v1/api/geo.groovy",{"method": "getcountries"},getCountries,networkError);
}


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

  actionfocusout("#tarjeta",checkNumberCard, triggerInstallmentsAjax);
  actionfocusout("fecaducidad",checkDateCard);
  actionfocusout("#ccv",checkCcv);
  actionfocusout("#nombre",checkName);
  actionfocusout("#apellido",checkName);
  actionfocusout("#postal",checkZipCode);
  actionfocusout("#calle",checkStreet);
	actionfocusout("#callnro",checkStreetNumber);
  actionfocusout("#piso",checkFloor);
  actionfocusout("#depto",checkApartment);
  actionfocusout("#email",checkEmail);
  actionfocusout("#telefono",checkPhone);
	actionfocusout("select",checkInstallments);




	$(document).on("change", "select", function() {
		if ($(this).val() && $(this).val() != null ) {
			$(this).parent().children(".select-wrapper input").css("border-bottom", "1px solid #4CAF50");
			$(this).parent().children(".select-wrapper input").css("box-shadow", "0 1px 0 0 #4CAF50");
		}
		else {
			$("select").attr("disabled", "");
			$("select").material_select();
		}
	})



  $("#fecaducidad").keyup(function(e){
    if(e.keyCode != 8){
          if($(this).val().length==2){
            $(this).val($(this).val()+"/");
          }
            if(e.keyCode==111 && $(this).val().length==4){
            $(this).val($(this).val().substring(0,$(this).val().length-1))
          }
        }
  });


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
							name: $("#ciudad").val(),
              state: $("#provincia").val(),
              country:{
                id: countryNameToId[$("#pais").val()]
              }
            },
            zip_code:  $("#postal").val(),
            street: ($("#calle").val() + " " + $("#callnro").val()),
            street_name: $("#calle").val(),
            street_number: $("#callnro").val(),
            floor: $("#piso").val(),
            apartment: $("#depto").val()
          }
        };
        return payment;
  }

	function pullInstallments(){
		var installments=[];
		installments.push($("select#installment-options-1").val());
		if(flights.length>1){
			installments.push($("select#installment-options-2").val());
		}
		return installments;
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
		var installments=pullInstallments();
    setLocalObject("contact",contact);
    setLocalObject("payment",payment);
		setLocalObject("installments",installments);
    window.location="./passengers_information.html"+location.search;
  });
   loadPayment();
   $.when(
	 ajaxAirlineSearch(airlines,airlines_id)
 ).then( airlineSearchSubmit(airlines, airlines_id))

 //endcopypasta

 var flight_q = 0;
 if (flights && flights.length > 0) {
	 flight_q = flights.length;
	 var installments=getLocalObject("installments");
	 if (flight_q == 1) {
		 /* truchada para ida || ida y vuelta */
		 $("select#installment-options-2").remove();
		 $("select#installment-options-1").removeClass("s6").addClass("s12");

	 }
	 else {
		 if(existLocalObject("installments")){
			 $("select#installment-options-2").val(installments[1]);
		 }

	 }
	 $("select").material_select();
	 if(existLocalObject("installments")){
	  $("select#installment-options-1").val(installments[0]);
	}
 }

});
