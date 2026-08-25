/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL
 * APPLICATION SHELL
 * STEP 10A
 * ============================================================
 */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeNavigation();

        initializeProfileButtons();

        initializeThemeButton();

        initializeServiceWorker();

        initializeDashboard();

    }
);


/* ============================================================
   NAVIGATION
============================================================ */

function initializeNavigation() {

    const menuButton =
        document.getElementById(
            "menuButton"
        );

    const sidebar =
        document.getElementById(
            "sidebar"
        );

    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    if (!menuButton || !sidebar) {
        return;
    }


    menuButton.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "open"
            );

            if (overlay) {

                overlay.classList.toggle(
                    "active"
                );

            }

            document.body.classList.toggle(
                "no-scroll"
            );

        }
    );


    if (overlay) {

        overlay.addEventListener(
            "click",
            function () {

                sidebar.classList.remove(
                    "open"
                );

                overlay.classList.remove(
                    "active"
                );

                document.body.classList.remove(
                    "no-scroll"
                );

            }
        );

    }


    document
        .querySelectorAll(".nav-item")
        .forEach(function (item) {

            item.addEventListener(
                "click",
                function () {

                    sidebar.classList.remove(
                        "open"
                    );

                    if (overlay) {

                        overlay.classList.remove(
                            "active"
                        );

                    }

                    document.body.classList.remove(
                        "no-scroll"
                    );

                }
            );

        });

}


/* ============================================================
   PROFILE BUTTONS
============================================================ */

function initializeProfileButtons() {

    const profileButton =
        document.getElementById(
            "profileButton"
        );

    if (profileButton) {

        profileButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "pages/profile.html";

            }
        );

    }


    const notificationButton =
        document.getElementById(
            "notificationButton"
        );

    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "pages/notifications.html";

            }
        );

    }

}


/* ============================================================
   THEME
============================================================ */

function initializeThemeButton() {

    const themeButton =
        document.getElementById(
            "themeButton"
        );

    if (!themeButton) {
        return;
    }


    themeButton.addEventListener(
        "click",
        function () {

            const current =
                document.documentElement
                    .getAttribute("data-theme");


            if (current === "dark") {

                document.documentElement
                    .removeAttribute(
                        "data-theme"
                    );

                localStorage.setItem(
                    "afc_theme",
                    "light"
                );

            } else {

                document.documentElement
                    .setAttribute(
                        "data-theme",
                        "dark"
                    );

                localStorage.setItem(
                    "afc_theme",
                    "dark"
                );

            }

        }
    );

}


/* ============================================================
   SERVICE WORKER
============================================================ */

function initializeServiceWorker() {

    if (
        "serviceWorker" in navigator
    ) {

        window.addEventListener(
            "load",
            function () {

                navigator.serviceWorker
                    .register("sw.js")
                    .then(function (registration) {

                        console.log(
                            "Service Worker registered:",
                            registration.scope
                        );

                    })
                    .catch(function (error) {

                        console.warn(
                            "Service Worker registration failed:",
                            error
                        );

                    });

            }
        );

    }

}


/* ============================================================
   DASHBOARD FOUNDATION
============================================================ */

function initializeDashboard() {

    const session =
        AUTH.getSession();


    /*
     * Until Step 10B/10C,
     * we use placeholder information.
     */

    const userName =
        session &&
        session.user &&
        session.user.first_name
            ? session.user.first_name
            : "";


    const welcomeName =
        document.getElementById(
            "welcomeName"
        );

    if (
        welcomeName &&
        userName
    ) {

        welcomeName.textContent =
            ", " + userName;

    }


    const profileInitial =
        document.getElementById(
            "profileInitial"
        );

    const sidebarAvatar =
        document.getElementById(
            "sidebarAvatar"
        );


    if (userName) {

        const initial =
            userName
                .charAt(0)
                .toUpperCase();


        if (profileInitial) {
            profileInitial.textContent =
                initial;
        }


        if (sidebarAvatar) {
            sidebarAvatar.textContent =
                initial;
        }

    }

}
