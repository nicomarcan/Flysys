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
                console.log("ERROR REQUEST:"+data.error.message+" in request "+urlfinal);
            }
        },
        error: function(jqxhr,status,errorthrown) {
            ferror();
        }
    });
}
//DEPRECATED: getUrlParameter hace lo mismo
function getGETparam(paramName) {
    var query = location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === paramName) {
            return decodeURIComponent(pair[1]);
        }
    }
    return null;
}
//aaa



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
