Offline.options.checks = {
	image: {url: 'http://hci.it.itba.edu.ar/v1/images/BA.png?dumm='+ encodeURIComponent(parseInt(Math.random() * 1000))},
	active: 'image'
}

Offline.on("up", function() {
	Offline.options.checks = {
		image: {url: 'http://hci.it.itba.edu.ar/v1/images/BA.png?dumm='+ encodeURIComponent(parseInt(Math.random() * 1000))},
		active: 'image'
	}
});
