const dateEl = document.getElementById("date");
const timeSlots = document.querySelectorAll("#time option");

date.addEventListener("change", checkAvailability);

function checkAvailability() {
    const date = new Date(dateEl.value);
    
    timeSlots.forEach(timeSlot => {
        timeSlot.disabled = false;
    });

    occupiedSlots.forEach(slot => {
        if (slot.date === selectedDate) {
            timeSlots.forEach(timeSlot => {
                if (timeSlot.value === slot.time) {
                    timeSlot.disabled = true;
                }
            });
        }
    });
}
