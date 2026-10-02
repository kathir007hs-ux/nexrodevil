const loginForm =
    document.getElementById("loginForm");


loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const email =
            document.getElementById("email")
                .value
                .trim();

        const password =
            document.getElementById("password")
                .value;


        const savedAccount =
            JSON.parse(
                localStorage.getItem("nexoraAccount")
            );


        // ACCOUNT NOT FOUND

        if (!savedAccount) {

            showMessage(
                "ACCOUNT NOT FOUND",
                "Please create your NEXORA account first.",
                false
            );

            return;
        }


        // EMAIL CHECK

        if (email !== savedAccount.email) {

            showMessage(
                "LOGIN FAILED",
                "Incorrect email address.",
                false
            );

            return;
        }


        // PASSWORD CHECK

        if (password !== savedAccount.password) {

            showMessage(
                "LOGIN FAILED",
                "Incorrect password.",
                false
            );

            return;
        }


        // LOGIN SUCCESS

        localStorage.setItem(
            "nexoraLoggedIn",
            "true"
        );


        localStorage.setItem(
            "nexoraCurrentUser",
            JSON.stringify({
                name: savedAccount.name,
                email: savedAccount.email,
                college: savedAccount.college
            })
        );


        showMessage(
            "ACCESS GRANTED",
            "Welcome back, " + savedAccount.name + "!",
            true
        );


        setTimeout(function () {

            window.location.href =
                "dashboard.html";

        }, 1800);

    }
);


// CUSTOM NEXORA MESSAGE

function showMessage(
    title,
    message,
    success
) {

    const oldMessage =
        document.getElementById(
            "nexoraMessage"
        );

    if (oldMessage) {
        oldMessage.remove();
    }


    const messageBox =
        document.createElement("div");

    messageBox.id =
        "nexoraMessage";


    messageBox.innerHTML = `

        <div class="nexora-message-box">

            <div class="message-icon">
                ${success ? "✓" : "!"}
            </div>

            <div class="message-content">

                <strong>
                    ${title}
                </strong>

                <p>
                    ${message}
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

        #nexoraMessage {

            position: fixed;

            top: 30px;
            right: 30px;

            z-index: 9999;

            animation:
                nexoraSlide 0.5s ease;

        }


        .nexora-message-box {

            min-width: 320px;

            display: flex;

            align-items: center;

            gap: 15px;

            padding: 18px 22px;

            border-radius: 12px;

            background:
                rgba(7, 11, 25, 0.96);

            border:
                1px solid
                ${success ? "#00d4ff" : "#ff4d6d"};

            box-shadow:
                0 0 30px
                ${success
                    ? "rgba(0,212,255,0.25)"
                    : "rgba(255,77,109,0.25)"};

            backdrop-filter: blur(15px);

        }


        .message-icon {

            width: 40px;
            height: 40px;

            display: flex;

            align-items: center;
            justify-content: center;

            border-radius: 50%;

            background:
                ${success
                    ? "rgba(0,212,255,0.12)"
                    : "rgba(255,77,109,0.12)"};

            color:
                ${success ? "#00d4ff" : "#ff4d6d"};

            font-family: Arial;

            font-size: 22px;

        }


        .message-content strong {

            display: block;

            color:
                ${success ? "#00d4ff" : "#ff4d6d"};

            font-family:
                'Orbitron', sans-serif;

            font-size: 12px;

            letter-spacing: 2px;

            margin-bottom: 5px;

        }


        .message-content p {

            color: #aeb9ca;

            font-size: 12px;

            margin: 0;

        }


        @keyframes nexoraSlide {

            from {

                opacity: 0;

                transform:
                    translateX(50px);

            }

            to {

                opacity: 1;

                transform:
                    translateX(0);

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

            messageBox.remove();

        }, 2500);

    }

}