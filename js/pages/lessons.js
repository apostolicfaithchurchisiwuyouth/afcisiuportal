/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   FILE: lessons.js
   PURPOSE: LESSONS PAGE CONTROLLER
   PHASE 4A.1 — COMPLETE CORRECTED VERSION
   ============================================================ */

/*
 * PUBLIC FLOW
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
 * IMPORTANT
 *
 * - Lessons are publicly readable.
 * - Authentication is NOT required to read lessons.
 * - Completion / reflection may require authentication.
 * - Backend:
 *
 *      getLessons
 *      getLesson
 *
 * - getLesson returns:
 *
 *      {
 *          lesson,
 *          sections,
 *          reflection_questions
 *      }
 *
 * ============================================================ */


(function () {

    "use strict";


    /* ========================================================
       DOM HELPER
       ======================================================== */

    function $(id) {

        return document.getElementById(id);

    }


    /* ========================================================
       ICONS
       ======================================================== */

    function refreshIcons() {

        if (
            window.lucide &&
            typeof window.lucide.createIcons === "function"
        ) {

            try {

                window.lucide.createIcons();

            } catch (error) {

                console.warn(
                    "AFC Portal: lesson icon refresh failed.",
                    error
                );

            }

        }

    }


    /* ========================================================
       HTML ESCAPE
       ======================================================== */

    function escapeHtml(value) {

        return String(
            value == null ? "" : value
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


    /* ========================================================
       TEXT HELPERS
       ======================================================== */

    function cleanText(value) {

        return String(
            value == null ? "" : value
        ).trim();

    }


    function firstAvailable() {

        for (
            let i = 0;
            i < arguments.length;
            i++
        ) {

            const value =
                cleanText(
                    arguments[i]
                );


            if (value) {

                return value;

            }

        }


        return "";

    }


    /* ========================================================
       AUTHENTICATION
       ======================================================== */

    function isLoggedIn() {

        if (
            window.AUTH &&
            typeof window.AUTH.isAuthenticated === "function"
        ) {

            try {

                return !!window.AUTH.isAuthenticated();

            } catch (error) {

                console.warn(
                    "AFC Portal: authentication check failed.",
                    error
                );

            }

        }


        return false;

    }


    function getUser() {

        if (
            window.AUTH &&
            typeof window.AUTH.getUser === "function"
        ) {

            try {

                return window.AUTH.getUser();

            } catch (error) {

                console.warn(
                    "AFC Portal: unable to get current user.",
                    error
                );

            }

        }


        return null;

    }


    /* ========================================================
       LESSON ID
       ======================================================== */

    function getLessonIdFromUrl() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        return cleanText(
            params.get("id") ||
            params.get("lesson_id") ||
            params.get("lessonId")
        );

    }


    /* ========================================================
       DATE FORMATTER
       ======================================================== */

    function formatLessonDate(value) {

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

            return "";

        }


        try {

            return new Intl.DateTimeFormat(
                "en-NG",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            ).format(date);

        } catch (error) {

            return date.toLocaleDateString();

        }

    }


    /* ========================================================
       LESSON STATUS
       ======================================================== */

    function normalizeStatus(value) {

        return cleanText(
            value
        ).toLowerCase();

    }


    function isPublishedLesson(lesson) {

        if (!lesson) {

            return false;

        }


        const status =
            normalizeStatus(
                lesson.status
            );


        /*
         * No status means the backend has already
         * supplied the lesson, so allow it.
         */

        if (!status) {

            return true;

        }


        return (
            status === "published" ||
            status === "active" ||
            status === "live"
        );

    }


    /* ========================================================
       LESSON DATA NORMALIZATION
       ======================================================== */

    function normalizeLesson(item) {

        if (!item || typeof item !== "object") {

            return null;

        }


        return item;

    }


    function normalizeLessonList(response) {

        let list =
            response &&
            response.data !== undefined
                ? response.data
                : response;


        /*
         * Some API responses may return:
         *
         * {
         *   success: true,
         *   data: [...]
         * }
         *
         * or:
         *
         * [...]
         */

        if (
            list &&
            !Array.isArray(list) &&
            Array.isArray(list.lessons)
        ) {

            list =
                list.lessons;

        }


        if (!Array.isArray(list)) {

            return [];

        }


        return list
            .map(normalizeLesson)
            .filter(Boolean);

    }


    /* ========================================================
       LESSON SORT
       ======================================================== */

    function getLessonDateValue(lesson) {

        if (!lesson) {

            return 0;

        }


        const value =
            firstAvailable(
                lesson.lesson_date,
                lesson.published_at,
                lesson.date,
                lesson.created_at
            );


        if (!value) {

            return 0;

        }


        const time =
            new Date(value).getTime();


        return Number.isNaN(time)
            ? 0
            : time;

    }


    function sortLessonsNewestFirst(lessons) {

        return lessons.sort(
            function (a, b) {

                return (
                    getLessonDateValue(b) -
                    getLessonDateValue(a)
                );

            }
        );

    }


    /* ========================================================
       LESSON TITLE
       ======================================================== */

    function getLessonTitle(lesson) {

        return firstAvailable(
            lesson && lesson.title,
            lesson && lesson.lesson_title,
            "Weekly Lesson"
        );

    }


    function getLessonDescription(lesson) {

        return firstAvailable(
            lesson && lesson.description,
            lesson && lesson.summary,
            lesson && lesson.introduction,
            "Open this lesson and continue learning."
        );

    }


    function getLessonWeek(lesson) {

        if (!lesson) {

            return "";

        }


        const week =
            firstAvailable(
                lesson.week_number,
                lesson.week,
                lesson.week_no
            );


        if (!week) {

            return "";

        }


        if (
            /^week\s/i.test(
                week
            )
        ) {

            return week;

        }


        return "Week " + week;

    }


    function getLessonType(lesson) {

        return firstAvailable(
            lesson && lesson.type,
            lesson && lesson.lesson_type,
            lesson && lesson.category,
            "Lesson"
        );

    }


    function getLessonId(lesson) {

        return firstAvailable(
            lesson && lesson.lesson_id,
            lesson && lesson.id
        );

    }


    /* ========================================================
       NAVIGATION
       ======================================================== */

    function openLesson(lessonId) {

        const id =
            cleanText(
                lessonId
            );


        if (!id) {

            console.warn(
                "AFC Portal: cannot open lesson without lesson ID."
            );

            return;

        }


        window.location.href =
            "lessons.html?id=" +
            encodeURIComponent(id);

    }


    function goBackToLessons() {

        window.location.href =
            "lessons.html";

    }


    /* ========================================================
       LESSON HUB STATE
       ======================================================== */

    function renderHubSkeleton() {

        const page =
            $("lessonsHub");


        if (!page) {

            return;

        }


        page.innerHTML = `

            <div class="skeleton-heading">

                <div class="skeleton-line skeleton-small"></div>

                <div class="skeleton-line skeleton-title"></div>

                <div class="skeleton-line skeleton-text wide"></div>

            </div>


            <div class="lesson-featured-skeleton">

                <div class="skeleton-line skeleton-badge"></div>

                <div class="skeleton-line skeleton-feature-title"></div>

                <div class="skeleton-line skeleton-text wide"></div>

                <div class="skeleton-line skeleton-button"></div>

            </div>


            <div class="lesson-skeleton-grid">

                <div class="lesson-card-skeleton">

                    <div class="skeleton-line skeleton-small"></div>

                    <div class="skeleton-line skeleton-card-title"></div>

                    <div class="skeleton-line skeleton-text short"></div>

                </div>


                <div class="lesson-card-skeleton">

                    <div class="skeleton-line skeleton-small"></div>

                    <div class="skeleton-line skeleton-card-title"></div>

                    <div class="skeleton-line skeleton-text short"></div>

                </div>

            </div>

        `;

    }


    /* ========================================================
       HUB ELEMENT FINDERS
       ======================================================== */

    function getHubContainer() {

        return (
            $("lessonsHub") ||
            $("lessonsPage") ||
            $("lessonHub")
        );

    }


    function getFeaturedContainer() {

        return (
            $("featuredLesson") ||
            $("lessonFeatured") ||
            $("currentLesson")
        );

    }


    function getHistoryContainer() {

        return (
            $("lessonsGrid") ||
            $("lessonHistory") ||
            $("lessonsHistory")
        );

    }


    /* ========================================================
       FEATURED LESSON
       ======================================================== */

    function renderFeaturedLesson(lesson) {

        const container =
            getFeaturedContainer();


        if (!container) {

            return;

        }


        const lessonId =
            escapeHtml(
                getLessonId(
                    lesson
                )
            );


        const title =
            escapeHtml(
                getLessonTitle(
                    lesson
                )
            );


        const description =
            escapeHtml(
                getLessonDescription(
                    lesson
                )
            );


        const week =
            escapeHtml(
                getLessonWeek(
                    lesson
                )
            );


        const date =
            escapeHtml(
                formatLessonDate(
                    firstAvailable(
                        lesson.lesson_date,
                        lesson.published_at,
                        lesson.date
                    )
                )
            );


        container.innerHTML = `

            <div class="lesson-featured-content">

                <div class="lesson-featured-top">

                    <span class="lesson-current-badge">

                        <span class="status-dot"></span>

                        Current Lesson

                    </span>

                    ${
                        week
                            ? `
                                <span class="lesson-featured-week">
                                    ${week}
                                </span>
                            `
                            : ""
                    }

                </div>


                <h2>
                    ${title}
                </h2>


                <p>
                    ${description}
                </p>


                <div class="lesson-featured-meta">

                    ${
                        date
                            ? `
                                <span>

                                    <span
                                        data-lucide="calendar-days"
                                    ></span>

                                    ${date}

                                </span>
                            `
                            : ""
                    }

                    <span>

                        <span
                            data-lucide="book-open"
                        ></span>

                        Weekly Lesson

                    </span>

                </div>


                <button
                    type="button"
                    class="lesson-start-button"
                    data-open-lesson="${lessonId}"
                >

                    <span>
                        Start Reading
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
                    class="lesson-featured-glow"
                ></div>

                <div
                    class="lesson-art-circle circle-one"
                ></div>

                <div
                    class="lesson-art-circle circle-two"
                ></div>

                <div
                    class="lesson-art-book"
                >

                    <span
                        data-lucide="book-open"
                    ></span>

                </div>

            </div>

        `;


        const button =
            container.querySelector(
                "[data-open-lesson]"
            );


        if (button) {

            button.addEventListener(
                "click",
                function () {

                    openLesson(
                        button.dataset.openLesson
                    );

                }
            );

        }


        refreshIcons();

    }


    /* ========================================================
       LESSON HISTORY
       ======================================================== */

    function renderLessonHistory(lessons) {

        const container =
            getHistoryContainer();


        if (!container) {

            return;

        }


        if (
            !lessons ||
            lessons.length === 0
        ) {

            container.innerHTML = `

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
                        There are no published lessons available at the moment.
                    </p>

                </div>

            `;


            refreshIcons();

            return;

        }


        container.innerHTML =
            lessons
                .map(
                    function (lesson) {

                        const lessonId =
                            escapeHtml(
                                getLessonId(
                                    lesson
                                )
                            );


                        const title =
                            escapeHtml(
                                getLessonTitle(
                                    lesson
                                )
                            );


                        const description =
                            escapeHtml(
                                getLessonDescription(
                                    lesson
                                )
                            );


                        const week =
                            escapeHtml(
                                getLessonWeek(
                                    lesson
                                )
                            );


                        const type =
                            escapeHtml(
                                getLessonType(
                                    lesson
                                )
                            );


                        const date =
                            escapeHtml(
                                formatLessonDate(
                                    firstAvailable(
                                        lesson.lesson_date,
                                        lesson.published_at,
                                        lesson.date
                                    )
                                )
                            );


                        return `

                            <article class="lesson-card">

                                <div class="lesson-card-top">

                                    <span class="lesson-card-week">

                                        ${
                                            week ||
                                            "Lesson"
                                        }

                                    </span>


                                    <span class="lesson-card-type">

                                        ${type}

                                    </span>

                                </div>


                                <div class="lesson-card-body">

                                    <h3>
                                        ${title}
                                    </h3>


                                    <p>
                                        ${description}
                                    </p>

                                </div>


                                <div class="lesson-card-footer">

                                    <span class="lesson-card-date">

                                        ${date}

                                    </span>


                                    <button
                                        type="button"
                                        class="lesson-card-button"
                                        data-open-lesson="${lessonId}"
                                    >

                                        <span>
                                            Read Lesson
                                        </span>

                                        <span
                                            data-lucide="arrow-up-right"
                                        ></span>

                                    </button>

                                </div>

                            </article>

                        `;

                    }
                )
                .join("");


        container
            .querySelectorAll(
                "[data-open-lesson]"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            openLesson(
                                button.dataset.openLesson
                            );

                        }
                    );

                }
            );


        refreshIcons();

    }


    /* ========================================================
       LESSON COUNT
       ======================================================== */

    function updateLessonCount(count) {

        const elements =
            document.querySelectorAll(
                ".lesson-count"
            );


        elements.forEach(
            function (element) {

                element.textContent =
                    count +
                    (
                        count === 1
                            ? " lesson"
                            : " lessons"
                    );

            }
        );

    }


    /* ========================================================
       HUB ERROR
       ======================================================== */

    function renderHubError() {

        const hub =
            getHubContainer();


        if (!hub) {

            return;

        }


        hub.innerHTML = `

            <div class="lesson-state">

                <div class="lesson-state-icon">

                    <span
                        data-lucide="wifi-off"
                    ></span>

                </div>


                <h2>
                    Unable to load lessons
                </h2>


                <p>
                    We couldn't connect to the lesson library right now.
                    Please try again.
                </p>


                <button
                    type="button"
                    class="lesson-retry-button"
                    id="retryLessonsButton"
                >

                    <span
                        data-lucide="refresh-cw"
                    ></span>

                    Try Again

                </button>

            </div>

        `;


        const retryButton =
            $("retryLessonsButton");


        if (retryButton) {

            retryButton.addEventListener(
                "click",
                function () {

                    loadLessonsHub();

                }
            );

        }


        refreshIcons();

    }


    /* ========================================================
       LOAD LESSONS HUB
       ======================================================== */

    async function loadLessonsHub() {

        const hub =
            getHubContainer();


        if (!hub) {

            return;

        }


        try {

            if (
                !window.API ||
                typeof window.API.get !== "function"
            ) {

                throw new Error(
                    "The API connection layer is not available."
                );

            }


            /*
             * ------------------------------------------------
             * GET LESSON LIST
             * ------------------------------------------------
             */

            const response =
                await window.API.get(
                    "getLessons"
                );


            let lessons =
                normalizeLessonList(
                    response
                );


            /*
             * ------------------------------------------------
             * ONLY PUBLISHED LESSONS
             * ------------------------------------------------
             */

            lessons =
                lessons.filter(
                    isPublishedLesson
                );


            /*
             * ------------------------------------------------
             * SORT
             * ------------------------------------------------
             */

            sortLessonsNewestFirst(
                lessons
            );


            updateLessonCount(
                lessons.length
            );


            /*
             * ------------------------------------------------
             * NO LESSONS
             * ------------------------------------------------
             */

            if (
                lessons.length === 0
            ) {

                renderLessonHistory(
                    []
                );

                const featured =
                    getFeaturedContainer();


                if (featured) {

                    featured.innerHTML = `

                        <div class="lesson-state">

                            <div class="lesson-state-icon">

                                <span
                                    data-lucide="book-open"
                                ></span>

                            </div>

                            <h2>
                                No current lesson
                            </h2>

                            <p>
                                A new lesson will appear here when it is published.
                            </p>

                        </div>

                    `;

                }


                refreshIcons();

                return;

            }


            /*
             * ------------------------------------------------
             * CURRENT LESSON
             * ------------------------------------------------
             */

            const currentLesson =
                lessons[0];


            renderFeaturedLesson(
                currentLesson
            );


            /*
             * ------------------------------------------------
             * HISTORY
             * ------------------------------------------------
             *
             * Do not duplicate the featured lesson.
             */

            const historyLessons =
                lessons.slice(1);


            renderLessonHistory(
                historyLessons
            );


        } catch (error) {

            console.error(
                "AFC Portal: unable to load lessons.",
                error
            );


            renderHubError();

        }

    }


    /* ========================================================
       READER CONTAINERS
       ======================================================== */

    function getReaderContainer() {

        return (
            $("lessonReader") ||
            $("lessonReaderPage") ||
            $("lessonContent")
        );

    }


    /* ========================================================
       READER SKELETON
       ======================================================== */

    function renderReaderSkeleton() {

        const reader =
            getReaderContainer();


        if (!reader) {

            return;

        }


        reader.innerHTML = `

            <div class="lesson-state">

                <div class="lesson-state-icon">

                    <span
                        data-lucide="book-open"
                    ></span>

                </div>

                <p>
                    Loading lesson...
                </p>

            </div>

        `;


        refreshIcons();

    }


    /* ========================================================
       READER ERROR
       ======================================================== */

    function renderReaderError(message) {

        const reader =
            getReaderContainer();


        if (!reader) {

            return;

        }


        reader.innerHTML = `

            <div class="lesson-state">

                <div class="lesson-state-icon">

                    <span
                        data-lucide="wifi-off"
                    ></span>

                </div>


                <h2>
                    Unable to open lesson
                </h2>


                <p>
                    ${
                        escapeHtml(
                            message ||
                            "The lesson could not be loaded right now."
                        )
                    }
                </p>


                <button
                    type="button"
                    class="lesson-retry-button"
                    id="retryLessonReader"
                >

                    <span
                        data-lucide="refresh-cw"
                    ></span>

                    Try Again

                </button>

            </div>

        `;


        const retry =
            $("retryLessonReader");


        if (retry) {

            retry.addEventListener(
                "click",
                function () {

                    loadLessonReader();

                }
            );

        }


        refreshIcons();

    }


    /* ========================================================
       READER DATA NORMALIZATION
       ======================================================== */

    function normalizeReaderResponse(response) {

        /*
         * Expected backend structure:
         *
         * {
         *     success: true,
         *     data: {
         *         lesson: {...},
         *         sections: [...],
         *         reflection_questions: [...]
         *     }
         * }
         *
         * Also support:
         *
         * {
         *     lesson: {...},
         *     sections: [...],
         *     reflection_questions: [...]
         * }
         */

        let data =
            response &&
            response.data !== undefined
                ? response.data
                : response;


        if (!data || typeof data !== "object") {

            return {
                lesson: null,
                sections: [],
                reflection_questions: []
            };

        }


        return {

            lesson:
                data.lesson ||
                null,

            sections:
                Array.isArray(
                    data.sections
                )
                    ? data.sections
                    : [],

            reflection_questions:
                Array.isArray(
                    data.reflection_questions
                )
                    ? data.reflection_questions
                    : []

        };

    }


    /* ========================================================
       SECTION CONTENT
       ======================================================== */

    function renderSectionText(section) {

        const rawContent =
            firstAvailable(
                section && section.content,
                section && section.text,
                section && section.body,
                section && section.description
            );


        if (!rawContent) {

            return `
                <p>
                    This section does not have content yet.
                </p>
            `;

        }


        /*
         * If the backend provides HTML,
         * preserve paragraphs safely.
         *
         * We intentionally do not blindly inject
         * arbitrary HTML from unknown fields.
         *
         * Plain lesson text is converted into paragraphs.
         */

        const text =
            cleanText(
                rawContent
            );


        /*
         * Detect basic HTML content.
         */

        if (
            /<p[\s>]/i.test(text) ||
            /<br\s*\/?>/i.test(text)
        ) {

            return text;

        }


        return text
            .split(
                /\n\s*\n/
            )
            .map(
                function (paragraph) {

                    return `
                        <p>
                            ${escapeHtml(
                                paragraph
                            ).replace(
                                /\n/g,
                                "<br>"
                            )}
                        </p>
                    `;

                }
            )
            .join("");

    }


    /* ========================================================
       READER SECTION LIST
       ======================================================== */

    function renderReaderSidebar(
        sections
    ) {

        const container =
            $("readerSectionList");


        if (!container) {

            return;

        }


        if (
            !sections ||
            sections.length === 0
        ) {

            container.innerHTML = "";

            return;

        }


        container.innerHTML =
            `

                <span class="reader-sidebar-heading">
                    In this lesson
                </span>

            ` +

            sections
                .map(
                    function (section, index) {

                        const sectionId =
                            "lesson-section-" +
                            index;


                        const title =
                            firstAvailable(
                                section.title,
                                section.heading,
                                "Section " +
                                (index + 1)
                            );


                        return `

                            <a
                                href="#${sectionId}"
                                class="reader-section-link"
                            >

                                <span>
                                    ${index + 1}
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        title
                                    )}
                                </strong>

                            </a>

                        `;

                    }
                )
                .join("");

    }


    /* ========================================================
       READER SECTIONS
       ======================================================== */

    function renderReaderSections(
        sections
    ) {

        const container =
            $("lessonReadingContent");


        if (!container) {

            return;

        }


        if (
            !sections ||
            sections.length === 0
        ) {

            container.innerHTML = `

                <div class="lesson-no-content">

                    <span
                        data-lucide="book-open"
                    ></span>

                    <h2>
                        No lesson content yet
                    </h2>

                    <p>
                        This lesson has not been given any reading sections yet.
                    </p>

                </div>

            `;


            refreshIcons();

            return;

        }


        container.innerHTML =
            sections
                .map(
                    function (section, index) {

                        const title =
                            firstAvailable(
                                section.title,
                                section.heading,
                                "Section " +
                                (index + 1)
                            );


                        return `

                            <section
                                class="lesson-reading-section"
                                id="lesson-section-${index}"
                            >

                                <div
                                    class="section-number"
                                >

                                    ${index + 1}

                                </div>


                                <div class="section-main">

                                    <h2>
                                        ${escapeHtml(
                                            title
                                        )}
                                    </h2>


                                    <div class="section-text">

                                        ${renderSectionText(
                                            section
                                        )}

                                    </div>

                                </div>

                            </section>

                        `;

                    }
                )
                .join("");


        refreshIcons();

    }


    /* ========================================================
       READER HEADER
       ======================================================== */

    function renderReaderHeader(
        lesson
    ) {

        const titleElement =
            $("lessonReaderTitle");


        const descriptionElement =
            $("lessonReaderDescription");


        const weekElement =
            $("lessonReaderWeek");


        const typeElement =
            $("lessonReaderType");


        const dateElement =
            $("lessonReaderDate");


        if (titleElement) {

            titleElement.textContent =
                getLessonTitle(
                    lesson
                );

        }


        if (descriptionElement) {

            descriptionElement.textContent =
                getLessonDescription(
                    lesson
                );

        }


        if (weekElement) {

            weekElement.textContent =
                getLessonWeek(
                    lesson
                );

            weekElement.hidden =
                !getLessonWeek(
                    lesson
                );

        }


        if (typeElement) {

            typeElement.textContent =
                getLessonType(
                    lesson
                );

        }


        if (dateElement) {

            const date =
                formatLessonDate(
                    firstAvailable(
                        lesson.lesson_date,
                        lesson.published_at,
                        lesson.date
                    )
                );


            dateElement.textContent =
                date;


            dateElement.hidden =
                !date;

        }


        /*
         * Fallback support if the HTML contains
         * a generic reader header but different IDs.
         */

        const genericTitle =
            document.querySelector(
                ".lesson-reader-header h1"
            );


        if (
            !titleElement &&
            genericTitle
        ) {

            genericTitle.textContent =
                getLessonTitle(
                    lesson
                );

        }


        const genericDescription =
            document.querySelector(
                ".lesson-reader-description"
            );


        if (
            !descriptionElement &&
            genericDescription
        ) {

            genericDescription.textContent =
                getLessonDescription(
                    lesson
                );

        }

    }


    /* ========================================================
       COMPLETION CARD
       ======================================================== */

    function renderCompletionCard(
        lesson,
        reflectionQuestions
    ) {

        const container =
            $("lessonCompletion");


        if (!container) {

            return;

        }


        const hasReflection =
            Array.isArray(
                reflectionQuestions
            ) &&
            reflectionQuestions.length > 0;


        container.innerHTML = `

            <div class="lesson-completion-card">

                <div class="completion-icon">

                    <span
                        data-lucide="check-check"
                    ></span>

                </div>


                <div class="completion-copy">

                    <span class="eyebrow">

                        Lesson Complete

                    </span>


                    <h2>
                        I've read this lesson
                    </h2>


                    <p>
                        ${
                            hasReflection
                                ? "Mark this lesson as read and continue to the reflection."
                                : "Mark this lesson as read when you are finished."
                        }
                    </p>

                </div>


                <button
                    type="button"
                    class="lesson-complete-button"
                    id="lessonCompleteButton"
                >

                    <span>
                        I've read this lesson
                    </span>

                    <span
                        data-lucide="check"
                    ></span>

                </button>

            </div>

        `;


        const button =
            $("lessonCompleteButton");


        if (button) {

            button.addEventListener(
                "click",
                function () {

                    handleLessonCompletion(
                        lesson,
                        reflectionQuestions,
                        button
                    );

                }
            );

        }


        refreshIcons();

    }


    /* ========================================================
       COMPLETION
       ======================================================== */

    async function handleLessonCompletion(
        lesson,
        reflectionQuestions,
        button
    ) {

        if (!button) {

            return;

        }


        /*
         * ----------------------------------------------------
         * AUTH CHECK
         * ----------------------------------------------------
         */

        if (!isLoggedIn()) {

            const returnUrl =
                window.location.href;


            window.location.href =
                "login.html?return=" +
                encodeURIComponent(
                    returnUrl
                );


            return;

        }


        if (
            handleLessonCompletion.isRunning
        ) {

            return;

        }


        handleLessonCompletion.isRunning =
            true;


        const originalHtml =
            button.innerHTML;


        button.disabled =
            true;


        button.setAttribute(
            "aria-busy",
            "true"
        );


        button.innerHTML = `

            <span class="button-spinner"></span>

            <span>
                Saving...
            </span>

        `;


        try {

            /*
             * ------------------------------------------------
             * SAVE COMPLETION
             * ------------------------------------------------
             *
             * The backend completion function may be
             * introduced/connected during the next phase.
             *
             * For now, prefer the central API when available.
             */

            const lessonId =
                getLessonId(
                    lesson
                );


            if (
                window.API &&
                typeof window.API.post === "function"
            ) {

                try {

                    await window.API.post(
                        "completeLesson",
                        {
                            lesson_id:
                                lessonId
                        }
                    );

                } catch (completionError) {

                    /*
                     * If completion endpoint is not yet
                     * available, do not destroy the reader.
                     *
                     * The next phase can connect the
                     * exact completion endpoint.
                     */

                    console.warn(
                        "AFC Portal: lesson completion endpoint unavailable.",
                        completionError
                    );

                }

            }


            /*
             * ------------------------------------------------
             * REFLECTION
             * ------------------------------------------------
             */

            if (
                Array.isArray(
                    reflectionQuestions
                ) &&
                reflectionQuestions.length > 0
            ) {

                sessionStorage.setItem(
                    "afc_lesson_reflection",
                    JSON.stringify({

                        lesson:
                            lesson,

                        reflection_questions:
                            reflectionQuestions

                    })
                );


                window.location.href =
                    "reflection.html?lesson_id=" +
                    encodeURIComponent(
                        lessonId
                    );


                return;

            }


            /*
             * ------------------------------------------------
             * COMPLETED STATE
             * ------------------------------------------------
             */

            button.innerHTML = `

                <span>
                    Lesson completed
                </span>

                <span
                    data-lucide="check-check"
                ></span>

            `;


            button.classList.add(
                "completed"
            );


            refreshIcons();


        } catch (error) {

            console.error(
                "AFC Portal: lesson completion failed.",
                error
            );


            button.innerHTML =
                originalHtml;


            button.disabled =
                false;


            button.removeAttribute(
                "aria-busy"
            );


            handleLessonCompletion.isRunning =
                false;


            alert(
                "Unable to save your lesson completion. Please try again."
            );


            return;

        }


        handleLessonCompletion.isRunning =
            false;

    }


    /* ========================================================
       READING PROGRESS
       ======================================================== */

    function updateReadingProgress() {

        const track =
            document.querySelector(
                ".reading-progress-track"
            );


        const value =
            document.querySelector(
                ".reading-progress-value"
            );


        if (!track || !value) {

            return;

        }


        const scrollTop =
            window.scrollY ||
            document.documentElement.scrollTop;


        const documentHeight =
            document.documentElement.scrollHeight;


        const viewportHeight =
            window.innerHeight;


        const scrollable =
            documentHeight -
            viewportHeight;


        if (
            scrollable <= 0
        ) {

            value.style.width =
                "100%";

            return;

        }


        let progress =
            (
                scrollTop /
                scrollable
            ) *
            100;


        progress =
            Math.max(
                0,
                Math.min(
                    100,
                    progress
                )
            );


        value.style.width =
            progress +
            "%";

    }


    function setupReadingProgress() {

        window.addEventListener(
            "scroll",
            updateReadingProgress,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            updateReadingProgress
        );


        updateReadingProgress();

    }


    /* ========================================================
       SMOOTH SECTION LINKS
       ======================================================== */

    function setupReaderSectionLinks() {

        document.addEventListener(
            "click",
            function (event) {

                const link =
                    event.target.closest(
                        ".reader-section-link"
                    );


                if (!link) {

                    return;

                }


                const href =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !href ||
                    href.charAt(0) !== "#"
                ) {

                    return;

                }


                const target =
                    document.querySelector(
                        href
                    );


                if (!target) {

                    return;

                }


                event.preventDefault();


                target.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "start"

                });


                history.replaceState(
                    null,
                    "",
                    href
                );

            }
        );

    }


    /* ========================================================
       READER BACK BUTTON
       ======================================================== */

    function setupBackButton() {

        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        ".lesson-back-button"
                    );


                if (!button) {

                    return;

                }


                event.preventDefault();


                goBackToLessons();

            }
        );

    }


    /* ========================================================
       RENDER COMPLETE READER
       ======================================================== */

    function renderReader(
        lesson,
        sections,
        reflectionQuestions
    ) {

        renderReaderHeader(
            lesson
        );


        renderReaderSections(
            sections
        );


        renderReaderSidebar(
            sections
        );


        renderCompletionCard(
            lesson,
            reflectionQuestions
        );


        refreshIcons();


        requestAnimationFrame(
            updateReadingProgress
        );

    }


    /* ========================================================
       LOAD SINGLE LESSON
       ======================================================== */

    async function loadLessonReader() {

        const lessonId =
            getLessonIdFromUrl();


        if (!lessonId) {

            goBackToLessons();

            return;

        }


        const reader =
            getReaderContainer();


        if (!reader) {

            return;

        }


        renderReaderSkeleton();


        try {

            if (
                !window.API ||
                typeof window.API.get !== "function"
            ) {

                throw new Error(
                    "The API connection layer is not available."
                );

            }


            /*
             * ------------------------------------------------
             * GET FULL LESSON
             * ------------------------------------------------
             *
             * Backend:
             *
             * getLesson
             *
             * Expected:
             *
             * {
             *   lesson,
             *   sections,
             *   reflection_questions
             * }
             */

            const response =
                await window.API.get(
                    "getLesson",
                    {
                        lesson_id:
                            lessonId
                    }
                );


            const data =
                normalizeReaderResponse(
                    response
                );


            const lesson =
                data.lesson;


            const sections =
                data.sections;


            const reflectionQuestions =
                data.reflection_questions;


            if (!lesson) {

                throw new Error(
                    "Lesson was not found."
                );

            }


            /*
             * ------------------------------------------------
             * RENDER
             * ------------------------------------------------
             */

            renderReader(
                lesson,
                sections,
                reflectionQuestions
            );


            /*
             * ------------------------------------------------
             * PAGE TITLE
             * ------------------------------------------------
             */

            document.title =
                getLessonTitle(
                    lesson
                ) +
                " | AFC Isiwu Youth Portal";


            /*
             * ------------------------------------------------
             * START AT TOP
             * ------------------------------------------------
             */

            window.scrollTo(
                0,
                0
            );


        } catch (error) {

            console.error(
                "AFC Portal: unable to load lesson reader.",
                error
            );


            renderReaderError(
                "The lesson could not be loaded. Please try again."
            );

        }

    }


    /* ========================================================
       PAGE MODE
       ======================================================== */

    function isReaderPage() {

        return !!getLessonIdFromUrl();

    }


    /* ========================================================
       INITIALIZE
       ======================================================== */

    async function initializeLessonsPage() {

        console.log(
            "AFC Portal: initializing lessons page..."
        );


        try {

            setupReadingProgress();

            setupReaderSectionLinks();

            setupBackButton();


            if (
                isReaderPage()
            ) {

                /*
                 * Single lesson reader.
                 */

                await loadLessonReader();

            } else {

                /*
                 * Lessons hub.
                 */

                await loadLessonsHub();

            }


            refreshIcons();


            console.log(
                "AFC Portal: lessons page initialized."
            );


        } catch (error) {

            console.error(
                "AFC Portal: lessons initialization failed.",
                error
            );

        }

    }


    /* ========================================================
       DOM READY
       ======================================================== */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeLessonsPage
        );

    } else {

        initializeLessonsPage();

    }


    /* ========================================================
       PUBLIC METHODS
       ======================================================== */

    window.openLesson =
        openLesson;


    window.loadLessonsHub =
        loadLessonsHub;


    window.loadLessonReader =
        loadLessonReader;


    window.updateReadingProgress =
        updateReadingProgress;


})();
