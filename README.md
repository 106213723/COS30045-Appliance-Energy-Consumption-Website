# Appliance Energy Consumption Website

A three-page website built for COS30045 Data Visualisation, Exercise 0.2.
It is written with plain HTML, one external CSS file and one external JavaScript
file — no frameworks, no libraries and no build step.

## Pages

| Page | File | Contents |
| --- | --- | --- |
| Home | `index.html` | Editorial hero, context section, FAQ accordion |
| Televisions | `televisions.html` | Data story in three chapters with chart placeholders ready for D3 |
| About Us | `about.html` | Project background, methodology and data transparency notes |

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
  JavaScript adding a `.show` class, with a chevron that rotates on open
- Footer on every page with the current year inserted by JavaScript
- Collapsible navigation menu on narrow screens

## Design System

The visual design follows an editorial, scientific-journal aesthetic: sharp
0px corners, no drop shadows, 1px tonal outlines, generous whitespace and a
strict 12-column grid. The tokens live as CSS custom properties at the top of
`assets/css/style.css`, so the whole site can be re-themed from one place.

| Token | Value | Used for |
| --- | --- | --- |
| `--surface` | `#f7f9f8` | Page canvas |
| `--surface-card` | `#ffffff` | Cards and story chapters |
| `--primary` | `#167a45` | Buttons, active nav, accents |
| `--primary-dark` | `#005f32` | Brand wordmark, hover on primary |
| `--energy-green` | `#2fae66` | Data highlights |
| `--outline-variant` | `#dde4e0` | Hairline borders and grid lines |

Type pairs **Hanken Grotesk** (headlines, tight letter-spacing) with
**Source Sans 3** (body and data). Both are loaded from Google Fonts with a
system fallback stack, so the site still reads correctly offline. Icons are
inline SVG rather than an icon font, which keeps the pages self-contained.

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

**Navigation menu** — below 900px the menu button toggles an `.open` class on
the navigation list, and updates `aria-expanded` so the button's state is
announced correctly.

**FAQ accordion** — `document.querySelectorAll(".faq-question")` collects every
question button. `forEach` loops over them and `addEventListener("click", ...)`
waits for a click. `nextElementSibling` gets the answer sitting directly below
the button, and `classList.toggle("show")` adds or removes the class that
switches the answer between `display: none` and `display: block`. The same
toggle puts `.open` on the button, which rotates the chevron in CSS.

## Running the Site

Open `index.html` in a browser, or use the VS Code Live Server extension. No
build step or server-side code is required.

## Generative AI Reflection

*(Replace the text below with your own account of what you actually did — the
unit expects a personal reflection, and this section is marked.)*

**Tool used.** I used Claude (and/or ChatGPT) while building this site, and
Google Stitch to generate the visual design direction.

**What I used it for.** I used it to help plan the folder structure, to
understand how CSS grid placement and custom properties work, and to translate
a generated design mockup into hand-written CSS.

**What I changed after generation.** The design mockups were produced with
Tailwind loaded from a CDN and Material Symbols as an icon font. Because the
exercise requires all styling to live in one external stylesheet with no
libraries, I rebuilt the design as plain CSS: the mockup's design tokens became
CSS custom properties, the utility classes became named component classes, and
the icon font was replaced with inline SVG so the pages have no icon
dependency. I also rewrote the placeholder copy, which made claims about data
sources and independence that would not have been true of a student project.

**What I learned.** I now understand how `addEventListener` connects a user
action to a JavaScript function, and how `classList.toggle` lets CSS control
what is visible while JavaScript only manages state. Rebuilding the mockup by
hand also taught me how CSS grid placement works — I hit a bug where
`grid-column: span 8` combined with a separate `grid-column-start` collapsed a
block to one column, because the shorthand had already set the end line to
`auto`.

**Limitations.** Generated code still had to be read, tested and corrected. The
mockups assumed a framework the exercise does not allow, so they were a
starting point for the design rather than code I could use directly. Some
generated copy sounded authoritative but was not factually supportable, which
was a useful reminder to check claims rather than assume the output is
accurate.
