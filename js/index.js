
var valores=new Array();/*feo*/
var airlines=new Array();
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



			$('.typeahead#from_input,.typeahead#to_input').typeahead(
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
			var j = 1;
			var src;
			var photo;
		      $.ajax({
		     	type: 'GET',
				url: 'http://hci.it.itba.edu.ar/v1/api/booking.groovy?method=getflightdeals&from=BUE',
				dataType: 'jsonp',
				success: function (alfa) {
						if (alfa.error == undefined) {
							var ciudades = alfa.deals;
							var size = ciudades.length;
							var random = parseInt((Math.random() * (ciudades.length-12 + 1)), 10) ;
							var limit = random+11;
							for( ; random< limit ; random++ ){
								to.push(ciudades[random].city.name.split(", ")[0]);
								var split = ciudades[random].city.name.split(",")[0].split(" ");
								var noSpacesCity="";
								$.each(split,function(i,item){
									noSpacesCity+=item;
								});

								//console.log(noSpacesCity);
								apiurl.push('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=e3dae01fb6981aeab9b4b352ceb8a59a&tags='+noSpacesCity+'&tag_mode=all&format=json&jsoncallback=?');
							}
					}
					getImages(apiurl);
				}
			});

	      function getImages(apiurl){

		      for(var k = 0;k<11;k++){
		      	//console.log(apiurl[k]);
		    	 $.getJSON(apiurl[k] , function(data){
									    var item = data.photos.photo[0];
									    var photo= $('#offer-img-'+j);
									    j++;
									     src = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +"_m.jpg";
									     photo.attr("src",src);
									     photo.attr("to",to[j-1]);
									     photo.attr("from","Buenos Aires");
										return false;
				});
		    	// console.log(k);
		   	}
		  }




		 $('.modal-trigger').leanModal();


		$('img.offer-img').on('click', function() {
			var from = $("#from_input");
			var to = $("#to_input");
			var picker = $('#departing .datepicker').pickadate('picker');
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

		 $("#departing .datepicker").pickadate({
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
		  $("#departing input[name='_submit']").attrchange({
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
			for(var x = 1 ; x<7 ; x++){
				var type = $("#review-modal #opinion-row-"+x).children(":first-child").attr("id");
				var score = $("#review-modal #opinion-row-"+x).children(":nth-child(2)").children(":not(.grey-text)").length * 2;
				rating[type]= score;

			}
			review["rating"]=rating;
			review["yes_recommend"]= ($("#recommend .material-icons.clickable[selected]").attr("id") == "yes");
			review["comments"]= encodeURIComponent($("#review-modal #comments").val());



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




		});

		$('#review-btn').on('click',function(){
			$("#review-modal #airlines_input").val("") ;
			$("#review-modal #vuelo").val("");
			 for(var x = 1 ; x<7 ; x++){
				 $("#review-modal #opinion-row-"+x).children(":nth-child(2)").children().attr("class"," material-icons grey-text text-lighten-1 clickable")
			 }
           $("#recommend .material-icons.clickable").removeAttr("selected");
           $("#recommend .material-icons.clickable").attr("class","material-icons grey-text text-lighten-1 clickable");
			$("#review-modal #comments").val("");
		});

		$('#search-icon').on('click',function(){
			var mode= $('#search [selected]').attr("id");
			var src = nameToId[$('#from_input').val()];
			var dst = nameToId[$('#to_input').val()];
			var d1 = $('#departing input[name=_submit]').val();
			var d2 = $('#returning input[name=_submit]').val();
			var adults= $('#passengers #adults #adults_val').text();
			var children= $('#passengers #children #children_val').text();
			var infants= $('#passengers #infants #infants_val').text();
			var url= "results.html?"+"mode="+mode+"&src="+src+"&dst="+dst+"&adults="+adults+"&children="+children+"&infants="+infants+"&d1="+d1+"&d2="+d2+"&page=1&sort_by=total";
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
        },
        airlines_input:{
        	required: true,
        	airline:true
        }
    }
});








});
