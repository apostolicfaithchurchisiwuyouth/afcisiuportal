/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   FILE: app.js
   PURPOSE: Application bootstrap
   ============================================================ */

(function () {

    "use strict";


    /* ========================================================
       START APPLICATION
    ======================================================== */

    async function startApplication() {

        console.log(
            "AFC Isiwu Youth Portal V2 starting..."
        );


        console.log(
            "Application state:",
            AppState
        );


        try {

            await checkApiHealth();

        } catch (error) {

            console.error(
                "API health check failed:",
                error
            );

        }


        renderPage();


        console.log(
            "AFC Isiwu Youth Portal V2 ready."
        );

    }


    /* ========================================================
       API HEALTH
    ======================================================== */

    async function checkApiHealth() {

        if (
            !API_URL_IS_CONFIGURED()
        ) {

            console.warn(
                "API URL has not been configured yet."
            );

            return null;

        }


        const result =
            await apiGet(
                "health"
            );


        console.log(
            "API Health:",
            result
        );


        return result;

    }


    function API_URL_IS_CONFIGURED() {

        return (
            typeof PortalAPI !== "undefined" &&
            typeof apiGet === "function"
        );

    }


    /* ========================================================
       STATE LISTENER
    ======================================================== */

    window.addEventListener(
        "appstatechange",
        function (event) {

            console.log(
                "Application state updated:",
                event.detail
            );

        }
    );


    /* ========================================================
       START
    ======================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            startApplication
        );

    } else {

        startApplication();

    }


})();
