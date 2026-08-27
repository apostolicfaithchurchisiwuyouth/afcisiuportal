/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   TOAST NOTIFICATIONS
   ============================================================ */

(function () {

    "use strict";


    const root =
        document.getElementById(
            "toast-root"
        );


    function show(
        message,
        type = "info",
        duration = 3500
    ) {

        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            "portal-toast";


        toast.innerHTML = `

            <div
                class="
                    flex
                    items-start
                    gap-3
                "
            >

                <div class="flex-1">

                    <p
                        class="
                            text-sm
                            font-medium
                            text-slate-900
                        "
                    >

                        ${escapeHTML(message)}

                    </p>

                </div>


                <button
                    type="button"
                    class="
                        text-slate-400
                        hover:text-slate-700
                    "
                    aria-label="Close"
                >

                    ✕

                </button>

            </div>

        `;


        const closeButton =
            toast.querySelector(
                "button"
            );


        closeButton.addEventListener(
            "click",
            function () {

                toast.remove();

            }
        );


        root.appendChild(
            toast
        );


        setTimeout(
            function () {

                if (
                    toast.parentNode
                ) {

                    toast.remove();

                }

            },
            duration
        );

    }


    window.Toast = {

        show,

        success(message) {

            show(
                message,
                "success"
            );

        },

        error(message) {

            show(
                message,
                "error"
            );

        },

        info(message) {

            show(
                message,
                "info"
            );

        }

    };


})();
