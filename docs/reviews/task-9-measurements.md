# Task 9: measurements

Measured on 2026-11-14.

## Bundle

`npx vite build`. Before Task 9 the site had one chunk of JavaScript. Now the 3D code is a separate chunk. The first load does not wait for it.

| Chunk | Before Task 9 | After Task 9 | gzip after |
|---|---|---|---|
| Main chunk, `index-*.js` | 1,294.60 kB (gzip 368.15 kB) | 369.43 kB | 123.47 kB |
| three.js and @react-three/fiber, `react-three-fiber.esm-*.js` | in the main chunk | 918.35 kB | 242.60 kB |
| `CoverScene-*.js` | in the main chunk | 5.32 kB | 2.56 kB |
| `TableScene-*.js` | in the main chunk | 3.13 kB | 1.56 kB |
| `PageTurn-*.js` | in the main chunk | 1.90 kB | 1.04 kB |
| `spineTexture-*.js` | in the main chunk | 0.74 kB | 0.46 kB |
| CSS, `index-*.css` | 32.64 kB | 34.38 kB | 7.23 kB |

The narrow table and the narrow spread do not load the 3D chunk. The cover loads it in each layout.

## Frame rate

`scripts/measure-fps.mjs` on the production build. Profile: Pixel 7 emulation, 390 by 844 px, CPU 4 times slower, the "mid-tier mobile" profile of the Chrome tools. The frame rate is the number of `requestAnimationFrame` calls. Target: 50 frames in one second or more.

Limit: headless Chromium draws WebGL with SwiftShader, a software renderer. A phone draws it with its GPU. The numbers for the cover are therefore lower than on a phone. The numbers are not a measurement on a real phone.

| Case | Average frames in one second | Worst second |
|---|---|---|
| Table: swipe to stack 2, then stack 3 | 60 | 60 |
| Cover: open the book, then the spread loads | 52 | 46 |
| Cover: idle after the book shows | 60 | 60 |
| Spread: scroll the text, with parallax | 60 | 60 |
| Spread: turn the page, cross-fade | 60 | 59 |
| Timeline: scroll the list | 60 | 60 |
| Travel: from a read-with entry to the chapter | 58 | 56 |

The worst second of the cover contains the change to the spread page. In steps of 250 ms, the opening move runs at 13 to 16 frames, which is 52 to 64 frames in one second. In the 250 ms after the address changes to the spread, there are 4 to 7 frames, while the spread page loads its text and builds its scene.

Before the reductions of step 4, three cases were below the target:

- The cover from load to open: average 17, worst second 5.
- The spread scroll with parallax: average 48, worst second 46.
- Travel: worst second 47.

The reductions:

1. The cover in the narrow layout draws at 1 device pixel for each CSS pixel, with a shadow map of 512 by 512. The wide layout keeps up to 2 device pixels and 2,048 by 2,048.
2. The paper-cut layers of the scene have no drop shadow in the narrow layout.
3. The table in the narrow layout has flat spines, with no 3D scene.

## Accessibility

`e2e/a11y.spec.ts` checks each page type in the wide layout, 1440 by 900, and the narrow layout, 390 by 844. The page types are table, cover, spread, sources, and timeline. The checks are written in the test, with no extra package:

- language, one h1, and no skipped heading level;
- a name and focus for each visible link and button;
- a touch size of 44 px or more;
- a text contrast of 4.5 to 1, or 3 to 1 for large text;
- no sideways scroll.

All 10 cases pass. A further test plants one problem for each rule and checks that the audit finds each one: no name, a small target, low contrast, no `lang`, two h1 elements, a skipped heading level, no focus, and a sideways scroll.

Exemptions of the size check:

- An inline link in a paragraph, or in a list item that has more text than the link: a link in a sentence.
- The spines of the table page in the wide layout: docs/DESIGN.md section 4.1.
- A control with a larger touch area as an absolute `::before` or `::after` element counts with that area. The link marks of the spread have a touch area of 44 by 44 px this way. Their mark is 8 to 10 px.

The contrast check skips text that it cannot measure:

- text on a scene, in `.spread-text`, `.page`, or `.scene` (`src/scene/values.test.ts` checks the contrast of the text on each scene);
- text over a background image, such as a gradient, other than the linen of the page;
- text over the 3D canvas of the cover and the table: the check measures it against the linen;
- text with an opacity below 1 when the check runs;
- text in a dimmed state: `data-dimmed="true"` and a legend entry with `data-state="off"`.

The check runs after the network is idle, the fonts are ready, and 800 ms more.

Not checked: a screen reader, a real touch gesture on a phone, the travel overlay, the link popup, and the list of a selected book on the timeline.
