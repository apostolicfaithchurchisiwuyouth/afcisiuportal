/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL V2
 * FILE: lessons.js
 * PURPOSE: LESSONS PAGE CONTROLLER
 * ============================================================
 *
 * PUBLIC FLOW:
 *
 * Lessons Hub
 *      ↓
 * Open Lesson
 *      ↓
 * Read Sections
 *      ↓
 * Click "I've read this lesson"
 *      ↓
 * Reflection (Phase 4B)
 *
 * IMPORTANT:
 * - Lessons are publicly readable.
 * - Global AFC_Loader is PRESERVED.
 * - Local loading skeleton is also used.
 * ============================================================
 */

"use strict";


const LessonsPage = (function () {


    /* ========================================================
       STATE
       ======================================================== */

    let lessons = [];

    let currentLessonId = null;

    let progressHandler = null;

    let currentContainer = null;


    /* ========================================================
       HELPERS
       ======================================================== */

    function $(id) {

        return document.getElementById(id);

    }


    function escapeHtml(value) {

        return String(value ?? "")

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


    function refreshIcons() {

        if (
            window.lucide &&
            typeof window.lucide.createIcons === "function"
        ) {

            try {

                window.lucide.createIcons();

            } catch (error) {

                console.warn(
                    "AFC Lessons: Unable to refresh icons.",
                    error
                );

            }

        }

    }


    function showGlobalLoader(message) {

        if (
            window.AFC_Loader &&
            typeof window.AFC_Loader.show === "function"
        ) {

            AFC_Loader.show(
                message
            );

        }

    }


    function hideGlobalLoader() {

        if (
            window.AFC_Loader &&
            typeof window.AFC_Loader.hide === "function"
        ) {

            AFC_Loader.hide();

        }

    }


    function getResponseData(response) {

        if (!response) {

            return null;

        }


        /*
         * Standard API response:
         *
         * {
         *   success: true,
         *   data: ...
         * }
         */

        if (
            response.data !== undefined
        ) {

            return response.data;

        }


        return response;

    }


    function formatDate(value) {

        if (!value) {

            return "";

        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return String(value);

        }


        return date.toLocaleDateString(
            "en-NG",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    }


    function sortLessons(list) {

        return [
            ...list
        ].sort(
            function (a, b) {

                const aDate =
                    new Date(
                        a.lesson_date ||
                        a.published_at ||
                        0
                    );


                const bDate =
                    new Date(
                        b.lesson_date ||
                        b.published_at ||
                        0
                    );


                return (
                    bDate -
                    aDate
                );

            }
        );

    }


    function getLessonId(lesson) {

        return String(
            lesson?.lesson_id || ""
        ).trim();

    }


    /* ========================================================
       FETCH ALL LESSONS
       ======================================================== */

    async function fetchLessons() {

        if (
            !window.API ||
            typeof window.API.get !== "function"
        ) {

            throw new Error(
                "The API connection is not available."
            );

        }


        const response =
            await window.API.get(
                "getLessons"
            );


        const data =
            getResponseData(
                response
            );


        if (
            !Array.isArray(data)
        ) {

            console.error(
                "[LESSONS] Unexpected lessons response:",
                response
            );


            throw new Error(
                "The backend returned an unexpected lessons format."
            );

        }


        return data;

    }


    /* ========================================================
       FETCH ONE LESSON
       ======================================================== */

    async function fetchLesson(lessonId) {

        const cleanId =
            String(
                lessonId || ""
            ).trim();


        if (!cleanId) {

            throw new Error(
                "No lesson ID was supplied."
            );

        }


        if (
            !window.API ||
            typeof window.API.get !== "function"
        ) {

            throw new Error(
                "The API connection is not available."
            );

        }


        console.log(
            "[LESSONS] Opening lesson:",
            cleanId
        );


        const response =
            await window.API.get(
                "getLesson",
                {
                    lesson_id:
                        cleanId
                }
            );


        const data =
            getResponseData(
                response
            );


        if (!data) {

            throw new Error(
                "The backend returned no lesson data."
            );

        }


        if (!data.lesson) {

            console.error(
                "[LESSONS] Invalid lesson response:",
                response
            );


            throw new Error(
                "The backend did not return the requested lesson."
            );

        }


        /*
         * Ensure predictable structure.
         */

        if (
            !Array.isArray(
                data.sections
            )
        ) {

            data.sections = [];

        }


        if (
            !Array.isArray(
                data.reflection_questions
            )
        ) {

            data.reflection_questions = [];

        }


        return data;

    }


    /* ========================================================
       LOADING SKELETON
       ======================================================== */

    function renderLoading() {

        return `

            <div class="lessons-page lessons-loading-state">

                <div class="lesson-page-heading skeleton-heading">

                    <div
                        class="skeleton-line skeleton-small"
                    ></div>

                    <div
                        class="skeleton-line skeleton-title"
                    ></div>

                    <div
                        class="skeleton-line skeleton-text"
                    ></div>

                </div>


                <div class="lesson-featured-skeleton">

                    <div
                        class="skeleton-line skeleton-badge"
                    ></div>

                    <div
                        class="skeleton-line skeleton-feature-title"
                    ></div>

                    <div
                        class="skeleton-line skeleton-text wide"
                    ></div>

                    <div
                        class="skeleton-line skeleton-text medium"
                    ></div>

                    <div
                        class="skeleton-button"
                    ></div>

                </div>


                <div class="lesson-skeleton-grid">

                    ${
                        Array(4)
                            .fill("")
                            .map(
                                function () {

                                    return `

                                        <div
                                            class="lesson-card-skeleton"
                                        >

                                            <div
                                                class="skeleton-line skeleton-small"
                                            ></div>

                                            <div
                                                class="skeleton-line skeleton-card-title"
                                            ></div>

                                            <div
                                                class="skeleton-line skeleton-text"
                                            ></div>

                                            <div
                                                class="skeleton-line skeleton-text short"
                                            ></div>

                                        </div>

                                    `;

                                }
                            )
                            .join("")
                    }

                </div>

            </div>

        `;

    }


    /* ========================================================
       EMPTY STATE
       ======================================================== */

    function renderEmpty() {

        return `

            <div class="lesson-state">

                <div class="lesson-state-icon">

                    <span
                        data-lucide="book-open"
                    ></span>

                </div>


                <h2>
                    No lessons yet
                </h2>


                <p>
                    Published lessons will appear here
                    when they become available.
                </p>

            </div>

        `;

    }


    /* ========================================================
       ERROR STATE
       ======================================================== */

    function renderError(message) {

        return `

            <div
                class="lesson-state lesson-state-error"
            >

                <div class="lesson-state-icon">

                    <span
                        data-lucide="triangle-alert"
                    ></span>

                </div>


                <h2>
                    Unable to load lessons
                </h2>


                <p>
                    ${escapeHtml(
                        message ||
                        "Something went wrong while loading the lessons."
                    )}
                </p>


                <button
                    type="button"
                    class="lesson-retry-button"
                    id="retryLessonsButton"
                >

                    <span
                        data-lucide="rotate-cw"
                    ></span>

                    <span>
                        Try Again
                    </span>

                </button>

            </div>

        `;

    }


    /* ========================================================
       LESSON CARD
       ======================================================== */

    function renderLessonCard(lesson) {

        const lessonId =
            getLessonId(
                lesson
            );


        return `

            <article class="lesson-card">

                <div class="lesson-card-top">

                    <span class="lesson-card-week">

                        ${
                            lesson.week_number
                                ? `Week ${escapeHtml(
                                    lesson.week_number
                                )}`
                                : "Weekly Lesson"
                        }

                    </span>


                    <span class="lesson-card-type">

                        ${escapeHtml(
                            lesson.lesson_type ||
                            "Youth Lesson"
                        )}

                    </span>

                </div>


                <div class="lesson-card-body">

                    <h3>

                        ${escapeHtml(
                            lesson.title ||
                            "Untitled Lesson"
                        )}

                    </h3>


                    <p>

                        ${escapeHtml(
                            lesson.description ||
                            "Open this lesson to begin reading."
                        )}

                    </p>

                </div>


                <div class="lesson-card-footer">

                    <span class="lesson-card-date">

                        ${escapeHtml(
                            formatDate(
                                lesson.lesson_date
                            )
                        )}

                    </span>


                    <button
                        type="button"
                        class="lesson-card-button"
                        data-open-lesson="${escapeHtml(
                            lessonId
                        )}"
                    >

                        <span>
                            Read lesson
                        </span>

                        <span
                            data-lucide="arrow-up-right"
                        ></span>

                    </button>

                </div>

            </article>

        `;

    }


    /* ========================================================
       LESSON HUB
       ======================================================== */

    function renderHub(lessonList) {

        if (
            !Array.isArray(
                lessonList
            ) ||
            !lessonList.length
        ) {

            return renderEmpty();

        }


        const sorted =
            sortLessons(
                lessonList
            );


        const featured =
            sorted[0];


        const previous =
            sorted.slice(1);


        const featuredId =
            getLessonId(
                featured
            );


        return `

            <div class="lessons-page">


                <header class="lesson-page-heading">

                    <div>

                        <span class="eyebrow">
                            Weekly Lessons
                        </span>


                        <h1>
                            Grow in God's Word.
                        </h1>


                        <p>
                            Read, reflect and keep growing
                            in your walk with Christ.
                        </p>

                    </div>

                </header>


                <article class="lesson-featured">

                    <div
                        class="lesson-featured-glow"
                    ></div>


                    <div class="lesson-featured-content">


                        <div class="lesson-featured-top">

                            <span
                                class="lesson-current-badge"
                            >

                                <span
                                    class="status-dot"
                                ></span>

                                Current lesson

                            </span>


                            ${
                                featured.week_number
                                    ? `

                                        <span
                                            class="lesson-featured-week"
                                        >

                                            Week ${escapeHtml(
                                                featured.week_number
                                            )}

                                        </span>

                                    `
                                    : ""
                            }

                        </div>


                        <h2>

                            ${escapeHtml(
                                featured.title ||
                                "Weekly Lesson"
                            )}

                        </h2>


                        <p>

                            ${escapeHtml(
                                featured.description ||
                                "Start reading this week's lesson."
                            )}

                        </p>


                        <div class="lesson-featured-meta">


                            ${
                                featured.lesson_type
                                    ? `

                                        <span>

                                            <span
                                                data-lucide="book-open"
                                            ></span>

                                            ${escapeHtml(
                                                featured.lesson_type
                                            )}

                                        </span>

                                    `
                                    : ""
                            }


                            ${
                                featured.lesson_date
                                    ? `

                                        <span>

                                            <span
                                                data-lucide="calendar-days"
                                            ></span>

                                            ${escapeHtml(
                                                formatDate(
                                                    featured.lesson_date
                                                )
                                            )}

                                        </span>

                                    `
                                    : ""
                            }

                        </div>


                        <button
                            type="button"
                            class="lesson-start-button"
                            data-open-lesson="${escapeHtml(
                                featuredId
                            )}"
                        >

                            <span>
                                Start reading
                            </span>


                            <span
                                data-lucide="arrow-right"
                            ></span>

                        </button>

                    </div>


                    <div
                        class="lesson-featured-art"
                        aria-hidden="true"
                    >

                        <div
                            class="lesson-art-circle circle-one"
                        ></div>

                        <div
                            class="lesson-art-circle circle-two"
                        ></div>


                        <div class="lesson-art-book">

                            <span
                                data-lucide="book-open"
                            ></span>

                        </div>

                    </div>

                </article>


                <section class="lessons-history">


                    <div
                        class="lessons-section-heading"
                    >

                        <div>

                            <span class="eyebrow">
                                Library
                            </span>


                            <h2>
                                Previous lessons
                            </h2>

                        </div>


                        ${
                            previous.length
                                ? `

                                    <span class="lesson-count">

                                        ${previous.length}

                                        ${
                                            previous.length === 1
                                                ? "lesson"
                                                : "lessons"
                                        }

                                    </span>

                                `
                                : ""
                        }

                    </div>


                    ${
                        previous.length
                            ? `

                                <div class="lessons-grid">

                                    ${previous
                                        .map(
                                            renderLessonCard
                                        )
                                        .join("")
                                    }

                                </div>

                            `
                            : `

                                <div
                                    class="lessons-empty-library"
                                >

                                    <span
                                        data-lucide="book-open"
                                    ></span>

                                    <span>
                                        Previous lessons will appear here.
                                    </span>

                                </div>

                            `
                    }

                </section>

            </div>

        `;

    }


    /* ========================================================
       CONTENT FORMATTER
       ======================================================== */

    function formatContent(content) {

        if (!content) {

            return "";

        }


        const safe =
            escapeHtml(
                content
            );


        return safe

            .split(
                /\n\s*\n/
            )

            .map(
                function (paragraph) {

                    const cleaned =
                        paragraph
                            .trim()
                            .replace(
                                /\n/g,
                                "<br>"
                            );


                    if (!cleaned) {

                        return "";

                    }


                    return `

                        <p>
                            ${cleaned}
                        </p>

                    `;

                }
            )

            .join("");

    }


    /* ========================================================
       LESSON READER
       ======================================================== */

    function renderReader(data) {

        const lesson =
            data.lesson || {};


        const sections =
            Array.isArray(
                data.sections
            )
                ? data.sections
                : [];


        return `

            <article class="lesson-reader">


                <div
                    class="lesson-reader-topbar"
                >

                    <button
                        type="button"
                        id="backToLessonsButton"
                        class="lesson-back-button"
                    >

                        <span
                            data-lucide="arrow-left"
                        ></span>

                        <span>
                            All lessons
                        </span>

                    </button>


                    <span
                        class="lesson-reader-label"
                    >
                        Reading
                    </span>

                </div>


                <header
                    class="lesson-reader-header"
                >


                    <div
                        class="lesson-reader-badges"
                    >

                        ${
                            lesson.week_number
                                ? `

                                    <span
                                        class="reader-badge"
                                    >

                                        Week ${escapeHtml(
                                            lesson.week_number
                                        )}

                                    </span>

                                `
                                : ""
                        }


                        ${
                            lesson.lesson_type
                                ? `

                                    <span
                                        class="reader-badge muted"
                                    >

                                        ${escapeHtml(
                                            lesson.lesson_type
                                        )}

                                    </span>

                                `
                                : ""
                        }

                    </div>


                    <h1>

                        ${escapeHtml(
                            lesson.title ||
                            "Weekly Lesson"
                        )}

                    </h1>


                    ${
                        lesson.description
                            ? `

                                <p
                                    class="lesson-reader-description"
                                >

                                    ${escapeHtml(
                                        lesson.description
                                    )}

                                </p>

                            `
                            : ""
                    }


                    <div
                        class="lesson-reader-meta"
                    >

                        ${
                            lesson.lesson_date
                                ? `

                                    <span>

                                        <span
                                            data-lucide="calendar-days"
                                        ></span>

                                        ${escapeHtml(
                                            formatDate(
                                                lesson.lesson_date
                                            )
                                        )}

                                    </span>

                                `
                                : ""
                        }


                        ${
                            sections.length
                                ? `

                                    <span>

                                        <span
                                            data-lucide="book-open"
                                        ></span>

                                        ${sections.length}

                                        ${
                                            sections.length === 1
                                                ? "section"
                                                : "sections"
                                        }

                                    </span>

                                `
                                : ""
                        }

                    </div>

                </header>


                <!-- Reading Progress -->

                <div
                    class="reading-progress-track"
                >

                    <div
                        class="reading-progress-value"
                        id="readingProgressBar"
                    ></div>

                </div>


                <div
                    class="lesson-reader-layout"
                >


                    <main
                        class="lesson-reading-content"
                    >

                        ${
                            sections.length
                                ? sections
                                    .map(
                                        function (
                                            section,
                                            index
                                        ) {

                                            return `

                                                <section
                                                    class="lesson-reading-section"
                                                    id="lesson-section-${index + 1}"
                                                >

                                                    <div
                                                        class="section-number"
                                                    >

                                                        ${escapeHtml(
                                                            section.section_number ||
                                                            index + 1
                                                        )}

                                                    </div>


                                                    <div
                                                        class="section-main"
                                                    >

                                                        ${
                                                            section.title
                                                                ? `

                                                                    <h2>

                                                                        ${escapeHtml(
                                                                            section.title
                                                                        )}

                                                                    </h2>

                                                                `
                                                                : ""
                                                        }


                                                        <div
                                                            class="section-text"
                                                        >

                                                            ${formatContent(
                                                                section.content
                                                            )}

                                                        </div>

                                                    </div>

                                                </section>

                                            `;

                                        }
                                    )
                                    .join("")

                                : `

                                    <div
                                        class="lesson-no-content"
                                    >

                                        <span
                                            data-lucide="book-open"
                                        ></span>


                                        <h2>
                                            Lesson content is coming soon
                                        </h2>


                                        <p>
                                            This lesson has been published,
                                            but its reading sections are
                                            not available yet.
                                        </p>

                                    </div>

                                `
                        }

                    </main>


                    <aside
                        class="lesson-reader-sidebar"
                    >


                        <div
                            class="reader-sidebar-card"
                        >

                            <span
                                class="reader-sidebar-icon"
                            >

                                <span
                                    data-lucide="sparkles"
                                ></span>

                            </span>


                            <h3>
                                Read with purpose
                            </h3>


                            <p>
                                Take your time. Think about
                                what God is teaching you and
                                how you can apply it.
                            </p>

                        </div>


                        ${
                            sections.length
                                ? `

                                    <div
                                        class="reader-section-list"
                                    >

                                        <span
                                            class="reader-sidebar-heading"
                                        >
                                            In this lesson
                                        </span>


                                        ${sections
                                            .map(
                                                function (
                                                    section,
                                                    index
                                                ) {

                                                    return `

                                                        <a
                                                            href="#lesson-section-${index + 1}"
                                                            class="reader-section-link"
                                                        >

                                                            <span>

                                                                ${index + 1}

                                                            </span>


                                                            <strong>

                                                                ${escapeHtml(
                                                                    section.title ||
                                                                    "Section " +
                                                                    (index + 1)
                                                                )}

                                                            </strong>

                                                        </a>

                                                    `;

                                                }
                                            )
                                            .join("")
                                        }

                                    </div>

                                `
                                : ""
                        }

                    </aside>

                </div>


                <!-- Completion Card -->

                <section
                    class="lesson-completion-card"
                >

                    <div
                        class="completion-icon"
                    >

                        <span
                            data-lucide="check"
                        ></span>

                    </div>


                    <div
                        class="completion-copy"
                    >

                        <span class="eyebrow">
                            Finished reading?
                        </span>


                        <h2>
                            Take a moment to reflect.
                        </h2>


                        <p>
                            Once you've carefully read the lesson,
                            continue to the reflection step.
                        </p>

                    </div>


                    <button
                        type="button"
                        id="lessonReadCompleteButton"
                        class="lesson-complete-button"
                    >

                        <span>
                            I've read this lesson
                        </span>


                        <span
                            data-lucide="arrow-right"
                        ></span>

                    </button>

                </section>


            </article>

        `;

    }


    /* ========================================================
       READING PROGRESS
       ======================================================== */

    function removeProgressListener() {

        if (
            progressHandler
        ) {

            window.removeEventListener(
                "scroll",
                progressHandler
            );


            progressHandler =
                null;

        }

    }


    function initialiseReadingProgress() {

        removeProgressListener();


        const bar =
            $("readingProgressBar");


        if (!bar) {

            return;

        }


        progressHandler =
            function () {

                const scrollTop =
                    window.scrollY || 0;


                const documentHeight =
                    document.documentElement
                        .scrollHeight;


                const viewport =
                    window.innerHeight;


                const available =
                    documentHeight -
                    viewport;


                let progress =
                    available > 0
                        ? (
                            scrollTop /
                            available
                        ) * 100
                        : 0;


                progress =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            progress
                        )
                    );


                bar.style.width =
                    `${progress}%`;

            };


        window.addEventListener(
            "scroll",
            progressHandler,
            {
                passive: true
            }
        );


        progressHandler();

    }


    /* ========================================================
       HUB EVENTS
       ======================================================== */

    function bindHubEvents(container) {

        if (!container) {

            return;

        }


        container
            .querySelectorAll(
                "[data-open-lesson]"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const lessonId =
                                String(
                                    button.getAttribute(
                                        "data-open-lesson"
                                    ) || ""
                                ).trim();


                            if (!lessonId) {

                                console.error(
                                    "[LESSONS] No lesson ID found."
                                );

                                return;

                            }


                            openLesson(
                                lessonId,
                                container
                            );

                        }
                    );

                }
            );


        refreshIcons();

    }


    /* ========================================================
       ERROR EVENTS
       ======================================================== */

    function bindErrorEvents(container) {

        if (!container) {

            return;

        }


        const retry =
            container.querySelector(
                "#retryLessonsButton"
            );


        if (retry) {

            retry.addEventListener(
                "click",
                function () {

                    render(
                        container
                    );

                }
            );

        }


        refreshIcons();

    }


    /* ========================================================
       READER EVENTS
       ======================================================== */

    function bindReaderEvents(container) {

        if (!container) {

            return;

        }


        const back =
            container.querySelector(
                "#backToLessonsButton"
            );


        const complete =
            container.querySelector(
                "#lessonReadCompleteButton"
            );


        if (back) {

            back.addEventListener(
                "click",
                function () {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });


                    render(
                        container
                    );

                }
            );

        }


        if (complete) {

            complete.addEventListener(
                "click",
                function () {

                    handleLessonCompletion(
                        currentLessonId
                    );

                }
            );

        }


        /*
         * Sidebar navigation.
         */

        container
            .querySelectorAll(
                ".reader-section-link"
            )
            .forEach(
                function (link) {

                    link.addEventListener(
                        "click",
                        function (event) {

                            event.preventDefault();


                            const href =
                                link.getAttribute(
                                    "href"
                                ) || "";


                            const targetId =
                                href.replace(
                                    "#",
                                    ""
                                );


                            const target =
                                document.getElementById(
                                    targetId
                                );


                            if (target) {

                                target.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start"
                                });

                            }

                        }
                    );

                }
            );


        refreshIcons();

    }


    /* ========================================================
       LESSON COMPLETION
       ======================================================== */

    function handleLessonCompletion(lessonId) {

        console.log(
            "[LESSONS] Lesson completed:",
            lessonId
        );


        /*
         * Phase 4B will replace this with:
         *
         * 1. Check login status
         * 2. Redirect/login if necessary
         * 3. Load reflection questions
         * 4. Submit reflection
         * 5. Unlock quiz
         */

        alert(
            "Great! The reflection step will be connected in Phase 4B."
        );

    }


    /* ========================================================
       RENDER LESSON HUB
       ======================================================== */

    async function render(container) {

        if (!container) {

            return;

        }


        currentContainer =
            container;


        removeProgressListener();


        currentLessonId =
            null;


        /*
         * Show local skeleton immediately.
         */

        container.innerHTML =
            renderLoading();


        refreshIcons();


        /*
         * PRESERVED GLOBAL LOADER.
         */

        showGlobalLoader(
            "Loading weekly lessons..."
        );


        try {

            lessons =
                await fetchLessons();


            container.innerHTML =
                renderHub(
                    lessons
                );


            bindHubEvents(
                container
            );


        } catch (error) {

            console.error(
                "[LESSONS LOAD ERROR]",
                error
            );


            container.innerHTML =
                renderError(
                    error?.message ||
                    "Unable to load lessons."
                );


            bindErrorEvents(
                container
            );


        } finally {

            /*
             * Always hide the global loader.
             */

            hideGlobalLoader();

        }

    }


    /* ========================================================
       OPEN LESSON
       ======================================================== */

    async function openLesson(
        lessonId,
        container
    ) {

        if (
            !lessonId ||
            !container
        ) {

            return;

        }


        currentContainer =
            container;


        currentLessonId =
            String(
                lessonId
            ).trim();


        removeProgressListener();


        /*
         * Show local skeleton.
         */

        container.innerHTML =
            renderLoading();


        refreshIcons();


        /*
         * PRESERVED GLOBAL LOADER.
         */

        showGlobalLoader(
            "Opening lesson..."
        );


        try {

            const data =
                await fetchLesson(
                    currentLessonId
                );


            console.log(
                "[LESSONS] Lesson response:",
                data
            );


            container.innerHTML =
                renderReader(
                    data
                );


            bindReaderEvents(
                container
            );


            initialiseReadingProgress();


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


        } catch (error) {

            console.error(
                "[LESSON OPEN ERROR]",
                error
            );


            container.innerHTML =
                renderError(
                    error?.message ||
                    "Unable to load this lesson."
                );


            bindErrorEvents(
                container
            );


        } finally {

            /*
             * Always hide the global loader,
             * whether the request succeeds or fails.
             */

            hideGlobalLoader();

        }

    }


    /* ========================================================
       PUBLIC API
       ======================================================== */

    return {

        render:
            render,

        openLesson:
            openLesson,

        fetchLessons:
            fetchLessons,

        fetchLesson:
            fetchLesson,

        reload:
            function () {

                if (
                    currentContainer
                ) {

                    render(
                        currentContainer
                    );

                }

            }

    };


})();


/* ============================================================
   GLOBAL EXPORT
   ============================================================ */

window.LessonsPage =
    LessonsPage;


console.log(
    "AFC Isiu Youth Portal Lessons controller loaded."
);
