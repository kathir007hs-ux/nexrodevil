// =========================
// ADMIN LOGIN CHECK
// =========================

const adminLoggedIn =
    localStorage.getItem(
        "nexoraAdminLoggedIn"
    );

if (adminLoggedIn !== "true") {

    window.location.href =
        "admin-login.html";

}


// =========================
// DEFAULT EVENTS
// =========================

const defaultEvents = [

    {
        id: 1,
        name: "Future Tech 2026",
        category: "Technical",
        description:
            "Explore emerging technologies and the future of digital innovation.",
        date: "2026-10-15",
        time: "10:00",
        location: "Villupuram",
        capacity: 200
    },

    {
        id: 2,
        name: "Dance Fest 2026",
        category: "Cultural",
        description:
            "A celebration of music, dance and creative performances.",
        date: "2026-10-20",
        time: "16:00",
        location: "Villupuram",
        capacity: 300
    },

    {
        id: 3,
        name: "Inter College Football",
        category: "Sports",
        description:
            "Compete with colleges and experience the spirit of inter-college football.",
        date: "2026-10-25",
        time: "09:00",
        location: "Chennai",
        capacity: 250
    },

    {
        id: 4,
        name: "Web Development Workshop",
        category: "Workshop",
        description:
            "Learn modern web development through practical hands-on sessions.",
        date: "2026-11-10",
        time: "10:30",
        location: "Puducherry",
        capacity: 100
    },

    {
        id: 5,
        name: "Hackathon 2026",
        category: "Hackathon",
        description:
            "Build innovative solutions and compete with developers and creators.",
        date: "2026-12-05",
        time: "09:00",
        location: "Chennai",
        capacity: 150
    },

    {
        id: 6,
        name: "AI & ML Workshop",
        category: "Technical",
        description:
            "Discover artificial intelligence and machine learning concepts.",
        date: "2026-12-15",
        time: "10:00",
        location: "Puducherry",
        capacity: 120
    }

];


// =========================
// LOAD EVENTS
// =========================

let events =
    JSON.parse(
        localStorage.getItem(
            "nexoraAdminEvents"
        )
    );


// If no admin events exist,
// create default events

if (!events) {

    events = defaultEvents;

    saveEvents();

}


// =========================
// ELEMENTS
// =========================

const eventsContainer =
    document.getElementById(
        "eventsContainer"
    );

const eventCount =
    document.getElementById(
        "eventCount"
    );

const eventForm =
    document.getElementById(
        "eventForm"
    );

const eventFormSection =
    document.getElementById(
        "eventFormSection"
    );

const addEventBtn =
    document.getElementById(
        "addEventBtn"
    );

const closeFormBtn =
    document.getElementById(
        "closeFormBtn"
    );

const cancelBtn =
    document.getElementById(
        "cancelBtn"
    );


// =========================
// DISPLAY EVENTS
// =========================

function displayEvents() {

    eventsContainer.innerHTML = "";

    eventCount.textContent =
        events.length;


    if (events.length === 0) {

        eventsContainer.innerHTML = `

            <div class="empty-events">

                <strong>
                    NO EVENTS FOUND
                </strong>

                <span>
                    Create your first NEXORA event.
                </span>

            </div>

        `;

        return;

    }


    events.forEach(function (event) {

        const card =
            document.createElement("div");

        card.className =
            "admin-event-card";


        card.innerHTML = `

            <span class="event-category">
                ${event.category}
            </span>


            <h3>
                ${event.name}
            </h3>


            <p class="event-description">
                ${event.description}
            </p>


            <div class="event-meta">

                <div>

                    <span>
                        DATE
                    </span>

                    <strong>
                        ${formatDate(event.date)}
                    </strong>

                </div>


                <div>

                    <span>
                        TIME
                    </span>

                    <strong>
                        ${formatTime(event.time)}
                    </strong>

                </div>


                <div>

                    <span>
                        LOCATION
                    </span>

                    <strong>
                        ${event.location}
                    </strong>

                </div>


                <div>

                    <span>
                        CAPACITY
                    </span>

                    <strong>
                        ${event.capacity}
                    </strong>

                </div>

            </div>


            <div class="event-actions">

                <button
                    class="edit-btn"
                    onclick="editEvent(${event.id})">

                    EDIT

                </button>


                <button
                    class="delete-btn"
                    onclick="deleteEvent(${event.id})">

                    DELETE

                </button>

            </div>

        `;


        eventsContainer.appendChild(
            card
        );

    });

}


// =========================
// SAVE EVENTS
// =========================

function saveEvents() {

    localStorage.setItem(
        "nexoraAdminEvents",
        JSON.stringify(events)
    );

}


// =========================
// OPEN ADD FORM
// =========================

addEventBtn.addEventListener(
    "click",
    function () {

        resetForm();

        document.querySelector(
            ".form-header h2"
        ).innerHTML =
            'CREATE <span>EVENT</span>';

        eventFormSection.classList.remove(
            "hidden"
        );

        eventFormSection.scrollIntoView({
            behavior: "smooth"
        });

    }
);


// =========================
// CLOSE FORM
// =========================

function closeForm() {

    eventFormSection.classList.add(
        "hidden"
    );

    resetForm();

}


closeFormBtn.addEventListener(
    "click",
    closeForm
);


cancelBtn.addEventListener(
    "click",
    closeForm
);


// =========================
// RESET FORM
// =========================

function resetForm() {

    eventForm.reset();

    document.getElementById(
        "editEventId"
    ).value = "";

}


// =========================
// SAVE / UPDATE EVENT
// =========================

eventForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const editId =
            document.getElementById(
                "editEventId"
            ).value;


        const eventData = {

            name:
                document.getElementById(
                    "eventName"
                ).value.trim(),

            category:
                document.getElementById(
                    "eventCategory"
                ).value,

            description:
                document.getElementById(
                    "eventDescription"
                ).value.trim(),

            date:
                document.getElementById(
                    "eventDate"
                ).value,

            time:
                document.getElementById(
                    "eventTime"
                ).value,

            location:
                document.getElementById(
                    "eventLocation"
                ).value.trim(),

            capacity:
                Number(
                    document.getElementById(
                        "eventCapacity"
                    ).value
                )

        };


        // UPDATE EVENT

        if (editId) {

            events =
                events.map(function (item) {

                    if (
                        item.id ===
                        Number(editId)
                    ) {

                        return {
                            ...item,
                            ...eventData
                        };

                    }

                    return item;

                });


            saveEvents();

            displayEvents();

            closeForm();

            showMessage(
                "EVENT UPDATED",
                "Event details have been updated successfully.",
                true
            );

            return;

        }


        // CREATE NEW EVENT

        const newEvent = {

            id:
                Date.now(),

            ...eventData

        };


        events.push(
            newEvent
        );


        saveEvents();

        displayEvents();

        closeForm();


        showMessage(
            "EVENT CREATED",
            "New event has been added to NEXORA.",
            true
        );

    }
);


// =========================
// EDIT EVENT
// =========================

function editEvent(id) {

    const event =
        events.find(function (item) {

            return item.id === id;

        });


    if (!event) {
        return;
    }


    document.getElementById(
        "editEventId"
    ).value =
        event.id;


    document.getElementById(
        "eventName"
    ).value =
        event.name;


    document.getElementById(
        "eventCategory"
    ).value =
        event.category;


    document.getElementById(
        "eventDescription"
    ).value =
        event.description;


    document.getElementById(
        "eventDate"
    ).value =
        event.date;


    document.getElementById(
        "eventTime"
    ).value =
        event.time;


    document.getElementById(
        "eventLocation"
    ).value =
        event.location;


    document.getElementById(
        "eventCapacity"
    ).value =
        event.capacity;


    document.querySelector(
        ".form-header h2"
    ).innerHTML =
        'EDIT <span>EVENT</span>';


    eventFormSection.classList.remove(
        "hidden"
    );


    eventFormSection.scrollIntoView({
        behavior: "smooth"
    });

}


// =========================
// DELETE EVENT
// =========================

function deleteEvent(id) {

    const event =
        events.find(function (item) {

            return item.id === id;

        });


    if (!event) {
        return;
    }


    const confirmDelete =
        confirm(
            "Delete \"" +
            event.name +
            "\"?"
        );


    if (!confirmDelete) {
        return;
    }


    events =
        events.filter(function (item) {

            return item.id !== id;

        });


    saveEvents();

    displayEvents();


    showMessage(
        "EVENT DELETED",
        "The event has been removed from NEXORA.",
        false
    );

}


// =========================
// DATE FORMAT
// =========================

function formatDate(date) {

    if (!date) {
        return "—";
    }


    const dateObject =
        new Date(
            date + "T00:00:00"
        );


    return dateObject.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// =========================
// TIME FORMAT
// =========================

function formatTime(time) {

    if (!time) {
        return "—";
    }


    const parts =
        time.split(":");


    let hour =
        Number(parts[0]);

    const minute =
        parts[1];


    const period =
        hour >= 12
            ? "PM"
            : "AM";


    hour =
        hour % 12 || 12;


    return (
        hour +
        ":" +
        minute +
        " " +
        period
    );

}


// =========================
// MESSAGE
// =========================

function showMessage(
    title,
    message,
    success
) {

    const oldMessage =
        document.getElementById(
            "adminEventMessage"
        );


    if (oldMessage) {
        oldMessage.remove();
    }


    const messageBox =
        document.createElement("div");


    messageBox.id =
        "adminEventMessage";


    messageBox.innerHTML = `

        <div
            style="
                display:flex;
                align-items:center;
                gap:15px;
                min-width:320px;
                padding:18px 22px;
                border-radius:12px;
                background:rgba(5,8,22,0.97);
                border:1px solid ${
                    success
                        ? "#00d4ff"
                        : "#ff4d6d"
                };
                box-shadow:0 0 30px ${
                    success
                        ? "rgba(0,212,255,0.25)"
                        : "rgba(255,77,109,0.25)"
                };
                backdrop-filter:blur(15px);
            "
        >

            <div
                style="
                    width:40px;
                    height:40px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    border-radius:50%;
                    background:${
                        success
                            ? "rgba(0,212,255,0.10)"
                            : "rgba(255,77,109,0.10)"
                    };
                    color:${
                        success
                            ? "#00d4ff"
                            : "#ff4d6d"
                    };
                    font-size:20px;
                "
            >

                ${success ? "✓" : "×"}

            </div>


            <div>

                <strong
                    style="
                        display:block;
                        color:${
                            success
                                ? "#00d4ff"
                                : "#ff4d6d"
                        };
                        font-family:Orbitron,sans-serif;
                        font-size:11px;
                        letter-spacing:2px;
                        margin-bottom:5px;
                    "
                >

                    ${title}

                </strong>


                <p
                    style="
                        margin:0;
                        color:#8d9aae;
                        font-size:11px;
                    "
                >

                    ${message}

                </p>

            </div>

        </div>

    `;


    messageBox.style.position =
        "fixed";

    messageBox.style.top =
        "30px";

    messageBox.style.right =
        "30px";

    messageBox.style.zIndex =
        "99999";

    messageBox.style.animation =
        "adminEventMessageIn 0.4s ease";


    document.body.appendChild(
        messageBox
    );


    if (
        !document.getElementById(
            "adminEventMessageStyle"
        )
    ) {

        const style =
            document.createElement(
                "style"
            );


        style.id =
            "adminEventMessageStyle";


        style.textContent = `

            @keyframes adminEventMessageIn {

                from {
                    opacity:0;
                    transform:translateX(40px);
                }

                to {
                    opacity:1;
                    transform:translateX(0);
                }

            }

        `;


        document.head.appendChild(
            style
        );

    }


    setTimeout(function () {

        messageBox.remove();

    }, 3000);

}


// =========================
// INITIAL LOAD
// =========================

displayEvents();