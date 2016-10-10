function fajax(aurl,fsuccess){
    var urlfinal="http://hci.it.itba.edu.ar/v1/api/misc.groovy?"+aurl;
    console.log('Iniciando ajax a:'+urlfinal);
    $.ajax({
        type:'GET',
        dataType: 'json',
        url: urlfinal,
        success: function(data){
            if(!data.error==undefined){
                console.log("ERROR REQUEST"+data.error.message+" in request:"+'url');
            }else{
                fsuccess(data);
            }
        },
        error: function(jqxhr,status,errorthrown) {
            ferror();
        }

    });
}