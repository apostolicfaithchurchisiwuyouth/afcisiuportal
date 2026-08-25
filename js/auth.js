/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL
 * AUTHENTICATION FOUNDATION
 * ============================================================
 */


const AUTH_STORAGE_KEY =
    "afc_current_user";


/**
 * ------------------------------------------------------------
 * GET CURRENT USER
 * ------------------------------------------------------------
 */

function getCurrentUser() {

    try {

        const stored =
            localStorage.getItem(
                AUTH_STORAGE_KEY
            );


        if (!stored) {
            return null;
        }


        return JSON.parse(
            stored
        );

    } catch (error) {

        console.warn(
            "Unable to read current user.",
            error
        );

        return null;

    }

}


/**
 * ------------------------------------------------------------
 * SAVE CURRENT USER
 * ------------------------------------------------------------
 */

function saveCurrentUser(user) {

    if (!user) {
        return false;
    }


    localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify(user)
    );


    return true;

}


/**
 * ------------------------------------------------------------
 * CLEAR CURRENT USER
 * ------------------------------------------------------------
 */

function clearCurrentUser() {

    localStorage.removeItem(
        AUTH_STORAGE_KEY
    );

}


/**
 * ------------------------------------------------------------
 * IS LOGGED IN
 * ------------------------------------------------------------
 */

function isLoggedIn() {

    return !!getCurrentUser();

}
