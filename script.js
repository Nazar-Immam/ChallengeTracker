
document.addEventListener("DOMContentLoaded", () => {
    const setupContainer = document.getElementById("setupContainer");
    const form = document.getElementById("daysForm");
    const daysInput = document.getElementById("daysInput");
    const grid = document.getElementById("challengeGrid");
    const resetButton = document.getElementById("resetButton");

    function generateGrid(days) {
        grid.innerHTML = "";
        for (let i = 1; i <= days; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.disabled = i !== 1 && !localStorage.getItem(`day-${i - 1}`);

            if (localStorage.getItem(`day-${i}`)) {
                button.classList.add("completed");
            }

            button.addEventListener("click", () => {
                button.classList.toggle("completed");
                if (button.classList.contains("completed")) {
                    localStorage.setItem(`day-${i}`, "completed");
                    const nextButton = grid.querySelector(`button:nth-child(${i + 1})`);
                    if (nextButton) nextButton.disabled = false;
                } else {
                    for (let j = i + 1; j <= days; j++) {
                        const nextButton = grid.querySelector(`button:nth-child(${j})`);
                        if (nextButton) {
                            nextButton.disabled = true;
                            nextButton.classList.remove("completed");
                            localStorage.removeItem(`day-${j}`);
                        }
                    }
                }
            });

            grid.appendChild(button);
        }
    }

    const savedDays = localStorage.getItem("challengeDays");
    if (savedDays) {
        generateGrid(parseInt(savedDays));
        setupContainer.style.display = "none"; // Hide the heading and form
        resetButton.style.display = "block";
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const days = parseInt(daysInput.value);
        if (isNaN(days) || days <= 0) {
            alert("Please enter a valid number of days!");
            return;
        }

        localStorage.setItem("challengeDays", days);
        generateGrid(days);

        setupContainer.style.display = "none"; // Hide the heading and form
        resetButton.style.display = "block";
    });

    resetButton.addEventListener("click", () => {
        localStorage.clear();
        grid.innerHTML = "";
        setupContainer.style.display = "block"; // Show the heading and form again
        resetButton.style.display = "none";
        daysInput.value = "";
    });
});
