# Task 44: the colors of the site, with one name for each

Claude Code wrote this report on 2026-11-18, for `docs/TASKS.md` Task 44 and section 18 of `docs/DESIGN.md`. The site shows nothing new: each page is the same as before, pixel for pixel. Section 9 of this report has the check.

## 1. Where the names are

- `src/index.css`, the first `:root` block, has 45 names of colors. Each value of a color in the CSS is there, and only there.
- `src/data/books.ts` stays the one source of the ten group colors. Its functions give each group a name:
  - `groupProperty(group)` gives the name, for example `--group-poetry-wisdom`.
  - `groupVar(group)` gives the value for a component, for example `var(--group-poetry-wisdom)`.
  - `groupColorsCss()` gives the CSS rule `:root { --group-law: #C2255C; ... }`.
- `src/main.tsx` adds that rule to the page as the element `<style id="group-colors">`, before the first render.
- A component gets a group color through `groupVar()`. No `style` and no SVG attribute has the value of a color.
- An SVG attribute such as `fill`, `stroke`, or `stop-color` has `var(--name)`. Chrome 156 gives such an attribute the color of the name. I checked this in the browser with a test element. The attribute keeps its place in the cascade, so no CSS rule wins over it that did not win before.
- A later task can change the value of each name with one attribute on the root element and one CSS rule for that attribute. For the group colors, `books.ts` can give a second rule from a second list of values. No component changes, and React makes no new render.
- The unit test `src/colors.test.ts` reads each `.css`, `.ts`, and `.tsx` file of `src/`, with no test file. It fails on a color value outside these places:
  - the first `:root` block of `src/index.css`;
  - `src/data/books.ts`;
  - the SVG mask of `src/map/MapDrawing.tsx`.

  It also fails on a `var(--name)` that no file defines. With `src/index.css` and `src/map/MapPage.tsx` of commit `e9c244e`, Task 43, the test found 82 color values and failed: 79 in `src/index.css` and 3 in `src/map/MapPage.tsx`.

## 2. The names

The column "Parts" names the CSS rule, or the file and the line in the code. "Same value" names a different name with the same value and a different role.

### The page and the text

| Name | Value | Role | Parts |
|---|---|---|---|
| `--page` | `#fff` | The page | `:root`, `body`, `.wall`, `.reading`, `.ref-page`: background |
| `--ink` | `#1d1d1f` | The main text, and the outline of the focus | `:root`, `.wall`, `.reading`, `.ref-page`, `.pop`: color. The top bar link under the pointer, the selected text size, the current tab of the Reference section, `.tr-row`, `.rd-column .sh-s1`, `.rd-trail-back`, `.pop-stay`, `.q-select`, `.map-heading`, `.map-switch`, `.map-zoom button`. The axis and the ticks of the timeline. Each `:focus-visible` outline in ink. |
| `--ink-secondary` | `#6e6e73` | The secondary text | The text of the three top bars, the menu panel, the text list, and the translation list. `.rd-previous`, `.rd-draft`, `.rd-fact dt`, the credit of the line "Video", the headings of "Scholars differ", `.sh-s2`, the notes and the omitted verses, `.rd-end`, "Echo links", the label and the source of the read-with list, `.link-line`, `.rd-label-verse`, the trail. In the pop-up: `.pop-kind`, `.pop-omitted`, `.pop-source`, `.pop-quoted-from`, `.pop-first`. The Reference section: `.ref-lead`, `.ref-foot`, `.q-list h3`, the break and the labels of the timeline, `.tl-row-date`, `.tl-break-row`, the short name and the line of a translation on the Sources page. The map page: `.map-region`, `.map-signs`, `.map-counts`, `.map-credit`, `.map-message`. |
| `--ink-italic` | `#3a3a3c` | The text in italics of a note | `.rd-column .sh-d`, `.tb-d`, and `.tb-qd`: a superscription and the heading of a part of Psalm 119. `.pop-reason`. |
| `--red-letters` | `#8b1a1a` | The words of Jesus, with red letters on | `.reading[data-red-letters='on'] .red-letters` |
| `--on-group` | `#fff` | The text on a group color | `.wall-band`, `.rd-band`, `.pop-band`, `.q-band`, the current chapter in the chapter grid, "Go there". Same value: `--page`, `--panel`, `--panel-group`, `--switch-knob`, `--timeline-dot-open`, `--timeline-halo`, `--map-sea`, `--map-dot-edge`, `--map-dot-open`. |

### Lines and borders

| Name | Value | Role | Parts |
|---|---|---|---|
| `--line` | `rgba(0, 0, 0, 0.09)` | A thin line | The bottom line of the three top bars, of the menu panel, of the chapter grid, of the narrow translation list, of `.rd-meta`, and of the trail. `.menu-rule`. The left line of a note and of an omitted verse. The border of the pop-up and of the frame of the map. |
| `--line-faint` | `rgba(0, 0, 0, 0.05)` | The line between two rows of a list | `.q-list li`, `.tl-row`, `.tl-break-row`: border-bottom |
| `--divider` | `rgba(0, 0, 0, 0.14)` | The short upright line between two controls | `.rd-bar-rule`, `.rd-trail-rule` |
| `--sample-line` | `#e3e3e6` | The line at the left of a verse of "The three translations" | `.sources-versions li`: border-left |
| `--credit-line` | `rgba(0, 0, 0, 0.2)` | The line at the left of the credit of the line "Video" | `.rd-fact .rd-video-credit`: border-left |
| `--border-chip` | `rgba(0, 0, 0, 0.14)` | The border of a small control | An entry of the read-with list. A zoom button of the map. Same value: `--divider`. |
| `--border-draft` | `rgba(0, 0, 0, 0.15)` | The border of the label "Draft" | `.rd-draft span` |
| `--border-button` | `rgba(0, 0, 0, 0.18)` | The border of "Stay here" | `.pop-stay` |
| `--border-select` | `rgba(0, 0, 0, 0.2)` | The border of the select control of the quotation diagram | `.q-select` |

### Surfaces

| Name | Value | Role | Parts |
|---|---|---|---|
| `--bar` | `rgba(255, 255, 255, 0.9)` | The top bar | `.wall-bar`, `.rd-bar`, `.ref-bar` |
| `--panel` | `#fff` | A panel with no text in a group color | `.menu-panel`, `.tr-list`, `.q-select`, `.map-zoom button` |
| `--panel-group` | `#fff` | A panel with text in a group color | `.rd-grid-panel`, `.rd-trail`, `.pop`, an entry of the read-with list |
| `--surface-gray` | `#f5f5f7` | A light gray surface | `.rd-scholars-detail`, `.tl-break-row` |
| `--hover` | `rgba(0, 0, 0, 0.05)` | A row or a cell under the pointer | `.rd-grid a:hover`, `.tr-row:hover`, `.tr-about:hover` in the wide layout |
| `--button-hover` | `#f5f5f7` | A zoom button under the pointer | `.map-zoom button:not(:disabled):hover`. Same value: `--surface-gray`. |
| `--shade-bar` | `rgba(0, 0, 0, 0.18)` | The shade below an open panel of the top bar | `.rd-shade`, `.bar-shade` |
| `--shade-pop` | `rgba(0, 0, 0, 0.22)` | The shade below the pop-up | `.pop-shade` |
| `--hit` | `rgba(0, 0, 0, 0.06)` | The background of the verse that travel opens | `.rd-column .rd-hit`: background and the ring of 8 px |
| `--hit-mix` | `#000` | The color mixed into the group color of the number of that verse | `.rd-column .rd-hit .vn`: `color-mix(in srgb, var(--c) 80%, var(--hit-mix))` |

### Shadows

| Name | Value | Parts |
|---|---|---|
| `--shadow-panel` | `0 14px 30px rgba(0, 0, 0, 0.08)` | The menu panel, the chapter grid, the translation list in the narrow layout |
| `--shadow-list` | `0 14px 34px rgba(0, 0, 0, 0.14), 0 0 0 1px rgba(0, 0, 0, 0.07)` | The translation list in the wide layout. The second shadow is a ring of 1 px. |
| `--shadow-pop` | `0 18px 50px rgba(0, 0, 0, 0.16)` | The pop-up |
| `--shadow-button` | `0 1px 2px rgba(0, 0, 0, 0.06)` | A zoom button of the map |

### The map page, the timeline, and the quotation diagram

| Name | Value | Role | Parts |
|---|---|---|---|
| `--switch-off` | `#8e8e93` | The track of the switch "Places that are not certain", off | `.map-switch-track` |
| `--switch-knob` | `#fff` | The knob of that switch | `.map-switch-knob` |
| `--disabled` | `#b0b0b5` | A zoom button that cannot be used | `.map-zoom button:disabled` |
| `--timeline-dot-open` | `#fff` | The inside of the dot of an estimate | `.tl-dot[data-estimate='true']`: fill |
| `--timeline-halo` | `#fff` | The line around a book name of the timeline, so that a line behind it stops at the name | `.tl-name`: stroke |
| `--map-sea` | `#fff` | The sea and the lakes | `src/map/MapDrawing.tsx`: the background rectangle, and the fill of the lakes |
| `--map-land` | `#f4f1eb` | The land | `MapDrawing.tsx`: the fill of the land |
| `--map-coast` | `#cfc8bb` | The coast line | `MapDrawing.tsx`: the stroke of the land |
| `--map-water-line` | `#a9c0cc` | The line of a lake and of a river | `MapDrawing.tsx`: the strokes of the lakes and the rivers |
| `--map-water-name` | `#4a6f84` | The name of a water | `src/map/mapLayout.ts`, `WATER_NAME` |
| `--map-place-name` | `#1d1d1f` | The name of a place with a certain position | `mapLayout.ts`, `INK`. Same value: `--ink`. |
| `--map-secondary` | `#6b6b6b` | The name of a place with a position that is not certain, a region name, and the scale | `mapLayout.ts`, `MAP_SECONDARY`. `MapDrawing.tsx`, the scale. |
| `--map-dot-edge` | `#fff` | The edge of a dot and of a triangle | `MapDrawing.tsx`, and the signs of the list in `src/map/MapPage.tsx` |
| `--map-dot-open` | `#fff` | The inside of an open dot | `MapDrawing.tsx`, and the sign of the list in `MapPage.tsx` |
| `--quote-line-dim` | `#1d1d1f` | A line of the quotation diagram that is not selected | `src/reference/QuotationsPage.tsx`, `DIM_INK`, with a stroke opacity of 0.04 or 0.4. Same value: `--ink`. |
| `--quote-name-dim` | `#6e6e73` | A book name with no line to the selected book | `QuotationsPage.tsx`, `GRAY_NAME`. Same value: `--ink-secondary`. |

Names that are not colors, and that the task did not change: `--band-radius`, `--heading-em`, `--name-em`, `--rd-base-px`, `--rd-heading-px`, `--rd-scale`, `--rd-text-px`.

The keywords `transparent` and `currentColor` stay in the CSS. `transparent` is on a border that keeps a place, and on a hit area. `currentColor` takes the color of the text. Neither one is a color of its own.

The system color `CanvasText` stays in the CSS, in the rule `@media (forced-colors: active)` for the track and the knob of the map switch. It follows the forced colors of the system, not the colors of the site, so a dark mode does not change it. The test of step 7 does not look for system colors.

## 3. The ten group colors and their parts

| Group | Name | Value |
|---|---|---|
| Law | `--group-law` | `#C2255C` |
| History | `--group-history` | `#B01E35` |
| Poetry & Wisdom | `--group-poetry-wisdom` | `#CD4C26` |
| Major Prophets | `--group-major-prophets` | `#9D6E00` |
| Minor Prophets | `--group-minor-prophets` | `#667F19` |
| Gospels | `--group-gospels` | `#26828B` |
| History (Acts) | `--group-history-acts` | `#6E6A66` |
| Letters of Paul | `--group-letters-of-paul` | `#1B2A41` |
| General Letters | `--group-general-letters` | `#4B2E57` |
| Prophecy | `--group-prophecy` | `#986694` |

A component gives a group color to a part in one of two ways. It sets a local name: `--c` for the book of the page, `--d` for the book at the other end of a link, `--q` for the selected book of the quotation diagram, `--tl` for a book of the timeline. Or it sets `color`, `background`, `fill`, `stroke`, or `stop-color` directly, to `groupVar()`.

As text:

- The wall: each book name.
- The reading page: the book name of the heading and the chapter number. "About this book", "Scholars differ", the link of "Where", the links of "Video", and the link of the credit. `.sh-ms`, `.sh-qa`, the verse numbers.
- The chapter grid: each chapter number.
- The read-with list: each entry.
- The trail: each stop.
- The text of a link: `.link-ref` and `.rd-label`, in the color of the other book.
- The pop-up: `.pop-ref`, `.pop-vn`.
- The quotation diagram: each book name, `.q-list h2`, `.q-open`, each book of the list.
- The timeline: each book name, and each book of the narrow list.
- The map page: `.map-name`.

As a background:

- The band, in its four places: `.wall-band`, `.rd-band`, `.pop-band`, `.q-band`.
- The current chapter in the chapter grid.
- "Go there".
- The dot of a quotation link and of a margin label: `.link-mark::before`, `.rd-label i`.
- The track of the map switch, on.

As a line or an SVG paint:

- The ring of an echo link: `.link-mark[data-kind='echo']::before`, `.rd-label[data-kind='echo'] i`.
- The left line of `.pop-reason`.
- The outline of the focus of the current chapter in the chapter grid.
- The timeline: `.tl-stem` at an opacity of 0.18, `.tl-bar` at 0.55 or 0.75, `.tl-dot`.
- The quotation diagram: the arc of each group, and the gradient of a selected line from the group of the book that quotes to the group of the book that it quotes.
- The map: each dot, triangle, and ring, and the signs of the list.

In a mix: the number of the verse that travel opens, 80% of the group color with 20% of `--hit-mix`, which is black.

## 4. Text in a group color on a surface that is not the page

Section 18.4 of `docs/DESIGN.md` has the rule for these. In the light mode, each surface of this list is white or almost white.

1. The chapter grid: each chapter number is on `--panel-group`. Under the pointer, it is on `--hover` over `--panel-group`.
2. The trail: each stop is on `--panel-group`.
3. The pop-up: `.pop-ref` and `.pop-vn` are on `--panel-group`.
4. The read-with list: each entry is on `--panel-group`, with a border of `--border-chip`.
5. The verse that travel opens: its number, darker by the mix, is on `--hit` over the page.
6. The text on a group color is the reverse case: `--on-group` on the band, on the current chapter of the chapter grid, and on "Go there".

The top bars, the menu panel, the translation list, the text list, and the light gray surface of "Scholars differ" have no text in a group color.

## 5. Parts that the light mode makes darker or lighter on hover or on focus

| Part | State | How |
|---|---|---|
| A link of the top bar of the wall and of the Reference section | Under the pointer | The text goes from `--ink-secondary` to `--ink`: darker. |
| A chapter of the chapter grid, a row and "About" of the translation list in the wide layout | Under the pointer | A background of `--hover`, black at 5%: darker. |
| A zoom button of the map | Under the pointer | The background goes from `--panel` to `--button-hover`, `#f5f5f7`: darker. |
| An entry of the read-with list | Under the pointer | The border goes from `--border-chip` to the color of the text, the group color: darker. |
| The number of the verse that travel opens | For a short time after travel | The group color, 80%, with black, 20%: darker. |
| A selected book of the quotation diagram | After a click | The lines of the book get a stroke opacity of 0.9, and each other line 0.04. |
| A book name of the wall, a link of the text, a margin label, a book of the quotation diagram and of its list, a book of the timeline and of its list | Under the pointer | An underline. No change of color. |
| The dot of a link | Under the pointer | Its size grows by a factor of 1.35. No change of color. |
| Each control | Focus | An outline in `--ink`, in the color of the text, or in the group color for the current chapter of the chapter grid. In the quotation diagram and the timeline, a stroke in `--ink` around the hit area. No part gets darker or lighter on focus. |

## 6. Places that need a value in the code

None of the components needs a value. These places keep a value, by the rules of the task:

1. `src/data/books.ts`: the values of the ten group colors. They are the one source. `src/data/contrast.ts` computes a contrast from a value. Only the unit tests use it, with the values of `books.ts`.
2. `groupColorsCss()` in `books.ts` makes the CSS rule of the group names from those values. `src/main.tsx` puts the rule in the page.
3. The SVG mask of `src/map/MapDrawing.tsx`: `#fff` means "show" and `#000` means "hide". They have no name. A comment says so.

The gradient of the quotation diagram did not need a value: its `stop-color` attribute has the name.

## 7. Colors that are possibly a mistake, or are the same role as a different name

I did not change one of these. Each is a question for the designer.

1. `--line-faint` (black at 5%) and `--line` (black at 9%) are both a thin line between two parts. The lists of the timeline and of the quotation diagram use the light one. Each other thin line uses `--line`.
2. Three lines at the left of a text have three values:
   - `--line`, black at 9%, for a note and an omitted verse;
   - `--sample-line`, `#e3e3e6`, an opaque gray, for a verse of the Sources page;
   - `--credit-line`, black at 20%, for the credit of the line "Video".

   On white, black at 9% is about `#e8e8e8`, near `#e3e3e6`. The credit is darker by the decision of section 17.3.
3. Four borders of a small control or a label have close values:
   - `--border-chip`, black at 14%;
   - `--border-draft`, 15%;
   - `--border-button`, 18%;
   - `--border-select`, 20%.
4. `--hover` is black at 5%, and `--button-hover` is the opaque `#f5f5f7`. Both are the surface under the pointer. On white, black at 5% is about `#f2f2f2`.
5. `--map-secondary`, `#6b6b6b`, is near `--ink-secondary`, `#6e6e73`. Section 18.6 gives both the dark value `#A1A1A6`.
6. Several names have the value of a different name. Section 18 ties some of them together for the dark mode:
   - `--map-place-name` and `--quote-line-dim` have the value of `--ink`.
   - `--quote-name-dim` has the value of `--ink-secondary`.
   - Section 18.4 says that `--on-group` is the page color in the two modes.
   - Section 18.6 says that `--map-sea` is the page color, and that `--map-dot-edge` and `--map-dot-open` are one row.
   - `--timeline-halo` is the page color behind a name, so it has the role of the page.
7. `--divider` and `--border-chip` have the same value, black at 14%, with different roles.
8. The four parts of `--panel-group` have three kinds of border:
   - the pop-up: a border of `--line` on its four sides;
   - the chapter grid and the trail: a bottom border of `--line`;
   - an entry of the read-with list: a border of `--border-chip` on its four sides.

   Section 18.4 gives a panel with text in a group color a border of white at 16% in the dark mode. A question for the designer: does that border replace `--line` on the pop-up only, or also the bottom border of the chapter grid and the trail?
9. The translation list has two shadows: `--shadow-list` in the wide layout and `--shadow-panel` in the narrow layout.
10. `index.html` has `<meta name="theme-color" content="#ffffff">`. It is not in `src/`, so the test of step 7 does not read it. Section 18.10 item 6 has it for a later task.
11. The icon of the site in `public/` has its own colors. Section 18.7 keeps it.

## 8. What I changed in the tests

- `src/reference/quotationLayout.test.ts`: a line of the quotation diagram now has the names `var(--group-letters-of-paul)` and `var(--group-poetry-wisdom)`, not the values.
- `e2e/reference.spec.ts`: two checks read the computed color, `rgb(194, 37, 92)` and `rgb(110, 110, 115)`, in place of the attribute `fill`. The attribute now has a name.
- `e2e/map.spec.ts`: five checks find an open sign of the map by its attribute `fill`. The attribute is now `var(--map-dot-open)`, not `#fff`, so the selector has the name.
- `e2e/redletters.spec.ts` and `e2e/video.spec.ts`: two comments name `--ink` and `--ink-secondary`, not the removed names.
- `src/colors.test.ts`: new, step 7.

## 9. The screenshots of step 8

Method:

- `npm run build` and `vite preview` at `http://localhost:4173/bible/`.
- Chromium of Playwright, with a new context for each view, `deviceScaleFactor: 1`, `reducedMotion: 'reduce'`, and screenshots with `animations: 'disabled'` and `caret: 'hide'`.
- The wall, the map pages, the timeline, the Quotations page, and the Sources page are full-page screenshots. The reading pages are screenshots of the window.
- The folder is outside the repository, in the scratchpad of the session.
- I took the screenshots "before" two times, with no change, to test the method: 0 different pixels in each of the 26 pairs.
- After the change, the preview served `index-CuthEBjP.js`, the same file as in `dist`. In the page, the name of Genesis on the wall had `color: var(--group-law)`, and the root element had `--group-law: #C2255C`.

| View | 1440 by 900 px | 390 by 844 px |
|---|---|---|
| The wall | 0 | 0 |
| Matthew 1, with "About this book" open | 0 | 0 |
| Matthew 5 | 0 | 0 |
| Hebrews 9, the pop-up of Exodus 24:8 open | 0 | 0 |
| A trail of two stops: Hebrews 9, then "Go there" to Exodus 24:8 | 0 | 0 |
| John 3, the chapter grid open | 0 | 0 |
| John 3, the translation list open | 0 | 0 |
| John 3, the text list open (1440) or the menu panel open (390) | 0 | 0 |
| The map of Acts | 0 | 0 |
| The map of Joshua, with the switch off | 0 | 0 |
| The timeline | 0 | 0 |
| The Quotations page, with Romans selected | 0 | 0 |
| The Sources page | 0 | 0 |

The number in each cell is the number of different pixels. The sum is 0.

Not in the screenshots: a state under the pointer, a focus outline, and the light background of the verse that travel opens, which shows for a short time.
