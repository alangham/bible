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

---

# The King James Version: Tasks 19 to 21

Arthur decided on 2026-11-15 that the King James Version can become a second translation of the site. The idea and its decisions are in item 6 of `docs/BACKLOG.md`. Task 19 is a report. It does not add the King James Version to the site.

After the report, Arthur decided the design on 2026-11-15. It is in section 8 of `docs/DESIGN.md`. Task 20 makes the text data. Task 20b joins a split word in 13 verses. Task 21 changes the pages. Task 21b corrects two small faults that the check of Task 21 found.

---

## Task 19. King James Version: a report on the source files

Status: DONE

Goal: a report on the files of the King James Version, and on how the structure of the Berean files fits them. Arthur uses the report to decide the tasks that add the King James Version. No page and no data file of the site changes.

The decision of Arthur on 2026-11-15, for your information: a translation changes only the words. The reading page of the King James Version will show the section headings and the cross-reference lines of the Berean files above the words of the King James Version. The links, the read-with lists, the introductions, and the dates will be the same for the two translations.

WARNING: Do not change a file in `public/` or in `src/` in this task.

WARNING: Do not put a file of the King James Version text in the repository. Download the files to a temporary folder that is not in `C:\dev\bible`. Arthur decides on the source after the report.

The designer's check of edition C on 2026-11-15. Arthur gave the designer the file `kjv.docx` from `https://openbible.com/docx/kjv.docx`: 2,178,091 bytes, SHA-256 `dce0fbe6cb2aae710d3260d7e3ad3ffc44c1e33b524255fbf864e7132d1c4547`. The designer read the file with a short script and compared it with `public/data/text/*.json`. These are the results. Your script in step 4 must find them independently. If a number of your script differs, give the two numbers in the report. Do not change your script to make the numbers agree.

- The file has 66 books, 1,189 chapters, and 31,102 verses. No text paragraph starts in the middle of a verse.
- The file has each verse of the site data, and 16 more verses. The 16 verses are the verses that the main text of the Berean Standard Bible does not have. The site data has a note for each of them.
- Main section headings: 3,016 in the file and 3,016 in the site data. 3,012 have the same words before the same verse. Four have different words at the same place: Numbers 5:5, 2 Kings 7:3, Psalm 77:1, and Ecclesiastes 5:1.
- Cross-reference lines: 1,325 in the file and 1,325 in the site data. All have the same words before the same verse.
- Smaller headings: the file has 42, and each is in the site data. The site data has 38 more: the speaker headings of the Song of Solomon and "Saying 20" in Proverbs 24. Six headings of the site data are in the middle of a verse. All six are speaker headings of the Song of Solomon.
- The file has 229 headings with a Hebrew letter, in Psalms, Proverbs, and Lamentations. The site data has these headings only in Psalm 119.
- The file has 13,212 text paragraphs. 12,799 of them start at a verse where a paragraph or a poetry line of the site data starts.
- The file shows the words that the translators added in square brackets: 21,530 groups in 14,251 verses.
- In Psalm 119, the words of 22 verses start with the name of a Hebrew letter, for example "ALEPH." in verse 1.
- The file has no statement about rights. Its properties give "Bible Hub" as the creator and 2021-07-26 as the date.
- Not checked by the designer: the words of the file against a different edition of the King James Version.

WARNING: Do not write a fact about the King James Version from memory. Each number in the report must come from the output of the script of step 4. Each licence statement must come from its page, with the date on which you read the page.

Steps:

1. Read item 6 of `docs/BACKLOG.md` and section 2 of `docs/DATA-SOURCES.md`.
2. Read the licence of three editions.
   - Edition A, on eBible.org, the text of 1769 with Strong's numbers: `https://ebible.org/details.php?id=eng-kjv2006`.
   - Edition B, on eBible.org, the Cambridge Paragraph Bible: `https://www.ebible.org/details.php?id=engkjvcpb`.
   - Edition C, on OpenBible.com, a site of the Berean publisher: `https://openbible.com/pdfs/kjv.pdf` and `https://openbible.com/docx/kjv.docx`. The page `https://openbible.com/doc.htm` lists the downloads. Arthur found this edition on 2026-11-15. The designer read Genesis 1 to 7 of the PDF file. It has the words of the King James Version below the section headings and the cross-reference lines of the Berean files, for example "The Creation" and "(John 1:1–5; Hebrews 11:1–3)".
   - For editions A and B, read the details page and the copyright page that the details page links to. If a page does not state that the text is in the public domain, stop and ask Arthur.
   - For edition C, read the downloads page, the first pages and the last pages of the PDF file, and the terms page of the site if it has one. The designer found no licence statement on the downloads page or in Genesis 1 to 7 of the PDF file. If you find no statement, record "no statement" and continue.
   - Add a section "King James Version" to `docs/DATA-SOURCES.md`. For each edition, record the addresses, the date, the licence statement, and the statement about the right to print the translation in the United Kingdom if the pages have one. Record the use as "Read for Task 19. Not used on the site."
3. Download the files to the temporary folder: the USFM zip file of edition A, the USFM zip file of edition B, and the `.docx` file and the PDF file of edition C. For each file, record in `docs/DATA-SOURCES.md` the address, the date, the size in bytes, and the SHA-256. If a download fails, stop and ask Arthur.
4. Write the script `scripts/kjv-report.mjs`. The script gets the path of the temporary folder as an argument. The script only reads files. It prints the numbers and the lists for steps 5 to 11.
   - The plain words of a verse are the words that remain when the script removes the markers, the Strong's numbers, and the footnotes. Steps 5 and 6 use the plain words.
   - For edition C, read the `.docx` file. A `.docx` file is a zip file of XML files: unpack it in the temporary folder, and read `word/document.xml`. Do not add a package to `package.json` for this. Make sure that the SHA-256 of your download is the same as that of the designer's file. If it differs, say so in the report and continue with your download.
   - The structure of `word/document.xml`, as the designer found it: a chapter starts with a paragraph that has no style and has the text of the book name and the chapter number, and the next paragraph starts with "KJV". The paragraph styles `hdg`, `subhdg`, `suphdg`, and `acrostic` are headings. In a heading paragraph, the cross-reference line comes after a line break, with the run style `cross1`. The paragraph style `reg` is a text paragraph. A run with the style `reftext1` is a verse number. 85 text paragraphs have no paragraph style: find a text paragraph by its verse numbers, not only by its style. Make sure that this description is correct before you use it.
5. Report the content of each edition:
   - The number of books, chapters, and verses. If an edition has more books than the 66 books of `public/data/books.json`, list the other books and do not count them.
   - For editions A and B: each USFM marker, with the number of times that it occurs.
   - Each different section heading, with the number of times that it occurs. For edition C, give only the number of section headings and the number of cross-reference lines: step 11 compares them.
   - The number of footnotes, and five examples.
   - How the edition shows the words that the translators added. In edition C, the designer saw square brackets, for example "[was]" in Genesis 1:2.
   - These verses, each as it is in the source file and as its plain words: Genesis 1:1, Genesis 1:2, Psalm 23:1, Matthew 5:3, and the last verse of 3 John.
6. Compare the words of the editions. Count the verses whose plain words differ between edition A and edition B. Count the verses whose plain words differ between edition A and edition C. For each of the two comparisons, give ten examples with the words of the two editions. Say how the script handles the square brackets of edition C.
7. Compare the verses of edition A with `sources/bsb/bsb.txt`. In that file, a verse with no words is a verse that the main text of the Berean Standard Bible does not have. Give three lists:
   - The verses of edition A that have no line in `sources/bsb/bsb.txt`.
   - The verses that have no words in `sources/bsb/bsb.txt`. For each, say if edition A has words for it.
   - The verses of `sources/bsb/bsb.txt` that edition A does not have.
8. Examine the links in `public/data/links/*.json`. Each link has two passages, `a` and `b`, with `book`, `c`, `v`, and for a range `c2` and `v2`. Count the passages whose first verse or last verse is not in edition A. List each of these passages with the `id` of its link.
9. Examine the reason lines in `public/data/links/*.json`. Count the links with the type `quotation`. Count those whose `reason` has words between quotation marks. Give five examples. These words are from the Berean Standard Bible. Do not change a reason line.
10. Examine where the structure of the Berean files cuts a verse. Use `public/data/text/*.json`. In a text block (`k: "p"`), an item `{ "v": n }` starts verse n, and a string is words of the current verse.
    - Count the heading blocks (`k: "h"`) for each style. A heading is in the middle of a verse when the first item of the next text block is a string. Count these headings for each style, and list each one with its book, chapter, and verse.
    - Count the text blocks for each style. Count for each style the text blocks that start in the middle of a verse.
    - Count the verses that have words in more than one text block. Give the count for paragraph styles and for poetry styles, and each count as a part of all verses.
11. Compare the section headings and the cross-reference lines of edition C with those of `public/data/text/*.json`.
    - Give the number of section headings and the number of cross-reference lines in each of the two.
    - Count the headings that are in one of the two and not in the other. List them, to a maximum of 50.
    - Count the headings whose words differ. List them, to a maximum of 50.
    - Count the headings that stand before a different verse. List them, to a maximum of 50.
    - Count the cross-reference lines whose words differ. List them, to a maximum of 50.
    - For each Berean heading that step 10 found in the middle of a verse, give the place of that heading in edition C.
    - Say where edition C starts a new paragraph: at each verse, at each heading only, or at other places.
12. Write the report `docs/reviews/task-19-kjv-report.md`. Give it one section for each of steps 2, 3, and 5 to 11, in that order. Then add a section "Proposals" with these four points. For each point, give the options and the cost of each option. Do not decide for Arthur.
    - Which edition the site uses, and from which file the build script takes the words, the headings, and the cross-reference lines.
    - Which paragraphs and poetry lines the reading page of the King James Version shows, where the Berean files cut a verse in the middle.
    - What the pop-up shows for a reason line that has words of the Berean Standard Bible, when the reader reads the King James Version.
    - Which footnotes of the King James Version the site shows, if any.
13. Run `npm run lint`, `npm run build`, and `npm test`.

Done when:

- `docs/reviews/task-19-kjv-report.md` has the numbers and the lists of steps 5 to 11, and the four proposals.
- `docs/DATA-SOURCES.md` has the licence record of the three editions and the record of the downloads.
- No file in `public/` or in `src/` changed, and no file of the King James Version text is in the repository.
- `npm run build` has no errors, and the tests pass.

Stop and report. Give the path of the temporary folder in the report. Do not start a task that adds the King James Version. Arthur decides the next tasks from the report.

---

## Task 20. King James Version: the text data

Status: DONE

Accuracy review: yes

Goal: the words of the King James Version are in the repository, as one JSON file for each book, in the structure of the Berean data. No page shows them in this task. Task 21 changes the pages.

The rule of Arthur, from section 8 of `docs/DESIGN.md`: a translation changes only the words. The words come from edition A of the Task 19 report: the standardized text of 1769 from eBible.org. The section headings, the cross-reference lines, and the text blocks come from the Berean data in `public/data/text/`.

WARNING: Do not change a word of the King James Version. Do not correct a spelling, a capital letter, or a punctuation mark.

WARNING: Do not change an existing data file: `public/data/text/`, `public/data/links/`, and the other files in `public/data/`.

WARNING: Do not change a page in this task. In `src/`, change only `src/data/text.ts`, `src/data/passage.ts`, and their tests, as steps 7 and 8 say.

WARNING: Do not take a word, a heading, or a paragraph from `resources/kjv.docx` or from OpenBible.com. That file is evidence only.

Steps:

1. Read section 8 of `docs/DESIGN.md`, section 9 of `docs/DATA-SOURCES.md`, and `docs/reviews/task-19-kjv-report.md`. Read `scripts/build-text.mjs` and `src/data/text.ts` to see the form of the data.
2. Get the source file `eng-kjv2006_usfm.zip`. Use the copy of Task 19 if you still have it. If not, download `https://eBible.org/Scriptures/eng-kjv2006_usfm.zip`. Make sure that its SHA-256 is `b6faa67117ccaba49df9e7df224a553f11758ae7c5d58f0f7979e2b73ac4480b`. If the SHA-256 differs, the source changed: stop and ask Arthur.
3. Put the 66 USFM files of the 66 books in `sources/kjv/usfm/`. Put the copyright page of the zip file, `copr.htm`, in `sources/kjv/`. Do not put a different file of the zip file in the repository.
4. Add the line `resources/` to `.gitignore`. Arthur keeps his copy of `kjv.docx` in that folder, and it must not go into the repository.
5. Write the script `scripts/build-text-kjv.mjs`. It reads `sources/kjv/usfm/` and `public/data/text/<id>.json`. It writes `public/data/text-kjv/<id>.json`, one file for each book. A file has the same form as a file in `public/data/text/`, with `"translation": "King James Version"`. The script stops with an error when a rule below does not fit the data. It does not guess.
   - The words of a verse, from the USFM line of the verse:
     - `\w <word>|strong="…"\w*` and `\+w <word>|strong="…"\+w*`: keep the word. Remove the markers and the Strong's number.
     - `\f … \f*`: remove the footnote.
     - "¶": remove the sign and the space after it.
     - `\wj`, `\wj*`, `\nd`, `\nd*`, `\+nd`, `\+nd*`: remove the markers. Keep the words.
     - `\add <words>\add*` and `\+add <words>\+add*`: these are added words. Write them as an item `{ "a": "<words>" }` between the strings of the verse.
     - Write the spaces as `scripts/build-text.mjs` writes them: one space between two words, and one space between the words of two verses in one block. A string has no two spaces together.
   - Do not use these markers of the source: `\p`, `\q1`, `\b`, and `\s1`. The site takes its structure from the Berean data.
   - The structure of a chapter, from the blocks of the same chapter in `public/data/text/<id>.json`:
     - A heading block (`k: "h"`): copy it. Exception: do not copy an `s2` heading of the Song of Solomon. These are the 37 speaker headings.
     - The cross-reference lines (`xrefs`): copy them.
     - A text block (`k: "p"`): make a text block with the same style. It holds each verse that starts in the Berean block: the item `{ "v": n }`, then the words of verse n of the King James Version. A verse starts in a block when its item `{ "v": n }` or `{ "o": n }` is in that block. The words of a verse are never cut.
     - A Berean text block in which no verse starts: make no block.
     - An item `{ "o": n }` of the Berean data is a verse that the main Berean text does not have. Write `{ "v": n }` and the words of verse n of the King James Version at that place. The King James Version data has no `o` item.
     - A Berean block with the style `d` holds a title. If the chapter of the source has a `\d` line, make a `d` block with `{ "v": 1 }` and the words of the `\d` line. Then the next text block holds the words of verse 1, with no item `{ "v": 1 }`, as in the Berean data. If the chapter of the source has no `\d` line, make no `d` block, and the next text block holds `{ "v": 1 }` and the words of verse 1. On 2026-11-15 the Berean data had 117 `d` blocks: 116 in Psalms and one in Zechariah 12.
     - If a chapter of the source has a `\d` line and the Berean chapter has no `d` block, stop with an error.
     - A break block (`k: "b"`): copy it. Where two break blocks have no text block between them, keep one. Remove a break block that has no text block after it in the chapter.
     - A note block (`k: "n"`): do not copy it. The King James Version pages show no note.
6. Run the script. It must print these numbers. Give them in the report, each with the number that Task 19 found for edition A:
   - Books, chapters, and verses. Task 19: 66, 1,189, and 31,102.
   - Added-words items, and the verses that have one or more. Task 19: 21,462 groups in 14,224 verses.
   - Footnotes removed. Task 19: 6,959.
   - Verses from which the script removed "¶". Task 19: 2,970.
   - `d` blocks made. Task 19: 116 `\d` lines.
   - Heading blocks for each style, and cross-reference lines. The Berean data has 3,016 `s1`, 80 `s2`, 5 `ms`, 5 `d`, and 44 `qa` headings, and 1,325 cross-reference lines. The King James Version data must have 37 `s2` headings fewer, and the other numbers the same.
   - Text blocks for each style, and the Berean text blocks that have no block in the King James Version data.
   If a number differs from Task 19, do not change the script to make the numbers agree. Find the cause and give it in the report.
7. In `src/data/text.ts`, add the type of an added-words item, `{ a: string }`, to the type `Inline`, and add a function `isAdded`. If a file in `src/` does not compile with the new type, make the smallest change: the code reads an added-words item as its words. Do not add italics in this task.
8. In `src/data/passage.ts`, make `passageVerses` include the words of an added-words item in the words of its verse. Add a unit test for this.
9. Write the unit test `src/data/textKjv.test.ts`. It reads `public/data/text-kjv/` and `sources/kjv/usfm/`. It gets the words of each verse from the source with code of its own, not with code of the build script. It checks:
   - 66 books and 1,189 chapters, in the order of `public/data/books.json`, and 31,102 verses.
   - The words of each verse are the same as in the source. For verse 1 of a chapter with a `\d` line, the words are the title and then the words of the verse.
   - These verses have these words:
     - Genesis 1:1: "In the beginning God created the heaven and the earth."
     - Genesis 1:2: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters."
     - Matthew 5:3: "Blessed are the poor in spirit: for theirs is the kingdom of heaven."
     - Romans 16:24: "The grace of our Lord Jesus Christ be with you all. Amen."
     - 3 John 1:14: "But I trust I shall shortly see thee, and we shall speak face to face. Peace be to thee. Our friends salute thee. Greet the friends by name."
   - Genesis 1:2 has one added-words item, with the word "was".
   - Psalm 23 has a `d` block with the words "A Psalm of David."
   - No string has "\", "|", "¶", or two spaces together.
   - Each text block has one verse or more. Each text block starts with an item `{ "v": n }`, except the text block after a `d` block.
   - The heading blocks of each chapter are those of the Berean chapter, without the `s2` headings of the Song of Solomon. The cross-reference lines of each chapter are those of the Berean chapter.
   - No file has an `o` item or a note block.
10. Add to section 9 of `docs/DATA-SOURCES.md`, under edition A: the use in Task 20, the folder `sources/kjv/usfm/`, the script, the output folder, and what the site takes and does not take from the source files. Change the line "No file of the King James Version text is in the repository" to the true state.
11. Run the `accuracy-reviewer` agent. Its Check 1 applies to `public/data/text-kjv/`, with `sources/kjv/usfm/` as the source file: 66 books, 1,189 chapters, 31,102 verses, and the words of each verse identical to the source.
12. Run `npm run lint`, `npm run build`, `npm test`, and `npm run test:e2e`.

Done when:

- `public/data/text-kjv/` has 66 files, and the test of step 9 passes.
- The numbers of step 6 are in the report, each beside the number of Task 19.
- No file in `public/data/text/` or in `public/data/links/` changed, and no page changed.
- `npm run build` has no errors, and all tests pass.

Stop and report. Task 21 is not written. Do not change a page before Arthur gives you Task 21.

---

## Task 20b. King James Version: join the split word in 13 verses

Status: DONE

Accuracy review: yes

Goal: in 13 verses, the King James Version data has the word that a printed copy has, and not the two parts that the source has.

The fault: the source, edition A, gives each part of some words its own Strong's number. So it writes one word as two words in 13 verses. Example: 2 Timothy 2:13 has `\w can|strong="G1410"\w* \w not|strong="G3756"\w*`, and the site data has "he can not deny himself". The designer found the 13 verses on 2026-11-15, by a comparison of `public/data/text-kjv/` with the file `kjv.docx` of OpenBible.com. These 13 are all the verses in which the two differ only by a space. Arthur decided on 2026-11-15 that the site joins the word in these verses. The exception is in section 8.2 of `docs/DESIGN.md`.

The 13 verses:

| Verse | The source has | The site must have |
|---|---|---|
| Acts 4:16 | can not | cannot |
| Acts 4:20 | can not | cannot |
| Acts 5:39 | can not | cannot |
| Colossians 3:17 | what soever | whatsoever |
| Colossians 3:23 | what soever | whatsoever |
| 1 Timothy 2:7 | Where unto | Whereunto |
| 1 Timothy 5:25 | can not | cannot |
| 1 Timothy 6:12 | where unto | whereunto |
| 2 Timothy 1:11 | Where unto | Whereunto |
| 2 Timothy 2:9 | Where in | Wherein |
| 2 Timothy 2:13 | can not | cannot |
| Hebrews 6:17 | Where in | Wherein |
| Hebrews 9:5 | can not | cannot |

WARNING: Change only these 13 verses, and in each verse only the one space of the table. Do not change a letter, a capital letter, or a punctuation mark.

WARNING: Do not change the files in `sources/kjv/usfm/`. The build script makes the change. The source files stay as eBible.org gives them.

WARNING: Do not take the joined word from `resources/kjv.docx` or from memory. Confirm each verse in edition B, as step 1 says.

Steps:

1. Confirm each of the 13 verses in edition B, the Cambridge Paragraph Bible of eBible.org. Use the file `engkjvcpb_usfm.zip` of Task 19 if you still have it. If not, download `https://eBible.org/Scriptures/engkjvcpb_usfm.zip`, and make sure that its SHA-256 is `62a1ee0f996a20523663c37e3c7afbc1bb01443488049f32a8178393ac52831b`. For each verse, find the word of the column "The site must have" in the verse of edition B. A capital letter can differ in edition B. Do not put a file of edition B in the repository.
2. If edition B does not have the joined word in a verse, do not change that verse. Give the verse and the words of edition B in the report.
3. In `scripts/build-text-kjv.mjs`, add a list of the confirmed verses, each with its two words and its joined word. For each verse of the list, the script joins the two words in the words of the verse. The script stops with an error if the two words are not in the verse exactly once, or if they are not in one string of the verse.
4. Run `node scripts/build-text-kjv.mjs`. Make sure with `git diff --stat` that only the files of Acts, Colossians, 1 Timothy, 2 Timothy, and Hebrews in `public/data/text-kjv/` changed.
5. Change `src/data/textKjv.test.ts`. The test has a list of its own of the same verses. It checks that each verse of the list has the joined word, and that the words of the verse are the same as the source when the space is put back. It checks that the words of each other verse are the same as the source, as now.
6. In section 9 of `docs/DATA-SOURCES.md`, under edition A, record the exception: the 13 verses, the words of the source, the words of the site, the words of edition B for each verse, and the decision of Arthur of 2026-11-15.
7. Run the `accuracy-reviewer` agent. Its Check 1 applies to `public/data/text-kjv/` with `sources/kjv/usfm/` as the source file. Tell it that the 13 verses of this task differ from the source by one space each, by the decision of Arthur.
8. Run `npm run lint`, `npm run build`, and `npm test`.

Done when:

- Each confirmed verse has the joined word in `public/data/text-kjv/`.
- No other verse changed, and no file in `sources/` changed.
- The record is in `docs/DATA-SOURCES.md`.
- `npm run build` has no errors, and the tests pass.

Stop and report.

---

## Task 21. King James Version: the pages

Status: DONE

Accuracy review: yes

Goal: the reader can select the King James Version and read it on each page that shows Bible text. The first visit shows the Berean Standard Bible, as now.

The design is in section 8 of `docs/DESIGN.md`. Arthur decided the translation switch on 2026-11-15 from renders. The renders are in `docs/screenshots/kjv-design/`: the wall, the panel of the chapter grid, and Psalm 23, each at 1440 by 900 px and at 390 by 844 px. The renders are a sketch on the built site. Use their look. Do not copy code from them.

The data of Task 20 is ready: `public/data/text-kjv/<id>.json` has the same form as `public/data/text/<id>.json`. A file of the King James Version has added-words items `{ "a": "<words>" }`. It has no `o` item and no note block.

WARNING: Do not change a data file in `public/data/`, a source file in `sources/`, or a build script.

WARNING: Do not change the top bar. Do not change a page of the Reference section, except the Sources page in step 9.

WARNING: The Berean Standard Bible pages must look and work as before this task. A reader who does not use the translation switch sees no difference, except the switch.

WARNING: Write no new content about the Bible. The only new words of this task are the two translation names, the label of step 7, and the text of step 9.

Steps:

1. Read section 8 of `docs/DESIGN.md`. Look at the six renders in `docs/screenshots/kjv-design/`.
2. Make the translation setting. Put it in a new file `src/data/translation.ts`, in the same way as the echo links switch in `src/travel/travel.ts`.
   - Two translations: `bsb` with the name "Berean Standard Bible", and `kjv` with the name "King James Version".
   - The storage key is `bible-translation`. The value on the first visit is `bsb`. If the storage is not available, the setting holds for the page.
   - The translation is not in the address of a page. Do not change `src/router.ts`.
3. Change the text service `src/data/text.ts`. `loadBookText` gets the translation as a second argument. For `bsb`, it reads `data/text/<id>.json`. For `kjv`, it reads `data/text-kjv/<id>.json`. A book loads once for each translation.
4. Make one component for the translation switch, and use it in the two places of steps 5 and 6.
   - It is a group with the label "Translation" for a screen reader. It has two buttons with the full names. The button of the selected translation has `aria-pressed="true"`.
   - The look, from the renders: Inter, weight 500, the secondary ink color. The selected name has the ink color, weight 600, and a line of 2 px below the words, 3 px from them.
   - Each button is 24 by 24 px or more, and 44 px high in the panel of the chapter grid.
   - Each button shows the focus, as the other controls of its page do.
5. The wall, `src/wall/WallPage.tsx`: in the line at the bottom, put the translation switch in the place of the words "Berean Standard Bible". In the narrow layout, the switch is on a line of its own, above the links of the Reference section, as the words are now.
6. The reading page, `src/reading/ReadingPage.tsx`: put the translation switch at the top of the panel of the chapter grid, above the chapter numbers, with a thin line between them. The switch has the width of the chapter grid.
   - When the reader selects a translation, the panel closes, and each chapter on the page shows the words of that translation.
   - The verse at the top of the page stays at the same place. Before the change, find the first verse number that is below the top bar. After the change, scroll so that the same verse of the same chapter is at the same distance from the top. If the new text does not have that verse number, use the verse before it.
   - The change makes no entry in the history of the browser, and it does not change the trail.
7. Each part that shows Bible text uses the selected translation: `src/reading/ChapterSection.tsx`, the pop-up in `src/book/LinkPopup.tsx`, and each other caller of `loadBookText`. Find the callers with a search.
   - The line "About this book" shows the name of the translation from the data, as now.
   - In the pop-up, the text for a screen reader names the translation of the loaded text. It has the fixed words "Berean Standard Bible" now.
   - In the pop-up of a quotation link, when the translation is `kjv`, show this label below the reason line: "The quoted words are from the Berean Standard Bible." Give it the style of the source line of the pop-up. Do not change a reason line. Do not show the label for `bsb`.
   - In `SOURCE_LINE` of `src/book/LinkPopup.tsx`, the words "Berean Standard Bible" name the source of a link. Do not change them.
8. The added words, in `src/book/ChapterBody.tsx` and in the pop-up: show an added-words item in italics, with an element that has a class. In a text block with the style `d`, which is in italics, show the added words upright. In the pop-up, `passageVerses` gives plain words now: change it so that the pop-up can show the added words in italics also.
9. The Sources page, `src/SourcesPage.tsx`, section "The Bible text". Make these changes and no other change:
   - Change the first sentence to: "The site has two translations: the Berean Standard Bible (BSB) and the King James Version (KJV)." Keep the link on the words "Berean Standard Bible". Keep the other sentences of that paragraph.
   - After the three paragraphs about the Berean Standard Bible, add this paragraph: "The King James Version on this site is the standardized text of 1769, from the files of eBible.org, by courtesy of the Crosswire Bible Society and eBible.org. It is in the public domain. In the United Kingdom, three publishers have the exclusive right to print this translation: Cambridge University Press, Oxford University Press, and Collins. eBible.org states that this right has no effect outside the United Kingdom." Link "eBible.org" to `https://ebible.org/eng-kjv2006` and "Crosswire Bible Society" to `https://crosswire.org/`. Make sure that each fact of this paragraph is in `sources/kjv/copr.htm`. If a fact is not there, stop and ask Arthur.
   - Then add this paragraph: "The site does not show the Strong's numbers and the footnotes of these files. The words that the translators added show in italics. In 13 verses, the files write one word as two words, for example "can not", and the site joins the word." Use the number of verses that Task 20b corrected. If Task 20b is not `DONE`, stop and ask Arthur.
   - Then add this paragraph: "On the King James Version pages, the section headings, the cross-reference lines, the paragraphs, and the lines of poetry are those of the Berean Standard Bible files. They are not part of the King James Version."
10. Add unit tests: the translation setting, the address that `loadBookText` reads for each translation, and `passageVerses` with added words.
11. Add browser tests in `e2e/`, at 1440 by 900 px and at 390 by 844 px:
    - The first visit shows the Berean Standard Bible: Genesis 1:1 has the words "In the beginning God created the heavens and the earth."
    - Select "King James Version" on the wall, and open Genesis. Genesis 1:1 has the words "In the beginning God created the heaven and the earth." Genesis 1:2 has the word "was" in italics. The section heading "The Creation" and its cross-reference line are on the page.
    - Load the page again. The King James Version is still selected.
    - On the reading page, scroll to Genesis 2. Open the panel of the chapter grid and select "Berean Standard Bible". The panel closes. The verse that was at the top is at the same place, with a tolerance of 2 px. The words are those of the Berean Standard Bible.
    - Psalm 23 in the King James Version: the title "A Psalm of David." is on the page, and verse 1 has "The LORD" and the word "is" in italics.
    - Matthew 17 in the King James Version: verse 21 shows as text, and the page has no note for it.
    - Open the pop-up of a quotation link in the King James Version. The passage has King James Version words, and the label of step 7 is below the reason line. In the Berean Standard Bible, the label is not there.
    - The Sources page has the three new paragraphs.
    - The axe-core check passes on the wall, on the reading page with the panel open, and on the reading page with the pop-up open, with `kjv` selected.
    - Each button of the translation switch is 24 by 24 px or more, gets the focus with the keyboard, and operates with the keyboard.
12. Make sure that the browser tests that were there before this task pass with no change to their expected results. If a test must change because the wall line or the panel changed, give the test and the reason in the report.
13. Take screenshots with `kjv` selected, at 1440 by 900 px and at 390 by 844 px: the wall, the reading page with the panel open, Genesis 1, Psalm 23, the pop-up of a quotation link, and the Sources page. Save them in `docs/screenshots/task-21/`. Compare the wall, the panel, and Psalm 23 with the renders, and give each difference in the report.
14. Run the `accuracy-reviewer` agent. The Bible text on the pages comes from the data of Tasks 20 and 20b with no change. The new words are those of steps 7 and 9.
15. Run `npm run lint`, `npm run build`, `npm test`, and `npm run test:e2e`.

Done when:

- The reader can select the King James Version on the wall and in the panel of the chapter grid, and the selection stays after a reload.
- The reading page and the pop-up show the selected translation, with the added words in italics.
- The Berean Standard Bible pages are as before, except the translation switch.
- The Sources page has the credit of step 9.
- `npm run build` has no errors, and all tests pass.

Stop and report. A check on a real phone is still open. Only Arthur can do it.

---

## Task 21b. The side of the pop-up, and one word for a screen reader

Status: DONE

Goal: on a wide screen, the pop-up shows the buttons "Go there" and "Stay here" completely when the screen has space for them. A screen reader says "an echo link".

The two faults, which the designer found in the check of Task 21 on 2026-11-15:

- At 1440 by 900 px, open Hebrews 9 in the King James Version and select the margin label of verse 20, with the label about 470 px from the top of the window. The pop-up opens below the label. Its content is 415 px high, and its box is 386 px high. The button "Go there" is half visible, and the box scrolls. The space above the label is larger than the space below. The cause: the label of Task 21 step 7 adds one line, and the rule in `src/book/LinkPopup.tsx` opens the pop-up below when the space below is 320 px or more. In the Berean Standard Bible at the same place, the content is 390 px high.
- In `src/reading/ChapterSection.tsx`, the name of a margin label for a screen reader is "Verse 1 has a echo link to Hebrews 11:3". The correct words are "has an echo link".

Arthur decided on 2026-11-15 to correct the two faults. The rule for the side is in section 7.7 of `docs/DESIGN.md`.

WARNING: Change only the side of the pop-up in the wide layout, and the one word for a screen reader. Do not change the look of the pop-up, its width, its content, or the narrow layout.

WARNING: Do not change a data file, a source file, or a build script.

Steps:

1. Read the function `place` in `src/book/LinkPopup.tsx`. Now it opens the pop-up below the control when the space below is 320 px or more, or when the space below is not smaller than the space above.
2. Change the rule for the side to this rule:
   - The content height is the height that the pop-up needs to show all of its content with no scroll, to a maximum of 600 px.
   - If the content height fits in the space below the control, the pop-up opens below.
   - If it does not fit below, and the space above is larger than the space below, the pop-up opens above.
   - In each other case, the pop-up opens below.
   - The maximum height of the box stays the space on its side, between 200 px and 600 px, as now. If the content is taller than the box, the box scrolls, as now.
3. The text of the passage arrives after the pop-up opens. When the text arrives, the pop-up gets its place again by the rule of step 2, as it does now when its height changes. The pop-up can change its side one time then. If you see the pop-up jump when you test it, say so in the report. Do not add a delay to correct it.
4. In `src/reading/ChapterSection.tsx`, change the words for a screen reader so that an echo link has "has an echo link" and a quotation link has "has a quotation link". Search `src/` for other text that has "a echo", and correct each one. Give the list in the report.
5. Add browser tests at 1440 by 900 px:
   - The case of the fault: Hebrews 9 in the King James Version, the margin label of verse 20 with the reference Exodus 24:8, with the label 470 px from the top of the window. The pop-up opens above the label, and the buttons "Go there" and "Stay here" are completely in the box and in the window.
   - The same label 150 px from the top of the window: the pop-up opens below the label, and the two buttons are completely in the box.
   - The same two cases in the Berean Standard Bible: in each, the two buttons are completely in the box.
   - The name of a margin label of an echo link has "has an echo link".
6. Make sure that the browser tests that were there before this task pass. If an expected result of a test must change because of the new rule, give the test and the reason in the report.
7. Take two screenshots at 1440 by 900 px, of the two cases of the King James Version in step 5. Save them in `docs/screenshots/task-21b/`.
8. Run `npm run lint`, `npm run build`, `npm test`, and `npm run test:e2e`.

Done when:

- In the case of the fault, the pop-up opens above the label and shows the two buttons completely.
- A screen reader gets "has an echo link".
- The narrow layout did not change.
- `npm run build` has no errors, and all tests pass.

Stop and report. A check on a real phone is still open. Only Arthur can do it.

---

# The top bar: Task 22

Arthur decided on 2026-11-15 to move the bottom line of the wall to a top bar, to put the wall in the center of the window, and to make the translation a list that opens from the top bar of the reading page. The design is in section 9 of `docs/DESIGN.md`.

---

## Task 22. The top bar, the wall in the center, and the translation list

Status: DONE

Goal: the wall and the reading page each have one top bar. The wall is in the center of the space below its bar. The reader selects the translation in a list that opens from the top bar of the reading page. In the narrow layout, the other items of a bar are in "Menu".

The design is in section 9 of `docs/DESIGN.md`. Arthur decided it on 2026-11-15 from renders. The nine renders are in `docs/screenshots/bar-design/`:

- `wall-1440.png`, `wall-1920.png`, `wall-390.png`: the wall with its top bar.
- `wall-menu-390.png`: the wall with the menu panel open.
- `reading-1440.png`, `reading-390.png`: the reading page with its top bar. `reading-390.png` shows the longest book name.
- `reading-list-1440.png`, `reading-list-390.png`: the reading page with the translation list open.
- `reading-menu-390.png`: the reading page with the menu panel open.

The renders are a sketch on the built site of Task 21b. Use their look. Do not copy code from them. The sizes are 1440 by 900 px, 1920 by 1080 px, and 390 by 844 px.

Changed on 2026-11-16, after Claude Code stopped on a failed axe-core check. Arthur decided these five items:

- Step 7: the name of the translation control for a screen reader has the short name also.
- Step 8: in the narrow layout, the name of the chapter grid control for a screen reader is the words that the control shows. It has no hidden word "Chapter".
- Step 10: the wide translation list stays 56 px from the top of the window, as built.
- Step 15: the change to `e2e/links.spec.ts` is accepted.
- Step 18 is new: lint ignores `.claude/` and `.github/`.

Changed a second time on 2026-11-16, after the name with "(BSB)" failed the axe-core check. Arthur decided these five items:

- Step 7: the name of the translation control is "Translation: Berean Standard Bible, BSB", with a comma and no parentheses.
- Step 8: the text of the chapter grid control has a space character between its parts.
- Steps 10 and 11: a row has the weight 500. Arthur accepted this as built.
- Step 12: a layout change closes the open panel. Arthur accepted this as built.
- Step 19: the rule for the test "the accessibility check finds a planted problem".

WARNING: Do not add a translation. The site has two translations, and the translation list has two rows.

WARNING: Do not change a data file in `public/data/`, a source file in `sources/`, or a build script.

WARNING: Do not change a page of the Reference section or its top bar, `src/reference/RefBar.tsx`.

WARNING: Do not change the Bible text, the links, the pop-up, the trail, the chapter grid, or "About this book". The one change to the panel of the chapter grid is step 9.

WARNING: The rule of Task 21 for the verse at the top of the page must stay: when the reader changes the translation, the verse at the top stays at the same place.

Steps:

1. Read section 9 of `docs/DESIGN.md`. Look at the nine renders in `docs/screenshots/bar-design/`.
2. In `src/data/translation.ts`, give each translation a short name: "BSB" for `bsb`, and "KJV" for `kjv`. Change nothing else in this file.
3. The top bar of the wall, in `src/wall/WallPage.tsx`.
   - Remove the line at the bottom of the wall, the function `WallFoot`, and its styles.
   - Add a top bar at the top of the wall. Give it the look of the top bar of the reading page, `.rd-bar` in `src/index.css`: 52 px high, the white background with the blur, the thin line below, Inter, weight 500, 15 px, the secondary ink color.
   - The bar stays at the top of the window when the reader scrolls.
   - The left part and the center of the bar are empty.
   - Wide layout: the right part has the links "Timeline", "Quotations", and "Sources", in a `nav` with the label "Reference". They have the look of the links in the top bar of the Reference pages, with no link marked as the current page.
   - Narrow layout: the right part has the control "Menu" of step 11.
   - The wall has no translation control.
4. The wall in the center, wide layout only.
   - The space above the columns, below the bar, is equal to the space below the columns. Each is 24 px or more.
   - When the window is lower than the bar and the wall together, the wall starts 24 px below the bar, and the page scrolls.
   - Expected: at 1440 by 900 px, the columns are approximately 761 px high, the space is approximately 44 px above and below, and the page does not scroll. At 1920 by 1080 px, the space is approximately 134 px above and below.
   - Do not change `src/wall/layout.ts` or `src/wall/fit.ts`. The sizes of the names stay.
5. The narrow wall starts below the bar, as now. Keep its top padding of 28 px and its bottom padding of 48 px.
6. When the page scrolls to a book name on the wall, the name stops below the bar. This applies to the move of the book name after "Books", and to the focus from the keyboard. The move of a book name between the wall and the reading page must work as before this task.
7. The top bar of the reading page, in `src/reading/ReadingPage.tsx`.
   - The left part is "Books", as now.
   - The center has the control that opens the chapter grid, as now. Then a line of 1 px by 18 px in the color `rgba(0, 0, 0, 0.14)`. Then the translation control.
   - The translation control is a button. It opens the translation list of step 10. It shows the short name of the selected translation and a caret of the same form as the caret of the chapter grid control. It has the secondary ink color and the weight 500.
   - For a screen reader, the name of the translation control is "Translation: ", the full name, a comma, and the short name, for example "Translation: Berean Standard Bible, BSB". Do not put the short name in parentheses: axe-core 4.14 removes text in parentheses before it compares. The name must contain the short name that the control shows: this is the axe-core rule `label-content-name-mismatch`, WCAG 2.5.3. It has `aria-expanded`.
   - The center of the bar is in the center of the window when the items fit.
   - Wide layout: the right part is the echo links switch, as now.
   - Narrow layout: the right part is the control "Menu" of step 11. The bar does not show the echo links switch.
8. The top bar of the reading page in the narrow layout.
   - In the two layouts, put a space character in the code between the book name and the element that has the chapter number. The `textContent` of the control is then "John Chapter 3" in the wide layout and "John 3" in the narrow layout, not "JohnChapter 3" and "John3". Chromium adds the space to the name by itself, but a different browser possibly does not. The look must not change.
   - The control that opens the chapter grid shows the book name and the chapter number, without the word "Chapter". Example: "John 3". For a screen reader, the name of the control is the same words, for example "John 3". Do not keep a hidden word "Chapter" in the control in the narrow layout: the name must contain the words that the control shows, in the same order, by WCAG 2.5.3. In the wide layout, the control shows "John Chapter 3" and has that name, as before this task.
   - The bar is always one line, 52 px high.
   - If the items do not fit, the book name ends with "…". "Books", the chapter number, the caret, the translation control, and "Menu" are never cut and never go out of the window.
   - Expected: "2 Thessalonians 3" and "Song of Solomon 8" show with no cut at 390 px and at 375 px. At 360 px and at 320 px, the book name ends with "…".
9. Remove the translation switch from the panel of the chapter grid, with the line below it. The panel has only the chapter grid. If no code uses `src/TranslationSwitch.tsx` after steps 3 and 9, delete the file and the styles `.tr-switch`, `.wall-translation`, and `.rd-translation-switch`.
10. The translation list. The translation control of step 7 opens it.
    - One row for each translation, in the order of `TRANSLATIONS`. A row has a place of 14 px for a check mark, then the full name, then the short name at the right, in the secondary ink color, 13 px.
    - A row has the weight 500. The row of the selected translation has the check mark and the weight 600.
    - For a screen reader, keep the form of the translation switch of Task 21: a group with the label "Translation", and one button for each translation, with `aria-pressed="true"` on the selected one. The name of a button is the full name. The short name in a row is not a second name.
    - Wide layout: a pop-up below the control, 4 px from the bar. Its top is 56 px from the top of the window. The render shows 48 px. Keep 56 px. It is 340 px wide. Its center is below the center of the control, and it stays 12 px or more from each side of the window. White, corners of 12 px, a padding of 6 px, the shadow `0 14px 34px rgba(0, 0, 0, 0.14), 0 0 0 1px rgba(0, 0, 0, 0.07)`. A row is 44 px high, with corners of 8 px, and with the background `rgba(0, 0, 0, 0.05)` when the pointer is on it. The page has no shade. A click outside the list closes it.
    - Narrow layout: a panel below the bar, with the full width, with the look and the shade of the panel of the chapter grid. A row is 48 px high, and the text is 16 px.
    - When the list opens, the focus goes to the button of the selected translation.
    - When the reader selects a row: the list closes, the focus goes back to the translation control, and the page shows the words of that translation. Use the code of Task 21 that keeps the verse at the top of the page at the same place. If the reader selects the translation that is already selected, the list closes and nothing changes.
    - Do not change the storage key, the value of the first visit, or `src/router.ts`.
11. "Menu", in the narrow layout only. It is a button with the word "Menu" at the right of the bar, with `aria-expanded`. It opens the menu panel: a panel below the bar, with the full width, with the look and the shade of the panel of the chapter grid. A row is 48 px high, and the text is 16 px, weight 500, in the ink color.
    - On the wall, the menu panel has three rows: the links "Timeline", "Quotations", and "Sources", in a `nav` with the label "Reference".
    - On the reading page, the menu panel has the row "Echo links", then a thin line, then the same three links.
    - The row "Echo links" is the echo links switch: a button with the name "Echo links" and `aria-pressed`, as the switch in the bar now. It shows the word "On" or "Off" at the right, in the secondary ink color. A tap changes the state, and the panel stays open.
    - A link row opens its page.
    - When the panel opens, the focus goes to its first row.
12. The rules for the three panels: the panel of the chapter grid, the translation list, and the menu panel.
    - Only one is open at a time. When one opens, the open one closes.
    - When the layout changes between wide and narrow, the open panel closes. A panel does not open again without an action of the reader.
    - The Escape key closes the open panel, and the focus goes back to the control that opened it. A tap on the shade closes it.
    - The caret of the translation control points up when the list is open.
    - When the trail shows below the top bar, the translation list and the menu panel start below the trail, as the panel of the chapter grid does.
    - Each new control and each row is 24 by 24 px or more, and shows the focus as the other controls of its page do.
13. Add a unit test: each translation has a short name, and the short names are different.
14. Add or change browser tests in `e2e/`, at 1440 by 900 px and at 390 by 844 px, if the test does not give a size.
    - The wall has no line at the bottom and no translation control.
    - Wall, 1440 by 900 px: the bar has the three links, and each link opens its page. The bar and all 66 book names are in the window, and the page does not scroll. The space between the bar and the top of the columns is equal to the space between the bottom of the columns and the bottom of the window, with a tolerance of 2 px.
    - Wall, 1920 by 1080 px: the same test of the two spaces.
    - Wall, 1440 by 700 px: the page scrolls, and the top of the first band is 24 px below the bar, with a tolerance of 2 px.
    - Wall, 390 by 844 px: "Menu" opens the menu panel with the three links. A link opens its page. The Escape key closes the panel, and the focus is on "Menu". After a scroll of 900 px, the bar is at the top of the window.
    - Wall, 390 by 844 px: open John, select "Books". The book name "JOHN" on the wall is completely below the bar.
    - Reading page: the translation control shows "BSB" on the first visit. Open the list: it has two rows, and the button "Berean Standard Bible" has `aria-pressed="true"`. Select "King James Version": the list closes, the focus is on the translation control, the control shows "KJV", and Genesis 1:1 has the words "In the beginning God created the heaven and the earth." Load the page again: the control shows "KJV".
    - Reading page: scroll to Genesis 2. Select the other translation in the translation list. The verse that was at the top is at the same place, with a tolerance of 2 px.
    - Reading page: the panel of the chapter grid has no translation switch.
    - Reading page, 1440 by 900 px: the translation list is 340 px wide, and it is completely in the window.
    - Reading page, at 390 px and at 320 px wide: for the last chapter of each of the 66 books, the bar is 52 px high, the page does not scroll sideways, and "Books", the chapter number, the translation control, and "Menu" are completely in the window.
    - Reading page, 390 px: for "2 Thessalonians 3" and "Song of Solomon 8", the book name is not cut.
    - Reading page, 390 px: the name of the chapter grid control for a screen reader is "John 3" for John 3, and the control has no hidden word. At 1440 px, the name is "John Chapter 3".
    - Reading page, at the two sizes: the name of the translation control for a screen reader is "Translation: Berean Standard Bible, BSB" on the first visit, and "Translation: King James Version, KJV" after the reader selects the King James Version.
    - Reading page: the `textContent` of the chapter grid control for John 3 starts with "John Chapter 3" at 1440 px, and with "John 3" at 390 px.
    - Reading page, 390 px: "Menu" opens the menu panel. The row "Echo links" changes the echo links setting, the word at the right changes, and the panel stays open. Each of the three links opens its page.
    - Reading page: when the chapter grid is open and the reader selects the translation control, the chapter grid closes and the translation list opens. At 390 px, test "Menu" in the same way.
    - Reading page: after travel with "Go there", when the trail shows, the top of the translation list is below the trail. At 390 px, test the menu panel in the same way.
    - The axe-core check passes on the wall at the two sizes, on the wall with the menu panel open at 390 px, on the reading page with the translation list open at the two sizes, and on the reading page with the menu panel open at 390 px.
    - Each new control and each row is 24 by 24 px or more, gets the focus with the keyboard, and operates with the keyboard.
15. The tests of Task 21 select the translation on the wall and in the panel of the chapter grid. Change them to select it in the translation list. Do not change an expected result about the Bible text. Give each changed test and the reason in the report. The test of the echo links switch in `e2e/links.spec.ts` opens "Menu" first in the narrow layout: Arthur accepted this change on 2026-11-16.
16. Take screenshots of the nine views of the renders, with the same file names, at the same sizes. Save them in `docs/screenshots/task-22/`. Compare each with its render, and give each difference in the report.
17. In `CLAUDE.md`, section "Names", the designer changed the names for this task. Use them: top bar, translation control, translation list, "Menu", menu panel.
18. Make `npm run lint` ignore the folders `.claude/` and `.github/`. They have files of tools, not of the site. Change only the configuration of lint. Do not change a file in the two folders.
19. Run `npm run lint`, `npm run build`, `npm test`, and `npm run test:e2e`.
    - The test "the accessibility check finds a planted problem" in `e2e/a11y.spec.ts` failed one time in a full run on 2026-11-16, and passed 5 of 5 times alone. It is a test of the Sources page, which this task does not change. If all tests pass in the full run, continue, and record that one failure in the report. If that test fails again in the full run, stop and report. Do not change that test.

Done when:

- The wall has a top bar and no line at the bottom, and it is in the center of the space below the bar in the wide layout.
- The reader selects the translation in the translation list on the reading page, and the selection stays after a reload.
- In the narrow layout, the top bar of the reading page is one line for each book, and "Menu" has the echo links switch and the links to the Reference section.
- The pages of the Reference section did not change.
- `npm run build` has no errors, and all tests pass.

Stop and report. Give the list of the changed tests. A check on a real phone is still open. Only Arthur can do it.

---

# The trail: Task 23

Arthur found two faults of the trail on 2026-11-16, and decided the rules that correct them. The rules are in section 7.7 of `docs/DESIGN.md`, in the item "Trail".

---

## Task 23. The trail: clear it on the wall, and remove the stops after a selected stop

Status: DONE

Goal: the trail is empty after the reader opens the wall. When the reader selects a stop in the trail, or "Back", the stops after that stop are removed. The last stop of the trail is always the stop with the underline.

The rules are in section 7.7 of `docs/DESIGN.md`, in the item "Trail". Arthur decided them on 2026-11-16.

The two faults, as the designer reproduced them on the build of Task 22 at 1440 by 900 px:

- Fault 1. Open Matthew 1. Select the read-with entry "Luke 1". Select the stop "Matthew 1". Select "Books". Open Romans on the wall. The page of Romans shows the trail "Matthew 1 > Luke 1", with the underline on "Matthew 1". Cause: no code clears the trail. Only a unit test calls `clearTrail` in `src/travel/trail.ts`.
- Fault 2. Then open the link from Romans 1:16 to Mark 8:38, and select "Go there". The trail shows "Matthew 1 > Romans 1:16 > Mark 8:38". Then select the stop "Romans 1:16". The trail still shows the three stops. Cause: `goToStop` in `src/travel/trail.ts` moves only the index `at`.

WARNING: Do not change the look of the trail: the colors, the sizes, the place, and the words.

WARNING: Do not change a link, a data file in `public/data/`, the pop-up, "Go there", the read-with list, or the top bar.

WARNING: The Back control of the browser, the chapter grid, and a scroll must not change the trail on a reading page. This rule of 2026-11-14 stays.

Steps:

1. Read the item "Trail" in section 7.7 of `docs/DESIGN.md`.
2. In `src/travel/trail.ts`, change `goToStop`: it removes the stops after the selected stop. The selected stop is then the last stop.
3. The last stop is always the current stop. Remove the field `at` from the state of the trail, if no code needs it after step 2. Change `src/travel/TrailBar.tsx` to agree:
   - The last stop has the underline and `aria-current="location"`.
   - "Back" shows when the trail has two stops or more. It opens the stop before the last stop, at its verse, and the last stop is removed.
   - When the reader selects the last stop, the page opens that stop, and no stop is removed.
   - A trail with one stop shows that stop, with the word "Trail" before it, and with no "Back". This is as now.
4. A browser tab can have a stored trail of the old form, with the field `at`. Read it as the stops up to and including the stop `at`. Do not show the stops after it.
5. Clear the trail when the wall opens. This applies to each way to the wall: "Books", the Back control of the browser, a link, and the address. Use `clearTrail`. The storage of the browser tab then has no stop.
6. A page of the Reference section does not clear the trail.
7. Do not change `addTravel`, unless step 3 makes a change necessary. A travel from a place that is not the last stop adds that place and then the target, as now.
8. Change the unit tests in `src/travel/trail.test.ts` to agree, and add these tests:
   - `goToStop` removes the stops after the selected stop.
   - `goToStop` on the last stop removes no stop.
   - A stored trail of the old form with three stops and `at` 0 reads as one stop.
   - `clearTrail` leaves no stop in the storage.
9. Add browser tests in `e2e/links.spec.ts`, at 1440 by 900 px and at 390 by 844 px. Use links and read-with entries that are in the data. Do not add a link.
   - Fault 1: do the steps of fault 1 above. After "Books", the storage of the tab has no stop. The page of Romans has no trail.
   - Fault 2: after fault 1, do "Go there" from Romans 1:16 to Mark 8:38. The trail is "Romans 1:16 > Mark 8:38", with the underline on "Mark 8:38".
   - Make a trail of three stops. Select the second stop: the trail has two stops, the second has `aria-current="location"`, and the page shows that passage. Select the first stop: the trail has one stop and no "Back".
   - Make a trail of two stops. Select "Back": the page shows the first stop at its verse, and the trail has one stop.
   - Make a trail of two stops. Use the Back control of the browser to go to the reading page before: the trail does not change.
   - Make a trail of two stops. Load the page again: the trail does not change.
   - Make a trail of two stops. Open the Timeline page, then use the Back control of the browser: the trail does not change.
   - Make a trail of two stops. Use the Back control of the browser until the wall shows. Then use the Forward control of the browser: the reading page has no trail.
10. Other tests expect that "Back" and a selected stop keep the later stops. Change them to the new rule. Give each changed test and the reason in the report.
11. The axe-core check passes on a reading page with a trail of one stop, at the two sizes.
12. Take screenshots at 1440 by 900 px and at 390 by 844 px: a trail of three stops, and the same page after the reader selects the second stop. Save them in `docs/screenshots/task-23/`.
13. Run `npm run lint`, `npm run build`, `npm test`, and `npm run test:e2e`.

Done when:

- The steps of fault 1 give a page of Romans with no trail.
- A selected stop, and "Back", remove the stops after the stop that opens.
- The last stop always has the underline.
- The Back control of the browser, the chapter grid, a scroll, and a reload do not change the trail on a reading page.
- `npm run build` has no errors, and all tests pass.

Stop and report. Give the list of the changed tests.

---

# The text size: Task 24

Arthur decided on 2026-11-16 that the reader can make the Bible text larger. The design is in section 10 of `docs/DESIGN.md`. It has no renders: Arthur looks at the built site.

---

## Task 24. The text size

Status: DONE

Goal: the reader selects one of three text sizes on the reading page: "Standard", "Large", or "Largest". The Bible text, its headings, and the passage text in the pop-up get larger. The browser keeps the selection.

The design is in section 10 of `docs/DESIGN.md`. Arthur decided it on 2026-11-16.

The sizes of the Bible text:

| Text size | Value in the storage | Narrow layout | Wide layout |
|---|---|---|---|
| Standard | `standard` | 18 px | 21 px |
| Large | `large` | 21 px | 24 px |
| Largest | `largest` | 24 px | 27 px |

WARNING: With "Standard", each element must have exactly the size that it has before this task. The 18 px and the 21 px are the values of `.rd-column` in `src/index.css` now.

WARNING: Do not change a data file in `public/data/`, the Bible text, a link, the wall, or a page of the Reference section.

WARNING: Do not add a smaller size, a fourth size, or a different step. Arthur decided three sizes.

WARNING: Do not change the sizes of the top bar, the trail, the panels, the heading of a chapter, "About this book", the read-with list, the labels in the margin, or the marks of the links.

Steps:

1. Read section 10 of `docs/DESIGN.md`.
2. Add `src/data/textSize.ts`, with the form of `src/data/translation.ts`: the three sizes with their names, the storage key `bible-text-size`, a function that sets the size, and a hook that gives it. The first visit gives `standard`. A stored value that is not one of the three values gives `standard`. Do not put the text size in the address of a page.
3. Apply the text size on the reading page.
   - The font size of `.rd-column` is the value of the table above, for the layout and the selected size.
   - All text in `.chapter-body` gets larger in the same proportion as the Bible text. This includes the section headings `.sh-s1`, `.sh-s2`, and `.sh-ms`, the cross-reference line `.link-line`, the notes `.ms-note` and `.omitted-note`, and the verse numbers. Example: `.sh-s1` is 17 px with "Standard" in the wide layout, and 17 × 27 / 21 px with "Largest".
   - Some of these rules have a size in px now. Change them so that they follow the text size. Keep each line height in the same proportion to its font size as now.
   - The font size of `.rd-column` also applies to elements that are not in `.chapter-body`. Make sure that the elements of the last WARNING keep their sizes.
4. Apply the text size in the pop-up: `.pop-text` and `.pop-reason` get larger in the same proportion as the Bible text of the layout. The other parts of the pop-up keep their sizes. The rules of Task 21b for the side of the pop-up stay.
5. The text size control, wide layout only, in `src/reading/ReadingPage.tsx`.
   - It is a button in the right part of the top bar, to the left of the echo links switch, with a space of 22 px between the two.
   - It shows the words "Text size" and the caret of the other controls of the bar. It has the look of the echo links switch: the secondary ink color, weight 500, 15 px.
   - For a screen reader, its name is "Text size: " and the name of the selected size, for example "Text size: Standard". Do not use parentheses in the name. It has `aria-expanded`.
   - It opens the text size list of step 6.
6. The text size list, wide layout only.
   - It is a pop-up with the look of the wide translation list: 56 px from the top of the window, white, corners of 12 px, a padding of 6 px, the same shadow, rows of 44 px with corners of 8 px, weight 500, and the light gray background when the pointer is on a row.
   - It is 220 px wide. Its center is below the center of the control, and it stays 12 px or more from each side of the window.
   - It has three rows: "Standard", "Large", "Largest". A row has the place of 14 px for a check mark, then the name. The row of the selected size has the check mark and the weight 600.
   - For a screen reader: a group with the label "Text size", and one button for each size, with `aria-pressed="true"` on the selected one.
   - When the list opens, the focus goes to the button of the selected size.
   - When the reader selects a row: the list closes, the focus goes back to the text size control, and the text has the new size. If the reader selects the size that is already selected, the list closes and nothing changes.
   - It is a fourth panel. The rules of step 12 of Task 22 apply: only one panel is open at a time, the Escape key closes it and the focus goes back, a click outside closes it, it starts below the trail when the trail shows, and a layout change closes it.
7. The row "Text size", narrow layout only, in the menu panel of the reading page.
   - It is below the row "Echo links" and above the thin line.
   - It has the words "Text size" at the left, in the look of the words "Echo links". The words are not a control.
   - It has three buttons at the right, in a group with the label "Text size": "Standard", "Large", "Largest". Each has `aria-pressed`. Each is 36 px high or more, with 16 px text.
   - A button that is not selected has the secondary ink color and the weight 500. The selected button has the ink color, the weight 600, and a line of 2 px below its name, 3 px from it.
   - A tap selects the size, the text has the new size, and the panel stays open.
   - At 320 px wide, the row has no cut and the page does not scroll sideways. If the three buttons do not fit beside the words, put them on a line below the words.
   - The menu panel of the wall does not have this row.
8. When the reader changes the text size, the verse at the top of the page stays at the same place. Use the code that does this for a change of the translation: `topVerse` and `keepPlace` in `src/reading/ReadingPage.tsx`.
9. In the wide layout with labels in the margin, each label is on the line of its verse number after a change of the text size.
10. Add a unit test file for `src/data/textSize.ts`: the first visit, the three values, and a wrong stored value.
11. Add browser tests in a new file `e2e/textsize.spec.ts`, at 1440 by 900 px and at 390 by 844 px, if the test does not give a size.
    - First visit: a paragraph of John 3 has the font size 21 px at 1440 px, and 18 px at 390 px.
    - With "Standard", these have the sizes of before this task, at the two sizes: `.sh-s1`, `.sh-s2`, `.link-line`, a verse number, and `.pop-text`. Read the values from the build before your change, and write them into the test.
    - 1440 px: the text size control opens the list with three rows, and "Standard" has `aria-pressed="true"`. Select "Large": the list closes, the focus is on the control, the name of the control is "Text size: Large", and the paragraph is 24 px. Select "Largest": the paragraph is 27 px.
    - 390 px: "Menu" has the row "Text size". Select "Large": the paragraph is 21 px, the panel is open, and "Large" has `aria-pressed="true"`. Select "Largest": the paragraph is 24 px.
    - The proportion: with "Largest", the font size of `.sh-s1` is its "Standard" size × 27 / 21 at 1440 px, and × 24 / 18 at 390 px, with a tolerance of 0.1 px.
    - The pop-up: with "Largest", the font size of `.pop-text` is its "Standard" size in the same proportion, at the two sizes.
    - These have the same font size with each of the three text sizes, at the two sizes: the text of the top bar, the heading of the chapter, "About this book", an entry of the read-with list, and at 1440 px a label in the margin.
    - After a reload, the text size stays. The storage has the key `bible-text-size` with the value.
    - Select "Largest" at 390 px. Set the window to 1440 by 900 px. The paragraph is 27 px.
    - With a wrong value in the storage, the text size is "Standard".
    - Scroll to John 3:16. Change the text size. The verse that was at the top is at the same place, with a tolerance of 2 px. Test each change between two sizes, at the two sizes.
    - 1440 px, "Largest": each label in the margin of John 3 is on the line of its verse number, with the tolerance that the test of the labels in `e2e/links.spec.ts` uses.
    - "Largest", at 390 px and at 320 px wide: Psalm 23, Psalm 119, John 3, and Genesis 1 do not scroll sideways.
    - 900 by 800 px, the smallest wide layout: for "2 Thessalonians 3", the top bar is one line of 52 px, and no two items of the bar overlap.
    - 320 px wide: the row "Text size" is completely in the window.
    - The text size list and the translation list are not open at the same time. The Escape key closes the text size list, and the focus is on the control. After travel with "Go there", the top of the text size list is below the trail.
    - The wall has no control with the words "Text size", at the two sizes.
    - The axe-core check passes with "Largest": on John 3 at the two sizes, on John 3 with the text size list open at 1440 px, and on John 3 with the menu panel open at 390 px.
    - Each new control is 24 by 24 px or more, gets the focus with the keyboard, and operates with the keyboard.
12. If a test of an earlier task fails because the top bar or the menu panel has a new item, change the test. Do not change an expected result about the Bible text. Give each changed test and the reason in the report.
13. Take screenshots in `docs/screenshots/task-24/`, at 1440 by 900 px and at 390 by 844 px:
    - Psalm 23 with each of the three text sizes.
    - John 3 with each of the three text sizes.
    - John 3 with the text size list open, at 1440 px only.
    - John 3 with the menu panel open, at 390 px only.
14. Look at the screenshots of "Largest" at 390 px. Report each line of poetry in Psalm 23 that breaks into more lines than with "Standard". Do not change the text or the sizes for this.
15. In `CLAUDE.md`, section "Names", the designer added the names for this task. Use them: text size, text size control, text size list.
16. Run `npm run lint`, `npm run build`, `npm test`, and `npm run test:e2e`. The rule of step 19 of Task 22 for the test "the accessibility check finds a planted problem" applies here also.

Done when:

- The reader selects "Standard", "Large", or "Largest" on the reading page, in the two layouts, and the selection stays after a reload.
- With "Standard", the text has the sizes of before this task.
- The verse at the top stays at the same place when the text size changes.
- The wall and the pages of the Reference section did not change.
- `npm run build` has no errors, and all tests pass.

Stop and report. Give the list of the changed tests, and the result of step 14. A check on a real phone is still open. Only Arthur can do it.

---

# Red letters: Task 25

Arthur asked on 2026-11-16 if the site can show the words of Jesus in red, as many printed Bibles do. The two source sets in the repository have marks for these words. By Arthur's method for new data, the first task is a report.

---

## Task 25. The marks of the words of Jesus: a report on the source files

Status: DONE

Goal: a report on the marks of the words of Jesus in the two source sets, on how the two sets differ, and on how the marks fit the words that the site shows. Arthur uses the report to decide if the site gets red letters, and how. No page and no data file of the site changes.

The marks are the USFM marker `\wj`. The files are in the repository already:

- Berean Standard Bible: `sources/bsb/usfm/`. The site takes the structure from these files, and the words from `sources/bsb/bsb.txt`. `docs/DATA-SOURCES.md` section 2.
- King James Version: `sources/kjv/usfm/`. The site takes the words from these files. `docs/DATA-SOURCES.md` section 9 says that the site does not take the marks of the words of Jesus.

The designer's check on 2026-11-16, with `grep` on the files:

- `sources/bsb/usfm/` has 2,840 marks `\wj`, in 9 files: MAT, MRK, LUK, JHN, ACT, 1CO, 2CO, HEB, REV.
- `sources/kjv/usfm/` has 4,076 marks `\wj`, in 8 files: Matthew, Mark, Luke, John, Acts, 1 Corinthians, 2 Corinthians, Revelation. Hebrews has none.
- In John, each set has as many start markers as end markers: 259 in the Berean file, and 422 in the King James Version file.
- In the Berean files, a mark can start before the marker `\v`. Example, Matthew 3:15: `\p \wj \v 15 “Let it be so now,”\wj* Jesus replied. \wj “It is fitting for us to fulfill all righteousness in this way.”\wj*`
- In the King James Version files, the marks have nested markers, `\+w` and `\+add`. Example: Matthew 3:15.
- Not checked by the designer: why the two counts differ, and if the marks fit the words of the site.

WARNING: Do not change a file in `public/`, in `src/`, or in `sources/` in this task. Do not change a build script.

WARNING: Do not download a file. The task uses only files of the repository.

WARNING: Do not write a fact from memory about which words Jesus spoke, or about red letter Bibles. Each number and each list in the report must come from the output of the script of step 2. Where the two source sets differ, give the difference. Do not say which set is correct.

Steps:

1. Read sections 2 and 9 of `docs/DATA-SOURCES.md`, and the scripts `scripts/build-text.mjs` and `scripts/build-text-kjv.mjs`.
2. Write the script `scripts/wj-report.mjs`. It only reads files in `sources/` and `public/data/`. It prints the numbers and the lists for steps 3 to 9. Use the method of the build scripts to get the plain words of a verse: the words that remain when the script removes the markers, the Strong's numbers, and the footnotes.
3. Report the marks of each source set.
   - For each book that has marks: the number of start markers, the number of end markers, and the number of verses that have marked words.
   - Each place where a start marker has no end marker, or an end marker has no start marker.
   - The number of marks that start before a marker `\v`, the number of marks that have words of more than one verse, and the number of marks that have a paragraph marker or a poetry marker inside them.
   - The number of marks that have no letter inside them.
   - For the Berean files: the number of marks whose first character is an opening quotation mark, and the number whose last character is a closing quotation mark.
   - For the King James Version files: each nested marker inside the marks, with the number of times that it occurs.
4. Give each verse one of three classes in each source set: "all" when each word of the verse is in a mark, "part" when some words are in a mark, and "none". Report:
   - The number of verses of each class, for each book and each source set.
   - A table of the nine pairs of classes, Berean class by King James Version class, with the number of verses of each pair. Use the verses that the two sets have.
   - Each verse where one set has "none" and the other set has "part" or "all". Give the book, the chapter, the verse, the two classes, and the words of the verse in the two sets, with the marked words between `[[` and `]]`. If the list has more than 150 verses, give the count for each book and the first 150 verses.
   - The number of verses where one set has "all" and the other set has "part", for each book, and 30 examples in the same form.
   - Each verse with marks in the King James Version files that the main text of the Berean Standard Bible does not have.
5. Print these passages from each source set, each verse with the marked words between `[[` and `]]`. Arthur reads them. Do not add a comment to them.
   - Matthew 3:13-17
   - John 3:10-21
   - John 3:27-36
   - Acts 9:3-6
   - Acts 20:35
   - Acts 26:14-18
   - 1 Corinthians 11:23-25
   - 2 Corinthians 12:9
   - Each verse of Hebrews that has marks in the Berean files
   - Revelation 1:8-20
   - Revelation 22:7-20
6. Test if the Berean marks fit the words that the site shows. The site data is `public/data/text/<id>.json`. In a text block (`k: "p"`), an item `{ "v": n }` starts verse n, and a string is words of the current verse.
   - For each mark, get its plain words for each verse that it has words of. Search these words in the words of that verse in the site data.
   - Count the marks that the script finds exactly, and the marks that it does not find. List each mark that it does not find, with the words of the mark and the words of the verse in the site data. If the list has more than 50 marks, give the count for each book and the first 50.
   - Count the marks whose words are in more than one text block of the site data, for example a speech of two paragraphs or of more than one poetry line.
7. Do the test of step 6 for the King James Version marks and `public/data/text-kjv/<id>.json`. The site joins a word in 13 verses, by Task 20b. Say if a mark is in one of the 13 verses.
8. Report where marked words are in the site data: the number of marked verses in paragraph blocks, in poetry blocks, and in each other block style, for each translation.
9. Propose two forms for the marks in the site data, and give for each form the bytes that it adds to `public/data/text/` and to `public/data/text-kjv/`, as a number and as a part of the size now. Compute the bytes with the script. Do not write the data.
10. Write the report `docs/reviews/task-25-words-of-jesus-report.md`. Give it one section for each of steps 3 to 9, in that order. Then add a section "Proposals" with these four points. For each point, give the options and the cost of each option. Do not decide for Arthur.
    - Which marks each translation uses: its own marks, or the Berean marks for the two translations, or only the words that the two sets agree on.
    - What the site does with a mark that does not fit the words of the site, if step 6 or step 7 found one.
    - What the site does with the verses of step 4 where one set has "none" and the other does not.
    - The form of the marks in the site data.
11. In `docs/DATA-SOURCES.md`, add one line to section 2 and one line to section 9: the files have the marks of the words of Jesus, with the two counts of step 3, and "Read for Task 25. Not used on the site."
12. Run `npm run lint`, `npm run build`, and `npm test`.

Done when:

- `docs/reviews/task-25-words-of-jesus-report.md` has the numbers and the lists of steps 3 to 9, and the four proposals.
- No file in `public/`, in `src/`, or in `sources/` changed.
- `npm run build` has no errors, and the tests pass.

Stop and report. Do not start a task that adds red letters. Arthur decides the next tasks from the report.

---

# Red letters: Tasks 26 and 27

Arthur decided on 2026-11-16 that the site shows the words of Jesus in red. The design is in section 11 of `docs/DESIGN.md`. Task 26 puts the marks in the site data, and no page changes. Task 27 shows the red letters and adds the switch.

---

## Task 26. Red letters: the marks in the site data

Status: DONE

Goal: the site data of the two translations has the marks of the words of Jesus. The pages show the same words as before, with no red letters and no other change that a reader can see.

The design is in section 11 of `docs/DESIGN.md`, and the facts are in `docs/reviews/task-25-words-of-jesus-report.md`. Arthur decided on 2026-11-16:

- Each translation uses the marks of its own source files.
- The site shows all 1,420 Berean marks. The 47 marks that do not fit the words of the site exactly go in place with a search that ignores the spaces and the fault characters `[’’]`.
- The form of the marks in the site data is Form A of the report.
- One exception: Mark 12:37 of the King James Version.

WARNING: Do not change the words of a verse. After this task, the words of each verse in `public/data/text/` and in `public/data/text-kjv/` must be the same as before this task, character by character.

WARNING: Do not change a file in `sources/`.

WARNING: Do not add or remove a mark. The one exception is step 4. Do not write a fact from memory about which words Jesus spoke.

WARNING: No page shows red letters in this task. Task 27 does that.

Steps:

1. Read section 11 of `docs/DESIGN.md`, and steps 3, 6, 7, and 9 of `docs/reviews/task-25-words-of-jesus-report.md`.
2. The form of the marks in the site data, Form A:
   - In a text block (`k: "p"`), a run of marked words is an item `{ "j": "words" }`, in place of a plain string. The words before the mark and after the mark in the same string stay plain strings.
   - In the King James Version data, added words inside a mark keep their item and get `"j": 1`, for example `{ "a": "it", "j": 1 }`.
   - An item `{ "v": n }` is never inside an item `j`. A mark that has words of more than one verse, or words in more than one text block, gives one item `j` for each part.
   - The quotation marks and the other characters that the source has inside a mark are in the item `j`. A space at the start or at the end of a mark stays where it is in the words of the verse now.
3. Change `scripts/build-text.mjs`: it reads the marks `\wj` of `sources/bsb/usfm/` and writes them in Form A.
   - The words of the site are from `sources/bsb/bsb.txt`, as now. A mark gives the place of its words in the words of the verse.
   - If the words of a mark are not in the words of the verse exactly, search with each space removed from the two texts, and with the characters `[’’]` removed from the words of the mark. The report found all 47 such marks with this search.
   - If the script does not find a mark, or finds it at more than one place and cannot decide by the order of the marks in the verse, the script stops with an error that names the book, the chapter, and the verse.
   - Expected: the script places 1,420 marks.
4. Change `scripts/build-text-kjv.mjs`: it reads the marks `\wj` of `sources/kjv/usfm/` and writes them in Form A.
   - Expected: the script places 2,038 marks, each found exactly.
   - The one exception, Mark 12:37. The source file marks "David therefore himself calleth him Lord; and whence is he then his son? And the common people heard him gladly." On the site, the mark ends after "his son?". The words " And the common people heard him gladly." are not marked. Arthur decided this on 2026-11-16: the last sentence is words of the writer.
   - Make the exception a list in the script, with the form of the list `SPLIT`. The script stops with an error if the words of the exception are not in the mark exactly once.
5. Run the two scripts. Write the data files again.
6. Change the code that reads the text data, so that an item `j` is words. Add the type and a function `isMarked` in `src/data/text.ts`, with the form of `isAdded`. Each place that reads the items of a text block must read the new item: `src/book/ChapterBody.tsx`, `src/data/passage.ts`, `src/book/linkEnds.ts`, and each other file that reads the items. The page shows the words of an item `j` as it shows a plain string, with no new element that changes the look.
7. Change the unit tests that compare the words of each verse with the sources, `src/data/text.test.ts` and `src/data/textKjv.test.ts`: they read an item `j` as words. Their expected words do not change. They must pass for all 31,086 and all 31,102 verses.
8. Add unit tests for the marks, for each translation:
   - The data has the marks of each mark of the source: the test reads the source files, and compares the marked words of each verse in the data with the marked words of that verse in the source, with the spaces and `[’’]` ignored for the Berean Standard Bible.
   - The number of verses with marked words, by the classes of the report: Berean Standard Bible, 1,405 verses "all" and 642 verses "part". King James Version, 1,401 verses "all" and 627 verses "part". These are the numbers of the report, with Mark 12:37 of the King James Version moved from "all" to "part". If your numbers differ, stop and report. Do not change the expected numbers to make the test pass.
   - No book has a mark, apart from these: Berean Standard Bible, 9 books: Matthew, Mark, Luke, John, Acts, 1 Corinthians, 2 Corinthians, Hebrews, Revelation. King James Version, the same without Hebrews.
   - John 3:16 is "all" in the two translations. Matthew 3:17 is "none" in the two translations.
   - Mark 12:37 of the King James Version: "And the common people heard him gladly." is not in a mark, and "David therefore himself calleth him Lord" is in a mark.
   - No item `j` has an item `v` inside it, and no item `j` is empty.
9. Add one browser test: with each translation, the text of Matthew 4 and of John 3 on the page is the same as the words of the data, and no element of the chapter has the color `#8B1A1A`.
10. Take screenshots of Matthew 4 with each translation, at 1440 by 900 px and at 390 by 844 px, before your change and after it. Compare them. They must be the same. Save the four screenshots of after in `docs/screenshots/task-26/`.
11. In `docs/DATA-SOURCES.md`, in sections 2 and 9: the site now takes the marks of the words of Jesus. Record the 47 Berean marks and the search that places them. Record the exception of Mark 12:37 in section 9, with the words of the source and the words that the site marks, next to the record of the 13 split words.
12. Run `npm run lint`, `npm run build`, `npm test`, and `npm run test:e2e`. The rule of step 19 of Task 22 for the test "the accessibility check finds a planted problem" applies.

Done when:

- The data of the two translations has the marks in Form A: 1,420 marks of the Berean files and 2,038 marks of the King James Version files, with the one exception.
- The words of each verse did not change, and the tests of the words pass.
- No page looks different.
- `npm run build` has no errors, and all tests pass.

Stop and report. Give the size of `public/data/text/` and of `public/data/text-kjv/` before and after. Do not start Task 27.

---

## Task 27. Red letters: the pages and the switch

Status: DONE

Goal: the reading page and the pop-up show the words of Jesus in red. The reader switches red letters on and off. The Sources page says where the red letters are from.

The design is in section 11 of `docs/DESIGN.md`. The five renders are in `docs/screenshots/red-design/`:

- `matthew-4-1440.png`, `matthew-4-390.png`: Matthew 4 with red letters, Berean Standard Bible.
- `john-14-390.png`: a long speech.
- `john-3-kjv-text-list-1440.png`: John 3 of the King James Version, with the text list open.
- `john-14-menu-390.png`: the menu panel with the row "Red letters".

The renders are a sketch on the built site of Task 24. Use their look. Do not copy code from them.

WARNING: Do this task only when Task 26 is `DONE`.

Changed on 2026-11-16, after the report of Task 26:

- The name. In `CLAUDE.md`, "mark" alone is the dot or ring of a link. The mark of the source files on words of Jesus is the "words-of-Jesus mark". In the site data, it is an item `j`. Use these names in code comments, tests, and the report. The code name `isMarked` stays.
- The look with red letters off. Task 26 found that a separate text node at the edge of a words-of-Jesus mark moves the edges of some letters by less than 1 px. In this task, the words of an item `j` are in an element of their own, so such small differences are permitted. The words must stay at the same places, with a tolerance of 1 px, and each line must break at the same word as before this task.

WARNING: Do not change a data file, a build script, or a file in `sources/`.

WARNING: The color of red letters is `#8B1A1A`. Do not use this color for a different element. Do not change a group color.

WARNING: Do not change the look of a page with red letters off, apart from the control of step 4 and the row of step 5.

Steps:

1. Read section 11 of `docs/DESIGN.md`. Look at the five renders.
2. Add `src/data/redLetters.ts`, with the form of the echo links setting in `src/travel/travel.ts`: the storage key `bible-red-letters`, the values `on` and `off`, a function that sets it, and a hook that gives it. The first visit gives on. A stored value that is not `off` gives on.
3. Show the red letters.
   - In `src/book/ChapterBody.tsx`, the words of an item `j` are in an element with a class for red letters. Added words with `"j": 1` are in that class also, and stay in italics.
   - With red letters on, the element has the color `#8B1A1A`. With red letters off, it has the color of the text around it. Do this with one attribute on `.reading` and one style rule, so that a change of the switch does not build the page again.
   - The verse numbers, the marks and the labels of the links, the headings, the cross-reference lines, and the notes do not become red.
   - In the pop-up, the passage text `.pop-text` shows the words of the items `j` in the same color, by the same switch. The reason line and the other parts of the pop-up do not become red.
   - The light background of the linked verse after travel stays. Make sure that the red letters have a contrast of 4.5 to 1 or more on it.
4. The text control, wide layout. It is the text size control of Task 24.
   - It shows the word "Text", not "Text size". For a screen reader, its name is "Text settings".
   - Its list, the text list, has the three text sizes as now. Below them, add a thin line with the look of the line in the menu panel, then the row "Red letters".
   - The row "Red letters" is a button with the name "Red letters" and `aria-pressed`, with the look of a row of the list. It has the place for the check mark, empty, then the words "Red letters", then the word "On" or "Off" at the right, in the secondary ink color. The word is hidden from a screen reader, as in the row "Echo links".
   - A click on the row changes the state, and the list stays open. A click on a text size closes the list, as now.
   - The group of the three text sizes keeps the label "Text size".
5. The row "Red letters", narrow layout, in the menu panel of the reading page.
   - It is below the row "Text size" and above the thin line.
   - It has the form and the look of the row "Echo links": a button with the name "Red letters" and `aria-pressed`, and the word "On" or "Off" at the right.
   - A tap changes the state, and the panel stays open.
   - The menu panel of the wall does not have this row.
6. A change of the switch does not move the page. The text has the same width with red letters on and off.
7. The Sources page, `src/SourcesPage.tsx`. Add this paragraph after the paragraph about the headings of the King James Version pages. Do not change its words:
   - "The words of Jesus are in red. They are the words that the files of each translation mark as words of Jesus. The two translations do not mark the same words in each verse. The site changes one mark: in Mark 12:37 of the King James Version, the file also marks the sentence "And the common people heard him gladly.", and the site does not."
8. Add a unit test file for `src/data/redLetters.ts`: the first visit, the two values, and a wrong stored value.
9. Add browser tests in a new file `e2e/redletters.spec.ts`, at 1440 by 900 px and at 390 by 844 px, if the test does not give a size.
   - First visit, Berean Standard Bible, Matthew 4:4: the words "It is written:" have the color `#8B1A1A`, and the words "But Jesus answered," have the ink color.
   - Matthew 4:3, the words of the tempter, have the ink color.
   - The verse number of Matthew 4:4 has the color of its group, not `#8B1A1A`.
   - King James Version, John 3:3: "Verily, verily, I say unto thee" is red, and "Jesus answered and said unto him," is not.
   - King James Version, Mark 12:37: "And the common people heard him gladly." is not red.
   - King James Version, a verse where added words are in a words-of-Jesus mark: the added words are red and in italics. Find such a verse in the data. Do not write one from memory.
   - Genesis 1 and Romans 1 have no red element.
   - 390 px: "Menu" has the row "Red letters" with "On". A tap gives "Off", `aria-pressed="false"`, no red element in Matthew 4, and the panel is open. A second tap gives red letters again.
   - 1440 px: the text control shows "Text", and its name is "Text settings". Its list has the row "Red letters". A click gives "Off", the list is open, and Matthew 4 has no red element.
   - After a reload, the selection stays. The storage has the key `bible-red-letters`.
   - Switch red letters off at 390 px. Set the window to 1440 by 900 px. Matthew 4 has no red element.
   - The switch does not move the page: the place of Matthew 4:7 on the screen is the same before and after a change, with a tolerance of 1 px.
   - With red letters off, Matthew 4 and John 14 have the same line breaks as the screenshots of Task 26 show for Matthew 4, and as the build of Task 26 gives for John 14: compare the number of lines of each paragraph.
   - The pop-up: open a link whose passage has words of Jesus, and find it in the data. The words of Jesus in `.pop-text` are red with red letters on, and have the ink color with red letters off.
   - The Sources page has the paragraph of step 7.
   - The wall has no control with the words "Red letters".
   - The axe-core check passes on Matthew 4 and on John 14 with red letters on, at the two sizes, with each translation, and on Matthew 4 with the text list open at 1440 px.
   - The row "Red letters" is 24 by 24 px or more in each layout, gets the focus with the keyboard, and operates with the keyboard.
10. The tests of Task 24 use the name "Text size: Standard" and the words "Text size" of the control. Change them to the new name and the new word. Give each changed test and the reason in the report.
11. Take screenshots of the five views of the renders, with the same file names, at the same sizes. Save them in `docs/screenshots/task-27/`. Compare each with its render, and give each difference in the report.
12. In `CLAUDE.md`, section "Names", the designer added the names for this task. Use them: text control, text list, red letters, red letters switch.
13. Run `npm run lint`, `npm run build`, `npm test`, and `npm run test:e2e`. The rule of step 19 of Task 22 for the test "the accessibility check finds a planted problem" applies.

Done when:

- The reading page and the pop-up show the words of the items `j` in `#8B1A1A`, with each translation.
- The reader switches red letters on and off in the two layouts, and the selection stays after a reload.
- With red letters off, the text is as before Task 26.
- The Sources page has the paragraph.
- `npm run build` has no errors, and all tests pass.

Stop and report. Give the list of the changed tests. A check on a real phone is still open. Only Arthur can do it.

---

# The name and the icon: Task 28

Arthur decided on 2026-11-16 that the name of the site is "Bible Wall", and he selected a new icon. The design is in section 12 of `docs/DESIGN.md`.

---

## Task 28. The name "Bible Wall", the title of the browser tab, and the icon

Status: DONE

Goal: the name of the site is "Bible Wall". The title of the browser tab starts with the place of the reader. The site has the new icon for a browser tab and for a phone home screen.

The design is in section 12 of `docs/DESIGN.md`. The sheet that Arthur decided from is `docs/screenshots/icon-design/icon-options.png`, option B2.

The designer made the icon files. They are in `public/` now, and they are not in git:

- `favicon.svg`. It replaces the file of the same name, which was the icon of Vite.
- `favicon-32.png`, `favicon-16.png`
- `apple-touch-icon.png`, 180 by 180 px
- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`
- `manifest.webmanifest`

WARNING: Do not change the eight files of the designer in `public/`. If a file has a fault, stop and report.

WARNING: Do not change the address of the site, the value `base` in `vite.config.ts`, or `src/router.ts`.

WARNING: Do not change a page in a way that a reader can see, apart from the title of the browser tab and the icon. No page shows the name.

WARNING: Do not change the words "Books of the Bible" in a document where they are the name of the wall image.

Steps:

1. Read section 12 of `docs/DESIGN.md`. Look at the row B2 of `docs/screenshots/icon-design/icon-options.png`.
2. Check the eight files in `public/`:
   - Each PNG file has the size that its name or the table of section 12.3 gives.
   - `favicon.svg` has ten `rect` elements with the ten group colors of `src/data/books.ts`, in the order of `GROUPS`. It does not have the color `#863bff` of the old icon.
   - `manifest.webmanifest` is correct JSON, with the name "Bible Wall", the short name "Bible Wall", and the three icons.
3. Change `index.html`:
   - The title is "Bible Wall".
   - Keep the link to `favicon.svg`. Add links to `favicon-32.png` and `favicon-16.png` with their sizes, to `apple-touch-icon.png`, and to `manifest.webmanifest`.
   - Add `<meta name="apple-mobile-web-app-title" content="Bible Wall" />` and `<meta name="theme-color" content="#ffffff" />`.
   - After the build, each address in `dist/index.html` and in the manifest must be correct below `/bible/`. The manifest has `"start_url": "/bible/"` and `"scope": "/bible/"`, and its icon addresses are relative to the manifest.
4. Change the name in the code: the two headings in `src/App.tsx` and the hidden heading in `src/wall/WallPage.tsx` say "Bible Wall". Search `src/`, `index.html`, and `e2e/` for "Books of the Bible", and change each place where it is the name of the site.
5. Set the title of the browser tab, by section 12.2:
   - The wall: "Bible Wall".
   - The reading page: the book name and the chapter number that the top bar shows, then " · ", then "Bible Wall". Example: "John 3 · Bible Wall". The character is the middle dot, U+00B7, with one space before it and one space after it.
   - The title of the reading page follows the chapter of the top bar when the reader scrolls, and after travel.
   - The Reference pages: "Timeline · Bible Wall", "Quotations · Bible Wall", and "Sources · Bible Wall".
   - The page for a book that the site does not have, and each other page: "Bible Wall".
   - Put the name "Bible Wall" in one place in the code, and make each title from it.
6. Add browser tests in a new file `e2e/title.spec.ts`:
   - The wall has the title "Bible Wall".
   - John 3 has the title "John 3 · Bible Wall". After a scroll to John 4, the title is "John 4 · Bible Wall". After "Books", the title is "Bible Wall".
   - After travel with "Go there", the title has the linked chapter.
   - "Psalms 23 · Bible Wall" for Psalm 23, with the book name as the top bar shows it.
   - The three Reference pages have their titles.
   - The hidden heading of the wall is "Bible Wall".
   - The page has the links to `favicon.svg`, to the two PNG icons, to `apple-touch-icon.png`, and to the manifest, and each address gives a file: the answer has the status 200.
   - The manifest that the page links to has the name "Bible Wall", and each of its three icon addresses gives a file with the status 200.
   - No element of the wall, of John 3, or of the Sources page has the words "Books of the Bible".
7. If a test of an earlier task uses the old title or the old heading, change it. Give each changed test and the reason in the report.
8. In `docs/DATA-SOURCES.md`, section 7 or the section that fits: the icon is a drawing of the designer for this site, from the ten group colors. It has no other source and no licence of a third person. Remove a record of the Vite icon, if the file has one.
9. Take two screenshots of the browser tests at 1440 by 900 px, John 3 and the wall, and save them in `docs/screenshots/task-28/`. Say in the report that a screenshot of the page does not show the tab, and give the title that each test read.
10. Run `npm run lint`, `npm run build`, `npm test`, and `npm run test:e2e`. The rule of step 19 of Task 22 for the test "the accessibility check finds a planted problem" applies.
11. After the push and the deploy, check that these addresses of the public site give a file: `favicon.svg`, `apple-touch-icon.png`, and `manifest.webmanifest`, below `https://alangham.github.io/bible/`. Give each status in the report.

Done when:

- The title of the browser tab is "Bible Wall" on the wall, and it starts with the place on a reading page and on a Reference page.
- The site has the new icon, and no file has the icon of Vite.
- The words "Books of the Bible" are not on a page.
- `npm run build` has no errors, and all tests pass.

Stop and report. Give the list of the changed tests. Arthur checks the icon on a real phone: the browser tab, and the home screen after "Add to Home Screen".

---

# The World English Bible: Task 29

Arthur decided on 2026-11-16 to add a third translation. He wanted the NASB first. The NASB is under copyright of The Lockman Foundation, and its free limit is 1,000 verses, so the site cannot show it without written permission. Arthur selected the World English Bible in its place. By Arthur's method for new data, the first task is a report.

---

## Task 29. World English Bible: a report on the source files

Status: DONE

Goal: a report on the files of the World English Bible, on its editions, and on how the structure and the red letters of the site fit them. Arthur uses the report to decide the tasks that add the World English Bible. No page and no data file of the site changes.

The rules of the site that the report must test against, for your information:

- A translation changes only the words, and the words-of-Jesus marks with them. The reading page shows the section headings, the cross-reference lines, and the text blocks of the Berean data. `docs/DESIGN.md` sections 8 and 11.
- The site writes no content, and changes no word of a Bible text.

The three editions of this task:

- Edition A, on eBible.org: `engwebp`, the World English Bible with no Deuterocanon. Details page: `https://ebible.org/details.php?id=engwebp`.
- Edition B, on eBible.org: `eng-web`, the World English Bible Classic. Details page: `https://ebible.org/details.php?id=eng-web`.
- Edition C: `resources/web.docx`, a file that Arthur downloaded from OpenBible.com, a site of the Berean publisher. It is on the computer now. `.gitignore` names the folder `resources/`.

The designer's check on 2026-11-16. Read these as facts to confirm, not as results:

- Edition C: 2,133,656 bytes, SHA-256 `949f67d0f965eda1d048a696bc7ef69549fab10bdb7bbe8aaec161a3bb140312`. Its properties give "Bible Hub" as the creator and 2021-07-26 as the date. These are the values of `resources/kjv.docx` also.
- Edition C has the form of `resources/kjv.docx`: a chapter starts with a paragraph that has no style and has the book name and the chapter number. The designer found 1,189 of these paragraphs, 31,102 runs with the style `reftext1` for the verse numbers, and these paragraph styles: 13,131 `reg`, 3,016 `hdg`, 229 `acrostic`, 42 `subhdg`, and 5 `suphdg`. The site data has 3,016 main headings also.
- Edition C has the name "Yahweh" more than 6,800 times, and the word "LORD" 2 times.
- The text of edition C has none of these words: "public domain", "copyright", "trademark", "eBible".
- In edition C, John 3:16 has the words "his one and only Son". On 2026-11-16, the details page of edition A showed John 3:16 with the words "his only born Son". So edition C is possibly an older text.
- In edition C, some verses have a number and no words, for example Acts 8:37 and Romans 16:25. The script of the designer was not exact: it read 30,836 of the 31,102 verses.
- From the eBible.org pages, read by the designer in search results only: the two editions are marked "public domain", the name "World English Bible" is a trademark of eBible.org, edition A has no Deuterocanon and has "LORD" or "GOD" where edition B has "Yahweh", and edition A is the "2020 stable text edition".

WARNING: Do not change a file in `public/` or in `src/` in this task.

WARNING: Do not put a file of the World English Bible text in the repository. Download the files to a temporary folder that is not in `C:\dev\bible`. Arthur decides on the source after the report.

WARNING: Do not download a file from OpenBible.com. Its terms say that a download can be an acceptance of terms. Use Arthur's copy, `resources/web.docx`.

WARNING: Do not write a fact about the World English Bible from memory. Each number in the report must come from the output of the script of step 4. Each licence statement must come from its page, with the date on which you read the page.

Steps:

1. Read sections 8 and 11 of `docs/DESIGN.md`, section 9 of `docs/DATA-SOURCES.md`, and `docs/reviews/task-19-kjv-report.md`. The report of Task 19 is the model for this report.
2. Read the licence of editions A and B on eBible.org: the details page and the copyright page that it links to.
   - Record the statement about the public domain, in the words of the page.
   - Record all that the page says about the trademark "World English Bible": who can use the name, and for which text. The site will show the text with no changed word, and with the headings and the paragraphs of the Berean data.
   - If a page does not state that the text is in the public domain, stop and ask Arthur.
   - Add a section "World English Bible" to `docs/DATA-SOURCES.md`. For each edition, record the addresses, the date, and the statements. Record the use as "Read for Task 29. Not used on the site."
3. Download the USFM zip file of edition A and of edition B to the temporary folder. If a page asks you to accept terms before the download, stop and ask Arthur. For each file, record in `docs/DATA-SOURCES.md` the address, the date, the size in bytes, and the SHA-256. Make sure that the SHA-256 of `resources/web.docx` is the value above. If it differs, say so in the report and continue.
4. Write the script `scripts/web-report.mjs`. It gets the path of the temporary folder as an argument. It only reads files. It prints the numbers and the lists for steps 5 to 12. Use the method of `scripts/kjv-report.mjs` for the plain words of a verse, and for the `.docx` file. Do not add a package to `package.json`.
5. Report the content of each edition:
   - The number of books, chapters, and verses. If an edition has more books than the 66 books of `public/data/books.json`, list the other books and do not count them.
   - For editions A and B: each USFM marker, with the number of times that it occurs.
   - The number of verses that have a number and no words, with the list.
   - The number of footnotes and of cross-reference notes, and five examples of each.
   - How the edition shows words that the translators added, if it does.
   - How the edition gives the title of a Psalm: in a marker of its own, or in verse 1. Give Psalm 3 and Psalm 23 as examples.
   - The number of times that each of these occurs in the plain words: "Yahweh", "Yah", "LORD", "GOD", "Jehovah".
   - These verses, each as it is in the source file and as its plain words: Genesis 1:1, Genesis 2:4, Psalm 23:1, Isaiah 12:2, Matthew 5:3, John 3:16, and the last verse of 3 John.
6. Compare the words of the editions.
   - Edition A against edition B: count the verses whose plain words differ. Put each in one of two classes: "the name of God only", when the verses are the same after the script replaces "Yahweh", "Yah", "LORD", and "GOD" with one sign, and "other". Give the count of each class, and 15 examples of the class "other".
   - Edition A against edition C, and edition B against edition C: count the verses whose plain words differ, and give 15 examples of each comparison. Say which of A and B is nearer to C.
7. Compare the verses of editions A and B with `sources/bsb/bsb.txt`. In that file, a verse with no words is a verse that the main text of the Berean Standard Bible does not have. Give these lists for each edition:
   - The verses of the edition that have no line in `sources/bsb/bsb.txt`.
   - The 16 verses that have no words in `sources/bsb/bsb.txt`. For each, say if the edition has words for it.
   - The verses of `sources/bsb/bsb.txt` that the edition does not have, or has with no words.
   - Each chapter whose number of verses differs between the edition and `sources/bsb/bsb.txt`.
8. Examine the links in `public/data/links/*.json`, as step 8 of Task 19: count the passages whose first verse or last verse is not in edition A, or has no words in edition A. List each of these passages with the `id` of its link.
9. Examine the fit of the text blocks. The King James Version data of Task 20 puts each verse in the Berean block where the verse starts. Count the verses of edition A that this method cannot place, with the list. Say what the method does with a verse that edition A has and the Berean data does not have.
10. Report the words-of-Jesus marks, `\wj`, of editions A and B.
    - For each book: the number of start markers, of end markers, and of verses with marked words.
    - The class of each verse, as in the report of Task 25: "all", "part", "none".
    - A table of the classes of edition A against the classes of the Berean Standard Bible, and a table against the King James Version. Read the classes of those two from the site data, where a words-of-Jesus mark is an item `j`.
    - Each verse where edition A has "none" and the Berean Standard Bible has marks, and each verse where edition A has marks and the Berean Standard Bible has "none". If a list has more than 100 verses, give the count for each book and the first 100.
    - If the files have no marker `\wj`, say so. Then red letters need a different decision.
11. Compare the section headings and the cross-reference lines of edition C with those of `public/data/text/*.json`, as step 11 of Task 19: the counts, and the headings that differ, to a maximum of 50.
12. List each place in `src/`, `scripts/`, and `e2e/` that is written for two translations and must change for a third. Examples: the type `Translation`, the list `TRANSLATIONS`, the label "The quoted words are from the Berean Standard Bible.", and the tests that go through the two translations. Give the file and the line of each. Do not change them.
13. Write the report `docs/reviews/task-29-web-report.md`. Give it one section for each of steps 2, 3, and 5 to 12, in that order. Then add a section "Proposals" with these six points. For each point, give the options and the cost of each option. Do not decide for Arthur.
    - Which edition the site uses: edition A with "LORD", or edition B with "Yahweh". Say which books of edition B the site must leave out.
    - What the pages show for a verse that the edition has with no words, and for a chapter whose number of verses differs from the Berean data.
    - Red letters: the marks of the edition, by the rule of section 11.2 of `docs/DESIGN.md`, and what the site does if the edition has no marks.
    - The name and the short name of the translation on the site, and what the trademark terms of step 2 permit.
    - The words of the credit on the Sources page.
    - The work for a third translation in the code, from step 12, and the rule of `CLAUDE.md` that the site has two translations.
14. Run `npm run lint`, `npm run build`, and `npm test`.

Done when:

- `docs/reviews/task-29-web-report.md` has the numbers and the lists of steps 5 to 12, and the six proposals.
- `docs/DATA-SOURCES.md` has the licence record of editions A and B and the record of the downloads.
- No file in `public/` or in `src/` changed, and no file of the World English Bible text is in the repository.
- `npm run build` has no errors, and the tests pass.

Stop and report. Give the path of the temporary folder in the report. Do not start a task that adds the World English Bible. Arthur decides the next tasks from the report.

---

# The World English Bible: Tasks 30 and 31

Arthur decided the build on 2026-11-16, from the report of Task 29. The design is in section 13 of `docs/DESIGN.md`. Task 30 makes the text data. Task 31 changes the pages. The site gets a third translation only with Task 31.

---

## Task 30. World English Bible: the text data

Status: DONE

Accuracy review: yes

Goal: the words of the World English Bible are in the repository, as one JSON file for each book, in the structure of the Berean data, with the words-of-Jesus marks of the source. No page shows them in this task. Task 31 changes the pages.

Arthur's decisions of 2026-11-16, from section 13 of `docs/DESIGN.md`:

- The source is edition A of the report of Task 29: the edition `engwebp` of eBible.org, with "LORD" and "GOD" for the name of God.
- The site keeps the verse numbers of the source, and changes no word.
- The structure comes from the Berean data in `public/data/text/`, as for the King James Version.
- The words-of-Jesus marks are those of the source.

WARNING: Do not change a word of the World English Bible. Do not correct a spelling, a capital letter, or a punctuation mark. Do not join a word and do not split a word. This translation has no list of exceptions: the pages of eBible.org ask that a text with a changed word does not have the name "World English Bible". If the build finds a fault in the source, stop and ask Arthur.

WARNING: Do not add or remove a words-of-Jesus mark. This translation has no mark exception.

WARNING: Do not change an existing data file: `public/data/text/`, `public/data/text-kjv/`, `public/data/links/`, and the other files in `public/data/`. If you change `scripts/build-text-kjv.mjs` to share code, its output must be the same, byte for byte.

WARNING: Do not change a page in this task. In `src/`, add or change test files only. Do not add the third translation to `src/data/translation.ts`. Task 31 does that.

WARNING: Do not take a word, a heading, or a paragraph from `resources/web.docx`. That file is evidence only. Do not download a file from OpenBible.com.

Steps:

1. Read section 13 of `docs/DESIGN.md`, section 11 of `docs/DATA-SOURCES.md`, and `docs/reviews/task-29-web-report.md`. Read `scripts/build-text-kjv.mjs`: this task uses its method, with the new rules of step 5.
2. Get the source file `engwebp_usfm.zip`. Use the copy of Task 29 if you still have it. If not, download `https://eBible.org/Scriptures/engwebp_usfm.zip` from this address directly. The SHA-256 of Task 29 is `3bb1ac4fe06e9adf50fe6659237fa0b3743bf651ce15cc9acebc36c5070ae62d`.
   - If the SHA-256 is the same, continue.
   - If the SHA-256 differs, run `node scripts/web-report.mjs` on the new files. Compare each count of steps 5, 7, 9, and 10 of the report for edition A. If each count is the same, continue, and record the two SHA-256 values and the dates in `docs/DATA-SOURCES.md` and in your report. If a count differs, stop and ask Arthur.
3. Put the 66 USFM files of the 66 books in `sources/web/usfm/`. Put the copyright page of the zip file, `copr.htm`, in `sources/web/`. Do not put a different file of the zip file in the repository. The preface and the glossary stay out.
4. Write the script `scripts/build-text-web.mjs`. It reads `sources/web/usfm/` and `public/data/text/<id>.json`. It writes `public/data/text-web/<id>.json`, one file for each book. A file has the form of a file in `public/data/text-kjv/`, with `"translation": "World English Bible"`. The script stops with an error when a rule does not fit the data. It does not guess. You can put the functions that the two scripts share in one module.
5. The rules of the script.
   - The words of a verse, from the USFM lines of the verse:
     - `\w <word>|strong="…"\w*` and `\+w <word>|strong="…"\+w*`: keep the word. Remove the markers and the Strong's number. If a `\w` has a different attribute form, stop and report.
     - `\f … \f*`: remove the footnote. `\x … \x*`: remove the cross-reference note.
     - `\wj … \wj*`: these are the words-of-Jesus marks. Write them in Form A of section 11 of `docs/DESIGN.md`, as `scripts/build-text-kjv.mjs` does: a run of marked words is an item `{ "j": "words" }`.
     - `\qs … \qs*` and `\bk … \bk*`: keep the words. Remove the markers. Example: the word "Selah".
     - The markers `\fr`, `\ft`, `\fq`, `\fqa`, `\xo`, `\xt`, and `\+wh` are inside a footnote or a cross-reference note, and go with it. If one of them is outside, stop with an error.
     - The source has no marker for added words. The data has no item `a`.
     - Write the spaces as `scripts/build-text-kjv.mjs` writes them: one space between two words, and one space between the words of two verses in one block. A string has no two spaces together.
   - Do not use these markers of the source: `\p`, `\m`, `\mi`, `\pi1`, `\nb`, `\q1`, `\q2`, `\li1`, and `\b`. Words on the same line are words of their verse. The site takes its structure from the Berean data.
   - Do not use these lines of the source: the lines of the book head (`\id`, `\ide`, `\h`, `\toc1` to `\toc3`, `\mt1` to `\mt3`), `\cl`, the 5 lines `\ms1`, and the 33 lines `\sp`.
   - If the source has a marker that this step does not name, stop with an error.
   - The structure of a chapter comes from the blocks of the same chapter in `public/data/text/<id>.json`, by the rules of `scripts/build-text-kjv.mjs`:
     - A heading block: copy it. Do not copy an `s2` heading of the Song of Solomon.
     - The cross-reference lines (`xrefs`): copy them.
     - A text block: a text block with the same style, with each verse that starts in the Berean block. The words of a verse are never cut. A Berean text block in which no verse starts gives no block.
     - An item `{ "o": n }` of the Berean data: write `{ "v": n }` and the words of verse n at that place. The data has no `o` item.
     - A break block: copy it, with the rules of the King James Version script. A note block: do not copy it.
     - A Berean block with the style `d`, and a `\d` line of the source: the rules of the King James Version script. Zechariah 12 has a Berean `d` block and no `\d` line: make no `d` block, and the next text block holds `{ "v": 1 }` and the words of verse 1.
   - New rule, Psalm 119: the source has 22 `\d` lines in this chapter, the names of the Hebrew letters. Do not use them. If a `\d` line is after a verse in a different chapter, or a chapter has a `\d` line and no Berean `d` block, stop with an error.
   - New rule, a verse number with no words: five verses have a number and no words after the footnote is removed: Luke 17:36, Acts 8:37, Acts 15:34, Acts 24:7, and Romans 16:25. Write no item for them: no `{ "v": n }` and no words. Make this a list in the script. If one of the five has words, or a different verse has no words, stop with an error.
   - New rule, Romans 14:24 to 14:26: no Berean block starts these verses. Put them in one new text block with the style `p`, after the last text block of Romans 14. Make this a list in the script. If a different verse of the source has no place in the Berean structure, stop with an error.
   - New rule, Romans 16:26 and 16:27: a Berean block starts these verses, and the source does not have them. Write nothing for them. Make this a list in the script. If the source does not have a different verse that a Berean block starts, stop with an error.
   - New rule, a heading with no verse after it: when a chapter has a heading block after its last text block, do not copy that heading block, and do not copy the cross-reference line of that heading. Expected: one heading, "Doxology" in Romans 16, with the line "(Jude 1:24–25)" of verse 25. If the script finds a different one, stop with an error.
   - The words-of-Jesus marks:
     - Find the words of each mark in the words of its verse exactly. If the words are not there exactly, use the search of Task 26 that ignores the spaces. If the script does not find a mark, or finds it at more than one place and the order of the marks in the verse does not decide, stop with an error that names the book, the chapter, and the verse.
     - A mark that goes on over a verse number gives one item `j` for each verse. An item `{ "v": n }` is never inside an item `j`. Count these marks and give the number in the report.
     - A mark in one of the five verses with no words, or a mark with no words: stop with an error.
6. Run the script. It must print these numbers. Give them in the report, each beside the number of the report of Task 29 for edition A:
   - Books, chapters, and verses in the data. Expected: 66, 1,189, and 31,098. The source has 31,103 verse numbers, and 5 have no words.
   - Footnotes removed. Task 29: 1,231. Cross-reference notes removed. Task 29: 340.
   - `d` blocks made, and `\d` lines not used. Expected: 116 and 22. Task 29: 138 `\d` lines.
   - Heading blocks for each style, and cross-reference lines. Expected: 3,015 `s1`, 43 `s2`, 5 `ms`, 5 `d`, 44 `qa`, and 1,324 cross-reference lines. That is the Berean data less the 37 `s2` headings of the Song of Solomon, less the heading "Doxology" of Romans 16 and its line.
   - Start markers `\wj` read, verses with marked words, and items `j` written. Task 29: 2,290 start markers in 2,059 verses.
   - Text blocks for each style, and the Berean text blocks that have no block in this data.
   - The marker of the source line before Romans 14:24, for example `\p`.
   If a number differs from the expected number or from Task 29, do not change the script to make the numbers agree. Find the cause and give it in the report.
7. Write the unit test `src/data/textWeb.test.ts`, with the form of `src/data/textKjv.test.ts`. It reads `public/data/text-web/` and `sources/web/usfm/`. It gets the words of each verse from the source with code of its own, not with code of the build script. It checks:
   - 66 books and 1,189 chapters, in the order of `public/data/books.json`, and 31,098 verses.
   - The words of each verse are the same as in the source. For verse 1 of a chapter with a `d` block, the words are the title and then the words of the verse.
   - The data has no item for Luke 17:36, Acts 8:37, Acts 15:34, Acts 24:7, and Romans 16:25. Romans 14 has verses 1 to 26, and verses 24 to 26 are in the last text block. The last verse of Romans 16 is 24.
   - These verses have these words. They are from the report of Task 29:
     - Genesis 1:1: "In the beginning, God created the heavens and the earth."
     - Psalm 3:1, after the title: "LORD, how my adversaries have increased! Many are those who rise up against me."
     - Psalm 23:1, after the title: "The LORD is my shepherd; I shall lack nothing."
     - Matthew 17:21: "But this kind doesn’t go out except by prayer and fasting.”"
     - Romans 16:24: "The grace of our Lord Jesus Christ be with you all! Amen."
   - Psalm 23 has a `d` block with the words "A Psalm by David." Psalm 119 has no `d` block. Zechariah 12 has no `d` block, and its first text block starts with `{ "v": 1 }`.
   - The whole word "Yahweh" does not occur. The whole word "LORD" occurs 6,570 times in the words of the verses, with the Psalm titles not counted. This is the number of the report of Task 29. If your count differs, find the cause and give it in the report.
   - No string has "\", "|", or two spaces together.
   - Each text block has one verse or more. Each text block starts with an item `{ "v": n }`, except the text block after a `d` block.
   - The heading blocks of each chapter are those of the Berean chapter, without the `s2` headings of the Song of Solomon and without the heading "Doxology" of Romans 16. The cross-reference lines of each chapter are those of the Berean chapter, without the line of Romans 16:25.
   - No file has an `a` item, an `o` item, or a note block.
8. Add the World English Bible to the tests of the words-of-Jesus marks in `src/data/marks.test.ts`, with the checks that the two other translations have:
   - The marked words of each verse in the data are the marked words of that verse in the source.
   - The classes of the report: 1,405 verses "all" and 654 verses "part". If your numbers differ, stop and report. Do not change the expected numbers to make the test pass.
   - No book has a words-of-Jesus mark, apart from these 9 books: Matthew, Mark, Luke, John, Acts, 1 Corinthians, 2 Corinthians, 1 Timothy, Revelation.
   - Matthew 5:3, John 3:16, and Revelation 1:8 have marked words. Hebrews 10:5 has none.
   - No item `j` has an item `v` inside it, and no item `j` is empty.
9. Add one unit test for the links, in a test file of `src/data/`. For each of the three data folders, it finds the links of `public/data/links/` with a passage that starts at a verse that the data does not have. An item `{ "v": n }` or `{ "o": n }` means that the data has verse n. Expected: none for `text` and `text-kjv`, and these three for `text-web`: `h1733`, `o3385`, `o3515`. Task 31 uses this list. If your result differs, stop and report.
10. Change section 11 of `docs/DATA-SOURCES.md`: the use of edition A in Task 30, the folder `sources/web/usfm/`, the script, the output folder, what the site takes and does not take from the source files, the five verse numbers with no words, and the rules for Romans 14 and Romans 16. Change the line "No file of the World English Bible text is in the repository" to the true state. Editions B and C stay "Not used on the site".
11. Run the `accuracy-reviewer` agent. Its Check 1 applies to `public/data/text-web/`, with `sources/web/usfm/` as the source file: 66 books, 1,189 chapters, 31,098 verses, and the words of each verse identical to the source.
12. Run `npm run lint`, `npm run build`, `npm test`, and `npm run test:e2e`. The rule of step 19 of Task 22 for the test "the accessibility check finds a planted problem" applies.

Done when:

- `public/data/text-web/` has 66 files, and the tests of steps 7, 8, and 9 pass.
- The numbers of step 6 are in the report, each beside its expected number.
- No file in `public/data/text/`, `public/data/text-kjv/`, or `public/data/links/` changed, and no page changed.
- `npm run build` has no errors, and all tests pass.

Stop and report. Give the size of `public/data/text-web/`. Do not start Task 31.

---

## Task 31. World English Bible: the pages

Status: DONE

Accuracy review: yes

Goal: the reader can select the World English Bible in the translation list and read it on each page that shows Bible text. The first visit shows the Berean Standard Bible, as now.

The design is in section 13 of `docs/DESIGN.md`. The renders are in `docs/screenshots/web-design/`: the translation list with three rows at 1440 by 900 px and at 390 by 844 px, and the top bar with "WEB" at 390 px and at 375 px. The renders are a sketch on the built site of Task 28. Use their look. Do not copy code from them.

The data of Task 30 is ready: `public/data/text-web/<id>.json` has the form of `public/data/text-kjv/<id>.json`. It has items `j`. It has no `a` item, no `o` item, and no note block. If Task 30 is not `DONE`, stop. Three verses of the data have a no-break space, U+00A0, as the source has: John 5:11, Acts 20:35, and Acts 22:21. Do not change it on the page.

WARNING: Do not change a data file in `public/data/`, a source file in `sources/`, or a build script.

WARNING: The pages of the Berean Standard Bible and of the King James Version must look and work as before this task. The one difference is the third row of the translation list.

WARNING: Write no new content about the Bible. The only new words of this task are the name "World English Bible", the short name "WEB", and the text of step 8.

WARNING: Do not add or remove a link in `public/data/links/`. Step 6 changes which links a page shows. It does not change the link data.

Steps:

1. Read section 13 of `docs/DESIGN.md`, and step 12 of `docs/reviews/task-29-web-report.md`. Step 12 lists the places in the code and in the tests that are written for two translations. Look at the four renders.
2. `src/data/translation.ts`:
   - The type `Translation` gets the value `web`.
   - The list `TRANSLATIONS` gets a third row: the id `web`, the name "World English Bible", the short name "WEB".
   - `readTranslation` gives the stored value when it is the id of a row of `TRANSLATIONS`, and `bsb` for each other value.
3. `src/data/text.ts`: the folder of `web` is `text-web`.
4. The translation control and the translation list, in `src/reading/ReadingPage.tsx`. The report expects that the list gets its third row from `TRANSLATIONS`, with no change in this file. Make sure of this on the page:
   - The list has three rows in this order: "Berean Standard Bible", "King James Version", "World English Bible". The look is that of the renders.
   - With the World English Bible selected, the translation control shows "WEB", and its name for a screen reader is "Translation: World English Bible, WEB".
   - The wall has no translation control and no translation name, as now.
5. The pop-up, `src/book/LinkPopup.tsx`: the label "The quoted words are from the Berean Standard Bible." shows in the pop-up of a quotation link for each translation that is not the Berean Standard Bible. Do not change a reason line.
6. The links that a page does not show. The rule of section 13.4 of `docs/DESIGN.md`: on the pages of a translation, a link does not show when one of its two passages starts at a verse that the data of that translation does not have.
   - Make a list of link ids for each translation in the code: none for `bsb`, none for `kjv`, and `h1733`, `o3385`, `o3515` for `web`. Change the unit test of step 9 of Task 30 so that it compares its result with this list. Then the list is a result of the rule, and no person selects a link.
   - Where the page makes the marks of a chapter from the links, leave out the two ends of each link in the list of the selected translation. `marksOf` in `src/data/links.ts` is such a place. Find each other place with a search: the marks, the margin labels, the cross-reference lines under a heading, and the pop-up.
   - Result on the World English Bible pages: Matthew 13:35 and 1 Timothy 3:16 have no control for Romans 16:25. In Jude, the cross-reference line "(Romans 16:25–27)" under the heading "Doxology" shows as words, with no control. The designer ran the built site of Task 28 with the link `h1733` left out of the link data of Jude: the line showed as words, with no control and no page error.
   - The read-with lists, the timeline, and the quotation diagram do not change.
7. The places with no verse. Make sure of this behavior with the tests of step 11, and change the code only if a test fails:
   - A page address with a verse that the selected translation does not have opens its chapter at the top, with no error. Examples: `#/book/romans/16/25` and `#/book/luke/17/36` with the World English Bible. The designer ran this on the built site of Task 28, with `#/book/romans/14/25` and the Berean Standard Bible.
   - When the reader changes the translation and the new text does not have the verse at the top of the page, the page keeps the verse before it. The designer read this in the code and did not run it.
8. The Sources page, `src/SourcesPage.tsx`, section "The Bible text". Make these changes and no other change:
   - Change the first sentence to: "The site has three translations: the Berean Standard Bible (BSB), the King James Version (KJV), and the World English Bible (WEB)." Keep the link on the words "Berean Standard Bible". Keep the other sentences of that paragraph.
   - After the paragraph about the 13 verses of the King James Version, add this paragraph: "The World English Bible on this site is the edition that does not have the books of the Apocrypha, from the files of eBible.org. eBible.org names it the 2020 stable text edition, and gives it the abbreviation "WEBP". The World English Bible is in the public domain. "World English Bible" is a trademark of eBible.org." Link the first "eBible.org" to `https://ebible.org/details.php?id=engwebp`. Make sure that each fact of this paragraph is in `sources/web/copr.htm` or in section 11 of `docs/DATA-SOURCES.md`. If a fact is not there, stop and ask Arthur.
   - Then add this paragraph: "The site shows the words of these files without change. It does not show the Strong's numbers, the footnotes, and the cross-reference notes of these files."
   - Then add this paragraph: "The verse numbers of the World English Bible are those of the files. Romans 14 has 26 verses, and Romans 16 ends at verse 24. In the two other translations of this site, the words of the last three verses of Romans 14 are Romans 16:25 to 16:27. Five verse numbers have no words in the files, and the site does not show them: Luke 17:36, Acts 8:37, Acts 15:34, Acts 24:7, and Romans 16:25." Make sure of the third sentence with the footnote of Romans 16:25 in `sources/web/usfm/` and with the words of these verses in the three data folders. If you are not sure, stop and ask Arthur.
   - Change the paragraph about the structure to: "On the King James Version pages and the World English Bible pages, the section headings, the cross-reference lines, the paragraphs, and the lines of poetry are those of the Berean Standard Bible files. They are not part of these translations." Put it after the new paragraphs.
   - In the paragraph about the words of Jesus, change "The two translations do not mark" to "The three translations do not mark". Keep the other sentences.
9. Change each comment in `src/` that says "the two translations" to the true state.
10. Change the unit tests that step 12 of the report lists, so that they test three translations: `src/data/translation.test.ts` and `src/data/marks.test.ts`. Add: the stored value `web` gives `web`, a stored value that is not an id gives `bsb`, and `loadBookText` reads `data/text-web/<id>.json` for `web`.
11. Change and add browser tests in `e2e/`, at 1440 by 900 px and at 390 by 844 px. Step 12 of the report lists the places of the tests that are written for two translations. New checks:
    - Open John 3. Open the translation list. It has three rows. Select "World English Bible". The list closes, the translation control shows "WEB", and John 3:16 has the words "only born Son". The verse that was at the top is at the same place, with a tolerance of 2 px.
    - Load the page again. The World English Bible is still selected, and the third row has the check mark.
    - The keyboard test of the translation list goes through the three rows.
    - Genesis 1:1 has the words "In the beginning, God created the heavens and the earth." The section heading "The Creation" and its cross-reference line are on the page.
    - Psalm 23: the title "A Psalm by David." is on the page, and verse 1 has the words "The LORD is my shepherd; I shall lack nothing." The chapter has no element of added words.
    - Psalm 119: the words "ALEPH" are on the page one time.
    - Matthew 17: verse 21 shows as text, and the page has no note for it.
    - Luke 17: the page has the verse numbers 35 and 37, and no verse number 36. The page has no note.
    - Romans 14: the verse numbers 24, 25, and 26 are on the page, after verse 23, in one paragraph. The chapter has no heading "Doxology".
    - Romans 16: the last verse number is 24. The chapter has no heading "Doxology" and no line "(Jude 1:24–25)". With the Berean Standard Bible, the chapter has the two.
    - Jude: under the heading "Doxology", the line "(Romans 16:25–27)" has no control. With the Berean Standard Bible, it has a control.
    - Matthew 13 with the echo links on: verse 35 has no control for Romans 16:25. With the Berean Standard Bible, it has one.
    - The address `#/book/romans/16/25` and the address `#/book/luke/17/36` open their chapters with no page error.
    - On Romans 14, scroll until verse 25 is the first verse below the top bar. Select "Berean Standard Bible". No page error occurs, and the top bar shows "Romans 14".
    - Open the pop-up of a quotation link. The passage has the words of the World English Bible, and the label of step 5 is below the reason line.
    - Red letters: in John 3, the words of verse 16 have the color `#8B1A1A`. With red letters off, they have the ink color. Add `web` to the list of translations in `e2e/redletters.spec.ts`, and add its four keys to `e2e/redletters-breaks.json`, measured on the build of this task.
    - The top bar is one line at 390 px and at 375 px with "WEB", for "2 Thessalonians 3" and for "Song of Solomon 8". "Books", the chapter number, the translation control, and "Menu" are not cut. At 375 px, the name "Song of Solomon" can end with "…".
    - The Sources page has the new words of step 8.
    - The axe-core checks that `e2e/a11y.spec.ts` has with the King James Version stored run with the World English Bible stored also.
    - The wall has no text with the name of a translation.
12. Make sure that the browser tests that were there before this task pass. Where a test must change because the site has three translations, give the test and the reason in the report.
13. Take screenshots with the World English Bible selected, at 1440 by 900 px and at 390 by 844 px: the reading page with the translation list open, Genesis 1, Psalm 23, John 3, the end of Romans 14, the end of Romans 16, the pop-up of a quotation link, and the Sources page. Save them in `docs/screenshots/task-31/`. Compare the translation list with the renders, and give each difference in the report. Commit the folder `docs/screenshots/web-design/` with this task. It has the four renders of the designer, and Task 30 did not commit it.
14. Run the `accuracy-reviewer` agent. The Bible text on the pages comes from the data of Task 30 with no change. The new words are those of steps 2 and 8.
15. Run `npm run lint`, `npm run build`, `npm test`, and `npm run test:e2e`. The rule of step 19 of Task 22 for the test "the accessibility check finds a planted problem" applies.

Done when:

- The reader can select the World English Bible in the translation list, and the selection stays after a reload.
- The reading page and the pop-up show the words of the World English Bible, with its red letters.
- The 3 links of step 6 do not show on the World English Bible pages, and show on the pages of the two other translations.
- The pages of the two other translations are as before.
- The Sources page has the words of step 8.
- `npm run build` has no errors, and all tests pass.

Stop and report. Give the list of the changed tests. A check on a real phone is still open. Only Arthur can do it.

---

## Task 31b. The Sources page: the lines of the source files that the site does not show

Status: DONE

Accuracy review: yes

Goal: the Sources page names each kind of line that the site does not show from the files of the King James Version and of the World English Bible.

The accuracy reviewer of Task 31 found the gap. The sentence about the World English Bible names the Strong's numbers, the footnotes, and the cross-reference notes. The site also leaves out some lines of the files. The sentence about the King James Version has the same gap, from Task 21. Arthur decided on 2026-11-16 to correct the two sentences. The rule is in sections 8.6 and 13.7 of `docs/DESIGN.md`.

WARNING: Change only the two paragraphs of step 2 in `src/SourcesPage.tsx`, and the tests that have their words. Do not change a different page, a data file, a source file, or a build script.

WARNING: Each number and each example of step 2 must agree with the source files. Step 1 gives the checks. If one does not agree, stop and ask Arthur. Do not change the words to make them agree.

Steps:

1. Make sure of these facts in the source files:
   - `sources/kjv/usfm/`: each file has a title line `\mt1`. The title line of Genesis is "The First Book of Moses, called Genesis". The files have 36 lines `\s1`: 22 in the Psalms, which are the names of the Hebrew letters in Psalm 119, and 14 in 14 files, from Romans to Hebrews, each at the end of its letter. The line of Ephesians is "Written from Rome unto the Ephesians by Tychicus." The files have the sign "¶".
   - `sources/web/usfm/`: each file has title lines `\mt1`, `\mt2`, or `\mt3`. The title lines of Romans are "Paul’s Letter to the" and "Romans". The files have 33 lines `\sp` in the Song of Solomon, the 5 lines `\ms1` "BOOK 1" to "BOOK 5" in the Psalms, and 22 lines `\d` in Psalm 119 with the names of the Hebrew letters.
   - No page of the site shows one of these lines. The build scripts do not use them.
2. In `src/SourcesPage.tsx`, section "The Bible text":
   - Change the paragraph about the King James Version that starts with "The site does not show the Strong's numbers and the footnotes of these files." to: "The site does not show the Strong's numbers, the footnotes, and the paragraph signs of these files. It also does not show these lines of the files: the title lines of the books, for example "The First Book of Moses, called Genesis", the names of the Hebrew letters in Psalm 119, and the line at the end of 14 letters, for example "Written from Rome unto the Ephesians by Tychicus". The words that the translators added show in italics. In 13 verses, the files write one word as two words, for example "can not", and the site joins the word."
   - Change the paragraph about the World English Bible that starts with "The site shows the words of these files without change." to: "The site shows the words of these files without change. It does not show the Strong's numbers, the footnotes, and the cross-reference notes of these files. It also does not show these lines of the files: the title lines of the books, for example "Paul’s Letter to the Romans", the names of the speakers in the Song of Solomon, the lines "BOOK 1" to "BOOK 5" in the Psalms, and the names of the Hebrew letters in Psalm 119."
   - The lines of the file head with the name of the book, and the line `\cl` of the World English Bible, are not in the two lists. They name the book and the chapter, and the site names these from its own list of books. Do not add them.
3. Change the browser tests that have the old words of the two paragraphs. `e2e/translation.spec.ts` has them. Find each other place with a search.
4. Take screenshots of the Sources page at 1440 by 900 px and at 390 by 844 px. Save them in `docs/screenshots/task-31b/`.
5. Run the `accuracy-reviewer` agent on the two paragraphs, with the facts of step 1.
6. Run `npm run lint`, `npm run build`, `npm test`, and `npm run test:e2e`. The rule of step 19 of Task 22 for the test "the accessibility check finds a planted problem" applies.

Done when:

- The Sources page has the words of step 2, and no other change.
- Each fact of step 1 agrees with the source files.
- `npm run build` has no errors, and all tests pass.

Stop and report.

---

## Task 32. The band: round corners of 3 px

Status: DONE

Goal: the band has round corners of 3 px in each of its four places. Nothing else changes.

Arthur decided this on 2026-11-16, from the sheet `docs/screenshots/band-design/band-corners.png`. The sheet shows the band with corners of 0, 2, 3, 4, and 6 px. It is a sketch on the built site of Task 31b. The rule is in section 7.4 of `docs/DESIGN.md`.

The four places of the band, in `src/index.css`:

- `.wall-band`: the wall.
- `.rd-band`: the heading of a book on the reading page.
- `.pop-band`: the pop-up.
- `.q-band`: the Quotations page.

WARNING: Change only the corners of the band. Do not change its size, its spaces, its color, or its words. Do not change a different shape of the site.

Steps:

1. Read the line about the corners of the band in section 7.4 of `docs/DESIGN.md`. Look at the sheet.
2. In `src/index.css`, give each of the four rules `border-radius: 3px`. Use one value in one place if the style file has a place for such values.
3. Make sure that the band has no different size and no different place: measure its box in the four places before and after the change, at 1440 by 900 px and at 390 by 844 px. The boxes must be the same.
4. Add one browser test: in each of the four places, the band has corners of 3 px, at 1440 by 900 px and at 390 by 844 px.
5. Take screenshots at 1440 by 900 px and at 390 by 844 px: the wall, Genesis 1, a pop-up, and the Quotations page. Save them in `docs/screenshots/task-32/`.
6. Commit the folder `docs/screenshots/band-design/` with this task. It has the sheet of the designer.
7. Run `npm run lint`, `npm run build`, `npm test`, and `npm run test:e2e`. The rule of step 19 of Task 22 for the test "the accessibility check finds a planted problem" applies.

Done when:

- The band has corners of 3 px in the four places, and its box is the same as before.
- `npm run build` has no errors, and all tests pass.

Stop and report.

---

## Task 33. About the translations: a line in the translation list, and a section on the Sources page

Status: DONE

Accuracy review: yes

Goal: a lay reader can see the difference between the three translations. Each row of the translation list has one short line. The Sources page starts with a section that shows the same verse in the three translations.

Arthur decided this on 2026-11-17, from renders. The design is in section 14 of `docs/DESIGN.md`. The renders are in `docs/screenshots/translations-design/`: `list-1440.png`, `list-390.png`, `section-1440.png`, and `section-390.png`. The renders are a sketch on the built site of Task 32. Use their look. Do not copy code from them.

WARNING: Do not change a word of the three lines of step 3, or of the section of step 5. If a source of step 1 does not support a line, stop and ask Arthur. Do not change the words to make them agree.

WARNING: Do not change a word of 1 Corinthians 13:4. The words are those of the site data.

WARNING: Do not change a data file, a source file, or a build script. Do not change the paragraphs of the section "The Bible text" of the Sources page.

WARNING: Write no new content about the Bible. The only new words are those of steps 3, 4, and 5.

Steps:

1. Read section 14 of `docs/DESIGN.md`. Look at the four renders. Then make sure of the sources of section 14.2:
   - Open `https://berean.bible/`. Make sure that the page says that the Berean Standard Bible is a completely new English translation.
   - Read `sources/kjv/copr.htm`. Make sure that it says "the standardized text of 1769".
   - Make sure that the words "thee", "thou", and "believeth" are in `public/data/text-kjv/`.
   - Open `https://ebible.org/engwebp/FRT01.htm`, the preface of the edition of the site. Make sure that it says that the World English Bible is an update of the American Standard Version, published in 1901, and that its style is in informal, spoken English.
   - If you cannot open a page, stop and report. Do not use a different page.
2. Record the two pages in `docs/DATA-SOURCES.md`, each in the section of its translation: the address, the date, the words of the page that support the line, and the use "The line of the translation in the translation list and on the Sources page".
3. In `src/data/translation.ts`, give each row of `TRANSLATIONS` its line. This is the one place in the code that has the lines:
   - Berean Standard Bible: "Today’s English. A new translation."
   - King James Version: "Older English, in the text of 1769: thee, thou, believeth."
   - World English Bible: "Today’s spoken English. An update of the American Standard Version of 1901."
   The apostrophe in "Today’s" is the character U+2019.
4. The translation list, in `src/reading/ReadingPage.tsx` and `src/index.css`:
   - Each row shows its line below the name, in the secondary ink color, at 13 px. The name, the short name, and the check mark stay at the top of the row.
   - A row is as high as its content, and 44 px or more. In the narrow layout, 48 px or more.
   - Below the three rows, after a thin line, add the row "About the translations" with the sign "›" at the right. It is a link to the Sources page, `sourcesHref()`. It is 44 px high or more. The list closes when the reader selects it.
   - For a screen reader, the name of a row has the name of the translation and its line. The sign "›" is hidden from a screen reader.
   - The keyboard goes through the three rows and then the link. The rules of section 9.7 of `docs/DESIGN.md` do not change.
   - The text list uses the style class of these rows. Make sure that the rows of the text list and of the "Menu" panel do not change: measure them before and after.
5. The Sources page, `src/SourcesPage.tsx`: add the section "The three translations" as the first section, before "The Bible text".
   - The heading: "The three translations".
   - The paragraph: "The site has three translations of the Bible into English. The translation list in the top bar of a chapter selects one. Here is one verse, 1 Corinthians 13:4, in each translation."
   - Then one item for each row of `TRANSLATIONS`, in order: the name, the short name, the line, and the words of 1 Corinthians 13:4 in that translation, in the font of the Bible text.
   - Put the words of the verse in the code as a list of parts for each translation, so that the page needs no data file. The words, from the site data:
     - Berean Standard Bible: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud."
     - King James Version: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up," with the word "and" in italics. It is an added word in the data.
     - World English Bible: "Love is patient and is kind. Love doesn’t envy. Love doesn’t brag, is not proud,"
   - The words of this verse are not words of Jesus in the data. The section has no red letters.
6. Add unit tests:
   - Each row of `TRANSLATIONS` has a line, and the three lines are the words of step 3.
   - For each translation, the parts of the verse in the code are the same as the result of `passageVerses` for 1 Corinthians 13:4 from the data file of that translation: the same words, and the same added word.
7. Add and change browser tests, at 1440 by 900 px and at 390 by 844 px:
   - The translation list has three rows, and each row shows its line.
   - The row "About the translations" opens the Sources page, and the first heading of a section there is "The three translations".
   - The Sources page shows the three names, the three lines, and the three verses. The word "and" of the King James Version verse is in italics.
   - The keyboard test of the translation list goes through the three rows and the link.
   - The selection of a translation still works, the list closes, and the kept verse stays, as before.
   - The axe-core checks pass with the translation list open, and on the Sources page.
   - The rows of the text list and of the "Menu" panel have the same size as before this task.
   - Where a test of the size of the translation list must change, give the test and the reason in the report.
8. Take screenshots at 1440 by 900 px and at 390 by 844 px: the reading page with the translation list open, and the top of the Sources page. Save them in `docs/screenshots/task-33/`. Compare them with the renders, and give each difference in the report.
9. Commit the folder `docs/screenshots/translations-design/` with this task. It has the four renders of the designer.
10. Run the `accuracy-reviewer` agent on the three lines and on the section, with the sources of step 1.
11. Run `npm run lint`, `npm run build`, `npm test`, and `npm run test:e2e`. The rule of step 19 of Task 22 for the test "the accessibility check finds a planted problem" applies.

Done when:

- Each row of the translation list shows its line, and the list has the link "About the translations".
- The Sources page starts with the section "The three translations", with 1 Corinthians 13:4 in the three translations.
- The sources of the three lines are in `docs/DATA-SOURCES.md`.
- `npm run build` has no errors, and all tests pass.

Stop and report. A check on a real phone is still open. Only Arthur can do it.

---

## Task 34. About the translations: new lines for two translations

Status: DONE

Accuracy review: yes

Goal: the line of the Berean Standard Bible and the line of the World English Bible have new words, so that a lay reader sees the difference between these two translations. Nothing else changes.

Arthur decided this on 2026-11-17, after he read the site with Task 33. The reason and the sources are in section 14.2 of `docs/DESIGN.md`.

WARNING: Change only the two lines of step 3, the tests that have their words, and the record in `docs/DATA-SOURCES.md`. Do not change the line of the King James Version, the look of the translation list, the section "The three translations", or the verse.

WARNING: Do not change a word of the two lines of step 3. If a source of step 1 does not support a line, stop and ask Arthur.

Steps:

1. Read section 14.2 of `docs/DESIGN.md`. Then make sure of the sources of the new words:
   - Open `https://berean.bible/print.htm`. Make sure that the own words of the publisher say that the Berean Standard Bible is an English text of high literary quality. If this page does not have the words, look for them on `https://berean.bible/`.
   - Open `https://ebible.org/engwebp/FRT01.htm`. Make sure that it says: "The style of the World English Bible, while fairly literally translated, is in informal, spoken English."
   - If you cannot open a page, stop and report. Do not use a different page.
2. Change the two records "The line of the translation" in `docs/DATA-SOURCES.md`: the new line, the address, the date, and the words of the page that support each part of the line. Keep the words of the pages that Task 33 recorded.
3. In `src/data/translation.ts`, change two lines:
   - Berean Standard Bible: "Today’s English, in a literary style. A new translation."
   - World English Bible: "Today’s English, in an informal, spoken style. A fairly literal translation."
   The line of the King James Version stays: "Older English, in the text of 1769: thee, thou, believeth." The apostrophe in "Today’s" is the character U+2019.
4. Change the unit tests and the browser tests that have the old words of the two lines, or the height of the first row of the translation list. With the new words, each of the three rows is 74 px high at 1440 by 900 px and at 390 by 844 px. The designer measured this on the build of Task 33. Give each changed test in the report.
5. A report only, with no change to the site: open the page "Compare Translations" of the Berean publisher, `https://bereanbibles.com/about-berean-study-bible/compare-translations/`. The page `https://berean.bible/print.htm` has the link. Give in your report, in the words of the page, where the publisher puts the Berean Standard Bible between a word for word translation and a thought for thought translation, and which translations it names beside it. If you cannot open the page, say so. Do not change a line from this page. Arthur decides from the report.
6. Take screenshots at 1440 by 900 px and at 390 by 844 px: the reading page with the translation list open, and the top of the Sources page. Save them in `docs/screenshots/task-34/`.
7. Run the `accuracy-reviewer` agent on the two lines, with the sources of step 1.
8. Run `npm run lint`, `npm run build`, `npm test`, and `npm run test:e2e`. The rule of step 19 of Task 22 for the test "the accessibility check finds a planted problem" applies.

Done when:

- The translation list and the Sources page show the two new lines.
- The sources of the new words are in `docs/DATA-SOURCES.md`.
- The report has the result of step 5.
- `npm run build` has no errors, and all tests pass.

Stop and report.

---

## Task 35. About the translations: the line of the Berean Standard Bible

Status: DONE

Accuracy review: yes

Goal: the line of the Berean Standard Bible says where the translation is between a literal translation and a thought for thought translation. Then the reader can compare it with "fairly literal" in the line of the World English Bible. Nothing else changes.

Arthur decided this on 2026-11-17, from step 5 of your report of Task 34. The reason and the source are in section 14.2 of `docs/DESIGN.md`.

WARNING: Change only the line of step 3, the tests that have its words, and the record in `docs/DATA-SOURCES.md`. Do not change the two other lines, the look of the translation list, the section "The three translations", or the verse.

WARNING: Do not change a word of the line of step 3. If the source of step 1 does not support the line, stop and ask Arthur.

Steps:

1. Open `https://bereanbibles.com/about-berean-study-bible/compare-translations/` again. Make sure that it says: "The Berean Bible lies somewhere near the middle of the range from “Word for Word” (Literal) Translations to “Thought for Thought” (Dynamic) Translations." If you cannot open the page, stop and report.
2. Change the record "The line of the translation" of the Berean Standard Bible in `docs/DATA-SOURCES.md`: the new line, this page with its address and the date, the sentence of step 1, and the place of the BSB on the chart of the page. Keep the record of `https://berean.bible/print.htm` for "in a literary style". The words "A new translation." are not in the line now: say so in the record, and keep the sentence of the page as a record of Task 33.
3. In `src/data/translation.ts`, change the line of the Berean Standard Bible to: "Today’s English, in a literary style. Between literal and thought for thought." The apostrophe in "Today’s" is the character U+2019. The two other lines stay.
4. Change the unit tests and the browser tests that have the old words of this line. With the new words, each of the three rows of the translation list is 74 px high at 1440 by 900 px and at 390 by 844 px, as now. The designer measured this on the build of Task 33. Give each changed test in the report.
5. Take screenshots at 1440 by 900 px and at 390 by 844 px: the reading page with the translation list open, and the top of the Sources page. Save them in `docs/screenshots/task-35/`.
6. Run the `accuracy-reviewer` agent on the line, with the source of step 1.
7. Run `npm run lint`, `npm run build`, `npm test`, and `npm run test:e2e`. The rule of step 19 of Task 22 for the test "the accessibility check finds a planted problem" applies.

Done when:

- The translation list and the Sources page show the new line of the Berean Standard Bible.
- The source of the new words is in `docs/DATA-SOURCES.md`.
- `npm run build` has no errors, and all tests pass.

Stop and report.

---

## Task 36. The map of the places of a book: a report on the data

Status: DONE

Accuracy review: yes

Goal: Arthur and the designer know what the two data sets give for a map of the places of each book, and what the rules of use are. This task changes no page and adds no data file to the site.

Arthur decided the direction and the look of the map on 2026-11-17, from sketches. Read section 15 of `docs/DESIGN.md` first. The sketches are in `docs/screenshots/map-design/`. Arthur decides the build tasks from your report.

WARNING: This task is a report. Do not change a file in `src/`, `public/`, or `e2e/`. Do not put a file of the two data sets in the repository. Keep the downloads in a temporary folder, as in Task 29.

WARNING: Do not select a place, a position, or a route by your own judgment. Report what the data gives.

WARNING: A download can be an acceptance of terms. Read the licence page of each source before you download. If a page asks for more than a credit, stop and ask Arthur.

Steps:

1. The sources. For each one, read the licence statement, and record it in a new section of `docs/DATA-SOURCES.md`, with the address, the date, the commit of the repository, the SHA-256 and the size of each file that you read, and the use "Read for Task 36. Not used on the site."
   - Places: `https://github.com/openbibleinfo/Bible-Geocoding-Data`. The designer used commit `7eb18a5` and the files `data/ancient.jsonl` (SHA-256 `b8187aa4737e8517ccc090f765d2be11da4c548cd2a59d3cdcb62e952cb8c0f2`) and `data/modern.jsonl` (SHA-256 `da731f6e110bac4ea66a9f037a0a31cfb11c4f1efc1206aa9e109092b2c60087`). Use the same commit if you can.
   - Coast, rivers, and lakes: Natural Earth, `https://github.com/nvkelso/natural-earth-vector`, commit `ca96624`, the 1:10 million files of the land, the minor islands, the lakes, and the rivers and lake centerlines.
   - Report which parts of the places data have the OpenStreetMap licence, and if a map of the site needs these parts. The sketches use only the names, the verses, the scores, and one position for each place.
   - Report the credit words that each source asks for.
2. Write the script `scripts/map-report.mjs`. It reads the downloads from a folder that you give it, and it prints each number of this report. Write the report as `docs/reviews/task-36-map-report.md`.
3. The places data. Read its documentation, and report in plain words:
   - What an ancient place is, what a modern location is, and what the score of a link between them means. What limit of the score does the documentation give for "sure" and "not certain", if it gives one? The sketches use 500, which the designer selected.
   - The number of ancient places, the number with verses, and the number for each type.
   - How a region, a river, and a sea have their position: one point, a line, or an area.
4. The verses. The data names its verses in a form such as `Exod.1.11`.
   - Report which verse numbers the data uses, and if they agree with the verse numbers of the three translations of the site. Give each book where they differ.
   - Report the names: the data has a name for each place, and the count of each name in ten translations. For the places of Exodus and of Acts, give the name in the data and the name in the same verse in each of the three translations of the site, where they differ. Example to check: Rameses.
5. A table of the 66 books, with these columns: the places that the book names, the places with a position, the places with a score below 500, and the box of longitude and latitude that holds the places with a position. Mark the books with no place.
   - The numbers of the designer, to compare: Exodus 33, 31, and 15. Acts 107, 107, and 4. Joshua 432 places. No place: Philemon, James, 1 John, 2 John, and 3 John. If your numbers differ, find the cause and give it. Do not change your script to make the numbers agree.
6. A proposal for a set of regions. The plan of section 15.6 is a small set of regions, about ten or less, and each book opens one.
   - Propose the set from the boxes of step 5, with the box of each region and the books of each region.
   - For each book, give the number of its places that are outside its region, and their names.
   - Say which books do not fit a region well, and why.
7. The places that are not for a map of a region: give the types of place that are in a city or in a building, the number of each, and examples. The sketches leave out these types: room, gate, structure, field, hill, and those like them.
8. The places at the same position. Example: the point of Judea is the point of Jerusalem. Give the number of places that have the same position as a different place, and the ten positions with the most places.
9. Natural Earth, for the boxes of your regions:
   - The size of the land, the lakes, and the rivers after a cut to each box, as SVG path data or as JSON, with and without a simplification that the eye does not see at 960 px wide. Arthur needs the number of bytes that a map adds to the site.
   - The features of today that the ancient world did not have: canals and reservoirs. List those in the boxes. The sketches leave them out.
   - The places where the coast or a lake of today differs clearly from a printed Bible map. Example: the Dead Sea is in two parts. Report only what a source states. Do not write a fact from memory.
10. Proposals for Arthur, each with its reason and its cost: the limit for "not certain", the set of regions, the types of place that the map leaves out, the name on the map when the translations differ, and what a book with no place shows.
11. Run the `accuracy-reviewer` agent on the report: each number against the script, and each statement about a licence against its page.
12. Run `npm run lint`, `npm run build`, `npm test`, and `npm run test:e2e`, to make sure that the site did not change.

Done when:

- `docs/reviews/task-36-map-report.md` has the result of steps 1 and 3 to 10.
- `docs/DATA-SOURCES.md` has the record of step 1.
- No file in `src/`, `public/`, or `e2e/` changed.

Stop and report. Commit the folder `docs/screenshots/map-design/` with this task. It has the six sketches of the designer.

## Task 37. The map data

Status: DONE

Accuracy review: yes

Goal: the site has the data for a map of the places of each book, and the Sources page gives the credit for it. This task builds no map. A reader sees one change: a new section on the Sources page.

Read section 15 of `docs/DESIGN.md` first. Section 15.9 has the rules of this task. Section 15.10 is a proposal that Arthur did not decide.

WARNING: Do not build the map page, the line "Where", or a map component. Do not change a file in `src/` but the Sources page and the new test of step 7.

WARNING: Do not select or correct a place, a position, a name, or a kind by your own judgment. The rules of section 15.9 make each one. If a rule gives a result that looks wrong, report it and keep it.

WARNING: Do not put a download in the repository. Keep the downloads in a temporary folder, as in Task 36.

Steps:

1. Download the files of Task 36 at the same commits: the places data at `7eb18a5`, and Natural Earth at `ca96624`. Compare the SHA-256 of each file with the table "Downloads (Task 36 step 1)" of `docs/DATA-SOURCES.md`. If one differs, stop and ask Arthur.
2. Write the script `scripts/build-map.mjs`. It reads the downloads from a folder that you give it, and it writes the folder `public/data/map/`. Two runs give the same bytes. It prints each number of step 6.
3. `public/data/map/index.json`:
   - `regions`: the five regions of section 15.9, each with `id`, `name`, `box`, and `dataBox`. A box is `[west, east, south, north]` in degrees.
   - `books`: for each book with a region, the id of the book in `public/data/books.json` and the id of its region. The five books with no place are not in it.
4. `public/data/map/books/<book id>.json`, for each book with a region:
   - `book`, `region`, and `named`: the number of places of the book.
   - `places`: the places with a position that are not inside a settlement. Each has `name`, `lon` and `lat` with 5 decimal places, `verses`, `kind`, and `sure`. `sure` is false for a score below 500. The order: the most verses first, then the order of `ancient.jsonl`.
   - `inSettlement`: the names of the places that the map leaves out by rule 4 of section 15.9.
   - `noPosition`: the names of the other places with no position.
   - `named` is the sum of the three lists.
5. `public/data/map/regions/<region id>.json`, for each region: the land, the lakes, and the rivers of rule "The coast, the rivers, and the lakes" of section 15.9, cut to the data box. You select the form of the coordinates. An error of the form must be less than 0.0001 degrees. Each river has its `scalerank`. Record the form in `docs/DATA-SOURCES.md`.
6. Report these numbers, and compare them with the numbers of the designer. If your numbers differ, find the cause and give it. Do not change the script to make the numbers agree.
   - The region of each book. The designer: the table of section 15.9.
   - For the five books with no region at 90%: the part of the verses in `r4`. The designer: Esther 29 of 33, Job 6 of 14, Ezekiel 335 of 385, Jonah 9 of 11, Nahum 22 of 27.
   - For Exodus, Joshua, Ezekiel, Matthew, Acts, and Proverbs: `named`, the places with a position, and the places with a score below 500. The designer: Exodus 33, 31, and 15. Joshua 432, 431, and 196. Ezekiel 107, 106, and 23. Matthew 38, 38, and 6. Acts 107, 107, and 4. Proverbs 1, 1, and 0.
   - The places inside a settlement in all books. The report of Task 36: 50. The names in Acts: Beautiful Gate and Solomon’s Portico.
   - The places with a `custom_lonlat`. The designer: 5.
   - The places with two locations at the highest score. The designer: 5.
   - The number of places of each kind, for the places with a position that are not inside a settlement. The designer, with 54 places inside a settlement and not 50: 973 "place", 133 "region", 68 "mountain", and 50 "water".
   - The data box of each region before the 0.2 degrees. The designer: `r1` 30.3 to 40.4 E and 29.4 to 33.7 N. `r2` 25.4 to 41.1 E and 26.6 to 35.1 N. `r3` 17.1 to 34.9 E and 32.8 to 44.2 N. `r4` 25.9 to 52.1 E and 21.8 to 44.2 N. `r5` 7.5 to 42.5 E and 23.2 to 50.8 N.
   - The bytes of each file of step 5 and of the largest and the smallest file of step 4, with and without gzip. The designer for step 5: section 15.9.
   - The places of the kind "place" that have a type which is not "settlement": the types, the number of each, and three examples of each. The designer did not check them.
7. Write `src/data/mapData.test.ts`. It reads the files of `public/data/map/` and checks:
   - `index.json` has five regions and 61 books, and each book id is in `public/data/books.json`. Philemon, James, 1 John, 2 John, and 3 John are not in it.
   - Each book of the index has a file, and its `region` agrees with the index. No other file is in `books/`.
   - In each book file: `named` is the sum of the three lists, each place has a `kind` of the four kinds, the order is the order of step 4, and each position is in the range from -10 to 70 degrees east and from 10 to 50 degrees north. If a position is outside this range, report it. Do not change the range to make the test pass.
   - The numbers of step 6 for Exodus, Acts, and Proverbs.
   - Each region file has land, and each coordinate is in its data box.
8. The Sources page: a new section before "Fonts", with the heading "Places" and the id `sources-places`. Use these words, with the links:
   - "The places that each book names, the verses that name them, and their positions come from the Bible Geocoding Data of OpenBible.info, with a Creative Commons Attribution 4.0 licence. The site changed the data: it keeps one position for each place, and it leaves out the places that are inside a city." Links: `https://www.openbible.info/geo/` on "Bible Geocoding Data of OpenBible.info", and `https://creativecommons.org/licenses/by/4.0/` on the name of the licence.
   - "Some positions in that data come from OpenStreetMap. © OpenStreetMap contributors. That data has the Open Database License." Link: `https://www.openstreetmap.org/copyright` on "© OpenStreetMap contributors".
   - "The coast, the rivers, and the lakes come from Natural Earth, which is in the public domain." Link: `https://www.naturalearthdata.com/` on "Natural Earth".
   - Add the section to the tests of the Sources page in `e2e/`, with the axe check.
9. `docs/DATA-SOURCES.md`, section 12: change the use of each file from "Read for Task 36. Not used on the site." to its use on the site. Add the script, the rules of section 15.9 by reference, the form of step 5, the number of files in `public/data/map/`, and their sum of bytes.
10. Run the `accuracy-reviewer` agent: each number of the report against the script, the three paragraphs of step 8 against the licence pages, and the rules of the script against section 15.9.
11. Run `npm run lint`, `npm run build`, `npm test`, and `npm run test:e2e`.

Done when:

- `public/data/map/` has `index.json`, 61 book files, and 5 region files.
- The report has each number of step 6, with the cause of each difference.
- The Sources page has the section "Places".
- No map page, no line "Where", and no map component is in `src/`.

Stop and report. Commit the six sketches of the designer with this task: the files of `docs/screenshots/map-design/` with names that start with `page2-`.

## Task 38. The map page: the first view

Status: DONE

Accuracy review: yes

Goal: the address `#/book/<book id>/map` shows the map of the places of a book, in its first view. No page has a link to it: Arthur and the designer open it by its address and review it. Task 39 adds the zoom, and Task 40 adds the link.

Read section 15 of `docs/DESIGN.md` first. Sections 15.8, 15.10, and 15.11 are the rules. The sketches with names that start with `page2-` in `docs/screenshots/map-design/` show the result. The script of the sketches used an estimate for the width of a name, so small differences are correct.

WARNING: Do not add a link to the map page. Do not add the line "Where". Do not add the zoom controls, the drag, or a key for the map. Task 39 adds the zoom: write the functions of steps 3 and 4 with the scale as an input.

WARNING: Do not change a file in `public/data/map/`. If the data looks wrong, report it.

WARNING: Do not select or correct a place, a position, a name, or a kind. If the priority rule hides a place that you think is important, report it and keep the rule.

Steps:

1. The route. Add the page `map` to `src/router.ts`, with the function `mapHref`. The address of step 3 of "The address and the bar" in section 15.11 shows its sentence or the page of a book that the site does not have.
2. The data. Load `index.json`, the file of the book, and the file of its region only when the map page opens. If a file did not load, the page shows "The map did not load." as an alert.
3. Write the functions with no browser in them, with tests in Vitest: the projection and the first view, the ratio of a region, the scale bar, the counts with their sentences, the places at one position, and the priority rule. The priority rule gets the function that measures a name as an input.
4. The page, by section 15.11: the address and the bar, the parts of the page, the layout, and the drawing. `src/screenLayout.ts` decides the layout. The page is at the top when it opens.
5. For a screen reader: the map is one image with the name "Map of the places of", the name of the book, a comma, and the name of the region. Example: "Map of the places of Acts, Rome to Jerusalem". The heading "The places of this book" is a heading of level 2.
6. End-to-end tests in a new file of `e2e/`, at 1440 by 900 px and at 390 by 844 px:
   - Acts: the name of the region is "Rome to Jerusalem", and the first view shows the names "Jerusalem" and "Rome".
   - Matthew: the first view shows the name "Jerusalem".
   - Proverbs: the page shows the sentence for one place, and the map shows the name of Egypt and no dot. Egypt has the kind "region".
   - Philemon: the page shows "Philemon names no place."
   - The control of the bar opens the book.
   - No name touches a different name or a dot of a different place. Test this for Acts and for Joshua from the boxes of the elements.
   - The axe check for Acts and for Joshua.
   - If a test of this list fails because of the rule or the data, report it. Do not change the rule, the data, or the test to make it pass.
7. Make screenshots in `docs/screenshots/task-38/`, at the two sizes: Acts, Joshua, Matthew, Ezekiel, Exodus, Ephesians, and Proverbs.
8. Report, at 1440 by 900 px and at 390 by 844 px, for Acts, Joshua, Matthew, and Ezekiel: the places of the file, the places in the first view, the dots that show, and the names that show. The designer at 1440 by 900 px, with an estimate for the width of a name: Joshua 87 dots, Acts 41 dots, and Matthew 10 dots.
9. Report the bytes that the map page adds to the JavaScript and to the CSS of the site, with gzip.
10. Run the `accuracy-reviewer` agent: the sentences of the counts against the data for the seven books of step 7, and the rules of the code against section 15.11.
11. Run the reviewer agents of a page task. Run `npm run lint`, `npm run build`, `npm test`, and `npm run test:e2e`.

Done when:

- The seven addresses of step 7 show a map at the two sizes.
- The tests of steps 3 and 6 pass, or the report gives the cause of each one that does not.
- No page has a link to the map page.

Stop and report.

## Task 38b. The map: four corrections of the page, and the names of a direction

Status: DONE

Accuracy review: yes

Goal: the map page has the four corrections of the designer, and the map data has no place with the name "East", "North", or "South".

The designer verified Task 38 and found no error of the build. The four corrections come from rules of the designer that were not clear or not right. Arthur decided the change of the data on 2026-11-17. Read rule 7 of "The places of a book" in section 15.9 of `docs/DESIGN.md`, and section 15.11.

WARNING: Do not add a link to the map page. Do not add the line "Where". Do not add the zoom.

WARNING: The names of rule 7 are the one exception to the rule that no person selects a place. Do not leave out a different place.

Steps:

1. The data. Download the files of Task 37 again, and check each SHA-256, as in Task 37 step 1.
2. Change `scripts/build-map.mjs`: a place whose name is "East", "North", or "South" is not a place of a book. The name is the `friendly_id` with no number at its end. The script prints the entries that it leaves out, with the books of each. Build `public/data/map/` again.
3. Compare with the numbers of the designer. If your numbers differ, find the cause and give it.
   - The entries: East, North, South 1, South 2, and South 3.
   - `named` changes in 13 books: Genesis 117 to 116, Numbers 139 to 138, Judges 150 to 149, 1 Kings 105 to 104, Job 10 to 9, Isaiah 136 to 135, Jeremiah 137 to 136, Ezekiel 107 to 106, Daniel 23 to 21, Zechariah 39 to 38, Matthew 38 to 36, Luke 34 to 33, and Revelation 19 to 18.
   - No book changes its region. The index has 61 books.
   - The region files do not change. Give the SHA-256 of each before and after.
4. `src/data/mapData.test.ts`: add a test that no list of a book file has one of the three names. Change a number of a test only if step 3 gives the cause.
5. The Sources page, section "Places": change the second sentence to "The site changed the data: it keeps one position for each place, and it leaves out the places that are inside a city and the places with the name East, North, or South." Change the test of the section.
6. `docs/DATA-SOURCES.md`, section 12: add rule 7, the five entries, and the new number of bytes.
7. The page, correction 1: ", and N more." N is the number of the places of the list that the names shown do not stand for. Example: Ezekiel at 1440 by 900 px has 8 names and then the number of the other places.
8. The page, correction 2: the three bold names are those of the places with a dot or a triangle that the book names most. Example: in Exodus, "Mount Sinai" is bold.
9. The page, correction 3: the size of the triangle, from "The drawing" rule 4 of section 15.11, on the map and in the list of the signs.
10. The page, correction 4: the space at the left in the wide layout, from "The layout" rule 2 of section 15.11.
11. Tests. Vitest: the three corrections 1, 2, and 3 in the functions. End-to-end:
    - Matthew at 1440 by 900 px: the map has no name "EAST", and the page has no word "South".
    - Exodus at 1440 by 900 px: "Mount Sinai" is bold.
    - Ezekiel at 1440 by 900 px: the number of the sentence is the number of the names shown plus N.
    - The space at the left and at the right of the two columns, in a window of 1440, 1470, 1500, and 1920 px. The designer computed 80 and 20, 80 and 50, 80 and 80, and 290 and 290.
    - The axe check for Matthew.
12. Make screenshots in `docs/screenshots/task-38b/`: Matthew, Exodus, Ezekiel, and Daniel at 1440 by 900 px and at 390 by 844 px, and Acts at 1920 by 1080 px.
13. Report the table of Task 38 step 8 again, for the same four books and Daniel.
14. Run the `accuracy-reviewer` agent: the numbers of step 3 against the script, the sentences of the counts against the data for the books of step 12, and the sentence of step 5 against rule 7.
15. Run the reviewer agents of a page task. Run `npm run lint`, `npm run build`, `npm test`, and `npm run test:e2e`.

Done when:

- No file of `public/data/map/books/` has one of the three names.
- The tests of steps 4 and 11 pass, or the report gives the cause of each one that does not.
- No page has a link to the map page.

Stop and report.

## Task 39. The map page: the zoom

Status: DONE

Accuracy review: no

Goal: the reader zooms in and moves the map, and each step of the zoom shows more names.

Read "The zoom, Task 39" in section 15.11 of `docs/DESIGN.md` first.

WARNING: Do not add a link to the map page. Do not add the line "Where".

WARNING: If a test fails in a full run, record the name of the test and its error before you run the tests again. Give them in the report. In Task 38b, two tests failed in the first full run, and their names are not known.

Steps:

1. Two corrections of the first view, from the report of Task 38b. Read rules 4 and 5 of "The drawing" in section 15.11.
   - A bold name is only for a place that the book names in 3 verses or more. Examples: in Exodus, "Mount Sinai" and "Rephidim" are bold, and "Baal-zephon" is not. In Daniel, "Dura" is not bold. Ephesians has no bold name.
   - In the priority rule, a triangle has a radius of half its width. Change the distance rule for two marks and the position of the name of a mountain.
   - Add a test in Vitest for each one, and an end-to-end test for Exodus and Daniel at 1440 by 900 px.
   - Report the table of Task 38 step 8 again for Acts, Joshua, Matthew, Ezekiel, and Exodus, so that the designer sees the effect.
2. Add the zoom controls, the drag, the two fingers, and the keys, by section 15.11.
3. At each step of the zoom, compute the places and the names again with the priority rule of Task 38, for the whole first view at the new scale.
4. Tests in Vitest: the number of steps for each region at a frame of 960 by 792 px and of 390 by 520 px, and the limits of a move.
5. End-to-end tests, at 1440 by 900 px and at 390 by 844 px:
   - "Zoom out" is off in the first view, and "Zoom in" is off at the last step.
   - Joshua: the number of names that show is larger after each of the first two steps.
   - A drag after a zoom moves the map, and the view stays in the first view.
   - At 390 by 844 px in the first view, a drag with one finger on the map scrolls the page.
   - The keys move and zoom the map when it has the focus.
   - The axe check for Joshua after a zoom.
6. Make screenshots in `docs/screenshots/task-39/`, at the two sizes: Joshua and Acts after two steps, and at the last step. For the last step, keep the center of the first view.
7. Report for each region, at the two frames of step 4: the number of steps, and the number of px for one mile at the last step. Report for Joshua and for Acts at each step: the dots and the names that show, and the places that show at no step with the cause.
8. Report how the coast and the lakes look at the last step. The data is made for the scale 1:10 million. Do not change the data.
9. Run the reviewer agents of a page task. Run `npm run lint`, `npm run build`, `npm test`, and `npm run test:e2e`.

Done when:

- The tests of steps 1, 4, and 5 pass, or the report gives the cause of each one that does not.
- The report has the numbers of steps 1 and 7.

Stop and report.

## Task 40. The line "Where" in "About this book"

Status: TODO

Accuracy review: no

Goal: a reader goes from "About this book" to the map of the book.

WARNING: Do this task only after Arthur approved the map page of Tasks 38 and 39. If `docs/TASKS.md` does not say so below this line, stop and ask.

Steps:

1. "About this book" gets a fourth line after "Written": the label "Where", and one link with the words "The places of this book" and the sign "›". The link opens the map page of the book. The line has no other words.
2. The line shows only for a book in `public/data/map/index.json`. Philemon, James, 1 John, 2 John, and 3 John do not have it. If the index did not load, no book has it.
3. The Sources page, section "Places": add a first sentence, "Each book with places has a map of them. The link is in “About this book”."
4. End-to-end tests: the line is in Acts and not in Philemon, the link opens the map page of Acts, the control of the bar of the map page returns to the chapter that the reader was in, and the axe check with "About this book" open.
5. Make screenshots in `docs/screenshots/task-40/`: "About this book" open in Acts, at 1440 by 900 px and at 390 by 844 px.
6. Run the reviewer agents of a page task. Run `npm run lint`, `npm run build`, `npm test`, and `npm run test:e2e`.

Done when:

- The tests of step 4 pass.

Stop and report.
