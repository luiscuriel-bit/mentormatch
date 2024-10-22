const form = document.querySelector("form");
const user = document.getElementById("name");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const role = document.getElementById("role");
const experience = document.getElementById("experience")
const mentorFields = document.getElementById("mentorFields");
const studentFields = document.getElementById("studentFields");

function handleRoleChange(event) {
    mentorFields.style.display = role.value === "mentor" ? "block" : "none";
    studentFields.style.display = role.value === "student" ? "block" : "none";
    role.value === "mentor" ? experience.setAttribute("required", "required") : experience.removeAttribute("required");
}

function handleSubmit(event) {

    let isValid = true;

    if (!user.value) {
        isValid = false;
        user.classList.add('is-invalid');
    } else {
        user.classList.remove('is-invalid');
    }
    
    if (!username.value) {
        isValid = false;
        username.classList.add('is-invalid');
    } else {
        username.classList.remove('is-invalid');
    }

    if (!email.value || !email.checkValidity()) {
        isValid = false;
        email.classList.add('is-invalid');
    } else {
        email.classList.remove('is-invalid');
    }

    if (password.value.length < 8) {
        isValid = false;
        password.classList.add('is-invalid');
    } else {
        password.classList.remove('is-invalid');
    }

    if (password.value !== confirmPassword.value) {
        isValid = false;
        confirmPassword.classList.add('is-invalid');
    } else {
        confirmPassword.classList.remove('is-invalid');
    }

    if (!role.value) {
        isValid = false;
        role.classList.add('is-invalid');
    } else {
        role.classList.remove('is-invalid');
    }

    if (!isValid) { 
        event.preventDefault();
    }
}

// Event Listener
form.addEventListener("submit", handleSubmit);
role.addEventListener("change", handleRoleChange);