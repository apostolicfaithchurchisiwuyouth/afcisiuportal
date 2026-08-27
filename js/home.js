/* ============================================================

AFC ISIU YOUTH PORTAL V2
HOME PAGE CONTROLLER
PHASE 4A.1 — CLEAN
============================================================ */

(function () {

"use strict";



/\* ========================================================
   DOM HELPERS
   \======================================================== \*/

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



/\* ========================================================
   ICONS
   \======================================================== \*/

function refreshHomeIcons() {

    if (
        window\.lucide &&
        typeof window\.lucide.createIcons === "function"
    ) {

        try {

            window\.lucide.createIcons();

        } catch (error) {

            console.warn(
                "AFC Portal: icon refresh failed.",
                error
            );

        }

    }

}



/\* ========================================================
   AUTHENTICATION
   \======================================================== \*/

function getUser() {

    if (
        window\.AUTH &&
        typeof window\.AUTH.getUser === "function"
    ) {

        try {

            return window\.AUTH.getUser();

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
        window\.AUTH &&
        typeof window\.AUTH.isAuthenticated === "function"
    ) {

        try {

            return !!window\.AUTH.isAuthenticated();

        } catch (error) {

            console.warn(
                "AFC Portal: authentication check failed.",
                error
            );

        }

    }

    return false;

}



/\* ========================================================
   USER NAME
   \======================================================== \*/

function getFirstName(user) {

    if (!user) {

        return "Friend";

    }



    const firstName =
        String(
            user.first\_name || ""
        ).trim();



    if (firstName) {

        return firstName.split(/\s+/)[0];

    }



    const fullName =
        String(
            user.name ||
            user.full\_name ||
            user.displayName ||
            ""
        ).trim();



    if (fullName) {

        return fullName.split(/\s+/)[0];

    }



    return "Friend";

}



/\* ========================================================
   HTML ESCAPE
   \======================================================== \*/

function escapeHomeHtml(value) {

    return String(
        value || ""
    )

    .replace(
        /&/g,
        "&amp;"
    )

    .replace(
        /\</g,
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



/\* ========================================================
   AVATAR
   \======================================================== \*/

function getAvatarUrl(user) {

    if (!user) {

        return "";

    }



    /\*
     \* Prefer the central AUTH avatar function.
     \*/

    if (
        window\.AUTH &&
        typeof window\.AUTH.getAvatar === "function"
    ) {

        try {

            const avatar =
                window\.AUTH.getAvatar();



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



    /\*
     \* Fallback to possible avatar fields
     \* on the user object.
     \*/

    const possibleAvatar =
        user.avatar ||
        user.avatar\_url ||
        user.profile\_picture ||
        user.photo\_url ||
        "";



    return String(
        possibleAvatar
    ).trim();

}



/\* ========================================================
   HEADER AVATAR
   \======================================================== \*/

function renderHeaderAvatar(user) {

    /\*
     \* Current index.html uses:
     \*
     \* #headerAvatarContent
     \*
     \* Older versions used:
     \*
     \* #headerAvatarLetter
     \*
     \* Support both.
     \*/

    const container =
        $("headerAvatarContent") ||
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



    /\*
     \* No profile picture.
     \*/

    if (!avatarUrl) {

        container.textContent =
            letter;

        return;

    }



    /\*
     \* Profile picture.
     \*/

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



/\* ========================================================
   GUEST HEADER AVATAR
   \======================================================== \*/

function renderGuestHeaderAvatar() {

    const container =
        $("headerAvatarContent") ||
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



    container.appendChild(
        icon
    );



    refreshHomeIcons();

}



/\* ========================================================
   SIDEBAR AVATAR
   \======================================================== \*/

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



    /\*
     \* No profile picture.
     \*/

    if (!avatarUrl) {

        container.textContent =
            letter;

        return;

    }



    /\*
     \* Profile picture.
     \*/

    const image =
        document.createElement("img");



    image.className =
        "sidebar-avatar-image";



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



/\* ========================================================
   BOTTOM AVATAR
   \======================================================== \*/

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



    /\*
     \* No profile picture.
     \*/

    if (!avatarUrl) {

        container.textContent =
            letter;

        return;

    }



    /\*
     \* Profile picture.
     \*/

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



/\* ========================================================
   MOBILE MENU
   \======================================================== \*/

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



/\* ========================================================
   NAVIGATION
   \======================================================== \*/

function setupNavigation() {

    const menuButton =
        $("mobileMenuButton");



    const overlay =
        $("mobileOverlay");



    const sidebar =
        $("sidebar");



    /\*
     \* ----------------------------------------------------
     \* HAMBURGER
     \* ----------------------------------------------------
     \*/

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



    /\*
     \* ----------------------------------------------------
     \* OVERLAY
     \* ----------------------------------------------------
     \*/

    if (overlay) {

        overlay.addEventListener(
            "click",
            function () {

                closeMobileMenu();

            }
        );

    }



    /\*
     \* ----------------------------------------------------
     \* SIDEBAR LINKS
     \* ----------------------------------------------------
     \*/

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
                    window\.innerWidth <= 900
                ) {

                    closeMobileMenu();

                }

            }
        );

    }



    /\*
     \* ----------------------------------------------------
     \* ESCAPE KEY
     \* ----------------------------------------------------
     \*/

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



    /\*
     \* ----------------------------------------------------
     \* WINDOW RESIZE
     \* ----------------------------------------------------
     \*/

    window\.addEventListener(
        "resize",
        function () {

            if (
                window\.innerWidth > 900
            ) {

                closeMobileMenu();

            }

        }
    );

}



/\* ========================================================
   HEADER ACCOUNT
   \======================================================== \*/

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



    /\*
     \* Keep avatar perfectly circular.
     \*/

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



/\* ========================================================
   NOTIFICATION HEADER
   \======================================================== \*/

function updateNotificationHeader(
    loggedIn
) {

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



/\* ========================================================
   BOTTOM PROFILE
   \======================================================== \*/

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



/\* ========================================================
   MEMBER-ONLY ELEMENTS
   \======================================================== \*/

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



/\* ========================================================
   PERSONALIZED HOME
   \======================================================== \*/

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



    /\*
     \* ----------------------------------------------------
     \* MEMBER
     \* ----------------------------------------------------
     \*/

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



    /\*
     \* ----------------------------------------------------
     \* GUEST
     \* ----------------------------------------------------
     \*/

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



/\* ========================================================
   CURRENT LESSON PREVIEW
   \======================================================== \*/

async function loadCurrentLessonPreview() {

    const container =
        $("currentLesson");



    /\*
     \* The lesson preview only exists
     \* when the member dashboard is present.
     \*/

    if (!container) {

        return;

    }



    /\*
     \* ----------------------------------------------------
     \* INTERNAL LESSON LOADING STATE
     \* ----------------------------------------------------
     \*
     \* This is deliberately NOT the global loader.
     \*/

    container.innerHTML = \`
        \<div class="home-lesson-loading">

            \<div class="home-lesson-loading-icon">

                \<span
                    data-lucide="book-open"
                \>\</span>

            \</div>

            \<div class="home-lesson-loading-content">

                \<div
                    class="
                        home-loading-line
                        home-loading-line-title
                    "
                \>\</div>

                \<div
                    class="
                        home-loading-line
                        home-loading-line-text
                    "
                \>\</div>

                \<div
                    class="
                        home-loading-line
                        home-loading-line-short
                    "
                \>\</div>

            \</div>

        \</div>
    \`;



    refreshHomeIcons();



    try {

        /\*
         \* ------------------------------------------------
         \* API CHECK
         \* ------------------------------------------------
         \*/

        if (
            !window\.API ||
            typeof window\.API.get !== "function"
        ) {

            throw new Error(
                "The API connection layer is not available."
            );

        }



        /\*
         \* ------------------------------------------------
         \* GET LESSONS
         \* ------------------------------------------------
         \*/

        const response =
            await window\.API.get(
                "getLessons"
            );



        /\*
         \* Support:
         \*
         \* { success: true, data: [...] }
         \*
         \* and:
         \*
         \* [...]
         \*/

        let lessonList =
            response &&
            response.data !== undefined
                ? response.data
                : response;



        if (!Array.isArray(lessonList)) {

            lessonList = [];

        }



        /\*
         \* ------------------------------------------------
         \* NO LESSON
         \* ------------------------------------------------
         \*/

        if (
            lessonList.length === 0
        ) {

            container.innerHTML = \`
                \<div class="empty-state">

                    \<div class="empty-state-icon">

                        \<span
                            data-lucide="book-open"
                        \>\</span>

                    \</div>

                    \<p>
                        No current lesson is available yet.
                    \</p>

                \</div>
            \`;



            refreshHomeIcons();

            return;

        }



        /\*
         \* ------------------------------------------------
         \* SORT LESSONS
         \* ------------------------------------------------
         \*
         \* Newest lesson first.
         \*/

        lessonList.sort(
            function (a, b) {

                const dateA =
                    new Date(
                        a.lesson\_date ||
                        a.published\_at ||
                        0
                    );



                const dateB =
                    new Date(
                        b.lesson\_date ||
                        b.published\_at ||
                        0
                    );



                return dateB - dateA;

            }
        );



        const lesson =
            lessonList[0];



        /\*
         \* ------------------------------------------------
         \* LESSON DATA
         \* ------------------------------------------------
         \*/

        const lessonId =
            escapeHomeHtml(
                lesson.lesson\_id ||
                ""
            );



        const title =
            escapeHomeHtml(
                lesson.title ||
                "Weekly Lesson"
            );



        const description =
            escapeHomeHtml(
                lesson.description ||
                "Open this week's lesson and continue learning."
            );



        const week =
            lesson.week\_number
                ? \`Week ${escapeHomeHtml(
                    lesson.week\_number
                )}\`
                : "Current Lesson";



        /\*
         \* ------------------------------------------------
         \* RENDER LESSON PREVIEW
         \* ------------------------------------------------
         \*/

        container.innerHTML = \`
            \<div class="home-lesson-preview">

                \<div class="home-lesson-preview-icon">

                    \<span
                        data-lucide="book-open"
                    \>\</span>

                \</div>



                \<div class="home-lesson-preview-content">

                    \<span
                        class="
                            home-lesson-preview-label
                        "
                    \>
                        ${week}
                    \</span>



                    \<h4>
                        ${title}
                    \</h4>



                    \<p>
                        ${description}
                    \</p>



                    \<button
                        type="button"
                        class="
                            home-lesson-preview-button
                        "
                        data-home-open-lesson="${lessonId}"
                    \>

                        \<span>
                            Start Reading
                        \</span>

                        \<span
                            data-lucide="arrow-right"
                        \>\</span>

                    \</button>

                \</div>

            \</div>
        \`;



        /\*
         \* ------------------------------------------------
         \* START READING BUTTON
         \* ------------------------------------------------
         \*/

        const button =
            container.querySelector(
                "[data-home-open-lesson]"
            );



        if (button) {

            button.addEventListener(
                "click",
                function () {

                    window\.location.href =
                        "pages/lessons.html";

                }
            );

        }



        refreshHomeIcons();



    } catch (error) {

        console.error(
            "AFC Portal: unable to load current lesson preview.",
            error
        );



        /\*
         \* ------------------------------------------------
         \* ERROR STATE
         \* ------------------------------------------------
         \*/

        container.innerHTML = \`
            \<div class="empty-state">

                \<div class="empty-state-icon">

                    \<span
                        data-lucide="wifi-off"
                    \>\</span>

                \</div>

                \<p>
                    Unable to load the current lesson.
                \</p>

                \<button
                    type="button"
                    class="text-link"
                    id="retryCurrentLesson"
                \>
                    Try Again
                \</button>

            \</div>
        \`;



        const retryButton =
            $("retryCurrentLesson");



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



/\* ========================================================
   LOGOUT
   \======================================================== \*/

async function performLogout() {

    /\*
     \* Prevent multiple logout requests.
     \*/

    if (performLogout.isRunning) {

        return;

    }



    performLogout.isRunning =
        true;



    /\*
     \* Close mobile navigation.
     \*/

    closeMobileMenu();



    /\*
     \* Find logout buttons.
     \*/

    const logoutButtons =
        document.querySelectorAll(
            "#sidebarLogoutButton, #heroLogoutButton, [data-logout]"
        );



    /\*
     \* Save original button contents.
     \*/

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



            button.innerHTML = \`
                \<span
                    class="button-spinner"
                    aria-hidden="true"
                \>\</span>

                \<span>
                    Logging out...
                \</span>
            \`;

        }
    );



    /\*
     \* Give the browser time to paint
     \* the loading state.
     \*/

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

        /\*
         \* ------------------------------------------------
         \* LOGOUT THROUGH CENTRAL AUTH SYSTEM
         \* ------------------------------------------------
         \*/

        if (
            window\.AUTH &&
            typeof window\.AUTH.logout === "function"
        ) {

            await window\.AUTH.logout();

        } else if (
            window\.AUTH &&
            typeof window\.AUTH.clear === "function"
        ) {

            window\.AUTH.clear();

        }



        /\*
         \* ------------------------------------------------
         \* UPDATE HOMEPAGE
         \* ------------------------------------------------
         \*/

        updatePersonalizedHome();



        /\*
         \* Small visual delay.
         \*/

        await new Promise(
            function (resolve) {

                setTimeout(
                    resolve,
                    350
                );

            }
        );



        /\*
         \* ------------------------------------------------
         \* RETURN TO HOME
         \* ------------------------------------------------
         \*/

        window\.location.replace(
            "index.html"
        );



    } catch (error) {

        console.error(
            "AFC Portal: logout failed.",
            error
        );



        /\*
         \* Restore buttons.
         \*/

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



/\* ========================================================
   LOGOUT BUTTONS
   \======================================================== \*/

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



/\* ========================================================
   AUTH EVENTS
   \======================================================== \*/

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

            window\.addEventListener(
                eventName,
                function () {

                    setTimeout(
                        updatePersonalizedHome,
                        50
                    );



                    /\*
                     \* Refresh lesson preview after
                     \* authentication changes.
                     \*/

                    setTimeout(
                        loadCurrentLessonPreview,
                        100
                    );

                }
            );

        }
    );



    /\*
     \* ----------------------------------------------------
     \* CROSS-TAB AUTHENTICATION
     \* ----------------------------------------------------
     \*/

    window\.addEventListener(
        "storage",
        function (event) {

            if (
                event.key ===
                    "afc\_isiu\_auth\_user" ||
                event.key ===
                    "afc\_isiu\_auth\_session"
            ) {

                updatePersonalizedHome();

                loadCurrentLessonPreview();

            }

        }
    );

}



/\* ========================================================
   INITIALIZE HOME
   \======================================================== \*/

async function initializeHome() {

    console.log(
        "AFC Portal: initializing homepage..."
    );



    /\*
     \* ----------------------------------------------------
     \* GLOBAL LOADER
     \* ----------------------------------------------------
     \*
     \* IMPORTANT:
     \*
     \* This is the ONLY global loader used by home.js.
     \*
     \* index.html must NOT contain another hard-coded
     \* global loader.
     \*/

    if (
        window\.AFC\_Loader &&
        typeof window\.AFC\_Loader.show === "function"
    ) {

        window\.AFC\_Loader.show(
            "Preparing your dashboard..."
        );

    }



    try {

        /\*
         \* ------------------------------------------------
         \* BASIC PAGE SETUP
         \* ------------------------------------------------
         \*/

        setupNavigation();

        setupLogoutButtons();

        setupAuthListeners();



        /\*
         \* ------------------------------------------------
         \* AUTHENTICATION
         \* ------------------------------------------------
         \*/

        updatePersonalizedHome();



        /\*
         \* ------------------------------------------------
         \* CURRENT LESSON
         \* ------------------------------------------------
         \*
         \* The lesson card has its OWN loading state.
         \*
         \* We deliberately DO NOT change the global
         \* loader message to "Loading this week's lesson..."
         \*/

        await loadCurrentLessonPreview();



        /\*
         \* ------------------------------------------------
         \* ICONS
         \* ------------------------------------------------
         \*/

        refreshHomeIcons();



        console.log(
            "AFC Portal: homepage initialized."
        );

    } catch (error) {

        console.error(
            "AFC Portal: homepage initialization failed.",
            error
        );

    } finally {

        /\*
         \* ------------------------------------------------
         \* HIDE GLOBAL LOADER
         \* ------------------------------------------------
         \*
         \* Always hide it, even if one homepage operation
         \* fails.
         \*/

        if (
            window\.AFC\_Loader &&
            typeof window\.AFC\_Loader.hide === "function"
        ) {

            window\.AFC\_Loader.hide();

        }

    }

}



/\* ========================================================
   DOM READY
   \======================================================== \*/

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



/\* ========================================================
   PUBLIC METHODS
   \======================================================== \*/

window\.openMobileMenu =
    openMobileMenu;



window\.closeMobileMenu =
    closeMobileMenu;



window\.toggleMobileMenu =
    toggleMobileMenu;



window\.updatePersonalizedHome =
    updatePersonalizedHome;



window\.loadCurrentLessonPreview =
    loadCurrentLessonPreview;
