/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   FILE: state.js
   PURPOSE: Runtime application state
   ============================================================ */

(function () {

    "use strict";


    window.AppState = {

        authenticated: false,

        token: null,

        user: null,

        currentPage: "home",

        currentLesson: null,

        currentQuiz: null,

        lessons: [],

        notifications: [],

        settings: {},

        loading: false

    };


    window.setAppState = function (updates) {

        if (!updates || typeof updates !== "object") {

            return;

        }


        Object.keys(updates).forEach(function (key) {

            AppState[key] = updates[key];

        });


        window.dispatchEvent(
            new CustomEvent("appstatechange", {
                detail: AppState
            })
        );

    };


    window.resetAppState = function () {

        AppState.authenticated = false;

        AppState.token = null;

        AppState.user = null;

        AppState.currentPage = "home";

        AppState.currentLesson = null;

        AppState.currentQuiz = null;

        AppState.lessons = [];

        AppState.notifications = [];

        AppState.settings = {};

        AppState.loading = false;


        window.dispatchEvent(
            new CustomEvent("appstatechange", {
                detail: AppState
            })
        );

    };


})();
