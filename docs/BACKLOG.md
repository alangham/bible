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

---

## 6. A second translation: the King James Version

Added: 2026-11-15, by Arthur.

Status on 2026-11-15: this idea is a task now. Arthur decided it after the report of Task 19. The decisions are in section 8 of `docs/DESIGN.md`, and Tasks 20 and 21 of `docs/TASKS.md` build it. Where this item and section 8 differ, section 8 is correct. The text below is the record of the idea.

Idea: the reader can read the King James Version on the site, as a second translation beside the Berean Standard Bible.

The facts on 2026-11-15, from a short check by the designer:

- `docs/DESIGN.md` section 5 tells the site to keep the text service behind one interface, so that a second translation can be added without a change to the pages. `src/data/text.ts` is that interface. The pages get the text from its function `loadBookText`.
- The site loads the text of one book at a time. A second translation adds 66 files to the repository. It does not add to the load of a page.
- `scripts/build-text.mjs` reads only the Berean files. The King James Version needs a build script of its own, or a change to this script.
- `src/data/text.test.ts` compares each verse with the Berean text file. The King James Version needs the same test against its source file.
- Three files have the name "Berean Standard Bible" as fixed text: `src/wall/WallPage.tsx`, `src/book/LinkPopup.tsx`, and `src/SourcesPage.tsx`.
- A possible source is eBible.org. Its page `https://ebible.org/details.php?id=eng-kjv2006` describes the standardized text of 1769, with the 66 books only and with Strong's numbers, and it gives a USFM download. The page has the label "public domain". eBible.org also has an edition with the name "KJV Cambridge Paragraph Bible", with the same label.
- The same page states that three publishers have the exclusive right to print this translation in the United Kingdom, and that this right has no effect outside the United Kingdom.
- The King James Version has no section headings of its own. The printing of 1611 had a summary at the top of each chapter and references in the margin. Two online versions show section headings above the King James Version words: Bible Hub and the Bible Society edition on YouVersion. A modern publisher added these headings, and each set has a copyright notice. The designer read search extracts only, and did not open the pages.
- The designer found no public-domain data file of the King James Version with section headings.
- The Berean publisher shows a set of section headings above the King James Version words on OpenBible.com and on Bible Hub. The designer compared Genesis 1 only. The headings are before the same seven verses as in the Berean files, and the words are changed for the King James Version. Example: "The Second Day: Firmament", where the Berean file has "The Second Day". The page on OpenBible.com has the credit "Section Headings Courtesy Berean Study Bible" and no licence statement. A mirror of the Bible Hub page has the credit "Section Headings Courtesy INT Bible © 2012, Used by Permission". The rights are not clear.
- Arthur found a third source on 2026-11-15: `https://openbible.com/pdfs/kjv.pdf`, a file of the Berean publisher. The designer read Genesis 1 to 7 of it. It has the words of the King James Version below the section headings and the cross-reference lines of the Berean files. In Genesis 1 and 2, the headings and the first cross-reference line are the same as in the site data. So the Berean publisher uses the rule that Arthur decided. The file shows the words that the translators added in square brackets. The designer found no licence statement in that part of the file. Task 19 examines this file as edition C.
- The designer examined the file `https://openbible.com/docx/kjv.docx` on 2026-11-15 and compared it with `public/data/text/*.json`. The numbers are in Task 19 of `docs/TASKS.md`. In short: the file has all 31,102 verses of the King James Version. Its 3,016 main section headings and its 1,325 cross-reference lines stand before the same verses as in the site data, and only four headings have different words. No paragraph of the file cuts a verse. The file has no statement about rights. The words of the file are not checked against a different edition.
- The King James Version in the YouVersion app of Arthur has headings in the Old Testament chapters that he looked at, and none in the New Testament chapters that he looked at. A reader of the King James Version has no standard set of headings.
- The use of the site, from Arthur on 2026-11-15: personal use. He will possibly share the site with friends and church members. The site will always be free.
- The links name each passage by book, chapter, and verse (`scripts/build-links.mjs`). They do not depend on the words of a translation.
- NOT VERIFIED: the content of the King James Version files. The workspace of the designer could not download them. The number of verses, the markers, the paragraphs, and the notes are not checked.

Decided by Arthur on 2026-11-15:

- A translation changes only the words. The reading page of the King James Version shows the section headings and the cross-reference lines of the Berean files above the words of the King James Version. The links, the read-with lists, the introductions, and the dates are the same for the two translations.
- The cost, which Arthur accepted: the headings were written for a different translation, and the Sources page must say that the headings and the cross-reference lines on the King James Version pages are from the Berean files.
- Arthur looked at this decision a second time on 2026-11-15, after he compared headings in the YouVersion app. The decision stays: the headings are those of the Berean files in the repository.
- Task 19 in `docs/TASKS.md` is a report on the files of the King James Version. Arthur decides the tasks that add the King James Version from that report.
- Arthur will ask the Berean publisher if the site can use its set of headings for the King James Version. The contact page `https://berean.bible/contact.htm` gives the address `bereanstudybible@aol.com`. The decision above does not wait for an answer. If the publisher gives permission, Arthur decides then if the site changes to that set.

Open questions:

1. Which edition, and from which source? The source needs a licence check and a record in `docs/DATA-SOURCES.md`. The record must include the right in the United Kingdom.
2. How does the reader select the translation? The line at the bottom of the wall and the top bar are options. Does the site keep the selection in the storage of the browser?
3. Does each section heading of the Berean files start at the start of a verse? NOT VERIFIED. A heading in the middle of a verse needs a rule, because the build script cannot cut the King James Version words at the same place. The same question applies to the paragraphs and the poetry lines: the Berean files cut some verses in the middle. A task must propose which paragraphs and lines the King James Version page uses.
4. The King James Version has verses that the main text of the Berean Standard Bible does not have. The site shows a note at the place of such a verse. The links name a passage by book, chapter, and verse. A task must compare the verse lists of the two translations and report each difference before the links are used with the King James Version.
5. The fit rule in section 4.5 of `docs/DESIGN.md` reads the words of the Berean Standard Bible. The decision above keeps the same links for the King James Version. The reason lines of the quotation links quote words of the Berean Standard Bible. The designer saw this in `public/data/links/numbers.json` on 2026-11-15. Task 19 counts these reason lines. What does the pop-up show for such a reason line when the reader reads the King James Version? Arthur's rule of 2026-11-14 stays: links come only from the three approved sources.
6. The site shows only the manuscript notes of the Berean files. Which notes of the King James Version does the site show, if any?
7. Do the introductions, the reason lines, or other text of the site quote the words of the Berean Standard Bible? This is not checked.
8. `docs/DESIGN.md` sections 5 and 6 and the hard rules in `CLAUDE.md` name the Berean Standard Bible as the only translation. They need a change when this idea becomes a task.
9. `docs/DATA-SOURCES.md` section 2 has a condition on the Berean name: a work that changes the text must not use the name. The credit on the Sources page must not give the King James Version pages the Berean name. A task must read the terms page again for this use.
