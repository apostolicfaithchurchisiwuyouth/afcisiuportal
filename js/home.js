/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   HOME PAGE JAVASCRIPT
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
       MOBILE MENU
       ======================================================== */

    function openMobileMenu() {

        const sidebar = $("sidebar");
        const overlay = $("mobileOverlay");

        if (!sidebar) {
            console.warn(
                "AFC Portal: sidebar element not found."
            );

            return;
        }

        sidebar.classList.add("open");

        if (overlay) {
            overlay.classList.add("active");
        }

        document.body.classList.add(
            "mobile-menu-open"
        );

        const button = $("mobileMenuButton");

        if (button) {

            button.setAttribute(
                "aria-expanded",
                "true"
            );

            button.setAttribute(
                "aria-label",
                "Close navigation menu"
            );

            const icon = button.querySelector(
                "[data-lucide]"
            );

            if (icon) {
                icon.setAttribute(
                    "data-lucide",
                    "x"
                );
            }
        }

        refreshIcons();
    }


    function closeMobileMenu() {

        const sidebar = $("sidebar");
        const overlay = $("mobileOverlay");

        if (sidebar) {
            sidebar.classList.remove("open");
        }

        if (overlay) {
            overlay.classList.remove("active");
        }

        document.body.classList.remove(
            "mobile-menu-open"
        );

        const button = $("mobileMenuButton");

        if (button) {

            button.setAttribute(
                "aria-expanded",
                "false"
            );

            button.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

            const icon = button.querySelector(
                "[data-lucide]"
            );

            if (icon) {
                icon.setAttribute(
                    "data-lucide",
                    "menu"
                );
            }
        }

        refreshIcons();
    }


    function toggleMobileMenu() {

        const sidebar = $("sidebar");

        if (!sidebar) return;

        if (
            sidebar.classList.contains("open")
        ) {

            closeMobileMenu();

        } else {

            openMobileMenu();

        }
    }


    /* ========================================================
       LUCIDE
       ======================================================== */

    function refreshIcons() {

        if (
            window.lucide &&
            typeof window.lucide.createIcons ===
                "function"
        ) {

            window.lucide.createIcons();

        }
    }


    /* ========================================================
       USER DATA
       ======================================================== */

    function getStoredUser() {

        /*
         * Primary storage used by the portal.
         */

        const possibleKeys = [
            "afc_isiu_auth_user",
            "afc_isiu_user",
            "auth_user",
            "currentUser"
        ];


        for (
            let i = 0;
            i < possibleKeys.length;
            i++
        ) {

            const key = possibleKeys[i];

            try {

                const raw =
                    localStorage.getItem(key);

                if (!raw) continue;

                const parsed =
                    JSON.parse(raw);

                if (
                    parsed &&
                    typeof parsed === "object"
                ) {

                    return (
                        parsed.user ||
                        parsed.data ||
                        parsed
                    );
                }

            } catch (error) {

                console.warn(
                    "AFC Portal: unable to read stored user:",
                    error
                );

            }
        }


        /*
         * If auth-state.js exposes a current user,
         * use it.
         */

        if (window.AUTH) {

            try {

                if (
                    typeof window.AUTH.getUser ===
                    "function"
                ) {

                    const user =
                        window.AUTH.getUser();

                    if (user) return user;
                }

            } catch (error) {

                console.warn(
                    "AFC Portal: AUTH.getUser() failed.",
                    error
                );

            }


            try {

                if (
                    typeof window.AUTH.getCurrentUser ===
                    "function"
                ) {

                    const user =
                        window.AUTH.getCurrentUser();

                    if (user) return user;
                }

            } catch (error) {

                console.warn(
                    "AFC Portal: AUTH.getCurrentUser() failed.",
                    error
                );

            }
        }


        return null;
    }


    /* ========================================================
       SESSION CHECK
       ======================================================== */

    function isLoggedIn() {

        /*
         * If the existing AUTH object already knows
         * the session, respect it.
         */

        if (window.AUTH) {

            try {

                if (
                    typeof window.AUTH.isLoggedIn ===
                    "function"
                ) {

                    return !!window.AUTH.isLoggedIn();

                }

            } catch (error) {

                console.warn(
                    "AFC Portal: AUTH.isLoggedIn() failed.",
                    error
                );

            }


            try {

                if (
                    typeof window.AUTH.isAuthenticated ===
                    "function"
                ) {

                    return !!window.AUTH.isAuthenticated();

                }

            } catch (error) {

                console.warn(
                    "AFC Portal: AUTH.isAuthenticated() failed.",
                    error
                );

            }
        }


        /*
         * Fallback:
         * If the user object exists, treat the person
         * as logged in.
         */

        return !!getStoredUser();
    }


    /* ========================================================
       NAME HELPERS
       ======================================================== */

    function getFirstName(user) {

        if (!user) {
            return "Friend";
        }


        /*
         * Try the common first-name fields first.
         */

        const possibleNames = [
            user.firstName,
            user.firstname,
            user.first_name,
            user.givenName,
            user.given_name
        ];


        for (
            let i = 0;
            i < possibleNames.length;
            i++
        ) {

            const value =
                possibleNames[i];

            if (
                typeof value === "string" &&
                value.trim()
            ) {

                return value
                    .trim()
                    .split(/\s+/)[0];

            }
        }


        /*
         * Fall back to full name.
         */

        const fullName =
            user.name ||
            user.fullName ||
            user.full_name ||
            user.displayName ||
            user.display_name;


        if (
            typeof fullName === "string" &&
            fullName.trim()
        ) {

            return fullName
                .trim()
                .split(/\s+/)[0];

        }


        return "Friend";
    }


    /* ========================================================
       AVATAR
       ======================================================== */

    function getAvatarUrl(user) {

        if (!user) {
            return null;
        }


        /*
         * Existing AUTH avatar method.
         */

        if (
            window.AUTH &&
            typeof window.AUTH.getAvatar ===
                "function"
        ) {

            try {

                const avatar =
                    window.AUTH.getAvatar();

                if (
                    typeof avatar === "string" &&
                    avatar.trim()
                ) {

                    return avatar.trim();

                }

            } catch (error) {

                console.warn(
                    "AFC Portal: AUTH.getAvatar() failed.",
                    error
                );

            }
        }


        const possibleAvatars = [
            user.avatar,
            user.avatarUrl,
            user.avatarURL,
            user.avatar_url,
            user.photo,
            user.photoUrl,
            user.photoURL,
            user.photo_url,
            user.profileImage,
            user.profileImageUrl,
            user.image,
            user.imageUrl
        ];


        for (
            let i = 0;
            i < possibleAvatars.length;
            i++
        ) {

            const value =
                possibleAvatars[i];

            if (
                typeof value === "string" &&
                value.trim()
            ) {

                return value.trim();

            }
        }


        return null;
    }


    /* ========================================================
       CREATE AVATAR CONTENT
       ======================================================== */

    function renderHeaderAvatar(user) {

        const avatar =
            $("headerAvatarLetter");

        if (!avatar) {
            return;
        }


        const firstName =
            getFirstName(user);

        const letter =
            firstName.charAt(0)
                .toUpperCase() || "A";

        const avatarUrl =
            getAvatarUrl(user);


        /*
         * Clear old avatar.
         */

        avatar.innerHTML = "";


        /*
         * If the user has an uploaded avatar,
         * display it inside the SAME CIRCLE.
         */

        if (avatarUrl) {

            const image =
                document.createElement("img");

            image.className =
                "header-avatar-image";

            image.alt =
                firstName + "'s profile picture";

            image.src = avatarUrl;

            image.onerror =
                function () {

                    this.remove();

                    avatar.textContent =
                        letter;

                };

            avatar.appendChild(image);

            return;
        }


        /*
         * Otherwise show first letter.
         */

        avatar.textContent = letter;
    }


    /* ========================================================
       SIDEBAR AVATAR
       ======================================================== */

    function renderSidebarAvatar(user) {

        const avatar =
            $("sidebarAvatar");

        if (!avatar) {
            return;
        }


        const firstName =
            getFirstName(user);

        const letter =
            firstName.charAt(0)
                .toUpperCase() || "A";

        const avatarUrl =
            getAvatarUrl(user);


        avatar.innerHTML = "";


        if (avatarUrl) {

            const image =
                document.createElement("img");

            image.className =
                "bottom-avatar-image";

            image.alt =
                firstName + "'s profile picture";

            image.src = avatarUrl;

            image.onerror =
                function () {

                    this.remove();

                    avatar.textContent =
                        letter;

                };

            avatar.appendChild(image);

            return;
        }


        avatar.textContent = letter;
    }


    /* ========================================================
       PERSONALIZED HOME
       ======================================================== */

    function updatePersonalizedHome() {

        const loggedIn =
            isLoggedIn();

        const user =
            getStoredUser();


        const guestHero =
            $("guestHero");

        const memberHero =
            $("memberHero");

        const guestInformation =
            $("guestInformation");

        const memberDashboard =
            $("memberDashboardContent");

        const sidebarGuest =
            $("sidebarGuest");

        const sidebarMember =
            $("sidebarMember");

        const guestHeaderActions =
            $("guestHeaderActions");

        const memberHeaderActions =
            $("memberHeaderActions");

        const welcomeUserName =
            $("welcomeUserName");

        const sidebarUserName =
            $("sidebarUserName");


        /*
         * IMPORTANT:
         *
         * Lessons remain publicly accessible.
         *
         * We are NOT hiding the Lessons link for guests.
         *
         * Authentication only changes the personalized
         * dashboard/member experience.
         */


        if (loggedIn && user) {

            const firstName =
                getFirstName(user);


            /* ------------------------------
               HERO
            ------------------------------ */

            hide(guestHero);

            show(memberHero);


            if (welcomeUserName) {

                welcomeUserName.textContent =
                    firstName;

            }


            /* ------------------------------
               GUEST INFORMATION
            ------------------------------ */

            hide(guestInformation);


            /* ------------------------------
               MEMBER DASHBOARD
            ------------------------------ */

            show(memberDashboard);


            /* ------------------------------
               SIDEBAR
            ------------------------------ */

            hide(sidebarGuest);

            show(sidebarMember);


            if (sidebarUserName) {

                sidebarUserName.textContent =
                    firstName;

            }


            renderSidebarAvatar(user);


            /* ------------------------------
               HEADER
            ------------------------------ */

            hide(guestHeaderActions);

            show(memberHeaderActions);

            renderHeaderAvatar(user);


            /*
             * Make sure the profile avatar remains
             * perfectly circular.
             */

            const headerAvatar =
                document.querySelector(
                    ".header-avatar"
                );

            if (headerAvatar) {

                headerAvatar.style.width =
                    "42px";

                headerAvatar.style.height =
                    "42px";

                headerAvatar.style.minWidth =
                    "42px";

                headerAvatar.style.maxWidth =
                    "42px";

                headerAvatar.style.borderRadius =
                    "50%";

            }


        } else {

            /* ------------------------------
               GUEST HERO
            ------------------------------ */

            show(guestHero);

            hide(memberHero);


            /* ------------------------------
               GUEST INFORMATION
            ------------------------------ */

            show(guestInformation);


            /* ------------------------------
               MEMBER DASHBOARD
            ------------------------------ */

            hide(memberDashboard);


            /* ------------------------------
               SIDEBAR
            ------------------------------ */

            show(sidebarGuest);

            hide(sidebarMember);


            /* ------------------------------
               HEADER
            ------------------------------ */

            show(guestHeaderActions);

            hide(memberHeaderActions);

        }


        refreshIcons();
    }


    /* ========================================================
       LOGOUT
       ======================================================== */

    function performLogout() {

        /*
         * Prefer the existing AUTH logout method.
         */

        if (
            window.AUTH &&
            typeof window.AUTH.logout ===
                "function"
        ) {

            try {

                const result =
                    window.AUTH.logout();


                /*
                 * Support both synchronous and
                 * Promise-based logout functions.
                 */

                if (
                    result &&
                    typeof result.then ===
                        "function"
                ) {

                    result
                        .then(function () {

                            updatePersonalizedHome();

                            window.location.href =
                                "index.html";

                        })
                        .catch(function (error) {

                            console.error(
                                "AFC Portal logout failed:",
                                error
                            );

                        });

                } else {

                    updatePersonalizedHome();

                    window.location.href =
                        "index.html";

                }

                return;

            } catch (error) {

                console.error(
                    "AFC Portal logout failed:",
                    error
                );

            }
        }


        /*
         * Fallback if AUTH.logout() is not available.
         */

        const keys = [
            "afc_isiu_auth_user",
            "afc_isiu_auth_session",
            "afc_isiu_user",
            "auth_user",
            "currentUser"
        ];


        keys.forEach(function (key) {

            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.warn(
                    "Unable to remove storage:",
                    key
                );
            }

        });


        updatePersonalizedHome();

        window.location.href =
            "index.html";
    }


    /* ========================================================
       NAVIGATION CLOSE
       ======================================================== */

    function setupNavigation() {

        const menuButton =
            $("mobileMenuButton");

        const overlay =
            $("mobileOverlay");

        const sidebar =
            $("sidebar");


        /*
         * Hamburger button
         */

        if (menuButton) {

            /*
             * Prevent duplicate listeners.
             */

            menuButton.onclick =
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    toggleMobileMenu();

                };

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }


        /*
         * Overlay closes the menu.
         */

        if (overlay) {

            overlay.onclick =
                function () {

                    closeMobileMenu();

                };
        }


        /*
         * Clicking a sidebar navigation link
         * closes the menu on mobile.
         */

        if (sidebar) {

            sidebar.addEventListener(
                "click",
                function (event) {

                    const link =
                        event.target.closest(
                            "a"
                        );

                    if (!link) return;

                    if (
                        window.innerWidth <= 900
                    ) {

                        closeMobileMenu();

                    }

                }
            );
        }


        /*
         * Escape closes the menu.
         */

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


        /*
         * Resize protection.
         */

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
       LOGOUT BUTTONS
       ======================================================== */

    function setupLogoutButtons() {

        const sidebarLogout =
            $("sidebarLogoutButton");

        const heroLogout =
            $("heroLogoutButton");


        if (sidebarLogout) {

            sidebarLogout.onclick =
                function () {

                    performLogout();

                };
        }


        if (heroLogout) {

            heroLogout.onclick =
                function () {

                    performLogout();

                };
        }
    }


    /* ========================================================
       AUTH CHANGE LISTENER
       ======================================================== */

    function setupAuthListeners() {

        /*
         * If auth-state.js dispatches one of these,
         * the homepage immediately updates.
         */

        const events = [
            "authchange",
            "auth-state-changed",
            "authStateChanged",
            "login",
            "logout",
            "user-login",
            "user-logout"
        ];


        events.forEach(function (eventName) {

            window.addEventListener(
                eventName,
                function () {

                    /*
                     * Give localStorage/auth-state
                     * a moment to finish updating.
                     */

                    setTimeout(
                        updatePersonalizedHome,
                        50
                    );

                }
            );

        });


        /*
         * Also listen for storage changes.
         *
         * This is useful if authentication updates
         * localStorage from another page.
         */

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
       INITIALIZE HOME
       ======================================================== */

    function initializeHome() {

        setupNavigation();

        setupLogoutButtons();

        setupAuthListeners();

        updatePersonalizedHome();

        refreshIcons();


        /*
         * Run one more time shortly after startup.
         *
         * This helps when auth-state.js finishes
         * restoring a session just after DOMContentLoaded.
         */

        setTimeout(
            updatePersonalizedHome,
            150
        );

        setTimeout(
            updatePersonalizedHome,
            500
        );
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
