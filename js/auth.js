/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   FILE: auth.js
   PHASE B — AUTHENTICATION
   ============================================================ */

(function () {

    "use strict";


    /* ========================================================
       INTERNAL STATE
       ======================================================== */

    let loginInProgress = false;

    let registrationInProgress = false;

    let institutionsCache = [];


    /* ========================================================
       DOM HELPER
       ======================================================== */

    function $(id) {

        return document.getElementById(id);

    }


    /* ========================================================
       LUCIDE ICON REFRESH
       ======================================================== */

    function refreshIcons() {

        if (
            window.lucide &&
            typeof window.lucide.createIcons === "function"
        ) {

            window.lucide.createIcons();

        }

    }


    /* ========================================================
       HTML ESCAPE
       ======================================================== */

    function escapeHtml(value) {

        return String(
            value === undefined ||
            value === null
                ? ""
                : value
        )
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* ========================================================
       EMAIL VALIDATION
       ======================================================== */

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            String(email || "").trim()
        );

    }


    /* ========================================================
       API RESPONSE HELPERS
       ======================================================== */

    function getResponseData(response) {

        if (!response) {

            return null;

        }


        if (
            response.data !== undefined
        ) {

            return response.data;

        }


        return response;

    }


    function getResponseMessage(response) {

        if (!response) {

            return "";

        }


        if (response.message) {

            return response.message;

        }


        if (
            response.data &&
            response.data.message
        ) {

            return response.data.message;

        }


        return "";

    }


    /* ========================================================
       FORM MESSAGE
       ======================================================== */

    function setMessage(
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

            element.classList.add(type);

        }

    }


    /* ========================================================
       BUTTON LOADING
       ======================================================== */

    function setButtonLoading(
        button,
        loading,
        loadingText
    ) {

        if (!button) {

            return;

        }


        if (loading) {

            if (!button.dataset.originalHtml) {

                button.dataset.originalHtml =
                    button.innerHTML;

            }


            button.disabled = true;

            button.setAttribute(
                "aria-busy",
                "true"
            );


            button.innerHTML = `

                <span
                    class="button-spinner"
                    aria-hidden="true"
                ></span>

                <span>
                    ${
                        escapeHtml(
                            loadingText ||
                            "Please wait..."
                        )
                    }
                </span>

            `;

        } else {

            button.disabled = false;

            button.removeAttribute(
                "aria-busy"
            );


            if (
                button.dataset.originalHtml
            ) {

                button.innerHTML =
                    button.dataset.originalHtml;

            }

        }


        refreshIcons();

    }


    /* ========================================================
       PASSWORD TOGGLE
       ======================================================== */

    function bindPasswordToggle(
        button,
        input
    ) {

        if (
            !button ||
            !input
        ) {

            return;

        }


        button.addEventListener(
            "click",
            function () {

                const showing =
                    input.type === "text";


                input.type =
                    showing
                        ? "password"
                        : "text";


                button.setAttribute(
                    "aria-label",
                    showing
                        ? "Show password"
                        : "Hide password"
                );


                button.innerHTML =
                    showing
                        ? '<i data-lucide="eye"></i>'
                        : '<i data-lucide="eye-off"></i>';


                refreshIcons();

            }
        );

    }


    /* ========================================================
       AUTH MODAL
       ======================================================== */

    function openAuthModal(
        mode = "login"
    ) {

        if (
            !window.AFC ||
            typeof window.AFC.modal !== "function"
        ) {

            console.error(
                "AFC modal system is unavailable."
            );

            return;

        }


        /*
         * Do not allow an authenticated user
         * to open the login screen.
         */

        if (
            window.AFC.state &&
            window.AFC.state.authenticated
        ) {

            return;

        }


        if (mode === "register") {

            window.AFC.modal({

                title:
                    "Create your account",

                content:
                    buildRegistrationForm()

            });


            bindRegistrationForm();

            loadInstitutions();

        } else {

            window.AFC.modal({

                title:
                    "Welcome back",

                content:
                    buildLoginForm()

            });


            bindLoginForm();

        }


        refreshIcons();

    }


    /* ========================================================
       LOGIN FORM
       ======================================================== */

    function buildLoginForm() {

        return `

            <div class="auth-form-wrapper">

                <div class="auth-intro">

                    <div class="auth-icon">

                        <i data-lucide="log-in"></i>

                    </div>

                    <div>

                        <h3>
                            Welcome back
                        </h3>

                        <p>
                            Sign in to continue to
                            your youth portal.
                        </p>

                    </div>

                </div>


                <form
                    id="portal-login-form"
                    class="auth-form"
                    novalidate
                >


                    <div class="auth-field">

                        <label
                            for="portal-login-email"
                        >
                            Email address
                        </label>


                        <div class="auth-input-wrap">

                            <i
                                data-lucide="mail"
                                class="auth-input-icon"
                            ></i>


                            <input
                                id="portal-login-email"
                                name="email"
                                type="email"
                                autocomplete="email"
                                placeholder="you@example.com"
                                required
                            >

                        </div>

                    </div>


                    <div class="auth-field">

                        <label
                            for="portal-login-password"
                        >
                            Password
                        </label>


                        <div class="auth-input-wrap">

                            <i
                                data-lucide="lock"
                                class="auth-input-icon"
                            ></i>


                            <input
                                id="portal-login-password"
                                name="password"
                                type="password"
                                autocomplete="current-password"
                                placeholder="Enter your password"
                                required
                            >


                            <button
                                type="button"
                                class="auth-password-toggle"
                                id="portal-login-password-toggle"
                                aria-label="Show password"
                            >

                                <i
                                    data-lucide="eye"
                                ></i>

                            </button>

                        </div>

                    </div>


                    <div
                        id="portal-login-message"
                        class="form-message"
                        role="alert"
                        aria-live="polite"
                    ></div>


                    <button
                        id="portal-login-submit"
                        class="auth-submit-button"
                        type="submit"
                    >

                        <i data-lucide="log-in"></i>

                        <span>
                            Login
                        </span>

                    </button>


                </form>


                <div class="auth-switch">

                    <span>
                        Don't have an account?
                    </span>


                    <button
                        type="button"
                        id="open-register-from-login"
                        class="auth-link-button"
                    >
                        Create Account
                    </button>

                </div>

            </div>

        `;

    }


    /* ========================================================
       REGISTRATION FORM
       ======================================================== */

    function buildRegistrationForm() {

        return `

            <div class="auth-form-wrapper">

                <div class="auth-intro">

                    <div class="auth-icon">

                        <i data-lucide="user-plus"></i>

                    </div>

                    <div>

                        <h3>
                            Create your account
                        </h3>

                        <p>
                            Create your youth portal
                            account to access your
                            personalized experience.
                        </p>

                    </div>

                </div>


                <form
                    id="portal-register-form"
                    class="auth-form"
                    novalidate
                >


                    <div class="auth-grid">


                        <div class="auth-field">

                            <label
                                for="portal-first-name"
                            >
                                First name
                            </label>


                            <input
                                id="portal-first-name"
                                name="first_name"
                                type="text"
                                autocomplete="given-name"
                                placeholder="First name"
                                required
                            >

                        </div>


                        <div class="auth-field">

                            <label
                                for="portal-last-name"
                            >
                                Last name
                            </label>


                            <input
                                id="portal-last-name"
                                name="last_name"
                                type="text"
                                autocomplete="family-name"
                                placeholder="Last name"
                                required
                            >

                        </div>


                    </div>


                    <div class="auth-field">

                        <label
                            for="portal-register-email"
                        >
                            Email address
                        </label>


                        <div class="auth-input-wrap">

                            <i
                                data-lucide="mail"
                                class="auth-input-icon"
                            ></i>


                            <input
                                id="portal-register-email"
                                name="email"
                                type="email"
                                autocomplete="email"
                                placeholder="you@example.com"
                                required
                            >

                        </div>

                    </div>


                    <div class="auth-field">

                        <label
                            for="portal-phone"
                        >
                            Phone number
                        </label>


                        <div class="auth-input-wrap">

                            <i
                                data-lucide="phone"
                                class="auth-input-icon"
                            ></i>


                            <input
                                id="portal-phone"
                                name="phone"
                                type="tel"
                                autocomplete="tel"
                                placeholder="08012345678"
                            >

                        </div>

                    </div>


                    <div class="auth-field">

                        <label
                            for="portal-date-of-birth"
                        >
                            Date of birth
                        </label>


                        <input
                            id="portal-date-of-birth"
                            name="date_of_birth"
                            type="date"
                            required
                        >

                    </div>


                    <div class="auth-field">

                        <label
                            for="portal-institution"
                        >
                            School / Institution
                        </label>


                        <select
                            id="portal-institution"
                            name="institution_id"
                            required
                        >

                            <option value="">
                                Loading institutions...
                            </option>

                        </select>

                    </div>


                    <div class="auth-grid">


                        <div class="auth-field">

                            <label
                                for="portal-course"
                            >
                                Course
                            </label>


                            <input
                                id="portal-course"
                                name="course"
                                type="text"
                                placeholder="e.g. Computer Science"
                            >

                        </div>


                        <div class="auth-field">

                            <label
                                for="portal-level"
                            >
                                Level
                            </label>


                            <select
                                id="portal-level"
                                name="level"
                                required
                            >

                                <option value="">
                                    Select level
                                </option>

                                <option value="100">
                                    100 Level
                                </option>

                                <option value="200">
                                    200 Level
                                </option>

                                <option value="300">
                                    300 Level
                                </option>

                                <option value="400">
                                    400 Level
                                </option>

                                <option value="500">
                                    500 Level
                                </option>

                                <option value="graduate">
                                    Graduate
                                </option>

                                <option value="secondary">
                                    Secondary School
                                </option>

                            </select>

                        </div>


                    </div>


                    <div class="auth-field">

                        <label
                            for="portal-gender"
                        >
                            Gender
                        </label>


                        <select
                            id="portal-gender"
                            name="gender"
                        >

                            <option value="">
                                Select gender
                            </option>

                            <option value="Male">
                                Male
                            </option>

                            <option value="Female">
                                Female
                            </option>

                        </select>

                    </div>


                    <div class="auth-field">

                        <label
                            for="portal-register-password"
                        >
                            Password
                        </label>


                        <div class="auth-input-wrap">

                            <i
                                data-lucide="lock"
                                class="auth-input-icon"
                            ></i>


                            <input
                                id="portal-register-password"
                                name="password"
                                type="password"
                                autocomplete="new-password"
                                placeholder="At least 8 characters"
                                required
                            >


                            <button
                                type="button"
                                class="auth-password-toggle"
                                id="portal-register-password-toggle"
                                aria-label="Show password"
                            >

                                <i data-lucide="eye"></i>

                            </button>

                        </div>

                    </div>


                    <div class="auth-field">

                        <label
                            for="portal-confirm-password"
                        >
                            Confirm password
                        </label>


                        <div class="auth-input-wrap">

                            <i
                                data-lucide="shield-check"
                                class="auth-input-icon"
                            ></i>


                            <input
                                id="portal-confirm-password"
                                name="confirm_password"
                                type="password"
                                autocomplete="new-password"
                                placeholder="Enter password again"
                                required
                            >


                            <button
                                type="button"
                                class="auth-password-toggle"
                                id="portal-confirm-password-toggle"
                                aria-label="Show password"
                            >

                                <i data-lucide="eye"></i>

                            </button>

                        </div>

                    </div>


                    <div
                        id="portal-register-message"
                        class="form-message"
                        role="alert"
                        aria-live="polite"
                    ></div>


                    <button
                        id="portal-register-submit"
                        class="auth-submit-button"
                        type="submit"
                    >

                        <i data-lucide="user-plus"></i>

                        <span>
                            Create Account
                        </span>

                    </button>


                </form>


                <div class="auth-switch">

                    <span>
                        Already have an account?
                    </span>


                    <button
                        type="button"
                        id="open-login-from-register"
                        class="auth-link-button"
                    >
                        Login
                    </button>

                </div>

            </div>

        `;

    }


    /* ========================================================
       LOGIN FORM BINDING
       ======================================================== */

    function bindLoginForm() {

        const form =
            $("portal-login-form");


        const password =
            $("portal-login-password");


        const passwordToggle =
            $("portal-login-password-toggle");


        const switchButton =
            $("open-register-from-login");


        if (
            passwordToggle &&
            password
        ) {

            bindPasswordToggle(
                passwordToggle,
                password
            );

        }


        if (switchButton) {

            switchButton.addEventListener(
                "click",
                function () {

                    openAuthModal(
                        "register"
                    );

                }
            );

        }


        if (form) {

            form.addEventListener(
                "submit",
                handleLogin
            );

        }


        refreshIcons();

    }


    /* ========================================================
       LOGIN
       ======================================================== */

    async function handleLogin(event) {

        event.preventDefault();


        if (loginInProgress) {

            return;

        }


        const emailInput =
            $("portal-login-email");


        const passwordInput =
            $("portal-login-password");


        const message =
            $("portal-login-message");


        const button =
            $("portal-login-submit");


        const email =
            emailInput
                ? emailInput.value.trim()
                : "";


        const password =
            passwordInput
                ? passwordInput.value
                : "";


        setMessage(
            message,
            ""
        );


        /* ----------------------------------------------------
           VALIDATION
           ---------------------------------------------------- */

        if (!email) {

            setMessage(
                message,
                "Please enter your email address."
            );

            if (emailInput) {

                emailInput.focus();

            }

            return;

        }


        if (!isValidEmail(email)) {

            setMessage(
                message,
                "Please enter a valid email address."
            );

            if (emailInput) {

                emailInput.focus();

            }

            return;

        }


        if (!password) {

            setMessage(
                message,
                "Please enter your password."
            );

            if (passwordInput) {

                passwordInput.focus();

            }

            return;

        }


        loginInProgress = true;


        setButtonLoading(
            button,
            true,
            "Signing in..."
        );


        try {

            /* ------------------------------------------------
               CHECK API
               ------------------------------------------------ */

            if (
                !window.API ||
                typeof window.API.post !== "function"
            ) {

                throw new Error(
                    "The API connection layer is not available."
                );

            }


            if (
                typeof window.API.isConfigured === "function" &&
                !window.API.isConfigured()
            ) {

                throw new Error(
                    "The portal backend has not been configured."
                );

            }


            /* ------------------------------------------------
               SEND LOGIN REQUEST
               ------------------------------------------------ */

            const result =
                await window.API.post(
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
                "AFC LOGIN RESPONSE:",
                result
            );


            const data =
                getResponseData(result);


            /* ------------------------------------------------
               VALIDATE SERVER RESPONSE
               ------------------------------------------------ */

            if (
                !data ||
                !data.user ||
                !data.session ||
                !data.session.token
            ) {

                console.error(
                    "Incomplete login response:",
                    result
                );


                throw new Error(
                    getResponseMessage(result) ||
                    "The server returned an incomplete login response."
                );

            }


            /* ------------------------------------------------
               SAVE SESSION IN MEMORY
               ------------------------------------------------ */

            if (
                window.AFC &&
                window.AFC.state
            ) {

                window.AFC.state.authenticated =
                    true;

                window.AFC.state.user =
                    data.user;

                window.AFC.state.token =
                    data.session.token;

            }


            /* ------------------------------------------------
               CLOSE AUTH MODAL
               ------------------------------------------------ */

            if (
                window.AFC &&
                typeof window.AFC.closeModal === "function"
            ) {

                window.AFC.closeModal();

            }


            /* ------------------------------------------------
               NOTIFY APPLICATION
               ------------------------------------------------ */

            window.dispatchEvent(
                new CustomEvent(
                    "afc:authenticated",
                    {

                        detail: {

                            user:
                                data.user,

                            token:
                                data.session.token,

                            expires_at:
                                data.session.expires_at

                        }

                    }
                )
            );


            /* ------------------------------------------------
               SUCCESS MESSAGE
               ------------------------------------------------ */

            if (
                window.AFC &&
                typeof window.AFC.toast === "function"
            ) {

                window.AFC.toast(
                    getResponseMessage(result) ||
                    "Login successful.",
                    "success"
                );

            }


        } catch (error) {

            console.error(
                "AFC LOGIN ERROR:",
                error
            );


            let messageText =
                error &&
                error.message
                    ? error.message
                    : "Unable to log in. Please try again.";


            /*
             * Do NOT blindly convert every TypeError
             * into a network error.
             *
             * Some TypeErrors can come from the
             * backend response itself.
             */

            if (
                error &&
                (
                    error.name === "TypeError" ||
                    error.name === "NetworkError"
                ) &&
                !error.message
            ) {

                messageText =
                    "We could not connect to the portal server. Please check your internet connection and try again.";

            }


            setMessage(
                message,
                messageText,
                "error"
            );

        } finally {

            loginInProgress = false;


            setButtonLoading(
                button,
                false
            );

        }

    }


    /* ========================================================
       REGISTRATION FORM BINDING
       ======================================================== */

    function bindRegistrationForm() {

        const form =
            $("portal-register-form");


        const password =
            $("portal-register-password");


        const confirmPassword =
            $("portal-confirm-password");


        const passwordToggle =
            $("portal-register-password-toggle");


        const confirmToggle =
            $("portal-confirm-password-toggle");


        const switchButton =
            $("open-login-from-register");


        if (
            passwordToggle &&
            password
        ) {

            bindPasswordToggle(
                passwordToggle,
                password
            );

        }


        if (
            confirmToggle &&
            confirmPassword
        ) {

            bindPasswordToggle(
                confirmToggle,
                confirmPassword
            );

        }


        if (switchButton) {

            switchButton.addEventListener(
                "click",
                function () {

                    openAuthModal(
                        "login"
                    );

                }
            );

        }


        if (form) {

            form.addEventListener(
                "submit",
                handleRegistration
            );

        }


        refreshIcons();

    }


    /* ========================================================
       LOAD INSTITUTIONS
       ======================================================== */

    async function loadInstitutions() {

        const select =
            $("portal-institution");


        if (!select) {

            return;

        }


        select.innerHTML = `

            <option value="">
                Loading institutions...
            </option>

        `;


        select.disabled = true;


        try {

            if (
                !window.API ||
                typeof window.API.get !== "function"
            ) {

                throw new Error(
                    "The API connection layer is not available."
                );

            }


            if (
                typeof window.API.isConfigured === "function" &&
                !window.API.isConfigured()
            ) {

                throw new Error(
                    "The portal backend has not been configured."
                );

            }


            const result =
                await window.API.get(
                    "getinstitutions"
                );


            console.log(
                "AFC INSTITUTIONS RESPONSE:",
                result
            );


            const data =
                getResponseData(result);


            let institutions = [];


            if (Array.isArray(data)) {

                institutions =
                    data;

            } else if (
                data &&
                Array.isArray(data.institutions)
            ) {

                institutions =
                    data.institutions;

            }


            institutionsCache =
                institutions;


            select.innerHTML = `

                <option value="">
                    Select your institution
                </option>

            `;


            institutions.forEach(
                function (institution) {

                    if (!institution) {

                        return;

                    }


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


                    select.appendChild(
                        option
                    );

                }
            );


            if (!select.options.length) {

                select.innerHTML = `

                    <option value="">
                        No institutions available
                    </option>

                `;

            }

        } catch (error) {

            console.error(
                "AFC INSTITUTIONS ERROR:",
                error
            );


            institutionsCache = [];


            select.innerHTML = `

                <option value="">
                    Unable to load institutions
                </option>

            `;


            const message =
                $("portal-register-message");


            setMessage(
                message,
                error &&
                error.message
                    ? error.message
                    : "We could not load the institution list. Please try again.",
                "error"
            );

        } finally {

            select.disabled = false;

        }


        refreshIcons();

    }


    /* ========================================================
       REGISTRATION
       ======================================================== */

    async function handleRegistration(event) {

        event.preventDefault();


        if (registrationInProgress) {

            return;

        }


        const message =
            $("portal-register-message");


        const button =
            $("portal-register-submit");


        const firstName =
            $("portal-first-name")
                ?.value
                .trim() || "";


        const lastName =
            $("portal-last-name")
                ?.value
                .trim() || "";


        const email =
            $("portal-register-email")
                ?.value
                .trim() || "";


        const phone =
            $("portal-phone")
                ?.value
                .trim() || "";


        const dateOfBirth =
            $("portal-date-of-birth")
                ?.value || "";


        const institutionId =
            $("portal-institution")
                ?.value || "";


        const course =
            $("portal-course")
                ?.value
                .trim() || "";


        const level =
            $("portal-level")
                ?.value || "";


        const gender =
            $("portal-gender")
                ?.value || "";


        const password =
            $("portal-register-password")
                ?.value || "";


        const confirmPassword =
            $("portal-confirm-password")
                ?.value || "";


        setMessage(
            message,
            ""
        );


        /* ----------------------------------------------------
           VALIDATION
           ---------------------------------------------------- */

        if (!firstName) {

            setMessage(
                message,
                "Please enter your first name."
            );

            return;

        }


        if (!lastName) {

            setMessage(
                message,
                "Please enter your last name."
            );

            return;

        }


        if (!email) {

            setMessage(
                message,
                "Please enter your email address."
            );

            return;

        }


        if (!isValidEmail(email)) {

            setMessage(
                message,
                "Please enter a valid email address."
            );

            return;

        }


        if (!dateOfBirth) {

            setMessage(
                message,
                "Please enter your date of birth."
            );

            return;

        }


        if (!institutionId) {

            setMessage(
                message,
                "Please select your school or institution."
            );

            return;

        }


        if (!level) {

            setMessage(
                message,
                "Please select your level."
            );

            return;

        }


        if (!password) {

            setMessage(
                message,
                "Please create a password."
            );

            return;

        }


        if (password.length < 8) {

            setMessage(
                message,
                "Your password must contain at least 8 characters."
            );

            return;

        }


        if (password !== confirmPassword) {

            setMessage(
                message,
                "Your passwords do not match."
            );

            return;

        }


        registrationInProgress = true;


        setButtonLoading(
            button,
            true,
            "Creating account..."
        );


        try {

            /* ------------------------------------------------
               CHECK API
               ------------------------------------------------ */

            if (
                !window.API ||
                typeof window.API.post !== "function"
            ) {

                throw new Error(
                    "The API connection layer is not available."
                );

            }


            if (
                typeof window.API.isConfigured === "function" &&
                !window.API.isConfigured()
            ) {

                throw new Error(
                    "The portal backend has not been configured."
                );

            }


            /* ------------------------------------------------
               FIND INSTITUTION NAME
               ------------------------------------------------ */

            const institution =
                institutionsCache.find(
                    function (item) {

                        const itemId =
                            item.institution_id ||
                            item.id ||
                            "";


                        return String(itemId) ===
                            String(institutionId);

                    }
                );


            const institutionName =
                institution
                    ? (
                        institution.institution_name ||
                        institution.name ||
                        institution.title ||
                        ""
                    )
                    : "";


            /* ------------------------------------------------
               SEND REGISTRATION REQUEST
               ------------------------------------------------ */

            const result =
                await window.API.post(
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
                "AFC REGISTRATION RESPONSE:",
                result
            );


            /* ------------------------------------------------
               CHECK RESPONSE
               ------------------------------------------------ */

            const responseData =
                getResponseData(result);


            /*
             * Some API layers return:
             *
             * {
             *   success: true,
             *   message: "...",
             *   data: {...}
             * }
             *
             * Others return data directly.
             *
             * If an explicit success:false exists,
             * treat it as an error.
             */

            if (
                result &&
                result.success === false
            ) {

                throw new Error(
                    getResponseMessage(result) ||
                    "Unable to create your account."
                );

            }


            if (
                responseData &&
                responseData.success === false
            ) {

                throw new Error(
                    getResponseMessage(responseData) ||
                    "Unable to create your account."
                );

            }


            /* ------------------------------------------------
               SUCCESS
               ------------------------------------------------ */

            setMessage(
                message,
                getResponseMessage(result) ||
                "Your account has been created successfully.",
                "success"
            );


            /* ------------------------------------------------
               CLEAR PASSWORD FIELDS
               ------------------------------------------------ */

            const passwordInput =
                $("portal-register-password");


            const confirmInput =
                $("portal-confirm-password");


            if (passwordInput) {

                passwordInput.value = "";

            }


            if (confirmInput) {

                confirmInput.value = "";

            }


            /*
             * Keep the successful registration message
             * visible briefly, then move to login.
             */

            setTimeout(
                function () {

                    openAuthModal(
                        "login"
                    );


                    const loginEmail =
                        $("portal-login-email");


                    if (loginEmail) {

                        loginEmail.value =
                            email;

                        loginEmail.focus();

                    }


                    const loginMessage =
                        $("portal-login-message");


                    setMessage(
                        loginMessage,
                        "Account created successfully. Please log in.",
                        "success"
                    );

                },
                900
            );


        } catch (error) {

            console.error(
                "AFC REGISTRATION ERROR:",
                error
            );


            const messageText =
                error &&
                error.message
                    ? error.message
                    : "Unable to create your account. Please try again.";


            setMessage(
                message,
                messageText,
                "error"
            );

        } finally {

            registrationInProgress = false;


            setButtonLoading(
                button,
                false
            );

        }

    }


    /* ========================================================
       OPEN LOGIN
       ======================================================== */

    function openLogin() {

        if (
            window.AFC &&
            window.AFC.state &&
            window.AFC.state.authenticated
        ) {

            return;

        }


        openAuthModal(
            "login"
        );

    }


    /* ========================================================
       OPEN REGISTER
       ======================================================== */

    function openRegister() {

        if (
            window.AFC &&
            window.AFC.state &&
            window.AFC.state.authenticated
        ) {

            return;

        }


        openAuthModal(
            "register"
        );

    }


    /* ========================================================
       LOGOUT
       ======================================================== */

    async function logout() {

        const token =
            window.AFC &&
            window.AFC.state
                ? window.AFC.state.token
                : null;


        try {

            if (
                token &&
                window.API &&
                typeof window.API.post === "function"
            ) {

                await window.API.post(
                    "logout",
                    {
                        token: token
                    }
                );

            }

        } catch (error) {

            console.warn(
                "AFC logout request failed:",
                error
            );

        }


        /* ----------------------------------------------------
           CLEAR IN-MEMORY SESSION
           ---------------------------------------------------- */

        if (
            window.AFC &&
            window.AFC.state
        ) {

            window.AFC.state.authenticated =
                false;

            window.AFC.state.user =
                null;

            window.AFC.state.token =
                null;

        }


        /* ----------------------------------------------------
           CLOSE MODAL
           ---------------------------------------------------- */

        if (
            window.AFC &&
            typeof window.AFC.closeModal === "function"
        ) {

            window.AFC.closeModal();

        }


        /* ----------------------------------------------------
           NOTIFY APPLICATION
           ---------------------------------------------------- */

        window.dispatchEvent(
            new CustomEvent(
                "afc:loggedout"
            )
        );


        /* ----------------------------------------------------
           TOAST
           ---------------------------------------------------- */

        if (
            window.AFC &&
            typeof window.AFC.toast === "function"
        ) {

            window.AFC.toast(
                "You have been logged out.",
                "success"
            );

        }

    }


    /* ========================================================
       AUTH STATUS
       ======================================================== */

    function isAuthenticated() {

        return Boolean(
            window.AFC &&
            window.AFC.state &&
            window.AFC.state.authenticated
        );

    }


    function getUser() {

        return (
            window.AFC &&
            window.AFC.state
                ? window.AFC.state.user
                : null
        );

    }


    function getToken() {

        return (
            window.AFC &&
            window.AFC.state
                ? window.AFC.state.token
                : null
        );

    }


    /* ========================================================
       LOGIN BUTTON INTERCEPTION
       ========================================================
       
       IMPORTANT:
       app.js currently contains an older handler for
       #sidebar-login-button.

       This capture listener takes control of that click
       before the old handler can display the
       "Login will be connected in Phase B" message.

       Authentication is therefore opened ONLY when
       the user deliberately clicks Login.
       ======================================================== */

    function bindLoginButton() {

        document.addEventListener(
            "click",
            function (event) {

                const loginButton =
                    event.target.closest(
                        "#sidebar-login-button"
                    );


                if (!loginButton) {

                    return;

                }


                /*
                 * Prevent the old Phase A handler
                 * in app.js from running.
                 */

                event.preventDefault();

                event.stopImmediatePropagation();


                openLogin();

            },
            true
        );

    }


    /* ========================================================
       PUBLIC AUTH API
       ======================================================== */

    window.AUTH = {

        openLogin:
            openLogin,

        openRegister:
            openRegister,

        login:
            openLogin,

        register:
            openRegister,

        logout:
            logout,

        isAuthenticated:
            isAuthenticated,

        isLoggedIn:
            isAuthenticated,

        getUser:
            getUser,

        getCurrentUser:
            getUser,

        getToken:
            getToken

    };


    /* ========================================================
       STARTUP
       ======================================================== */

    bindLoginButton();


    console.log(
        "AFC Isiwu Youth Portal authentication module loaded."
    );


})();
