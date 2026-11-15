# Bible site: design fixes

Design work is paused from 2026-11-14. Arthur plans a redesign. Do not do or propose more design fixes until he says so.

This file is the list of design problems to correct later. Arthur or the designer adds an item. Claude Code can add an item with the status `PROPOSED`. Claude Code does an item only when its status is `APPROVED`. Task 10 in `docs/TASKS.md` uses this file.

Status values: `PROPOSED`, `APPROVED`, `DONE`, `REJECTED`, `CLOSED`. `CLOSED`: the redesign removed the page of the item, so the item no longer applies.

---

## 1. Text on the gold and cream spines looks weak

Status: DONE

Done on 2026-11-14 in commit 906b5c3. Each spine name has a stroke of its text color, and a long name loses its letter spacing before it is narrowed. Measured from the rendered pixels at 1440 by 900 px with `scripts/measure-spines.mjs`: the lowest name contrast is 4.75 to 1, and no name is below 4.5 to 1. Before: 28 names below 4.5 to 1, the lowest 2.12 (Daniel).

Approved by Arthur on 2026-11-14.

Page: table. Seen in `docs/screenshots/task-2-table.png` on 2026-11-13.

Problem: the names on the Major Prophets spines and the Gospels spines are hard to read. Lamentations and Daniel are the worst. The contrast test uses the design colors. The 3D light changes the rendered colors.

Correction: measure the contrast from the rendered pixels. Change the light or the text color until each spine name is 4.5 to 1 or more in the screenshot.

## 2. The shadows have hard edges

Status: DONE

Done on 2026-11-14 in commit 906b5c3: the shadows have soft edges, from a variance shadow map with a blur. The blur is the same at each distance from the stack. Arthur accepted this as done on 2026-11-14.

Approved by Arthur on 2026-11-14.

Page: table. Seen in `docs/screenshots/task-2-table.png` on 2026-11-13.

Problem: the stack shadows are flat shapes with sharp edges. Mockup D1 has soft shadows.

Correction: make the shadows soft, with more blur at a larger distance from the stack.

## 3. The smallest spine names are very small

Status: DONE

Done on 2026-11-14 in commit 906b5c3. A spine name is half the spine thickness, from 20 to 24 mockup px. The spine is 40 mockup px thick at least. At 1440 by 900 px the smallest name is about 12.4 px on screen. Before: 14 mockup px, about 9 px on screen.

Approved by Arthur on 2026-11-14.

Page: table. Seen in `docs/screenshots/task-2-table.png` on 2026-11-13.

Problem: Ruth, Jude, and Lamentations have very small names.

Correction: set a minimum text size for a spine name. If the name does not fit, increase the minimum spine thickness.

## 4. Spine links below 24 px with a mouse

Status: REJECTED

Closed on 2026-11-14. Item 13 covers it.

Page: table. From the Task 2 report on 2026-11-13.

Problem: in the wide layout, the smallest spine link is 23 px. The designer recommends a minimum of 24 px for a mouse pointer.

Correction: change the camera or the minimum spine thickness so that each spine link is 24 px or more.

## 5. Spine names are hard to read between 768 and 900 px wide

Status: DONE

Done on 2026-11-14 in commit 906b5c3. The limit in `src/screenLayout.ts` is 900 px. A narrow stack is 520 px wide at most. Checked at 834 by 1112 px: the narrow table, cover, spread, and timeline show with no sideways scroll. Screenshots: `docs/screenshots/task-10/narrow-834-*.png`.

Approved by Arthur on 2026-11-14. Decision: correction 3. The limit between the two layouts moves from 768 px to 900 px. `docs/DESIGN.md` sections 4.1 and 4.6 now say 900 px. Change the one layout function and its tests. The narrow layout then covers 768 to 899 px, so check the narrow table, cover, spread, and timeline at 834 px wide.

Page: table. From the second Task 2 review on 2026-11-13.

Problem: the wide layout starts at 768 px. At that width the camera makes the whole scene smaller. The reviewer measured the thinnest spine link at 12.8 px tall at 768 px wide. The reviewer did not state the window height. The spine name scales with the spine face. I expect the smallest names to be about 6 px tall at 768 px wide. I calculated this. I did not measure it. Nobody checked legibility between 768 and 900 px.

Correction: take screenshots at 768, 834, and 900 px wide, with a stated window height. Measure the smallest spine name. Then choose one:
1. A minimum text size for a spine name, as in item 3.
2. A larger minimum spine thickness in the wide layout.
3. A higher layout limit in `src/screenLayout.ts`. This changes `docs/DESIGN.md` section 4.1, so Arthur must approve it.

## 6. State the window size for each spine link measurement

Status: REJECTED

Closed on 2026-11-14. Item 13 gives the window size, 1440 by 900 px, and axe-core makes the measurement.

Page: table. Note on item 4, from the two Task 2 reviews on 2026-11-13.

Problem: item 4 says the smallest spine link is 23 px. The two reviews measured different sizes at 1440 px wide:
- First review: 23.0 px, at a window of 1440 × 1000.
- Second review: 20 px. The reviewer did not state the window height.

The camera fits the five stacks to the width and to the height of the window. The code in `FitAndProject` in `src/table/TableScene.tsx` uses both. So the spine link size changes with the window height, not only with the width. A link size without the window size cannot be compared.

Correction: for item 4 and item 5, state each measurement with the window width and height. Measure at least at 1440 × 1000, 1440 × 800, and 768 × 1024. Add a Playwright check that records the smallest spine link height at each of these sizes.

## 7. The Gospels scene has no water color

Status: DONE

Done on 2026-11-14 in commit 906b5c3. The lake water has a blue fill (hue 205) at each time of day. The sky and the shore keep the cream cloth color. The text contrast test passes with the water behind the text. Screenshot: `docs/screenshots/task-10/gospels-four-times.png`.

Approved by Arthur on 2026-11-14.

Page: spread. Seen in `docs/screenshots/task-5/nine-scenes.png` on 2026-11-14.

Problem: the Gospels cloth is cream, so the lake scene is beige and brown. The lake looks like sand. The accuracy reviewer reports that the same scene is a neutral gray at night.

Correction: permit an exception to "colors near the cloth color" for the Gospels scene. Give the water a blue tone at each time of day. Keep the cream cloth color for the sky and the shore.

## 8. The sun is behind the fold and the corner of the text panel

Status: DONE

Done on 2026-11-14 in commit 906b5c3. The sun moves from x 140 to x 600 of the 1600-unit scene, on the left page. Its glow stays 60 units or more from the fold. The moon stays at x 300. A unit test checks each time of day.

Approved by Arthur on 2026-11-14.

Page: spread. Seen in `docs/screenshots/task-5/nine-scenes.png` and `acts-14.png` on 2026-11-14.

Problem: in most day scenes the sun is at the fold of the book, and the text panel covers part of it.

Correction: keep the sun and the moon on the left page, away from the fold and the text panel. Genesis 50 already has the moon in a good position.

## 9. A scene shape shows in front of the chapter text

Status: DONE

Done on 2026-11-14 in commit 906b5c3. No shape of layer 2 or 3 that is 60 by 60 units or larger crosses the left or the right edge of the text panel, with its largest shift. Moved: the second tree of the stream, two fig trees, the walled city, two tents, a boat, three houses, the rainbow, two clouds, and the island. One large stone at the edge is left out. A unit test checks the nine scenes. Screenshots: `nine-scenes-after.png` and `psalms-75-after.png` in `docs/screenshots/task-10/`.

Approved by Arthur on 2026-11-14.

Page: spread. Seen in `docs/screenshots/task-5/nine-scenes.png`, Psalm 75, on 2026-11-14.

Problem: a small tree of the scene is at the right edge of the text panel, next to the word "Selah".

Correction: keep the large shapes of the front layers out of the text panel area, or make sure that the panel covers them.

## 10. The marks for links are very small

Status: DONE

Done on 2026-11-14 in commit 906b5c3. A quotation link is a filled dot in a ring. An echo link is a dashed ring. Each mark is 0.92 of the text size, 15.6 px at 1440 and at 390 px wide. Before: 8.3 px. The touch area is 44 by 44 px. Screenshots: `hebrews-9-marks-1440.png` and `hebrews-9-marks-390.png` in `docs/screenshots/task-10/`.

Approved by Arthur on 2026-11-14. This item matters most: the marks are the way to travel. Keep the strong mark and the light mark different. The touch area of each mark must be 44 px or larger.

Page: spread. Seen in `docs/screenshots/task-7/hebrews-9-task-7b.png` on 2026-11-14.

Problem: a quotation link is a small filled dot and an echo link is a small dotted ring, next to the verse number. A reader can miss them. They are small for a finger.

Correction: make the marks easier to see and to select. The touch area of a mark must be 44 px or larger. Keep the difference between the strong mark and the light mark. Do not make the text hard to read.

## 11. The travel move is plain

Status: CLOSED. Arthur closed this item on 2026-11-15, after Task 18: the redesign replaced its page.

Waits. Arthur decided on 2026-11-14 that this item needs a design from the designer first.

Page: travel. Seen in `docs/screenshots/task-7/travel-mid.png` on 2026-11-14.

Problem: travel shows a row of 66 colored bars on empty linen. It does show that the reader crossed the Bible, but it does not look like the table of books, and most of the page is empty.

Correction: make the move look like the books of the table page: real spines with names, light, and shadow. The timeline page from Task 8 is a second option for the map of the move.

## 12. The timeline page is very tall

Status: CLOSED. Arthur closed this item on 2026-11-15, after Task 18: the redesign replaced its page.

Waits. Arthur decided on 2026-11-14 that this item needs a design from the designer first.

Page: timeline. Seen in `docs/screenshots/task-8/timeline-wide.png` on 2026-11-14.

Problem: each spine is 44 px thick, and the stacks have up to 14 rows. The page is about 2,150 px tall at 1440 px wide. The reader cannot see the two bands and the arcs in one view. The arcs also cross in one dense area between the bands.

Correction: options to examine. Thinner spines in the wide layout, with the same exception to the 44 px size that the table page has. Or stacks that open when the reader selects them. The two bands and the arcs must fit in one view at 1440 by 900 px.


## 13. The spines of the wide table are below the WCAG size

Status: DONE

Done on 2026-11-14 in commit 906b5c3. The spine thickness rule has a minimum of 40 mockup px. At 1440 by 900 px the smallest spine is 24.7 px, and no spine is below 24 px. Before: 26 spines below 24 px, the smallest 19.0 px. The `KNOWN` list of `e2e/a11y.spec.ts` is empty, and a test checks the size.

Approved by Arthur on 2026-11-14. Decision: each spine of the wide layout is 24 px or more on screen at 1440 by 900 px. Change the thickness rule or the camera. Keep the five stacks in one view. Remove the entry from `KNOWN` in `e2e/a11y.spec.ts`.

Page: table, wide layout. Found by axe-core 4.14.0 in Task 9b on 2026-11-14, rule `target-size` (WCAG 2.2, 2.5.8, level AA).

Problem: on screen, 26 of the 66 spines are 19 to 23.6 px thick at 1440 by 900 px. WCAG 2.2 asks for a target of 24 by 24 px or more, or space around a smaller target. The spines lie on each other in a stack, so there is no space. Section 4.1 of `docs/DESIGN.md` permits spines thinner than 44 px in the wide layout. It does not name the 24 px of WCAG.

Correction: options to examine. A thickness of 24 px or more on screen for each spine in the wide layout. Or a second way to reach each book that meets the size, for example the legend or a list. The test `e2e/a11y.spec.ts` holds this failure in its list `KNOWN` until Arthur decides.

## 14. The wide table spines are below 24 px in a narrow wide window

Status: CLOSED. Arthur closed this item on 2026-11-15, after Task 18: the redesign replaced its page.

Page: table, wide layout. Measured in Task 10 on 2026-11-14 with `scripts/measure-spines.mjs`.

Problem: item 13 asks for 24 px at 1440 by 900 px, and the spines meet it there: the smallest is 24.7 px. Item 5 moved the wide layout to 900 px and more. At 900 by 900 px, 50 of the 66 spines are below 24 px, and the smallest is 19.8 px. WCAG 2.2 rule 2.5.8 asks for 24 px at each window size.

Correction: options to examine. Raise the layout limit until each spine is 24 px or more. Or make the minimum thickness depend on the window width. Or accept the size between 900 px and the width where the spines reach 24 px.

