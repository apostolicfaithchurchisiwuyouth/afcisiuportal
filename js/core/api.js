/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   FILE: api.js
   PURPOSE: Google Apps Script API client
   ============================================================ */

(function () {

    "use strict";


    /* ========================================================
       CONFIGURATION
    ======================================================== */

    const API_URL =
        "https://script.google.com/macros/s/AKfycbyt9ATaXy8u-5kQ9OZFzblzhkMk9W1qo8TjaXSl3wE/dev";


    /* ========================================================
       API REQUEST
    ======================================================== */

    async function apiRequest(
        action,
        options
    ) {

        options =
            options || {};


        const method =
            options.method || "GET";


        const body =
            options.body || null;


        const params =
            options.params || {};


        const token =
            AppState.token;


        /* ----------------------------------------------------
           BUILD URL
        ---------------------------------------------------- */

        const url =
            new URL(API_URL);


        url.searchParams.set(
            "action",
            action
        );


        Object.keys(params).forEach(function (key) {

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


        /* ----------------------------------------------------
           TOKEN
        ---------------------------------------------------- */

        if (
            token &&
            method === "GET"
        ) {

            url.searchParams.set(
                "token",
                token
            );

        }


        /* ----------------------------------------------------
           REQUEST OPTIONS
        ---------------------------------------------------- */

        const requestOptions = {

            method: method,

            redirect: "follow"

        };


        if (method !== "GET") {

            requestOptions.headers = {

                "Content-Type":
                    "text/plain;charset=utf-8"

            };


            requestOptions.body =
                JSON.stringify(

                    Object.assign(
                        {},
                        body || {},
                        token
                            ? { token: token }
                            : {},
                        { action: action }
                    )

                );

        }


        /* ----------------------------------------------------
           SEND REQUEST
        ---------------------------------------------------- */

        const response =
            await fetch(
                url.toString(),
                requestOptions
            );


        if (!response.ok) {

            throw new Error(
                "API request failed: " +
                response.status
            );

        }


        const result =
            await response.json();


        return result;

    }


    /* ========================================================
       GET
    ======================================================== */

    window.apiGet = function (
        action,
        params
    ) {

        return apiRequest(
            action,
            {

                method: "GET",

                params:
                    params || {}

            }
        );

    };


    /* ========================================================
       POST
    ======================================================== */

    window.apiPost = function (
        action,
        body
    ) {

        return apiRequest(
            action,
            {

                method: "POST",

                body:
                    body || {}

            }
        );

    };


    /* ========================================================
       EXPORT
    ======================================================== */

    window.PortalAPI = {

        request:
            apiRequest,

        get:
            apiGet,

        post:
            apiPost

    };


})();
