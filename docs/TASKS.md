# Bible site: task list

Do the tasks in this order. Do one task, then stop and report to Arthur. Each task is complete in itself: you do not need to read a different task to do it. The design is in `docs/DESIGN.md`.

Status values: `TODO`, `DONE`, `BLOCKED`.

---

## Task 1. Project setup and checks

Status: DONE

Goal: an empty site that builds, and answers to three open questions.

Steps:

1. Copy `docs/agents/reviewer.md` and `docs/agents/accuracy-reviewer.md` to `.claude/agents/`. Then run `git init` in the project folder.
2. Create a Vite project with React and TypeScript in the project folder.
3. Add Vitest and Playwright.
4. Add a `.gitignore` that excludes `node_modules`, `dist`, and `.env*`.
5. Make one page that shows the text "Books of the Bible".
6. Run the build. Make sure that it has no errors.
7. Check the ESV API from a browser page on `localhost`: send one request for John 1:1 to `https://api.esv.org/v3/passage/html/` with the header `Authorization: Token <key>`. Arthur supplies the key in a local `.env` file as `VITE_ESV_API_KEY`. Record if the browser permits the response.
8. Read the licence of the Berean Standard Bible. Record if the full text can be committed to a public repository.
9. Find an open data set of cross-references. Find an open list of New Testament quotations of the Old Testament. Read the licence of each.
10. Create `docs/DATA-SOURCES.md`. For each source in steps 7, 8, and 9, write the name, the address, the licence, and the result of your check.

Done when:

- `npm run build` has no errors.
- `docs/DATA-SOURCES.md` has the result of each check.

Stop and report. If the check in step 7 fails, set the status of Task 6 to `BLOCKED`.

---

## Task 2. Book data and the table page

Status: DONE

Goal: the landing page from section 4.1 of `docs/DESIGN.md`.

Steps:

1. Create `public/data/books.json` with the 66 books. For each book: id, name, group, number of chapters, stack number, position in the stack.
2. Add a unit test: 66 books, 1,189 chapters in total, stack sizes 13, 14, 12, 14, 13.
3. Build the table page as a 3D scene: linen table, sunlight from the top left, five stacks of spines.
4. Use the colors and the thickness rule from `docs/DESIGN.md`.
5. Add the legend. Make the select and clear behavior.
6. Make each spine a control with keyboard access. A spine goes to the route `#/book/<id>`.
7. Add the reduced-motion fallback.
8. Add a Playwright smoke test: the page loads, 66 spines exist, a legend entry dims the other groups.

Done when:

- The two tests pass.
- The page matches mockup D1 in structure and colors.

Stop and report. Include a screenshot.

---

## Task 3. Deploy to GitHub Pages

Status: TODO

Goal: the site is public at a GitHub Pages address.

WARNING: Do not push until Arthur gives the repository name and approves the push.

Steps:

1. Ask Arthur for the repository name.
2. Set the Vite `base` option to the repository name.
3. Add a GitHub Actions workflow that builds the site and deploys `dist` to GitHub Pages.
4. Make sure that the build does not read `VITE_ESV_API_KEY`. The site does not use an ESV key.
5. After Arthur approves, push.
6. Open the public address. Make sure that the table page loads.

Done when:

- The public address shows the table page.

Stop and report. Give Arthur the address.

---

## Task 4. Cover page

Status: TODO

Accuracy review: yes

Goal: the book page from section 4.2 of `docs/DESIGN.md`.

Steps:

1. Create `docs/CONTENT-SOURCES.md`. Then create `public/data/intros.json`. For each of the 66 books: author, written, what it is, and `review: "draft"`. Record the source of each fact in `docs/CONTENT-SOURCES.md`.
2. Obey the authorship rule in section 4.2. Give the traditional view first. Add one short line where scholars differ.
3. Build the cover page: the closed book on the table, the "Open the book" button, the three facts, the chapter list.
4. Make the move from the table: the selected spine slides out and lands as the closed book.
5. Show a small "draft" label on each introduction that Arthur did not approve.
6. Add a Playwright smoke test for one book.

Done when:

- Each of the 66 books has a cover page.
- The test passes.

Stop and report. Give Arthur the list of introductions to review.

---

## Task 5. Spread page with the bundled text

Status: TODO

Accuracy review: yes

Goal: the chapter page from sections 4.3 and 4.4 of `docs/DESIGN.md`, with the bundled translation only.

Steps:

1. Propose the subject of the nine base scenes to Arthur. Wait for approval.
2. Add the bundled translation as one JSON file for each book in `public/data/text/`. Use the source that passed the licence check in Task 1.
3. Build the open book: two pages, the text on the right page, the header above the text.
4. Build the scene engine: four paper-cut layers, parallax, and the rule that changes the scene for each book and chapter.
5. Build the nine base scenes.
6. Build the page turn: drag a corner, and arrow keys. The page must curl.
7. Make the "Open the book" move from the cover page.
8. Add the reduced-motion fallback.
9. Add a unit test: the same book and chapter always give the same scene values.
10. Add a Playwright smoke test: open Genesis 1, turn to Genesis 2.

Done when:

- Each of the 1,189 chapters opens with text and a scene.
- The tests pass.

Stop and report. Include screenshots of three categories.

---

## Task 6. Sources page and translation label

Status: TODO

Goal: the site names its translation and credits its data sources. This task replaces the earlier "Live ESV text" task. Arthur decided on 2026-11-13 that the ESV is not in version 1. Reason: the ESV terms forbid a published access key, and the site has no server to hold the key.

WARNING: Do not add ESV text or a request to the ESV API.

Steps:

1. Search the code for `VITE_ESV_API_KEY` and for `api.esv.org`. Remove each use.
2. Show the name "Berean Standard Bible" on each spread.
3. Build a "Sources" page. Add a control to it on the table page.
4. On the "Sources" page, name the Berean Standard Bible and say that it is in the public domain.
5. On the "Sources" page, credit each data source as its licence requires. Read `docs/DATA-SOURCES.md` for the conditions. OpenBible.info requires a credit and a link to the CC BY 4.0 licence.
6. Read the licence of each bundled font. If the licence requires a notice, show the notice on the "Sources" page.
7. In `docs/DATA-SOURCES.md`, add a line to the ESV section: "Not used in version 1. Decision by Arthur on 2026-11-13."
8. Add a Playwright smoke test: the "Sources" page loads and has the OpenBible.info credit.

Done when:

- The code has no use of the ESV key or the ESV API.
- The test passes.

Stop and report.

---

## Task 7. Links, travel, and trail

Status: TODO

Accuracy review: yes

Goal: section 4.5 of `docs/DESIGN.md`.

Steps:

1. Build `public/data/links/` from the sources that passed the licence check in Task 1. Mark each link as a quotation link or an echo link.
2. Show the marks in the text. Strong for quotation links. Light for echo links.
3. Add a switch for echo links.
4. Build the pop-up: reference, the text of the linked passage, "Go there", "Stay here".
5. Write a reason line for each quotation link. Do not write a reason line for an echo link. The reason line must say only what the two passages show. Record the source of each quotation link in `docs/CONTENT-SOURCES.md`.
6. Write a script in `scripts/` that checks each link: the two ends exist, no link to itself, no duplicate, the type is set. Add the script to the unit tests.
7. Build travel: the current book closes, the linked book comes onto the table, it opens at the linked passage.
8. Build the trail. Each stop is a control that goes back to that stop.
9. Add a Playwright test: open Hebrews 9, select a quotation link, travel, then use the trail to go back.

Done when:

- The test passes.
- Hebrews 9 has quotation links to the Old Testament passages that it quotes.
- The link check script passes on each link.
- The report gives the number of quotation links and the number of echo links.

Stop and report.

---

## Task 8. Timeline

Status: TODO

Accuracy review: yes

Goal: section 4.6 of `docs/DESIGN.md`.

Steps:

1. Create `public/data/dates.json`. For each book: traditional date, a range where scholars differ, and `review: "draft"`. Record the source of each date in `docs/CONTENT-SOURCES.md`.
2. Build the timeline page: books on a time axis in their category colors.
3. Draw an arc between two books that have a quotation link.
4. Make each book a control that goes to its cover page.
5. Add the "Timeline" control to the cover page and the spread page.
6. Add a Playwright smoke test.

Done when:

- The test passes.

Stop and report. Give Arthur the list of dates to review.

---

## Task 9. Phone layout and performance

Status: TODO

Goal: the site is good on a phone.

Steps:

1. Build the narrow layout of the table page from section 4.1 of `docs/DESIGN.md`: below 768 px, one stack at a time, spines of 44 px or more, swipe between stacks. Use the one layout function to select it.
2. Make the spread readable on a phone: one page in view, swipe to turn.
3. Measure the frame rate on a mid-range phone profile in the browser tools. Target: 50 frames in one second or more.
4. Reduce the scene detail where the target is not met.
5. Load the 3D code as a separate chunk, so that the first load does not wait for it. In Task 2 the bundle was 1,148 kB. Give the new sizes in the report.
6. Run an accessibility check on each page type. Correct each failure.

Done when:

- Each page type works at a width of 390 px.
- The measurements are in the report.

Stop and report.

---

## Task 10. Design fixes

Status: TODO

Goal: correct the design problems in `docs/POLISH.md`.

Steps:

1. Read `docs/POLISH.md`.
2. Do only the items that have the status `APPROVED`. Arthur sets this status.
3. For each item, make the change, then take a screenshot.
4. Set the status of each completed item to `DONE`.

Done when:

- Each `APPROVED` item is `DONE`.
- The tests pass.

Stop and report. Include the screenshots.
