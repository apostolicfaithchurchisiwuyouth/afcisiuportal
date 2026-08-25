/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL
 * PHASE 3A — FRONTEND API LAYER
 * ============================================================
 *
 * This file is the single connection between the frontend
 * and the Google Apps Script backend.
 *
 * Frontend pages should call api() instead of repeatedly
 * writing fetch() code.
 * ============================================================
 */

const APP_CONFIG = {

    NAME: "AFC Isiu Youth Portal",

    VERSION: "2.0.0",

    API_URL:
        "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE"

};


/**
 * ============================================================
 * API REQUEST
 * ============================================================
 */
async function api(action, data = {}) {

    try {

        if (
            !APP_CONFIG.API_URL ||
            APP_CONFIG.API_URL.includes(
                "PASTE_YOUR_GOOGLE_APPS_SCRIPT"
            )
        ) {

            throw new Error(
                "Backend API URL has not been configured."
            );

        }


        const payload = {

            action: action,

            ...data

        };


        const response = await fetch(
            APP_CONFIG.API_URL,
            {

                method: "POST",

                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },

                body: JSON.stringify(payload)

            }
        );


        if (!response.ok) {

            throw new Error(
                "Backend request failed. HTTP " +
                response.status
            );

        }


        const result =
            await response.json();


        return result;


    } catch (error) {

        console.error(
            "API Error:",
            error
        );


        return {

            success: false,

            message:
                error.message ||
                "Unable to connect to the server."

        };

    }

}


/**
 * ============================================================
 * LOGIN
 * ============================================================
 */
async function loginUser(email, password) {

    return await api(
        "loginUser",
        {
            email: email,
            password: password
        }
    );

}


/**
 * ============================================================
 * REGISTER
 * ============================================================
 */
async function registerUser(data) {

    return await api(
        "registerUser",
        data
    );

}


/**
 * ============================================================
 * GET USER PROFILE
 * ============================================================
 */
async function getUserProfile(userId) {

    return await api(
        "getUserProfile",
        {
            userId: userId
        }
    );

}


/**
 * ============================================================
 * LOGOUT
 * ============================================================
 */
async function logoutUser(sessionToken) {

    return await api(
        "logoutUser",
        {
            sessionToken: sessionToken
        }
    );

}


/**
 * ============================================================
 * SAVE BIRTHDAY
 * ============================================================
 */
async function saveBirthday(
    userId,
    birthday
) {

    return await api(
        "saveUserBirthday",
        {
            userId: userId,
            birthday: birthday
        }
    );

}


/**
 * ============================================================
 * GET BIRTHDAY
 * ============================================================
 */
async function getBirthday(userId) {

    return await api(
        "getUserBirthday",
        {
            userId: userId
        }
    );

}


/**
 * ============================================================
 * GET LESSONS
 * ============================================================
 */
async function getLessons() {

    return await api(
        "getLessons"
    );

}


/**
 * ============================================================
 * GET QUIZZES
 * ============================================================
 */
async function getQuizzes() {

    return await api(
        "getQuizzes"
    );

}


/**
 * ============================================================
 * GET NOTIFICATIONS
 * ============================================================
 */
async function getNotifications(userId) {

    return await api(
        "getUserNotifications",
        {
            userId: userId
        }
    );

}


/**
 * ============================================================
 * GET UNREAD NOTIFICATION COUNT
 * ============================================================
 */
async function getUnreadNotificationCount(
    userId
) {

    return await api(
        "getUnreadNotificationCount",
        {
            userId: userId
        }
    );

}


/**
 * ============================================================
 * MARK NOTIFICATION AS READ
 * ============================================================
 */
async function markNotificationRead(
    notificationId,
    userId
) {

    return await api(
        "markNotificationAsRead",
        {
            notificationId:
                notificationId,

            userId:
                userId
        }
    );

}


/**
 * ============================================================
 * SESSION STORAGE
 * ============================================================
 */

const Session = {

    save(data) {

        localStorage.setItem(
            "afc_youth_session",
            JSON.stringify(data)
        );

    },


    get() {

        const stored =
            localStorage.getItem(
                "afc_youth_session"
            );

        if (!stored) {
            return null;
        }

        try {

            return JSON.parse(
                stored
            );

        } catch (error) {

            console.error(
                "Invalid session data:",
                error
            );

            this.clear();

            return null;

        }

    },


    clear() {

        localStorage.removeItem(
            "afc_youth_session"
        );

    },


    isLoggedIn() {

        return !!this.get();

    },


    user() {

        const session =
            this.get();

        return session
            ? session.user || null
            : null;

    },


    token() {

        const session =
            this.get();

        return session
            ? session.sessionToken || null
            : null;

    }

};


/**
 * ============================================================
 * PROTECTED PAGE CHECK
 * ============================================================
 */
function requireLogin() {

    if (!Session.isLoggedIn()) {

        window.location.href =
            "index.html";

        return false;

    }

    return true;

}


/**
 * ============================================================
 * LOGOUT HELPER
 * ============================================================
 */
async function logout() {

    const token =
        Session.token();


    if (token) {

        await logoutUser(
            token
        );

    }


    Session.clear();


    window.location.href =
        "index.html";

}


/**
 * ============================================================
 * API CONNECTION TEST
 * ============================================================
 */
async function testFrontendApi() {

    const result =
        await api(
            "healthCheck"
        );


    console.log(
        "AFC PORTAL API TEST:"
    );

    console.log(
        result
    );


    return result;

}
