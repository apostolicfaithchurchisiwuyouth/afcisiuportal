/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL V2
 * API CONNECTION LAYER
 * OPTIMIZED VERSION
 * ============================================================
 *
 * PURPOSE:
 * - Fast Google Apps Script communication
 * - Request timeout protection
 * - Browser-side caching
 * - Automatic retry for temporary failures
 * - Better error handling
 * ============================================================
 */

"use strict";


/* ============================================================
   1. API CONFIGURATION
   ============================================================ */

const API_CONFIG = {

    BASE_URL:
        "https://script.google.com/macros/s/AKfycbzZsyCnWVrcVryBkm2KjPYYy10dQQ5_nDh-vwMcPhCBo4XEYmXTbcYKTedihXDMe7Ij/exec",

    /*
     * 20 seconds gives Google Apps Script enough time
     * during a cold start without making the user wait
     * unnecessarily long.
     */
    TIMEOUT:
        20000,

    /*
     * Number of automatic retries for temporary
     * network/backend failures.
     */
    RETRIES:
        1,

    /*
     * Browser cache duration.
     */
    CACHE_TTL:
        5 * 60 * 1000,

    LANGUAGE:
        "en",

    APP_NAME:
        "AFC Isiu Youth Portal",

    VERSION:
        "2.0.0"

};


/* ============================================================
   2. INTERNAL BROWSER CACHE
   ============================================================ */

const API_MEMORY_CACHE =
    new Map();


/* ============================================================
   3. API ERROR
   ============================================================ */

class ApiError extends Error {

    constructor(
        message,
        details = {}
    ) {

        super(message);

        this.name =
            "ApiError";

        this.details =
            details;

    }

}


/* ============================================================
   4. CONFIGURATION CHECK
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
   5. BUILD URL
   ============================================================ */

function buildApiUrl_(
    action,
    params = {}
) {

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
        function(key) {

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
   6. CACHE KEY
   ============================================================ */

function buildCacheKey_(
    action,
    params = {}
) {

    const sortedKeys =
        Object.keys(params)
            .sort();


    const normalizedParams = {};


    sortedKeys.forEach(
        function(key) {

            normalizedParams[key] =
                params[key];

        }
    );


    return (
        action +
        "::" +
        JSON.stringify(
            normalizedParams
        )
    );

}


/* ============================================================
   7. SESSION STORAGE HELPERS
   ============================================================ */

function getSessionCache_(
    key
) {

    try {

        const raw =
            sessionStorage.getItem(
                "afc_api_" + key
            );


        if (!raw) {

            return null;

        }


        const parsed =
            JSON.parse(raw);


        if (
            !parsed ||
            !parsed.timestamp
        ) {

            sessionStorage.removeItem(
                "afc_api_" + key
            );

            return null;

        }


        const age =
            Date.now() -
            parsed.timestamp;


        if (
            age > API_CONFIG.CACHE_TTL
        ) {

            sessionStorage.removeItem(
                "afc_api_" + key
            );

            return null;

        }


        return parsed.data;

    } catch (error) {

        return null;

    }

}


/* ============================================================
   8. SAVE SESSION CACHE
   ============================================================ */

function setSessionCache_(
    key,
    data
) {

    try {

        sessionStorage.setItem(

            "afc_api_" + key,

            JSON.stringify({

                timestamp:
                    Date.now(),

                data:
                    data

            })

        );

    } catch (error) {

        /*
         * Storage failure should never break
         * the application.
         */

        console.warn(
            "AFC API: unable to save browser cache.",
            error
        );

    }

}


/* ============================================================
   9. CLEAR API CACHE
   ============================================================ */

function clearApiCache(
    action = null
) {

    API_MEMORY_CACHE.clear();


    try {

        const keys = [];

        for (
            let i = 0;
            i < sessionStorage.length;
            i++
        ) {

            const key =
                sessionStorage.key(i);


            if (
                !key ||
                !key.startsWith(
                    "afc_api_"
                )
            ) {

                continue;

            }


            if (
                !action ||
                key.includes(
                    "afc_api_" + action
                )
            ) {

                keys.push(key);

            }

        }


        keys.forEach(
            function(key) {

                sessionStorage.removeItem(
                    key
                );

            }
        );

    } catch (error) {

        console.warn(
            "AFC API: cache clear failed.",
            error
        );

    }

}


/* ============================================================
   10. PARSE RESPONSE
   ============================================================ */

async function parseApiResponse_(
    response
) {

    const text =
        await response.text();


    if (
        !text ||
        !text.trim()
    ) {

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
            JSON.parse(
                text
            );

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
                    text.substring(
                        0,
                        1000
                    )

            }

        );

    }


    return data;

}


/* ============================================================
   11. BACKEND ERROR MESSAGE
   ============================================================ */

function getBackendErrorMessage_(
    data
) {

    if (!data) {

        return (
            "The backend returned no data."
        );

    }


    return (

        data.message ||

        data.error ||

        data.details?.message ||

        "The backend request was unsuccessful."

    );

}


/* ============================================================
   12. SHOULD RETRY?
   ============================================================ */

function shouldRetry_(
    error
) {

    if (!error) {

        return false;

    }


    if (
        error.name ===
        "AbortError"
    ) {

        return true;

    }


    if (
        error instanceof ApiError &&
        error.details
    ) {

        const status =
            Number(
                error.details.status
            );


        /*
         * Retry server errors and gateway failures.
         */

        if (
            status >= 500 ||
            status === 408 ||
            status === 429
        ) {

            return true;

        }

    }


    return false;

}


/* ============================================================
   13. DELAY
   ============================================================ */

function delay_(
    milliseconds
) {

    return new Promise(
        function(resolve) {

            setTimeout(
                resolve,
                milliseconds
            );

        }
    );

}


/* ============================================================
   14. RAW GET REQUEST
   ============================================================ */

async function performGetRequest_(
    action,
    params
) {

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


    const timeoutId =
        setTimeout(
            function() {

                controller.abort();

            },
            API_CONFIG.TIMEOUT
        );


    try {

        const response =
            await fetch(
                url,
                {
                    method:
                        "GET",

                    headers: {
                        Accept:
                            "application/json"
                    },

                    signal:
                        controller.signal,

                    cache:
                        "no-store"
                }
            );


        const data =
            await parseApiResponse_(
                response
            );


        if (!response.ok) {

            throw new ApiError(

                getBackendErrorMessage_(
                    data
                ),

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

                getBackendErrorMessage_(
                    data
                ),

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
            action
        );


        return data;

    } finally {

        clearTimeout(
            timeoutId
        );

    }

}


/* ============================================================
   15. GET
   ============================================================ */

async function apiGet(
    action,
    params = {},
    options = {}
) {

    const useCache =
        options.cache !== false;


    const cacheKey =
        buildCacheKey_(
            action,
            params
        );


    /*
     * --------------------------------------------------------
     * MEMORY CACHE
     * --------------------------------------------------------
     */

    if (useCache) {

        const memoryItem =
            API_MEMORY_CACHE.get(
                cacheKey
            );


        if (memoryItem) {

            const age =
                Date.now() -
                memoryItem.timestamp;


            if (
                age <=
                API_CONFIG.CACHE_TTL
            ) {

                console.log(
                    "[API CACHE HIT - MEMORY]",
                    action
                );


                return memoryItem.data;

            }


            API_MEMORY_CACHE.delete(
                cacheKey
            );

        }

    }


    /*
     * --------------------------------------------------------
     * SESSION STORAGE CACHE
     * --------------------------------------------------------
     */

    if (useCache) {

        const sessionData =
            getSessionCache_(
                cacheKey
            );


        if (sessionData !== null) {

            console.log(
                "[API CACHE HIT - SESSION]",
                action
            );


            API_MEMORY_CACHE.set(

                cacheKey,

                {
                    timestamp:
                        Date.now(),

                    data:
                        sessionData

                }

            );


            return sessionData;

        }

    }


    /*
     * --------------------------------------------------------
     * NETWORK REQUEST
     * --------------------------------------------------------
     */

    let lastError =
        null;


    const maxAttempts =
        Math.max(
            1,
            API_CONFIG.RETRIES + 1
        );


    for (
        let attempt = 1;
        attempt <= maxAttempts;
        attempt++
    ) {

        try {

            const data =
                await performGetRequest_(
                    action,
                    params
                );


            if (useCache) {

                API_MEMORY_CACHE.set(

                    cacheKey,

                    {
                        timestamp:
                            Date.now(),

                        data:
                            data

                    }

                );


                setSessionCache_(
                    cacheKey,
                    data
                );

            }


            return data;

        } catch (error) {

            lastError =
                error;


            console.error(

                `[API GET ERROR] ${action} ` +
                `(attempt ${attempt}/${maxAttempts})`,

                error

            );


            if (
                attempt <
                maxAttempts &&
                shouldRetry_(error)
            ) {

                await delay_(
                    700
                );


                continue;

            }


            if (
                error &&
                error.name ===
                "AbortError"
            ) {

                throw new ApiError(

                    "The lesson server is taking longer than expected. Please try again.",

                    {
                        action:
                            action,

                        timeout:
                            API_CONFIG.TIMEOUT

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

        }

    }


    throw lastError;

}


/* ============================================================
   16. RAW POST REQUEST
   ============================================================ */

async function performPostRequest_(
    action,
    payload
) {

    const url =
        buildApiUrl_(
            action
        );


    console.log(
        "[API POST]",
        action
    );


    const controller =
        new AbortController();


    const timeoutId =
        setTimeout(
            function() {

                controller.abort();

            },
            API_CONFIG.TIMEOUT
        );


    try {

        const response =
            await fetch(
                url,
                {
                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8",

                        Accept:
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

                getBackendErrorMessage_(
                    data
                ),

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

                getBackendErrorMessage_(
                    data
                ),

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
            action
        );


        return data;

    } finally {

        clearTimeout(
            timeoutId
        );

    }

}


/* ============================================================
   17. POST
   ============================================================ */

async function apiPost(
    action,
    payload = {}
) {

    let lastError =
        null;


    const maxAttempts =
        Math.max(
            1,
            API_CONFIG.RETRIES + 1
        );


    for (
        let attempt = 1;
        attempt <= maxAttempts;
        attempt++
    ) {

        try {

            return await performPostRequest_(
                action,
                payload
            );

        } catch (error) {

            lastError =
                error;


            console.error(

                `[API POST ERROR] ${action} ` +
                `(attempt ${attempt}/${maxAttempts})`,

                error

            );


            if (
                attempt <
                maxAttempts &&
                shouldRetry_(error)
            ) {

                await delay_(
                    700
                );


                continue;

            }


            if (
                error &&
                error.name ===
                "AbortError"
            ) {

                throw new ApiError(

                    "The request took longer than expected. Please try again.",

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

        }

    }


    throw lastError;

}


/* ============================================================
   18. PUBLIC API
   ============================================================ */

const API = {

    get:
        apiGet,

    post:
        apiPost,

    clearCache:
        clearApiCache,

    isConfigured:
        isApiConfigured,

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
                    isApiConfigured(),

                timeout:
                    API_CONFIG.TIMEOUT,

                cacheTtl:
                    API_CONFIG.CACHE_TTL

            };

        }

};


/* ============================================================
   19. HEALTH CHECK
   ============================================================ */

async function checkBackendHealth() {

    try {

        const result =
            await API.get(
                "health",
                {},
                {
                    cache:
                        false
                }
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
   20. TEST
   ============================================================ */

async function testFrontendApiConnection() {

    console.log(
        "========================================"
    );

    console.log(
        "AFC PORTAL — API CONNECTION TEST"
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
   21. GLOBAL EXPORT
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
