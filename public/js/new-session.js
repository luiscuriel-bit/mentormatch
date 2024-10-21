const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const timeSlots = document.querySelectorAll("#time .time-slot");
const form = document.getElementById("form");


dateEl.value = new Date().toISOString().split('T')[0];

function handleSubmit(event){
    if (!timeEl.value || timeEl.hasAttribute("disabled")){
        event.preventDefault();
    }
}

function checkAvailability(event) {
    const occupiedSlotsByDay = occupiedSlots.filter(slot => slot.date === dateEl.value);
    
    for (timeSlot of timeSlots) {
        if (occupiedSlotsByDay.some(slot => `T${slot.time}` === timeSlot.id)) {
            timeSlot.setAttribute("disabled", "disabled");
        }
        else {
            timeSlot.removeAttribute("disabled");
        }
    }
}

checkAvailability();

form.addEventListener("submit", handleSubmit);
dateEl.addEventListener("change", checkAvailability);