/*
Offline.options.checks = {
	xhr: {url: 'http://hci.it.itba.edu.ar/v1/api/misc.groovy'},
}
*/

Offline.options.checks = {
	image: {url: 'http://hci.it.itba.edu.ar/v1/images/BA.png?'+ encodeURIComponent(parseInt(Math.random() * 100))},
	active: 'image'
}

Offline.on("up", function() {
	Offline.options.checks = {
		image: {url: 'http://hci.it.itba.edu.ar/v1/images/BA.png?'+ encodeURIComponent(parseInt(Math.random() * 100))},
		active: 'image'
	}
	return true;
});

Offline.on("down", function() {
	Offline.confirmDown();
	return true;
});
