/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL V2
 * LESSONS PAGE CONTROLLER
 * PHASE 4A.1
 * ============================================================
 */

"use strict";


const LessonsPage = (function () {


    /* ========================================================
       STATE
       ======================================================== */

    let lessons = [];

    let currentLessonId =
        null;


    let progressHandler =
        null;


    /* ========================================================
       HELPERS
       ======================================================== */

    function $(id) {

        return document.getElementById(id);

    }


    function escapeHtml(value) {

        return String(
            value ?? ""
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


    function refreshIcons() {

        if (
            window.lucide &&
            typeof window.lucide.createIcons ===
                "function"
        ) {

            try {

                window.lucide.createIcons();

            } catch (error) {

                console.warn(
                    "AFC Lessons: icon error",
                    error
                );

            }

        }

    }


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
                day:
                    "numeric",

                month:
                    "short",

                year:
                    "numeric"
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


    /* ========================================================
       FETCH ALL LESSONS
       ======================================================== */

    async function fetchLessons() {

        const response =
            await API.get(
                "getLessons"
            );


        const data =
            getResponseData(
                response
            );


        if (
            !Array.isArray(data)
        ) {

            throw new Error(
                "The backend returned an unexpected lessons format."
            );

        }


        return data;

    }


    /* ========================================================
       FETCH ONE LESSON
       ======================================================== */

    async function fetchLesson(
        lessonId
    ) {

        const cleanId =
            String(
                lessonId || ""
            ).trim();


        if (!cleanId) {

            throw new Error(
                "No lesson ID was supplied."
            );

        }


        console.log(
            "[LESSONS] Opening lesson:",
            cleanId
        );


        const response =
            await API.get(
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


        /*
         * Expected:
         *
         * {
         *   lesson: {...},
         *   sections: [...],
         *   reflection_questions: [...]
         * }
         */

        if (!data.lesson) {

            throw new Error(
                "The backend did not return the requested lesson."
            );

        }


        return data;

    }


    /* ========================================================
       LOADING SKELETON
       ======================================================== */

    function renderLoading() {

        return `

            <div class="lessons-page">

                <div class="lesson-page-heading skeleton-heading">

                    <div class="skeleton-line skeleton-small"></div>

                    <div class="skeleton-line skeleton-title"></div>

                    <div class="skeleton-line skeleton-text"></div>

                </div>


                <div class="lesson-featured-skeleton">

                    <div class="skeleton-line skeleton-badge"></div>

                    <div class="skeleton-line skeleton-feature-title"></div>

                    <div class="skeleton-line skeleton-text wide"></div>

                    <div class="skeleton-line skeleton-text medium"></div>

                    <div class="skeleton-button"></div>

                </div>


                <div class="lesson-skeleton-grid">

                    ${Array(4)
                        .fill("")
                        .map(
                            function () {

                                return `

                                    <div class="lesson-card-skeleton">

                                        <div class="skeleton-line skeleton-small"></div>

                                        <div class="skeleton-line skeleton-card-title"></div>

                                        <div class="skeleton-line skeleton-text"></div>

                                        <div class="skeleton-line skeleton-text short"></div>

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
       EMPTY
       ======================================================== */

    function renderEmpty() {

        return `

            <div class="lesson-state">

                <div class="lesson-state-icon">
                    <span data-lucide="book-open"></span>
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
       ERROR
       ======================================================== */

    function renderError(
        message
    ) {

        return `

            <div class="lesson-state lesson-state-error">

                <div class="lesson-state-icon">
                    <span data-lucide="triangle-alert"></span>
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
                    <span data-lucide="rotate-cw"></span>
                    <span>Try Again</span>
                </button>

            </div>

        `;

    }


    /* ========================================================
       LESSON CARD
       ======================================================== */

    function renderLessonCard(
        lesson
    ) {

        const lessonId =
            String(
                lesson.lesson_id || ""
            ).trim();


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

                        <span>Read lesson</span>

                        <span data-lucide="arrow-up-right"></span>

                    </button>

                </div>

            </article>

        `;

    }


    /* ========================================================
       HUB
       ======================================================== */

    function renderHub(
        lessonList
    ) {

        if (
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
            String(
                featured.lesson_id || ""
            ).trim();


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

                    <div class="lesson-featured-glow"></div>


                    <div class="lesson-featured-content">

                        <div class="lesson-featured-top">

                            <span class="lesson-current-badge">
                                <span class="status-dot"></span>
                                Current lesson
                            </span>


                            ${
                                featured.week_number
                                    ? `
                                        <span class="lesson-featured-week">
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
                                            <span data-lucide="book-open"></span>
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
                                            <span data-lucide="calendar-days"></span>
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

                            <span data-lucide="arrow-right"></span>

                        </button>

                    </div>


                    <div
                        class="lesson-featured-art"
                        aria-hidden="true"
                    >

                        <div class="lesson-art-circle circle-one"></div>

                        <div class="lesson-art-circle circle-two"></div>

                        <div class="lesson-art-book">

                            <span data-lucide="book-open"></span>

                        </div>

                    </div>

                </article>


                <section class="lessons-history">

                    <div class="lessons-section-heading">

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
                                <div class="lessons-empty-library">

                                    <span data-lucide="book-open"></span>

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

    function formatContent(
        content
    ) {

        if (!content) {

            return "";

        }


        const safe =
            escapeHtml(
                content
            );


        /*
         * Supports normal line breaks and
         * blank-line paragraph separation.
         */

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
       READER
       ======================================================== */

    function renderReader(
        data
    ) {

        const lesson =
            data.lesson;


        const sections =
            Array.isArray(
                data.sections
            )
                ? data.sections
                : [];


        const questions =
            Array.isArray(
                data.reflection_questions
            )
                ? data.reflection_questions
                : [];


        return `

            <article class="lesson-reader">


                <div class="lesson-reader-topbar">

                    <button
                        type="button"
                        id="backToLessonsButton"
                        class="lesson-back-button"
                    >

                        <span data-lucide="arrow-left"></span>

                        <span>
                            All lessons
                        </span>

                    </button>


                    <span class="lesson-reader-label">
                        Reading
                    </span>

                </div>


                <header class="lesson-reader-header">


                    <div class="lesson-reader-badges">

                        ${
                            lesson.week_number
                                ? `
                                    <span class="reader-badge">
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
                                    <span class="reader-badge muted">
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
                                <p class="lesson-reader-description">
                                    ${escapeHtml(
                                        lesson.description
                                    )}
                                </p>
                            `
                            : ""
                    }


                    <div class="lesson-reader-meta">

                        ${
                            lesson.lesson_date
                                ? `
                                    <span>
                                        <span data-lucide="calendar-days"></span>
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
                                        <span data-lucide="book-open"></span>
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


                <div class="reading-progress-track">

                    <div
                        class="reading-progress-value"
                        id="readingProgressBar"
                    ></div>

                </div>


                <div class="lesson-reader-layout">


                    <main class="lesson-reading-content">

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
                                                >

                                                    <div class="section-number">

                                                        ${
                                                            escapeHtml(
                                                                section.section_number ||
                                                                index + 1
                                                            )
                                                        }

                                                    </div>


                                                    <div class="section-main">

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


                                                        <div class="section-text">

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
                                    <div class="lesson-no-content">

                                        <span data-lucide="book-open"></span>

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


                    <aside class="lesson-reader-sidebar">

                        <div class="reader-sidebar-card">

                            <span class="reader-sidebar-icon">
                                <span data-lucide="sparkles"></span>
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
                                    <div class="reader-section-list">

                                        <span class="reader-sidebar-heading">
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


                <section class="lesson-completion-card">

                    <div class="completion-icon">

                        <span data-lucide="check"></span>

                    </div>


                    <div class="completion-copy">

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

                        <span data-lucide="arrow-right"></span>

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
                passive:
                    true
            }
        );


        progressHandler();

    }


    /* ========================================================
       HUB EVENTS
       ======================================================== */

    function bindHubEvents(
        container
    ) {

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


                            console.log(
                                "[LESSONS] Clicked lesson:",
                                lessonId
                            );


                            if (!lessonId) {

                                console.error(
                                    "AFC Lessons: lesson button has no lesson ID."
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

    function bindErrorEvents(
        container
    ) {

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

    function bindReaderEvents(
        container
    ) {

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

                    window.scrollTo(
                        {
                            top:
                                0,
                            behavior:
                                "smooth"
                        }
                    );


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
         * Sidebar section links.
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


                            const targetId =
                                link
                                    .getAttribute(
                                        "href"
                                    )
                                    .replace(
                                        "#",
                                        ""
                                    );


                            const target =
                                document.getElementById(
                                    targetId
                                );


                            if (target) {

                                target.scrollIntoView(
                                    {
                                        behavior:
                                            "smooth",
                                        block:
                                            "start"
                                    }
                                );

                            }

                        }
                    );

                }
            );


        /*
         * Give each section an ID.
         */

        container
            .querySelectorAll(
                ".lesson-reading-section"
            )
            .forEach(
                function (
                    section,
                    index
                ) {

                    section.id =
                        `lesson-section-${index + 1}`;

                }
            );


        refreshIcons();

    }


    /* ========================================================
       COMPLETION
       ======================================================== */

    function handleLessonCompletion(
        lessonId
    ) {

        console.log(
            "Lesson completed:",
            lessonId
        );


        alert(
            "Great! The reflection step will be connected in Phase 4B."
        );

    }


    /* ========================================================
       RENDER HUB
       ======================================================== */

    async function render(
        container
    ) {

        if (!container) {

            return;

        }


        removeProgressListener();


        currentLessonId =
            null;


        container.innerHTML =
            renderLoading();


        refreshIcons();


        try {

            if (window.AFC_Loader) {

                AFC_Loader.show(
                    "Loading weekly lessons..."
                );

            }


            lessons =
                await fetchLessons();


            container.innerHTML =
                renderHub(
                    lessons
                );


            bindHubEvents(
                container
            );


            if (window.AFC_Loader) {

                AFC_Loader.hide();

            }

        } catch (error) {

            console.error(
                "[LESSONS LOAD ERROR]",
                error
            );


            container.innerHTML =
                renderError(
                    error.message
                );


            bindErrorEvents(
                container
            );


            if (window.AFC_Loader) {

                AFC_Loader.hide();

            }

        }

    }


    /* ========================================================
       OPEN LESSON
       ======================================================== */

    async function openLesson(
        lessonId,
        container
    ) {

        if (!lessonId || !container) {

            return;

        }


        currentLessonId =
            String(
                lessonId
            ).trim();


        removeProgressListener();


        container.innerHTML =
            renderLoading();


        refreshIcons();


        if (window.AFC_Loader) {

            AFC_Loader.show(
                "Opening lesson..."
            );

        }


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


            if (window.AFC_Loader) {

                AFC_Loader.hide();

            }


            window.scrollTo(
                {
                    top:
                        0,
                    behavior:
                        "smooth"
                }
            );


        } catch (error) {

            console.error(
                "[LESSON OPEN ERROR]",
                error
            );


            container.innerHTML =
                renderError(
                    error.message
                );


            bindErrorEvents(
                container
            );


            if (window.AFC_Loader) {

                AFC_Loader.hide();

            }

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
            fetchLesson

    };


})();


window.LessonsPage =
    LessonsPage;
