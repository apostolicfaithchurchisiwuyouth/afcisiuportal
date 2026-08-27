/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   FILE: modal.js
   PURPOSE: Global modal system
   ============================================================ */

(function () {

    "use strict";


    window.openModal =
        function (content) {

            const root =
                document.getElementById(
                    "modal-root"
                );


            if (!root) {

                return;

            }


            root.innerHTML = `

                <div
                    class="modal-backdrop"
                    data-modal-backdrop
                >

                    <div
                        class="modal-panel"
                        role="dialog"
                        aria-modal="true"
                    >

                        ${content}

                    </div>

                </div>

            `;


            const backdrop =
                root.querySelector(
                    "[data-modal-backdrop]"
                );


            backdrop.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target === backdrop
                    ) {

                        closeModal();

                    }

                }
            );


            document.body.style.overflow =
                "hidden";

        };


    window.closeModal =
        function () {

            const root =
                document.getElementById(
                    "modal-root"
                );


            if (root) {

                root.innerHTML = "";

            }


            document.body.style.overflow =
                "";

        };


})();
