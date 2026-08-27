/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   FILE: js/api.js
   PURPOSE: Central API communication layer
   PHASE B
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
         * Replace this with your deployed
         * Google Apps Script Web App URL.
         *
         * Example:
         *
         * https://script.google.com/macros/s/XXXXXXXX/exec
         */

        BASE_URL:
            "https://script.google.com/macros/s/AKfycbyt9ATaXy8u-5kQ9OZFzblzhkMk9W1qo8TjaXSl3wE/dev"


    };


    /* ========================================================
       API CLIENT
       ======================================================== */

    const API = {


        /* ====================================================
           GET REQUEST
           ==================================================== */

        async get(action, params = {}) {

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

                    const value =
                        params[key];


                    if (
                        value !== undefined &&
                        value !== null &&
                        value !== ""
                    ) {

                        url.searchParams.set(
                            key,
                            value
                        );

                    }

                });


            try {

                const response =
                    await fetch(
                        url.toString(),
                        {

                            method: "GET",

                            credentials: "omit"

                        }
                    );


                return await handleResponse(
                    response
                );


            } catch (error) {

                return handleNetworkError(
                    error
                );

            }

        },


        /* ====================================================
           POST REQUEST
           ==================================================== */

        async post(
            action,
            body = {},
            token = ""
        ) {

            const payload = {

                ...body,

                action:
                    action

            };


            if (token) {

                payload.token =
                    token;

            }


            try {

                const response =
                    await fetch(
                        API_CONFIG.BASE_URL,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "text/plain;charset=utf-8"

                            },

                            body:
                                JSON.stringify(
                                    payload
                                ),

                            credentials: "omit"

                        }
                    );


                return await handleResponse(
                    response
                );


            } catch (error) {

                return handleNetworkError(
                    error
                );

            }

        }


    };


    /* ========================================================
       HANDLE RESPONSE
       ======================================================== */

    async function handleResponse(
        response
    ) {

        let data;


        try {

            data =
                await response.json();

        } catch (error) {

            return {

                success:
                    false,

                message:
                    "The server returned an invalid response.",

                data:
                    null

            };

        }


        /*
         * HTTP failure
         */

        if (!response.ok) {

            return {

                success:
                    false,

                message:
                    data.message ||
                    "The request could not be completed.",

                data:
                    data.data ||
                    null

            };

        }


        return {

            success:
                data.success === true,

            message:
                data.message ||
                "",

            data:
                data.data ||
                null,

            raw:
                data

        };

    }


    /* ========================================================
       HANDLE NETWORK ERROR
       ======================================================== */

    function handleNetworkError(
        error
    ) {

        console.error(
            "API request failed:",
            error
        );


        return {

            success:
                false,

            message:
                "Unable to connect to the portal server. Please check your internet connection and try again.",

            data:
                null,

            networkError:
                true

        };

    }


    /* ========================================================
       AUTH API
       ======================================================== */

    const AuthAPI = {


        /* ----------------------------------------------------
           REGISTER
           ---------------------------------------------------- */

        register(data) {

            return API.post(
                "register",
                data
            );

        },


        /* ----------------------------------------------------
           LOGIN
           ---------------------------------------------------- */

        login(
            email,
            password,
            deviceInfo = ""
        ) {

            return API.post(

                "login",

                {

                    email:
                        email,

                    password:
                        password,

                    device_info:
                        deviceInfo

                }

            );

        },


        /* ----------------------------------------------------
           LOGOUT
           ---------------------------------------------------- */

        logout(token) {

            return API.post(
                "logout",
                {},
                token
            );

        },


        /* ----------------------------------------------------
           PROFILE
           ---------------------------------------------------- */

        getProfile(token) {

            return API.post(
                "getprofile",
                {},
                token
            );

        },


        /* ----------------------------------------------------
           UPDATE PROFILE
           ---------------------------------------------------- */

        updateProfile(
            data,
            token
        ) {

            return API.post(
                "updateprofile",
                data,
                token
            );

        },


        /* ----------------------------------------------------
           PERMISSIONS
           ---------------------------------------------------- */

        getPermissions(token) {

            return API.post(
                "getmypermissions",
                {},
                token
            );

        }

    };


    /* ========================================================
       PUBLIC API
       ======================================================== */

    const PublicAPI = {


        /* ----------------------------------------------------
           HEALTH
           ---------------------------------------------------- */

        health() {

            return API.get(
                "health"
            );

        },


        /* ----------------------------------------------------
           INSTITUTIONS
           ---------------------------------------------------- */

        getInstitutions() {

            return API.get(
                "getinstitutions"
            );

        },


        /* ----------------------------------------------------
           LESSONS
           ---------------------------------------------------- */

        getLessons(params = {}) {

            return API.get(
                "getlessons",
                params
            );

        },


        getLesson(params = {}) {

            return API.get(
                "getlesson",
                params
            );

        },


        /* ----------------------------------------------------
           ANNOUNCEMENTS
           ---------------------------------------------------- */

        getAnnouncements(
            params = {}
        ) {

            return API.get(
                "getannouncements",
                params
            );

        },


        /* ----------------------------------------------------
           GALLERY
           ---------------------------------------------------- */

        getGallery(
            params = {}
        ) {

            return API.get(
                "getgallery",
                params
            );

        },


        /* ----------------------------------------------------
           EDUCATION
           ---------------------------------------------------- */

        getEducation(
            params = {}
        ) {

            return API.get(
                "geteducation",
                params
            );

        },


        /* ----------------------------------------------------
           BIRTHDAYS
           ---------------------------------------------------- */

        getBirthdays(
            params = {}
        ) {

            return API.get(
                "getbirthdays",
                params
            );

        }

    };


    /* ========================================================
       MEMBER API
       ======================================================== */

    const MemberAPI = {


        /* ----------------------------------------------------
           QUIZ STATUS
           ---------------------------------------------------- */

        getQuizStatus(token) {

            return API.post(
                "getquizstatus",
                {},
                token
            );

        },


        /* ----------------------------------------------------
           GET QUIZ
           ---------------------------------------------------- */

        getQuiz(
            data,
            token
        ) {

            return API.post(
                "getquiz",
                data,
                token
            );

        },


        /* ----------------------------------------------------
           START QUIZ
           ---------------------------------------------------- */

        startQuiz(
            data,
            token
        ) {

            return API.post(
                "startquiz",
                data,
                token
            );

        },


        /* ----------------------------------------------------
           SUBMIT QUIZ
           ---------------------------------------------------- */

        submitQuiz(
            data,
            token
        ) {

            return API.post(
                "submitquiz",
                data,
                token
            );

        },


        /* ----------------------------------------------------
           REFLECTION
           ---------------------------------------------------- */

        submitReflection(
            data,
            token
        ) {

            return API.post(
                "submitreflection",
                data,
                token
            );

        },


        /* ----------------------------------------------------
           PRAYER REQUEST
           ---------------------------------------------------- */

        submitPrayerRequest(
            data,
            token
        ) {

            return API.post(
                "submitprayerrequest",
                data,
                token
            );

        },


        /* ----------------------------------------------------
           SUPPORT
           ---------------------------------------------------- */

        requestSupport(
            data,
            token
        ) {

            return API.post(
                "requestsupport",
                data,
                token
            );

        },


        /* ----------------------------------------------------
           WELFARE REPORTS
           ---------------------------------------------------- */

        getWelfareReports(token) {

            return API.post(
                "getwelfarereports",
                {},
                token
            );

        },


        /* ----------------------------------------------------
           WELFARE TRANSACTIONS
           ---------------------------------------------------- */

        getWelfareTransactions(
            token
        ) {

            return API.post(
                "getwelfaretransactions",
                {},
                token
            );

        },


        /* ----------------------------------------------------
           SECRETARIAT REPORT
           ---------------------------------------------------- */

        submitSecretariatReport(
            data,
            token
        ) {

            return API.post(
                "submitsecretariatreport",
                data,
                token
            );

        },


        /* ----------------------------------------------------
           SECRETARIAT REPORTS
           ---------------------------------------------------- */

        getSecretariatReports(
            token
        ) {

            return API.post(
                "getsecretariatreports",
                {},
                token
            );

        },


        /* ----------------------------------------------------
           NOTIFICATIONS
           ---------------------------------------------------- */

        getNotifications(token) {

            return API.post(
                "getnotifications",
                {},
                token
            );

        },


        markNotificationRead(
            notificationId,
            token
        ) {

            return API.post(

                "marknotificationread",

                {

                    notification_id:
                        notificationId

                },

                token

            );

        },


        /* ----------------------------------------------------
           SETTINGS
           ---------------------------------------------------- */

        getSettings(token) {

            return API.post(
                "getsettings",
                {},
                token
            );

        },


        updateSettings(
            data,
            token
        ) {

            return API.post(
                "updatesettings",
                data,
                token
            );

        }

    };


    /* ========================================================
       EXPORT
       ======================================================== */

    window.AFC = {

        API:
            API,

        AuthAPI:
            AuthAPI,

        PublicAPI:
            PublicAPI,

        MemberAPI:
            MemberAPI

    };


    console.log(
        "AFC API client loaded."
    );

})();
