/* =========================
   ADMIN ACCESS CHECK
========================= */

const isAdminLoggedIn =
    localStorage.getItem("nexoraAdminLoggedIn");

if (isAdminLoggedIn !== "true") {

    window.location.href =
        "admin-login.html";
}


/* =========================
   ELEMENTS
========================= */

const registrationContainer =
    document.getElementById(
        "registrationContainer"
    );

const registrationCount =
    document.getElementById(
        "registrationCount"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const eventFilter =
    document.getElementById(
        "eventFilter"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


/* =========================
   LOAD REGISTRATION
========================= */

const registrationData =
    JSON.parse(
        localStorage.getItem(
            "nexoraRegistration"
        )
    );


const registrationId =
    localStorage.getItem(
        "nexoraRegistrationId"
    ) || "NX-PENDING";


/* =========================
   LOAD EVENTS
========================= */

const adminEvents =
    JSON.parse(
        localStorage.getItem(
            "nexoraAdminEvents"
        )
    ) || [];


/* =========================
   EVENT FILTER
========================= */

function loadEventFilter() {

    eventFilter.innerHTML =
        `<option value="all">
            All Events
        </option>`;

    const eventNames = [];


    adminEvents.forEach(function(event) {

        if (!eventNames.includes(event.name)) {

            eventNames.push(event.name);

        }

    });


    /*
       Also include the currently
       registered event if it is
       not inside admin events.
    */

    if (
        registrationData &&
        registrationData.event &&
        !eventNames.includes(
            registrationData.event
        )
    ) {

        eventNames.push(
            registrationData.event
        );

    }


    eventNames.forEach(function(eventName) {

        const option =
            document.createElement("option");

        option.value = eventName;

        option.textContent = eventName;

        eventFilter.appendChild(option);

    });

}


/* =========================
   DISPLAY REGISTRATIONS
========================= */

function displayRegistrations() {

    registrationContainer.innerHTML = "";


    /*
       Current frontend version
       stores one registration object.
    */

    if (!registrationData) {

        registrationCount.textContent = "0";

        registrationContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ◈
                </div>

                <h3>
                    NO REGISTRATIONS
                </h3>

                <p>
                    No participants have
                    registered for any event yet.
                </p>

            </div>

        `;

        return;
    }


    registrationCount.textContent = "1";


    const card =
        document.createElement("div");

    card.className =
        "registration-card";


    card.innerHTML = `

        <div class="registration-top">

            <span class="registration-id">
                ${registrationId}
            </span>

            <span class="registration-status">
                REGISTERED
            </span>

        </div>


        <h3 class="participant-name">
            ${registrationData.name}
        </h3>


        <p class="participant-email">
            ${registrationData.email}
        </p>


        <div class="registration-details">

            <div class="detail-item">

                <span>
                    COLLEGE
                </span>

                <strong>
                    ${registrationData.college}
                </strong>

            </div>


            <div class="detail-item">

                <span>
                    DEPARTMENT
                </span>

                <strong>
                    ${registrationData.department}
                </strong>

            </div>


            <div class="detail-item">

                <span>
                    EVENT
                </span>

                <strong>
                    ${registrationData.event}
                </strong>

            </div>


            <div class="detail-item">

                <span>
                    STATUS
                </span>

                <strong>
                    Confirmed
                </strong>

            </div>

        </div>

    `;


    registrationContainer.appendChild(card);

}


/* =========================
   FILTER REGISTRATION
========================= */

function filterRegistration() {

    if (!registrationData) {
        return;
    }


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedEvent =
        eventFilter.value;


    const name =
        registrationData.name
            .toLowerCase();

    const email =
        registrationData.email
            .toLowerCase();

    const college =
        registrationData.college
            .toLowerCase();

    const department =
        registrationData.department
            .toLowerCase();

    const event =
        registrationData.event
            .toLowerCase();


    const matchesSearch =
        name.includes(searchText) ||
        email.includes(searchText) ||
        college.includes(searchText) ||
        department.includes(searchText) ||
        event.includes(searchText);


    const matchesEvent =
        selectedEvent === "all" ||
        registrationData.event === selectedEvent;


    if (
        matchesSearch &&
        matchesEvent
    ) {

        registrationCount.textContent = "1";

        registrationContainer.innerHTML = "";

        const card =
            document.createElement("div");

        card.className =
            "registration-card";


        card.innerHTML = `

            <div class="registration-top">

                <span class="registration-id">
                    ${registrationId}
                </span>

                <span class="registration-status">
                    REGISTERED
                </span>

            </div>


            <h3 class="participant-name">
                ${registrationData.name}
            </h3>


            <p class="participant-email">
                ${registrationData.email}
            </p>


            <div class="registration-details">

                <div class="detail-item">

                    <span>
                        COLLEGE
                    </span>

                    <strong>
                        ${registrationData.college}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        DEPARTMENT
                    </span>

                    <strong>
                        ${registrationData.department}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        EVENT
                    </span>

                    <strong>
                        ${registrationData.event}
                    </strong>

                </div>


                <div class="detail-item">

                    <span>
                        STATUS
                    </span>

                    <strong>
                        Confirmed
                    </strong>

                </div>

            </div>

        `;


        registrationContainer.appendChild(card);

    } else {

        registrationCount.textContent = "0";


        registrationContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ⌕
                </div>

                <h3>
                    NO MATCH FOUND
                </h3>

                <p>
                    No registration matches
                    your current search or filter.
                </p>

            </div>

        `;

    }

}


/* =========================
   SEARCH EVENT
========================= */

searchInput.addEventListener(
    "input",
    filterRegistration
);


/* =========================
   FILTER EVENT
========================= */

eventFilter.addEventListener(
    "change",
    filterRegistration
);


/* =========================
   LOGOUT
========================= */

logoutBtn.addEventListener(
    "click",
    function() {

        localStorage.removeItem(
            "nexoraAdminLoggedIn"
        );

        localStorage.removeItem(
            "nexoraAdminUser"
        );


        window.location.href =
            "admin-login.html";

    }
);


/* =========================
   INITIALIZE
========================= */

loadEventFilter();

displayRegistrations();