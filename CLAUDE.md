# Bible site: instructions for Claude Code

The name of the site is "Bible Wall", from 2026-11-16. Section 12 of `docs/DESIGN.md`. "Books of the Bible" is the name of the wall image that Arthur likes, and it was the name of the site before.

## What this project is

A static website for reading the Bible. The owner is Arthur.

Arthur decided a redesign on 2026-11-14. The rule of the redesign: the text is the interface. The reader moves through the Bible with no friction when the reader reads. The first build had a 3D book on a table. The redesign removes it.

Arthur decided on 2026-11-15 to add the King James Version as a second translation. The rule: a translation changes only the words. From section 11 of `docs/DESIGN.md`, the marks of the words of Jesus go with the words: each translation has its own red letters.

Arthur decided on 2026-11-16 to add the World English Bible as a third translation, by the same rule. Section 13 of `docs/DESIGN.md` has the decisions.

## Files you must read before you do work

1. `docs/DESIGN.md`. The agreed design. Section 7 is the redesign. It replaces sections 1, 3, and 4.1 to 4.4. Sections 2, 4.5, 4.6, 5, and 6 apply where section 7 does not replace them. Section 8 is the King James Version. Section 9 is the top bar of 2026-11-15. Where section 9 and an older section differ, section 9 is correct. Section 13 is the World English Bible. Where sections 8, 9, and 11 say "the two translations", section 13 makes it three. Section 16 is the font Inrond. Where an older section names Inter, section 16 makes it Inrond. Section 17 is the line "Video" in "About this book". Section 18 is the dark mode. Section 19 is "About this chapter", with the Biblica Study Notes. Section 20 is the study notes: the Aquifer Open Study Notes in "About this chapter" of 132 psalms, and at the verses behind the switch "Study notes". Do not change a design decision without Arthur's approval.
2. `docs/TASKS.md`. The numbered task list. It is in run order. Tasks 11 to 18 build the redesign. Tasks 19 to 21 are for the King James Version. Task 22 builds the top bar of section 9. Task 23 corrects the trail. Task 24 adds the text size of section 10. Task 25 is a report on the marks of the words of Jesus in the source files. It changes no page. Tasks 26 and 27 build the red letters of section 11. Task 28 changes the name of the site to "Bible Wall" and adds the icon of section 12. Task 29 is a report on the World English Bible, which Arthur selected on 2026-11-16 as a third translation. It changes no page. Tasks 30 and 31 build the World English Bible of section 13: Task 30 makes the text data, and Task 31 changes the pages. Task 31b corrects two paragraphs of the Sources page. Task 32 gives the band round corners of 3 px. Task 33 adds a line for each translation to the translation list, and the section "The three translations" to the Sources page, from section 14 of `docs/DESIGN.md`. Task 34 changes the lines of two translations. Task 35 changes the line of the Berean Standard Bible. Task 36 is a report on the data for a map of the places of each book. It changes no page. Task 37 makes the map data from section 15.9 of `docs/DESIGN.md`, and it adds the credit to the Sources page. It builds no map. Tasks 38 to 40 build the map page from sections 15.8, 15.10, and 15.11: Task 38 the page with its first view, Task 38b four corrections of the page and one change of the data, Task 39 the zoom, Task 39b three changes of Arthur after the first review, Task 39c a new design of the switch, Task 39d a change of what the switch hides, and Task 40 the line "Where" in "About this book". Do one of them at a time. Task 41 replaces the font Inter with Inrond, from section 16 of `docs/DESIGN.md`. Task 42 adds the line "Video" to "About this book", with links to the overview videos of BibleProject on YouTube, and the section "Videos" to the Sources page, from section 17 of `docs/DESIGN.md`. Task 43 removes the name of the translation that is next to the control "About this book": the top bar has it. Task 44 is the first task of the dark mode of section 18 of `docs/DESIGN.md`: it gives each color of the site one name in one place, and it writes a report. It changes nothing on the site. Task 45 builds the dark mode on each page, with the dark values of section 18.11, and the dark mode switch. In Task 45 the first state of the switch is "Off", and the site does not follow the setting of the device: Task 46 adds that. Task 46 is the last task of the dark mode: with no stored selection, the site follows the setting of the device. Arthur approved the dark pages on 2026-11-18. For the map, no person and no agent selects or corrects a place, a position, a name, or a kind: the rules of section 15 make each one. The one exception is a decision of Arthur: the data leaves out the places with the name "East", "North", or "South". Task 47 builds "About this chapter" of section 19: the control, the panel with the Biblica notes, and the note credit. Tasks 48 and 49 build section 20: Task 48 has the source, the data, and the psalms, and Task 49 has the switch "Study notes" and the notes at the verses.
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
- Use only the sources that Arthur approved. Write the site's text in your own words. Do not copy a sentence from a source that is under copyright. The two exceptions are the Biblica notes of section 19 and the Aquifer notes of section 20 of `docs/DESIGN.md`: Arthur approved these sources on 2026-11-23, and their license permits a copy with a credit.
- Do not add or remove a link between passages. Links come only from the three approved sources, by the rules in section 4.5 of `docs/DESIGN.md`. From Task 31, the World English Bible pages do not show 3 links, by the rule of section 13.4. The link data does not change.
- WARNING: Do not put a video player, an `iframe`, an image, a script, or other content of a different server into a page. The line "Video" of section 17 of `docs/DESIGN.md` is a link only. Do not add, remove, or change a video address: the list of section 17.5 is the only source.
- WARNING: Do not change a word of a Biblica note, and do not write a note. "About this chapter" shows the words of the Biblica Study Notes with no change, under the license CC BY-SA 4.0. The files in `sources/biblica/` are the only source, and the number of section 19.4 of `docs/DESIGN.md` shows that the words have no change. Do not show a Biblica note without the note credit, and do not change a word of the note credit.
- WARNING: Do not change a word of an Aquifer note, and do not write a note. The files in `sources/aquifer/` are the only source, and the numbers of sections 20.3 and 20.5 of `docs/DESIGN.md` show that the words have no change. Do not show an Aquifer note without one of the two credits of section 20.6, and do not change a word of a credit. Do not put a string of a notes file into the page as HTML with no check.
- Do not put a color value in a component or in a CSS rule. Each color has one name in the first `:root` block of `src/index.css`, or it is a group color of `src/data/books.ts`. The test `src/colors.test.ts` checks this. A new color needs a light value and a dark value, and a decision of Arthur or of the designer. Section 18.11 of `docs/DESIGN.md` is the only source of a dark value.
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
| dark mode | The second set of colors of the site, for a dark page. Section 18 of `docs/DESIGN.md`. The first set is the light mode. |
| dark mode switch | The row "Dark mode" with the state "On" or "Off", below the red letters switch. Task 45 builds it. |
| line "Video" | The last line of "About this book": one or two links to the overview videos of the book, by BibleProject, on YouTube, and the credit. Section 17 of `docs/DESIGN.md`. |
| video list | The table of section 17.5 of `docs/DESIGN.md`: the 73 videos, with the book ids of each. In the code, it is one file in `src/data/`. |
| credit | The paragraph below the links of the line "Video", in the words that BibleProject gives. It names BibleProject as the author and owner of the videos, and it has a link to bibleproject.com. Do not change a word of it. Section 17.3 of `docs/DESIGN.md`. |
| sentence of the shared video | The sentence before the credit in a book that shares its video with one or two other books. It names the books. |
| "About this chapter" | The control below the heading of a chapter, and the panel that it opens. The panel has the Biblica notes of the chapter and the note credit. Section 19 of `docs/DESIGN.md`. Task 47 builds it. |
| Biblica note | One text of the Biblica Study Notes, with its range of verses. A chapter shows each Biblica note whose range has a verse of the chapter. The word "note" alone is not a name: say "Biblica note". |
| range label | The line above a Biblica note that names its range, for example "Romans 8:1-17" with an en dash on the page. |
| note credit | The line below the Biblica notes of a panel. It names the Biblica Study Notes, Biblica Inc., and the license CC BY-SA 4.0, with two links. Do not change a word of it. Section 19.8 of `docs/DESIGN.md`. |
| Aquifer note | One text of the Aquifer Open Study Notes, with its range of verses. Section 20 of `docs/DESIGN.md`. |
| Aquifer credit | The line below the Aquifer note of a psalm in "About this chapter". It names Mission Mutual, the Tyndale Open Study Notes, and the license. Section 20.6. |
| short credit | The line at the end of a block of study notes, with a link to the Sources page. Section 20.6. |
| study notes | The Aquifer notes at the verses of a chapter. The reader sees them only with the switch "Study notes" on. Task 49 builds them. |
| "Study notes" switch | The row "Study notes" with the state "On" or "Off", below the dark mode switch. Section 20.7. |
| group of blocks | The text blocks of a chapter that the reader sees as one paragraph or one stanza, by the rule of section 20.8 of `docs/DESIGN.md`. Section 20.8 and Task 49 say "group" for it. In code, in comments, and in reports, use "group of blocks", because "group" alone is one of the ten sets of books on the wall. |
| notes control | The control "Notes on verses 1 to 4" after a group of blocks. It opens the block of notes. |
| block of notes | The notes of one group of blocks, with a note label for each note and the short credit. |
| note label | The line above a study note that names its verse or its range, for example "Verse 3". |
| title note | An Aquifer note on the title of a psalm. The source has 7. |

These names are from the first build. Do not use them for the new pages: table, stack, spine, cover, spread, scene.
