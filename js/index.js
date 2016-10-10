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

		$('.star_group .material-icons.clickable').on('click', function() {
			var stars_before= $(this).prevAll();
			var stars_next= $(this).nextAll();
				$(this).attr("class"," material-icons");
			stars_before.attr("class"," material-icons clickable");
			stars_next.attr("class"," material-icons grey-text text-lighten-1 clickable");
		

			
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

		  /*solucion fea*/
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
			if(number > 0){
				$(this).next().next().text(number-1);
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
		/* FIN DEL EXPERIMENTO DE OTAAAAAAAAAAAAAAAAAAAA*/
   

});
