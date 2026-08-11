const calendar = document.getElementById("event-calendar");

let events = [];
let currentDate = new Date();


// --------------------------------------------------
// LOAD EVENTS
// --------------------------------------------------

async function loadEvents() {
    try {
        const response = await fetch("events.json");

        if (!response.ok) {
            throw new Error("Could not load events.json");
        }

        events = await response.json();

        renderCalendar();

    } catch (error) {
        console.error("Error loading events:", error);

        calendar.innerHTML = `
            <p class="calendar-error">
                Unable to load event calendar.
            </p>
        `;
    }
}


// --------------------------------------------------
// RENDER CALENDAR
// --------------------------------------------------

function renderCalendar() {

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthName = currentDate.toLocaleString("default", {
        month: "long"
    });

    // First day of month
    const firstDay = new Date(year, month, 1).getDay();

    // Number of days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create calendar
    calendar.innerHTML = `

        <div class="calendar-header">

            <button
                class="calendar-button"
                id="previous-month"
                aria-label="Previous month"
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


        <div class="calendar-grid" id="calendar-grid"></div>

    `;


    const grid = document.getElementById("calendar-grid");


    // --------------------------------------------------
    // EMPTY DAYS BEFORE FIRST DAY
    // --------------------------------------------------

    for (let i = 0; i < firstDay; i++) {

        const emptyDay = document.createElement("div");

        emptyDay.classList.add(
            "calendar-day",
            "empty-day"
        );

        grid.appendChild(emptyDay);
    }


    // --------------------------------------------------
    // DAYS
    // --------------------------------------------------

    for (let day = 1; day <= daysInMonth; day++) {

        const dayElement = document.createElement("div");

        dayElement.classList.add("calendar-day");


        // Create date string
        const dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


        // Check whether today
        const today = new Date();

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            dayElement.classList.add("today");
        }


        // Day number
        const dayNumber = document.createElement("div");

        dayNumber.classList.add("day-number");

        dayNumber.textContent = day;

        dayElement.appendChild(dayNumber);


        // Find events for this day
        const dayEvents = events.filter(
            event => event.date === dateString
        );


        // Add events
        dayEvents.forEach(event => {

            const eventElement =
                document.createElement("div");

            eventElement.classList.add("calendar-event");


            if (event.flyer) {

                const flyer =
                    document.createElement("img");

                flyer.src = event.flyer;

                flyer.alt = `${event.title} flyer`;

                flyer.classList.add("event-flyer");

                eventElement.appendChild(flyer);
            }


            const eventInfo =
                document.createElement("div");

            eventInfo.classList.add("event-info");


            eventInfo.innerHTML = `

                <strong>${event.title}</strong>

                ${
                    event.venue
                    ? `<span>${event.venue}</span>`
                    : ""
                }

                ${
                    event.time
                    ? `<span>${event.time}</span>`
                    : ""
                }

            `;


            eventElement.appendChild(eventInfo);

            dayElement.appendChild(eventElement);
        });


        grid.appendChild(dayElement);
    }


    // --------------------------------------------------
    // MONTH NAVIGATION
    // --------------------------------------------------

    document
        .getElementById("previous-month")
        .addEventListener("click", () => {

            currentDate.setMonth(
                currentDate.getMonth() - 1
            );

            renderCalendar();
        });


    document
        .getElementById("next-month")
        .addEventListener("click", () => {

            currentDate.setMonth(
                currentDate.getMonth() + 1
            );

            renderCalendar();
        });
}


// --------------------------------------------------
// START
// --------------------------------------------------

loadEvents();