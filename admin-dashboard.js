// ========================================
// NEXORA ADMIN DASHBOARD
// EVENT MANAGEMENT + DASHBOARD
// ========================================

const API_URL = "http://localhost:8080/api";

// ========================================
// ADMIN LOGIN CHECK
// ========================================

const adminLoggedIn =
    localStorage.getItem("nexoraAdminLoggedIn");

if (adminLoggedIn !== "true") {
    window.location.href = "admin-login.html";
}

// ========================================
// ADMIN DETAILS
// ========================================

const adminUser =
    JSON.parse(
        localStorage.getItem("nexoraAdminUser")
    );

if (adminUser) {

    const adminName =
        document.getElementById("adminName");

    const adminEmail =
        document.getElementById("adminEmail");

    if (adminName) {
        adminName.textContent =
            adminUser.name || "NEXORA Administrator";
    }

    if (adminEmail) {
        adminEmail.textContent =
            adminUser.email || "";
    }
}

// ========================================
// LOAD DASHBOARD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadEvents();
        loadDashboardStats();

        const logoutButton =
            document.getElementById(
                "adminLogoutBtn"
            );

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logoutAdmin
            );
        }
    }
);

// ========================================
// LOAD EVENTS FROM BACKEND
// ========================================

async function loadEvents() {

    try {

        const response =
            await fetch(
                `${API_URL}/events`
            );

        if (!response.ok) {
            throw new Error(
                "Failed to load events"
            );
        }

        const events =
            await response.json();

        updateEventCount(events.length);

        displayEvents(events);

    } catch (error) {

        console.error(
            "Load Events Error:",
            error
        );

        updateEventCount(0);

        showAdminMessage(
            "SERVER ERROR",
            "Cannot load events. Make sure Spring Boot is running."
        );
    }
}

// ========================================
// UPDATE TOTAL EVENT COUNT
// ========================================

function updateEventCount(count) {

    const totalEvents =
        document.getElementById(
            "totalEvents"
        );

    if (totalEvents) {
        totalEvents.textContent = count;
    }
}

// ========================================
// DASHBOARD STATS
// ========================================

function loadDashboardStats() {

    const registration =
        localStorage.getItem(
            "nexoraRegistration"
        );

    const attendance =
        localStorage.getItem(
            "nexoraAttendance"
        );

    const account =
        localStorage.getItem(
            "nexoraAccount"
        );

    const totalRegistrations =
        document.getElementById(
            "totalRegistrations"
        );

    const totalAttendance =
        document.getElementById(
            "totalAttendance"
        );

    const activeUsers =
        document.getElementById(
            "activeUsers"
        );

    if (totalRegistrations) {

        totalRegistrations.textContent =
            registration ? "1" : "0";
    }

    if (totalAttendance) {

        totalAttendance.textContent =
            attendance ? "1" : "0";
    }

    if (activeUsers) {

        activeUsers.textContent =
            account ? "1" : "0";
    }
}

// ========================================
// DISPLAY EVENTS
// ========================================

function displayEvents(events) {

    let container =
        document.getElementById(
            "adminEventsContainer"
        );

    if (!container) {

        container =
            document.createElement("section");

        container.id =
            "adminEventsSection";

        container.innerHTML = `
            <div class="section-title">
                <span>EVENT DATABASE</span>
            </div>

            <div class="admin-event-toolbar">

                <button
                    class="admin-add-event-btn"
                    onclick="openEventForm()"
                >
                    + ADD NEW EVENT
                </button>

            </div>

            <div
                id="adminEventsContainer"
                class="admin-events-container"
            >
            </div>
        `;

        const activitySection =
            document.querySelector(
                ".activity-section"
            );

        if (activitySection) {

            activitySection.parentNode.insertBefore(
                container,
                activitySection
            );

        } else {

            document
                .querySelector(".admin-container")
                ?.appendChild(container);
        }

        container =
            document.getElementById(
                "adminEventsContainer"
            );
    }

    if (!container) return;

    container.innerHTML = "";

    if (events.length === 0) {

        container.innerHTML = `
            <div class="admin-empty-events">

                <div class="empty-event-icon">
                    ◈
                </div>

                <h3>NO EVENTS FOUND</h3>

                <p>
                    Create your first NEXORA event.
                </p>

                <button
                    class="admin-add-event-btn"
                    onclick="openEventForm()"
                >
                    + CREATE EVENT
                </button>

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

            <div class="admin-event-image">

                ${
                    event.image
                    ? `<img
                        src="${escapeHTML(event.image)}"
                        alt="${escapeHTML(event.title)}"
                        onerror="this.style.display='none'"
                    >`
                    : `<span>EVENT</span>`
                }

            </div>

            <div class="admin-event-content">

                <div class="admin-event-category">
                    ${escapeHTML(
                        event.category || "GENERAL"
                    )}
                </div>

                <h3>
                    ${escapeHTML(
                        event.title || "Untitled Event"
                    )}
                </h3>

                <p class="admin-event-description">
                    ${escapeHTML(
                        event.description || "No description"
                    )}
                </p>

                <div class="admin-event-details">

                    <span>
                        📅
                        ${escapeHTML(
                            event.date || "-"
                        )}
                    </span>

                    <span>
                        ⏰
                        ${escapeHTML(
                            event.time || "-"
                        )}
                    </span>

                    <span>
                        📍
                        ${escapeHTML(
                            event.venue || "-"
                        )}
                    </span>

                    <span>
                        👥
                        ${event.availableSeats ?? 0}
                        seats
                    </span>

                </div>

                <div class="admin-event-actions">

                    <button
                        class="event-edit-btn"
                        onclick="editEvent(${event.id})"
                    >
                        EDIT
                    </button>

                    <button
                        class="event-delete-btn"
                        onclick="deleteEvent(${event.id})"
                    >
                        DELETE
                    </button>

                </div>

            </div>
        `;

        container.appendChild(card);
    });
}

// ========================================
// OPEN ADD EVENT FORM
// ========================================

function openEventForm() {

    showEventModal();
}

// ========================================
// SHOW EVENT MODAL
// ========================================

function showEventModal(event = null) {

    removeEventModal();

    const isEdit =
        event !== null;

    const modal =
        document.createElement("div");

    modal.id =
        "eventModal";

    modal.innerHTML = `

        <div class="event-modal-overlay"
             onclick="closeEventModal(event)">

            <div class="event-modal"
                 onclick="event.stopPropagation()">

                <div class="event-modal-header">

                    <div>
                        <p class="modal-tag">
                            ${
                                isEdit
                                ? "UPDATE EVENT"
                                : "CREATE EVENT"
                            }
                        </p>

                        <h2>
                            ${
                                isEdit
                                ? "EDIT EVENT"
                                : "ADD NEW EVENT"
                            }
                        </h2>
                    </div>

                    <button
                        class="modal-close-btn"
                        onclick="removeEventModal()"
                    >
                        ×
                    </button>

                </div>

                <form
                    id="eventForm"
                    class="event-form"
                >

                    <input
                        type="hidden"
                        id="eventId"
                        value="${
                            isEdit
                            ? event.id
                            : ""
                        }"
                    >

                    <div class="event-form-grid">

                        <div class="event-input-group">

                            <label>EVENT TITLE</label>

                            <input
                                type="text"
                                id="eventTitle"
                                placeholder="Enter event title"
                                value="${
                                    isEdit
                                    ? escapeAttribute(event.title)
                                    : ""
                                }"
                                required
                            >

                        </div>

                        <div class="event-input-group">

                            <label>CATEGORY</label>

                            <input
                                type="text"
                                id="eventCategory"
                                placeholder="Technical / Cultural / Workshop"
                                value="${
                                    isEdit
                                    ? escapeAttribute(event.category)
                                    : ""
                                }"
                                required
                            >

                        </div>

                        <div class="event-input-group">

                            <label>DATE</label>

                            <input
                                type="date"
                                id="eventDate"
                                value="${
                                    isEdit
                                    ? escapeAttribute(event.date)
                                    : ""
                                }"
                                required
                            >

                        </div>

                        <div class="event-input-group">

                            <label>TIME</label>

                            <input
                                type="time"
                                id="eventTime"
                                value="${
                                    isEdit
                                    ? escapeAttribute(event.time)
                                    : ""
                                }"
                                required
                            >

                        </div>

                        <div class="event-input-group">

                            <label>VENUE</label>

                            <input
                                type="text"
                                id="eventVenue"
                                placeholder="Enter venue"
                                value="${
                                    isEdit
                                    ? escapeAttribute(event.venue)
                                    : ""
                                }"
                                required
                            >

                        </div>

                        <div class="event-input-group">

                            <label>AVAILABLE SEATS</label>

                            <input
                                type="number"
                                id="eventSeats"
                                placeholder="100"
                                min="1"
                                value="${
                                    isEdit
                                    ? event.availableSeats ?? ""
                                    : ""
                                }"
                                required
                            >

                        </div>

                        <div class="event-input-group full-width">

                            <label>IMAGE URL</label>

                            <input
                                type="url"
                                id="eventImage"
                                placeholder="https://example.com/event.jpg"
                                value="${
                                    isEdit
                                    ? escapeAttribute(event.image)
                                    : ""
                                }"
                            >

                        </div>

                        <div class="event-input-group full-width">

                            <label>DESCRIPTION</label>

                            <textarea
                                id="eventDescription"
                                placeholder="Enter event description"
                                rows="5"
                                required
                            >${
                                isEdit
                                ? escapeHTML(event.description || "")
                                : ""
                            }</textarea>

                        </div>

                    </div>

                    <div class="event-form-actions">

                        <button
                            type="button"
                            class="event-cancel-btn"
                            onclick="removeEventModal()"
                        >
                            CANCEL
                        </button>

                        <button
                            type="submit"
                            class="event-save-btn"
                        >
                            ${
                                isEdit
                                ? "UPDATE EVENT"
                                : "CREATE EVENT"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>
    `;

    document.body.appendChild(modal);

    document
        .getElementById("eventForm")
        .addEventListener(
            "submit",
            saveEvent
        );
}

// ========================================
// SAVE EVENT
// ========================================

async function saveEvent(event) {

    event.preventDefault();

    const eventId =
        document.getElementById(
            "eventId"
        ).value;

    const eventData = {

        title:
            document.getElementById(
                "eventTitle"
            ).value.trim(),

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

        venue:
            document.getElementById(
                "eventVenue"
            ).value.trim(),

        category:
            document.getElementById(
                "eventCategory"
            ).value.trim(),

        image:
            document.getElementById(
                "eventImage"
            ).value.trim(),

        availableSeats:
            Number(
                document.getElementById(
                    "eventSeats"
                ).value
            )
    };

    try {

        const url =
            eventId
            ? `${API_URL}/events/${eventId}`
            : `${API_URL}/events`;

        const method =
            eventId
            ? "PUT"
            : "POST";

        const response =
            await fetch(
                url,
                {
                    method: method,

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            eventData
                        )
                }
            );

        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Event save failed"
            );
        }

        removeEventModal();

        showAdminMessage(
            eventId
                ? "EVENT UPDATED"
                : "EVENT CREATED",
            eventId
                ? "Event updated successfully."
                : "New event added successfully."
        );

        await loadEvents();

    } catch (error) {

        console.error(
            "Save Event Error:",
            error
        );

        showAdminMessage(
            "SAVE FAILED",
            "Unable to save event. Check Spring Boot and MySQL."
        );
    }
}

// ========================================
// EDIT EVENT
// ========================================

async function editEvent(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/events/${id}`
            );

        if (!response.ok) {
            throw new Error(
                "Event not found"
            );
        }

        const event =
            await response.json();

        showEventModal(event);

    } catch (error) {

        console.error(
            "Edit Event Error:",
            error
        );

        showAdminMessage(
            "ERROR",
            "Unable to load event details."
        );
    }
}

// ========================================
// DELETE EVENT
// ========================================

async function deleteEvent(id) {

    const confirmed =
        window.confirm(
            "Are you sure you want to delete this event?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/events/${id}`,
                {
                    method: "DELETE"
                }
            );

        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Delete failed"
            );
        }

        showAdminMessage(
            "EVENT DELETED",
            "Event has been removed successfully."
        );

        await loadEvents();

    } catch (error) {

        console.error(
            "Delete Event Error:",
            error
        );

        showAdminMessage(
            "DELETE FAILED",
            "Unable to delete the event."
        );
    }
}

// ========================================
// CLOSE EVENT MODAL
// ========================================

function closeEventModal(event) {

    if (
        event.target.classList.contains(
            "event-modal-overlay"
        )
    ) {
        removeEventModal();
    }
}

function removeEventModal() {

    const modal =
        document.getElementById(
            "eventModal"
        );

    if (modal) {
        modal.remove();
    }
}

// ========================================
// MODULE NAVIGATION
// ========================================

function openModule(module) {

    if (module === "events") {

        const section =
            document.getElementById(
                "adminEventsSection"
            );

        if (section) {

            section.scrollIntoView({
                behavior: "smooth"
            });

        } else {

            loadEvents();
        }

        return;
    }

    if (module === "registrations") {

        showAdminMessage(
            "REGISTRATIONS",
            "Registration management will be connected next."
        );

        return;
    }

    if (module === "attendance") {

        showAdminMessage(
            "ATTENDANCE",
            "Attendance management will be connected next."
        );

        return;
    }

    if (module === "analytics") {

        showAdminMessage(
            "ANALYTICS",
            "Analytics module will be connected next."
        );

        return;
    }
}

// ========================================
// ADMIN MESSAGE
// ========================================

function showAdminMessage(
    title,
    message
) {

    const oldMessage =
        document.getElementById(
            "adminMessage"
        );

    if (oldMessage) {
        oldMessage.remove();
    }

    const messageBox =
        document.createElement("div");

    messageBox.id =
        "adminMessage";

    messageBox.innerHTML = `

        <div class="admin-message-box">

            <div class="admin-message-icon">
                ◈
            </div>

            <div>

                <strong>
                    ${escapeHTML(title)}
                </strong>

                <p>
                    ${escapeHTML(message)}
                </p>

            </div>

        </div>
    `;

    document.body.appendChild(
        messageBox
    );

    const style =
        document.createElement("style");

    style.textContent = `

        #adminMessage {
            position: fixed;
            top: 30px;
            right: 30px;
            z-index: 99999;
            animation:
                adminMessageIn
                0.4s ease;
        }

        .admin-message-box {
            display: flex;
            align-items: center;
            gap: 15px;
            min-width: 320px;
            padding: 18px 22px;
            border: 1px solid #00d4ff;
            border-radius: 12px;
            background: rgba(5, 8, 22, 0.97);
            box-shadow:
                0 0 30px
                rgba(0, 212, 255, 0.25);
            backdrop-filter: blur(15px);
        }

        .admin-message-icon {
            width: 42px;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            color: #00d4ff;
            background:
                rgba(0, 212, 255, 0.10);
            font-size: 20px;
        }

        .admin-message-box strong {
            display: block;
            color: #00d4ff;
            font-family: 'Orbitron', sans-serif;
            font-size: 11px;
            letter-spacing: 2px;
            margin-bottom: 5px;
        }

        .admin-message-box p {
            margin: 0;
            color: #8d9aae;
            font-size: 11px;
            line-height: 1.5;
        }

        @keyframes adminMessageIn {

            from {
                opacity: 0;
                transform:
                    translateX(40px);
            }

            to {
                opacity: 1;
                transform:
                    translateX(0);
            }
        }

        @media (max-width: 600px) {

            #adminMessage {
                left: 20px;
                right: 20px;
                top: 20px;
            }

            .admin-message-box {
                min-width: auto;
            }
        }
    `;

    document.head.appendChild(
        style
    );

    setTimeout(
        function () {

            if (messageBox) {
                messageBox.remove();
            }

        },
        3000
    );
}

// ========================================
// LOGOUT
// ========================================

function logoutAdmin() {

    localStorage.removeItem(
        "nexoraAdminLoggedIn"
    );

    localStorage.removeItem(
        "nexoraAdminUser"
    );

    window.location.href =
        "admin-login.html";
}

// ========================================
// SECURITY HELPERS
// ========================================

function escapeHTML(value) {

    if (value === null ||
        value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {

    return escapeHTML(
        value || ""
    );
}

// ========================================
// ADMIN EVENT MANAGEMENT STYLES
// ========================================

const eventManagementStyle =
    document.createElement("style");

eventManagementStyle.textContent = `

    #adminEventsSection {
        margin-top: 60px;
        margin-bottom: 60px;
    }

    .admin-event-toolbar {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 25px;
    }

    .admin-add-event-btn {
        border: 1px solid #00d4ff;
        background:
            rgba(0, 212, 255, 0.08);
        color: #00d4ff;
        padding: 13px 22px;
        border-radius: 8px;
        cursor: pointer;
        font-family: 'Orbitron', sans-serif;
        font-size: 11px;
        letter-spacing: 1px;
        transition: 0.3s;
    }

    .admin-add-event-btn:hover {
        background: #00d4ff;
        color: #050816;
        box-shadow:
            0 0 25px
            rgba(0, 212, 255, 0.35);
    }

    .admin-events-container {
        display: grid;
        grid-template-columns:
            repeat(auto-fit, minmax(320px, 1fr));
        gap: 20px;
    }

    .admin-event-card {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        border: 1px solid
            rgba(0, 212, 255, 0.12);
        border-radius: 16px;
        background:
            rgba(10, 15, 35, 0.85);
        box-shadow:
            0 10px 30px
            rgba(0, 0, 0, 0.20);
        transition: 0.3s;
    }

    .admin-event-card:hover {
        transform: translateY(-4px);
        border-color:
            rgba(0, 212, 255, 0.40);
        box-shadow:
            0 15px 40px
            rgba(0, 212, 255, 0.10);
    }

    .admin-event-image {
        height: 170px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background:
            linear-gradient(
                135deg,
                rgba(0, 212, 255, 0.10),
                rgba(100, 50, 255, 0.10)
            );
    }

    .admin-event-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .admin-event-image span {
        color: #00d4ff;
        font-family: 'Orbitron', sans-serif;
        letter-spacing: 3px;
        font-size: 13px;
    }

    .admin-event-content {
        padding: 22px;
    }

    .admin-event-category {
        color: #00d4ff;
        font-size: 10px;
        letter-spacing: 2px;
        margin-bottom: 10px;
        font-family: 'Orbitron', sans-serif;
    }

    .admin-event-content h3 {
        color: #ffffff;
        font-family: 'Orbitron', sans-serif;
        font-size: 17px;
        margin-bottom: 12px;
    }

    .admin-event-description {
        color: #8d9aae;
        font-size: 12px;
        line-height: 1.6;
        min-height: 58px;
        margin-bottom: 18px;
    }

    .admin-event-details {
        display: flex;
        flex-direction: column;
        gap: 8px;
        color: #aeb9ca;
        font-size: 11px;
        margin-bottom: 20px;
    }

    .admin-event-actions {
        display: flex;
        gap: 10px;
    }

    .admin-event-actions button {
        flex: 1;
        padding: 11px;
        border-radius: 7px;
        cursor: pointer;
        font-family: 'Orbitron', sans-serif;
        font-size: 9px;
        letter-spacing: 1px;
        transition: 0.3s;
    }

    .event-edit-btn {
        border: 1px solid #00d4ff;
        background:
            rgba(0, 212, 255, 0.08);
        color: #00d4ff;
    }

    .event-edit-btn:hover {
        background: #00d4ff;
        color: #050816;
    }

    .event-delete-btn {
        border: 1px solid #ff4d6d;
        background:
            rgba(255, 77, 109, 0.08);
        color: #ff4d6d;
    }

    .event-delete-btn:hover {
        background: #ff4d6d;
        color: #ffffff;
    }

    .admin-empty-events {
        grid-column: 1 / -1;
        padding: 60px 20px;
        text-align: center;
        border: 1px dashed
            rgba(0, 212, 255, 0.25);
        border-radius: 15px;
    }

    .empty-event-icon {
        font-size: 40px;
        color: #00d4ff;
        margin-bottom: 15px;
    }

    .admin-empty-events h3 {
        color: #ffffff;
        font-family: 'Orbitron', sans-serif;
        font-size: 16px;
        margin-bottom: 10px;
    }

    .admin-empty-events p {
        color: #8d9aae;
        font-size: 12px;
        margin-bottom: 20px;
    }

    /* =========================
       EVENT MODAL
       ========================= */

    .event-modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 25px;
        background:
            rgba(2, 4, 12, 0.82);
        backdrop-filter: blur(12px);
        overflow-y: auto;
    }

    .event-modal {
        width: min(850px, 100%);
        max-height: 92vh;
        overflow-y: auto;
        border: 1px solid
            rgba(0, 212, 255, 0.30);
        border-radius: 18px;
        background:
            linear-gradient(
                145deg,
                #080d21,
                #050816
            );
        box-shadow:
            0 0 60px
            rgba(0, 212, 255, 0.15);
    }

    .event-modal-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 25px 28px;
        border-bottom: 1px solid
            rgba(0, 212, 255, 0.10);
    }

    .modal-tag {
        color: #00d4ff;
        font-size: 9px;
        letter-spacing: 2px;
        margin-bottom: 7px;
        font-family: 'Orbitron', sans-serif;
    }

    .event-modal-header h2 {
        color: #ffffff;
        font-family: 'Orbitron', sans-serif;
        font-size: 21px;
    }

    .modal-close-btn {
        width: 38px;
        height: 38px;
        border: 1px solid
            rgba(255, 255, 255, 0.12);
        border-radius: 50%;
        background: transparent;
        color: #ffffff;
        font-size: 24px;
        cursor: pointer;
    }

    .modal-close-btn:hover {
        border-color: #00d4ff;
        color: #00d4ff;
    }

    .event-form {
        padding: 28px;
    }

    .event-form-grid {
        display: grid;
        grid-template-columns:
            repeat(2, 1fr);
        gap: 18px;
    }

    .event-input-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .event-input-group.full-width {
        grid-column: 1 / -1;
    }

    .event-input-group label {
        color: #7f8da5;
        font-family: 'Orbitron', sans-serif;
        font-size: 9px;
        letter-spacing: 1.5px;
    }

    .event-input-group input,
    .event-input-group textarea {
        width: 100%;
        border: 1px solid
            rgba(0, 212, 255, 0.12);
        outline: none;
        border-radius: 8px;
        padding: 13px 14px;
        background:
            rgba(255, 255, 255, 0.03);
        color: #ffffff;
        font-family: 'Poppins', sans-serif;
        font-size: 12px;
        transition: 0.3s;
    }

    .event-input-group textarea {
        resize: vertical;
    }

    .event-input-group input:focus,
    .event-input-group textarea:focus {
        border-color: #00d4ff;
        box-shadow:
            0 0 15px
            rgba(0, 212, 255, 0.10);
    }

    .event-input-group input::placeholder,
    .event-input-group textarea::placeholder {
        color: #58657a;
    }

    .event-form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 25px;
    }

    .event-cancel-btn,
    .event-save-btn {
        padding: 13px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-family: 'Orbitron', sans-serif;
        font-size: 10px;
        letter-spacing: 1px;
        transition: 0.3s;
    }

    .event-cancel-btn {
        border: 1px solid
            rgba(255, 255, 255, 0.15);
        background: transparent;
        color: #9aa8bd;
    }

    .event-cancel-btn:hover {
        color: #ffffff;
        border-color: #ffffff;
    }

    .event-save-btn {
        border: 1px solid #00d4ff;
        background: #00d4ff;
        color: #050816;
    }

    .event-save-btn:hover {
        box-shadow:
            0 0 25px
            rgba(0, 212, 255, 0.35);
    }

    @media (max-width: 650px) {

        .event-form-grid {
            grid-template-columns: 1fr;
        }

        .event-input-group.full-width {
            grid-column: auto;
        }

        .event-modal-overlay {
            padding: 12px;
        }

        .event-form {
            padding: 20px;
        }

        .event-modal-header {
            padding: 20px;
        }

        .event-form-actions {
            flex-direction: column;
        }

        .event-cancel-btn,
        .event-save-btn {
            width: 100%;
        }
    }
`;

document.head.appendChild(
    eventManagementStyle
);
