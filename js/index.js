



$(document).ready(function(){
	var to = 2000 ;

	//history
	if (typeof(Storage) !== "undefined") {
		var prev_state;

   		prev_state =JSON.parse(sessionStorage.getItem("flight_info"));
   		if( prev_state != undefined ){
   				if(prev_state["Mode"] == "one-way")
   					$("#one-way-tab").trigger('click');
				var from = $("#from_input");
				var to = $("#to_input");
				from.val(prev_state['from']);
				to.val(prev_state['to']);
				 $('.modal-trigger#passengers').text( prev_state['Passengers']);
				 $('#adults_val').text(prev_state['Adults']);
				 $('#children_val').text(prev_state['Children']);
				 $('#infants_val').text(prev_state['Infants']);
				var from_two = $("#from_input_two");
				var to_two = $("#to_input_two");
				from_two.val(prev_state['from']);
				to_two.val(prev_state['to']);
				 $('.modal-trigger#passengers_two').text( prev_state['Passengers']);
				 $('#adults_val_two').text(prev_state['Adults']);
				 $('#children_val_two').text(prev_state['Children']);
				 $('#infants_val_two').text(prev_state['Infants']);
   		}
   
} 



var airlines = {};
var airlines_id = {};

$("#map-btn").click(function(){
	if (google_maps_ready == true && first == true)
			InitializeMap();
	first=false;
});


		var valores=new Array();
		var airlines=new Array();
		var nameToId={};
		var check=false;
		getLocation();
		//AUTOCOMPLETE
		  var airports_url = 'http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getairports';
		  $.ajax({
		    type: 'GET',
		    url: airports_url,
		    dataType: 'json' ,
		     timeout: to,
		      error: function(){
                		showInternetError();
              		},
		    success: function(d){
		      if(d.total<=d.page_size){
		        cargaTypeAHead(d);
		      } else {
		        $.ajax({
		          type: 'GET',
		          url: airports_url,
		          dataType: 'json',
		           timeout: to,
		          data: {page_size:d.total},
		             error: function(){
                		showInternetError();
              		},
		          success: function(f){
		            cargaTypeAHead(f);
		          }

		        });
		      }
		    }
		  });

		  function cargaTypeAHead(data){
			var total = data.total;
			var airports = data.airports;
			var obj = [];
			for(var x = 0 ; x<total ; x++ ){
				obj.push(airports[x].description.split(", ")[1]) ;
				valores.push(airports[x].description.split(", ")[1].toLowerCase());
				obj.push(airports[x].description) ;
				valores.push(airports[x].description.toLowerCase());
				nameToId[airports[x].description.split(", ")[1].toLowerCase()] = airports[x].city.id;
				nameToId[airports[x].description.toLowerCase()] = airports[x].id;
			}
			var blood_ciudades = new Bloodhound({
				datumTokenizer: Bloodhound.tokenizers.whitespace,
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				local: obj
			});



			$('.typeahead#from_input,.typeahead#to_input,.typeahead#from_input_two,.typeahead#to_input_two').typeahead(
							{
									minLength: 1,
									highlight: true
							},
		
							{
									name: 'Ciudades',
									limit: 3,
									source: blood_ciudades,
							}
			);

			};



		$.when(
			ajaxAirlineSearch(airlines, airlines_id)
		).then(
			airlineSearchSubmit(airlines, airlines_id)
		)

			//AUTO COMPLETE ENDS

		//OFFER IMGS
     	$('.slider').slider({indicators:false,transition:400});


        $('.slider').slider('pause');

        $(".slider").removeAttr("style");
        $("ul.slides").removeAttr("style");





		   	$("#offers").click(function(){
		   		$("html, body").animate({ scrollTop: 500 },500);
		   	})

		$('img.offer-img').on('click', function() {
			var from;
			var to;
			var picker;
			$("html, body").animate({ scrollTop: "0" },600);
			if($("#search a.active").attr("href")=="#one-way"){
				 from = $("#from_input");
				 to = $("#to_input");
				picker = $('#departing .datepicker').pickadate('picker');
			}else{
				from = $("#from_input_two");
				to = $("#to_input_two");
				picker = $('#departing_two .datepicker').pickadate('picker');
			}

			from.typeahead('val',$(this).attr("from"));
			from.blur();
			to.typeahead('val',$(this).attr("to"));
			to.blur();
			event.stopPropagation();
			picker.open();

		});

		//OFFER IMGS END




		 $('.modal-trigger:not(#passengers_two,#passengers)').leanModal({
		 	complete: function() {  $('.tooltipped').tooltip('remove'); } // Callback for Modal close
		 });
		  $('.tooltipped').tooltip({delay: 50});
		   $('.tooltipped').tooltip('remove');




		  //SEARCH-INPUT

		$('#crossicon').on('click', function() {
			var from = $("#from_input");
			var to = $("#to_input");
			var from_val = from.typeahead('val');
			var to_val = to.typeahead('val');
			var cache=from_val
			from.typeahead('val',to_val);
			to.typeahead('val',cache);

			from.blur();
			to.blur();

		});

			$('#crossicon-two').on('click', function() {
			var from = $("#from_input_two");
			var to = $("#to_input_two");
			var from_val = from.typeahead('val');
			var to_val = to.typeahead('val');
			var cache=from_val
			from.typeahead('val',to_val);
			to.typeahead('val',cache);

			from.blur();
			to.blur();

		});


		var date2_picker = null ;
			$("#departing .datepicker,#departing_two .datepicker").pickadate({
		    monthsFull: [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
		    monthsShort: [ 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic' ],
		    weekdaysFull: [ 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado' ],
		    weekdaysShort: [ 'dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb' ],
				close: 'Cerrar',
		    firstDay: 1,
		    format: 'd !de mmmm !de yyyy',
		    formatSubmit: 'yyyy-mm-dd' ,
		    min: 2,
				onRender: function(){
					$("#departing_two  .picker__footer .picker__button--today,#departing .picker__footer .picker__button--today").remove();
					$("#departing_two  .picker__footer .picker__button--clear,#departing .picker__footer .picker__button--clear").remove();
				}
		  });

			date2_picker = $("#returning .datepicker").pickadate({
				monthsFull: [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
				monthsShort: [ 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic' ],
				weekdaysFull: [ 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado' ],
				weekdaysShort: [ 'dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb' ],
				close: 'Cerrar',
				firstDay: 1,
				format: 'd !de mmmm !de yyyy',
				formatSubmit: 'yyyy-mm-dd' ,
				min: 2,
				onRender: function(){
					$("#returning  .picker__footer .picker__button--today").remove();
					$("#returning  .picker__footer .picker__button--clear").remove();
				}
			});


		  var prevdate = null;
		  $("#departing_two input[name='_submit']").attrchange({
		    trackValues: true,
		    callback: function(event){
					if(event.attributeName != "value"){
						return;
					}
		      var d = event.newValue ;
		      var date = new Date(d.split("-")[0],d.split("-")[1]-1,d.split("-")[2]);
					if (date == "Invalid Date"){
						return;
					}
	        var picker = date2_picker.pickadate('picker');
	        picker.set('enable', [{from: [0,0,0], to: prevdate}]);
	        picker.set('disable', [{ from: [0,0,0], to: date }]);
	        $("#returning .picker__input").val("");
	        $("#returning input[name='_submit']").removeAttr("value");
		      prevdate = date ;
		    }
		  });

		  //DROPDOWN TWO-WAY

		   $('.modal-trigger#passengers_two').leanModal({
		      dismissible: true, // Modal can be dismissed by clicking outside of the modal
		      opacity: 0, // Opacity of modal background
		      in_duration: 300, // Transition in duration
		      out_duration: 200, // Transition out duration
		      starting_top: '4%', // Starting top style attribute
		      ending_top: '10%', // Ending top style attribute


		    }
		  );
		   //DROPDOWN ONE-WAY
		    $('.modal-trigger#passengers').leanModal({
		      dismissible: true, // Modal can be dismissed by clicking outside of the modal
		      opacity: 0, // Opacity of modal background
		      in_duration: 300, // Transition in duration
		      out_duration: 200, // Transition out duration
		      starting_top: '4%', // Starting top style attribute
		      ending_top: '10%', // Ending top style attribute

		    }
		  );

		    //dropdown-minus
			$(".minus").on('click',function(){
				var number = Number($(this).next().text());
				if($(this).prev().attr("id")=="adults" ||$(this).prev().attr("id")=="adults_two"){
					if(number > 1){
						$(this).next().text(number-1);
						if($("#search a.active").attr("href")=="#one-way")
						 	$('.modal-trigger#passengers').text(getPassengers(""));
						 else
						 	$('.modal-trigger#passengers_two').text(getPassengers("_two"));
					}
				}else{
					if(number > 0){
						$(this).next().text(number-1);
						 if($("#search a.active").attr("href")=="#one-way")
						 	$('.modal-trigger#passengers').text(getPassengers(""));
						 else
						 	$('.modal-trigger#passengers_two').text(getPassengers("_two"));
					}
				}
			});
				//dropdown plus
			$(".plus").on('click',function(){
				var number = Number($(this).prev().text());
				if(number < 20){
					$(this).prev().text(number+1);
			        if($("#search a.active").attr("href")=="#one-way")
						 	$('.modal-trigger#passengers').text(getPassengers(""));
						 else
						 	$('.modal-trigger#passengers_two').text(getPassengers("_two"));
				}
			});

			$("#one-way-tab").on('click',function(){
				if($("#search a.active").attr("href")=="#one-way"){
					return;
				}
				var from_two = $("#from_input_two");
				var to_two = $("#to_input_two");
				var from_val = from_two.typeahead('val');
				var to_val = to_two.typeahead('val');
				var from = $("#from_input");
				var to = $("#to_input");
				 $('.tooltipped').tooltip('remove');
				$("#departing input").val($("#departing_two input").val());
				var departing_two_val =  $('#departing_two input[name=_submit]').val();
				var departing = $('#departing input[name=_submit]');
				departing.val(departing_two_val);
				from.typeahead('val',from_val);
				to.typeahead('val',to_val);
				if(from.typeahead('val')!= "" )
					from.blur();
				if( to.typeahead('val')!="")
					to.blur();
				 $('.modal-trigger#passengers').text( $('.modal-trigger#passengers_two').text());
				 $('#adults_val').text( $('#adults_val_two').text());
				 $('#children_val').text( $('#children_val_two').text());
				 $('#infants_val').text( $('#infants_val_two').text());
		});



		$("#two-way-tab").on('click',function(){
				if($("#search a.active").attr("href")=="#two-way"){
					return;
				}
				var from = $("#from_input");
				var to = $("#to_input");
				var from_val = from.typeahead('val');
				var to_val = to.typeahead('val');
				var from_two = $("#from_input_two");
				var to_two = $("#to_input_two");
				 $('.tooltipped').tooltip('remove');
				$("#departing_two input").val($("#departing input").val());
				var departing_val =  $('#departing input[name=_submit]').val();
				var departing_two = $('#departing_two input[name=_submit]');
				departing_two.val(departing_val);
				from_two.typeahead('val',from_val);
				to_two.typeahead('val',to_val);
				if(from_two.typeahead('val')!= "" )
					from_two.blur();
				if( to_two.typeahead('val')!="")
					to_two.blur();
				$('.modal-trigger#passengers_two').text( $('.modal-trigger#passengers').text());
				$('#adults_val_two').text( $('#adults_val').text());
				 $('#children_val_two').text( $('#children_val').text());
				 $('#infants_val_two').text( $('#infants_val').text());

		});


		//SEARCH TWO-WAY
		$('#search-icon-two').on('click',function(){
			var src = nameToId[$('#from_input_two').val().toLowerCase()];
			var dst = nameToId[$('#to_input_two').val().toLowerCase()];
			var d1 = $('#departing_two input[name=_submit]').val();
			var d2 = $('#returning input[name=_submit]').val();
			var adults= $('#passenger_two  #adults_val_two').text();
			var children= $('#passenger_two  #children_val_two').text();
			var infants= $('#passenger_two #infants_val_two').text();
			var url= "results.html?"+"mode=two-way&src="+src+"&dst="+dst+"&adults="+adults+"&children="+children+"&infants="+infants+"&d1="+d1+"&d2="+d2;
			if(src!=undefined && dst!=undefined && d1!="" &&  d2!=""){
				window.location=url;
				var flight_info= {};
				flight_info["Mode"]="two-way";
				flight_info["src"]=src;
				flight_info["dst"]=dst;
				flight_info["d1"]=d1;
				flight_info["d2"]=d2;
				flight_info["Adults"]=adults;
				flight_info["Children"]=children;
				flight_info["Infants"]=infants;
				flight_info["Passengers"]=$('.modal-trigger#passengers_two').text();
				flight_info["from"]=$('#from_input_two').val();
				flight_info["to"]= $('#to_input_two').val();
				sessionStorage.setItem("flight_info",JSON.stringify(flight_info));
				window.location=url;


			}
			else{
				$('#from_input_two').blur();
				checkEmpty($('#from_input_two'));
				$('#to_input_two').blur();
				checkEmpty($('#to_input_two'));
				if(d2==""){
					showError($('#returning input '));
				}
				if(d1==""){
					showError($('#departing_two input '));
				}
			}
		});


		//SEARCH ONE-WAY
		$('#search-icon').on('click',function(){
			var src = nameToId[$('#from_input').val().toLowerCase()];
			var dst = nameToId[$('#to_input').val().toLowerCase()];
			var d1 = $('#departing input[name=_submit]').val();
			var adults= $('#passenger #adults_val').text();
			var children= $('#passenger  #children_val').text();
			var infants= $('#passenger  #infants_val').text();
			var url= "results.html?"+"mode=one-way&src="+src+"&dst="+dst+"&adults="+adults+"&children="+children+"&infants="+infants+"&d1="+d1;
			if(src!=undefined && dst!=undefined && d1!=""){

				var flight_info= {};
				flight_info["Mode"]="one-way";
				flight_info["src"]=src;
				flight_info["dst"]=dst;
				flight_info["d1"]=d1;
				flight_info["Adults"]=adults;
				flight_info["Children"]=children;
				flight_info["Infants"]=infants;
				flight_info["Passengers"]=$('.modal-trigger#passengers').text();
				flight_info["from"]=$('#from_input').val();
				flight_info["to"]= $('#to_input').val();
				sessionStorage.setItem("flight_info",JSON.stringify(flight_info));
				window.location=url;
			}
			else{
				$('#from_input').blur();
				checkEmpty($('#from_input'));
				$('#to_input').blur();
				checkEmpty($('#to_input'));
				if(d1==""){
					showError($('#departing input '));
				}
			}
		});

		//PLACE VALIDATOR FROM AND TO
		$(".place_input").focusout(function(){
			 if(jQuery.inArray($(this).val().toLowerCase(),valores) >= 0){
			 	   $(this).addClass("valid");
			 	 $(this).removeClass("invalid");
			 }
			 else if($(this).val()!=""){
			 	 $(this).removeClass("valid");
		         $(this).addClass("invalid");
		          showError($(this));
			 }


		});



		//SEARCH INPUT ENDS

		//SENDING REVIEWS



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


		//airline validator
		$(".airline_input").focusout(function(){
			 if(airlines[$(this).val().toLowerCase()]){
			 	   $(this).addClass("valid");
			 	 $(this).removeClass("invalid");
			 }
			 else if($(this).val()!= ""){
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
			if($("#airlines_input").typeahead('val') == "" && $(this).val()!= ""){
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
						data:{"method":"getflightstatus","airline_id":airlines[$("#airlines_input").val().toLowerCase()],"flight_number":$(this).val()},
						dataType: 'jsonp',
						 timeout: to,
						  error: function(){
                		showInternetError();
              		},
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
			         	  timeout: to,
			         	   error: function(){
                		showInternetError();
              		},
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
		//link to airline comments
		$("#link-airline").on('click',function(){
			window.location="review.html?airline_id="+airlines[$("#review-modal #airlines_input").val().toLowerCase()];
		});
		//link to flight specific comments
		$("#link-flight").on('click',function(){
			window.location="review.html?airline_id="+airlines[$("#review-modal #airlines_input").val().toLowerCase()]+"&flight_number="+parseInt($("#review-modal #vuelo").val());
		});

		//review button clearing last input
		$('#review-btn').on('click',function(){
			$("#review-modal #airlines_input").typeahead('val','');
			$("#review-modal #airlines_input").removeClass("valid");
			$("#review-modal #airlines_input").removeClass("invalid");
			$("#review-modal #vuelo").val("");
			$("#review-modal #vuelo").removeClass("invalid");
			$("#review-modal #vuelo").removeClass("valid");
			 for(var x = 1 ; x<7 ; x++){
				 $("#review-modal #opinion-row-"+x).children(":nth-child(2)").children().addClass("grey-text text-lighten-1 ");
				  $("#review-modal #opinion-row-"+x).children(":nth-child(2)").children().removeAttr("clicked");
			 }
           $("#recommend .material-icons.clickable").removeAttr("selected");
           $("#recommend .material-icons.clickable").addClass(" grey-text text-lighten-1 ");
			$("#review-modal #comments").val("");
			$("#review-modal #comments").removeClass("invalid valid");
			  $("#send-review").show();
			  $("#review-form").show();
			  $("#close-modal").hide();
			  $("#post-review").hide();
		});



		//SEND REVIEWS ENDS



		$('.parallax').parallax({});
		 $('select').material_select();
		 $('#textarea1').trigger('autoresize');

		 $(window).scroll(function() {
    		var s = $(window).scrollTop(),

    		opacityVal = (s / 600.0);
    		$('.blurred-img').css('opacity', opacityVal);
		});






		//clear history when clicking logo
		$("#logo").click(function(){
			sessionStorage.removeItem("flight_info");
		});




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

function getPassengers(elem){
	var s = "";
	num =   Number( $("#adults_val"+elem).text() ) + Number( $("#children_val"+elem).text() )+ Number( $("#infants_val"+elem).text() );
	if (num == 1)
		s = "1 Pasajero";
	else
		s+= num +" Pasajeros";
	return s;
}

function showInternetError(){
	  Materialize.toast('Por favor verifique su conexión a internet y recargue la página', 4000)
}
