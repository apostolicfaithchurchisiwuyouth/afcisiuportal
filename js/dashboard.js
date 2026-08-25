/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL V2
 * STEP 10F — REAL MEMBER DASHBOARD
 * ============================================================
 *
 * Connects the authenticated frontend dashboard
 * to the existing backend API.
 *
 * ============================================================
 */

"use strict";


/* ============================================================
   1. DASHBOARD STATE
   ============================================================ */

const DASHBOARD_STATE = {

    user:
        null,

    announcements:
        [],

    quizStatus:
        null,

    notifications:
        null

};


/* ============================================================
   2. DOM READY
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    initializeDashboard
);


/* ============================================================
   3. INITIALIZE DASHBOARD
   ============================================================ */

async function initializeDashboard() {

    console.log(
        "========================================"
    );

    console.log(
        "STEP 10F — MEMBER DASHBOARD"
    );

    console.log(
        "========================================"
    );


    /*
     * Make sure the user is logged in.
     */

    if (
        !AUTH.isAuthenticated()
    ) {

        console.warn(
            "User is not authenticated."
        );

        window.location.href =
            "login.html";

        return;

    }


    /*
     * Get authenticated user.
     */

    DASHBOARD_STATE.user =
        AUTH.getUser();


    if (
        !DASHBOARD_STATE.user
    ) {

        AUTH.clear();

        window.location.href =
            "login.html";

        return;

    }


    /*
     * Render local user information
     * immediately.
     */

    renderUser();


    /*
     * Connect buttons.
     */

    setupDashboardEvents();


    /*
     * Load real backend data.
     */

    await Promise.allSettled([

        loadAnnouncements(),

        loadQuizStatus(),

        loadNotificationCount()

    ]);


    console.log(
        "Dashboard initialization complete."
    );

}


/* ============================================================
   4. RENDER USER
   ============================================================ */

function renderUser() {

    const user =
        DASHBOARD_STATE.user;


    const firstName =
        String(
            user.first_name || "Member"
        ).trim();


    const displayName =
        AUTH.getDisplayName() ||
        firstName;


    const firstNameElement =
        document.getElementById(
            "userFirstName"
        );


    if (firstNameElement) {

        firstNameElement.textContent =
            firstName;

    }


    const profileName =
        document.getElementById(
            "profileChipName"
        );


    if (profileName) {

        profileName.textContent =
            displayName;

    }


    const avatar =
        document.getElementById(
            "profileAvatar"
        );


    if (avatar) {

        avatar.textContent =
            firstName
                .charAt(0)
                .toUpperCase();

    }

}


/* ============================================================
   5. LOAD ANNOUNCEMENTS
   ============================================================ */

async function loadAnnouncements() {

    const container =
        document.getElementById(
            "announcementsContainer"
        );


    if (!container) {

        return;

    }


    try {

        const result =
            await API.get(
                "getannouncements"
            );


        const announcements =
            extractArray(
                result,
                [
                    "announcements",
                    "data",
                    "items"
                ]
            );


        DASHBOARD_STATE.announcements =
            announcements;


        renderAnnouncements(
            announcements
        );


    } catch (error) {

        console.error(
            "Unable to load announcements:",
            error
        );


        container.innerHTML = `

            <div class="empty-state">

                <i class="bx bx-error-circle"></i>

                <p>
                    Announcements could not be loaded.
                </p>

            </div>

        `;

    }

}


/* ============================================================
   6. RENDER ANNOUNCEMENTS
   ============================================================ */

function renderAnnouncements(
    announcements
) {

    const container =
        document.getElementById(
            "announcementsContainer"
        );


    if (!container) {

        return;

    }


    if (
        !announcements ||
        announcements.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="bx bx-megaphone"></i>

                <p>
                    There are no new announcements.
                </p>

            </div>

        `;

        return;

    }


    /*
     * Show only the latest five.
     */

    const items =
        announcements
            .slice(0, 5);


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
                        class="announcement-item"
                    >

                        <div
                            class="announcement-title"
                        >
                            ${title}
                        </div>

                        <div
                            class="announcement-message"
                        >
                            ${message}
                        </div>

                        ${
                            date
                                ? `
                                    <div
                                        class="announcement-date"
                                    >
                                        ${date}
                                    </div>
                                  `
                                : ""
                        }

                    </article>

                `;

            })
            .join("");

}


/* ============================================================
   7. LOAD QUIZ STATUS
   ============================================================ */

async function loadQuizStatus() {

    const title =
        document.getElementById(
            "quizStatusTitle"
        );


    const message =
        document.getElementById(
            "quizStatusMessage"
        );


    try {

        const userId =
            AUTH.getUserId();


        const token =
            AUTH.getToken();


        const result =
            await API.get(
                "getquizstatus",
                {

                    user_id:
                        userId,

                    token:
                        token

                }
            );


        DASHBOARD_STATE.quizStatus =
            result;


        renderQuizStatus(
            result
        );


    } catch (error) {

        console.error(
            "Unable to load quiz status:",
            error
        );


        if (title) {

            title.textContent =
                "Quiz unavailable";

        }


        if (message) {

            message.textContent =
                "We could not check the current quiz status.";

        }

    }

}


/* ============================================================
   8. RENDER QUIZ STATUS
   ============================================================ */

function renderQuizStatus(
    result
) {

    const title =
        document.getElementById(
            "quizStatusTitle"
        );


    const message =
        document.getElementById(
            "quizStatusMessage"
        );


    if (
        !title ||
        !message
    ) {

        return;

    }


    /*
     * Different backend versions may return
     * slightly different structures.
     *
     * We therefore read the common possibilities.
     */

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

        title.textContent =
            quiz && quiz.title
                ? quiz.title
                : "Weekly quiz is available";


        message.textContent =
            "Your weekly challenge is ready. Test what you have learned.";

        return;

    }


    if (
        status === "completed" ||
        status === "submitted"
    ) {

        title.textContent =
            "Quiz completed";


        message.textContent =
            "You have already submitted this week's quiz.";

        return;

    }


    if (
        status === "started"
    ) {

        title.textContent =
            "Quiz in progress";


        message.textContent =
            "You have a quiz attempt waiting for you.";

        return;

    }


    title.textContent =
        quiz && quiz.title
            ? quiz.title
            : "No active quiz";


    message.textContent =
        "There is no active quiz available right now.";

}


/* ============================================================
   9. LOAD NOTIFICATION COUNT
   ============================================================ */

async function loadNotificationCount() {

    const badge =
        document.getElementById(
            "notificationBadge"
        );


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


        DASHBOARD_STATE.notifications =
            result;


        const unreadCount =
            Number(
                result.unreadCount ||
                result.data?.unreadCount ||
                0
            );


        if (
            badge &&
            unreadCount > 0
        ) {

            badge.hidden =
                false;

            badge.textContent =
                unreadCount > 99
                    ? "99+"
                    : String(
                        unreadCount
                    );

        } else if (badge) {

            badge.hidden =
                true;

        }


    } catch (error) {

        console.warn(
            "Unable to load notification count:",
            error
        );

    }

}


/* ============================================================
   10. DASHBOARD EVENTS
   ============================================================ */

function setupDashboardEvents() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            handleLogout
        );

    }


    const profileChip =
        document.getElementById(
            "profileChip"
        );


    if (profileChip) {

        profileChip.addEventListener(
            "click",
            function() {

                window.location.href =
                    "profile.html";

            }
        );

    }


    const notificationButton =
        document.getElementById(
            "notificationButton"
        );


    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            function() {

                window.location.href =
                    "notifications.html";

            }
        );

    }

}


/* ============================================================
   11. LOGOUT
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

        console.error(
            "Logout error:",
            error
        );

        AUTH.clear();

    }


    window.location.href =
        "login.html";

}


/* ============================================================
   12. EXTRACT ARRAY
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
   13. FORMAT DATE
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
   14. ESCAPE HTML
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
   15. GLOBAL DASHBOARD OBJECT
   ============================================================ */

window.DASHBOARD =
    {

        state:
            DASHBOARD_STATE,

        refresh:
            initializeDashboard,

        loadAnnouncements:
            loadAnnouncements,

        loadQuizStatus:
            loadQuizStatus,

        loadNotificationCount:
            loadNotificationCount

    };


/* ============================================================
   END
   ============================================================ */

console.log(
    "AFC Isiu Youth Portal dashboard module loaded."
);
