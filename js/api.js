/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL V2
 * STEP 10B — FRONTEND API CONNECTION LAYER
 * ============================================================
 *
 * PURPOSE:
 * ------------------------------------------------------------
 * This file connects the frontend PWA to the Google Apps
 * Script backend.
 *
 * ALL frontend/backend communication should eventually pass
 * through this file.
 *
 * DO NOT put UI code in this file.
 * DO NOT put HTML in this file.
 *
 * ============================================================
 */

"use strict";


/* ============================================================
   1. API CONFIGURATION
   ============================================================ */

const API_CONFIG = {

    /*
     * IMPORTANT:
     * Replace ONLY the URL below with your deployed
     * Google Apps Script Web App URL.
     *
     * Example:
     * https://script.google.com/macros/s/XXXXXXXXXXXX/exec
     */

    BASE_URL:
        "https://script.google.com/macros/s/AKfycbzZsyCnWVrcVryBkm2KjPYYy10dQQ5_nDh-vwMcPhCBo4XEYmXTbcYKTedihXDMe7Ij/exec",

    /*
     * Request timeout.
     */
    TIMEOUT:
        30000,

    /*
     * Default language.
     */
    LANGUAGE:
        "en",

    /*
     * Application name.
     */
    APP_NAME:
        "AFC Isiu Youth Portal",

    /*
     * Application version.
     */
    VERSION:
        "2.0.0"
};


/* ============================================================
   2. API ERROR CLASS
   ============================================================ */

class ApiError extends Error {

    constructor(message, details = {}) {

        super(message);

        this.name =
            "ApiError";

        this.details =
            details;
    }
}


/* ============================================================
   3. CHECK API CONFIGURATION
   ============================================================ */

function isApiConfigured() {

    return (
        API_CONFIG.BASE_URL &&
        API_CONFIG.BASE_URL !==
            "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL"
    );
}


/* ============================================================
   4. BUILD REQUEST URL
   ============================================================ */

function buildApiUrl_(action, params = {}) {

    if (!isApiConfigured()) {

        throw new ApiError(
            "The backend API URL has not been configured yet."
        );
    }

    const url =
        new URL(API_CONFIG.BASE_URL);

    url.searchParams.set(
        "action",
        action
    );

    Object.keys(params).forEach(function(key) {

        const value =
            params[key];

        if (
            value !== undefined &&
            value !== null
        ) {

            url.searchParams.set(
                key,
                String(value)
            );
        }

    });

    return url.toString();
}


/* ============================================================
   5. SAFE JSON PARSER
   ============================================================ */

async function parseApiResponse_(response) {

    const text =
        await response.text();

    if (!text) {

        throw new ApiError(
            "The backend returned an empty response."
        );
    }

    let data;

    try {

        data =
            JSON.parse(text);

    } catch (error) {

        console.error(
            "Invalid JSON returned by backend:",
            text
        );

        throw new ApiError(
            "The backend returned an invalid response.",
            {
                rawResponse:
                    text
            }
        );
    }

    return data;
}


/* ============================================================
   6. GET REQUEST
   ============================================================ */

async function apiGet(
    action,
    params = {}
) {

    try {

        const url =
            buildApiUrl_(
                action,
                params
            );

        const controller =
            new AbortController();

        const timeout =
            setTimeout(
                function() {
                    controller.abort();
                },
                API_CONFIG.TIMEOUT
            );


        const response =
            await fetch(
                url,
                {
                    method:
                        "GET",

                    headers: {
                        "Accept":
                            "application/json"
                    },

                    signal:
                        controller.signal
                }
            );


        clearTimeout(timeout);


        if (!response.ok) {

            throw new ApiError(
                "Backend request failed.",
                {
                    status:
                        response.status,

                    statusText:
                        response.statusText
                }
            );
        }


        const data =
            await parseApiResponse_(
                response
            );


        /*
         * Backend-level failure.
         */
        if (
            data &&
            data.success === false
        ) {

            throw new ApiError(
                data.message ||
                "The backend request was unsuccessful.",
                data
            );
        }


        return data;


    } catch (error) {

        console.error(
            "[API GET ERROR]",
            action,
            error
        );

        if (
            error.name ===
            "AbortError"
        ) {

            throw new ApiError(
                "The request took too long. Please try again."
            );
        }

        throw error;
    }
}


/* ============================================================
   7. POST REQUEST
   ============================================================ */

async function apiPost(
    action,
    payload = {}
) {

    try {

        const url =
            buildApiUrl_(
                action
            );


        const controller =
            new AbortController();

        const timeout =
            setTimeout(
                function() {
                    controller.abort();
                },
                API_CONFIG.TIMEOUT
            );


        const response =
            await fetch(
                url,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8",

                        "Accept":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            action:
                                action,

                            ...payload
                        }),

                    signal:
                        controller.signal
                }
            );


        clearTimeout(timeout);


        if (!response.ok) {

            throw new ApiError(
                "Backend request failed.",
                {
                    status:
                        response.status,

                    statusText:
                        response.statusText
                }
            );
        }


        const data =
            await parseApiResponse_(
                response
            );


        if (
            data &&
            data.success === false
        ) {

            throw new ApiError(
                data.message ||
                "The backend request was unsuccessful.",
                data
            );
        }


        return data;


    } catch (error) {

        console.error(
            "[API POST ERROR]",
            action,
            error
        );


        if (
            error.name ===
            "AbortError"
        ) {

            throw new ApiError(
                "The request took too long. Please try again."
            );
        }


        throw error;
    }
}


/* ============================================================
   8. GENERIC API REQUEST
   ============================================================ */

const API = {

    get:
        apiGet,

    post:
        apiPost,


    /*
     * Check whether the API has been configured.
     */

    isConfigured:
        isApiConfigured,


    /*
     * Get configuration.
     */

    config:
        function() {

            return {
                appName:
                    API_CONFIG.APP_NAME,

                version:
                    API_CONFIG.VERSION,

                language:
                    API_CONFIG.LANGUAGE,

                configured:
                    isApiConfigured()
            };
        }
};


/* ============================================================
   9. BACKEND HEALTH CHECK
   ============================================================
 *
 * This is our first real frontend → backend test.
 *
 * It does NOT modify anything in the database.
 *
 * It simply asks the backend whether the quiz system/API
 * is available.
 *
 * ============================================================
 */

async function checkBackendHealth() {

    try {

        /*
         * The backend action should match the health-check
         * action already available in our Apps Script.
         *
         * If your doGet router uses another action name,
         * we will adjust this one function later.
         */

        const result =
            await API.get(
                "health"
            );


        return {

            success:
                true,

            data:
                result,

            timestamp:
                new Date().toISOString()
        };


    } catch (error) {

        return {

            success:
                false,

            message:
                error.message,

            timestamp:
                new Date().toISOString()
        };
    }
}


/* ============================================================
   10. TEST API CONNECTION
   ============================================================ */

async function testFrontendApiConnection() {

    console.log(
        "========================================"
    );

    console.log(
        "STEP 10B — FRONTEND API CONNECTION TEST"
    );

    console.log(
        "========================================"
    );


    /*
     * Configuration check.
     */

    console.log(
        "API CONFIGURATION:",
        API.config()
    );


    if (!API.isConfigured()) {

        console.error(
            "❌ API URL has not been configured."
        );

        return {

            success:
                false,

            message:
                "Please configure API_CONFIG.BASE_URL first."
        };
    }


    /*
     * Health check.
     */

    const result =
        await checkBackendHealth();


    console.log(
        "BACKEND HEALTH:",
        result
    );


    if (result.success) {

        console.log(
            "========================================"
        );

        console.log(
            "✅ STEP 10B API CONNECTION SUCCESSFUL"
        );

        console.log(
            "========================================"
        );

    } else {

        console.error(
            "========================================"
        );

        console.error(
            "❌ STEP 10B API CONNECTION FAILED"
        );

        console.error(
            result.message
        );

        console.error(
            "========================================"
        );
    }


    return result;
}


/* ============================================================
   11. GLOBAL EXPORT
   ============================================================
 *
 * These are exposed so other frontend files can use them.
 *
 * Example:
 *
 * const result = await API.get("health");
 *
 * or:
 *
 * const result = await API.post(
 *     "login",
 *     {
 *         email: email,
 *         password: password
 *     }
 * );
 *
 * ============================================================
 */

window.API =
    API;

window.ApiError =
    ApiError;

window.checkBackendHealth =
    checkBackendHealth;

window.testFrontendApiConnection =
    testFrontendApiConnection;


/* ============================================================
   12. STARTUP LOG
   ============================================================ */

console.log(
    "AFC Isiu Youth Portal API Layer loaded.",
    {
        version:
            API_CONFIG.VERSION,

        configured:
            isApiConfigured()
    }
);
