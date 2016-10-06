$(document).ready(function(){
		
		$('li.clickable').on('click', function() {
			 if(!$(this).attr("selected")){
			 	$('li.clickable').removeAttr("selected");
			 	$(this).attr("selected","");
			 	var from = $('#from');
				var to = $('#to')
			 	if($(this).attr("id")=="one-way"){
					$('#returning').hide();
					from.attr("class","input-field col s3");
					to.attr("class","input-field col s3 ");
				 }
				 else if($(this).attr("id")=="two-way"){
				 	$('#returning').show();
				 	from.attr("class","input-field col s2 ");
					to.attr("class","input-field col s2 ");
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
