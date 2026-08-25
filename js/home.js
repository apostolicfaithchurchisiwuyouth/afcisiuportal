/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL V2
 * FILE: home.js
 * PURPOSE: Unified Home Page Controller
 * ============================================================
 */

"use strict";


/* ============================================================
   1. HOME STATE
============================================================ */

const HOME_STATE = {

    authenticated: false,

    user: null,

    lesson: null,

    quiz: null,

    announcements: [],

    notifications: [],

    initialized: false

};


/* ============================================================
   2. DOM READY
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    initializeHome
);


/* ============================================================
   3. INITIALIZE
============================================================ */

async function initializeHome() {

    console.log(
        "AFC ISIU YOUTH PORTAL — HOME INITIALIZING"
    );


    HOME_STATE.authenticated =
        typeof AUTH !== "undefined" &&
        typeof AUTH.isAuthenticated === "function"
            ? AUTH.isAuthenticated()
            : false;


    HOME_STATE.user =
        HOME_STATE.authenticated &&
        typeof AUTH.getUser === "function"
            ? AUTH.getUser()
            : null;


    /*
     * Apply authentication mode.
     */

    applyHomeMode();


    /*
     * Setup navigation BEFORE loading data.
     */

    setupHomeEvents();


    /*
     * Public content.
     *
     * Lessons remain PUBLIC.
     */

    await loadPublicHomeData();


    /*
     * Member-only data.
     */

    if (
        HOME_STATE.authenticated
    ) {

        await loadMemberHomeData();

    }


    refreshIcons();


    HOME_STATE.initialized =
        true;


    console.log(
        "Home initialization complete."
    );

}


/* ============================================================
   4. APPLY HOME MODE
============================================================ */

function applyHomeMode() {

    const authenticated =
        HOME_STATE.authenticated;


    document.body.classList.toggle(
        "guest-mode",
        !authenticated
    );


    document.body.classList.toggle(
        "member-mode",
        authenticated
    );


    /*
     * Hero states.
     */

    const guestHero =
        document.getElementById(
            "guestHero"
        );


    const memberHero =
        document.getElementById(
            "memberHero"
        );


    if (guestHero) {

        guestHero.hidden =
            authenticated;

    }


    if (memberHero) {

        memberHero.hidden =
            !authenticated;

    }


    /*
     * Member dashboard.
     */

    const memberDashboard =
        document.getElementById(
            "memberDashboardContent"
        );


    if (memberDashboard) {

        memberDashboard.hidden =
            !authenticated;

    }


    /*
     * Guest information.
     */

    const guestInformation =
        document.getElementById(
            "guestInformation"
        );


    if (guestInformation) {

        guestInformation.hidden =
            authenticated;

    }


    /*
     * Member-only elements.
     */

    document
        .querySelectorAll(
            ".member-only"
        )
        .forEach(function(element) {

            element.hidden =
                !authenticated;

        });


    /*
     * Header account.
     */

    updateHeaderAccount();


    /*
     * Sidebar.
     */

    updateSidebarProfile();


    /*
     * Welcome section.
     */

    updateWelcomeSection();


    /*
     * Bottom account.
     */

    updateBottomAccount();


    /*
     * Page title is intentionally removed.
     *
     * The old centered:
     * AFC Isiu Youth
     * Home
     *
     * header is no longer used.
     */

}


/* ============================================================
   5. WELCOME SECTION
============================================================ */

function updateWelcomeSection() {

    const welcomeName =
        document.getElementById(
            "welcomeUserName"
        );


    if (
        HOME_STATE.authenticated &&
        HOME_STATE.user
    ) {

        if (welcomeName) {

            welcomeName.textContent =
                getFirstName() ||
                "Member";

        }

    }

}


/* ============================================================
   6. HEADER ACCOUNT
============================================================ */

function updateHeaderAccount() {

    const button =
        document.getElementById(
            "headerAccountButton"
        );


    const content =
        document.getElementById(
            "headerAvatarLetter"
        );


    if (
        !button ||
        !content
    ) {

        return;

    }


    if (
        HOME_STATE.authenticated &&
        HOME_STATE.user
    ) {

        /*
         * Member.
         */

        button.href =
            "pages/profile.html";

        button.setAttribute(
            "aria-label",
            "My profile"
        );

        button.classList.remove(
            "guest-account-avatar"
        );

        button.classList.add(
            "member-account-avatar"
        );


        renderAvatarContent(
            content,
            HOME_STATE.user
        );

    } else {

        /*
         * Guest.
         */

        button.href =
            "login.html";

        button.setAttribute(
            "aria-label",
            "Login"
        );

        button.classList.remove(
            "member-account-avatar"
        );

        button.classList.add(
            "guest-account-avatar"
        );


        content.innerHTML = `

            <span data-lucide="user-round"></span>

        `;

    }


    refreshIcons();

}


/* ============================================================
   7. RENDER AVATAR
============================================================ */

function renderAvatarContent(
    container,
    user
) {

    if (!container) {

        return;

    }


    const avatar =
        String(
            user.avatar_url ||
            user.avatar ||
            user.profile_image ||
            user.profile_image_url ||
            ""
        ).trim();


    if (avatar) {

        const safeAvatar =
            escapeHtml(
                avatar
            );


        container.innerHTML = `

            <img
                src="${safeAvatar}"
                alt="Profile"
                class="header-avatar-image"
            >

        `;


        return;

    }


    const firstName =
        String(
            user.first_name ||
            ""
        ).trim();


    const lastName =
        String(
            user.last_name ||
            ""
        ).trim();


    const firstLetter =
        (
            firstName ||
            lastName ||
            "M"
        )
            .charAt(0)
            .toUpperCase();


    container.textContent =
        firstLetter;

}


/* ============================================================
   8. SIDEBAR PROFILE
============================================================ */

function updateSidebarProfile() {

    const guest =
        document.getElementById(
            "sidebarGuest"
        );


    const member =
        document.getElementById(
            "sidebarMember"
        );


    const name =
        document.getElementById(
            "sidebarUserName"
        );


    const avatar =
        document.getElementById(
            "sidebarAvatar"
        );


    if (
        !HOME_STATE.authenticated
    ) {

        if (guest) {

            guest.hidden =
                false;

        }


        if (member) {

            member.hidden =
                true;

        }


        return;

    }


    if (guest) {

        guest.hidden =
            true;

    }


    if (member) {

        member.hidden =
            false;

    }


    if (name) {

        name.textContent =
            getDisplayName() ||
            "Member";

    }


    if (avatar) {

        const firstName =
            String(
                HOME_STATE.user?.first_name ||
                ""
            ).trim();


        avatar.textContent =
            (
                firstName ||
                "M"
            )
                .charAt(0)
                .toUpperCase();

    }

}


/* ============================================================
   9. BOTTOM ACCOUNT
============================================================ */

function updateBottomAccount() {

    const guest =
        document.getElementById(
            "guestBottomProfile"
        );


    const member =
        document.getElementById(
            "memberBottomProfile"
        );


    const avatar =
        document.getElementById(
            "bottomAvatar"
        );


    if (
        !HOME_STATE.authenticated
    ) {

        if (guest) {

            guest.hidden =
                false;

        }


        if (member) {

            member.hidden =
                true;

        }


        return;

    }


    if (guest) {

        guest.hidden =
            true;

    }


    if (member) {

        member.hidden =
            false;

    }


    if (
        avatar &&
        HOME_STATE.user
    ) {

        const avatarUrl =
            String(
                HOME_STATE.user.avatar_url ||
                HOME_STATE.user.avatar ||
                HOME_STATE.user.profile_image ||
                HOME_STATE.user.profile_image_url ||
                ""
            ).trim();


        if (avatarUrl) {

            avatar.innerHTML = `

                <img
                    src="${escapeHtml(avatarUrl)}"
                    alt="Profile"
                    class="bottom-avatar-image"
                >

            `;

        } else {

            const firstName =
                String(
                    HOME_STATE.user.first_name ||
                    ""
                ).trim();


            avatar.textContent =
                (
                    firstName ||
                    "M"
                )
                    .charAt(0)
                    .toUpperCase();

        }

    }


    refreshIcons();

}


/* ============================================================
   10. PUBLIC HOME DATA
============================================================ */

async function loadPublicHomeData() {

    await Promise.allSettled([

        loadCurrentLesson(),

        loadPublicAnnouncements()

    ]);

}


/* ============================================================
   11. MEMBER HOME DATA
============================================================ */

async function loadMemberHomeData() {

    await Promise.allSettled([

        loadQuizStatus(),

        loadNotifications()

    ]);

}


/* ============================================================
   12. CURRENT LESSON
============================================================ */

async function loadCurrentLesson() {

    const container =
        document.getElementById(
            "currentLesson"
        );


    if (!container) {

        return;

    }


    try {

        const result =
            await API.get(
                "getlessons"
            );


        const lessons =
            extractArray(
                result,
                [
                    "lessons",
                    "data",
                    "items"
                ]
            );


        if (!lessons.length) {

            renderEmptyLesson(
                container
            );

            return;

        }


        HOME_STATE.lesson =
            lessons[0];


        renderCurrentLesson(
            container,
            HOME_STATE.lesson
        );

    } catch (error) {

        console.error(
            "Unable to load current lesson:",
            error
        );


        renderEmptyLesson(
            container,
            "Unable to load the current lesson."
        );

    }

}


/* ============================================================
   13. RENDER LESSON
============================================================ */

function renderCurrentLesson(
    container,
    lesson
) {

    const title =
        escapeHtml(
            lesson.title ||
            lesson.lesson_title ||
            lesson.name ||
            "Weekly Lesson"
        );


    const lessonNumber =
        escapeHtml(
            lesson.lesson_number ||
            lesson.week ||
            ""
        );


    const description =
        escapeHtml(
            lesson.description ||
            lesson.summary ||
            ""
        );


    container.innerHTML = `

        <div class="home-content-preview">

            <div class="home-preview-icon purple">

                <span data-lucide="book-open"></span>

            </div>

            <div class="home-preview-content">

                ${
                    lessonNumber
                        ? `
                            <span class="preview-meta">
                                Lesson ${lessonNumber}
                            </span>
                        `
                        : ""
                }

                <h4>
                    ${title}
                </h4>

                ${
                    description
                        ? `
                            <p>
                                ${description}
                            </p>
                        `
                        : ""
                }

            </div>

        </div>

    `;


    refreshIcons();

}


/* ============================================================
   14. EMPTY LESSON
============================================================ */

function renderEmptyLesson(
    container,
    message =
        "Your current lesson will appear here."
) {

    container.innerHTML = `

        <div class="empty-state">

            <div class="empty-state-icon">

                <span data-lucide="book-open"></span>

            </div>

            <p>
                ${escapeHtml(message)}
            </p>

        </div>

    `;


    refreshIcons();

}


/* ============================================================
   15. ANNOUNCEMENTS
============================================================ */

async function loadPublicAnnouncements() {

    const container =
        document.getElementById(
            "notificationPreview"
        );


    try {

        const result =
            await API.get(
                "getannouncements"
            );


        HOME_STATE.announcements =
            extractArray(
                result,
                [
                    "announcements",
                    "data",
                    "items"
                ]
            );


        /*
         * Only display this preview for
         * the member dashboard.
         */

        if (
            HOME_STATE.authenticated
        ) {

            renderAnnouncementsPreview(
                container,
                HOME_STATE.announcements
            );

        }

    } catch (error) {

        console.warn(
            "Unable to load announcements:",
            error
        );

    }

}


/* ============================================================
   16. ANNOUNCEMENT PREVIEW
============================================================ */

function renderAnnouncementsPreview(
    container,
    announcements
) {

    if (!container) {

        return;

    }


    if (
        !announcements ||
        !announcements.length
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">

                    <span data-lucide="bell"></span>

                </div>

                <p>
                    No new updates at the moment.
                </p>

            </div>

        `;

        refreshIcons();

        return;

    }


    container.innerHTML =
        announcements
            .slice(0, 3)
            .map(function(item) {

                const title =
                    escapeHtml(
                        item.title ||
                        item.name ||
                        "Announcement"
                    );


                const message =
                    escapeHtml(
                        item.message ||
                        item.description ||
                        ""
                    );


                const date =
                    formatDisplayDate(
                        item.created_at ||
                        item.date ||
                        ""
                    );


                return `

                    <article class="home-notification-item">

                        <div class="home-notification-icon">

                            <span data-lucide="megaphone"></span>

                        </div>

                        <div class="home-notification-content">

                            <strong>
                                ${title}
                            </strong>

                            ${
                                message
                                    ? `
                                        <p>
                                            ${message}
                                        </p>
                                    `
                                    : ""
                            }

                            ${
                                date
                                    ? `
                                        <small>
                                            ${date}
                                        </small>
                                    `
                                    : ""
                            }

                        </div>

                    </article>

                `;

            })
            .join("");


    refreshIcons();

}


/* ============================================================
   17. QUIZ STATUS
============================================================ */

async function loadQuizStatus() {

    const container =
        document.getElementById(
            "quizSummary"
        );


    if (!container) {

        return;

    }


    if (!HOME_STATE.authenticated) {

        return;

    }


    try {

        const result =
            await API.get(
                "getquizstatus",
                {

                    user_id:
                        getUserId(),

                    token:
                        getToken()

                }
            );


        HOME_STATE.quiz =
            result;


        renderQuizSummary(
            container,
            result
        );

    } catch (error) {

        console.error(
            "Unable to load quiz status:",
            error
        );


        renderQuizError(
            container
        );

    }

}


/* ============================================================
   18. QUIZ SUMMARY
============================================================ */

function renderQuizSummary(
    container,
    result
) {

    const data =
        result?.data ||
        result ||
        {};


    const status =
        String(
            data.status ||
            data.quiz_status ||
            ""
        ).toLowerCase();


    const quiz =
        data.quiz ||
        data.current_quiz ||
        null;


    const title =
        escapeHtml(
            quiz?.title ||
            "Weekly Quiz"
        );


    if (
        status === "open" ||
        status === "available" ||
        status === "published"
    ) {

        container.innerHTML = `

            <div class="home-content-preview">

                <div class="home-preview-icon orange">

                    <span data-lucide="trophy"></span>

                </div>

                <div class="home-preview-content">

                    <span class="preview-meta">
                        Available now
                    </span>

                    <h4>
                        ${title}
                    </h4>

                    <p>
                        Your weekly challenge is ready.
                    </p>

                </div>

            </div>

        `;

    } else if (
        status === "completed" ||
        status === "submitted"
    ) {

        container.innerHTML = `

            <div class="home-content-preview">

                <div class="home-preview-icon green">

                    <span data-lucide="circle-check"></span>

                </div>

                <div class="home-preview-content">

                    <span class="preview-meta">
                        Completed
                    </span>

                    <h4>
                        Quiz completed
                    </h4>

                    <p>
                        You have already submitted this week's quiz.
                    </p>

                </div>

            </div>

        `;

    } else {

        container.innerHTML = `

            <div class="home-content-preview">

                <div class="home-preview-icon purple">

                    <span data-lucide="clock-3"></span>

                </div>

                <div class="home-preview-content">

                    <span class="preview-meta">
                        Weekly Challenge
                    </span>

                    <h4>
                        No active quiz
                    </h4>

                    <p>
                        Check back when the next quiz is released.
                    </p>

                </div>

            </div>

        `;

    }


    refreshIcons();

}


/* ============================================================
   19. QUIZ ERROR
============================================================ */

function renderQuizError(
    container
) {

    container.innerHTML = `

        <div class="empty-state">

            <div class="empty-state-icon">

                <span data-lucide="circle-alert"></span>

            </div>

            <p>
                We could not check your quiz status.
            </p>

        </div>

    `;


    refreshIcons();

}


/* ============================================================
   20. NOTIFICATIONS
============================================================ */

async function loadNotifications() {

    if (!HOME_STATE.authenticated) {

        return;

    }


    try {

        const result =
            await API.get(
                "getnotifications",
                {

                    token:
                        getToken(),

                    user_id:
                        getUserId()

                }
            );


        const data =
            result?.data ||
            result ||
            {};


        HOME_STATE.notifications =
            Array.isArray(
                data.notifications
            )
                ? data.notifications
                : Array.isArray(result)
                    ? result
                    : [];


        updateNotificationBadges(
            Number(
                data.unreadCount ||
                result?.unreadCount ||
                0
            )
        );


        if (
            HOME_STATE.notifications.length
        ) {

            renderMemberNotificationPreview(

                document.getElementById(
                    "notificationPreview"
                ),

                HOME_STATE.notifications

            );

        }

    } catch (error) {

        console.warn(
            "Unable to load notifications:",
            error
        );

    }

}


/* ============================================================
   21. MEMBER NOTIFICATION PREVIEW
============================================================ */

function renderMemberNotificationPreview(
    container,
    notifications
) {

    if (!container || !notifications.length) {

        return;

    }


    container.innerHTML =
        notifications
            .slice(0, 3)
            .map(function(item) {

                const title =
                    escapeHtml(
                        item.title ||
                        item.name ||
                        "Notification"
                    );


                const message =
                    escapeHtml(
                        item.message ||
                        item.description ||
                        ""
                    );


                return `

                    <article class="home-notification-item">

                        <div class="home-notification-icon">

                            <span data-lucide="bell"></span>

                        </div>

                        <div class="home-notification-content">

                            <strong>
                                ${title}
                            </strong>

                            ${
                                message
                                    ? `
                                        <p>
                                            ${message}
                                        </p>
                                    `
                                    : ""
                            }

                        </div>

                    </article>

                `;

            })
            .join("");


    refreshIcons();

}


/* ============================================================
   22. BADGES
============================================================ */

function updateNotificationBadges(
    count
) {

    const badges = [

        document.getElementById(
            "desktopNotificationBadge"
        ),

    ];


    const dot =
        document.getElementById(
            "headerNotificationDot"
        );


    badges.forEach(function(badge) {

        if (!badge) {

            return;

        }


        badge.hidden =
            count <= 0;


        if (count > 0) {

            badge.textContent =
                count > 99
                    ? "99+"
                    : String(count);

        }

    });


    if (dot) {

        dot.hidden =
            count <= 0;

    }

}


/* ============================================================
   23. HOME EVENTS
============================================================ */

function setupHomeEvents() {

    /*
     * Prevent duplicate listeners if HOME.refresh()
     * is called again.
     */

    if (
        document.body.dataset.homeEventsReady ===
        "true"
    ) {

        return;

    }


    document.body.dataset.homeEventsReady =
        "true";


    /* ========================================================
       HAMBURGER MENU
    ======================================================== */

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
        menuButton &&
        sidebar
    ) {

        menuButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();


                const isOpen =
                    sidebar.classList.contains(
                        "open"
                    );


                if (isOpen) {

                    closeMobileMenu();

                } else {

                    openMobileMenu();

                }

            }
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            function() {

                closeMobileMenu();

            }
        );

    }


    /*
     * Close menu when a sidebar link is selected.
     */

    document
        .querySelectorAll(
            ".sidebar .nav-item"
        )
        .forEach(function(item) {

            item.addEventListener(
                "click",
                function() {

                    closeMobileMenu();

                }
            );

        });


    /*
     * Sidebar logout.
     */

    const sidebarLogout =
        document.getElementById(
            "sidebarLogoutButton"
        );


    if (sidebarLogout) {

        sidebarLogout.addEventListener(
            "click",
            function() {

                handleHomeLogout(
                    sidebarLogout
                );

            }
        );

    }


    /*
     * Hero logout.
     */

    const heroLogout =
        document.getElementById(
            "heroLogoutButton"
        );


    if (heroLogout) {

        heroLogout.addEventListener(
            "click",
            function() {

                handleHomeLogout(
                    heroLogout
                );

            }
        );

    }


    /*
     * Handle dynamically-created logout button
     * if one exists.
     */

    document.addEventListener(
        "click",
        function(event) {

            const button =
                event.target.closest(
                    "#homeLogoutButton"
                );


            if (!button) {

                return;

            }


            event.preventDefault();


            handleHomeLogout(
                button
            );

        }
    );


    /*
     * Close sidebar when Escape is pressed.
     */

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape"
            ) {

                closeMobileMenu();

            }

        }
    );

}


/* ============================================================
   24. OPEN MOBILE MENU
============================================================ */

function openMobileMenu() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );


    const overlay =
        document.getElementById(
            "mobileOverlay"
        );


    const menuButton =
        document.getElementById(
            "mobileMenuButton"
        );


    if (sidebar) {

        sidebar.classList.add(
            "open"
        );

    }


    if (overlay) {

        overlay.classList.add(
            "active"
        );

    }


    if (menuButton) {

        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );

        menuButton.setAttribute(
            "aria-label",
            "Close navigation menu"
        );

    }


    document.body.classList.add(
        "mobile-menu-open"
    );

}


/* ============================================================
   25. CLOSE MOBILE MENU
============================================================ */

function closeMobileMenu() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );


    const overlay =
        document.getElementById(
            "mobileOverlay"
        );


    const menuButton =
        document.getElementById(
            "mobileMenuButton"
        );


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


    if (menuButton) {

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

    }


    document.body.classList.remove(
        "mobile-menu-open"
    );

}


/* ============================================================
   26. LOGOUT
============================================================ */

async function handleHomeLogout(
    button
) {

    if (
        button &&
        button.dataset.loggingOut ===
        "true"
    ) {

        return;

    }


    if (button) {

        button.dataset.loggingOut =
            "true";

        button.disabled =
            true;

        button.innerHTML = `

            <span
                data-lucide="loader-circle"
                class="spin"
            ></span>

            <span>
                Logging out...
            </span>

        `;

        refreshIcons();

    }


    try {

        if (
            typeof AUTH !== "undefined" &&
            typeof AUTH.logout === "function"
        ) {

            await AUTH.logout();

        } else if (
            typeof AUTH !== "undefined" &&
            typeof AUTH.clear === "function"
        ) {

            AUTH.clear();

        }

    } catch (error) {

        console.warn(
            "Logout request failed:",
            error
        );


        if (
            typeof AUTH !== "undefined" &&
            typeof AUTH.clear === "function"
        ) {

            AUTH.clear();

        }

    }


    window.location.href =
        "index.html";

}


/* ============================================================
   27. HELPERS
============================================================ */

function getFirstName() {

    if (
        typeof AUTH !== "undefined" &&
        typeof AUTH.getFirstName === "function"
    ) {

        return AUTH.getFirstName() || "";

    }


    return String(
        HOME_STATE.user?.first_name ||
        ""
    ).trim();

}


function getDisplayName() {

    if (
        typeof AUTH !== "undefined" &&
        typeof AUTH.getDisplayName === "function"
    ) {

        return AUTH.getDisplayName() || "";

    }


    const first =
        String(
            HOME_STATE.user?.first_name ||
            ""
        ).trim();


    const last =
        String(
            HOME_STATE.user?.last_name ||
            ""
        ).trim();


    return (
        first +
        (
            last
                ? " " + last
                : ""
        )
    ).trim();

}


function getUserId() {

    if (
        typeof AUTH !== "undefined" &&
        typeof AUTH.getUserId === "function"
    ) {

        return AUTH.getUserId() || "";

    }


    return String(
        HOME_STATE.user?.user_id ||
        ""
    );

}


function getToken() {

    if (
        typeof AUTH !== "undefined" &&
        typeof AUTH.getToken === "function"
    ) {

        return AUTH.getToken() || "";

    }


    return "";

}


/* ============================================================
   28. EXTRACT ARRAY
============================================================ */

function extractArray(
    result,
    possibleKeys
) {

    if (
        Array.isArray(result)
    ) {

        return result;

    }


    if (
        !result ||
        typeof result !== "object"
    ) {

        return [];

    }


    for (
        let i = 0;
        i < possibleKeys.length;
        i++
    ) {

        const key =
            possibleKeys[i];


        if (
            Array.isArray(
                result[key]
            )
        ) {

            return result[key];

        }


        if (
            result.data &&
            Array.isArray(
                result.data[key]
            )
        ) {

            return result.data[key];

        }

    }


    return [];

}


/* ============================================================
   29. DATE
============================================================ */

function formatDisplayDate(
    value
) {

    if (!value) {

        return "";

    }


    const date =
        new Date(value);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "";

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


/* ============================================================
   30. ESCAPE HTML
============================================================ */

function escapeHtml(
    value
) {

    return String(
        value === undefined ||
        value === null
            ? ""
            : value
    )
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ============================================================
   31. ICONS
============================================================ */

function refreshIcons() {

    try {

        if (
            window.lucide &&
            typeof lucide.createIcons ===
                "function"
        ) {

            lucide.createIcons();

        }

    } catch (error) {

        console.warn(
            "Unable to refresh icons:",
            error
        );

    }

}


/* ============================================================
   32. GLOBAL HOME OBJECT
============================================================ */

window.HOME = {

    state:
        HOME_STATE,

    refresh:
        initializeHome,

    refreshAuthMode:
        applyHomeMode,

    loadLesson:
        loadCurrentLesson,

    loadQuiz:
        loadQuizStatus,

    loadNotifications:
        loadNotifications,

    logout:
        handleHomeLogout,

    openMenu:
        openMobileMenu,

    closeMenu:
        closeMobileMenu

};


console.log(
    "AFC Isiu Youth Portal — home.js loaded."
);
