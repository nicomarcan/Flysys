function fajax(aurl,fsuccess,ferror){
    var urlfinal="http://hci.it.itba.edu.ar/v1/api/misc.groovy?"+aurl;
    console.log('Iniciando ajax a:'+urlfinal);
    $.ajax({
        type:'GET',
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