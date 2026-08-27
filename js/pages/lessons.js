/**
 * ============================================================
 * AFC ISIU YOUTH PORTAL
 * PHASE 4A — LESSONS MODULE
 * ============================================================
 */

"use strict";


const LessonsPage = (function () {


    /* ========================================================
       1. STATE
       ======================================================== */

    let lessons = [];

    let currentLessonId = null;


    /* ========================================================
       2. GET RESPONSE DATA
       ======================================================== */

    function getResponseData(response) {

        if (
            !response
        ) {

            return null;
        }


        /*
         * Standard backend response.
         *
         * Expected:
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


        /*
         * Fallback.
         */

        return response;
    }


    /* ========================================================
       3. ESCAPE HTML
       ======================================================== */

    function escapeHtml(value) {

        return String(
            value || ""
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
       4. FORMAT DATE
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


    /* ========================================================
       5. GET LESSONS
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

            return [];
        }


        return data;
    }


    /* ========================================================
       6. GET SINGLE LESSON
       ======================================================== */

    async function fetchLesson(
        lessonId
    ) {

        const response =
            await API.get(
                "getLesson",
                {
                    lesson_id:
                        lessonId
                }
            );


        return getResponseData(
            response
        );
    }


    /* ========================================================
       7. SORT LESSONS
       ======================================================== */

    function sortLessons(
        lessonList
    ) {

        return [
            ...lessonList
        ]

        .sort(
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
       8. LOADING SCREEN
       ======================================================== */

    function renderLoading() {

        return `
            <div class="lessons-page">

                <div class="lessons-intro">

                    <h2>
                        Weekly Lessons
                    </h2>

                    <p>
                        Grow deeper in God's Word.
                    </p>

                </div>


                <div
                    class="
                        skeleton
                        skeleton-featured
                    "
                ></div>


                <section
                    class="lessons-section"
                >

                    <div
                        class="lessons-grid"
                    >

                        ${Array(6)
                            .fill("")
                            .map(
                                function () {

                                    return `
                                        <div
                                            class="
                                                skeleton
                                                skeleton-card
                                            "
                                        ></div>
                                    `;
                                }
                            )
                            .join("")
                        }

                    </div>

                </section>

            </div>
        `;
    }


    /* ========================================================
       9. EMPTY STATE
       ======================================================== */

    function renderEmpty() {

        return `
            <div
                class="lessons-state"
            >

                <div
                    class="lessons-state-icon"
                >
                    📖
                </div>


                <h3>
                    No lessons yet
                </h3>


                <p>
                    There are currently no
                    published lessons available.
                    Please check back later.
                </p>

            </div>
        `;
    }


    /* ========================================================
       10. ERROR STATE
       ======================================================== */

    function renderError(
        message
    ) {

        return `
            <div
                class="lessons-state"
            >

                <div
                    class="lessons-state-icon"
                >
                    !
                </div>


                <h3>
                    Unable to load lessons
                </h3>


                <p>
                    ${escapeHtml(
                        message ||
                        "Something went wrong while loading the lessons."
                    )}
                </p>


                <button
                    class="lessons-retry"
                    id="retryLessonsButton"
                    type="button"
                >
                    Try Again
                </button>

            </div>
        `;
    }


    /* ========================================================
       11. LESSON CARD
       ======================================================== */

    function renderLessonCard(
        lesson
    ) {

        const lessonId =
            escapeHtml(
                lesson.lesson_id
            );


        const week =
            lesson.week_number
                ? `Week ${escapeHtml(
                    lesson.week_number
                )}`
                : "Weekly Lesson";


        const type =
            lesson.lesson_type ||
            "Youth Lesson";


        return `
            <article
                class="lesson-card"
            >

                <div
                    class="lesson-card-top"
                >

                    <span
                        class="lesson-week"
                    >
                        ${week}
                    </span>


                    <span
                        class="lesson-type"
                    >
                        ${escapeHtml(type)}
                    </span>

                </div>


                <h4>
                    ${escapeHtml(
                        lesson.title ||
                        "Untitled Lesson"
                    )}
                </h4>


                <p>
                    ${escapeHtml(
                        lesson.description ||
                        "Open this lesson to begin reading."
                    )}
                </p>


                <div
                    class="lesson-card-footer"
                >

                    <span
                        class="lesson-date"
                    >
                        ${escapeHtml(
                            formatLessonDate(
                                lesson.lesson_date
                            )
                        )}
                    </span>


                    <button
                        class="lesson-read-link"
                        type="button"
                        data-open-lesson="${lessonId}"
                    >
                        Read →
                    </button>

                </div>

            </article>
        `;
    }


    /* ========================================================
       12. LESSONS HUB
       ======================================================== */

    function renderLessonsHub(
        lessonList
    ) {

        if (
            !lessonList ||
            lessonList.length === 0
        ) {

            return renderEmpty();
        }


        const sortedLessons =
            sortLessons(
                lessonList
            );


        const featured =
            sortedLessons[0];


        const previousLessons =
            sortedLessons.slice(
                1
            );


        return `
            <div
                class="lessons-page"
            >

                <div
                    class="lessons-intro"
                >

                    <h2>
                        Weekly Lessons
                    </h2>

                    <p>
                        Explore God's Word,
                        reflect on what you learn
                        and grow in your walk with Christ.
                    </p>

                </div>


                <!-- FEATURED LESSON -->

                <article
                    class="featured-lesson"
                >

                    <div
                        class="
                            featured-lesson-content
                        "
                    >

                        <span
                            class="lesson-badge"
                        >
                            Current Lesson
                        </span>


                        <h3>
                            ${escapeHtml(
                                featured.title
                            )}
                        </h3>


                        <p>
                            ${escapeHtml(
                                featured.description ||
                                "Start reading this week's lesson."
                            )}
                        </p>


                        <div
                            class="
                                featured-lesson-footer
                            "
                        >

                            <div
                                class="lesson-meta"
                            >

                                ${
                                    featured.week_number
                                        ? `
                                            <span>
                                                Week
                                                ${escapeHtml(
                                                    featured.week_number
                                                )}
                                            </span>
                                        `
                                        : ""
                                }


                                ${
                                    featured.lesson_type
                                        ? `
                                            <span>
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
                                                ${escapeHtml(
                                                    formatLessonDate(
                                                        featured.lesson_date
                                                    )
                                                )}
                                            </span>
                                        `
                                        : ""
                                }

                            </div>


                            <button
                                class="
                                    lesson-primary-button
                                "
                                type="button"
                                data-open-lesson="
                                    ${escapeHtml(
                                        featured.lesson_id
                                    )}
                                "
                            >
                                Start Reading
                                <span>→</span>
                            </button>

                        </div>

                    </div>

                </article>


                <!-- PREVIOUS LESSONS -->

                <section
                    class="lessons-section"
                >

                    <div
                        class="
                            lessons-section-header
                        "
                    >

                        <div>

                            <h3>
                                More Lessons
                            </h3>

                            <p>
                                Continue learning
                                from previous weeks.
                            </p>

                        </div>

                    </div>


                    <div
                        class="lessons-grid"
                    >

                        ${
                            previousLessons.length
                                ? previousLessons
                                    .map(
                                        renderLessonCard
                                    )
                                    .join("")
                                : `
                                    <p
                                        style="
                                            color: var(--muted);
                                            font-size: .8rem;
                                        "
                                    >
                                        More lessons will
                                        appear here.
                                    </p>
                                `
                        }

                    </div>

                </section>

            </div>
        `;
    }


    /* ========================================================
       13. FORMAT LESSON CONTENT
       ======================================================== */

    function formatLessonContent(
        content
    ) {

        if (!content) {

            return "";
        }


        /*
         * Escape content first.
         *
         * Then convert line breaks
         * into paragraphs.
         */

        const safeContent =
            escapeHtml(
                content
            );


        return safeContent

            .split(
                /\\n\\s*\\n/
            )

            .map(
                function (
                    paragraph
                ) {

                    const text =
                        paragraph
                            .trim()
                            .replace(
                                /\\n/g,
                                "<br>"
                            );


                    if (!text) {

                        return "";
                    }


                    return `
                        <p>
                            ${text}
                        </p>
                    `;
                }
            )

            .join("");
    }


    /* ========================================================
       14. LESSON READER
       ======================================================== */

    function renderLessonReader(
        lessonData
    ) {

        if (
            !lessonData ||
            !lessonData.lesson
        ) {

            return renderError(
                "The lesson could not be loaded."
            );
        }


        const lesson =
            lessonData.lesson;


        const sections =
            Array.isArray(
                lessonData.sections
            )
                ? lessonData.sections
                : [];


        return `
            <article
                class="lesson-reader"
            >

                <button
                    class="
                        lesson-reader-back
                    "
                    id="backToLessonsButton"
                    type="button"
                >
                    ← Back to Lessons
                </button>


                <div
                    class="
                        lesson-reader-header
                    "
                >

                    <span
                        class="lesson-badge"
                    >
                        ${
                            lesson.week_number
                                ? `Week ${escapeHtml(
                                    lesson.week_number
                                )}`
                                : "Weekly Lesson"
                        }
                    </span>


                    <h2>
                        ${escapeHtml(
                            lesson.title
                        )}
                    </h2>


                    ${
                        lesson.description
                            ? `
                                <p
                                    class="
                                        lesson-reader-description
                                    "
                                >
                                    ${escapeHtml(
                                        lesson.description
                                    )}
                                </p>
                            `
                            : ""
                    }


                    <div
                        class="
                            lesson-meta
                        "
                        style="
                            margin-top: 17px;
                        "
                    >

                        ${
                            lesson.lesson_type
                                ? `
                                    <span>
                                        ${escapeHtml(
                                            lesson.lesson_type
                                        )}
                                    </span>
                                `
                                : ""
                        }


                        ${
                            lesson.lesson_date
                                ? `
                                    <span>
                                        ${escapeHtml(
                                            formatLessonDate(
                                                lesson.lesson_date
                                            )
                                        )}
                                    </span>
                                `
                                : ""
                        }

                    </div>

                </div>


                <div
                    class="
                        reading-progress
                    "
                >

                    <div
                        class="
                            reading-progress-bar
                        "
                        id="
                            readingProgressBar
                        "
                    ></div>

                </div>


                <div
                    class="
                        lesson-content
                    "
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
                                                class="
                                                    lesson-section
                                                "
                                            >

                                                <span
                                                    class="
                                                        lesson-section-number
                                                    "
                                                >
                                                    ${
                                                        section.section_number ||
                                                        index + 1
                                                    }
                                                </span>


                                                ${
                                                    section.title
                                                        ? `
                                                            <h3>
                                                                ${escapeHtml(
                                                                    section.title
                                                                )}
                                                            </h3>
                                                        `
                                                        : ""
                                                }


                                                <div
                                                    class="
                                                        lesson-section-content
                                                    "
                                                >
                                                    ${formatLessonContent(
                                                        section.content
                                                    )}
                                                </div>

                                            </section>
                                        `;
                                    }
                                )
                                .join("")
                            : `
                                <div
                                    class="
                                        lessons-state
                                    "
                                >

                                    <div
                                        class="
                                            lessons-state-icon
                                        "
                                    >
                                        📖
                                    </div>


                                    <h3>
                                        Lesson content
                                        is coming soon
                                    </h3>


                                    <p>
                                        This lesson has
                                        been published,
                                        but its sections
                                        are not yet available.
                                    </p>

                                </div>
                            `
                    }

                </div>


                <section
                    class="
                        lesson-completion
                    "
                >

                    <h3>
                        Finished reading?
                    </h3>


                    <p>
                        When you have carefully read
                        this lesson, continue to the
                        reflection section.
                    </p>


                    <button
                        class="
                            lesson-primary-button
                        "
                        id="
                            lessonReadCompleteButton
                        "
                        type="button"
                    >
                        I've Read This Lesson
                        <span>→</span>
                    </button>

                </section>

            </article>
        `;
    }


    /* ========================================================
       15. READING PROGRESS
       ======================================================== */

    function initialiseReadingProgress() {

        const progressBar =
            document.getElementById(
                "readingProgressBar"
            );


        if (!progressBar) {

            return;
        }


        function updateProgress() {

            const scrollTop =
                window.scrollY;


            const documentHeight =
                document.documentElement
                    .scrollHeight;


            const viewportHeight =
                window.innerHeight;


            const availableHeight =
                documentHeight -
                viewportHeight;


            let progress =
                0;


            if (
                availableHeight > 0
            ) {

                progress =
                    (
                        scrollTop /
                        availableHeight
                    ) * 100;
            }


            progress =
                Math.max(
                    0,
                    Math.min(
                        progress,
                        100
                    )
                );


            progressBar.style.width =
                `${progress}%`;
        }


        window.addEventListener(
            "scroll",
            updateProgress,
            {
                passive:
                    true
            }
        );


        updateProgress();
    }


    /* ========================================================
       16. RENDER LESSONS
       ======================================================== */

    async function render(
        container
    ) {

        if (!container) {

            return;
        }


        currentLessonId =
            null;


        container.innerHTML =
            renderLoading();


        try {

            lessons =
                await fetchLessons();


            container.innerHTML =
                renderLessonsHub(
                    lessons
                );


            bindHubEvents(
                container
            );


        } catch (error) {

            console.error(
                "[LESSONS ERROR]",
                error
            );


            container.innerHTML =
                renderError(
                    error.message
                );


            bindErrorEvents(
                container
            );
        }
    }


    /* ========================================================
       17. OPEN LESSON
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


        currentLessonId =
            lessonId;


        container.innerHTML =
            renderLoading();


        try {

            const lessonData =
                await fetchLesson(
                    lessonId
                );


            container.innerHTML =
                renderLessonReader(
                    lessonData
                );


            bindReaderEvents(
                container
            );


            initialiseReadingProgress();


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
                "[GET LESSON ERROR]",
                error
            );


            container.innerHTML =
                renderError(
                    error.message
                );


            bindErrorEvents(
                container
            );
        }
    }


    /* ========================================================
       18. HUB EVENTS
       ======================================================== */

    function bindHubEvents(
        container
    ) {

        const lessonButtons =
            container.querySelectorAll(
                "[data-open-lesson]"
            );


        lessonButtons.forEach(
            function (
                button
            ) {

                button.addEventListener(
                    "click",
                    function () {

                        const lessonId =
                            button.dataset
                                .openLesson;


                        openLesson(
                            lessonId,
                            container
                        );
                    }
                );
            }
        );
    }


    /* ========================================================
       19. ERROR EVENTS
       ======================================================== */

    function bindErrorEvents(
        container
    ) {

        const retryButton =
            container.querySelector(
                "#retryLessonsButton"
            );


        if (
            retryButton
        ) {

            retryButton.addEventListener(
                "click",
                function () {

                    render(
                        container
                    );
                }
            );
        }
    }


    /* ========================================================
       20. READER EVENTS
       ======================================================== */

    function bindReaderEvents(
        container
    ) {

        const backButton =
            container.querySelector(
                "#backToLessonsButton"
            );


        const completeButton =
            container.querySelector(
                "#lessonReadCompleteButton"
            );


        if (
            backButton
        ) {

            backButton.addEventListener(
                "click",
                function () {

                    render(
                        container
                    );
                }
            );
        }


        if (
            completeButton
        ) {

            completeButton.addEventListener(
                "click",
                function () {

                    handleLessonCompletion(
                        currentLessonId
                    );
                }
            );
        }
    }


    /* ========================================================
       21. LESSON COMPLETION
       ======================================================== */

    function handleLessonCompletion(
        lessonId
    ) {

        /*
         * Phase 4B will handle:
         *
         * - authentication check
         * - reflection status
         * - reflection questions
         * - reflection submission
         * - quiz unlocking
         */

        console.log(
            "Lesson completed:",
            lessonId
        );


        alert(
            "Great! The reflection step will be connected next."
        );
    }


    /* ========================================================
       22. PUBLIC API
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
