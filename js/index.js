
var valores=new Array();/*feo*/
var airlines=new Array();
$(document).ready(function(){
	

		var nameToId={};

		  var airports_url = 'http://hci.it.itba.edu.ar/v1/api/geo.groovy?method=getairports';
		  $.ajax({
		    type: 'GET',
		    url: airports_url,
		    dataType: 'json' ,
		    success: function(d){
		      if(d.total<=d.page_size){
		        cargaTypeAHead(d);
		      } else {
		        $.ajax({
		          type: 'GET',
		          url: airports_url,
		          dataType: 'json',
		          data: {page_size:d.total},
		          success: function(f){
		            //fillAirportsAutocomplte(f);
		            cargaTypeAHead(f);
		          }
		        });
		      }
		    }
		  });


		  var airlines_url = 'http://hci.it.itba.edu.ar/v1/api/misc.groovy?method=getairlines';
		  $.ajax({
		    type: 'GET',
		    url: airlines_url,
		    dataType: 'json' ,
		    success: function(d){
		      if(d.total<=d.page_size){
		        cargaTypeAHeadAirlines(d);
		      } else {
		        $.ajax({
		          type: 'GET',
		          url: airports_url,
		          dataType: 'json',
		          data: {page_size:d.total},
		          success: function(f){
		            //fillAirportsAutocomplte(f);
		            cargaTypeAHeadAirlines(f);
		          }
		        });
		      }
		    }
		  });


		  function cargaTypeAHeadAirlines(data){
			var total = data.total;
			var airl = data.airlines;
			var obj = [];
			for(var x = 0 ; x<total ; x++ ){
				obj.push(airl[x].name) ;
				airlines.push(airl[x].name);
				nameToId[airl[x].name] = airl[x].id;
			}
			var blood_ciudades = new Bloodhound({
				datumTokenizer: Bloodhound.tokenizers.whitespace,
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				local: obj
			});


				$('.typeahead#airlines_input,.typeahead#airline_search').typeahead(
								{
										minLength: 1,
										highlight: true
								},
							// {
							// 		name: 'Aeropuertos',
							// 		source: blood_aeropuertos,
							// 		limit: 2,
							// },
								{
										name: 'Aerolineas',
										limit: 3,
										source: blood_ciudades,
								}
				);
			};


      $('.slider').slider({indicators:false,transition:400});
  
        
        $('.slider').slider('pause');
       
        $(".slider").removeAttr("style");
        $("ul.slides").removeAttr("style");

        $(".slider").on('mouseenter',function(){
        	$(this).slider('next');
        });

         $(".slider").on('mouseleave',function(){
        	$(this).slider('next');
        });






		function cargaTypeAHead(data){
			var total = data.total;
			var airports = data.airports;
			var obj = [];
			for(var x = 0 ; x<total ; x++ ){
				obj.push(airports[x].description.split(", ")[1]) ;
				valores.push(airports[x].description.split(", ")[1]);
				obj.push(airports[x].description) ;
				valores.push(airports[x].description);
				nameToId[airports[x].description.split(", ")[1]] = airports[x].city.id;
				nameToId[airports[x].description] = airports[x].id;
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
						// {
						// 		name: 'Aeropuertos',
						// 		source: blood_aeropuertos,
						// 		limit: 2,
						// },
							{
									name: 'Ciudades',
									limit: 3,
									source: blood_ciudades,
							}
			);
			console.log(nameToId);
			};




			//Implementacion de Flickr
		  var apiurl=new Array();
		  var to=new Array();
		   var price=new Array();
			var j = 1;
			var src;
			var photo;
		      $.ajax({
		     	type: 'GET',
				url: 'http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=getflightdeals&from=BUE',
				dataType: 'jsonp',
				success: function (alfa) {
						if (alfa.error == undefined) {
							   console.log(alfa.deals);
							var ciudades = alfa.deals;
							var size = ciudades.length;
							var random = parseInt((Math.random() * (ciudades.length-12 + 1)), 10) ;
							var limit = random+11;
							for( ; random< limit ; random++ ){
								to.push(ciudades[random].city.name.split(", ")[0]);
								price.push(alfa.deals[random].price);
								
								//console.log(noSpacesCity);
				
								apiurl.push("http://www.panoramio.com/map/get_panoramas.php?set=public&from=0&to=20&minx="+ciudades[random].city.longitude+"&miny="+ciudades[random].city.latitude+"&maxx="+(ciudades[random].city.longitude+1)+"&maxy="+(ciudades[random].city.latitude+1)+"&size=medium&mapfilter=false");
							}
					}
					getImages(apiurl,0);
				}
			});

		      console.log(to);

	      function getImages(apiurl,k){	      	   	
		    	   $.ajax({
				    type: 'GET',
				    url: apiurl[k],
				    dataType: 'jsonp',
				    success: function(d){		
				  		var item = d.photos[0].photo_file_url;
						 var photo= $('#offer-img-'+(k+1));
						 photo.attr("src",item);
						 photo= $('#offer-img-back-'+(k+1));
						
						photo.next().children("h5").text(to[k]);
						photo.next().children("p").text("Desde "+ price[k]+ " dolares");
						 photo.attr("src",item);
						 photo.attr("to",to[k]);
						 photo.attr("from","Buenos Aires");
						
						 k++;
						 if(k<6){
						 	getImages(apiurl,k);
						 }
				    }
				  });
		    	// console.log(k);
		   	}
		  




		 $('.modal-trigger').leanModal();


		$('img.offer-img').on('click', function() {
			var from;
			var to;
			var picker;
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
			from.focus();
			to.typeahead('val',$(this).attr("to")); /*$(this).attr("value") next update incoming*/
			to.focus();
			to.blur();
			event.stopPropagation();
			picker.open();

		});

		$('#crossicon').on('click', function() {
			var from = $("#from_input");
			var to = $("#to_input");
			var from_val = from.typeahead('val');
			var to_val = to.typeahead('val');
			var cache=from_val
			from.typeahead('val',to_val);
			to.typeahead('val',cache);
			// to.val(from_val)
			// from.val(to_val);
			// from.focus();
			to.focus();
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
			// to.val(from_val)
			// from.val(to_val);
			// from.focus();
			to.focus();
			to.blur();

		});

		$('.star_group .material-icons.clickable').on('click', function() {
			var stars_before= $(this).prevAll();
			var stars_next= $(this).nextAll();
			$(this).attr("class"," material-icons");
			stars_before.attr("class"," material-icons clickable");
			stars_next.attr("class"," material-icons grey-text text-lighten-1 clickable");
			$(this).attr("clicked","clicked");
			stars_before.attr("clicked","clicked");
			stars_next.removeAttr("clicked");



		});

		$('.star_group .material-icons.clickable').on('mouseover', function() {

			var stars_before= $(this).prevAll();
			var stars_next= $(this).nextAll();
			$(this).attr("class"," material-icons");
			stars_before.attr("class"," material-icons clickable");
			stars_next.attr("class"," material-icons grey-text text-lighten-1 clickable");



		});

		$('.star_group .material-icons.clickable').on('mouseleave', function() {

			if($(this).attr("clicked")=="clicked"){
				$(this).nextAll(":not([clicked])").attr("class"," material-icons grey-text text-lighten-1 clickable");
				$(this).nextAll("[clicked]").attr("class"," material-icons  clickable");
			}else{
				$(this).attr("class"," material-icons grey-text text-lighten-1 clickable");
				$(this).prevAll(":not([clicked])").attr("class"," material-icons grey-text text-lighten-1 clickable");
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

		 $("#departing .datepicker,#departing_two .datepicker").pickadate({
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

		 var date2_picker = null ;
		  var prevdate = null;
		  $("#departing_two input[name='_submit']").attrchange({
		    trackValues: true,
		    callback: function(event){
		      var d = event.newValue ;
		      var date = new Date(d.split("-")[0],d.split("-")[1]-1,d.split("-")[2]);
		      $("#returning > input").removeAttr("disabled");
		      if(date2_picker == null){
		        date2_picker = $("#returning .datepicker").pickadate({
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
		          disable: [{ from: [0,0,0], to: date }]
		        });
		      } else {
		        var picker = date2_picker.pickadate('picker');
		        picker.set('enable', [{from: [0,0,0], to: prevdate}]);
		        picker.set('disable', [{ from: [0,0,0], to: date }]);
		        $("#returning .picker__input").val("");
		        $("#returning input[name='_submit']").removeAttr("value");
		      }
		      prevdate = date ;
		    }
		  });



		$('.parallax').parallax({});
		 $('select').material_select();


		$(".dropdown-button#passengers_two").on('click',function(){
			event.stopPropagation();
			if(!$(this).attr("closed")){
				$(this).attr("closed","true");
				$(this).click();
			}else{
				$(this).removeAttr("closed");
				$("#open-button-two").click();
			}

		});

			$(".dropdown-button#passengers").on('click',function(){
			event.stopPropagation();
			if(!$(this).attr("closed")){
				$(this).attr("closed","true");
				$(this).click();
			}else{
				$(this).removeAttr("closed");
				$("#open-button").click();
			}

		});


		$("#dropdown1").on("mouseleave",function(){
			$('.dropdown-button#passengers').dropdown('close');
		});

		$("#open-button").on('click',function(){
			$('.dropdown-button#passengers').dropdown('open');
		});
		$("#open-button-two").on('click',function(){
			$('.dropdown-button#passengers_two').dropdown('open');
		});

		$("#done-button").on('click',function(){
			$('.dropdown-button#passengers').dropdown('close');
		});
		$("#done-button-two").on('click',function(){
			$('.dropdown-button#passengers_two').dropdown('close');
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


		// function fillAirportsAutocomplte(data){
		//   console.log(data.total);
		//   var total = data.total;
		//   var airports = data.airports;
		//   var airportObj = {};
		//   for(var x = 0 ; x<total ; x++ ){
		//     airportObj[airports[x].description] = null;
		//     airportObj[airports[x].description.split(", ")[1]] = null;
		//     valores.push(airports[x].description);
		//     valores.push(airports[x].description.split(", ")[1]);
		//     nameToId[airports[x].description] = airports[x].id;
		//     nameToId[airports[x].description.split(", ")[1]] = airports[x].id;
		//   }
		//   $('#from_input,#to_input').autocomplete({
		//     data: airportObj,
		//   });
		// }

		// 	function fillCitiesAutocomplte(data){
		// 	  console.log(data.total);
		// 	  var total = data.total;
		// 	  var cities = data.cities;
		// 	  var cityObj = {};
		// 	  for(var x = 0 ; x<total ; x++ ){
		// 	    cityObj[cities[x].name] = null;
		// 	    valores.push(cities[x].name);
		// 	    nameToId[cities[x].name] = cities[x].id;
		// 	  }
		// 	  $('#from_input,#to_input').autocomplete({
		// 	    data: cityObj,
		// 	  });
		// 	}

		$('#send-review').on('click',function(){
			var review = {};
			var airline = {};
			var flight = {};
			var rating = {};

			airline["id"] = nameToId[$("#review-modal #airlines_input").val()];
			flight["airline"]=airline;
			flight["number"]=parseInt($("#review-modal #vuelo").val());
			review["flight"]=flight;
			var ok = true;
			for(var x = 1 ; x<7 && ok; x++){
				var type = $("#review-modal #opinion-row-"+x).children(":first-child").attr("id");
				var score = $("#review-modal #opinion-row-"+x).children(":nth-child(2)").children(":not(.grey-text)").length * 2;
				rating[type]= score;
				if(score <= 0)
					ok = false;
			}
			review["rating"]=rating;
			if($("#recommend .material-icons.clickable[selected]").attr("id") == undefined)
				ok=false;
			review["yes_recommend"]= ($("#recommend .material-icons.clickable[selected]").attr("id") == "yes");
			review["comments"]= encodeURIComponent($("#review-modal #comments").val());

			

			/* var review_url = 'http://hci.it.itba.edu.ar/v1/api/review.groovy?method=reviewairline';
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
			  });*/
			  if(airline["id"] != undefined && !isNaN(flight["number"]) && ok && $("#review-modal #comments").val()<=256  ) {
				  $(this).hide();
				  $("#review-form").hide(300);
				  $("#close-modal").show();
				  $("#post-review").show();
				   $("#error-review").hide();
			}else{
				$("#error-review").show();
				$('#review-modal').scrollTop(0);
			}




		});

		$("#link-airline").on('click',function(){
			window.location="reviews_airlines.html?airline_id="+nameToId[$("#review-modal #airlines_input").val()];
		});

		$('#review-btn').on('click',function(){
			$("#review-modal #airlines_input").val("") ;
			$("#review-modal #airlines_input").blur() ;
			$("#review-modal #vuelo").val("");
			$("#review-modal #vuelo").blur();
			 for(var x = 1 ; x<7 ; x++){
				 $("#review-modal #opinion-row-"+x).children(":nth-child(2)").children().attr("class"," material-icons grey-text text-lighten-1 clickable")
			 }
           $("#recommend .material-icons.clickable").removeAttr("selected");
           $("#recommend .material-icons.clickable").attr("class","material-icons grey-text text-lighten-1 clickable");
			$("#review-modal #comments").val("");
			$("#review-modal #comments").blur();
			  $("#send-review").show();
			  $("#review-form").show();
			  $("#close-modal").hide();
			  $("#post-review").hide();
			  $("#error-review").hide();
		});

		$('#search-icon-two').on('click',function(){
			var src = nameToId[$('#from_input_two').val()];
			var dst = nameToId[$('#to_input_two').val()];
			var d1 = $('#departing_two input[name=_submit]').val();
			var d2 = $('#returning input[name=_submit]').val();
			var adults= $('#passenger_two #adults #adults_val').text();
			var children= $('#passenger_two #children #children_val').text();
			var infants= $('#passenger_two #infants #infants_val').text();
			var url= "results.html?"+"mode=two-way&src="+src+"&dst="+dst+"&adults="+adults+"&children="+children+"&infants="+infants+"&d1="+d1+"&d2="+d2;
			console.log(url);
			window.location=url;
		});

		$('#search-icon').on('click',function(){
			var src = nameToId[$('#from_input').val()];
			var dst = nameToId[$('#to_input').val()];
			var d1 = $('#departing input[name=_submit]').val();
			var adults= $('#passenger #adults #adults_val').text();
			var children= $('#passenger #children #children_val').text();
			var infants= $('#passenger #infants #infants_val').text();
			var url= "results.html?"+"mode=one-way&src="+src+"&dst="+dst+"&adults="+adults+"&children="+children+"&infants="+infants+"&d1="+d1;
			console.log(url);
			window.location=url;
		});



		  $("form#airline_search_form").submit(function(event) {
		    var search_info = $("input#airline_search").typeahead('val');
		    if (nameToId[search_info] != undefined) {
		      $("input#airline_search_id").val(nameToId[search_info]);
		      return true;
		    }
		    return false;
		  });

$("#one-way-tab").on('click',function(){
		var from_two = $("#from_input_two");
		var to_two = $("#to_input_two");
		var from_val = from_two.typeahead('val');
		var to_val = to_two.typeahead('val');
		var from = $("#from_input");
		var to = $("#to_input");
		from.typeahead('val',from_val);
		to.typeahead('val',to_val);
		to.focus();
		to.blur();
});



$("#two-way-tab").on('click',function(){
		var from = $("#from_input");
		var to = $("#to_input");
		var from_val = from.typeahead('val');
		var to_val = to.typeahead('val');
		var from_two = $("#from_input_two");
		var to_two = $("#to_input_two");
		from_two.typeahead('val',from_val);
		to_two.typeahead('val',to_val);
		to_two.focus();
		to_two.blur();
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


   $("#two-way").validate({
    rules: {
        from_input:{
        	required: true,
        	city:true
        },
         to_input:{
        	required: true,
        	city:true
        },
        airlines_input:{
        	required: true,
        	airline:true
        }
    }
});


   $("#one-way").validate({
    rules: {
        from_input:{
        	required: true,
        	city:true
        },
         to_input:{
        	required: true,
        	city:true
        },
        airlines_input:{
        	required: true,
        	airline:true
        }
    }
});








});
