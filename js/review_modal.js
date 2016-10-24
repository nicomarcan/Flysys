

$(document).ready(function(){







      var check=false;


      		$('.star_group .material-icons.clickable').on('click', function() {
      			var stars_before= $(this).prevAll();
      			var stars_next= $(this).nextAll();
      			$(this).removeClass("grey-text text-lighten-1 ");
      			stars_before.removeClass("grey-text text-lighten-1");
      			stars_next.addClass("grey-text text-lighten-1");
      			$(this).attr("clicked","clicked");
      			stars_before.attr("clicked","clicked");
      			stars_next.removeAttr("clicked");



      		});

      		$('.star_group .material-icons.clickable').on('mouseover', function() {
      			if(!check){
      				var stars_before= $(this).prevAll();
      				var stars_next= $(this).nextAll();
      				$(this).removeClass("grey-text text-lighten-1");
      				stars_before.removeClass("grey-text text-lighten-1");
      				stars_next.addClass(" grey-text text-lighten-1 ");
      			}

      		});

      		$('.star_group .material-icons.clickable').on('mouseleave', function() {

      			if($(this).attr("clicked")=="clicked"){
      				$(this).nextAll(":not([clicked])").addClass(" grey-text text-lighten-1 ");
      				$(this).nextAll("[clicked]").removeClass("grey-text text-lighten-1");
      			}else{
      				$(this).addClass(" grey-text text-lighten-1 ");
      				$(this).prevAll(":not([clicked])").addClass(" grey-text text-lighten-1 ");
      			}
      		});



  		$('#recommend .material-icons.clickable').on('click', function() {
  			if($(this).attr("id") == "yes"){
  				$(this).attr("class","material-icons green-text  clickable ");
  				$(this).attr("selected","");
  				$("#recommend .material-icons.clickable#no").attr("class","material-icons grey-text text-lighten-1 clickable");
  				$("#recommend .material-icons.clickable#no").removeAttr("selected");
  			}else{
  				$(this).attr("class","material-icons red-text  clickable");
  				$(this).attr("selected","");
  				$("#recommend .material-icons.clickable#yes").attr("class","material-icons grey-text text-lighten-1 clickable");
  				$("#recommend .material-icons.clickable#yes").removeAttr("selected");
  			}



  		});

  			$('#yes').on('mouseover', function() {

  			$(this).attr("class","material-icons green-text  clickable ");
  			$("#recommend .material-icons.clickable#no").attr("class","material-icons grey-text text-lighten-1 clickable");

  		});

  		$('#no').on('mouseover', function() {
  			if(!check){
  				$(this).attr("class","material-icons red-text  clickable");
  				$("#recommend .material-icons.clickable#yes").attr("class","material-icons grey-text text-lighten-1 clickable");
  			}

  		});


  		$('#recommend .material-icons.clickable').on('mouseleave', function() {
  			$("#recommend .material-icons.clickable").attr("class","material-icons grey-text text-lighten-1 clickable");
  			var selected = $('#recommend .material-icons.clickable[selected]');

  			if(selected.attr("id")=="yes"){
  				selected.attr("class","material-icons green-text  clickable ");
  			}else if(selected.attr("id") =="no"){
  				selected.attr("class","material-icons red-text  clickable ");
  			}

  		});
  		//comments validator
  		$('#comments').focusout(function(){
  			if($(this).val().length > 256){
  				showError($(this));
  				$(this).addClass("invalid");
  				$(this).removeClass("valid");
  			}else{
  				$(this).addClass("valid");
  				$(this).removeClass("invalid");
  			}
  		});


      $(".airline_input").focusout(function(){
      if(airlines[$(this).val().toLowerCase()]){
          $(this).addClass("valid");
        $(this).removeClass("invalid");
      }
      else {

        $(this).removeClass("valid");
            $(this).addClass("invalid");
            showError($(this));
      }
      $(".flight_input").blur();

   });
  		var msg=false;

  		//flight number validator todo:error al mandar review con numero de vuelo invalido, muestra dos mensajes en aerolinea
  		$(".flight_input").focusout(function(){
  			$('.flight_input').removeClass("valid");
  			$('.flight_input').removeClass("invalid");
  			if($("#airlines_input").typeahead('val') == "" && $(this).val()!= "" && !$(".airline_input").hasClass("invalid") ){
  				showEmptyAirlineError();
  			}

  			 else if($(".airline_input").hasClass("invalid") && $("#airlines_input").typeahead('val') != "" && $(this).val()!=""){
  				showIncorrectAirlineError();
  			}

  			else if($(this).val() != ""){
  				if(isNaN($(this).val())){
  					showNotANumberError();
  				}
  				  $.ajax({
  					    type: 'GET',
  						url: 'http://hci.it.itba.edu.ar/v1/api/status.groovy',
  						data:{"method":"getflightstatus","airline_id":nameToId[$("#airlines_input").val()],"flight_number":$(this).val()},
  						dataType: 'jsonp',
  						success: function (alfa) {
  							if(alfa.error==undefined){
  								$('.flight_input').addClass("valid");
  								$('.flight_input').removeClass("invalid");
  							}else{
  								showError($('#vuelo'));
  								$('.flight_input').addClass("invalid");
  								$('.flight_input').removeClass("valid");
  							}
  					}
  				});
  				}

  				status=true;

  		});
  		//review validator when sending
      $('#send-review').on('click',function(){
         var review = {};
         var airline = {};
         var flight = {};
         var rating = {};

         airline["id"] = airlines[$("#review-modal #airlines_input").val().toLowerCase()];
         flight["airline"]=airline;
         flight["number"]=parseInt($("#review-modal #vuelo").val());
         review["flight"]=flight;
         var ok_categories = true;
         var ok_recommend = true;
         for(var x = 1 ; x<7 && ok_categories; x++){
             var type = $("#review-modal #opinion-row-"+x).children(":first-child").attr("id");
             var score = $("#review-modal #opinion-row-"+x).children(":nth-child(2)").children(":not(.grey-text)").length * 2;
             rating[type]= score;
             if(score <= 0)
                 ok_categories = false;
         }
         review["rating"]=rating;
         if($("#recommend .material-icons.clickable[selected]").attr("id") == undefined)
             ok_recommend=false;
         review["yes_recommend"]= ($("#recommend .material-icons.clickable[selected]").attr("id") == "yes");
         review["comments"]= encodeURIComponent($("#review-modal #comments").val());

           if(airline["id"] != undefined && $("#review-modal #vuelo").hasClass("valid") && ok_categories && ok_recommend && $("#review-modal #comments").val().length <=256  ) {
                var review_url = 'http://hci.it.itba.edu.ar/v1/api/review.groovy?method=reviewairline';
                  $.ajax({
                      type: "POST",
                     url: review_url,
                       contentType: 'application/json',
                      data: JSON.stringify(review),
                     success: function(d){
                       if(d.error == undefined){

                       }else{
                         console.log(d);
                         console.log(review);

                       }
                     }
                   });
                   $(this).hide();
         				  $("#review-form").hide(300);
         				  $("#close-modal").show();
         				  $("#post-review").show();
         				   $("#error-review").hide();
         }else{
           $('#review-modal').scrollTop(0);
           $('.airline_input').blur();
           $(".flight_input").blur();
           $("#comments").blur();

           checkEmpty($('#airlines_input'));
           checkEmpty($(".flight_input"));

           if(!ok_recommend){
             showErrorCat($("#no"));
           }
           if(!ok_categories){
             showErrorCat($("i.tooltipped"));
           }
         }
     });
  	$('#textarea1').trigger('autoresize');
    $('.tooltipped').tooltip({delay: 50});
     $('.tooltipped').tooltip('remove');

  
    function showErrorCat(elem){
      check=true;
      elem.tooltip('remove');
      elem.tooltip('add');
      elem.mouseenter();
      check=false;
      setTimeout(function(){ elem.tooltip('remove');}, 3000);
    }
});




function showError(elem){
	elem.tooltip('remove');
		elem.tooltip('add');
		elem.mouseenter();
		setTimeout(function(){ elem.tooltip('remove'); }, 3000);
}

function checkEmpty(elem){
	if(elem.val()==""){
		elem.tooltip('remove');
		elem.addClass("invalid");
		var text= String(elem.attr("data-tooltip"));
		elem.attr("data-tooltip","El campo es Obligatorio");
		elem.tooltip('add');
		elem.mouseenter();
		setTimeout(function(){ elem.tooltip('remove'); elem.attr("data-tooltip",text);}, 3000);
	}
}

function showEmptyAirlineError(){
	var airline = $(".airline_input");
	airline.tooltip('remove');
		var text= airline.attr("data-tooltip");
		airline.attr("data-tooltip","Debe ingresar una aerolinea primero");
		airline.tooltip('add');
		airline.mouseenter();
		setTimeout(function(){ airline.tooltip('remove'); airline.attr("data-tooltip",text);}, 3000);
}

function showIncorrectAirlineError(){
		var airline = $(".airline_input");
		airline.tooltip('remove');
		var text= airline.attr("data-tooltip");
		airline.attr("data-tooltip","Debe ingresar una aerolinea válida");
		airline.tooltip('add');
		airline.mouseenter();
		setTimeout(function(){ airline.tooltip('remove'); airline.attr("data-tooltip",text);}, 3000);
}
function showNotANumberError(){
	var flight = $(".flight_input");
	flight.tooltip('remove');
	var text= flight.attr("data-tooltip");
	flight.attr("data-tooltip","Debe ingresar un número");
	flight.tooltip('add');
	flight.mouseenter();
	setTimeout(function(){ flight.tooltip('remove'); flight.attr("data-tooltip",text);}, 3000);
}
