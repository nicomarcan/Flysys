function insertErrorCard(container, header, description, link) {
	if (container.find(".error-card").length !== 0) {
		return
	}
	var template = $("#error_card").html();
	Mustache.parse(template);
	var render = Mustache.render(template, {
		header: header,
		description: description,
		link: link
	});
	container.prepend(render);
}

$(document).ready( function(){
	$(document).on('click', "a.back-link", function() {
		history.back();
	});
});
