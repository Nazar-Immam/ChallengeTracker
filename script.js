document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("daysForm");
    const daysInput = document.getElementById("daysInput");
    const grid = document.getElementById("challengeGrid");

    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent form submission from reloading the page

        // Get the number of days from the input field
        const days = parseInt(daysInput.value);

        // Validate the input
        if (isNaN(days) || days <= 0) {
            alert("Please enter a valid number of days!");
            return;
        }

        // Clear existing grid content
        grid.innerHTML = "";

        // Generate buttons for the specified number of days
        for (let i = 1; i <= days; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.disabled = i !== 1; // Only enable the first button by default
            button.addEventListener("click", () => {
                // Mark the button as completed
                button.classList.toggle("completed");

                // Enable the next button only if this one is completed
                if (button.classList.contains("completed")) {
                    const nextButton = grid.querySelector(`button:nth-child(${i + 1})`);
                    if (nextButton) nextButton.disabled = false;
                } else {
                    // If unchecked, disable all subsequent buttons
                    for (let j = i + 1; j <= days; j++) {
                        const nextButton = grid.querySelector(`button:nth-child(${j})`);
                        if (nextButton) {
                            nextButton.disabled = true;
                            nextButton.classList.remove("completed");
                        }
                    }
                }
            });
            grid.appendChild(button);
        }
    });
});
