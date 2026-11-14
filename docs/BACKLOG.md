# Bible site: backlog

This file is the list of ideas for later. An idea here is not a task. Claude Code does not build an idea from this file. Arthur and the designer decide when an idea becomes a task in `docs/TASKS.md`.

Design fixes for pages that exist are in `docs/POLISH.md`, not here.

---

## 1. A map for each book

Added: 2026-11-13, by Arthur.

Idea: each book has a map that shows the places of that book.

What the map can show. These are options, not decisions:

- The places where the events of the book occur. Example: the route from Egypt to Mount Sinai for Exodus.
- The place where the book was written and the place it was sent to. Example: Paul in prison in Rome, and the church at Philippi.
- The journeys in the book. Example: the journeys of Paul in Acts.

Where the map can be. These are options, not decisions:

- On the cover page, near the three facts.
- As a page of the open book, before chapter 1.
- As a layer of the timeline page.

Open questions:

1. Which data source gives the places and their positions? OpenBible.info has a set of Bible places with positions. NOT VERIFIED: its licence and its content. Each source needs a licence check and a record in `docs/DATA-SOURCES.md`.
2. Many places in the Bible have a disputed or unknown position. The map needs a rule for these, in the same way that the introductions have a rule for disputed authors.
3. The map must fit the look of the site: paper-cut layers on the linen table, not a modern web map.
4. Do the passages link to the map? Example: select a place name in a chapter, and the map shows it. This connects to links and travel in section 4.5 of `docs/DESIGN.md`.
5. The accuracy reviewer needs a check for places.


---

## 2. A scene of its own for a book that does not fit its category scene

Added: 2026-11-14, by the designer.

Idea: version 1 has one scene for each category. Three books do not fit their scene: Obadiah, Jonah, and Jude. Other books fit only in part, for example Genesis, Ruth, Esther, Acts, Daniel, and Galatians. A later version can give such a book a scene of its own. Example: the sea and a ship for Jonah.

Open questions:

1. Which books get a scene of their own first?
2. Each new subject needs Arthur's approval and a check by the accuracy reviewer, as in Task 5.

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
