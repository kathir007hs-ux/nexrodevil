const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

const eventCards =
    document.querySelectorAll(".event-card");


// SEARCH + FILTER

function filterEvents() {

    const searchText =
        searchInput.value.toLowerCase();

    const selectedCategory =
        categoryFilter.value;

    eventCards.forEach(function(card) {

        const title =
            card.querySelector("h2")
                .textContent
                .toLowerCase();

        const description =
            card.querySelector("p")
                .textContent
                .toLowerCase();

        const category =
            card.dataset.category;


        const matchesSearch =
            title.includes(searchText) ||
            description.includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            category === selectedCategory;


        if (matchesSearch && matchesCategory) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });
}


// SEARCH EVENT

searchInput.addEventListener(
    "input",
    filterEvents
);


// CATEGORY EVENT

categoryFilter.addEventListener(
    "change",
    filterEvents
);


// OPEN EVENT DETAILS

function viewEvent(eventName) {

    localStorage.setItem(
        "selectedEvent",
        eventName
    );

    window.location.href =
        "event-details.html";
}