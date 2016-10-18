 $(document).ready(function(){
      $('.slider').slider({full_width: true,indicators:false,transition:1000});
      // Pause slider
	$('.slider').slider('pause');

	$('#next').click(function(){
		// Next slide
		$('.slider').slider('next');
	});

	$('#prev').click(function(){
		// Next slide
		$('.slider').slider('prev');
	});

	$('#next-step').click(function(){
		// Next slide
		$('.slider').slider('next');
		$('.slider').slider('next');
		var selected= $('a.breadcrumb[selected]');
		selected.removeAttr("selected");
		selected.next().attr("selected","");

    });

    $('#prev-step').click(function(){
		// Next slide
		$('.slider').slider('prev');
		$('.slider').slider('prev');
		var selected= $('a.breadcrumb[selected]');
		selected.removeAttr("selected");
		selected.prev().attr("selected","");

    });

       $('.modal-trigger').leanModal();

         $('#modal1').openModal();
 });