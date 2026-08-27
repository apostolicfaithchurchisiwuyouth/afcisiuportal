/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   GLOBAL HELPERS
   ============================================================ */

(function () {

    "use strict";


    /* ========================================================
       SELECTOR
       ======================================================== */

    window.$ = function (selector) {

        return document.querySelector(
            selector
        );

    };


    window.$$ = function (selector) {

        return Array.from(
            document.querySelectorAll(
                selector
            )
        );

    };


    /* ========================================================
       HTML ESCAPE
       ======================================================== */

    window.escapeHTML = function (value) {

        const div =
            document.createElement("div");

        div.textContent =
            value == null
                ? ""
                : String(value);

        return div.innerHTML;

    };


    /* ========================================================
       DEBOUNCE
       ======================================================== */

    window.debounce = function (
        callback,
        delay = 300
    ) {

        let timer;

        return function () {

            const context = this;

            const args = arguments;

            clearTimeout(timer);

            timer =
                setTimeout(
                    function () {

                        callback.apply(
                            context,
                            args
                        );

                    },
                    delay
                );

        };

    };


    /* ========================================================
       FORMAT DATE
       ======================================================== */

    window.formatDate = function (
        value
    ) {

        if (!value) {

            return "";

        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return String(value);

        }


        return new Intl.DateTimeFormat(
            "en-NG",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        ).format(date);

    };


    /* ========================================================
       INITIALS
       ======================================================== */

    window.getInitials = function (
        name
    ) {

        if (!name) {

            return "?";

        }


        return String(name)
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(
                word =>
                    word
                        .charAt(0)
                        .toUpperCase()
            )
            .join("");

    };


    /* ========================================================
       SAFE JSON
       ======================================================== */

    window.safeJSON = function (
        value,
        fallback = null
    ) {

        try {

            return JSON.parse(value);

        } catch (error) {

            return fallback;

        }

    };


    /* ========================================================
       DELAY
       ======================================================== */

    window.delay = function (
        milliseconds
    ) {

        return new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    milliseconds
                )
        );

    };


})();
