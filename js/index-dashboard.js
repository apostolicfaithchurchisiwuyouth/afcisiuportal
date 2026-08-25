/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL V2
 * UNIFIED INDEX DASHBOARD
 * FILE: index-dashboard.js
 * ============================================================
 *
 * PURPOSE:
 * ------------------------------------------------------------
 * index.html is BOTH:
 *
 * 1. Public guest homepage
 * 2. Authenticated member dashboard
 *
 * There is no need to redirect members to dashboard.html.
 *
 * ============================================================
 */

"use strict";


/* ============================================================
   1. STATE
   ============================================================ */

const INDEX_STATE = {

    authenticated:
        false,

    user:
        null,

    notifications:
        null,

    quizStatus:
        null,

    announcements:
        []

};


/* ============================================================
   2. DOM READY
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    initializeIndex
);


/* ============================================================
   3. INITIALIZE
   ============================================================ */

async function initializeIndex() {

    console.log(
        "AFC Isiu Youth Portal — Unified Index"
    );


    /*
     * Check authentication using 10E.
     */

    INDEX_STATE.authenticated =
        AUTH.isAuthenticated();


    /*
     * Get stored user.
     */

    INDEX_STATE.user =
        INDEX_STATE.authenticated
            ? AUTH.getUser()
            : null;


    /*
     * Render correct experience.
     */

    if (
        INDEX_STATE.authenticated &&
        INDEX_STATE.user
    ) {

        renderMemberExperience();

        setupMemberEvents();

        await loadMemberData();

    } else {

        renderGuestExperience();

        setupGuestExperience();

    }


    /*
     * Rebuild Lucide icons after
     * dynamic changes.
     */

    refreshIcons();


    console.log(
        "Index initialization complete.",
        {
            authenticated:
                INDEX_STATE.authenticated,

            user:
                INDEX_STATE.user
        }
    );

}


/* ============================================================
   4. GUEST EXPERIENCE
   ============================================================ */

function renderGuestExperience() {

    setHidden(
        "guestWelcome",
        false
    );

    setHidden(
        "memberWelcome",
        true
    );


    setHidden(
        "guestProfileCard",
        false
    );

    setHidden(
        "memberProfileCard",
        true
    );


    setHidden(
        "memberQuickActions",
        true
    );

    setHidden(
        "memberDashboardGrid",
        true
    );

    setHidden(
        "memberAccountSection",
        true
    );


    setHidden(
        "guestBottomCTA",
        false
    );


    setHidden(
        "sidebarGuestProfile",
        false
    );

    setHidden(
        "sidebarMemberProfile",
        true
    );


    setHidden(
        "guestHeaderAvatar",
        false
    );

    setHidden(
        "memberHeaderAvatar",
        true
    );


    /*
     * Guest users should not see a personal
     * notification badge.
     */

    hideNotificationIndicators();


    /*
     * Reset greeting.
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
   5. MEMBER EXPERIENCE
   ============================================================ */

function renderMemberExperience() {

    const user =
        INDEX_STATE.user;


    const firstName =
        String(
            user.first_name ||
            "Member"
        ).trim();


    const displayName =
        AUTH.getDisplayName() ||
        firstName;


    /*
     * Welcome name.
     */

    const welcomeName =
        document.getElementById(
            "welcomeUserName"
        );

    if (welcomeName) {

        welcomeName.textContent =
            firstName;

    }


    /*
     * Sidebar name.
     */

    const sidebarName =
        document.getElementById(
            "sidebarUserName"
        );

    if (sidebarName) {

        sidebarName.textContent =
            displayName;

    }


    /*
     * Avatar letter.
     */

    const initial =
        firstName
            .charAt(0)
            .toUpperCase() ||
        "M";


    const sidebarAvatar =
        document.getElementById(
            "sidebarAvatar"
        );

    if (sidebarAvatar) {

        sidebarAvatar.textContent =
            initial;

    }


    const headerAvatar =
        document.getElementById(
            "headerAvatarLetter"
        );

    if (headerAvatar) {

        headerAvatar.textContent =
            initial;

    }


    /*
     * Show member interface.
     */

    setHidden(
        "guestWelcome",
        true
    );

    setHidden(
        "memberWelcome",
        false
    );


    setHidden(
        "guestProfileCard",
        true
    );

    setHidden(
        "memberProfileCard",
        false
    );


    setHidden(
        "memberQuickActions",
        false
    );

    setHidden(
        "memberDashboardGrid",
        false
    );


    setHidden(
        "guestBottomCTA",
        true
    );

    setHidden(
        "memberAccountSection",
        false
    );


    setHidden(
        "sidebarGuestProfile",
        true
    );

    setHidden(
        "sidebarMemberProfile",
        false
    );


    setHidden(
        "guestHeaderAvatar",
        true
    );

    setHidden(
        "memberHeaderAvatar",
        false
    );


    const pageTitle =
        document.getElementById(
            "pageTitle"
        );

    if (pageTitle) {

        pageTitle.textContent =
            "My Home";

    }

}


/* ============================================================
   6. LOAD MEMBER DATA
   ============================================================ */

async function loadMemberData() {

    /*
     * We intentionally load these independently.
     *
     * If one API fails, the rest of the dashboard
     * should still work.
     */

    await Promise.allSettled([

        loadQuizStatus(),

        loadNotificationCount()

    ]);

}


/* ============================================================
   7. LOAD QUIZ STATUS
   ============================================================ */

async function loadQuizStatus() {

    const container =
        document.getElementById(
            "quizSummary"
        );


    if (!container) {

        return;

    }


    try {

        const result =
            await API.get(
                "getquizstatus",
                {

                    user_id:
                        AUTH.getUserId(),

                    token:
                        AUTH.getToken()

                }
            );


        INDEX_STATE.quizStatus =
            result;


        const data =
            result &&
            result.data
                ? result.data
                : result;


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


        if (
            status === "open" ||
            status === "available" ||
            status === "published"
        ) {

            const title =
                escapeHtml(
                    quiz?.title ||
                    "Weekly quiz is available"
                );


            container.innerHTML = `

                <div class="dashboard-status">

                    <strong>
                        ${title}
                    </strong>

                    <p>
                        Your weekly challenge is ready.
                    </p>

                    <a
                        href="pages/quiz.html"
                        class="text-link"
                    >
                        Take quiz
                        <span data-lucide="arrow-right"></span>
                    </a>

                </div>

            `;

        } else if (
            status === "completed" ||
            status === "submitted"
        ) {

            container.innerHTML = `

                <div class="dashboard-status">

                    <strong>
                        Quiz completed
                    </strong>

                    <p>
                        You have already submitted this week's quiz.
                    </p>

                </div>

            `;

        } else {

            container.innerHTML = `

                <div class="empty-state">

                    <div class="empty-state-icon">

                        <span data-lucide="clipboard-check"></span>

                    </div>

                    <p>
                        There is no active quiz available right now.
                    </p>

                </div>

            `;

        }


        refreshIcons();


    } catch (error) {

        console.error(
            "Unable to load quiz status:",
            error
        );

    }

}


/* ============================================================
   8. LOAD NOTIFICATIONS
   ============================================================ */

async function loadNotificationCount() {

    try {

        const result =
            await API.get(
                "getnotifications",
                {

                    token:
                        AUTH.getToken(),

                    user_id:
                        AUTH.getUserId()

                }
            );


        INDEX_STATE.notifications =
            result;


        const unreadCount =
            Number(
                result?.unreadCount ||
                result?.data?.unreadCount ||
                0
            );


        updateNotificationIndicators(
            unreadCount
        );


        /*
         * Preview can be expanded later
         * when we build the notification system.
         */

        renderNotificationPreview(
            result
        );


    } catch (error) {

        console.warn(
            "Unable to load notifications:",
            error
        );

    }

}


/* ============================================================
   9. NOTIFICATION INDICATORS
   ============================================================ */

function updateNotificationIndicators(
    count
) {

    const desktopBadge =
        document.getElementById(
            "desktopNotificationBadge"
        );


    const headerDot =
        document.getElementById(
            "headerNotificationDot"
        );


    if (count > 0) {

        if (desktopBadge) {

            desktopBadge.hidden =
                false;

            desktopBadge.textContent =
                count > 99
                    ? "99+"
                    : String(count);

        }


        if (headerDot) {

            headerDot.hidden =
                false;

        }

    } else {

        hideNotificationIndicators();

    }

}


/* ============================================================
   10. HIDE NOTIFICATION INDICATORS
   ============================================================ */

function hideNotificationIndicators() {

    const desktopBadge =
        document.getElementById(
            "desktopNotificationBadge"
        );


    const headerDot =
        document.getElementById(
            "headerNotificationDot"
        );


    if (desktopBadge) {

        desktopBadge.hidden =
            true;

    }


    if (headerDot) {

        headerDot.hidden =
            true;

    }

}


/* ============================================================
   11. NOTIFICATION PREVIEW
   ============================================================ */

function renderNotificationPreview(
    result
) {

    const container =
        document.getElementById(
            "notificationPreview"
        );


    if (!container) {

        return;

    }


    const notifications =
        extractArray(
            result,
            [
                "notifications",
                "items",
                "data"
            ]
        );


    if (
        !notifications.length
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">

                    <span data-lucide="bell"></span>

                </div>

                <p>
                    No new notifications.
                </p>

            </div>

        `;

        refreshIcons();

        return;

    }


    const latest =
        notifications
            .slice(0, 3);


    container.innerHTML =
        latest
            .map(function(notification) {

                const title =
                    escapeHtml(
                        notification.title ||
                        notification.subject ||
                        "Notification"
                    );


                const message =
                    escapeHtml(
                        notification.message ||
                        notification.description ||
                        ""
                    );


                return `

                    <article
                        class="notification-preview-item"
                    >

                        <strong>
                            ${title}
                        </strong>

                        <p>
                            ${message}
                        </p>

                    </article>

                `;

            })
            .join("");


}


/* ============================================================
   12. MEMBER EVENTS
   ============================================================ */

function setupMemberEvents() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (
        logoutButton &&
        !logoutButton.dataset.bound
    ) {

        logoutButton.dataset.bound =
            "true";


        logoutButton.addEventListener(
            "click",
            handleLogout
        );

    }

}


/* ============================================================
   13. GUEST EVENTS
   ============================================================ */

function setupGuestExperience() {

    /*
     * No authenticated actions are required
     * for guests at this stage.
     *
     * Public navigation remains available.
     */

}


/* ============================================================
   14. LOGOUT
   ============================================================ */

async function handleLogout() {

    const button =
        document.getElementById(
            "logoutButton"
        );


    if (button) {

        button.disabled =
            true;

    }


    try {

        await AUTH.logout();

    } catch (error) {

        console.warn(
            "Logout request failed:",
            error
        );

        AUTH.clear();

    }


    /*
     * Return to the same index page.
     *
     * It will automatically become the guest
     * experience because authentication has
     * been cleared.
     */

    window.location.href =
        "index.html";

}


/* ============================================================
   15. HELPERS
   ============================================================ */

function setHidden(
    id,
    hidden
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return;

    }


    element.hidden =
        Boolean(hidden);

}


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


function refreshIcons() {

    if (
        window.lucide
    ) {

        lucide.createIcons();

    }

}


/* ============================================================
   16. GLOBAL OBJECT
   ============================================================ */

window.INDEX_DASHBOARD = {

    state:
        INDEX_STATE,

    refresh:
        initializeIndex,

    logout:
        handleLogout

};


/* ============================================================
   END
   ============================================================ */

console.log(
    "AFC Isiu Youth Portal — Unified index controller loaded."
);
