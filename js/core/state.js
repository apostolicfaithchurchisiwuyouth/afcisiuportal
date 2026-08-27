/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   GLOBAL APPLICATION STATE
   ============================================================ */

(function () {

    "use strict";


    window.AppState = {

        /* ----------------------------------------------------
           AUTHENTICATION
           ---------------------------------------------------- */

        user: null,

        token: null,

        authenticated: false,


        /* ----------------------------------------------------
           APPLICATION
           ---------------------------------------------------- */

        currentPage: "home",

        loading: false,


        /* ----------------------------------------------------
           DATA
           ---------------------------------------------------- */

        notifications: [],

        settings: {},

        lessons: [],

        currentLesson: null,

        currentQuiz: null

    };


    /* ========================================================
       SESSION
       ======================================================== */

    window.setSession = function (
        session,
        user
    ) {

        AppState.token =
            session &&
            session.token
                ? session.token
                : null;


        AppState.user =
            user || null;


        AppState.authenticated =
            Boolean(
                AppState.token &&
                AppState.user
            );

    };


    /* ========================================================
       CLEAR SESSION
       ======================================================== */

    window.clearSession = function () {

        AppState.token = null;

        AppState.user = null;

        AppState.authenticated = false;

    };


    /* ========================================================
       AUTH CHECK
       ======================================================== */

    window.isAuthenticated = function () {

        return Boolean(
            AppState.authenticated &&
            AppState.token &&
            AppState.user
        );

    };


})();
