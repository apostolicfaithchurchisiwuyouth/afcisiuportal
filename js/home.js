/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL V2
 * FILE: home.js
 * PURPOSE: Unified Home Page Controller
 * ============================================================
 *
 * index.html is BOTH:
 *
 * 1. Public / Guest Homepage
 * 2. Authenticated Member Homepage
 *
 * There is NO dashboard.html.
 *
 * Authentication source of truth:
 *
 *     window.AUTH
 *
 * Dependencies:
 *
 *     config.js
 *     api.js
 *     auth.js
 *     auth-state.js
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
        false,

    initializing:
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

    /*
     * Prevent accidental double initialization.
     */

    if (
        HOME_STATE.initializing
    ) {

        return;

    }


    HOME_STATE.initializing =
        true;


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


    try {

        /*
         * Determine authentication state.
         */

        refreshHomeAuthState();


        /*
         * Apply guest/member interface.
         */

        applyHomeMode();


        /*
         * Set up navigation and buttons.
         */

        setupHomeEvents();


        /*
         * Load public content.
         */

        await loadPublicHomeData();


        /*
         * Load member-only content.
         */

        if (
            HOME_STATE.authenticated
        ) {

            await loadMemberHomeData();

        } else {

            renderGuestMemberSections();

        }


        /*
         * Refresh icons after dynamic
         * content has been inserted.
         */

        refreshIcons();


        HOME_STATE.initialized =
            true;


        console.log(
            "Home initialization complete.",
            HOME_STATE
        );

    } catch (error) {

        console.error(
            "Home initialization failed:",
            error
        );

    } finally {

        HOME_STATE.initializing =
            false;

    }

}


/* ============================================================
   4. REFRESH AUTH STATE
   ============================================================ */

function refreshHomeAuthState() {

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


    return HOME_STATE.authenticated;

}


/* ============================================================
   5. APPLY HOME MODE
   ============================================================ */

function applyHomeMode() {

    const isMember =
        HOME_STATE.authenticated;


    const body =
        document.body;


    /*
     * Body classes.
     */

    if (body) {

        body.classList.toggle(
            "guest-mode",
            !isMember
        );


        body.classList.toggle(
            "member-mode",
            isMember
        );

    }


    /*
     * Hero states.
     */

    setElementHidden_(
        "guestHero",
        isMember
    );


    setElementHidden_(
        "memberHero",
        !isMember
    );


    /*
     * Header states.
     */

    setElementHidden_(
        "guestHeaderActions",
        isMember
    );


    setElementHidden_(
        "memberHeaderActions",
        !isMember
    );


    /*
     * Sidebar account states.
     */

    setElementHidden_(
        "sidebarGuest",
        isMember
    );


    setElementHidden_(
        "sidebarMember",
        !isMember
    );


    /*
     * Member-only navigation/cards.
     */

    document
        .querySelectorAll(
            ".member-only"
        )
        .forEach(function(element) {

            element.hidden =
                !isMember;

        });


    /*
     * Member dashboard.
     */

    setElementHidden_(
        "memberDashboardContent",
        !isMember
    );


    /*
     * Guest information.
     */

    setElementHidden_(
        "guestInformation",
        isMember
    );


    /*
     * Update user information.
     */

    updateWelcomeSection();

    updateSidebarProfile();

    updateHeaderAvatar();

    updateNavigation();


    /*
     * Page title.
     */

    const pageTitle =
        document.getElementById(
            "pageTitle"
        );


    if (pageTitle) {

        pageTitle.textContent =
            "Home";

    }


    /*
     * Refresh icons.
     */

    refreshIcons();

}


/* ============================================================
   6. ELEMENT HIDDEN HELPER
   ============================================================ */

function setElementHidden_(
    id,
    hidden
) {

    const element =
        document.getElementById(id);


    if (!element) {

        return;

    }


    element.hidden =
        Boolean(hidden);

}


/* ============================================================
   7. WELCOME SECTION
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

        const firstName =
            getFirstName();


        if (welcomeName) {

            welcomeName.textContent =
                firstName || "Member";

        }

    } else {

        if (welcomeName) {

            welcomeName.textContent =
                "Friend";

        }

    }

}


/* ============================================================
   8. SIDEBAR PROFILE
   ============================================================ */

function updateSidebarProfile() {

    const nameElement =
        document.getElementById(
            "sidebarUserName"
        );


    const avatarElement =
        document.getElementById(
            "sidebarAvatar"
        );


    if (
        HOME_STATE.authenticated &&
        HOME_STATE.user
    ) {

        const displayName =
            getDisplayName() ||
            "Member";


        if (nameElement) {

            nameElement.textContent =
                displayName;

        }


        if (avatarElement) {

            avatarElement.textContent =
                getAvatarLetter_(
                    displayName
                );

        }

    } else {

        if (nameElement) {

            nameElement.textContent =
                "Member";

        }


        if (avatarElement) {

            avatarElement.textContent =
                "A";

        }

    }

}


/* ============================================================
   9. HEADER AVATAR
   ============================================================ */

function updateHeaderAvatar() {

    const avatar =
        document.getElementById(
            "headerAvatarLetter"
        );


    if (!avatar) {

        return;

    }


    const displayName =
        getDisplayName();


    avatar.textContent =
        getAvatarLetter_(
            displayName
        );

}


/* ============================================================
   10. AVATAR LETTER
   ============================================================ */

function getAvatarLetter_(
    value
) {

    const text =
        String(
            value || ""
        ).trim();


    if (!text) {

        return "A";

    }


    return text
        .charAt(0)
        .toUpperCase();

}


/* ============================================================
   11. NAVIGATION STATE
   ============================================================ */

function updateNavigation() {

    /*
     * Remove active state from all
     * sidebar navigation items.
     */

    document
        .querySelectorAll(
            ".sidebar-navigation .nav-item"
        )
        .forEach(function(link) {

            link.classList.remove(
                "active"
            );

        });


    /*
     * Activate Home.
     */

    const homeLinks =
        document.querySelectorAll(
            '.sidebar-navigation a[href="index.html"], ' +
            '.bottom-navigation a[href="index.html"]'
        );


    homeLinks.forEach(function(link) {

        link.classList.add(
            "active"
        );

    });

}


/* ============================================================
   12. PUBLIC HOME DATA
   ============================================================ */

async function loadPublicHomeData() {

    await Promise.allSettled([

        loadCurrentLesson(),

        loadPublicAnnouncements()

    ]);

}


/* ============================================================
   13. MEMBER HOME DATA
   ============================================================ */

async function loadMemberHomeData() {

    await Promise.allSettled([

        loadQuizStatus(),

        loadNotifications()

    ]);

}


/* ============================================================
   14. GUEST MEMBER SECTIONS
   ============================================================ */

function renderGuestMemberSections() {

    const quizContainer =
        document.getElementById(
            "quizSummary"
        );


    if (quizContainer) {

        renderGuestQuiz(
            quizContainer
        );

    }


    /*
     * Reset notification badges
     * for guests.
     */

    updateNotificationBadges(
        0
    );

}


/* ============================================================
   15. LOAD CURRENT LESSON
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
         * Backend should ideally return
         * the latest lesson first.
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
   16. RENDER CURRENT LESSON
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
   17. EMPTY LESSON
   ============================================================ */

function renderEmptyLesson(
    container,
    message =
        "Your current lesson will appear here."
) {

    if (!container) {

        return;

    }


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
   18. LOAD PUBLIC ANNOUNCEMENTS
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
         * Only render public announcements
         * when the member notification endpoint
         * does not later replace the preview.
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
   19. RENDER ANNOUNCEMENTS
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
   20. LOAD QUIZ STATUS
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
   21. GUEST QUIZ
   ============================================================ */

function renderGuestQuiz(
    container
) {

    if (!container) {

        return;

    }


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
   22. RENDER QUIZ SUMMARY
   ============================================================ */

function renderQuizSummary(
    container,
    result
) {

    if (!container) {

        return;

    }


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
   23. QUIZ ERROR
   ============================================================ */

function renderQuizError(
    container
) {

    if (!container) {

        return;

    }


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
   24. LOAD NOTIFICATIONS
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


        const unreadCount =
            Number(
                data.unreadCount ??
                result?.unreadCount ??
                0
            );


        updateNotificationBadges(
            unreadCount
        );


        /*
         * Replace the public announcement
         * preview with member notifications
         * when notifications are available.
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
   25. MEMBER NOTIFICATION PREVIEW
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
   26. NOTIFICATION BADGES
   ============================================================ */

function updateNotificationBadges(
    count
) {

    const numericCount =
        Number.isFinite(
            Number(count)
        )
            ? Math.max(
                0,
                Number(count)
            )
            : 0;


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


        if (
            numericCount > 0
        ) {

            badge.hidden =
                false;


            badge.textContent =
                numericCount > 99
                    ? "99+"
                    : String(
                        numericCount
                    );

        } else {

            badge.hidden =
                true;

        }

    });


    if (dot) {

        dot.hidden =
            numericCount <= 0;

    }

}


/* ============================================================
   27. HOME EVENTS
   ============================================================ */

function setupHomeEvents() {

    /*
     * Prevent duplicate event listeners.
     */

    if (
        document.body.dataset.homeEventsBound ===
        "true"
    ) {

        return;

    }


    document.body.dataset.homeEventsBound =
        "true";


    /*
     * Logout buttons.
     *
     * Handles:
     *
     * #homeLogoutButton
     * #heroLogoutButton
     * #sidebarLogoutButton
     */

    document.addEventListener(
        "click",
        async function(event) {

            const logoutButton =
                event.target.closest(
                    "#homeLogoutButton, " +
                    "#heroLogoutButton, " +
                    "#sidebarLogoutButton"
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

                const isOpen =
                    sidebar.classList.toggle(
                        "open"
                    );


                overlay?.classList.toggle(
                    "active",
                    isOpen
                );


                menuButton.setAttribute(
                    "aria-expanded",
                    String(
                        isOpen
                    )
                );

            }
        );

    }


    /*
     * Overlay closes mobile sidebar.
     */

    if (overlay) {

        overlay.addEventListener(
            "click",
            closeMobileSidebar
        );

    }


    /*
     * Close mobile sidebar after
     * selecting navigation.
     */

    document
        .querySelectorAll(
            ".sidebar .nav-item"
        )
        .forEach(function(item) {

            item.addEventListener(
                "click",
                closeMobileSidebar
            );

        });


    /*
     * Close mobile sidebar when
     * clicking a mobile bottom navigation item.
     */

    document
        .querySelectorAll(
            ".bottom-navigation .bottom-nav-item"
        )
        .forEach(function(item) {

            item.addEventListener(
                "click",
                closeMobileSidebar
            );

        });


    /*
     * Escape key closes sidebar.
     */

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key ===
                "Escape"
            ) {

                closeMobileSidebar();

            }

        }
    );

}


/* ============================================================
   28. CLOSE MOBILE SIDEBAR
   ============================================================ */

function closeMobileSidebar() {

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


    sidebar?.classList.remove(
        "open"
    );


    overlay?.classList.remove(
        "active"
    );


    menuButton?.setAttribute(
        "aria-expanded",
        "false"
    );

}


/* ============================================================
   29. LOGOUT
   ============================================================ */

async function handleHomeLogout(
    button
) {

    if (
        button?.dataset.loggingOut ===
        "true"
    ) {

        return;

    }


    if (button) {

        button.dataset.loggingOut =
            "true";


        button.disabled =
            true;

    }


    const original =
        button
            ? button.innerHTML
            : "";


    if (button) {

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


        /*
         * Local logout must still happen.
         */

        if (
            typeof AUTH !== "undefined" &&
            typeof AUTH.clear === "function"
        ) {

            AUTH.clear();

        }

    }


    /*
     * Reset local home state.
     */

    HOME_STATE.authenticated =
        false;


    HOME_STATE.user =
        null;


    HOME_STATE.quiz =
        null;


    HOME_STATE.notifications =
        [];


    /*
     * Go back to the same unified homepage.
     */

    window.location.href =
        "index.html";

}


/* ============================================================
   30. FIRST NAME
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
   31. DISPLAY NAME
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
   32. USER ID
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
    ).trim();

}


/* ============================================================
   33. TOKEN
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
   34. EXTRACT ARRAY
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
   35. FORMAT DATE
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
   36. ESCAPE HTML
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
   37. REFRESH ICONS
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
   38. PUBLIC GLOBAL OBJECT
   ============================================================ */

window.HOME = {

    state:
        HOME_STATE,

    refresh:
        initializeHome,

    refreshAuthMode:
        function() {

            refreshHomeAuthState();

            applyHomeMode();

        },

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


/* ============================================================
   END OF HOME.JS
   ============================================================ */
