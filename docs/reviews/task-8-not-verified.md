# Task 8: the "Not verified" lists of the reviewers

The two reviewers of Task 8 wrote these lists on 2026-11-14. They are copied here without changes.

After the reviews, Luke and Zechariah moved to "Date not known" (Task 8 step 2). The text of rule 4 now gives the exact years for "mid". The numbers of the rules changed, so the accuracy reviewer's "Rule 10" (the Luke and Zechariah exception) no longer exists, and its "Rule 11" is now rule 11 with the same text.

## Accuracy reviewer

1. These rules in "## Dates of the timeline" do not follow from Task 8 or DESIGN.md 4.6. Arthur did not approve them.
   - Rule 4: "early", "late" and "mid" narrow a century or a decade to a part. This affects 17 books: Isaiah, Jeremiah, Ezekiel, Hosea, Micah, Habakkuk, Mark, John, James, 1 Peter, 2 Peter, Jude and Revelation, plus the "late"/"early" parts of others. Task 8 names only the century.
   - Rule 5: a decade is a range of 10 years.
   - Rule 6: two parts of the words make one range. This rule sets Proverbs at 1000 to 700 BC, and Isaiah, Jeremiah and Micah.
   - Rule 8: rule 8 applies Arthur's decision 2 under "Periods" to the timeline. Arthur made that decision for the introductions, not for the timeline. The result agrees with Task 8 step 2.
   - Rule 10: the Luke and Zechariah exception. See problem 1.
   - Rule 11: the count runs from spine point to spine point. DESIGN 4.6 says only "Compute the number from the dates". A count from the end of the 2 Chronicles range (332 BC) to the start of the James range (AD 40) gives about 370 years, not 480. Arthur must choose the measure.
2. The line names "2 Chronicles", but 1 Chronicles stands at the same point and has the same dates. Bible order breaks the tie. The data does not make 2 Chronicles later.
3. Obadiah: the fact gives "Probably the 6th century BC, soon after Babylon destroyed Jerusalem about 586 BC". The date uses the century, 600 to 501 BC. Lamentations uses the year 586 BC for similar words. Both readings follow from the words, and the rules do not say which one leads.
4. I did not run `scripts/build-links.mjs`. So I did not confirm that the script, run now, writes the same `quotation-pairs.json`. I confirmed only that the file matches a recount from the current link files.
5. I did not render the page. I checked the ring, the between line and the list direction in the code only. I did not run the unit tests or the Playwright test.

## Code reviewer ("Not checked")

- Playwright and the 22 plus 6 tests: I did not run them. I relied on your report.
- The rendered page, and the real rendering of the spines: I did not open a browser. So I did not see the overlap of the arcs with the labels, or the page at 768 px.
- The 4.5 to 1 contrast of the tick labels, the `.tl-between` line, and the dimmed spines.
- Whether the Written facts agree with the sources of `intros.json`: that is the task of the accuracy reviewer.
- A ResizeObserver loop when a vertical scrollbar appears after the stage height is set. I did not test it.
