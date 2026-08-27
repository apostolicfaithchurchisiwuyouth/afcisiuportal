/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   PHASE 4A.1 — HOME PAGE CONTROLLER

   PURPOSE:
   ------------------------------------------------------------
   Controls the existing index.html home page.

   This version is aligned with the actual IDs and structure
   currently present in index.html.

   IMPORTANT:
   ------------------------------------------------------------
   This file does NOT invent a new lesson structure.

   The lesson preview on the home page is populated through
   the existing lessons module/API integration.

   ============================================================ */

(function () {

    "use strict";


    /* ========================================================
       1. DOM HELPERS
    ======================================================== */

    function $(id) {

        return document.getElementById(id);

    }


    function show(element) {

        if (!element) {
            return;
        }

        element.hidden = false;

    }


    function hide(element) {

        if (!element) {
            return;
        }

        element.hidden = true;

    }


    /* ========================================================
       2. ICONS
    ======================================================== */

    function refreshHomeIcons() {

        if (
            window.lucide &&
            typeof window.lucide.createIcons === "function"
        ) {

            try {

                window.lucide.createIcons();

            } catch (error) {

                console.warn(
                    "AFC Portal: icon refresh failed.",
                    error
                );

            }

        }

    }


    /* ========================================================
       3. AUTHENTICATION
    ======================================================== */

    function getUser() {

        if (
            window.AUTH &&
            typeof window.AUTH.getUser === "function"
        ) {

            try {

                return window.AUTH.getUser();

            } catch (error) {

                console.warn(
                    "AFC Portal: unable to get authenticated user.",
                    error
                );

            }

        }

        return null;

    }


    function isLoggedIn() {

        if (
            window.AUTH &&
            typeof window.AUTH.isAuthenticated === "function"
        ) {

            try {

                return !!window.AUTH.isAuthenticated();

            } catch (error) {

                console.warn(
                    "AFC Portal: authentication check failed.",
                    error
                );

            }

        }

        return false;

    }


    /* ========================================================
       4. USER NAME
    ======================================================== */

    function getFirstName(user) {

        if (!user) {

            return "Friend";

        }


        const firstName =
            String(
                user.first_name ||
                user.firstName ||
                ""
            ).trim();


        if (firstName) {

            return firstName
                .split(/\s+/)[0];

        }


        const fullName =
            String(
                user.name ||
                user.full_name ||
                user.fullName ||
                user.displayName ||
                ""
            ).trim();


        if (fullName) {

            return fullName
                .split(/\s+/)[0];

        }


        return "Friend";

    }


    /* ========================================================
       5. USER AVATAR
    ======================================================== */

    function getAvatarUrl(user) {

        if (!user) {

            return "";

        }


        if (
            window.AUTH &&
            typeof window.AUTH.getAvatar === "function"
        ) {

            try {

                const avatar =
                    window.AUTH.getAvatar();


                if (
                    avatar &&
                    typeof avatar === "string"
                ) {

                    return avatar.trim();

                }

            } catch (error) {

                console.warn(
                    "AFC Portal: unable to get avatar.",
                    error
                );

            }

        }


        const possibleAvatar =

            user.avatar ||
            user.avatar_url ||
            user.avatarUrl ||
            user.photo ||
            user.photo_url ||
            user.photoUrl ||
            user.profile_picture ||
            "";


        return String(
            possibleAvatar
        ).trim();

    }


    /* ========================================================
       6. CREATE AVATAR CONTENT
    ======================================================== */

    function getUserInitial(user) {

        const firstName =
            getFirstName(user);


        return (
            firstName
                .charAt(0)
                .toUpperCase() ||
            "A"
        );

    }


    function createAvatarImage(
        container,
        avatarUrl,
        initial,
        className,
        altText
    ) {

        if (!container) {

            return;

        }


        container.innerHTML = "";


        /*
         * No image available.
         */

        if (!avatarUrl) {

            container.textContent =
                initial;

            return;

        }


        const image =
            document.createElement("img");


        image.className =
            className;


        image.alt =
            altText;


        image.src =
            avatarUrl;


        image.onerror =
            function () {

                container.innerHTML = "";

                container.textContent =
                    initial;

            };


        container.appendChild(
            image
        );

    }


    /* ========================================================
       7. HEADER ACCOUNT AVATAR
    ======================================================== */

    function renderHeaderAvatar(user) {

        /*
         * IMPORTANT:
         * This matches index.html:
         *
         * id="headerAvatarContent"
         */

        const container =
            $("headerAvatarContent");


        if (!container) {

            return;

        }


        const firstName =
            getFirstName(user);


        const initial =
            getUserInitial(user);


        const avatarUrl =
            getAvatarUrl(user);


        createAvatarImage(

            container,

            avatarUrl,

            initial,

            "header-avatar-image",

            firstName +
            "'s profile picture"

        );

    }


    function renderGuestHeaderAvatar() {

        /*
         * IMPORTANT:
         * This matches index.html:
         *
         * id="headerAvatarContent"
         */

        const container =
            $("headerAvatarContent");


        if (!container) {

            return;

        }


        container.innerHTML =
            `
            <span data-lucide="user-round"></span>
            `;


        refreshHomeIcons();

    }


    /* ========================================================
       8. SIDEBAR AVATAR
    ======================================================== */

    function renderSidebarAvatar(user) {

        const container =
            $("sidebarAvatar");


        if (!container) {

            return;

        }


        const firstName =
            getFirstName(user);


        const initial =
            getUserInitial(user);


        const avatarUrl =
            getAvatarUrl(user);


        createAvatarImage(

            container,

            avatarUrl,

            initial,

            "sidebar-avatar-image",

            firstName +
            "'s profile picture"

        );

    }


    /* ========================================================
       9. BOTTOM AVATAR
    ======================================================== */

    function renderBottomAvatar(user) {

        const container =
            $("bottomAvatar");


        if (!container) {

            return;

        }


        const firstName =
            getFirstName(user);


        const initial =
            getUserInitial(user);


        const avatarUrl =
            getAvatarUrl(user);


        createAvatarImage(

            container,

            avatarUrl,

            initial,

            "bottom-avatar-image",

            firstName +
            "'s profile picture"

        );

    }


    /* ========================================================
       10. MOBILE MENU
    ======================================================== */

    function openMobileMenu() {

        const sidebar =
            $("sidebar");


        const overlay =
            $("mobileOverlay");


        const button =
            $("mobileMenuButton");


        if (!sidebar) {

            return;

        }


        sidebar.classList.add(
            "open"
        );


        if (overlay) {

            overlay.classList.add(
                "active"
            );

        }


        document.body.classList.add(
            "mobile-menu-open"
        );


        if (button) {

            button.setAttribute(
                "aria-expanded",
                "true"
            );


            button.setAttribute(
                "aria-label",
                "Close navigation menu"
            );

        }

    }


    function closeMobileMenu() {

        const sidebar =
            $("sidebar");


        const overlay =
            $("mobileOverlay");


        const button =
            $("mobileMenuButton");


        if (sidebar) {

            sidebar.classList.remove(
                "open"
            );

        }


        if (overlay) {

            overlay.classList.remove(
                "active"
            );

        }


        document.body.classList.remove(
            "mobile-menu-open"
        );


        if (button) {

            button.setAttribute(
                "aria-expanded",
                "false"
            );


            button.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        }

    }


    function toggleMobileMenu() {

        const sidebar =
            $("sidebar");


        if (!sidebar) {

            return;

        }


        if (
            sidebar.classList.contains(
                "open"
            )
        ) {

            closeMobileMenu();

        } else {

            openMobileMenu();

        }

    }


    /* ========================================================
       11. NAVIGATION
    ======================================================== */

    function setupNavigation() {

        const menuButton =
            $("mobileMenuButton");


        const overlay =
            $("mobileOverlay");


        const sidebar =
            $("sidebar");


        /* ----------------------------------------------------
           HAMBURGER
        ---------------------------------------------------- */

        if (menuButton) {

            menuButton.addEventListener(

                "click",

                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    toggleMobileMenu();

                }

            );


            menuButton.setAttribute(

                "aria-expanded",

                "false"

            );

        }


        /* ----------------------------------------------------
           OVERLAY
        ---------------------------------------------------- */

        if (overlay) {

            overlay.addEventListener(

                "click",

                function () {

                    closeMobileMenu();

                }

            );

        }


        /* ----------------------------------------------------
           SIDEBAR LINKS
        ---------------------------------------------------- */

        if (sidebar) {

            sidebar.addEventListener(

                "click",

                function (event) {

                    const link =
                        event.target.closest(
                            "a"
                        );


                    if (!link) {

                        return;

                    }


                    if (
                        window.innerWidth <= 900
                    ) {

                        closeMobileMenu();

                    }

                }

            );

        }


        /* ----------------------------------------------------
           ESCAPE KEY
        ---------------------------------------------------- */

        document.addEventListener(

            "keydown",

            function (event) {

                if (
                    event.key === "Escape"
                ) {

                    closeMobileMenu();

                }

            }

        );


        /* ----------------------------------------------------
           WINDOW RESIZE
        ---------------------------------------------------- */

        window.addEventListener(

            "resize",

            function () {

                if (
                    window.innerWidth > 900
                ) {

                    closeMobileMenu();

                }

            }

        );

    }


    /* ========================================================
       12. HEADER ACCOUNT
    ======================================================== */

    function updateHeaderAccount(
        loggedIn,
        user
    ) {

        const accountButton =
            $("headerAccountButton");


        if (!accountButton) {

            return;

        }


        if (loggedIn) {

            accountButton.href =
                "pages/profile.html";


            accountButton.setAttribute(

                "aria-label",

                "Open your profile"

            );


            accountButton.classList.remove(
                "guest-account-avatar"
            );


            accountButton.classList.add(
                "member-account-avatar"
            );


            renderHeaderAvatar(
                user
            );

        } else {

            accountButton.href =
                "login.html";


            accountButton.setAttribute(

                "aria-label",

                "Login"

            );


            accountButton.classList.remove(
                "member-account-avatar"
            );


            accountButton.classList.add(
                "guest-account-avatar"
            );


            renderGuestHeaderAvatar();

        }

    }


    /* ========================================================
       13. NOTIFICATIONS
    ======================================================== */

    function updateNotificationHeader(
        loggedIn
    ) {

        /*
         * IMPORTANT:
         * Matches index.html:
         *
         * id="headerNotificationButton"
         */

        const notificationButton =
            $("headerNotificationButton");


        if (!notificationButton) {

            return;

        }


        notificationButton.hidden =
            !loggedIn;

    }


    /* ========================================================
       14. MEMBER-ONLY ELEMENTS
    ======================================================== */

    function updateMemberOnlyElements(
        loggedIn
    ) {

        document
            .querySelectorAll(
                ".member-only"
            )
            .forEach(
                function (element) {

                    element.hidden =
                        !loggedIn;

                }
            );

    }


    /* ========================================================
       15. BOTTOM PROFILE
    ======================================================== */

    function updateBottomProfile(
        loggedIn,
        user
    ) {

        const guestProfile =
            $("guestBottomProfile");


        const memberProfile =
            $("memberBottomProfile");


        if (loggedIn) {

            if (guestProfile) {

                guestProfile.hidden =
                    true;

            }


            if (memberProfile) {

                memberProfile.hidden =
                    false;

            }


            renderBottomAvatar(
                user
            );

        } else {

            if (memberProfile) {

                memberProfile.hidden =
                    true;

            }


            if (guestProfile) {

                guestProfile.hidden =
                    false;

            }

        }

    }


    /* ========================================================
       16. PERSONALIZED HOME
    ======================================================== */

    function updatePersonalizedHome() {

        const loggedIn =
            isLoggedIn();


        const user =
            getUser();


        /*
         * A member is active only when authentication
         * and user information are both available.
         */

        const memberActive =
            loggedIn &&
            !!user;


        const guestHero =
            $("guestHero");


        const memberHero =
            $("memberHero");


        const guestInformation =
            $("guestInformation");


        const memberDashboard =
            $("memberDashboardContent");


        const welcomeUserName =
            $("welcomeUserName");


        const sidebarGuest =
            $("sidebarGuest");


        const sidebarMember =
            $("sidebarMember");


        const sidebarUserName =
            $("sidebarUserName");


        /* ----------------------------------------------------
           MEMBER STATE
        ---------------------------------------------------- */

        if (memberActive) {

            const firstName =
                getFirstName(
                    user
                );


            hide(
                guestHero
            );


            show(
                memberHero
            );


            hide(
                guestInformation
            );


            show(
                memberDashboard
            );


            hide(
                sidebarGuest
            );


            show(
                sidebarMember
            );


            if (welcomeUserName) {

                welcomeUserName.textContent =
                    firstName;

            }


            if (sidebarUserName) {

                sidebarUserName.textContent =
                    firstName;

            }


            renderSidebarAvatar(
                user
            );

        }


        /* ----------------------------------------------------
           GUEST STATE
        ---------------------------------------------------- */

        else {

            show(
                guestHero
            );


            hide(
                memberHero
            );


            show(
                guestInformation
            );


            hide(
                memberDashboard
            );


            show(
                sidebarGuest
            );


            hide(
                sidebarMember
            );


            if (welcomeUserName) {

                welcomeUserName.textContent =
                    "Friend";

            }

        }


        /*
         * Shared UI updates.
         */

        updateMemberOnlyElements(
            memberActive
        );


        updateHeaderAccount(
            memberActive,
            user
        );


        updateNotificationHeader(
            memberActive
        );


        updateBottomProfile(
            memberActive,
            user
        );


        refreshHomeIcons();

    }


    /* ========================================================
       17. LOGOUT
    ======================================================== */

    async function performLogout() {


        /*
         * Prevent multiple simultaneous requests.
         */

        if (
            performLogout.isRunning
        ) {

            return;

        }


        performLogout.isRunning =
            true;


        closeMobileMenu();


        const logoutButtons =
            document.querySelectorAll(

                "#sidebarLogoutButton, " +
                "#heroLogoutButton, " +
                "[data-logout]"

            );


        const originalContents =
            [];


        logoutButtons.forEach(

            function (button) {

                originalContents.push({

                    button:
                        button,

                    html:
                        button.innerHTML

                });


                button.disabled =
                    true;


                button.setAttribute(

                    "aria-busy",

                    "true"

                );


                button.classList.add(
                    "is-loading"
                );


                button.innerHTML =
                    `
                    <span
                        class="button-spinner"
                        aria-hidden="true">
                    </span>

                    <span>
                        Logging out...
                    </span>
                    `;

            }

        );


        /*
         * Allow loading state to render.
         */

        await new Promise(

            function (resolve) {

                requestAnimationFrame(

                    function () {

                        requestAnimationFrame(
                            resolve
                        );

                    }

                );

            }

        );


        try {


            /* -----------------------------------------------
               PRIMARY LOGOUT
            ----------------------------------------------- */

            if (

                window.AUTH &&

                typeof window.AUTH.logout ===
                    "function"

            ) {

                await window.AUTH.logout();

            }


            /* -----------------------------------------------
               FALLBACK LOGOUT
            ----------------------------------------------- */

            else if (

                window.AUTH &&

                typeof window.AUTH.clear ===
                    "function"

            ) {

                await window.AUTH.clear();

            }


            /*
             * Update UI immediately.
             */

            updatePersonalizedHome();


            /*
             * Small visual delay.
             */

            await new Promise(

                function (resolve) {

                    setTimeout(

                        resolve,

                        350

                    );

                }

            );


            /*
             * Return to home.
             */

            window.location.replace(
                "index.html"
            );


        } catch (error) {


            console.error(

                "AFC Portal: logout failed.",

                error

            );


            /*
             * Restore buttons.
             */

            originalContents.forEach(

                function (item) {

                    item.button.innerHTML =
                        item.html;


                    item.button.disabled =
                        false;


                    item.button.removeAttribute(
                        "aria-busy"
                    );


                    item.button.classList.remove(
                        "is-loading"
                    );

                }

            );


            performLogout.isRunning =
                false;


            alert(
                "Logout could not be completed. Please try again."
            );

        }

    }


    performLogout.isRunning =
        false;


    /* ========================================================
       18. LOGOUT BUTTONS
    ======================================================== */

    function setupLogoutButtons() {

        const sidebarLogout =
            $("sidebarLogoutButton");


        const heroLogout =
            $("heroLogoutButton");


        if (sidebarLogout) {

            sidebarLogout.addEventListener(

                "click",

                function (event) {

                    event.preventDefault();

                    performLogout();

                }

            );

        }


        if (heroLogout) {

            heroLogout.addEventListener(

                "click",

                function (event) {

                    event.preventDefault();

                    performLogout();

                }

            );

        }

    }


    /* ========================================================
       19. AUTH EVENTS
    ======================================================== */

    function setupAuthListeners() {

        const events = [

            "authchange",

            "auth-change",

            "auth-state-changed",

            "authStateChanged",

            "authenticationchange",

            "authenticationChanged",

            "login",

            "logout",

            "user-login",

            "user-logout"

        ];


        events.forEach(

            function (eventName) {

                window.addEventListener(

                    eventName,

                    function () {

                        setTimeout(

                            updatePersonalizedHome,

                            50

                        );

                    }

                );

            }

        );


        /*
         * Synchronize authentication changes
         * across browser tabs.
         */

        window.addEventListener(

            "storage",

            function (event) {

                const watchedKeys = [

                    "afc_isiu_auth_user",

                    "afc_isiu_auth_session"

                ];


                if (

                    watchedKeys.includes(
                        event.key
                    )

                ) {

                    updatePersonalizedHome();

                }

            }

        );

    }


    /* ========================================================
       20. INITIALIZE
    ======================================================== */

    function initializeHome() {

        setupNavigation();

        setupLogoutButtons();

        setupAuthListeners();

        updatePersonalizedHome();

        refreshHomeIcons();

    }


    /* ========================================================
       21. DOM READY
    ======================================================== */

    if (

        document.readyState ===
            "loading"

    ) {

        document.addEventListener(

            "DOMContentLoaded",

            initializeHome

        );

    } else {

        initializeHome();

    }


    /* ========================================================
       22. PUBLIC METHODS
    ======================================================== */

    window.openMobileMenu =
        openMobileMenu;


    window.closeMobileMenu =
        closeMobileMenu;


    window.toggleMobileMenu =
        toggleMobileMenu;


    window.updatePersonalizedHome =
        updatePersonalizedHome;


    window.performPortalLogout =
        performLogout;


})();
