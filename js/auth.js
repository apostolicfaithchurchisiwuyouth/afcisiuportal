/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   FILE: js/auth.js
   PURPOSE: Authentication UI Controller
   PHASE B-2
   ============================================================ */

(function () {

    "use strict";


    /* ========================================================
       AUTH CONTROLLER
       ======================================================== */

    const Auth = {


        /* ====================================================
           INITIALIZE
           ==================================================== */

        init() {

            console.log(
                "AFC Authentication initializing..."
            );


            this.bindEvents();

            this.showLogin();


        },


        /* ====================================================
           BIND EVENTS
           ==================================================== */

        bindEvents() {

            document.addEventListener(
                "click",
                (event) => {

                    const target =
                        event.target.closest(
                            "[data-auth-action]"
                        );


                    if (!target) {
                        return;
                    }


                    const action =
                        target.dataset.authAction;


                    switch (action) {

                        case "login":
                            this.showLogin();
                            break;


                        case "register":
                            this.showRegister();
                            break;


                        case "logout":
                            this.logout();
                            break;


                        case "close":
                            this.close();
                            break;

                    }

                }
            );


            document.addEventListener(
                "submit",
                (event) => {

                    if (
                        event.target.id ===
                        "afc-login-form"
                    ) {

                        event.preventDefault();

                        this.login(
                            event.target
                        );

                    }


                    if (
                        event.target.id ===
                        "afc-register-form"
                    ) {

                        event.preventDefault();

                        this.register(
                            event.target
                        );

                    }

                }
            );


            document.addEventListener(
                "click",
                (event) => {

                    const button =
                        event.target.closest(
                            "[data-password-toggle]"
                        );


                    if (!button) {
                        return;
                    }


                    const inputId =
                        button.dataset.passwordToggle;


                    const input =
                        document.getElementById(
                            inputId
                        );


                    if (!input) {
                        return;
                    }


                    this.togglePassword(
                        input,
                        button
                    );

                }
            );

        },


        /* ====================================================
           SHOW LOGIN
           ==================================================== */

        showLogin() {

            const container =
                document.getElementById(
                    "auth-screen"
                );


            if (!container) {
                return;
            }


            container.innerHTML =
                this.loginTemplate();


            container.classList.remove(
                "hidden"
            );


            document.body.classList.add(
                "auth-open"
            );


            this.refreshIcons();

        },


        /* ====================================================
           SHOW REGISTER
           ==================================================== */

        async showRegister() {

            const container =
                document.getElementById(
                    "auth-screen"
                );


            if (!container) {
                return;
            }


            container.innerHTML =
                this.registerTemplate();


            container.classList.remove(
                "hidden"
            );


            document.body.classList.add(
                "auth-open"
            );


            this.refreshIcons();


            await this.loadInstitutions();

        },


        /* ====================================================
           CLOSE AUTH
           ==================================================== */

        close() {

            const container =
                document.getElementById(
                    "auth-screen"
                );


            if (!container) {
                return;
            }


            container.classList.add(
                "hidden"
            );


            document.body.classList.remove(
                "auth-open"
            );

        },


        /* ====================================================
           LOGIN
           ==================================================== */

        async login(form) {

            const email =
                form.email.value.trim();


            const password =
                form.password.value;


            const button =
                form.querySelector(
                    "[type='submit']"
                );


            const error =
                document.getElementById(
                    "auth-error"
                );


            this.clearMessage();


            if (!email) {

                this.showError(
                    "Please enter your email address."
                );

                return;

            }


            if (!password) {

                this.showError(
                    "Please enter your password."
                );

                return;

            }


            this.setLoading(
                button,
                true,
                "Signing in..."
            );


            try {

                const deviceInfo =
                    this.getDeviceInfo();


                const result =
                    await AFC.AuthAPI.login(
                        email,
                        password,
                        deviceInfo
                    );


                if (!result.success) {

                    this.showError(
                        result.message ||
                        "Unable to sign in."
                    );


                    return;

                }


                /*
                 * IMPORTANT
                 *
                 * No localStorage.
                 *
                 * The token exists only in
                 * the current application
                 * runtime.
                 */

                const loginData =
                    result.data;


                if (
                    !loginData ||
                    !loginData.session ||
                    !loginData.session.token
                ) {

                    this.showError(
                        "Login succeeded, but no session was returned."
                    );


                    return;

                }


                this.createSession(
                    loginData
                );


            } catch (exception) {

                console.error(
                    "Login error:",
                    exception
                );


                this.showError(
                    "Something went wrong while signing in. Please try again."
                );


            } finally {

                this.setLoading(
                    button,
                    false,
                    "Sign in"
                );

            }

        },


        /* ====================================================
           CREATE APPLICATION SESSION
           ==================================================== */

        createSession(
            loginData
        ) {

            /*
             * Make sure the global application
             * state exists.
             */

            if (
                !window.AFC_APP ||
                !window.AFC_APP.state
            ) {

                console.error(
                    "AFC application state was not found."
                );


                this.showError(
                    "The application could not initialize your session."
                );


                return;

            }


            const state =
                window.AFC_APP.state;


            state.authenticated =
                true;


            state.token =
                loginData.session.token;


            state.user =
                loginData.user || null;


            state.session =
                loginData.session;


            /*
             * Close authentication UI.
             */

            this.close();


            /*
             * Notify the application.
             */

            document.dispatchEvent(
                new CustomEvent(
                    "afc:authenticated",
                    {
                        detail: {
                            user:
                                state.user,

                            session:
                                state.session
                        }
                    }
                )
            );


            /*
             * Refresh icons after
             * the main application renders.
             */

            setTimeout(() => {

                this.refreshIcons();

            }, 50);


        },


        /* ====================================================
           LOGOUT
           ==================================================== */

        async logout() {

            const state =
                window.AFC_APP &&
                window.AFC_APP.state;


            if (!state) {
                return;
            }


            const token =
                state.token;


            try {

                if (token) {

                    await AFC.AuthAPI.logout(
                        token
                    );

                }

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }


            /*
             * Clear runtime session.
             *
             * Nothing is stored in localStorage.
             */

            state.authenticated =
                false;


            state.token =
                null;


            state.user =
                null;


            state.session =
                null;


            document.dispatchEvent(
                new CustomEvent(
                    "afc:loggedout"
                )
            );


            this.showLogin();

        },


        /* ====================================================
           LOAD INSTITUTIONS
           ==================================================== */

        async loadInstitutions() {

            const select =
                document.getElementById(
                    "register-institution"
                );


            if (!select) {
                return;
            }


            try {

                const result =
                    await AFC.PublicAPI
                        .getInstitutions();


                if (!result.success) {

                    select.innerHTML =
                        `
                        <option value="">
                            Unable to load institutions
                        </option>
                        `;

                    return;

                }


                const institutions =
                    result.data || [];


                if (
                    institutions.length ===
                    0
                ) {

                    select.innerHTML =
                        `
                        <option value="">
                            No institutions available
                        </option>
                        `;

                    return;

                }


                select.innerHTML =
                    `
                    <option value="">
                        Select your institution
                    </option>
                    `;


                institutions.forEach(
                    (institution) => {

                        const option =
                            document.createElement(
                                "option"
                            );


                        option.value =
                            institution.institution_id;


                        option.textContent =
                            institution.institution_name;


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


                select.innerHTML =
                    `
                    <option value="">
                        Unable to load institutions
                    </option>
                    `;

            }

        },


        /* ====================================================
           REGISTER
           ==================================================== */

        async register(form) {

            this.clearMessage();


            const data = {

                first_name:
                    form.first_name.value.trim(),

                last_name:
                    form.last_name.value.trim(),

                email:
                    form.email.value.trim(),

                phone:
                    form.phone.value.trim(),

                password:
                    form.password.value,

                confirm_password:
                    form.confirm_password.value,

                date_of_birth:
                    form.date_of_birth.value,

                institution_id:
                    form.institution_id.value,

                course:
                    form.course.value.trim(),

                level:
                    form.level.value,

                gender:
                    form.gender.value,

                language:
                    "en",

                theme:
                    "system"

            };


            const button =
                form.querySelector(
                    "[type='submit']"
                );


            this.setLoading(
                button,
                true,
                "Creating account..."
            );


            try {

                const result =
                    await AFC.AuthAPI.register(
                        data
                    );


                if (!result.success) {

                    this.showError(
                        result.message ||
                        "Unable to create your account."
                    );


                    return;

                }


                /*
                 * Registration succeeded.
                 *
                 * The backend currently returns
                 * the created user but does not
                 * automatically create a session.
                 *
                 * Therefore we take the user to
                 * login.
                 */

                this.showSuccess(
                    "Your account has been created successfully. Please sign in."
                );


                setTimeout(() => {

                    this.showLogin();

                    const emailInput =
                        document.querySelector(
                            "#afc-login-form input[name='email']"
                        );


                    if (emailInput) {

                        emailInput.value =
                            data.email;

                    }

                }, 900);


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                this.showError(
                    "Something went wrong while creating your account."
                );


            } finally {

                this.setLoading(
                    button,
                    false,
                    "Create account"
                );

            }

        },


        /* ====================================================
           PASSWORD TOGGLE
           ==================================================== */

        togglePassword(
            input,
            button
        ) {

            const isPassword =
                input.type ===
                "password";


            input.type =
                isPassword
                    ? "text"
                    : "password";


            button.innerHTML =
                isPassword
                    ? '<i data-lucide="eye-off"></i>'
                    : '<i data-lucide="eye"></i>';


            this.refreshIcons();

        },


        /* ====================================================
           LOADING STATE
           ==================================================== */

        setLoading(
            button,
            loading,
            text
        ) {

            if (!button) {
                return;
            }


            if (loading) {

                button.disabled =
                    true;


                button.dataset.originalText =
                    button.innerHTML;


                button.innerHTML =
                    `
                    <span class="afc-spinner"></span>
                    <span>${text}</span>
                    `;

            } else {

                button.disabled =
                    false;


                button.innerHTML =
                    button.dataset.originalText ||
                    text;

            }

        },


        /* ====================================================
           ERROR
           ==================================================== */

        showError(message) {

            const element =
                document.getElementById(
                    "auth-error"
                );


            if (!element) {
                return;
            }


            element.innerHTML =
                `
                <i data-lucide="circle-alert"></i>
                <span>${this.escapeHTML(message)}</span>
                `;


            element.classList.remove(
                "hidden"
            );


            this.refreshIcons();

        },


        /* ====================================================
           SUCCESS
           ==================================================== */

        showSuccess(message) {

            const element =
                document.getElementById(
                    "auth-error"
                );


            if (!element) {
                return;
            }


            element.innerHTML =
                `
                <i data-lucide="circle-check"></i>
                <span>${this.escapeHTML(message)}</span>
                `;


            element.dataset.type =
                "success";


            element.classList.remove(
                "hidden"
            );


            this.refreshIcons();

        },


        /* ====================================================
           CLEAR MESSAGE
           ==================================================== */

        clearMessage() {

            const element =
                document.getElementById(
                    "auth-error"
                );


            if (!element) {
                return;
            }


            element.classList.add(
                "hidden"
            );


            element.innerHTML =
                "";


            delete element.dataset.type;

        },


        /* ====================================================
           DEVICE INFORMATION
           ==================================================== */

        getDeviceInfo() {

            const platform =
                navigator.platform ||
                "Unknown";


            const userAgent =
                navigator.userAgent ||
                "Unknown";


            return (
                platform +
                " | " +
                userAgent
            ).substring(
                0,
                500
            );

        },


        /* ====================================================
           REFRESH LUCIDE
           ==================================================== */

        refreshIcons() {

            if (
                window.lucide &&
                typeof window.lucide.createIcons ===
                "function"
            ) {

                window.lucide.createIcons();

            }

        },


        /* ====================================================
           ESCAPE HTML
           ==================================================== */

        escapeHTML(value) {

            return String(value)
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

        },


        /* ====================================================
           LOGIN TEMPLATE
           ==================================================== */

        loginTemplate() {

            return `

            <div class="afc-auth-shell">

                <div class="afc-auth-card">

                    <div class="afc-auth-brand">

                        <div class="afc-auth-logo">
                            <i data-lucide="church"></i>
                        </div>

                        <div>

                            <p class="afc-auth-kicker">
                                AFC ISIU YOUTH
                            </p>

                            <h1>
                                Welcome back
                            </h1>

                        </div>

                    </div>


                    <p class="afc-auth-subtitle">
                        Sign in to continue to your youth portal.
                    </p>


                    <div
                        id="auth-error"
                        class="afc-auth-message hidden"
                        role="alert"
                    ></div>


                    <form
                        id="afc-login-form"
                        novalidate
                    >

                        <div class="afc-field">

                            <label for="login-email">
                                Email address
                            </label>

                            <div class="afc-input-wrap">

                                <i
                                    data-lucide="mail"
                                    class="afc-input-icon"
                                ></i>

                                <input
                                    id="login-email"
                                    type="email"
                                    name="email"
                                    autocomplete="email"
                                    placeholder="you@example.com"
                                    required
                                >

                            </div>

                        </div>


                        <div class="afc-field">

                            <label for="login-password">
                                Password
                            </label>

                            <div class="afc-input-wrap">

                                <i
                                    data-lucide="lock-keyhole"
                                    class="afc-input-icon"
                                ></i>

                                <input
                                    id="login-password"
                                    type="password"
                                    name="password"
                                    autocomplete="current-password"
                                    placeholder="Enter your password"
                                    required
                                >

                                <button
                                    type="button"
                                    class="afc-password-toggle"
                                    data-password-toggle="login-password"
                                    aria-label="Show password"
                                >
                                    <i data-lucide="eye"></i>
                                </button>

                            </div>

                        </div>


                        <button
                            type="submit"
                            class="afc-auth-submit"
                        >

                            <span>
                                Sign in
                            </span>

                            <i data-lucide="arrow-right"></i>

                        </button>

                    </form>


                    <div class="afc-auth-divider">

                        <span>
                            New here?
                        </span>

                    </div>


                    <button
                        type="button"
                        class="afc-auth-secondary"
                        data-auth-action="register"
                    >

                        Create an account

                    </button>


                </div>

            </div>

            `;

        },


        /* ====================================================
           REGISTER TEMPLATE
           ==================================================== */

        registerTemplate() {

            return `

            <div class="afc-auth-shell afc-auth-register-shell">

                <div class="afc-auth-card afc-auth-register-card">

                    <div class="afc-auth-top">

                        <button
                            type="button"
                            class="afc-icon-button"
                            data-auth-action="close"
                            aria-label="Back"
                        >
                            <i data-lucide="arrow-left"></i>
                        </button>

                        <span>
                            Create account
                        </span>

                    </div>


                    <div class="afc-auth-heading">

                        <div class="afc-auth-logo">
                            <i data-lucide="user-plus"></i>
                        </div>

                        <h1>
                            Join the portal
                        </h1>

                        <p>
                            Create your account to access lessons, quizzes and youth resources.
                        </p>

                    </div>


                    <div
                        id="auth-error"
                        class="afc-auth-message hidden"
                        role="alert"
                    ></div>


                    <form
                        id="afc-register-form"
                        novalidate
                    >

                        <div class="afc-form-grid">


                            <div class="afc-field">

                                <label for="register-first-name">
                                    First name
                                </label>

                                <div class="afc-input-wrap">

                                    <i
                                        data-lucide="user"
                                        class="afc-input-icon"
                                    ></i>

                                    <input
                                        id="register-first-name"
                                        type="text"
                                        name="first_name"
                                        autocomplete="given-name"
                                        placeholder="First name"
                                        required
                                    >

                                </div>

                            </div>


                            <div class="afc-field">

                                <label for="register-last-name">
                                    Last name
                                </label>

                                <div class="afc-input-wrap">

                                    <i
                                        data-lucide="user"
                                        class="afc-input-icon"
                                    ></i>

                                    <input
                                        id="register-last-name"
                                        type="text"
                                        name="last_name"
                                        autocomplete="family-name"
                                        placeholder="Last name"
                                        required
                                    >

                                </div>

                            </div>


                            <div class="afc-field afc-field-full">

                                <label for="register-email">
                                    Email address
                                </label>

                                <div class="afc-input-wrap">

                                    <i
                                        data-lucide="mail"
                                        class="afc-input-icon"
                                    ></i>

                                    <input
                                        id="register-email"
                                        type="email"
                                        name="email"
                                        autocomplete="email"
                                        placeholder="you@example.com"
                                        required
                                    >

                                </div>

                            </div>


                            <div class="afc-field">

                                <label for="register-phone">
                                    Phone number
                                </label>

                                <div class="afc-input-wrap">

                                    <i
                                        data-lucide="phone"
                                        class="afc-input-icon"
                                    ></i>

                                    <input
                                        id="register-phone"
                                        type="tel"
                                        name="phone"
                                        autocomplete="tel"
                                        placeholder="Phone number"
                                    >

                                </div>

                            </div>


                            <div class="afc-field">

                                <label for="register-dob">
                                    Date of birth
                                </label>

                                <div class="afc-input-wrap">

                                    <i
                                        data-lucide="cake"
                                        class="afc-input-icon"
                                    ></i>

                                    <input
                                        id="register-dob"
                                        type="date"
                                        name="date_of_birth"
                                        required
                                    >

                                </div>

                            </div>


                            <div class="afc-field afc-field-full">

                                <label for="register-institution">
                                    School / Institution
                                </label>

                                <div class="afc-input-wrap">

                                    <i
                                        data-lucide="graduation-cap"
                                        class="afc-input-icon"
                                    ></i>

                                    <select
                                        id="register-institution"
                                        name="institution_id"
                                        required
                                    >

                                        <option value="">
                                            Loading institutions...
                                        </option>

                                    </select>

                                </div>

                            </div>


                            <div class="afc-field">

                                <label for="register-course">
                                    Course
                                </label>

                                <div class="afc-input-wrap">

                                    <i
                                        data-lucide="book-open"
                                        class="afc-input-icon"
                                    ></i>

                                    <input
                                        id="register-course"
                                        type="text"
                                        name="course"
                                        placeholder="Course / programme"
                                    >

                                </div>

                            </div>


                            <div class="afc-field">

                                <label for="register-level">
                                    Level
                                </label>

                                <div class="afc-input-wrap">

                                    <i
                                        data-lucide="layers"
                                        class="afc-input-icon"
                                    ></i>

                                    <select
                                        id="register-level"
                                        name="level"
                                        required
                                    >

                                        <option value="">
                                            Select level
                                        </option>

                                        <option value="SS1">
                                            SS1
                                        </option>

                                        <option value="SS2">
                                            SS2
                                        </option>

                                        <option value="SS3">
                                            SS3
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

                                        <option value="Graduate">
                                            Graduate
                                        </option>

                                    </select>

                                </div>

                            </div>


                            <div class="afc-field">

                                <label for="register-gender">
                                    Gender
                                </label>

                                <div class="afc-input-wrap">

                                    <i
                                        data-lucide="circle-user"
                                        class="afc-input-icon"
                                    ></i>

                                    <select
                                        id="register-gender"
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

                            </div>


                            <div class="afc-field">

                                <label for="register-password">
                                    Password
                                </label>

                                <div class="afc-input-wrap">

                                    <i
                                        data-lucide="lock-keyhole"
                                        class="afc-input-icon"
                                    ></i>

                                    <input
                                        id="register-password"
                                        type="password"
                                        name="password"
                                        autocomplete="new-password"
                                        placeholder="Minimum 8 characters"
                                        required
                                    >

                                    <button
                                        type="button"
                                        class="afc-password-toggle"
                                        data-password-toggle="register-password"
                                        aria-label="Show password"
                                    >
                                        <i data-lucide="eye"></i>
                                    </button>

                                </div>

                            </div>


                            <div class="afc-field">

                                <label for="register-confirm-password">
                                    Confirm password
                                </label>

                                <div class="afc-input-wrap">

                                    <i
                                        data-lucide="shield-check"
                                        class="afc-input-icon"
                                    ></i>

                                    <input
                                        id="register-confirm-password"
                                        type="password"
                                        name="confirm_password"
                                        autocomplete="new-password"
                                        placeholder="Repeat password"
                                        required
                                    >

                                    <button
                                        type="button"
                                        class="afc-password-toggle"
                                        data-password-toggle="register-confirm-password"
                                        aria-label="Show password"
                                    >
                                        <i data-lucide="eye"></i>
                                    </button>

                                </div>

                            </div>


                        </div>


                        <button
                            type="submit"
                            class="afc-auth-submit"
                        >

                            <span>
                                Create account
                            </span>

                            <i data-lucide="user-plus"></i>

                        </button>


                    </form>


                    <p class="afc-auth-footnote">

                        Already have an account?

                        <button
                            type="button"
                            class="afc-auth-link"
                            data-auth-action="login"
                        >
                            Sign in
                        </button>

                    </p>


                </div>

            </div>

            `;

        }

    };


    /* ========================================================
       EXPORT
       ======================================================== */

    window.AFC_AUTH =
        Auth;


    /* ========================================================
       INITIALIZE AFTER DOM
       ======================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            () => Auth.init()
        );

    } else {

        Auth.init();

    }


})();
