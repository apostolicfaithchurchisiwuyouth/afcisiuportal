/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL V2
 * GLOBAL LOADER
 * PHASE 4A.1
 * ============================================================
 */

"use strict";


(function () {


    let loaderElement =
        null;


    function createLoader() {

        if (
            document.getElementById(
                "afcGlobalLoader"
            )
        ) {

            loaderElement =
                document.getElementById(
                    "afcGlobalLoader"
                );

            return;

        }


        loaderElement =
            document.createElement(
                "div"
            );


        loaderElement.id =
            "afcGlobalLoader";


        loaderElement.className =
            "afc-global-loader";


        loaderElement.setAttribute(
            "aria-hidden",
            "true"
        );


        loaderElement.innerHTML = `

            <div class="global-loader-inner">

                <div class="global-loader-mark">

                    <span class="loader-ring"></span>

                    <div class="loader-logo">
                        <span data-lucide="church"></span>
                    </div>

                </div>


                <div class="global-loader-copy">

                    <strong>
                        AFC Isiu Youth
                    </strong>

                    <span id="globalLoaderMessage">
                        Preparing your experience...
                    </span>

                </div>


                <div class="global-loader-progress">

                    <span></span>

                </div>

            </div>

        `;


        document.body.appendChild(
            loaderElement
        );


        refreshIcons();

    }


    function refreshIcons() {

        if (
            window.lucide &&
            typeof window.lucide.createIcons ===
                "function"
        ) {

            try {

                window.lucide.createIcons();

            } catch (error) {

                console.warn(
                    "AFC loader icon error:",
                    error
                );

            }

        }

    }


    function show(
        message = "Preparing your experience..."
    ) {

        createLoader();


        const messageElement =
            document.getElementById(
                "globalLoaderMessage"
            );


        if (messageElement) {

            messageElement.textContent =
                message;

        }


        requestAnimationFrame(
            function () {

                loaderElement.classList.add(
                    "is-visible"
                );

            }
        );

    }


    function hide() {

        if (!loaderElement) {

            return;

        }


        loaderElement.classList.remove(
            "is-visible"
        );


        loaderElement.classList.add(
            "is-leaving"
        );


        setTimeout(
            function () {

                if (loaderElement) {

                    loaderElement.remove();

                    loaderElement =
                        null;

                }

            },
            450
        );

    }


    function setMessage(
        message
    ) {

        const element =
            document.getElementById(
                "globalLoaderMessage"
            );


        if (element) {

            element.textContent =
                message;

        }

    }


    function isVisible() {

        return !!(
            loaderElement &&
            loaderElement.classList.contains(
                "is-visible"
            )
        );

    }


    window.AFC_Loader = {

        show:
            show,

        hide:
            hide,

        setMessage:
            setMessage,

        isVisible:
            isVisible

    };


})();
