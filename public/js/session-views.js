const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const timeSlots = document.querySelectorAll("#time .time-slot");
const formEl = document.getElementById("form");
const reviewBtn = document.getElementById("reviewBtn");
const reviewForm = document.getElementById("review");

function handleSubmit(event) {
    if (!timeEl.value || timeEl.hasAttribute("disabled")) {
        event.preventDefault();
    }
}
function checkAvailability(event) {
    const occupiedSlotsByDay =  occupiedSlots.filter(slot => slot.date === dateEl.value);
    for (timeSlot of timeSlots) {
        if (occupiedSlotsByDay.some(slot => `T${slot.time}` === timeSlot.id)) {
            timeSlot.setAttribute("disabled", "disabled");
        }
        else {
            timeSlot.removeAttribute("disabled");
        }
    }
}

function showReviewForm(event) {
    reviewBtn.classList.add("d-none");
    reviewForm.classList.remove("d-none")
}

if (reviewBtn) {
    reviewBtn.addEventListener("click", showReviewForm);
}

if (formEl) {
    formEl.addEventListener("submit", handleSubmit);
}

if (dateEl) {
    dateEl.value = new Date().toISOString().split('T')[0];
    dateEl.addEventListener("change", checkAvailability);
    checkAvailability();
}
