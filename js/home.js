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
 * 1. Public/guest homepage
 * 2. Authenticated member homepage
 *
 * Guests CAN:
 *   - View lessons
 *   - Read lessons
 *   - View gallery
 *   - View public content
 *
 * Members CAN additionally:
 *   - Take quizzes
 *   - Track quiz activity
 *   - View profile
 *   - View notifications
 *   - Access member dashboard information
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


    HOME_STATE.authenticated =
        typeof AUTH !== "undefined" &&
        typeof AUTH.isAuthenticated === "function"
            ? AUTH.isAuthenticated()
            : false;


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
     * Set visual state BEFORE loading data.
     */

    applyHomeMode();


    /*
     * Set all events once.
     */

    setupHomeEvents();


    /*
     * Load public content.
     *
     * Guests are allowed to see lessons.
     */

    await loadPublicHomeData();


    /*
     * Load member-only information
     * only when authenticated.
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


    updateWelcomeSection();

    updateHeaderActions();

    updateSidebarProfile();

    updateMemberOnlyElements();

    updateBottomAccount();

    updateNavigation();

}


/* ============================================================
   5. UPDATE MEMBER-ONLY ELEMENTS
============================================================ */

function updateMemberOnlyElements() {

    const memberElements =
        document.querySelectorAll(
            ".member-only"
        );


    memberElements.forEach(function(element) {

        element.hidden =
            !HOME_STATE.authenticated;

    });


    const guestInformation =
        document.getElementById(
            "guestInformation"
        );


    if (guestInformation) {

        guestInformation.hidden =
            HOME_STATE.authenticated;

    }


    const memberDashboard =
        document.getElementById(
            "memberDashboardContent"
        );


    if (memberDashboard) {

        memberDashboard.hidden =
            !HOME_STATE.authenticated;

    }


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


    /*
     * Sidebar account blocks.
     */

    const sidebarGuest =
        document.getElementById(
            "sidebarGuest"
        );


    const sidebarMember =
        document.getElementById(
            "sidebarMember"
        );


    if (sidebarGuest) {

        sidebarGuest.hidden =
            HOME_STATE.authenticated;

    }


    if (sidebarMember) {

        sidebarMember.hidden =
            !HOME_STATE.authenticated;

    }

}


/* ============================================================
   6. WELCOME SECTION
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

    } else {

        if (welcomeName) {

            welcomeName.textContent =
                "Friend";

        }

    }

}


/* ============================================================
   7. HEADER ACTIONS
============================================================ */

function updateHeaderActions() {

    const guestAvatar =
        document.getElementById(
            "guestAccountAvatar"
        );


    const memberAvatar =
        document.getElementById(
            "memberAccountAvatar"
        );


    const notificationButton =
        document.getElementById(
            "headerNotificationButton"
        );


    /*
     * GUEST.
     */

    if (
        guestAvatar
    ) {

        guestAvatar.hidden =
            HOME_STATE.authenticated;

    }


    /*
     * MEMBER.
     */

    if (
        memberAvatar
    ) {

        memberAvatar.hidden =
            !HOME_STATE.authenticated;

    }


    /*
     * Notification bell is visible for everyone.
     *
     * Guests can see the bell, but member
     * notification pages can still be protected.
     */

    if (notificationButton) {

        notificationButton.hidden =
            false;

    }


    /*
     * Update member avatar.
     */

    if (
        HOME_STATE.authenticated &&
        memberAvatar
    ) {

        renderHeaderAvatar(
            memberAvatar
        );

    }

}


/* ============================================================
   8. HEADER AVATAR
============================================================ */

function renderHeaderAvatar(
    container
) {

    if (!container) {

        return;

    }


    const avatar =
        getAvatar();


    if (avatar) {

        container.innerHTML = `

            <img
                src="${escapeHtml(avatar)}"
                alt="Profile"
                class="user-avatar-image"
                onerror="this.style.display='none'; this.parentElement.classList.add('avatar-fallback'); this.parentElement.querySelector('.avatar-fallback-letter').hidden=false;"
            >

            <span
                class="avatar-fallback-letter"
                hidden
            >
                ${escapeHtml(
                    getAvatarLetter()
                )}
            </span>

        `;

    } else {

        container.innerHTML = `

            <span class="avatar-fallback-letter">

                ${escapeHtml(
                    getAvatarLetter()
                )}

            </span>

        `;

    }

}


/* ============================================================
   9. SIDEBAR PROFILE
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

        if (nameElement) {

            nameElement.textContent =
                getDisplayName() ||
                "Member";

        }


        if (avatarElement) {

            const avatar =
                getAvatar();


            if (avatar) {

                avatarElement.innerHTML = `

                    <img
                        src="${escapeHtml(avatar)}"
                        alt="Profile"
                        class="user-avatar-image"
                    >

                `;

            } else {

                avatarElement.textContent =
                    getAvatarLetter();

            }

        }

    } else {

        if (nameElement) {

            nameElement.textContent =
                "Welcome";

        }

    }

}


/* ============================================================
   10. BOTTOM ACCOUNT / PROFILE
============================================================ */

function updateBottomAccount() {

    const accountNav =
        document.getElementById(
            "bottomAccountNav"
        );


    const accountIcon =
        document.getElementById(
            "bottomAccountIcon"
        );


    const accountLabel =
        document.getElementById(
            "bottomAccountLabel"
        );


    if (!accountNav) {

        return;

    }


    if (
        HOME_STATE.authenticated
    ) {

        /*
         * MEMBER
         */

        accountNav.href =
            "pages/profile.html";

        accountNav.setAttribute(
            "aria-label",
            "My profile"
        );


        if (accountLabel) {

            accountLabel.textContent =
                "Profile";

        }


        if (accountIcon) {

            accountIcon.setAttribute(
                "data-lucide",
                "user-round"
            );

        }

    } else {

        /*
         * GUEST
         */

        accountNav.href =
            "login.html";

        accountNav.setAttribute(
            "aria-label",
            "Login or create an account"
        );


        if (accountLabel) {

            accountLabel.textContent =
                "Account";

        }


        if (accountIcon) {

            accountIcon.setAttribute(
                "data-lucide",
                "user-round"
            );

        }

    }


    refreshIcons();

}


/* ============================================================
   11. NAVIGATION STATE
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
   14. LOAD CURRENT LESSON
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
   15. RENDER CURRENT LESSON
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
   16. EMPTY LESSON
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
   17. LOAD ANNOUNCEMENTS
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
         * Only use announcements as preview
         * when no member notifications replace them.
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
   18. RENDER ANNOUNCEMENTS
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
   19. LOAD QUIZ STATUS
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
   20. GUEST QUIZ
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
   21. RENDER QUIZ SUMMARY
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
   22. QUIZ ERROR
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
   23. LOAD NOTIFICATIONS
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
   24. MEMBER NOTIFICATION PREVIEW
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
   25. NOTIFICATION BADGES
============================================================ */

function updateNotificationBadges(
    count
) {

    const badges = [

        document.getElementById(
            "desktopNotificationBadge"
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
   26. HOME EVENTS
============================================================ */

function setupHomeEvents() {

    /*
     * Prevent duplicate listeners if HOME.refresh()
     * is called later.
     */

    if (
        HOME_STATE.eventsBound
    ) {

        return;

    }


    HOME_STATE.eventsBound =
        true;


    /* --------------------------------------------------------
       LOGOUT BUTTONS
    -------------------------------------------------------- */

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


    /* --------------------------------------------------------
       MOBILE MENU
    -------------------------------------------------------- */

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


    /* --------------------------------------------------------
       OVERLAY
    -------------------------------------------------------- */

    if (overlay) {

        overlay.addEventListener(
            "click",
            function() {

                closeMobileMenu();

            }
        );

    }


    /* --------------------------------------------------------
       SIDEBAR NAVIGATION
    -------------------------------------------------------- */

    document
        .querySelectorAll(
            ".sidebar .nav-item, .sidebar .sidebar-profile"
        )
        .forEach(function(item) {

            item.addEventListener(
                "click",
                function() {

                    closeMobileMenu();

                }
            );

        });


    /* --------------------------------------------------------
       ESCAPE KEY
    -------------------------------------------------------- */

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key ===
                "Escape"
            ) {

                closeMobileMenu();

            }

        }
    );


    /*
     * Prevent clicks inside sidebar from
     * closing the menu through accidental
     * bubbling behavior.
     */

    if (sidebar) {

        sidebar.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

            }
        );

    }

}


/* ============================================================
   27. OPEN MOBILE MENU
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

        overlay.setAttribute(
            "aria-hidden",
            "false"
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
   28. CLOSE MOBILE MENU
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

        overlay.setAttribute(
            "aria-hidden",
            "true"
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
   29. LOGOUT
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

    }


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


        if (
            typeof AUTH !== "undefined" &&
            typeof AUTH.clear === "function"
        ) {

            AUTH.clear();

        }

    }


    /*
     * Go back to the unified homepage.
     */

    window.location.href =
        "index.html";

}


/* ============================================================
   30. HELPER — FIRST NAME
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
   31. HELPER — DISPLAY NAME
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
   32. HELPER — USER ID
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
   33. HELPER — TOKEN
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
   34. HELPER — AVATAR
============================================================ */

function getAvatar() {

    if (
        typeof AUTH !== "undefined" &&
        typeof AUTH.getAvatar === "function"
    ) {

        return (
            AUTH.getAvatar() ||
            ""
        );

    }


    if (
        HOME_STATE.user
    ) {

        const possibleFields = [

            "avatar_url",

            "avatar",

            "profile_image",

            "profile_image_url",

            "image_url",

            "photo_url",

            "photo",

            "picture",

            "image"

        ];


        for (
            let i = 0;
            i < possibleFields.length;
            i++
        ) {

            const value =
                String(
                    HOME_STATE.user[
                        possibleFields[i]
                    ] || ""
                ).trim();


            if (value) {

                return value;

            }

        }

    }


    return "";

}


/* ============================================================
   35. HELPER — AVATAR LETTER
============================================================ */

function getAvatarLetter() {

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
   36. EXTRACT ARRAY
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
   37. FORMAT DATE
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
   38. ESCAPE HTML
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
   39. REFRESH ICONS
============================================================ */

function refreshIcons() {

    try {

        if (
            window.lucide &&
            typeof window.lucide.createIcons ===
                "function"
        ) {

            window.lucide.createIcons();

        }

    } catch (error) {

        console.warn(
            "Unable to refresh icons:",
            error
        );

    }

}


/* ============================================================
   40. PUBLIC GLOBAL OBJECT
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

    openMenu:
        openMobileMenu,

    closeMenu:
        closeMobileMenu,

    logout:
        handleHomeLogout

};


/* ============================================================
   STARTUP LOG
============================================================ */

console.log(
    "AFC Isiu Youth Portal — home.js loaded."
);
