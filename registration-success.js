const registrationData =
    JSON.parse(
        localStorage.getItem("nexoraRegistration")
    );


// CHECK REGISTRATION

if (!registrationData) {

    alert("Registration data not found.");

    window.location.href = "events.html";

}


// DISPLAY USER DETAILS

document.getElementById("passName")
    .textContent = registrationData.name;

document.getElementById("passEvent")
    .textContent = registrationData.event;

document.getElementById("passCollege")
    .textContent = registrationData.college;

document.getElementById("passDepartment")
    .textContent = registrationData.department;


// REGISTRATION ID

let registrationId =
    localStorage.getItem(
        "nexoraRegistrationId"
    );


if (!registrationId) {

    registrationId =
        "NX-" +
        Math.floor(
            100000 + Math.random() * 900000
        );

    localStorage.setItem(
        "nexoraRegistrationId",
        registrationId
    );

}


document.getElementById("registrationId")
    .textContent = registrationId;


// QR DATA

const qrData = JSON.stringify({

    registrationId:
        registrationId,

    name:
        registrationData.name,

    email:
        registrationData.email,

    college:
        registrationData.college,

    department:
        registrationData.department,

    event:
        registrationData.event

});


// GENERATE REAL QR CODE

const qrCanvas =
    document.getElementById("qrCode");


QRCode.toCanvas(
    qrCanvas,
    qrData,
    {
        width: 180,
        margin: 2
    },
    function (error) {

        if (error) {

            console.error(
                "QR Code Error:",
                error
            );

        }

    }
);