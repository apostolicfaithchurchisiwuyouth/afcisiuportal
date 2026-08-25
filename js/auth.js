/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL V2
 * 10D — AUTHENTICATION FRONTEND LOGIC
 * ============================================================
 *
 * Works with:
 *
 * 02_Router.gs
 * 03_Auth.gs
 * 10B API CONNECTION LAYER
 *
 * Backend action names:
 *
 * register
 * login
 * getinstitutions
 *
 * ============================================================
 */

"use strict";


/* ============================================================
   1. DOM ELEMENTS
   ============================================================ */

const loginView =
    document.getElementById("loginView");

const registerView =
    document.getElementById("registerView");

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");

const showRegisterButton =
    document.getElementById("showRegisterButton");

const showLoginButton =
    document.getElementById("showLoginButton");

const loginButton =
    document.getElementById("loginButton");

const registerButton =
    document.getElementById("registerButton");

const loginMessage =
    document.getElementById("loginMessage");

const registerMessage =
    document.getElementById("registerMessage");

const institutionSelect =
    document.getElementById("institution");


/* ============================================================
   2. SWITCH LOGIN / REGISTER
   ============================================================ */

function showLogin() {

    if (loginView) {
        loginView.classList.add("active");
    }

    if (registerView) {
        registerView.classList.remove("active");
    }

    clearMessage(loginMessage);
    clearMessage(registerMessage);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function showRegister() {

    if (registerView) {
        registerView.classList.add("active");
    }

    if (loginView) {
        loginView.classList.remove("active");
    }

    clearMessage(loginMessage);
    clearMessage(registerMessage);

    loadInstitutions();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


if (showRegisterButton) {

    showRegisterButton.addEventListener(
        "click",
        showRegister
    );

}


if (showLoginButton) {

    showLoginButton.addEventListener(
        "click",
        showLogin
    );

}


/* ============================================================
   3. MESSAGE HELPERS
   ============================================================ */

function showMessage(
    element,
    message,
    type = "error"
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
            type
        );

    }

}


function clearMessage(element) {

    if (!element) {
        return;
    }

    element.textContent =
        "";

    element.className =
        "form-message";

}


/* ============================================================
   4. BUTTON LOADING
   ============================================================ */

function setButtonLoading(
    button,
    loading,
    loadingText
) {

    if (!button) {
        return;
    }


    if (loading) {

        button.classList.add(
            "loading"
        );

        button.disabled =
            true;


        button.dataset.originalText =
            button.querySelector(
                ".button-text"
            )?.textContent ||
            "";


        if (loadingText) {

            const text =
                button.querySelector(
                    ".button-text"
                );

            if (text) {

                text.textContent =
                    loadingText;

            }

        }


    } else {

        button.classList.remove(
            "loading"
        );

        button.disabled =
            false;


        const text =
            button.querySelector(
                ".button-text"
            );


        if (text) {

            text.textContent =
                button.dataset.originalText ||
                "";

        }

    }

}


/* ============================================================
   5. PASSWORD VISIBILITY
   ============================================================ */

function setupPasswordToggles() {

    const buttons =
        document.querySelectorAll(
            ".password-toggle"
        );


    buttons.forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const targetId =
                    button.dataset.passwordTarget;


                const input =
                    document.getElementById(
                        targetId
                    );


                if (!input) {
                    return;
                }


                const eyeOpen =
                    button.querySelector(
                        ".eye-open"
                    );


                const eyeClosed =
                    button.querySelector(
                        ".eye-closed"
                    );


                if (
                    input.type ===
                    "password"
                ) {

                    input.type =
                        "text";


                    button.setAttribute(
                        "aria-label",
                        "Hide password"
                    );


                    button.setAttribute(
                        "title",
                        "Hide password"
                    );


                    eyeOpen?.classList.add(
                        "hidden"
                    );


                    eyeClosed?.classList.remove(
                        "hidden"
                    );


                } else {

                    input.type =
                        "password";


                    button.setAttribute(
                        "aria-label",
                        "Show password"
                    );


                    button.setAttribute(
                        "title",
                        "Show password"
                    );


                    eyeOpen?.classList.remove(
                        "hidden"
                    );


                    eyeClosed?.classList.add(
                        "hidden"
                    );

                }

            }
        );

    });

}


setupPasswordToggles();


/* ============================================================
   6. LOAD INSTITUTIONS
   ============================================================ */

let institutionsLoaded =
    false;


async function loadInstitutions() {

    if (
        !institutionSelect ||
        institutionsLoaded
    ) {

        return;

    }


    institutionSelect.innerHTML =
        '<option value="">Loading institutions...</option>';


    institutionSelect.disabled =
        true;


    try {

        const result =
            await API.get(
                "getinstitutions"
            );


        let institutions =
            [];


        if (
            Array.isArray(result)
        ) {

            institutions =
                result;

        } else if (
            Array.isArray(
                result.institutions
            )
        ) {

            institutions =
                result.institutions;

        } else if (
            result.data &&
            Array.isArray(
                result.data.institutions
            )
        ) {

            institutions =
                result.data.institutions;

        } else if (
            result.data &&
            Array.isArray(
                result.data
            )
        ) {

            institutions =
                result.data;

        }


        institutionSelect.innerHTML =
            "";


        const defaultOption =
            document.createElement(
                "option"
            );


        defaultOption.value =
            "";


        defaultOption.textContent =
            institutions.length
                ? "Select your institution"
                : "No institutions available";


        institutionSelect.appendChild(
            defaultOption
        );


        institutions.forEach(
            function(institution) {

                const id =
                    institution.institution_id ||
                    institution.id ||
                    "";


                const name =
                    institution.institution_name ||
                    institution.name ||
                    institution.title ||
                    "";


                if (
                    !id ||
                    !name
                ) {

                    return;

                }


                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    id;


                option.textContent =
                    name;


                option.dataset.institutionName =
                    name;


                institutionSelect.appendChild(
                    option
                );

            }
        );


        institutionsLoaded =
            institutions.length > 0;


    } catch (error) {

        console.error(
            "Unable to load institutions:",
            error
        );


        institutionSelect.innerHTML =
            '<option value="">Unable to load institutions</option>';


        showMessage(
            registerMessage,
            "We could not load the institution list. Please refresh the page and try again.",
            "error"
        );


    } finally {

        institutionSelect.disabled =
            false;

    }

}


/* ============================================================
   7. VALIDATE EMAIL
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
   8. LOGIN
   ============================================================ */

async function handleLogin(
    event
) {

    event.preventDefault();


    clearMessage(
        loginMessage
    );


    const emailInput =
        document.getElementById(
            "loginEmail"
        );


    const passwordInput =
        document.getElementById(
            "loginPassword"
        );


    const email =
        emailInput
            ? emailInput.value.trim()
            : "";


    const password =
        passwordInput
            ? passwordInput.value
            : "";


    if (!email) {

        showMessage(
            loginMessage,
            "Please enter your email address."
        );

        return;

    }


    if (!isValidEmail(email)) {

        showMessage(
            loginMessage,
            "Please enter a valid email address."
        );

        return;

    }


    if (!password) {

        showMessage(
            loginMessage,
            "Please enter your password."
        );

        return;

    }


    /* --------------------------------------------------------
       START LOGIN LOADING
       -------------------------------------------------------- */

    setButtonLoading(
        loginButton,
        true,
        "Signing in..."
    );


    try {

        const result =
            await API.post(
                "login",
                {

                    email:
                        email,

                    password:
                        password,

                    device_info:
                        navigator.userAgent

                }
            );


        console.log(
            "LOGIN RESULT:",
            result
        );


        /* ----------------------------------------------------
           STORE AUTHENTICATION SESSION
           ---------------------------------------------------- */

        if (
            result &&
            result.data &&
            result.data.session
        ) {

            storeAuthSession(
                result.data
            );

        } else if (
            result &&
            result.session
        ) {

            storeAuthSession(
                result
            );

        }


        /* ----------------------------------------------------
           SUCCESS MESSAGE
           ---------------------------------------------------- */

        showMessage(
            loginMessage,
            result.message ||
            "Login successful.",
            "success"
        );


        /* ----------------------------------------------------
           REDIRECT TO DASHBOARD
           ----------------------------------------------------
           
           THIS IS THE IMPORTANT CHANGE.
           
           Successful authentication now goes to:
           
           dashboard.html
           
           instead of:
           
           index.html
           
           ---------------------------------------------------- */

        setTimeout(
            function() {

                window.location.href =
                    "dashboard.html";

            },
            700
        );


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        showMessage(
            loginMessage,
            error.message ||
            "Unable to log in. Please try again."
        );


        setButtonLoading(
            loginButton,
            false
        );

    }

}


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        handleLogin
    );

}


/* ============================================================
   9. REGISTER
   ============================================================ */

async function handleRegistration(
    event
) {

    event.preventDefault();


    clearMessage(
        registerMessage
    );


    const firstName =
        document.getElementById(
            "firstName"
        ).value.trim();


    const lastName =
        document.getElementById(
            "lastName"
        ).value.trim();


    const email =
        document.getElementById(
            "registerEmail"
        ).value.trim();


    const phone =
        document.getElementById(
            "phone"
        ).value.trim();


    const dateOfBirth =
        document.getElementById(
            "dateOfBirth"
        ).value;


    const institutionId =
        document.getElementById(
            "institution"
        ).value;


    const course =
        document.getElementById(
            "course"
        ).value.trim();


    const level =
        document.getElementById(
            "level"
        ).value;


    const gender =
        document.getElementById(
            "gender"
        ).value;


    const password =
        document.getElementById(
            "registerPassword"
        ).value;


    const confirmPassword =
        document.getElementById(
            "confirmPassword"
        ).value;


    /* ========================================================
       VALIDATION
       ======================================================== */

    if (!firstName) {

        showMessage(
            registerMessage,
            "Please enter your first name."
        );

        return;

    }


    if (!lastName) {

        showMessage(
            registerMessage,
            "Please enter your last name."
        );

        return;

    }


    if (!email) {

        showMessage(
            registerMessage,
            "Please enter your email address."
        );

        return;

    }


    if (!isValidEmail(email)) {

        showMessage(
            registerMessage,
            "Please enter a valid email address."
        );

        return;

    }


    if (!dateOfBirth) {

        showMessage(
            registerMessage,
            "Please enter your date of birth."
        );

        return;

    }


    if (!institutionId) {

        showMessage(
            registerMessage,
            "Please select your school or institution."
        );

        return;

    }


    if (!level) {

        showMessage(
            registerMessage,
            "Please select your level."
        );

        return;

    }


    if (!password) {

        showMessage(
            registerMessage,
            "Please create a password."
        );

        return;

    }


    if (password.length < 8) {

        showMessage(
            registerMessage,
            "Your password must contain at least 8 characters."
        );

        return;

    }


    if (
        password !==
        confirmPassword
    ) {

        showMessage(
            registerMessage,
            "Your passwords do not match."
        );

        return;

    }


    /* --------------------------------------------------------
       GET SELECTED INSTITUTION
       -------------------------------------------------------- */

    const selectedInstitution =
        institutionSelect.options[
            institutionSelect.selectedIndex
        ];


    const institutionName =
        selectedInstitution?.dataset
            ?.institutionName ||
        selectedInstitution?.textContent ||
        "";


    /* --------------------------------------------------------
       START REGISTRATION LOADING
       -------------------------------------------------------- */

    setButtonLoading(
        registerButton,
        true,
        "Creating account..."
    );


    try {

        const result =
            await API.post(
                "register",
                {

                    first_name:
                        firstName,

                    last_name:
                        lastName,

                    email:
                        email,

                    phone:
                        phone,

                    password:
                        password,

                    confirm_password:
                        confirmPassword,

                    date_of_birth:
                        dateOfBirth,

                    institution_id:
                        institutionId,

                    institution_name:
                        institutionName,

                    course:
                        course,

                    level:
                        level,

                    gender:
                        gender,

                    language:
                        "en",

                    theme:
                        "system"

                }
            );


        console.log(
            "REGISTRATION RESULT:",
            result
        );


        showMessage(
            registerMessage,
            result.message ||
            "Your account has been created successfully.",
            "success"
        );


        /* ----------------------------------------------------
           CLEAR PASSWORD FIELDS
           ---------------------------------------------------- */

        const registerPasswordInput =
            document.getElementById(
                "registerPassword"
            );


        const confirmPasswordInput =
            document.getElementById(
                "confirmPassword"
            );


        if (registerPasswordInput) {

            registerPasswordInput.value =
                "";

        }


        if (confirmPasswordInput) {

            confirmPasswordInput.value =
                "";

        }


        /* ----------------------------------------------------
           RETURN TO LOGIN
           ---------------------------------------------------- */

        setTimeout(
            function() {

                showLogin();


                const loginEmail =
                    document.getElementById(
                        "loginEmail"
                    );


                if (loginEmail) {

                    loginEmail.value =
                        email;

                    loginEmail.focus();

                }


                setButtonLoading(
                    registerButton,
                    false
                );


            },
            1200
        );


    } catch (error) {

        console.error(
            "REGISTRATION ERROR:",
            error
        );


        showMessage(
            registerMessage,
            error.message ||
            "Unable to create your account. Please try again."
        );


        setButtonLoading(
            registerButton,
            false
        );

    }

}


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        handleRegistration
    );

}


/* ============================================================
   10. SESSION STORAGE
   ============================================================ */

function storeAuthSession(
    data
) {

    try {

        if (!data) {
            return;
        }


        const user =
            data.user ||
            null;


        const session =
            data.session ||
            null;


        if (user) {

            localStorage.setItem(
                "afc_user",
                JSON.stringify(
                    user
                )
            );

        }


        if (session) {

            if (session.token) {

                localStorage.setItem(
                    "afc_session_token",
                    session.token
                );

            }


            if (session.expires_at) {

                localStorage.setItem(
                    "afc_session_expires_at",
                    session.expires_at
                );

            }

        }

    } catch (error) {

        console.warn(
            "Unable to store authentication session:",
            error
        );

    }

}


/* ============================================================
   11. INITIAL PAGE STATE
   ============================================================ */

function initializeAuthPage() {

    /*
     * Do not activate loading states
     * during page initialization.
     */

    showLogin();


    /*
     * Load institutions so they are
     * available when registration opens.
     */

    loadInstitutions();

}


document.addEventListener(
    "DOMContentLoaded",
    initializeAuthPage
);


/* ============================================================
   12. DEBUG LOG
   ============================================================ */

console.log(
    "AFC Isiu Youth Portal — 10D Authentication loaded."
);
