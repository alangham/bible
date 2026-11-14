# Bible site: agreed design

Agreed with Arthur on 2026-11-13. Mockups D1, D2, and D3 are in the Claude design canvas "Bible App: landing page options". Arthur accepted them as "fine for now". Expect small changes later.

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
- Spine thickness follows the number of chapters. Mockup rule: `26 + 3.2 * sqrt(chapters)` px.
- Each spine has a small sideways offset so that the stack looks real.
- A legend below the stacks lists the ten groups. Select a group to light its spines and dim the others. Select it again to clear.
- Select a spine: the book slides out of the stack and lands on the table as the cover page.
- Two layouts, selected by screen width. The limit is 768 px.
  - Wide layout, 768 px or more: five stacks in one view, as in mockup D1. The spines can be thinner than 44 px. This is the one permitted exception to the 44 px size.
  - Narrow layout, below 768 px: one stack at a time with spines of 44 px or more. Move between stacks by swipe. Task 9 builds this layout.
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
- The colors of a scene are near the cloth color of its group.
- A fixed number from the book and the chapter sets small shifts of each layer. The same chapter always gives the same scene.
- No person that a reader can identify. Small plain figures are permitted, for example the travellers in scene 8 and the flock in scene 3.
- No scene is specific to the content of a chapter in version 1. Three books do not fit their scene: Obadiah, Jonah, and Jude. This is accepted for version 1.

### 4.5 Links, travel, and trail

- A passage with a link has a visible mark in the text.
- Quotation links have a strong mark. Echo links have a light mark. The reader can switch echo links off.
- Select a mark: a pop-up shows the reference and the text of the linked passage.
- The pop-up for a quotation link also shows a reason line: one line that says why the linked passage matters here. The pop-up for an echo link has no reason line in version 1. Reason: the reason line is interpretation, and each reason line must be checked.
- The pop-up has two actions: "Go there" and "Stay here".
- "Go there" is travel. The current book closes, the linked book comes onto the table, and it opens at the linked passage. The move must show that the reader crossed the Bible.
- The trail is always on screen after the first travel. Each stop is a control. Select a stop to go back to it in one step.
- Reason: existing apps show only the reference. A new reader does not know the linked passage, so the reference means little. Example: Hebrews 9 is hard to read without Leviticus 16, Exodus 24, and Numbers 19.

### 4.6 Timeline

- Books sit on a time axis in their category colors.
- Arcs join books that have quotation links.
- Select a book to open its cover.
- Travel can use the timeline as its map in a later version. This is not in version 1.
- Dates are disputed for some books. Use the same rule as the cover page: traditional date first, and show a range where scholars differ.

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
