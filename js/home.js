/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL V2
 * FILE: home.js
 * PURPOSE: Unified Home Page Controller
 * ============================================================
 *
 * IMPORTANT:
 * ------------------------------------------------------------
 * index.html is BOTH:
 *
 * 1. The public/guest homepage
 * 2. The authenticated member homepage
 *
 * There is NO separate dashboard.html.
 *
 * Guest:
 *   - Public welcome
 *   - Login
 *   - Create Account
 *   - Public content
 *
 * Authenticated Member:
 *   - Personalized welcome
 *   - Member information
 *   - Quiz status
 *   - Notifications
 *   - Current lesson
 *   - Logout
 *
 * Dependencies:
 *
 *   config.js
 *   api.js
 *   auth.js
 *   auth-state.js
 *
 * ============================================================
 */

"use strict";


/* ============================================================
   1. HOME STATE
   ============================================================ */

const HOME_STATE = {

    authenticated:
        false,

    user:
        null,

    lesson:
        null,

    quiz:
        null,

    announcements:
        [],

    notifications:
        [],

    initialized:
        false

};


/* ============================================================
   2. DOM READY
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    initializeHome
);


/* ============================================================
   3. INITIALIZE HOME
   ============================================================ */

async function initializeHome() {

    console.log(
        "========================================"
    );

    console.log(
        "AFC ISIU YOUTH PORTAL — HOME"
    );

    console.log(
        "Unified Public + Member Home"
    );

    console.log(
        "========================================"
    );


    /*
     * Determine authentication state.
     */

    HOME_STATE.authenticated =
        typeof AUTH !== "undefined" &&
        typeof AUTH.isAuthenticated === "function"
            ? AUTH.isAuthenticated()
            : false;


    /*
     * Get current user if authenticated.
     */

    if (
        HOME_STATE.authenticated &&
        typeof AUTH.getUser === "function"
    ) {

        HOME_STATE.user =
            AUTH.getUser();

    } else {

        HOME_STATE.user =
            null;

    }


    /*
     * Set the correct page mode.
     */

    applyHomeMode();


    /*
     * Set up all navigation/buttons.
     */

    setupHomeEvents();


    /*
     * Load public content first.
     */

    await loadPublicHomeData();


    /*
     * If authenticated, load member-only
     * information as well.
     */

    if (
        HOME_STATE.authenticated
    ) {

        await loadMemberHomeData();

    }


    /*
     * Refresh Lucide icons after dynamic
     * elements have been inserted.
     */

    refreshIcons();


    HOME_STATE.initialized =
        true;


    console.log(
        "Home initialization complete.",
        HOME_STATE
    );

}


/* ============================================================
   4. APPLY HOME MODE
   ============================================================ */

function applyHomeMode() {

    const body =
        document.body;


    if (body) {

        body.classList.toggle(
            "guest-mode",
            !HOME_STATE.authenticated
        );

        body.classList.toggle(
            "member-mode",
            HOME_STATE.authenticated
        );

    }


    /*
     * Update welcome section.
     */

    updateWelcomeSection();


    /*
     * Update profile/header controls.
     */

    updateHeaderActions();


    /*
     * Update sidebar profile.
     */

    updateSidebarProfile();


    /*
     * Update bottom navigation.

     */

    updateNavigation();


    /*
     * Update page title.
     */

    const pageTitle =
        document.getElementById(
            "pageTitle"
        );


    if (pageTitle) {

        pageTitle.textContent =
            "Home";

    }

}


/* ============================================================
   5. WELCOME SECTION
   ============================================================ */

function updateWelcomeSection() {

    const welcomeName =
        document.getElementById(
            "welcomeUserName"
        );


    const welcomeSection =
        document.querySelector(
            ".welcome-section"
        );


    const sectionLabel =
        welcomeSection
            ?.querySelector(
                ".section-label"
            );


    const paragraph =
        welcomeSection
            ?.querySelector(
                "p"
            );


    if (
        HOME_STATE.authenticated &&
        HOME_STATE.user
    ) {

        const firstName =
            getFirstName();


        if (welcomeName) {

            welcomeName.textContent =
                firstName || "Member";

        }


        if (sectionLabel) {

            sectionLabel.textContent =
                "Welcome back";

        }


        if (paragraph) {

            paragraph.textContent =
                "Keep growing, learning and staying connected.";

        }

    } else {

        if (welcomeName) {

            welcomeName.textContent =
                "Friend";

        }


        if (sectionLabel) {

            sectionLabel.textContent =
                "Welcome";

        }


        if (paragraph) {

            paragraph.textContent =
                "Explore, learn and stay connected with AFC Isiu Youth.";

        }

    }

}


/* ============================================================
   6. HEADER ACTIONS
   ============================================================ */

function updateHeaderActions() {

    const headerActions =
        document.querySelector(
            ".header-actions"
        );


    if (!headerActions) {

        return;

    }


    /*
     * Preserve the notification/profile
     * controls where possible.
     *
     * Add authentication controls beside them.
     */

    let authContainer =
        document.getElementById(
            "homeAuthActions"
        );


    if (!authContainer) {

        authContainer =
            document.createElement(
                "div"
            );

        authContainer.id =
            "homeAuthActions";

        authContainer.className =
            "home-auth-actions";


        headerActions.prepend(
            authContainer
        );

    }


    if (
        HOME_STATE.authenticated
    ) {

        authContainer.innerHTML = `

            <button
                type="button"
                class="home-auth-button home-logout-button"
                id="homeLogoutButton"
            >

                <span
                    data-lucide="log-out"
                ></span>

                <span>
                    Logout
                </span>

            </button>

        `;

    } else {

        authContainer.innerHTML = `

            <div
                class="home-guest-actions"
                id="homeGuestActions"
            >

                <a
                    href="login.html"
                    class="home-auth-button home-login-button"
                    id="homeLoginButton"
                >

                    <span
                        data-lucide="log-in"
                    ></span>

                    <span>
                        Login
                    </span>

                </a>


                <a
                    href="login.html#register"
                    class="home-auth-button home-register-button"
                    id="homeRegisterButton"
                >

                    <span
                        data-lucide="user-plus"
                    ></span>

                    <span>
                        Create Account
                    </span>

                </a>

            </div>

        `;

    }


    refreshIcons();

}


/* ============================================================
   7. SIDEBAR PROFILE
   ============================================================ */

function updateSidebarProfile() {

    const nameElement =
        document.getElementById(
            "sidebarUserName"
        );


    if (!nameElement) {

        return;

    }


    if (
        HOME_STATE.authenticated &&
        HOME_STATE.user
    ) {

        nameElement.textContent =
            getDisplayName() ||
            "Member";

    } else {

        nameElement.textContent =
            "Welcome";

    }

}


/* ============================================================
   8. NAVIGATION STATE
   ============================================================ */

function updateNavigation() {

    /*
     * Keep Home active.
     */

    document
        .querySelectorAll(
            'a[href="index.html"]'
        )
        .forEach(function(link) {

            link.classList.add(
                "active"
            );

        });


    /*
     * Member-only profile/notification
     * navigation should still be available,
     * but clicking them can be protected by
     * those pages themselves.
     */

}


/* ============================================================
   9. PUBLIC HOME DATA
   ============================================================ */

async function loadPublicHomeData() {

    await Promise.allSettled([

        loadCurrentLesson(),

        loadPublicAnnouncements()

    ]);

}


/* ============================================================
   10. MEMBER HOME DATA
   ============================================================ */

async function loadMemberHomeData() {

    await Promise.allSettled([

        loadQuizStatus(),

        loadNotifications()

    ]);

}


/* ============================================================
   11. LOAD CURRENT LESSON
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


        if (
            !lessons.length
        ) {

            renderEmptyLesson(
                container
            );

            return;

        }


        /*
         * Use the first lesson returned
         * by the backend as the current/latest
         * lesson.
         */

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
   12. RENDER CURRENT LESSON
   ============================================================ */

function renderCurrentLesson(
    container,
    lesson
) {

    if (!lesson) {

        renderEmptyLesson(
            container
        );

        return;

    }


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

                <span
                    data-lucide="book-open"
                ></span>

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
   13. EMPTY LESSON
   ============================================================ */

function renderEmptyLesson(
    container,
    message =
        "Your current lesson will appear here."
) {

    container.innerHTML = `

        <div class="empty-state">

            <div class="empty-state-icon">

                <span
                    data-lucide="book-open"
                ></span>

            </div>

            <p>
                ${escapeHtml(message)}
            </p>

        </div>

    `;


    refreshIcons();

}


/* ============================================================
   14. LOAD ANNOUNCEMENTS
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
         * Display announcements in the
         * notification preview area.
         */

        renderAnnouncementsPreview(
            container,
            HOME_STATE.announcements
        );


    } catch (error) {

        console.warn(
            "Unable to load announcements:",
            error
        );


        if (container) {

            container.innerHTML = `

                <div class="empty-state">

                    <div class="empty-state-icon">

                        <span
                            data-lucide="bell-off"
                        ></span>

                    </div>

                    <p>
                        Updates are temporarily unavailable.
                    </p>

                </div>

            `;

            refreshIcons();

        }

    }

}


/* ============================================================
   15. RENDER ANNOUNCEMENTS
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

                    <span
                        data-lucide="bell"
                    ></span>

                </div>

                <p>
                    No new updates at the moment.
                </p>

            </div>

        `;

        refreshIcons();

        return;

    }


    const items =
        announcements.slice(
            0,
            3
        );


    container.innerHTML =
        items
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

                    <article
                        class="home-notification-item"
                    >

                        <div
                            class="home-notification-icon"
                        >

                            <span
                                data-lucide="megaphone"
                            ></span>

                        </div>


                        <div
                            class="home-notification-content"
                        >

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
   16. LOAD QUIZ STATUS
   ============================================================ */

async function loadQuizStatus() {

    const container =
        document.getElementById(
            "quizSummary"
        );


    if (!container) {

        return;

    }


    if (
        !HOME_STATE.authenticated
    ) {

        renderGuestQuiz(
            container
        );

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
   17. GUEST QUIZ
   ============================================================ */

function renderGuestQuiz(
    container
) {

    container.innerHTML = `

        <div class="home-member-prompt">

            <div class="home-preview-icon orange">

                <span
                    data-lucide="clipboard-check"
                ></span>

            </div>


            <div>

                <strong>
                    Ready for the challenge?
                </strong>

                <p>
                    Create an account or log in to
                    access your member quiz experience.
                </p>

            </div>

        </div>

    `;


    refreshIcons();

}


/* ============================================================
   18. RENDER QUIZ SUMMARY
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

                    <span
                        data-lucide="trophy"
                    ></span>

                </div>


                <div
                    class="home-preview-content"
                >

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

                    <span
                        data-lucide="circle-check"
                    ></span>

                </div>


                <div
                    class="home-preview-content"
                >

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

                    <span
                        data-lucide="clock-3"
                    ></span>

                </div>


                <div
                    class="home-preview-content"
                >

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

                <span
                    data-lucide="circle-alert"
                ></span>

            </div>

            <p>
                We could not check your quiz status.
            </p>

        </div>

    `;


    refreshIcons();

}


/* ============================================================
   20. LOAD NOTIFICATIONS
   ============================================================ */

async function loadNotifications() {

    if (
        !HOME_STATE.authenticated
    ) {

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


        /*
         * If actual notifications are returned,
         * use them for the preview.
         */

        if (
            HOME_STATE.notifications.length
        ) {

            const container =
                document.getElementById(
                    "notificationPreview"
                );


            renderMemberNotificationPreview(
                container,
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

    if (!container) {

        return;

    }


    if (
        !notifications ||
        !notifications.length
    ) {

        return;

    }


    const items =
        notifications.slice(
            0,
            3
        );


    container.innerHTML =
        items
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

                    <article
                        class="home-notification-item"
                    >

                        <div
                            class="home-notification-icon"
                        >

                            <span
                                data-lucide="bell"
                            ></span>

                        </div>


                        <div
                            class="home-notification-content"
                        >

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
   22. NOTIFICATION BADGES
   ============================================================ */

function updateNotificationBadges(
    count
) {

    const badges = [

        document.getElementById(
            "desktopNotificationBadge"
        ),

        document.getElementById(
            "notificationBadge"
        )

    ];


    const dot =
        document.getElementById(
            "headerNotificationDot"
        );


    badges.forEach(function(badge) {

        if (!badge) {

            return;

        }


        if (count > 0) {

            badge.hidden =
                false;

            badge.textContent =
                count > 99
                    ? "99+"
                    : String(count);

        } else {

            badge.hidden =
                true;

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
     * Logout.
     */

    document.addEventListener(
        "click",
        async function(event) {

            const logoutButton =
                event.target.closest(
                    "#homeLogoutButton"
                );


            if (!logoutButton) {

                return;

            }


            event.preventDefault();


            await handleHomeLogout(
                logoutButton
            );

        }
    );


    /*
     * Mobile menu.
     */

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
            function() {

                sidebar.classList.toggle(
                    "open"
                );


                overlay?.classList.toggle(
                    "active"
                );

            }
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            function() {

                sidebar?.classList.remove(
                    "open"
                );

                overlay.classList.remove(
                    "active"
                );

            }
        );

    }


    /*
     * Close mobile sidebar when a navigation
     * item is selected.
     */

    document
        .querySelectorAll(
            ".sidebar .nav-item"
        )
        .forEach(function(item) {

            item.addEventListener(
                "click",
                function() {

                    sidebar?.classList.remove(
                        "open"
                    );

                    overlay?.classList.remove(
                        "active"
                    );

                }
            );

        });

}


/* ============================================================
   24. LOGOUT
   ============================================================ */

async function handleHomeLogout(
    button
) {

    if (
        button.dataset.loggingOut ===
        "true"
    ) {

        return;

    }


    button.dataset.loggingOut =
        "true";


    button.disabled =
        true;


    const original =
        button.innerHTML;


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


    /*
     * Return to the same homepage.
     *
     * The page will now render as a guest.
     */

    window.location.href =
        "index.html";

}


/* ============================================================
   25. HELPER — FIRST NAME
   ============================================================ */

function getFirstName() {

    if (
        typeof AUTH !== "undefined" &&
        typeof AUTH.getFirstName === "function"
    ) {

        return (
            AUTH.getFirstName() ||
            ""
        );

    }


    if (
        HOME_STATE.user
    ) {

        return String(
            HOME_STATE.user.first_name ||
            ""
        ).trim();

    }


    return "";

}


/* ============================================================
   26. HELPER — DISPLAY NAME
   ============================================================ */

function getDisplayName() {

    if (
        typeof AUTH !== "undefined" &&
        typeof AUTH.getDisplayName === "function"
    ) {

        return (
            AUTH.getDisplayName() ||
            ""
        );

    }


    if (
        HOME_STATE.user
    ) {

        const first =
            String(
                HOME_STATE.user.first_name ||
                ""
            ).trim();


        const last =
            String(
                HOME_STATE.user.last_name ||
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


    return "";

}


/* ============================================================
   27. HELPER — USER ID
   ============================================================ */

function getUserId() {

    if (
        typeof AUTH !== "undefined" &&
        typeof AUTH.getUserId === "function"
    ) {

        return (
            AUTH.getUserId() ||
            ""
        );

    }


    return String(
        HOME_STATE.user?.user_id ||
        ""
    );

}


/* ============================================================
   28. HELPER — TOKEN
   ============================================================ */

function getToken() {

    if (
        typeof AUTH !== "undefined" &&
        typeof AUTH.getToken === "function"
    ) {

        return (
            AUTH.getToken() ||
            ""
        );

    }


    return "";

}


/* ============================================================
   29. EXTRACT ARRAY
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
   30. FORMAT DATE
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
   31. ESCAPE HTML
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


/* ============================================================
   32. REFRESH ICONS
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
   33. PUBLIC GLOBAL OBJECT
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
        handleHomeLogout

};


/* ============================================================
   STARTUP LOG
   ============================================================ */

console.log(
    "AFC Isiu Youth Portal — home.js loaded."
);
