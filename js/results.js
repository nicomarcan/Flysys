$(document).ready(function(){
  $(".dropdown-button").dropdown();
  $('select').material_select();
  noUiSlider.create(document.getElementById('price-range'), {
    start: [ 1000, 9000 ],
    connect: [false, true,false],
    range: {
      'min': [  0 ],
      'max': [ 10000 ]
    }
  });
  $(".datepicker").pickadate({
    monthsFull: [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
    monthsShort: [ 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic' ],
    weekdaysFull: [ 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado' ],
    weekdaysShort: [ 'dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb' ],
    today: 'Hoy',
    clear: 'Borrar',
    close: 'Cerrar',
    firstDay: 1,
    format: 'd !de mmmm !de yyyy',
    formatSubmit: 'yyyy/mm/dd'
  });
  $(".collapsible").collapsible({
    accordion : false
  });

  $(".btn").click(function(event){
    event.stopPropagation();
  });

  $(".collapsible").click(function(event){
    collapseAll($(this));
    event.stopPropagation();
  });

  $(window).click(function(){
    collapseAll();
  });
});

function collapseAll(o = null){
  $(".collapsible-header").not(o).removeClass(function(){
    return "active";
  });
  $(".collapsible").not(o).collapsible({accordion: true});
  $(".collapsible").not(o).collapsible({accordion: false});
}
