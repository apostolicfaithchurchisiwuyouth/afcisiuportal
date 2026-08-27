/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   FILE: auth.js
   PHASE B — AUTHENTICATION
   ============================================================ */

(function () {

    "use strict";


    /* ========================================================
       STATE
       ======================================================== */

    let loginInProgress =
        false;


    let registrationInProgress =
        false;


    let institutionsCache =
        [];


    /* ========================================================
       HELPERS
       ======================================================== */

    function escapeHtml(
        value
    ) {

        return String(
            value === undefined ||
            value === null
                ? ""
                : value
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    function isValidEmail(
        email
    ) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(
                String(email || "")
                    .trim()
            );

    }


    function getResponseData(
        response
    ) {

        if (!response) {

            return null;

        }


        if (
            response.data !==
            undefined
        ) {

            return response.data;

        }


        return response;

    }


    function getResponseMessage(
        response
    ) {

        if (!response) {

            return "";

        }


        return (
            response.message ||
            (
                response.data &&
                response.data.message
            ) ||
            ""
        );

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

            element.classList.add(
                type
            );

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

            if (
                !button.dataset.originalHtml
            ) {

                button.dataset.originalHtml =
                    button.innerHTML;

            }


            button.disabled =
                true;


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
                        loadingText ||
                        "Please wait..."
                    }
                </span>

            `;

        } else {

            button.disabled =
                false;


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


        if (
            window.lucide &&
            typeof window.lucide.createIcons ===
                "function"
        ) {

            window.lucide.createIcons();

        }

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
                    input.type ===
                    "text";


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


                if (
                    window.lucide &&
                    typeof window.lucide.createIcons ===
                        "function"
                ) {

                    window.lucide.createIcons();

                }

            }
        );

    }


    /* ========================================================
       AUTH MODAL BASE
       ======================================================== */

    function openAuthModal(
        mode = "login"
    ) {

        if (
            !window.AFC ||
            typeof AFC.modal !==
                "function"
        ) {

            console.error(
                "AFC modal system is unavailable."
            );

            return;

        }


        if (
            mode ===
            "register"
        ) {

            AFC.modal({

                title:
                    "Create your account",

                content:
                    buildRegistrationForm()

            });


            bindRegistrationForm();

            loadInstitutions();

        } else {

            AFC.modal({

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


                    <p>

                        Sign in to continue to
                        your youth portal.

                    </p>

                </div>


                <form
                    id="portal-login-form"
                    novalidate
                >


                    <div class="auth-field">

                        <label
                            for="portal-login-email"
                        >

                            Email address

                        </label>


                        <div class="auth-input-wrap">

                            <i data-lucide="mail"></i>


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

                            <i data-lucide="lock"></i>


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

                                <i data-lucide="eye"></i>

                            </button>

                        </div>

                    </div>



                    <div
                        id="portal-login-message"
                        class="form-message"
                        role="alert"
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
       REGISTER FORM
       ======================================================== */

    function buildRegistrationForm() {

        return `

            <div class="auth-form-wrapper">

                <div class="auth-intro">

                    <div class="auth-icon">

                        <i data-lucide="user-plus"></i>

                    </div>


                    <p>

                        Create your youth portal
                        account.

                    </p>

                </div>


                <form
                    id="portal-register-form"
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

                            <i data-lucide="mail"></i>


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

                            <i data-lucide="phone"></i>


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

                            <i data-lucide="lock"></i>


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

                            <i data-lucide="shield-check"></i>


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
       LOGIN BINDING
       ======================================================== */

    function bindLoginForm() {

        const form =
            document.getElementById(
                "portal-login-form"
            );


        const password =
            document.getElementById(
                "portal-login-password"
            );


        const passwordToggle =
            document.getElementById(
                "portal-login-password-toggle"
            );


        const switchButton =
            document.getElementById(
                "open-register-from-login"
            );


        if (
            passwordToggle
        ) {

            bindPasswordToggle(
                passwordToggle,
                password
            );

        }


        if (
            switchButton
        ) {

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

    async function handleLogin(
        event
    ) {

        event.preventDefault();


        if (
            loginInProgress
        ) {

            return;

        }


        const emailInput =
            document.getElementById(
                "portal-login-email"
            );


        const passwordInput =
            document.getElementById(
                "portal-login-password"
            );


        const message =
            document.getElementById(
                "portal-login-message"
            );


        const button =
            document.getElementById(
                "portal-login-submit"
            );


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


        if (!email) {

            setMessage(
                message,
                "Please enter your email address."
            );

            return;

        }


        if (
            !isValidEmail(
                email
            )
        ) {

            setMessage(
                message,
                "Please enter a valid email address."
            );

            return;

        }


        if (!password) {

            setMessage(
                message,
                "Please enter your password."
            );

            return;

        }


        loginInProgress =
            true;


        setButtonLoading(
            button,
            true,
            "Signing in..."
        );


        try {

            if (
                !window.API ||
                typeof API.post !==
                    "function"
            ) {

                throw new Error(
                    "The API connection layer is not available."
                );

            }


            if (
                typeof API.isConfigured ===
                    "function" &&
                !API.isConfigured()
            ) {

                throw new Error(
                    "The portal backend has not been configured."
                );

            }


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
                "AFC LOGIN RESPONSE:",
                result
            );


            const data =
                getResponseData(
                    result
                );


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
                    getResponseMessage(
                        result
                    ) ||
                    "The server returned an incomplete login response."
                );

            }


            /*
             * --------------------------------------------------
             * KEEP SESSION IN MEMORY ONLY
             * --------------------------------------------------
             */

            if (
                window.AFC &&
                window.AFC.state
            ) {

                AFC.state.authenticated =
                    true;

                AFC.state.user =
                    data.user;

                AFC.state.token =
                    data.session.token;

            }


            /*
             * --------------------------------------------------
             * CLOSE MODAL
             * --------------------------------------------------
             */

            if (
                window.AFC &&
                typeof AFC.closeModal ===
                    "function"
            ) {

                AFC.closeModal();

            }


            /*
             * --------------------------------------------------
             * NOTIFY APPLICATION
             * --------------------------------------------------
             */

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


            if (
                window.AFC &&
                typeof AFC.toast ===
                    "function"
            ) {

                AFC.toast(
                    getResponseMessage(
                        result
                    ) ||
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
                    : "Unable to log in.";


            /*
             * Network / CORS style error.
             */

            if (
                error &&
                error.name ===
                    "TypeError"
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

            loginInProgress =
                false;


            setButtonLoading(
                button,
                false
            );

        }

    }


    /* ========================================================
       REGISTRATION BINDING
       ======================================================== */

    function bindRegistrationForm() {

        const form =
            document.getElementById(
                "portal-register-form"
            );


        const password =
            document.getElementById(
                "portal-register-password"
            );


        const confirmPassword =
            document.getElementById(
                "portal-confirm-password"
            );


        const passwordToggle =
            document.getElementById(
                "portal-register-password-toggle"
            );


        const confirmToggle =
            document.getElementById(
                "portal-confirm-password-toggle"
            );


        const switchButton =
            document.getElementById(
                "open-login-from-register"
            );


        if (
            passwordToggle
        ) {

            bindPasswordToggle(
                passwordToggle,
                password
            );

        }


        if (
            confirmToggle
        ) {

            bindPasswordToggle(
                confirmToggle,
                confirmPassword
            );

        }


        if (
            switchButton
        ) {

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
            document.getElementById(
                "portal-institution"
            );


        if (!select) {

            return;

        }


        select.innerHTML = `

            <option value="">
                Loading institutions...
            </option>

        `;


        select.disabled =
            true;


        try {

            if (
                !window.API ||
                typeof API.get !==
                    "function"
            ) {

                throw new Error(
                    "The API connection layer is not available."
                );

            }


            const result =
                await API.get(
                    "getinstitutions"
                );


            console.log(
                "AFC INSTITUTIONS RESPONSE:",
                result
            );


            const data =
                getResponseData(
                    result
                );


            let institutions =
                [];


            if (
                Array.isArray(
                    data
                )
            ) {

                institutions =
                    data;

            } else if (
                data &&
                Array.isArray(
                    data.institutions
                )
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
                function (
                    institution
                ) {

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


            if (
                !institutions.length
            ) {

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


            select.innerHTML = `

                <option value="">
                    Unable to load institutions
                </option>

            `;


            const message =
                document.getElementById(
                    "portal-register-message"
                );


            setMessage(
                message,
                error.message ||
                "We could not load the institution list. Please try again."
            );


        } finally {

            select.disabled =
                false;

        }


        refreshIcons();

    }


    /* ========================================================
       REGISTRATION
       ======================================================== */

    async function handleRegistration(
        event
    ) {

        event.preventDefault();


        if (
            registrationInProgress
        ) {

            return;

        }


        const message =
            document.getElementById(
                "portal-register-message"
            );


        const button =
            document.getElementById(
                "portal-register-submit"
            );


        const firstName =
            document
                .getElementById(
                    "portal-first-name"
                )
                ?.value
                .trim() ||
            "";


        const lastName =
            document
                .getElementById(
                    "portal-last-name"
                )
                ?.value
                .trim() ||
            "";


        const email =
            document
                .getElementById(
                    "portal-register-email"
                )
                ?.value
                .trim() ||
            "";


        const phone =
            document
                .getElementById(
                    "portal-phone"
                )
                ?.value
                .trim() ||
            "";


        const dateOfBirth =
            document
                .getElementById(
                    "portal-date-of-birth"
                )
                ?.value ||
            "";


        const institutionId =
            document
                .getElementById(
                    "portal-institution"
                )
                ?.value ||
            "";


        const course =
            document
                .getElementById(
                    "portal-course"
                )
                ?.value
                .trim() ||
            "";


        const level =
            document
                .getElementById(
                    "portal-level"
                )
                ?.value ||
            "";


        const gender =
            document
                .getElementById(
                    "portal-gender"
                )
                ?.value ||
            "";


        const password =
            document
                .getElementById(
                    "portal-register-password"
                )
                ?.value ||
            "";


        const confirmPassword =
            document
                .getElementById(
                    "portal-confirm-password"
                )
                ?.value ||
            "";


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


        if (
            !isValidEmail(
                email
            )
        ) {

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


        if (
            password.length <
            8
        ) {

            setMessage(
                message,
                "Your password must contain at least 8 characters."
            );

            return;

        }


        if (
            password !==
            confirmPassword
        ) {

            setMessage(
                message,
                "Your passwords do not match."
            );

            return;

        }


        registrationInProgress =
            true;


        setButtonLoading(
            button,
            true,
            "Creating account..."
        );


        try {

            if (
                !window.API ||
                typeof API.post !==
                    "function"
            ) {

                throw new Error(
                    "The API connection layer is not available."
                );

            }


            if (
                typeof API.isConfigured ===
                    "function" &&
                !API.isConfigured()
            ) {

                throw new Error(
                    "The portal backend has not been configured."
                );

            }


            /*
             * Find institution name.
             */

            const institution =
                institutionsCache.find(
                    function (
                        item
                    ) {

                        return String(
                            item.institution_id ||
                            item.id ||
                            ""
                        ) ===
                        String(
                            institutionId
                        );

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


            /*
             * ------------------------------------------------
             * SEND TO GOOGLE APPS SCRIPT
             * ------------------------------------------------
             */

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
                "AFC REGISTRATION RESPONSE:",
                result
            );


            /*
             * If API.post() returned successfully,
             * the Apps Script backend accepted
             * the request.
             */

            setMessage(
                message,
                getResponseMessage(
                    result
                ) ||
                "Your account has been created successfully.",
                "success"
            );


            /*
             * Clear password fields.
             */

            const passwordInput =
                document.getElementById(
                    "portal-register-password"
                );


            const confirmInput =
                document.getElementById(
                    "portal-confirm-password"
                );


            if (passwordInput) {

                passwordInput.value =
                    "";

            }


            if (confirmInput) {

                confirmInput.value =
                    "";

            }


            /*
             * Return to login after
             * successful registration.
             */

            setTimeout(
                function () {

                    openAuthModal(
                        "login"
                    );


                    const loginEmail =
                        document.getElementById(
                            "portal-login-email"
                        );


                    if (loginEmail) {

                        loginEmail.value =
                            email;

                        loginEmail.focus();

                    }


                    const loginMessage =
                        document.getElementById(
                            "portal-login-message"
                        );


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


            let messageText =
                error &&
                error.message
                    ? error.message
                    : "Unable to create your account.";


            if (
                error &&
                error.name ===
                    "TypeError"
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

            registrationInProgress =
                false;


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
            AFC.state &&
            AFC.state.authenticated
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
            AFC.state
                ? AFC.state.token
                : null;


        try {

            if (
                token &&
                window.API &&
                typeof API.post ===
                    "function"
            ) {

                await API.post(
                    "logout",
                    {
                        token:
                            token
                    }
                );

            }

        } catch (error) {

            console.warn(
                "AFC logout request failed:",
                error
            );

        }


        /*
         * Clear in-memory state.
         *
         * NO localStorage.
         * NO sessionStorage.
         */

        if (
            window.AFC &&
            AFC.state
        ) {

            AFC.state.authenticated =
                false;

            AFC.state.user =
                null;

            AFC.state.token =
                null;

        }


        if (
            window.AFC &&
            typeof AFC.closeModal ===
                "function"
        ) {

            AFC.closeModal();

        }


        window.dispatchEvent(
            new CustomEvent(
                "afc:loggedout"
            )
        );


        if (
            window.AFC &&
            typeof AFC.toast ===
                "function"
        ) {

            AFC.toast(
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
            AFC.state &&
            AFC.state.authenticated
        );

    }


    function getUser() {

        return (
            window.AFC &&
            AFC.state
                ? AFC.state.user
                : null
        );

    }


    function getToken() {

        return (
            window.AFC &&
            AFC.state
                ? AFC.state.token
                : null
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

    console.log(
        "AFC Isiwu Youth Portal authentication module loaded."
    );


})();
