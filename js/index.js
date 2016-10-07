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

		$('img.offer-img').on('click', function() {
			var from = $("#from input");
			var to = $("#to input");
			var departing = $("#departing .datepicker");
			from.attr("value","Buenos Aires");
			from.focus();
			to.attr("value","Miami"); /*$(this).attr("value") next update incoming*/
			to.focus();
			to.blur();

		});

		$('#crossicon').on('click', function() {
			var from = $("#from input");
			var to = $("#to input");
			var from_val = from.attr("value");
			var to_val = to.attr("value");
			to.attr("value",from_val);
			from.attr("value",to_val);
			from.focus(); 
			to.focus();
			to.blur();

		});

		$('.datepicker').pickadate({
		});
		 $('.parallax').parallax({});
		 $('select').material_select();
		 $('input.autocomplete').autocomplete({
			 data: {
				  "Miami, FL - Miami": null,
				   "Buenos Aires,Argentina": null,
			 }
		  });
		  $(".dropdown-button").dropdown({
			    constrain_width: false,
			    belowOrigin: true,
		  });
});
