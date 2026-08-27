/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL V2
 * API CONNECTION LAYER
 * PHASE 4A.1
 * ============================================================
 */

"use strict";


/* ============================================================
   1. API CONFIGURATION
   ============================================================ */

const API_CONFIG = {

    BASE_URL:
        "https://script.google.com/macros/s/AKfycbzZsyCnWVrcVryBkm2KjPYYy10dQQ5_nDh-vwMcPhCBo4XEYmXTbcYKTedihXDMe7Ij/exec",

    TIMEOUT:
        30000,

    LANGUAGE:
        "en",

    APP_NAME:
        "AFC Isiu Youth Portal",

    VERSION:
        "2.0.0"

};


/* ============================================================
   2. API ERROR
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
   3. CONFIGURATION CHECK
   ============================================================ */

function isApiConfigured() {

    return (
        typeof API_CONFIG.BASE_URL === "string" &&
        API_CONFIG.BASE_URL.trim() !== "" &&
        !API_CONFIG.BASE_URL.includes(
            "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL"
        )
    );

}


/* ============================================================
   4. BUILD URL
   ============================================================ */

function buildApiUrl_(action, params = {}) {

    if (!isApiConfigured()) {

        throw new ApiError(
            "The backend API URL has not been configured."
        );

    }


    const url =
        new URL(
            API_CONFIG.BASE_URL
        );


    url.searchParams.set(
        "action",
        action
    );


    Object.keys(params).forEach(
        function (key) {

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

        }
    );


    return url.toString();

}


/* ============================================================
   5. PARSE RESPONSE
   ============================================================ */

async function parseApiResponse_(response) {

    const text =
        await response.text();


    if (!text || !text.trim()) {

        throw new ApiError(
            "The backend returned an empty response.",
            {
                status:
                    response.status,

                statusText:
                    response.statusText
            }
        );

    }


    let data;


    try {

        data =
            JSON.parse(text);

    } catch (error) {

        console.error(
            "AFC API: invalid JSON response:",
            text
        );


        throw new ApiError(
            "The backend returned an invalid response.",
            {
                status:
                    response.status,

                rawResponse:
                    text.substring(0, 1000)
            }
        );

    }


    return data;

}


/* ============================================================
   6. NORMALISE BACKEND ERROR
   ============================================================ */

function getBackendErrorMessage_(data) {

    if (!data) {

        return "The backend returned no data.";

    }


    return (
        data.message ||
        data.error ||
        data.details?.message ||
        "The backend request was unsuccessful."
    );

}


/* ============================================================
   7. GET
   ============================================================ */

async function apiGet(
    action,
    params = {}
) {

    let timeoutId = null;


    try {

        const url =
            buildApiUrl_(
                action,
                params
            );


        console.log(
            "[API GET]",
            action,
            params
        );


        const controller =
            new AbortController();


        timeoutId =
            setTimeout(
                function () {

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


        const data =
            await parseApiResponse_(
                response
            );


        if (!response.ok) {

            throw new ApiError(
                getBackendErrorMessage_(data),
                {
                    action:
                        action,

                    status:
                        response.status,

                    statusText:
                        response.statusText,

                    response:
                        data
                }
            );

        }


        if (
            data &&
            data.success === false
        ) {

            throw new ApiError(
                getBackendErrorMessage_(data),
                {
                    action:
                        action,

                    response:
                        data
                }
            );

        }


        console.log(
            "[API GET SUCCESS]",
            action,
            data
        );


        return data;

    } catch (error) {

        console.error(
            "[API GET ERROR]",
            action,
            error
        );


        if (
            error &&
            error.name === "AbortError"
        ) {

            throw new ApiError(
                "The request took too long. Please try again.",
                {
                    action:
                        action
                }
            );

        }


        if (
            error instanceof ApiError
        ) {

            throw error;

        }


        throw new ApiError(
            error?.message ||
            "Unable to connect to the backend.",
            {
                action:
                    action,

                originalError:
                    error
            }
        );

    } finally {

        if (timeoutId) {

            clearTimeout(
                timeoutId
            );

        }

    }

}


/* ============================================================
   8. POST
   ============================================================ */

async function apiPost(
    action,
    payload = {}
) {

    let timeoutId = null;


    try {

        const url =
            buildApiUrl_(
                action
            );


        console.log(
            "[API POST]",
            action,
            payload
        );


        const controller =
            new AbortController();


        timeoutId =
            setTimeout(
                function () {

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


        const data =
            await parseApiResponse_(
                response
            );


        if (!response.ok) {

            throw new ApiError(
                getBackendErrorMessage_(data),
                {
                    action:
                        action,

                    status:
                        response.status,

                    statusText:
                        response.statusText,

                    response:
                        data
                }
            );

        }


        if (
            data &&
            data.success === false
        ) {

            throw new ApiError(
                getBackendErrorMessage_(data),
                {
                    action:
                        action,

                    response:
                        data
                }
            );

        }


        console.log(
            "[API POST SUCCESS]",
            action,
            data
        );


        return data;

    } catch (error) {

        console.error(
            "[API POST ERROR]",
            action,
            error
        );


        if (
            error &&
            error.name === "AbortError"
        ) {

            throw new ApiError(
                "The request took too long. Please try again.",
                {
                    action:
                        action
                }
            );

        }


        if (
            error instanceof ApiError
        ) {

            throw error;

        }


        throw new ApiError(
            error?.message ||
            "Unable to connect to the backend.",
            {
                action:
                    action,

                originalError:
                    error
            }
        );

    } finally {

        if (timeoutId) {

            clearTimeout(
                timeoutId
            );

        }

    }

}


/* ============================================================
   9. PUBLIC API
   ============================================================ */

const API = {

    get:
        apiGet,

    post:
        apiPost,

    isConfigured:
        isApiConfigured,

    config:
        function () {

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
   10. HEALTH CHECK
   ============================================================ */

async function checkBackendHealth() {

    try {

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

            details:
                error.details || {},

            timestamp:
                new Date().toISOString()

        };

    }

}


/* ============================================================
   11. TEST
   ============================================================ */

async function testFrontendApiConnection() {

    console.log(
        "========================================"
    );

    console.log(
        "STEP 10B / 4A.1 — API CONNECTION TEST"
    );

    console.log(
        "========================================"
    );


    console.log(
        "API CONFIG:",
        API.config()
    );


    if (!API.isConfigured()) {

        console.error(
            "API URL has not been configured."
        );

        return {

            success:
                false,

            message:
                "Configure API_CONFIG.BASE_URL first."

        };

    }


    const result =
        await checkBackendHealth();


    console.log(
        "BACKEND HEALTH:",
        result
    );


    return result;

}


/* ============================================================
   12. GLOBAL EXPORT
   ============================================================ */

window.API =
    API;

window.ApiError =
    ApiError;

window.checkBackendHealth =
    checkBackendHealth;

window.testFrontendApiConnection =
    testFrontendApiConnection;


console.log(
    "AFC Isiu Youth Portal API layer loaded.",
    API.config()
);
