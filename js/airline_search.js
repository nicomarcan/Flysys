function ajaxAirlineSearch(airlines, airlines_id) {
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
					insertErrorCard(
						$("#flight-info-card"),
						"Error de conexion",
						"No se pudo conectar al servidor",
						false
					);
					$("#review-head").hide();
				}
				var airline_data = response.airlines;
				var ret = [];
				for (var i=0; i<response.total; i++) {
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
			},
			error: function(obj, errorMsg, error) {
				insertErrorCard(
					$("#flight-info-card"),
					"Error de conexion",
					"No se pudo conectar al servidor",
					false
				)
				$("#review-head").hide();
			}
		})
}
function airlineSearchSubmit(airlines, airlines_id) {
	$("form#airline_search_form").submit(function(event) {
		var search_info = $("input#airline_search").typeahead('val').toLowerCase();
		if (airlines[search_info]) {
			$("input#airline_search_id").val(airlines[search_info]);
			return true;
		}
		return false;
	});
}

function handleAirlineSearchError(error) {

}
