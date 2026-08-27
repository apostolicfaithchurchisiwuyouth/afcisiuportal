/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   FILE: app.js
   PHASE A + PHASE B FOUNDATION
   ============================================================ */

(function () {

    "use strict";


    /* ========================================================
       APPLICATION STATE
       ======================================================== */

    const state = {

        authenticated:
            false,

        currentPage:
            "home",

        currentLesson:
            null,

        currentQuiz:
            null,

        lessons:
            [],

        notifications:
            [],

        settings:
            {},

        token:
            null,

        user:
            null,

        loading:
            false

    };


    /* ========================================================
       DOM HELPER
       ======================================================== */

    function $(id) {

        return document.getElementById(id);

    }


    /* ========================================================
       LUCIDE
       ======================================================== */

    function refreshIcons() {

        if (
            window.lucide &&
            typeof window.lucide.createIcons ===
                "function"
        ) {

            window.lucide.createIcons();

        }

    }


    /* ========================================================
       SHOW / HIDE
       ======================================================== */

    function show(element) {

        if (!element) return;

        element.classList.remove(
            "hidden"
        );

    }


    function hide(element) {

        if (!element) return;

        element.classList.add(
            "hidden"
        );

    }


    /* ========================================================
       LOADING
       ======================================================== */

    function setLoading(
        isLoading
    ) {

        state.loading =
            Boolean(isLoading);


        const loader =
            $("global-loading");


        if (!loader) return;


        if (state.loading) {

            show(loader);

        } else {

            hide(loader);

        }

    }


    /* ========================================================
       TOAST
       ======================================================== */

    function showToast(
        message,
        type = "default"
    ) {

        const container =
            $("toast-container");


        if (!container) return;


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            "toast";


        toast.dataset.type =
            type;


        toast.textContent =
            message;


        container.appendChild(
            toast
        );


        requestAnimationFrame(
            function () {

                toast.style.opacity =
                    "1";

                toast.style.transform =
                    "translateY(0)";

            }
        );


        setTimeout(
            function () {

                toast.style.opacity =
                    "0";

                toast.style.transform =
                    "translateY(10px)";


                setTimeout(
                    function () {

                        toast.remove();

                    },
                    250
                );

            },
            3000
        );

    }


    /* ========================================================
       MODAL
       ======================================================== */

    function openModal(
        options = {}
    ) {

        const root =
            $("modal-root");


        if (!root) return;


        const title =
            options.title ||
            "";


        const content =
            options.content ||
            "";


        const footer =
            options.footer ||
            "";


        root.innerHTML = `

            <div
                class="modal-backdrop"
                data-modal-backdrop
            >

                <div
                    class="modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >

                    <div class="modal-header">

                        <h2 id="modal-title">

                            ${escapeHtml(
                                title
                            )}

                        </h2>


                        <button
                            type="button"
                            class="icon-button"
                            data-close-modal
                            aria-label="Close"
                        >

                            <i data-lucide="x"></i>

                        </button>

                    </div>


                    <div class="modal-body">

                        ${content}

                    </div>


                    ${
                        footer
                            ? `
                                <div class="modal-footer">
                                    ${footer}
                                </div>
                              `
                            : ""
                    }

                </div>

            </div>

        `;


        refreshIcons();


        const backdrop =
            root.querySelector(
                "[data-modal-backdrop]"
            );


        const closeButton =
            root.querySelector(
                "[data-close-modal]"
            );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeModal
            );

        }


        if (backdrop) {

            backdrop.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        backdrop
                    ) {

                        closeModal();

                    }

                }
            );

        }


        document.body.classList.add(
            "modal-open"
        );


        setTimeout(
            function () {

                const firstInput =
                    root.querySelector(
                        "input, select, button"
                    );


                if (firstInput) {

                    firstInput.focus();

                }

            },
            50
        );

    }


    function closeModal() {

        const root =
            $("modal-root");


        if (!root) return;


        root.innerHTML =
            "";


        document.body.classList.remove(
            "modal-open"
        );

    }


    /* ========================================================
       ESCAPE HTML
       ======================================================== */

    function escapeHtml(
        value
    ) {

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

    }


    /* ========================================================
       NAVIGATION
       ======================================================== */

    function navigateTo(
        page
    ) {

        if (!page) return;


        state.currentPage =
            page;


        updateNavigation();


        renderPage();


        closeSidebar();

    }


    /* ========================================================
       UPDATE NAVIGATION
       ======================================================== */

    function updateNavigation() {

        document
            .querySelectorAll(
                "[data-page]"
            )
            .forEach(
                function (item) {

                    const page =
                        item.dataset.page;


                    item.classList.toggle(
                        "active",
                        page ===
                            state.currentPage
                    );

                }
            );

    }


    /* ========================================================
       SIDEBAR
       ======================================================== */

    function openSidebar() {

        const sidebar =
            $("sidebar");


        const overlay =
            $("sidebar-overlay");


        const menuButton =
            $("menu-button");


        if (sidebar) {

            sidebar.classList.add(
                "open"
            );

        }


        if (overlay) {

            overlay.classList.add(
                "active"
            );

        }


        if (menuButton) {

            menuButton.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    }


    function closeSidebar() {

        const sidebar =
            $("sidebar");


        const overlay =
            $("sidebar-overlay");


        const menuButton =
            $("menu-button");


        if (sidebar) {

            sidebar.classList.remove(
                "open"
            );

        }


        if (overlay) {

            overlay.classList.remove(
                "active"
            );

        }


        if (menuButton) {

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }


    /* ========================================================
       PAGE RENDERER
       ======================================================== */

    function renderPage() {

        const container =
            $("page-container");


        if (!container) return;


        switch (
            state.currentPage
        ) {

            case "home":

                renderHome(
                    container
                );

                break;


            case "lessons":

                renderLessons(
                    container
                );

                break;


            case "gallery":

                renderGallery(
                    container
                );

                break;


            case "profile":

                renderProfile(
                    container
                );

                break;


            case "settings":

                renderSettings(
                    container
                );

                break;


            default:

                renderHome(
                    container
                );

        }


        refreshIcons();

    }


    /* ========================================================
       HOME
       ======================================================== */

    function renderHome(
        container
    ) {

        const firstName =
            state.user &&
            (
                state.user.first_name ||
                state.user.full_name ||
                ""
            );


        const welcomeText =
            state.authenticated &&
            firstName
                ? `Welcome back, ${escapeHtml(firstName)}`
                : "Welcome to AFC Isiwu Youth Portal";


        container.innerHTML = `

            <section>


                <div style="
                    margin-bottom: 24px;
                ">

                    <p style="
                        font-size: 13px;
                        color: var(--ink-muted);
                        margin-bottom: 5px;
                    ">

                        ${
                            state.authenticated
                                ? "Good to see you"
                                : "AFC Isiwu Youth"
                        }

                    </p>


                    <h1 style="
                        font-size: clamp(
                            1.6rem,
                            5vw,
                            2.2rem
                        );
                        color: var(--brand-dark);
                    ">

                        ${welcomeText}

                    </h1>


                    <p style="
                        margin-top: 8px;
                        color: var(--ink-soft);
                        font-size: 14px;
                    ">

                        Learn, connect and grow
                        in Christ.

                    </p>

                </div>



                <div style="
                    display: grid;
                    grid-template-columns:
                        repeat(
                            auto-fit,
                            minmax(
                                180px,
                                1fr
                            )
                        );
                    gap: 14px;
                ">


                    <button
                        type="button"
                        data-page="lessons"
                        style="
                            text-align: left;
                            padding: 20px;
                            border-radius: 20px;
                            background: white;
                            border: 1px solid var(--border);
                        "
                    >

                        <i
                            data-lucide="book-open"
                            style="
                                width: 24px;
                                height: 24px;
                                color: var(--brand);
                                margin-bottom: 14px;
                            "
                        ></i>


                        <h3 style="
                            font-size: 16px;
                            margin-bottom: 5px;
                        ">

                            Weekly Lessons

                        </h3>


                        <p style="
                            font-size: 12px;
                            color: var(--ink-muted);
                        ">

                            Read this week's
                            lesson.

                        </p>

                    </button>



                    <button
                        type="button"
                        data-page="gallery"
                        style="
                            text-align: left;
                            padding: 20px;
                            border-radius: 20px;
                            background: white;
                            border: 1px solid var(--border);
                        "
                    >

                        <i
                            data-lucide="images"
                            style="
                                width: 24px;
                                height: 24px;
                                color: var(--brand);
                                margin-bottom: 14px;
                            "
                        ></i>


                        <h3 style="
                            font-size: 16px;
                            margin-bottom: 5px;
                        ">

                            Gallery

                        </h3>


                        <p style="
                            font-size: 12px;
                            color: var(--ink-muted);
                        ">

                            Explore our memories.

                        </p>

                    </button>


                </div>


            </section>

        `;


        bindPageButtons();

    }


    /* ========================================================
       LESSONS
       ======================================================== */

    function renderLessons(
        container
    ) {

        container.innerHTML = `

            <section>

                <div style="
                    margin-bottom: 24px;
                ">

                    <p style="
                        color: var(--ink-muted);
                        font-size: 13px;
                    ">

                        Learn & Grow

                    </p>


                    <h1 style="
                        font-size: 1.8rem;
                        margin-top: 4px;
                    ">

                        Weekly Lessons

                    </h1>

                </div>


                <div style="
                    padding: 30px;
                    border-radius: 20px;
                    background: white;
                    border: 1px solid var(--border);
                    text-align: center;
                ">

                    <i
                        data-lucide="book-open"
                        style="
                            width: 38px;
                            height: 38px;
                            color: var(--brand);
                            margin-bottom: 12px;
                        "
                    ></i>


                    <h3>

                        Lessons are coming here.

                    </h3>


                    <p style="
                        margin-top: 6px;
                        color: var(--ink-muted);
                        font-size: 13px;
                    ">

                        The lessons API will be
                        connected in the next phase.

                    </p>

                </div>

            </section>

        `;

    }


    /* ========================================================
       GALLERY
       ======================================================== */

    function renderGallery(
        container
    ) {

        container.innerHTML = `

            <section>

                <div style="
                    margin-bottom: 24px;
                ">

                    <p style="
                        color: var(--ink-muted);
                        font-size: 13px;
                    ">

                        Memories

                    </p>


                    <h1 style="
                        font-size: 1.8rem;
                        margin-top: 4px;
                    ">

                        Gallery

                    </h1>

                </div>


                <div style="
                    padding: 30px;
                    border-radius: 20px;
                    background: white;
                    border: 1px solid var(--border);
                    text-align: center;
                ">

                    <i
                        data-lucide="images"
                        style="
                            width: 38px;
                            height: 38px;
                            color: var(--brand);
                            margin-bottom: 12px;
                        "
                    ></i>


                    <h3>

                        Gallery is ready.

                    </h3>


                    <p style="
                        margin-top: 6px;
                        color: var(--ink-muted);
                        font-size: 13px;
                    ">

                        Gallery data will be
                        connected to Google Sheets
                        through the API.

                    </p>

                </div>

            </section>

        `;

    }


    /* ========================================================
       PROFILE
       ======================================================== */

    function renderProfile(
        container
    ) {

        if (
            !state.authenticated
        ) {

            container.innerHTML = `

                <section>

                    <div style="
                        margin-bottom: 24px;
                    ">

                        <p style="
                            color: var(--ink-muted);
                            font-size: 13px;
                        ">

                            Account

                        </p>


                        <h1 style="
                            font-size: 1.8rem;
                            margin-top: 4px;
                        ">

                            Profile

                        </h1>

                    </div>


                    <div style="
                        padding: 30px;
                        border-radius: 20px;
                        background: white;
                        border: 1px solid var(--border);
                        text-align: center;
                    ">

                        <i
                            data-lucide="lock-keyhole"
                            style="
                                width: 38px;
                                height: 38px;
                                color: var(--brand);
                                margin-bottom: 12px;
                            "
                        ></i>


                        <h3>
                            Login required
                        </h3>


                        <p style="
                            margin-top: 6px;
                            color: var(--ink-muted);
                            font-size: 13px;
                        ">

                            Please log in to view
                            your profile.

                        </p>


                        <button
                            type="button"
                            id="profile-login-button"
                            style="
                                margin-top: 18px;
                                padding: 11px 18px;
                                border-radius: 12px;
                                border: 0;
                                background: var(--brand);
                                color: white;
                                cursor: pointer;
                            "
                        >

                            <i
                                data-lucide="log-in"
                            ></i>

                            <span>
                                Login
                            </span>

                        </button>

                    </div>

                </section>

            `;


            const button =
                $("profile-login-button");


            if (button) {

                button.addEventListener(
                    "click",
                    function () {

                        if (
                            window.AUTH &&
                            typeof AUTH.openLogin ===
                                "function"
                        ) {

                            AUTH.openLogin();

                        }

                    }
                );

            }


            refreshIcons();

            return;

        }


        const user =
            state.user || {};


        const fullName =
            user.full_name ||
            [
                user.first_name,
                user.last_name
            ]
                .filter(Boolean)
                .join(" ") ||
            "Member";


        container.innerHTML = `

            <section>

                <div style="
                    margin-bottom: 24px;
                ">

                    <p style="
                        color: var(--ink-muted);
                        font-size: 13px;
                    ">

                        Account

                    </p>


                    <h1 style="
                        font-size: 1.8rem;
                        margin-top: 4px;
                    ">

                        Profile

                    </h1>

                </div>


                <div style="
                    padding: 30px;
                    border-radius: 20px;
                    background: white;
                    border: 1px solid var(--border);
                ">

                    <div style="
                        width: 70px;
                        height: 70px;
                        border-radius: 50%;
                        background: var(--brand);
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 24px;
                        font-weight: 700;
                        margin-bottom: 16px;
                    ">

                        ${escapeHtml(
                            fullName
                                .charAt(0)
                                .toUpperCase()
                        )}

                    </div>


                    <h2>

                        ${escapeHtml(
                            fullName
                        )}

                    </h2>


                    <p style="
                        margin-top: 5px;
                        color: var(--ink-muted);
                    ">

                        ${escapeHtml(
                            user.email ||
                            ""
                        )}

                    </p>


                    <div style="
                        margin-top: 22px;
                        display: grid;
                        gap: 10px;
                    ">

                        <div>

                            <strong>
                                Phone
                            </strong>

                            <p>
                                ${escapeHtml(
                                    user.phone ||
                                    "Not provided"
                                )}
                            </p>

                        </div>


                        <div>

                            <strong>
                                Institution
                            </strong>

                            <p>
                                ${escapeHtml(
                                    user.institution_name ||
                                    user.institution_id ||
                                    "Not provided"
                                )}
                            </p>

                        </div>


                        <div>

                            <strong>
                                Level
                            </strong>

                            <p>
                                ${escapeHtml(
                                    user.level ||
                                    "Not provided"
                                )}
                            </p>

                        </div>

                    </div>

                </div>

            </section>

        `;

    }


    /* ========================================================
       SETTINGS
       ======================================================== */

    function renderSettings(
        container
    ) {

        container.innerHTML = `

            <section>

                <div style="
                    margin-bottom: 24px;
                ">

                    <p style="
                        color: var(--ink-muted);
                        font-size: 13px;
                    ">

                        Preferences

                    </p>


                    <h1 style="
                        font-size: 1.8rem;
                        margin-top: 4px;
                    ">

                        Settings

                    </h1>

                </div>


                <div style="
                    padding: 30px;
                    border-radius: 20px;
                    background: white;
                    border: 1px solid var(--border);
                    text-align: center;
                ">

                    <i
                        data-lucide="settings"
                        style="
                            width: 38px;
                            height: 38px;
                            color: var(--brand);
                            margin-bottom: 12px;
                        "
                    ></i>


                    <h3>
                        Settings
                    </h3>


                    <p style="
                        margin-top: 6px;
                        color: var(--ink-muted);
                        font-size: 13px;
                    ">

                        Your portal preferences
                        will be managed here.

                    </p>

                </div>

            </section>

        `;

    }


    /* ========================================================
       PAGE BUTTONS
       ======================================================== */

    function bindPageButtons() {

        document
            .querySelectorAll(
                "[data-page]"
            )
            .forEach(
                function (button) {

                    button.onclick =
                        function () {

                            navigateTo(
                                button.dataset.page
                            );

                        };

                }
            );

    }


    /* ========================================================
       AUTH UI
       ======================================================== */

    function updateAuthUI() {

        const loginButton =
            $("sidebar-login-button");


        if (!loginButton) {
            return;
        }


        if (
            state.authenticated
        ) {

            loginButton.innerHTML = `

                <i data-lucide="log-out"></i>

                <span>
                    Logout
                </span>

            `;

            loginButton.dataset.authAction =
                "logout";

        } else {

            loginButton.innerHTML = `

                <i data-lucide="log-in"></i>

                <span>
                    Login
                </span>

            `;

            loginButton.dataset.authAction =
                "login";

        }


        refreshIcons();

    }


    /* ========================================================
       GLOBAL NAVIGATION EVENTS
       ======================================================== */

    function bindNavigation() {


        document
            .querySelectorAll(
                ".nav-item, .bottom-nav-item"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            navigateTo(
                                button.dataset.page
                            );

                        }
                    );

                }
            );


        /* ----------------------------------------------------
           MENU
           ---------------------------------------------------- */

        const menuButton =
            $("menu-button");


        if (menuButton) {

            menuButton.addEventListener(
                "click",
                function () {

                    const sidebar =
                        $("sidebar");


                    if (
                        sidebar &&
                        sidebar.classList.contains(
                            "open"
                        )
                    ) {

                        closeSidebar();

                    } else {

                        openSidebar();

                    }

                }
            );

        }


        /* ----------------------------------------------------
           CLOSE SIDEBAR
           ---------------------------------------------------- */

        const closeButton =
            $("close-sidebar");


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeSidebar
            );

        }


        /* ----------------------------------------------------
           OVERLAY
           ---------------------------------------------------- */

        const overlay =
            $("sidebar-overlay");


        if (overlay) {

            overlay.addEventListener(
                "click",
                closeSidebar
            );

        }


        /* ----------------------------------------------------
           QUICK ACTION
           ---------------------------------------------------- */

        const mainAction =
            $("main-action-button");


        if (mainAction) {

            mainAction.addEventListener(
                "click",
                function () {

                    openModal({

                        title:
                            "Quick Actions",

                        content: `

                            <div style="
                                display: grid;
                                gap: 10px;
                            ">


                                <button
                                    type="button"
                                    class="sidebar-action"
                                    data-quick-action="lessons"
                                >

                                    <i data-lucide="book-open"></i>

                                    <span>
                                        Weekly Lessons
                                    </span>

                                </button>


                                <button
                                    type="button"
                                    class="sidebar-action"
                                    data-quick-action="gallery"
                                >

                                    <i data-lucide="images"></i>

                                    <span>
                                        Gallery
                                    </span>

                                </button>


                                <button
                                    type="button"
                                    class="sidebar-action"
                                    data-quick-action="profile"
                                >

                                    <i data-lucide="user-round"></i>

                                    <span>
                                        Profile
                                    </span>

                                </button>


                                ${
                                    state.authenticated
                                        ? `
                                            <button
                                                type="button"
                                                class="sidebar-action"
                                                data-quick-action="logout"
                                            >

                                                <i data-lucide="log-out"></i>

                                                <span>
                                                    Logout
                                                </span>

                                            </button>
                                          `
                                        : `
                                            <button
                                                type="button"
                                                class="sidebar-action"
                                                data-quick-action="login"
                                            >

                                                <i data-lucide="log-in"></i>

                                                <span>
                                                    Login
                                                </span>

                                            </button>
                                          `
                                }

                            </div>

                        `

                    });


                    document
                        .querySelectorAll(
                            "[data-quick-action]"
                        )
                        .forEach(
                            function (button) {

                                button.addEventListener(
                                    "click",
                                    function () {

                                        const action =
                                            button.dataset.quickAction;


                                        closeModal();


                                        if (
                                            action ===
                                            "login"
                                        ) {

                                            AUTH.openLogin();

                                            return;

                                        }


                                        if (
                                            action ===
                                            "logout"
                                        ) {

                                            AUTH.logout();

                                            return;

                                        }


                                        navigateTo(
                                            action
                                        );

                                    }
                                );

                            }
                        );


                    refreshIcons();

                }
            );

        }


        /* ----------------------------------------------------
           NOTIFICATIONS
           ---------------------------------------------------- */

        const notificationButton =
            $("notification-button");


        if (notificationButton) {

            notificationButton.addEventListener(
                "click",
                function () {

                    if (
                        state.authenticated
                    ) {

                        showToast(
                            "Notifications will be connected soon."
                        );

                    } else {

                        showToast(
                            "Please log in to view notifications."
                        );

                    }

                }
            );

        }


        /* ----------------------------------------------------
           SIDEBAR LOGIN / LOGOUT
           ---------------------------------------------------- */

        const sidebarAccount =
            $("sidebar-login-button");


        if (sidebarAccount) {

            sidebarAccount.addEventListener(
                "click",
                function () {

                    if (
                        state.authenticated
                    ) {

                        if (
                            window.AUTH &&
                            typeof AUTH.logout ===
                                "function"
                        ) {

                            AUTH.logout();

                        }

                        return;

                    }


                    if (
                        window.AUTH &&
                        typeof AUTH.openLogin ===
                            "function"
                    ) {

                        closeSidebar();

                        AUTH.openLogin();

                    }

                }
            );

        }

    }


    /* ========================================================
       KEYBOARD
       ======================================================== */

    function bindKeyboard() {

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeModal();

                    closeSidebar();

                }

            }
        );

    }


    /* ========================================================
       AUTH EVENTS
       ======================================================== */

    function bindAuthEvents() {

        window.addEventListener(
            "afc:authenticated",
            function (event) {

                const detail =
                    event.detail || {};


                state.authenticated =
                    true;


                state.user =
                    detail.user ||
                    null;


                state.token =
                    detail.token ||
                    null;


                updateAuthUI();


                renderPage();


                updateNavigation();


                refreshIcons();

            }
        );


        window.addEventListener(
            "afc:loggedout",
            function () {

                state.authenticated =
                    false;


                state.user =
                    null;


                state.token =
                    null;


                updateAuthUI();


                renderPage();


                updateNavigation();


                refreshIcons();

            }
        );

    }


    /* ========================================================
       PUBLIC API
       ======================================================== */

    window.AFC = {

        state:
            state,

        navigate:
            navigateTo,

        showLoading:
            function () {

                setLoading(
                    true
                );

            },

        hideLoading:
            function () {

                setLoading(
                    false
                );

            },

        toast:
            showToast,

        modal:
            openModal,

        closeModal:
            closeModal,

        closeSidebar:
            closeSidebar,

        icons:
            refreshIcons,

        updateAuthUI:
            updateAuthUI,

        render:
            renderPage

    };


    /* ========================================================
       INITIALIZE
       ======================================================== */

    function init() {

        console.log(
            "AFC Isiwu Youth Portal V2 starting..."
        );


        bindNavigation();


        bindKeyboard();


        bindAuthEvents();


        renderPage();


        updateNavigation();


        updateAuthUI();


        refreshIcons();


        console.log(
            "Application state:",
            state
        );

    }


    /* ========================================================
       START
       ======================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }


})();
