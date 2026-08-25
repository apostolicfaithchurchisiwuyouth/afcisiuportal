/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL V2
 * STEP 10D — AUTHENTICATION FRONTEND
 * FILE: js/auth.js
 * ============================================================
 *
 * Handles:
 *
 * 1. Login
 * 2. Registration
 * 3. Institution loading
 * 4. Password visibility
 * 5. Form validation
 * 6. Session storage
 * 7. Authentication view switching
 *
 * IMPORTANT:
 *
 * This file uses the existing API layer:
 *
 * js/api.js
 *
 * Do not put Google Apps Script code here.
 *
 * ============================================================
 */

"use strict";


/* ============================================================
   1. AUTH CONFIGURATION
   ============================================================ */

const AUTH_FRONTEND_CONFIG = {

    /*
     * Where the user goes after successful login.
     *
     * We can change this later when the dashboard is ready.
     */

    AFTER_LOGIN:
        "index.html",

    /*
     * Where the user goes after successful registration.
     */

    AFTER_REGISTER:
        "index.html",

    /*
     * Minimum password length.
     *
     * Must match 03_Auth.gs.
     */

    PASSWORD_MIN_LENGTH:
        8

};


/* ============================================================
   2. DOM HELPERS
   ============================================================ */

function $(selector) {

    return document.querySelector(
        selector
    );

}


function $$(selector) {

    return Array.from(
        document.querySelectorAll(
            selector
        )
    );

}


/* ============================================================
   3. AUTH VIEW ELEMENTS
   ============================================================ */

const loginView =
    $("#loginView");

const registerView =
    $("#registerView");

const showRegisterButton =
    $("#showRegisterButton");

const showLoginButton =
    $("#showLoginButton");


/* ============================================================
   4. SWITCH TO REGISTER
   ============================================================ */

function showRegisterView() {

    if (!loginView || !registerView) {
        return;
    }


    loginView.classList.remove(
        "active"
    );

    registerView.classList.add(
        "active"
    );


    clearMessage(
        $("#loginMessage")
    );

    clearMessage(
        $("#registerMessage")
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ============================================================
   5. SWITCH TO LOGIN
   ============================================================ */

function showLoginView() {

    if (!loginView || !registerView) {
        return;
    }


    registerView.classList.remove(
        "active"
    );

    loginView.classList.add(
        "active"
    );


    clearMessage(
        $("#registerMessage")
    );

    clearMessage(
        $("#loginMessage")
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ============================================================
   6. AUTH VIEW EVENTS
   ============================================================ */

if (showRegisterButton) {

    showRegisterButton.addEventListener(
        "click",
        showRegisterView
    );

}


if (showLoginButton) {

    showLoginButton.addEventListener(
        "click",
        showLoginView
    );

}


/* ============================================================
   7. MESSAGE HELPERS
   ============================================================ */

function showMessage(
    element,
    message,
    type
) {

    if (!element) {
        return;
    }


    element.textContent =
        message || "";


    element.className =
        "form-message";


    if (message) {

        element.classList.add(
            type || "error"
        );

    }

}


function clearMessage(
    element
) {

    if (!element) {
        return;
    }


    element.textContent = "";

    element.className =
        "form-message";

}


/* ============================================================
   8. BUTTON LOADING
   ============================================================ */

function setButtonLoading(
    button,
    loading
) {

    if (!button) {
        return;
    }


    const text =
        button.querySelector(
            ".button-text"
        );

    const loadingElement =
        button.querySelector(
            ".button-loading"
        );


    button.disabled =
        loading;


    if (text) {

        text.hidden =
            loading;

    }


    if (loadingElement) {

        loadingElement.hidden =
            !loading;

    }

}


/* ============================================================
   9. PASSWORD TOGGLE
   ============================================================ */

function setupPasswordToggles() {

    const toggles =
        $$(".password-toggle");


    toggles.forEach(function(toggle) {

        toggle.addEventListener(
            "click",
            function() {

                const targetId =
                    toggle.dataset.target;


                const input =
                    document.getElementById(
                        targetId
                    );


                if (!input) {
                    return;
                }


                const isPassword =
                    input.type === "password";


                input.type =
                    isPassword
                        ? "text"
                        : "password";


                toggle.setAttribute(
                    "aria-label",
                    isPassword
                        ? "Hide password"
                        : "Show password"
                );


                const icon =
                    toggle.querySelector(
                        "[data-lucide]"
                    );


                if (icon) {

                    icon.setAttribute(
                        "data-lucide",
                        isPassword
                            ? "eye-off"
                            : "eye"
                    );

                }


                if (window.lucide) {

                    lucide.createIcons();

                }

            }
        );

    });

}


/* ============================================================
   10. LOAD INSTITUTIONS
   ============================================================ */

async function loadInstitutions() {

    const select =
        $("#institutionId");


    if (!select) {
        return;
    }


    select.innerHTML = `

        <option value="">
            Loading institutions...
        </option>

    `;


    try {

        /*
         * Existing backend route:
         *
         * getinstitutions
         */

        const response =
            await API.get(
                "getinstitutions"
            );


        /*
         * The backend may return:
         *
         * response.institutions
         *
         * or
         *
         * response.data.institutions
         *
         * or
         *
         * response.data
         *
         * We support all three.
         */

        let institutions = [];


        if (
            response &&
            Array.isArray(
                response.institutions
            )
        ) {

            institutions =
                response.institutions;

        } else if (
            response &&
            response.data &&
            Array.isArray(
                response.data.institutions
            )
        ) {

            institutions =
                response.data.institutions;

        } else if (
            response &&
            Array.isArray(
                response.data
            )
        ) {

            institutions =
                response.data;

        }


        select.innerHTML = `

            <option value="">
                Select your institution
            </option>

        `;


        if (!institutions.length) {

            select.innerHTML = `

                <option value="">
                    No institutions available
                </option>

            `;

            return;

        }


        institutions.forEach(
            function(institution) {

                const institutionId =
                    institution.institution_id ||
                    institution.id ||
                    "";


                const institutionName =
                    institution.institution_name ||
                    institution.name ||
                    "";


                if (
                    !institutionId ||
                    !institutionName
                ) {

                    return;

                }


                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    institutionId;


                option.textContent =
                    institutionName;


                select.appendChild(
                    option
                );

            }
        );


    } catch (error) {

        console.error(
            "Institution loading error:",
            error
        );


        select.innerHTML = `

            <option value="">
                Unable to load institutions
            </option>

        `;

    }

}


/* ============================================================
   11. VALIDATE EMAIL
   ============================================================ */

function isValidEmail(
    email
) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(
            email
        );

}


/* ============================================================
   12. VALIDATE REGISTRATION FORM
   ============================================================ */

function validateRegistrationData(
    data
) {

    if (!data.first_name) {

        return "Please enter your first name.";

    }


    if (!data.last_name) {

        return "Please enter your last name.";

    }


    if (
        !data.email ||
        !isValidEmail(data.email)
    ) {

        return "Please enter a valid email address.";

    }


    if (!data.password) {

        return "Please create a password.";

    }


    if (
        data.password.length <
        AUTH_FRONTEND_CONFIG.PASSWORD_MIN_LENGTH
    ) {

        return (
            "Your password must contain at least " +
            AUTH_FRONTEND_CONFIG.PASSWORD_MIN_LENGTH +
            " characters."
        );

    }


    if (
        data.password !==
        data.confirm_password
    ) {

        return "Your passwords do not match.";

    }


    if (!data.date_of_birth) {

        return "Please enter your date of birth.";

    }


    if (!data.institution_id) {

        return "Please select your school or institution.";

    }


    if (!data.level) {

        return "Please select your level.";

    }


    return "";

}


/* ============================================================
   13. GET REGISTRATION DATA
   ============================================================ */

function getRegistrationData() {

    /*
     * IMPORTANT:
     *
     * These names intentionally match
     * 03_Auth.gs exactly.
     */

    return {

        first_name:
            $("#firstName")?.value.trim() || "",

        last_name:
            $("#lastName")?.value.trim() || "",

        email:
            $("#registerEmail")?.value.trim().toLowerCase() || "",

        phone:
            $("#phone")?.value.trim() || "",

        password:
            $("#registerPassword")?.value || "",

        confirm_password:
            $("#confirmPassword")?.value || "",

        date_of_birth:
            $("#dateOfBirth")?.value || "",

        institution_id:
            $("#institutionId")?.value || "",

        course:
            $("#course")?.value.trim() || "",

        level:
            $("#level")?.value || "",

        gender:
            $("#gender")?.value || "",

        language:
            $("#language")?.value || "en",

        theme:
            $("#theme")?.value || "system"

    };

}


/* ============================================================
   14. REGISTER USER
   ============================================================ */

async function handleRegistration(
    event
) {

    event.preventDefault();


    const form =
        event.currentTarget;


    const button =
        $("#registerSubmit");


    const message =
        $("#registerMessage");


    clearMessage(
        message
    );


    const data =
        getRegistrationData();


    /*
     * FRONTEND VALIDATION
     */

    const validationMessage =
        validateRegistrationData(
            data
        );


    if (validationMessage) {

        showMessage(
            message,
            validationMessage,
            "error"
        );

        return;

    }


    setButtonLoading(
        button,
        true
    );


    try {

        /*
         * IMPORTANT:
         *
         * This is the action that caused
         * the previous "Unknown API action"
         * error.
         *
         * 02_Router.gs now accepts:
         *
         * registerUser
         *
         * and sends it to:
         *
         * registerUser(request)
         */

        const result =
            await API.post(
                "registerUser",
                data
            );


        console.log(
            "REGISTRATION RESULT:",
            result
        );


        /*
         * Save returned user information
         * if available.
         */

        const user =
            result?.data?.user ||
            result?.data ||
            result?.user ||
            null;


        if (user) {

            localStorage.setItem(
                "afc_user",
                JSON.stringify(user)
            );

        }


        /*
         * Registration succeeded.
         */

        showMessage(
            message,
            result?.message ||
            "Your account has been created successfully.",
            "success"
        );


        /*
         * Short delay so the user sees
         * the success message.
         */

        setTimeout(
            function() {

                window.location.href =
                    AUTH_FRONTEND_CONFIG.AFTER_REGISTER;

            },
            900
        );


    } catch (error) {

        console.error(
            "REGISTRATION ERROR:",
            error
        );


        showMessage(
            message,
            error.message ||
            "Unable to create your account. Please try again.",
            "error"
        );


        setButtonLoading(
            button,
            false
        );

        return;

    }


}


/* ============================================================
   15. LOGIN
   ============================================================ */

async function handleLogin(
    event
) {

    event.preventDefault();


    const button =
        $("#loginSubmit");


    const message =
        $("#loginMessage");


    clearMessage(
        message
    );


    const email =
        $("#loginEmail")?.value
            .trim()
            .toLowerCase() || "";


    const password =
        $("#loginPassword")?.value || "";


    if (
        !email ||
        !isValidEmail(email)
    ) {

        showMessage(
            message,
            "Please enter a valid email address.",
            "error"
        );

        return;

    }


    if (!password) {

        showMessage(
            message,
            "Please enter your password.",
            "error"
        );

        return;

    }


    setButtonLoading(
        button,
        true
    );


    try {

        const result =
            await API.post(
                "login",
                {

                    email:
                        email,

                    password:
                        password

                }
            );


        console.log(
            "LOGIN RESULT:",
            result
        );


        /*
         * Extract login data.
         */

        const resultData =
            result?.data ||
            result;


        const user =
            resultData?.user ||
            null;


        const session =
            resultData?.session ||
            null;


        /*
         * Store user.
         */

        if (user) {

            localStorage.setItem(
                "afc_user",
                JSON.stringify(user)
            );

        }


        /*
         * Store authentication token.
         */

        if (
            session &&
            session.token
        ) {

            localStorage.setItem(
                "afc_auth_token",
                session.token
            );

        }


        /*
         * Store complete session.
         */

        if (session) {

            localStorage.setItem(
                "afc_session",
                JSON.stringify(session)
            );

        }


        showMessage(
            message,
            result?.message ||
            "Login successful.",
            "success"
        );


        setTimeout(
            function() {

                window.location.href =
                    AUTH_FRONTEND_CONFIG.AFTER_LOGIN;

            },
            700
        );


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        showMessage(
            message,
            error.message ||
            "Unable to log in. Please check your details.",
            "error"
        );


        setButtonLoading(
            button,
            false
        );

    }

}


/* ============================================================
   16. FORGOT PASSWORD
   ============================================================ */

const forgotPasswordButton =
    $("#forgotPasswordButton");


if (forgotPasswordButton) {

    forgotPasswordButton.addEventListener(
        "click",
        function() {

            alert(
                "Password recovery will be added in a later authentication phase."
            );

        }
    );

}


/* ============================================================
   17. FORM EVENTS
   ============================================================ */

const loginForm =
    $("#loginForm");


const registerForm =
    $("#registerForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        handleLogin
    );

}


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        handleRegistration
    );

}


/* ============================================================
   18. STARTUP
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        /*
         * Password eye icons.
         */

        setupPasswordToggles();


        /*
         * Load institutions.
         */

        await loadInstitutions();


        /*
         * Refresh Lucide icons after
         * dynamically creating/changing icons.
         */

        if (window.lucide) {

            lucide.createIcons();

        }


        console.log(
            "========================================"
        );

        console.log(
            "STEP 10D AUTHENTICATION FRONTEND READY"
        );

        console.log(
            "========================================"
        );

    }
);
