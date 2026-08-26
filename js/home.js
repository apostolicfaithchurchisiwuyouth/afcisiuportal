/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   HOME PAGE CONTROLLER
   ============================================================ */

(function () {

    "use strict";


    /* ========================================================
       DOM HELPERS
    ======================================================== */

    function $(id) {
        return document.getElementById(id);
    }


    function show(element) {

        if (!element) return;

        element.hidden = false;

    }


    function hide(element) {

        if (!element) return;

        element.hidden = true;

    }


    /* ========================================================
       ICONS
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
       AUTHENTICATION
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
       USER NAME
    ======================================================== */

    function getFirstName(user) {

        if (!user) {
            return "Friend";
        }


        const firstName =
            String(
                user.first_name || ""
            ).trim();


        if (firstName) {
            return firstName.split(/\s+/)[0];
        }


        const fullName =
            String(
                user.name ||
                user.full_name ||
                user.displayName ||
                ""
            ).trim();


        if (fullName) {
            return fullName.split(/\s+/)[0];
        }


        return "Friend";
    }


    /* ========================================================
       AVATAR
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


        return "";
    }


    /* ========================================================
       HEADER AVATAR
    ======================================================== */

    function renderHeaderAvatar(user) {

        const container =
            $("headerAvatarLetter");


        if (!container) {
            return;
        }


        const firstName =
            getFirstName(user);


        const letter =
            firstName
                .charAt(0)
                .toUpperCase() || "A";


        const avatarUrl =
            getAvatarUrl(user);


        container.innerHTML = "";


        if (!avatarUrl) {

            container.textContent =
                letter;

            return;

        }


        const image =
            document.createElement("img");


        image.className =
            "header-avatar-image";


        image.alt =
            firstName +
            "'s profile picture";


        image.src =
            avatarUrl;


        image.onerror =
            function () {

                container.innerHTML = "";

                container.textContent =
                    letter;

            };


        container.appendChild(image);

    }


    /* ========================================================
       GUEST HEADER AVATAR
    ======================================================== */

    function renderGuestHeaderAvatar() {

        const container =
            $("headerAvatarLetter");


        if (!container) {
            return;
        }


        container.innerHTML = "";


        const icon =
            document.createElement("span");


        icon.setAttribute(
            "data-lucide",
            "user-round"
        );


        container.appendChild(icon);


        refreshHomeIcons();

    }


    /* ========================================================
       SIDEBAR AVATAR
    ======================================================== */

    function renderSidebarAvatar(user) {

        const container =
            $("sidebarAvatar");


        if (!container) {
            return;
        }


        const firstName =
            getFirstName(user);


        const letter =
            firstName
                .charAt(0)
                .toUpperCase() || "A";


        const avatarUrl =
            getAvatarUrl(user);


        container.innerHTML = "";


        if (!avatarUrl) {

            container.textContent =
                letter;

            return;

        }


        const image =
            document.createElement("img");


        image.className =
            "bottom-avatar-image";


        image.alt =
            firstName +
            "'s profile picture";


        image.src =
            avatarUrl;


        image.onerror =
            function () {

                container.innerHTML = "";

                container.textContent =
                    letter;

            };


        container.appendChild(image);

    }


    /* ========================================================
       BOTTOM AVATAR
    ======================================================== */

    function renderBottomAvatar(user) {

        const container =
            $("bottomAvatar");


        if (!container) {
            return;
        }


        const firstName =
            getFirstName(user);


        const letter =
            firstName
                .charAt(0)
                .toUpperCase() || "A";


        const avatarUrl =
            getAvatarUrl(user);


        container.innerHTML = "";


        if (!avatarUrl) {

            container.textContent =
                letter;

            return;

        }


        const image =
            document.createElement("img");


        image.className =
            "bottom-avatar-image";


        image.alt =
            firstName +
            "'s profile picture";


        image.src =
            avatarUrl;


        image.onerror =
            function () {

                container.innerHTML = "";

                container.textContent =
                    letter;

            };


        container.appendChild(image);

    }


    /* ========================================================
       MOBILE MENU
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


        sidebar.classList.add("open");


        if (overlay) {

            overlay.classList.add("active");

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


            const icon =
                button.querySelector(
                    "[data-lucide]"
                );


            if (icon) {

                icon.setAttribute(
                    "data-lucide",
                    "x"
                );

            }

        }


        refreshHomeIcons();

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


            const icon =
                button.querySelector(
                    "[data-lucide]"
                );


            if (icon) {

                icon.setAttribute(
                    "data-lucide",
                    "menu"
                );

            }

        }


        refreshHomeIcons();

    }


    function toggleMobileMenu() {

        const sidebar =
            $("sidebar");


        if (!sidebar) {
            return;
        }


        if (
            sidebar.classList.contains("open")
        ) {

            closeMobileMenu();

        } else {

            openMobileMenu();

        }

    }


    /* ========================================================
       NAVIGATION
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
                        event.target.closest("a");


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
           ESCAPE
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
           RESIZE
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
       HEADER ACCOUNT
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


            renderHeaderAvatar(user);

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


        /* Keep avatar perfectly circular */

        accountButton.style.width =
            "42px";

        accountButton.style.height =
            "42px";

        accountButton.style.minWidth =
            "42px";

        accountButton.style.maxWidth =
            "42px";

        accountButton.style.minHeight =
            "42px";

        accountButton.style.maxHeight =
            "42px";

        accountButton.style.flex =
            "0 0 42px";

        accountButton.style.borderRadius =
            "50%";

        accountButton.style.overflow =
            "hidden";

    }


    /* ========================================================
       NOTIFICATION
    ======================================================== */

    function updateNotificationHeader() {

        const notificationButton =
            document.querySelector(
                ".header-notification-button"
            );


        if (!notificationButton) {
            return;
        }


        notificationButton.hidden =
            false;


        notificationButton.style.display =
            "inline-flex";


        notificationButton.href =
            "pages/notifications.html";

    }


    /* ========================================================
       BOTTOM PROFILE
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

                guestProfile.style.display =
                    "none";

            }


            if (memberProfile) {

                memberProfile.hidden =
                    false;

                memberProfile.style.display =
                    "flex";

            }


            renderBottomAvatar(user);

        } else {

            if (memberProfile) {

                memberProfile.hidden =
                    true;

                memberProfile.style.display =
                    "none";

            }


            if (guestProfile) {

                guestProfile.hidden =
                    false;

                guestProfile.style.display =
                    "flex";

            }

        }

    }


    /* ========================================================
       MEMBER-ONLY ELEMENTS
    ======================================================== */

    function updateMemberOnlyElements(
        loggedIn
    ) {

        document
            .querySelectorAll(".member-only")
            .forEach(
                function (element) {

                    if (loggedIn) {

                        element.classList.add(
                            "member-visible"
                        );

                    } else {

                        element.classList.remove(
                            "member-visible"
                        );

                    }

                }
            );

    }


    /* ========================================================
       PERSONALIZED HOME
    ======================================================== */

    function updatePersonalizedHome() {

        const loggedIn =
            isLoggedIn();


        const user =
            getUser();


        const memberActive =
            loggedIn && !!user;


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
           MEMBER
        ---------------------------------------------------- */

        if (memberActive) {

            const firstName =
                getFirstName(user);


            hide(guestHero);

            show(memberHero);


            hide(guestInformation);

            show(memberDashboard);


            hide(sidebarGuest);

            show(sidebarMember);


            if (welcomeUserName) {

                welcomeUserName.textContent =
                    firstName;

            }


            if (sidebarUserName) {

                sidebarUserName.textContent =
                    firstName;

            }


            renderSidebarAvatar(user);

        }


        /* ----------------------------------------------------
           GUEST
        ---------------------------------------------------- */

        else {

            show(guestHero);

            hide(memberHero);


            show(guestInformation);

            hide(memberDashboard);


            show(sidebarGuest);

            hide(sidebarMember);


            if (welcomeUserName) {

                welcomeUserName.textContent =
                    "Friend";

            }

        }


        updateMemberOnlyElements(
            memberActive
        );


        updateHeaderAccount(
            memberActive,
            user
        );


        updateNotificationHeader();


        updateBottomProfile(
            memberActive,
            user
        );


        refreshHomeIcons();

    }


    /* ========================================================
       LOGOUT
    ======================================================== */

    async function performLogout() {

        closeMobileMenu();


        if (
            window.AUTH &&
            typeof window.AUTH.logout === "function"
        ) {

            try {

                await window.AUTH.logout();

                updatePersonalizedHome();

                window.location.replace(
                    "index.html"
                );

                return;

            } catch (error) {

                console.error(
                    "AFC Portal: logout failed.",
                    error
                );

            }

        }


        /*
         * Emergency fallback.
         */

        if (
            window.AUTH &&
            typeof window.AUTH.clear === "function"
        ) {

            window.AUTH.clear();

        }


        updatePersonalizedHome();


        window.location.replace(
            "index.html"
        );

    }


    /* ========================================================
       LOGOUT BUTTONS
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
       AUTH EVENTS
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


        window.addEventListener(
            "storage",
            function (event) {

                if (
                    event.key ===
                        "afc_isiu_auth_user" ||
                    event.key ===
                        "afc_isiu_auth_session"
                ) {

                    updatePersonalizedHome();

                }

            }
        );

    }


    /* ========================================================
       INITIALIZE
    ======================================================== */

    function initializeHome() {

        setupNavigation();

        setupLogoutButtons();

        setupAuthListeners();

        updatePersonalizedHome();

        refreshHomeIcons();

    }


    /* ========================================================
       DOM READY
    ======================================================== */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeHome
        );

    } else {

        initializeHome();

    }


    /* ========================================================
       PUBLIC METHODS
    ======================================================== */

    window.openMobileMenu =
        openMobileMenu;


    window.closeMobileMenu =
        closeMobileMenu;


    window.toggleMobileMenu =
        toggleMobileMenu;


    window.updatePersonalizedHome =
        updatePersonalizedHome;


})();
