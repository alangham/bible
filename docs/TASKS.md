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

Status: DONE

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

Status: DONE

Accuracy review: yes

Goal: the book page from section 4.2 of `docs/DESIGN.md`.

Approved sources. Arthur approved this list on 2026-11-13. Step 1 is complete. Start at step 2.

| Source | Role | Rights |
|---|---|---|
| Easton's Bible Dictionary, 1897, on Wikisource | The traditional author, date, and place. | Public domain. |
| ESV Global Study Bible, the introduction to each book, on `esv.org/resources/esv-global-study-bible/` | The traditional view in current scholarship. | Copyright Crossway, all rights reserved. Facts only. Copy no sentence. |
| Wikipedia, the article on each book | The "scholars differ" line. | CC BY-SA 4.0. Facts only. Copy no sentence. |
| 1911 Encyclopaedia Britannica, on Wikisource | Fallback only, for a book where the Wikipedia article cites no scholar. | Public domain. |

Conditions for the approved sources:

1. Wikipedia is a pointer, not the authority. Write a "scholars differ" line only where the article cites a published scholar for that claim. Record the scholar, the work, and the revision link of the article in `docs/CONTENT-SOURCES.md`.
2. Dates are approximate. Give a century or "about". Do not give an exact year from Easton. Example: "by tradition, about the 15th century BC".
3. If the sources state the traditional view differently, do not choose. Put the item on the "Not verified" list for Arthur.
4. If an ESV Global Study Bible page needs a sign-in, stop and tell Arthur. Do not use a different copy of that text.
5. The "Sources" page in Task 6 credits the sources.

Steps:

1. Propose the sources for the book introductions to Arthur. For each source, give the name, the address, the licence or copyright status, and why it is reliable. Give a minimum of two sources, so that one can confirm the other. Stop. Wait for Arthur's approval.
2. Create `docs/CONTENT-SOURCES.md`. Record the approved sources in it. Use only the approved sources for the steps that follow. If you need one more source, ask Arthur first.
3. Create `public/data/intros.json`. For each of the 66 books: author, written, what it is, and `review: "draft"`. Record the source of each fact in `docs/CONTENT-SOURCES.md`.
4. Write each introduction in your own words. Do not copy a sentence from a source. A source gives facts only. Exception: text that is in the public domain can be quoted, with the source named.
5. Obey the authorship rule in section 4.2 of `docs/DESIGN.md`. Give the traditional view first. Add one short line where scholars differ.
6. Build the cover page: the closed book on the table, the "Open the book" button, the three facts, the chapter list.
7. Make the move from the table: the selected spine slides out and lands as the closed book.
8. Show a small "draft" label on each introduction that Arthur did not approve.
9. Add a Playwright smoke test for one book.

Done when:

- Each of the 66 books has a cover page.
- The test passes.

Stop and report. Give Arthur the list of introductions to review.

---

## Task 4b. Introductions: two layers and review rules

Status: DONE

Accuracy review: yes

Goal: the introductions obey the two-layer authorship rule in section 4.2 of `docs/DESIGN.md`, and the "Not verified" list for Arthur is short. Arthur decided the two layers and the five rules on 2026-11-13.

The approved sources and their conditions are in Task 4. They do not change.

The five rules. Apply them to each of the 66 introductions and to `docs/CONTENT-SOURCES.md`:

1. No place of writing unless an approved source states it. Remove a place that no source gives.
2. One approved source is sufficient for a fact when no approved source contradicts it. Record the source. Do not put the item on the "Not verified" list.
3. When Easton and the ESV Global Study Bible differ on the traditional view, the ESV Global Study Bible leads. Easton can follow as "An older view names ...". Do not put the item on the "Not verified" list.
4. The strength word must match the source. If the source says "most scholars", write "most". Do not make a claim weaker or stronger than its source.
5. No line that rests on one scholar. Remove a line such as "One scholar dates ..." or a line that names one scholar. A standard reference work, for example the Oxford Dictionary of the Christian Church, counts as a source.

The plain-words rule. Arthur decided this on 2026-11-13. The reader is new to the Bible. Apply the rule to each fact, each detail, and each "What it is" text:

1. Do not use a term of scholars without its meaning in the same sentence. Example: do not write "Most scholars regard the book as anonymous". Write "The book does not name its writer".
2. Keep two statements apart: "the book does not name its writer" and "scholars doubt that the traditional author wrote it". The first is a fact about the text. The second is a view. Do not use one word for the two.
3. For a period, give the years. Example: "the Persian period, 539 to 332 BC". Use the years that the source gives.
4. Terms that need this rule include: anonymous, pseudonymous, Hellenistic, Persian period, the exile, the Dispersion, Deuteronomistic, redaction, oracle, Pentateuch, Septuagint, canon. This list is not complete.

Steps:

1. Change the data shape in `public/data/intros.json`. For the Author fact and the Written fact of each book, keep the traditional view in the fact. Move the view of critical scholars to a new detail with two parts: `critical` and `conservative`.
2. Write the `critical` part from Wikipedia under the Task 4 conditions. Apply rules 4 and 5. Apply the plain-words rule. For Matthew, the `critical` part must say why critical scholars doubt the traditional author, not only that the book is "anonymous".
3. Write the `conservative` part from the ESV Global Study Bible only. Use facts only, in your own words. If the ESV Global Study Bible page for the book does not answer the critical view, leave the `conservative` part out. Do not write one from memory.
4. Start each Written fact with the traditional view. Correct Joshua, 1 Samuel, and 2 Samuel, which do not do this now.
5. Apply rules 1, 2, and 3 to each fact.
6. Correct these items, which the designer found on 2026-11-13. Check each one against the sources first. If the sources do not support the correction, put the item on the "Not verified" list.
   - Haggai: the line about Darius II gives a rare view too much weight. Remove it unless the source says that the view is common.
   - Galatians: the "scholars" date does not differ from the traditional date. A book with no dispute has no detail.
   - Colossians: the Written fact says "If Paul did not write it", but the Author fact has no dispute. Make the two agree. The Wikipedia article reports a survey with more scholars for Paul than against. Rule 4 applies.
   - Daniel: the source states the late date as the view of critical scholars, without "some". Rule 4 applies.
7. Build the "Scholars differ" control and the detail on the cover page. The control is a real `button`. It is 44 px or larger. It works with the keyboard. The detail names its two parts: "Critical scholars" and "Conservative scholars".
8. Write the "Not verified" list again in `docs/CONTENT-SOURCES.md`. It must have only the items that the five rules do not settle. Give the number of items in the report.
9. Run the `accuracy-reviewer` agent on all 66 introductions after your last correction. If you make a correction after the review, run the review again on the changed books.
10. Add a Playwright test: the Genesis cover shows the traditional author, the control opens the detail, and the detail has two parts. Romans has no control.

Done when:

- No cover fact states the view of critical scholars.
- Each book with a dispute has the control and the detail.
- The accuracy review ran after the last correction.
- The tests pass.

Stop and report. Give Arthur the "Not verified" list.

---

## Task 4c. Introductions: decisions on the "Not verified" list

Status: DONE

Accuracy review: yes

Goal: apply Arthur's decisions of 2026-11-13 on the 25 "Not verified" items from Task 4b, and give each detail its conservative part where the source permits. The approved sources and their conditions are in Task 4. The five rules and the plain-words rule are in Task 4b. They do not change, but rule 5 gets a clarification below.

Four new rules:

1. One table of periods for the whole site. Create `public/data/periods.json`. It has one set of years for each period that the introductions name: the captivity in Babylon, Persian rule, Greek rule, and any other period in the text. Take the years from the ESV Global Study Bible where it gives them. Record the source of each period in `docs/CONTENT-SOURCES.md`. Each introduction uses the years from this table. If no approved source gives the years of a period, put that period on the "Not verified" list.
2. An article about a group of books can be the source for each book in the group, when the cited claim names the group. Examples: the Wikipedia article on 1 John for the five books credited to John, and the article on 1 Timothy for the three letters to Timothy and Titus.
3. Clarification of rule 5. Rule 5 excludes the view of one scholar. It does not exclude a general view that the article states and supports with one citation. A line such as "Scholars date ..." with one cited work stays.
4. The bundled Bible text is a source for what a book says. Example: "The writer calls himself the elder". Record the verse in `docs/CONTENT-SOURCES.md`.

Steps:

1. Create the table of periods under new rule 1. Change each introduction to use it. This settles items 1, 9, 10, and 16, and the three different end years for Persian rule.
2. Apply new rule 2. Titus: use the group claim, and make the strength word match it. 2 John and 3 John: add an Author detail from the group claim. This settles items 21, 24, and 25.
3. Apply new rule 3. Keep the 1 John date line and the Micah line. For 1 John, say what kind of work gives the date, for example "A standard textbook dates it ...". This settles item 23 and the Micah line.
4. Apply new rule 4 to the facts that cite the bundled Bible text.
5. Joshua, item 2: the Written fact on the cover gives only "By tradition, in the lifetime of Joshua, except the last verses". Move the second view into the detail. Do not state it two times.
6. Judges, item 3: the detail under Written has no date and is about who shaped the book. Move it to the Author detail.
7. Obadiah, item 14: put the Written detail back. Give the majority view first, with the strength word of the source. Then give the later date as the view of some scholars.
8. Leave these items as they are: 4, 5, 6, 7, 8, 11, 12, 13, 15, 17, 18, 19, 20, and 22. Remove them from the "Not verified" list. Record in `docs/CONTENT-SOURCES.md` that Arthur accepted them on 2026-11-13.
9. The conservative part. For each of the details that has no conservative part now: open the ESV Global Study Bible page for the book. If the page holds the traditional view for that fact, add a conservative part. It says that conservative scholars keep the traditional view, and it gives the reason from the page if the page gives one. Write it in your own words. If the page does not hold the traditional view, or does not speak about that fact, add nothing. Do not write a reason from memory.
10. Write the "Not verified" list again. Give the number of items in the report. Give the number of details with a conservative part, and the number without.
11. Run the `accuracy-reviewer` agent on each book that changed, after your last correction.
12. Update the tests if the data shape changed.

Done when:

- Each item in steps 1 to 8 is applied.
- The accuracy review ran after the last correction.
- The tests pass.

Stop and report.

---

## Task 4d. Six author details under the new wording

Status: DONE

Accuracy review: yes

Goal: section 4.2 of `docs/DESIGN.md` now says that the conservative part gives the view of the ESV Global Study Bible on the fact. Six author details have a view on the page but no conservative part.

Steps:

1. Add a conservative part to the Author detail of Judges, 1 Kings, 2 Kings, 1 Chronicles, 2 Chronicles, and Job. It gives the view of the ESV Global Study Bible page for that book, in your own words. Obey the plain-words rule.
2. Do not change a different book.
3. Run the `accuracy-reviewer` agent on the six books after your last correction.
4. Give the new numbers in the report: details with a conservative part, and details without.

Done when:

- The six details have a conservative part that the page supports.
- The tests pass.

Stop and report. This task is small. Arthur can tell you to continue with Task 5 in the same session.

---

## Task 5. Spread page with the bundled text

Status: DONE

Accuracy review: yes

Goal: the chapter page from sections 4.3 and 4.4 of `docs/DESIGN.md`, with the bundled translation only.

Step 1 is complete. Arthur approved the nine scene subjects on 2026-11-14, with three changes. The approved subjects and the scene rules are in section 4.4 of `docs/DESIGN.md`. Read that section before you build. The three changes from your proposal:

- Scene 7 looks Roman: columns, an arch, tile roofs.
- The time of day follows the position of the chapter in its book. It does not come from a fixed number.
- No person that a reader can identify, and the chapter text is readable at each time of day.

Decisions on the Bible text, by Arthur on 2026-11-14:

- The words come from `bsb.txt`. The section headings, the paragraphs, the poetry lines, and the footnotes come from the USFM files of the same publisher. This is your plan from the step 1 report, and it is approved.
- Keep the section headings, the paragraphs, the poetry lines, and the verse numbers.
- Footnotes: keep only the notes about manuscripts. See section 4.3 of `docs/DESIGN.md`.
- Keep the 1,325 cross-reference lines of the USFM files in the data, in a field of their own. Do not show them in this task. Task 7 uses them as a source of links.

Steps:

1. Complete. See above.
2. Confirm that the public-domain statement of the publisher covers the USFM files, with their headings and footnotes. Record the download, its address, its date, and the result in `docs/DATA-SOURCES.md`. If the statement does not cover them, stop and ask Arthur.
3. Add the bundled translation as one JSON file for each book in `public/data/text/`. Take the words from `bsb.txt` and the structure from the USFM files. Add a unit test: the words of each verse in the JSON files are the same as in `bsb.txt`, for all 31,086 verses.
4. Keep the two manuscript notes, on Mark 16:8 and John 7:52, visible on the spread. For each of the 16 verses that are not in the main text, show the verse number and its note. Do not remove text and do not add text.
5. Build the open book: two pages, the text on the right page, the header above the text.
6. Build the scene engine: four paper-cut layers, parallax, the time of day from the position of the chapter in its book, the colors near the cloth color of the group, and the small shifts of each layer from a fixed number.
7. Build the nine base scenes from section 4.4 of `docs/DESIGN.md`.
8. Set the color of the chapter text from the scene behind it: dark text on a light scene, light text on a dark scene. Add a test that measures the contrast of the text for each of the nine scenes at dawn, day, dusk, and night. Each of the 36 results must be 4.5 to 1 or more.
9. Build the page turn: drag a corner, and arrow keys. The page must curl.
10. Make the "Open the book" move from the cover page.
11. Add the reduced-motion fallback.
12. Add a unit test: the same book and chapter always give the same scene values. Add a unit test: in a book with more than three chapters, chapter 1 is dawn, the middle chapter is day, and the last chapter is night.
13. Add a Playwright smoke test: open Genesis 1, turn to Genesis 2. Add a second one: Mark 16 shows the manuscript note.

Done when:

- Each of the 1,189 chapters opens with text and a scene.
- The tests pass.

Stop and report. Include one screenshot of each of the nine scenes. Include Genesis 1, Genesis 25, and Genesis 50, so that Arthur sees dawn, day, and night in one book.

---

## Task 6. Sources page and translation label

Status: DONE

Goal: the site names its translation and credits its data sources. This task replaces the earlier "Live ESV text" task. Arthur decided on 2026-11-13 that the ESV is not in version 1. Reason: the ESV terms forbid a published access key, and the site has no server to hold the key.

WARNING: Do not add ESV text or a request to the ESV API.

Steps:

1. Search the code for `VITE_ESV_API_KEY` and for `api.esv.org`. Remove each use.
2. Show the name "Berean Standard Bible" on each spread.
3. Build a "Sources" page. Add a control to it on the table page.
4. On the "Sources" page, name the Berean Standard Bible and say that it is in the public domain.
5. On the "Sources" page, credit each data source as its licence requires. Read `docs/DATA-SOURCES.md` for the conditions. OpenBible.info requires a credit and a link to the CC BY 4.0 licence.
6. Credit the sources of the book introductions on the "Sources" page: Easton's Bible Dictionary, the ESV Global Study Bible by Crossway, and Wikipedia with a link to the CC BY-SA 4.0 licence. Say that the introductions use facts from these sources and are written for this site.
7. Read the licence of each bundled font. If the licence requires a notice, show the notice on the "Sources" page.
8. In `docs/DATA-SOURCES.md`, add a line to the ESV section: "Not used in version 1. Decision by Arthur on 2026-11-13."
9. Add a Playwright smoke test: the "Sources" page loads and has the OpenBible.info credit.

Done when:

- The code has no use of the ESV key or the ESV API.
- The test passes.

Stop and report.

---

## Task 7. Links, travel, and trail

Status: DONE

Accuracy review: yes

Goal: section 4.5 of `docs/DESIGN.md`. Read that section first. It has the sources rule that Arthur decided on 2026-11-14: links come only from the three approved sources, and no person and no agent adds a link by hand.

Steps:

1. Complete. Arthur approved these decisions on 2026-11-14. They are in section 4.5 of `docs/DESIGN.md`. Read that section again.
   - The limit for marks is your limit (a): 20 votes or more, 1 marked verse for each 5 verses of a chapter with 2 as a minimum, 2 links for each verse as a maximum, strongest first.
   - A link with zero votes or fewer is not used.
   - New: the read-with list for each chapter.
   - A cross-reference line of the Berean Standard Bible files that names whole chapters links to the start of the first chapter. The 2 lines with no book name get no link. Put them on the "Not verified" list.
   - Leave out the 18 OpenBible.info rows that cross two books and the 1 row with a verse that the Bible text does not have. List them in the report.
1b. Compute the read-with list for Genesis 1, Psalm 23, John 3, and Hebrews 9 before you build. Give the four lists in your next message. If the list for Hebrews 9 has Leviticus 16 or Numbers 19, continue with no stop. If it has neither, stop and tell Arthur, with the rank and the vote sum of each of the two chapters.
2. Build `public/data/links/` from the three sources, with the approved limit. Each link records its source and its type. If two sources give the same pair, keep one link. A quotation link takes priority over an echo link.
2b. Build the read-with list for each of the 1,189 chapters, by the rule in section 4.5 of `docs/DESIGN.md`. Record the OpenBible.info download in `docs/DATA-SOURCES.md`: the address, the date, the size, and the SHA-256.
3. Do not add a link that is not in a source. Do not remove a link because you disagree with it. If a link looks wrong, put it on the "Not verified" list.
4. Show the marks in the text at the two ends of each link. Strong for quotation links. Light for echo links. An echo link from the cross-reference lines of the Berean Standard Bible files is on its section heading.
5. Add a switch for echo links.
6. Build the pop-up: reference, the text of the linked passage, "Go there", "Stay here". If a passage has more than one link, the pop-up lists them, quotation links first.
6b. Show the read-with list at the top of each chapter that has one, under the heading "Read with". Each entry is a real `a` or `button`, 44 px or larger, and it starts travel to that chapter. Add the small line that names OpenBible.info as the source.
7. Write a reason line for each quotation link. Do not write a reason line for an echo link. The reason line must say only what the two passages show. Obey the plain-words rule from Task 4b. Record the source of each quotation link in `docs/CONTENT-SOURCES.md`.
8. Write a script in `scripts/` that checks each link: the two ends exist, no link to itself, no duplicate, the type is set, and the source is one of the three approved sources. Add the script to the unit tests.
9. Build travel: the current book closes, the linked book comes onto the table, it opens at the linked passage.
10. Build the trail. Each stop is a control that goes back to that stop.
11. Credit OpenBible.info as its licence requires. If the "Sources" page from Task 6 already has the credit, make sure that it is correct.
12. Add a Playwright test: open Hebrews 9, select a quotation link, travel, then use the trail to go back. Add a second test: an entry of the read-with list starts travel.
13. Add a unit test: the read-with list of a chapter is the same as the result of the rule on the source data, for 20 chapters.

Done when:

- The test passes.
- Hebrews 9 has quotation links to the Old Testament passages that it quotes.
- The link check script passes on each link.
- The report gives the number of quotation links and the number of echo links, for each source.
- The report gives the read-with list of Genesis 1, Psalm 23, John 3, and Hebrews 9, and the number of chapters with no list.

Stop and report. Include screenshots of the pop-up, of a chapter with marks, and of the trail.

---

## Task 7b. Quotation links: the fit rule

Status: DONE

Accuracy review: yes

Goal: a link has the strong mark only when the reader can see the quotation in the text. Arthur decided the fit rule on 2026-11-14. It is in section 4.5 of `docs/DESIGN.md`. Read that section again. It also records the details of the limit and the lists that Arthur accepted.

Steps:

1. Use one rule for the fit label in all four quarters: rule B from your Task 7 report. A link is "quote" only if the later passage repeats the words of the earlier passage in the Berean Standard Bible, or names it clearly. A short phrase of 2 or 3 common words, one word, a theme, or the same statement in other words is "close" or "weak".
2. Change the build: a link from the Bible Quotation Database with the fit "close" or "weak" is an echo link. It has the light mark and no reason line. Do not remove a link.
3. Remove the reason lines of these links from the site data. Keep them in a file outside `public/`, so that the work is not lost.
4. Hide an echo link that overlaps a quotation link at its two ends.
5. The two links that end at verses outside the main text, Mark 9:44 and Mark 15:28, follow the same fit rule.
6. Update `docs/reviews/task-7-not-verified.md` and the list in `docs/CONTENT-SOURCES.md`. The list is now a record of the links that changed type. It is not a list of decisions for Arthur. Say so at the top of each.
7. Update the link check script and the tests. Add a test: no link with the fit "close" or "weak" has the strong mark or a reason line.
8. Save the Task 7 screenshots and one new screenshot of Hebrews 9 in `docs/screenshots/task-7/`.
9. Run the `accuracy-reviewer` agent on the links that are still quotation links, after your last correction.

Done when:

- The tests pass.
- The report gives the number of quotation links and the number of echo links, for each source, before and after this task.
- The report says which quotation links Hebrews 9 still has.

Stop and report.

---

## Task 8. Timeline

Status: DONE

Accuracy review: yes

Goal: section 4.6 of `docs/DESIGN.md`. Read that section first. Arthur decided the two bands on 2026-11-14.

Steps:

1. Create `public/data/dates.json` from the Written fact of each book in `public/data/intros.json`. Do not do new research. For each book: the first year, the last year, the kind (`year`, `range`, or `unknown`), and the words of the Written fact that give the date. Use negative numbers for years BC. A century is a range, for example "the 6th century BC" is -600 to -501.
2. If a Written fact does not clearly give a year, a range, or "not known", do not guess. Put the book on the "Not verified" list, and place it in the "Date not known" group.
3. Add a unit test: each of the 66 books is in `dates.json`. Add a second test: the years of each book are in the words of its Written fact, or follow from a century or a period in `public/data/periods.json`.
4. Build the timeline page with the two bands, the axes, the spines, the range bars, the stacks, and the "Date not known" groups.
5. Compute the number of years between the two bands from the dates, and show it.
6. Compute the arcs from the quotation links in `public/data/links/`. Count the quotation links for each pair of books. Draw the arcs in three steps of thickness.
7. Build the select behavior: the arcs of the selected book stay, the other arcs dim, and the list of quoted books shows. Add the action that opens the cover.
8. Add the legend with the same behavior as on the table page. Use the same code.
9. Add the small sign for a book whose Written fact has a "Scholars differ" detail.
10. Add the "Timeline" control to the table page, the cover page, and the spread page. The route is `#/timeline`.
11. Build the narrow layout from section 4.6: a list in date order, in two parts, with no arcs. Use the one layout function to select it.
12. Add the reduced-motion fallback and keyboard access.
13. Add a Playwright smoke test: the page loads with 66 books, a selected book shows its list, and the cover action opens the cover.
14. Run the `accuracy-reviewer` agent. It checks each entry of `dates.json` against the Written fact of the book.

Done when:

- The tests pass.
- The report gives, for each band, the first book, the last book, and the number of books in "Date not known".
- The report gives the five pairs of books with the most quotation links.

Stop and report. Include screenshots of the page, of a selected book, and of the narrow layout.

---

## Task 8b. Timeline: two corrections

Status: DONE

Accuracy review: yes

Goal: apply Arthur's decisions of 2026-11-14 on the open points of Task 8. They are in section 4.6 of `docs/DESIGN.md`. Read that section again.

Arthur accepted these as built, with no change: the rules that turn the words of a fact into years, the flat spines in stacks, the page height, the three steps of arc thickness, and the books in "Date not known". Do not add a period for the time of Moses, of Joshua, or of Solomon.

Steps:

1. Change the line between the bands. Count from the end of the last range in band 1 to the start of the first range in band 2. Name no book. The words are: "About N years or more between the last Old Testament book and the first New Testament book".
2. Add the rule: where the words of a Written fact give a year and a century, the year leads. Apply it to Obadiah. Check each of the other books for the same case.
3. Record the two changes in the date rules of `docs/CONTENT-SOURCES.md`. Record that Arthur accepted the other rules on 2026-11-14.
4. Update the tests.
5. Run the `accuracy-reviewer` agent on `dates.json` after your last correction.
6. Take the wide screenshot again.

Done when:

- The tests pass.
- The report gives the new line between the bands, and each book whose date changed.

Stop and report. This task is small. Arthur can tell you to continue with Task 9 in the same session.

---

## Task 9. Phone layout and performance

Status: DONE

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

## Task 9b. Standard accessibility check and two date limits

Status: DONE

Accuracy review: yes

Goal: apply Arthur's decisions of 2026-11-14 on the open points of Task 8b and Task 9.

Steps:

1. Arthur approves the install of axe-core. Install `@axe-core/playwright` as a development dependency, with an exact version and no range. Record the version in the report. Do not add it to the site bundle.
2. Add axe-core to the accessibility tests for each page type at 1440 px and at 390 px. Keep your own checks also. Add the pages that the check did not cover: the travel overlay, the link pop-up, and the list of a selected book on the timeline.
3. Correct each failure that axe-core reports. If a failure needs a design decision, do not decide it. Put it in `docs/POLISH.md` with the status `PROPOSED`, and name it in the report.
4. Add two rules for the dates of the timeline. They are in section 4.6 of `docs/DESIGN.md`:
   - "Before" a dated event cuts the end of the range at that year. 2 Kings ends at 538 BC.
   - A book is not written before the last event that its Written fact names. Daniel starts at 536 BC.
5. Check each of the other books for the two cases. Give each book that changes in the report.
6. Mark stays as built. Record that Arthur accepted it.
7. Update the tests and `docs/CONTENT-SOURCES.md`.
8. Run the `accuracy-reviewer` agent on `dates.json` after your last correction.

Done when:

- The tests pass, with axe-core.
- The report gives the axe-core version, the number of failures that it found, and each book whose date changed.

Stop and report.

---

## Task 10. Design fixes

Status: DONE

Goal: correct the design problems in `docs/POLISH.md` that Arthur approved.

Arthur approved nine items on 2026-11-14: items 1, 2, 3, 5, 7, 8, 9, 10, and 13. Each item in `docs/POLISH.md` has his decision under its status. Items 11 and 12 wait for a design. Items 4 and 6 are closed.

Steps:

1. Read `docs/POLISH.md`.
2. Do only the items that have the status `APPROVED`. Do not do an item with a different status.
3. Do item 5 first. It moves the limit between the two layouts to 900 px, and it changes what the other items must check.
4. Do items 13, 3, 1, and 2 together. They are all about the spines of the wide table. Take one screenshot of the table at 1440 by 900 px before the changes and one after.
5. Do items 7, 8, and 9 together. They are about the scenes. Take the nine-scene screenshot again. Take the Gospels scene at dawn, day, dusk, and night. The contrast test for the chapter text must still pass.
6. Do item 10. Take a screenshot of Hebrews 9 with the new marks at 1440 px and at 390 px.
7. For each item, measure the result where the item gives a measure. Give the numbers in the report.
8. Set the status of each completed item to `DONE`, with the date and the commit.
9. If an item needs a decision that `docs/POLISH.md` does not give, do not decide it. Leave the item `APPROVED`, and ask Arthur in the report.

Done when:

- Each `APPROVED` item is `DONE`, or is named in the report with a question.
- The tests pass, with axe-core. The entry for the wide table spines is not in `KNOWN`.

Stop and report. Include the screenshots, saved in `docs/screenshots/task-10/`.

---

# The redesign: Tasks 11 to 18

Arthur decided a redesign on 2026-11-14. It is in section 7 of `docs/DESIGN.md`. Tasks 11 to 18 build it. The site must build and its tests must pass at the end of each task.

Three things help you in each of these tasks:

- `docs/prototype/` has a prototype of all pages. Read `docs/prototype/README.md` before you use it.
- `docs/screenshots/redesign/` has screenshots of the prototype at 1440 by 900 px and at 390 by 844 px.
- If the prototype and `docs/DESIGN.md` differ, `docs/DESIGN.md` is correct.

---

## Task 11. Redesign: setup, colors, and fonts

Status: DONE

Goal: the project is ready for the redesign. No page changes in this task.

Steps:

1. Read `CLAUDE.md` again. It changed on 2026-11-14.
2. Read section 7 of `docs/DESIGN.md`.
3. Copy `docs/agents/reviewer.md` to `.claude/agents/reviewer.md`. The file changed on 2026-11-14.
4. Add the line `docs/prototype/data` to `.gitignore`.
5. Run `node docs/prototype/make-data.mjs`.
6. Open `docs/prototype/index.html` in a browser at 1440 by 900 px and at 390 by 844 px. Use the wall, the reading page, a link, the trail, and the three Reference pages.
7. Add the ten group colors of section 7.3 of `docs/DESIGN.md` to the book data code. One place in the code gives these colors. Do not remove the cloth colors in this task. The built pages use them.
8. Add a unit test: each of the ten group colors has a contrast of 4.5 to 1 or more against `#FFFFFF`.
9. Add the fonts Inter and Lora as bundled packages, in the same way as the built fonts. The site must not get a font from a different server. Inter needs the weights 300, 400, 500, 600, 700, and 800. Lora needs weight 400, regular and italic.
10. Read the licence of each of the two fonts. Record each font and its licence in `docs/DATA-SOURCES.md`. Put the licence text of each font in `public/licenses/`.
11. Make a list for the report: for each folder in `src/`, the files that the redesign keeps, the files that it changes, and the files that it removes. Do not remove a file in this task.

Done when:

- `npm run build` has no errors, and the tests pass.
- The color test of step 8 passes.
- `docs/DATA-SOURCES.md` has the two fonts, and `public/licenses/` has their licence texts.
- The report has the list of step 11.

Stop and report.

---

## Task 12. The wall

Status: DONE

Goal: the wall replaces the table as the first page.

Steps:

1. Read sections 7.3 and 7.4 of `docs/DESIGN.md`.
2. Look at `docs/screenshots/redesign/wall-desktop.png` and `docs/screenshots/redesign/wall-phone.png`.
3. Build the wall at the address `#/`. It has a white background.
4. Show the 66 book names in Bible order. Each name is an `a` element in Inter, weight 800, in capitals, in the color of its group. The address of a name is `#/book/<id>`. Until Task 13 is done, that address opens the built cover.
5. Use the fit rule for each name: the name fills the width of its column. The function `fit` in `docs/prototype/index.html` has the rule and its two limits. Each name link is 24 px high or more.
6. Start each group with its band: a bar in the group color with the group name in white capitals, Inter, weight 700. The band of the group "History (Acts)" has the text "History".
7. Keep one function that decides the layout from the screen width, as built. The limit stays at 900 px.
   - Wide layout, 900 px or more: five columns with 13, 14, 12, 14, and 13 books. At 1440 by 900 px, all 66 names and the bottom line are in one view with no scroll.
   - Narrow layout, below 900 px: one block for each group, with its band at the top and its names in two columns. Divide the names so that the two columns have almost the same height. A group with one book fills the full width. The wall is 520 px wide at most, in the center of the screen.
8. Add the bottom line: the text "Berean Standard Bible", then the links "Timeline" and "Sources". Task 15 adds the link "Quotations".
9. Remove the code of the table page: the stacks, the spines, the legend, and the 3D scene of the table. Do not remove a file that the cover, the spread, or the timeline still uses.
10. Replace the tests of the table page with tests of the wall:
    - The wall has 66 book links.
    - At 1440 by 900 px, the page is not higher than the screen.
    - At 390 by 844 px, the page is not wider than the screen.
    - Each book link is 24 px high or more, at the two sizes.
    - The axe-core check passes at the two sizes.
11. Take screenshots of the wall at 1440 by 900 px, at 834 by 1112 px, and at 390 by 844 px. Save them in `docs/screenshots/task-12/`.

Done when:

- The address `#/` shows the wall, and each book name opens its book.
- The tests of step 10 pass, with the other tests.
- The screenshots of step 11 are saved.

Stop and report. In the report, say how the wall looks at 834 px wide. The designer did not test that width.

---

## Task 13. Reading page: text and movement

Status: DONE

Goal: the reading page replaces the cover and the spread. In this task it has no links between passages. Task 14 adds them.

Steps:

1. Read sections 7.5 and 7.6 of `docs/DESIGN.md`.
2. Look at these screenshots in `docs/screenshots/redesign/`, each with `-desktop.png` and `-phone.png`: `reading-john-1`, `reading-psalm-23`, `book-change`, `chapter-grid`, `about-this-book`.
3. Build the reading page at these addresses:
   - `#/book/<id>/<chapter>` opens that chapter.
   - `#/book/<id>/<chapter>/<verse>` opens that chapter at that verse.
   - `#/book/<id>` opens the last-read chapter of that book, or chapter 1 if the reader did not read the book.
4. Show the text in one column on a white background. The column is 700 px wide at most. The Bible text is in Lora: 21 px with a line height of 1.65 in the wide layout, and 18 px with a line height of 1.62 in the narrow layout.
5. Keep the built rules for the chapter text with no change: the section headings, the paragraphs, the poetry lines, the verse numbers, and the manuscript footnotes. Change only the look. The verse numbers are in the color of the group.
6. Show the heading of the book above its first chapter in view: the band of the group, the book name in Inter, weight 800, in capitals, and the chapter number in Inter, weight 300. All three are in the color of the group.
7. Add the control "About this book" below the heading of the book. It opens the three facts of the introduction: What it is, Author, and Written. Keep the built rules for the control "Scholars differ" and for the "Draft" label. Do not change the words of an introduction.
8. Add the top bar. It stays at the top of the screen. It has two controls in this task:
   - "Books" goes to the wall.
   - The book name and the chapter number open the chapter grid. The chapter grid shows the chapter numbers of the book. Each number is 44 px high or more, and it opens that chapter.
9. Build the continuous scroll:
   - When the reader comes near the end of the loaded text, add the next chapter below it.
   - A later chapter of the same book has a heading with the book name and the chapter number at a smaller size, and no band.
   - After the last chapter of a book, add the first chapter of the next book, with the full heading of step 6.
   - After Revelation 22, show the line "End of Revelation".
10. Make the top bar and the address follow the chapter in view. Replace the address. Do not add an entry to the browser history when the reader scrolls.
11. Add a small link above the first heading. It opens the chapter before the first chapter in view. Genesis 1 has no such link.
12. Record the last-read chapter of each book in the storage of the browser. The site must work when the storage is not available.
13. Move the book name from the wall into the heading, and back, with the View Transitions function of the browser. A browser without that function gets a direct change. With `prefers-reduced-motion`, use a direct change.
14. Remove the cover, the spread, the scenes, and the page turn. Remove the packages `three`, `@react-three/fiber`, `@types/three`, and `gsap`. Keep the code for the link data, the pop-up, the read-with list, travel, and the trail. Task 14 uses it. If the timeline page needs a file that this step removes, keep that file and name it in the report.
15. Replace the tests of the cover and the spread with tests of the reading page:
    - A tap on "John" on the wall shows the text of John 1.
    - At 1440 by 900 px, the text column is 700 px wide.
    - A scroll from John 21 goes into Acts 1, and the top bar then shows Acts.
    - The chapter grid opens John 20.
    - "Books" goes to the wall, and "John" on the wall then opens the last-read chapter.
    - At 390 by 844 px, the page is not wider than the screen.
    - The test for the 31,086 verses still passes.
    - The axe-core check passes at 1440 by 900 px and at 390 by 844 px.
16. Take screenshots of John 1, Psalm 23, Psalm 119, 1 Chronicles 1, and the change from John to Acts, at 1440 by 900 px and at 390 by 844 px. Save them in `docs/screenshots/task-13/`.

Done when:

- A book name on the wall opens the text with no page between them.
- The tests of step 15 pass, with the other tests.
- `package.json` does not have the four packages of step 14.
- The screenshots of step 16 are saved.

Stop and report.

---

## Task 14. Links on the reading page

Status: DONE

Accuracy review: yes

Goal: the reading page shows the links, and the reader can travel and get back.

The rules for links in section 4.5 of `docs/DESIGN.md` do not change: the sources, the fit rule, the limit for marks, and the read-with list. Do not change a file in `public/data/links/`. This task changes only the look and the movement.

Steps:

1. Read section 7.7 of `docs/DESIGN.md`.
2. Look at these screenshots in `docs/screenshots/redesign/`, each with `-desktop.png` and `-phone.png`: `links`, `link-popup`, `travel-arrive-trail`, `read-with`.
3. Give each link control the color of the group that it goes to.
4. Below 1180 px wide, show the links as marks in the text, after the verse number: a solid dot for a quotation link and a ring for an echo link. A mark stays on the line of its verse number. Each mark is 24 by 24 px or more.
5. From 1180 px wide, show no marks in the text. Show each link as a label in the right margin, on the line of its verse: the verse number, the dot or ring, and the reference of the linked passage. Where two labels meet, move the lower label down. Each label is 24 px high or more.
6. Make the cross-reference line below a section heading a set of controls, one for each linked passage.
7. Open the pop-up from a mark, a label, or a section control. It shows the band of the linked group, the reference in capitals, the type of link and the passage that it comes from, the text of the linked passage, the reason line of a quotation link, the source, and the actions "Go there" and "Stay here". Keep the built rule for the text of the linked passage. In the wide layout, the pop-up opens near the control. In the narrow layout, it opens from the bottom of the screen.
8. Make "Go there" a direct change to `#/book/<id>/<chapter>/<verse>`. Put the paragraph of the linked verse in view below the bars, with a light background for a short time. Remove the built move of travel.
9. Show the trail below the top bar after the first travel. Each stop is a control in the color of its group. The current stop has an underline. When the reader is not on the first stop, the trail starts with the control "Back". "Back" opens the stop before the current stop, at its verse.
10. Show the read-with list as one line below the chapter heading, with the label "Read with". Each entry is a control for travel to that chapter. Put the line "From OpenBible.info" at the end.
11. Add a control at the right of the top bar that switches the echo links on and off. Record the selection in the storage of the browser.
12. Make each control a `button` or an `a` element with keyboard access. The Escape key closes the pop-up.
13. Add tests:
    - In Hebrews 9, the number of link controls at verses is the number of links in `public/data/links/hebrews.json` that have an end at a verse of Hebrews 9.
    - The quotation link at Hebrews 9:20 opens a pop-up with the reference Exodus 24:8 and the text of that verse.
    - "Go there" opens `#/book/exodus/24/8`, and the trail has the stops Hebrews 9:20 and Exodus 24:8.
    - "Back" opens Hebrews 9 with verse 20 in view.
    - A read-with entry opens its chapter and adds a stop to the trail.
    - With the echo links off, no echo link control is visible.
    - At 1440 by 900 px, the text has no marks and the margin has labels. At 390 by 844 px, the text has marks.
    - The axe-core check passes at the two sizes, with the pop-up closed and with the pop-up open.
14. Take screenshots of Hebrews 9 with its links, the pop-up, and Exodus 24 with the trail, at 1440 by 900 px and at 390 by 844 px. Save them in `docs/screenshots/task-14/`.

Done when:

- The reader can open a link, go there, and get back with "Back".
- The tests of step 13 pass, with the other tests.
- No file in `public/data/links/` changed.
- The screenshots of step 14 are saved.

Stop and report.

---

## Task 15. Reference section: Quotations and Sources

Status: DONE

Accuracy review: yes

Goal: the Reference section has its top bar, the quotation diagram, and the Sources page in the new look. The timeline keeps its built look until Task 17.

Steps:

1. Read section 7.8 of `docs/DESIGN.md`.
2. Look at these screenshots in `docs/screenshots/redesign/`, each with `-desktop.png` and `-phone.png`: `quotations`, `quotations-selected`, `sources`.
3. Build the top bar of the Reference pages: the control "Books", then the links "Timeline", "Quotations", and "Sources". The link of the current page has an underline.
4. Build the quotation diagram at the address `#/quotations`:
   - The 66 book names are around a circle in Bible order, in their groups, each in the color of its group. An arc in the group color is behind each group.
   - A curved line joins two books that have one quotation link or more. Read the pairs and their counts from `public/data/quotation-pairs.json`. Do not write a count by hand.
   - A line has three steps of thickness: 1 or 2 links, 3 to 9 links, and 10 links or more.
   - The color of a line goes from the color of the book that quotes to the color of the book that it quotes.
   - The function `renderQuotes` in `docs/prototype/index.html` shows one way to draw the diagram.
5. Make each book name in the diagram a control with keyboard access. A book that is selected has its lines bright and the other lines dim. Select it again to clear.
6. Show a list for the selected book: the books that it quotes and the books that quote it, with the number of quotation links for each. The list is the text form of the lines. A book in the list selects that book. A control in the list opens the selected book.
7. In the narrow layout, add a list control above the diagram that selects a book.
8. Put the line "From the Bible Quotation Database. A thicker line has more quotation links." below the diagram.
9. Give the Sources page at `#/sources` the new look: Inter for the headings, a column of 700 px at most. The top bar of step 3 replaces the link "Back to the table".
   - Do not change a statement about a source or a licence.
   - Change only the words that name a part of the first build. The sentence "The introductions on the book covers use facts from these sources." becomes "The introductions of the books use facts from these sources."
   - Task 17 changes the fonts section. Do not change it in this task.
10. Add the link "Quotations" to the bottom line of the wall, between "Timeline" and "Sources".
11. Add tests:
    - The three links in the bottom line of the wall open the three pages.
    - The diagram has 66 book controls.
    - With Romans selected, the list has the same books and counts as `public/data/quotation-pairs.json` gives for Romans.
    - The control in the list opens the book.
    - The axe-core check passes for the two pages at 1440 by 900 px and at 390 by 844 px.
12. Take screenshots of the two pages, and of the diagram with Hebrews selected, at 1440 by 900 px and at 390 by 844 px. Save them in `docs/screenshots/task-15/`.

Done when:

- The addresses `#/quotations` and `#/sources` show the pages in the new look.
- The tests of step 11 pass, with the other tests.
- The screenshots of step 12 are saved.

Stop and report.

---

## Task 16. Timeline dates: estimates for 17 books

Status: DONE

Accuracy review: yes

Goal: a proposal for the estimated date of each book that is in "Date not known". Arthur approves the proposal before a page or a data file changes.

Arthur decided on 2026-11-14 that the timeline has no "Date not known" group. A book with no exact date stands at an estimate, and the page marks it as an estimate.

WARNING: Do not write a year from memory. Each year must come from an approved source. The approved sources are Easton's Bible Dictionary, the ESV Global Study Bible for facts only, and Wikipedia as a pointer to cited scholars.

WARNING: Do not change a file in `public/data/` or in `src/` in this task.

Steps:

1. Read section 7.8 of `docs/DESIGN.md` and the rules for dates in section 4.6.
2. Find the 17 books that have `kind: "unknown"` in `public/data/dates.json`. On 2026-11-14 they were: Genesis, Exodus, Leviticus, Numbers, Deuteronomy, Joshua, Judges, Ruth, Ezra, Job, Psalms, Ecclesiastes, Zechariah, Luke, Hebrews, 2 John, and 3 John.
3. Create the file `docs/TIMELINE-ESTIMATES.md`. Give it one row for each of the 17 books, with these columns: the book, the Written fact from `public/data/intros.json`, the proposed estimate as a first year and a last year, the rule or the source of the estimate, and the status. Set each status to `PROPOSED`.
4. For a book whose Written fact gives a year or a century, propose an estimate from the words of the fact, by a rule. State the rule in the row. Example: the fact of Hebrews says "before AD 70". Do not use a new fact for these books.
5. For a book whose Written fact gives the time of a person and no year, find the years of that time in the approved sources. The times are the time of Moses, the lifetime of Joshua, the time of Solomon, and the time of Ezra. In the row, name the source and the place in the source.
6. Where the approved sources give two views of a time, write the two views in the row. Recommend the view of the ESV Global Study Bible, as in section 4.2 of `docs/DESIGN.md`. Do not choose for Arthur.
7. Where the approved sources give no year for a book, write that in the row. Do not propose a year for that book.
8. Run the `accuracy-reviewer` agent on `docs/TIMELINE-ESTIMATES.md`.

Done when:

- `docs/TIMELINE-ESTIMATES.md` has 17 rows, and each proposed year has a rule or a source.
- No file in `public/data/` or in `src/` changed.

Stop and report. Ask Arthur to approve the rows. He can approve them as one group. Do not start Task 17 before he approves them.

---

## Task 17. Timeline page

Status: DONE

Accuracy review: yes

Goal: the timeline has the new look, with no arcs and no "Date not known" group.

WARNING: Do this task only after Arthur approved the rows of `docs/TIMELINE-ESTIMATES.md`. If a row does not have the status `APPROVED`, stop and ask Arthur.

Steps:

1. Read section 7.8 of `docs/DESIGN.md`.
2. Look at `docs/screenshots/redesign/timeline-desktop.png` and `docs/screenshots/redesign/timeline-phone.png`.
3. Write the approved estimates into the date data. Each of these books has a first year, a last year, and a sign that the date is an estimate. Change the tests of the dates to agree. Record the source of each estimate in `docs/CONTENT-SOURCES.md`.
4. Build the timeline at `#/timeline` with the top bar of the Reference pages.
5. Wide layout, 900 px or more: one line with a break.
   - The Old Testament books have one scale.
   - A mark on the line shows the years with no books. A text below the mark gives the number of years. Compute the number from the dates, by the rule in section 4.6 of `docs/DESIGN.md`. Do not write it by hand.
   - The New Testament books have a larger scale.
   - Each book name is above the line at its date, in Inter, in capitals, in the color of its group. Names with dates that are near stack, so that no name covers a different name.
   - A book with a range of years has a thin bar under its name. A book with one year has a dot on the line.
6. Narrow layout, below 900 px: a list in date order. Each row has the date text and the book name. The break is one row in the list.
7. Mark each estimate: the name has weight 500, where the other names have weight 800. Its bar is a dashed line, or its dot is an open dot. In the narrow layout, the date text ends with the word "estimate". For a screen reader, the name has the words "estimated date".
8. Put two lines below the timeline: "A name in light letters has an estimated date." and "Scholars differ on many dates. "About this book" gives the detail."
9. Make each book name a link that opens the book.
10. Do not show arcs, the list of quoted books, the legend, or a ring for "Scholars differ". Remove their code. The quotation diagram of Task 15 shows the quotation links.
11. Remove the fonts Cormorant Garamond and Newsreader and the styles of the old pages, if no page uses them. Change the fonts section of the Sources page to Inter and Lora, with their copyright lines and their licences.
12. Change the tests of the timeline:
    - The timeline has 66 book links, and no "Date not known" group.
    - Each book with an estimate has the mark of step 7.
    - The number of years in the break is the number that the dates give.
    - At 390 by 844 px, the page is not wider than the screen.
    - The axe-core check passes at 1440 by 900 px and at 390 by 844 px.
13. Take screenshots of the timeline at 1440 by 900 px and at 390 by 844 px. Save them in `docs/screenshots/task-17/`.

Done when:

- The address `#/timeline` shows the timeline in the new look.
- The tests of step 12 pass, with the other tests.
- The Sources page names the fonts that the site uses.
- The screenshots of step 13 are saved.

Stop and report. Include the "Not verified" list of the accuracy reviewer without changes.

---

## Task 18. Checks on all pages, and removal of old code

Status: DONE

Goal: the redesign is complete, measured, and has no code of the old pages.

Steps:

1. Run the axe-core check on each page at 1440 by 900 px and at 390 by 844 px: the wall, the reading page, the reading page with the pop-up open, the timeline, the quotation diagram, and the Sources page. Correct each problem.
2. Measure each kind of control on each page. Each control is 24 by 24 px or more. Give the smallest control of each page in the report.
3. Go through each page with the keyboard only. Each control gets the focus, shows the focus, and operates. Give the result in the report.
4. Set `prefers-reduced-motion` and use each page. No element moves.
5. Search `src/` and `package.json` for code and packages of the old pages: the table, the stacks, the spines, the cover, the spread, the scenes, the page turn, the linen colors, and the old fonts. Remove what no page uses.
6. Measure the size of the built JavaScript and the built styles. Give the sizes in the report, with the sizes before Task 12 from the git history.
7. Measure a long scroll on the reading page at 390 by 844 px. The reading page adds chapters during the scroll and does not remove them.
   - Open Psalm 1. Scroll to the end of Psalm 150.
   - Measure the frame rate of the scroll in the first 10 Psalms and in the last 10 Psalms. Use `scripts/measure-fps.mjs`, or change it for this measurement.
   - Count the elements in the page at the end.
   - Give the two frame rates and the count in the report.
   - If the frame rate in the last 10 Psalms is less than three quarters of the frame rate in the first 10 Psalms, do not correct it in this task. Propose a correction in the report.
8. Make sure that the names in the code agree with the table of names in `CLAUDE.md`.
9. Take one screenshot of each page at 1440 by 900 px and at 390 by 844 px. Save them in `docs/screenshots/task-18/`.
10. Items 11, 12, and 14 of `docs/POLISH.md` are about pages that the redesign replaced. Do not change their status. Ask Arthur in the report if he closes them.

Done when:

- The axe-core check passes on each page at the two sizes.
- No control is smaller than 24 by 24 px.
- `npm run build` has no errors, and the tests pass.
- The report has the measurements of steps 2, 3, 6, and 7.

Stop and report. A check on a real phone is still open. Only Arthur can do it.
