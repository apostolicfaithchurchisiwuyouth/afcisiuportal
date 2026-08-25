/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   HOME PAGE CONTROLLER
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ============================================================
       1. ELEMENT REFERENCES
    ============================================================ */

    const sidebar = document.getElementById("sidebar");
    const mobileMenuButton = document.getElementById("mobileMenuButton");
    const mobileOverlay = document.getElementById("mobileOverlay");

    const sidebarGuest = document.getElementById("sidebarGuest");
    const sidebarMember = document.getElementById("sidebarMember");

    const sidebarAvatar = document.getElementById("sidebarAvatar");
    const sidebarUserName = document.getElementById("sidebarUserName");

    const sidebarLogoutButton =
        document.getElementById("sidebarLogoutButton");

    const heroLogoutButton =
        document.getElementById("heroLogoutButton");

    const guestHeaderActions =
        document.getElementById("guestHeaderActions");

    const memberHeaderActions =
        document.getElementById("memberHeaderActions");

    const guestHero =
        document.getElementById("guestHero");

    const memberHero =
        document.getElementById("memberHero");

    const welcomeUserName =
        document.getElementById("welcomeUserName");

    const memberDashboardContent =
        document.getElementById("memberDashboardContent");

    const guestInformation =
        document.getElementById("guestInformation");

    const headerAvatarLetter =
        document.getElementById("headerAvatarLetter");

    const desktopNotificationBadge =
        document.getElementById("desktopNotificationBadge");

    const headerNotificationDot =
        document.getElementById("headerNotificationDot");


    /* ============================================================
       2. MOBILE SIDEBAR
    ============================================================ */

    function openMobileMenu() {

        if (!sidebar) return;

        sidebar.classList.add("open");

        if (mobileOverlay) {
            mobileOverlay.classList.add("active");
        }

        document.body.classList.add("mobile-menu-open");

        if (mobileMenuButton) {
            mobileMenuButton.setAttribute(
                "aria-expanded",
                "true"
            );
        }
    }


    function closeMobileMenu() {

        if (!sidebar) return;

        sidebar.classList.remove("open");

        if (mobileOverlay) {
            mobileOverlay.classList.remove("active");
        }

        document.body.classList.remove("mobile-menu-open");

        if (mobileMenuButton) {
            mobileMenuButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    }


    function toggleMobileMenu() {

        if (!sidebar) return;

        if (sidebar.classList.contains("open")) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }


    /* ============================================================
       3. HAMBURGER BUTTON
    ============================================================ */

    if (mobileMenuButton) {

        mobileMenuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileMenuButton.setAttribute(
            "aria-controls",
            "sidebar"
        );

        mobileMenuButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                toggleMobileMenu();

            }
        );

    }


    /* ============================================================
       4. OVERLAY CLOSE
    ============================================================ */

    if (mobileOverlay) {

        mobileOverlay.addEventListener(
            "click",
            function () {

                closeMobileMenu();

            }
        );

    }


    /* ============================================================
       5. CLOSE MENU WITH ESCAPE
    ============================================================ */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeMobileMenu();

            }

        }
    );


    /* ============================================================
       6. CLOSE MENU AFTER CLICKING A SIDEBAR LINK
    ============================================================ */

    if (sidebar) {

        const sidebarLinks =
            sidebar.querySelectorAll("a");

        sidebarLinks.forEach((link) => {

            link.addEventListener(
                "click",
                function () {

                    closeMobileMenu();

                }
            );

        });

    }


    /* ============================================================
       7. AUTH STATE HELPERS
    ============================================================ */

    function getCurrentUser() {

        /*
         * The portal may expose the authenticated user through
         * different objects depending on the current auth build.
         *
         * We check the common locations without breaking if one
         * does not exist.
         */

        try {

            if (
                window.AuthState &&
                typeof window.AuthState.getUser === "function"
            ) {

                return window.AuthState.getUser();

            }

        } catch (error) {

            console.warn(
                "AuthState.getUser() could not be read:",
                error
            );

        }


        try {

            if (
                window.authState &&
                typeof window.authState.getUser === "function"
            ) {

                return window.authState.getUser();

            }

        } catch (error) {

            console.warn(
                "authState.getUser() could not be read:",
                error
            );

        }


        try {

            if (
                window.AUTH_STATE &&
                window.AUTH_STATE.user
            ) {

                return window.AUTH_STATE.user;

            }

        } catch (error) {

            console.warn(
                "AUTH_STATE could not be read:",
                error
            );

        }


        return null;
    }


    function isLoggedIn() {

        const user = getCurrentUser();

        if (!user) {
            return false;
        }

        if (
            user.isAuthenticated === false ||
            user.authenticated === false
        ) {
            return false;
        }

        return true;
    }


    /* ============================================================
       8. USER NAME HELPERS
    ============================================================ */

    function getUserFirstName(user) {

        if (!user) {
            return "Friend";
        }


        if (user.firstName) {
            return String(user.firstName).trim();
        }


        if (user.firstname) {
            return String(user.firstname).trim();
        }


        if (user.first_name) {
            return String(user.first_name).trim();
        }


        if (user.name) {

            return String(user.name)
                .trim()
                .split(/\s+/)[0];

        }


        if (user.fullName) {

            return String(user.fullName)
                .trim()
                .split(/\s+/)[0];

        }


        if (user.full_name) {

            return String(user.full_name)
                .trim()
                .split(/\s+/)[0];

        }


        return "Friend";
    }


    function getUserInitial(user) {

        const firstName =
            getUserFirstName(user);

        if (
            firstName &&
            firstName !== "Friend"
        ) {

            return firstName
                .charAt(0)
                .toUpperCase();

        }


        if (user && user.name) {

            return String(user.name)
                .trim()
                .charAt(0)
                .toUpperCase();

        }


        return "A";
    }


    function getUserAvatar(user) {

        if (!user) {
            return "";
        }


        return (
            user.avatar ||
            user.avatarUrl ||
            user.avatarURL ||
            user.profileImage ||
            user.profileImageUrl ||
            user.photoURL ||
            user.photoUrl ||
            user.image ||
            ""
        );

    }


    /* ============================================================
       9. CREATE / UPDATE HEADER AVATAR
    ============================================================ */

    function updateHeaderAvatar(user) {

        if (!headerAvatarLetter) {
            return;
        }


        const avatar =
            getUserAvatar(user);


        if (avatar) {

            /*
             * Keep the existing circular header-avatar element.
             * Only replace its contents.
             */

            headerAvatarLetter.innerHTML = "";

            const image =
                document.createElement("img");

            image.src = avatar;

            image.alt =
                `${getUserFirstName(user)} profile picture`;

            image.className =
                "header-avatar-image";

            image.onerror = function () {

                this.remove();

                headerAvatarLetter.textContent =
                    getUserInitial(user);

            };


            headerAvatarLetter.appendChild(image);

        } else {

            headerAvatarLetter.innerHTML = "";

            headerAvatarLetter.textContent =
                getUserInitial(user);

        }

    }


    /* ============================================================
       10. SIDEBAR PROFILE
    ============================================================ */

    function updateSidebarProfile(user) {

        if (sidebarUserName) {

            sidebarUserName.textContent =
                getUserFirstName(user);

        }


        if (!sidebarAvatar) {
            return;
        }


        const avatar =
            getUserAvatar(user);


        if (avatar) {

            sidebarAvatar.innerHTML = "";

            const image =
                document.createElement("img");

            image.src = avatar;

            image.alt =
                `${getUserFirstName(user)} profile picture`;

            image.style.width = "100%";
            image.style.height = "100%";
            image.style.objectFit = "cover";
            image.style.borderRadius = "50%";

            image.onerror = function () {

                this.remove();

                sidebarAvatar.textContent =
                    getUserInitial(user);

            };


            sidebarAvatar.appendChild(image);

        } else {

            sidebarAvatar.innerHTML = "";

            sidebarAvatar.textContent =
                getUserInitial(user);

        }

    }


    /* ============================================================
       11. BOTTOM NAVIGATION
    ============================================================ */

    function updateBottomNavigation(user) {

        const bottomNav =
            document.querySelector(
                ".bottom-navigation"
            );

        if (!bottomNav) {
            return;
        }


        /*
         * The fifth position is always present.
         *
         * Guest:
         *     Guest icon
         *
         * Member:
         *     Circular avatar / initial
         */

        const profileItem =
            bottomNav.querySelector(
                ".bottom-nav-profile"
            ) ||
            bottomNav.querySelector(
                'a[href*="profile.html"]'
            );


        if (!profileItem) {
            return;
        }


        let avatar =
            profileItem.querySelector(
                ".bottom-nav-avatar"
            );


        let icon =
            profileItem.querySelector(
                ".bottom-nav-icon"
            );


        let label =
            profileItem.querySelector(
                ".bottom-nav-label"
            );


        /* --------------------------------------------------------
           MEMBER
        -------------------------------------------------------- */

        if (user) {

            if (!avatar) {

                avatar =
                    document.createElement("span");

                avatar.className =
                    "bottom-nav-avatar";

                profileItem.insertBefore(
                    avatar,
                    label || null
                );

            }


            if (icon) {

                icon.style.display = "none";

            }


            const imageUrl =
                getUserAvatar(user);


            avatar.innerHTML = "";


            if (imageUrl) {

                const image =
                    document.createElement("img");

                image.src = imageUrl;

                image.alt =
                    `${getUserFirstName(user)} profile picture`;

                image.className =
                    "bottom-avatar-image";

                image.onerror = function () {

                    this.remove();

                    avatar.textContent =
                        getUserInitial(user);

                };


                avatar.appendChild(image);

            } else {

                avatar.textContent =
                    getUserInitial(user);

            }


            if (label) {

                label.textContent =
                    "Profile";

            }

            return;
        }


        /* --------------------------------------------------------
           GUEST
        -------------------------------------------------------- */

        if (avatar) {

            avatar.remove();

        }


        if (icon) {

            icon.style.display = "flex";

            icon.setAttribute(
                "data-lucide",
                "user-round"
            );

        } else {

            icon =
                document.createElement("span");

            icon.className =
                "bottom-nav-icon";

            icon.setAttribute(
                "data-lucide",
                "user-round"
            );

            profileItem.insertBefore(
                icon,
                label || null
            );

        }


        if (label) {

            label.textContent =
                "Guest";

        }


        /*
         * Rebuild Lucide icons after dynamically adding
         * the guest icon.
         */

        if (
            window.lucide &&
            typeof window.lucide.createIcons === "function"
        ) {

            window.lucide.createIcons();

        }

    }


    /* ============================================================
       12. UPDATE HEADER
    ============================================================ */

    function updateHeader(user) {

        if (user) {

            if (guestHeaderActions) {
                guestHeaderActions.hidden = true;
            }

            if (memberHeaderActions) {
                memberHeaderActions.hidden = false;
            }

            updateHeaderAvatar(user);

        } else {

            if (guestHeaderActions) {
                guestHeaderActions.hidden = false;
            }

            if (memberHeaderActions) {
                memberHeaderActions.hidden = true;
            }

        }

    }


    /* ============================================================
       13. UPDATE HERO
    ============================================================ */

    function updateHero(user) {

        if (user) {

            if (guestHero) {
                guestHero.hidden = true;
            }

            if (memberHero) {
                memberHero.hidden = false;
            }

            if (welcomeUserName) {

                welcomeUserName.textContent =
                    getUserFirstName(user);

            }

        } else {

            if (guestHero) {
                guestHero.hidden = false;
            }

            if (memberHero) {
                memberHero.hidden = true;
            }

        }

    }


    /* ============================================================
       14. UPDATE DASHBOARD
    ============================================================ */

    function updateDashboard(user) {

        if (memberDashboardContent) {

            memberDashboardContent.hidden =
                !user;

        }


        if (guestInformation) {

            guestInformation.hidden =
                !!user;

        }

    }


    /* ============================================================
       15. MEMBER-ONLY ELEMENTS
    ============================================================ */

    function updateMemberOnlyElements(user) {

        const memberOnlyElements =
            document.querySelectorAll(
                ".member-only"
            );


        memberOnlyElements.forEach(
            (element) => {

                /*
                 * Keep lessons, gallery and quiz accessible
                 * to guests.
                 *
                 * Only elements explicitly marked
                 * .member-only require authentication.
                 */

                element.hidden =
                    !user;

            }
        );

    }


    /* ============================================================
       16. NOTIFICATION STATE
    ============================================================ */

    function updateNotificationState() {

        /*
         * Notification data can be added later.
         *
         * For now we simply preserve the existing hidden state
         * instead of displaying a false notification count.
         */

        if (desktopNotificationBadge) {

            desktopNotificationBadge.hidden = true;

        }

        if (headerNotificationDot) {

            headerNotificationDot.hidden = true;

        }

    }


    /* ============================================================
       17. APPLY COMPLETE HOME STATE
    ============================================================ */

    function applyHomeState() {

        const user =
            isLoggedIn()
                ? getCurrentUser()
                : null;


        updateHeader(user);

        updateHero(user);

        updateDashboard(user);

        updateMemberOnlyElements(user);

        updateSidebarProfile(user);

        updateBottomNavigation(user);

        updateNotificationState();


        if (user) {

            if (sidebarGuest) {
                sidebarGuest.hidden = true;
            }

            if (sidebarMember) {
                sidebarMember.hidden = false;
            }

        } else {

            if (sidebarGuest) {
                sidebarGuest.hidden = false;
            }

            if (sidebarMember) {
                sidebarMember.hidden = true;
            }

        }


        /*
         * Recreate all Lucide icons after any dynamic changes.
         */

        if (
            window.lucide &&
            typeof window.lucide.createIcons === "function"
        ) {

            window.lucide.createIcons();

        }

    }


    /* ============================================================
       18. LOGOUT
    ============================================================ */

    async function handleLogout(button) {

        if (!button) {
            return;
        }


        const originalHTML =
            button.innerHTML;


        button.disabled = true;


        try {

            button.innerHTML = `
                <span data-lucide="loader-circle"></span>
                <span>Logging out...</span>
            `;


            if (
                window.lucide &&
                typeof window.lucide.createIcons === "function"
            ) {

                window.lucide.createIcons();

            }


            let logoutResult = null;


            /*
             * Try the known authentication functions.
             */

            if (
                window.Auth &&
                typeof window.Auth.logout === "function"
            ) {

                logoutResult =
                    await window.Auth.logout();

            }

            else if (
                window.auth &&
                typeof window.auth.logout === "function"
            ) {

                logoutResult =
                    await window.auth.logout();

            }

            else if (
                window.AuthState &&
                typeof window.AuthState.logout === "function"
            ) {

                logoutResult =
                    await window.AuthState.logout();

            }

            else if (
                window.logoutUser &&
                typeof window.logoutUser === "function"
            ) {

                logoutResult =
                    await window.logoutUser();

            }


            /*
             * Give the authentication system a moment to
             * update its state.
             */

            await new Promise(
                (resolve) =>
                    setTimeout(resolve, 250)
            );


            applyHomeState();

            closeMobileMenu();


            /*
             * If the authentication system returned a redirect,
             * respect it.
             */

            if (
                logoutResult &&
                typeof logoutResult === "object" &&
                logoutResult.redirect
            ) {

                window.location.href =
                    logoutResult.redirect;

                return;

            }

        } catch (error) {

            console.error(
                "Logout failed:",
                error
            );

            /*
             * Restore button instead of leaving it
             * permanently disabled.
             */

            button.innerHTML =
                originalHTML;

            button.disabled = false;


            if (
                window.lucide &&
                typeof window.lucide.createIcons === "function"
            ) {

                window.lucide.createIcons();

            }

            return;

        }


        button.innerHTML =
            originalHTML;

        button.disabled = false;


        if (
            window.lucide &&
            typeof window.lucide.createIcons === "function"
        ) {

            window.lucide.createIcons();

        }

    }


    /* ============================================================
       19. LOGOUT BUTTONS
    ============================================================ */

    if (sidebarLogoutButton) {

        sidebarLogoutButton.addEventListener(
            "click",
            function () {

                handleLogout(
                    sidebarLogoutButton
                );

            }
        );

    }


    if (heroLogoutButton) {

        heroLogoutButton.addEventListener(
            "click",
            function () {

                handleLogout(
                    heroLogoutButton
                );

            }
        );

    }


    /* ============================================================
       20. AUTH STATE LISTENER
    ============================================================ */

    function listenForAuthChanges() {

        /*
         * Support several possible event names used by the
         * authentication system.
         */

        const events = [
            "authStateChanged",
            "auth-state-changed",
            "authchange",
            "userLoggedIn",
            "userLoggedOut"
        ];


        events.forEach((eventName) => {

            window.addEventListener(
                eventName,
                function () {

                    applyHomeState();

                }
            );

        });

    }


    listenForAuthChanges();


    /* ============================================================
       21. STORAGE AUTH CHANGE
    ============================================================ */

    window.addEventListener(
        "storage",
        function (event) {

            /*
             * If another tab changes authentication,
             * refresh the home state.
             */

            if (
                event.key &&
                (
                    event.key.toLowerCase().includes("auth") ||
                    event.key.toLowerCase().includes("user") ||
                    event.key.toLowerCase().includes("token")
                )
            ) {

                applyHomeState();

            }

        }
    );


    /* ============================================================
       22. INITIAL STATE
    ============================================================ */

    applyHomeState();


    /* ============================================================
       23. SECOND AUTH CHECK
    ============================================================ */

    /*
     * auth-state.js may finish restoring the session slightly
     * after DOMContentLoaded. A second check prevents the home
     * page from temporarily showing the guest state.
     */

    setTimeout(
        function () {

            applyHomeState();

        },
        150
    );


    setTimeout(
        function () {

            applyHomeState();

        },
        600
    );


    /* ============================================================
       24. FINAL LUCIDE INITIALIZATION
    ============================================================ */

    if (
        window.lucide &&
        typeof window.lucide.createIcons === "function"
    ) {

        window.lucide.createIcons();

    }

});
