// CHECK LOGIN

const isLoggedIn =
    localStorage.getItem("nexoraLoggedIn");


if (isLoggedIn !== "true") {

    alert(
        "Please login to access your dashboard."
    );

    window.location.href =
        "login.html";

}


// GET CURRENT USER

const currentUser =
    JSON.parse(
        localStorage.getItem(
            "nexoraCurrentUser"
        )
    );


// DISPLAY USER

if (currentUser) {

    document.getElementById("userName")
        .textContent =
        currentUser.name;

}


// GET REGISTRATION DATA

const registrationData =
    JSON.parse(
        localStorage.getItem(
            "nexoraRegistration"
        )
    );


// DISPLAY REGISTRATION

if (registrationData) {

    document.getElementById("eventCount")
        .textContent = "1";


    const registrationId =
        localStorage.getItem(
            "nexoraRegistrationId"
        );


    document.getElementById("registrationId")
        .textContent =
        registrationId || "NX-000000";


    document.getElementById("eventName")
        .textContent =
        registrationData.event;


    document.getElementById("collegeName")
        .textContent =
        registrationData.college;


    document.getElementById("departmentName")
        .textContent =
        registrationData.department;

} else {

    document.getElementById("eventCount")
        .textContent = "0";

    document.getElementById("registrationId")
        .textContent = "—";

    document.getElementById("eventName")
        .textContent =
        "No Registration";

    document.getElementById("collegeName")
        .textContent = "—";

    document.getElementById("departmentName")
        .textContent = "—";

}


// LOGOUT

const logoutBtn =
    document.getElementById("logoutBtn");


logoutBtn.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "nexoraLoggedIn"
        );

        localStorage.removeItem(
            "nexoraCurrentUser"
        );


        alert(
            "You have been logged out."
        );


        window.location.href =
            "login.html";

    }
);