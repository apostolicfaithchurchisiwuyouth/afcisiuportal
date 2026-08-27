/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   FILE: ui.js
   PURPOSE: Shared UI helpers
   ============================================================ */

(function () {

    "use strict";


    /* ========================================================
       DOM
    ======================================================== */

    window.$ =
        function (selector) {

            return document.querySelector(
                selector
            );

        };


    window.$$ =
        function (selector) {

            return Array.from(
                document.querySelectorAll(
                    selector
                )
            );

        };


    /* ========================================================
       ESCAPE HTML
    ======================================================== */

    window.escapeHtml =
        function (value) {

            const div =
                document.createElement("div");


            div.textContent =
                value === undefined ||
                value === null
                    ? ""
                    : String(value);


            return div.innerHTML;

        };


    /* ========================================================
       LOADING
    ======================================================== */

    window.setLoading =
        function (loading) {

            setAppState({

                loading:
                    Boolean(loading)

            });

        };


    /* ========================================================
       TOAST
    ======================================================== */

    window.showToast =
        function (
            message,
            type
        ) {

            const root =
                document.getElementById(
                    "toast-root"
                );


            if (!root) {

                return;

            }


            const toast =
                document.createElement("div");


            toast.className =
                "portal-toast";


            toast.innerHTML = `

                <div class="font-semibold text-sm mb-1">

                    ${
                        type === "error"
                            ? "Something went wrong"
                            : type === "success"
                                ? "Success"
                                : "AFC Isiwu Youth Portal"
                    }

                </div>

                <div class="text-sm text-white/65">

                    ${escapeHtml(message)}

                </div>

            `;


            root.appendChild(toast);


            setTimeout(function () {

                toast.remove();

            }, 3500);

        };


    /* ========================================================
       PAGE TITLE
    ======================================================== */

    window.setDocumentTitle =
        function (title) {

            document.title =
                title
                    ? title +
                      " • AFC Isiwu Youth Portal"
                    : "AFC Isiwu Youth Portal";

        };


})();
