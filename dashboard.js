// Sidebar navigation
const links = document.querySelectorAll(".sidebar a");
const pages = document.querySelectorAll(".page");
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const logoutBtn = document.getElementById("logoutBtn");

links.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const pageId = link.getAttribute("data-page");

    pages.forEach(page => page.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");

    // Auto-close sidebar on mobile
    sidebar.classList.remove("open");
  });
});

// Toggle menu (for mobile)
menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

// Logout button
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
});

// Profile rendering
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser) {
  document.getElementById("profileName").textContent = `${currentUser.firstName} ${currentUser.lastName}`;
  document.getElementById("profileEmail").textContent = currentUser.email;
  document.getElementById("profileSchool").textContent = currentUser.school;
  document.getElementById("profileState").textContent = currentUser.state;
  document.getElementById("profileLga").textContent = currentUser.lga;
  document.getElementById("profileCategory").textContent = currentUser.category;
}

// Edit Profile button
document.getElementById("editProfileBtn").addEventListener("click", () => {
  alert("Profile editing coming soon!");
});

// Exam rules agreement
const agreeRules = document.getElementById("agreeRules");
const startExamBtn = document.getElementById("startExamBtn");

agreeRules.addEventListener("change", () => {
  startExamBtn.disabled = !agreeRules.checked;
});

startExamBtn.addEventListener("click", () => {
  window.location.href = "examHall.html";
});