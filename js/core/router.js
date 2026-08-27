/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   FRONTEND ROUTER
   ============================================================ */

(function () {

    "use strict";


    const routes = {};


    /* ========================================================
       REGISTER ROUTE
       ======================================================== */

    window.registerRoute = function (
        name,
        handler
    ) {

        routes[name] =
            handler;

    };


    /* ========================================================
       NAVIGATE
       ======================================================== */

    window.navigate = function (
        page
    ) {

        if (
            !routes[page]
        ) {

            console.warn(
                "Route not found:",
                page
            );

            return;

        }


        AppState.currentPage =
            page;


        routes[page]();

    };


    /* ========================================================
       CURRENT PAGE
       ======================================================== */

    window.getCurrentPage = function () {

        return AppState.currentPage;

    };


})();
