# Timeline estimates for 17 books

This file is the proposal of Task 16 in `docs/TASKS.md`. It gives an estimated date for each book that has `kind: "unknown"` in `public/data/dates.json`. Arthur decided on 2026-11-14 that the timeline has no "Date not known" group (section 7.8 of `docs/DESIGN.md`).

Arthur approved the 17 rows on 2026-11-14. He approved the 16 rows with a year as proposed, with the recommended view in each row: the values in the columns First year and Last year. For Job he chose option (b): the latest limit of 600 BC, with the date text "by 600 BC". Task 17 writes the approved rows into the date data and records their sources in `docs/CONTENT-SOURCES.md`.

This proposal changes earlier rules for these 17 books, if Arthur approves it:

- Section 4.6 of `docs/DESIGN.md`, and rule 8 of "Dates of the timeline" in `docs/CONTENT-SOURCES.md`, say that the time of a person gives no years. Decision 2 under "Periods" in that file says the same. This proposal gives years to the time of Moses, of Joshua, of Solomon, and of Ezra.
- Rule 9 of "Dates of the timeline" says that words with only a latest time or only an earliest time give no date. This proposal gives those books a date by rule R2 below.
- Section 7.8 of `docs/DESIGN.md` allows these years if they come from an approved source and Arthur approves them.

The source pages were read on 2026-11-14. The approved sources are the ESV Global Study Bible, for facts only, Easton's Bible Dictionary of 1897, and Wikipedia as a pointer to cited scholars. No year in this file comes from Wikipedia. The bundled Berean Standard Bible text is a source for what a book says, by rule 4 of Task 4c.

A year that no source states is marked "calculation". The calculation is given each time.

## The proposal

In this table, each year has "BC" or "AD". Task 17 writes 1446 BC as -1446 and AD 62 as 62, as `public/data/dates.json` does.

The First year and Last year columns hold the recommended value. Where the sources give a second view, the row gives it. Arthur chooses.

| Book | Written fact in `public/data/intros.json` | First year | Last year | Rule or source | Status |
|---|---|---|---|---|---|
| Genesis | By tradition, in the time of Moses, for the Israelites he led through the wilderness. | 1446 BC | 1406 BC | Time T1. View 1, recommended: ESV introduction to Exodus, "Author and Date", the exodus about 1446 BC. ESV introduction to Deuteronomy, "The Setting of Deuteronomy", about 1406 BC. View 2: 1260 BC, ESV introduction to Exodus, "Author and Date", to 1220 BC, a calculation. View 3: 1490 BC, Easton, "Exodus", to 1451 BC, a calculation. | APPROVED by Arthur, 2026-11-14 |
| Exodus | By tradition, in the lifetime of Moses. | 1446 BC | 1406 BC | Time T1, as for Genesis. View 2: 1260 BC to 1220 BC, a calculation. View 3: 1490 BC to 1451 BC, a calculation. | APPROVED by Arthur, 2026-11-14 |
| Leviticus | By tradition, in the lifetime of Moses. The laws were given at Mount Sinai within one month, in the second year after Israel left Egypt. | 1446 BC | 1406 BC | Time T1, as for Genesis. The first year is the setting at Sinai in the ESV introduction to Leviticus, "The Setting of Leviticus", about 1446 BC. Other reading: rule R3 starts the range at the second year after the exodus, 1445 BC, a calculation. View 2: 1260 BC to 1220 BC, a calculation. View 3: 1490 BC to 1451 BC, a calculation. | APPROVED by Arthur, 2026-11-14 |
| Numbers | By tradition, in the lifetime of Moses. | 1446 BC | 1406 BC | Time T1, as for Genesis. The ESV introduction to Numbers, "Journeys in the Wilderness", also gives about 1446 BC. View 2: 1260 BC to 1220 BC, a calculation. View 3: 1490 BC to 1451 BC, a calculation. | APPROVED by Arthur, 2026-11-14 |
| Deuteronomy | By tradition, near the end of the 40 years in the wilderness, shortly before Moses died. | 1406 BC | 1406 BC | Time T1: the last year of the time. View 1, recommended: ESV introduction to Deuteronomy, "The Setting of Deuteronomy", about 1406 BC. View 2: 1220 BC, a calculation. View 3: 1451 BC, a calculation. | APPROVED by Arthur, 2026-11-14 |
| Joshua | By tradition, in the lifetime of Joshua, except the last verses. | 1406 BC | 1381 BC | Time T2. First year: ESV introduction to Joshua, "The Setting of Joshua", about 1406 BC. Last year: Easton, "Joshua", the death of Joshua 25 years after the crossing of the Jordan, so 1381 BC, a calculation. View 2: 1220 BC to 1195 BC, a calculation. View 3: 1451 BC to 1426 BC, a calculation. | APPROVED by Arthur, 2026-11-14 |
| Judges | Most of it was probably written by the time of King David, 1010 to 970 BC. | 1010 BC | 970 BC | Rule R1: the range that the words give. Rule R2: the limit word "by" gives no other year. | APPROVED by Arthur, 2026-11-14 |
| Ruth | Some time after David became king, about 1010 BC, since it names David and his family line. | 1010 BC | 1010 BC | Rule R1: the one year that the words give. Rule R2: the limit words "some time after" give no other year. | APPROVED by Arthur, 2026-11-14 |
| Ezra | The date of writing is not known. The events in the book end in the 5th century BC. | 500 BC | 401 BC | Rule R1: the century that the words give, by rule 3 of "Dates of the timeline", as for Nehemiah. The century is the time of the last events, not of the writing. The words give no last year for the writing. Other reading: no year, as for Job. | APPROVED by Arthur, 2026-11-14 |
| Job | The date is not certain, and the story seems set in the age of Abraham, Isaac, and Jacob. An older view gives the time of Moses or of David and Solomon. | 600 BC | 600 BC | Arthur's decision of 2026-11-14, option (b): the latest limit in Easton, "Job, Book of", which says that the book was known in the days of Ezekiel, 600 BC. The date text of Job is "by 600 BC", a latest limit. It is an estimate. The approved sources give no year for the writing. See the note on Job below. | APPROVED by Arthur, 2026-11-14 |
| Psalms | By tradition, over many centuries, from the time of Moses to the time of Ezra. | 1446 BC | 433 BC | First year: time T1, view 1, the exodus in the ESV introduction to Exodus, "Author and Date". Last year: time T4, the end of the span of Ezra 7 to Nehemiah 13 in the ESV introduction to Ezra, "Author and Date". First year in view 2: 1260 BC. First year in view 3: 1490 BC. Easton gives no last year for the time of Ezra. | APPROVED by Arthur, 2026-11-14 |
| Ecclesiastes | By tradition, in the time of Solomon. | 971 BC | 931 BC | Time T3. View 1, recommended: ESV introduction to 1 and 2 Kings, the map "The Extent of Solomon's Kingdom", about 971 to 931 BC. Other reading: 970 BC to 930 BC, by Arthur's rule for the end of David's reign and the forty years of 1 Kings 11:42, a calculation. | APPROVED by Arthur, 2026-11-14 |
| Zechariah | By tradition, from about 520 BC, after the people of Judah returned from Babylon in 538 BC. | 520 BC | 520 BC | Rule R1: the year that leads in the words. Rule R2: the limit word "from" gives no other year. 538 BC is the year of an event before 520 BC, so rule R3 does not change the year. | APPROVED by Arthur, 2026-11-14 |
| Luke | By tradition, no earlier than about AD 62, just after the last events in Acts. An older view dates it to about AD 60 to 63, a little before Acts. | AD 62 | AD 62 | Rule R1: the one year in the traditional sentence. The timeline does not use a sentence that starts "An older view", by the introduction to "Dates of the timeline". Rule R2: the limit words "no earlier than" give no other year. | APPROVED by Arthur, 2026-11-14 |
| Hebrews | By tradition, before AD 70, probably in Rome. | AD 70 | AD 70 | Rule R1: the one year that the words give. Rule R2: the limit word "before" gives no other year. The estimate stands at the limit year. | APPROVED by Arthur, 2026-11-14 |
| 2 John | By tradition, in Ephesus, no later than the 90s AD. | AD 90 | AD 99 | Rule R1: the decade that the words give, by rule 5 of "Dates of the timeline". Rule R2: the limit words "no later than" give no other year. | APPROVED by Arthur, 2026-11-14 |
| 3 John | By tradition, in Ephesus, no later than the 90s AD. | AD 90 | AD 99 | As for 2 John. | APPROVED by Arthur, 2026-11-14 |

## Rules for the books whose Written fact gives a year

Step 4 of Task 16. These rules use only the words of the Written fact. They use no new fact. The numbered rules are in "Dates of the timeline" in `docs/CONTENT-SOURCES.md`. Section 4.6 of `docs/DESIGN.md` records Arthur's acceptance of them.

- R1. The estimate is the date that the words give. One year gives the first year and the last year. A range, a century, or a decade gives its range, by rules 1 to 6. Where the words give two dates, the date in the traditional sentence is used. The timeline does not use a sentence that starts "An older view".
- R2. A limit in the words limits the range, by rule 14. Where the words give no other year, the estimate is the limit year. The limit words in these rows are "before", "by", "no later than", "some time after", "from", and "no earlier than". Under rule 9, these words gave no date. R2 replaces rule 9 for these books.
- R3. A book is not written before the last event that its Written fact names. The range starts at the year of that event. This is rule 15.

Section 7.8 of `docs/DESIGN.md` says that the prototype placed each of these books at the one year that its fact gives, and calls that rule a value of the designer.

## The times of a person

Step 5 of Task 16. A Written fact that names the time of a person gives no year. These are the years of each time in the approved sources. Where the sources give two views, each view is in the list. The view of the ESV Global Study Bible is recommended, as in section 4.2 of `docs/DESIGN.md` and rule 3 of Task 4b. Arthur chooses.

How this file reads "the time" and "the lifetime" of a person. This reading is a choice for Arthur.

- For Moses, the time of writing is the 40 years in the wilderness, from the exodus to his death. It is not the whole life of Moses.
- For Joshua, the time of writing is from the start of the book, the crossing of the Jordan, to his death. It is not the whole life of Joshua.
- The reason: Exodus to Deuteronomy, and Joshua, tell mostly of events in that part of the life. Exodus 1 and 2 tell of earlier events, such as the birth of Moses.
- Genesis tells of no event in the life of Moses. For Genesis, the reason is its Written fact, which names the Israelites whom Moses led through the wilderness.
- The other reading is the whole life. Only Easton gives a year for it: the birth of Moses in 1571 BC. No approved source gives the birth year of Joshua.

### T1. The time of Moses

The time is the 40 years in the wilderness. Sources for the 40 years:

- The ESV introduction to Deuteronomy, "Purpose and Background", places the sermons of Moses shortly before his death, 40 years after the law was given at Sinai.
- Deuteronomy 1:3 in the Berean Standard Bible places the speeches of Moses in the fortieth year.

The three views:

1. View 1, recommended: 1446 to 1406 BC.
   - The exodus, about 1446 BC: https://www.esv.org/resources/esv-global-study-bible/introduction-to-exodus/, section "Author and Date". The page calls this a common view. It bases it on the 480 years of 1 Kings 6:1, which end in the fourth year of Solomon, about 966 BC.
   - About 1446 BC is also the setting of Leviticus and of Numbers: https://www.esv.org/resources/esv-global-study-bible/introduction-to-leviticus/, section "The Setting of Leviticus", and https://www.esv.org/resources/esv-global-study-bible/introduction-to-numbers/, section "Journeys in the Wilderness".
   - The sermons of Moses shortly before his death, about 1406 BC: https://www.esv.org/resources/esv-global-study-bible/introduction-to-deuteronomy/, section "The Setting of Deuteronomy".
2. View 2: 1260 to 1220 BC.
   - The same Exodus section says that some scholars put the exodus possibly about 1260 BC. Their reason is the city Raamses in Exodus 1:11. They place the exodus in the reign of Raamses II, about 1279 to 1213 BC. The Berean Standard Bible spells the city "Rameses".
   - The page gives no year for the death of Moses in this view. The last year, 1220 BC, is 1260 BC less the 40 years. It is a calculation.
3. View 3, older: 1490 to 1451 BC.
   - The exodus, about 1490 BC: Easton's Bible Dictionary, "Exodus", https://en.wikisource.org/w/index.php?title=Easton%27s_Bible_Dictionary_(1897)/Exodus&oldid=724343.
   - Easton, "Moses", gives the birth of Moses in 1571 BC and his death at 120 years: https://en.wikisource.org/w/index.php?title=Easton%27s_Bible_Dictionary_(1897)/Moses&oldid=759901. Deuteronomy 34:7 also gives 120 years. Easton gives no year for the death.
   - The last year, 1451 BC, is 1571 BC less 120 years. It is a calculation.
   - This range is 39 years, not 40. The first year is from the Easton article "Exodus". The last year is a calculation from the Easton article "Moses".

### T2. The lifetime of Joshua

The time is from the crossing of the Jordan to the death of Joshua.

1. View 1, recommended: 1406 to 1381 BC.
   - The first year, about 1406 BC: https://www.esv.org/resources/esv-global-study-bible/introduction-to-joshua/, section "The Setting of Joshua". The page dates the setting of the book. It does not name the crossing. This file uses the year for the crossing because the book begins with the crossing, in Joshua 1 to 4.
   - The death of Joshua, 25 years after he crossed the Jordan: Easton, "Joshua", https://en.wikisource.org/w/index.php?title=Easton%27s_Bible_Dictionary_(1897)/Joshua&oldid=736115. Easton gives no year BC. Joshua 24:29 says that Joshua died at 110.
   - The last year, 1381 BC, is 1406 BC less 25 years. It is a calculation from two sources.
   - A check, not a source: the ESV introduction to Judges, section "The Setting of Judges", gives about 1375 BC. Judges 1:1 begins after the death of Joshua. 1381 BC is before that setting.
2. View 2: 1220 to 1195 BC. The first year is the last year of T1, view 2. The last year adds Easton's 25 years. Both years are calculations.
3. View 3: 1451 to 1426 BC. The first year is the last year of T1, view 3. The last year adds Easton's 25 years. Both years are calculations.

A note, not a second view of the time. The ESV introduction to Joshua, section "Author and Date", gives a view of the date of the book, not of Joshua's lifetime. It says that work on the book likely started long before the exile, and that its final form may come after 587 BC. Section 4.6 of `docs/DESIGN.md` says that the timeline uses the Written fact. So this file uses the lifetime of Joshua.

### T3. The time of Solomon

1. View 1, recommended: 971 to 931 BC. The ESV introduction to 1 and 2 Kings has the map "The Extent of Solomon's Kingdom", about 971 to 931 BC: https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-kings/.
2. Other reading: 970 to 930 BC.
   - Arthur decided on 2026-11-14 that the reign of David ends about 970 BC on the site, where two ESV pages give 971 BC (`docs/CONTENT-SOURCES.md`, section "Periods", decision 1). That decision covers only the end of David's reign. This reading applies the same rule to the start of the time of Solomon. Arthur has not decided this.
   - 1 Kings 11:42 in the Berean Standard Bible gives Solomon a reign of forty years. So the time ends in 930 BC. This is a calculation.
   - With view 1, the time of Solomon starts one year before the reign of David ends on the site.
3. Easton's Bible Dictionary gives no years BC for the reign. It says that Solomon was born about 1035 BC and reigned forty years: https://en.wikisource.org/w/index.php?title=Easton%27s_Bible_Dictionary_(1897)/Solomon&oldid=739884.

For Ecclesiastes, the ESV introduction, section "Author", gives two views of the author, Solomon or a later writer, and chooses neither. The Written fact gives the traditional view, so this file uses the time of Solomon.

### T4. The time of Ezra

Psalms uses only the last year of this time. No approved source gives a year for the end of the time of Ezra.

1. View 1, recommended: 458 to 433 BC.
   - The ESV introduction to Ezra, section "Author and Date", says that Ezra 7 to Nehemiah 13 covers 458 to 433 BC. The section "The Persian Empire at the Time of Ezra" says that Ezra led a group back about 458 BC: https://www.esv.org/resources/esv-global-study-bible/introduction-to-ezra/.
   - 433 BC is the end of that span, which includes the work of Nehemiah. It is not a year for the end of Ezra's work.
   - Why the span is used for Psalms: Easton's article on the Psalms says that no psalm can be shown to be later than Ezra and Nehemiah. It names the two together: https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FPsalms&oldid=759929.
2. View 2, older. Easton, "Ezra", says that Ezra led the second return in 459 BC, and gives 445 BC for the time of Nehemiah: https://en.wikisource.org/w/index.php?title=Easton%27s_Bible_Dictionary_(1897)/Ezra&oldid=735495. Easton gives no last year for the time of Ezra.

With view 1 of T1, the range of Psalms is 1446 to 433 BC, about 1,000 years. Easton's article on the Psalms also says that the collection covers about 1,000 years.

## Note on Job

The approved sources give no year for the writing of Job. Step 7 of Task 16 says to propose no year.

- The ESV introduction to Job, section "Author and Date", calls the author an unknown Israelite. It sets the events in the time of the patriarchs. It gives no date of writing: https://www.esv.org/resources/esv-global-study-bible/introduction-to-job/.
- Easton's Bible Dictionary gives two older views, the time of Moses or the time of David and Solomon. They are two different times, so they give no one estimate: https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJob%2C_Book_of&oldid=7352541.
- The same Easton article gives one year: the book was known in the days of Ezekiel, 600 BC, citing Ezekiel 14:14. This is a latest limit, not a date of writing. The Written fact does not name it.
- Arthur decided on 2026-11-14 that the Written fact of Job needs no years (`docs/CONTENT-SOURCES.md`, section "Periods", decision 2).

Arthur's decision of 2026-11-14: option (b). Job stands at 600 BC, the latest limit in Easton. The timeline shows the words "by 600 BC" for Job, as a latest limit, and marks the date as an estimate.

## For Task 17

- Record each source with its fixed revision. The Easton addresses in this file have an `oldid`. The ESV pages have no revision number. Record the date that the page was read, 2026-11-14.
- Each year marked "calculation" needs its calculation in `docs/CONTENT-SOURCES.md`, not only the source years.
