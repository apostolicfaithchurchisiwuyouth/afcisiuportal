/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL V2
 * STEP 10E — AUTHENTICATION STATE
 * ============================================================
 *
 * PURPOSE:
 * ------------------------------------------------------------
 * Manages the logged-in user's session on the frontend.
 *
 * RESPONSIBILITIES:
 * 1. Store login session
 * 2. Retrieve login session
 * 3. Check whether user is authenticated
 * 4. Get current user
 * 5. Clear session on logout
 * 6. Protect authenticated pages
 * 7. Connect logout to backend
 *
 * ============================================================
 */

"use strict";


/* ============================================================
   1. STORAGE KEYS
   ============================================================ */

const AUTH_STORAGE_KEYS = {

    SESSION:
        "afc_isiu_auth_session",

    USER:
        "afc_isiu_auth_user"

};


/* ============================================================
   2. SAFE STORAGE
   ============================================================ */

function getStoredAuthSession_() {

    try {

        const stored =
            localStorage.getItem(
                AUTH_STORAGE_KEYS.SESSION
            );

        if (!stored) {

            return null;

        }

        return JSON.parse(stored);

    } catch (error) {

        console.error(
            "Unable to read stored auth session:",
            error
        );

        return null;

    }

}


/* ============================================================
   3. GET STORED USER
   ============================================================ */

function getStoredAuthUser_() {

    try {

        const stored =
            localStorage.getItem(
                AUTH_STORAGE_KEYS.USER
            );

        if (!stored) {

            return null;

        }

        return JSON.parse(stored);

    } catch (error) {

        console.error(
            "Unable to read stored user:",
            error
        );

        return null;

    }

}


/* ============================================================
   4. SAVE AUTHENTICATION
   ============================================================ */

function saveAuthentication(
    loginResult
) {

    if (
        !loginResult ||
        !loginResult.user ||
        !loginResult.session
    ) {

        throw new Error(
            "Invalid login response."
        );

    }


    const user =
        loginResult.user;

    const session =
        loginResult.session;


    try {

        localStorage.setItem(

            AUTH_STORAGE_KEYS.USER,

            JSON.stringify(
                user
            )

        );


        localStorage.setItem(

            AUTH_STORAGE_KEYS.SESSION,

            JSON.stringify(
                session
            )

        );


        console.log(
            "Authentication saved successfully."
        );


        return {

            success:
                true,

            user:
                user,

            session:
                session

        };


    } catch (error) {

        console.error(
            "Unable to save authentication:",
            error
        );


        return {

            success:
                false,

            message:
                "Unable to save your login session."

        };

    }

}


/* ============================================================
   5. GET CURRENT SESSION
   ============================================================ */

function getAuthSession() {

    return getStoredAuthSession_();

}


/* ============================================================
   6. GET CURRENT USER
   ============================================================ */

function getCurrentUser() {

    return getStoredAuthUser_();

}


/* ============================================================
   7. GET AUTH TOKEN
   ============================================================ */

function getAuthToken() {

    const session =
        getAuthSession();


    if (
        !session ||
        !session.token
    ) {

        return "";

    }


    return String(
        session.token
    );

}


/* ============================================================
   8. CHECK AUTHENTICATION
   ============================================================ */

function isAuthenticated() {

    const session =
        getAuthSession();

    const user =
        getCurrentUser();


    if (
        !session ||
        !user
    ) {

        return false;

    }


    if (!session.token) {

        return false;

    }


    /*
     * Check session expiration if available.
     */

    if (session.expires_at) {

        const expiresAt =
            new Date(
                session.expires_at
            );


        if (
            !isNaN(
                expiresAt.getTime()
            ) &&
            expiresAt.getTime() <=
                Date.now()
        ) {

            clearAuthentication();

            return false;

        }

    }


    return true;

}


/* ============================================================
   9. GET AUTHENTICATED REQUEST DATA
   ============================================================ */

function getAuthenticatedRequestData(
    payload = {}
) {

    const token =
        getAuthToken();


    return {

        ...payload,

        token:
            token

    };

}


/* ============================================================
   10. LOGOUT
   ============================================================ */

async function logoutUserFrontend() {

    const token =
        getAuthToken();


    /*
     * Try to notify the backend.
     *
     * Even if the backend request fails,
     * we still clear the local session.
     */

    if (token) {

        try {

            await API.post(

                "logout",

                {
                    token:
                        token
                }

            );

        } catch (error) {

            console.warn(
                "Backend logout request failed:",
                error
            );

        }

    }


    clearAuthentication();


    return {

        success:
            true,

        message:
            "You have been logged out."

    };

}


/* ============================================================
   11. CLEAR AUTHENTICATION
   ============================================================ */

function clearAuthentication() {

    try {

        localStorage.removeItem(
            AUTH_STORAGE_KEYS.SESSION
        );

        localStorage.removeItem(
            AUTH_STORAGE_KEYS.USER
        );

    } catch (error) {

        console.error(
            "Unable to clear authentication:",
            error
        );

    }


    console.log(
        "Authentication cleared."
    );

}


/* ============================================================
   12. PROTECT PAGE
   ============================================================ */

function requireLogin(
    redirectPage = "login.html"
) {

    if (
        isAuthenticated()
    ) {

        return true;

    }


    console.warn(
        "Authentication required."
    );


    window.location.href =
        redirectPage;


    return false;

}


/* ============================================================
   13. REDIRECT IF ALREADY LOGGED IN
   ============================================================ */

function redirectIfAuthenticated(
    redirectPage = "index.html"
) {

    if (
        isAuthenticated()
    ) {

        window.location.href =
            redirectPage;

        return true;

    }


    return false;

}


/* ============================================================
   14. GET USER DISPLAY NAME
   ============================================================ */

function getUserDisplayName() {

    const user =
        getCurrentUser();


    if (!user) {

        return "";

    }


    const firstName =
        String(
            user.first_name || ""
        ).trim();


    const lastName =
        String(
            user.last_name || ""
        ).trim();


    return (
        firstName +
        (
            lastName
                ? " " + lastName
                : ""
        )
    ).trim();

}


/* ============================================================
   15. GET USER FIRST NAME
   ============================================================ */

function getUserFirstName() {

    const user =
        getCurrentUser();


    if (!user) {

        return "";

    }


    return String(
        user.first_name || ""
    ).trim();

}


/* ============================================================
   16. GET USER ID
   ============================================================ */

function getCurrentUserId() {

    const user =
        getCurrentUser();


    if (!user) {

        return "";

    }


    return String(
        user.user_id || ""
    ).trim();

}


/* ============================================================
   17. AUTH STATE SUMMARY
   ============================================================ */

function getAuthState() {

    const authenticated =
        isAuthenticated();


    const user =
        authenticated
            ? getCurrentUser()
            : null;


    const session =
        authenticated
            ? getAuthSession()
            : null;


    return {

        authenticated:
            authenticated,

        user:
            user,

        session:
            session,

        userId:
            user
                ? user.user_id || ""
                : "",

        displayName:
            user
                ? getUserDisplayName()
                : "",

        firstName:
            user
                ? getUserFirstName()
                : ""

    };

}


/* ============================================================
   18. GLOBAL EXPORT
   ============================================================ */

window.AUTH =
    {

        save:
            saveAuthentication,

        getSession:
            getAuthSession,

        getUser:
            getCurrentUser,

        getToken:
            getAuthToken,

        isAuthenticated:
            isAuthenticated,

        getState:
            getAuthState,

        getUserId:
            getCurrentUserId,

        getDisplayName:
            getUserDisplayName,

        getFirstName:
            getUserFirstName,

        getRequestData:
            getAuthenticatedRequestData,

        logout:
            logoutUserFrontend,

        clear:
            clearAuthentication,

        requireLogin:
            requireLogin,

        redirectIfAuthenticated:
            redirectIfAuthenticated

    };


/* ============================================================
   19. GLOBAL HELPERS
   ============================================================ */

window.saveAuthentication =
    saveAuthentication;

window.isAuthenticated =
    isAuthenticated;

window.getCurrentUser =
    getCurrentUser;

window.getAuthToken =
    getAuthToken;

window.getAuthState =
    getAuthState;

window.logoutUserFrontend =
    logoutUserFrontend;


/* ============================================================
   20. STARTUP LOG
   ============================================================ */

console.log(
    "AFC Isiu Youth Portal authentication state loaded.",
    {
        authenticated:
            isAuthenticated(),

        user:
            getCurrentUser()
    }
);
