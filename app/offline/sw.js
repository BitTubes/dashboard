// service-worker for offline situations
(function() {
	'use strict';

	self.addEventListener('install', event => {
		event.waitUntil(
			caches.open('static-v1')
			.then(cache => cache.addAll([
				'styles/app.css',
				'img/Icon_Final_48.png',
				'img/Logo_Bittubes_245x40.png'
			]))
		);
	});

	self.addEventListener('fetch', event => {
		event.respondWith(
			fetch(event.request).then(response => {
				if(response.status === 404) {
					return fetch('img/Logo_Bittubes_245x40.png');
				}

				return response;
			})
		);
	});

})();
