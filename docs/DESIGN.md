# Bible site: agreed design

Agreed with Arthur on 2026-11-13. Mockups D1, D2, and D3 are in the Claude design canvas "Bible App: landing page options". Arthur accepted them as "fine for now". Expect small changes later.

WARNING: Section 7 is a redesign that Arthur decided on 2026-11-14. Section 7 replaces sections 1, 3, and 4.1 to 4.4 for the first page and the reading page. Tasks 11 to 18 in `docs/TASKS.md` build section 7. Claude Code builds a part of section 7 only when its task says so. Where section 7 and an older section differ, section 7 is correct.

WARNING: Section 9 is the top bar that Arthur decided on 2026-11-15. It changes the bottom line of the wall in section 7.4, the top bar in section 7.5, and the translation switch in section 8.5. Task 22 in `docs/TASKS.md` builds section 9. Where section 9 and an older section differ, section 9 is correct.

Section 10 is the text size that Arthur decided on 2026-11-16. Task 24 in `docs/TASKS.md` builds it. It adds one control to the top bar and one row to the menu panel of section 9.

Section 11 is the red letters that Arthur decided on 2026-11-16. Tasks 26 and 27 in `docs/TASKS.md` build it. It changes the word on the control of section 10.4 to "Text", and it adds one sentence to the rule of section 8.1.

Section 12 is the name "Bible Wall" and the icon that Arthur decided on 2026-11-16. Task 28 in `docs/TASKS.md` builds it.

## 1. Goal

The reader feels that they are inside the Bible. The reference is "The Long Light" template from scrolltide.co: a real 3D book on a sunlit linen table, pages that curl when you drag them, and a layered paper-cut scene on each spread. Use the idea. Do not copy the template's code, text, or art.

The site keeps the nine categories from a wall image that Arthur likes. The categories make the Bible easier to understand for a new reader.

## 2. The nine categories

"History" occurs two times: one group in the Old Testament and Acts in the New Testament. This gives ten groups in nine categories.

| Group | Books | Cloth color | Text color on cloth |
|---|---|---|---|
| Law | Genesis to Deuteronomy | `#A3214F` | `#F7ECD3` |
| History | Joshua to Esther | `#7E1F26` | `#F7ECD3` |
| Poetry & Wisdom | Job to Song of Solomon | `#A44A22` | `#F7ECD3` |
| Major Prophets | Isaiah to Daniel | `#C89A2B` | `#2A1E0A` |
| Minor Prophets | Hosea to Malachi | `#566829` | `#F7ECD3` |
| Gospels | Matthew to John | `#FBF6EA` | `#2A1E0A` |
| History (Acts) | Acts | `#5C6063` | `#F7ECD3` |
| Letters of Paul | Romans to Philemon | `#1F3350` | `#F7ECD3` |
| General Letters | Hebrews to Jude | `#4B2E63` | `#F7ECD3` |
| Prophecy | Revelation | `#8A5579` | `#F7ECD3` |

Hebrews is in General Letters, as on the wall image.

## 3. Shared look

- Table surface: linen. Base `#E7DCC6`, light `#F6EEDD` from the top left, shade `#D8C9AD` at the bottom right. Sunlight comes from the top left. Shadows fall to the bottom right.
- Ink: `#2A1E12`. Secondary ink: `#4A3B2A`. Rule lines: `#B9A888`. Gold on covers: `#F3DDA0`.
- Fonts: Cormorant Garamond for titles and spines. Newsreader for body text. Load them from Google Fonts or bundle them.
- Text contrast: minimum 4.5 to 1. Minimum 3 to 1 for text of 24 px or larger.
- Controls: minimum 44 px touch size. Real `button` and `a` elements. Keyboard access for each action.
- Exception to the 44 px size: the spines on the table page in the wide layout. Arthur decided this on 2026-11-13. See section 4.1.
- Motion: obey `prefers-reduced-motion`. With reduced motion, replace each 3D move with a cross-fade.

## 4. Pages

### 4.1 Table (landing page, mockup D1)

- Title "Books of the Bible".
- Five stacks. The stack sizes are 13, 14, 12, 14, 13 books in Bible order. This is the column layout of the wall image.
  - Stack 1: Genesis to 1 Chronicles.
  - Stack 2: 2 Chronicles to Daniel.
  - Stack 3: Hosea to Malachi.
  - Stack 4: Matthew to 2 Thessalonians.
  - Stack 5: 1 Timothy to Revelation.
- Each spine shows the book name in capitals in its category colors.
- Spine thickness follows the number of chapters. Mockup rule: `26 + 3.2 * sqrt(chapters)` px, with 40 px at least. The minimum comes from POLISH.md items 3 and 13, which Arthur approved on 2026-11-14: each spine is 24 px or more on screen at 1440 by 900 px.
- Each spine has a small sideways offset so that the stack looks real.
- A legend below the stacks lists the ten groups. Select a group to light its spines and dim the others. Select it again to clear.
- Select a spine: the book slides out of the stack and lands on the table as the cover page.
- Two layouts, selected by screen width. The limit is 900 px. Arthur moved it from 768 px on 2026-11-14, because the spine names were hard to read between 768 and 900 px.
  - Wide layout, 900 px or more: five stacks in one view, as in mockup D1. The spines can be thinner than 44 px, but each spine is 24 px or more on screen at 1440 by 900 px. This is the one permitted exception to the 44 px size.
  - Narrow layout, below 900 px: one stack at a time with spines of 44 px or more. Move between stacks by swipe. Task 9 builds this layout.
  - In the narrow layout, the table page has flat spines and no 3D scene. A legend group moves the view to the first stack that has a book of that group.
- One function in the code decides which layout applies. No other code tests the screen width. Reason: design fixes will follow, and the rule can change, for example to a test of the input type. A wide touch screen gets the wide layout with thin spines for now. This is a known limit.

### 4.2 Cover (book page, mockup D2)

- The closed book lies on the table at an angle. Cloth in the category color, gold frame, book name, group name, number of chapters.
- Button "Open the book". The book opens to chapter 1.
- Below the book: three short facts.
  - Author.
  - Written: when and where.
  - What it is: one or two sentences of context.
- A chapter list. Select a chapter to open the book at that spread.
- Authorship rule, two layers. Arthur decided this on 2026-11-13.
  - Layer 1, on the cover: the Author fact and the Written fact give the traditional view only. Where tradition names no author, say so. The cover does not state the view of critical scholars.
  - Layer 2, the detail: a book that has a dispute shows a small "Scholars differ" control next to the fact. The control is always visible on that book. It opens a short detail with two parts: what critical scholars say, and what conservative scholars answer.
  - A book with no dispute has no control.
  - The detail hides nothing and adds nothing: each part needs a source.
  - The conservative part gives the view of the ESV Global Study Bible on that fact, with the reason from that page if the page gives one. For most books this is the traditional view. Where it differs from the older tradition, as for the date of Joshua, the part gives the view of the page and does not call it the tradition. Where the page gives no view on that fact, or gives two views and chooses neither, the detail has the critical part only.
  - Reason: with one layer, about 50 of the 66 covers showed a doubt about the author before chapter 1, and the conservative answer was not shown.

### 4.3 Spread (chapter page, mockup D3)

- The book is open on the table. Two pages.
- A scene covers the two pages. The text is on the right page for a short chapter. For a long chapter, the text scrolls on the right page, and the scene moves in parallax.
- Above the text: book name, chapter number, number of chapters.
- The chapter text keeps the section headings, the paragraphs, and the poetry lines of the source. It keeps the verse numbers.
- Footnotes in version 1: only the notes about manuscripts. These are the notes on Mark 16:8 and John 7:52, and the notes for the 16 verses that are not in the main text. A verse that is not in the main text shows its number and its note. The other footnotes are not in version 1.
- The chapter text must be readable on the scene at each time of day: a contrast of 4.5 to 1 or more. Use dark text on a light scene and light text on a dark scene.
- Drag a page corner, or use the arrow keys, to turn to the next or previous chapter. The page must curl.
- "Close the book" goes back to the cover.

### 4.4 Scenes

Arthur approved the nine subjects and these rules on 2026-11-14.

- Nine base scenes, one for each category. Each scene has four flat paper-cut layers that move in parallax.

| # | Category | Subject | Layers, from back to front |
|---|---|---|---|
| 1 | Law | A camp of tents in the wilderness below a mountain | sky; mountain; tents; rocks and scrub |
| 2 | History, with Acts | A walled city with a gate, and fields of grain | sky; hills; walled city with gate; fields |
| 3 | Poetry & Wisdom | A stream through grazing hills, with a tree by the water | sky; hills with a flock; tree; stream |
| 4 | Major Prophets | A watchtower on a hill above a great river | sky; river plain; watchtower; river bank |
| 5 | Minor Prophets | Farm country of vines and fig trees, with a threshing floor | sky; terraced hills; vines and figs; threshing floor |
| 6 | Gospels | A lake shore with fishing boats | sky; far hills; lake with boats; shore with nets |
| 7 | Letters of Paul | A Roman town where a church meets in a home | sky; tile roofs; houses with columns and an arch; street |
| 8 | General Letters | Travellers on a road through grassy hills, with wild flowers | sky with morning star; hills; road; flowers |
| 9 | Prophecy | Clouds with heaven opening in light, above an island coast | light; high clouds; clouds with a rainbow; island rocks |

- Scene 7 must look Roman, not Judean: columns, an arch, tile roofs. It must not look like the walled city of scene 2.
- Scenes 3, 5, and 8 all have hills. Give each a different main shape in front: the tree and stream, the vines and threshing floor, the road.
- The time of day follows the position of the chapter in its book. The first chapter is dawn. The middle of the book is day. The last chapters are dusk, and the last chapter is night. The change from chapter to chapter is gradual. A book with one chapter is day. Reason: in the reference, each spread is a later hour of one day, so the reader feels the day pass through the book.
- Stars show only at night and at dawn.
- The colors of a scene are near the cloth color of its group. Exception: the water of the Gospels scene is blue at each time of day. POLISH.md item 7, approved by Arthur on 2026-11-14.
- A fixed number from the book and the chapter sets small shifts of each layer. The same chapter always gives the same scene.
- No person that a reader can identify. Small plain figures are permitted, for example the travellers in scene 8 and the flock in scene 3.
- No scene is specific to the content of a chapter in version 1. Three books do not fit their scene: Obadiah, Jonah, and Jude. This is accepted for version 1.

### 4.5 Links, travel, and trail

- A passage with a link has a visible mark in the text.
- Links come only from the three approved sources. No person and no agent adds a link by hand. If the sources have no link between two passages, the site has no link between them. Arthur decided this on 2026-11-14.

| Source | Gives | Type of link |
|---|---|---|
| Bible Quotation Database, public domain | Places where one passage quotes a different passage, or comes close to it | Quotation link if the fit is "quote". Echo link if the fit is "close" or "weak". See the fit rule below. |
| OpenBible.info cross-references, CC BY 4.0 | Passages that share a theme, an event, a person, or wording | Echo link |
| Cross-reference lines in the Berean Standard Bible files, public domain | Passages that the publisher lists under a section heading | Echo link, on the section heading |

- The fit rule. Arthur decided this on 2026-11-14. Each link from the Bible Quotation Database has a fit label.
  - Fit "quote": the later passage repeats the words of the earlier passage in the Berean Standard Bible, or names it clearly. The link is a quotation link: strong mark, with a reason line.
  - Fit "close" or "weak": the two passages share a short phrase, one word, a theme, or the same statement in other words. The link is an echo link: light mark, no reason line.
  - No link is removed. Only the type changes. Reason: the strong mark tells the reader "this passage quotes that passage". The reader must be able to see the quotation in the text.
- If two sources give the same pair of passages, the link is one link. A quotation link takes priority over an echo link. If an echo link overlaps a quotation link at its two ends, the site shows only the quotation link.
- Details of the limit and the lists, as built and approved on 2026-11-14:
  - "1 marked verse for each 5 verses" rounds up.
  - The limit counts only OpenBible.info links. Quotation links and links from the Berean files do not count.
  - An OpenBible.info row and its reverse count as one link.
  - An OpenBible.info row where a verse links to a passage that starts at the same verse is not used.
  - A cross-reference line that names whole books links to the start of the first book.
  - In the read-with list, on a tie, the chapter with more links comes first, then Bible order. A link counts in the chapter of its first verse.
  - When an OpenBible.info row and its reverse merge into one link, the link has the higher of the two vote counts.
  - The fit rule reads only the main text of the Berean Standard Bible. It does not read the footnotes. So the links that end at Mark 9:44 and Mark 15:28 are echo links.
  - An echo link from the Bible Quotation Database stays on the site also when it shares no words with its linked verse. No link is removed.
  - Where the fit rule cannot decide a link, the link keeps the fit label that it has.
- A link shows at its two ends. Example: Hebrews 9:20 shows the link to Exodus 24:8, and Exodus 24:8 shows the link to Hebrews 9:20.
- The OpenBible.info set is very large: 301,574 links. The site shows only its strongest links as marks in the text, so that the text is not full of marks. Arthur approved this limit on 2026-11-14:
  - a link needs 20 votes or more;
  - a chapter has 1 marked verse for each 5 verses, and 2 as a minimum;
  - a verse has 2 links as a maximum;
  - the strongest links come first.
- A link with zero votes or fewer is not used for a mark or for the read-with list.
- The read-with list. Arthur approved it on 2026-11-14.
  - What it is: a short list at the top of each chapter, with the heading "Read with". It names the chapters in other books that share the most cross-references with this chapter. Each entry is a control for travel to that chapter.
  - How it is made: by arithmetic from the OpenBible.info set. For this chapter and each chapter in a different book, add the votes of all links between the two chapters. Use only links with 1 vote or more. Take the 5 chapters with the highest sums. A chapter needs 3 links or more to be in the list. No person and no agent chooses an entry.
  - A small line under the list names OpenBible.info as the source of the list.
  - Reason: the votes measure one verse against one verse. The data has 47 links between Hebrews 9 and Leviticus 16 or Numbers 19, each with 2 to 21 votes. The limit for marks removes all of them. The tie is between the chapters, and the read-with list shows it.
  - A chapter with no entry has no list.
- Quotation links have a strong mark. Echo links have a light mark. The reader can switch echo links off.
- Select a mark: a pop-up shows the reference and the text of the linked passage.
- The pop-up for a quotation link also shows a reason line: one line that says why the linked passage matters here. The pop-up for an echo link has no reason line in version 1. Reason: the reason line is interpretation, and each reason line must be checked.
- The pop-up has two actions: "Go there" and "Stay here".
- "Go there" is travel. The current book closes, the linked book comes onto the table, and it opens at the linked passage. The move must show that the reader crossed the Bible.
- The trail is always on screen after the first travel. Each stop is a control. Select a stop to go back to it in one step.
- Reason: existing apps show only the reference. A new reader does not know the linked passage, so the reference means little. Example: Hebrews 9 is hard to read without Leviticus 16, Exodus 24, and Numbers 19.
- Known result of the sources rule: the quotation data links Hebrews 9 to Exodus 24:8 and Isaiah 53:12. A link from Hebrews 9 to Leviticus 16 or Numbers 19 can be an echo link only, and only if the cross-reference data has it.

### 4.6 Timeline

Arthur decided the two bands on 2026-11-14.

- The timeline is one page on the linen table. It shows when each book was written, by the traditional view.
- Two bands, one above the other. Each band has its own time scale and its own axis with years.
  - Band 1: the 39 books of the Old Testament.
  - Band 2: the 27 books of the New Testament.
  - Reason: by the traditional dates, the Old Testament books cover about 1,000 years and the New Testament books cover about 50 years. On one scale, the New Testament is one thin line.
- Between the bands, a short line says how many years are between the two bands. Count from the end of the last range in band 1 to the start of the first range in band 2. Name no book in the line. The words are: "About N years or more with no books". Arthur approved these words on 2026-11-15, for the break of section 7.8. They replace the words of the first build. Compute N from the dates. Do not write it by hand.
- Each book is a spine in its category colors, as on the table page. It stands at its date of writing.
- The date of a book comes from the Written fact of its cover in `public/data/intros.json`. The timeline uses the traditional view only. It needs no new research.
  - A fact that gives one year: the spine stands at that year.
  - A fact that gives a range or a century: the spine stands at the middle, and a thin bar under it shows the range.
  - A fact that gives no date: the book goes in a group named "Date not known" at the end of its band.
  - Rules for the words of a fact, as built and accepted on 2026-11-14: "early" and "late" are the halves of a century or a decade. "Mid" is the middle part. A decade is a range of 10 years. Two parts of the words make one range. "Soon after" a dated event gives the year of that event.
  - Where the words give a year and a century, the year leads. Example: Obadiah stands at 586 BC, as Lamentations does.
  - A limit in the words limits the range. "Before" a dated event cuts the end of the range at that year. Example: 2 Kings ends at 538 BC. Arthur decided this on 2026-11-14.
  - A book is not written before the last event that its Written fact names. The range starts at the year of that event. Example: Daniel starts at 536 BC. Arthur decided this on 2026-11-14.
  - Where a fact gives one date and says that a second date is "also possible", the first date leads. Example: Mark.
  - The time of a person is not a period, unless `public/data/periods.json` has an entry for it. Arthur decided on 2026-11-14 that the table gets no entry for the time of Moses, of Joshua, or of Solomon. So Genesis to Joshua, Psalms, and Ecclesiastes stay in "Date not known". Reason: the date of Moses is disputed, and the site does not choose years for it.
- Books with the same date stack, so that no spine covers a different spine.
- A book whose Written fact has a "Scholars differ" detail shows a small sign. The sign has a text label for screen readers. The detail itself stays on the cover.
- Arcs join two books that have one quotation link or more between them. Echo links give no arc. An arc is thicker when the two books have more quotation links: three steps of thickness.
- Select a book: its arcs stay, the other arcs dim, and a short list names the books that it quotes and the books that quote it, with the number of quotation links for each. The list is the text form of the arcs, for a reader who cannot see them.
- A second action on the selected book opens its cover.
- The legend of the ten groups is on the page, with the same select and clear behavior as on the table page.
- Each book is a real `a` or `button` with keyboard access. Obey the reduced-motion rule.
- Narrow layout, below 900 px: the books are a list in date order, in two parts, with no arcs. The list of quoted books still shows for a selected book. Task 9 can improve it.
- Travel can use the timeline as its map in a later version. This is not in version 1.

## 5. Bible text

- Translation in version 1: the Berean Standard Bible. It is in the public domain. The full text is bundled in the repository.
- Arthur decided on 2026-11-15 to add the King James Version as a second translation. Section 8 has the decisions.
- The page must show the name of the translation. From Task 43, the translation control of the top bar does this: it shows the short name, and its name for a screen reader has the full name. The translation list has the full name, one tap from the control. Arthur decided on 2026-11-18 to remove the full name that was to the right of the control "About this book": the top bar has the name already. No licence asks for the name at that place, and the Sources page gives the credit of each translation.
- The ESV is not in version 1. Arthur decided this on 2026-11-13. The ESV is his preferred translation, but it is not a requirement.
- Reason: the ESV is available only through the Crossway ESV API. The terms forbid a published access key, and the terms expect server-side code. A static site on GitHub Pages cannot hold the key.
- To add the ESV later, the site needs a small proxy that holds the key. Keep the text service behind one interface so that a second translation can be added without a change to the pages.

## 6. Not in version 1

- User accounts, notes, highlights.
- Search.
- Audio.
- The ESV and other translations. Exception: the King James Version, by section 8.
- Hand-designed scenes for specific chapters.
- Guided routes.

## 7. Redesign of 2026-11-14

Arthur decided each item in this section on 2026-11-14, in a design chat. The section covers two pages only: the first page and the reading page. Arthur said that the other pages and conventions come later.

### 7.1 Reason

- On the built spread at 1440 px, the text column is approximately 505 px wide. This is 35% of the screen width.
- On a phone, the reader must zoom, select, and zoom out on the stacks before the reader can read a chapter.
- Arthur's rule: the reader travels through the Bible, but there is no friction when the reader reads the Word.
- The rule that governs each choice: the text is the interface. The wall is how the reader moves. All other parts stay out of the way.

### 7.2 What goes and what stays

- These parts go: the 3D book, the page turn, the paper-cut scenes, the stacks of books, the linen table, and the cover as a page of its own.
- These parts stay, with no change to their content:
  - The ten groups in nine categories of section 2. The colors change. See section 7.3.
  - The Bible text rules of sections 4.3 and 5: headings, paragraphs, poetry lines, verse numbers, and only the manuscript footnotes.
  - The two-layer authorship rule of section 4.2 and the three facts of each introduction.
  - The rules for links, the read-with list, and the timeline in sections 4.5 and 4.6.
- Section 7.7 gives the look of the links, travel, the trail, and the read-with list on the reading page.
- Section 7.8 gives the look of the timeline, the quotation diagram, and the Sources page.

### 7.3 Colors and fonts

- Background: white, `#FFFFFF`. Ink: `#1D1D1F`. Secondary ink: `#6E6E73`.
- Each group has one color. The book names and the band of the group use it. The label in a band is white for all groups.

| Group | Color | Contrast with white |
|---|---|---|
| Law | `#C2255C` | 5.66 to 1 |
| History | `#B01E35` | 6.81 to 1 |
| Poetry & Wisdom | `#CD4C26` | 4.51 to 1 |
| Major Prophets | `#9D6E00` | 4.50 to 1 |
| Minor Prophets | `#667F19` | 4.55 to 1 |
| Gospels | `#26828B` | 4.52 to 1 |
| History (Acts) | `#6E6A66` | 5.36 to 1 |
| Letters of Paul | `#1B2A41` | 14.44 to 1 |
| General Letters | `#4B2E57` | 11.49 to 1 |
| Prophecy | `#986694` | 4.50 to 1 |

- The colors start from the wall photo. The Gospels are white on the photo. They are teal here, because the background is white.
- Each color has a contrast of 4.5 to 1 or more against white. This is the limit of section 3. Arthur decided this on 2026-11-14. The designer measured the contrast with the WCAG formula. Six colors are darker than the photo for this reason: Poetry & Wisdom, Major Prophets, Minor Prophets, Gospels, History (Acts), and Prophecy. Major Prophets is a bronze, not the yellow of the photo.
- NOT VERIFIED: the axe-core check was not run on these colors.
- Size of a control. Arthur decided this on 2026-11-14. Each control is 24 by 24 px or more, on all screens. This is the target size of WCAG 2.2. The 44 px size of section 3 does not apply to the book names on the wall, the marks, the margin labels, and the controls inside a line of text. The numbers of the chapter grid are 44 px high or more. On 2026-11-14, 43 of the 66 book names on a phone were below 44 px high in the prototype.
- Fonts:
  - Inter ExtraBold, weight 800, capitals: the book names on the wall and the book name in a chapter heading.
  - Inter: the bands, the controls, the section headings, and the verse numbers.
  - Lora: the Bible text.

### 7.4 The wall (first page)

"Wall" is the new name for the first page. It replaces the table.

- The wall shows the 66 book names in Bible order. A book name is the only control for a book. It has no box and no picture.
- Poster form: each name fills the width of its column, as on the wall photo. The length of the name sets its size. The space between letters has a limit, so that a short name such as "JOB" grows in size and does not spread too far.
- A band starts each group. The band is a solid bar in the group color with the group name in white capitals. There is no legend.
- The band has round corners of 3 px in each of its four places: the wall, the heading of a book on the reading page, the pop-up, and the Quotations page. Arthur decided this on 2026-11-16, from the sheet `docs/screenshots/band-design/band-corners.png`, over 0, 2, 4, and 6 px. Reason: the band was the only shape with sharp corners, and a larger corner makes it look like a button. Task 32 builds it.
- Two layouts, selected by screen width. One function in the code decides, as built. The limit stays at 900 px.
- Wide layout, 900 px or more: five columns with the book counts of section 4.1. All 66 names and the bottom line fit in one view at 1440 by 900 px.
- Narrow layout, below 900 px: each group is a block. A band is at the top of the block, and the names are in two columns below it. The wall is 520 px wide at most, in the center. NOT VERIFIED: the designer tested the narrow layout at 390 px wide only. The prototype has its limit at 700 px.
- Each book name is 24 px high or more.
- A line at the bottom of the wall has the name of the translation and the links to the pages of the Reference section. Section 9.3 replaces this line with a top bar, and puts the wall in the center of the space below the bar.
- On a phone, the names of a block are divided so that the two columns have almost the same height. A group with one book fills the full width. Arthur decided this on 2026-11-14.
- The wall has no title.
- Hover on a book name: an underline in the group color. The name keeps its full color. Arthur decided this on 2026-11-14. Reason: the fade to opacity 0.62 of the prototype puts each group color below 4.5 to 1 on white, from 2.34 to 4.28 to 1.

### 7.5 The reading page

"Reading page" is the new name for the page with the chapter text. It replaces the spread.

- A tap on a book name opens the text. There is no page between the wall and the text. The text opens at chapter 1 on the first visit to a book, and at the last-read chapter of that book after that.
- One column, on desktop and on a phone. On desktop the column is 700 px wide, which is approximately 70 characters in a line. The reader scrolls.
- The heading of a book: the band of the group, then the book name in Inter ExtraBold capitals, then the chapter number in a light weight. All three are in the group color.
- The heading of a later chapter in the same scroll: the book name and the chapter number at a smaller size, with no band.
- The verse numbers are in the group color.
- The introduction: one control below the book heading, "About this book". It opens the three facts: What it is, Author, Written. "Scholars differ" opens the detail of section 4.2. The "Draft" label shows there until Arthur approves the introduction.
- The cross-reference line of the Berean Standard Bible files shows as a small line below its section heading.
- A thin bar stays at the top. Section 9.4 adds the translation control to this bar, and changes the bar in the narrow layout. It has two controls:
  - "Books" goes back to the wall.
  - The book name and chapter number open a grid of the chapter numbers of that book. A tap on a number opens that chapter.

### 7.6 Movement

- Continuous scroll: the next chapter follows the current chapter on the same page. At the end of a book, the next book starts with its band, its name, and its color.
- The bar at the top and the page address change to the chapter in view.
- A small link above the first heading opens the chapter before.
- The book name moves from the wall into the heading, and back, in browsers that support this move. Other browsers get a cross-fade. Obey `prefers-reduced-motion`.

- The addresses of the pages. The designer selected them on 2026-11-14. They keep the built addresses where a built page has a new page.

| Address | Page |
|---|---|
| `#/` | The wall. |
| `#/book/<id>` | The reading page at the last-read chapter of the book, or at chapter 1. |
| `#/book/<id>/<chapter>` | The reading page at that chapter. |
| `#/book/<id>/<chapter>/<verse>` | The reading page at that verse. Travel uses this address. |
| `#/timeline` | The timeline. |
| `#/quotations` | The quotation diagram. |
| `#/sources` | The Sources page. |

- When the reader scrolls to a different chapter, the address changes to that chapter. The change adds no entry to the browser history.

### 7.7 Links on the reading page

Arthur decided on 2026-11-14 to design the links before the build. The rules of section 4.5 have no change: the sources, the fit rule, the limit for marks, and how the read-with list is made. This section gives only the look.

- One rule for all link controls: a control has the color of the group that it goes to. Example: a link from Hebrews to Exodus is in the Law color.
- Marks. A quotation link is a solid dot. An echo link is a ring. A mark stays on the line of its verse number.
- Where the links are. Arthur decided this on 2026-11-14.
  - Wide screen: the text has no marks. The right margin shows each link as a label, on the line of its verse: the verse number, the dot or ring, and the reference of the linked passage. Where two labels meet, the lower label moves down.
  - Narrow screen: the marks are in the text, after the verse number.
  - The margin labels start at a width of 1180 px. Below that width, the marks are in the text. The limit is a value of the designer.
- The cross-reference line below a section heading is a set of controls, one for each linked passage.
  - Arthur decided this on 2026-11-14. The line shows as the Berean Standard Bible files give it, for example "(Exodus 40:1–33; Acts 7:44–47)". Each reference that has a link is a control. A reference with no link is plain text.
  - In the pop-up of a control in this line, the reference shows as the line gives it, for example "Exodus 40:1–33".
  - Arthur decided this on 2026-11-14. The text in that pop-up is every verse of the passage that the line names, as for other links. For a reference to whole chapters or whole books, the text is the first verse, with the label "First verse". The text area of the pop-up keeps a maximum height, and a long passage scrolls inside it.
- Pop-up. A tap on a mark, a label, or a section control opens it. It shows: the band of the linked group, the reference in capitals, the type of link and the passage that it comes from, the text of the linked passage, the reason line for a quotation link, the source, and the actions "Go there" and "Stay here". On a wide screen, it opens near the control. On a narrow screen, it opens from the bottom of the screen.
  - The side on a wide screen, which Arthur decided on 2026-11-15: the pop-up opens below the control when all of its content fits there. If the content does not fit below, and the space above is larger, the pop-up opens above the control. Reason: the label of section 8.4 makes the pop-up taller, and the button "Go there" was half visible in some positions. Task 21b has the rule.
  - The pop-up opens before the text of the passage arrives. When the text arrives, the pop-up can move one time from below the control to above it. Arthur decided on 2026-11-15 to keep this as built. The site adds no wait before the pop-up shows.
- Travel. "Go there" opens the linked chapter at the linked verse. The change is direct, with no move between the two pages. The paragraph of the linked verse has a light background for a short time. Arthur decided this on 2026-11-14.
  - The line in section 4.5 that says "The move must show that the reader crossed the Bible" does not apply to the redesign. Arthur said that he did not miss this move.
  - Arthur's rule: after "Go there", the reader must have a way to get back.
- Trail. After the first travel, a thin line below the top bar lists the stops. Each stop is a control in the color of its group. The last stop is the current stop, and it has an underline.
  - The way back: when the trail has two stops or more, the trail starts with the control "Back". "Back" opens the stop before the last stop, at its verse, and removes the last stop.
  - Arthur decided this on 2026-11-14. The trail changes only by travel: "Go there", a read-with entry, or a stop in the trail. The Back control of the browser, the chapter grid, and a scroll do not change the trail on a reading page.
  - Arthur decided these rules on 2026-11-16, after he found two faults of the trail as built. Task 23 builds them.
    - When the reader selects a stop in the trail, the stops after it are removed. Example: the trail is "Matthew 1 > Romans 1:16 > Mark 8:38". The reader selects "Romans 1:16": the trail is "Matthew 1 > Romans 1:16". The reader selects "Matthew 1": the trail is "Matthew 1".
    - A trail with one stop shows that stop, with no "Back".
    - The trail clears when the wall opens, by each way to the wall: "Books", the Back control of the browser, a link, or the address.
    - A page of the Reference section does not clear the trail. A reload does not clear the trail.
    - A travel from a place that is not the last stop adds that place and then the target. This is as built, and it is a true record: the reader went to that place by the chapter grid, by a scroll, or by the Back control of the browser.
- Read-with list. One line below the chapter heading, with the label "Read with". Each entry is a control for travel to that chapter. The source line "From OpenBible.info" is at the end.
- Echo links. A control at the right of the top bar switches the echo links on and off.

### 7.8 Reference section

Arthur decided the three items of this section on 2026-11-14. The design of the pages is not complete.

- The timeline, the quotation diagram, and the Sources page are one section. The working name of the section is "Reference". The working names of the pages are "Timeline", "Quotations", and "Sources".
- The timeline and the quotation links are two pages.
  - The timeline shows only when each book was written. It has no arcs.
  - The quotation diagram shows which books quote which books. Arthur gave the hierarchical edge bundling diagram of D3 as the model: the 66 books are around a circle, in their groups, and curved lines join the books that have quotation links.
- The timeline has no "Date not known" group. This replaces the decision of 2026-11-14 in section 4.6. A book with no exact date stands at an estimate and has a mark for the estimate. Arthur said on 2026-11-14 that the mark is an asterisk only if an asterisk is the best option.
  - The mark that the designer selected: the name is in light letters, weight 500, where the other names have weight 800. Its range bar is a dashed line, or its dot is an open dot. On a narrow screen, the date text ends with the word "estimate". A line on the page says that a name in light letters has an estimated date. For a screen reader, the name has the words "estimated date".
  - Before Task 17, 17 books were in "Date not known" in `public/data/dates.json`. Task 17 replaced that group with the estimates that Arthur approved in `docs/TIMELINE-ESTIMATES.md`.
  - For 8 of them, the Written fact has a year: Judges, Ruth, Ezra, Zechariah, Luke, Hebrews, 2 John, and 3 John. The estimate can use that year by a rule. It needs no new fact. In the prototype, the estimate is the one year that the fact gives. This rule is a value of the designer.
  - For 9 of them, the Written fact has no year: Genesis, Exodus, Leviticus, Numbers, Deuteronomy, Joshua, Job, Psalms, and Ecclesiastes. The estimate needs years for the time of Moses, of Joshua, of Solomon, and of Ezra. These years must come from an approved source, and Arthur must approve them. NOT VERIFIED: the designer's sketches use years from memory for these 9 books.
- The form of the timeline on a wide screen. Arthur decided this on 2026-11-14. One line with a break. The Old Testament books have one scale. A mark on the line shows the years with no books. A text below the mark gives the words "About N years or more with no books". Arthur approved these words on 2026-11-15. N is computed from the dates by the rule of section 4.6. With the dates of Task 17, N is 370. The narrow layout uses the same words in its break row. The New Testament books have a larger scale. Each book name is a control that opens the book. A thin bar under a name shows a range of years.
- The timeline on a narrow screen: a list in date order. The break is one line in the list.
- The quotation diagram in the prototype. These details are values of the designer, without a decision by Arthur:
  - The color of a line goes from the color of the book that quotes to the color of the book that it quotes. Three steps of thickness show the number of quotation links.
  - A tap on a book name lights its lines, dims the other lines, and shows a list: the books that it quotes and the books that quote it, with the number of quotation links for each. The list is the text form of the lines. A control in the list opens the book.
  - On a narrow screen, a list control selects the book, because the names around the circle are small.
- The quotation diagram on the site. Arthur decided these three rules on 2026-11-14.
  - Gray names. When a book is selected, a book name with no line to the selected book keeps full opacity and has the color #6E6E73. This replaces the faded names of the prototype.
  - The first sentence of the Quotations page is "Which books of the New Testament quote which books of the Old Testament."
  - The size of the book names in the narrow diagram. In the narrow layout, a book name is smaller than the target size of 24 px. This is accepted, because the list control above the diagram selects the same book at 44 px. This is the exception "Equivalent" of WCAG 2.5.8. The accessibility test accepts it by the attribute `data-target-equivalent`.
- The date text of an estimate. Arthur decided this rule on 2026-11-15. A date text keeps the limit word of its fact, and it keeps "about" where the fact has it. Eight books have such a text: Judges "by 970 BC", Ruth "after about 1010 BC", Job "by 600 BC", Zechariah "from about 520 BC", Luke "about AD 62 or later", Hebrews "before AD 70", 2 John "by AD 99", and 3 John "by AD 99". Job's text is from Arthur's decision of 2026-11-14. Its year comes from Easton, not from the Written fact. The other dates show their years. `docs/CONTENT-SOURCES.md`, section "Estimates", gives the fact of each text.
- The links to the section in the prototype: a line at the bottom of the wall has the name of the translation and the links "Timeline", "Quotations", and "Sources". The top bar of each Reference page has "Books" and the three page names. This is a value of the designer.
- The timeline shows no ring where scholars differ on the date. Arthur decided this on 2026-11-14. This replaces the sign of section 4.6. Reason: 47 of the 66 books have a "Scholars differ" detail for the date, so the sign tells the reader very little. One line below the timeline says that scholars differ on many dates, and that "About this book" gives the detail.
- The fonts section of the Sources page credits Inter and Lora, with their copyright lines and their licences. Task 17 changes it when it removes the fonts of the first build.

### 7.9 Prototype

- A working prototype of sections 7.3 to 7.8 is the Claude artifact "Bible wall prototype". A copy is in `docs/prototype/`. Read `docs/prototype/README.md` first. It uses the real text, links, and introductions from `public/data/`.
- Screenshots of the prototype are in `docs/screenshots/redesign/`.
- The prototype is plain HTML and JavaScript in one file. It is a reference for the look and the movement. It is not code for the site.
- Selected by the designer for the prototype, without a decision by Arthur: the chapter grid, the link to the chapter before, the move of the book name, the size values, and the details of section 7.7 that have no date.

### 7.10 Open items

1. The estimates for the 17 books on the timeline. Task 16 in `docs/TASKS.md` proposes them, and Arthur approves them.
2. The narrow layout between 520 and 900 px wide. The designer did not test it. Task 12 reports on it.
3. The bookmark and last-read idea is item 4 of `docs/BACKLOG.md`. The last-read chapter of each book is part of section 7.5 and is not a backlog idea.
4. A check on a real phone.
5. The keyboard focus after "Back" in the trail. When "Back" leaves one stop, the control "Back" goes away, and no control has the focus. A keyboard user must start again from "Books". The fault is older than Task 23. The designer confirmed it on the build of Task 23, at 1440 by 900 px and at 390 by 844 px. Arthur decided on 2026-11-16 to keep this as built. A possible correction for a later task: the focus goes to the last stop of the trail.

## 8. The King James Version

Arthur decided this section on 2026-11-15. The evidence is in `docs/reviews/task-19-kjv-report.md`. Tasks 20 and 21 in `docs/TASKS.md` build it.

### 8.1 The rule

- The King James Version is a second translation of the site, beside the Berean Standard Bible.
- A translation changes only the words. From section 11, the marks of the words of Jesus go with the words: each translation has its own red letters. The reading page of the King James Version shows the section headings and the cross-reference lines of the Berean files above the words of the King James Version.
- The links, the read-with lists, the introductions, and the dates are the same for the two translations.
- The site writes no new content for the King James Version.
- The publisher of the Berean Standard Bible uses the same rule in its own file of the King James Version, `https://openbible.com/docx/kjv.docx`. The site does not use that file. The file is evidence only.

### 8.2 The words

- Source: edition A of the report. It is the standardized text of 1769 from eBible.org, `https://eBible.org/Scriptures/eng-kjv2006_usfm.zip`. The pages of eBible.org state "Public Domain". The record is in section 9 of `docs/DATA-SOURCES.md`.
- The site does not change a word of the source.
- One exception, which Arthur decided on 2026-11-15: in 13 verses, the source splits one word into two, for example "can not" in 2 Timothy 2:13. The Strong's numbers of the source cause the split. The site joins the word in these 13 verses. The change removes a space and changes no letter. Task 20b has the list.
- The site does not show these parts of the source files: the Strong's numbers, the footnotes, the paragraph signs "¶", the marks for the words of Jesus, the paragraphs and the poetry lines, and the `\s1` lines. The `\s1` lines are the letter headings of Psalm 119 and the lines at the end of 14 letters.
- The words that the translators added show in italics, as in a printed copy. The source marks them with `\add`.
- A Psalm title is in italics on the site. In a Psalm title, the added words show upright, so that the reader can see them.
- In the pop-up, all the words of a verse are upright, and a Psalm title is part of verse 1. So the pop-up shows a Psalm title upright, with its added words in italics. Arthur decided on 2026-11-15 to keep this as built.
- A Psalm title of the source is a `\d` line. It shows as the title of its Psalm, where the Berean data has the title of that Psalm.
- The King James Version has words for the 16 verses that the main text of the Berean Standard Bible does not have. The King James Version pages show these verses as text, with no note.

### 8.3 The structure

The structure of each chapter comes from the Berean data in `public/data/text/`.

- Section headings: the same headings before the same verses. Exception: the King James Version pages do not show the 37 speaker headings of the Song of Solomon. Six of them are in the middle of a verse, and a set with holes misleads the reader.
- Cross-reference lines: the same lines at the same places.
- Text blocks: a text block of the King James Version has the style of its Berean block, and it holds the verses that start in that Berean block. The words of a verse are never cut. A Berean block in which no verse starts has no block in the King James Version. So a poetry verse shows as one line, and a paragraph starts only at the start of a verse.
- Blank lines between stanzas: the same as in the Berean data.
- Notes: the King James Version pages show no footnote and no manuscript note.

### 8.4 Links and reason lines

- The King James Version pages show the same marks, margin labels, and pop-ups. The pop-up shows the linked passage in the translation that the reader reads.
- The reason line of a quotation link quotes words of the Berean Standard Bible. On the King James Version pages, the reason line shows unchanged, with a short label that the quoted words are from the Berean Standard Bible. The label: "The quoted words are from the Berean Standard Bible."

### 8.5 The translation switch

Arthur decided this on 2026-11-15, from renders of three options. The renders are in `docs/screenshots/kjv-design/`.

Sections 9.3 to 9.5 replace the form and the two places of the translation switch: the reader selects the translation in the translation list, which opens from the top bar of the reading page. The rules of this section for the storage, the first visit, the address of a page, and the verse at the top of the page stay.

- The translation switch is a control with the two full names: "Berean Standard Bible" and "King James Version". The selected name has the ink color and an underline. The other name has the secondary ink color.
- The switch is in two places: in the line at the bottom of the wall, and at the top of the panel of the chapter grid on the reading page. A line separates it from the chapter grid.
- The top bar does not change. Reason: at 390 px wide, the top bar has no space for a switch.
- The site keeps the selection in the storage of the browser. The first visit shows the Berean Standard Bible.
- The translation is not in the address of a page. A link to a chapter opens in the translation that the reader selected.
- When the reader changes the translation on the reading page, the panel closes and the verse at the top of the page stays at the same place.
- Selected by the designer, without a decision by Arthur: the sizes and the spaces of the switch, and the words of the label in section 8.4.

### 8.6 The credit on the Sources page

- The Sources page names the source of the King James Version, its public-domain statement, and the right to print in the United Kingdom, from `sources/kjv/copr.htm`.
- The page states what the site does not show from the source files, and the exception of section 8.2.
- From Task 31b, the page names each kind of line of the source files that the site does not show: the title lines of the books, the names of the Hebrew letters in Psalm 119, and the line at the end of 14 letters. It names the paragraph signs also. Arthur decided this on 2026-11-16, after the accuracy reviewer of Task 31 found the gap. The lines of the file head with the name of the book are not in the list: the site names the book from its own list of books.
- The page states that the section headings, the cross-reference lines, the paragraphs, and the lines of poetry on the King James Version pages are those of the Berean Standard Bible files, and that they are not part of the King James Version. The page does not give the King James Version pages the Berean name.

### 8.7 Not decided

1. Arthur asked the Berean publisher on 2026-11-15 if the site can use its set of headings for the King James Version. This section does not wait for an answer.
2. On a phone, the top bar of the reading page breaks into two lines for five long book names. The designer found this on 2026-11-15. It is a fault of the site before the King James Version. Section 9.4 corrects it, and Task 22 builds the correction.

## 9. The top bar of 2026-11-15

Arthur decided this section on 2026-11-15, from renders. The renders are in `docs/screenshots/bar-design/`: the wall at 1440 by 900 px, at 1920 by 1080 px, and at 390 by 844 px, and the reading page at 1440 by 900 px and at 390 by 844 px. The renders are a sketch on the built site of Task 21b. Task 22 in `docs/TASKS.md` builds this section.

### 9.1 Reason

- Arthur will add items to the line at the bottom of the wall. A bar at the top has a place for them.
- On a phone, the reader must scroll to the bottom of the wall to change the translation.
- The site will possibly get more translations at a later time. A row of full names has space for two names only.
- The reader changes the translation on the page that shows the words.

### 9.2 The rule

- The wall and the reading page each have a top bar. The bar is 52 px high. It has the look of the top bar of the reading page as built. It stays at the top of the window when the reader scrolls.
- The bar has three parts: left, center, and right.
- In the wide layout, the right part shows its items. In the narrow layout, the right part is one control with the word "Menu".
- `src/screenLayout.ts` decides the layout, as built. The limit stays at 900 px.

### 9.3 The wall

- The line at the bottom of the wall is removed.
- The wall has no translation control. Arthur decided this on 2026-11-15. Reason: the wall shows only the book names, and the book names are the same in each translation.
- Wide layout: the right part of the bar has the links "Timeline", "Quotations", and "Sources". The left part and the center are empty.
- Narrow layout: the right part of the bar has "Menu". The left part and the center are empty.
- Wide layout: the wall is in the center of the space below the bar. The space above the columns is equal to the space below them, and each is 24 px or more. When the window is lower than the bar and the wall together, the wall starts 24 px below the bar and the page scrolls.
- Measured in the sketch: the columns are 761 px high. At 1440 by 900 px, the space is 44 px above and below, and the bar and all 66 names are in one view. At 1920 by 1080 px, the space is 134 px above and below.
- Narrow layout: the wall starts below the bar and the page scrolls, as built.
- When the page scrolls to a book name, the name stops below the bar.

### 9.4 The top bar of the reading page

- Left part: "Books", as built.
- Center: the control that opens the chapter grid, as built. Then a thin vertical line. Then the translation control.
- Right part, wide layout: the echo links switch, as built.
- Right part, narrow layout: "Menu".
- The translation control shows the short name of the selected translation and a caret. The short names are "BSB" and "KJV", and "WEB" from section 13. For a screen reader, the name of the control is the word "Translation", the full name, a comma, and the short name. Example: "Translation: Berean Standard Bible, BSB". The short name is not in parentheses: axe-core 4.14 removes text in parentheses before it compares the name with the words on the control. Arthur decided this name on 2026-11-16.
- Narrow layout: the control that opens the chapter grid shows the book name and the chapter number, without the word "Chapter". Example: "John 3". For a screen reader, its name is the same words, without the word "Chapter".
- In the two layouts, the text of that control in the page has a space character between its parts: "John Chapter 3" and "John 3". Then its name for a screen reader does not depend on the browser. The look does not change.
- Narrow layout: the bar is always one line. If the items do not fit, the book name ends with "…". "Books", the chapter number, the translation control, and "Menu" are never cut.
- Measured in the sketch: "2 Thessalonians 3" and "Song of Solomon 8" show with no cut at 390 px and at 375 px. At 360 px and at 320 px, the book name ends with "…".
- This corrects item 2 of section 8.7.
- The translation switch of section 8.5 is removed from the panel of the chapter grid. The panel has only the chapter grid.

### 9.5 The translation list

- The translation control opens the translation list.
- The list has one row for each translation, in the order of the translations in the code. A row has a place for a check mark, the full name, and the short name at the right in the secondary ink color.
- A row has the weight 500, as the renders show. The row of the selected translation has the check mark and the weight 600. The selection does not show by color only.
- Wide layout: the list is a pop-up below the control. It starts 4 px below the bar, 56 px from the top of the window. The render shows it at 48 px, where it covers the line of the bar. Arthur decided on 2026-11-16 to keep 56 px, as built. It is 340 px wide, with its center below the center of the control, and it stays 12 px or more from each side of the window. It is white, with round corners of 12 px and a shadow. A row is 44 px high. A row has a light gray background when the pointer is on it. The page has no shade. A click outside the list closes it.
- Narrow layout: the list is a panel below the bar, with the full width, and with the shade of the panel of the chapter grid. A row is 48 px high.
- When the reader selects a row, the list closes, the focus goes back to the translation control, and the page shows the words of that translation. The rule of section 8.5 for the verse at the top of the page applies. If the reader selects the translation that is already selected, the list closes and nothing changes.
- The storage, the first visit, and the address of a page are as in section 8.5.

### 9.6 "Menu"

- "Menu" is in the narrow layout only. It opens the menu panel: a panel below the bar, with the full width, and with the shade of the panel of the chapter grid. A row is 48 px high and has the weight 500.
- On the wall, the menu panel has three rows: "Timeline", "Quotations", and "Sources". Each row is a link to its page.
- On the reading page, the menu panel has the row "Echo links" with the word "On" or "Off" at the right, then a thin line, then the three links.
- The row "Echo links" is the echo links switch. A tap changes the state, and the panel stays open.
- This gives the narrow reading page links to the Reference section. The wide reading page has no such links. Arthur accepted this on 2026-11-15.
- The cost that Arthur accepted on 2026-11-15: in the narrow layout, the echo links switch is two taps away.

### 9.7 Rules for the three panels

The three panels are the panel of the chapter grid, the translation list, and the menu panel.

- Only one of them is open at a time. When one opens, the open one closes.
- When the layout changes between wide and narrow, the open panel closes. A panel does not open again without an action of the reader.
- The Escape key closes the open panel, and the focus goes back to the control that opened it. A tap on the shade closes it.
- The caret of a control points up when its panel is open, as the caret of the chapter grid control does.
- When the trail shows below the top bar, a panel starts below the trail, as the panel of the chapter grid does.
- Each control and each row is 24 by 24 px or more, shows the focus, and operates with the keyboard.
- The name of a control for a screen reader contains the words that the reader sees on the control. This is WCAG 2.5.3. Arthur decided this on 2026-11-16, after the axe-core check of Task 22 failed on the translation control. The rule applies to the translation control and to the control that opens the chapter grid.

### 9.8 Selected by the designer, without a decision by Arthur

- The sizes and the spaces of the bar, the list, and the menu panel.
- The words "Menu", "On", and "Off".
- The pop-up form of the translation list in the wide layout, and its panel form in the narrow layout.
- The empty left part and center of the bar of the wall.
- The words for a screen reader.

### 9.9 Not decided

1. The items that Arthur will add to the bar. He did not name them. The first item is the text size control of section 10.
2. More translations. Arthur decided on 2026-11-16 to add the World English Bible as a third translation. Section 13 has the decisions.
3. The top bar of the pages of the Reference section. It does not change in this section.
4. Links to the Reference section on the wide reading page.

## 10. The text size of 2026-11-16

Arthur decided this section on 2026-11-16, with no renders. He will look at the built site, and a size is easy to change. Task 24 in `docs/TASKS.md` builds this section.

### 10.1 Reason

- The size of the Bible text is fixed. On a phone, a reader has no good way to make it larger: a pinch makes the text wider than the screen.
- Arthur will share the site with church members. Some of them need larger text.

### 10.2 The three sizes

- The site has three text sizes: "Standard", "Large", and "Largest". "Standard" is the size before this section. The site has no smaller size. Arthur decided this.
- Each step adds 3 px to the Bible text.

| Text size | Narrow layout | Wide layout |
|---|---|---|
| Standard | 18 px | 21 px |
| Large | 21 px | 24 px |
| Largest | 24 px | 27 px |

- The first visit shows "Standard".
- With "Standard", each page looks exactly as before this section, apart from the new control.

### 10.3 What changes with the text size

- All text of a chapter below its heading area: the paragraphs, the poetry lines, the verse numbers, the section headings, the cross-reference line, and the notes. Each of them gets larger in the same proportion as the Bible text.
- In the pop-up: the passage text and the reason line, in the same proportion.

These do not change: the top bar, the trail, the three panels, the heading of a chapter with its band, "About this book" and the introduction, the name of the translation, the read-with list, the labels in the margin, the marks of the links, the other parts of the pop-up, the wall, and the pages of the Reference section.

### 10.4 The control

- Wide layout: the text size control is in the right part of the top bar of the reading page, to the left of the echo links switch. It shows the words "Text size" and a caret. It opens the text size list: a pop-up with three rows, with the look of the translation list. The row of the selected size has the check mark and the weight 600.
- Narrow layout: the menu panel of the reading page has the row "Text size", below the row "Echo links". The row has the words "Text size" and three controls with the names of the sizes. One tap selects a size, and the panel stays open. The selected size has the ink color, the weight 600, and a line below its name.
- The wall has no control for the text size.
- The name of each control for a screen reader contains the words that the reader sees, by the rule of section 9.7.

### 10.5 Rules

- The browser keeps the selection in its storage, with the key `bible-text-size`. One selection applies to the two layouts. The text size is not in the address of a page.
- When the reader changes the text size on the reading page, the verse at the top of the page stays at the same place, as for a change of the translation.
- In the wide layout, the labels in the margin stay on the lines of their verses after a change.
- The text size list is a fourth panel. The rules of section 9.7 apply to it.
- Section 11.5 changes the word on the control to "Text", and adds the row "Red letters" to its list. From then, the names are the text control and the text list.

### 10.6 Selected by the designer, without a decision by Arthur

- The names "Standard", "Large", and "Largest", and the words "Text size".
- The step of 3 px.
- The list of what changes in section 10.3.
- The form of the control in each layout.

### 10.7 Not decided

1. At 24 px on a phone, poetry lines break more. Arthur looks at the built site. If a size is wrong, the correction is one number.

## 11. Red letters of 2026-11-16

Arthur decided this section on 2026-11-16, from the report of Task 25 and from renders. The report is `docs/reviews/task-25-words-of-jesus-report.md`. The renders are in `docs/screenshots/red-design/`. Tasks 26 and 27 in `docs/TASKS.md` build this section.

### 11.1 Reason

- Many readers know Bibles that print the words of Jesus in red.
- The King James Version has no quotation marks. Red letters show where Jesus starts to speak and where He stops.
- The source files of the two translations have marks for the words of Jesus. The site writes no content for this.

### 11.2 Which words are red

- Each translation uses the marks of its own source files: `sources/bsb/usfm/` for the Berean Standard Bible, and `sources/kjv/usfm/` for the King James Version. The marker is `\wj`.
- So the rule of section 8.1 gets one addition: a translation changes the words, and the marks of the words of Jesus with them. All other structure stays that of the Berean data.
- The two sets give the same class to all but 46 of the 31,086 verses that the two have. In those 46 verses, each translation shows its own marks. The report lists them.
- The King James Version files mark 8 verses that the main text of the Berean Standard Bible does not have. They are red on the King James Version pages.
- No person and no agent adds a mark or removes a mark, with the one exception of section 11.3.
- The Berean files have 1,420 marks. 47 of them do not fit the words of the site exactly, because of spaces and the fault characters `[’’]`. The build puts each of them in place with a search that ignores the spaces and these characters. The site shows all 1,420 marks.
- The King James Version files have 2,038 marks. All of them fit the words of the site exactly.

### 11.3 One exception: Mark 12:37 in the King James Version

- The source file marks all words of the verse: "David therefore himself calleth him Lord; and whence is he then his son? And the common people heard him gladly."
- The last sentence, "And the common people heard him gladly.", is words of the writer.
- On the site, the mark ends after "his son?". The source file does not change. `docs/DATA-SOURCES.md` records the exception, as it records the 13 split words.

### 11.4 The look

- The color of red letters is `#8B1A1A`. Its contrast against white is 9.3 to 1. It is darker than each group color, so a reader does not mistake it for a link.
- Arthur selected this color on 2026-11-16, over the bright red `#C8102E`, which is almost the Law color `#C2255C`.
- Red letters show in the text of a chapter, and in the passage text of the pop-up.
- These do not become red: the verse numbers, which keep the color of their group, the marks and the labels of the links, the headings, the cross-reference lines, and the notes.
- The quotation marks that the Berean marks have inside them are red. The words that the King James Version translators added stay in italics, and are red inside a mark.
- With red letters off, all words have the ink color, as before this section.

### 11.5 The switch

- The reader switches red letters on and off with the red letters switch. The first visit has red letters on.
- Narrow layout: the menu panel of the reading page has the row "Red letters", with "On" or "Off" at the right, below the row "Text size". A tap changes the state, and the panel stays open.
- Wide layout: the control of section 10.4 now shows the word "Text", not "Text size". Its list has the three text sizes, then a thin line, then the row "Red letters" with "On" or "Off" at the right. A click on the row changes the state, and the list stays open.
- The names from this section: the control is the text control, and its list is the text list.
- The browser keeps the selection in its storage, with the key `bible-red-letters`. One selection applies to the two layouts and the two translations.

### 11.6 The credit on the Sources page

- The Sources page gets one paragraph: the red letters are the words of Jesus as the files of each translation mark them, the two translations differ in some verses, and the one exception of section 11.3.

### 11.7 Selected by the designer, without a decision by Arthur

- Red letters are on at the first visit.
- The place of the switch in each layout, and the word "Text" on the control.
- The list of what does not become red, in section 11.4.
- The form of the marks in the site data: Form A of the report.

### 11.8 Not decided and not checked

1. The report compares the two sets verse by verse. In the 613 verses where each set marks a part of the verse, no one compared the marked parts.
2. The designer found the fault of Mark 12:37 in a list of the report. No one searched all marks for a fault of the same kind.
3. No test with a reader who does not see red and green well. The switch gives black text.

## 12. The name and the icon of 2026-11-16

Arthur decided this section on 2026-11-16. The sheet of the icon options that he decided from is `docs/screenshots/icon-design/icon-options.png`. Task 28 in `docs/TASKS.md` builds this section.

### 12.1 The name

- The name of the site is "Bible Wall". Before this section, it was "Books of the Bible".
- Reason: "Books of the Bible" has 18 characters. It is too long for a browser tab on a phone, and for the label below an icon on a phone home screen. "Bible Wall" has 10 characters, it has the word "Bible", and it names the wall, which only this site has.
- No page shows the name to the eye. The name is in the title of the browser tab, in the label of a home screen icon, and in a hidden heading on the wall for a screen reader.
- The address of the site and the name of the repository do not change.
- The words "Books of the Bible" stay where they are the name of the wall image that Arthur likes, in the documents.

### 12.2 The title of the browser tab

- The wall: "Bible Wall".
- The reading page: the book name and the chapter number of the top bar, then " · ", then the name. Example: "John 3 · Bible Wall". The title follows the chapter of the top bar when the reader scrolls.
- The pages of the Reference section: "Timeline · Bible Wall", "Quotations · Bible Wall", and "Sources · Bible Wall".
- Each other page: "Bible Wall".
- Reason: on a phone, a tab shows only the start of its title. The place is the useful part.

### 12.3 The icon

- The icon is option B2 of the sheet: ten blocks in three columns, one block for each group, in Bible order and in the group colors of section 7.3, with white lines between them. The blocks fill a tile to its edges.
- It replaces the icon of Vite, the build tool, which came with the project setup.
- The blocks are on the pixel grid of a 16 px icon: the tile is 16 units wide, the columns are 5, 4, and 5 units wide, and each line is 1 unit.
- The designer made the files. They are in `public/`:

| File | Use |
|---|---|
| `favicon.svg` | The browser tab. The tile has round corners. |
| `favicon-32.png`, `favicon-16.png` | The browser tab, for a browser that does not use the SVG file. |
| `apple-touch-icon.png` | The home screen of an iPhone, 180 px. A full square: the phone cuts the corners. |
| `icon-192.png`, `icon-512.png` | The home screen of an Android phone. Full squares. |
| `icon-maskable-512.png` | An Android phone that cuts the icon to a circle. The blocks are smaller, on white, so that the circle cuts no block. |
| `manifest.webmanifest` | The name "Bible Wall" and the icons, for a phone home screen. |

- The manifest has `"display": "browser"`. A home screen icon opens the site in the browser, as a bookmark does. The site does not become an app with no browser controls.

### 12.4 Selected by the designer, without a decision by Arthur

- The titles of the browser tab in section 12.2, and the sign " · ".
- The hidden heading on the wall gets the new name.
- The files of section 12.3, the white color of the theme, and `"display": "browser"`.

### 12.5 Not checked

1. The designer made the icon images with Chrome. No one tested Safari, an iPhone, or an Android phone.
2. Two quick web searches on 2026-11-16 found no app or site with the name "Bible Wall". The search was not complete.

## 13. The World English Bible of 2026-11-16

Arthur decided this section on 2026-11-16, from the report of Task 29. The report is `docs/reviews/task-29-web-report.md`. The renders are in `docs/screenshots/web-design/`: the translation list with three rows at 1440 by 900 px and at 390 by 844 px, and the top bar with "WEB" at 390 px and at 375 px. The renders are a sketch on the built site of Task 28. Tasks 30 and 31 in `docs/TASKS.md` build this section.

### 13.1 The rule

- The World English Bible is a third translation of the site, beside the Berean Standard Bible and the King James Version.
- Arthur asked first for the New American Standard Bible. Its publisher permits no complete book of it on a site without written permission. So Arthur selected a translation in the public domain.
- The rule of section 8.1 applies: a translation changes only the words, and the words-of-Jesus marks with them. The reading page shows the section headings, the cross-reference lines, and the text blocks of the Berean data. The links, the read-with lists, the introductions, and the dates are the same for each translation. The site writes no new content for the World English Bible.
- Where sections 8, 9, and 11 say "the two translations", the rule now applies to the three translations.

### 13.2 The words

- Source: edition A of the report. It is the edition `engwebp` of eBible.org, the World English Bible with no Deuterocanon, `https://eBible.org/Scriptures/engwebp_usfm.zip`. The pages of eBible.org state that the World English Bible is in the public domain, and that "World English Bible" is a trademark of eBible.org. The record is in section 11 of `docs/DATA-SOURCES.md`.
- This edition has "LORD" and "GOD" for the name of God. Edition B has "Yahweh". Arthur selected "LORD" on 2026-11-16. Reason: the Berean headings of the site say "LORD", for example "The LORD Is My Shepherd" above Psalm 23, and the two other translations use "LORD".
- The site does not change a word of the source. The World English Bible has no list of exceptions. Reason: the pages of eBible.org ask that a text with a changed word does not have the name "World English Bible".
- The site does not show these parts of the source files: the Strong's numbers, the footnotes, the cross-reference notes, the paragraphs and the poetry lines, the 33 speaker lines of the Song of Solomon, and the 5 lines "BOOK 1" to "BOOK 5" of the Psalms. The Berean data has the headings "BOOK I" to "BOOK V".
- The source files do not mark the words that the translators added. So the World English Bible pages have no words in italics, apart from a Psalm title.
- A Psalm title of the source is a `\d` line. It shows as the title of its Psalm, where the Berean data has the title of that Psalm. That is in 116 Psalms.
- Psalm 119 has 22 `\d` lines in the source. They are the names of the Hebrew letters, for example "ALEPH" before verse 1. The site does not show them. The Berean headings of the site have the letter names already.
- Zechariah 12: the Berean data has a title block, and the source has no `\d` line. The World English Bible page has no title block there, and verse 1 is in the next text block. The King James Version page does the same.
- The World English Bible has words for 12 of the 16 verses that the main text of the Berean Standard Bible does not have. The pages show these verses as text, with no note.

### 13.3 The verse numbers

Arthur decided on 2026-11-16: the site keeps the verse numbers of the source, and changes nothing.

- Five verse numbers have no words in the source: Luke 17:36, Acts 8:37, Acts 15:34, Acts 24:7, and Romans 16:25. Each has a footnote in place of words. The World English Bible pages show nothing for them: no verse number and no note. The site data has no item for them. So the site data has 31,098 verses: the 31,103 verse numbers of the source, less these 5.
- Romans 14 has verses 24 to 26 in the source. The Berean Standard Bible has these words as Romans 16:25 to 16:27. On the World English Bible page, the three verses are one text block of the paragraph style, after the last text block of Romans 14. They have no heading of their own.
- Romans 16 ends at verse 24 on the World English Bible page.
- The Berean data has the heading "Doxology" before Romans 16:25, with the cross-reference line "(Jude 1:24–25)". On the World English Bible page, no verse is after that heading. The rule: a section heading with no verse after it in its chapter does not show, and its cross-reference line does not show. This applies to one heading.

### 13.4 Links

- The World English Bible pages show the same marks, margin labels, and pop-ups. The pop-up shows the linked passage in the translation that the reader reads.
- The label of section 8.4 shows on the World English Bible pages also: "The quoted words are from the Berean Standard Bible."
- One rule is new: on the pages of a translation, a link does not show when one of its two passages starts at a verse that the data of that translation does not have. The link data does not change. No person and no agent removes a link.
- The rule applies to 3 of the 3,866 links, on the World English Bible pages only. All 3 are echo links to Romans 16:25: `o3385` from Matthew 13:35, `o3515` from 1 Timothy 3:16, and `h1733` between the heading "Doxology" of Romans 16 and the heading "Doxology" of Jude.
- What the reader sees on the World English Bible pages: Matthew 13:35 and 1 Timothy 3:16 have one echo link fewer. In Jude, the cross-reference line "(Romans 16:25–27)" shows as words, with no control. The designer ran the built site of Task 28 with the link `h1733` left out of the link data of Jude, and the line showed in this form.
- The rule applies to no link on the pages of the two other translations. The designer checked this on 2026-11-16 against the site data. In the Berean data, 2 links start at a verse that the main text does not have, Mark 9:44 and Mark 15:28. The Berean data has an item with a note for each, so these links show, as before.
- A page address with a verse that the translation does not have opens its chapter at the top. Example: `#/book/romans/16/25`.
- When the reader changes the translation and the new text does not have the verse at the top of the page, the page keeps the verse before it. Task 21 has this rule.
- The designer ran the first of these two on the built site of Task 28, with the address `#/book/romans/14/25` and the Berean Standard Bible: the chapter opened at the top, with no error. The designer read the second in the code and did not run it. Task 31 tests the two.

### 13.5 Red letters

- The World English Bible uses the words-of-Jesus marks of its own source files, by section 11.2. The source has 2,290 marks in 2,059 verses, and the report found no fault in them.
- The site shows all of them. The World English Bible has no exception.
- In 27 verses, the World English Bible or the Berean Standard Bible has marks and the other has none. The report lists them. Example: the Berean Standard Bible marks Hebrews 10:5 to 10:9, and the World English Bible does not.
- One red letters selection applies to the three translations.

### 13.6 The name, the translation control, and the translation list

- The full name is "World English Bible". The short name is "WEB". eBible.org gives this edition the abbreviation "WEBP", and gives "WEB" to edition B. Arthur decided on 2026-11-16 to use "WEB": no reader knows "WEBP". The Sources page names the exact edition.
- The value in the storage of the browser is `web`. The data folder is `public/data/text-web/`.
- The translation list has three rows, in this order: "Berean Standard Bible", "King James Version", "World English Bible". The first visit shows the Berean Standard Bible, as before.
- For a screen reader, the name of the translation control is "Translation: World English Bible, WEB".
- The look of the list is that of section 9.5, with one more row. Measured in the sketch: the pop-up of the wide layout is 340 px wide and 144 px high. A row of the narrow layout is 48 px high.
- Measured in the sketch: with "WEB", the translation control is 4.6 px wider than with "BSB". At 390 px, "2 Thessalonians 3" and "Song of Solomon 8" show with no cut. At 375 px, "2 Thessalonians 3" shows with no cut, and "Song of Solomon" ends with "…". The rule of section 9.4 applies: the bar is one line, and only the book name is cut.

### 13.7 The credit on the Sources page

- The first sentence names the three translations.
- The page names the edition and its source, the public domain statement, the trademark statement, and the abbreviation "WEBP".
- The page states that the site shows the words without change, and what the site does not show from the source files. From Task 31b, this is each kind of line also: the title lines of the books, the names of the speakers in the Song of Solomon, the lines "BOOK 1" to "BOOK 5", and the names of the Hebrew letters in Psalm 119. The rule of section 8.6 applies.
- The page states the verse numbers of section 13.3.
- The statement of section 8.6 about the structure of the Berean Standard Bible files applies to the World English Bible pages also.
- The paragraph of section 11.6 says "the three translations".
- Tasks 31 and 31b have the words.

### 13.8 Selected by the designer, without a decision by Arthur

- The form of Romans 14:24 to 14:26 on the page: one text block of the paragraph style.
- The rule for the heading "Doxology" of Romans 16, in section 13.3.
- The rule for the 3 links, in section 13.4.
- The value `web` and the name of the data folder.
- The words of the credit on the Sources page.

### 13.9 Not decided and not checked

1. An option that the designer did not take: the World English Bible pages show the heading "Doxology", its cross-reference line, and the 3 links at Romans 14:24, where the words are. This needs a rule that moves a heading of the Berean data, and a map of the verse numbers 16:25 to 16:27 to 14:24 to 14:26. Arthur can ask for it.
2. The pages of eBible.org do not say whether the name "World English Bible" can go with the headings and the paragraphs of a different source. Arthur did not ask eBible.org.
3. The designer did not read the source files. Each number of this section about the source is from the report of Task 29.
4. The report did not count the words-of-Jesus marks that go on over a verse number. Task 30 gives the number.
5. As in section 11.8: no one compared the marked parts of the verses where each translation marks a part of the verse.
6. No test on a real phone.

## 14. About the translations of 2026-11-17

Arthur decided this section on 2026-11-17, from renders. The renders are in `docs/screenshots/translations-design/`: the translation list at 1440 by 900 px and at 390 by 844 px, and the top of the Sources page at the same two sizes. The renders are a sketch on the built site of Task 32. Task 33 in `docs/TASKS.md` builds this section.

### 14.1 Reason

- Arthur read the site as a lay reader. The translation list gives three names, and a lay reader does not know the difference between them.
- The answer has two parts. Part 1 is in the translation list, because the reader has the question at the moment of the selection. Part 2 shows the same verse in the three translations, because a lay reader sees the difference faster in the text than in a description.

### 14.2 The line of each translation

Each translation has one short line. The line is in one place in the code, and the translation list and the Sources page show the same words.

| Translation | The line |
|---|---|
| Berean Standard Bible | Today’s English, in a literary style. Between literal and thought for thought. |
| King James Version | Older English, in the text of 1769: thee, thou, believeth. |
| World English Bible | Today’s English, in an informal, spoken style. A fairly literal translation. |

Arthur decided the lines of the Berean Standard Bible and of the World English Bible on 2026-11-17, after Task 33. Task 34 builds them. The lines of Task 33 were "Today’s English. A new translation." and "Today’s spoken English. An update of the American Standard Version of 1901." Arthur read them on the site as a lay reader: a reader who does not know the American Standard Version does not see the difference between the two translations. He asked for the word "literal" in the line of the World English Bible.

The two lines have the same form, so that the reader can compare them: the style of each translation in the words of its publisher, "literary" and "informal, spoken", and then the place of the translation between a literal translation and a thought for thought translation.

Arthur decided the second part of the line of the Berean Standard Bible on 2026-11-17, after Task 34, from the report of Claude Code on the page "Compare Translations" of the publisher. Task 35 builds it. The line of Task 34 was "Today’s English, in a literary style. A new translation." The words "A new translation." are not in the new line: with them, the line is three lines of text in the translation list.

The source of each part of a line:

- "Between literal and thought for thought": the page `https://bereanbibles.com/about-berean-study-bible/compare-translations/` says: "The Berean Bible lies somewhere near the middle of the range from “Word for Word” (Literal) Translations to “Thought for Thought” (Dynamic) Translations." Its chart has the BSB as the first name under "THOUGHT FOR THOUGHT (Dynamic)", next to the ESV, which is the last name under "WORD FOR WORD (Formal)". Claude Code read the page in Task 34 and gave these words in its report. The designer cannot open this page.
- "in a literary style": the page `https://berean.bible/print.htm` says that the text is "the result of a careful translation and styling process to maintain core meanings and produce an English text of high literary quality, effective for public reading, study, memorization, and evangelism." The designer read the page on 2026-11-17.
- "in the text of 1769": `sources/kjv/copr.htm` says "using the standardized text of 1769".
- "thee, thou, believeth": these words are in the King James Version data of the site.
- "in an informal, spoken style" and "A fairly literal translation": the preface of the edition, `https://ebible.org/engwebp/FRT01.htm`, says: "The style of the World English Bible, while fairly literally translated, is in informal, spoken English." The designer read the page on 2026-11-17.
- "Today’s English" and "Older English" are a description of the words that the reader sees. They have no source page. The page of the Berean publisher does not have the words "modern English". The preface of the World English Bible says that the update changed old words to "contemporary equivalents".
- The lines do not have the year 1611. The source files of the site do not have it.
- The line of the World English Bible does not have the American Standard Version. The Sources page does not have it also. `docs/DATA-SOURCES.md` keeps the record.

The line of the Berean Standard Bible of Task 34 did not say how literal that translation is. With "fairly literal" only in the line of the World English Bible, a reader can think that the Berean Standard Bible is not literal. The line of Task 35 corrects this.

### 14.3 The translation list

- Each row shows the name and the short name, as before, and the line of the translation below the name. The line is in the secondary ink color, at 13 px.
- A row is as high as its content. Measured in the sketch: a row with a line of one line of text is 57 px high, and a row with a line of two lines of text is 74 px high. The pop-up of the wide layout is 340 px wide, as before. With the lines of Task 34 and of Task 35, each of the three rows is 74 px high at 1440 px and at 390 px.
- Below the three rows, after a thin line, the list has the row "About the translations" with the sign "›". It is a link to the Sources page. It is 44 px high or more.
- The rules of section 9.7 for the panels do not change.

### 14.4 The section "The three translations" on the Sources page

- It is the first section of the Sources page, before "The Bible text".
- Its words: "The site has three translations of the Bible into English. The translation list in the top bar of a chapter selects one. Here is one verse, 1 Corinthians 13:4, in each translation."
- Then, for each translation in the order of the translation list: the name, the short name, the line of section 14.2, and the words of 1 Corinthians 13:4 in that translation, in the font of the Bible text.
- The words of the verse are those of the site data, with no change. The added word of the King James Version is in italics, as on the reading page. A unit test compares the words on the page with the site data.
- The section writes nothing about the Bible. The verse is the content.

### 14.5 Approved by Arthur, and selected by the designer

- Arthur approved the three lines and the words of the section in 14.4 on 2026-11-17, as Task 33 built them. Then he read the site, and he changed two lines the same day, and the line of the Berean Standard Bible a second time. The three lines of section 14.2 are his decision. The words of the section in 14.4 are approved, with no change.

Selected by the designer, without a decision by Arthur:

- The verse 1 Corinthians 13:4. Arthur saw it in the sketch.
- The sizes and the spaces.

### 14.6 Not decided and not checked

1. The way back. After "About the translations", the reader returns to the chapter with the Back control of the browser. The Sources page has no control that goes back to the chapter.
2. In the King James Version and in the World English Bible, 1 Corinthians 13:4 ends with a comma, because the sentence goes on in verse 5. The section shows the verse as it is.
3. No test on a real phone.

## 15. The map of the places of a book, of 2026-11-17

Arthur decided the direction and the look on 2026-11-17, then the six points of section 15.7, then the page of section 15.8, then the rule of section 15.10. Task 36 in `docs/TASKS.md` is a report on the data. Task 37 builds the map data from section 15.9. Tasks 38 to 40 build the map page from sections 15.8, 15.10, and 15.11: Task 38 the page with its first view, Task 39 the zoom, and Task 40 the line "Where". Where a later section differs from an earlier one, the later section is the rule.

The sketches are in `docs/screenshots/map-design/`: the map of Exodus and of Acts at 1440 by 900 px and at 390 by 844 px, and the line "Where" in "About this book". The sketches are made on the built site of Task 35, with the real data. The page around the map in the sketches is not designed: the top bar is that of the Sources page.

### 15.1 Reason

- Arthur asked on 2026-11-17 for a line "Where" in "About this book", with one link to a map. This is item 1 of `docs/BACKLOG.md`, from 2026-11-13.
- A link to Google Maps does not fit the site: the standard view and the satellite view do not look good.
- Beautiful design is a principle of this project. The map is drawn by the site, in the look of the site, as a map at the back of a printed Bible.

### 15.2 Decided by Arthur

- "About this book" gets a fourth line, "Where", with one link to the map of the book. The line has no words about the book.
- The map shows the places that the book names. It is not a map of where the author wrote the book.
- The place of writing stays in the line "Written". That line has it now for the letters that Paul wrote in prison. Example: Ephesians, "while Paul was in prison in Rome". Arthur asked for this fact, and the site has it there. The designer did not count the books whose line "Written" names a place of writing.
- The look of the sketches: white sea, land in a light paper color, a thin coast line, the rivers and the lakes, and no roads, borders, or satellite picture. The places of the book are in the group color of the book.

### 15.3 The signs of the sketches

- A solid dot: a place with a sure position. An open dot: a place with a position that is not certain. This is the sign of the timeline for an estimate.
- A triangle: a mountain. A name in capitals with spaces between the letters: a region, with no dot. A name in italics, in the font of the Bible text: a sea, a river, or a spring.
- The three places that the book names most have a name in bold.
- A scale bar in miles.
- Below the map: the two signs with their meaning, the number of places, the places that are outside the map, and the credit.

### 15.4 The data of the sketches

- Places: the Bible Geocoding Data of OpenBible.info, `https://github.com/openbibleinfo/Bible-Geocoding-Data`, the files `data/ancient.jsonl` and `data/modern.jsonl`, at commit `7eb18a5` on 2026-11-17. Its page says that the data has a Creative Commons Attribution 4.0 licence, and that its OpenStreetMap data has the ODbL 1.0 licence.
- Coast, rivers, and lakes: Natural Earth, at the scale 1:10 million, from `https://github.com/nvkelso/natural-earth-vector`, at commit `ca96624` on 2026-11-17. Its site says that all versions of its map data are in the public domain.
- The designer read these two statements on 2026-11-17. No licence check is complete, and no record is in `docs/DATA-SOURCES.md`. Task 36 does this.
- The rule of the sketches: a place of a book is a place of `ancient.jsonl` with a verse in that book. Its position is the position of its modern location with the highest score. A score below 500 gives the open dot. The designer selected 500. The data has a different meaning or a better limit possibly: Task 36 reports.
- No person selected a place or a position.
- Numbers of the designer, from the same files: the data has 1,342 ancient places, and 1,285 have verses. Exodus names 33 places, 31 have a position, and 15 of these have a score below 500. Acts names 107 places, all have a position, and 4 have a score below 500. Joshua names 432 places. Five books name no place: Philemon, James, 1 John, 2 John, and 3 John.

### 15.5 What the sketches do not have

- No route. The path of the Exodus and the journeys of Paul are a statement of a person, and the data does not have them. A route needs a source and a decision of Arthur.
- No hills. A map in a printed Bible has shaded hills.
- No places in a city, for example the Beautiful Gate. The sketches leave out the types of place that are a room, a gate, a structure, a field, or a hill.

### 15.6 Not decided and not designed

Status on 2026-11-17: this list is the list of the first sketches. Points 1, 2, 3, 5, 6, and 9 are decided in sections 15.7 to 15.9. Point 4 is decided in section 15.8, and its details are in section 15.10. Points 7 and 8 are as they were. Points 10 and 11 are open.

1. The set of regions. A printed Bible has about ten maps, not 66. The plan is a small set of regions, and each book opens one. Task 36 proposes the set from the data.
2. A book with no place, and a book with one place. Five books have none.
3. A book with very many places, for example Joshua with 432.
4. The phone. At 390 px, the map of Acts shows 28 names of 95. A phone needs a zoom, or a higher map that moves sideways.
5. Where the map page is, its top bar, and how the reader returns to the chapter.
6. The name on the map when the three translations use different names for a place.
7. A region has one point in the data. In the sketches, the name of a region is at that point. Example: the point of Judea is the point of Jerusalem.
8. The coast and the rivers are those of today. Example: the Dead Sea is in two parts. The sketches leave out the canals and the reservoirs.
9. The limit for "not certain".
10. A link from a place name in the text to the map. Not planned.
11. No test on a real phone.

### 15.7 Decided by Arthur on 2026-11-17, from the report of Task 36

The report is `docs/reviews/task-36-map-report.md`. Its step 10 has six proposals. Arthur approved these decisions:

1. The limit for "not certain" is a score of 500. A place with a score below 500 has the open dot.
2. The set of regions is that of step 6 of the report. The rule that gives a book its region is not that of the report. The rule: a book opens the smallest region that holds 90% of its verses that name a place. Reason: with a count of places, one place in one verse moves a book. Example: Matthew names Babylon and Egypt, and the rule of the report gives it the region from Egypt to Persia. With the count of verses, Matthew opens the land of Israel. The designer ran the rule on the data: 14 books change their region.
3. The map leaves out the places that the data puts inside a settlement, by the rule of step 7 of the report. The report counts 50. The map does not use a list of types.
4. The name on the map is the name of the data, with no number, the same in each translation. The cost: the map and the text differ for some places. Example: the map has "Lod", and Acts has "Lydda" in the three translations. The other choice of the report, the name of the selected translation, needs a list of name forms that a person makes.
5. A book with no place has no line "Where": Philemon, James, 1 John, 2 John, and 3 John. A book with one place has the line and a map with that place. Example: Proverbs names Egypt in one verse. Egypt is a region, so its map has one name and no dot.
6. The site keeps the 19 positions that come from an OpenStreetMap node, and it gives a credit to OpenStreetMap on the Sources page and below the map. The designer read a guideline of the OpenStreetMap Foundation, `https://osmfoundation.org/wiki/Licence/Community_Guidelines/Geocoding_-_Guideline`: a single geocoding result is an insubstantial extract with no share-alike duty, and a credit is necessary. The designer is not a lawyer, and no person read the text of the ODbL.

### 15.8 The map page: approved by Arthur on 2026-11-17

Arthur approved this section from the sketches, with five regions and with one dot for each point. The sketches are in `docs/screenshots/map-design/`, with names that start with `page-`. They use the rules of section 15.7, with one difference: the sketch finds the places inside a settlement with a rule of the designer, which gives 54 places and not 50.

1. The address of the map page is that of the book with the word `map`. The top bar has one control at the left, the name of the book with the sign "‹". It returns to the last-read chapter of the book.
2. Wide layout: two columns. The left column, 340 px wide, has the band, the name of the book, "The places of this book", the name of the region, the signs with their meaning, the number of places, the places outside the map, and the credit. The right column is the map, 960 px wide, as high as the window permits.
3. Narrow layout: the same parts, one below the other. The map has the full width. It is 300 px to 520 px high: as high as its region needs, and 520 px at most.
4. The map fills its frame. The region of the book is in the center, and the frame shows more land around it when the frame has a different shape.
5. Zoom: two controls, "+" and "−", at the lower right of the map, each 36 by 36 px. The reader moves the map with a drag. On a phone, two fingers zoom also. At each step of the zoom, the map shows the names that have space. The sketches show a zoom of 3 and of 4.
6. Five regions, not six. In the sketch, the region "the world of the Bible" shows Europe and Africa, and the places of Judah are on top of each other. The site does not have this region. A book that has no region with 90% of its verses opens the region with the most of its verses. The designer computed the five books: Esther 88%, Ezekiel 87%, Jonah 82%, and Nahum 81% of their verses are in the region from Egypt to Persia, and Job 43%.
7. A place of the book that is outside the first view of the map is in the list "outside this map". The list shows 8 names and then the number of the others.
8. The places at one point. Example: Jerusalem, Jebus, and Zion have one point, and a sketch of Joshua shows the name "Jebus" and not "Jerusalem". The rule: one dot for the places at one point, with the name that has the most verses in the book. The rule is for the places with a dot or a triangle. A region and a water have a name and no dot, and they keep their name.

### 15.9 The map data: the rules of Task 37

These rules come from sections 15.7 and 15.8. The details are of the designer. No person selects a place, a position, a name, or a kind: a rule does.

**The five regions.** The boxes are those of step 6 of the report of Task 36. The names are of the designer. Arthur saw three of them in the sketches: "The land of Israel", "Egypt to Persia", and "Rome to Jerusalem".

| Id | Name on the page | Longitude east | Latitude north |
|---|---|---|---|
| `r1` | The land of Israel | 34.0 to 36.7 | 29.4 to 33.7 |
| `r2` | Egypt, Sinai, and Canaan | 29.5 to 37.0 | 27.5 to 34.2 |
| `r3` | Greece and Asia Minor | 20.5 to 31.5 | 35.0 to 42.0 |
| `r4` | Egypt to Persia | 29.0 to 49.0 | 27.5 to 38.5 |
| `r5` | Rome to Jerusalem | 12.0 to 38.0 | 30.0 to 44.0 |

**The places of a book.**

1. A place of a book is an entry of `ancient.jsonl` with one verse or more in that book. The number of verses of a place in a book is the number of its entries in `verses` for that book.
2. The location of a place is the entry of its `modern_associations` with the highest score. If two have the highest score, it is the first of them in the file. The readme of the data says that `custom_lonlat` is a position that the makers of the data made independently when the coordinates come from a commercial source. So the position of the place is the `custom_lonlat` of its location if the location has one, and its `lonlat` if not. If the location has no position, the place has no position. The designer counted 5 places with a `custom_lonlat`. Arthur did not decide this rule: the designer added it on 2026-11-17, for the rules of use.
3. A place with a score below 500 is "not certain".
4. The map leaves out a place that the data puts inside a settlement, by the rule of step 7 of the report.
5. The name is the `friendly_id` of the place with no number at its end.
6. The kind of a place comes from its `types`, by the first of these rules that applies:
   - "water": it has the type "body of water", "river", "spring", or "wadi", and it does not have the type "settlement".
   - "region": it has the type "region" and not the type "settlement", or it has the type "people group".
   - "mountain": it has the type "mountain", "mountain range", or "hill".
   - "place": each other place.
7. Decided by Arthur on 2026-11-17, from the built page of Task 38: the map data leaves out the places with the name "East", "North", or "South". The data has five: East, North, South 1, South 2, and South 3. They are in no list and in no count. Reason: the name is a direction and not a place. The data says of East: "this isn’t necessarily depicting a specific location". On the built map of Matthew, the name "EAST" was near the Jordan, and "South" was in the list of the places outside the map. This is the one exception to the rule that no person selects a place. The designer looked at the 122 names of the kind "region" in the book files and found no other name of this type. The designer computed the result: 13 books lose one or two places, and no book changes its region. Task 38b builds the data again.

**The region of a book.** Use the places of the book with a position. Include the places inside a settlement: without them, Nehemiah moves from the land of Israel to the second region, because most of its places are gates of Jerusalem. A place is in a region if its position is in the box, with the limits. The area of a region is its width in degrees, times the cosine of its middle latitude, times its height in degrees. The book opens the smallest region that holds 90% or more of the sum of the verses of these places. If no region does, the book opens the region that holds the most of that sum.

The result of the designer, from the same files:

| Region | Books |
|---|---|
| `r1` | 15: Joshua, Ruth, 1 Samuel, 2 Samuel, 1 Chronicles, Nehemiah, Ecclesiastes, Song of Solomon, Lamentations, Obadiah, Matthew, Mark, Luke, John, 2 Peter |
| `r2` | 14: Exodus, Leviticus, Numbers, Deuteronomy, Judges, 1 Kings, Psalms, Proverbs, Joel, Amos, Haggai, Malachi, Hebrews, Jude |
| `r3` | 7: Ephesians, Philippians, Colossians, 1 Thessalonians, 2 Thessalonians, 1 Timothy, Titus |
| `r4` | 18: Genesis, 2 Kings, 2 Chronicles, Ezra, Esther, Job, Isaiah, Jeremiah, Ezekiel, Daniel, Hosea, Jonah, Micah, Nahum, Habakkuk, Zephaniah, Zechariah, Galatians |
| `r5` | 7: Acts, Romans, 1 Corinthians, 2 Corinthians, 2 Timothy, 1 Peter, Revelation |
| none | 5: Philemon, James, 1 John, 2 John, 3 John |

Five books have no region with 90%: Esther, Job, Ezekiel, Jonah, and Nahum. Each opens `r4`.

**The coast, the rivers, and the lakes.**

1. The map fills its frame, so the frame shows land outside the box of the region. The frame of the page has a ratio of width to height from 0.75 to 2.0. The data box of a region is the smallest box with the same center that holds the first view at each ratio in this range, with 0.2 degrees more on each side. With `c` the cosine of the middle latitude, `w` the width of the box times `c`, and `h` its height: the data box has the width `max(w, 2.0 × h) ÷ c` and the height `max(h, w ÷ 0.75)`, before the 0.2 degrees.
2. Land: `ne_10m_land` and `ne_10m_minor_islands`. Lakes: `ne_10m_lakes`, with no feature of the class "Reservoir". Rivers: the features of the class "River" of `ne_10m_rivers_lake_centerlines`, with no name that has "Canal" or "Channel". Each river keeps its `scalerank`.
3. No simplification. The reader can zoom in, and a simplification that the eye does not see in the first view is clear after a zoom.
4. The numbers of the designer for the five data boxes, with no margin and with a different file format: approximately 5,000, 10,000, 37,000, 54,000, and 107,000 bytes with gzip.

**The credit.** The Sources page gets a section for the places data, OpenStreetMap, and Natural Earth when the data files go on the site, before the map page is there. The licence of the places data asks for a credit and for a statement of the changes.

Decided by Arthur on 2026-11-17, from the report of Task 37: the Sources page names the Open Database License and has no link to its text. The copyright page of OpenStreetMap asks for a direct link to the licence from a person who distributes its data "in data form". The attribution guideline of OpenStreetMap says that a group of geocoding results does not need a credit attached to it. 19 positions of the book files come from OpenStreetMap. No person on the project read the text of the licence.

### 15.10 The map on the page: approved by Arthur on 2026-11-17

Arthur approved the priority rule of item 2 and the changes of items 4, 6, and 7, from the new sketches. Item 5 is a value of the designer. Arthur saw the words of item 8 in the first sketches.

The designer found two defects in the sketches of section 15.8 and made new sketches. They are in `docs/screenshots/map-design/`, with names that start with `page2-`: Acts at two sizes, Joshua with and without zoom, Matthew, and Ezekiel.

1. The defect: in the first sketches, each dot keeps its space, and then the names get the space that stays. A place with many small places around it gets no name. Example: Matthew names Jerusalem in 15 verses, and the sketch of Matthew by this rule has no name "Jerusalem". The phone sketch of Acts has no name "Rome".
2. The priority rule: the map takes the places in the order of their verses in the book, most first. A place gets its dot and its name if they do not touch a dot or a name that is there. A place whose dot would be on a dot or below a name is not shown at this zoom. A zoom shows it. The first view of Joshua then shows 87 dots, not 312, and the first view of Matthew shows "Jerusalem".
3. The cost: the first view does not show a dot for each place. The line "421 are on this map" stays true for the map with its zoom.
4. The zoom controls move to the upper right of the map. At the lower right, they are on Jerusalem in the phone map of Acts.
5. Each step of the zoom doubles the scale. The last step is the first one where one mile is 20 px or more.
6. Two colors change for the contrast of 4.5 to 1 that the site keeps for text. The names of the waters are `#4a6f84`, not `#6f8fa0`. The name of a region that is not certain has the secondary color in the weight 400, not a lighter color.
7. Two sentences more below the counts, when they apply: the places inside a city that the map leaves out, by name, and the places with no position, by name. Example: Acts names 107 places, 100 are in the first view, 5 are outside it, and 2 are inside a city.
8. The line "Where" in "About this book" has one link, "The places of this book ›".
9. Known limits. At a large zoom, the coast and the lakes of Natural Earth are lines with clear corners: the data is made for the scale 1:10 million. A finer coast needs a new source. The page has no list of the places for a reader who cannot see the map. No test on a real phone.

### 15.11 The map page: the rules of Tasks 38 to 40

These rules give the details of sections 15.8 and 15.10. They are of the designer, from the script of the sketches. The sketches with names that start with `page2-` show the result.

**The address and the bar.**

1. The address is `#/book/<book id>/map`. The title of the browser tab is "Places of", the name of the book, and the name of the site. Example: "Places of Acts · Bible Wall".
2. The bar is 52 px high, with the look of the top bar. It has one control at the left: the sign "‹" and the name of the book. It opens the book as the wall does: at the last-read chapter, or at chapter 1.
3. An address of a book with no place shows the bar and one sentence. Example: "Philemon names no place." An address of no book shows the page of a book that the site does not have, as the reading page does.

**The parts of the page.** In this order: the band of the group, the name of the book as the reading page shows it, the heading "The places of this book", the line "Map:" with the name of the region, the map, the three signs with their meaning, the counts, and the credit.

1. The three signs, in the group color: a solid dot with "A place that the book names", an open dot with "The position is not certain", and a triangle with "A mountain or a hill".
2. The counts. "On this map" means in the first view. A list of names has the order of the data file of the book. A list shows 8 names at most, and then ", and 3 more." with the number of the other places: the places of the list that the names shown do not stand for. Then the numbers of a sentence add up. A name that is in a list two times shows one time, and the number of the sentence stays the number of the places. The data has different places with one name. Example: Joshua has three places with the name "Hazor".
   - "Acts names 107 places. 100 are on this map." For one place: "Proverbs names 1 place. It is on this map."
   - If places are outside the first view: "5 places are outside this map: Haran, Mesopotamia, Babylon, Chaldea, Ethiopia." For one: "1 place is outside this map: Egypt."
   - If the file has places inside a settlement: "2 places are inside a city, and the map does not show them: Beautiful Gate, Solomon’s Portico." For one: "1 place is inside a city, and the map does not show it: Uzza."
   - If the file has places with no position: "The data has no position for 2 places: Hobah, Kedesh." For one: "The data has no position for 1 place: Hobah."
   - The names in these examples are examples. The numbers and the names come from the data.
   - The lists `inSettlement` and `noPosition` of a book file have the order of the places of the file: the most verses first. The designer compared the 61 book files of Task 37 with a script of the designer: each field agrees.
3. The credit: "Places: OpenBible.info. Coast and rivers: Natural Earth. Some positions: © OpenStreetMap contributors." The three names are links, to the same addresses as on the Sources page.

**The layout.**

1. The frame of the map has a ratio of width to height from 0.75 to 2.0. If a rule below gives a height outside this range, the height is the nearest limit.
2. Wide layout: the text column is 340 px wide and starts 80 px from the left. The map starts 40 px to the right of it and is 960 px wide at most, with 20 px to the right of it. The space at the left of the text column is 80 px, or half of the free space if that is more. The free space is the width of the window minus 1,340 px. So the two columns are in the center from a window of 1,500 px, and the space does not jump at a width. The first rule of the designer put the columns in the center above 1,440 px, and the space at the left went from 80 px to 50 px at 1,441 px. The map starts 28 px below the bar, and its height is the height of the window below the bar minus 56 px. The text column scrolls with the page if it is higher than the window.
3. Narrow layout: the text parts have the margins of the reading page. The map has the full width of the window. Its height is its width divided by the ratio of its region, but not more than 62% of the height of the window, and not less than 300 px. Example at 390 by 844 px: Joshua 520 px, Acts 300 px.
4. The ratio of a region is its width in degrees, times the cosine of its middle latitude, divided by its height in degrees.

**The drawing.**

1. The projection: x is the longitude times the cosine of the middle latitude of the region, and y is the latitude. The first view has the box of the region in its center, as large as the frame permits. The frame shows the land around the box.
2. The sea is white. The land is `#f4f1eb`, with a coast line of 0.9 px in `#cfc8bb`. The rivers are lines of 1.1 px in `#a9c0cc`. The lakes are white, with a line of 0.9 px in `#a9c0cc`. The lines keep their width at each zoom. The frame has a line of 1 px in the color of the lines of the site, in the wide layout on its four sides and in the narrow layout above and below.
3. The rivers with a `scalerank` of 6 or less show always. The other rivers show when one degree of latitude is 80 px or more.
4. A dot has a radius of 3.5 px in the wide layout and 3 px in the narrow layout. A solid dot has the group color and a white line of 1 px. An open dot is white, with a line of 1.4 px in the group color. A triangle is 3 px wider than the dot and 2 px higher, with its center on the position: 10 by 9 px in the wide layout, and 9 by 8 px in the narrow layout. It is solid if the position is sure, and white with a line in the group color if not. The list of the signs shows the triangle in this size. In the priority rule, a triangle has a radius of half its width: 5 px in the wide layout, and 4.5 px in the narrow layout. So the distance rule for two marks uses the sum of their two radii plus 2 px, and the name of a mountain is 5 px from the edge of the triangle. Task 38 built a triangle with the size of the dot, which is too small beside the dots.
5. The names. A name has no edge. The coast line, the river lines, and the lines of the lakes do not show below a name: each line stops at the box of the name, which is 2 px wider at the left and at the right, with round corners of 3 px. The color of the land and of the water below a name does not change. Arthur decided this on 2026-11-17 from four versions on the built page, in `docs/screenshots/map-design/halo-compare-acts.png`: it is version 4. Reason: the first rule gave each name a white edge, so that a line does not cut a name. On the land, the edge was a white mark around each name. The build made it 3 px on each side, and the sketches had 1.5 px.
   - A place and a mountain: Inter, 12.5 px in the wide layout and 11 px in the narrow layout, weight 500, in the ink color. If the position is not certain, in `#6b6b6b`. The three places with a dot or a triangle that the book names most are 1 px larger, in the weight 700, but only a place that the book names in 3 verses or more. The limit of 3 verses is from the built page of Task 38b: in Daniel, Dura with 1 verse was bold, and in Exodus, Baal-zephon with 2 verses was. With the limit, a short letter has no bold name. Task 38 built this for the dots only: in Exodus, Mount Sinai with 12 verses was not bold, and Baal-zephon with 2 verses was.
   - A region: capitals, Inter, 10.5 px and 9.5 px, weight 600, 1.6 px between the letters, in `#6b6b6b`. If the position is not certain, weight 400.
   - A water: Lora italic, 13.5 px and 12 px, in `#4a6f84`.
   - Reason for `#6b6b6b` and `#4a6f84`: a contrast of 4.5 to 1 or more on the land color and on white. The designer computed 4.73 and 4.78 on the land color.
6. The scale bar is at the lower left, 14 px from the edges. Its length is 5, 10, 25, 50, 100, 200, 300, 500, or 1000 miles: the first of these that is 50 px or more. One degree of latitude is 69.09 miles.

**Which places show: the priority rule.** The site computes this one time for each scale, for the whole first view. A move of the map does not change it.

1. First, the places at one position. Of the places with a dot or a triangle that have the same position, only the one with the most verses stays. Of the places that have the same name and the same position, of the same kind or of different kinds, only the one with the most verses stays. Example: Joshua has a region "Galilee" and a place "Galilee" at one position, and the region has more verses, so the map shows the name of the region and no dot. The others do not show at any zoom. If two have the same number of verses, the first in the file stays. The second rule is from the report of Task 37: the data has a name two times at one position in 24 cases. Example: Exodus has "Red Sea" two times at one position, and without the rule the map shows the name two times.
2. Take the places in the order of the file: the most verses first.
3. A place with a dot or a triangle does not show at this scale if its center is nearer than two radii plus 2 px to the center of a dot that shows, or if its dot touches a name that shows.
4. If it shows, it gets its name at the first of these positions that is free: right, left, above, below, upper right, lower right, upper left, lower left. The name is 5 px from the edge of the dot. If no position is free, the dot shows with no name.
5. A region gets its name at the first of these positions that is free: on its point, above, below, right, left. A water: on its point, above, below. If no position is free, the name does not show at this scale.
6. A position is free if the name, with 2 px around it, is in the first view and touches no dot that shows and no name that shows. In the first view with no zoom, the name must not be below the zoom controls or the scale bar. After a zoom, the controls and the scale bar can cover a name, and the reader moves the map.
7. The site measures the width of a name in the browser. The script of the sketches used an estimate, so the built page can differ from the sketches in small ways.

**The switch for the places that are not certain, Task 39b.** Decided by Arthur on 2026-11-17: the first view of Joshua is too full. The comparison is `docs/screenshots/map-design/joshua-toggle-compare.png`.

1. The switch is one line below the line "Map:", above the signs: the words "Places that are not certain" at the left, and a switch at the right. In the wide layout, the line is as wide as the text column. In the narrow layout, it has the margins of the text, so the reader sees it with the map and does not scroll. Arthur decided this on 2026-11-17 from four designs, in `docs/screenshots/map-design/switch-options-desktop.png` and `switch-options-phone.png`: it is design D.
   - The switch is 38 px wide and 22 px high, with round ends, and a white circle of 18 px that is at the right when the switch is on and at the left when it is off. On: the group color of the book. Off: `#8e8e93`, which has a contrast of 3 to 1 or more on white.
   - The words have the ink color, Inter, 15 px, weight 500.
   - The full line is the control. For a screen reader it is a switch with the name "Places that are not certain". It has the focus ring of the site.
   - The circle moves in 120 ms, and with no animation when the reader asked for less motion.
   - The first design, built in Task 39b, was a line of text with the word "on" or "off", below the signs, with the look of the echo links switch. Arthur needed 2 minutes to find it: it did not look like a control.
2. The first state is "on": the places show. Reason: with the switch off, the first view of Exodus has 2 dots.
3. The browser keeps the state, as it does for the red letters. The key is `bible-map-uncertain`. The state is the same for each book.
4. Only a book with a dot or a triangle that is not certain has the switch.
5. With the switch off, a place with a dot or a triangle whose position is not certain is not on the map at any step: no dot, no triangle, and no name. The site takes these places out first, and then it uses the rules of "Which places show". A water and a region stay on the map always. Arthur decided this on 2026-11-17, from the built page of Task 39c. Reason: a water and a region have no open sign on the map. With the first rule, the switch took away the name "Red Sea" in Acts, and a reader did not know why. The sign of the switch in the list is the open dot.
6. With the switch off, one sentence more follows the first sentence of the counts: "194 of them have a position that is not certain, and the map does not show them." For one: "1 of them has a position that is not certain, and the map does not show it." The number is the number of such places in the first view: the places with a dot or a triangle only.
7. The numbers of the designer, from the built page of Task 39c with the data of these places removed, at the first view with the switch off. At 1440 by 900 px: Joshua 67 dots and 62 names, Exodus 1 and 16, Acts 43 and 60. At 390 by 844 px: Joshua 46 and 41, Exodus 1 and 15, Acts 23 and 29. The number of the sentence: Joshua 188 and 188, Exodus 11 and 11, Acts 3 and 2. The numbers of the first rule, which hid the waters and the regions also, were: Joshua 67 and 61, and 46 and 41, Exodus 2 and 14, and the sentence had 194, 193, 15, 15, 4, and 2.
8. What "not certain" means: the text of the book names the place, and the sources of the data do not agree on where it was. Example: Acts 7:30 names Mount Sinai. The data has 14 proposals for the mountain, and the best one, Jebel Musa, has a score of 465, below the limit of 500.

**The zoom, Task 39.**

1. Two controls at the upper right of the map, 12 px from the edges, each 36 by 36 px, with 4 px between them: "+" above "−". The names for a screen reader are "Zoom in" and "Zoom out". Each step doubles the scale, with the center of the view fixed. The last step is the first one where one mile is 20 px or more. A control that can do nothing is off.
2. The reader moves the map with a drag. The view stays in the first view: the reader cannot move to a part that the first view does not show.
3. On a touch screen, two fingers zoom, and the map goes to the nearest step when the fingers lift. In the first view with no zoom, a drag with one finger scrolls the page. After a zoom, it moves the map.
4. The mouse wheel scrolls the page and does not zoom.
5. With the keyboard: the map takes the focus, the arrow keys move it by 80 px, and the keys "+" and "−" zoom.
6. A change of the zoom has no animation when the reader asked for less motion.
7. A change of the size of the frame keeps the step of the zoom, or the last step of the new frame if that is lower, and it keeps the point at the center of the frame. The designer decided this on 2026-11-17 from the report of Task 39. Reason: a phone changes the height of the window when its address bar hides or shows, and a return to the first view at that moment takes the map away from the reader.
8. Built in Task 39, and correct: a key with Ctrl, Cmd, or Alt goes to the browser and not to the map, and the map has the role description "map" for a screen reader.
9. A double click on the map zooms in one step, and the point below the pointer stays where it is. On a touch screen, a double tap does the same: two taps at one point in 300 ms. At the last step, a double click does nothing. Arthur decided this on 2026-11-17. Reason: the controls zoom at the center of the view. In Acts, the center of the region is open sea, and the third step shows one name.

**The approval.** Arthur reviewed the built map page on 2026-11-17, at commit `87d16da`, and approved it. Task 40 adds the line "Where" with the link.

**Not in these tasks.** A link from a place name in the text to the map. A list of the places for a reader who cannot see the map. A route. A finer coast.

## 16. The font Inrond of 2026-11-17

Arthur decided this section on 2026-11-17. Task 41 in `docs/TASKS.md` builds it. Where an older section names Inter, this section makes it Inrond. Lora stays the font of the Bible text.

### 16.1 Reason

- Arthur wanted the sans-serif text of the site to have corners that are rounded a small amount. The band has round corners of 3 px from section 7.4, and the letters of the wall had sharp corners.
- He first made a proof of concept of his own, "Langham Sans POC": five letters of Inter Bold with round corners. It had only five letters, and it changed the diagonal of the N.
- Inrond is a published font, made from Inter, with an axis for the roundness of the corners. It has all the characters and all the weights of Inter. Its rule rounds the ends of strokes and the outer corners only. The joins and the counters stay as in Inter.

### 16.2 Decided by Arthur on 2026-11-17

1. The font is Inrond 1.0, from `https://github.com/Hairline-UI/inrond`, at a roundness of 20 of 100. Arthur selected 20 from the two sheets in `docs/screenshots/font-design/`. They show the wall in Inter and in Inrond at a roundness of 10, 20, and 35. Arthur did not select 10, 35, or "keep Inter".
2. The sizes that Arthur looked at:
   - `wall-roundness-1440.png`: the first two columns of the wall at 1440 by 900 px, at a pixel density of 2.
   - `wall-roundness-390.png`: the wall at 390 by 844 px, at a pixel density of 3.
   - Before the sheets: a comparison page with "GENESIS" at 76 px, "EN" at 150 px, and "GENESIS · Genesis 1:1" at 20 px. At 20 px, the designer saw no difference from Inter at a roundness of 10, 20, or 35.
3. The name of the font on the site is "Inrond". Arthur did not want a new name for a copy of Inrond. Section 16.5 has the licence facts.
4. Inrond is in each place that uses Inter before Task 41: the wall, the headings, the bands, the controls, the top bar, the pop-up, the Reference section, and the map. The site has one sans-serif font.
5. The weights are 300, 400, 500, 600, 700, and 800, the six weights of Inter on the site before Task 41. Upright only. Each file has the same characters and the same layout features as the matching file of `@fontsource/inter` 5.3.0.
6. The site uses files made for it (option A), not the published variable file of Inrond (option B). Reason: no published file of Inrond has a roundness of 20, and the published Latin variable file is 263,300 bytes. Section 16.6 has the numbers.
7. The font files go in `src/fonts/`. The site does not keep the package `@fontsource/inter`. While the font loads, and if it does not load, the system font of the fallback list shows.
8. The script that makes the files goes in `scripts/fonts/`, as a record. The build of the site does not run it.

### 16.3 How the files are made

- Source file: `Inrond[ROND,opsz,wght].ttf`, from the repository `Hairline-UI/inrond`, at the reference `v1.0`, read on 2026-11-17. 2,453,556 bytes. SHA-256 `8075515a0e237e6bd7991714c49e79dfc82eff8938a56b4aee7affc1542d4c0f`.
- Its name table says "Version 1.000; based on Inter 4.1". Its axes: `opsz` 14 to 32, `wght` 100 to 900, `ROND` 0 to 100. It has 2,937 glyphs and 2,852 characters.
- The values for each file: `ROND` 20 and `opsz` 14. The weight is the weight of the file.
- Reason for `opsz` 14: the files of `@fontsource/inter` are the text design of Inter. With the optical size set by the browser, the book names on the wall were 1 to 3.5% narrower than in Inter, and they did not fill their columns. With `opsz` 14, the widths are the same. The designer measured this on the public site on 2026-11-17.
- The tools: fontTools 4.67.0 with the module brotli. For each weight, the script fixes the three axes. Then it cuts the font to the characters of the matching Latin file and Latin Extended file of `@fontsource/inter` 5.3.0, and keeps only the layout features of those files: `calt`, `ccmp`, `dnom`, `frac`, `locl`, `numr`, `pnum`, `tnum`, `kern`, `mark`, and `mkmk`. The files have no hinting.
- The name table: the family name is "Inrond", and the style name is the name of the weight, for example "ExtraBold". The copyright line (name 0), the short licence notice (name 13), and the licence address (name 14) are those of Inrond. The version line (name 5) adds "Inrond 1.0 with ROND 20 and opsz 14, cut to latin and latin-ext".
- The script is `build_font.py`. Its arguments: the source file, the folder `files` of `@fontsource/inter` 5.3.0, the output folder, and the family name "Inrond".

### 16.4 The files

The designer put the files in `resources/fonts/task-41/` on 2026-11-17. That folder is not in git. `SHA256SUMS.txt` in the same folder has the SHA-256 of each file.

| File | Bytes | SHA-256 |
|---|---|---|
| `inrond-latin-300-normal.woff2` | 25,912 | `0730ce3fcb98a11baf41f11a07724b308b9ba3bb3c2fa61c6031448c1a161bb4` |
| `inrond-latin-400-normal.woff2` | 25,576 | `7bbedfde3782d0c13acbb7ecb6b4cbd37ce3f41b748d0ad0591667062d0cabd0` |
| `inrond-latin-500-normal.woff2` | 26,592 | `ccdd587678ff3f1a460c0c8af5cee5f8e1d69780f157a0e99e7ef0455c6ab4fb` |
| `inrond-latin-600-normal.woff2` | 26,760 | `2a1b99422c0894cc86538365919be74903ff7872a7f2516dad643a08cba8a96f` |
| `inrond-latin-700-normal.woff2` | 26,924 | `7ce6d65790945b4d4871509e0ae367a6bff9115dbdb2d33968cec4317eab0514` |
| `inrond-latin-800-normal.woff2` | 26,992 | `fba22e8b54c50fb3260d0f9ff8005cd324f0f06b40d14944dfb5e24d44dc6653` |
| `inrond-latin-ext-300-normal.woff2` | 40,676 | `fc3be9418e6c8ab5c2aef529326246c21b0cec3364bd36787909aff09607bdd7` |
| `inrond-latin-ext-400-normal.woff2` | 39,248 | `a0ec1d39142a14735d4a23fdc1524a19b7cfa5e4ee49e78ebea5a2f3782ee7cb` |
| `inrond-latin-ext-500-normal.woff2` | 41,528 | `accb43feae1b0d466358bcddcea1dc8e1000786c4eb5f6ebbffecaeb1d5c5693` |
| `inrond-latin-ext-600-normal.woff2` | 42,008 | `91be3119ac14d21c51f6b28bb0bf72c6b6586e1f99f6be498b9d6d2fe3eb4781` |
| `inrond-latin-ext-700-normal.woff2` | 42,460 | `52428ff3899b0a82f3c3fbee8db5ad0137cb2ce83f8bde7cf558ee1ed9fb4852` |
| `inrond-latin-ext-800-normal.woff2` | 42,352 | `9461b12339eb412c48b21f7c654f4dd77aa7c438b9cf2f3450539fad68a7e778` |
| `OFL-inrond.txt` | 4,422 | `9d5dae427f6da313c066c2fc9a6954c6921f12275f370e7f496a4d8693d1eb33` |
| `build_font.py` | 4,067 | `696824e5faeb2ae8b6b48a457831cada2492beb1abb21b5b6346541ca33a2b2f` |
| `Inrond[ROND,opsz,wght].ttf` | 2,453,556 | `8075515a0e237e6bd7991714c49e79dfc82eff8938a56b4aee7affc1542d4c0f` |

- `OFL-inrond.txt` is the file `OFL.txt` of the repository `Hairline-UI/inrond` at `v1.0`, with no change.
- The source file is in the folder so that the script can run again. The site does not use it.

### 16.5 The licence

The designer read `OFL.txt` of Inrond and `LICENSE.txt` of Inter on 2026-11-17.

- Both are the SIL Open Font License, Version 1.1.
- The copyright lines of Inrond: "Copyright 2026 The Inrond Project Authors" and "Copyright (c) 2016 The Inter Project Authors (https://github.com/rsms/inter)". Apart from its first line, the Inrond file is the same as the Inter file.
- Neither file names a Reserved Font Name.
- The files of the site are a "Modified Version" in the words of the licence: the script changes the axes, removes characters, and changes the format.
- What the licence asks of a changed copy:
  1. It must not be sold by itself.
  2. Each copy must contain the copyright notice and the licence. The site serves `public/licenses/OFL-inrond.txt`. Each font file also keeps the copyright line and a short licence notice in its name table.
  3. It must not use a Reserved Font Name. The licence files name none.
  4. The names of the copyright holders and the authors must not promote the changed copy, except to acknowledge their work. The credit on the Sources page only acknowledges.
  5. It must be distributed under this licence only.
- The README of Inter says that "Inter" is a Reserved Font Name of Rasmus Andersson. The licence file of Inter does not name it. The site does not use the name "Inter" for a font, so the difference has no effect here.

### 16.6 Compared with Inter

The designer compared each file with the matching file of `@fontsource/inter` 5.3.0, with fontTools, on 2026-11-17.

- Characters: the same. 230 in each Latin file, 733 in each Latin Extended file.
- Advance widths: the same for each character, with one exception. At weight 700, `"`, `2`, and U+0323 in the Latin file, and U+01BB, U+0264, U+029C, U+0323, and U+1EFB in the Latin Extended file, differ by 1 unit of 2,048 em. At 13 px, that is about 0.006 px.
- Glyphs: 518 in each Latin file of both fonts. 872 in each Latin Extended file of Inrond, against 879 in Inter.
- The version of Inter: the files of `@fontsource/inter` 5.3.0 say "Version 4.001;git-66647c0bb". Inrond says "based on Inter 4.1".
- Bytes, woff2. A woff2 file is already compressed, and gzip makes it no smaller.

| | Inter, `@fontsource/inter` 5.3.0 | Inrond, files of section 16.4 |
|---|---|---|
| Latin files, weights 300 to 800, each | 23,664 to 24,452 | 25,576 to 26,992 |
| The three Latin files that the wall downloads: 500, 700, 800 | 73,028 | 80,508 |
| All 12 files | 360,596 | 407,028 |
| Published Inrond, Latin variable file, option B | | 263,300 |

- The rounded corners add points to the outlines, so the files are about 10% larger.
- The weights that the wall downloads are 500, 700, and 800. The first text of this section said 400, 500, 700, and 800, with 96,692 and 106,084 bytes. The first run of Task 41 measured the wall on the local build and on the public site: no visible text of the wall uses the weight 400.
- The wall with the files of section 16.4: the designer rendered the wall from the public site at 1440 by 900 px and at 390 by 844 px. It looked the same as the approved sheets. Each book name filled its column within 0.14 px, the same as with Inter.

### 16.7 Selected by the designer, without a decision by Arthur

- Only woff2 files, with no woff file. The package `@fontsource/inter` also had woff files.
- `font-display: swap` and the `unicode-range` values of `@fontsource/inter` 5.3.0, as before.
- The names of the files.
- The words of the credit on the Sources page and in section 6 of `docs/DATA-SOURCES.md`. Task 41 has them.
- Task 41 removes `public/licenses/OFL-inter.txt`. The copyright line of Inter is in `OFL-inrond.txt` and in each font file. Task 17 removed the licence files of the fonts that the site stopped using, by the same rule.

### 16.8 Not decided and not checked

1. The designer could not check which commit the reference `v1.0` of `Hairline-UI/inrond` points to. The file list of jsDelivr for version 1.0 gives other sizes: 2,303,152 bytes for the variable file and 242,308 bytes for the Latin variable file, against 2,453,556 and 263,300 from GitHub. The approved sheets and the files of section 16.4 use the files from GitHub.
2. The kerning of Inrond was not compared with the kerning of Inter. The fit of the wall names suggests that it is the same.
3. Which weights the reading page, the Reference section, and the map page download. Task 41 measures this.
4. Safari, an iPhone, and an Android phone. The designer used Chrome only.
5. Inrond has known issues from its README: the corners are made by a rule, not by hand, and some joins of a cap and a curve change direction by a few degrees. The designer saw none at the sizes of section 16.2.

### 16.9 Checked by a second chat on 2026-11-17

The chat that wrote sections 13 to 15 checked this section and Task 41 before the first run of the task. In section 16, "the designer" is the chat that made the font files.

1. The 15 files of `resources/fonts/task-41/` agree with `SHA256SUMS.txt` and with the table of section 16.4.
2. Point 1 of section 16.8 is solved in part. The reference `v1.0` of `Hairline-UI/inrond` is a tag that points to the commit `5e6b991dbec38bd184377cf661205a02c4d0b6ec`. At that commit, `fonts/variable/Inrond[ROND,opsz,wght].ttf` has 2,453,556 bytes and the SHA-256 of section 16.3, and `OFL.txt` has the SHA-256 of `OFL-inrond.txt`. The different sizes in the file list of jsDelivr are not explained.
3. Section 16.6, with fontTools: for each of the 12 files, the characters, the layout features, and the units of the em are the same as in the matching file of `@fontsource/inter` 5.3.0. The advance widths are the same, with the 3 and the 5 exceptions of 1 unit at weight 700 that section 16.6 names. The sums of bytes are 407,028 and 360,596 for the 12 files.
4. Point 2 of section 16.8, the kerning. In Chrome, the width of a text is the same in Inter and in Inrond for each text that the chat measured: the 66 book names in capitals at weight 800, the 1,046 names of the map data at the weights 500 and 700 and in capitals at weight 600, and the 509 texts of the introductions at weight 400. The README of Inrond says that the advance widths and the kerning are those of Inter at each roundness.
5. The characters. The chat searched 210 files for a character that is not in the two character sets of the font files: the book list, the introductions, the periods, the dates, the quotation pairs, the map data, the link data, and the source code. It found none. The Bible text is in Lora and was not part of the search.
6. The licence. The first lines of `OFL-inrond.txt` are the two copyright lines of section 16.5, and the file names no Reserved Font Name. The file `LICENSE.txt` of Inter names none. The README of Inter says: "Inter" is a Reserved Font Name by Rasmus Andersson. Each font file has the family name "Inrond", the copyright line, a short licence notice, and the licence address in its name table.
7. Not checked by the second chat: the two sheets against the files, the script `build_font.py`, and the look of the font on a real page. The chat is not a lawyer.

### 16.10 The fallback list, decided by Arthur on 2026-11-17

The first run of Task 41 stopped at a test of the task: with the font files stopped, 21 book names of the wall were wider than their columns, and 39 were narrower.

1. The defect is older than Inrond. It was on the site with Inter. In three places, the code measures a name on a canvas with a font name that has no fallback list: the wall, the timeline, and the map. The CSS of the page has a list.
2. What a reader sees when the font files do not load, from the build of Task 40 with Inter, with the font files stopped in the browser of the second chat:
   - The wall: the names do not fill their columns.
   - The timeline: "Genesis" is measured at 46 px and shown at 60 px.
   - The map: the names do not touch, and they show in a serif font, not in the system font of the other text.
3. The decision: the font that measures a name has the same list of font families as the CSS of the text that it measures. The map uses `Inrond, system-ui, sans-serif` for its names and its scale label. With Inrond loaded, nothing changes: the map records of Task 41 must stay the same.
4. Arthur did not select these options: a correction of the wall only, and a change of the test with no change of the code.
5. This is the one change of Task 41 that is more than the name of the font. Step 13a of the task has it.

### 16.11 Task 41 as built, checked on 2026-11-18

Claude Code completed Task 41 in commit `be05090`. The second chat ran the build in a browser at 1440 by 900 px and at 390 by 844 px.

1. The font files of the build are the same, byte for byte, as the files of section 16.4.
2. The wall, the headings, the bands, the controls, and the map show in Inrond. The Bible text shows in Lora. The browser downloads no file of Inter.
3. The wall downloads the weights 500, 700, and 800.
4. The numbers of dots and names of the map for Acts, Joshua, and Matthew are the same as before the task.
5. With the font files stopped: each book name of the wall fills its column within 0.13 px, the timeline measures and shows each name with the same width within 0.01 px, and the map names do not touch and have the system font.
6. Three sentences about the licence were not exact, from the accuracy review of Task 41. This section and section 6 of `docs/DATA-SOURCES.md` are corrected. Name 13 of each font file is a notice of 145 characters, not the text of the licence. Condition 5 of the licence is for the fonts "modified or unmodified". Condition 2 permits the metadata fields only if the user can easily view them. The site meets condition 2 with the licence file.
7. The accuracy review gave one more point with no change: the credit on the Sources page does not say that the optical size is fixed at 14 and that the files are static. The credit says nothing false.

## 17. The line "Video" in "About this book", of 2026-11-18

Arthur decided this section on 2026-11-18, from renders, in two steps: first the line, and then the credit of section 17.3, after Claude Code read the terms of BibleProject. Section 17.10 has that step. The renders are in `docs/screenshots/video-design/`. `video-line-desktop-1440.png` and `video-line-phone-390.png` show the line with the credit in Mark, Matthew, and 2 Kings. `space-desktop-1440.png` and `space-phone-390.png` show the space of section 17.7, with the line as it was before the credit. The renders are a sketch on the built site of Task 41. Each link in a render goes nowhere or to the first page of a site, not to a video. Task 42 in `docs/TASKS.md` builds this section.

### 17.1 Reason

- Arthur asked on 2026-11-18 for links in "About this book" to the overview videos of BibleProject on YouTube: generally one video for each book.
- He gave two playlists of the channel BibleProject:
  - Old Testament: `https://www.youtube.com/playlist?list=PLH0Szn1yYNeeVFodkI9J_WEATHQCwRZ0u`, 41 videos.
  - New Testament: `https://www.youtube.com/playlist?list=PLH0Szn1yYNecanpQqdixWAm3zHdhY2kPR`, 32 videos.
- The designer read the two playlists on 2026-11-18, in a browser on Arthur's computer. The 73 videos are these:
  - 2 videos are a summary of a testament, not of a book.
  - 47 books have one video each.
  - 10 books have two videos each, "Part 1" and "Part 2": Genesis, Exodus, Isaiah, Ezekiel, Matthew, Luke, John, Acts, Romans, and Revelation.
  - 9 books share 4 videos: 1 and 2 Kings, 1 and 2 Chronicles, Ezra and Nehemiah, and 1, 2, and 3 John.
- So each of the 66 books has a video.

### 17.2 Decided by Arthur on 2026-11-18

1. "About this book" gets a line "Video". Each of the 66 books has it.
2. The line is a link, and only a link. The page shows no video, and it gets nothing from YouTube or from BibleProject. A tap on the link opens the video on YouTube in a new tab, so the site stays open. Reasons: the hard rule that the site gets no data from a different server, and a video in the page brings the tracking of YouTube to each reader of the page.
3. The link has the name "BibleProject". Reason: the introductions give the traditional view and then "Scholars differ". A video gives the view of BibleProject. The name tells the reader that the video is not a text of the site.
4. A book with two videos has two links.
5. A book that shares its video has the link to that video, and one sentence below the link names the books of the video.
6. The two summary videos are not in "About this book". The Sources page has them, in a section "Videos" that gives the credit to BibleProject.
7. With "About this book" open, the space above the read-with list is larger. Section 17.7.
8. Below the links, each book has a credit to BibleProject, in the words that BibleProject gives. The credit does not look like a fact of the site: it has a line at its left, and gray text at 14 px. Sections 17.3 and 17.10.

### 17.3 The words of the line

The label of the line is "Video".

| Case | Books | What the line shows |
|---|---|---|
| One video | 47 | One link: "BibleProject overview" and the sign "›". Below it, the credit. |
| Two videos | 10 | Two links, one below the other: "BibleProject overview, part 1" and "BibleProject overview, part 2", each with the sign "›". Below them, the credit. |
| A shared video | 9 | One link: "BibleProject overview" and the sign "›". Below it, the credit, with the sentence of the shared video before its first word. |

The credit is these words, with no change: "BibleProject is the author and owner of this content. To find more BibleProject resources, visit bibleproject.com." The words "bibleproject.com" are a link to `https://www.bibleproject.com/`. The words are the credit that BibleProject gives on its help page for app creators. Section 17.10 has the reason.

The sentence of each shared video. It is in the same paragraph as the credit, before it, with one space between them:

| Books | Sentence of the shared video |
|---|---|
| 1 Kings, 2 Kings | The video covers 1 and 2 Kings. |
| 1 Chronicles, 2 Chronicles | The video covers 1 and 2 Chronicles. |
| Ezra, Nehemiah | The video covers Ezra and Nehemiah. |
| 1 John, 2 John, 3 John | The video covers 1, 2, and 3 John. |

Rules for a link to a video:

- It has the look of the link of the line "Where": the group color, weight 600, 15 px, a line height of 24 px, and no line below the words. The sign "›" is hidden from a screen reader.
- Each link is a line of its own. A link is 24 px high or more.
- Its address is `https://www.youtube.com/watch?v=<video id>`, with the video id of section 17.5 and no other parameter.
- It opens in a new tab: `target="_blank"` and `rel="noopener noreferrer"`.
- For a screen reader, its name is its words and then ", on YouTube, in a new tab". Example: "BibleProject overview, part 1, on YouTube, in a new tab". The added words are not visible.

Rules for the credit. Arthur decided the look on 2026-11-18, from renders:

- It is one paragraph, 10 px below the last link to a video.
- It has a line at its left: 2 px wide, in black at 20% opacity. The text starts 10 px to the right of the line.
- The text is in the secondary ink color, weight 400, 14 px, with a line height of 21 px.
- The link "bibleproject.com" is in the group color, with a line below the words. It opens in a new tab, with `rel="noopener noreferrer"`. For a screen reader, its name is "bibleproject.com, in a new tab".
- The link "bibleproject.com" is a link in a sentence, as the links of the Sources page are. The rule of 24 px for a control does not apply to it.
- Each book has the credit, with the same words.

The line has no other words, no picture, and no sign of YouTube or of BibleProject.

### 17.4 Where the line is

- It is the last line of the list of the facts: below "Where", or below "Written" in the five books that have no line "Where".
- It is in the list of the facts, so it shows when the introduction shows. It does not wait for a file: the video list is in the code.
- It does not depend on the map index.
- It is the same in the three translations.

### 17.5 The video list

This list is the only source of a video address. No person and no agent adds, removes, or changes a row without a decision of Arthur. The rows are in the order of the two playlists.

| No. | Playlist | Video id | Title on YouTube | Book ids | Words of the link | Sentence of the shared video |
|---|---|---|---|---|---|---|
| 1 | Old Testament | `ALsluAKBZ-c` | Old Testament Summary: A Complete Animated Overview | none: Sources page | Old Testament overview |  |
| 2 | Old Testament | `GQI72THyO5I` | Book of Genesis Summary: A Complete Animated Overview (Part 1) | `genesis` | BibleProject overview, part 1 |  |
| 3 | Old Testament | `F4isSyennFo` | Book of Genesis Summary: A Complete Animated Overview (Part 2) | `genesis` | BibleProject overview, part 2 |  |
| 4 | Old Testament | `jH_aojNJM3E` | Book of Exodus Summary: A Complete Animated Overview (Part 1) | `exodus` | BibleProject overview, part 1 |  |
| 5 | Old Testament | `oNpTha80yyE` | Book of Exodus Summary: A Complete Animated Overview (Part 2) | `exodus` | BibleProject overview, part 2 |  |
| 6 | Old Testament | `IJ-FekWUZzE` | Book of Leviticus Summary: A Complete Animated Overview | `leviticus` | BibleProject overview |  |
| 7 | Old Testament | `tp5MIrMZFqo` | Book of Numbers Summary: A Complete Animated Overview | `numbers` | BibleProject overview |  |
| 8 | Old Testament | `q5QEH9bH8AU` | Book of Deuteronomy Summary: A Complete Animated Overview | `deuteronomy` | BibleProject overview |  |
| 9 | Old Testament | `JqOqJlFF_eU` | Book of Joshua Summary: A Complete Animated Overview | `joshua` | BibleProject overview |  |
| 10 | Old Testament | `kOYy8iCfIJ4` | Book of Judges Summary: A Complete Animated Overview | `judges` | BibleProject overview |  |
| 11 | Old Testament | `QJOju5Dw0V0` | Book of 1 Samuel Summary: A Complete Animated Overview | `1-samuel` | BibleProject overview |  |
| 12 | Old Testament | `YvoWDXNDJgs` | Book of 2 Samuel Summary: A Complete Animated Overview | `2-samuel` | BibleProject overview |  |
| 13 | Old Testament | `bVFW3wbi9pk` | Books of 1-2 Kings Summary: A Complete Animated Overview | `1-kings`, `2-kings` | BibleProject overview | The video covers 1 and 2 Kings. |
| 14 | Old Testament | `d0A6Uchb1F8` | Book of Isaiah Summary: A Complete Animated Overview (Part 1) | `isaiah` | BibleProject overview, part 1 |  |
| 15 | Old Testament | `_TzdEPuqgQg` | Book of Isaiah Summary: A Complete Animated Overview (Part 2) | `isaiah` | BibleProject overview, part 2 |  |
| 16 | Old Testament | `RSK36cHbrk0` | Book of Jeremiah Summary: A Complete Animated Overview | `jeremiah` | BibleProject overview |  |
| 17 | Old Testament | `R-CIPu1nko8` | Book of Ezekiel Summary: A Complete Animated Overview (Part 1) | `ezekiel` | BibleProject overview, part 1 |  |
| 18 | Old Testament | `SDeCWW_Bnyw` | Book of Ezekiel Summary: A Complete Animated Overview (Part 2) | `ezekiel` | BibleProject overview, part 2 |  |
| 19 | Old Testament | `kE6SZ1ogOVU` | Book of Hosea Summary: A Complete Animated Overview | `hosea` | BibleProject overview |  |
| 20 | Old Testament | `zQLazbgz90c` | Book of Joel Summary: A Complete Animated Overview | `joel` | BibleProject overview |  |
| 21 | Old Testament | `mGgWaPGpGz4` | Book of Amos Summary: A Complete Animated Overview | `amos` | BibleProject overview |  |
| 22 | Old Testament | `i4ogCrEoG5s` | Book of Obadiah Summary: A Complete Animated Overview | `obadiah` | BibleProject overview |  |
| 23 | Old Testament | `dLIabZc0O4c` | Book of Jonah Summary: A Complete Animated Overview | `jonah` | BibleProject overview |  |
| 24 | Old Testament | `MFEUEcylwLc` | Book of Micah Summary: A Complete Animated Overview | `micah` | BibleProject overview |  |
| 25 | Old Testament | `Y30DanA5EhU` | Book of Nahum Summary: A Complete Animated Overview | `nahum` | BibleProject overview |  |
| 26 | Old Testament | `OPMaRqGJPUU` | Book of Habakkuk Summary: A Complete Animated Overview | `habakkuk` | BibleProject overview |  |
| 27 | Old Testament | `oFZknKPNvz8` | Book of Zephaniah Summary: A Complete Animated Overview | `zephaniah` | BibleProject overview |  |
| 28 | Old Testament | `juPvv_xcX-U` | Book of Haggai Summary: A Complete Animated Overview | `haggai` | BibleProject overview |  |
| 29 | Old Testament | `_106IfO6Kc0` | Book of Zechariah Summary: A Complete Animated Overview | `zechariah` | BibleProject overview |  |
| 30 | Old Testament | `HPGShWZ4Jvk` | Book of Malachi Summary: A Complete Animated Overview | `malachi` | BibleProject overview |  |
| 31 | Old Testament | `j9phNEaPrv8` | Book of Psalms Summary: A Complete Animated Overview | `psalms` | BibleProject overview |  |
| 32 | Old Testament | `AzmYV8GNAIM` | Book of Proverbs Summary: A Complete Animated Overview | `proverbs` | BibleProject overview |  |
| 33 | Old Testament | `xQwnH8th_fs` | Book of Job Summary: A Complete Animated Overview | `job` | BibleProject overview |  |
| 34 | Old Testament | `4KC7xE4fgOw` | Song of Songs Summary: A Complete Animated Overview | `song-of-solomon` | BibleProject overview |  |
| 35 | Old Testament | `0h1eoBeR4Jk` | Book of Ruth Summary: A Complete Animated Overview | `ruth` | BibleProject overview |  |
| 36 | Old Testament | `p8GDFPdaQZQ` | Book of Lamentations Summary: A Complete Animated Overview | `lamentations` | BibleProject overview |  |
| 37 | Old Testament | `lrsQ1tc-2wk` | Book of Ecclesiastes Summary: A Complete Animated Overview | `ecclesiastes` | BibleProject overview |  |
| 38 | Old Testament | `JydNSlufRIs` | Book of Esther Summary: A Complete Animated Overview | `esther` | BibleProject overview |  |
| 39 | Old Testament | `9cSC9uobtPM` | Book of Daniel Summary: A Complete Animated Overview | `daniel` | BibleProject overview |  |
| 40 | Old Testament | `MkETkRv9tG8` | Books of Ezra-Nehemiah Summary: A Complete Animated Overview | `ezra`, `nehemiah` | BibleProject overview | The video covers Ezra and Nehemiah. |
| 41 | Old Testament | `HR7xaHv3Ias` | Books of 1-2 Chronicles Summary: A Complete Animated Overview | `1-chronicles`, `2-chronicles` | BibleProject overview | The video covers 1 and 2 Chronicles. |
| 1 | New Testament | `Q0BrP8bqj0c` | New Testament Summary: A Complete Animated Overview | none: Sources page | New Testament overview |  |
| 2 | New Testament | `3Dv4-n6OYGI` | Gospel of Matthew Summary: A Complete Animated Overview (Part 1) | `matthew` | BibleProject overview, part 1 |  |
| 3 | New Testament | `GGCF3OPWN14` | Gospel of Matthew Summary: A Complete Animated Overview (Part 2) | `matthew` | BibleProject overview, part 2 |  |
| 4 | New Testament | `HGHqu9-DtXk` | Gospel of Mark Summary: A Complete Animated Overview | `mark` | BibleProject overview |  |
| 5 | New Testament | `G-2e9mMf7E8` | Gospel of John Summary: A Complete Animated Overview (Part 1) | `john` | BibleProject overview, part 1 |  |
| 6 | New Testament | `RUfh_wOsauk` | Gospel of John Summary: A Complete Animated Overview (Part 2) | `john` | BibleProject overview, part 2 |  |
| 7 | New Testament | `XIb_dCIxzr0` | Gospel of Luke Summary: A Complete Animated Overview (Part 1) | `luke` | BibleProject overview, part 1 |  |
| 8 | New Testament | `26z_KhwNdD8` | Gospel of Luke Summary: A Complete Animated Overview (Part 2) | `luke` | BibleProject overview, part 2 |  |
| 9 | New Testament | `CGbNw855ksw` | Book of Acts Summary: A Complete Animated Overview (Part 1) | `acts` | BibleProject overview, part 1 |  |
| 10 | New Testament | `Z-17KxpjL0Q` | Book of Acts Summary: A Complete Animated Overview (Part 2) | `acts` | BibleProject overview, part 2 |  |
| 11 | New Testament | `ej_6dVdJSIU` | Book of Romans Summary: A Complete Animated Overview (Part 1) | `romans` | BibleProject overview, part 1 |  |
| 12 | New Testament | `0SVTl4Xa5fY` | Book of Romans Summary: A Complete Animated Overview (Part 2) | `romans` | BibleProject overview, part 2 |  |
| 13 | New Testament | `yiHf8klCCc4` | Book of 1 Corinthians Summary: A Complete Animated Overview | `1-corinthians` | BibleProject overview |  |
| 14 | New Testament | `3lfPK2vfC54` | Book of 2 Corinthians Summary: A Complete Animated Overview | `2-corinthians` | BibleProject overview |  |
| 15 | New Testament | `vmx4UjRFp0M` | Book of Galatians Summary: A Complete Animated Overview | `galatians` | BibleProject overview |  |
| 16 | New Testament | `Y71r-T98E2Q` | Book of Ephesians Summary: A Complete Animated Overview | `ephesians` | BibleProject overview |  |
| 17 | New Testament | `oE9qqW1-BkU` | Book of Philippians Summary: A Complete Animated Overview | `philippians` | BibleProject overview |  |
| 18 | New Testament | `pXTXlDxQsvc` | Book of Colossians Summary: A Complete Animated Overview | `colossians` | BibleProject overview |  |
| 19 | New Testament | `No7Nq6IX23c` | Book of 1 Thessalonians Summary: A Complete Animated Overview | `1-thessalonians` | BibleProject overview |  |
| 20 | New Testament | `kbPBDKOn1cc` | Book of 2 Thessalonians Summary: A Complete Animated Overview | `2-thessalonians` | BibleProject overview |  |
| 21 | New Testament | `7RoqnGcEjcs` | Book of 1 Timothy Summary: A Complete Animated Overview | `1-timothy` | BibleProject overview |  |
| 22 | New Testament | `urlvnxCaL00` | Book of 2 Timothy Summary: A Complete Animated Overview | `2-timothy` | BibleProject overview |  |
| 23 | New Testament | `PUEYCVXJM3k` | Book of Titus Summary: A Complete Animated Overview | `titus` | BibleProject overview |  |
| 24 | New Testament | `aW9Q3Jt6Yvk` | Book of Philemon Summary: A Complete Animated Overview | `philemon` | BibleProject overview |  |
| 25 | New Testament | `1fNWTZZwgbs` | Book of Hebrews Summary: A Complete Animated Overview | `hebrews` | BibleProject overview |  |
| 26 | New Testament | `qn-hLHWwRYY` | Book of James Summary: A Complete Animated Overview | `james` | BibleProject overview |  |
| 27 | New Testament | `WhP7AZQlzCg` | Book of 1 Peter Summary: A Complete Animated Overview | `1-peter` | BibleProject overview |  |
| 28 | New Testament | `wWLv_ITyKYc` | Book of 2 Peter Summary: A Complete Animated Overview | `2-peter` | BibleProject overview |  |
| 29 | New Testament | `l3QkE6nKylM` | Books of 1-3 John Summary: A Complete Animated Overview | `1-john`, `2-john`, `3-john` | BibleProject overview | The video covers 1, 2, and 3 John. |
| 30 | New Testament | `6UoCmakZmys` | Book of Jude Summary: A Complete Animated Overview | `jude` | BibleProject overview |  |
| 31 | New Testament | `5nvVVcYD-0w` | Book of Revelation Summary: A Complete Animated Overview (Part 1) | `revelation` | BibleProject overview, part 1 |  |
| 32 | New Testament | `QpnIrbq2bKo` | Book of Revelation Summary: A Complete Animated Overview (Part 2) | `revelation` | BibleProject overview, part 2 |  |

How the designer made and checked the list on 2026-11-18:

- The designer read the video id and the title of each video from the data of the two playlist pages.
- For each of the 73 video ids, the address `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=<video id>` gave the same title, and the author name "BibleProject".
- The SHA-256 of the 73 lines "video id, tab, title", in the order of this table, with a line feed after each line, is `94e0f6bf2fb0207bea9fbe0cc5913a7ba85d8a740e39727958aa7d38cfe6a46d`. It is the same for the playlist pages and for this table.

The numbers of the list:

- 73 rows: 41 and 32.
- 71 rows have a book id. 2 rows have none.
- Each of the 66 book ids of `public/data/books.json` is in the list.
- 56 books have one row, and 10 books have two rows.
- 4 rows have more than one book id. They have 9 book ids together, and each of them has a sentence of the shared video.

The name of a book in a title is the name that BibleProject uses. Example: "Song of Songs" for the book that the site names "Song of Solomon". The words of a link do not name the book, so the two names do not meet on a page.

### 17.6 The section "Videos" on the Sources page

- It is after the section "Places" and before the section "Fonts".
- Its first paragraph: "Each book has a link to a video about the book. The link is in “About this book”. The videos are by BibleProject, and each link opens a video on YouTube. A video gives the view of BibleProject. The introductions of this site do not come from the videos. BibleProject has no connection with this site."
- Its second paragraph: "BibleProject also has a video about each part of the Bible:" and then two links, "Old Testament overview" and "New Testament overview". They go to rows 1 of the two playlists in section 17.5.
- Its third paragraph is the credit of section 17.3, with the same words and the same link. It is in the normal text of the Sources page, with no line at its left. Reason: the terms ask for the notice near each link to a video, and this section has two.
- The two links to a video open in a new tab, by the rules of section 17.3 for the address, the new tab, and the name for a screen reader.

### 17.7 The space above the read-with list

- Arthur gave this on 2026-11-18, from the first renders: with "About this book" closed, the space above the read-with list is good. With "About this book" open, it is too small.
- Measured on the built site of Task 41, at 1440 by 900 px and at 390 by 844 px:
  - Closed: the read-with list starts 6 px below the control "About this book". The control has 8 px of its own below its words.
  - Open: the read-with list starts 6 px below the list of the facts. The lines of the facts are 8 px from each other, so the read-with list looks like one more line of the facts.
- The rule: the bottom margin of the list of the facts is 16 px, where it was 6 px. With "About this book" open, the read-with list then starts 16 px below the list of the facts.
- With "About this book" closed, nothing changes.
- The designer made renders with 6, 16, 22, and 28 px, and selected 16 px.

### 17.8 Selected by the designer, without a decision by Arthur

Arthur saw the first four points in the renders and approved the line as shown.

- The label "Video", and the words "BibleProject overview", ", part 1", and ", part 2".
- The sentence of a shared video and its words. The first proposal of the designer was a link with the books in it, as in "BibleProject overview of 1–2 Kings". At 390 px that link is wider than its column, and the sign "›" goes to a line of its own.
- Two links with the full words for a book with two videos. The first proposal was "Part 1" and "Part 2". A link with its full words is clear to a screen reader.
- The sign "›" for a link that goes to a different site. The usual sign "↗" is not in the font files of Inrond of the site.
- The value of 16 px in section 17.7. Arthur asked for more space and gave no value.
- The words of section 17.6, and the position of the section "Videos". Arthur approved a short section that gives the credit and has the two summary videos. He did not see the words.
- The name of a link for a screen reader.
- For the credit: the 10 px above it, where Arthur asked for "just a bit" more than the 6 px of the render. The color and the width of the line at its left, the 10 px between the line and the text, and the line height of 21 px. Arthur saw them in the last render.
- The address form of section 17.3. A link does not have the playlist in its address, so YouTube does not start the next video of the playlist.

### 17.9 Not decided and not checked

1. The terms of BibleProject: section 17.10.
2. A video can go away. BibleProject can remove a video or put a new one in its place. The site does not check its links. A link to a removed video opens a page of YouTube that says so.
3. The videos are also on `bibleproject.com`. The links go to YouTube, because Arthur gave the two playlists of YouTube.
4. No test on a real phone. On a phone, the link possibly opens the YouTube app and not a new tab. This is not checked.
5. A reader with a video on YouTube gets the tracking of YouTube there. The site cannot change this.

### 17.10 The terms of BibleProject, and the credit

Claude Code stopped Task 42 at step 1 on 2026-11-18 and changed no file: the terms of BibleProject ask for a notice near a link to a video. The line of the first design did not have one. Arthur decided the credit of section 17.3 the same day.

What the terms say. Claude Code and the designer each read `https://bibleproject.com/terms/` on 2026-11-18, in a browser. The page has the date "Updated October 2026". This is a summary in the words of the designer, not the text of the terms:

- The section "Video Content" permits a stream of a video, or a link to a video, in a site of a different owner, until BibleProject tells the owner to remove it.
- The owner does not ask for payment and makes no profit from the videos.
- The owner does not sell, copy, edit, or change a video, and does not put a video on a different server.
- Near the video, the owner puts a clear and prominent notice. The notice names BibleProject as the author and owner of the video, and it has a link to `www.bibleproject.com`.
- The owner agrees to the terms of the service that has the video. For the site, that is YouTube.
- The section "BibleProject Trademarks" gives no right to the name or the logo of BibleProject, other than to refer to BibleProject. Its reason: no reader thinks that BibleProject sponsors a site that only uses its content.

How the site meets each point:

- The site is free, and it has links only. It has no copy of a video.
- The credit is the notice. It is directly below the links, in each book, and it shows when the links show.
- The credit has the words that BibleProject gives for this purpose. Its help page for app creators, `https://help.bibleproject.com/hc/en-us/articles/22547623073687`, asks for a credit to BibleProject at each place that has one of its resources, with these words. The designer read that page through a fetch tool on 2026-11-18. Claude Code got an HTTP 403 error from the help pages.
- The name "BibleProject" is in the words of the link, so the reader sees it before a tap.
- The site uses the name as a reference only, with no logo. The Sources page says that BibleProject has no connection with the site.

How prominent the credit is. The terms do not say what "prominent" means. The designer compared the question with the rules of the United States Federal Trade Commission for a disclosure in an advertisement, as a comparison only: a reader must not easily miss it, and its size, its contrast, and its position are judged against the text around it. The designer told Arthur that gray text and a smaller size make the credit less prominent than the text of the facts. Arthur decided on 2026-11-18: the credit must not look like a fact of the site, so it has the line at its left, gray text, and 14 px. The gray has a contrast of 5.0 to 1 against white.

Arthur gave an example on 2026-11-18. An app that he uses shows these videos with the label "Devotional", and he needed a long time to see that the app did not make them. The line "Video" must not do this to a reader.

Not checked:

1. If BibleProject accepts this credit for a text link. Only BibleProject can say. Arthur can ask.
2. The help pages, in a browser.
3. The designer is not a lawyer. This section is not legal advice.

### 17.11 Task 42 as built, checked on 2026-11-18

Claude Code completed Task 42 in commit `9146072`. The designer ran the build in a browser at 1440 by 900 px and at 390 by 844 px, in Mark, Matthew, 1 Kings, 2 Kings, and Philemon, and on the Sources page.

1. For each of the 66 books, the video ids and the sentence of the shared video in `src/data/videos.ts` are those of section 17.5.
2. Each link to a video has the words and the address of sections 17.3 and 17.5, and it opens in a new tab.
3. The credit has the words of section 17.3, with no change. It is 10 px below the last link, at 14 px, in the secondary ink color, with the line of 2 px at its left.
4. With "About this book" open, the read-with list is 16 px below the list of the facts. With "About this book" closed, it is 6 px below the control.
5. Philemon has the line "Video" below the line "Written", and no line "Where".
6. No page made a request to a different server.
7. The Sources page has the section "Videos" between "Places" and "Fonts", with the words of section 17.6, the two links, and the credit.

Three points are different from the task. Arthur decided on 2026-11-18 to keep them as built:

- The name of a link for a screen reader is an `aria-label`, not hidden text. The name is the one of section 17.3.
- On the Sources page, the two summary links are a list with bullets. Each link is as high as its line of 27 px, because the accessibility test of the site counts a link that is alone on its line as a control.
- Five older tests changed, so that their lists have "Video" and "Videos".

From the report of Claude Code, not checked by the designer:

- 7 chapters have no read-with list: Judges 12, Psalms 61, 70, 117, 124, and 134, and Jeremiah 45. With "About this book" open, the line below the chapter heading is 33 px below the list of the facts there. Before Task 42, it was 23 px.
- The contrast against white: the text of the credit, 5.07 to 1. The link of the credit in the group color of Prophecy, `#986694`, 4.503 to 1, and in that of Major Prophets, `#9D6E00`, 4.502 to 1. These two are the lowest.
- 243 unit tests and 437 browser tests pass.

## 18. Dark mode, of 2026-11-18

Arthur asked for a dark mode on 2026-11-18. He approved the direction from sketches, and then the control. The sketches are in `docs/screenshots/dark-design/`. They are the built site of Task 43 with the colors replaced in the workspace of the designer. Nothing of this section is built when Task 44 starts.

- `dark-palette.png`: the ten group colors as built and as proposed, each with its contrast.
- `dark-wall-1440.png`, `dark-read-red-1440.png`, `dark-read-top-1440.png`, and `dark-map-1440.png`: the wall, Matthew 5, Matthew 1 with "About this book" open, and the map of Acts.
- `dark-phone-390.png`: the same four views at 390 by 844 px.
- `control-options-1440.png` and `control-options-390.png`: the two controls that Arthur selected from. Option A is the decision.

### 18.1 Reason

- A reader reads at night and on a phone. A white page is hard on the eyes in a dark room.
- The risk, from Arthur's principle of 2026-11-17: beautiful design is what makes this project different. A dark mode where the ten groups look weak, or look like different groups, breaks the wall. So the sketches came before a task.

### 18.2 Decided by Arthur on 2026-11-18

1. The site gets a dark mode, in the look of the sketches.
2. The reader selects it with one switch, "Dark mode", with the states "On" and "Off". Section 18.3.
3. At the first visit, the site follows the setting of the device. After the reader uses the switch, the site keeps the selection of the reader.

### 18.3 The switch "Dark mode"

- It is a row with the words "Dark mode" and the state "On" or "Off", in the form of the red letters switch.
- It is in the two places that have the red letters switch: the text list in the wide layout, and the menu panel of the reading page in the narrow layout. In each place it is the row below "Red letters". In the text list, a thin line is between the two rows.
- The mode is for the complete site: the wall, the reading page, the map page, and the pages of the Reference section.
- The site keeps the selection in the storage of the browser, with the key `bible-dark-mode`, in the form of the key `bible-red-letters`.
- With no value for that key, the site follows the device: the media feature `prefers-color-scheme`. If the device changes while the page is open, the page changes.
- With a value for that key, the site does not follow the device.
- The page must not show the light mode for a moment before the dark mode. The mode is set before the first paint.
- The wall has no text list. In the wide layout, the reader changes the mode from a reading page, as for the translation. This is a value of the designer. Arthur read it and gave no change.

### 18.4 The colors of the page

The rule of the dark mode: each color has one name, and the dark mode gives each name a second value. No part gets a new shape, a new size, or a new position.

| Name | Light, as built | Dark |
|---|---|---|
| Page | `#FFFFFF` | `#1C1C1E` |
| Ink | `#1D1D1F` | `#F5F5F7` |
| Secondary ink | `#6E6E73` | `#A1A1A6` |
| A thin line | black at 9% | white at 16% |
| The surface of a panel with no text in a group color | `#FFFFFF` | `#2C2C2E` |
| The surface of a panel with text in a group color | `#FFFFFF` | `#1C1C1E`. Its border is the thin line, as built. |
| A light gray surface | `#F5F5F7` | `#2C2C2E` |
| Red letters | `#8B1A1A` | `#EE766C` |

- The page is near black, not full black. White text on full black is hard on the eyes in a long text.
- Contrast against `#1C1C1E`: ink 15.6 to 1, secondary ink 6.6 to 1, red letters 6.0 to 1.
- A text in a group color is only on the page color `#1C1C1E`. On `#2C2C2E`, the group color of History has a contrast of 4.2 to 1. So a panel with such a text keeps the page color. Its border and its shadow set it apart from the page.
- The text of the band has the color of the page. In the light mode that is white on the group color, as built. In the dark mode that is `#1C1C1E` on the dark group color. The rule is the same in the two modes.
- A shadow stays black. A part that the light mode makes darker on hover, with a mix of the group color and black, is made lighter in the dark mode, with a mix of the group color and white.
- This table has the main names only. Section 18.11 has the dark value of each of the 45 names of Task 44.

### 18.5 The ten group colors

Each dark color keeps the hue of its group and is lighter. Each has a contrast of 4.5 to 1 or more against `#1C1C1E`.

| Group | Light, as built | Contrast against white | Dark | Contrast against `#1C1C1E` |
|---|---|---|---|---|
| Law | `#C2255C` | 5.7 | `#F26A90` | 5.9 |
| History | `#B01E35` | 6.8 | `#F3585D` | 5.2 |
| Poetry & Wisdom | `#CD4C26` | 4.5 | `#EB7443` | 5.8 |
| Major Prophets | `#9D6E00` | 4.5 | `#CD9C34` | 6.8 |
| Minor Prophets | `#667F19` | 4.6 | `#86A645` | 6.1 |
| Gospels | `#26828B` | 4.5 | `#49A8B3` | 6.1 |
| History (Acts) | `#6E6A66` | 5.4 | `#9C9793` | 5.9 |
| Letters of Paul | `#1B2A41` | 14.4 | `#8DB3EA` | 7.9 |
| General Letters | `#4B2E57` | 11.5 | `#C0A1E4` | 7.7 |
| Prophecy | `#986694` | 4.5 | `#BB7DAD` | 5.4 |

- The lowest contrast is that of History, 5.16 to 1. A unit test keeps each dark color at 4.5 to 1 or more against the page color, and against the page color with the hover of section 18.11.
- The designer changed two colors after the first sketches, on 2026-11-18: History was `#E74D54`, at 4.5 to 1, and Prophecy was `#B274A4`, at 4.8 to 1. With those values, the two colors were below 4.5 to 1 on a chapter of the chapter grid under the pointer. The pictures `dark-wall-1440.png`, `dark-read-red-1440.png`, `dark-read-top-1440.png`, `dark-map-1440.png`, and `dark-phone-390.png` have the first values. `dark-palette.png` and the four sheets of section 18.11 have the values of this table.
- Letters of Paul and General Letters are the two darkest colors on white. They are the two lightest colors on the dark page. This keeps General Letters apart from Prophecy, which is the same family of purple.
- The designer computed the colors in the OKLCH color space: the hue of the group, and a lightness between 0.67 and 0.76.

### 18.6 The map in the dark mode

| Part | Light, as built | Dark |
|---|---|---|
| Sea and lakes | `#FFFFFF` | `#1C1C1E`, the page color |
| Land | `#F4F1EB` | `#2B2A28` |
| Coast line | `#CFC8BB` | `#55514A` |
| Line of a river and of a lake | `#A9C0CC` | `#456072` |
| Name of a water | `#4A6F84` | `#86AEC6` |
| Name of a place | `#1D1D1F` | `#F5F5F7` |
| Secondary text of the map | `#6B6B6B` | `#A1A1A6` |
| Edge of a dot, and the inside of an open dot | `#FFFFFF` | `#1C1C1E` |
| Dot, triangle, and ring | the group color | the dark group color |

WARNING: The map has an SVG mask that stops the coast, river, and lake lines at each name. In a mask, white is "show" and black is "hide". These two values are not colors of the look. They do not change in the dark mode. In the sketch, a change of the white of the mask made the lines go away.

### 18.7 What does not change

- The light mode. After each task of this section, each page in the light mode is the same as before, pixel for pixel.
- The words, the data, the sizes, the spaces, and the positions.
- The icon of the site.
- The red letters switch, the text size, and each other setting.

### 18.8 The tasks

1. Task 44: each color of the site gets one name in one place, and a report gives the list. It changes nothing on the site. Done.
2. Task 45: the dark mode on each page, and the switch. In this task, the first state of the switch is "Off", and the site does not follow the device.
3. Task 46: the first visit follows the device. Arthur approved the dark pages on 2026-11-18. Section 18.13.

The first plan had two tasks in place of Task 45: the wall and the reading page, and then the map and the Reference section. After Task 44, each color is a name, so one rule makes each page dark. Two tasks would need more work, to keep some pages light for a time.

### 18.9 Selected by the designer, without a decision by Arthur

Arthur saw these in the sketches and approved the direction.

- The page color `#1C1C1E`, the ink colors, and the ten dark group colors.
- The rule for the text of the band.
- The dark red of the red letters.
- The colors of the dark map.
- The key `bible-dark-mode`, and the place of the switch.
- The order of the tasks, and the rule that the site does not follow the device until Arthur approves the dark pages.

### 18.10 Weak points, not decided, and not checked

1. The red letters are near the dark colors of History and of Poetry & Wisdom. In Matthew 5, the red text and the label "Psalms 37:11" in the margin are close. On white, the dark red is clearly different.
2. On the dark map, the land is only a little lighter than the sea. The coast line carries the shape.
3. Law, History, and Poetry & Wisdom are three warm colors. They are distinct on the dark wall, but less than on white.
4. Not in the sketches: each state under the pointer, each focus outline, the verse that travel opens, and a message for an error. The four sheets of section 18.11 have the other parts.
5. The words of the Sources page do not name the modes. No decision.
6. The line `theme-color` of `index.html` is white. The dark mode needs the page color there. Task 45 sets it.
7. No test on a real phone.

### 18.11 The dark value of each name, from the report of Task 44

Claude Code completed Task 44 in commit `b889e82`. Its report is `docs/reviews/task-44-colors.md`: 45 names of colors in the first `:root` block of `src/index.css`, and ten group names from `src/data/books.ts`. The designer compared 14 pairs of pages of the build before and after, at 1440 by 900 px and at 390 by 844 px: 0 different pixels.

The designer then gave each name a dark value, put the values on the build of Task 44 in the workspace, and looked at each kind of page. The sheets `dark-panels-1440.png`, `dark-pages-1440.png`, `dark-panels-390.png`, and `dark-pages-390.png` in `docs/screenshots/dark-design/` show the result: the pop-up, the trail, the chapter grid, the translation list, the text list, "Scholars differ", the timeline, the quotation diagram, the Sources page, and the map. In these sheets, the text of the pop-up and of Numbers did not load, because the workspace did not have the file. This is not a defect of the site.

This table is the only source of a dark value. The light values are those of `src/index.css`, and they do not change.

| Name | Light, as built | Dark |
|---|---|---|
| `--page` | `#fff` | `#1C1C1E` |
| `--ink` | `#1d1d1f` | `#F5F5F7` |
| `--ink-secondary` | `#6e6e73` | `#A1A1A6` |
| `--ink-italic` | `#3a3a3c` | `#D1D1D6` |
| `--red-letters` | `#8b1a1a` | `#EE766C` |
| `--on-group` | `#fff` | `#1C1C1E` |
| `--line` | `rgba(0, 0, 0, 0.09)` | `rgba(255,255,255,0.16)` |
| `--line-faint` | `rgba(0, 0, 0, 0.05)` | `rgba(255,255,255,0.09)` |
| `--divider` | `rgba(0, 0, 0, 0.14)` | `rgba(255,255,255,0.24)` |
| `--sample-line` | `#e3e3e6` | `#3A3A3C` |
| `--credit-line` | `rgba(0, 0, 0, 0.2)` | `rgba(255,255,255,0.32)` |
| `--border-chip` | `rgba(0, 0, 0, 0.14)` | `rgba(255,255,255,0.24)` |
| `--border-draft` | `rgba(0, 0, 0, 0.15)` | `rgba(255,255,255,0.25)` |
| `--border-button` | `rgba(0, 0, 0, 0.18)` | `rgba(255,255,255,0.30)` |
| `--border-select` | `rgba(0, 0, 0, 0.2)` | `rgba(255,255,255,0.34)` |
| `--bar` | `rgba(255, 255, 255, 0.9)` | `rgba(28,28,30,0.9)` |
| `--panel` | `#fff` | `#2C2C2E` |
| `--panel-group` | `#fff` | `#1C1C1E` |
| `--surface-gray` | `#f5f5f7` | `#2C2C2E` |
| `--hover` | `rgba(0, 0, 0, 0.05)` | `rgba(255,255,255,0.05)` |
| `--button-hover` | `#f5f5f7` | `#3A3A3C` |
| `--shade-bar` | `rgba(0, 0, 0, 0.18)` | `rgba(0,0,0,0.45)` |
| `--shade-pop` | `rgba(0, 0, 0, 0.22)` | `rgba(0,0,0,0.5)` |
| `--hit` | `rgba(0, 0, 0, 0.06)` | `rgba(255,255,255,0.08)` |
| `--hit-mix` | `#000` | `#fff` |
| `--shadow-panel` | `0 14px 30px rgba(0, 0, 0, 0.08)` | `0 14px 30px rgba(0,0,0,0.45)` |
| `--shadow-list` | `0 14px 34px rgba(0, 0, 0, 0.14), 0 0 0 1px rgba(0, 0, 0, 0.07)` | `0 14px 34px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.12)` |
| `--shadow-pop` | `0 18px 50px rgba(0, 0, 0, 0.16)` | `0 18px 50px rgba(0,0,0,0.55)` |
| `--shadow-button` | `0 1px 2px rgba(0, 0, 0, 0.06)` | `0 1px 2px rgba(0,0,0,0.4)` |
| `--switch-off` | `#8e8e93` | `#7C7C80` |
| `--switch-knob` | `#fff` | `#1C1C1E` |
| `--disabled` | `#b0b0b5` | `#636366` |
| `--timeline-dot-open` | `#fff` | `#1C1C1E` |
| `--timeline-halo` | `#fff` | `#1C1C1E` |
| `--map-sea` | `#fff` | `#1C1C1E` |
| `--map-land` | `#f4f1eb` | `#2B2A28` |
| `--map-coast` | `#cfc8bb` | `#55514A` |
| `--map-water-line` | `#a9c0cc` | `#456072` |
| `--map-water-name` | `#4a6f84` | `#86AEC6` |
| `--map-place-name` | `#1d1d1f` | `#F5F5F7` |
| `--map-secondary` | `#6b6b6b` | `#A1A1A6` |
| `--map-dot-edge` | `#fff` | `#1C1C1E` |
| `--map-dot-open` | `#fff` | `#1C1C1E` |
| `--quote-line-dim` | `#1d1d1f` | `#F5F5F7` |
| `--quote-name-dim` | `#6e6e73` | `#A1A1A6` |

The ten group names. Section 18.5 has the contrast of each:

| Name | Light, as built | Dark |
|---|---|---|
| `--group-law` | `#C2255C` | `#F26A90` |
| `--group-history` | `#B01E35` | `#F3585D` |
| `--group-poetry-wisdom` | `#CD4C26` | `#EB7443` |
| `--group-major-prophets` | `#9D6E00` | `#CD9C34` |
| `--group-minor-prophets` | `#667F19` | `#86A645` |
| `--group-gospels` | `#26828B` | `#49A8B3` |
| `--group-history-acts` | `#6E6A66` | `#9C9793` |
| `--group-letters-of-paul` | `#1B2A41` | `#8DB3EA` |
| `--group-general-letters` | `#4B2E57` | `#C0A1E4` |
| `--group-prophecy` | `#986694` | `#BB7DAD` |

The SHA-256 of the 55 lines "name, equals sign, dark value", in the order of the two tables, with a line feed after each line and with the values as written here, is `3ae78db0ebd1487092306268eeffbaf7b338fd6de9c07d82b2fcfaefc9069121`.

The rules behind the values:

- A black line or border at an opacity becomes a white line at about 1.7 times that opacity.
- A shadow stays black, with more opacity. The ring of 1 px in `--shadow-list` is a border, so it becomes white.
- A surface that is white, and that has a text in a group color, is the page color. A surface that is white with no such text is `#2C2C2E`.
- `--on-group`, `--switch-knob`, `--timeline-dot-open`, `--timeline-halo`, `--map-sea`, `--map-dot-edge`, and `--map-dot-open` are the page color. Each one is a part that the light mode shows in the color of the page.
- `--hover` is white at 5%, not more. On the page color with that hover, each group color still has a contrast of 4.5 to 1 or more. The lowest is History, at 4.52.
- `--hit-mix` is white: the number of the verse that travel opens gets lighter, where the light mode makes it darker.
- Contrast against the page color `#1C1C1E`: `--ink-italic` 11.2 to 1, `--map-water-name` 7.2, `--switch-off` 4.1. Against the land of the map, `#2B2A28`: `--map-secondary` 5.6, `--map-water-name` 6.1. Against `--panel`, `#2C2C2E`: `--ink` 12.8, `--ink-secondary` 5.4.

### 18.12 The 11 questions of the report of Task 44

One rule answers most of them: the light mode stays as built. So no name is removed, and no name is joined with a different name. A name with the value of a different name keeps its own role, and the table of section 18.11 gives each name its dark value.

1. `--line-faint` and `--line`: two names stay.
2. The three lines at the left of a text: three names stay.
3. The four borders of a small control: four names stay.
4. `--hover` and `--button-hover`: two names stay.
5. `--map-secondary` and `--ink-secondary`: two names stay, with one dark value.
6. The names with the value of a different name: they stay. Section 18.11 gives each one.
7. `--divider` and `--border-chip`: two names stay.
8. The border of a panel with text in a group color. The dark mode adds no border and changes no border. The pop-up, the chapter grid, and the trail keep `--line`, and the dark value of `--line` is white at 16%. That is the border of section 18.4. An entry of the read-with list keeps `--border-chip`.
9. The two shadows of the translation list: two names stay.
10. The line `theme-color` of `index.html`: the task that builds the dark mode sets it to the page color of the mode.
11. The icon of the site: no change.

### 18.13 Task 45 as built, checked on 2026-11-18

Claude Code completed Task 45 in commit `53f90f4`, and corrected a test of the timeline in commit `1872590`. The designer ran the build in a browser at 1440 by 900 px and at 390 by 844 px.

1. Each of the 45 dark values in `src/index.css` and each of the ten dark group colors in `src/data/books.ts` is the value of section 18.11.
2. With the switch "Off": 14 pairs of pages of the builds of Task 44 and of Task 45 have 0 different pixels. The views: the wall, Matthew 5, the map of Acts, the timeline, the Quotations page, the Sources page, and Hebrews 9.
3. With the switch "On": the same 14 views of the build have 0 different pixels against the sketch of the designer with the values of section 18.11.
4. The switch is below "Red letters" in the text list and in the menu panel. A click changes the page at once, sets the attribute `data-mode="dark"` on the root element, stores the value "on" for the key `bible-dark-mode`, and sets the line `theme-color` to `#1C1C1E`.
5. With the value "on" stored and the JavaScript file stopped, the root element is dark. So a reader with the dark mode sees no white page at the load.
6. The first visit is light. The build does not read the setting of the device.

Arthur approved the dark pages on 2026-11-18. He kept these points as built:

- The attribute `data-mode="dark"`, and the stored values "on" and "off".
- The two values of the line `theme-color` are in `index.html`, in `data-light` and `data-dark`.
- Three older tests changed for the new row, and the test of the timeline at 900 px now waits for the 66 names.

A known limit: `public/manifest.webmanifest` has `#ffffff` for `theme_color` and `background_color`. A browser uses them when a reader adds the site to the home screen. A manifest has one value, not one for each mode. No change.

From the reports of Claude Code, not checked by the designer: 261 unit tests and 459 browser tests pass. The axe check of the 13 dark views has 0 failures. Claude Code looked at 16 parts that the 13 views do not show, and each one is correct. It did not see the hover of the map switch, the hover of the link dot in the narrow layout, and each focus outline on the map page and on the Sources page.

## 19. "About this chapter", of 2026-11-23

Arthur decided this on 2026-11-23. Each chapter on the reading page gets one more control, "About this chapter". It opens a short text about the passage, from the Biblica Study Notes. Task 47 builds it.

The pictures of the design are in `docs/screenshots/about-chapter-design/`. The designer made them on the build of Task 46, with a script that put the control and the panel into the page.

### 19.1 Reason

Arthur wanted an explanation of a chapter for a lay reader, at a high level: what to get out of the chapter. From 2026-11-18 to 2026-11-20 the designer tested a process that writes such a text for each chapter, with agents and reviews. Arthur stopped that process on 2026-11-23, because it took too long. The Biblica Study Notes are a text of this kind that is complete now, with an open license.

### 19.2 Decided by Arthur on 2026-11-23

- The site shows the Biblica Study Notes.
- The Biblica Study Notes come first. The Aquifer Open Study Notes come in a second step. Section 19.12.
- The place is one control "About this chapter" below the heading of the chapter. A control at each passage in the text was the other option. The picture `B-romans8-1440-tall.png` shows the option that Arthur did not select.
- The reader gets no setting that selects the source of "About this chapter".

Arthur saw these notes in the pictures before the decision: Genesis 21:1–22:24, Romans 8:1–17, Romans 8:18–25, and Romans 8:26–39. Arthur approved the source. He did not read the other 747 notes.

### 19.3 The source and its license

| | |
|---|---|
| Name | Biblica Study Notes |
| Copyright line | Biblica Study Notes © 2023 Biblica Inc. |
| License | Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) |
| Address of the license | `https://creativecommons.org/licenses/by-sa/4.0/`. The page of the license gives this address as its canonical address. The two files of the repository give `https://creativecommons.org/licenses/by-sa/4.0/legalcode.en`, the legal text of the same license. The site uses the canonical address. |
| Address of the files | `https://github.com/BibleAquifer/BiblicaStudyNotes` |
| Commit | `1a4501d9571f021bc99d07efb14c7bac79e5e13f`, of 2026-11-02 |
| Version in `eng/metadata.json` | 1.1.2 |
| Files that the site uses | `eng/json/01.content.json` to `eng/json/66.content.json`, `eng/metadata.json`, and `README.md` |

The copyright line and the license are in `README.md` and in `eng/metadata.json` of the repository. The designer read these two files on 2026-11-23.

The designer read sections 2 and 3 of the legal text of the license in a browser on 2026-11-23, at `https://creativecommons.org/licenses/by-sa/4.0/legalcode.en`. The designer is not a lawyer. What the license says, in the words of the designer:

1. A person can copy and share the material, in whole or in part, in each format.
2. With the material, the person must keep the name of the creator, the copyright notice, a notice that refers to the license, and a link to the material, if the licensor supplied them.
3. The person must say if the material was changed.
4. The person must say that the material has this license, with the text of the license or a link to it.
5. A reasonable manner is sufficient for points 2 to 4. A link to a page that has the information can be sufficient.
6. A change of the format is not a change of the material. Section 2(a)(4) of the license.
7. The ShareAlike condition applies to a person who shares changed material.
8. The license gives no permission to say or to suggest that the licensor approves the person or the use.
9. The license gives no rights to a trademark.

How the site meets each point:

- Points 2 to 5: the note credit of section 19.8 is in each panel, below the notes. The Sources page has the same information with more detail. Section 19.9.
- Points 3, 6, and 7: the site changes no word of a note. The site changes only the format: it removes the tags of the files. Section 19.4.
- Points 8 and 9: the site uses the name "Biblica" as a reference only, with no logo. The Sources page says that Biblica has no connection with the site.

### 19.4 The data

The source files go into `sources/biblica/`, with no change: `json/01.content.json` to `json/66.content.json`, `metadata.json`, and `README.md`. The number in a file name is the place of the book in the Bible: `01` is Genesis, and `66` is Revelation.

Each source file is a list of notes. The site uses three fields of a note:

| Field | Example | Meaning |
|---|---|---|
| `content_id` | `"132839"` | The number of the note |
| `index_reference` | `"45008001-45008017"` | The range. Each end has 2 digits for the book, 3 digits for the chapter, and 3 digits for the verse |
| `content` | `"<p>...</p><p>...</p>"` | The words, as HTML |

Facts about the 66 files, from a check by the designer on 2026-11-23:

- 751 notes, 3,228 paragraphs, and 131,406 words.
- Each `content` is a row of `<p>` elements, with no text between them.
- The tags are `<p>`, `<data ...>`, and `<span>`, and no other tag. The `<data>` tags are links to a list of key terms. There are 2 `<span>` tags and 2 `</span>` tags, in 2 notes.
- The character references are `&apos;` and `&shy;`, and no other one.
- In each file, the notes are in the order of the Bible, and each note is in the book of its file.
- The field `title` of each of the 751 notes is equal to the range label of section 19.7.

The text of a paragraph is the characters between `<p>` and `</p>`, with these changes of the format and no other change:

1. Each `<data ...>`, `</data>`, `<span>`, and `</span>` tag is removed. The words between the tags stay.
2. `&apos;` becomes the character `'`.
3. `&shy;` becomes the character U+00AD, the soft hyphen.

WARNING: Do not trim a paragraph, do not join two paragraphs, and do not change a quotation mark, a dash, or a spelling. The spelling of the notes is British.

The script `scripts/build-notes.mjs` makes one file for each book, `public/data/notes/<book id>.json`:

```
{
  "book": "romans",
  "notes": [
    { "id": "132839", "from": [8, 1], "to": [8, 17], "p": ["Paul described two kinds of laws. ...", "..."] }
  ]
}
```

`from` and `to` are the chapter and the verse of the two ends of the range. `p` is the list of the paragraphs. The notes are in the order of the source file. The script stops with an error when a rule of this section does not fit the data. It does not guess.

The number that shows that the words have no change: make a list of lines. For each of the 66 files in the order of the file names, and for each note in the order of the file, the list has one line with the `content_id`, then one line for each paragraph, then one empty line. Put the line feed character after each line, also after each empty line. Encode the result as UTF-8. The SHA-256 of the result is:

`7571b4834420f4b4f1b67c89e13d11e43010f2c3275f507a0cdd847770c6cdf7`

The result has 748,783 bytes.

### 19.5 Which Biblica notes a chapter shows

A chapter shows each note whose range has a verse of the chapter: the chapter number is not less than the chapter of `from` and not more than the chapter of `to`. The notes are in the order of the file.

Numbers for the tests:

- 1,057 of the 1,189 chapters have a note.
- The 132 chapters with no note are psalms. The psalms with a note are 1, 2, 8, 22, 23, 51, 73, 105, 106, 110, 116, 119, 137, and 146 to 150.
- 817 chapters have 1 note, 160 have 2 notes, 65 have 3 notes, 9 have 4 notes, 5 have 5 notes, and 1 chapter has 6 notes. That chapter is Matthew 26.
- A note with a range of more than one chapter shows in each chapter of its range. Example: the note Job 4:1–31:40 shows in 28 chapters. 19 notes have a range of 9 chapters or more.
- The longest panels are those of 1 Chronicles 9 and of Isaiah 8, with 745 words each. The median panel has 285 words. The words of a panel are the words of each paragraph of each note of the chapter, counted by the spaces. No test uses these two numbers.

### 19.6 The control

- The words are "About this chapter", with the caret of "About this book".
- The control has the look and the behavior of the control "About this book": the same font, the same color of the group, and the caret that turns when the panel is open.
- In a chapter with the full heading, the control is on the line of "About this book", to the right of it, with the space of 16 px that the line has. If the line is too narrow, the control goes to a second line.
- In a later chapter of the same book, the control is alone on its line, below the heading and above the read-with list.
- A chapter with no note has no control. Its page does not change.
- A chapter with a note and with no read-with list has the control also.
- The panel is closed when the chapter loads. The site does not store the state.
- Each chapter has its own state. More than one panel can be open on the page.
- The panel is the same in the three translations. The notes quote no translation.
- The control must not move the text after the chapter shows as loaded: the attribute `data-loaded` of the chapter waits for the notes file, as it waits for the links.
- If the notes file did not load, the control shows, and the panel says "The notes did not load." with the role `alert`.

For a screen reader: the control has `aria-expanded` and `aria-controls`. The panel has the role `region` and the name "About" with the name of the book and the number of the chapter, for example "About Genesis 22". The page can have many chapters, so the name of the panel has the chapter.

### 19.7 The panel

The panel is below the line of the controls. If the two panels of a chapter are open, the panel of "About this book" is first.

For each note, the panel has the range label and then the paragraphs of the note. After the last note, it has the note credit.

The range label is the name of the book as the site has it, a space, and the range:

- `<chapter>:<verse>–<verse>` for a range in one chapter. Example: "Romans 8:1–17".
- `<chapter>:<verse>–<chapter>:<verse>` for a range of more than one chapter. Example: "Genesis 21:1–22:24".

The dash is the en dash, U+2013.

The values, from the pictures:

| Part | Value |
|---|---|
| Panel | Margin 8 px above and 16 px below. A line on the left side: 2 px, solid, the color name `--credit-line`. 14 px from the line to the text. |
| Text of a note | Inrond, weight 400, 15 px, line height 1.5, the color name `--ink`. |
| Paragraph | 8 px below each paragraph. |
| Range label | Inrond, weight 600, 13 px, line height 20 px, the color name `--ink-secondary`. 14 px above and 4 px below. The first label has 0 px above. |
| Note credit | Inrond, weight 400, 14 px, line height 21 px, the color name `--ink-secondary`. 14 px above, then a line of 1 px in the color name `--credit-line`, then 10 px to the text. |
| Links of the note credit | The color of the group, with an underline. |

The panel uses only color names that the site has. It needs no new color, and the dark mode needs no new value.

The line on the left side and the note credit tell the reader that the text has a different owner. Arthur's rule of 2026-11-18 for the credit of BibleProject applies: a notice of a different owner must not look like the text of the site.

### 19.8 The note credit

The words:

> From the Biblica Study Notes, © 2023 Biblica Inc., licensed under CC BY-SA 4.0. The words have no changes.

- "Biblica Study Notes" is a link to `https://github.com/BibleAquifer/BiblicaStudyNotes`.
- "CC BY-SA 4.0" is a link to `https://creativecommons.org/licenses/by-sa/4.0/`.
- Each link opens in a new tab. The name of each link for a screen reader adds ", in a new tab", as the credit of BibleProject does.

The designer wrote these words. Biblica did not supply them. WARNING: Do not change a word of the note credit, and do not show a note without it.

### 19.9 The Sources page

The Sources page gets a section "Notes on the chapters", after the section "Book introductions". Its words:

> The text of "About this chapter" is from the Biblica Study Notes, © 2023 Biblica Inc. The license is the Creative Commons Attribution-ShareAlike 4.0 International license (CC BY-SA 4.0).
>
> The site got the files from the repository BibleAquifer/BiblicaStudyNotes on GitHub, version 1.1.2. The site shows the words of the notes with no change. It does not show the links to the key terms of the files.
>
> The notes have no text for 132 psalms. Biblica has no connection with this site.

- "Biblica Study Notes" and "BibleAquifer/BiblicaStudyNotes" are links to `https://github.com/BibleAquifer/BiblicaStudyNotes`.
- "CC BY-SA 4.0" is a link to `https://creativecommons.org/licenses/by-sa/4.0/`.

`docs/DATA-SOURCES.md` gets a section for this source, with the facts of section 19.3.

### 19.10 What does not change

- The Bible text, the links, the marks, the margin labels, the read-with list, and "About this book".
- The page of a chapter with no note.
- The Biblica notes are not in the trail, not in the pop-up, and not on the wall.

### 19.11 Selected by the designer, without a decision by Arthur

1. The words of the note credit, and the words of the section on the Sources page.
2. The sentence "Biblica has no connection with this site."
3. The values of section 19.7.
4. The panel is closed at the load, and the site does not store its state.
5. A note with a range of many chapters shows in each chapter of its range.
6. The name of the control in a later chapter is also "About this chapter".
7. The source files are in the repository, in `sources/biblica/`.

### 19.12 The second step: the Aquifer Open Study Notes

Not in Task 47. Arthur decided the direction on 2026-11-23. The design is not made.

- The source is the Aquifer Open Study Notes, an adaptation of the Tyndale Open Study Notes, with the license CC BY-SA 4.0: `https://github.com/BibleAquifer/AquiferOpenStudyNotes`. It has 16,923 notes and about 751,000 words.
- For a psalm with no Biblica note, the panel "About this chapter" shows the Aquifer note for that psalm, with a credit for that source. The reader sees one control and one panel.
- The other Aquifer notes are a separate layer at their verses, with one switch in the top bar. This layer needs a design and pictures on the built page.
- The reader gets no setting that selects a publisher.

Item 7 of `docs/BACKLOG.md` has the facts and the open questions. From 2026-11-23, section 20 has the design of this step, and Tasks 48 and 49 build it.

### 19.13 Weak points, not decided, and not checked

- The designer read the notes of three chapters. No person checked the teaching of the other notes.
- The notes are in simple English with British spelling: "judgement", "for ever". The Bible text of the site has American spelling.
- The notes and the 66 introductions of the site have different writers. The two can differ on a point. The designer did not compare them.
- A long note shows in many chapters. A reader who opens the panel in Job 5 and in Job 6 gets the same text.
- In a chapter with three notes or more, the open panel is longer than one screen.
- Not checked: that the English files of the repository have the words of Biblica with no change. The file `eng/metadata.json` shows no notice of an adaptation for English.
- Not checked: the website of Biblica. The designer read only the repository and the license.
- Not checked: the dark mode and a real phone. The designer made no picture of them.
- Corrected on 2026-11-23, after the report of step 6 of Task 47: section 19.5 had 738 words for the longest panels and 281 words for the median panel. The designer had removed the tags before the count, so the last word of a paragraph and the first word of the next paragraph were one word. Claude Code found the difference. The correct numbers are 745 and 285.
- The designer told Arthur 159,016 words on 2026-11-23. That number had the headings and the lists of concepts of the Markdown files. The correct number is 131,406.

### 19.14 Task 47 as built, checked on 2026-11-23

Claude Code built Task 47 in the commit `53ee38e`. The designer checked these points on 2026-11-23:

- The SHA-256 of section 19.4, computed by the designer from the 66 files in `public/data/notes/` and from the 66 files in `dist/data/notes/`: both are the number of section 19.4, with 751 notes and 748,783 bytes.
- On the build, at 1440 by 900 px and at 390 by 844 px: Genesis 22 has the two controls on one line, and the panel is closed at the load. The open panel has the range label "Genesis 21:1–22:24", three paragraphs, the note credit with its exact words, and the two addresses of section 19.8. Romans 8 has three range labels in the order of the Bible. Psalms 3 has no control "About this chapter". The page has no horizontal scroll at 390 px with the panel of Romans 8 open.
- The size of the panel in the build and in the pictures of the design differs by 4 px or less. Example: Romans 8 at 1440 px has 1,067 px in the build and 1,066 px in the picture.
- The dark mode on the build at 390 px: the page is `rgb(28, 28, 30)`, the text of a note is `rgb(245, 245, 247)`, and the range label and the note credit are `rgb(161, 161, 166)`.
- The public site, in a browser, on 2026-11-23: it serves `index-DemtqrGF.js`. Psalms 23 has the control, and the open panel has the range label "Psalms 23:1–6", seven paragraphs, and the note credit. Psalms 24, a later chapter on the same page with no note, has no control.

As built, and accepted by the designer:

- The space at a range label follows the table of section 19.7: 14 px above and 4 px below. The pictures of the design have about 4 px less above and about 4 px more below, because the script of the designer had a fault: the rule for a paragraph also applied to the range label. The table is correct.
- A range label is an `h3` element.
- The Sources page has typographic quotation marks around the words About this chapter, as the other sections of that page have.
- If the notes file of a book does not load, each chapter of that book shows the control, and the panel says "The notes did not load." This includes a psalm with no note.
- The page gets the notes file of a book one time, with the text and the links of the first chapter of that book on the page. A chapter shows as loaded only after the notes file loads.
- The 66 files have 787,420 bytes, and 275,119 bytes with gzip.
- Two older tests changed, because the line of "About this book" now has a second control: `e2e/textsize.spec.ts` and `e2e/translation.spec.ts`.
- The script also checks the numbers of section 19.5.

From the report of Claude Code, not checked by the designer: 291 unit tests and 505 tests in the full run pass. The two pairs of screenshots of Psalms 3 have 0 different pixels. The reviewer agent compared the 751 notes with the source files and found 0 differences. Each of the 68 source files has the git blob hash of the commit.

Not checked by a person or an agent: a real phone, and the teaching of the notes.

## 20. Study notes: the Aquifer Open Study Notes, of 2026-11-23

Arthur decided this on 2026-11-23. It is the second step of section 19.12. It has two parts:

1. Part 1, Task 48: a psalm with no Biblica note gets "About this chapter" with a note of the Aquifer Open Study Notes.
2. Part 2, Task 49: the other notes show at their verses, behind one switch, "Study notes".

The pictures of the design are in `docs/screenshots/study-notes-design/`. The designer made them on the build of Task 47, with a script that put the notes into the page.

### 20.1 Decided by Arthur on 2026-11-23

- The second step starts now. The psalms come first, then the notes at the verses.
- The notes at the verses show as option B of the pictures: one control below each paragraph. The reader opens the notes of that paragraph. The picture `verse-A-romans8-1440.png` shows the option that Arthur did not select: all notes open.
- From section 19.2: the reader gets no setting that selects the source of "About this chapter".

Arthur saw these notes in the pictures before the decision: the note of Psalm 3, and the notes of Romans 8:1 to 8:4.

### 20.2 The source and its license

| | |
|---|---|
| Name | Aquifer Open Study Notes |
| Copyright line | Aquifer Open Study Notes © 2026 Mission Mutual |
| Adaptation | The source says: an adaptation of the Tyndale Open Study Notes © 2023 Tyndale House Publishers, made by Mission Mutual |
| License | CC BY-SA 4.0, for the Tyndale notes and for the adaptation |
| Address of the license | `https://creativecommons.org/licenses/by-sa/4.0/`, as in section 19.3 |
| Address of the files | `https://github.com/BibleAquifer/AquiferOpenStudyNotes` |
| Commit | `d903df3d9bdbd6399fe83fc3d7046ea29e024962`, of 2026-11-17 |
| Version in `eng/metadata.json` | 1.1.2 |
| Files that the site uses | `eng/json/01.content.json` to `eng/json/66.content.json`, `eng/metadata.json`, and `README.md` |

The designer read `README.md` and `eng/metadata.json` on 2026-11-23. The designer read the page `https://tyndaleopenresources.com/` in a browser on 2026-11-23: it gives the license CC BY-SA 4.0 for the Tyndale Open Study Notes, and it asks for no special words in a credit.

The license is the license of section 19.3. Its points 1 to 9 apply. One point is more important here: the credit must keep the statement that the material is an adaptation, because the license asks for "an indication of any previous modifications".

### 20.3 The source files

The source files go into `sources/aquifer/`, with no change: `json/01.content.json` to `json/66.content.json`, `metadata.json`, and `README.md`. The 66 files have about 27 MB. A large part of this is the field `associations`, which the site does not use.

The site uses four fields of a note: `content_id`, `title`, `index_reference`, and `content`.

Facts about the 66 files, from a check by the designer on 2026-11-23. The script checks each fact, and it stops if one does not fit:

- 16,923 notes. Each `content_id` occurs one time. Each note is in the book of its file.
- `index_reference` has one of two forms: one verse, with 8 digits, or a range, with 8 digits, a hyphen, and 8 digits. The digits are those of section 19.4.
- 10,581 notes have one verse. 6,012 notes have a range in one chapter that does not end at verse 999. 322 notes have a range of more than one chapter. 8 notes have the range from verse 1 to verse 999 of one psalm. The sum is 16,923. No note has a range of more than one book.
- For 7 of the 8 notes, the `title` ends with ":title". These are the title notes: Psalms 7, 9, 30, 51, 57, 73, and 89.
- The eighth note is a fault of the source: `content_id` `24105` has the `title` "Psalms 142:7" and the range from verse 1 to verse 999. The site uses verse 7 for it. This is the one exception.
- The elements are `p`, `ul`, `ol`, `li`, `em`, `strong`, `sup`, `br`, `h3`, `a`, `data`, and `span`, and no other element.
- The 6 `h3` elements are empty. There is 1 `a` element. 20 `p` elements are empty.
- The character references are `&apos;`, `&quot;`, and `&nbsp;`, and no other one.
- No `content` has a line feed or a tab.

The format of the content on the page:

1. The page keeps these elements, with no attribute: `p`, `ul`, `ol`, `li`, `em`, `strong`, `sup`, `br`.
2. Each `data`, `span`, and `a` tag is removed. The words between the tags stay.
3. An element with no text is removed.
4. `&apos;` becomes `'`, `&quot;` becomes `"`, and `&nbsp;` becomes the character U+00A0.

WARNING: Do not change a word, a quotation mark, or a spelling of a note. The four points are changes of the format, and no other change is permitted.

The text of a note is its `content` with each tag removed and with point 4 applied.

The number that shows that the words have no change: make one line for each of the 16,923 notes, in the order of the 66 file names and in the order of each file. The line is the `content_id`, a tab, and the text of the note. Put the line feed character after each line. Encode the result as UTF-8. The SHA-256 of the result is:

`8f5f57da1f500459091552bb4806747e6ee811c2779f23dd735b1c4a783e0ae1`

The result has 4,584,237 bytes.

### 20.4 The data of the site

The script `scripts/build-study-notes.mjs` makes these files:

- `public/data/study/<book id>.json`, 66 files. Each one has all the notes of the book, in the order of the source file, with the number, the range, the mark of a title note, and the content.
- `public/data/study/about-psalms.json`. It has the 132 psalms of section 20.5, each with its note.

Claude Code selects the form of the content in the files. A unit test must show that the files have no element and no attribute other than those of point 1 of section 20.3, and that the SHA-256 of section 20.3 comes from the 66 files.

### 20.5 Part 1: the psalms in "About this chapter"

The 132 psalms with no Biblica note are those of section 19.5. For each of them, "About this chapter" shows one Aquifer note. The rule:

1. Take the notes of Psalms whose range has each verse of the psalm, from verse 1 to the last verse of the psalm in the Berean data. A title note is not in this list.
2. Take the note whose range has the smallest number of chapters. The script stops if two notes have the smallest number.

Numbers for the tests:

- 132 psalms get a note. 129 of them get a note for exactly the psalm.
- Psalm 9 gets the note Psalms 9:1–10:18. Psalms 42 and 43 get the note Psalms 42:1–43:5. So the 132 psalms have 131 different notes.
- Make one line for each of the 132 psalms, in the order of the psalm numbers: the number of the psalm, a tab, and the `content_id`. Put the line feed character after each line. The SHA-256 is `651b7fe88ce7ff10d006247efe364b5f58807fe86f19dbbb5f0f497ae01b3b07`.
- The notes are short. The median has 41 words, the shortest has 7 words, and the longest has 151 words, when a tag counts as a space.

The control and the panel are those of sections 19.6 and 19.7, with these differences:

- The range label is built by the rule of section 19.7. The `title` of the source has a different form for a range of more than one chapter, "Psalms 42:1–43.5". The page shows "Psalms 42:1–43:5".
- The content can have a list and words in italics. The values of the content are those of section 20.8.
- The credit is the Aquifer credit of section 20.6, in the place and with the values of the note credit.
- A panel never has a Biblica note and an Aquifer note together.
- The page gets `about-psalms.json` with the Biblica notes file of Psalms. The rule of section 19.6 for `data-loaded` applies to it also.
- The panel does not need the switch "Study notes".

The 18 psalms with a Biblica note do not change.

### 20.6 The two Aquifer credits

The Aquifer credit, below the note of a psalm in "About this chapter":

> From the Aquifer Open Study Notes, © 2026 Mission Mutual, licensed under CC BY-SA 4.0. They are an adaptation of the Tyndale Open Study Notes, © 2023 Tyndale House Publishers. The words have no changes.

The short credit, at the end of each block of study notes of part 2:

> From the Aquifer Open Study Notes, licensed under CC BY-SA 4.0. Full credit

- "Aquifer Open Study Notes" is a link to `https://github.com/BibleAquifer/AquiferOpenStudyNotes`.
- "CC BY-SA 4.0" is a link to `https://creativecommons.org/licenses/by-sa/4.0/`.
- "Full credit" is a link to the Sources page of the site. It opens in the same tab.
- The two links to a different site open in a new tab, with the name for a screen reader of section 19.8.

The designer wrote these words. WARNING: Do not change a word of a credit, and do not show an Aquifer note without one of the two credits.

The short credit is sufficient by point 5 of section 19.3: a link to a page that has the information. That page is the Sources page.

### 20.7 Part 2: the switch "Study notes"

- The switch is a row "Study notes" with the state "On" or "Off", in the form of the dark mode switch. It is below the dark mode switch: in the text list in the wide layout, and in the menu panel in the narrow layout. It is on the reading page only.
- The key in the storage of the browser is `bible-study-notes`, with the value "on" or "off". The site stores a value only when the reader uses the switch. With no stored value, the switch is off.
- With the switch off, the reading page is the page of Task 48: it has no control of part 2, and it does not get a file `public/data/study/<book id>.json`.
- With the switch on, the page gets the study file of each book that is on the page, one time for each book.
- With the switch on at the load, a chapter shows as loaded, with `data-loaded`, only after its study file loads or does not load.
- When the reader sets the switch on or off, the verse at the top of the page stays at the same place, as for a change of the text size in section 10.
- The switch does not change "About this chapter".
- The study notes show with each of the three translations.

### 20.8 Part 2: the groups, the controls, and the blocks

A group is a set of text blocks of a chapter that the reader sees as one paragraph or one stanza. The rule uses the blocks of the Berean data in `public/data/text/`, in their order:

1. A block that is not a text block ends the group. These are the kinds `h`, `b`, and `n`.
2. The styles of a text block have four kinds. Prose: `p`, `pmo`. Poetry: `q1`, `q2`, `qr`, `pc`, `qd`. List: `li1`, `li2`. Title: `d`.
3. A title block always starts a new group.
4. A block after a group that has only a title block goes into that group.
5. A poetry block after a poetry block goes into the same group. A list block after a list block goes into the same group.
6. Each other block starts a new group. So each prose block is a group.

The verses of a group are the verse numbers that are in its blocks. The script stops if a style is not in point 2.

Each note of the 66 study files goes to one group, in the chapter of its first verse:

1. A note that "About this chapter" shows for a psalm, by section 20.5, is not in the groups of the psalm of its first verse.
2. A title note goes to the first group of the chapter that has a verse.
3. Each other note goes to the group that has its first verse.
4. If no group of the chapter has the first verse, the note goes to the group of the nearest verse before it. This occurs for 3 notes: 3 John 1:14–15, Revelation 12:18, and Revelation 12:18–13:18.

In a group, the notes are in the order of the source file.

Numbers for the tests:

- 16,792 notes are in the groups. 131 notes are only in "About this chapter".
- 10,562 groups have a note. 3,663 of them have one verse.
- 1,186 chapters have a group with a note. The three chapters with none are Exodus 36, Psalms 108, and Psalms 123.
- The median chapter has 8 groups with a note. Mark 14 has the most, 35. Matthew 26 has 32, and Luke 22 has 31.
- Romans 8 has 10: at the verses 1 to 4, 5 to 8, 9 to 11, 12 to 14, 15 to 17, 18 to 21, 22 to 25, 26 to 27, 28 to 30, and 31 to 34.
- Genesis 22 has 11. Psalms 119 has 22. Psalms 3 has 3: at verse 1, at the verses 2 to 6, and at the verses 7 to 8. Psalms 142 has 4. Psalms 23 has 2. Revelation 12 has 7, and 3 John has 7.
- The block of Exodus 20, verses 3 to 17, has the most notes, 15.

The control:

- With the switch on, each group with a note has one control, directly after the last block of the group.
- The words are "Notes on verses 1 to 4", with the first verse and the last verse of the group, or "Notes on verse 5" for a group with one verse. The caret is that of "About this chapter".
- The block of the notes is closed at the load. The site does not store the state. Each control has its own state.
- For a screen reader: the control has `aria-expanded` and `aria-controls`. The block has the role `region`, and its name has the words of the control and the name of the chapter, for example "Notes on verses 1 to 4 of Romans 8".

The block, below its control:

- For each note: a note label, and then the content.
- The note label is "Verse 3" for one verse and "Verses 19–21" for a range in one chapter, with the en dash. For a range of more than one chapter, it is the range label of section 19.7, for example "Romans 5:1–8:39". For a title note, it is "Title of the psalm".
- After the last note: the short credit of section 20.6.
- The words of a note that refer to a different note or to a passage are plain text. Example: "See study note on 6:19".

The values. The pictures have a smaller space above a note label, because the script of the designer had the fault of section 19.14. The table is correct:

| Part | Value |
|---|---|
| Control | Inrond, weight 600, 13 px, line height 20 px, the color of the group. It is at the left side of the text column. About 8 px from the last line of the group to the control, and the usual space of a paragraph below a closed control. |
| Block | A line on the left side: 2 px, solid, the color name `--credit-line`. 14 px from the line to the text. 2 px above and 26 px below. |
| Text of a note | Inrond, weight 400, 15 px, line height 1.5, the color name `--ink`. Words in italics are in the italic style of Inrond. |
| Paragraph | 8 px below each paragraph, also in a list item. |
| List | 20 px from the left side of the block to the text of an item. 6 px below each item. The marks of a list are those of the browser. |
| Note label | The values of the range label of section 19.7. |
| Short credit | The values of the note credit of section 19.7. |

The block uses only color names that the site has.

What does not change with the switch on: the Bible text, the marks, the margin labels, the read-with list, and the pop-up. The margin labels stay on the lines of their verses when a block opens.

### 20.9 The Sources page

Task 48 changes the last paragraph of the section "Notes on the chapters" and adds two paragraphs. The section then has these words after its first two paragraphs:

> The Biblica Study Notes have no text for 132 psalms. For these psalms, the text of "About this chapter" is from the Aquifer Open Study Notes, © 2026 Mission Mutual. They are an adaptation of the Tyndale Open Study Notes, © 2023 Tyndale House Publishers. The license of both is CC BY-SA 4.0.
>
> The site got the files from the repository BibleAquifer/AquiferOpenStudyNotes on GitHub, version 1.1.2. The site shows the words of the notes with no change. It does not show the links of the files.
>
> Biblica, Mission Mutual, and Tyndale House Publishers have no connection with this site.

- "Aquifer Open Study Notes" and "BibleAquifer/AquiferOpenStudyNotes" are links to `https://github.com/BibleAquifer/AquiferOpenStudyNotes`.
- "CC BY-SA 4.0" is a link to `https://creativecommons.org/licenses/by-sa/4.0/`.

Task 49 adds one sentence after "© 2026 Mission Mutual.": "The study notes at the verses are from the same source."

`docs/DATA-SOURCES.md` gets a section for this source, with the facts of section 20.2.

### 20.10 Selected by the designer, without a decision by Arthur

1. The rule of section 20.5 for the note of a psalm, and the joint notes for Psalms 9, 42, and 43.
2. The words of the two credits, and the words of the Sources page.
3. The short credit at the end of each block, with the full credit on the Sources page.
4. The name "Study notes", the place of the switch, and the state "off" at the first visit.
5. The rule of the groups in section 20.8, and the words of the control and of the note label.
6. The study notes show with each of the three translations. The next section has the cost.
7. A reference to a different note or to a passage is plain text.
8. A note of "About this chapter" is not also at the verses of that psalm.
9. The source files are in the repository. They have about 27 MB.
10. Two tasks, not one.

### 20.11 Weak points, not decided, and not checked

- The designer read the notes of Romans 8 and of five psalms. No person checked the teaching of the other notes.
- The phrases in italics follow the Berean Standard Bible. The designer checked 6,386 phrases in italics at the start of a paragraph or of a list item: 6,191 of them, 96.9 percent, are word for word in the Berean text of the chapter. One note has a link to a page of the Berean Standard Bible on biblehub.com. The source does not say which translation it follows. On a page of the King James Version or of the World English Bible, a phrase in italics is frequently not in the text above it.
- A reader cannot follow "See study note on 6:19" with a tap. The files have 39,112 references to a passage and 1,244 references to a different resource. Links for them are an idea for later.
- The notes of the 132 psalms are short. Some have one sentence.
- A long chapter gets many controls: Mark 14 gets 35.
- The Biblica notes and the Aquifer notes have different writers, and the two can differ on a point. The designer did not compare them.
- The spelling of the Aquifer notes is American. The spelling of the Biblica notes is British.
- Not made: a picture of the switch, a picture of the study notes in a psalm, a picture of the dark mode, and a check on a real phone. Tasks 48 and 49 make screenshots of them.
- Not checked: that the English files have the words of the adaptation with no change by a third person.
