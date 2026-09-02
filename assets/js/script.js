/* ============================================================
   Appliance Energy Consumption - shared script
   Runs on every page. Each feature checks that the elements it
   needs exist, so the same file can be reused across all pages.
   ============================================================ */

/* ------------------------------------------------------------
   1. Footer year
   Writes the current year into the footer so it never goes stale.
   ------------------------------------------------------------ */
const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* ------------------------------------------------------------
   2. Mobile navigation
   The menu button is only visible below 900px. It shows and
   hides the navigation list by toggling an .open class.
   ------------------------------------------------------------ */
const navToggle = document.getElementById("nav-toggle");
const navList = document.querySelector(".nav-links");

if (navToggle && navList) {
    navToggle.addEventListener("click", function () {
        const isOpen = navList.classList.toggle("open");

        navToggle.setAttribute("aria-expanded", isOpen);
        navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });
}


/* ------------------------------------------------------------
   3. FAQ accordion
   Answers are hidden by CSS (display: none). Clicking a question
   toggles the .show class, which switches the answer to display:
   block. The .open class on the button rotates the chevron.
   ------------------------------------------------------------ */
const questions = document.querySelectorAll(".faq-question");

questions.forEach(function (question) {
    question.addEventListener("click", function () {
        const answer = question.nextElementSibling;
        const isOpen = answer.classList.toggle("show");

        question.classList.toggle("open", isOpen);
        question.setAttribute("aria-expanded", isOpen);
    });
});


/* ------------------------------------------------------------
   4. Appliance energy calculator (Home page)
   ------------------------------------------------------------ */
const calcForm = document.getElementById("calc-form");

if (calcForm) {
    const modelSelect = document.getElementById("model");
    const powerInput = document.getElementById("power");
    const hoursInput = document.getElementById("hours");
    const priceInput = document.getElementById("price");
    const resetButton = document.getElementById("calc-reset");

    const messageBox = document.getElementById("results-message");
    const resultsGrid = document.getElementById("results-energy");

    // The six output tiles, updated in place so results are never duplicated.
    const outputs = {
        dailyKwh: document.getElementById("res-daily-kwh"),
        monthlyKwh: document.getElementById("res-monthly-kwh"),
        yearlyKwh: document.getElementById("res-yearly-kwh"),
        dailyCost: document.getElementById("res-daily-cost"),
        monthlyCost: document.getElementById("res-monthly-cost"),
        yearlyCost: document.getElementById("res-yearly-cost")
    };

    // Days used to turn a daily figure into a monthly or yearly one.
    const DAYS_PER_MONTH = 30;
    const DAYS_PER_YEAR = 365;

    /* Reads one input and checks it is a number inside the allowed
       range. Returns the number, or null when the value is invalid.
       The matching message is written underneath the input. */
    function readNumber(input, label, min, max) {
        const errorBox = document.getElementById(input.id + "-error");
        const raw = input.value.trim();
        let message = "";

        if (raw === "") {
            message = "Please enter " + label + ".";
        } else {
            const value = Number(raw);

            if (Number.isNaN(value)) {
                message = "That value must be a number.";
            } else if (value < min || value > max) {
                message = "Value must be between " + min + " and " + max + ".";
            } else {
                errorBox.textContent = "";
                input.classList.remove("invalid");
                return value;
            }
        }

        errorBox.textContent = message;
        input.classList.add("invalid");
        return null;
    }

    /* Creates the warning banner above the results, or removes it
       when everything is valid. */
    function setMessage(text) {
        if (text === "") {
            messageBox.innerHTML = "";
            resultsGrid.classList.remove("is-stale");
            return;
        }

        const banner = document.createElement("p");
        banner.className = "results__message";
        banner.textContent = text;

        messageBox.innerHTML = "";
        messageBox.appendChild(banner);
        resultsGrid.classList.add("is-stale");
    }

    /* Reads the inputs, validates them and updates the result tiles. */
    function calculate() {
        const watts = readNumber(powerInput, "a power rating in watts", 1, 10000);
        const hours = readNumber(hoursInput, "hours of use per day", 0, 24);
        const cents = readNumber(priceInput, "an electricity price in cents", 0, 200);

        if (watts === null || hours === null || cents === null) {
            setMessage("Please correct the highlighted fields to update the results.");
            return;
        }

        const dailyKwh = (watts * hours) / 1000;   // watt hours to kilowatt hours
        const monthlyKwh = dailyKwh * DAYS_PER_MONTH;
        const yearlyKwh = dailyKwh * DAYS_PER_YEAR;

        const pricePerKwh = cents / 100;           // cents to dollars
        const dailyCost = dailyKwh * pricePerKwh;
        const monthlyCost = monthlyKwh * pricePerKwh;
        const yearlyCost = yearlyKwh * pricePerKwh;

        setMessage("");

        outputs.dailyKwh.textContent = dailyKwh.toFixed(2) + " kWh";
        outputs.monthlyKwh.textContent = monthlyKwh.toFixed(1) + " kWh";
        outputs.yearlyKwh.textContent = yearlyKwh.toFixed(1) + " kWh";
        outputs.dailyCost.textContent = "$" + dailyCost.toFixed(2);
        outputs.monthlyCost.textContent = "$" + monthlyCost.toFixed(2);
        outputs.yearlyCost.textContent = "$" + yearlyCost.toFixed(2);
    }

    // Choosing a model fills in its known wattage.
    modelSelect.addEventListener("change", function () {
        if (modelSelect.value === "custom") {
            powerInput.value = "";
            powerInput.focus();
        } else {
            powerInput.value = modelSelect.value;
        }
        calculate();
    });

    // Typing a wattage that matches no model switches the dropdown to Custom.
    powerInput.addEventListener("input", function () {
        if (powerInput.value !== modelSelect.value) {
            modelSelect.value = "custom";
        }
    });

    // Recalculate as the user changes any input.
    [powerInput, hoursInput, priceInput].forEach(function (input) {
        input.addEventListener("input", calculate);
    });

    // Submitting the form recalculates without reloading the page.
    calcForm.addEventListener("submit", function (event) {
        event.preventDefault();
        calculate();
    });

    // Reset restores the starting values and clears any error styling.
    resetButton.addEventListener("click", function () {
        calcForm.reset();
        [powerInput, hoursInput, priceInput].forEach(function (input) {
            input.classList.remove("invalid");
            document.getElementById(input.id + "-error").textContent = "";
        });
        calculate();
    });

    // Show a result straight away using the default values, so the
    // calculator also works correctly after the page is refreshed.
    calculate();
}
