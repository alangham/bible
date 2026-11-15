# Task 18: measurements

Measured on 2026-11-15, on the production build served by `npx vite preview`, in Chromium from Playwright.
The scripts are `scripts/measure-pages.mjs` for steps 2 to 4 and `scripts/measure-fps.mjs` for step 7. The header of each script gives its method.

## Step 1. axe-core

`e2e/a11y.spec.ts` runs axe-core, the WCAG 2.0, 2.1, and 2.2 rules of levels A and AA, at 1440 by 900 px and at 390 by 844 px on these pages: the wall, the reading page, the reading page with the pop-up open, the timeline, the quotation diagram, and the Sources page. It also runs on the reading page with "About this book" open, on Psalm 119, on the quotation diagram with Romans selected, and on the trail after travel. All 25 tests pass. The list of known failures is empty.

## Step 2. The size of the controls

The lowest and the narrowest control of each page, width by height. A control in a sentence of text is not counted: WCAG 2.5.8, exception "Inline". No counted control is below 24 px in either direction.

| Page | 1440 by 900 px | 390 by 844 px |
|---|---|---|
| Wall | lowest: book name "Song of Solomon", 214 by 24 px. Narrowest: link "Sources", 56 by 29 px | lowest: book name "Deuteronomy", 168 by 24 px. Narrowest: link "Sources", 56 by 29 px |
| Reading page | lowest: link control in a cross-reference line, 99 by 24 px. Narrowest: link in the read-with list, 81 by 32 px | lowest: link control in a cross-reference line, 99 by 24 px. Narrowest: mark, 24 by 24 px |
| Reading page, pop-up open | lowest: link control in a cross-reference line, 99 by 24 px. Narrowest: link control in a cross-reference line, 80 by 24 px | the same as the reading page |
| Timeline | lowest: book name "Genesis", 68 by 24 px. Narrowest: book name "Job", 36 by 24 px | lowest: row "Judges", 350 by 34 px. Narrowest: link "Sources" in the top bar, 55 by 51 px |
| Quotation diagram | lowest: book name "Philippians", 120 by 24 px. Narrowest: book name "Nahum", 27 by 121 px | lowest: link "Books" in the top bar, 84 by 43 px. Narrowest: link "Sources" in the top bar, 55 by 51 px |
| Sources page | lowest: link "Books" in the top bar, 84 by 43 px. Narrowest: link "Sources" in the top bar, 60 by 51 px | lowest: link "Books" in the top bar, 84 by 43 px. Narrowest: link "Sources" in the top bar, 56 by 51 px |

- The book names around the narrow quotation diagram are about 10 by 66 px. They are not counted: the list control above the diagram selects the same book, at 350 by 44 px. This is the exception "Equivalent" of WCAG 2.5.8. Arthur accepted it on 2026-11-14 (`docs/DESIGN.md` section 7.8).
- The 12 links in the text of the Sources page are 20 px high. They are in sentences.
- Before this task, each book name of the wide quotation diagram was 23.6 px high. Task 18 makes it 24 px: `hitHeight` in `src/reference/quotationLayout.ts`. The accessibility test now allows 0.05 px below the limit, where it allowed 0.5 px.

## Step 3. The keyboard

- On each page, the Tab key reaches each visible control, in the order of the page. Each control shows the focus: a style of the control changes when it has the focus.
- In the narrow layout, the pop-up keeps the focus on "Go there" and "Stay here". In the wide layout, the pop-up does not keep the focus, by the design of `src/book/LinkPopup.tsx`. Escape closes the pop-up in both layouts, and the focus goes back to the control of the link.
- Each kind of control operates from the keyboard, in both layouts:
  - the wall: a book name opens the book; a Reference link opens its page
  - the reading page: the chapter grid opens, the focus goes to the current chapter, Escape closes it, and a chapter opens; "About this book" and "Scholars differ" open; a link control opens the pop-up; "Go there" travels; "Back" in the trail returns; a link in the read-with list opens its chapter
  - the timeline: a book name opens the book
  - the quotation diagram: Enter on a book name selects it, and the list control selects a book in the narrow layout; a book in the list opens it
  - the Sources page: "Books" in the top bar opens the wall

## Step 4. Reduced motion

With `prefers-reduced-motion: reduce`, these actions start no animation, no transition, and no view transition, and each scroll is one jump: open a book from the wall, open the chapter grid, "About this book", and "Scholars differ", scroll to the next chapters, open the pop-up, "Go there", select a book on the quotation diagram, and open a book from the timeline. The same check with no preference finds the movements of the site: the move of the book name, the turn of the carets, the fade of the lines, and the light background after travel. So the check finds a movement when there is one.

## Step 5. Code of the old pages

- `package.json` has no package of the old pages. Task 13 removed three.js, @react-three/fiber, and GSAP. Task 17 removed the fonts Cormorant Garamond and Newsreader.
- Task 18 removed from `src/`: the fields `stack` and `position` of a book and the colors `cloth` and `text` of a group in `src/data/books.ts`, the function `spineThickness`, their tests, and the CSS variable `--ink-secondary`, which no rule used. It changed the comments and the test names that used the names of the old pages.
- `public/data/books.json` keeps the fields `stack` and `position`. The task names only `src/` and `package.json`. No code reads these fields now.
- A search of the CSS of `src/index.css` found no class that the code does not use. The classes `tb-*` and `sh-*` are made in `src/book/ChapterBody.tsx`.

## Step 6. Size of the build

`npm run build`. Before Task 12: the deploy log of commit `eb409b9`, the last commit before Task 12.

| File | Before Task 12 | gzip before | Task 18 | gzip Task 18 |
|---|---|---|---|---|
| JavaScript | 1,300.24 kB in 6 files | 372.29 kB | 272.31 kB in 1 file | 85.32 kB |
| Styles | 57.20 kB | 9.99 kB | 45.23 kB | 8.15 kB |

The JavaScript before Task 12: `index-*.js` 370.32 kB, `react-three-fiber.esm-*.js` 918.35 kB, `CoverScene-*.js` 5.32 kB, `TableScene-*.js` 3.45 kB, `PageTurn-*.js` 1.90 kB, and `spineTexture-*.js` 0.90 kB.

## Step 7. A long scroll on the reading page

`node scripts/measure-fps.mjs http://localhost:4174/bible/ psalms`. Pixel 7 profile at 390 by 844 px, CPU 4 times slower. A steady scroll of 40 px each 16 ms.

| Part | Run 1 | Run 2 |
|---|---|---|
| Psalms 1 to 10, average and worst second | 60 and 60 frames per second | 60 and 60 frames per second |
| Psalms 141 to 150, average and worst second | 57 and 55 frames per second | 58 and 57 frames per second |
| Elements in the page at the end | 13,938 | 13,938 |

The comparison is intended: the first part runs with about 11 chapters in the page, and the last part with about 150. At the end the page has 151 chapters: the 150 Psalms and Proverbs 1, which the page added below. The frame rate in the last 10 Psalms is 95 % and 97 % of the rate in the first 10 Psalms. The limit of the task is 75 %, so the task proposes no correction.

## Step 8. Names

The names in `src/`, `e2e/`, and `scripts/` agree with the table of names in `CLAUDE.md`. Task 18 changed the comments that used the names of the first build: table, stack, spine, cover, spread, scene, and linen. "Cross-reference" stays where it names the data of OpenBible.info and of the Berean Standard Bible files.

## Step 9. Screenshots

`docs/screenshots/task-18/`: the wall, the reading page, the reading page with the pop-up open, the timeline, the quotation diagram, and the Sources page, at 1440 by 900 px (`*-desktop.png`) and at 390 by 844 px (`*-phone.png`).

## Step 10. POLISH.md

Items 11, 12, and 14 of `docs/POLISH.md` keep the status PROPOSED. The report of Task 18 asks Arthur if he closes them.
