const adminLoginForm = document.getElementById("adminLoginForm");

if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document
            .getElementById("adminEmail")
            .value
            .trim();

        const password = document
            .getElementById("adminPassword")
            .value;

        if (!email || !password) {
            showMessage(
                "ACCESS DENIED",
                "Please enter email and password.",
                false
            );
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const result = await response.text();

            if (!response.ok) {

                showMessage(
                    "ACCESS DENIED",
                    result || "Invalid email or password.",
                    false
                );

                return;
            }

            const parts = result.split("|");

            const role = parts.length > 1
                ? parts[1].trim()
                : "";

            if (role !== "ADMIN") {

                showMessage(
                    "ACCESS DENIED",
                    "This account does not have administrator access.",
                    false
                );

                return;
            }

            localStorage.setItem(
                "nexoraAdminLoggedIn",
                "true"
            );

            localStorage.setItem(
                "nexoraAdminUser",
                JSON.stringify({
                    name: "NEXORA Administrator",
                    email: email
                })
            );

            showMessage(
                "ACCESS GRANTED",
                "Welcome to NEXORA Control Center.",
                true
            );

            setTimeout(function () {
                window.location.href = "admin-dashboard.html";
            }, 1200);

        } catch (error) {

            console.error("Login Error:", error);

            showMessage(
                "SERVER ERROR",
                "Cannot connect to NEXORA server. Please start Spring Boot.",
                false
            );
        }
    });
}


function showMessage(title, message, success) {

    const oldMessage = document.getElementById("nexoraMessage");

    if (oldMessage) {
        oldMessage.remove();
    }

    const messageBox = document.createElement("div");

    messageBox.id = "nexoraMessage";

    messageBox.innerHTML = `
        <div class="nexora-message-box">

            <div class="message-icon">
                ${success ? "✓" : "!"}
            </div>

            <div class="message-content">

                <strong>${title}</strong>

                <p>${message}</p>

            </div>

        </div>
    `;

    document.body.appendChild(messageBox);

    const style = document.createElement("style");

    style.textContent = `
        #nexoraMessage {
            position: fixed;
            top: 30px;
            right: 30px;
            z-index: 9999;
            animation: nexoraAdminSlide 0.5s ease;
        }

        .nexora-message-box {
            min-width: 320px;
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 18px 22px;
            border-radius: 12px;
            background: rgba(7, 11, 25, 0.96);
            border: 1px solid ${success ? "#00d4ff" : "#ff4d6d"};
            box-shadow: 0 0 30px ${
                success
                    ? "rgba(0,212,255,0.30)"
                    : "rgba(255,77,109,0.30)"
            };
            backdrop-filter: blur(15px);
        }

        .message-icon {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: ${
                success
                    ? "rgba(0,212,255,0.12)"
                    : "rgba(255,77,109,0.12)"
            };
            color: ${success ? "#00d4ff" : "#ff4d6d"};
            font-size: 22px;
        }

        .message-content strong {
            display: block;
            color: ${success ? "#00d4ff" : "#ff4d6d"};
            font-size: 12px;
            letter-spacing: 2px;
            margin-bottom: 5px;
        }

        .message-content p {
            color: #aeb9ca;
            font-size: 12px;
            margin: 0;
        }

        @keyframes nexoraAdminSlide {
            from {
                opacity: 0;
                transform: translateX(50px);
            }

            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @media (max-width: 600px) {

            #nexoraMessage {
                left: 20px;
                right: 20px;
                top: 20px;
            }

            .nexora-message-box {
                min-width: auto;
            }
        }
    `;

    document.head.appendChild(style);

    if (!success) {
        setTimeout(function () {
            if (messageBox) {
                messageBox.remove();
            }
        }, 2500);
    }
}