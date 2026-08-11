const calendar = document.getElementById("event-calendar");

let events = [];
let currentDate = new Date();


// ==================================================
// FULLSCREEN IMAGE VIEWER
// ==================================================

function createFullscreenViewer() {

    // Prevent creating it more than once
    if (document.getElementById("image-viewer")) {
        return;
    }

    const viewer = document.createElement("div");

    viewer.id = "image-viewer";
    viewer.className = "image-viewer";

    viewer.innerHTML = `

        <button
            type="button"
            class="image-viewer-close"
            id="image-viewer-close"
            aria-label="Close full screen image"
        >
            ×
        </button>

        <img
            id="fullscreen-image"
            class="fullscreen-image"
            src=""
            alt=""
        >

    `;

    document.body.appendChild(viewer);


    // --------------------------------------------------
    // CLOSE BUTTON
    // --------------------------------------------------

    const closeButton =
        document.getElementById("image-viewer-close");

    closeButton.addEventListener(
        "click",
        closeFullscreenImage
    );


    // --------------------------------------------------
    // CLICK OUTSIDE IMAGE TO CLOSE
    // --------------------------------------------------

    viewer.addEventListener(
        "click",
        function (event) {

            if (event.target === viewer) {
                closeFullscreenImage();
            }

        }
    );


    // --------------------------------------------------
    // ESCAPE KEY TO CLOSE
    // --------------------------------------------------

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                viewer.classList.contains("active")
            ) {
                closeFullscreenImage();
            }

        }
    );
}


// ==================================================
// OPEN FULLSCREEN IMAGE
// ==================================================

function openFullscreenImage(src, alt) {

    const viewer =
        document.getElementById("image-viewer");

    const fullscreenImage =
        document.getElementById("fullscreen-image");


    fullscreenImage.src = src;

    fullscreenImage.alt = alt;


    viewer.classList.add("active");


    // Prevent the page underneath from scrolling
    document.body.classList.add("image-viewer-open");


    // Put keyboard focus on close button
    document
        .getElementById("image-viewer-close")
        .focus();
}


// ==================================================
// CLOSE FULLSCREEN IMAGE
// ==================================================

function closeFullscreenImage() {

    const viewer =
        document.getElementById("image-viewer");

    const fullscreenImage =
        document.getElementById("fullscreen-image");


    viewer.classList.remove("active");


    document.body.classList.remove(
        "image-viewer-open"
    );


    // Clear image after closing
    fullscreenImage.src = "";
    fullscreenImage.alt = "";
}


// ==================================================
// LOAD EVENTS
// ==================================================

async function loadEvents() {

    try {

        const response =
            await fetch("events.json");


        if (!response.ok) {

            throw new Error(
                "Could not load events.json"
            );

        }


        events =
            await response.json();


        // Create fullscreen viewer
        createFullscreenViewer();


        // Render calendar
        renderCalendar();


    } catch (error) {

        console.error(
            "Error loading events:",
            error
        );


        calendar.innerHTML = `

            <p class="calendar-error">
                Unable to load event calendar.
            </p>

        `;
    }
}


// ==================================================
// RENDER CALENDAR
// ==================================================

function renderCalendar() {

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    const monthName =
        currentDate.toLocaleString(
            "default",
            {
                month: "long"
            }
        );


    // --------------------------------------------------
    // FIRST DAY OF MONTH
    // --------------------------------------------------

    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    // --------------------------------------------------
    // NUMBER OF DAYS IN MONTH
    // --------------------------------------------------

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    // ==================================================
    // CREATE CALENDAR STRUCTURE
    // ==================================================

    calendar.innerHTML = `

        <div class="calendar-header">

            <button
                class="calendar-button"
                id="previous-month"
                aria-label="Previous month"
                type="button"
            >
                ←
            </button>


            <h3>
                ${monthName} ${year}
            </h3>


            <button
                class="calendar-button"
                id="next-month"
                aria-label="Next month"
                type="button"
            >
                →
            </button>

        </div>


        <div class="calendar-weekdays">

            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>

        </div>


        <div
            class="calendar-grid"
            id="calendar-grid"
        ></div>

    `;


    const grid =
        document.getElementById(
            "calendar-grid"
        );


    // ==================================================
    // EMPTY DAYS BEFORE FIRST DAY
    // ==================================================

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const emptyDay =
            document.createElement("div");


        emptyDay.classList.add(
            "calendar-day",
            "empty-day"
        );


        grid.appendChild(
            emptyDay
        );
    }


    // ==================================================
    // CREATE DAYS
    // ==================================================

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dayElement =
            document.createElement("div");


        dayElement.classList.add(
            "calendar-day"
        );


        // --------------------------------------------------
        // CREATE DATE STRING
        // --------------------------------------------------

        const dateString =
            `${year}-${String(
                month + 1
            ).padStart(2, "0")}-${String(
                day
            ).padStart(2, "0")}`;


        // --------------------------------------------------
        // CHECK WHETHER TODAY
        // --------------------------------------------------

        const today =
            new Date();


        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {

            dayElement.classList.add(
                "today"
            );
        }


        // --------------------------------------------------
        // DAY NUMBER
        // --------------------------------------------------

        const dayNumber =
            document.createElement("div");


        dayNumber.classList.add(
            "day-number"
        );


        dayNumber.textContent =
            day;


        dayElement.appendChild(
            dayNumber
        );


        // ==================================================
        // FIND EVENTS FOR THIS DAY
        // ==================================================

        const dayEvents =
            events.filter(
                event =>
                    event.date === dateString
            );


        // ==================================================
        // ADD EVENTS
        // ==================================================

        dayEvents.forEach(
            event => {

                const eventElement =
                    document.createElement("div");


                eventElement.classList.add(
                    "calendar-event"
                );


                // ==========================================
                // EVENT FLYER
                // ==========================================

                if (event.flyer) {

                    const flyer =
                        document.createElement("img");


                    flyer.src =
                        event.flyer;


                    flyer.alt =
                        `${event.title} flyer`;


                    flyer.classList.add(
                        "event-flyer"
                    );


                    // --------------------------------------------------
                    // MAKE FLYER CLICKABLE
                    // --------------------------------------------------

                    flyer.addEventListener(
                        "click",
                        function () {

                            openFullscreenImage(
                                event.flyer,
                                `${event.title} flyer`
                            );

                        }
                    );


                    // Accessibility
                    flyer.tabIndex = 0;


                    flyer.addEventListener(
                        "keydown",
                        function (keyboardEvent) {

                            if (
                                keyboardEvent.key === "Enter" ||
                                keyboardEvent.key === " "
                            ) {

                                keyboardEvent.preventDefault();

                                openFullscreenImage(
                                    event.flyer,
                                    `${event.title} flyer`
                                );

                            }

                        }
                    );


                    eventElement.appendChild(
                        flyer
                    );
                }


                // ==================================================
                // EVENT INFORMATION
                // ==================================================

                const eventInfo =
                    document.createElement("div");


                eventInfo.classList.add(
                    "event-info"
                );


                // --------------------------------------------------
                // TITLE
                // --------------------------------------------------

                const title =
                    document.createElement("strong");


                title.textContent =
                    event.title || "";


                eventInfo.appendChild(
                    title
                );


                // --------------------------------------------------
                // VENUE
                // --------------------------------------------------

                if (event.venue) {

                    const venue =
                        document.createElement("span");


                    venue.textContent =
                        event.venue;


                    eventInfo.appendChild(
                        venue
                    );
                }


                // --------------------------------------------------
                // TIME
                // --------------------------------------------------

                if (event.time) {

                    const time =
                        document.createElement("span");


                    time.textContent =
                        event.time;


                    eventInfo.appendChild(
                        time
                    );
                }


                eventElement.appendChild(
                    eventInfo
                );


                dayElement.appendChild(
                    eventElement
                );
            }
        );


        // ==================================================
        // ADD DAY TO GRID
        // ==================================================

        grid.appendChild(
            dayElement
        );
    }


    // ==================================================
    // ALWAYS FILL TO EXACTLY 42 CELLS
    // ==================================================

    const totalCells =
        firstDay + daysInMonth;


    const remainingCells =
        42 - totalCells;


    for (
        let i = 0;
        i < remainingCells;
        i++
    ) {

        const emptyDay =
            document.createElement("div");


        emptyDay.classList.add(
            "calendar-day",
            "empty-day"
        );


        grid.appendChild(
            emptyDay
        );
    }


    // ==================================================
    // MONTH NAVIGATION
    // ==================================================

    document
        .getElementById(
            "previous-month"
        )
        .addEventListener(
            "click",
            () => {

                currentDate.setMonth(
                    currentDate.getMonth() - 1
                );


                renderCalendar();

            }
        );


    document
        .getElementById(
            "next-month"
        )
        .addEventListener(
            "click",
            () => {

                currentDate.setMonth(
                    currentDate.getMonth() + 1
                );


                renderCalendar();

            }
        );
}


// ==================================================
// START CALENDAR
// ==================================================

loadEvents();