function ajaxInstallments(flight_id, adults, children, infants, card_number,tag_number) {
	$("option#installments-head-option").text("Cargando la tarjeta");
	$("option.installment-option").remove("");
	$("select").material_select();
		$.ajax({
			url: "http://hci.it.itba.edu.ar/v1/api/booking.groovy",
			jsonp: "callback",
			dataType: "jsonp",
			data: {
				method: "getinstallments",
				adults: adults,
				flight_id: flight_id,
				children: children,
				infants: infants,
				number: card_number
			},
			success: function(response) {
				if (response.error) {
					$("option#installments-head-option").text("El numero de tarjeta es invalido");
					$("select").material_select();
				}
				else {
					var percentage = " (Costo de financiamiento del " + parseInt(response.financial_cost * 100) + "%)";
					$("option#installments-head-option").text(
						response.card_type.replace(/_/g," ") + percentage
					);
					var instal = response.installments;
					var q;
					var total;
					for (var i = 0; i < instal.length; i++) {
						q = "";
						if (instal[i].quantity == 1) {
							q += instal[i].quantity +" cuota: ";
						}
						else {
							q += instal[i].quantity + " cuotas: ";
						}
						q += " $" + instal[i].first.toFixed(2);
						if (instal[i].others) {
							q += " + " + (instal[i].quantity - 1);
							q += " x $" + instal[i].others.toFixed(2);
							total = (instal[i].quantity - 1) *  instal[i].others + instal[i].first;
							q += " = $" + total.toFixed(2);
						}

						$("select#installment-options").append(
							"<option class='installment-option' value='"+ instal[i].quantity +"'>"+ q +"</option>"
						);
					}
					$("select").removeAttr("disabled");
					$("select").material_select();
				}
			},
			error: function() {
				$("option#installments-head-option").text("Fracaso la peticion");
				$("select").material_select();
			}
		});
	}



$(document).ready(function() {
	$('select').material_select();
	$(document).on("change", "input#tarjeta", function() {
		var numero_tarjeta = $(this).val();
		ajaxInstallments(
			94544,
			1,
			0,
			0,
			encodeURIComponent(numero_tarjeta)
		)
	});
});
