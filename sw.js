```javascript
const CACHE_NAME = "the-crack-v3";

const FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json"
];


/* インストール */

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches.open(CACHE_NAME)
                .then(
                    cache =>
                        cache.addAll(FILES)
                )

        );

        self.skipWaiting();
    }
);


/* 有効化 */

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches.keys()
                .then(
                    keys => {

                        return Promise.all(
                            keys
                                .filter(
                                    key =>
                                        key !== CACHE_NAME
                                )
                                .map(
                                    key =>
                                        caches.delete(key)
                                )
                        );

                    }
                )

        );

        self.clients.claim();
    }
);


/* オフライン */

self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            caches.match(
                event.request
            )
            .then(
                cached => {

                    if (cached) {
                        return cached;
                    }

                    return fetch(
                        event.request
                    );

                }
            )

        );
    }
);
```
