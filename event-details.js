const events = {

    "Future Tech 2026": {
        category: "TECHNICAL EVENT",
        description:
            "Explore emerging technologies, innovation and ideas shaping the future.",
        date: "October 2026",
        location: "Villupuram",
        time: "10:00 AM"
    },

    "Dance Fest 2026": {
        category: "CULTURAL EVENT",
        description:
            "Celebrate creativity, music, dance and cultural talent with students from different colleges.",
        date: "October 2026",
        location: "Villupuram",
        time: "4:00 PM"
    },

    "Inter College Football": {
        category: "SPORTS EVENT",
        description:
            "Compete with college teams and experience the excitement of inter-college football.",
        date: "October 2026",
        location: "Chennai",
        time: "3:00 PM"
    },

    "Web Development Workshop": {
        category: "WORKSHOP",
        description:
            "Learn modern web development concepts and build practical projects.",
        date: "November 2026",
        location: "Puducherry",
        time: "10:00 AM"
    },

    "Hackathon 2026": {
        category: "HACKATHON",
        description:
            "Build innovative solutions, solve real-world problems and turn your ideas into working projects.",
        date: "December 2026",
        location: "Chennai",
        time: "9:00 AM"
    },

    "AI & ML Workshop": {
        category: "TECHNICAL EVENT",
        description:
            "Discover artificial intelligence and machine learning through practical learning sessions.",
        date: "December 2026",
        location: "Puducherry",
        time: "10:00 AM"
    }

};


// GET SELECTED EVENT

const selectedEvent =
    localStorage.getItem("selectedEvent");


// DISPLAY EVENT

if (selectedEvent && events[selectedEvent]) {

    const event = events[selectedEvent];

    document.getElementById("eventCategory")
        .textContent = event.category;

    document.getElementById("eventTitle")
        .textContent = selectedEvent;

    document.getElementById("eventDescription")
        .textContent = event.description;

    document.getElementById("eventDate")
        .textContent = event.date;

    document.getElementById("eventLocation")
        .textContent = event.location;

    document.getElementById("eventTime")
        .textContent = event.time;

} else {

    document.getElementById("eventCategory")
        .textContent = "EVENT";

    document.getElementById("eventTitle")
        .textContent = "Event Not Found";

    document.getElementById("eventDescription")
        .textContent =
        "Please return to the events page and select an event.";

}


// REGISTER EVENT

function registerEvent() {

    if (!selectedEvent) {

        alert("Please select an event first.");

        return;
    }


    localStorage.setItem(
        "registrationEvent",
        selectedEvent
    );


    window.location.href =
        "register.html";
}