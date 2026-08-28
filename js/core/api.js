/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   FILE: js/core/api.js
   PURPOSE: Central API communication layer
   PHASE B — AUTHENTICATION + APPLICATION API
   ============================================================ */

(function () {

    "use strict";


    /* ========================================================
       API CONFIGURATION
       ======================================================== */

    const API_CONFIG = {

        /*
         * IMPORTANT
         *
         * This should normally be the deployed Web App URL
         * ending in /exec.
         *
         * Example:
         *
         * https://script.google.com/macros/s/XXXXXXXX/exec
         */

        BASE_URL:
            "https://script.google.com/macros/s/AKfycbzZsyCnWVrcVryBkm2KjPYYy10dQQ5_nDh-vwMcPhCBo4XEYmXTbcYKTedihXDMe7Ij/exec"

    };


    /* ========================================================
       CONFIGURATION CHECK
       ======================================================== */

    function isConfigured() {

        return Boolean(

            API_CONFIG.BASE_URL &&

            API_CONFIG.BASE_URL.trim() !== ""

        );

    }


    /* ========================================================
       HANDLE RESPONSE
       ======================================================== */

    async function handleResponse(
        response
    ) {

        let data = null;


        /*
         * ----------------------------------------------------
         * Try to read JSON response
         * ----------------------------------------------------
         */

        try {

            data =
                await response.json();

        } catch (error) {

            console.error(
                "AFC API JSON parse error:",
                error
            );


            return {

                success:
                    false,

                message:
                    "The server returned an invalid response.",

                data:
                    null,

                raw:
                    null,

                httpStatus:
                    response.status

            };

        }


        /*
         * ----------------------------------------------------
         * HTTP FAILURE
         * ----------------------------------------------------
         */

        if (!response.ok) {

            return {

                success:
                    false,

                message:
                    data &&
                    data.message
                        ? data.message
                        : "The request could not be completed.",

                data:
                    data &&
                    data.data !== undefined
                        ? data.data
                        : null,

                raw:
                    data,

                httpStatus:
                    response.status

            };

        }


        /*
         * ----------------------------------------------------
         * NORMAL RESPONSE
         *
         * Apps Script responses are expected to look like:
         *
         * {
         *   success: true,
         *   message: "...",
         *   data: {...}
         * }
         * ----------------------------------------------------
         */

        return {

            success:
                data &&
                data.success === true,

            message:
                data &&
                data.message
                    ? data.message
                    : "",

            data:
                data &&
                data.data !== undefined
                    ? data.data
                    : null,

            raw:
                data,

            httpStatus:
                response.status

        };

    }


    /* ========================================================
       NETWORK ERROR
       ======================================================== */

    function handleNetworkError(
        error
    ) {

        console.error(
            "AFC API request failed:",
            error
        );


        return {

            success:
                false,

            message:
                "Unable to connect to the portal server. Please check your internet connection and try again.",

            data:
                null,

            raw:
                null,

            networkError:
                true,

            error:
                error

        };

    }


    /* ========================================================
       API CLIENT
       ======================================================== */

    const API = {


        /* ====================================================
           CONFIGURATION
           ==================================================== */

        isConfigured:
            isConfigured,


        getBaseUrl:
            function () {

                return API_CONFIG.BASE_URL;

            },


        /* ====================================================
           GET REQUEST
           ==================================================== */

        async get(
            action,
            params = {}
        ) {

            /*
             * ------------------------------------------------
             * Validate configuration
             * ------------------------------------------------
             */

            if (
                !isConfigured()
            ) {

                return {

                    success:
                        false,

                    message:
                        "The portal backend has not been configured.",

                    data:
                        null,

                    networkError:
                        false

                };

            }


            if (!action) {

                return {

                    success:
                        false,

                    message:
                        "API action is required.",

                    data:
                        null

                };

            }


            /*
             * ------------------------------------------------
             * Build URL
             * ------------------------------------------------
             */

            let url;


            try {

                url =
                    new URL(
                        API_CONFIG.BASE_URL
                    );

            } catch (error) {

                console.error(
                    "Invalid AFC API URL:",
                    error
                );


                return {

                    success:
                        false,

                    message:
                        "The portal API URL is invalid.",

                    data:
                        null

                };

            }


            /*
             * ------------------------------------------------
             * Action
             * ------------------------------------------------
             */

            url.searchParams.set(
                "action",
                action
            );


            /*
             * ------------------------------------------------
             * Additional parameters
             * ------------------------------------------------
             */

            Object.keys(
                params || {}
            )
                .forEach(
                    function (key) {

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

                    }
                );


            /*
             * ------------------------------------------------
             * Request
             * ------------------------------------------------
             */

            try {

                console.log(
                    "AFC API GET:",
                    action
                );


                const response =
                    await fetch(
                        url.toString(),
                        {

                            method:
                                "GET",

                            credentials:
                                "omit",

                            cache:
                                "no-store"

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

            /*
             * ------------------------------------------------
             * Validate configuration
             * ------------------------------------------------
             */

            if (
                !isConfigured()
            ) {

                return {

                    success:
                        false,

                    message:
                        "The portal backend has not been configured.",

                    data:
                        null

                };

            }


            if (!action) {

                return {

                    success:
                        false,

                    message:
                        "API action is required.",

                    data:
                        null

                };

            }


            /*
             * ------------------------------------------------
             * Build payload
             * ------------------------------------------------
             */

            const payload = {

                ...(body || {}),

                action:
                    action

            };


            /*
             * ------------------------------------------------
             * Add authentication token
             * ------------------------------------------------
             */

            if (
                token
            ) {

                payload.token =
                    token;

            }


            /*
             * ------------------------------------------------
             * Request
             * ------------------------------------------------
             */

            try {

                console.log(
                    "AFC API POST:",
                    action
                );


                const response =
                    await fetch(
                        API_CONFIG.BASE_URL,
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "text/plain;charset=utf-8"

                            },

                            body:
                                JSON.stringify(
                                    payload
                                ),

                            credentials:
                                "omit",

                            cache:
                                "no-store"

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
       AUTH API
       ======================================================== */

    const AuthAPI = {


        /* ----------------------------------------------------
           REGISTER
           ---------------------------------------------------- */

        register(
            data
        ) {

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

        logout(
            token
        ) {

            return API.post(
                "logout",
                {},
                token
            );

        },


        /* ----------------------------------------------------
           PROFILE
           ---------------------------------------------------- */

        getProfile(
            token
        ) {

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

        getPermissions(
            token
        ) {

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

        getLessons(
            params = {}
        ) {

            return API.get(
                "getlessons",
                params
            );

        },


        getLesson(
            params = {}
        ) {

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

        getQuizStatus(
            token
        ) {

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

        getWelfareReports(
            token
        ) {

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

        getNotifications(
            token
        ) {

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

        getSettings(
            token
        ) {

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
       PRESERVE EXISTING AFC APPLICATION OBJECT
       ======================================================== */

    /*
     * IMPORTANT:
     *
     * app.js creates window.AFC.
     *
     * We must NOT replace it.
     *
     * Instead, preserve everything already there and add
     * the API modules to it.
     */

    window.AFC =
        window.AFC || {};


    window.AFC.API =
        API;


    window.AFC.AuthAPI =
        AuthAPI;


    window.AFC.PublicAPI =
        PublicAPI;


    window.AFC.MemberAPI =
        MemberAPI;


    /* ========================================================
       GLOBAL API ALIAS
       ======================================================== */

    /*
     * auth.js uses:
     *
     * window.API
     *
     * Therefore expose the same API client globally.
     */

    window.API =
        API;


    /* ========================================================
       GLOBAL AUTH API ALIASES
       ======================================================== */

    window.AuthAPI =
        AuthAPI;


    window.PublicAPI =
        PublicAPI;


    window.MemberAPI =
        MemberAPI;


    /* ========================================================
       DEBUG INFORMATION
       ======================================================== */

    console.log(
        "AFC API client loaded successfully."
    );


    console.log(
        "AFC API configured:",
        API.isConfigured()
    );


    console.log(
        "AFC API base URL:",
        API.getBaseUrl()
    );


})();
