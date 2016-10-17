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

function getLocalObject(nombre){
  var cache= localStorage.getItem(nombre);
  if (cache==null){
    console.log("No existe "+nombre+" en localStorage");
  }else{
    return JSON.parse(cache);
  }
}
