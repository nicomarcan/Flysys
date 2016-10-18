 $(document).ready(function(){
      $('.slider').slider({full_width: true,indicators:false,transition:1000});
      // Pause slider
	$('.slider').slider('pause');
	$('#next').click(function(){
		// Next slide
		$('.slider').slider('next');
	});
    });