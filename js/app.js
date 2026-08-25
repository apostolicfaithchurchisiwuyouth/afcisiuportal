/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL
 * APP FOUNDATION
 * ============================================================
 */


document.addEventListener("DOMContentLoaded", function () {

    initializeMobileMenu();

    initializeNavigation();

    loadUserInformation();

    /*
     * Lucide icons are initialized after the page
     * has loaded.
     */
    initializeIcons();

});


/**
 * ------------------------------------------------------------
 * INITIALIZE LUCIDE ICONS
 * ------------------------------------------------------------
 */

function initializeIcons() {

    if (
        typeof lucide !== "undefined" &&
        typeof lucide.createIcons === "function"
    ) {

        lucide.createIcons();

    }

}


/**
 * ------------------------------------------------------------
 * MOBILE MENU
 * ------------------------------------------------------------
 */

function initializeMobileMenu() {

    const menuButton =
        document.getElementById(
            "mobileMenuButton"
        );

    const sidebar =
        document.getElementById(
            "sidebar"
        );

    const overlay =
        document.getElementById(
            "mobileOverlay"
        );


    if (
        !menuButton ||
        !sidebar ||
        !overlay
    ) {
        return;
    }


    menuButton.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle("open");

            overlay.classList.toggle("active");

        }
    );


    overlay.addEventListener(
        "click",
        function () {

            sidebar.classList.remove("open");

            overlay.classList.remove("active");

        }
    );


    document
        .querySelectorAll(".sidebar .nav-item")
        .forEach(function (item) {

            item.addEventListener(
                "click",
                function () {

                    sidebar.classList.remove("open");

                    overlay.classList.remove("active");

                }
            );

        });

}


/**
 * ------------------------------------------------------------
 * NAVIGATION
 * ------------------------------------------------------------
 */

function initializeNavigation() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    document
        .querySelectorAll(
            ".sidebar .nav-item, .bottom-nav-item"
        )
        .forEach(function (item) {

            const href =
                item.getAttribute("href");

            if (!href) {
                return;
            }

            const itemPage =
                href
                    .split("/")
                    .pop()
                    .toLowerCase();


            if (
                itemPage === currentPage ||
                (
                    currentPage === "" &&
                    itemPage === "index.html"
                )
            ) {

                item.classList.add("active");

            } else {

                item.classList.remove("active");

            }

        });

}


/**
 * ------------------------------------------------------------
 * USER INFORMATION
 * ------------------------------------------------------------
 */

function loadUserInformation() {

    let user = null;


    try {

        const storedUser =
            localStorage.getItem(
                "afc_current_user"
            );


        if (storedUser) {

            user =
                JSON.parse(
                    storedUser
                );

        }

    } catch (error) {

        console.warn(
            "Unable to read stored user.",
            error
        );

    }


    if (!user) {
        return;
    }


    const name =
        user.name ||
        user.full_name ||
        user.first_name ||
        "Friend";


    const welcomeName =
        document.getElementById(
            "welcomeUserName"
        );

    if (welcomeName) {

        welcomeName.textContent =
            name;

    }


    const sidebarName =
        document.getElementById(
            "sidebarUserName"
        );

    if (sidebarName) {

        sidebarName.textContent =
            name;

    }

}


/**
 * ------------------------------------------------------------
 * REFRESH ICONS
 * ------------------------------------------------------------
 *
 * Useful later when dynamic HTML is inserted.
 * ------------------------------------------------------------
 */

function refreshIcons() {

    if (
        typeof lucide !== "undefined" &&
        typeof lucide.createIcons === "function"
    ) {

        lucide.createIcons();

    }

}
