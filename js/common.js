function fajax(aurl,datos,fsuccess,ferror){
    var urlfinal=aurl;
    // console.log('Iniciando ajax a:'+urlfinal);
    $.ajax({
        type:'GET',
        data: datos,
        dataType: 'json',
        url: urlfinal,
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
  var patron=/^.{1,80}/i;
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
  if(patron.test(dato)){
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
  var dia=new Date().getDate();
  var mes=new Date().getMonth();
  var anio=new Date().getYear()-100+2000;
  var datopartido=dato.split("/");
  var datodia=parseInt(datopartido[0]);
  var datomes=parseInt(datopartido[1]);
  var datoanio=parseInt(datopartido[2]);
  if((anio-datoanio)<2){
    return true;
  }else if((anio-datoanio)==2){
    if((mes-datomes)>=0){
      return true;
    }
    return false;
  }
  return false;
}

function checkBirthDateChildren(dato){
  var dia=new Date().getDate();
  var mes=new Date().getMonth();
  var anio=new Date().getYear()-100+2000;
  var datopartido=dato.split("/");
  var datodia=parseInt(datopartido[0]);
  var datomes=parseInt(datopartido[1]);
  var datoanio=parseInt(datopartido[2]);
  if((anio-datoanio)<18){
    return true;
  }else if((anio-datoanio)==18){
    if((mes-datomes)>=0){
      return true;
    }
    return false;
  }
  return false;
}

function checkPayment(){
  var flag=true;
  if(!checkNumberCard($("#tarjeta").val())){
    $("#tarjeta").addClass("invalid");
    flag=false;
  }
  if(!checkDateCard($("#fecaducidad").val())){
    $("#fecaducidad").addClass("invalid");
    flag=false;
  }
  if(!checkCcv($("#ccv").val())){
    $("#ccv").addClass("invalid");
    flag=false;
  }
  if(!checkName($("#nombre").val())){
    $("#nombre").addClass("invalid");
    flag=false;
  }
  if(!checkName($("#apellido").val())){
    $("#apellido").addClass("invalid");
    flag=false;
  }
  if(!checkStreet($("#calle").val())){
    $("#calle").addClass("invalid");
    flag=false;
  }
  if(!checkStreetNumber($("#callnro").val())){
    $("#callnro").addClass("invalid");
    flag=false;
  }
  if(!checkFloor($("#piso").val())){
    $("#piso").addClass("invalid");
    flag=false;
  }
  if(!checkApartment($("#depto").val())){
    $("#depto").addClass("invalid");
    flag=false;
  }
  if(!checkZipCode($("#postal").val())){
    $("#postal").addClass("invalid");
    flag=false;
  }
  if(!checkCity($("#ciudad").val())){
    $("#ciudad").addClass("invalid");
    flag=false;
  }
  if(!checkEmail($("#email").val())){
    $("#email").addClass("invalid");
    flag=false;
  }
  if(!checkPhone($("#telefono").val())){
    $("#telefono").addClass("invalid");
    flag=false;
  }
  return flag
  ;
}

function checkPassenger(tipo,num){
  var flag=true;
  var tag=tipo+num;
  if(!checkName($("#nombre"+tag).val())){
    $("#nombre"+tag).addClass("invalid");
    flag=false;
  }
  if(!checkName($("#apellido"+tag).val())){
    $("#apellido"+tag).addClass("invalid");
    flag=false;
  }
  if(!checkPassport($("#pasaporte"+tag).val())){
    $("#pasaporte"+tag).addClass("invalid");
    flag=false;
  }
  if(!checkIdType($("select#tipo_id"+tag).val())){
    $("select#tipo_id"+tag).addClass("invalid");
    flag=false;
  }
  if(!checkBirthDate($("#nacimiento"+tag).val())){
    $("#nacimiento"+tag).addClass("invalid");
    flag=false;
  }
  return flag;
}
//fin de los chekers
function actionfocusout(tag,funcion){
  $(tag).focusout(function(){
    if(funcion($(this).val())){
      $(this).removeClass("invalid");
      $(this).addClass("valid");

    }else{
        if($(this).val()==""){
          Materialize.toast("El campo es obligatorio",1000);
  //        $(this).focus();
        }
        $(this).removeClass("valid");
        $(this).addClass("invalid");
    }
  });
}

function humanDate(fecha){
  var partidof=fecha.split("-");
  return partidof[2]+"/"+partidof[1]+"/"+partidof[0]
}
