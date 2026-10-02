const signupForm = document.getElementById("signupForm");

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

const message = document.getElementById("message");


// ===============================
// SHOW / HIDE PASSWORD
// ===============================

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.textContent = "🙈";

    } else {

        passwordInput.type = "password";
        togglePassword.textContent = "👁";

    }

});


// ===============================
// SIGNUP
// ===============================

signupForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;


    // Basic validation
    if (!name || !email || !password) {

        message.style.color = "#ff5555";
        message.textContent = "Please fill all required fields.";

        return;
    }


    // Loading message
    message.style.color = "#00e5ff";
    message.textContent = "Creating account...";


    try {

        const response = await fetch(
            "http://localhost:8080/api/auth/signup",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: name,
                    email: email,
                    password: password,

                    college: "",
                    department: ""

                })
            }
        );


        const result = await response.text();


        console.log("Signup Status:", response.status);
        console.log("Backend Response:", result);


        // ===============================
        // SUCCESS
        // ===============================

        if (response.ok && result.trim() === "Signup Successful") {

            message.style.color = "#00ff88";
            message.textContent = "Signup Successful!";


            signupForm.reset();


            // Redirect to login
            setTimeout(() => {

                window.location.href = "login.html";

            }, 1000);

        }


        // ===============================
        // EMAIL ALREADY REGISTERED
        // ===============================

        else if (
            result.trim() === "Email already registered"
        ) {

            message.style.color = "#ffcc00";

            message.textContent =
                "This email is already registered.";

        }


        // ===============================
        // OTHER BACKEND ERROR
        // ===============================

        else {

            message.style.color = "#ff5555";

            message.textContent =
                "Signup failed: " + result;

        }

    }


    // ===============================
    // BACKEND CONNECTION ERROR
    // ===============================

    catch (error) {

        console.error("Signup Error:", error);

        message.style.color = "#ff5555";

        message.textContent =
            "Backend connection failed. Make sure Spring Boot is running.";

    }

});