$(document).ready(function(){
		
		$('li.clickable').on('click', function() {
			 if(!$(this).attr("selected")){
			 	$('li.clickable').removeAttr("selected");
			 	$(this).attr("selected","");
			 	if($(this).attr("id")=="one-way"){
					$('#returning').hide();
				 }
				 else if($(this).attr("id")=="two-way"){
				 	$('#returning').show();
				 }
			  }
		});

		$('.datepicker').pickadate({
	  		 inline: true,
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
