/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   HOME PAGE CONTROLLER
   PHASE 4A.1 — CORRECTED
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


        /*
         * Fallbacks in case the user object itself
         * contains an avatar URL.
         */

        const possibleAvatar =
            user.avatar ||
            user.avatar_url ||
            user.profile_picture ||
            user.photo_url ||
            "";


        return String(
            possibleAvatar
        ).trim();

    }


    /* ========================================================
       HEADER AVATAR
       ======================================================== */

    function renderHeaderAvatar(user) {

        /*
         * IMPORTANT:
         *
         * index.html uses:
         *
         * #headerAvatarContent
         *
         * NOT #headerAvatarLetter
         */

        const container =
            $("headerAvatarContent");


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


        container.appendChild(
            image
        );

    }


    /* ========================================================
       GUEST HEADER AVATAR
    ======================================================== */

    function renderGuestHeaderAvatar() {

        const container =
            $("headerAvatarContent");


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


        container.appendChild(
            icon
        );


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


        container.appendChild(
            image
        );

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


        container.appendChild(
            image
        );

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


        /*
         * Keep avatar perfectly circular.
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

        accountButton.style.flex =
            "0 0 42px";

        accountButton.style.borderRadius =
            "50%";

        accountButton.style.overflow =
            "hidden";

    }


    /* ========================================================
       NOTIFICATION HEADER
    ======================================================== */

    function updateNotificationHeader(
        loggedIn
    ) {

        /*
         * IMPORTANT:
         *
         * index.html uses:
         *
         * #headerNotificationButton
         *
         * NOT .header-notification-button
         */

        const notificationButton =
            $("headerNotificationButton");


        if (!notificationButton) {

            return;

        }


        if (loggedIn) {

            notificationButton.hidden =
                false;

            notificationButton.style.display =
                "inline-flex";

            notificationButton.href =
                "pages/notifications.html";

        } else {

            notificationButton.hidden =
                true;

            notificationButton.style.display =
                "none";

        }

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


            renderBottomAvatar(
                user
            );

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
            .querySelectorAll(
                ".member-only"
            )
            .forEach(
                function (element) {

                    /*
                     * The HTML starts these elements with
                     * hidden.
                     *
                     * We must explicitly change the hidden
                     * property. Adding a CSS class alone is
                     * not enough.
                     */

                    element.hidden =
                        !loggedIn;


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
           GUEST
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
       HOME LESSON PREVIEW
    ======================================================== */

    function escapeHomeHtml(
        value
    ) {

        return String(
            value || ""
        )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

    }


    function getHomeResponseData(
        response
    ) {

        if (!response) {

            return null;

        }


        if (
            response.data !== undefined
        ) {

            return response.data;

        }


        return response;

    }


    function formatHomeLessonDate(
        value
    ) {

        if (!value) {

            return "";

        }


        const date =
            new Date(
                value
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return String(
                value
            );

        }


        return date.toLocaleDateString(
            "en-NG",
            {
                day:
                    "numeric",

                month:
                    "short",

                year:
                    "numeric"
            }
        );

    }


    function sortHomeLessons(
        lessonList
    ) {

        return [
            ...lessonList
        ]

        .sort(
            function (a, b) {

                const aDate =
                    new Date(
                        a.lesson_date ||
                        a.published_at ||
                        0
                    );


                const bDate =
                    new Date(
                        b.lesson_date ||
                        b.published_at ||
                        0
                    );


                return (
                    bDate -
                    aDate
                );

            }
        );

    }


    async function loadCurrentLessonPreview() {

        const container =
            $("currentLesson");


        /*
         * If the homepage does not contain the
         * lesson preview, there is nothing to do.
         */

        if (!container) {

            return;

        }


        /*
         * Loading state.
         */

        container.innerHTML = `
            <div class="lesson-preview-loading">

                <div class="empty-state-icon">

                    <span
                        data-lucide="loader-circle"
                    ></span>

                </div>

                <p>
                    Loading current lesson...
                </p>

            </div>
        `;


        refreshHomeIcons();


        try {

            /*
             * Make sure the central API layer exists.
             */

            if (
                !window.API ||
                typeof window.API.get !==
                    "function"
            ) {

                throw new Error(
                    "The API connection is not available."
                );

            }


            /*
             * Ask the existing backend for lessons.
             *
             * This uses the same getLessons action
             * already used by lessons.js.
             */

            const response =
                await window.API.get(
                    "getLessons"
                );


            const data =
                getHomeResponseData(
                    response
                );


            /*
             * No lessons.
             */

            if (
                !Array.isArray(data) ||
                data.length === 0
            ) {

                container.innerHTML = `
                    <div class="empty-state">

                        <div
                            class="empty-state-icon"
                        >
                            <span
                                data-lucide="book-open"
                            ></span>
                        </div>

                        <p>
                            No lesson is available yet.
                        </p>

                    </div>
                `;


                refreshHomeIcons();

                return;

            }


            /*
             * Sort exactly like the Lessons module:
             * newest lesson first.
             */

            const sortedLessons =
                sortHomeLessons(
                    data
                );


            const lesson =
                sortedLessons[0];


            /*
             * Lesson information.
             */

            const lessonTitle =
                lesson.title ||
                "Untitled Lesson";


            const lessonDescription =
                lesson.description ||
                "Start reading this week's lesson.";


            const lessonType =
                lesson.lesson_type ||
                "Youth Lesson";


            const lessonDate =
                lesson.lesson_date
                    ? formatHomeLessonDate(
                        lesson.lesson_date
                    )
                    : "";


            const weekText =
                lesson.week_number
                    ? `Week ${escapeHomeHtml(
                        lesson.week_number
                    )}`
                    : "Current Lesson";


            /*
             * Create the homepage preview.
             *
             * The actual full lesson remains on
             * pages/lessons.html.
             */

            container.innerHTML = `
                <div
                    class="home-lesson-preview"
                >

                    <div
                        class="
                            home-lesson-preview-meta
                        "
                    >

                        <span
                            class="
                                home-lesson-preview-week
                            "
                        >
                            ${weekText}
                        </span>


                        <span
                            class="
                                home-lesson-preview-type
                            "
                        >
                            ${escapeHomeHtml(
                                lessonType
                            )}
                        </span>

                    </div>


                    <h4>
                        ${escapeHomeHtml(
                            lessonTitle
                        )}
                    </h4>


                    <p>
                        ${escapeHomeHtml(
                            lessonDescription
                        )}
                    </p>


                    ${
                        lessonDate
                            ? `
                                <small
                                    class="
                                        home-lesson-preview-date
                                    "
                                >
                                    ${escapeHomeHtml(
                                        lessonDate
                                    )}
                                </small>
                            `
                            : ""
                    }


                    <div
                        class="
                            home-lesson-preview-actions
                        "
                    >

                        <a
                            href="pages/lessons.html"
                            class="
                                text-link
                                home-lesson-preview-link
                            "
                        >
                            Read Lesson

                            <span
                                data-lucide="arrow-right"
                            ></span>

                        </a>

                    </div>

                </div>
            `;


            refreshHomeIcons();


        } catch (error) {

            console.error(
                "AFC Portal: unable to load lesson preview.",
                error
            );


            container.innerHTML = `
                <div class="empty-state">

                    <div
                        class="empty-state-icon"
                    >
                        <span
                            data-lucide="book-open"
                        ></span>
                    </div>

                    <p>
                        Unable to load the current lesson.
                    </p>

                    <button
                        type="button"
                        class="lessons-retry"
                        id="retryHomeLessonButton"
                    >
                        Try Again
                    </button>

                </div>
            `;


            const retryButton =
                $("retryHomeLessonButton");


            if (retryButton) {

                retryButton.addEventListener(
                    "click",
                    function () {

                        loadCurrentLessonPreview();

                    }
                );

            }


            refreshHomeIcons();

        }

    }


    /* ========================================================
       LOGOUT
    ======================================================== */

    async function performLogout() {

        /*
         * Prevent multiple logout requests.
         */

        if (performLogout.isRunning) {

            return;

        }


        performLogout.isRunning =
            true;


        /*
         * Close mobile navigation first.
         */

        closeMobileMenu();


        /*
         * Find every logout button on the page.
         */

        const logoutButtons =
            document.querySelectorAll(
                "#sidebarLogoutButton, #heroLogoutButton, [data-logout]"
            );


        /*
         * Save original button content.
         */

        const originalContents = [];


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


                button.innerHTML = `
                    <span
                        class="button-spinner"
                        aria-hidden="true"
                    ></span>

                    <span>
                        Logging out...
                    </span>
                `;

            }
        );


        /*
         * Give the browser a moment to paint
         * the loading state.
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

            /*
             * Use the central authentication system.
             */

            if (
                window.AUTH &&
                typeof window.AUTH.logout ===
                    "function"
            ) {

                await window.AUTH.logout();

            } else if (
                window.AUTH &&
                typeof window.AUTH.clear ===
                    "function"
            ) {

                /*
                 * Emergency fallback.
                 */

                window.AUTH.clear();

            }


            /*
             * Update homepage state before redirect.
             */

            updatePersonalizedHome();


            /*
             * Refresh lesson preview.
             */

            loadCurrentLessonPreview();


            /*
             * Small delay for visual feedback.
             */

            await new Promise(
                function (resolve) {

                    setTimeout(
                        resolve,
                        350
                    );

                }
            );


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


            console.warn(
                "Logout could not be completed."
            );

        }

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
                            function () {

                                updatePersonalizedHome();

                                loadCurrentLessonPreview();

                            },
                            50
                        );

                    }
                );

            }
        );


        /*
         * Listen for authentication changes
         * made in another browser tab.
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

                    loadCurrentLessonPreview();

                }

            }
        );

    }


    /* ========================================================
       INITIALIZE
    ======================================================== */

    function initializeHome() {

        console.log(
            "AFC Portal: initializing homepage..."
        );


        setupNavigation();


        setupLogoutButtons();


        setupAuthListeners();


        updatePersonalizedHome();


        /*
         * Load the current lesson into the
         * #currentLesson area on index.html.
         */

        loadCurrentLessonPreview();


        refreshHomeIcons();


        console.log(
            "AFC Portal: homepage initialized."
        );

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


    window.loadCurrentLessonPreview =
        loadCurrentLessonPreview;


})();
