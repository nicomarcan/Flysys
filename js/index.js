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

		$('.datepicker').pickadate({
		});
		$('.parallax').parallax({});
		 $('select').material_select();
		/* $('input.autocomplete').autocomplete({
			 data: {
				  "Miami, FL - Miami": null,
				   "Buenos Aires,Argentina": null,
			 }
		  });*/
		  $(".dropdown-button").dropdown({
			    constrain_width: false,
			    belowOrigin: true,
		  });

		 $(window).scroll(function() {
    		var s = $(window).scrollTop(),

    		opacityVal = (s / 800.0);
    		$('.blurred-img').css('opacity', opacityVal);
		});
		/*EXPERIMENTO DE OTAAAAAAAAAAAAAAAAAAAA*/
		var valores={}
		$.ajax({
			url: 'http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getcities',
			dataType: 'jsonp',
			success: function(alfa){
				if(alfa.error==undefined){
					ciudades=alfa.cities
					for (i = 0; i < ciudades.length; i++) { 
						var cache=ciudades[i].name.split(",")[0];
						valores[cache]=null;
					}
					var datos={};
					datos["data"]=valores;
					$('input.autocomplete').autocomplete(datos);
				}
			}
		});

		console.log(datos);
		
		/* FIN DEL EXPERIMENTO DE OTAAAAAAAAAAAAAAAAAAAA*/
   

});
