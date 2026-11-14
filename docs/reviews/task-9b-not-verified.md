# Task 9b: the "Not verified" list of the accuracy reviewer

The accuracy reviewer of Task 9b wrote this list on 2026-11-14. It is copied here without changes. The code reviewer passed Task 9b with 4 minor problems and no "Not verified" item about the dates.

After the review, Isaiah went back to 750 BC to 651 BC, to follow the wording of section 4.6 of `docs/DESIGN.md`. Rule 15 in `docs/CONTENT-SOURCES.md` now says "the last event", and item 20 of its "Not verified" list holds the question of the call of Isaiah, about 740 BC.

1. Isaiah, rule 15. Arthur's decision in section 4.6 of `docs/DESIGN.md` says "the last event that its Written fact names". Rule 15 in `docs/CONTENT-SOURCES.md` says "the last dated event". In the Isaiah fact, the last event is that Isaiah outlived Sennacherib, and the fact gives no year for that event. Under the DESIGN.md wording, rule 15 gives Isaiah no start year, and the range stays 750 to 651 BC. Under the CONTENT-SOURCES.md wording, the range starts at 740 BC. 740 BC does not contradict the fact. Arthur's only example is Daniel, so he must choose the reading.
2. The events with no year in the fact, listed in Verified item 8, would limit their ranges if the facts gave years. Some of those years are in the facts of other books, for example 586 BC in Lamentations. I did not use them, by the rule of this task.
3. I did not run `npm test` or Vitest, so the tests in `src/data/dates.test.ts` did not run. I did my own computation with `node`, because Vitest can write cache files in the repository.
4. I did not open the timeline page in a browser. I did not see the line between the bands on the screen, or where the spines of 2 Kings, Daniel, and Isaiah stand.
5. I did not check the axe-core part of Task 9b, because it is outside the accuracy review. That part is the changes in `e2e/a11y.spec.ts`, `TimelinePage.tsx`, `docs/POLISH.md`, `package.json`, and the screenshots.
