
var citiesObj = {};
var countryObj={};
var countryNameToId={};
var citiesIdtoName={};

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
		return true;
	}
	return false;
}




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

  actionfocusout("#tarjeta",checkNumberCard);
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


	var cant_adultos=raiesgato(getUrlParameter("adults"));
  var cant_chicos=raiesgato(getUrlParameter("children"));
  var cant_infantes=raiesgato(getUrlParameter("infants"));

	function raiesgato(valor){
		if(!valor){
			return 0;
		}
		return parseInt(valor);
	}


		$('select').material_select();
		$(document).on("change", "input#tarjeta", function() {
			var numero_tarjeta = $(this).val();
			ajaxInstallments(
				getLocalObject("flights")[0].outbound_routes[0].segments[0].id,
				cant_adultos,
				cant_chicos,
				cant_infantes,
				numero_tarjeta
			)
		});

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
          installments:$("select#installment-options").val(), //cantidad de cuotas
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
    window.location="./passengers_information.html"+location.search;
  });
   loadPayment();
});
