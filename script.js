document.addEventListener("DOMContentLoaded", () => {
    const setupContainer = document.getElementById("setupContainer");
    const form = document.getElementById("daysForm");
    const daysInput = document.getElementById("daysInput");
    const grid = document.getElementById("challengeGrid");
    const resetButton = document.getElementById("resetButton");

    // Create a milestone message element
    const milestoneMessage = document.createElement("p");
    milestoneMessage.style.color = "lightgreen";
    milestoneMessage.style.margin = "10px 0";
    milestoneMessage.style.fontWeight = "bold";
    milestoneMessage.style.textAlign = "center";

    // Insert the message above the grid
    grid.parentNode.insertBefore(milestoneMessage, grid);

    // Generate dynamic milestones based on user input days
    function generateMilestones(totalDays) {
        const milestoneMessages = [
            "Amazing start! You've conquered the first level!",
            "Fantastic! You're gaining momentum. Keep it up!",
            "You're unstoppable! Another milestone achieved!",
            "Incredible work! You're halfway there!",
            "Brilliant! You're truly dedicated. Keep going!",
            "Phenomenal! Your hard work is paying off!",
            "Outstanding! You're almost at the finish line!",
            "You're a true champion! You've completed the journey!",
        ];

        const milestones = [];
        const daysPerLevel = Math.ceil(totalDays / milestoneMessages.length);

        for (let i = 1; i <= totalDays; i += daysPerLevel) {
            const level = Math.ceil(i / daysPerLevel);
            milestones.push({
                level: `Level ${level}`,
                minDays: i,
                maxDays: Math.min(i + daysPerLevel - 1, totalDays),
                message: milestoneMessages[level - 1] || "Keep going! You're doing amazing!",
            });
        }
        return milestones;
    }

    // Function to determine the milestone based on completed days
    function getMilestone(completedDays, milestones) {
        return milestones.find(milestone => completedDays >= milestone.minDays && completedDays <= milestone.maxDays);
    }

    function generateGrid(days) {
        grid.innerHTML = "";
        const milestones = generateMilestones(days);

        for (let i = 1; i <= days; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.disabled = i !== 1 && !localStorage.getItem(`day-${i - 1}`); // Sequential completion logic

            // Restore completed state if saved
            if (localStorage.getItem(`day-${i}`)) {
                button.classList.add("completed");
            }

            button.addEventListener("click", () => {
                button.classList.toggle("completed");
                if (button.classList.contains("completed")) {
                    localStorage.setItem(`day-${i}`, "completed");

                    // Enable the next day
                    const nextButton = grid.querySelector(`button:nth-child(${i + 1})`);
                    if (nextButton) nextButton.disabled = false;

                    // Check for milestone
                    const completedDays = i; // The number of days completed
                    const milestone = getMilestone(completedDays, milestones);
                    if (milestone) {
                        milestoneMessage.textContent = milestone.message;
                        localStorage.setItem("currentLevel", milestone.level);
                    }
                } else {
                    // If unchecked, disable all subsequent buttons and reset milestone message
                    for (let j = i + 1; j <= days; j++) {
                        const nextButton = grid.querySelector(`button:nth-child(${j})`);
                        if (nextButton) {
                            nextButton.disabled = true;
                            nextButton.classList.remove("completed");
                            localStorage.removeItem(`day-${j}`);
                        }
                    }
                    milestoneMessage.textContent = ""; // Clear the milestone message
                    localStorage.removeItem("currentLevel");
                }
            });

            grid.appendChild(button);
        }
    }

    // Load saved challenge state from localStorage
    const savedDays = localStorage.getItem("challengeDays");
    if (savedDays) {
        const totalDays = parseInt(savedDays);
        generateGrid(totalDays);
        setupContainer.style.display = "none"; // Hide the form
        resetButton.style.display = "block"; // Show reset button

        // Restore the milestone message
        const savedLevel = localStorage.getItem("currentLevel");
        if (savedLevel) {
            const completedDays = parseInt(localStorage.getItem("completedDays")) || 0;
            const milestones = generateMilestones(totalDays);
            const milestone = getMilestone(completedDays, milestones);
            if (milestone) milestoneMessage.textContent = `Current Level: ${milestone.level}`;
        }
    }

    // Handle form submission
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const days = parseInt(daysInput.value);
        if (isNaN(days) || days <= 0) {
            alert("Please enter a valid number of days!");
            return;
        }

        localStorage.setItem("challengeDays", days);
        generateGrid(days);

        setupContainer.style.display = "none"; // Hide the form
        resetButton.style.display = "block"; // Show reset button
    });

    // Handle reset functionality
    resetButton.addEventListener("click", () => {
        localStorage.clear(); // Clear all saved progress
        grid.innerHTML = ""; // Clear the grid
        setupContainer.style.display = "block"; // Show the form
        resetButton.style.display = "none"; // Hide reset button
        daysInput.value = ""; // Clear the input field
        milestoneMessage.textContent = ""; // Clear the milestone message
    });
});
