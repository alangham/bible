# Bible site: backlog

This file is the list of ideas for later. An idea here is not a task. Claude Code does not build an idea from this file. Arthur and the designer decide when an idea becomes a task in `docs/TASKS.md`.

Design fixes for pages that exist are in `docs/POLISH.md`, not here.

When an idea is built, its item is removed from this file. The other items keep their numbers, because other files refer to them by number. Removed on 2026-11-18: item 1, a map for each book (Tasks 36 to 40); item 2, a scene of its own for some books (obsolete: the redesign of 2026-11-14 removed the paper-cut scenes); and item 6, the King James Version (Tasks 19 to 21b).

---

## 3. All footnotes of the Bible text

Added: 2026-11-14, by the designer.

Idea: the source has 4,854 footnotes. Version 1 shows only the notes about manuscripts. A later version can show all of them.

Open questions:

1. How does a footnote look on the spread? A mark in the text that opens a note is one option. The pop-up for links in section 4.5 of `docs/DESIGN.md` is a similar control. The two must not be confused.
2. Can the reader switch the footnote marks off?

---

## 4. A bookmark and the last-read chapter

Added: 2026-11-14, by Arthur.

Idea: the site remembers the place of the reader. The reader goes back to that place with one tap.

What the feature can include. These are options, not decisions:

- The last-read chapter. The site records the chapter in view when the reader leaves.
- A bookmark. The reader marks a place, and the site keeps it.
- A "Continue" control on the first page that opens the last-read place.

Connection to the redesign of 2026-11-14:

- Arthur decided that a tap on a book name opens chapter 1 on the first visit, and the last-read chapter of that book after that. That decision needs the last-read chapter of each book.
- Arthur decided that the chapters follow each other in one continuous scroll. A chapter has no hard stop, so a record of the place is more useful.

Open questions:

1. Where does the site keep the place? The site has no server. Storage in the browser keeps the place on one device only.
2. Is the place a chapter or a verse?
3. Does the reader have one bookmark or many?
4. Does the first page show the last-read place?

---

## 5. The 56 references in the cross-reference lines that have no link

Added: 2026-11-14, by Arthur.

Idea: find why 56 references in the cross-reference lines of the Berean Standard Bible files have no link, and correct the cause where the cause is a fault.

The facts on 2026-11-14, from the reports of Task 14:

- The cross-reference lines have 2,033 references in 1,325 lines. 1,977 of them have a link. 56 of them have no link, in 51 lines.
- On the reading page, a reference with no link shows as plain text. The reader can read it, but the reader cannot open it.
- The accuracy reviewer named this point as not verified in two reviews. `scripts/build-links.mjs` made no link for these references, and the cause was not checked.

Two possible causes. They are not verified:

- The rule in section 4.5 of `docs/DESIGN.md` hides an echo link where a quotation link joins the same two passages. The reviewer found 8 references of this kind. For these, the link shows at the verse, and no change is necessary.
- The source file has a reference with a fault. Example: in Ephesians 5, the line names "Song of Solomon 1:1–17", but the source reference is "1:1-17" with no book name.

What a task for this item must do:

1. List the 56 references, each with its line and its cause.
2. Change no link by hand. Arthur's rule of 2026-11-14 stays: links come only from the three approved sources.
3. Where the cause is a fault of the build script, propose a correction of the script. Stop for Arthur's approval before the link data changes.
4. Run the accuracy reviewer on the result.
