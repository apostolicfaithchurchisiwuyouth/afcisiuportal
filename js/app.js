/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   APPLICATION BOOTSTRAP
   PHASE A
   ============================================================ */

(function () {

    "use strict";


    /* ========================================================
       REGISTER INITIAL HOME ROUTE
       ======================================================== */

    registerRoute(
        "home",
        renderInitialPage
    );


    /* ========================================================
       INITIAL PAGE
       ======================================================== */

    function renderInitialPage() {

        const app =
            document.getElementById(
                "app"
            );


        app.innerHTML = `

            <main
                class="
                    portal-page
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    px-5
                "
            >

                <section
                    class="
                        w-full
                        max-w-md
                        text-center
                    "
                >

                    <div
                        class="
                            mx-auto
                            mb-6
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-2xl
                            bg-afc-950
                            text-2xl
                            font-bold
                            text-white
                            shadow-lg
                        "
                    >

                        AFC

                    </div>


                    <h1
                        class="
                            text-2xl
                            font-bold
                            tracking-tight
                            text-slate-950
                        "
                    >

                        AFC Isiwu Youth Portal

                    </h1>


                    <p
                        class="
                            mt-2
                            text-sm
                            leading-6
                            text-slate-500
                        "
                    >

                        Your new portal foundation is ready.

                    </p>


                    <div
                        class="
                            mt-6
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            text-left
                            shadow-sm
                        "
                    >

                        <p
                            class="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wider
                                text-afc-600
                            "
                        >

                            Phase A

                        </p>


                        <p
                            class="
                                mt-2
                                text-sm
                                leading-6
                                text-slate-600
                            "
                        >

                            Application foundation,
                            API layer, global state,
                            routing, modals, toasts
                            and loading system are
                            initialized.

                        </p>

                    </div>

                </section>

            </main>

        `;

    }


    /* ========================================================
       APPLICATION START
       ======================================================== */

    function boot() {

        console.log(
            "AFC Isiwu Youth Portal V2 starting..."
        );


        console.log(
            "Application state:",
            AppState
        );


        navigate("home");

    }


    /* ========================================================
       DOM READY
       ======================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            boot
        );

    } else {

        boot();

    }


})();
