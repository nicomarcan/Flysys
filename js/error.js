function insertErrorCard(container, header, description, link, link_link, link_message) {
	if (container.find(".error-card").length !== 0) {
		return
	}
	if (link == true && !link_link) {
		link_link = "back-link";
		link_message = "Volver atrás."
	}

	var template = $("#error_card").html();
	Mustache.parse(template);
	var render = Mustache.render(template, {
		header: header,
		description: description,
		link: link,
		link_link: link_link,
		link_message: link_message
	});
	container.prepend(render);
}

$(document).ready( function(){
	$(document).on('click', "a.back-link", function() {
		history.back();
	});
	$(document).on('click', "a.home-link", function() {
		window.location = "./index.html";
	});
});
