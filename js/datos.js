var i=1;
var citiesObj = {};
var countryObj={};

$(document).ready(function(){


function getCountries(data){
  var paises = data.countries;
  var valores=[];
  var airportObj = {};
  for(var x = 0 ; x<paises.length ; x++ ){
     valores.push(paises[x].name);
     countryObj[paises[x].name.split(',')[0]]=paises[x].id;

  }
  console.log(valores);
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
     citiesObj[ciudades[x].name.split(',')[0]]=ciudades[x].id;
  }
//  localStorage.setItem('citiesObject', citiesObj);
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


fajax("http://hci.it.itba.edu.ar/v1/api/geo.groovy",{"method": "getcountries"},getCountries,undefined);
fajax("http://hci.it.itba.edu.ar/v1/api/geo.groovy",{"method": "getcities"},getCities,undefined);

  $('select').material_select();
  var cant_adultos=parseInt(getUrlParameter("adults"));
  var cant_chicos=parseInt(getUrlParameter("children"));
  var cant_infantes=parseInt(getUrlParameter("infants_val"));

  for (i = 1; i < (cant_adultos+cant_chicos+cant_infantes); i++) {
    $(".passangerform").after(form);
    console.log(i);
  }
  $('.eliminar').click(function(){
      $(this).closest(".passangerform").remove();
  })
  $('.datepicker').pickadate({
     monthsFull: [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
     monthsShort: [ 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic' ],
     weekdaysFull: [ 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado' ],
     weekdaysShort: [ 'dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb' ],
     today: 'Hoy',
     clear: 'Borrar',
     close: 'Cerrar',
     firstDay: 1,
     format: 'd !de mmmm !de yyyy',
     formatSubmit: 'yyyy-mm-dd' ,
     min: true
   });
  $("#pais").focusout(function(){
    if(countryObj[$(this).val()]==undefined){
        $(this).removeClass("valid");
        $(this).addClass("invalid");
    }else{
        $(this).removeClass("invalid");
        $(this).addClass("valid");
    }
  });
  $("#ciudad").focusout(function(){
    if(citiesObj[$(this).val()]==undefined){
        $(this).removeClass("valid");
        $(this).addClass("invalid");
    }else{
        $(this).removeClass("invalid");
        $(this).addClass("valid");
    }
  });
  $(".tipo_id").mouseleave(function(){
    if($(".selected").text()=="Pasaporte"){
        $("#pasaporte").removeAttr("pattern");
        $("#pasaporte").attr("pattern","\\w{1,50}");
        $("#text_id").text("Pasaporte");
        console.log($("#pasaporte"))
    }else{
        $("#pasaporte").removeAttr("pattern");
        $("#pasaporte").attr("pattern","\\d{1,50}");
        $("#text_id").text("Documento");
    }
  });
});
