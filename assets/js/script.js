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
   2. FAQ accordion
   Answers are hidden by CSS (display: none). Clicking a question
   toggles the .show class, which switches the answer to display:
   block. Clicking again hides it.
   ------------------------------------------------------------ */
const questions = document.querySelectorAll(".faq-question");

questions.forEach(function (question) {
    question.addEventListener("click", function () {
        const answer = question.nextElementSibling;
        const isOpen = answer.classList.toggle("show");

        // Swap the + / - marker and tell screen readers the state.
        question.classList.toggle("open", isOpen);
        question.setAttribute("aria-expanded", isOpen);
    });
});


/* ------------------------------------------------------------
   3. Appliance energy calculator (Televisions page)
   ------------------------------------------------------------ */
const calcForm = document.getElementById("calc-form");

if (calcForm) {
    const modelSelect = document.getElementById("model");
    const powerInput = document.getElementById("power");
    const hoursInput = document.getElementById("hours");
    const priceInput = document.getElementById("price");
    const resultsPanel = document.getElementById("results");
    const resetButton = document.getElementById("calc-reset");

    // Days used to turn a daily figure into a monthly or yearly one.
    const DAYS_PER_MONTH = 30;
    const DAYS_PER_YEAR = 365;

    /* Reads one input and checks it is a number inside the allowed
       range. Returns the number, or null when the value is invalid.
       The matching error message is written under the input. */
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

    /* Formats a number with a fixed number of decimal places. */
    function format(value, decimals) {
        return value.toFixed(decimals);
    }

    /* Builds the results panel from the calculated figures. */
    function showResults(daily, monthly, yearly, monthlyCost, yearlyCost) {
        resultsPanel.classList.remove("error");
        resultsPanel.innerHTML =
            "<h3>Estimated energy use</h3>" +
            "<div class=\"result-grid\">" +
                "<div class=\"result-item\">" +
                    "<span class=\"result-label\">Daily consumption</span>" +
                    "<span class=\"result-value\">" + format(daily, 2) + " kWh</span>" +
                "</div>" +
                "<div class=\"result-item\">" +
                    "<span class=\"result-label\">Monthly consumption</span>" +
                    "<span class=\"result-value\">" + format(monthly, 1) + " kWh</span>" +
                "</div>" +
                "<div class=\"result-item\">" +
                    "<span class=\"result-label\">Yearly consumption</span>" +
                    "<span class=\"result-value\">" + format(yearly, 1) + " kWh</span>" +
                "</div>" +
                "<div class=\"result-item\">" +
                    "<span class=\"result-label\">Monthly cost</span>" +
                    "<span class=\"result-value\">$" + format(monthlyCost, 2) + "</span>" +
                "</div>" +
                "<div class=\"result-item\">" +
                    "<span class=\"result-label\">Yearly cost</span>" +
                    "<span class=\"result-value\">$" + format(yearlyCost, 2) + "</span>" +
                "</div>" +
            "</div>" +
            "<p class=\"results-note\">Monthly figures assume " + DAYS_PER_MONTH +
            " days and yearly figures assume " + DAYS_PER_YEAR + " days.</p>";
    }

    /* Shows a single message instead of results. */
    function showMessage(text) {
        resultsPanel.classList.add("error");
        resultsPanel.innerHTML = "<p class=\"results-message\">" + text + "</p>";
    }

    /* Reads the inputs, validates them and updates the results panel.
       The panel is always rewritten, so results are replaced rather
       than duplicated. */
    function calculate() {
        const watts = readNumber(powerInput, "a power rating in watts", 1, 10000);
        const hours = readNumber(hoursInput, "hours of use per day", 0, 24);
        const cents = readNumber(priceInput, "an electricity price in cents", 0, 200);

        if (watts === null || hours === null || cents === null) {
            showMessage("Please correct the highlighted fields and try again.");
            return;
        }

        const dailyKwh = (watts * hours) / 1000;   // watt hours to kilowatt hours
        const monthlyKwh = dailyKwh * DAYS_PER_MONTH;
        const yearlyKwh = dailyKwh * DAYS_PER_YEAR;

        const pricePerKwh = cents / 100;           // cents to dollars
        const monthlyCost = monthlyKwh * pricePerKwh;
        const yearlyCost = yearlyKwh * pricePerKwh;

        showResults(dailyKwh, monthlyKwh, yearlyKwh, monthlyCost, yearlyCost);
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

    // Typing a custom wattage switches the dropdown to Custom.
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
