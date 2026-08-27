/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   MODAL SYSTEM
   ============================================================ */

(function () {

    "use strict";


    const root =
        document.getElementById(
            "modal-root"
        );


    /* ========================================================
       CLOSE
       ======================================================== */

    function close() {

        root.innerHTML = "";

        document.body.style.overflow = "";

    }


    /* ========================================================
       OPEN
       ======================================================== */

    function open(options = {}) {

        const {

            title = "",

            content = "",

            size = "md",

            showClose = true,

            closeOnBackdrop = true

        } = options;


        const sizes = {

            sm: "max-w-sm",

            md: "max-w-md",

            lg: "max-w-2xl",

            xl: "max-w-4xl"

        };


        root.innerHTML = `

            <div
                class="modal-backdrop"
                data-modal-backdrop
            >

                <div
                    class="
                        modal-container
                        ${sizes[size] || sizes.md}
                    "
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >

                    <div
                        class="
                            flex
                            items-center
                            justify-between
                            gap-4
                            px-5
                            py-4
                            border-b
                            border-slate-100
                        "
                    >

                        <h2
                            id="modal-title"
                            class="
                                text-lg
                                font-semibold
                                text-slate-900
                            "
                        >

                            ${escapeHTML(title)}

                        </h2>


                        ${
                            showClose
                                ? `
                                    <button
                                        type="button"
                                        data-modal-close
                                        class="
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-full
                                            text-slate-500
                                            hover:bg-slate-100
                                            hover:text-slate-900
                                            transition
                                        "
                                        aria-label="Close"
                                    >
                                        ✕
                                    </button>
                                  `
                                : ""
                        }

                    </div>


                    <div
                        class="modal-content"
                    >

                        ${content}

                    </div>

                </div>

            </div>

        `;


        document.body.style.overflow =
            "hidden";


        const closeButton =
            root.querySelector(
                "[data-modal-close]"
            );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                close
            );

        }


        const backdrop =
            root.querySelector(
                "[data-modal-backdrop]"
            );


        if (
            closeOnBackdrop &&
            backdrop
        ) {

            backdrop.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        backdrop
                    ) {

                        close();

                    }

                }
            );

        }

    }


    /* ========================================================
       CONFIRM
       ======================================================== */

    function confirm(options = {}) {

        const {

            title =
                "Are you sure?",

            message =
                "Please confirm this action.",

            confirmText =
                "Confirm",

            cancelText =
                "Cancel",

            onConfirm =
                null

        } = options;


        open({

            title,

            content: `

                <div class="p-5">

                    <p
                        class="
                            text-sm
                            leading-6
                            text-slate-600
                        "
                    >

                        ${escapeHTML(message)}

                    </p>


                    <div
                        class="
                            mt-6
                            flex
                            justify-end
                            gap-3
                        "
                    >

                        <button
                            type="button"
                            data-modal-cancel
                            class="
                                rounded-xl
                                border
                                border-slate-200
                                px-4
                                py-2.5
                                text-sm
                                font-medium
                                text-slate-700
                                hover:bg-slate-50
                                transition
                            "
                        >

                            ${escapeHTML(cancelText)}

                        </button>


                        <button
                            type="button"
                            data-modal-confirm
                            class="
                                rounded-xl
                                bg-afc-600
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                hover:bg-afc-700
                                transition
                            "
                        >

                            ${escapeHTML(confirmText)}

                        </button>

                    </div>

                </div>

            `

        });


        const cancel =
            root.querySelector(
                "[data-modal-cancel]"
            );


        const confirmButton =
            root.querySelector(
                "[data-modal-confirm]"
            );


        if (cancel) {

            cancel.addEventListener(
                "click",
                close
            );

        }


        if (confirmButton) {

            confirmButton.addEventListener(
                "click",
                async function () {

                    close();

                    if (
                        typeof onConfirm ===
                        "function"
                    ) {

                        await onConfirm();

                    }

                }
            );

        }

    }


    /* ========================================================
       ALERT
       ======================================================== */

    function alertModal(options = {}) {

        const {

            title =
                "Notice",

            message =
                ""

        } = options;


        open({

            title,

            content: `

                <div class="p-5">

                    <p
                        class="
                            text-sm
                            leading-6
                            text-slate-600
                        "
                    >

                        ${escapeHTML(message)}

                    </p>


                    <div
                        class="
                            mt-6
                            flex
                            justify-end
                        "
                    >

                        <button
                            type="button"
                            data-modal-close
                            class="
                                rounded-xl
                                bg-afc-600
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                hover:bg-afc-700
                                transition
                            "
                        >

                            Okay

                        </button>

                    </div>

                </div>

            `

        });

    }


    window.Modal = {

        open,

        close,

        confirm,

        alert:
            alertModal

    };


})();
