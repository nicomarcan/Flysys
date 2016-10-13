
var valores=new Array();/*feo*/
$(document).ready(function(){

		$('li.clickable').on('click', function() {
			 if(!$(this).attr("selected")){
			 	$('li.clickable').removeAttr("selected");
			 	$(this).attr("selected","");
			 	var from = $('#from');
				var to = $('#to')
			 	if($(this).attr("id")=="one-way"){
					$('#returning').hide();
					from.css({"width":"27%"});
					to.css({"width":"27%"});
				 }
				 else if($(this).attr("id")=="two-way"){
				 	$('#returning').show();
				 	from.css({"width":"18%"});
					to.css({"width":"18%"});
				 }
			  }
		});

		var nameToId={};

		  var airports_url = 'http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getairports';
		  $.ajax({
		    type: 'GET',
		    url: airports_url,
		    dataType: 'json' ,
		    success: function(d){
		      if(d.total<=d.page_size){
		        fillAirportsAutocomplte(d);
		      } else {
		        $.ajax({
		          type: 'GET',
		          url: airports_url,
		          dataType: 'json',
		          data: {page_size:d.total},
		          success: function(f){
		            fillAirportsAutocomplte(f);
		          }
		        });
		      }
		    }
		  });


	     $.ajax({
	     	type: 'GET',
			url: 'http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getcities',
			dataType: 'jsonp',
			success: function (alfa) {
					if (alfa.error == undefined) {
						if(alfa.total<=alfa.page_size){
					        fillCitiesAutocomplte(alfa);
					      } else {
					        $.ajax({
					          type: 'GET',
					          url: 'http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getcities',
					          dataType: 'json',
					          data: {page_size:alfa.total},
					          success: function(f){
					            fillCitiesAutocomplte(f);

					          }
					        });
					      }

					}
			}
		});



		 $('.modal-trigger').leanModal();


		$('img.offer-img').on('click', function() {
			var from = $("#from input");
			var to = $("#to input");
			var picker = $('#departing .datepicker').pickadate('picker');
			from.val("Buenos Aires");
			from.focus();
			to.val("Miami"); /*$(this).attr("value") next update incoming*/
			to.focus();
			to.blur();
			event.stopPropagation();
			picker.open();

		});

		$('#crossicon').on('click', function() {
			var from = $("#from input");
			var to = $("#to input");
			var from_val = from.val();
			var to_val = to.val();
			to.val(from_val)
			from.val(to_val);
			from.focus();
			to.focus();
			to.blur();

		});

		$('.star_group .material-icons.clickable').on('click', function() {
			var stars_before= $(this).prevAll();
			var stars_next= $(this).nextAll();
				$(this).attr("class"," material-icons");
			stars_before.attr("class"," material-icons clickable");
			stars_next.attr("class"," material-icons grey-text text-lighten-1 clickable");



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
		    formatSubmit: 'yyyy-mm-dd' ,
		    min: true
		  });
		$('.parallax').parallax({});
		 $('select').material_select();

		$(".dropdown-button#passengers").on('click',function(){
			if(!$(this).attr("closed")){
				$(this).attr("closed","true");
				$(this).click();
			}else{
				$(this).removeAttr("closed");
				$("#open-button").click();
			}

		});

		$("#open-button").on('click',function(){
			$('.dropdown-button#passengers').dropdown('open');
		});

		$("#done-button").on('click',function(){
			$('.dropdown-button#passengers').dropdown('close');
		});

		$(".minus").on('click',function(){
			var number = Number($(this).next().next().text());
			if($(this).parent().attr("id")=="adults"){
				if(number > 1){
					$(this).next().next().text(number-1);
				}
			}else{
				if(number > 0){
					$(this).next().next().text(number-1);
				}
			}
		});

		$(".plus").on('click',function(){
			var number = Number($(this).prev().prev().text());
			if(number < 20){
				$(this).prev().prev().text(number+1);
			}
		});

		 $(window).scroll(function() {
    		var s = $(window).scrollTop(),

    		opacityVal = (s / 800.0);
    		$('.blurred-img').css('opacity', opacityVal);
		});

		function fillAirportsAutocomplte(data){
		  console.log(data.total);
		  var total = data.total;
		  var airports = data.airports;
		  var airportObj = {};
		  for(var x = 0 ; x<total ; x++ ){
		    airportObj[airports[x].description] = null;
		    valores.push(airports[x].description);
		    nameToId[airports[x].description] = airports[x].id;
		  }
		  $('#from_input,#to_input').autocomplete({
		    data: airportObj,
		  });
		}

			function fillCitiesAutocomplte(data){
			  console.log(data.total);
			  var total = data.total;
			  var cities = data.cities;
			  var cityObj = {};
			  for(var x = 0 ; x<total ; x++ ){
			    cityObj[cities[x].name] = null;
			    valores.push(cities[x].name);
			    nameToId[cities[x].name] = cities[x].id;
			  }
			  $('#from_input,#to_input').autocomplete({
			    data: cityObj,
			  });
			}



		$('#search-icon').on('click',function(){
			var mode= $('#search [selected]').attr("id");
			var src = nameToId[$('#from input').val()];
			var dst = nameToId[$('#to input').val()];
			var d1 = $('#departing input[name=_submit]').val();
			var d2 = $('#returning input[name=_submit]').val();
			var adults= $('#passengers #adults #adults_val').text();
			var children= $('#passengers #children #children_val').text();
			var infants= $('#passengers #infants #infants_val').text();
			var url= "results.html?"+"mode="+mode+"&src="+src+"&dst="+dst+"&adults="+adults+"&children="+children+"&infants="+infants+"&d1="+d1+"&d2="+d2+"&page=1&sort_by=total";
			console.log(url);
			window.location=url;
		});









  	 $('#textarea1').trigger('autoresize');

  $.validator.setDefaults({
    errorClass: 'invalid',
    validClass: "valid",
    errorPlacement: function (error, element) {
        $(element)
            .closest("form")
            .find("label[for='" + element.attr("id") + "']")
            .attr('data-error', error.text());
    },
    submitHandler: function (form) {
        console.log('form ok');
    }
});


   $("#search-form").validate({

    rules: {
        from_input:{
        	required: true,
        	city:true
        },
         to_input:{
        	required: true,
        	city:true
        }
    }
});

});
