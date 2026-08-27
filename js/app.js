/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   APP.JS
   PHASE A — APPLICATION FOUNDATION
   ============================================================ */

(function () {

    "use strict";


    /* ========================================================
       APPLICATION STATE
       ======================================================== */

    const state = {

        authenticated: false,

        currentPage: "home",

        currentLesson: null,

        currentQuiz: null,

        lessons: [],

        notifications: [],

        settings: {},

        token: null,

        user: null,

        loading: false

    };


    /* ========================================================
       DOM HELPER
       ======================================================== */

    function $(id) {

        return document.getElementById(id);

    }


    /* ========================================================
       LUCIDE ICON SYSTEM
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
       SHOW / HIDE
       ======================================================== */

    function show(element) {

        if (!element) return;

        element.classList.remove("hidden");

    }


    function hide(element) {

        if (!element) return;

        element.classList.add("hidden");

    }


    /* ========================================================
       LOADING
       ======================================================== */

    function setLoading(isLoading) {

        state.loading = Boolean(isLoading);

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
            document.createElement("div");


        toast.className =
            "toast";


        toast.dataset.type =
            type;


        toast.textContent =
            message;


        container.appendChild(
            toast
        );


        setTimeout(function () {

            toast.style.opacity =
                "0";

            toast.style.transform =
                "translateY(10px)";


            setTimeout(function () {

                toast.remove();

            }, 250);

        }, 3000);

    }


    /* ========================================================
       MODAL SYSTEM
       ======================================================== */

    function openModal(options = {}) {

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
                >

                    <div class="modal-header">

                        <h2>
                            ${escapeHtml(title)}
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

    }


    function closeModal() {

        const root =
            $("modal-root");

        if (!root) return;

        root.innerHTML = "";

    }


    /* ========================================================
       ESCAPE HTML
       ======================================================== */

    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* ========================================================
       NAVIGATION
       ======================================================== */

    function navigateTo(page) {

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
            .forEach(function (item) {

                const page =
                    item.dataset.page;


                item.classList.toggle(
                    "active",
                    page ===
                    state.currentPage
                );

            });

    }


    /* ========================================================
       SIDEBAR
       ======================================================== */

    function openSidebar() {

        const sidebar =
            $("sidebar");

        const overlay =
            $("sidebar-overlay");


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

    }


    function closeSidebar() {

        const sidebar =
            $("sidebar");

        const overlay =
            $("sidebar-overlay");


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
                        Welcome to
                    </p>

                    <h1 style="
                        font-size: clamp(
                            1.6rem,
                            5vw,
                            2.2rem
                        );
                        color: var(--brand-dark);
                    ">
                        AFC Isiwu Youth Portal
                    </h1>

                    <p style="
                        margin-top: 8px;
                        color: var(--ink-soft);
                        font-size: 14px;
                    ">
                        Your place to learn,
                        connect and grow.
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
                        data-lucide="user-round"
                        style="
                            width: 38px;
                            height: 38px;
                            color: var(--brand);
                            margin-bottom: 12px;
                        "
                    ></i>

                    <h3>
                        Your profile
                    </h3>

                    <p style="
                        margin-top: 6px;
                        color: var(--ink-muted);
                        font-size: 13px;
                    ">
                        Your Google Sheets profile
                        will appear here.
                    </p>

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
       PAGE BUTTON BINDING
       ======================================================== */

    function bindPageButtons() {

        document
            .querySelectorAll(
                "[data-page]"
            )
            .forEach(function (button) {

                button.onclick =
                    function () {

                        navigateTo(
                            button.dataset.page
                        );

                    };

            });

    }


    /* ========================================================
       GLOBAL NAVIGATION EVENTS
       ======================================================== */

    function bindNavigation() {

        document
            .querySelectorAll(
                ".nav-item, .bottom-nav-item"
            )
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        navigateTo(
                            button.dataset.page
                        );

                    }
                );

            });


        const menuButton =
            $("menu-button");


        if (menuButton) {

            menuButton.addEventListener(
                "click",
                openSidebar
            );

        }


        const closeButton =
            $("close-sidebar");


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeSidebar
            );

        }


        const overlay =
            $("sidebar-overlay");


        if (overlay) {

            overlay.addEventListener(
                "click",
                closeSidebar
            );

        }


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
                                    onclick="
                                        window.AFC.navigate('lessons');
                                        window.AFC.closeModal();
                                    "
                                >

                                    <i data-lucide="book-open"></i>

                                    <span>
                                        Weekly Lessons
                                    </span>

                                </button>


                                <button
                                    type="button"
                                    class="sidebar-action"
                                    onclick="
                                        window.AFC.navigate('gallery');
                                        window.AFC.closeModal();
                                    "
                                >

                                    <i data-lucide="images"></i>

                                    <span>
                                        Gallery
                                    </span>

                                </button>


                                <button
                                    type="button"
                                    class="sidebar-action"
                                    onclick="
                                        window.AFC.navigate('profile');
                                        window.AFC.closeModal();
                                    "
                                >

                                    <i data-lucide="user-round"></i>

                                    <span>
                                        Profile
                                    </span>

                                </button>

                            </div>

                        `

                    });

                }
            );

        }


        const notificationButton =
            $("notification-button");


        if (notificationButton) {

            notificationButton.addEventListener(
                "click",
                function () {

                    showToast(
                        "Notifications will be available soon."
                    );

                }
            );

        }


        const sidebarLogin =
            $("sidebar-login-button");


        if (sidebarLogin) {

            sidebarLogin.addEventListener(
                "click",
                function () {

                    showToast(
                        "Login will be connected in Phase B."
                    );

                }
            );

        }

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

                setLoading(true);

            },

        hideLoading:

            function () {

                setLoading(false);

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

            refreshIcons

    };


    /* ========================================================
       INITIALIZE APPLICATION
       ======================================================== */

    function init() {

        console.log(
            "AFC Isiwu Youth Portal V2 starting..."
        );


        bindNavigation();


        renderPage();


        updateNavigation();


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


document.addEventListener(
    "afc:authenticated",
    function (event) {

        console.log(
            "User authenticated:",
            event.detail.user
        );


        /*
         * Re-render the application.
         *
         * Use your existing render/init
         * function here.
         */

        if (
            typeof renderApp ===
            "function"
        ) {

            renderApp();

        }

    }
);

document.addEventListener(
    "afc:loggedout",
    function () {

        console.log(
            "User logged out."
        );


        if (
            typeof renderApp ===
            "function"
        ) {

            renderApp();

        }

    }
);
