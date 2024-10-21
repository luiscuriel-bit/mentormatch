const form = document.querySelector("form");
const role = document.getElementById("role");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const strengthMessage = document.getElementById("strengthMessage")
const experience = document.getElementById("experience")
const mentorFields = document.getElementById("mentorFields");
const studentFields = document.getElementById("studentFields");

function handlePasswordInput(event) {
    const password = this.value;
    if (password.length < 8) {
        strengthMessage.textContent = "Password too short";
    }
    else {
        strengthMessage.textContent = "Password is strong";
    }
}

function handleRoleChange(event) {
    mentorFields.style.display = role.value === "mentor" ? "block" : "none";
    studentFields.style.display = role.value === "student" ? "block" : "none";
    role.value === "mentor" ? experience.setAttribute("required", "required") : experience.removeAttribute("required");
}

function handleSubmit(event) {
    if (password.value !== confirmPassword.value) {
        event.preventDefault();
        alert("Passwords must match");
    }
}

// Event Listener
if (password) {
    password.addEventListener("input", handlePasswordInput);
    form.addEventListener("submit", handleSubmit);
}
role.addEventListener("change", handleRoleChange);