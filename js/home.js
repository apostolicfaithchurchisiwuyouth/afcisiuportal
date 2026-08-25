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
 * 1. Public / Guest Home
 * 2. Authenticated Member Home
 *
 * Guests CAN:
 *
 *     - View lessons
 *     - Read lessons
 *     - View gallery
 *     - View public portal information
 *
 * Members CAN additionally:
 *
 *     - Take quizzes
 *     - View profile
 *     - View notifications
 *     - Track member activity
 *     - Access other authenticated features
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


    determineAuthentication();


    applyHomeMode();


    setupHomeEvents();


    await loadPublicHomeData();


    if (
        HOME_STATE.authenticated
    ) {

        await loadMemberHomeData();

    } else {

        renderGuestMemberAreas();

    }


    refreshIcons();


    HOME_STATE.initialized =
        true;


    console.log(
        "Home initialization complete.",
        HOME_STATE
    );

}


/* ============================================================
   4. DETERMINE AUTHENTICATION
   ============================================================ */

function determineAuthentication() {

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

}


/* ============================================================
   5. APPLY HOME MODE
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


    updateHero();


    updateHeader();


    updateSidebar();


    updateMemberOnlyElements();


    updateProtectedLinks();


    updateNavigation();


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
   6. HERO
   ============================================================ */

function updateHero() {

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
            HOME_STATE.authenticated;

    }


    if (memberHero) {

        memberHero.hidden =
            !HOME_STATE.authenticated;

    }


    if (
        HOME_STATE.authenticated
    ) {

        const welcomeName =
            document.getElementById(
                "welcomeUserName"
            );


        if (welcomeName) {

            welcomeName.textContent =
                getFirstName() ||
                "Member";

        }

    }

}


/* ============================================================
   7. HEADER
   ============================================================
 *
 * The header already contains:
 *
 *     #guestHeaderActions
 *     #memberHeaderActions
 *
 * We simply switch between them.
 *
 * NO EXTRA HEADER BUTTONS ARE CREATED.
 *
 * ============================================================
 */

function updateHeader() {

    const guestActions =
        document.getElementById(
            "guestHeaderActions"
        );


    const memberActions =
        document.getElementById(
            "memberHeaderActions"
        );


    if (guestActions) {

        guestActions.hidden =
            HOME_STATE.authenticated;

    }


    if (memberActions) {

        memberActions.hidden =
            !HOME_STATE.authenticated;

    }


    /*
     * Guest account circle.
     */

    updateGuestHeaderAvatar();


    /*
     * Member profile circle.
     */

    updateMemberHeaderAvatar();


    /*
     * Notification link.
     *
     * Guests see the bell but are taken to
     * login when they click it.
     *
     * Members go to notifications.
     */

    const notificationLinks =
        document.querySelectorAll(
            ".header-notification-link"
        );


    notificationLinks.forEach(function(link) {

        link.href =
            HOME_STATE.authenticated
                ? "pages/notifications.html"
                : "login.html";

    });

}


/* ============================================================
   8. GUEST HEADER AVATAR
   ============================================================ */

function updateGuestHeaderAvatar() {

    const button =
        document.getElementById(
            "guestHeaderAvatar"
        );


    if (!button) {

        return;

    }


    button.innerHTML = `

        <span
            data-lucide="user-round"
            aria-hidden="true"
        ></span>

    `;


    button.title =
        "Login";


    button.setAttribute(
        "aria-label",
        "Login"
    );


    refreshIcons();

}


/* ============================================================
   9. MEMBER HEADER AVATAR
   ============================================================ */

function updateMemberHeaderAvatar() {

    const avatar =
        document.getElementById(
            "headerAvatarLetter"
        );


    if (!avatar) {

        return;

    }


    const user =
        HOME_STATE.user;


    const avatarUrl =
        getUserAvatar();


    if (avatarUrl) {

        avatar.innerHTML = `

            <img
                src="${escapeHtml(avatarUrl)}"
                alt="${escapeHtml(
                    getDisplayName() ||
                    "Profile"
                )}"
                class="header-avatar-image"
                onerror="this.parentElement.innerHTML='<span>${escapeHtml(
                    getUserInitial()
                )}</span>';"
            >

        `;

    } else {

        avatar.innerHTML = `

            <span>
                ${escapeHtml(
                    getUserInitial()
                )}
            </span>

        `;

    }


    avatar.setAttribute(
        "title",
        getDisplayName() ||
        "My Profile"
    );


    avatar.setAttribute(
        "aria-label",
        getDisplayName() ||
        "My Profile"
    );

}


/* ============================================================
   10. SIDEBAR
   ============================================================ */

function updateSidebar() {

    const guest =
        document.getElementById(
            "sidebarGuest"
        );


    const member =
        document.getElementById(
            "sidebarMember"
        );


    if (guest) {

        guest.hidden =
            HOME_STATE.authenticated;

    }


    if (member) {

        member.hidden =
            !HOME_STATE.authenticated;

    }


    const nameElement =
        document.getElementById(
            "sidebarUserName"
        );


    if (
        nameElement &&
        HOME_STATE.authenticated
    ) {

        nameElement.textContent =
            getDisplayName() ||
            "Member";

    }


    const sidebarAvatar =
        document.getElementById(
            "sidebarAvatar"
        );


    if (
        sidebarAvatar &&
        HOME_STATE.authenticated
    ) {

        const avatarUrl =
            getUserAvatar();


        if (avatarUrl) {

            sidebarAvatar.innerHTML = `

                <img
                    src="${escapeHtml(avatarUrl)}"
                    alt=""
                    class="sidebar-avatar-image"
                    onerror="this.parentElement.innerHTML='<span>${escapeHtml(
                        getUserInitial()
                    )}</span>';"
                >

            `;

        } else {

            sidebarAvatar.textContent =
                getUserInitial();

        }

    }

}


/* ============================================================
   11. MEMBER-ONLY ELEMENTS
   ============================================================ */

function updateMemberOnlyElements() {

    document
        .querySelectorAll(
            ".member-only"
        )
        .forEach(function(element) {

            /*
             * Member-only navigation remains hidden
             * from guests.
             */

            element.hidden =
                !HOME_STATE.authenticated;

        });


    const memberDashboard =
        document.getElementById(
            "memberDashboardContent"
        );


    if (memberDashboard) {

        memberDashboard.hidden =
            !HOME_STATE.authenticated;

    }


    const guestInformation =
        document.getElementById(
            "guestInformation"
        );


    if (guestInformation) {

        guestInformation.hidden =
            HOME_STATE.authenticated;

    }

}


/* ============================================================
   12. PROTECTED LINKS
   ============================================================
 *
 * Lessons are deliberately NOT included here.
 *
 * Guests can freely open:
 *
 *     pages/lessons.html
 *
 * Quiz requires login.
 *
 * ============================================================
 */

function updateProtectedLinks() {

    const protectedLinks =
        document.querySelectorAll(
            "[data-auth-required='true']"
        );


    protectedLinks.forEach(function(link) {

        if (
            HOME_STATE.authenticated
        ) {

            link.dataset.originalHref =
                link.dataset.originalHref ||
                link.getAttribute("href") ||
                "";


            if (
                link.dataset.memberHref
            ) {

                link.href =
                    link.dataset.memberHref;

            }

        } else {

            if (
                !link.dataset.originalHref
            ) {

                link.dataset.originalHref =
                    link.getAttribute("href") ||
                    "";

            }


            link.href =
                "login.html";

        }

    });

}


/* ============================================================
   13. NAVIGATION
   ============================================================ */

function updateNavigation() {

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
     * Ensure lesson links remain public.
     */

    document
        .querySelectorAll(
            'a[href="pages/lessons.html"]'
        )
        .forEach(function(link) {

            link.removeAttribute(
                "data-auth-required"
            );

        });

}


/* ============================================================
   14. PUBLIC HOME DATA
   ============================================================ */

async function loadPublicHomeData() {

    await Promise.allSettled([

        loadCurrentLesson(),

        loadPublicAnnouncements()

    ]);

}


/* ============================================================
   15. MEMBER HOME DATA
   ============================================================ */

async function loadMemberHomeData() {

    await Promise.allSettled([

        loadQuizStatus(),

        loadNotifications()

    ]);

}


/* ============================================================
   16. GUEST MEMBER AREAS
   ============================================================ */

function renderGuestMemberAreas() {

    const quizContainer =
        document.getElementById(
            "quizSummary"
        );


    if (quizContainer) {

        renderGuestQuiz(
            quizContainer
        );

    }


    updateNotificationBadges(
        0
    );

}


/* ============================================================
   17. LOAD CURRENT LESSON
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
   18. RENDER CURRENT LESSON
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
   19. EMPTY LESSON
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
   20. LOAD ANNOUNCEMENTS
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
   21. RENDER ANNOUNCEMENTS
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
   22. LOAD QUIZ STATUS
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
   23. GUEST QUIZ
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
                    Log in or create an account to
                    take the weekly quiz and track
                    your progress.
                </p>

            </div>

        </div>

    `;


    refreshIcons();

}


/* ============================================================
   24. RENDER QUIZ SUMMARY
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
   25. QUIZ ERROR
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
   26. LOAD NOTIFICATIONS
   ============================================================ */

async function loadNotifications() {

    if (
        !HOME_STATE.authenticated
    ) {

        updateNotificationBadges(
            0
        );

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
   27. MEMBER NOTIFICATION PREVIEW
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
   28. NOTIFICATION BADGES
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
   29. HOME EVENTS
   ============================================================ */

function setupHomeEvents() {

    /*
     * Prevent duplicate event registration.
     */

    if (
        HOME_STATE.eventsReady
    ) {

        return;

    }


    HOME_STATE.eventsReady =
        true;


    /*
     * Logout delegation.
     */

    document.addEventListener(
        "click",
        async function(event) {

            const logoutButton =
                event.target.closest(
                    "#homeLogoutButton, #heroLogoutButton, #sidebarLogoutButton"
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
                    String(isOpen)
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


                menuButton?.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }
        );

    }


    /*
     * Close mobile sidebar when navigation
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


                    menuButton?.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });

}


/* ============================================================
   30. LOGOUT
   ============================================================ */

async function handleHomeLogout(
    button
) {

    if (
        !button ||
        button.dataset.loggingOut ===
        "true"
    ) {

        return;

    }


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
   31. GET FIRST NAME
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


    return String(
        HOME_STATE.user?.first_name ||
        ""
    ).trim();

}


/* ============================================================
   32. GET DISPLAY NAME
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


/* ============================================================
   33. GET USER ID
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
   34. GET TOKEN
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
   35. GET USER AVATAR
   ============================================================ */

function getUserAvatar() {

    if (
        typeof AUTH !== "undefined" &&
        typeof AUTH.getAvatar === "function"
    ) {

        return (
            AUTH.getAvatar() ||
            ""
        );

    }


    const user =
        HOME_STATE.user;


    if (!user) {

        return "";

    }


    return String(

        user.avatar_url ||
        user.avatar ||
        user.profile_photo ||
        user.photo_url ||
        user.image_url ||
        user.profile_image ||
        ""

    ).trim();

}


/* ============================================================
   36. GET USER INITIAL
   ============================================================ */

function getUserInitial() {

    const firstName =
        getFirstName();


    if (firstName) {

        return firstName
            .charAt(0)
            .toUpperCase();

    }


    const displayName =
        getDisplayName();


    if (displayName) {

        return displayName
            .charAt(0)
            .toUpperCase();

    }


    return "A";

}


/* ============================================================
   37. EXTRACT ARRAY
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
   38. FORMAT DATE
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
   39. ESCAPE HTML
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
   40. REFRESH ICONS
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
   41. PUBLIC GLOBAL OBJECT
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
