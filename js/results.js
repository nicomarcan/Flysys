$(document).ready(function(){
  $(".dropdown-button").dropdown();
  $(".datepicker").pickadate();
  $("#two-way").click(function(){
    $("#return-div").show();
  });
  $("#one-way").click(function(){
    $("#return-div").hide();
  });
  noUiSlider.create(document.getElementById('price-range'), {
    start: [ 1000, 9000 ],
    connect: [false, true,false],
    range: {
      'min': [  0 ],
      'max': [ 10000 ]
    }
  });
});
