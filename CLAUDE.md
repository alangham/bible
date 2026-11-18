# Bible site: instructions for Claude Code

The name of the site is "Bible Wall", from 2026-11-16. Section 12 of `docs/DESIGN.md`. "Books of the Bible" is the name of the wall image that Arthur likes, and it was the name of the site before.

## What this project is

A static website for reading the Bible. The owner is Arthur.

Arthur decided a redesign on 2026-11-14. The rule of the redesign: the text is the interface. The reader moves through the Bible with no friction when the reader reads. The first build had a 3D book on a table. The redesign removes it.

Arthur decided on 2026-11-15 to add the King James Version as a second translation. The rule: a translation changes only the words. From section 11 of `docs/DESIGN.md`, the marks of the words of Jesus go with the words: each translation has its own red letters.

Arthur decided on 2026-11-16 to add the World English Bible as a third translation, by the same rule. Section 13 of `docs/DESIGN.md` has the decisions.

## Files you must read before you do work

1. `docs/DESIGN.md`. The agreed design. Section 7 is the redesign. It replaces sections 1, 3, and 4.1 to 4.4. Sections 2, 4.5, 4.6, 5, and 6 apply where section 7 does not replace them. Section 8 is the King James Version. Section 9 is the top bar of 2026-11-15. Where section 9 and an older section differ, section 9 is correct. Section 13 is the World English Bible. Where sections 8, 9, and 11 say "the two translations", section 13 makes it three. Section 16 is the font Inrond. Where an older section names Inter, section 16 makes it Inrond. Do not change a design decision without Arthur's approval.
2. `docs/TASKS.md`. The numbered task list. It is in run order. Tasks 11 to 18 build the redesign. Tasks 19 to 21 are for the King James Version. Task 22 builds the top bar of section 9. Task 23 corrects the trail. Task 24 adds the text size of section 10. Task 25 is a report on the marks of the words of Jesus in the source files. It changes no page. Tasks 26 and 27 build the red letters of section 11. Task 28 changes the name of the site to "Bible Wall" and adds the icon of section 12. Task 29 is a report on the World English Bible, which Arthur selected on 2026-11-16 as a third translation. It changes no page. Tasks 30 and 31 build the World English Bible of section 13: Task 30 makes the text data, and Task 31 changes the pages. Task 31b corrects two paragraphs of the Sources page. Task 32 gives the band round corners of 3 px. Task 33 adds a line for each translation to the translation list, and the section "The three translations" to the Sources page, from section 14 of `docs/DESIGN.md`. Task 34 changes the lines of two translations. Task 35 changes the line of the Berean Standard Bible. Task 36 is a report on the data for a map of the places of each book. It changes no page. Task 37 makes the map data from section 15.9 of `docs/DESIGN.md`, and it adds the credit to the Sources page. It builds no map. Tasks 38 to 40 build the map page from sections 15.8, 15.10, and 15.11: Task 38 the page with its first view, Task 38b four corrections of the page and one change of the data, Task 39 the zoom, Task 39b three changes of Arthur after the first review, Task 39c a new design of the switch, Task 39d a change of what the switch hides, and Task 40 the line "Where" in "About this book". Do one of them at a time. Task 41 replaces the font Inter with Inrond, from section 16 of `docs/DESIGN.md`. For the map, no person and no agent selects or corrects a place, a position, a name, or a kind: the rules of section 15 make each one. The one exception is a decision of Arthur: the data leaves out the places with the name "East", "North", or "South".
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

- WARNING: Do not add ESV text or a request to the ESV API. The ESV is not in version 1. The site has three translations: the Berean Standard Bible, the King James Version from Task 20, and the World English Bible from Tasks 30 and 31. The three are bundled in the repository. Do not add a different translation.
- WARNING: Do not add a server. The site is deployed on GitHub Pages. All code runs in the browser or at build time.
- WARNING: The redesign changes how the site looks and moves. It does not change what the site says. Do not change the Bible text, an introduction, a link, or a date, unless a task tells you to.
- Push to the `main` branch after each task. Arthur decided this on 2026-11-14. He tests each task on the public site, and the site has no other readers. From Task 12 to Task 17, the public site has new pages and old pages together. This is accepted.
- Do not push a different branch, and do not use a force push.
- Do not add a data source until you have read its licence. Record the licence in `docs/DATA-SOURCES.md`.
- Do not invent facts about a book: author, date, place. Mark each book introduction as `review: "draft"` until Arthur approves it.
- Do not change the words of a Bible text. This applies to the three translations. The one exception is the list of 13 split words of the King James Version in section 8.2 of `docs/DESIGN.md`. The World English Bible has no exception: the pages of eBible.org ask that a text with a changed word does not have the name "World English Bible".
- Do not add or remove a words-of-Jesus mark. These marks are those of the source files. The one exception is Mark 12:37 of the King James Version, in section 11.3 of `docs/DESIGN.md`. The World English Bible has no exception.
- Do not write new content for the King James Version or for the World English Bible. Their headings, cross-reference lines, links, introductions, and dates are those of the site. Sections 8 and 13 of `docs/DESIGN.md` have the rule.
- Do not take a word from `resources/web.docx` or `resources/kjv.docx`. These files are evidence only.
- Do not write a fact about the Bible from memory. Each fact in an introduction, a date, or a reason line must have a named source in `docs/CONTENT-SOURCES.md`.
- Use only the sources that Arthur approved. Write the site's text in your own words. Do not copy a sentence from a source that is under copyright.
- Do not add or remove a link between passages. Links come only from the three approved sources, by the rules in section 4.5 of `docs/DESIGN.md`. From Task 31, the World English Bible pages do not show 3 links, by the rule of section 13.4. The link data does not change.
- The accuracy reviewer does not approve content. Only Arthur changes `review: "draft"` to `review: "approved"`.
- Do not copy the structure of the prototype into `src/`. Use its values: sizes, spacing, colors, and timing.
- If a task is not clear, or a check in a task fails, stop and ask Arthur. Do not guess.

## Stack

- Vite, React, TypeScript.
- No 3D library and no animation library. Task 13 removes Three.js, `@react-three/fiber`, and GSAP. Use CSS, SVG, and the functions of the browser.
- Hash routes, because GitHub Pages has no rewrite rules. The addresses are in section 7.6 of `docs/DESIGN.md`.
- Data as static JSON files in `public/data/`.
- Fonts as bundled files: Inrond in `src/fonts/` from section 16 of `docs/DESIGN.md`, and Lora from its package. The site gets no font from a different server.
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
| band | The bar in the group color that starts a group, with the group name in white. It is in four places: the wall, the heading of a book on the reading page, the pop-up, and the Quotations page. |
| translation | One of the three Bible texts of the site: the Berean Standard Bible (BSB), the King James Version (KJV), and the World English Bible (WEB). The World English Bible is on the pages from Task 31. |
| added words | The words that the translators of the King James Version added. The page shows them in italics. |
| translation control | The control in the top bar of the reading page that shows the short name of the selected translation. It opens the translation list. |
| translation list | The list of the translations, with the full name and the short name of each. The reader selects the translation there. From Task 22, it replaces the translation switch of Task 21. |
| text size | One of the three sizes of the Bible text: "Standard", "Large", "Largest". Section 10 of `docs/DESIGN.md`. |
| text control | The control in the top bar of the reading page, in the wide layout, that opens the text list. Until Task 27 its name is the text size control, and it shows "Text size". From Task 27 it shows "Text". |
| text list | The list that the text control opens: the three text sizes and, from Task 27, the red letters switch. Until Task 27 its name is the text size list. In the narrow layout, the menu panel has the rows "Text size" and "Red letters" in its place. |
| red letters | The words of Jesus in the color `#8B1A1A`, as the source files of each translation mark them. Section 11 of `docs/DESIGN.md`. |
| red letters switch | The control that switches red letters on and off: a row in the text list, and a row in the menu panel. |
| reading page | The page with the chapter text, in one column. |
| top bar | The bar that stays at the top of the wall, of the reading page, and of the Reference pages. |
| "Menu" | The control at the right of the top bar in the narrow layout, on the wall and on the reading page. |
| menu panel | The panel that "Menu" opens. It has the links to the Reference section. On the reading page, it also has the echo links switch. |
| chapter grid | The grid of chapter numbers that opens from the top bar. |
| link | A connection from one passage to a different passage. |
| quotation link | A link where one passage quotes a different passage. |
| echo link | A link by theme or wording. Weaker than a quotation link. |
| mark | The dot or ring in the text that shows a link, in the narrow layout. The word "mark" alone always has this meaning. |
| words-of-Jesus mark | A mark `\wj` of the source files on words that Jesus spoke. In the site data, it is an item `j`. On the page, its words are red letters. The designer added this name on 2026-11-16, after Task 26, so that "mark" has one meaning. The code name `isMarked` of Task 26 stays. |
| margin label | The label in the right margin that shows a link, on a wide screen. |
| pop-up | The panel that shows a linked passage, with "Go there" and "Stay here". |
| travel | The move from one passage to a linked passage. |
| trail | The list of passages that the reader visited by travel, with the control "Back". The last stop is the current stop. The wall clears the trail. |
| read-with list | The list at the top of a chapter that names the chapters in other books with the most cross-references to it. |
| Reference section | The three pages Timeline, Quotations, and Sources. |
| timeline | The page that shows when each book was written. |
| estimate | A date on the timeline that is not exact. Its book name is in light letters. |
| quotation diagram | The page "Quotations". The 66 books around a circle, with lines for quotation links. |
| Sources page | The page that credits the translation, the data sources, and the fonts. |

These names are from the first build. Do not use them for the new pages: table, stack, spine, cover, spread, scene.
