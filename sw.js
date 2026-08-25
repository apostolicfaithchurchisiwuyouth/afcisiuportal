/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL
 * SERVICE WORKER
 * STEP 10A
 * ============================================================
 */

const CACHE_NAME =
    "afc-isiu-youth-v2";


const APP_FILES = [

    "./",

    "./index.html",

    "./manifest.json",

    "./css/variables.css",
    "./css/base.css",
    "./css/layout.css",
    "./css/components.css",

    "./js/config.js",
    "./js/api.js",
    "./js/auth.js",
    "./js/app.js"

];


self.addEventListener(
    "install",
    function (event) {

        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(function (cache) {

                    return cache.addAll(
                        APP_FILES
                    );

                })

        );

        self.skipWaiting();

    }
);


self.addEventListener(
    "activate",
    function (event) {

        event.waitUntil(

            caches
                .keys()
                .then(function (cacheNames) {

                    return Promise.all(

                        cacheNames
                            .filter(function (name) {

                                return (
                                    name !==
                                    CACHE_NAME
                                );

                            })
                            .map(function (name) {

                                return caches.delete(
                                    name
                                );

                            })

                    );

                })

        );

        self.clients.claim();

    }
);


self.addEventListener(
    "fetch",
    function (event) {

        event.respondWith(

            fetch(event.request)
                .catch(function () {

                    return caches.match(
                        event.request
                    );

                })

        );

    }
);
