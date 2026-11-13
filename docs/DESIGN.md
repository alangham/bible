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
- Phone: the thin spines are too small to touch. Use one stack at a time with larger spines, and move between stacks by swipe.

### 4.2 Cover (book page, mockup D2)

- The closed book lies on the table at an angle. Cloth in the category color, gold frame, book name, group name, number of chapters.
- Button "Open the book". The book opens to chapter 1.
- Below the book: three short facts.
  - Author.
  - Written: when and where.
  - What it is: one or two sentences of context.
- A chapter list. Select a chapter to open the book at that spread.
- Authorship rule: state the traditional author and date first. Add one short line where scholars hold a different view. Where tradition names no author, say so.

### 4.3 Spread (chapter page, mockup D3)

- The book is open on the table. Two pages.
- A scene covers the two pages. The text is on the right page for a short chapter. For a long chapter, the text scrolls on the right page, and the scene moves in parallax.
- Above the text: book name, chapter number, number of chapters.
- Drag a page corner, or use the arrow keys, to turn to the next or previous chapter. The page must curl.
- "Close the book" goes back to the cover.

### 4.4 Scenes

- Nine base scenes, one for each category. Each scene has four flat paper-cut layers that move in parallax.
- Code changes each scene by rule for the book and the chapter: time of day, color, and layer positions. The same chapter always gives the same scene.
- No scene is specific to the content of a chapter in version 1.
- Arthur must approve the subject of each base scene before you build it. Propose the nine subjects in Task 5.

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
