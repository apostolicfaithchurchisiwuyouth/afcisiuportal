/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL V2
 * STEP 10C — FRONTEND AUTHENTICATION
 * ============================================================
 *
 * Handles:
 *
 * 1. User registration
 * 2. User login
 * 3. Session storage
 * 4. Current-user retrieval
 * 5. Authentication checks
 * 6. Logout
 * 7. Authentication events
 *
 * Backend:
 * Google Apps Script
 *
 * Backend authentication functions:
 * - registerUser
 * - loginUser
 *
 * ============================================================
 */

"use strict";


/* ============================================================
   1. AUTH CONFIGURATION
   ============================================================ */

const AUTH_CONFIG = {

    /*
     * Storage keys.
     */

    SESSION_KEY:
        "afc_isiu_auth_session",

    USER_KEY:
        "afc_isiu_current_user",

    TOKEN_KEY:
        "afc_isiu_auth_token",

    /*
     * Session duration.
     *
     * The backend remains responsible for validating the
     * actual session/token.
     */

    SESSION_DURATION:
        7 * 24 * 60 * 60 * 1000
};


/* ============================================================
   2. AUTH ERROR
   ============================================================ */

class AuthError extends Error {

    constructor(message, details = {}) {

        super(message);

        this.name =
            "AuthError";

        this.details =
            details;
    }
}


/* ============================================================
   3. STORAGE HELPERS
   ============================================================ */

function saveAuthStorage_(
    session,
    user,
    token
) {

    try {

        if (session !== undefined) {

            localStorage.setItem(
                AUTH_CONFIG.SESSION_KEY,
                JSON.stringify(session)
            );
        }


        if (user !== undefined) {

            localStorage.setItem(
                AUTH_CONFIG.USER_KEY,
                JSON.stringify(user)
            );
        }


        if (token) {

            localStorage.setItem(
                AUTH_CONFIG.TOKEN_KEY,
                token
            );
        }


        return true;

    } catch (error) {

        console.error(
            "Unable to save authentication data:",
            error
        );

        return false;
    }
}


/* ============================================================
   4. GET STORED SESSION
   ============================================================ */

function getStoredAuthSession_() {

    try {

        const raw =
            localStorage.getItem(
                AUTH_CONFIG.SESSION_KEY
            );

        if (!raw) {
            return null;
        }

        return JSON.parse(raw);

    } catch (error) {

        console.error(
            "Unable to read stored session:",
            error
        );

        return null;
    }
}


/* ============================================================
   5. GET STORED USER
   ============================================================ */

function getStoredUser_() {

    try {

        const raw =
            localStorage.getItem(
                AUTH_CONFIG.USER_KEY
            );

        if (!raw) {
            return null;
        }

        return JSON.parse(raw);

    } catch (error) {

        console.error(
            "Unable to read stored user:",
            error
        );

        return null;
    }
}


/* ============================================================
   6. GET STORED TOKEN
   ============================================================ */

function getStoredToken_() {

    try {

        return localStorage.getItem(
            AUTH_CONFIG.TOKEN_KEY
        );

    } catch (error) {

        return null;
    }
}


/* ============================================================
   7. CLEAR AUTHENTICATION
   ============================================================ */

function clearAuthStorage_() {

    try {

        localStorage.removeItem(
            AUTH_CONFIG.SESSION_KEY
        );

        localStorage.removeItem(
            AUTH_CONFIG.USER_KEY
        );

        localStorage.removeItem(
            AUTH_CONFIG.TOKEN_KEY
        );

        return true;

    } catch (error) {

        console.error(
            "Unable to clear authentication data:",
            error
        );

        return false;
    }
}


/* ============================================================
   8. NORMALIZE BACKEND RESPONSE
   ============================================================ */

function normalizeAuthResponse_(
    response
) {

    if (!response) {

        throw new AuthError(
            "The authentication server returned no response."
        );
    }


    if (response.success === false) {

        throw new AuthError(
            response.message ||
            "Authentication request failed.",
            response
        );
    }


    /*
     * Try to locate the user object.
     */

    const user =
        response.user ||
        response.member ||
        response.profile ||
        null;


    /*
     * Try to locate the session object.
     */

    const session =
        response.session ||
        response.auth ||
        null;


    /*
     * Try to locate the token.
     */

    const token =
        response.token ||
        response.auth_token ||
        response.session_token ||
        (
            session &&
            (
                session.token ||
                session.auth_token ||
                session.session_token
            )
        ) ||
        null;


    return {

        success:
            response.success !== false,

        user:
            user,

        session:
            session,

        token:
            token,

        raw:
            response
    };
}


/* ============================================================
   9. SAVE SUCCESSFUL AUTHENTICATION
   ============================================================ */

function storeSuccessfulAuthentication_(
    authResult
) {

    if (!authResult) {
        return false;
    }


    saveAuthStorage_(
        authResult.session,
        authResult.user,
        authResult.token
    );


    /*
     * Store a local timestamp so the frontend knows when
     * authentication was established.
     */

    try {

        localStorage.setItem(
            "afc_isiu_auth_timestamp",
            String(Date.now())
        );

    } catch (error) {

        console.warn(
            "Could not store authentication timestamp."
        );
    }


    return true;
}


/* ============================================================
   10. REGISTER USER
   ============================================================
 *
 * Usage:
 *
 * const result = await registerUser({
 *
 *     email: "example@email.com",
 *     password: "password",
 *
 *     ...other backend registration fields
 *
 * });
 *
 * ============================================================
 */

async function registerUser(
    userData
) {

    try {

        if (
            !userData ||
            typeof userData !== "object"
        ) {

            throw new AuthError(
                "Registration information is required."
            );
        }


        /*
         * Do not allow an empty registration object.
         */

        if (
            Object.keys(userData).length === 0
        ) {

            throw new AuthError(
                "Registration information is required."
            );
        }


        console.log(
            "Registering user..."
        );


        const response =
            await API.post(
                "registerUser",
                userData
            );


        const authResult =
            normalizeAuthResponse_(
                response
            );


        /*
         * Some registration systems create the account
         * without automatically logging the user in.
         *
         * Therefore we only store authentication data if
         * the backend actually returned it.
         */

        if (
            authResult.user ||
            authResult.session ||
            authResult.token
        ) {

            storeSuccessfulAuthentication_(
                authResult
            );
        }


        console.log(
            "Registration successful.",
            authResult
        );


        window.dispatchEvent(
            new CustomEvent(
                "auth:registered",
                {
                    detail:
                        authResult
                }
            )
        );


        return {

            success:
                true,

            user:
                authResult.user,

            session:
                authResult.session,

            token:
                authResult.token,

            data:
                authResult.raw
        };


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        return {

            success:
                false,

            message:
                error.message ||
                "Registration failed.",

            error:
                error
        };
    }
}


/* ============================================================
   11. LOGIN USER
   ============================================================
 *
 * Usage:
 *
 * const result = await loginUser({
 *
 *     email: "example@email.com",
 *     password: "password"
 *
 * });
 *
 * ============================================================
 */

async function loginUser(
    loginData
) {

    try {

        if (
            !loginData ||
            typeof loginData !== "object"
        ) {

            throw new AuthError(
                "Login information is required."
            );
        }


        if (
            Object.keys(loginData).length === 0
        ) {

            throw new AuthError(
                "Login information is required."
            );
        }


        console.log(
            "Logging user in..."
        );


        const response =
            await API.post(
                "loginUser",
                loginData
            );


        const authResult =
            normalizeAuthResponse_(
                response
            );


        /*
         * Store successful authentication.
         */

        storeSuccessfulAuthentication_(
            authResult
        );


        console.log(
            "Login successful.",
            authResult
        );


        /*
         * Tell the rest of the frontend that the user
         * has successfully logged in.
         */

        window.dispatchEvent(
            new CustomEvent(
                "auth:login",
                {
                    detail:
                        authResult
                }
            )
        );


        return {

            success:
                true,

            user:
                authResult.user,

            session:
                authResult.session,

            token:
                authResult.token,

            data:
                authResult.raw
        };


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        return {

            success:
                false,

            message:
                error.message ||
                "Login failed.",

            error:
                error
        };
    }
}


/* ============================================================
   12. GET CURRENT USER
   ============================================================ */

function getCurrentUser() {

    return getStoredUser_();
}


/* ============================================================
   13. GET CURRENT SESSION
   ============================================================ */

function getCurrentSession() {

    return getStoredAuthSession_();
}


/* ============================================================
   14. GET AUTH TOKEN
   ============================================================ */

function getAuthToken() {

    return getStoredToken_();
}


/* ============================================================
   15. CHECK WHETHER USER IS LOGGED IN
   ============================================================ */

function isLoggedIn() {

    const user =
        getCurrentUser();

    const session =
        getCurrentSession();

    const token =
        getAuthToken();


    /*
     * A user is considered locally authenticated if the
     * frontend has at least the information returned by
     * the backend.
     */

    return !!(
        user ||
        session ||
        token
    );
}


/* ============================================================
   16. LOGOUT
   ============================================================ */

function logoutUser() {

    try {

        /*
         * Remove all locally stored authentication data.
         */

        clearAuthStorage_();


        /*
         * Remove authentication timestamp.
         */

        localStorage.removeItem(
            "afc_isiu_auth_timestamp"
        );


        /*
         * Notify the frontend.
         */

        window.dispatchEvent(
            new CustomEvent(
                "auth:logout"
            )
        );


        console.log(
            "User logged out successfully."
        );


        return {

            success:
                true,

            message:
                "You have been logged out."
        };


    } catch (error) {

        console.error(
            "Logout error:",
            error
        );


        return {

            success:
                false,

            message:
                error.message ||
                "Unable to log out."
        };
    }
}


/* ============================================================
   17. AUTHENTICATION STATE
   ============================================================ */

function getAuthState() {

    const user =
        getCurrentUser();

    const session =
        getCurrentSession();

    const token =
        getAuthToken();


    return {

        authenticated:
            isLoggedIn(),

        user:
            user,

        session:
            session,

        token:
            token
    };
}


/* ============================================================
   18. REQUIRE LOGIN
   ============================================================
 *
 * This will be used later on protected pages such as:
 *
 * - Profile
 * - Quiz
 * - Reflection
 * - Prayer Requests
 * - Welfare
 *
 * ============================================================
 */

function requireLogin(
    redirectTo = "login.html"
) {

    if (isLoggedIn()) {

        return true;
    }


    /*
     * Save the page the user was attempting to visit.
     */

    try {

        sessionStorage.setItem(
            "afc_isiu_redirect_after_login",
            window.location.href
        );

    } catch (error) {

        console.warn(
            "Unable to store redirect location."
        );
    }


    /*
     * Redirect to login page.
     */

    if (
        window.location.pathname
        .toLowerCase()
        .endsWith(
            redirectTo.toLowerCase()
        ) === false
    ) {

        window.location.href =
            redirectTo;
    }


    return false;
}


/* ============================================================
   19. GET POST-LOGIN REDIRECT
   ============================================================ */

function getLoginRedirect() {

    try {

        const redirect =
            sessionStorage.getItem(
                "afc_isiu_redirect_after_login"
            );


        if (redirect) {

            sessionStorage.removeItem(
                "afc_isiu_redirect_after_login"
            );

            return redirect;
        }


    } catch (error) {

        console.warn(
            "Unable to read login redirect."
        );
    }


    return "index.html";
}


/* ============================================================
   20. COMPLETE AUTHENTICATION TEST
   ============================================================ */

function testAuthenticationStorage() {

    console.log(
        "========================================"
    );

    console.log(
        "STEP 10C — AUTHENTICATION STORAGE TEST"
    );

    console.log(
        "========================================"
    );


    const state =
        getAuthState();


    console.log(
        "AUTHENTICATION STATE:"
    );

    console.log(
        state
    );


    console.log(
        "CURRENT USER:",
        getCurrentUser()
    );


    console.log(
        "CURRENT SESSION:",
        getCurrentSession()
    );


    console.log(
        "AUTH TOKEN:",
        getAuthToken()
    );


    console.log(
        "LOGGED IN:",
        isLoggedIn()
    );


    console.log(
        "========================================"
    );

    console.log(
        "STEP 10C STORAGE TEST COMPLETE"
    );

    console.log(
        "========================================"
    );


    return {

        success:
            true,

        authenticated:
            state.authenticated,

        user:
            state.user,

        session:
            state.session,

        timestamp:
            new Date().toISOString()
    };
}


/* ============================================================
   21. GLOBAL API
   ============================================================ */

window.AUTH = {

    register:
        registerUser,

    login:
        loginUser,

    logout:
        logoutUser,

    currentUser:
        getCurrentUser,

    currentSession:
        getCurrentSession,

    token:
        getAuthToken,

    isLoggedIn:
        isLoggedIn,

    state:
        getAuthState,

    requireLogin:
        requireLogin,

    getLoginRedirect:
        getLoginRedirect,

    testStorage:
        testAuthenticationStorage
};


/* ============================================================
   22. GLOBAL FUNCTIONS
   ============================================================ */

window.registerUser =
    registerUser;

window.loginUser =
    loginUser;

window.logoutUser =
    logoutUser;

window.getCurrentUser =
    getCurrentUser;

window.getCurrentSession =
    getCurrentSession;

window.getAuthToken =
    getAuthToken;

window.isLoggedIn =
    isLoggedIn;

window.getAuthState =
    getAuthState;

window.requireLogin =
    requireLogin;


/* ============================================================
   23. AUTH STARTUP LOG
   ============================================================ */

console.log(
    "AFC Isiu Youth Portal authentication layer loaded.",
    {
        loggedIn:
            isLoggedIn(),

        user:
            getCurrentUser()
    }
);
