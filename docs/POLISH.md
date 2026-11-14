# Bible site: design fixes

This file is the list of design problems to correct later. Arthur or the designer adds an item. Claude Code can add an item with the status `PROPOSED`. Claude Code does an item only when its status is `APPROVED`. Task 10 in `docs/TASKS.md` uses this file.

Status values: `PROPOSED`, `APPROVED`, `DONE`, `REJECTED`.

---

## 1. Text on the gold and cream spines looks weak

Status: PROPOSED

Page: table. Seen in `docs/screenshots/task-2-table.png` on 2026-11-13.

Problem: the names on the Major Prophets spines and the Gospels spines are hard to read. Lamentations and Daniel are the worst. The contrast test uses the design colors. The 3D light changes the rendered colors.

Correction: measure the contrast from the rendered pixels. Change the light or the text color until each spine name is 4.5 to 1 or more in the screenshot.

## 2. The shadows have hard edges

Status: PROPOSED

Page: table. Seen in `docs/screenshots/task-2-table.png` on 2026-11-13.

Problem: the stack shadows are flat shapes with sharp edges. Mockup D1 has soft shadows.

Correction: make the shadows soft, with more blur at a larger distance from the stack.

## 3. The smallest spine names are very small

Status: PROPOSED

Page: table. Seen in `docs/screenshots/task-2-table.png` on 2026-11-13.

Problem: Ruth, Jude, and Lamentations have very small names.

Correction: set a minimum text size for a spine name. If the name does not fit, increase the minimum spine thickness.

## 4. Spine links below 24 px with a mouse

Status: PROPOSED

Page: table. From the Task 2 report on 2026-11-13.

Problem: in the wide layout, the smallest spine link is 23 px. The designer recommends a minimum of 24 px for a mouse pointer.

Correction: change the camera or the minimum spine thickness so that each spine link is 24 px or more.

## 5. Spine names are hard to read between 768 and 900 px wide

Status: PROPOSED

Page: table. From the second Task 2 review on 2026-11-13.

Problem: the wide layout starts at 768 px. At that width the camera makes the whole scene smaller. The reviewer measured the thinnest spine link at 12.8 px tall at 768 px wide. The reviewer did not state the window height. The spine name scales with the spine face. I expect the smallest names to be about 6 px tall at 768 px wide. I calculated this. I did not measure it. Nobody checked legibility between 768 and 900 px.

Correction: take screenshots at 768, 834, and 900 px wide, with a stated window height. Measure the smallest spine name. Then choose one:
1. A minimum text size for a spine name, as in item 3.
2. A larger minimum spine thickness in the wide layout.
3. A higher layout limit in `src/screenLayout.ts`. This changes `docs/DESIGN.md` section 4.1, so Arthur must approve it.

## 6. State the window size for each spine link measurement

Status: PROPOSED

Page: table. Note on item 4, from the two Task 2 reviews on 2026-11-13.

Problem: item 4 says the smallest spine link is 23 px. The two reviews measured different sizes at 1440 px wide:
- First review: 23.0 px, at a window of 1440 × 1000.
- Second review: 20 px. The reviewer did not state the window height.

The camera fits the five stacks to the width and to the height of the window. The code in `FitAndProject` in `src/table/TableScene.tsx` uses both. So the spine link size changes with the window height, not only with the width. A link size without the window size cannot be compared.

Correction: for item 4 and item 5, state each measurement with the window width and height. Measure at least at 1440 × 1000, 1440 × 800, and 768 × 1024. Add a Playwright check that records the smallest spine link height at each of these sizes.
