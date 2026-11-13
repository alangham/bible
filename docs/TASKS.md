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

Status: TODO

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
4. Pass `VITE_ESV_API_KEY` to the build from a repository secret. Arthur creates the secret.
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

## Task 6. Live ESV text

Status: TODO

Goal: the spread shows ESV when it is available, as in section 5 of `docs/DESIGN.md`.

WARNING: Do not write ESV text to a file in the repository.

Steps:

1. Add a text service that requests one chapter from the ESV API at read time.
2. Keep fetched ESV text in memory only. Do not keep more than 500 verses.
3. If the request fails, show the bundled translation.
4. Show the name of the translation that is on screen.
5. Show the ESV copyright notice and a link to esv.org on each page that shows ESV text.
6. Add a unit test for the fallback with a mock request.

Done when:

- A chapter shows ESV text with the notice when the API answers.
- A chapter shows the bundled text when the API does not answer.

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
4. Build the pop-up: reference, the text of the linked passage, one line of reason, "Go there", "Stay here". The reason line must say only what the two passages show. Record the source of each quotation link in `docs/CONTENT-SOURCES.md`.
5. Build travel: the current book closes, the linked book comes onto the table, it opens at the linked passage.
6. Build the trail. Each stop is a control that goes back to that stop.
7. Add a Playwright test: open Hebrews 9, select a quotation link, travel, then use the trail to go back.

Done when:

- The test passes.
- Hebrews 9 has quotation links to the Old Testament passages that it quotes.

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

1. Build the phone layout of the table page from section 4.1.
2. Make the spread readable on a phone: one page in view, swipe to turn.
3. Measure the frame rate on a mid-range phone profile in the browser tools. Target: 50 frames in one second or more.
4. Reduce the scene detail where the target is not met.
5. Run an accessibility check on each page type. Correct each failure.

Done when:

- Each page type works at a width of 390 px.
- The measurements are in the report.

Stop and report.
