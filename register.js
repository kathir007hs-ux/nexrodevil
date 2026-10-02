const form =
    document.getElementById("registrationForm");

const eventSelect =
    document.getElementById("event");


// GET EVENT FROM EVENT DETAILS PAGE

const selectedEvent =
    localStorage.getItem("registrationEvent");


// AUTOMATICALLY SELECT EVENT

if (selectedEvent) {

    eventSelect.value = selectedEvent;

}


// FORM SUBMIT

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document.getElementById("name")
                .value
                .trim();

        const email =
            document.getElementById("email")
                .value
                .trim();

        const college =
            document.getElementById("college")
                .value
                .trim();

        const department =
            document.getElementById("department")
                .value
                .trim();

        const selected =
            eventSelect.value;


        // VALIDATION

        if (
            !name ||
            !email ||
            !college ||
            !department ||
            !selected
        ) {

            alert(
                "Please fill all the fields."
            );

            return;
        }


        // REGISTRATION DATA

        const registration = {

            name: name,

            email: email,

            college: college,

            department: department,

            event: selected

        };


        // SAVE DATA

        localStorage.setItem(
            "nexoraRegistration",
            JSON.stringify(registration)
        );


        // GO TO DIGITAL PASS

        window.location.href =
            "registration-success.html";

    }
);