/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL V2
 * APP FOUNDATION
 * ============================================================
 *
 * RESPONSIBILITIES:
 * ------------------------------------------------------------
 * 1. Initialize global icons
 * 2. Highlight current navigation item
 * 3. Provide global icon refresh helper
 *
 * IMPORTANT:
 * ------------------------------------------------------------
 * Mobile menu is NOT handled here.
 *
 * The homepage owns the mobile menu through home.js.
 * This prevents duplicate hamburger event listeners.
 * ============================================================
 */

"use strict";


/* ============================================================
   GLOBAL STARTUP
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeNavigation();

        initializeIcons();

    }
);


/* ============================================================
   LUCIDE ICONS
============================================================ */

function initializeIcons() {

    if (
        typeof lucide !== "undefined" &&
        typeof lucide.createIcons === "function"
    ) {

        try {

            lucide.createIcons();

        } catch (error) {

            console.warn(
                "AFC Portal: unable to initialize icons.",
                error
            );

        }

    }

}


/* ============================================================
   REFRESH ICONS
============================================================ */

function refreshIcons() {

    if (
        typeof lucide !== "undefined" &&
        typeof lucide.createIcons === "function"
    ) {

        try {

            lucide.createIcons();

        } catch (error) {

            console.warn(
                "AFC Portal: unable to refresh icons.",
                error
            );

        }

    }

}


/* ============================================================
   NAVIGATION
============================================================ */

function initializeNavigation() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    const navigationItems =
        document.querySelectorAll(
            ".sidebar .nav-item, .bottom-nav-item"
        );


    navigationItems.forEach(
        function (item) {

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


            const isHome =
                currentPage === "" ||
                currentPage === "index.html";


            if (
                itemPage === currentPage ||
                (
                    isHome &&
                    itemPage === "index.html"
                )
            ) {

                item.classList.add("active");

            } else {

                item.classList.remove("active");

            }

        }
    );

}


/* ============================================================
   GLOBAL EXPORT
============================================================ */

window.refreshIcons =
    refreshIcons;


/* ============================================================
   STARTUP LOG
============================================================ */

console.log(
    "AFC Isiu Youth Portal — app.js loaded."
);
