function loadAirlineTypeahead(airline_data, total, airlines, airlines_id ) {
	var ret = [];
	for (var i=0; i<total; i++) {
		//ret[airline_data[i].name] = airline_data[i].logo;
		ret.push(airline_data[i].name);
		airlines[airline_data[i].name.toLowerCase()] = airline_data[i].id;
		airlines_id[airline_data[i].id] = airline_data[i].name;
	}
	blood_airlines = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.whitespace,
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		local: ret
	});
	$('input#airline_search.typeahead, input#airlines_input.typeahead').typeahead(
		{
			minLength: 1,
			highlight: true
		},
		{
			name: 'Aerolineas',
			limit: 3,
			source: blood_airlines
		}
	);
}


function ajaxAirlineSearch(airlines, airlines_id, err_function) {
	if (getLocalObject("airline_data")) {
		var airline_data = getLocalObject("airline_data");
		loadAirlineTypeahead(
			airline_data,
			airline_data.length,
			airlines,
			airlines_id
		)
		return $.Deferred().resolve(airline_data);
	}
	return $.ajax({
			type: 'GET',
			url: 'http://hci.it.itba.edu.ar/v1/api/misc.groovy',
			jsonp: 'callback',
			dataType: 'jsonp',
			timeout: 5000,
			data: {
				method: 'getairlines'
			},
			success: function(response) {
				if (response.error) {
					if (err_function) {
						err_function();
					}
					return;
				}
				var airline_data = response.airlines;
				setLocalObject("airline_data", airline_data);
				loadAirlineTypeahead(airline_data, response.total, airlines, airlines_id );

			},
			error: function(obj, errorMsg, error) {
				if (err_function) {
					err_function();
				}
			}
		})
}


function airlineSearchSubmit(airlines, airlines_id) {
	$("form#airline_search_form").submit(function(event) {
		var search_info = $("input#airline_search").typeahead('val').toLowerCase();
		if (airlines[search_info]) {
			$("input#airline_search_id").val(airlines[search_info]);

      	 $("input#airline_search").removeClass("invalid");
             	 $("input#airline_search").addClass("valid");
			return true;
		}
     $("input#airline_search").addClass("invalid");
		return false;
	});
}

function handleAirlineSearchError(error) {

}
