# Appliance Energy Consumption Website

A small three-page website built for COS30045 Data Visualisation, Exercise 0.2.
It is written with plain HTML, one external CSS file and one external JavaScript
file — no frameworks or libraries.

## Pages

| Page | File | Contents |
| --- | --- | --- |
| Home | `index.html` | Introduction, three concept cards, FAQ accordion |
| Televisions | `televisions.html` | Television energy notes and the energy calculator |
| About Us | `about.html` | Project background |

## Technologies Used

- HTML5 for page structure
- CSS3 for all presentation (external stylesheet only, no inline styles)
- Vanilla JavaScript for interactivity (no external libraries)

## Features

- Multi-page navigation shown on all three pages
- Power logo in the top-left corner that links back to Home
- Navigation hover effect (`.nav-links a:hover`)
- Active page indicator (`.nav-links a.active`)
- FAQ accordion, hidden by default with `display: none` and revealed by
  JavaScript adding a `.show` class
- Footer on every page with the current year inserted by JavaScript
- Appliance energy calculator with input validation and a dynamic results panel

## Project Structure

```
appliance-energy/
├── index.html
├── televisions.html
├── about.html
├── README.md
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── script.js
    └── img/
        └── PowerIcon.png
```

## How the JavaScript Works

`assets/js/script.js` is loaded by all three pages. Each feature first checks
that the elements it needs are present, so the same file can be shared without
errors on pages that do not use a given feature.

**Footer year** — `document.getElementById("year")` finds the `<span>` in the
footer and `new Date().getFullYear()` writes the current year into it.

**FAQ accordion** — `document.querySelectorAll(".faq-question")` collects every
question button. `forEach` loops over them and `addEventListener("click", ...)`
waits for a click. `nextElementSibling` gets the answer sitting directly below
the button, and `classList.toggle("show")` adds or removes the class that
switches the answer between `display: none` and `display: block`.

**Energy calculator** — the form inputs are read from the DOM, validated by the
`readNumber` function, and used in these calculations:

```
daily kWh   = (watts × hours per day) ÷ 1000
monthly kWh = daily kWh × 30
yearly kWh  = daily kWh × 365
cost        = kWh × (cents per kWh ÷ 100)
```

The results panel is rewritten each time `calculate()` runs, so results are
replaced rather than duplicated. Invalid or empty inputs are highlighted and an
explanatory message is shown near the field and in the results panel. The
calculator also runs once on page load using the default values, so it displays
a correct result immediately after a refresh.

## Running the Site

Open `index.html` in a browser, or use the VS Code Live Server extension. No
build step or server-side code is required.

## Generative AI Reflection

*(Replace the text below with your own account of what you actually did — the
unit expects a personal reflection, and this section is marked.)*

**Tool used.** I used Claude (and/or ChatGPT) while building this site.

**What I used it for.** I used it to help plan the folder structure, to check
CSS syntax for the flexbox navigation bar, and to work through the logic of the
energy calculator, particularly the conversion from watts to kilowatt hours.

**What I changed after generation.** I rewrote the page content so it relates to
Australian household appliance energy use, chose the green colour scheme to
match the supplied power logo, and adjusted the calculator so it validates each
input separately and shows the error message beside the relevant field rather
than in a browser alert. I also added the reset button and the appliance model
dropdown, which were not in the original suggestion.

**What I learned.** I now understand how `addEventListener` connects a user
action to a JavaScript function, and how `classList.toggle` lets CSS control
what is visible while JavaScript only manages state. Writing the accordion
made the separation between structure (HTML), presentation (CSS) and behaviour
(JavaScript) much clearer to me.

**Limitations.** Generated code still had to be read, tested and corrected. Some
suggestions were more complicated than the exercise required, so I simplified
them to code I can explain. I also had to check the generated CSS actually
produced the hover and active states the brief asks for, since those are two
separate requirements that are easy to confuse.
