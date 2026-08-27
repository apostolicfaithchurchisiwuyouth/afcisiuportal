/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   GLOBAL LOADER
   ============================================================ */

(function () {

    "use strict";


    const root =
        document.getElementById(
            "loader-root"
        );


    function show(
        message = "Loading..."
    ) {

        root.innerHTML = `

            <div
                class="loader-backdrop"
            >

                <div
                    class="loader-card"
                >

                    <div
                        class="loader-spinner"
                    ></div>


                    <span
                        class="
                            text-sm
                            font-medium
                            text-slate-700
                        "
                    >

                        ${escapeHTML(message)}

                    </span>

                </div>

            </div>

        `;


        document.body.style.overflow =
            "hidden";

    }


    function hide() {

        root.innerHTML = "";

        document.body.style.overflow = "";

    }


    window.Loader = {

        show,

        hide

    };


})();
