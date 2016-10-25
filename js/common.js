function fajax(aurl,datos,fsuccess,ferror){
    var urlfinal=aurl;
    // console.log('Iniciando ajax a:'+urlfinal);
    return $.ajax({
        type:'GET',
        data: datos,
        dataType: 'json',
        url: urlfinal,
        timeout: 2000,
        success: function(data){
            if(data.error==undefined){
                fsuccess(data);
            }else{
                console.log("ERROR REQUEST: "+data.error.message+"     in request "+urlfinal);
            }
        },
        error: function(jqxhr,status,errorthrown) {
            ferror();
        }
    });
}


function fapax(aurl,datos,fsuccess,ferror){
    var urlfinal=aurl;
    // console.log('Iniciando ajax a:'+urlfinal);
    $.ajax({
        type:'POST',
        data: datos,
        dataType: 'json',
        timeout: 2000,
        url: urlfinal,
        contentType: 'application/json',
        success: function(data){
            if(data.error==undefined){
                fsuccess(data);
            }else{
                console.log("ERROR REQUEST: "+data.error.message+"     in request "+urlfinal);
            }
        },
        error: function(jqxhr,status,errorthrown) {
            ferror();
        }
    });
}


function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

function setLocalObject(nombre,objeto){
  localStorage.setItem(nombre, JSON.stringify(objeto));
}

function setValInput(tag,valor){
  $(tag).val(valor);
}


function getLocalObject(nombre){
  var cache=localStorage.getItem(nombre);
  if (cache==null){
    console.log("No existe "+nombre+" en localStorage");
  }else{
    return JSON.parse(cache);
  }
}

function existLocalObject(nombre){
  var cache=localStorage.getItem(nombre);
  if (cache==null){
    return false;
  }else{
    return true;
  }
}

//Agrego a los chekres
function checkNumberCard(dato, trigger){
  var patron= /^(((34)|(37))\d{13})|^(36\d{12})|((5[1-3])\d{14})|^((4\d{12})|(4\d{15}))/i;
  if(patron.test(dato) && dato.substring(0,1)=="4"){
    if(dato.length==16 || dato.length==13 ){
      return true;
    }
	removeInstallmentsOptions();
    return false;
  }
  if (patron.test(dato)) {
	  return true;
  }
  removeInstallmentsOptions();
  return false;
}
function checkDateCard(dato){
  var patron=/^((3\d)|([0-2][0-9]))\/\d{2}/i;
  var mes=new Date().getMonth();
  var anio=new Date().getYear()-100;
  if(patron.test(dato)){
    var cd=dato.split("/");
    if(anio<parseInt(cd[1]) || (anio==parseInt(cd[1]) && mes<parseInt(cd[0]))){
      return true;
    }
  }
  return false;
}

function checkCcv(dato){
  var patron=/^\d{3}/i;
  return patron.test(dato);
}
function checkName(dato){
  var patron=/^([aábcdeéfghijklmnñoópqrstuúüvwxyzAÁBCDEÉFGHIJKLMNÑOÓPQRSTUÚÜ‌​VWXYZ]|\s){1,80}/i;
  return patron.test(dato);
}
function checkStreet(dato){
  var patron=/^([aábcdeéfghijklmnñoópqrstuúüvwxyzAÁBCDEÉFGHIJKLMNÑOÓPQRSTUÚÜ‌​VWXYZ]){1,70}/i;
  return patron.test(dato);
}
function checkStreetNumber(dato){
  var patron=/^\d{1,10}/i;
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
  var patron=/^.{1,80}/i;
  if(patron.test(dato)){
    if(citiesObj[dato]!=undefined){
      return true;
    }
  }
  return false;
}

function checkPhone(dato){
  var patron=/^(\d|\#){1,25}/i; //TODO
  var anio=new Date().getYear()-100+2000;
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

function isValidDate(s) {
  var bits = s.split('/');
  var d = new Date(bits[2], bits[1] - 1, bits[0]);
  return d && (d.getMonth() + 1) == bits[1];
}
function checkBirthDate(dato){
  var patron=/\d{2}\/\d{2}\/\d{4}/i;
  if(patron.test(dato) && isValidDate(dato)){
    var datopartido=dato.split("/");
    var datodia=parseInt(datopartido[0]);
    var datomes=parseInt(datopartido[1]);
    var datoanio=parseInt(datopartido[2]);
    var anio=new Date().getYear()-100+2000;
    if(datodia<=31 && datomes<=12 && datoanio<=anio && datoanio>1810){
      return true;
    }
  }
  return false;
}

function checkBirthDateInfant(dato){
    if (checkBirthDate(dato)){
    	var today = new Date();

        var datopartido=dato.split("/");
        var birth = new Date(datopartido[2], datopartido[1] - 1, datopartido[0]);
        var intervalmili = today - birth;
        var diffDays = Math.ceil(intervalmili / (1000 * 3600 * 24));
        if (diffDays >= 0 && diffDays <= 730  ){
      	  return true;
        }
        return false;
    }
    return false;
}

function checkBirthDateChildren(dato){
    if (checkBirthDate(dato)){
    	var today = new Date();

    	var datopartido=dato.split("/");
    	var birth = new Date(datopartido[2], datopartido[1] - 1, datopartido[0]);
    	var intervalmili = today - birth;
    	var diffDays = Math.ceil(intervalmili / (1000 * 3600 * 24));
    	if (diffDays > 730 && diffDays <= 4015  ){
    		return true;
    	}
    	return false;
    }
    return false;
}
function checkBirthDateAdult(dato){
    if (checkBirthDate(dato)){
    	var today = new Date();
    	var datopartido=dato.split("/");
    	var birth = new Date(datopartido[2], datopartido[1] - 1, datopartido[0]);
    	var intervalmili = today - birth;
    	var diffDays = Math.ceil(intervalmili / (1000 * 3600 * 24));
    	if (diffDays > 4015){
    		return true;
    	}
    	return false;
    }
    return false;
}

function checkPayment(){
  var flag=true;
  if(!checkNumberCard($("#tarjeta").val(), function(){})){
    $("#tarjeta").addClass("invalid");
    flag=false;
    }else{
        $("#tarjeta").addClass("valid");
    }
  if(!checkDateCard($("#fecaducidad").val())){
    $("#fecaducidad").addClass("invalid");
    flag=false;
    }else{
        $("#fecaducidad").addClass("valid");
    }
  if(!checkCcv($("#ccv").val())){
    $("#ccv").addClass("invalid");
    flag=false;
}else{
    $("#ccv").addClass("valid");
}
  if(!checkName($("#nombre").val())){
    $("#nombre").addClass("invalid");
    flag=false;
}else{
    $("#nombre").addClass("valid");
}
  if(!checkName($("#apellido").val())){
    $("#apellido").addClass("invalid");
    flag=false;
}else{
    $("#apellido").addClass("valid");
}
  if(!checkStreet($("#calle").val())){
    $("#calle").addClass("invalid");
    flag=false;
}else{
    $("#calle").addClass("valid");
}
  if(!checkStreetNumber($("#callnro").val())){
    $("#callnro").addClass("invalid");
    flag=false;
}else{
    $("#callnro").addClass("valid");
}
  if(!checkFloor($("#piso").val())){
    $("#piso").addClass("invalid");
    flag=false;
}else{
    $("#piso").addClass("valid");
}
  if(!checkApartment($("#depto").val())){
    $("#depto").addClass("invalid");
    flag=false;
  if(!checkZipCode($("#postal").val())){
    $("#postal").addClass("invalid");
    flag=false;
}else{
        $("#postal").addClass("valid");
}
  if(!checkCity($("#ciudad").val())){
    $("#ciudad").addClass("invalid");
    flag=false;
  }
}else{
        $("#ciudad").addClass("valid");
}
  if(!checkEmail($("#email").val())){
    $("#email").addClass("invalid");
    flag=false;

}else{
        $("#email").addClass("valid");
}
  if(!checkPhone($("#telefono").val())){
    $("#telefono").addClass("invalid");
    flag=false;
 
}else{
        $("#telefono").addClass("valid");
}
  $("select").each( function() {
	  if (!$(this).val() || $(this).val() == "") {
		  setSelectError($(this));
		  flag = false;
	  }
  })
  return flag
  ;
}

function checkPassenger(tipo,num){
  var flag=true;
  var tag=tipo+num;
  if(!checkName($("#nombre"+tag).val())){
    $("#nombre"+tag).removeClass("valid");
    $("#nombre"+tag).addClass("invalid");
    flag=false;
  }else{
    $("#nombre"+tag).removeClass("invalid");
    $("#nombre"+tag).addClass("valid");
  }
  if(!checkName($("#apellido"+tag).val())){
    $("#apellido"+tag).addClass("invalid");
    $("#apellido"+tag).removeClass("valid");
    flag=false;
  }else{
    $("#apellido"+tag).addClass("valid");
  }
  if(!checkPassport($("#pasaporte"+tag).val())){
    $("#pasaporte"+tag).addClass("invalid");
    flag=false;
  }else{
    $("#pasaporte"+tag).addClass("valid");
  }
  if(!checkIdType($("select#tipo_id"+tag).val())){
    $("select#tipo_id"+tag).addClass("invalid");
    flag=false;
  }else{
    $("select#tipo_id"+tag).addClass("valid");
  }
  $("#nacimiento"+tag).addClass("valid");
  if(!checkBirthDate($("#nacimiento"+tag).val())){
    $("#nacimiento"+tag).addClass("invalid");
    flag=false;
  }else{
    if(tipo=="infante"){
      if(!checkBirthDateInfant($("#nacimiento"+tag).val())){
        $("#nacimiento"+tag).addClass("invalid");
        flag=false;
      }
    }else if(tipo=="chico"){
      if(!checkBirthDateChildren($("#nacimiento"+tag).val())){
        $("#nacimiento"+tag).addClass("invalid");
        flag=false;
      }
    }else if(tipo=="adulto"){
      if(!checkBirthDateAdult($("#nacimiento"+tag).val())){
        $("#nacimiento"+tag).addClass("invalid");
        flag=false;
      }
    }
  }

    // var err_conv = {
    //   "infante" : "Ingrese una fecha válida. Recuerde que los infantes deben ser menores de dos años.",
    //   "chico": "Ingrese una fecha válida. Recuerde que los niños deben ser mayores de dos años y menores de once.",
    //   "adulto" : "Ingrese una fecha válida. Recuerde que los adultos deben ser mayores de once años"
    // };
  return flag;
}
function checkInstallments(dato){
  var patron=/^\d{1,2}/i;
  return patron.test(dato);
}
//fin de los chekers
function actionfocusout(tag,funcion, trigger){
  $(tag).focusout(function(){
    if(funcion($(this).val())){
      $(this).removeClass("invalid");
      $(this).addClass("valid");
	  if (trigger) {
		  trigger($(this).val());
	  }
    }else{
        if($(this).val()==""){
        //  Materialize.toast("El campo es obligatorio",1000);
  //        $(this).focus();
        }
        $(this).removeClass("valid");
        $(this).removeClass("validate");
        $(this).addClass("invalid");
    }
  });
}

function humanDate(fecha){
  var partidof=fecha.split("-");
  return partidof[2]+"/"+partidof[1]+"/"+partidof[0]
}

function humanExpirationDate(fecha){
  var alfa=fecha.substring(0,2);
  var beta=fecha.substring(2,4);
  return alfa+"/"+beta;
}

function loadAirlinesTypeahead(data,air_names,air_names_id){
  setLocalObject("cacheNav",data);
  var total = data.total;
  var airl = data.airlines;
  var obj = [];
  for(var x = 0 ; x<total ; x++ ){
    obj[obj.length]=airl[x].name ;
    air_names[air_names.length]=airl[x].name;
    air_names_id[airl[x].name]=airl[x].id;
  }
  var blood_ciudades = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: obj
  });

  $('#airline_search').typeahead(
          {
              minLength: 1,
              highlight: true
          },
          {
              name: 'Aerolineas',
              limit: 1,
              source: blood_ciudades,
          }
  );
};

function installAirlineSearchHandler(){
  $("#airline_search_btn").click(function(event){
    var selected = airlineNameToId[$("#airline_search").typeahead('val')];
    var path = "review.html?airline_id=" + selected;
    window.location = path;
  });
}
