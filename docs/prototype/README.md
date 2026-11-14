# Bible site: prototype of the redesign

This folder has the prototype that Arthur and the designer used on 2026-11-14 to decide the redesign. The decisions are in section 7 of `docs/DESIGN.md`. If the prototype and `docs/DESIGN.md` differ, `docs/DESIGN.md` is correct.

WARNING: The prototype is a reference for the look and the movement. It is not code for the site. It is plain HTML and JavaScript in one file. Do not copy its structure into `src/`. You can use its values: sizes, spacing, colors, and timing.

## How to run it

1. Make sure that `docs/prototype/data` is in `.gitignore`.
2. Run `node docs/prototype/make-data.mjs` from the project folder. The script makes `docs/prototype/data/` from the files in `public/data/`.
3. Open `docs/prototype/index.html` in a browser.

The prototype gets the fonts Inter and Lora from Google Fonts. With no network, the browser uses its own fonts, and the wall looks different.

## Pages

The prototype uses its own page addresses. The site uses the addresses in section 7.6 of `docs/DESIGN.md`.

| Page | Address in the prototype |
|---|---|
| Wall | `index.html` |
| Reading page | `index.html#john-3` |
| Timeline | `index.html#timeline` |
| Quotations | `index.html#quotations` |
| Sources | `index.html#sources` |

## What is not correct in the prototype

- The book list, the introductions, the dates, and the quotation counts are copies inside `index.html`. They were made on 2026-11-14. The site must read `public/data/`.
- NOT VERIFIED: the years of the 17 books that have an estimate on the timeline. The designer wrote them from memory. Task 16 in `docs/TASKS.md` gets the years from the approved sources.
- The line "about 400 years" on the timeline is written by hand. The site must compute the number.
- The Sources page has no credits for the fonts Inter and Lora.
- The pop-up shows 6 verses of a linked passage at most. The site keeps the rule of the built pop-up.
- In `index.html`, the function `travelMove` can show the wall as a map during travel. It is switched off. Arthur decided on 2026-11-14 that travel is a direct change. Do not build it.
- The prototype has two layouts with the limit at 700 px. The site has the limit at 900 px. See section 7.4 of `docs/DESIGN.md`.

## Screenshots

`docs/screenshots/redesign/` has screenshots of the prototype at 1440 by 900 px and at 390 by 844 px. The names end in `-desktop.png` and `-phone.png`.
