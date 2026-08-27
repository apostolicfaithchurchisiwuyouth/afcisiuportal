/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   FILE: router.js
   PURPOSE: Frontend page routing
   ============================================================ */

(function () {

    "use strict";


    const pages = [

        "home",

        "lessons",

        "quiz",

        "gallery",

        "profile"

    ];


    window.navigateTo =
        function (page) {

            if (
                !pages.includes(page)
            ) {

                page = "home";

            }


            setAppState({

                currentPage:
                    page

            });


            renderPage();

        };


    window.renderPage =
        function () {

            const app =
                document.getElementById(
                    "app"
                );


            if (!app) {

                return;

            }


            const page =
                AppState.currentPage;


            if (page === "home") {

                renderHomePage();

                return;

            }


            renderPlaceholderPage(
                page
            );

        };


    function renderHomePage() {

        app.innerHTML = `

            <div class="portal-shell">

                ${renderSidebar()}

                <main class="portal-main">

                    ${renderHeader()}

                    <section class="portal-content">

                        <div class="mb-8">

                            <p
                                class="
                                    text-sm
                                    text-white/45
                                    mb-2
                                "
                            >
                                Welcome to
                            </p>

                            <h1
                                class="
                                    text-3xl
                                    md:text-5xl
                                    font-display
                                    font-semibold
                                    tracking-tight
                                "
                            >
                                AFC Isiwu
                                <span class="text-white/50">
                                    Youth Portal
                                </span>
                            </h1>

                            <p
                                class="
                                    mt-3
                                    max-w-xl
                                    text-white/55
                                    text-sm
                                    md:text-base
                                "
                            >
                                Your digital space for
                                lessons, quizzes,
                                growth and community.
                            </p>

                        </div>


                        <div
                            class="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                lg:grid-cols-4
                                gap-4
                            "
                        >

                            ${homeCard(
                                "Lessons",
                                "Read this week's lesson",
                                "lessons"
                            )}

                            ${homeCard(
                                "Quiz",
                                "Test what you've learned",
                                "quiz"
                            )}

                            ${homeCard(
                                "Gallery",
                                "See what's happening",
                                "gallery"
                            )}

                            ${homeCard(
                                "Profile",
                                "Manage your profile",
                                "profile"
                            )}

                        </div>

                    </section>


                    ${renderMobileNav()}

                </main>

            </div>

        `;


        bindNavigation();

    }


    function renderPlaceholderPage(page) {

        app.innerHTML = `

            <div class="portal-shell">

                ${renderSidebar()}

                <main class="portal-main">

                    ${renderHeader()}

                    <section class="portal-content">

                        <div class="portal-card p-8">

                            <p
                                class="
                                    text-xs
                                    uppercase
                                    tracking-widest
                                    text-white/35
                                    mb-3
                                "
                            >
                                Page
                            </p>

                            <h1
                                class="
                                    text-3xl
                                    font-display
                                    font-semibold
                                "
                            >
                                ${escapeHtml(
                                    page
                                )}
                            </h1>

                            <p
                                class="
                                    mt-3
                                    text-white/55
                                "
                            >
                                This section is being
                                built in the next phase.
                            </p>

                        </div>

                    </section>

                    ${renderMobileNav()}

                </main>

            </div>

        `;


        bindNavigation();

    }


    function renderHeader() {

        return `

            <header
                class="
                    h-16
                    px-5
                    md:px-8
                    flex
                    items-center
                    justify-between
                    border-b
                    border-white/5
                "
            >

                <div class="flex items-center gap-3">

                    <div
                        class="
                            w-9
                            h-9
                            rounded-xl
                            bg-white/10
                            flex
                            items-center
                            justify-center
                            font-display
                            font-bold
                        "
                    >
                        A
                    </div>

                    <div>

                        <p
                            class="
                                text-sm
                                font-semibold
                            "
                        >
                            AFC Isiwu Youth
                        </p>

                    </div>

                </div>


                <button
                    class="
                        w-10
                        h-10
                        rounded-xl
                        bg-white/5
                        border
                        border-white/10
                    "
                    onclick="navigateTo('profile')"
                    aria-label="Profile"
                >

                    <span class="text-sm">
                        👤
                    </span>

                </button>

            </header>

        `;

    }


    function renderSidebar() {

        return `

            <aside class="desktop-sidebar p-5">

                <div class="mb-8">

                    <div
                        class="
                            w-11
                            h-11
                            rounded-2xl
                            bg-portal-600
                            flex
                            items-center
                            justify-center
                            font-display
                            font-bold
                            mb-3
                        "
                    >
                        A
                    </div>

                    <h2
                        class="
                            font-display
                            font-semibold
                        "
                    >
                        AFC Isiwu
                    </h2>

                    <p
                        class="
                            text-xs
                            text-white/40
                        "
                    >
                        Youth Portal
                    </p>

                </div>


                <nav class="space-y-2">

                    ${navItem(
                        "Home",
                        "home"
                    )}

                    ${navItem(
                        "Lessons",
                        "lessons"
                    )}

                    ${navItem(
                        "Quiz",
                        "quiz"
                    )}

                    ${navItem(
                        "Gallery",
                        "gallery"
                    )}

                    ${navItem(
                        "Profile",
                        "profile"
                    )}

                </nav>

            </aside>

        `;

    }


    function navItem(label, page) {

        return `

            <button
                data-page="${page}"
                class="
                    w-full
                    flex
                    items-center
                    px-4
                    py-3
                    rounded-xl
                    text-left
                    text-sm
                    text-white/60
                    hover:text-white
                    hover:bg-white/5
                    transition
                "
            >

                ${label}

            </button>

        `;

    }


    function renderMobileNav() {

        return `

            <nav
                class="
                    mobile-nav
                    flex
                    items-center
                    justify-around
                    px-2
                "
            >

                ${mobileNavItem(
                    "Home",
                    "home"
                )}

                ${mobileNavItem(
                    "Lessons",
                    "lessons"
                )}

                ${mobileNavItem(
                    "Quiz",
                    "quiz"
                )}

                ${mobileNavItem(
                    "Gallery",
                    "gallery"
                )}

                ${mobileNavItem(
                    "Profile",
                    "profile"
                )}

            </nav>

        `;

    }


    function mobileNavItem(
        label,
        page
    ) {

        return `

            <button
                data-page="${page}"
                class="
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-1
                    text-[11px]
                    text-white/50
                "
            >

                <span>
                    ${label}
                </span>

            </button>

        `;

    }


    function homeCard(
        title,
        description,
        page
    ) {

        return `

            <button
                data-page="${page}"
                class="
                    portal-card
                    p-5
                    text-left
                    hover:bg-white/[0.07]
                    transition
                "
            >

                <h2
                    class="
                        font-display
                        font-semibold
                        text-lg
                    "
                >
                    ${title}
                </h2>

                <p
                    class="
                        mt-2
                        text-sm
                        text-white/45
                    "
                >
                    ${description}
                </p>

                <div
                    class="
                        mt-5
                        text-xs
                        text-white/30
                    "
                >
                    Open →
                </div>

            </button>

        `;

    }


    function bindNavigation() {

        $$("[data-page]")
            .forEach(function (element) {

                element.addEventListener(
                    "click",
                    function () {

                        navigateTo(
                            element.dataset.page
                        );

                    }
                );

            });

    }


})();
