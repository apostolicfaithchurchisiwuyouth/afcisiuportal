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
       LUCIDE ICONS
       ======================================================== */

    function refreshIcons() {

        if (
            window.lucide &&
            typeof window.lucide.createIcons === "function"
        ) {

            try {
                window.lucide.createIcons();
            } catch (error) {
                console.warn(
                    "AFC Portal: unable to refresh icons.",
                    error
                );
            }
        }
    }


    /* ========================================================
       MOBILE MENU
       ======================================================== */

    function openMobileMenu() {

        const sidebar = $("sidebar");
        const overlay = $("mobileOverlay");
        const button = $("mobileMenuButton");

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
        const button = $("mobileMenuButton");


        if (sidebar) {
            sidebar.classList.remove("open");
        }


        if (overlay) {
            overlay.classList.remove("active");
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
       AUTH STORAGE
       ======================================================== */

    const AUTH_STORAGE_KEYS = [

        "afc_isiu_auth_user",

        "afc_isiu_user",

        "auth_user",

        "currentUser",

        "afc_isiu_auth_session",

        "afc_isiu_session",

        "auth_session",

        "currentSession",

        "userSession"

    ];


    function parseStoredValue(value) {

        if (!value) {
            return null;
        }


        if (
            typeof value === "object"
        ) {

            return value;

        }


        if (
            typeof value !== "string"
        ) {

            return null;

        }


        try {

            return JSON.parse(value);

        } catch (error) {

            return null;

        }
    }


    function normalizeUser(value) {

        if (!value) {
            return null;
        }


        const parsed =
            parseStoredValue(value);


        if (!parsed) {
            return null;
        }


        /*
         * Some authentication systems store:
         *
         * {
         *     user: {...}
         * }
         *
         * or:
         *
         * {
         *     data: {...}
         * }
         *
         * or:
         *
         * {
         *     session: {...},
         *     user: {...}
         * }
         */


        if (
            parsed.user &&
            typeof parsed.user === "object"
        ) {

            return parsed.user;

        }


        if (
            parsed.data &&
            typeof parsed.data === "object"
        ) {

            if (
                parsed.data.user &&
                typeof parsed.data.user === "object"
            ) {

                return parsed.data.user;

            }

            return parsed.data;

        }


        return parsed;
    }


    /* ========================================================
       GET USER FROM AUTH OBJECT
       ======================================================== */

    function getUserFromAuthObject() {

        if (!window.AUTH) {
            return null;
        }


        const methods = [

            "getUser",

            "getCurrentUser",

            "currentUser",

            "getAuthenticatedUser"

        ];


        for (
            let i = 0;
            i < methods.length;
            i++
        ) {

            const methodName =
                methods[i];


            try {

                const method =
                    window.AUTH[methodName];


                if (
                    typeof method === "function"
                ) {

                    const result =
                        method.call(window.AUTH);


                    const user =
                        normalizeUser(result);


                    if (user) {
                        return user;
                    }

                }

            } catch (error) {

                console.warn(
                    "AFC Portal: AUTH." +
                    methodName +
                    "() failed.",
                    error
                );

            }
        }


        /*
         * Some implementations expose the user
         * directly as AUTH.user.
         */

        try {

            if (
                window.AUTH.user &&
                typeof window.AUTH.user === "object"
            ) {

                return normalizeUser(
                    window.AUTH.user
                );

            }

        } catch (error) {

            console.warn(
                "AFC Portal: unable to read AUTH.user.",
                error
            );

        }


        return null;
    }


    /* ========================================================
       GET STORED USER
       ======================================================== */

    function getStoredUser() {

        /*
         * First ask the existing authentication
         * system.
         */

        const authUser =
            getUserFromAuthObject();


        if (authUser) {
            return authUser;
        }


        /*
         * Then inspect localStorage.
         */

        for (
            let i = 0;
            i < AUTH_STORAGE_KEYS.length;
            i++
        ) {

            const key =
                AUTH_STORAGE_KEYS[i];


            try {

                const raw =
                    localStorage.getItem(key);


                if (!raw) {
                    continue;
                }


                const user =
                    normalizeUser(raw);


                if (user) {

                    /*
                     * Do not treat a plain session token
                     * as a user object.
                     */

                    if (
                        typeof user === "object"
                    ) {

                        return user;

                    }

                }

            } catch (error) {

                console.warn(
                    "AFC Portal: unable to read " +
                    key,
                    error
                );

            }
        }


        /*
         * Finally check sessionStorage.
         */

        for (
            let i = 0;
            i < AUTH_STORAGE_KEYS.length;
            i++
        ) {

            const key =
                AUTH_STORAGE_KEYS[i];


            try {

                const raw =
                    sessionStorage.getItem(key);


                if (!raw) {
                    continue;
                }


                const user =
                    normalizeUser(raw);


                if (user) {

                    if (
                        typeof user === "object"
                    ) {

                        return user;

                    }

                }

            } catch (error) {

                console.warn(
                    "AFC Portal: unable to read sessionStorage " +
                    key,
                    error
                );

            }
        }


        return null;
    }


    /* ========================================================
       AUTHENTICATION CHECK
       ======================================================== */

    function authMethodSaysLoggedIn() {

        if (!window.AUTH) {
            return null;
        }


        const methods = [

            "isLoggedIn",

            "isAuthenticated",

            "isUserLoggedIn",

            "hasSession"

        ];


        for (
            let i = 0;
            i < methods.length;
            i++
        ) {

            const methodName =
                methods[i];


            try {

                if (
                    typeof window.AUTH[methodName] ===
                    "function"
                ) {

                    return !!window.AUTH[
                        methodName
                    ]();

                }

            } catch (error) {

                console.warn(
                    "AFC Portal: AUTH." +
                    methodName +
                    "() failed.",
                    error
                );

            }
        }


        return null;
    }


    function isLoggedIn() {

        /*
         * Let the real authentication system
         * have priority.
         */

        const authResult =
            authMethodSaysLoggedIn();


        if (
            authResult !== null
        ) {

            return authResult;

        }


        /*
         * Fallback to the actual stored user.
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


        const possibleNames = [

            user.firstName,

            user.firstname,

            user.first_name,

            user.givenName,

            user.given_name,

            user.first,

            user.fname

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
       AVATAR URL
       ======================================================== */

    function getAvatarUrl(user) {

        if (!user) {
            return null;
        }


        /*
         * Check the existing AUTH system first.
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

            user.profile_image,

            user.profile_image_url,

            user.image,

            user.imageUrl,

            user.imageURL,

            user.image_url

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
       HEADER AVATAR
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
            firstName
                .charAt(0)
                .toUpperCase() || "A";


        const avatarUrl =
            getAvatarUrl(user);


        /*
         * Always clear the previous contents.
         */

        avatar.innerHTML = "";


        /*
         * Member with uploaded avatar.
         */

        if (avatarUrl) {

            const image =
                document.createElement("img");


            image.className =
                "header-avatar-image";


            image.alt =
                firstName +
                "'s profile picture";


            image.src =
                avatarUrl;


            image.onload =
                function () {

                    avatar.textContent = "";

                    avatar.appendChild(
                        image
                    );

                };


            image.onerror =
                function () {

                    avatar.textContent =
                        letter;

                };


            /*
             * Add immediately too.
             */

            avatar.appendChild(image);

            return;
        }


        /*
         * Member without uploaded avatar.
         */

        avatar.textContent =
            letter;
    }


    /* ========================================================
       GUEST HEADER AVATAR
       ======================================================== */

    function renderGuestHeaderAvatar() {

        const avatar =
            $("headerAvatarLetter");


        if (!avatar) {
            return;
        }


        avatar.innerHTML = "";


        const icon =
            document.createElement("span");


        icon.setAttribute(
            "data-lucide",
            "user-round"
        );


        avatar.appendChild(icon);


        refreshIcons();
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
            firstName
                .charAt(0)
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
                firstName +
                "'s profile picture";


            image.src =
                avatarUrl;


            image.onerror =
                function () {

                    avatar.textContent =
                        letter;

                };


            avatar.appendChild(image);

            return;
        }


        avatar.textContent =
            letter;
    }


    /* ========================================================
       BOTTOM AVATAR
       ======================================================== */

    function renderBottomAvatar(user) {

        const avatar =
            $("bottomAvatar");


        if (!avatar) {
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


        avatar.innerHTML = "";


        if (avatarUrl) {

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

                    avatar.textContent =
                        letter;

                };


            avatar.appendChild(image);

            return;
        }


        avatar.textContent =
            letter;
    }


    /* ========================================================
       MEMBER-ONLY ELEMENTS
       ======================================================== */

    function updateMemberOnlyElements(
        loggedIn
    ) {

        const memberElements =
            document.querySelectorAll(
                ".member-only"
            );


        memberElements.forEach(
            function (element) {

                /*
                 * Do not use the hidden attribute here.
                 *
                 * The CSS can control member-only
                 * display while JavaScript controls
                 * whether the member state is active.
                 */

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

            /*
             * Logged-in member:
             * profile page.
             */

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

            /*
             * Guest:
             * login page.
             */

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


        /*
         * Preserve the approved circular shape.
         */

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

        accountButton.style.borderRadius =
            "50%";

        accountButton.style.flex =
            "0 0 42px";

        accountButton.style.overflow =
            "hidden";
    }


    /* ========================================================
       HEADER NOTIFICATION
       ======================================================== */

    function updateNotificationHeader(
        loggedIn
    ) {

        const notificationButton =
            document.querySelector(
                ".header-notification-button"
            );


        if (!notificationButton) {
            return;
        }


        /*
         * Notifications are available as a header
         * destination for everyone.
         *
         * Guests can still see the bell.
         */

        notificationButton.hidden =
            false;

        notificationButton.style.display =
            "inline-flex";


        if (loggedIn) {

            notificationButton.href =
                "pages/notifications.html";

        } else {

            /*
             * Keep the bell visible for guests.
             * The notifications page can decide whether
             * login is required.
             */

            notificationButton.href =
                "pages/notifications.html";
        }
    }


    /* ========================================================
       PERSONALIZED HOME
       ======================================================== */

    function updatePersonalizedHome() {

        const loggedIn =
            isLoggedIn();


        const user =
            getStoredUser();


        /*
         * Only treat the homepage as a member
         * homepage when we actually have a user.
         *
         * This prevents a stale boolean from making
         * the homepage personalized with no user data.
         */

        const memberActive =
            loggedIn && !!user;


        /* ----------------------------------------------------
           MAIN HOME STATES
        ---------------------------------------------------- */

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


            /*
             * Guest hero OFF
             */

            hide(guestHero);


            /*
             * Member hero ON
             */

            show(memberHero);


            if (welcomeUserName) {

                welcomeUserName.textContent =
                    firstName;

            }


            /*
             * Guest information OFF
             */

            hide(guestInformation);


            /*
             * Member dashboard ON
             */

            show(memberDashboard);


            /*
             * Sidebar guest OFF
             */

            hide(sidebarGuest);


            /*
             * Sidebar member ON
             */

            show(sidebarMember);


            if (sidebarUserName) {

                sidebarUserName.textContent =
                    firstName;

            }


            renderSidebarAvatar(user);


        } else {

            /*
             * Guest hero ON
             */

            show(guestHero);


            /*
             * Member hero OFF
             */

            hide(memberHero);


            /*
             * Guest information ON
             */

            show(guestInformation);


            /*
             * Member dashboard OFF
             */

            hide(memberDashboard);


            /*
             * Sidebar guest ON
             */

            show(sidebarGuest);


            /*
             * Sidebar member OFF
             */

            hide(sidebarMember);

        }


        /* ----------------------------------------------------
           MEMBER-ONLY ITEMS
        ---------------------------------------------------- */

        updateMemberOnlyElements(
            memberActive
        );


        /* ----------------------------------------------------
           HEADER ACCOUNT
        ---------------------------------------------------- */

        updateHeaderAccount(
            memberActive,
            user
        );


        /* ----------------------------------------------------
           HEADER NOTIFICATION
        ---------------------------------------------------- */

        updateNotificationHeader(
            memberActive
        );


        /* ----------------------------------------------------
           BOTTOM ACCOUNT / PROFILE
        ---------------------------------------------------- */

        updateBottomProfile(
            memberActive,
            user
        );


        refreshIcons();
    }


    /* ========================================================
       LOGOUT
       ======================================================== */

    async function performLogout() {

        /*
         * Close mobile menu first.
         */

        closeMobileMenu();


        /*
         * Use the existing AUTH logout function.
         */

        if (
            window.AUTH &&
            typeof window.AUTH.logout === "function"
        ) {

            try {

                const result =
                    window.AUTH.logout();


                if (
                    result &&
                    typeof result.then === "function"
                ) {

                    await result;

                }


                /*
                 * Allow the auth system to finish
                 * updating its state.
                 */

                setTimeout(
                    function () {

                        updatePersonalizedHome();

                        window.location.href =
                            "index.html";

                    },
                    50
                );


                return;

            } catch (error) {

                console.error(
                    "AFC Portal: AUTH.logout() failed.",
                    error
                );

            }
        }


        /*
         * Fallback only when AUTH.logout()
         * doesn't exist.
         */

        const keysToRemove = [

            "afc_isiu_auth_user",

            "afc_isiu_auth_session",

            "afc_isiu_user",

            "afc_isiu_session",

            "auth_user",

            "auth_session",

            "currentUser",

            "currentSession",

            "userSession"

        ];


        keysToRemove.forEach(
            function (key) {

                try {
                    localStorage.removeItem(key);
                } catch (error) {
                    console.warn(
                        "AFC Portal: unable to remove " +
                        key,
                        error
                    );
                }


                try {
                    sessionStorage.removeItem(key);
                } catch (error) {
                    console.warn(
                        "AFC Portal: unable to remove session " +
                        key,
                        error
                    );
                }

            }
        );


        updatePersonalizedHome();


        window.location.href =
            "index.html";
    }


    /* ========================================================
       NAVIGATION SETUP
       ======================================================== */

    function setupNavigation() {

        const menuButton =
            $("mobileMenuButton");


        const overlay =
            $("mobileOverlay");


        const sidebar =
            $("sidebar");


        /*
         * Hamburger.
         *
         * Use addEventListener instead of replacing
         * onclick so this doesn't interfere with
         * anything else attached to the button.
         */

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


        /*
         * Overlay.
         */

        if (overlay) {

            overlay.addEventListener(
                "click",
                function () {

                    closeMobileMenu();

                }
            );
        }


        /*
         * Sidebar links.
         */

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


        /*
         * Escape key.
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
         * If the screen becomes desktop-sized,
         * reset the mobile menu.
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
       AUTH EVENT LISTENERS
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

            "user-logout",

            "userLogin",

            "userLogout"

        ];


        events.forEach(
            function (eventName) {

                window.addEventListener(
                    eventName,
                    function () {

                        /*
                         * Give auth.js/auth-state.js a
                         * moment to finish writing state.
                         */

                        setTimeout(
                            updatePersonalizedHome,
                            50
                        );


                        setTimeout(
                            updatePersonalizedHome,
                            250
                        );

                    }
                );

            }
        );


        /*
         * localStorage changes.
         *
         * This catches authentication changes made
         * from another browser tab/window.
         */

        window.addEventListener(
            "storage",
            function (event) {

                if (
                    AUTH_STORAGE_KEYS.indexOf(
                        event.key
                    ) !== -1
                ) {

                    updatePersonalizedHome();

                }

            }
        );
    }


    /* ========================================================
       AUTH STATE POLLING
       ======================================================== */

    function startAuthStateMonitor() {

        let lastState = null;


        function check() {

            const loggedIn =
                isLoggedIn();


            const user =
                getStoredUser();


            const firstName =
                user
                    ? getFirstName(user)
                    : "";


            const avatar =
                user
                    ? getAvatarUrl(user)
                    : "";


            const stateSignature =
                JSON.stringify({

                    loggedIn:
                        !!loggedIn,

                    firstName:
                        firstName,

                    avatar:
                        avatar || ""

                });


            if (
                stateSignature !==
                lastState
            ) {

                lastState =
                    stateSignature;


                updatePersonalizedHome();

            }

        }


        /*
         * Check regularly, but lightly.
         *
         * This is particularly useful because the login
         * page may update authentication state without
         * dispatching an event that this page knows about.
         */

        setInterval(
            check,
            1000
        );


        check();
    }


    /* ========================================================
       INITIALIZE
       ======================================================== */

    function initializeHome() {

        setupNavigation();

        setupLogoutButtons();

        setupAuthListeners();

        updatePersonalizedHome();

        refreshIcons();


        /*
         * Authentication restoration may happen
         * immediately after the page loads.
         */

        setTimeout(
            updatePersonalizedHome,
            100
        );


        setTimeout(
            updatePersonalizedHome,
            300
        );


        setTimeout(
            updatePersonalizedHome,
            700
        );


        /*
         * Keep watching for login/logout state changes.
         */

        startAuthStateMonitor();
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
