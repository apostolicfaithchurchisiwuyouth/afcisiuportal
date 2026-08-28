/* ============================================================
   AFC ISIU YOUTH PORTAL V2
   FILE: js/pages/lessons.js
   PURPOSE: Public Lessons Hub + Lesson Reader
   ============================================================

   PUBLIC FLOW

   Lessons Hub
        ↓
   Open Lesson
        ↓
   Read Complete Lesson
        ↓
   Reading Progress
        ↓
   ┌───────────────────────────────────────┐
   │ NOT LOGGED IN                         │
   │                                       │
   │ Read lesson freely                    │
   │                                       │
   │ Click completion/reflection/quiz      │
   │              ↓                        │
   │ Login Modal                           │
   └───────────────────────────────────────┘

        OR

   ┌───────────────────────────────────────┐
   │ LOGGED IN                             │
   │                                       │
   │ Confirm lesson read                   │
   │              ↓                        │
   │ Submit reflection                     │
   │              ↓                        │
   │ Take quiz                             │
   └───────────────────────────────────────┘

   ============================================================ */

(function () {

    "use strict";


    /* ========================================================
       PAGE STATE
       ======================================================== */

    const LessonsPageState = {

        lessons: [],

        currentLesson: null,

        progress: 0,

        confirmedRead: false,

        reflectionSubmitted: false,

        scrollHandler: null

    };


    /* ========================================================
       DOM HELPERS
       ======================================================== */

    function $(id) {

        return document.getElementById(id);

    }


    function getContainer() {

        return $("page-container");

    }


    /* ========================================================
       ESCAPE HTML
       ======================================================== */

    function escapeHTML(value) {

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
       REFRESH LUCIDE
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
       GET FIELD SAFELY
       ======================================================== */

    function getField(object, names, fallback = "") {

        if (!object) {

            return fallback;

        }


        for (let i = 0; i < names.length; i++) {

            const key = names[i];


            if (
                object[key] !== undefined &&
                object[key] !== null &&
                String(object[key]).trim() !== ""
            ) {

                return object[key];

            }

        }


        return fallback;

    }


    /* ========================================================
       NORMALIZE LESSON
       ======================================================== */

    function normalizeLesson(rawLesson) {

        rawLesson =
            rawLesson || {};


        return {

            id:

                getField(
                    rawLesson,
                    [
                        "lesson_id",
                        "id",
                        "lessonId"
                    ],
                    ""
                ),


            week:

                getField(
                    rawLesson,
                    [
                        "week",
                        "week_number",
                        "lesson_week"
                    ],
                    ""
                ),


            topic:

                getField(
                    rawLesson,
                    [
                        "topic",
                        "title",
                        "lesson_topic",
                        "lesson_title"
                    ],
                    "Untitled Lesson"
                ),


            bibleText:

                getField(
                    rawLesson,
                    [
                        "bible_text",
                        "bibleText",
                        "scripture",
                        "bible_reading"
                    ],
                    ""
                ),


            memoryVerse:

                getField(
                    rawLesson,
                    [
                        "memory_verse",
                        "memoryVerse"
                    ],
                    ""
                ),


            yorubaMemoryVerse:

                getField(
                    rawLesson,
                    [
                        "yoruba_memory_verse",
                        "yorubaMemoryVerse",
                        "memory_verse_yoruba"
                    ],
                    ""
                ),


            yorubaAudio:

                getField(
                    rawLesson,
                    [
                        "yoruba_memory_verse_audio",
                        "yoruba_audio",
                        "yorubaAudio",
                        "memory_verse_audio"
                    ],
                    ""
                ),


            introduction:

                getField(
                    rawLesson,
                    [
                        "introduction",
                        "intro"
                    ],
                    ""
                ),


            content:

                getField(
                    rawLesson,
                    [
                        "content",
                        "lesson_content",
                        "body",
                        "full_content"
                    ],
                    ""
                ),


            sections:

                rawLesson.sections ||
                rawLesson.lesson_sections ||
                [],


            quizId:

                getField(
                    rawLesson,
                    [
                        "quiz_id",
                        "quizId"
                    ],
                    ""
                ),


            status:

                getField(
                    rawLesson,
                    [
                        "status"
                    ],
                    "active"
                )

        };

    }


    /* ========================================================
       PAGE LOADER
       ======================================================== */

    function showLoading() {

        const container =
            getContainer();


        if (!container) {

            return;

        }


        container.innerHTML = `

            <section class="page lessons-page">

                <div class="page-loading">

                    <div class="loading-spinner"></div>

                    <p>
                        Loading lessons...
                    </p>

                </div>

            </section>

        `;

    }


    /* ========================================================
       ERROR STATE
       ======================================================== */

    function showError(message) {

        const container =
            getContainer();


        if (!container) {

            return;

        }


        container.innerHTML = `

            <section class="page lessons-page">

                <div class="empty-state">

                    <div class="empty-state-icon">

                        <i data-lucide="triangle-alert"></i>

                    </div>

                    <h2>
                        Unable to Load Lessons
                    </h2>

                    <p>
                        ${escapeHTML(
                            message ||
                            "Something went wrong while loading the lessons."
                        )}
                    </p>

                    <button
                        id="retry-lessons-button"
                        class="primary-button"
                        type="button"
                    >

                        <i data-lucide="refresh-cw"></i>

                        Try Again

                    </button>

                </div>

            </section>

        `;


        refreshIcons();


        const retryButton =
            $("retry-lessons-button");


        if (retryButton) {

            retryButton.addEventListener(
                "click",
                loadLessons
            );

        }

    }


    /* ========================================================
       LOAD LESSONS
       ======================================================== */

    async function loadLessons() {

        showLoading();


        if (
            !window.AFC ||
            !window.AFC.PublicAPI ||
            typeof window.AFC.PublicAPI.getLessons !== "function"
        ) {

            showError(
                "The lessons service is not available."
            );

            return;

        }


        try {

            const response =
                await window.AFC.PublicAPI.getLessons();


            console.log(
                "AFC LESSONS RESPONSE:",
                response
            );


            if (
                !response ||
                response.success !== true
            ) {

                showError(
                    response &&
                    response.message
                        ? response.message
                        : "Unable to load lessons."
                );

                return;

            }


            const data =
                response.data;


            let lessons =
                [];


            if (
                Array.isArray(data)
            ) {

                lessons =
                    data;

            } else if (
                data &&
                Array.isArray(data.lessons)
            ) {

                lessons =
                    data.lessons;

            }


            LessonsPageState.lessons =
                lessons.map(
                    normalizeLesson
                );


            if (
                window.setAppState
            ) {

                window.setAppState({

                    lessons:
                        LessonsPageState.lessons

                });

            }


            renderLessonsHub();

        } catch (error) {

            console.error(
                "AFC LESSONS LOAD ERROR:",
                error
            );


            showError(
                "Unable to connect to the lessons service."
            );

        }

    }


    /* ========================================================
       RENDER LESSONS HUB
       ======================================================== */

    function renderLessonsHub() {

        const container =
            getContainer();


        if (!container) {

            return;

        }


        const lessons =
            LessonsPageState.lessons;


        if (!lessons.length) {

            container.innerHTML = `

                <section class="page lessons-page">

                    <div class="page-heading">

                        <span class="eyebrow">
                            WEEKLY GROWTH
                        </span>

                        <h1>
                            Lessons
                        </h1>

                        <p>
                            Explore lessons designed to help you grow
                            in God's Word.
                        </p>

                    </div>


                    <div class="empty-state">

                        <div class="empty-state-icon">

                            <i data-lucide="book-open"></i>

                        </div>

                        <h2>
                            No Lessons Yet
                        </h2>

                        <p>
                            New lessons will appear here soon.
                        </p>

                    </div>

                </section>

            `;


            refreshIcons();

            return;

        }


        const lessonCards =
            lessons.map(
                function (lesson, index) {

                    const weekLabel =
                        lesson.week
                            ? "Week " + lesson.week
                            : "Lesson " + (index + 1);


                    return `

                        <article
                            class="lesson-card"
                        >

                            <div class="lesson-card-top">

                                <span class="lesson-week">

                                    ${escapeHTML(
                                        weekLabel
                                    )}

                                </span>


                                <i
                                    data-lucide="book-open"
                                    class="lesson-card-icon"
                                ></i>

                            </div>


                            <h2>

                                ${escapeHTML(
                                    lesson.topic
                                )}

                            </h2>


                            ${

                                lesson.bibleText

                                    ? `

                                        <div class="lesson-card-meta">

                                            <i data-lucide="book-marked"></i>

                                            <span>

                                                ${escapeHTML(
                                                    lesson.bibleText
                                                )}

                                            </span>

                                        </div>

                                    `

                                    : ""

                            }


                            ${

                                lesson.memoryVerse

                                    ? `

                                        <p class="lesson-card-verse">

                                            ${escapeHTML(
                                                truncateText(
                                                    lesson.memoryVerse,
                                                    120
                                                )
                                            )}

                                        </p>

                                    `

                                    : ""

                            }


                            <button
                                class="lesson-open-button"
                                type="button"
                                data-lesson-id="${escapeHTML(
                                    lesson.id
                                )}"
                            >

                                Read Lesson

                                <i data-lucide="arrow-right"></i>

                            </button>

                        </article>

                    `;

                }
            )
                .join("");


        container.innerHTML = `

            <section class="page lessons-page">


                <div class="page-heading">

                    <span class="eyebrow">
                        WEEKLY GROWTH
                    </span>

                    <h1>
                        Lessons
                    </h1>

                    <p>
                        Read, reflect, learn and grow in God's Word.
                    </p>

                </div>


                <div class="lessons-grid">

                    ${lessonCards}

                </div>


            </section>

        `;


        refreshIcons();


        document
            .querySelectorAll(
                ".lesson-open-button"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const lessonId =
                                button.dataset.lessonId;


                            openLessonById(
                                lessonId
                            );

                        }
                    );

                }
            );

    }


    /* ========================================================
       OPEN LESSON BY ID
       ======================================================== */

    async function openLessonById(
        lessonId
    ) {

        if (!lessonId) {

            return;

        }


        let lesson =
            LessonsPageState.lessons.find(
                function (item) {

                    return String(
                        item.id
                    ) ===
                    String(
                        lessonId
                    );

                }
            );


        /*
         * If the lesson is already complete
         * in the lessons list, use it.
         */

        if (
            lesson &&
            hasFullLessonContent(lesson)
        ) {

            openLesson(
                lesson
            );

            return;

        }


        /*
         * Otherwise request the complete lesson.
         */

        await loadSingleLesson(
            lessonId
        );

    }


    /* ========================================================
       CHECK FULL LESSON
       ======================================================== */

    function hasFullLessonContent(
        lesson
    ) {

        if (!lesson) {

            return false;

        }


        return Boolean(

            lesson.content ||

            lesson.introduction ||

            (
                Array.isArray(
                    lesson.sections
                ) &&
                lesson.sections.length
            )

        );

    }


    /* ========================================================
       LOAD SINGLE LESSON
       ======================================================== */

    async function loadSingleLesson(
        lessonId
    ) {

        showLoading();


        try {

            const response =
                await window.AFC.PublicAPI.getLesson({

                    lesson_id:
                        lessonId

                });


            console.log(
                "AFC LESSON RESPONSE:",
                response
            );


            if (
                !response ||
                response.success !== true
            ) {

                showError(
                    response &&
                    response.message
                        ? response.message
                        : "Unable to load this lesson."
                );

                return;

            }


            let lessonData =
                response.data;


            if (
                lessonData &&
                lessonData.lesson
            ) {

                lessonData =
                    lessonData.lesson;

            }


            const lesson =
                normalizeLesson(
                    lessonData
                );


            openLesson(
                lesson
            );

        } catch (error) {

            console.error(
                "AFC SINGLE LESSON ERROR:",
                error
            );


            showError(
                "Unable to load this lesson."
            );

        }

    }


    /* ========================================================
       OPEN LESSON
       ======================================================== */

    function openLesson(
        lesson
    ) {

        LessonsPageState.currentLesson =
            lesson;


        LessonsPageState.progress =
            0;


        LessonsPageState.confirmedRead =
            false;


        LessonsPageState.reflectionSubmitted =
            false;


        if (
            window.setAppState
        ) {

            window.setAppState({

                currentLesson:
                    lesson

            });

        }


        renderLessonReader(
            lesson
        );

    }


    /* ========================================================
       RENDER LESSON READER
       ======================================================== */

    function renderLessonReader(
        lesson
    ) {

        const container =
            getContainer();


        if (!container) {

            return;

        }


        const weekLabel =
            lesson.week
                ? "Week " + lesson.week
                : "Weekly Lesson";


        container.innerHTML = `

            <section
                class="page lesson-reader-page"
                id="lesson-reader-page"
            >


                <!-- BACK -->

                <button
                    id="back-to-lessons"
                    class="text-back-button"
                    type="button"
                >

                    <i data-lucide="arrow-left"></i>

                    <span>
                        All Lessons
                    </span>

                </button>



                <!-- HERO -->

                <header class="lesson-reader-header">

                    <span class="eyebrow">

                        ${escapeHTML(
                            weekLabel
                        )}

                    </span>


                    <h1>

                        ${escapeHTML(
                            lesson.topic
                        )}

                    </h1>

                </header>



                <!-- LESSON DETAILS -->

                <div class="lesson-details-card">


                    ${renderBibleText(
                        lesson
                    )}


                    ${renderMemoryVerse(
                        lesson
                    )}


                    ${renderYorubaMemoryVerse(
                        lesson
                    )}


                    ${renderYorubaAudio(
                        lesson
                    )}


                </div>



                <!-- PROGRESS -->

                <section
                    class="lesson-progress-card"
                    id="lesson-progress-card"
                >

                    <div class="lesson-progress-heading">

                        <div>

                            <span class="lesson-progress-label">
                                LESSON PROGRESS
                            </span>

                            <p
                                id="lesson-progress-text"
                            >
                                Start reading to track your progress.
                            </p>

                        </div>


                        <strong
                            id="lesson-progress-percent"
                        >
                            0%
                        </strong>

                    </div>


                    <div
                        class="lesson-progress-track"
                    >

                        <div
                            id="lesson-progress-bar"
                            class="lesson-progress-bar"
                            style="width: 0%;"
                        ></div>

                    </div>

                </section>



                <!-- LESSON CONTENT -->

                <article
                    id="lesson-reading-content"
                    class="lesson-reading-content"
                >

                    ${renderLessonContent(
                        lesson
                    )}

                </article>



                <!-- COMPLETION -->

                <section
                    id="lesson-completion-section"
                    class="lesson-action-section"
                >

                    <div class="lesson-action-icon">

                        <i data-lucide="circle-check"></i>

                    </div>


                    <div class="lesson-action-copy">

                        <h2>
                            Finished Reading?
                        </h2>

                        <p>
                            Confirm that you have read this lesson
                            before continuing to reflection.
                        </p>

                    </div>


                    <button
                        id="confirm-lesson-read-button"
                        class="primary-button"
                        type="button"
                    >

                        <i data-lucide="check"></i>

                        I've Read This Lesson

                    </button>

                </section>



                <!-- REFLECTION -->

                <section
                    id="reflection-section"
                    class="lesson-reflection-section"
                >

                    <div class="section-heading">

                        <span class="eyebrow">
                            REFLECTION
                        </span>

                        <h2>
                            What did you learn?
                        </h2>

                        <p>
                            Take a moment to reflect on what this
                            lesson means to you.
                        </p>

                    </div>


                    <textarea
                        id="lesson-reflection-input"
                        class="reflection-input"
                        rows="6"
                        placeholder="Write your reflection here..."
                    ></textarea>


                    <button
                        id="submit-reflection-button"
                        class="primary-button"
                        type="button"
                    >

                        <i data-lucide="send"></i>

                        Submit Reflection

                    </button>


                    <p
                        id="reflection-status"
                        class="reflection-status"
                    ></p>

                </section>



                <!-- QUIZ -->

                <section
                    id="lesson-quiz-section"
                    class="lesson-quiz-section"
                >

                    <div class="lesson-quiz-content">

                        <div class="lesson-action-icon">

                            <i data-lucide="brain"></i>

                        </div>


                        <div>

                            <span class="eyebrow">
                                LESSON QUIZ
                            </span>

                            <h2>
                                Test What You Have Learned
                            </h2>

                            <p
                                id="quiz-lock-message"
                            >
                                Complete your reflection to unlock
                                the quiz.
                            </p>

                        </div>

                    </div>


                    <button
                        id="take-lesson-quiz-button"
                        class="primary-button"
                        type="button"
                        disabled
                    >

                        <i data-lucide="lock"></i>

                        <span>
                            Take Quiz
                        </span>

                    </button>

                </section>


            </section>

        `;


        refreshIcons();


        bindLessonReaderEvents();


        startProgressTracking();

    }


    /* ========================================================
       BIBLE TEXT
       ======================================================== */

    function renderBibleText(
        lesson
    ) {

        if (!lesson.bibleText) {

            return "";

        }


        return `

            <div class="lesson-detail-block">

                <div class="lesson-detail-label">

                    <i data-lucide="book-open"></i>

                    <span>
                        BIBLE TEXT
                    </span>

                </div>


                <p>

                    ${escapeHTML(
                        lesson.bibleText
                    )}

                </p>

            </div>

        `;

    }


    /* ========================================================
       MEMORY VERSE
       ======================================================== */

    function renderMemoryVerse(
        lesson
    ) {

        if (!lesson.memoryVerse) {

            return "";

        }


        return `

            <div class="lesson-detail-block">

                <div class="lesson-detail-label">

                    <i data-lucide="quote"></i>

                    <span>
                        MEMORY VERSE
                    </span>

                </div>


                <blockquote>

                    ${escapeHTML(
                        lesson.memoryVerse
                    )}

                </blockquote>

            </div>

        `;

    }


    /* ========================================================
       YORUBA MEMORY VERSE
       ======================================================== */

    function renderYorubaMemoryVerse(
        lesson
    ) {

        if (!lesson.yorubaMemoryVerse) {

            return "";

        }


        return `

            <div class="lesson-detail-block">

                <div class="lesson-detail-label">

                    <i data-lucide="languages"></i>

                    <span>
                        ÌRÁNTÍ Ọ̀RỌ̀ YORÙBÁ
                    </span>

                </div>


                <blockquote
                    class="yoruba-memory-verse"
                >

                    ${escapeHTML(
                        lesson.yorubaMemoryVerse
                    )}

                </blockquote>

            </div>

        `;

    }


    /* ========================================================
       YORUBA AUDIO
       ======================================================== */

    function renderYorubaAudio(
        lesson
    ) {

        if (!lesson.yorubaAudio) {

            return "";

        }


        return `

            <div class="lesson-detail-block">

                <div class="lesson-detail-label">

                    <i data-lucide="volume-2"></i>

                    <span>
                        LISTEN IN YORÙBÁ
                    </span>

                </div>


                <audio
                    class="yoruba-audio-player"
                    controls
                    preload="metadata"
                >

                    <source
                        src="${escapeHTML(
                            lesson.yorubaAudio
                        )}"
                    >

                    Your browser does not support audio playback.

                </audio>

            </div>

        `;

    }


    /* ========================================================
       LESSON CONTENT
       ======================================================== */

    function renderLessonContent(
        lesson
    ) {

        let html =
            "";


        if (
            lesson.introduction
        ) {

            html += `

                <section
                    class="lesson-content-section"
                >

                    <h2>
                        Introduction
                    </h2>

                    ${formatContent(
                        lesson.introduction
                    )}

                </section>

            `;

        }


        /*
         * Sections
         */

        if (
            Array.isArray(
                lesson.sections
            ) &&
            lesson.sections.length
        ) {

            lesson.sections.forEach(
                function (
                    section,
                    index
                ) {

                    const heading =
                        getField(
                            section,
                            [
                                "title",
                                "heading",
                                "section_title"
                            ],
                            "Part " + (index + 1)
                        );


                    const content =
                        getField(
                            section,
                            [
                                "content",
                                "body",
                                "text"
                            ],
                            ""
                        );


                    html += `

                        <section
                            class="lesson-content-section"
                        >

                            <h2>

                                ${escapeHTML(
                                    heading
                                )}

                            </h2>


                            ${formatContent(
                                content
                            )}

                        </section>

                    `;

                }
            );

        }


        /*
         * Main content
         */

        if (
            lesson.content
        ) {

            html += `

                <section
                    class="lesson-content-section"
                >

                    ${formatContent(
                        lesson.content
                    )}

                </section>

            `;

        }


        if (!html) {

            html = `

                <section
                    class="lesson-content-section"
                >

                    <p>
                        The full lesson content is not available yet.
                    </p>

                </section>

            `;

        }


        return html;

    }


    /* ========================================================
       FORMAT CONTENT
       ======================================================== */

    function formatContent(
        content
    ) {

        if (!content) {

            return "";

        }


        /*
         * Escape the content first.
         *
         * Then preserve paragraphs and line breaks.
         */

        const escaped =
            escapeHTML(
                content
            );


        const paragraphs =
            escaped
                .split(/\n\s*\n/)
                .map(
                    function (paragraph) {

                        const value =
                            paragraph
                                .trim()
                                .replace(
                                    /\n/g,
                                    "<br>"
                                );


                        if (!value) {

                            return "";

                        }


                        return `

                            <p>
                                ${value}
                            </p>

                        `;

                    }
                )
                .join("");


        return paragraphs;

    }


    /* ========================================================
       BIND READER EVENTS
       ======================================================== */

    function bindLessonReaderEvents() {

        const backButton =
            $("back-to-lessons");


        if (backButton) {

            backButton.addEventListener(
                "click",
                function () {

                    stopProgressTracking();

                    LessonsPageState.currentLesson =
                        null;

                    renderLessonsHub();

                }
            );

        }


        const confirmButton =
            $("confirm-lesson-read-button");


        if (confirmButton) {

            confirmButton.addEventListener(
                "click",
                handleConfirmRead
            );

        }


        const reflectionButton =
            $("submit-reflection-button");


        if (reflectionButton) {

            reflectionButton.addEventListener(
                "click",
                handleSubmitReflection
            );

        }


        const quizButton =
            $("take-lesson-quiz-button");


        if (quizButton) {

            quizButton.addEventListener(
                "click",
                handleTakeQuiz
            );

        }

    }


    /* ========================================================
       PROGRESS TRACKING
       ======================================================== */

    function startProgressTracking() {

        stopProgressTracking();


        LessonsPageState.scrollHandler =
            function () {

                updateReadingProgress();

            };


        window.addEventListener(
            "scroll",
            LessonsPageState.scrollHandler,
            {
                passive: true
            }
        );


        updateReadingProgress();

    }


    /* ========================================================
       STOP PROGRESS TRACKING
       ======================================================== */

    function stopProgressTracking() {

        if (
            LessonsPageState.scrollHandler
        ) {

            window.removeEventListener(
                "scroll",
                LessonsPageState.scrollHandler
            );


            LessonsPageState.scrollHandler =
                null;

        }

    }


    /* ========================================================
       UPDATE READING PROGRESS
       ======================================================== */

    function updateReadingProgress() {

        const content =
            $("lesson-reading-content");


        if (!content) {

            return;

        }


        const rect =
            content.getBoundingClientRect();


        const viewportHeight =
            window.innerHeight ||
            document.documentElement.clientHeight;


        const contentHeight =
            content.offsetHeight;


        if (
            contentHeight <= 0
        ) {

            return;

        }


        /*
         * Position relative to the reading content.
         */

        const totalScrollable =
            contentHeight +
            viewportHeight;


        const visiblePosition =
            viewportHeight -
            rect.top;


        let progress =
            (
                visiblePosition /
                totalScrollable
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


        /*
         * If the bottom has been reached,
         * force 100%.
         */

        if (
            rect.bottom <=
            viewportHeight + 20
        ) {

            progress =
                100;

        }


        LessonsPageState.progress =
            Math.round(
                progress
            );


        updateProgressUI();

    }


    /* ========================================================
       UPDATE PROGRESS UI
       ======================================================== */

    function updateProgressUI() {

        const progress =
            LessonsPageState.progress;


        const bar =
            $("lesson-progress-bar");


        const percent =
            $("lesson-progress-percent");


        const text =
            $("lesson-progress-text");


        if (bar) {

            bar.style.width =
                progress + "%";

        }


        if (percent) {

            percent.textContent =
                progress + "%";

        }


        if (text) {

            if (
                progress === 0
            ) {

                text.textContent =
                    "Start reading to track your progress.";

            } else if (
                progress < 100
            ) {

                text.textContent =
                    "Keep reading. You are making progress.";

            } else {

                text.textContent =
                    "You have reached the end of this lesson.";

            }

        }

    }


    /* ========================================================
       AUTH CHECK
       ======================================================== */

    function isAuthenticated() {

        return Boolean(

            window.AppState &&

            window.AppState.authenticated === true &&

            window.AppState.token

        );

    }


    /* ========================================================
       REQUIRE LOGIN
       ======================================================== */

    function requireLogin(
        actionMessage
    ) {

        if (
            isAuthenticated()
        ) {

            return true;

        }


        openLoginRequiredModal(
            actionMessage
        );


        return false;

    }


    /* ========================================================
       LOGIN REQUIRED MODAL
       ======================================================== */

    function openLoginRequiredModal(
        actionMessage
    ) {

        const title =
            "Login Required";


        const message =
            actionMessage ||
            "Please log in or create an account to continue.";


        /*
         * Try existing Modal API first.
         */

        if (
            window.Modal &&
            typeof window.Modal.open === "function"
        ) {

            window.Modal.open({

                title:
                    title,

                content: `

                    <div class="login-required-modal">

                        <div class="login-required-icon">

                            <i data-lucide="lock-keyhole"></i>

                        </div>

                        <p>

                            ${escapeHTML(
                                message
                            )}

                        </p>

                        <div class="login-required-actions">

                            <button
                                id="modal-login-action"
                                class="primary-button"
                                type="button"
                            >

                                <i data-lucide="log-in"></i>

                                Login

                            </button>


                            <button
                                id="modal-register-action"
                                class="secondary-button"
                                type="button"
                            >

                                Create Account

                            </button>

                        </div>

                    </div>

                `

            });


            setTimeout(
                function () {

                    refreshIcons();

                    bindLoginModalButtons();

                },
                0
            );


            return;

        }


        /*
         * Fallback:
         * Use the existing global auth modal if available.
         */

        if (
            typeof window.openAuthModal ===
            "function"
        ) {

            window.openAuthModal(
                "login"
            );

            return;

        }


        /*
         * Last fallback:
         */

        if (
            typeof window.showLoginModal ===
            "function"
        ) {

            window.showLoginModal();

            return;

        }


        /*
         * If the application has a router,
         * navigate to profile/login area.
         */

        if (
            window.AFC &&
            window.AFC.Router &&
            typeof window.AFC.Router.navigate ===
            "function"
        ) {

            window.AFC.Router.navigate(
                "profile"
            );

            return;

        }


        alert(
            message
        );

    }


    /* ========================================================
       BIND LOGIN MODAL BUTTONS
       ======================================================== */

    function bindLoginModalButtons() {

        const loginButton =
            $("modal-login-action");


        const registerButton =
            $("modal-register-action");


        if (loginButton) {

            loginButton.addEventListener(
                "click",
                function () {

                    closeCurrentModal();

                    openAuthScreen(
                        "login"
                    );

                }
            );

        }


        if (registerButton) {

            registerButton.addEventListener(
                "click",
                function () {

                    closeCurrentModal();

                    openAuthScreen(
                        "register"
                    );

                }
            );

        }

    }


    /* ========================================================
       CLOSE MODAL
       ======================================================== */

    function closeCurrentModal() {

        if (
            window.Modal &&
            typeof window.Modal.close ===
            "function"
        ) {

            window.Modal.close();

        }

    }


    /* ========================================================
       OPEN AUTH SCREEN
       ======================================================== */

    function openAuthScreen(
        mode
    ) {

        /*
         * Try several safe integration points.
         *
         * This allows the file to work with
         * the existing auth.js implementation.
         */

        if (
            typeof window.openAuthModal ===
            "function"
        ) {

            window.openAuthModal(
                mode
            );

            return;

        }


        if (
            mode === "register" &&
            typeof window.showRegisterModal ===
            "function"
        ) {

            window.showRegisterModal();

            return;

        }


        if (
            mode === "login" &&
            typeof window.showLoginModal ===
            "function"
        ) {

            window.showLoginModal();

            return;

        }


        /*
         * If auth.js exposes an AFC Auth object.
         */

        if (
            window.AFC &&
            window.AFC.Auth &&
            typeof window.AFC.Auth.open ===
            "function"
        ) {

            window.AFC.Auth.open(
                mode
            );

            return;

        }


        console.warn(
            "No authentication modal function was found."
        );

    }


    /* ========================================================
       CONFIRM LESSON READ
       ======================================================== */

    function handleConfirmRead() {

        const allowed =
            requireLogin(
                "Please log in or create an account to confirm that you have read this lesson."
            );


        if (!allowed) {

            return;

        }


        if (
            LessonsPageState.progress < 70
        ) {

            showToastMessage(
                "Please continue reading the lesson before confirming completion.",
                "info"
            );

            return;

        }


        LessonsPageState.confirmedRead =
            true;


        const button =
            $("confirm-lesson-read-button");


        if (button) {

            button.disabled =
                true;


            button.innerHTML = `

                <i data-lucide="check-circle-2"></i>

                Lesson Read

            `;


            refreshIcons();

        }


        showToastMessage(
            "Lesson reading confirmed. You can now submit your reflection.",
            "success"
        );


        const reflectionSection =
            $("reflection-section");


        if (reflectionSection) {

            setTimeout(
                function () {

                    reflectionSection.scrollIntoView({

                        behavior:
                            "smooth",

                        block:
                            "start"

                    });

                },
                300
            );

        }

    }


    /* ========================================================
       SUBMIT REFLECTION
       ======================================================== */

    async function handleSubmitReflection() {

        const allowed =
            requireLogin(
                "Please log in or create an account to submit your reflection."
            );


        if (!allowed) {

            return;

        }


        if (
            !LessonsPageState.confirmedRead
        ) {

            showToastMessage(
                "Please confirm that you have read the lesson first.",
                "info"
            );

            return;

        }


        const input =
            $("lesson-reflection-input");


        const reflection =
            input
                ? input.value.trim()
                : "";


        if (!reflection) {

            showToastMessage(
                "Please write your reflection before submitting.",
                "error"
            );

            return;

        }


        const lesson =
            LessonsPageState.currentLesson;


        if (!lesson) {

            showToastMessage(
                "No lesson is currently selected.",
                "error"
            );

            return;

        }


        const button =
            $("submit-reflection-button");


        const originalHTML =
            button
                ? button.innerHTML
                : "";


        if (button) {

            button.disabled =
                true;


            button.innerHTML = `

                <i data-lucide="loader-circle"></i>

                Submitting...

            `;


            refreshIcons();

        }


        try {

            if (
                !window.AFC ||
                !window.AFC.MemberAPI ||
                typeof window.AFC.MemberAPI.submitReflection !==
                "function"
            ) {

                throw new Error(
                    "Reflection service is not available."
                );

            }


            const response =
                await window.AFC.MemberAPI.submitReflection(

                    {

                        lesson_id:
                            lesson.id,

                        reflection:
                            reflection

                    },

                    window.AppState.token

                );


            console.log(
                "AFC REFLECTION RESPONSE:",
                response
            );


            if (
                !response ||
                response.success !== true
            ) {

                throw new Error(

                    response &&
                    response.message
                        ? response.message
                        : "Unable to submit reflection."

                );

            }


            LessonsPageState.reflectionSubmitted =
                true;


            if (input) {

                input.disabled =
                    true;

            }


            if (button) {

                button.innerHTML = `

                    <i data-lucide="check-circle-2"></i>

                    Reflection Submitted

                `;

            }


            refreshIcons();


            const status =
                $("reflection-status");


            if (status) {

                status.textContent =
                    "Your reflection has been submitted successfully.";

            }


            unlockQuiz();


            showToastMessage(
                "Reflection submitted successfully. Your quiz is now available.",
                "success"
            );


        } catch (error) {

            console.error(
                "AFC REFLECTION ERROR:",
                error
            );


            if (button) {

                button.disabled =
                    false;

                button.innerHTML =
                    originalHTML;

                refreshIcons();

            }


            showToastMessage(
                error.message ||
                "Unable to submit reflection.",
                "error"
            );

        }

    }


    /* ========================================================
       UNLOCK QUIZ
       ======================================================== */

    function unlockQuiz() {

        const button =
            $("take-lesson-quiz-button");


        const message =
            $("quiz-lock-message");


        if (button) {

            button.disabled =
                false;


            button.innerHTML = `

                <i data-lucide="play"></i>

                <span>
                    Take Quiz
                </span>

            `;

        }


        if (message) {

            message.textContent =
                "You have completed the reflection. You can now take the quiz.";

        }


        refreshIcons();

    }


    /* ========================================================
       TAKE QUIZ
       ======================================================== */

    function handleTakeQuiz() {

        const allowed =
            requireLogin(
                "Please log in or create an account to take the lesson quiz."
            );


        if (!allowed) {

            return;

        }


        if (
            !LessonsPageState.reflectionSubmitted
        ) {

            showToastMessage(
                "Please submit your reflection before taking the quiz.",
                "info"
            );

            return;

        }


        const lesson =
            LessonsPageState.currentLesson;


        if (!lesson) {

            return;

        }


        /*
         * Store the current lesson so the quiz page
         * knows which lesson is active.
         */

        if (
            window.setAppState
        ) {

            window.setAppState({

                currentLesson:
                    lesson

            });

        }


        /*
         * Navigate through existing router.
         */

        if (
            window.Router &&
            typeof window.Router.navigate ===
            "function"
        ) {

            window.Router.navigate(
                "quiz",
                {

                    lesson_id:
                        lesson.id,

                    quiz_id:
                        lesson.quizId

                }
            );

            return;

        }


        if (
            window.AFC &&
            window.AFC.Router &&
            typeof window.AFC.Router.navigate ===
            "function"
        ) {

            window.AFC.Router.navigate(
                "quiz"
            );

            return;

        }


        /*
         * Dispatch an event as a fallback.
         */

        window.dispatchEvent(

            new CustomEvent(
                "openquiz",
                {

                    detail: {

                        lesson:
                            lesson

                    }

                }
            )

        );

    }


    /* ========================================================
       TOAST
       ======================================================== */

    function showToastMessage(
        message,
        type
    ) {

        /*
         * Use existing UI helper if available.
         */

        if (
            window.UI &&
            typeof window.UI.showToast ===
            "function"
        ) {

            window.UI.showToast(
                message,
                type
            );

            return;

        }


        /*
         * Use global toast function if available.
         */

        if (
            typeof window.showToast ===
            "function"
        ) {

            window.showToast(
                message,
                type
            );

            return;

        }


        console.log(
            "[" +
            (type || "info") +
            "]",
            message
        );

    }


    /* ========================================================
       TEXT TRUNCATION
       ======================================================== */

    function truncateText(
        text,
        maxLength
    ) {

        text =
            String(
                text || ""
            );


        if (
            text.length <=
            maxLength
        ) {

            return text;

        }


        return (
            text.substring(
                0,
                maxLength
            )
            +
            "..."
        );

    }


    /* ========================================================
       PAGE CLEANUP
       ======================================================== */

    function cleanupLessonsPage() {

        stopProgressTracking();

    }


    /* ========================================================
       PUBLIC PAGE API
       ======================================================== */

    window.LessonsPage = {

        load:
            loadLessons,

        render:
            renderLessonsHub,

        openLesson:
            openLessonById,

        cleanup:
            cleanupLessonsPage

    };


    /* ========================================================
       GLOBAL ALIASES
       ======================================================== */

    window.loadLessonsPage =
        loadLessons;


    window.openLesson =
        openLessonById;


    /* ========================================================
       DEBUG
       ======================================================== */

    console.log(
        "AFC Isiwu Youth Portal lessons module loaded."
    );


})();
