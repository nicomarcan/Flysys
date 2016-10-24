 $(document).ready(function(){
 	var airlines = {};
var airlines_id = {};
      $('.slider').slider({full_width: true,indicators:false,transition:1000});
      // Pause slider
	$('.slider').slider('pause');
	$("#search").attr("selected","");

	$('#next').click(function(){
			if(!$(this).hasClass("disabled")){
				if($('.slider li.active').hasClass('first') ){
				   $("#prev").removeClass("disabled");
				}
				$("#start-step").removeClass("disabled");
				$('.slider').slider('next');
				if($('.slider li.active').hasClass('step_start')){
					var selected= $('a.breadcrumb[selected]');
					selected.removeAttr("selected");
					selected.next().attr("selected","");
					$("#start-step").addClass("disabled");
					if($('.slider li.active').hasClass('last')){
						$('#next-step').addClass("disabled");
					}
					if($('.slider li.active').prevAll('.step_start').length == 1){
						$('#prev-step').removeClass("disabled");
					}		
				}

				
				if($('.slider li.active').hasClass('last') && !$('.slider li.active').hasClass('step_start')){
					$(this).addClass("disabled");
				}	

			}
	});



	$('#prev').click(function(){
		
			if(!$(this).hasClass("disabled")){
				if($('.slider li.active').hasClass('step_start')){
					var selected= $('a.breadcrumb[selected]');
					selected.removeAttr("selected");
					selected.prev().attr("selected","");
					if($('.slider li.active').hasClass('last')){
						$('#next-step').removeClass("disabled");
						$("#start-step").removeClass("disabled");
					}
				}
				if($('.slider li.active').prevAll('.step_start').length==1){
						$('#prev-step').addClass("disabled");
				}


				if($('.slider li.active').hasClass('last') && !$('.slider li.active').hasClass('step_start')){
					$("#next").removeClass("disabled");
				}

				$('.slider').slider('prev');

				if($('.slider li.active').hasClass('first')){
					$(this).addClass("disabled");
					$("#start-step").addClass("disabled");
				}	

			}
	});

	$('#next-step').click(function(){
		if(!$(this).hasClass("disabled")){

			$("#prev-step").removeClass("disabled");
			$("#prev").removeClass("disabled");			
			$('.slider').slider('next');
			while(!$('.slider li.active').hasClass('step_start') ){
				$('.slider').slider('next');
			}
			if($('.slider li.active').hasClass('last')){
				$(this).addClass("disabled");
			}	
			var selected= $('a.breadcrumb[selected]');
			selected.removeAttr("selected");
			selected.next().attr("selected","");
			$("#start-step").addClass("disabled");
		}


    });

//todo: boton principio de etapa, genera bug sino
    $('#prev-step').click(function(){
		
			if(!$(this).hasClass("disabled")){
				$("#next-step").removeClass("disabled");
				$("#next").removeClass("disabled");
				if(!$('.slider li.active').hasClass('step_start') ){
					$('.slider').slider('prev');
					while(!$('.slider li.active').hasClass('step_start') ){
						$('.slider').slider('prev');
					}
				}
	
				$('.slider').slider('prev');
				while(!$('.slider li.active').hasClass('step_start') ){
					$('.slider').slider('prev');
				}

				if($('.slider li.active').hasClass('first')){
					$(this).addClass("disabled");
					$("#prev").addClass("disabled");
				}	
				var selected= $('a.breadcrumb[selected]');
				selected.removeAttr("selected");
				selected.prev().attr("selected","");
				$("#start-step").addClass("disabled");
		}

    });

      $('#start-step').click(function(){
		
			if(!$(this).hasClass("disabled")){
				$("#next").removeClass("disabled");
	
				$('.slider').slider('prev');
				while(!$('.slider li.active').hasClass('step_start') ){
					$('.slider').slider('prev');
				}

				if($('.slider li.active').hasClass('first')){
					$(this).addClass("disabled");
					$("#prev").addClass("disabled");
				}	
				$("#start-step").addClass("disabled");
		}

    });

       $('.modal-trigger').leanModal();

         $('#modal1').openModal();

         	$.when(
			ajaxAirlineSearch(airlines, airlines_id)
		).then(
			airlineSearchSubmit(airlines, airlines_id)
		)
 });