function ajaxInstallments(flight_id, adults, children, infants, card_number, selector, ratio, currency) {
	if (selector.attr("number") == card_number) {
		return;
	}
	$("select[data-error=error]").each( function() {
		$(this).parent().children(".select-error").remove();
	})
	$("option#installments-head-option").text("Cargando la tarjeta");
	$("option.installment-option").remove("");
	selector.val(null);
	selector.material_select();
		$.ajax({
			url: "http://hci.it.itba.edu.ar/v1/api/booking.groovy",
			jsonp: "callback",
			dataType: "jsonp",
			timeout: 5000,
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
					selector.parent().find("option.installments-head-option").text("Fracasó la petición al servidor.");
					selector.parent().find("option.installments-head-option").attr("disabled", "");
					$("select").material_select();
				}
				else {
					var percentage = " (Costo de financiamiento del " + parseInt(response.financial_cost * 100) + "%)";
					selector.children("option#installments-head-option").text(
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
						q += " " + currency +  + (instal[i].first * ratio).toFixed(2);
						if (instal[i].others) {
							q += " + " + (instal[i].quantity - 1);
							q += " x " + currency  + (instal[i].others * ratio).toFixed(2);
							total = (instal[i].quantity - 1) *  instal[i].others  * ratio+ instal[i].first;
							q += " = " + currency +  + (total * ratio).toFixed(2);
						}

						selector.append(
							"<option class='installment-option' value='"+ instal[i].quantity +"'>"+ q +"</option>"
						);
					}
					selector.removeAttr("disabled");
					selector.parent().find("option.installments-head-option").text("Elija un modo de pago.");
					selector.attr("number", card_number);
					selector.material_select();
				}
			},
			error: function() {
				selector.parent().find("option.installments-head-option").text("Fracaso la conexion al servidor.");
				selector.attr("disabled", "");
				selector.material_select();
			}
		});
	}
