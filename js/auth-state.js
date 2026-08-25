/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL V2
 * STEP 10E — AUTHENTICATION STATE
 * ============================================================
 *
 * PURPOSE:
 * ------------------------------------------------------------
 * Central authentication state manager for the frontend.
 *
 * 10E is the SINGLE source of truth for frontend
 * authentication storage.
 *
 * Responsibilities:
 *
 * 1. Store authenticated user
 * 2. Store authenticated session
 * 3. Retrieve authenticated user
 * 4. Retrieve session token
 * 5. Check session expiration
 * 6. Protect authenticated pages
 * 7. Redirect authenticated users
 * 8. Logout from backend
 * 9. Clear authentication state
 *
 * LOGIN FLOW:
 *
 *     AUTH.save(result.data)
 *
 * Expected authentication data:
 *
 * {
 *     user: {
 *         user_id: "...",
 *         first_name: "...",
 *         last_name: "..."
 *     },
 *
 *     session: {
 *         token: "...",
 *         expires_at: "..."
 *     }
 * }
 *
 * ============================================================
 */

"use strict";


/* ============================================================
   1. STORAGE KEYS
   ============================================================ */

const AUTH_STORAGE_KEYS = {

    USER:
        "afc_isiu_auth_user",

    SESSION:
        "afc_isiu_auth_session"

};


/* ============================================================
   2. SAFE JSON PARSER
   ============================================================ */

function parseStoredJSON_(value) {

    if (!value) {

        return null;

    }


    try {

        return JSON.parse(value);

    } catch (error) {

        console.warn(
            "Invalid stored authentication data.",
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


        return parseStoredJSON_(stored);

    } catch (error) {

        console.error(
            "Unable to read stored user:",
            error
        );

        return null;

    }

}


/* ============================================================
   4. GET STORED SESSION
   ============================================================ */

function getStoredAuthSession_() {

    try {

        const stored =
            localStorage.getItem(
                AUTH_STORAGE_KEYS.SESSION
            );


        return parseStoredJSON_(stored);

    } catch (error) {

        console.error(
            "Unable to read stored session:",
            error
        );

        return null;

    }

}


/* ============================================================
   5. SAVE AUTHENTICATION
   ============================================================ */

function saveAuthentication(loginResult) {

    if (
        !loginResult ||
        typeof loginResult !== "object"
    ) {

        throw new Error(
            "Invalid authentication response."
        );

    }


    /*
     * Support both:
     *
     * AUTH.save(result.data)
     *
     * and, defensively:
     *
     * AUTH.save(result)
     *
     */

    const source =
        loginResult.data &&
        typeof loginResult.data === "object"
            ? loginResult.data
            : loginResult;


    const user =
        source.user ||
        source.member ||
        null;


    const session =
        source.session ||
        null;


    if (!user) {

        throw new Error(
            "Login response did not contain a user."
        );

    }


    if (!session) {

        throw new Error(
            "Login response did not contain a session."
        );

    }


    if (!session.token) {

        throw new Error(
            "Login response did not contain a session token."
        );

    }


    try {

        /*
         * Save USER.
         */

        localStorage.setItem(

            AUTH_STORAGE_KEYS.USER,

            JSON.stringify(user)

        );


        /*
         * Save SESSION.
         */

        localStorage.setItem(

            AUTH_STORAGE_KEYS.SESSION,

            JSON.stringify(session)

        );


        /*
         * Verify the saved information.
         */

        const savedUser =
            getStoredAuthUser_();


        const savedSession =
            getStoredAuthSession_();


        if (
            !savedUser ||
            !savedSession ||
            !savedSession.token
        ) {

            throw new Error(
                "Authentication data could not be verified after saving."
            );

        }


        console.log(
            "Authentication saved successfully.",
            {

                user_id:
                    savedUser.user_id || "",

                expires_at:
                    savedSession.expires_at || ""

            }
        );


        return {

            success:
                true,

            user:
                savedUser,

            session:
                savedSession

        };

    } catch (error) {

        console.error(
            "Unable to save authentication:",
            error
        );


        clearAuthentication();


        throw new Error(
            "Unable to save your login session."
        );

    }

}


/* ============================================================
   6. GET CURRENT SESSION
   ============================================================ */

function getAuthSession() {

    return getStoredAuthSession_();

}


/* ============================================================
   7. GET CURRENT USER
   ============================================================ */

function getCurrentUser() {

    return getStoredAuthUser_();

}


/* ============================================================
   8. GET AUTH TOKEN
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
    ).trim();

}


/* ============================================================
   9. CHECK SESSION EXPIRATION
   ============================================================ */

function isSessionExpired_(session) {

    if (
        !session ||
        !session.expires_at
    ) {

        /*
         * No expiration supplied.
         *
         * Backend remains the final authority.
         */

        return false;

    }


    const expiresAt =
        new Date(
            session.expires_at
        );


    if (
        isNaN(
            expiresAt.getTime()
        )
    ) {

        console.warn(
            "Invalid session expiration date:",
            session.expires_at
        );


        /*
         * Do not destroy a potentially valid
         * backend session because of a frontend
         * date parsing issue.
         */

        return false;

    }


    return (
        expiresAt.getTime() <=
        Date.now()
    );

}


/* ============================================================
   10. CHECK AUTHENTICATION
   ============================================================ */

function isAuthenticated() {

    const user =
        getCurrentUser();


    const session =
        getAuthSession();


    /*
     * Both user and session are required.
     */

    if (
        !user ||
        !session
    ) {

        return false;

    }


    /*
     * Session token is mandatory.
     */

    if (
        !session.token
    ) {

        clearAuthentication();

        return false;

    }


    /*
     * Check expiration.
     */

    if (
        isSessionExpired_(
            session
        )
    ) {

        console.warn(
            "Stored authentication session has expired."
        );


        clearAuthentication();


        return false;

    }


    return true;

}


/* ============================================================
   11. GET AUTHENTICATED REQUEST DATA
   ============================================================ */

function getAuthenticatedRequestData(payload = {}) {

    const token =
        getAuthToken();


    return {

        ...payload,

        token:
            token

    };

}


/* ============================================================
   12. CLEAR AUTHENTICATION
   ============================================================ */

function clearAuthentication() {

    try {

        /*
         * Current authentication keys.
         */

        localStorage.removeItem(
            AUTH_STORAGE_KEYS.USER
        );


        localStorage.removeItem(
            AUTH_STORAGE_KEYS.SESSION
        );


        /*
         * Previous authentication keys.
         *
         * Keep these removals for migration
         * compatibility.
         */

        localStorage.removeItem(
            "afc_user"
        );


        localStorage.removeItem(
            "afc_session_token"
        );


        localStorage.removeItem(
            "afc_session_expires_at"
        );


        console.log(
            "Authentication cleared."
        );


        return true;

    } catch (error) {

        console.error(
            "Unable to clear authentication:",
            error
        );


        return false;

    }

}


/* ============================================================
   13. LOGOUT
   ============================================================ */

async function logoutUserFrontend() {

    const token =
        getAuthToken();


    /*
     * Try to notify backend.
     */

    if (
        token &&
        typeof API !== "undefined" &&
        API &&
        typeof API.post === "function"
    ) {

        try {

            await API.post(

                "logout",

                {

                    token:
                        token

                }

            );

        } catch (error) {

            /*
             * Local logout must still happen.
             */

            console.warn(
                "Backend logout request failed. Continuing with local logout.",
                error
            );

        }

    }


    /*
     * Always clear local authentication.
     */

    clearAuthentication();


    return {

        success:
            true,

        message:
            "You have been logged out."

    };

}


/* ============================================================
   14. REQUIRE LOGIN
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
        "Authentication required. Redirecting to:",
        redirectPage
    );


    window.location.replace(
        redirectPage
    );


    return false;

}


/* ============================================================
   15. REDIRECT IF ALREADY AUTHENTICATED
   ============================================================ */

function redirectIfAuthenticated(
    redirectPage = "index.html"
) {

    if (
        isAuthenticated()
    ) {

        console.log(
            "Existing authenticated session found."
        );


        window.location.replace(
            redirectPage
        );


        return true;

    }


    return false;

}


/* ============================================================
   16. GET USER DISPLAY NAME
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
   17. GET USER FIRST NAME
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
   18. GET USER ID
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
   19. GET AUTH STATE
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
                ? String(
                    user.user_id || ""
                )
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
   20. DEBUG AUTH STATE
   ============================================================ */

function debugAuthentication() {

    const state =
        getAuthState();


    console.log(
        "========== AFC AUTH STATE =========="
    );


    console.log(
        "Authenticated:",
        state.authenticated
    );


    console.log(
        "User:",
        state.user
    );


    console.log(
        "Session:",
        state.session
    );


    console.log(
        "Token exists:",
        Boolean(
            state.session &&
            state.session.token
        )
    );


    console.log(
        "===================================="
    );


    return state;

}


/* ============================================================
   21. GLOBAL AUTH OBJECT
   ============================================================ */

window.AUTH = {

    /*
     * Save authentication
     */

    save:
        saveAuthentication,


    /*
     * Session
     */

    getSession:
        getAuthSession,


    /*
     * User
     */

    getUser:
        getCurrentUser,


    /*
     * Token
     */

    getToken:
        getAuthToken,


    /*
     * Authentication status
     */

    isAuthenticated:
        isAuthenticated,


    /*
     * Complete state
     */

    getState:
        getAuthState,


    /*
     * User ID
     */

    getUserId:
        getCurrentUserId,


    /*
     * Names
     */

    getDisplayName:
        getUserDisplayName,

    getFirstName:
        getUserFirstName,


    /*
     * Request helper
     */

    getRequestData:
        getAuthenticatedRequestData,


    /*
     * Logout
     */

    logout:
        logoutUserFrontend,


    /*
     * Clear local session
     */

    clear:
        clearAuthentication,


    /*
     * Protect pages
     */

    requireLogin:
        requireLogin,


    /*
     * Redirect already authenticated users
     */

    redirectIfAuthenticated:
        redirectIfAuthenticated,


    /*
     * Debug
     */

    debug:
        debugAuthentication

};


/* ============================================================
   22. GLOBAL COMPATIBILITY HELPERS
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
   23. STARTUP LOG
   ============================================================ */

console.log(
    "AFC Isiu Youth Portal — 10E Authentication State loaded."
);


console.log(
    "Current authentication state:",
    getAuthState()
);


/* ============================================================
   END OF 10E
   ============================================================ */
