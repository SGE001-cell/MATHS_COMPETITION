document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Get registered users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if user exists with same email + password
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Save logged in user to session
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        alert("Login successful!");
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid email or password. Please try again.");
    }
});