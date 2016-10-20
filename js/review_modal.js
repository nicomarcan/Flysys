

$(document).ready(function(){

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
        // to.val(from_val)
        // from.val(to_val);
        // from.focus();
        from.blur();
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
        $(this).attr("class"," material-icons clickable");
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

    $('#yes').on('mouseover', function() {

        $(this).attr("class","material-icons green-text  clickable ");
        $("#recommend .material-icons.clickable#no").attr("class","material-icons grey-text text-lighten-1 clickable");

    });

    $('#no').on('mouseover', function() {
            $(this).attr("class","material-icons red-text  clickable");
            $("#recommend .material-icons.clickable#yes").attr("class","material-icons grey-text text-lighten-1 clickable");

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
            if(!ok_categories)
                Materialize.toast("Debe calificar todas las categorias",2500);
            if(!ok_recommend)
                Materialize.toast("Debe seleccionar si recomienda o no el viaje",2500);
        }
    });

    $(".flight_input").focusout(function(){
    	  if($(this).val() == "" &&status==true){
    			Materialize.toast("El campo numero de vuelo es obligatorio",2500);
    			$(this).addClass("invalid");
    			$(this).removeClass("valid");
    	 }
    	else if(isNaN($(this).val()) && status==true){
    		$(this).addClass("invalid");
    		$(this).removeClass("valid");
    	}
    	else if($(".airline_input").hasClass("invalid") && status==true){
    		$(this).addClass("invalid");
    		$(this).removeClass("valid");
    	}

    	else if($(this).val() != ""){
    		  $.ajax({
    			    type: 'GET',
    				url: 'http://hci.it.itba.edu.ar/v1/api/status.groovy',
    				data:
                    {
                        "method":"getflightstatus",
                        "airline_id":airlines[$("#airlines_input").val().toLowerCase()],
                        "flight_number":$(this).val()
                    },
    				dataType: 'jsonp',
    				success: function (alfa) {
    					if(alfa.error==undefined){
    						$('.flight_input').addClass("valid");
    						$('.flight_input').removeClass("invalid");
    					}else{
    						$('.flight_input').addClass("invalid");
    						$('.flight_input').removeClass("valid");
    					}
    			}
    		});
    		}

    		status=true;

    });

    $(".airline_input").focusout(function(){
    	 if(airlines[$(this).val().toLowerCase()]){
    	 	   $(this).addClass("valid");
    	 	 $(this).removeClass("invalid");
    	 }
    	 else {

    	 	 $(this).removeClass("valid");
             $(this).addClass("invalid");
             if($(this).val() == "")
    			Materialize.toast("El campo numero de aerolinea es obligatorio",2500);
    	 }
    	 status=false;
    	 $(".flight_input").blur();

    });
})
