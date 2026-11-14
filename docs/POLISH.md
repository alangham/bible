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
