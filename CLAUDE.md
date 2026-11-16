# Bible site: instructions for Claude Code

## What this project is

A static website for reading the Bible. The owner is Arthur.

Arthur decided a redesign on 2026-11-14. The rule of the redesign: the text is the interface. The reader moves through the Bible with no friction when the reader reads. The first build had a 3D book on a table. The redesign removes it.

Arthur decided on 2026-11-15 to add the King James Version as a second translation. The rule: a translation changes only the words.

## Files you must read before you do work

1. `docs/DESIGN.md`. The agreed design. Section 7 is the redesign. It replaces sections 1, 3, and 4.1 to 4.4. Sections 2, 4.5, 4.6, 5, and 6 apply where section 7 does not replace them. Section 8 is the King James Version. Section 9 is the top bar of 2026-11-15. Where section 9 and an older section differ, section 9 is correct. Do not change a design decision without Arthur's approval.
2. `docs/TASKS.md`. The numbered task list. It is in run order. Tasks 11 to 18 build the redesign. Tasks 19 to 21 are for the King James Version. Task 22 builds the top bar of section 9.
3. `docs/prototype/README.md`. It tells you how to use the prototype of the redesign. The prototype is a reference for the look and the movement. It is not code for the site.
4. `docs/DATA-SOURCES.md`. It records each data source and its licence.
5. `docs/CONTENT-SOURCES.md`. It records the source of each fact about the Bible. It is a large file. Read the part that the task needs.

## How to work

1. Open `docs/TASKS.md`.
2. Find the first task that has the status `TODO`.
3. Do only that task.
4. Run the `reviewer` agent on your changes. The agent is in `.claude/agents/reviewer.md`. If that file does not exist, copy `docs/agents/reviewer.md` to that path first.
5. If the task has the line "Accuracy review: yes", run the `accuracy-reviewer` agent also. The agent is in `.claude/agents/accuracy-reviewer.md`. If that file does not exist, copy `docs/agents/accuracy-reviewer.md` to that path first.
6. Correct each problem that the two reviewers report.
7. Set the task status to `DONE` in `docs/TASKS.md`.
8. Commit with a message that starts with the task number.
9. Push the commit to the `main` branch. The push deploys the site to GitHub Pages. Do not push if the build or a test fails.
10. Stop. Give Arthur a short report: what you did, what you verified, what you did not verify. Include the "Not verified" list of the accuracy reviewer without changes. Say if the push and the deploy are complete, or say that you did not check.

When Arthur says "do the next task", start again at step 1.

## Hard rules

- WARNING: Do not add ESV text or a request to the ESV API. The ESV is not in version 1. The site has two translations: the Berean Standard Bible, and the King James Version from Task 20. The two are bundled in the repository. Do not add a different translation.
- WARNING: Do not add a server. The site is deployed on GitHub Pages. All code runs in the browser or at build time.
- WARNING: The redesign changes how the site looks and moves. It does not change what the site says. Do not change the Bible text, an introduction, a link, or a date, unless a task tells you to.
- Push to the `main` branch after each task. Arthur decided this on 2026-11-14. He tests each task on the public site, and the site has no other readers. From Task 12 to Task 17, the public site has new pages and old pages together. This is accepted.
- Do not push a different branch, and do not use a force push.
- Do not add a data source until you have read its licence. Record the licence in `docs/DATA-SOURCES.md`.
- Do not invent facts about a book: author, date, place. Mark each book introduction as `review: "draft"` until Arthur approves it.
- Do not change the words of a Bible text. This applies to the two translations. The one exception is the list of 13 split words in section 8.2 of `docs/DESIGN.md`.
- Do not write new content for the King James Version. Its headings, cross-reference lines, links, introductions, and dates are those of the site. Section 8 of `docs/DESIGN.md` has the rule.
- Do not write a fact about the Bible from memory. Each fact in an introduction, a date, or a reason line must have a named source in `docs/CONTENT-SOURCES.md`.
- Use only the sources that Arthur approved. Write the site's text in your own words. Do not copy a sentence from a source that is under copyright.
- Do not add or remove a link between passages. Links come only from the three approved sources, by the rules in section 4.5 of `docs/DESIGN.md`.
- The accuracy reviewer does not approve content. Only Arthur changes `review: "draft"` to `review: "approved"`.
- Do not copy the structure of the prototype into `src/`. Use its values: sizes, spacing, colors, and timing.
- If a task is not clear, or a check in a task fails, stop and ask Arthur. Do not guess.

## Stack

- Vite, React, TypeScript.
- No 3D library and no animation library. Task 13 removes Three.js, `@react-three/fiber`, and GSAP. Use CSS, SVG, and the functions of the browser.
- Hash routes, because GitHub Pages has no rewrite rules. The addresses are in section 7.6 of `docs/DESIGN.md`.
- Data as static JSON files in `public/data/`.
- Fonts as bundled packages: Inter and Lora. The site gets no font from a different server.
- Vitest for unit tests. Playwright for the browser tests, with axe-core.
- GitHub Actions for build and deploy to GitHub Pages.

## Names

Use these names in code, comments, and reports. One name for each thing.

| Name | Meaning |
|---|---|
| wall | The first page. The 66 book names in the colors of their groups. |
| book name | One book on the wall. It is the control that opens the book. |
| group | One of the ten sets of books on the wall. "History" occurs two times. |
| category | One of the nine kinds of writing. |
| band | The bar in the group color that starts a group, with the group name in white. |
| translation | One of the two Bible texts of the site: the Berean Standard Bible and the King James Version. |
| added words | The words that the translators of the King James Version added. The page shows them in italics. |
| translation control | The control in the top bar of the reading page that shows the short name of the selected translation. It opens the translation list. |
| translation list | The list of the translations, with the full name and the short name of each. The reader selects the translation there. From Task 22, it replaces the translation switch of Task 21. |
| reading page | The page with the chapter text, in one column. |
| top bar | The bar that stays at the top of the wall, of the reading page, and of the Reference pages. |
| "Menu" | The control at the right of the top bar in the narrow layout, on the wall and on the reading page. |
| menu panel | The panel that "Menu" opens. It has the links to the Reference section. On the reading page, it also has the echo links switch. |
| chapter grid | The grid of chapter numbers that opens from the top bar. |
| link | A connection from one passage to a different passage. |
| quotation link | A link where one passage quotes a different passage. |
| echo link | A link by theme or wording. Weaker than a quotation link. |
| mark | The dot or ring in the text that shows a link, in the narrow layout. |
| margin label | The label in the right margin that shows a link, on a wide screen. |
| pop-up | The panel that shows a linked passage, with "Go there" and "Stay here". |
| travel | The move from one passage to a linked passage. |
| trail | The list of passages that the reader visited by travel, with the control "Back". |
| read-with list | The list at the top of a chapter that names the chapters in other books with the most cross-references to it. |
| Reference section | The three pages Timeline, Quotations, and Sources. |
| timeline | The page that shows when each book was written. |
| estimate | A date on the timeline that is not exact. Its book name is in light letters. |
| quotation diagram | The page "Quotations". The 66 books around a circle, with lines for quotation links. |
| Sources page | The page that credits the translation, the data sources, and the fonts. |

These names are from the first build. Do not use them for the new pages: table, stack, spine, cover, spread, scene.
