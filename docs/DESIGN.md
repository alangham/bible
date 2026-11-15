# Bible site: agreed design

Agreed with Arthur on 2026-11-13. Mockups D1, D2, and D3 are in the Claude design canvas "Bible App: landing page options". Arthur accepted them as "fine for now". Expect small changes later.

WARNING: Section 7 is a redesign that Arthur decided on 2026-11-14. Section 7 replaces sections 1, 3, and 4.1 to 4.4 for the first page and the reading page. Tasks 11 to 18 in `docs/TASKS.md` build section 7. Claude Code builds a part of section 7 only when its task says so.

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
- Between the bands, a short line says how many years are between the two bands. Count from the end of the last range in band 1 to the start of the first range in band 2. Name no book in the line. The words are: "About N years or more between the last Old Testament book and the first New Testament book". Compute N from the dates. Do not write it by hand.
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
- The page must show the name of the translation.
- The ESV is not in version 1. Arthur decided this on 2026-11-13. The ESV is his preferred translation, but it is not a requirement.
- Reason: the ESV is available only through the Crossway ESV API. The terms forbid a published access key, and the terms expect server-side code. A static site on GitHub Pages cannot hold the key.
- To add the ESV later, the site needs a small proxy that holds the key. Keep the text service behind one interface so that a second translation can be added without a change to the pages.

## 6. Not in version 1

- User accounts, notes, highlights.
- Search.
- Audio.
- The ESV and other translations.
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
- Two layouts, selected by screen width. One function in the code decides, as built. The limit stays at 900 px.
- Wide layout, 900 px or more: five columns with the book counts of section 4.1. All 66 names and the bottom line fit in one view at 1440 by 900 px.
- Narrow layout, below 900 px: each group is a block. A band is at the top of the block, and the names are in two columns below it. The wall is 520 px wide at most, in the center. NOT VERIFIED: the designer tested the narrow layout at 390 px wide only. The prototype has its limit at 700 px.
- Each book name is 24 px high or more.
- A line at the bottom of the wall has the name of the translation and the links to the pages of the Reference section.
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
- A thin bar stays at the top. It has two controls:
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
- Travel. "Go there" opens the linked chapter at the linked verse. The change is direct, with no move between the two pages. The paragraph of the linked verse has a light background for a short time. Arthur decided this on 2026-11-14.
  - The line in section 4.5 that says "The move must show that the reader crossed the Bible" does not apply to the redesign. Arthur said that he did not miss this move.
  - Arthur's rule: after "Go there", the reader must have a way to get back.
- Trail. After the first travel, a thin line below the top bar lists the stops. Each stop is a control in the color of its group. The current stop has an underline.
  - The way back: when the reader is not on the first stop, the trail starts with the control "Back". "Back" opens the stop before the current stop, at its verse.
  - Arthur decided this on 2026-11-14. The trail changes only by travel: "Go there", a read-with entry, or a stop in the trail. The Back control of the browser, the chapter grid, and a scroll do not change the trail.
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
- The form of the timeline on a wide screen. Arthur decided this on 2026-11-14. One line with a break. The Old Testament books have one scale. A mark on the line shows approximately 400 years with no books. The New Testament books have a larger scale. Each book name is a control that opens the book. A thin bar under a name shows a range of years.
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
