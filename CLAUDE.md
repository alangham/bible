# Bible site: instructions for Claude Code

## What this project is

A static website for reading the Bible. The reader must feel that they are inside a physical book, not in a flat mobile app. The owner is Arthur. The design was agreed with Arthur before this file was written.

## Files you must read before you do work

1. `docs/DESIGN.md`. The agreed design. Do not change a design decision without Arthur's approval.
2. `docs/TASKS.md`. The numbered task list. It is in run order.
3. `docs/DATA-SOURCES.md`. You create this file in Task 1. It records each data source and its licence.
4. `docs/CONTENT-SOURCES.md`. You create this file in Task 4. It records the source of each fact that you write about the Bible.

## How to work

1. Open `docs/TASKS.md`.
2. Find the first task that has the status `TODO`.
3. Do only that task.
4. Run the `reviewer` agent on your changes. The agent is in `.claude/agents/reviewer.md`. If that file does not exist, copy `docs/agents/reviewer.md` to that path first.
5. If the task has the line "Accuracy review: yes", run the `accuracy-reviewer` agent also. The agent is in `.claude/agents/accuracy-reviewer.md`. If that file does not exist, copy `docs/agents/accuracy-reviewer.md` to that path first.
6. Correct each problem that the two reviewers report.
7. Set the task status to `DONE` in `docs/TASKS.md`.
8. Commit with a message that starts with the task number.
9. Stop. Give Arthur a short report: what you did, what you verified, what you did not verify. Include the "Not verified" list of the accuracy reviewer without changes.

When Arthur says "do the next task", start again at step 1.

## Hard rules

- WARNING: Do not add ESV text or a request to the ESV API. The ESV is not in version 1. The translation is the Berean Standard Bible, which is bundled in the repository.
- WARNING: Do not add a server. The site is deployed on GitHub Pages. All code runs in the browser or at build time.
- Do not push to GitHub until Arthur approves. Local commits are permitted.
- Do not add a data source until you have read its licence. Record the licence in `docs/DATA-SOURCES.md`.
- Do not invent facts about a book: author, date, place. Mark each book introduction as `review: "draft"` until Arthur approves it.
- Do not change the words of a Bible text.
- Do not write a fact about the Bible from memory. Each fact in an introduction, a date, or a reason line must have a named source in `docs/CONTENT-SOURCES.md`.
- Use only the sources that Arthur approved. Write the site's text in your own words. Do not copy a sentence from a source that is under copyright.
- The accuracy reviewer does not approve content. Only Arthur changes `review: "draft"` to `review: "approved"`.
- If a task is not clear, or a check in a task fails, stop and ask Arthur. Do not guess.

## Stack

- Vite, React, TypeScript.
- Three.js through `@react-three/fiber` for the table, the books, and the page turn.
- GSAP for scroll and transition timing.
- Hash routes, because GitHub Pages has no rewrite rules.
- Data as static JSON files in `public/data/`.
- Vitest for unit tests. Playwright for one smoke test per page.
- GitHub Actions for build and deploy to GitHub Pages.

## Names

Use these names in code, comments, and reports. One name for each thing.

| Name | Meaning |
|---|---|
| table | The landing page. Five stacks of books on a linen table. |
| stack | One of the five groups of spines on the table. |
| spine | One book in a stack. |
| cover | The book page. A closed book with its introduction. |
| spread | One open chapter. Two pages with a scene and the text. |
| scene | The paper-cut picture behind a spread. |
| category | One of the nine kinds of writing. |
| link | A connection from one passage to a different passage. |
| quotation link | A link where one passage quotes a different passage. |
| echo link | A link by theme or wording. Weaker than a quotation link. |
| travel | The move from one passage to a linked passage. |
| trail | The list of passages that the reader visited by travel. |
| timeline | The overview page. Books on a time axis with arcs for quotation links. |
