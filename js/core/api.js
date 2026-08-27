/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   API CLIENT
   ============================================================ */

(function () {

    "use strict";


    /* ========================================================
       API CONFIGURATION
       ======================================================== */

    const API_CONFIG = {

        /*
         * IMPORTANT:
         *
         * We will put your deployed Apps Script
         * Web App URL here.
         *
         * DO NOT put it anywhere else in the project.
         */

        BASE_URL:
            "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE"

    };


    window.API_CONFIG =
        API_CONFIG;


    /* ========================================================
       API REQUEST
       ======================================================== */

    async function request(
        action,
        body = {},
        params = {}
    ) {

        const payload = {

            action,

            ...body

        };


        /*
         * Add the current session token
         * automatically when available.
         */

        if (AppState.token) {

            payload.token =
                AppState.token;

        }


        const url =
            new URL(
                API_CONFIG.BASE_URL
            );


        url.searchParams.set(
            "action",
            action
        );


        Object.keys(params)
            .forEach(function (key) {

                if (
                    params[key] !== undefined &&
                    params[key] !== null
                ) {

                    url.searchParams.set(
                        key,
                        params[key]
                    );

                }

            });


        let response;


        try {

            response =
                await fetch(
                    url.toString(),
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "text/plain;charset=utf-8"

                        },

                        body:
                            JSON.stringify(
                                payload
                            )

                    }
                );

        } catch (error) {

            throw new Error(
                "Unable to connect to the portal server."
            );

        }


        if (!response.ok) {

            throw new Error(
                "The portal server returned an error."
            );

        }


        let result;


        try {

            result =
                await response.json();

        } catch (error) {

            throw new Error(
                "The server returned an invalid response."
            );

        }


        /*
         * We will align this exactly with
         * 03_Response.gs once you send it.
         */

        if (
            result &&
            result.success === false
        ) {

            throw new Error(
                result.message ||
                "The request could not be completed."
            );

        }


        return result;

    }


    /* ========================================================
       PUBLIC API
       ======================================================== */

    window.API = {


        health() {

            return request(
                "health"
            );

        },


        getInstitutions() {

            return request(
                "getinstitutions"
            );

        },


        register(data) {

            return request(
                "register",
                data
            );

        },


        login(
            email,
            password
        ) {

            return request(
                "login",
                {

                    email,

                    password

                }
            );

        },


        logout() {

            return request(
                "logout"
            );

        },


        getProfile() {

            return request(
                "getprofile"
            );

        },


        updateProfile(data) {

            return request(
                "updateprofile",
                data
            );

        },


        getLessons(params = {}) {

            return request(
                "getlessons",
                {},
                params
            );

        },


        getLesson(params = {}) {

            return request(
                "getlesson",
                {},
                params
            );

        },


        getQuiz(params = {}) {

            return request(
                "getquiz",
                {},
                params
            );

        },


        startQuiz(data = {}) {

            return request(
                "startquiz",
                data
            );

        },


        submitQuiz(data = {}) {

            return request(
                "submitquiz",
                data
            );

        },


        getNotifications() {

            return request(
                "getnotifications"
            );

        },


        markNotificationRead(
            data
        ) {

            return request(
                "marknotificationread",
                data
            );

        },


        getSettings() {

            return request(
                "getsettings"
            );

        },


        updateSettings(data) {

            return request(
                "updatesettings",
                data
            );

        }

    };


})();
