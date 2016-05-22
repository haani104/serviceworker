console.log('Started', self);

var CACHE_NAME = 'demo-cache';

var urlsToCache = [
	'/',
	'/styles/main.css'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function(event){
	console.log('Activated', event);
});

self.addEventListener('push', function(event){
	console.log('Push message received', event);
});

self.addEventListener('fetch', function(event){
	event.respondWith(
		caches.match(event.request)
			.then(function(response){
				if (response) {
					return response;
				}

				var fetchRequest = event.request.clone();

				return fetch(fetchRequest).then(
					function(response){
						if (!response || response.status !== 200 || response.type !== 'basic') {
							return response;
						}

						var responseTocache = response.clone();

						caches.open(CACHE_NAME)
							.then(function(cache){
								console.log('Cache opened again');
									cache.put(event.request, responseTocache);
							});

						return response;		
					});

				//return fetch(event.request);
			})
	);
});