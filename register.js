document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const user = {
        firstName: document.getElementById("firstName").value,
        middleName: document.getElementById("middleName").value,
        lastName: document.getElementById("lastName").value,
        school: document.getElementById("school").value,
        state: document.getElementById("state").value,
        lga: document.getElementById("lga").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        category: document.getElementById("category").value,
        dob: document.getElementById("dob").value,
        regType: document.getElementById("regType").value
    };

    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Profile saved successfully! Proceed to payment.");
    document.getElementById("proceedToPayment").style.display = "block";
});

document.getElementById("proceedToPayment").addEventListener("click", function() {
    alert("Redirecting to Paystack (integration coming soon).");
    // Later: real Paystack integration here
});