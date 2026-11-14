# Content sources

This file records the source of each fact that the site states about the Bible. CLAUDE.md requires it. The accuracy reviewer checks each fact against the source named here.

## Approved sources

Arthur approved these sources on 2026-11-13. The list and the conditions are in Task 4 of `docs/TASKS.md`. Use no other source without Arthur's approval.

| Source | Role | Rights | Address |
|---|---|---|---|
| Easton's Bible Dictionary, 1897 | The traditional author, date, and place. | Public domain. | Wikisource: https://en.wikisource.org/wiki/Easton%27s_Bible_Dictionary_(1897) |
| ESV Global Study Bible, the introduction to each book | The traditional view in current scholarship, and the conservative part of a detail. | Copyright Crossway, all rights reserved. Facts only. No sentence is copied. | https://www.esv.org/resources/esv-global-study-bible/ |
| Wikipedia, the article on each book | The critical part of a detail. | CC BY-SA 4.0. Facts only. No sentence is copied. | A fixed revision for each book, below. |
| 1911 Encyclopaedia Britannica | Fallback only. Not used. | Public domain. | Wikisource. |
| Berean Standard Bible, the text bundled in the site | What a book says, for example "The writer calls himself the elder". Rule 4 of Task 4c. | Public domain. | The verse is given with each record. |

## The authorship rule and the five rules

The authorship rule has two layers. It is in section 4.2 of `docs/DESIGN.md`.

- Layer 1: the Author fact and the Written fact on the cover give the traditional view only.
- Layer 2: where a fact has a dispute, a "Scholars differ" control opens a detail. The critical part comes from Wikipedia. The conservative part gives the view of the ESV Global Study Bible page for the book on that fact, with the reason from that page if the page gives one. For most books this is the traditional view. Where it differs from the older tradition, the part gives the view of the page and does not call it the tradition. Where the page gives no view on that fact, or gives two views and chooses neither, the detail has the critical part only. Arthur changed this rule on 2026-11-14 (docs/DESIGN.md section 4.2).

The five rules of Task 4b, decided by Arthur on 2026-11-13:

1. No place of writing unless an approved source states it.
2. One approved source is enough for a fact when no approved source contradicts it.
3. Where Easton and the ESV Global Study Bible differ on the traditional view, the ESV Global Study Bible leads. Easton can follow as "An older view names ...".
4. The strength word matches the source.
5. No line rests on the view of one scholar. A standard reference work counts as a source. A general view that the article states with one citation stays (Task 4c rule 3).

## Task 4c rules

Arthur decided these on 2026-11-13:

1. One table of periods for the whole site, in `public/data/periods.json`. Each introduction uses its years.
2. An article about a group of books is a source for each book in the group, when the cited claim names the group.
3. Rule 5 excludes the view of one scholar. A general view that the article states with one citation stays.
4. The bundled Bible text is a source for what a book says.

## Periods

Each period that the introductions name has one set of years. `public/data/periods.json` holds them.

| Period | Years | Source |
|---|---|---|
| the time of the judges | before about 1050 BC | ESV Global Study Bible, introduction to Ruth, https://www.esv.org/resources/esv-global-study-bible/introduction-to-ruth/: after the conquest of Canaan and before about 1050 BC. |
| the time of King David | 1010 to 970 BC | ESV Global Study Bible, introduction to Judges, Author and Date, https://www.esv.org/resources/esv-global-study-bible/introduction-to-judges/: David's time, 1010 to 970 BC. Arthur chose 1010 to 970 BC on 2026-11-14, with the 971 pages in view. Two other ESV pages end the reign in 971 BC: the introduction to 1 and 2 Samuel, and the map "The Extent of David's Kingdom", 1010 to 971 BC, in the introduction to 1 and 2 Chronicles. |
| the captivity in Babylon | 586 to 538 BC | ESV Global Study Bible, introduction to 1 and 2 Chronicles, timeline, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-chronicles/. |
| Persian rule | 539 to 332 BC | ESV Global Study Bible, introduction to 1 and 2 Chronicles, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-chronicles/: the Persian period, 539 to 332 BC. |
| Greek rule | from 332 BC | The year when Persian rule ended in the ESV Global Study Bible, introduction to 1 and 2 Chronicles. |

Arthur decided these on 2026-11-14:

1. The time of King David is 1010 to 970 BC, and the reign ends about 970 BC. Two ESV pages give 971 BC for the end; the site uses 970 BC. 1 Chronicles 29:27 in the Berean Standard Bible gives David's reign as forty years. Each introduction that names the end of the reign gives about 970 BC. A source record keeps the year that its page gives.
2. The time of a person is not a period and needs no years, unless the table of periods has an entry for it. Arthur added the exception on 2026-11-14. Example: Job, Written: "the time of Moses or of David and Solomon" needs no years. Entry: the time of King David has years in the table.

## How the introductions were written

- Each source page was downloaded once, on 2026-11-13. The Easton and Wikipedia addresses below are fixed revisions (`oldid`).
- Each fact and each detail is in my own words. A script checked that no run of 6 words in the site text, in the summaries below, or in the notes is the same as a run in the ESV Global Study Bible text or the Wikipedia text of that book. A proper name of more than one word is the only exception.
- "What it is" was compared with the first and the last chapter of the Berean Standard Bible text, as a minimum.
- Each introduction has `review: "draft"`. Only Arthur changes it to `"approved"`.

## Book introductions

### Genesis (`genesis`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-genesis/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Genesis&oldid=1385020338 .

- Author: Moses, by tradition, who probably brought together accounts handed down from earlier times.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-genesis/. States: Says tradition holds that Moses wrote Genesis and the other four books of the Pentateuch, and that he likely gathered stories handed down about older events.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FGenesis&oldid=2961148. States: Names Moses as the author, who may have used older documents and traditions.
- Author, critical scholars: Modern scholars think that several writers and editors produced it, much later than Moses.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Genesis&oldid=1385020338, section "Composition". States: Says modern scholars hold that several authors and editors wrote Genesis much later than Moses. The article cites: Simon Oliver, Creation, Bloomsbury, 2017, p. 11.
- Author, conservative scholars: Conservative scholars cite verses on Moses writing, such as Numbers 33:2, Deuteronomy 31:24, and John 5:46. Moses could have gathered older accounts of events long before his time.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-genesis/. States: Cites Numbers 33:2, Deuteronomy 31:24, and John 5:46 for the traditional view. Suggests that Moses compiled accounts of events from before his own time.
- Written: By tradition, in the time of Moses, for the Israelites he led through the wilderness.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-genesis/. States: Says the first readers were the Israelites whom Moses led in the wilderness. Gives no year of writing.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FGenesis&oldid=2961148. States: Names Moses as the author. Gives no year and no place of writing.
- Written, critical scholars: Most scholars date its final form after the captivity in Babylon, 586 to 538 BC, possibly the 5th century BC.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Genesis&oldid=1385020338, section "Composition". States: Says most scholars in this century put the finished book after the exile in Babylon, possibly in the 5th century BCE. The article cites: Simon Oliver, Creation, Bloomsbury, 2017, pp. 11 to 12.
- Written, conservative scholars: Conservative scholars hold that Moses wrote it, citing Numbers 33:2, Deuteronomy 31:24, and John 5:46. He wrote for the Israelites he led, and he probably gathered stories passed down from earlier times.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-genesis/, section "Author, Date, and Recipients". States: Moses is by tradition the writer, with three verses cited. He presumably collected older stories. His first readers were the Israelites in the wilderness.
- What it is: A narrative that begins with creation, then tells of the flood and the families of Abraham, Isaac, Jacob, and Joseph. It ends with Joseph's death in Egypt, where Jacob's family now lives.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FGenesis&oldid=2961148. States: Chapters 1 to 11 give a general history of mankind. Chapters 12 to 50 give the early history of Israel to the death of Joseph.
  - Berean Standard Bible. States: Chapter 1 tells how God created the heavens, the earth, and mankind. Chapter 50 says Joseph's household stayed in Egypt, where Joseph died at 110.

### Exodus (`exodus`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-exodus/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Exodus&oldid=1383653829 .

- Author: Moses, by tradition, wrote most of it. Some details were added later, and some wording appears to have been updated.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-exodus/. States: Says Moses is best seen as the main writer of Exodus. Some details were added and some wording updated for later readers.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FExodus%2C_Book_of&oldid=721436. States: Ascribes Exodus to Moses, as with the other four books, and appeals to tradition and internal evidence.
- Author, critical scholars: By the end of the 1800s, scholars had given up the view that Moses wrote it. Contradictions and repeated passages in the first five books of the Bible led them to this.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Exodus&oldid=1383653829, section "Composition: Authorship". States: Says tradition credits Moses, but scholars had dropped that idea before 1900 because of discrepancies and repetitions in the Pentateuch. The article cites: Carol Meyers, Exodus, Cambridge University Press, 2005, p. 16.
- Author, conservative scholars: Conservative scholars hold that Moses is best seen as the main writer, as with the other four books of Moses. They accept that some details were clearly added later.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-exodus/, section "Author and Date". States: Moses is best seen as the main writer, like the other books of Moses. Some details were clearly added later, and some wording seems updated.
- Written: By tradition, in the lifetime of Moses.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-exodus/. States: Says Moses wrote it. Dates the events of the exodus, not the writing.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FExodus%2C_Book_of&oldid=721436. States: Ascribes the book to Moses. Gives no date of writing.
- Written, critical scholars: Modern scholars think it was first composed in the captivity in Babylon, 586 to 538 BC. They date its final revisions to the 5th century BC.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Exodus&oldid=1383653829, section "Lead". States: Says modern scholars date the first composition to the exile in Babylon, 6th century BCE, and the last revisions to the 5th century BCE. The article cites: William D. Johnstone, Exodus, in Eerdmans Bible Commentary, 2003, p. 72; Israel Finkelstein and Neil Asher Silberman, The Bible Unearthed, 2002, p. 68.
- Written, conservative scholars: Conservative scholars hold that Moses wrote most of it, in his lifetime. A common view dates Israel's exit from Egypt to about 1446 BC, but some prefer about 1260 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-exodus/, section "Author and Date". States: Moses wrote most of it. No consensus on the date of the exodus. A common view gives about 1446 BC from 1 Kings 6:1. Some prefer about 1260 BC.
- What it is: A narrative of Israel's escape from slavery in Egypt and its journey to Mount Sinai. There God gives the law, and Moses sets up the tabernacle.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FExodus%2C_Book_of&oldid=721436. States: Lists the contents: Israel's growth in Egypt, the departure, the journey to Sinai, the giving of the law, and the setting up of the tabernacle.
  - Berean Standard Bible. States: Chapter 1 tells how a new king of Egypt forced the Israelites into hard labor. In chapter 40 Moses sets up the tabernacle, and the LORD fills it.

### Leviticus (`leviticus`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-leviticus/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Leviticus&oldid=1383765592 .

- Author: Moses, by tradition, as its source and main author.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-leviticus/. States: Treats Moses as the main author and the origin of the book, as with the rest of the Pentateuch.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FLeviticus&oldid=736142. States: Calls Leviticus the third book of Moses.
- Author, critical scholars: Most scholars think two related schools of priestly writers produced chapters 1 to 16 and chapters 17 to 26.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Leviticus&oldid=1383765592, section "Composition". States: Says most scholars give the Priestly code, chapters 1 to 16, and the Holiness code, chapters 17 to 26, to two linked schools. The article cites: Walter J. Houston, Leviticus, in Eerdmans Bible Commentary, 2003, p. 102.
- Author, conservative scholars: Conservative scholars hold that Moses is best seen as its source and main writer, as with each book of Moses. Leviticus carries on the story of Exodus.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-leviticus/, section "Author". States: Like the other books of Moses, Leviticus is best seen as coming from Moses as source and main writer. It carries on from Exodus.
- Written: By tradition, in the lifetime of Moses. The laws were given at Mount Sinai within one month, in the second year after Israel left Egypt.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FLeviticus&oldid=736142. States: Calls it the third book of Moses. Says all its laws were given within one month, the first month of the second year after the exodus.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-leviticus/. States: Says the book gives more detail on the relationship set up at Mount Sinai.
  - Berean Standard Bible. States: Leviticus 27:34 says the LORD gave these commandments to Moses on Mount Sinai.
- Written, critical scholars: Most scholars place the final form of the five books of Moses under Persian rule, 539 to 332 BC. Leviticus grew over a long time before that.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Leviticus&oldid=1383765592, section "Composition". States: Says the majority of scholars put the final form of the Pentateuch in the Persian period, 538 to 332 BC, after a long growth of Leviticus. The article cites: Carol Ann Newsom, The Self as Symbolic Space, Brill, 2004, p. 26; Lester Grabbe, Leviticus, in Oxford Bible Commentary, 1998, p. 92.
- Written, conservative scholars: Conservative scholars hold that Moses was its source and main writer, so it comes from his lifetime. The Lord gave its laws at Mount Sinai, which a common view dates to about 1446 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-leviticus/, section "Author; The Setting of Leviticus". States: Moses is its source and main writer. The book records what the Lord told Moses from the tabernacle at Mount Sinai, set about 1446 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-exodus/, section "Author and Date". States: The introduction to Exodus, to which the Leviticus page refers for the date, calls about 1446 BC a common view, with about 1260 BC preferred by some.
- What it is: A book of laws on offerings, priests, purity, and feasts, given by God to Moses. The setting is the Tent of Meeting at Mount Sinai.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FLeviticus&oldid=736142. States: Lists laws on sacrifices, priestly duties, purity, separation from other nations, festivals, and vows.
  - Berean Standard Bible. States: In chapter 1 the LORD calls Moses and speaks about burnt offerings at the Tent of Meeting. Chapter 27 ends with the commandments given to Moses on Mount Sinai.

### Numbers (`numbers`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-numbers/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Numbers&oldid=1384977761 .

- Author: Moses, by tradition, as its source and main author.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-numbers/. States: Names Moses as the origin and main author of Numbers, the fourth book of the Pentateuch.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FNumbers%2C_Book_of&oldid=759898. States: Says the book, like the rest of the Pentateuch, shows evidence of being written by Moses.
- Author, critical scholars: Scholars often trace the first five books of the Bible to four sources. They generally see each source as the work of a school of writers, not one person.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Numbers&oldid=1384977761, section "Composition". States: Says the Torah is often traced to four sources, seen as the work of schools of writers. In this outline, Numbers is a priestly reworking of a non-priestly original. The article cites: Michael D. Coogan, Marc Zvi Brettler, and Carol Ann Newsom, Editors' Introduction, The New Oxford Annotated Bible, 2007, p. 6; John J. McDermott, Reading the Pentateuch, Pauline Press, 2002, p. 21.
- Author, conservative scholars: Conservative scholars keep the traditional view that Moses is the source and main writer of Numbers.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-numbers/, section "Author and Date". States: The page states without hedging that Moses is the source and main writer of Numbers, the fourth book of Moses.
- Written: By tradition, in the lifetime of Moses.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-numbers/. States: Names Moses as author. Says the book sums up about 40 years of Israel's history.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FNumbers%2C_Book_of&oldid=759898. States: Names Moses as the writer. Says the book covers about 38 years and 10 months after the exodus.
- Written, critical scholars: Most modern scholars think the first five books of the Bible reached their present form after about 520 BC.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Numbers&oldid=1384977761, section "Composition". States: Says most modern scholars date the present form of the Torah after about 520 BC. Adds that the Ketef Hinnom scrolls make an early written Numbers 6 passage plausible. The article cites: Peter Enns, The Evolution of Adam, 2012, p. 5; Israel Finkelstein and Neil Asher Silberman, The Bible Unearthed, 2002, pp. 68 to 69; John J. McDermott, Reading the Pentateuch, 2002, p. 21; Paul J. N. Lawrence, in Write That They May Read, 2020, p. 58.
- Written, conservative scholars: Conservative scholars hold that Moses was its source and main writer, so it comes from his lifetime. It tells of about 40 years, from Mount Sinai to the Jordan River.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-numbers/, section "Author and Date". States: Moses is the source and main writer. The book sums up about 40 years, from Sinai to the Jordan. Setting about 1446 BC.
- What it is: A narrative with laws, following Israel through the wilderness from Mount Sinai to the plains of Moab. It takes its name from two counts of the people.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FNumbers%2C_Book_of&oldid=759898. States: Says the name comes from the counting of the people at Sinai, chapters 1 to 4, and on the plain of Moab, chapter 26.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-numbers/. States: Says the book follows Israel from Sinai up to the edge of the land promised to them.
  - Berean Standard Bible. States: Chapter 1 is a census in the Wilderness of Sinai. Chapter 36 ends with commandments given through Moses on the plains of Moab by the Jordan.

### Deuteronomy (`deuteronomy`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-deuteronomy/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Deuteronomy&oldid=1381459516 .

- Author: Moses, by tradition, apart from the account of his death at the end.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FDeuteronomy&oldid=12568368. States: Names Moses as the author. Says another hand, probably Joshua, wrote the account of his death and burial.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-deuteronomy/. States: Calls the book mainly sermons that Moses preached to Israel shortly before he died.
- Author, critical scholars: Nearly all secular scholars reject the view that Moses wrote it. So do most scholars who are Christian or Jewish.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Deuteronomy&oldid=1381459516, section "Composition: Composition history". States: Says almost every secular scholar, and most Christian and Jewish ones too, deny that Moses wrote Deuteronomy. The article cites: Jeffrey Stackert, Deuteronomy and the Pentateuch, Yale University Press, 2022, p. 136.
- Author, conservative scholars: Conservative scholars hold that the book is mainly sermons that Moses preached to Israel shortly before he died.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-deuteronomy/, section "Purpose and Background". States: No section on the writer. The page calls the book mainly a sermon or sermons that Moses gave to Israel just before his death.
- Written: By tradition, near the end of the 40 years in the wilderness, shortly before Moses died.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FDeuteronomy&oldid=12568368. States: Says the speeches were given in the eleventh month of the last year of the wanderings, a short time before Moses died.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-deuteronomy/. States: Says Moses gave these sermons just before he died, 40 years after the law was given at Sinai.
- Written, critical scholars: Nearly all secular scholars date it from the 7th to 5th century BC, as do most Christian and Jewish scholars. Most scholars place its core of laws, chapters 12 to 26, in the 7th century BC.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Deuteronomy&oldid=1381459516, section "Composition: Composition history". States: Says those scholars put the book far later, in the 7th to 5th centuries BCE. Says most scholars put chapters 12 to 26 in the 7th century BCE. The article cites: Jeffrey Stackert, Deuteronomy and the Pentateuch, 2022, p. 136; J. Maxwell Miller and John H. Hayes, 1986, pp. 393 to 394; Alexander Rofe, 2002, pp. 4 to 5.
- Written, conservative scholars: Conservative scholars hold that Moses gave these sermons on the plains of Moab, about 1406 BC. That was shortly before he died, as Israel waited to enter Canaan.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-deuteronomy/, section "Purpose and Background; The Setting of Deuteronomy". States: Moses gave the sermons just before his death, while Israel camped in Moab. Setting about 1406 BC. No date of writing is given.
- What it is: Speeches of Moses that retell Israel's journey and restate the law before the people enter Canaan. It ends with the death of Moses.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FDeuteronomy&oldid=12568368. States: Says the book is mainly three speeches of Moses that review the 40 years and restate the law, then a song, blessings, and the account of his death.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-deuteronomy/. States: Says the book contains Moses' last sermons, urging Israel to keep the law when they enter the land.
  - Berean Standard Bible. States: Chapter 1 says these are the words Moses spoke to Israel east of the Jordan in Moab. Chapter 34 tells of the death of Moses in Moab.

### Joshua (`joshua`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-joshua/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Joshua&oldid=1382152172 .

- Author: The book does not name its author, though it mentions Joshua writing. An older view, from Jewish tradition, names Joshua, except for the last verses.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-joshua/. States: Says the book mentions Joshua writing, at 8:32 and 24:26, but does not claim that he wrote the book.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Joshua&oldid=1382152172, section "Composition: Authorship and date". States: Calls the book anonymous. Says the Babylonian Talmud gave it to Joshua.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJoshua%2C_Book_of&oldid=809141. States: Accepts the Jewish tradition that Joshua wrote the book, except the last verses, 24:29 to 33, which another hand added.
- Written: By tradition, in the lifetime of Joshua, except the last verses.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJoshua%2C_Book_of&oldid=809141. States: Gives the book to Joshua himself, apart from the last verses. Gives no year.
- Written, critical scholars: Scholars now generally agree it was part of a history from Deuteronomy to Kings, first written under King Josiah. They date that first form near the end of the 7th century BC and a heavy revision to the 6th.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Joshua&oldid=1382152172, section "Composition: Authorship and date". States: Says there is now broad agreement that it belongs to the Deuteronomistic history, first drafted under Josiah near 600 BC and heavily revised later. The article cites: K. Lawson Younger Jr, Joshua, in Eerdmans Commentary on the Bible, 2003, p. 174; Albert de Pury and Thomas Romer, Deuteronomistic Historiography, in Israel Constructs its History, 2000, p. 63.
- Written, conservative scholars: Conservative scholars hold that the writing probably began long before the captivity in Babylon, 586 to 538 BC. Notes on what remains to this day suggest it was finished long after the events, perhaps in the captivity.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-joshua/. States: The notes on what remains to this day suggest a long gap. Writing likely started much earlier, and the final writing may fall in the captivity, after 587 BC.
- What it is: A narrative of how Israel, led by Joshua, takes Canaan and divides the land among the tribes. It ends with Joshua's farewell and death.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJoshua%2C_Book_of&oldid=809141. States: Says the book covers the conquest, the allotment of the land to the tribes, and the farewell speeches and death of Joshua.
  - Berean Standard Bible. States: Chapter 1 tells how the LORD sends Joshua to cross the Jordan into the land. Chapter 24 tells of the covenant at Shechem and the death of Joshua.

### Judges (`judges`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-judges/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Judges&oldid=1383106058 .

- Author: Scripture names no author. An older view names Samuel.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-judges/. States: Says no author of the book is named anywhere in Scripture.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJudges%2C_Book_of&oldid=736128. States: Says the author was most probably Samuel, from internal evidence.
- Author, critical scholars: Since about 1950, most scholars see Judges as part of one history from Deuteronomy to Kings. Scholars agree that the editors of that history shaped its repeated pattern of sin, oppression, and rescue.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Judges&oldid=1383106058, section "Composition: The Deuteronomistic History". States: Most scholars since about 1950 treat Deuteronomy to Kings as one work, and see its editors at work in the cycles of Judges. The article cites: Gary Knoppers, Introduction, in Reconsidering Israel and Judah, Eisenbrauns, 2000, p. 1; Gershon Bacon and S. David Sperling, Judges, Book of, Encyclopaedia Judaica, 2nd edition, 2007, p. 562.
- Author, conservative scholars: Conservative scholars note that Scripture names no writer. They hold that the book was probably mostly complete by the reign of King David, 1010 to 970 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-judges/, section "Author and Date". States: No writer is named anywhere in Scripture. The greater part was likely complete by the reign of David, 1010 to 970 BC.
- Written: Most of it was probably written by the time of King David, 1010 to 970 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-judges/. States: Says the bulk of the book was probably done by David's time, 1010 to 970 BC.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJudges%2C_Book_of&oldid=736128. States: Says the book was probably written in the reign of Saul or at the very start of the reign of David.
- What it is: A narrative of Israel after the death of Joshua, when leaders called judges rescued the tribes from enemies. It ends in civil war, in days when Israel had no king.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJudges%2C_Book_of&oldid=736128. States: Says the book tells how men called judges delivered and governed Israel, with an appendix on Dan and on the war against Benjamin.
  - Berean Standard Bible. States: Chapter 1 begins after the death of Joshua. Chapter 21 tells how the tribes found wives for Benjamin after the war. Its last verse says Israel had no king then.

### Ruth (`ruth`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-ruth/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Ruth&oldid=1374486736 .

- Author: The book names no author. An older view, from Jewish tradition, names Samuel.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-ruth/. States: Says no author is named.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FRuth%2C_Book_of&oldid=739870. States: Says the author was probably Samuel, according to Jewish tradition.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Ruth&oldid=1374486736, section "Composition and genre". States: Says the text names no author and that tradition gives it to Samuel. The article cites: Robert L. Hubbard Jr, The Book of Ruth, Eerdmans, 1988, p. 23; Mary Joan Winn Leith, Ruth, in The New Oxford Annotated Bible, 2007, p. 391.
- Written: Some time after David became king, about 1010 BC, since it names David and his family line.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-ruth/. States: Says the book names David and his ancestors at 4:17 to 22, so it was written after he became king, about 1010 BC.
  - Berean Standard Bible. States: Ruth 4:17 to 22 traces the family line from Perez to Obed, Jesse, and David.
- Written, critical scholars: A substantial number of scholars place it under Persian rule, 539 to 332 BC. Its open attitude to foreigners suggests the 5th century BC, when marriage to foreigners was disputed.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Ruth&oldid=1374486736, section "Composition and genre". States: Says the stress on welcoming foreigners points to the 5th century BCE, so a substantial number of scholars date the book to the Persian period, 550 to 330 BCE. The article cites: Mary Joan Winn Leith, Ruth, in The New Oxford Annotated Bible, 2007, p. 391; Lester L. Grabbe, A History of the Jews and Judaism in the Second Temple Period, Volume 1, Continuum, 2004, p. 105.
- Written, conservative scholars: Conservative scholars hold that it was written some time after David became king, about 1010 BC. The book names David and his family line in 4:17 to 22.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-ruth/, section "Author and Date". States: No writer is named. Because the book names David and his family line, 4:17 to 22, it was written after David became king, about 1010 BC.
- What it is: A narrative about the widow Naomi, Ruth from Moab, and Boaz of Bethlehem. It is set when the judges ruled, before about 1050 BC, and ends with the family line of David.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FRuth%2C_Book_of&oldid=739870. States: Says the book tells of Naomi going to Moab and coming back to Bethlehem with Ruth, the marriage of Boaz and Ruth, and the birth of Obed, ancestor of David.
  - Berean Standard Bible. States: Chapter 1 opens when the judges ruled, with Naomi's family in Moab. Chapter 4 tells of Boaz marrying Ruth and ends with the line from Perez to David.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-ruth/. States: The story is set while judges ruled, after Israel conquered Canaan and before about 1050 BC.
- Accepted by Arthur on 2026-11-13, so not on the Not verified list:
  - The ESV GSB gives only a lower limit for the date: after David became king. The Persian date of the critical part is inside that limit. I gave the detail because the article sets the Persian date against the tradition that Samuel wrote it. Arthur decides whether this counts as a dispute.

### 1 Samuel (`1-samuel`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-samuel/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Books_of_Samuel&oldid=1381292867 .

- Author: The author is not known. An older view names Samuel, Gad, and Nathan.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-samuel/. States: Says the author or authors are not known.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FSamuel%2C_Books_of&oldid=14300183. States: Says the authors were probably Samuel, who wrote the first 24 chapters of 1 Samuel, then Gad, then Nathan.
- Written: Probably soon after the end of David's reign, about 970 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-samuel/. States: Says David reigned until 971 BC and the books were probably written shortly after his reign.
- Written, critical scholars: Most scholars see it as part of a history from Deuteronomy to Kings, composed about 630 to 540 BC.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Books_of_Samuel&oldid=1381292867, section "Lead; Composition: Authorship and date of composition". States: Says most scholars accept the Deuteronomistic history in broad outline, dated about 630 to 540 BCE. Also reports serious scholarly opposition to this late compilation. The article cites: David Toshio Tsumura, The First Book of Samuel, Eerdmans, 2007, pp. 15 to 19; Douglas A. Knight, 1995, p. 62; Gwilym H. Jones, 1 and 2 Samuel, Oxford Bible Commentary, 2001, p. 197; John H. Walton, A Survey of the Old Testament, 2009, pp. 258 to 259.
- Written, conservative scholars: Conservative scholars hold that 1 and 2 Samuel were probably written shortly after David's reign ended, about 970 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-samuel/, section "Author and Date". States: The writer or writers are not known. David reigned until 971 BC. The two books probably date from soon after that. No reason is given.
- What it is: A narrative of Israel's move from judges to kings, told through Samuel, Saul, and the young David. It runs from the birth of Samuel to the death of Saul.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FSamuel%2C_Books_of&oldid=14300183. States: Says 1 Samuel covers Eli, Samuel, Saul, and David in exile.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-samuel/. States: Says leadership passes from Eli to Samuel, then to Saul, then to David.
  - Berean Standard Bible. States: Chapter 1 tells of Hannah and the birth of Samuel. Chapter 31 tells of the death of Saul and his sons on Mount Gilboa.
- Decided by Arthur on 2026-11-14:
  - The time of King David ends about 970 BC, as in public/data/periods.json. The Written detail gives about 970 BC. Its source, the ESV Global Study Bible page, gives 971 BC; the record keeps that year.

### 2 Samuel (`2-samuel`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-samuel/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Books_of_Samuel&oldid=1381292867 .

- Author: The author is not known. An older view names Gad and Nathan.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-samuel/. States: Says the author or authors are not known.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FSamuel%2C_Books_of&oldid=14300183. States: Says Gad continued the history begun by Samuel and Nathan completed it.
- Written: Probably soon after the end of David's reign, about 970 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-samuel/. States: Says David reigned until 971 BC and the books were probably written shortly after his reign.
- Written, critical scholars: Most scholars see it as part of a history from Deuteronomy to Kings, composed about 630 to 540 BC.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Books_of_Samuel&oldid=1381292867, section "Lead; Composition: Authorship and date of composition". States: Says most scholars accept the Deuteronomistic history in broad outline, dated about 630 to 540 BCE. Also reports serious scholarly opposition to this late compilation. The article cites: David Toshio Tsumura, The First Book of Samuel, Eerdmans, 2007, pp. 15 to 19; Douglas A. Knight, 1995, p. 62; Gwilym H. Jones, 1 and 2 Samuel, Oxford Bible Commentary, 2001, p. 197; John H. Walton, A Survey of the Old Testament, 2009, pp. 258 to 259.
- Written, conservative scholars: Conservative scholars hold that 1 and 2 Samuel were probably written shortly after David's reign ended, about 970 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-samuel/, section "Author and Date". States: The writer or writers are not known. David reigned until 971 BC. The two books probably date from soon after that. No reason is given.
- What it is: A narrative of the reign of King David, 1010 to 970 BC, over Judah and then all Israel. It opens with David's lament for Saul and Jonathan and closes as a plague on Israel ends.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FSamuel%2C_Books_of&oldid=14300183. States: Says 2 Samuel covers the reign of David over Judah, chapters 1 to 4, and over all Israel, chapters 5 to 24.
  - Berean Standard Bible. States: Chapter 1 has David's lament for Saul and Jonathan. Chapter 24 ends when David builds an altar and the plague on Israel stops.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-judges/, section "Author and Date". States: The years of David's time, 1010 to 970 BC, as public/data/periods.json gives them from the introduction to Judges.
- Decided by Arthur on 2026-11-14:
  - The time of King David ends about 970 BC, as in public/data/periods.json. The Written detail gives about 970 BC. Its source, the ESV Global Study Bible page, gives 971 BC; the record keeps that year.
  - The time of King David ends about 970 BC, as in public/data/periods.json. "What it is" gives the years of the period (Task 4c rule 1).

### 1 Kings (`1-kings`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-kings/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Books_of_Kings&oldid=1383630651 .

- Author: The book does not name its writer. An older view names Ezra as the compiler, and a tradition names Jeremiah.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-kings/. States: Nobody knows who wrote 1 and 2 Kings.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FKings%2C_Books_of&oldid=736129. States: Authorship is uncertain. Some facts lend weight to a tradition that Jeremiah wrote Kings, but Easton thinks it more likely that Ezra compiled the books after the exile.
- Author, critical scholars: The most common view today sees Kings as the close of one long history. Its language and ideas reflect Deuteronomy, and scholars tend to find at least two editions.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Books_of_Kings&oldid=1383630651, section "Composition: Deuteronomistic history". States: Jewish tradition named Jeremiah. The most common view now takes Kings as the end of the Deuteronomistic history. Scholars today tend to see at least two layers in that history. The article cites: Leo G. Perdue, Preface: The Hebrew Bible in Current Research, in The Blackwell Companion to the Hebrew Bible (2001), p. xxvii. Robert R. Wilson, The Former Prophets: Reading the Books of Kings (1995), p. 85.
- Author, conservative scholars: Conservative scholars hold that no one knows who wrote 1 and 2 Kings, or how many writers there were.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-kings/, section "Author and Date". States: No one knows who wrote the two books, or how many hands wrote them.
- Written: By tradition, in the 6th century BC, after Babylon took Jerusalem.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-kings/. States: Says the books answer questions that arose when Babylon took Jerusalem in 586 BC.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FKings%2C_Books_of&oldid=736129. States: Dates the writing between the release of Jehoiachin and the decree of Cyrus, both in the 6th century BC.
- Written, critical scholars: Scholars tend to see a first edition under King Josiah in the late 7th century BC. A final edition followed in the middle of the 6th century BC.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Books_of_Kings&oldid=1383630651, section "Lead, and Composition: Deuteronomistic history". States: Scholars tend to treat Kings as an early edition under Josiah, near the end of the 7th century BC, and a last edition about the middle of the 6th. The article cites: Terence E. Fretheim, First and Second Kings (1997), p. 7. Lester L. Grabbe, 1 and 2 Kings: An Introduction and Study Guide (2016).
- Written, conservative scholars: Conservative scholars see 1 and 2 Kings as written to answer questions raised when Babylon took Jerusalem in 586 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-kings/, section "Purpose, Occasion, and Background". States: No date of writing is given. The page says the two books answer the questions raised when Babylon took Jerusalem in 586 BC.
- What it is: A narrative of Israel and Judah under their kings, from Solomon's anointing to the reign of Ahab's son Ahaziah. It tells of the temple, the split into two kingdoms, and the prophet Elijah.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FKings%2C_Books_of&oldid=736129. States: Says Kings records the history from the accession of Solomon to the fall of the kingdom to Babylon.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-kings/. States: Mentions the split of the kingdom and the chosen city and temple, and cites 1 Kings 17 to 19 for the Lord's control of nature.
  - Berean Standard Bible. States: Chapter 1 tells how David has Solomon anointed king. Chapter 22 tells of the death of Ahab and says his son Ahaziah became king of Israel.
- Accepted by Arthur on 2026-11-13, so not on the Not verified list:
  - The 6th century BC in the Written fact rests on Easton's date, 561 to 538 BC. The same Easton entry calls it more probable that Ezra compiled Kings after the Captivity, which would be later. The ESV GSB says only that the books answer questions raised when Babylon took Jerusalem.

### 2 Kings (`2-kings`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-kings/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Books_of_Kings&oldid=1383630651 .

- Author: The book does not name its writer. An older view names Ezra as the compiler, and a tradition names Jeremiah.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-kings/. States: Nobody knows who wrote 1 and 2 Kings.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FKings%2C_Books_of&oldid=736129. States: Authorship is uncertain. Some facts lend weight to a tradition that Jeremiah wrote Kings, but Easton thinks it more likely that Ezra compiled the books after the exile.
- Author, critical scholars: The most common view today sees Kings as the close of one long history. Its language and ideas reflect Deuteronomy, and scholars tend to find at least two editions.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Books_of_Kings&oldid=1383630651, section "Composition: Deuteronomistic history". States: Jewish tradition named Jeremiah. The most common view now takes Kings as the end of the Deuteronomistic history. Scholars today tend to see at least two layers in that history. The article cites: Leo G. Perdue, Preface: The Hebrew Bible in Current Research, in The Blackwell Companion to the Hebrew Bible (2001), p. xxvii. Robert R. Wilson, The Former Prophets: Reading the Books of Kings (1995), p. 85.
- Author, conservative scholars: Conservative scholars hold that no one knows who wrote 1 and 2 Kings, or how many writers there were.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-kings/, section "Author and Date". States: No one knows who wrote the two books, or how many hands wrote them.
- Written: By tradition, the 6th century BC. That is after King Jehoiachin was freed and before Cyrus let the captives in Babylon go home in 538 BC.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FKings%2C_Books_of&oldid=736129. States: Composed between 561 BC, when Jehoiachin was released, the last event in the book, and 538 BC, when Cyrus issued his decree. That falls in the 6th century BC.
- Written, critical scholars: Scholars tend to see a first edition under King Josiah in the late 7th century BC. A final edition followed in the middle of the 6th century BC.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Books_of_Kings&oldid=1383630651, section "Lead, and Composition: Deuteronomistic history". States: Scholars tend to treat Kings as an early edition under Josiah, near the end of the 7th century BC, and a last edition about the middle of the 6th. The article cites: Terence E. Fretheim, First and Second Kings (1997), p. 7. Lester L. Grabbe, 1 and 2 Kings: An Introduction and Study Guide (2016).
- Written, conservative scholars: Conservative scholars see 1 and 2 Kings as written to answer questions raised when Babylon took Jerusalem in 586 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-kings/, section "Purpose, Occasion, and Background". States: No date of writing is given. The page says the two books answer the questions raised when Babylon took Jerusalem in 586 BC.
- What it is: A history of the kings who ruled Israel and Judah after Ahab died, up to the fall of Jerusalem. It ends with King Jehoiachin freed from prison in Babylon.
  - Berean Standard Bible. States: 2 Kings 1:1 opens after Ahab died. 2 Kings 25:9 tells of Jerusalem burned. 2 Kings 25:27 tells of Jehoiachin set free from prison.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-kings/. States: 2 Kings covers Israel and Judah from Ahab's death until both kingdoms went into exile.
- Accepted by Arthur on 2026-11-13, so not on the Not verified list:
  - The 6th century BC in the Written fact rests on Easton's date, 561 to 538 BC. The same Easton entry calls it more probable that Ezra compiled Kings after the Captivity, which would be later. The ESV GSB says only that the books answer questions raised when Babylon took Jerusalem.

### 1 Chronicles (`1-chronicles`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-chronicles/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Books_of_Chronicles&oldid=1385511143 .

- Author: The book does not name its writer, a priest or Levite, a helper of the priests in the temple. An older view names Ezra.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-chronicles/. States: The text does not name its author. Tradition calls him the Chronicler. He was a priest or a Levite serving at the temple in the Persian period.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FChronicles%2C_Books_of&oldid=734537. States: Jewish tradition, accepted everywhere until the middle of the 17th century, names Ezra as the author. Easton agrees.
  - Berean Standard Bible. States: 1 Chronicles 23:28: the duty of the Levites was to assist the descendants of Aaron in the service of the house of the LORD.
  - Berean Standard Bible. States: 1 Chronicles 24:1 to 24:2: the sons of Aaron served as priests.
- Author, critical scholars: Many now think it unlikely that the writer of Chronicles also wrote the story parts of Ezra and Nehemiah.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Books_of_Chronicles&oldid=1385511143, section "Composition: Origins". States: Since the late 20th century, many regard it as improbable that one writer produced both Chronicles and the narrative of Ezra and Nehemiah. The article cites: Pancratius C. Beentjes, Tradition and Transformation in the Book of Chronicles (2008), p. 3.
- Author, conservative scholars: Conservative scholars hold that the writer was a priest or a Levite, a helper of the priests in the temple. Known as the Chronicler, he was a trained scribe who could use the temple records.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-chronicles/, section "Author and Date". States: Unnamed writer, called the Chronicler: a priest or Levite who served the temple under Persian rule, trained as a scribe, able to use the temple records.
  - Berean Standard Bible. States: 1 Chronicles 23:28: the Levites assist the descendants of Aaron with the temple service. 1 Chronicles 24:1 to 24:2: the sons of Aaron served as priests.
- Written: In the Persian period, 539 to 332 BC, after the Jews came back from Babylon. An older view gives the 5th century BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-chronicles/. States: The Chronicler served in the Persian period, 539 to 332 BC, after Judah and Benjamin had come back from the exile in Babylon.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FChronicles%2C_Books_of&oldid=734537. States: Composed after the exile, probably between 450 and 435 BC. That falls in the 5th century BC.
- Written, critical scholars: Critics suggest a date probably between about 400 and 250 BC, with 350 to 300 BC the most likely.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Books_of_Chronicles&oldid=1385511143, section "Composition: Origins". States: These critics put the writing probably between 400 and 250 BC, and most likely between 350 and 300 BC. The article cites: Steven L. McKenzie, 1 and 2 Chronicles (2004).
- Written, conservative scholars: Conservative scholars hold that the writer served in the temple under Persian rule, 539 to 332 BC. He wrote for the Jews who had come back from Babylon and rebuilt the temple.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-chronicles/, section "Author and Date; Purpose, Occasion, and Background". States: The writer was a priest or Levite in temple service in the Persian period, 539 to 332 BC. He wrote for the returned Jews to renew them.
- What it is: Family lists from Adam to Israel's tribes, then the reign of King David, 1010 to 970 BC. It was written for the Jews who came back from captivity in Babylon, 586 to 538 BC.
  - Berean Standard Bible. States: 1 Chronicles 1:1 starts the family lists with Adam. Chapter 10 starts with the death of Saul. 1 Chronicles 29:28 tells of David's death and Solomon's reign.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FChronicles%2C_Books_of&oldid=734537. States: Chapters 1 to 9 of the first book are mostly genealogies down to David. The rest of the first book is the history of David's reign.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-chronicles/. States: The Chronicler wrote for Judah and Benjamin after they had come back from Babylon. The captivity in Babylon lasted from 586 to 538 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-judges/, section "Author and Date". States: The years of David's time, 1010 to 970 BC, as public/data/periods.json gives them from the introduction to Judges.
- Accepted by Arthur on 2026-11-13, so not on the Not verified list:
  - 1 and 2 Chronicles, author: the Wikipedia article also says that many scholars still support Ezra as author, but it marks that sentence citation needed. The sentence has no citation, so the critical part does not report it.

### 2 Chronicles (`2-chronicles`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-chronicles/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Books_of_Chronicles&oldid=1385511143 .

- Author: The book does not name its writer, a priest or Levite, a helper of the priests in the temple. An older view names Ezra.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-chronicles/. States: The text does not name its author. Tradition calls him the Chronicler. He was a priest or a Levite serving at the temple in the Persian period.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FChronicles%2C_Books_of&oldid=734537. States: Jewish tradition, accepted everywhere until the middle of the 17th century, names Ezra as the author. Easton agrees.
  - Berean Standard Bible. States: 1 Chronicles 23:28: the duty of the Levites was to assist the descendants of Aaron in the service of the house of the LORD.
  - Berean Standard Bible. States: 1 Chronicles 24:1 to 24:2: the sons of Aaron served as priests.
- Author, critical scholars: Many now think it unlikely that the writer of Chronicles also wrote the story parts of Ezra and Nehemiah.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Books_of_Chronicles&oldid=1385511143, section "Composition: Origins". States: Since the late 20th century, many regard it as improbable that one writer produced both Chronicles and the narrative of Ezra and Nehemiah. The article cites: Pancratius C. Beentjes, Tradition and Transformation in the Book of Chronicles (2008), p. 3.
- Author, conservative scholars: Conservative scholars hold that the writer was a priest or a Levite, a helper of the priests in the temple. Known as the Chronicler, he was a trained scribe who could use the temple records.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-chronicles/, section "Author and Date". States: Unnamed writer, called the Chronicler: a priest or Levite who served the temple under Persian rule, trained as a scribe, able to use the temple records.
  - Berean Standard Bible. States: 1 Chronicles 23:28: the Levites assist the descendants of Aaron with the temple service. 1 Chronicles 24:1 to 24:2: the sons of Aaron served as priests.
- Written: In the Persian period, 539 to 332 BC, after the Jews came back from Babylon. An older view gives the 5th century BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-chronicles/. States: The Chronicler served in the Persian period, 539 to 332 BC, after Judah and Benjamin had come back from the exile in Babylon.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FChronicles%2C_Books_of&oldid=734537. States: Composed after the exile, probably between 450 and 435 BC. That falls in the 5th century BC.
- Written, critical scholars: Critics suggest a date probably between about 400 and 250 BC, with 350 to 300 BC the most likely.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Books_of_Chronicles&oldid=1385511143, section "Composition: Origins". States: These critics put the writing probably between 400 and 250 BC, and most likely between 350 and 300 BC. The article cites: Steven L. McKenzie, 1 and 2 Chronicles (2004).
- Written, conservative scholars: Conservative scholars hold that the writer served in the temple under Persian rule, 539 to 332 BC. He wrote for the Jews who had come back from Babylon and rebuilt the temple.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-chronicles/, section "Author and Date; Purpose, Occasion, and Background". States: The writer was a priest or Levite in temple service in the Persian period, 539 to 332 BC. He wrote for the returned Jews to renew them.
- What it is: A history of King Solomon and the kings of Judah, up to the fall of Jerusalem. It ends as Cyrus king of Persia lets the captives in Babylon go back to build the temple.
  - Berean Standard Bible. States: 2 Chronicles 1:1 begins with Solomon secure as king. 2 Chronicles 36:19 tells of Jerusalem burned. 2 Chronicles 36:23 gives the decree of Cyrus.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FChronicles%2C_Books_of&oldid=734537. States: Chapters 1 to 9 of the second book tell of Solomon's reign. The rest tells of the kingdom of Judah up to the return from exile.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-2-chronicles/. States: The decree of Cyrus, 538 BC, at 2 Chronicles 36:22 to 36:23, ends the captivity in Babylon, which began in 586 BC.
- Accepted by Arthur on 2026-11-13, so not on the Not verified list:
  - 1 and 2 Chronicles, author: the Wikipedia article also says that many scholars still support Ezra as author, but it marks that sentence citation needed. The sentence has no citation, so the critical part does not report it.

### Ezra (`ezra`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-ezra/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Ezra&oldid=1368563443 .

- Author: The book does not name its writer, but Ezra wrote the part told in the first person. Either Ezra or a later writer may have put the parts together.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-ezra/. States: The book never states who wrote it. The first person section, 7:27 to 9:15, is by Ezra. He or some later historian may have added other parts.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FEzra%2C_Book_of&oldid=735496. States: Ezra probably wrote the book, or at least most of it.
- Author, critical scholars: Most scholars are now wary of treating Ezra, Nehemiah, and Chronicles as one unified work with a single viewpoint. Each is increasingly seen as the result of many stages of editing.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Ezra&oldid=1368563443, section "Date, structure and composition: Composition". States: Recognition is growing that Ezra, Nehemiah, and Chronicles passed through many stages of editing. Most scholars are now cautious about treating them as one unified composition. The article cites: Juha Pakkala, Ezra the Scribe: The Development of Ezra 7 to 10 and Nehemiah 8 (2004), p. 16. Lester L. Grabbe, A History of the Jews and Judaism in the Second Temple Period, volume 1 (2004), p. 71.
- Author, conservative scholars: The first person part, 7:27 to 9:15, comes from Ezra himself. Many scholars hold that one writer produced Ezra, Nehemiah, and 1 and 2 Chronicles.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-ezra/. States: Ezra 7:27 to 9:15 is in the first person, so it comes from Ezra. Many scholars think one author wrote Ezra, Nehemiah, and both books of Chronicles.
- Written: The date of writing is not known. The events in the book end in the 5th century BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-ezra/. States: The contents make the date of writing hard to fix. Ezra 1 to 6 covers 538 to 515 BC, and Ezra 7 to Nehemiah 13 covers 458 to 433 BC.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FEzra%2C_Book_of&oldid=735496. States: Gives no date of writing. The events run from the decree of Cyrus to the reform under Ezra, which Easton puts in the 5th century BC.
- What it is: A history of the Jews who returned from the captivity in Babylon, 586 to 538 BC, and rebuilt the temple. Then Ezra the scribe leads more home and deals with marriages to foreign women.
  - Berean Standard Bible. States: Ezra 1:3 lets the people go to Jerusalem to build the temple. Ezra 7:6 tells that Ezra the scribe came from Babylon. Ezra 10 treats foreign wives.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FEzra%2C_Book_of&oldid=735496. States: Chapters 1 to 6 tell of the first return and the new temple. Chapters 7 to 10 tell of the second return, under Ezra, and what followed in Jerusalem.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-ezra/. States: Ezra 1 to 6 covers 538 to 515 BC, from the first return to the finished temple.
- Accepted by Arthur on 2026-11-13, so not on the Not verified list:
  - Ezra, written: neither Easton nor the ESV Global Study Bible states a traditional date of writing. The cover says only that the date is not known and that the events end in the 5th century BC.

### Nehemiah (`nehemiah`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-nehemiah/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Nehemiah&oldid=1382984300 .

- Author: The book uses Nehemiah's own records, but he did not write all of it. An older view names Nehemiah as the author of nearly all of it.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-nehemiah/. States: Some of Nehemiah's own records are in the book, but he did not write the whole of it.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FNehemiah%2C_Book_of&oldid=759893. States: Nehemiah wrote the book and answers for all of it except three verses in chapter 12, though Ezra may have written the third person parts.
- Author, critical scholars: Whether Nehemiah's account in his own voice is genuine is now very controversial. Minimalists, scholars who accept little of the story as history, doubt that he existed.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Nehemiah&oldid=1382984300, section "Lead". States: In biblical scholarship the historicity of Nehemiah and his memoir has become very controversial. Minimalists doubt he existed and treat the memoir as a later fictional account. The article cites: Christian Frevel, History of Ancient Israel (2023), p. 262.
- Author, conservative scholars: Conservative scholars hold that the book uses some of Nehemiah's own records, but he did not write all of it. The same writer probably wrote parts of Ezra also.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-nehemiah/, section "Author and Date". States: Nehemiah is the main figure. The book includes records that he made himself. He is not its sole writer. One writer probably wrote Nehemiah and parts of Ezra.
- Written: By tradition, the 5th century BC, probably after Nehemiah's second visit to Jerusalem.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FNehemiah%2C_Book_of&oldid=759893. States: Probably written about 431 to 430 BC, after Nehemiah had come back to Jerusalem a second time from Persia. That falls in the 5th century BC.
- Written, critical scholars: Ezra and Nehemiah as one book may have had a first edition early in the 4th century BC.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Nehemiah&oldid=1382984300, section "Composition and date". States: The combined work of Ezra and Nehemiah may have had its first edition early in the 4th century BC. The article cites: William Sanford La Sor, David Allan Hubbard, and Frederic William Bush, Old Testament Survey (1996), p. 551.
- Written, conservative scholars: none. The page gives the dates of Nehemiah's visits, 445 BC and between 433 and 423 BC, but no date of writing.
- What it is: Much of the book is in Nehemiah's own voice. He rebuilds the wall of Jerusalem after he arrives in 445 BC, then reforms the temple, the Sabbath, and marriage.
  - Berean Standard Bible. States: Nehemiah 1:3 reports the wall of Jerusalem in ruins. Chapter 13 tells of temple rooms made clean, Sabbath trade stopped, and foreign marriages rebuked.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FNehemiah%2C_Book_of&oldid=759893. States: Chapters 1 to 7 tell of the rebuilding of the wall. The book ends with the dedication of the wall and the reforms of Nehemiah.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-nehemiah/. States: Nehemiah reached Jerusalem in 445 BC, 13 years after Ezra, and rebuilt the city walls.

### Esther (`esther`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-esther/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Esther&oldid=1383126666 .

- Author: The book does not name its writer. The writer may have been someone like Mordecai, able to use court records.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-esther/. States: Esther is anonymous. Its author might have been a person such as Mordecai, who could reach historical records and cared about Jewish affairs.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FEsther%2C_Book_of&oldid=735489. States: The author is unknown. The close detail makes it likely that the writer lived at the time of Mordecai and Esther.
- Written: By tradition, probably the 5th century BC, after the death of King Xerxes.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FEsther%2C_Book_of&oldid=735489. States: Written after Xerxes died in 465 BC, probably about 444 to 434 BC. That falls in the 5th century BC.
- Written, critical scholars: The usual date for the book is the 4th century BC.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Esther&oldid=1383126666, section "Versions and canonization". States: The book is normally given a date in the 4th century BC. The article cites: Adele Berlin, Marc Zvi Brettler, and Michael Fishbane, editors, The Jewish Study Bible (2004).
- Written, conservative scholars: none. The page sets the story under Xerxes I, 486 to 464 BC, and says the writer may have been someone like Mordecai, but it gives no date of writing.
- What it is: A story set at Susa in the reign of King Xerxes of Persia. Esther, a Jewish queen, stops a plan by Haman to destroy the Jews, and the feast of Purim begins.
  - Berean Standard Bible. States: Esther 1:2 sets the story under Xerxes at Susa. Esther 3:6 tells that Haman sought to destroy the Jews. Esther 9:26 names the days Purim.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-esther/. States: A Jewish girl became the Persian queen and rescued her people. The book explains how the Feast of Purim began.

### Job (`job`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-job/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Job&oldid=1385369652 .

- Author: The book does not name its writer, who was an Israelite. An older view names Moses as perhaps the most likely writer.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-job/. States: An Israelite whose name is not known wrote the book.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJob%2C_Book_of&oldid=7352541. States: Views differ widely. Some name Job, Elihu, or Isaiah, and Moses is perhaps more probable, but the authorship is wholly uncertain.
- Author, critical scholars: It is widely held that a different writer added the speeches of Elihu later, because their style differs. Recent work leans more toward reading the book as one edited whole.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Job&oldid=1385369652, section "Composition: Authorship, language, texts. Structure". States: Elihu's speeches differ in style, and many widely believe another author added them later. Recent trends stress the underlying editorial unity of the book. The article cites: Encyclopaedia Britannica, Elihu (2009). Robert Alter, The Hebrew Bible: A Translation with Commentary, volume 3 (2018). J. H. Walton, Job 1: Book of, in Dictionary of the Old Testament: Wisdom, Poetry and Writings (2008), p. 343.
- Author, conservative scholars: Conservative scholars hold that the writer was an Israelite whose name is not known. In the book, Job knows the LORD, fears God, and lives as the wisdom books of Israel teach.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-job/, section "Author and Date". States: An unknown Israelite wrote it. He shows Job in Uz, clearly knowing the LORD, with a devotion to God that fits Israelite ideals of wisdom.
  - Berean Standard Bible. States: Job 1:1: Job was blameless and upright, fearing God and shunning evil. Job 1:21: Job blesses the name of the LORD.
- Written: The date is not certain, and the story seems set in the age of Abraham, Isaac, and Jacob. An older view gives the time of Moses or of David and Solomon.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-job/. States: Gives no date of writing. Job lives in Uz, and the events appear to be set in the time of Abraham, Isaac, and Jacob.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJob%2C_Book_of&oldid=7352541. States: Some put the book in the time of David and Solomon. Others give it to Moses. It was known in the days of Ezekiel.
- Written, critical scholars: Its Hebrew is from after the captivity in Babylon, 586 to 538 BC, with words and forms from Aramaic. Aramaic grew into a main language under Persian rule, 539 to 332 BC, which points to that time.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Job&oldid=1385369652, section "Lead, and Composition: Authorship, language, texts". States: Hebrew of the time after the Babylonian exile, with Aramaic influence, shows that the book was composed in the Persian period, 540 to 330 BC. The article cites: Edward L. Greenstein, Job: A New Translation (2019), p. xxvii.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Job&oldid=1385369652, section "Composition, the quotation in the Greenstein citation". States: The quotation adds the many Aramaic words and grammar forms, and says Aramaic became a main language of the region only under Persian rule. The article cites: Edward L. Greenstein, Job: A New Translation (2019), p. xxvii.
- Written, conservative scholars: none. The page says the author is an unknown Israelite and the events seem set in the time of the patriarchs. It gives no date for the writing.
- What it is: A long poem in dialogue, set between a prose opening and close. Job, a righteous man who loses his children and wealth, argues with three friends, and then God answers him.
  - Berean Standard Bible. States: Job 1:1 introduces a blameless man in Uz. Job 1:19 tells of his children killed. Job 2:11 brings three friends. At 38:1 the LORD answers him.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJob%2C_Book_of&oldid=7352541. States: A prose opening in chapters 1 and 2, a debate in poetry from chapter 3 to 42:6, and a prose close.
- Decided by Arthur on 2026-11-14:
  - The time of a person is not a period and needs no years, unless the table of periods has an entry for it. The Written fact names "the time of Moses or of David and Solomon" without years.

### Psalms (`psalms`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-the-psalms/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Psalms&oldid=1384360902 .

- Author: The psalms have many writers. David wrote about half, and others are linked to Asaph, the sons of Korah, Solomon, and Moses.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-the-psalms/. States: David wrote about half the psalms. The outline links others to the sons of Korah, Asaph, Solomon, and Moses, who is named for Psalm 90.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FPsalms&oldid=759929. States: Many poets wrote the psalms. The titles give 73 to David, and about two thirds have been ascribed to him. Psalm 90 is ascribed to Moses.
- Author, critical scholars: Modern scholars do not accept as history that David wrote the psalms. They see the names as a way to tie the writings to famous figures.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Psalms&oldid=1384360902, section "Lead". States: Modern scholars do not treat David's authorship as historical. They view the attribution as a way to connect the writings with famous people. The article cites: Adele Berlin and Marc Zvi Brettler, Psalms, in The Jewish Study Bible (2004), p. 1282.
- Author, conservative scholars: Conservative scholars hold that about half of the psalms come from David himself. They also link psalms to Asaph, the sons of Korah, Solomon, and Moses.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-the-psalms/, section "Author and Date; Structure". States: Half of the psalms are by David. It names a psalm of Solomon, Psalm 90 by Moses, and groups by Asaph and the sons of Korah.
- Written: By tradition, over many centuries, from the time of Moses to the time of Ezra.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FPsalms&oldid=759929. States: No psalm can be shown to be later than Ezra and Nehemiah, so the collection covers about 1,000 years. Psalm 90 is ascribed to Moses.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-the-psalms/. States: The psalms come from many periods of the history of Israel. The outline names Moses for Psalm 90.
- Written, critical scholars: The psalms were written over at least five centuries, from the 10th to the 5th century BC or later. Scholars of the Septuagint, the early Greek translation, argue that the collection stayed open until the 1st century AD.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Psalms&oldid=1384360902, section "Composition: Origins, and Lead". States: Psalm 29 is from the 10th century BC, and others come after the exile, five centuries or more. Septuagint scholars argue the Psalter was open until the 1st century AD. The article cites: John S. Kselman, Psalms, in The New Oxford Annotated Bible (2007), p. 775. Eugene Ulrich, Qumran Cave 4: XI: Psalms to Chronicles (2000). Gerald Wilson, in The Book of Psalms: Composition and Reception (2005), p. 394.
- Written, conservative scholars: Conservative scholars hold that the psalms come from many periods of Israel's history. The heading of Psalm 90 names Moses, long before David.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-the-psalms/, section "Author and Date; Structure". States: Single psalms come from many periods of Israel's history. Psalm 90 is credited to Moses. It gives no end date and does not name Ezra.
- What it is: A collection of 150 songs and prayers in five books, with praise, laments, and thanks. Israel sang them in worship.
  - Berean Standard Bible. States: The book has 150 psalms. Psalm 41:13 closes the first book with a blessing. Psalm 150:6 calls everything that has breath to praise the LORD.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FPsalms&oldid=759929. States: The Psalter has five books, and each ends with a doxology. Some psalms were given to choirs to sing in worship.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-the-psalms/. States: The psalms were the songbook of God's people. Their types include laments, hymns of praise, and hymns of thanks.

### Proverbs (`proverbs`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-proverbs/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Proverbs&oldid=1383125765 .

- Author: Solomon wrote or collected much of it, by the book's own account. It also has sayings of the wise and of Agur and Lemuel.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-proverbs/. States: The book names Solomon as author or collector. It also holds two groups of sayings of the wise and oracles from Agur and Lemuel.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FProverbs%2C_Book_of&oldid=759934. States: Solomon probably gathered older proverbs and made new ones. The men of Hezekiah collected chapters 25 to 29. Chapters 30 and 31 add the words of Agur and Lemuel.
- Author, critical scholars: The heading Proverbs of Solomon comes at 1:1, 10:1, and 25:1. It sorts the material into groups rather than naming an author.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Proverbs&oldid=1383125765, section "Composition". States: The phrase Proverbs of Solomon at 1:1, 10:1, and 25:1 shows that the aim was to group the content, not to name the author. The article cites: Kathleen A. Farmer, Who Knows What Is Good? A Commentary on the Books of Proverbs and Ecclesiastes (1991), p. 25.
- Author, conservative scholars: The book itself names Solomon as author or collector at 1:1 and 10:1. At 25:1 it says that the men of Hezekiah copied more of his proverbs.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-proverbs/. States: The text itself, at 1:1 and 10:1, names Solomon as author or collector, and that includes the proverbs that the men of Hezekiah copied, at 25:1.
- Written: Begun under Solomon in the 10th century BC, and probably complete in its present form under Hezekiah, about 700 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-proverbs/. States: The work began under Solomon, who reigned about 971 to 931 BC. It probably reached its present form under Hezekiah, who reigned about 715 to 686 BC.
- Written, critical scholars: Some argue that the sections differ in date, and chapters 1 to 9 and 30 to 31 are the latest. They put the final editing late in Persian rule, 539 to 332 BC, or under Greek rule, from 332 BC.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Proverbs&oldid=1383125765, section "Lead". States: Some scholars hold that the sections are from different periods. Chapters 1 to 9 and 30 to 31 are the latest, and the final editing is late Persian or Hellenistic. The article cites: Christl Maier, Die fremde Frau in Proverbien 1 bis 9 (1995). Christine Roy Yoder, Proverbs (2009), pp. xxiii to xxiv. James Alfred Loader, Proverbs 1 to 9 (2014), p. 9.
- Written, conservative scholars: Conservative scholars hold that Proverbs was begun under Solomon, about 971 to 931 BC, as the book itself says. It probably reached its present form under Hezekiah, whose men copied more proverbs.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-proverbs/, section "Author and Date". States: Begun under Solomon, as 1:1, 10:1, and 25:1 show, and probably complete only under Hezekiah, 715 to 686 BC.
- What it is: Short wise sayings and longer poems that teach the way of wisdom. Much is addressed to a son, and it ends with a poem about a wife of noble character.
  - Berean Standard Bible. States: Proverbs 1:2 gives the aim, to gain wisdom. Proverbs 1:8 speaks to my son. Proverbs 31:10 begins the poem on a wife of noble character.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-proverbs/. States: The book speaks to a young man. Chapters 1 to 9 are wisdom poems, and the short sayings start at 10:1.

### Ecclesiastes (`ecclesiastes`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-ecclesiastes/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Ecclesiastes&oldid=1383994169 .

- Author: The writer calls himself the Teacher, son of David and king in Jerusalem, but gives no name. Tradition names Solomon.
  - Berean Standard Bible. States: Ecclesiastes 1:1 gives the words of the Teacher, the son of David and king in Jerusalem. Ecclesiastes 1:12: the Teacher was king over Israel.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FEcclesiastes&oldid=735483. States: The old and traditional view gives the book to Solomon. The writer presents himself as Solomon without the name, at 1:12.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-ecclesiastes/. States: The writer calls himself the Preacher. Some interpreters conclude that he was Solomon.
- Author, critical scholars: Critical scholars have long rejected any date before the captivity in Babylon, 586 to 538 BC. Words borrowed from Persian and Aramaic point to no earlier than about 450 BC, long after Solomon.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Ecclesiastes&oldid=1383994169, section "Lead, and Composition: Title, date and author". States: Rabbinic tradition gives the book to Solomon, but critical scholars long ago rejected an origin before the exile. Persian and Aramaic words point no earlier than about 450 BC. The article cites: Michael V. Fox, The JPS Bible Commentary: Ecclesiastes (2004), p. x. Craig G. Bartholomew, Ecclesiastes (2009), pp. 50 to 52. C. L. Seow, Ecclesiastes, in The New Oxford Annotated Bible, 3rd edition (2007), p. 944.
- Author, conservative scholars: none. The ESV Global Study Bible page gives both views, Solomon or a later writer who speaks as Solomon, and chooses neither. So it does not hold the traditional view.
- Written: By tradition, in the time of Solomon.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FEcclesiastes&oldid=735483. States: The traditional view gives the book to Solomon, and Easton holds that view.
- Written, critical scholars: Critical scholars date it between about 450 BC and 180 BC, the year Ben Sira, a Jewish writer, quotes it. They differ over whether it shows Greek thought, which would point to Greek rule, from 332 BC.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Ecclesiastes&oldid=1383994169, section "Composition: Title, date and author". States: The earliest date is about 450 BC and the latest 180 BC, when Ben Sira quotes it. Scholars differ on Persian or Hellenistic, by the Greek influence they see. The article cites: C. L. Seow, Ecclesiastes, in The New Oxford Annotated Bible, 3rd edition (2007), p. 944. Michael V. Fox, The JPS Bible Commentary: Ecclesiastes (2004), p. xiv. Craig G. Bartholomew, Ecclesiastes (2009), pp. 54 to 55.
- Written, conservative scholars: none. The page does not hold the traditional view. It gives both views, Solomon or a later writer who speaks as Solomon, and chooses neither.
- What it is: A book in which the Teacher, a king in Jerusalem, searches for meaning and finds everything futile. It closes by telling the reader to fear God and obey his commands.
  - Berean Standard Bible. States: Ecclesiastes 1:2: everything is futile. Ecclesiastes 1:12: the Teacher was king in Jerusalem. Ecclesiastes 12:13: the BSB quotes the verse as Fear God and keep His commandments.

### Song of Solomon (`song-of-solomon`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-the-song-of-solomon/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Song_of_Songs&oldid=1382222334 .

- Author: Solomon was probably not the writer, and the song may have been made in his honor. An older view names Solomon as the author.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-the-song-of-solomon/. States: The first verse does not prove that Solomon was the author. He may have been, or the book may honor him, but what is known of him suggests not.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FSolomon%2C_Song_of&oldid=739885. States: The traditional view is that Solomon wrote it. Others have questioned this, but Easton holds that the evidence supports it.
  - Berean Standard Bible. States: Song of Solomon 1:1 reads: This is Solomon's Song of Songs.
- Written: Probably in the time of Solomon, perhaps under his oversight, in the 10th century BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-the-song-of-solomon/. States: Probably composed in Solomon's day, perhaps under his oversight, about 960 to 931 BC. That falls in the 10th century BC.
- Written, critical scholars: Most scholars since the 1800s place the song in the 3rd century BC, chiefly because of its language. Others doubt that the language requires a date after the return from Babylon, late in the 6th century BC.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Song_of_Songs&oldid=1382222334, section "Composition". States: Since the 19th century, most place the Song in the 3rd century BC. Others doubt its language demands a date after the exile, which ended in the late 6th century. The article cites: Torleif Elgvin, The Song of Songs in Its Context (2020), p. 71. Ariel Bloch and Chana Bloch, The Song of Songs (1995), p. 23. J. Cheryl Exum, Unity, Date, Authorship and the Wisdom of the Song of Songs (2016), p. 57.
- Written, conservative scholars: Conservative scholars think that the song was probably written while Solomon was king, and he may have overseen it. These scholars give about 960 to 931 BC as the probable years of the writing.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-the-song-of-solomon/, section "Author and Date". States: Solomon probably did not write it himself, but it was probably composed in Solomon's day, possibly overseen by him, about 960 to 931 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-proverbs/, section "Author and Date". States: Solomon reigned about 971 to 931 BC.
- What it is: Love poems, spoken in turn by a young woman and the man she loves. The daughters of Jerusalem listen, and she warns them not to stir up love too soon.
  - Berean Standard Bible. States: Song of Solomon 1:2 to 1:8 give words of a woman and her beloved. At 2:7 she charges the daughters of Jerusalem to wait for love.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-the-song-of-solomon/. States: Love poetry in which a young woman and a young man speak in turn, with others joining in like a chorus.
- Decided by Arthur on 2026-11-14:
  - Arthur asked on 2026-11-14 that the years of writing not read as the years of Solomon's reign. The time of a person is not a period and needs no years, unless the table of periods has an entry for it. The time of Solomon has no entry, so the site gives no years for his reign here.

### Isaiah (`isaiah`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-isaiah/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Isaiah&oldid=1385341420 .

- Author: Isaiah son of Amoz, by tradition.
  - Berean Standard Bible. States: Isaiah 1:1 calls the book the vision that Isaiah son of Amoz saw under four kings of Judah.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FIsaiah%2C_Book_of&oldid=735519. States: Tradition has always given the whole book to one writer, the prophet named in its title. The Isaiah entry names his father as Amoz.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-isaiah/. States: Under Author and Date it names only Isaiah, called about 740 BC.
- Author, critical scholars: Scholars widely accept that the prophet Isaiah did not write the whole book. Few scholars today credit one person with all of it, or even most of it.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Isaiah&oldid=1385341420, section "Composition: Authorship". States: Wide agreement that the 8th century prophet is the root of the book, and wide agreement that he did not write all of it. The article cites: Walter Brueggemann, An Introduction to the Old Testament, 2003; Jake Stromberg, An Introduction to the Study of Isaiah, 2011.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Isaiah&oldid=1385341420, section "Lead". States: Few scholars now give the entire book, or most of it, to a single person. The article cites: David L. Petersen, The Prophetic Literature: An Introduction, 2002.
- Author, conservative scholars: Conservative scholars treat the prophet Isaiah as the writer, from about 740 BC until after 681 BC. They read chapters 40 to 55 as his prophecies for the captivity in Babylon, 586 to 538 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-isaiah/, section "Author and Date; Simplified Overview of Isaiah". States: Isaiah was called about 740 BC and lived to see Sennacherib die in 681 BC. A table calls chapters 40 to 55 prophecies for the 500s BC.
- Written: By tradition, the late 8th and early 7th centuries BC. Isaiah was called about 740 BC and outlived the Assyrian king Sennacherib.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-isaiah/. States: Isaiah was called about 740 BC. He recorded the death of Sennacherib, which the page dates to 681 BC.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FIsaiah&oldid=735521. States: Isaiah served under Uzziah, Jotham, Ahaz, and Hezekiah, and probably lived past Hezekiah into the reign of Manasseh.
- Written, critical scholars: Much of the book shows signs of writing after Babylon took Judah's leaders captive in 586 BC, or later still. For most of the 20th century, scholars agreed that chapters 40 to 55 date from that captivity.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Isaiah&oldid=1385341420, section "Lead". States: Evidence shows that a large part of the book was composed in the Babylonian captivity and afterward. The article cites: Marvin A. Sweeney, The Latter Prophets, in The Hebrew Bible Today, 1998.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Isaiah&oldid=1385341420, section "Historical context". States: Babylon conquered Jerusalem and took its elite into exile in 586 BC. The article cites: Margaret Barker, Eerdmans Commentary on the Bible, 2003.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Isaiah&oldid=1385341420, section "Lead; Structure". States: For most of the last century the agreed view saw three collections, with chapters 40 to 55 from an anonymous writer in the exile. The article cites: David L. Petersen, The Prophetic Literature, 2002; Marvin A. Sweeney, 1998; Niels Peter Lemche, 2008.
- Written, conservative scholars: Conservative scholars read chapters 40 to 55 as prophecies for the 500s BC, when God's people were captives in Babylon.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-isaiah/. States: Its overview table labels chapters 40 to 55 as prophecies for the 500s BC, when God's people were defeated and in exile in Babylon.
- What it is: Prophecy about judgment and comfort for Judah and Jerusalem. It speaks of the Assyrian threat, the people taken captive to Babylon, and their return home.
  - Berean Standard Bible. States: 1:1 names Judah and Jerusalem. 39:6 foretells goods taken to Babylon. 48:20 says leave Babylon. 66:13 speaks of comfort, and 66:15 of judgment by fire.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-isaiah/. States: The overview links chapters 1 to 39 with the Assyrian threat and chapters 40 to 55 with the exile in Babylon.

### Jeremiah (`jeremiah`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-jeremiah/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Jeremiah&oldid=1376288136 .

- Author: Jeremiah son of Hilkiah, a priest of Anathoth, by tradition, with his scribe Baruch.
  - Berean Standard Bible. States: Jeremiah 1:1 names Jeremiah son of Hilkiah, one of the priests in Anathoth.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-jeremiah/. States: Jeremiah and Baruch, his scribe, together left the record of their times and of God's message.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJeremiah&oldid=736090. States: Son of Hilkiah, a priest of Anathoth. Baruch read his written predictions, and after the king burned the roll Jeremiah wrote a new one.
- Author, critical scholars: Scholars generally agree that the book mixes material from different groups of writers. His own messages are probably the poems in chapters 1 to 25, and followers and later editors added much.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Jeremiah&oldid=1376288136, section "Composition history". States: General agreement that the poetry, the narrative, and the life material come from separate circles. The article cites: Robert Davidson, 1993.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Jeremiah&oldid=1376288136, section "Lead; Composition history". States: His genuine oracles are probably in the poetry of chapters 1 to 25. Followers, perhaps with Baruch, and later Deuteronomists edited and expanded the whole. The article cites: Michael D. Coogan, A Brief Introduction to the Old Testament, 2008.
- Author, conservative scholars: Conservative scholars hold that Jeremiah and his scribe Baruch left the record. The book names Baruch as his scribe in several places.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-jeremiah/. States: Names Baruch as the scribe of Jeremiah, citing 32:12, 36:1 to 4, and 45:1 to 5, and says the two of them left the record.
- Written: By tradition, the late 7th and early 6th centuries BC. Jeremiah is thought to have added some chapters later, in Egypt.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-jeremiah/. States: Called about 627 BC and active for over 40 years. Taken to Egypt after Jerusalem fell, he probably died there.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJeremiah&oldid=736090. States: Jeremiah lived in Jerusalem, wrote the new roll in the reign of Jehoiakim, and stayed in the city until it fell.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJeremiah%2C_Book_of&oldid=736089. States: Jeremiah is supposed to have added chapters 37 to 44 in Egypt.
- What it is: Prophecies of judgment and hope that Jeremiah spoke to Judah and the nations, with stories from his life. Its last chapter tells how Babylon burned Jerusalem and took its people captive.
  - Berean Standard Bible. States: 1:5 appoints Jeremiah a prophet to the nations. 52:13 tells how Babylon burned the temple and the city, and 52:27 how Judah was taken into exile.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJeremiah%2C_Book_of&oldid=736089. States: Sections rebuke the sins of the Jews, review the nations, and look to better times, with history added.
- Accepted by Arthur on 2026-11-13, so not on the Not verified list:
  - Written detail: the article dates the Hebrew form to the 2nd century BC from one work, Sweeney 2010. It also says the Greek form may have been complete in the second half of the 6th century BC, from one work, Allen 2008. Rule 5 removes both, and the detail with them. Arthur decides.

### Lamentations (`lamentations`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-lamentations/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Lamentations&oldid=1384960722 .

- Author: The author is not known. An older view names Jeremiah.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-lamentations/. States: The writer of the book is unknown.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FLamentations%2C_Book_of&oldid=736134. States: Follows the Septuagint, the Targum, and tradition in giving the book to Jeremiah.
- Written: Probably soon after Babylon destroyed Jerusalem about 586 BC, by an eyewitness. An old tradition places the writing in a cave outside Jerusalem.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-lamentations/. States: An eyewitness account of the fall of Jerusalem in 586 BC. The page dates the writing to the years 586 to 516 BC and prefers an early date.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FLamentations%2C_Book_of&oldid=736134. States: By tradition Jeremiah wrote the book in a cavern outside the Damascus gate of Jerusalem after the city was destroyed.
- What it is: Five poems that mourn the fall of Jerusalem and its temple and confess the sin of its people. The last poem is a prayer that God will restore his people.
  - Berean Standard Bible. States: 1:1 mourns the lonely city that has become a widow. 5:21 asks the LORD to restore his people to himself.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FLamentations%2C_Book_of&oldid=736134. States: Five separate poems on the miseries of the ruined city and the sins behind them. Chapter 5 is a prayer for the recovery of the people.
- No detail: the sources show no dispute for the Author fact or the Written fact.

### Ezekiel (`ezekiel`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-ezekiel/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Ezekiel&oldid=1376542749 .

- Author: Ezekiel the priest, son of Buzi, by tradition. He was among the people of Judah taken captive to Babylon.
  - Berean Standard Bible. States: Ezekiel 1:3 names Ezekiel the priest, the son of Buzi, in the land of the Chaldeans by the River Kebar.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-ezekiel/. States: Ezekiel, a priest, recorded his visions and prophecies in exile near Babylon. Babylon took a first group of people from Judah into exile in 597 BC.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FEzekiel&oldid=735493. States: Son of Buzi the priest, and one of the exiles who settled at Tel-abib on the Chebar.
- Author, critical scholars: The book took shape through a long, complex process and may not keep the prophet's exact words. Scholars do agree that Ezekiel himself wrote the prophecy down.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Ezekiel&oldid=1376542749, section "Lead; Life and times of Ezekiel". States: The book shows much unity and likely reflects the historic prophet, but it has a long history behind it and may not keep his very words. The article cites: Paul M. Joyce, Ezekiel: A Commentary, 2009.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Ezekiel&oldid=1376542749, section "Textual history". States: Unlike earlier prophets, Ezekiel put his prophecy in writing in his own hand, and scholars agree on this. The article cites: Moshe Greenberg, Ezekiel 1-20, Anchor Bible, 1983; Stephen L. Cook, Ezekiel 38-48, Anchor Yale Bible, 2018.
- Author, conservative scholars: The book dates its messages over about 22 years, from about 593 BC. Ezekiel wrote down what he saw and heard while he lived as a captive near Babylon.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-ezekiel/. States: The first dated message is from 593 BC and the last from 571 BC. Ezekiel recorded his own visions and prophecies while in exile near Babylon.
- Written: By tradition, the early 6th century BC, near Babylon, where Ezekiel lived as a captive.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-ezekiel/. States: Dated messages run from 593 BC to 571 BC. He recorded them while he lived near Babylon in exile.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FEzekiel&oldid=735493. States: Taken captive about 597 BC. His ministry ran about 595 to 573 BC among the exiles.
- What it is: Prophecy and visions given to the people of Judah held captive in Babylonia. The book moves from judgment on Jerusalem and the nations to a vision of a new temple and land.
  - Berean Standard Bible. States: 1:1 has visions of God by the River Kebar among the exiles. 40:2 takes him in vision to Israel. 48:35 names the city THE LORD IS THERE.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FEzekiel%2C_Book_of&oldid=735491. States: Warnings against Jerusalem, prophecies against nearby nations, then after the fall of the city a look to restoration in chapters 40 to 48.
- Accepted by Arthur on 2026-11-13, so not on the Not verified list:
  - Ezekiel, author detail: the Wikipedia article says that most scholars see large additions by later followers, but that sentence has no citation. A cited passage in the same article says that scholars agree Ezekiel wrote it down himself. The detail uses only the cited claims.

### Daniel (`daniel`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-daniel/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Daniel&oldid=1366297531 .

- Author: Daniel, a young man of Judah taken captive to serve at the court in Babylon, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-daniel/. States: Daniel is the writer of the book. His exile began in 605 BC.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FDaniel%2C_Book_of&oldid=734493. States: The book itself bears witness that Daniel wrote it, at 7:1, 8:2, 9:2, 10:1, and 12:4.
  - Berean Standard Bible. States: Daniel 1:6 names Daniel among the young men of Judah taken to Babylon. 7:1 says that he wrote down the dream.
- Author, critical scholars: The stories in chapters 1 to 6 began as legends. Unnamed writers of the 2nd century BC produced the visions in chapters 7 to 12.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Daniel&oldid=1366297531, section "Composition: Authorship". States: The tales of the first half began as legend. Anonymous writers of the Maccabean age, the 2nd century BC, wrote the visions of the second half. The article cites: John J. Collins, The Book of Daniel: Composition and Reception, 2002.
- Author, conservative scholars: Conservative scholars hold that Daniel himself wrote the book in the 500s BC. It covers his life and visions from his capture in 605 BC to 536 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-daniel/, section "Author and Date". States: Daniel wrote the book in the 500s BC. It records his life and visions from his exile in 605 BC, 1:1, to 536 BC, 10:1.
- Written: By tradition, the 6th century BC. The book covers Daniel's life from when he was taken to Babylon about 605 BC to about 536 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-daniel/. States: Written in the 6th century BC. It covers his life from his exile in 605 BC to the third year of Cyrus, 536 BC.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FDaniel%2C_Book_of&oldid=734493. States: The book deals with the time of the Captivity, and its author lived in those times.
- Written, critical scholars: A consensus of modern scholars dates the book to about 165 BC, under the Greek king Antiochus IV. They read its predictions as written after the events.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Daniel&oldid=1366297531, section "Lead; Historical background". States: The consensus of modern scholarship dates the book to 167 to 163 BC, in the crisis under Antiochus IV Epiphanes, the Seleucid king. The article cites: C. L. Seow, Daniel, 2003; Ryken and Longman, 2010; John J. Collins, 1998.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Daniel&oldid=1366297531, section "Lead". States: The book is regarded as prophecy after the event. The article cites: James D. Tabor, in The Oxford Handbook of Millennialism, 2016; Lawrence M. Wills, in The Jewish Study Bible, 2014.
- Written, conservative scholars: Conservative scholars read chapters 8, 9, and 12 as prophecy of later troubles, such as harm to the temple.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-daniel/. States: Key themes treat chapters 8, 9, and 12 as foretelling later sin in Israel and enemies who would harm the temple in Jerusalem.
- What it is: Stories of Daniel at the court in Babylon, then visions of kingdoms to come and the time of the end. The stories are set under Babylonian and Persian kings.
  - Berean Standard Bible. States: 1:1 tells how Nebuchadnezzar besieged Jerusalem. 10:1 names the third year of Cyrus king of Persia. 12:1 foretells distress, and 12:4 the time of the end.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FDaniel%2C_Book_of&oldid=734493. States: The first six chapters are mainly history and the last six mainly prophecy.

### Hosea (`hosea`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-hosea/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Hosea&oldid=1367237111 .

- Author: Hosea son of Beeri, by tradition.
  - Berean Standard Bible. States: Hosea 1:1 gives the word of the LORD that came to Hosea son of Beeri.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FHosea&oldid=735515. States: Son of Beeri and the author of the prophecies that carry his name.
- Written: By tradition, the late 8th century BC, just before the northern kingdom of Israel fell.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-hosea/. States: Hosea prophesied in the second half of the 8th century BC, about 753 to 722 BC, shortly before the exile of the northern kingdom.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FHosea%2C_Prophecies_of&oldid=735514. States: Hosea prophesied as Israel declined and fell, and he lived at the same time as Isaiah.
- What it is: Prophecy that compares the unfaithfulness of Israel to God with the marriage of Hosea to an unfaithful wife. It closes with a call to return to God.
  - Berean Standard Bible. States: 1:2 tells Hosea to marry a prostitute because the land has left the LORD. 14:1 calls Israel to return to the LORD.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-hosea/. States: Hosea treats Baal worship as spiritual adultery and likens Israel to a wife who strays.
- No detail. Author: the article says many scholars agree that most of the book comes from the time of Jeroboam II. Only some studies hold that later editors shaped it, so that view is not shown, as for Haggai.
- Accepted by Arthur on 2026-11-13, so not on the Not verified list:
  - Author detail: the view that later editors shaped the book is held by some studies only. I applied the Haggai correction. Arthur decides.

### Joel (`joel`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-joel/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Joel&oldid=1359511431 .

- Author: Joel son of Pethuel, a prophet from Judah, by tradition. Little is known about him.
  - Berean Standard Bible. States: Joel 1:1 gives the word of the LORD that came to Joel son of Pethuel.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-joel/. States: Joel was a prophet of Judah, perhaps of Jerusalem, and we know little about him.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJoel%2C_Book_of&oldid=736099. States: Joel probably lived in Judah, since his task was to that people.
- Author, critical scholars: The book shows signs of growth over time, with material added at later stages. Some influential scholars hold that it is one piece of work.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Joel&oldid=1359511431, section "Lead and its footnote". States: The lead says the book shows literary growth and a late origin. The quoted source says material was added over time, though influential voices defend its unity. The article cites: Anselm C. Hagedorn, Joel, in The Oxford Handbook of the Minor Prophets, 2021.
- Author, conservative scholars: Conservative scholars treat Joel, a prophet from Judah, as the writer of the book. Little is known about him, and he may have come from Jerusalem.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-joel/, section "Author and Date". States: It names Joel under Author and Date, calls him a prophet of Judah, possibly from Jerusalem, and says little is known about him.
- Written: Probably after Judah's people came home from the captivity in Babylon, 586 to 538 BC, perhaps about 500 BC. An older view places Joel about 800 BC, when Uzziah was king.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-joel/. States: Most scholars, it says, put the book after 586 BC. The date is debated, but the prophecies likely came after the return from exile, perhaps about 500 BC.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJoel%2C_Book_of&oldid=736099. States: Joel probably flourished under Uzziah, about 800 BC.
- Written, critical scholars: Its many echoes of earlier scripture point to a late origin. Some scholars think parts were added as late as the 3rd century BC.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Joel&oldid=1359511431, section "Lead". States: Frequent allusions to earlier texts suggest that the book is late. The article cites: Anselm C. Hagedorn, 2021.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Joel&oldid=1359511431, section "Date". States: Some scholars argue for further additions in the Ptolemaic period, about 301 to 201 BC. The article cites: Anselm C. Hagedorn, Joel, in The Oxford Handbook of the Minor Prophets, 2021.
- Written, conservative scholars: Conservative scholars agree with most scholars that the book is later than 586 BC, when Babylon took Judah captive.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-joel/, section "Author and Date". States: Most scholars date Joel after Judah was taken to Babylon in 586 BC. It does not mention the older date of about 800 BC.
- What it is: Prophecy about a plague of locusts and a call to turn back to God. It looks ahead to a coming day of the LORD and to judgment on the nations.
  - Berean Standard Bible. States: 1:4 describes waves of locusts. 2:12 calls the people to return. 2:31 speaks of the great Day of the LORD. 3:2 gathers the nations for judgment.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJoel%2C_Book_of&oldid=736099. States: A plague of locusts, a call to repent, a promise of fruitful land again, and judgments on the enemies of God.

### Amos (`amos`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-amos/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Amos&oldid=1384657256 .

- Author: Amos, a herdsman from Tekoa, by tradition. He was not a prophet by trade.
  - Berean Standard Bible. States: Amos 1:1 gives the words of Amos, one of the sheepherders of Tekoa.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FAmos&oldid=734512. States: Amos came from Tekoa. He was a herdman who also tended sycamore trees, and he was not a prophet or the son of one.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-amos/. States: Amos did not work as a prophet by profession, yet the Lord gave him a message to bring.
- Author, critical scholars: Scholars have lately grown more doubtful about the book's account of the life of Amos. Prophetic books are more and more seen as made by trained writers, so the prophet may not be the author.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Amos&oldid=1384657256, section "Lead and its footnote". States: Recent scholarship doubts how the book presents his life. The footnote quote says prophetic books are increasingly treated as the products of elite scribes, so prophet and author may differ. The article cites: J. Blake Couey, Amos, in The Oxford Handbook of the Minor Prophets, 2021.
- Author, conservative scholars: Conservative scholars accept the book's own account of Amos at 1:1 and 7:14 to 15. He was not a prophet by trade, but the Lord sent him with a message.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-amos/. States: Citing 1:1 and 7:14 to 15, it says Amos was no professional prophet, yet the Lord entrusted him with a message.
- Written: By tradition, the 8th century BC, when Uzziah ruled Judah and Jeroboam II ruled Israel. Amos took his message to the northern kingdom.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-amos/. States: Amos prophesied sometime from 793 to 739 BC, probably late in that span, and brought his message to Israel in the north.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FAmos&oldid=734512. States: Amos prophesied under Uzziah of Judah, in the time when Jeroboam II ruled Israel.
- Written, critical scholars: The heading and the story of Amos and the priest Amaziah are increasingly seen as written after his time. The vision reports may belong to a later phase as well.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Amos&oldid=1384657256, section "Lead, footnote". States: The footnote quote says scholars increasingly see the superscription and the Amaziah story as late. The visions may also belong to later stages. The article cites: J. Blake Couey, 2021, who cites Coggins 2000, Eidevall 2017, and Becker 2001.
- Written, conservative scholars: Conservative scholars date the preaching of Amos between 793 and 739 BC, probably late in that span. He preached to Israel, the northern kingdom.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-amos/, section "Author and Date". States: Amos took a message to Israel in the north. He prophesied between 793 and 739 BC, probably near the end of that time.
- What it is: Prophecy of judgment on the nations around Israel and on Israel itself. It ends with a promise that God will restore his people to their land.
  - Berean Standard Bible. States: 1:3 begins judgment on Damascus. 2:6 turns to Israel. 9:14 to 15 promise that God will restore Israel and plant them in their own land.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FAmos&oldid=734512. States: The nations around are called to judgment, then Judah and Israel, and the book closes with a promise of restoration.

### Obadiah (`obadiah`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-obadiah/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Obadiah&oldid=1385495705 .

- Author: Obadiah, by tradition. Only his name is known.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-obadiah/. States: The book records a vision from the Lord to a man called Obadiah. We know nothing else about him.
  - Berean Standard Bible. States: Obadiah 1:1 reads: This is the vision of Obadiah.
- Written: Probably the 6th century BC, soon after Babylon destroyed Jerusalem about 586 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-obadiah/. States: Probably written early in the exile, after Babylon destroyed Jerusalem in 586 BC and before Babylon attacked Edom in 553 BC.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FObadiah%2C_Book_of&oldid=759909. States: Obadiah treats the Babylonian capture of Jerusalem as past, so his prophecies date to about the year it was destroyed.
- Written, critical scholars: The majority of scholars date it soon after Jerusalem fell to Babylon, in the 6th century BC. Some scholars think it took shape over time, amid conflicts with Edom in the 5th and 4th centuries BC.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Obadiah&oldid=1385495705, section "Lead". States: Most scholars place the book soon after Jerusalem fell in 587 BC. The article cites: Charles Bruce Riding, Dating Obadiah to 801 BC, Reformed Theological Review 80 (2021), pp. 189 to 217.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Obadiah&oldid=1385495705, section "Lead". States: Other scholars hold that conflicts between Judah under Persia and Edom in the 5th and 4th centuries BC shaped the book over time. The article cites: Ehud Ben Zvi (1996). Bob Becking, The Oxford Handbook of the Minor Prophets (2021), pp. 437 to 448.
- Written, conservative scholars: Conservative scholars place it early in the captivity in Babylon, 586 to 538 BC. That is before Babylon attacked Edom in 553 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-obadiah/. States: Dates the book to the first half of the captivity, after Babylon destroyed Jerusalem in 586 BC and before it attacked Edom in 553 BC.
- What it is: A short prophecy against Edom, which sided with the enemies of Jerusalem. It ends with a promise of rescue on Mount Zion and of a kingdom that belongs to the LORD.
  - Berean Standard Bible. States: 1:10 condemns Edom for violence against his brother Jacob. 1:17 promises deliverance on Mount Zion. 1:21 ends with the kingdom belonging to the LORD.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-obadiah/. States: The Edomites took the side of the foreign invaders of Jerusalem.

### Jonah (`jonah`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-jonah/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Jonah&oldid=1384944152 .

- Author: Jonah son of Amittai, by tradition.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJonah%2C_Book_of&oldid=736109. States: There is every reason to think that Jonah wrote the book himself.
  - Berean Standard Bible. States: Jonah 1:1 names him Jonah son of Amittai.
- Written: By tradition, the 8th century BC, when Jeroboam II ruled Israel.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-jonah/. States: Jonah prophesied under Jeroboam II, king of Israel from 782 to 753 BC.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJonah%2C_Book_of&oldid=736109. States: Jonah himself wrote the book.
- Written, critical scholars: Most scholars think it was written long after the events, since it uses words known only from much later writings. Mainstream scholars generally read the story as fiction.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Jonah&oldid=1384944152, section "Lead; Date". States: Most scholars place the writing well after the events, since it uses words and motifs that occur only in postexilic Aramaic. The article cites: Vanessa Lovelace, Jonah, in The Oxford Handbook of the Minor Prophets, 2021; Hans Walter Wolff, Obadiah and Jonah, 1986.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Jonah&oldid=1384944152, section "Lead". States: Mainstream scholarship generally treats the story as fiction, and the cited source speaks of a modern consensus. The article cites: Kripke 1980; Jenson 2009; Robert B. Chisholm, 2009.
- Written, conservative scholars: Conservative scholars place the prophet Jonah in the reign of Jeroboam II over Israel, 782 to 753 BC. They point to 2 Kings 14:23 to 28.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-jonah/, section "Author and Date". States: Jonah prophesied under Jeroboam II, who ruled Israel 782 to 753 BC, citing 2 Kings 14:23 to 28. It gives no date for the writing of the book.
- What it is: A story about the prophet Jonah, who flees when God sends him to warn Nineveh. When the city repents and God spares it, Jonah is angry.
  - Berean Standard Bible. States: 1:2 sends Jonah to Nineveh. 1:3 has him flee toward Tarshish. 3:10 shows God relenting. 4:1 tells of his anger, and 4:11 asks about Nineveh.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJonah%2C_Book_of&oldid=736109. States: The book tells of his commission, his disobedience, the repentance of Nineveh, and his displeasure at the mercy of God.
- Accepted by Arthur on 2026-11-13, so not on the Not verified list:
  - Jonah, written: no approved source gives a date of writing. The ESV Global Study Bible places Jonah under Jeroboam II, and Easton says that Jonah wrote the book. The cover date joins these two facts.

### Micah (`micah`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-micah/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Micah&oldid=1338589698 .

- Author: Micah the Moreshite, by tradition.
  - Berean Standard Bible. States: Micah 1:1 gives the word of the LORD to Micah the Moreshite under Jotham, Ahaz, and Hezekiah.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-micah/. States: Micah writes to bring the lawsuit of God against his people.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FMicah%2C_Book_of&oldid=759890. States: The heading says the prophet served under Jotham, Ahaz, and Hezekiah.
- Author, critical scholars: Some scholars, though not all, hold that only chapters 1 to 3 go back to Micah himself.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Micah&oldid=1338589698, section "Composition". States: Some scholars, not all, accept that the material of the 8th century prophet is only in chapters 1 to 3. The article cites: John W. Rogerson, Micah, in Eerdmans Commentary on the Bible, 2003.
- Author, conservative scholars: Conservative scholars hold that the prophet Micah wrote the book. They credit passages from chapters 1 to 7 to him.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-micah/, section "Author and Date; Purpose and Background". States: Micah prophesied under Jotham, Ahaz, and Hezekiah, and writes to bring God's charge against his people. It cites his words from all seven chapters.
- Written: By tradition, the late 8th and early 7th centuries BC, while Jotham, Ahaz, and Hezekiah ruled Judah.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-micah/. States: Micah prophesied under the Judean kings Jotham, Ahaz, and Hezekiah, from 750 BC on, for perhaps 20 to 25 years.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FMicah%2C_Book_of&oldid=759890. States: Reckons the ministry from 759 to 698 BC, or from 743 to 726 BC, by two ways of counting the three reigns.
- Written, critical scholars: Scholars agree its last stage came under Persian rule, 539 to 332 BC, or even Greek rule, from 332 BC. They dispute how much took shape then, and date the latest parts after the temple's rebuilding in 515 BC.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Micah&oldid=1338589698, section "Lead; Composition". States: A consensus says the book took long to form, with a final stage in Persian times, or even Hellenistic times. Whether it was formed or only finished then is contested. The article cites: Rainer Kessler, Micah, in The Oxford Handbook of the Minor Prophets, 2021.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Micah&oldid=1338589698, section "Composition". States: Scholars hold that the latest parts come after the rebuilding of the temple in 515 BC, and the book seems complete early in the 5th century BC. The article cites: James Luther Mays, Micah (1976), p. 21.
- Written, conservative scholars: Conservative scholars place Micah's work under three kings of Judah, Jotham, Ahaz, and Hezekiah, from 750 to 687 BC. His public work may have lasted about 20 to 25 years.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-micah/, section "Author and Date". States: Micah prophesied under Jotham, 750 to 735 BC, Ahaz, 735 to 715 BC, and Hezekiah, 715 to 687 BC. His public work may have lasted 20 to 25 years.
- What it is: Prophecy against the sins of Samaria and Jerusalem, with promises of hope. It ends with trust that God will pardon sin and keep faith with Jacob and Abraham.
  - Berean Standard Bible. States: 1:1 concerns Samaria and Jerusalem, and 1:5 names their sins. 7:18 praises God who pardons iniquity. 7:20 promises faithfulness to Jacob and loving devotion to Abraham.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FMicah%2C_Book_of&oldid=759890. States: Three sections, each opening with a rebuke and ending with a promise.

### Nahum (`nahum`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-nahum/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Nahum&oldid=1382362641 .

- Author: The prophet Nahum, by tradition. The book names him as Nahum the Elkoshite.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-nahum/. States: Under Author and Date, it names the prophet Nahum as the one God sent to announce that Nineveh would fall.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FNahum%2C_Book_of&oldid=759948. States: Treats the book as the prophecy of Nahum, whose subject is the coming ruin of Nineveh.
  - Berean Standard Bible. States: Nahum 1:1 names the prophet as Nahum the Elkoshite.
- Written: By tradition, the 7th century BC, after Thebes in Egypt fell and before Nineveh fell. An older view dates it to the 8th century BC, probably in Jerusalem.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-nahum/. States: Thebes fell about 664 BC and Nineveh in 612 BC. The book treats the first as past and the second as future, so it comes from between those years.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FNahum%2C_Book_of&oldid=759948. States: Prefers a date late in the reign of Hezekiah, about 709 BC, over about 743 BC. Says the book was probably written in Jerusalem.
- Written, critical scholars: Scholars debate when the book took shape. Proposals run from soon after 663 BC to about 175 to 165 BC.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Nahum&oldid=1382362641, section "Lead". States: The time that gave rise to the book is in dispute. Proposals run from soon after Thebes fell, 663 BC, to about 175 to 165 BC. The article cites: Duane L. Christensen, Nahum, Anchor Yale Bible (2009), pp. 53 to 54, which lists at least six options.
- Written, conservative scholars: Conservative scholars note that the book treats the fall of Thebes as past and the fall of Nineveh as future. So it dates from the 7th century BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-nahum/. States: Nahum 3 speaks of the capture of Thebes, about 664 BC, as a known event and foretells the capture of Nineveh, 612 BC. So the book falls between them.
- What it is: A prophecy that Nineveh, the chief city of Assyria, will fall. It tells Judah that this enemy will not invade again.
  - Berean Standard Bible. States: Chapter 1 opens with the burden against Nineveh, and 1:15 tells Judah the wicked will not march through again. Chapter 3 ends with the ruin of the Assyrian king.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FNahum%2C_Book_of&oldid=759948. States: The subject is the full destruction of Nineveh, chief city of the Assyrian empire.

### Habakkuk (`habakkuk`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-habakkuk/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Habakkuk&oldid=1384644727 .

- Author: The prophet Habakkuk, by tradition. The book names him in its first verse and at the head of chapter 3.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-habakkuk/. States: Under Author and Date, it calls the book a conversation between God and the prophet Habakkuk.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FHabakkuk%2C_Prophecies_of&oldid=5175902. States: Titles the entry the prophecies of Habakkuk and describes the prophet laying his complaints before God.
  - Berean Standard Bible. States: Habakkuk 1:1 and 3:1 both name Habakkuk the prophet.
- Author, critical scholars: Scholars debate whether chapter 3 has the same author as chapters 1 and 2, or was added later. Every copy of the Septuagint, the Greek translation finished by 132 BC, includes it.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Habakkuk&oldid=1384644727, section "Lead". States: Reports a debate over whether one author wrote both chapter 3 and chapters 1 to 2. The article cites: F. L. Cross and E. A. Livingstone, editors, The Oxford Dictionary of the Christian Church, 3rd edition, 2005.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Habakkuk&oldid=1384644727, section "Importance". States: Some scholars suggest chapter 3 was added later. Yet every copy of the Septuagint, the Greek translation completed by 132 BC, has it. The article cites: David W. Baker, Nahum, Habakkuk and Zephaniah, Tyndale Old Testament Commentaries, 1988, p. 46.
- Author, conservative scholars: Conservative scholars treat the prophet Habakkuk as the writer of all three chapters. They read the closing prayer of praise as his own response to God.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-habakkuk/, section "Author and Date; Theme and Overview". States: The book is a talk between Habakkuk and God, and it ends in his praise. He probably prophesied by the close of Josiah's reign, 640 to 609 BC.
- Written: By tradition, late in the 7th century BC, shortly before Babylon invaded Judah. An older view dates it a little earlier, in the mid 7th century BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-habakkuk/. States: Places his work by the close of the reign of Josiah, which ended 609 BC, a little before Babylon began to invade Judah in 605 BC.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FHabakkuk%2C_Prophecies_of&oldid=5175902. States: Probably written about 650 to 627 BC, or by some views a few years later.
- What it is: A dialogue in which the prophet questions the Lord about injustice and hears his answers. It ends with a prayer set for stringed instruments.
  - Berean Standard Bible. States: Chapter 1 has the prophet ask how long he must cry out about violence. Chapter 3 is a prayer of Habakkuk that ends with a note for stringed instruments.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-habakkuk/. States: Chapters 1 and 2 are built on the questions of the prophet and the replies of the Lord, and the book closes in praise.
- Accepted by Arthur on 2026-11-13, so not on the Not verified list:
  - Written: no detail. Most scholars place the book in the reign of Jehoiakim, 609 to 597 BC. The ESV Global Study Bible says by 609 BC, just before Babylon invaded. I judged the gap too small for a detail. Arthur decides.

### Zephaniah (`zephaniah`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-zephaniah/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Zephaniah&oldid=1381816563 .

- Author: The prophet Zephaniah, son of Cushi, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-zephaniah/. States: Under Author and Date, it names Zephaniah as a prophet in the time when Josiah was king.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FZephaniah&oldid=740124. States: Zephaniah, the son of Cushi, was a prophet in the days of Josiah, and his prophecies make up the book.
  - Berean Standard Bible. States: Zephaniah 1:1 names Zephaniah son of Cushi.
- Written: By tradition, while Josiah was king of Judah, in the 7th century BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-zephaniah/. States: Says he prophesied in the reign of Josiah, 640 to 609 BC.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FZephaniah&oldid=740124. States: He prophesied in the days of Josiah, king of Judah, 641 to 610 BC.
- Written, critical scholars: Some scholars keep the time of Josiah. Others think editors expanded an early core of messages after Judah fell in 586 BC, or later still.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Zephaniah&oldid=1381816563, section "Lead". States: Scholars propose several dates. Some favour the reign of Josiah, while others think an early core of oracles was enlarged and revised in or after the exile. The article cites: Cat Quine, Zephaniah, in The Oxford Handbook of the Minor Prophets, ed. Julia M. O'Brien, 2021, pp. 499-510; Anselm C. Hagedorn, Journal of Theological Studies 62, 2011, pp. 465-469.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Zephaniah&oldid=1381816563, section "Authorship and date". States: Others argue that part of the book is later than 586 BC, the year Judah fell. The article cites: Adele Berlin and others, The Jewish Study Bible, 2004, p. 1234 and p. 2111.
- Written, conservative scholars: Conservative scholars place the prophet Zephaniah in the reign of Josiah over Judah, 640 to 609 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-zephaniah/, section "Author and Date". States: Zephaniah prophesied under Josiah, king of Judah from 640 to 609 BC, who tried to restore right worship.
- What it is: A prophecy about the day of the Lord, when he will judge Judah and other nations. It ends with a promise to gather and restore the people.
  - Berean Standard Bible. States: Chapter 1 announces the day of the Lord against Judah. Chapter 2 turns to Gaza and other nations. Chapter 3 ends with a promise to gather and restore the people.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FZephaniah&oldid=740124. States: The book has judgment on Israel and on the heathen, and ends with a promise of salvation.

### Haggai (`haggai`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-haggai/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Haggai&oldid=1331048975 .

- Author: The prophet Haggai, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-haggai/. States: The book holds messages that the prophet Haggai gave, so the page treats him as the author.
  - Berean Standard Bible. States: Haggai 1:1 says the word of the LORD came through Haggai the prophet.
- Written: By tradition, about 520 BC, after the Jews returned from Babylon in 538 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-haggai/. States: The second year of Darius in 1:1 puts the book in 520 BC. Cyrus let the Jews return from Babylon in 538 BC.
- What it is: Dated messages from the second year of King Darius that urge the people to rebuild the house of the Lord. They speak to Zerubbabel the governor, Joshua the high priest, and the people.
  - Berean Standard Bible. States: Haggai 1:1 dates the first message to the second year of Darius and names Zerubbabel the governor and Joshua the high priest. Verse 14 adds the people.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FHaggai%2C_Book_of&oldid=735502. States: The prophet urged the people to go on with rebuilding the temple, in four addresses.
- No detail. Written: the article says most scholars take the king as Darius I and some as Darius II, so the view of some scholars is not shown, as the designer asked. Author: the article doubts that Haggai wrote the book, but it cites only a website, which Task 4 condition 1 does not accept.

### Zechariah (`zechariah`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-zechariah/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Zechariah&oldid=1336450203 .

- Author: The prophet Zechariah, a priest, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-zechariah/. States: Under Author and Date, it says Zechariah was both a prophet and a priest.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FZechariah&oldid=740119. States: A prophet of Judah from a priestly family, the son of Berechiah.
- Author, critical scholars: Most modern scholars think at least two writers produced the book. Some think a disciple of the prophet wrote or edited chapters 9 to 14.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Zechariah&oldid=1336450203, section "Authorship". States: Most modern scholars hold that two or more people wrote the book. The article cites: Michael D. Coogan, A Brief Introduction to the Old Testament, 2009, p. 346.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Zechariah&oldid=1336450203, section "Authorship". States: Some think the writer or editor of chapters 9 to 14 was a follower of Zechariah. The article cites: Eric Meyers, Zechariah Introduction, The New Interpreter's Study Bible, 2003, p. 1338.
- Author, conservative scholars: Conservative scholars treat the prophet Zechariah, who was also a priest, as the writer of the book.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-zechariah/, section "Author and Date; Key Themes". States: He was both a prophet and a priest. It names no other writer and lists themes from chapters 9 to 14 with the rest.
- Written: By tradition, from about 520 BC, after the people of Judah returned from Babylon in 538 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-zechariah/. States: His ministry started in 520 BC. The page says Cyrus let the people of Judah go home from Babylon in 538 BC.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FZechariah&oldid=740119. States: His work began in the second year of Darius, 520 BC, about sixteen years after the first exiles returned.
- Written, critical scholars: Most scholars date chapters 9 to 14 to the 5th century BC, well after chapters 1 to 8. Those later chapters name no event that can be dated.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Zechariah&oldid=1336450203, section "Authorship". States: Chapters 9 to 14 have no datable references, yet most scholars place them in the 5th century BC. The article cites: Michael D. Coogan, A Brief Introduction to the Old Testament, 2009, p. 355.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Zechariah&oldid=1336450203, section "Historical context". States: Chapters 9 to 14 are thought to come from much later than chapters 1 to 8, in the 5th century. The article cites: Richard D. Nelson, Historical Roots of the Old Testament, 2014, pp. 215-216.
- Written, conservative scholars: Conservative scholars date the start of his work to 520 BC, soon after Haggai began to prophesy. Judah's people had come home from Babylon in 538 BC.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-zechariah/, section "Author and Date; Background". States: Zechariah began in 520 BC, shortly after Haggai. That was nearly 20 years after the return from Babylon under Cyrus in 538 BC.
- What it is: Night visions and messages that call the people back to the Lord, then two prophecies about Jerusalem and the nations. The book opens in the second year of King Darius.
  - Berean Standard Bible. States: Chapter 1 dates the opening to the second year of Darius, calls the people to return, and begins a night vision. Chapter 9 opens a burden against other lands.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FZechariah&oldid=740119. States: The book has a series of visions in chapters 1 to 8 and two burdens in chapters 9 to 14.

### Malachi (`malachi`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-malachi/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Malachi&oldid=1383150392 .

- Author: The prophet Malachi, by tradition. His name means my messenger.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-malachi/. States: Under Author and Date, it names the prophet Malachi and says his name means my messenger.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FMalachi%2C_Prophecies_of&oldid=759883. States: Treats the book as the prophecies of Malachi and speaks of the prophet.
  - Berean Standard Bible. States: Malachi 1:1 says the word of the LORD came to Israel through Malachi.
- Author, critical scholars: Some scholars think the writer is unknown and that Malachi, meaning my messenger, is a title rather than a name. Others argue from the grammar that it is a name.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Malachi&oldid=1383150392, section "Authorship". States: Some scholars count Malachi, like Zechariah 9 to 14, as anonymous. The article cites: Otto Eissfeldt, The Old Testament: An Introduction, 1965, p. 440.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Malachi&oldid=1383150392, section "Authorship". States: Some scholars take Malachi as a short form of messenger of Yah, not a proper name. The article cites: Easton's Bible Dictionary, 1897, entry Malachi.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Malachi&oldid=1383150392, section "Authorship". States: Other scholars hold that the grammar shows Malachi is a name. The article cites: Albin van Hoonacker, Malachias, Catholic Encyclopedia, vol. 9, 1910.
- Author, conservative scholars: Conservative scholars treat Malachi as the name of the prophet behind the book. The name means my messenger.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-malachi/, section "Author and Date; Purpose, Occasion, and Background". States: It calls him the prophet Malachi, notes that his name means my messenger, and speaks of his ministry and his prophecy.
- Written: By tradition, about 460 BC, when Ezra and Nehemiah lived.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-malachi/. States: Says Malachi probably lived in the time of Ezra and Nehemiah, about 460 BC.
- Written, critical scholars: Most scholars think editors added to the book in several stages. Its oldest parts date to about 500 BC, and it was almost complete by about 180 BC.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Malachi&oldid=1383150392, section "Lead". States: Most scholars think the book passed through several stages of editing. Its oldest layer is from about 500 BC, and a cited note puts it nearly finished by 180 BC. The article cites: Rainer Kessler, Maleachi, Herders theologischer Kommentar zum Alten Testament, 2011, pp. 59-61; Aaron Schart, Malachi, in The Oxford Handbook of the Minor Prophets, 2021, pp. 540-542.
- Written, conservative scholars: Conservative scholars date Malachi probably to about 460 BC, when Ezra and Nehemiah lived. He worked decades after the exiles came home from Babylon and rebuilt the temple.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-malachi/, section "Author and Date; The Setting of Malachi". States: Malachi probably lived when Ezra and Nehemiah did, about 460 BC, some decades after the exiles returned and rebuilt the temple.
- What it is: A set of disputes between the Lord and Israel about worship, marriage, and offerings. It ends with a call to remember the law of Moses and a promise of Elijah.
  - Berean Standard Bible. States: Chapters 1 to 3 treat defiled offerings, marriage to women who serve a foreign god, and tithes. Chapter 4 calls for the law of Moses and promises Elijah.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-malachi/. States: The book sets out six disputes between God and Israel.

### Matthew (`matthew`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-matthew/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Gospel_of_Matthew&oldid=1382126669 .

- Author: The apostle Matthew, also called Levi, a former tax collector, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-matthew/. States: States that the author is Matthew, known too as Levi, who collected taxes before he followed Jesus.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FMatthew%2C_Gospel_according_to&oldid=6923052. States: The author was without doubt Matthew the apostle.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FMatthew&oldid=4792053. States: Matthew was a tax gatherer at Capernaum and was formerly known as Levi.
- Author, critical scholars: Most scholars doubt the apostle wrote it, and see it as the work of the next generation of Christians. It also draws on the Gospel of Mark, and some scholars still defend the apostle.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Gospel_of_Matthew&oldid=1382126669, section "Author and date". States: Most scholars treat the gospel as a work with no named author, while the traditional author still has defenders. The article cites: John Muddiman and John Barton, The Gospels, Oxford Bible Commentary, 2010; Armin Baum, Novum Testamentum 50, 2008, pp. 120-142.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Gospel_of_Matthew&oldid=1382126669, section "Setting". States: Most scholars see the gospel as written by the second generation of Christians, drawing on what the first disciples remembered. The article cites: James Dunn, Who Was Jesus?, 2017, p. 4.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Gospel_of_Matthew&oldid=1382126669, section "Composition". States: Mark was the first gospel to be written, and the other gospels used it. The article cites: David L. Turner, Matthew (2008), pp. 6 to 7. Donald Senior, What Are They Saying About Matthew? (1996), p. 22.
- Author, conservative scholars: Conservative scholars keep the traditional view that Matthew wrote this Gospel. He was the tax collector, also called Levi, who became a disciple of Jesus.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-matthew/, section "Author, Date, and Recipients". States: Matthew, also called Levi, the tax collector who followed Jesus, is the author. It gives no grounds for this view.
- Written: By tradition, about AD 60, before the fall of Jerusalem.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-matthew/. States: Probably composed toward the end of the 50s or the start of the 60s AD.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FMatthew%2C_Gospel_according_to&oldid=6923052. States: Written before Jerusalem was destroyed, probably between AD 60 and 65.
- Written, critical scholars: Most scholars date it after AD 70, because it seems to know of the fall of Jerusalem. Other scholars argue for the 40s or 50s AD.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Gospel_of_Matthew&oldid=1382126669, section "Author and date, explanatory footnote". States: A footnote gives the grounds for the majority date: the split of church and synagogue about AD 85, the fall of Jerusalem in AD 70, and the use of Mark. The article cites: R. T. France, The Gospel of Matthew, 2007, p. 18.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Gospel_of_Matthew&oldid=1382126669, section "Author and date". States: Other scholars argue that a late 1st century date is a problem and place the book in the 40s to 50s AD. The article cites: N. T. Wright and Michael F. Bird, The New Testament in its World, 2019, pp. 582-584; John Wenham, Redating Matthew, Mark, and Luke, 1992, pp. 223-247.
- Written, conservative scholars: Conservative scholars place the writing of this Gospel probably near AD 60, in the late 50s or the early 60s.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-matthew/, section "Author, Date, and Recipients". States: It dates the book probably to the late 50s AD or the early 60s AD, and gives no reason.
- What it is: A Gospel account of Jesus from his birth to his death, resurrection, and command to make disciples of all nations. Its writer had Jewish Christians in mind.
  - Berean Standard Bible. States: Chapter 1 gives the family line and birth of Jesus. Chapter 28 has the empty tomb and the command to make disciples of all nations.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-matthew/. States: Matthew writes to strengthen Jewish Christians who face opposition.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FMatthew%2C_Gospel_according_to&oldid=6923052. States: The Gospel was written for Jewish Christians of Palestine.
- Accepted by Arthur on 2026-11-13, so not on the Not verified list:
  - Author detail: Task 4b step 2 asks for the reason of the doubt. The article says most scholars think Christians of the generation after the apostles wrote the book, but it does not give that as the reason for the doubt. The detail gives the two statements side by side. Arthur decides.

### Mark (`mark`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-mark/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Gospel_of_Mark&oldid=1382234826 .

- Author: John Mark, by tradition. He recorded the reports about Jesus that the apostle Peter passed on to him.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-mark/. States: Says Peter gave his reports of Jesus to John Mark, his attendant, who wrote this Gospel as a record of that witness.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FMark%2C_Gospel_according_to&oldid=6923055. States: Calls it the current and well founded tradition that Mark took his information mainly from the preaching of Peter.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FMark&oldid=759889. States: Identifies Mark the evangelist as John whose surname was Mark.
- Author, critical scholars: The book does not name its writer, and scholars debate who wrote it. Some deny that anyone named Mark wrote it, and others accept John Mark.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Gospel_of_Mark&oldid=1382234826, section "Lead". States: The text gives no author name, and scholars dispute who wrote it. The article cites: J. Brian Tucker and Aaron Kuecker, editors, T&T Clark Social Identity Commentary on the New Testament, 2019; Bart Ehrman and Hugo Mendez, The New Testament: A Historical Introduction, 8th edition, 2023, p. 118.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Gospel_of_Mark&oldid=1382234826, section "Authorship and date". States: Much debate remains. Some deny any Mark was the writer, while others accept John Mark. The article cites: Helen Bond, The First Biography of Jesus, 2020, pp. 10-11.
- Author, conservative scholars: Conservative scholars hold that John Mark wrote this Gospel. He wrote down Peter's witness to what Jesus said and did.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-mark/, section "Author, Date, and Recipients". States: Peter passed on reports about Jesus to his helper John Mark. Mark then wrote this Gospel as a record of Peter's teaching.
- Written: By tradition, the second half of the 50s AD, likely in Rome. A date in the middle or late 60s AD is also possible.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-mark/. States: Probably written from Rome in the middle or later 50s AD, with the middle or later 60s also possible.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FMark%2C_Gospel_according_to&oldid=6923055. States: Written before Jerusalem fell, probably about AD 63, and probably in Rome. Some have suggested Antioch.
- Written, critical scholars: Scholars usually date it just before or just after AD 70. Chapter 13 seems to reflect the Jewish war with Rome, AD 66 to 74.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Gospel_of_Mark&oldid=1382234826, section "Lead". States: Dates the book to around AD 70. The article cites: William R. Telford, The Theology of the Gospel of Mark, 1999, p. 12.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Gospel_of_Mark&oldid=1382234826, section "Authorship and date". States: Scholars usually date it from chapter 13, read as pointing to the war of AD 66 to 74. That puts it just before or just after AD 70. The article cites: William R. Telford, The Theology of the Gospel of Mark, 1999, p. 12; Hans Leander, Discourses of Empire, 2013, p. 167.
- Written, conservative scholars: Conservative scholars think Mark was likely written in Rome in the middle or late 50s AD. They also allow a date in the middle or late 60s AD.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-mark/, section "Author, Date, and Recipients". States: Likely written from Rome in the middle to late 50s AD. The middle or late 60s AD is also possible.
- What it is: A Gospel account that begins when John baptizes Jesus and ends with his death and resurrection. It explains Jewish customs for readers who did not know them.
  - Berean Standard Bible. States: Mark 1:9 has Jesus baptized by John in the Jordan, 7:3 explains a Jewish washing custom, and 16:6 has the announcement that he has risen.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-mark/. States: The first readers did not know Jewish customs, so Mark explains them.
- Accepted by Arthur on 2026-11-13, so not on the Not verified list:
  - What it is: the summary ends with the resurrection, as Mark 16:8 does. The bundled Berean Standard Bible also has 16:9 to 20, which ends as Jesus is taken up into heaven. Arthur decides if the summary must name that ending.

### Luke (`luke`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-luke/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Gospel_of_Luke&oldid=1382641630 .

- Author: Luke, a physician and travel companion of Paul, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-luke/. States: Says Luke, a physician and a companion of Paul on his travels, wrote this Gospel and Acts.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FLuke%2C_Gospel_according_to&oldid=736155. States: The Gospel was written by Luke.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FLuke&oldid=736153. States: Luke was probably a physician and went with Paul on his travels.
- Author, critical scholars: Late in the 20th century, critical scholars were about evenly split on whether Luke wrote it. Most now hold that the writer did travel with Paul, but some point to differences with his letters.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Gospel_of_Luke&oldid=1382641630, section "Luke-Acts: unity, authorship and date". States: Reports that in the late 20th century critics were judged to be about evenly divided over the tradition. The article cites: Raymond E. Brown, An Introduction to the New Testament, 1997, pp. 267-268.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Gospel_of_Luke&oldid=1382641630, section "Lead". States: Most critical scholars hold that the writer travelled with Paul, though some note differences from his letters. The article cites: Bruce Longenecker and Zen Hess, Journal for the Study of the New Testament 49, 2026, pp. 32-58; Gerd Theissen and Annette Merz, The Historical Jesus, 1998, p. 32.
- Author, conservative scholars: Conservative scholars keep the traditional view that Luke wrote this Gospel and the book of Acts. Luke was a doctor who traveled with Paul.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-luke/, section "Author, Date, and Recipients". States: Luke, a doctor, Colossians 4:14, who traveled with Paul, wrote this Gospel and Acts. Both books are addressed to Theophilus.
- Written: By tradition, no earlier than about AD 62, just after the last events in Acts. An older view dates it to about AD 60 to 63, a little before Acts.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-luke/. States: Puts the earliest time that Luke and Acts could have been written at about AD 62, right after the closing events of Acts.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FLuke%2C_Gospel_according_to&oldid=736155. States: Written before Acts, probably about AD 60 or 63. The place is uncertain.
- Written, critical scholars: Most scholars date it to about AD 80 to 90, after Mark and after the fall of Jerusalem.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Gospel_of_Luke&oldid=1382641630, section "Luke-Acts: unity, authorship and date". States: Most scholars place the work in AD 80 to 90, as it knows Mark and the fall of Jerusalem but not the letters of Paul. The article cites: James H. Charlesworth, The Historical Jesus: An Essential Guide, 2008; Gerd Theissen and Annette Merz, The Historical Jesus, 1998, p. 32.
- Written, conservative scholars: Conservative scholars keep the traditional view that the earliest date is about AD 62. That date comes just after the last events that Acts tells, in chapter 28.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-luke/, section "Author, Date, and Recipients". States: Luke wrote both Luke and Acts. The earliest possible date for the two books is about AD 62, right after the events at the end of Acts.
- What it is: A Gospel account of Jesus from his birth to his resurrection and his going up to heaven. The writer addresses it to a man named Theophilus.
  - Berean Standard Bible. States: Luke 1:3 addresses the account to most excellent Theophilus. Chapter 2 has the birth of Jesus, and 24:51 says he was carried up into heaven.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-luke/. States: Luke and Acts are both addressed to Theophilus.

### John (`john`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-john/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Gospel_of_John&oldid=1384537258 .

- Author: The apostle John, son of Zebedee, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-john/. States: Says John the son of Zebedee, one of the twelve, is the writer of this Gospel.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJohn%2C_Gospel_of&oldid=736102. States: Holds that the apostle John was the author, beyond reasonable doubt.
- Author, critical scholars: Most scholars now prefer another writer, such as John the Elder, with the disciple Jesus loved as a main source. Many still hold that the apostle wrote it.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Gospel_of_John&oldid=1384537258, section "Authorship, Composition". States: Many modern scholars keep the traditional author, but most have turned to other candidates, for example John the Elder, while seeing the beloved disciple as a source. The article cites: Tuomas Rasimus, The Legacy of John, 2010, p. 6; Michael Licona, Why Are There Differences in the Gospels?, 2016, p. 115; Paul N. Anderson, Does It Matter Who Wrote the Bible?, 2025, p. 53.
- Author, conservative scholars: Conservative scholars identify the apostle John with the disciple whom Jesus loved, and hold that he wrote it.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-john/. States: Names John the son of Zebedee as the writer, and identifies him with the disciple that Jesus loved, at 13:23.
- Written: By tradition, late in the 1st century AD, likely in Ephesus.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-john/. States: Likely written between AD 70 and 100, and likely from Ephesus.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJohn%2C_Gospel_of&oldid=736102. States: Probably written at Ephesus, about AD 90.
- What it is: A Gospel account of the miracles of Jesus, which it calls signs, and of his talks, death, and resurrection. Its stated witness is the disciple whom Jesus loved.
  - Berean Standard Bible. States: Chapter 2 calls the wine at Cana his first sign. Chapters 13 to 17 hold long talks. Chapter 20 has the empty tomb. Chapter 21 names the beloved disciple.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJohn%2C_Gospel_of&oldid=736102. States: The second part shows Jesus with his followers, then his sufferings and his appearances after the resurrection.

### Acts (`acts`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-acts/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Acts_of_the_Apostles&oldid=1385107055 .

- Author: Luke, a physician and travel companion of Paul, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-acts/. States: Says Luke, a doctor who travelled with Paul, wrote both Luke and Acts.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FActs_of_the_Apostles&oldid=11541844. States: Calls it the work of Luke, the beloved physician, by the uniform tradition of antiquity.
- Author, critical scholars: Late in the 20th century, critical scholars were about evenly split on whether Luke wrote it. Most still hold that the writer travelled with Paul, but others note tensions with his letters.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Acts_of_the_Apostles&oldid=1385107055, section "Title, unity of Luke-Acts, authorship and date". States: Reports that in the late 20th century critics were judged about evenly divided on whether Luke wrote it. The article cites: Raymond E. Brown, An Introduction to the New Testament, 1997, pp. 267-268.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Acts_of_the_Apostles&oldid=1385107055, section "Lead". States: Most scholars still see the writer as a companion of Paul, though others note tensions with his letters. The article cites: Gerd Theissen and Annette Merz, The Historical Jesus, p. 32; Craig Keener, Acts, New Cambridge Bible Commentary, 2020, p. 49.
- Author, conservative scholars: Conservative scholars keep the traditional view that Luke wrote Acts. He was a doctor and a companion of Paul on his travels, and he also wrote the Gospel of Luke.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-acts/, section "Author and Date". States: Acts continues the Gospel of Luke. Luke, a doctor and companion of Paul on his travels, wrote both books.
- Written: By tradition, about AD 62, when the story in Acts ends. An older view adds that it was probably written in Rome.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-acts/. States: Acts closes with Paul under house arrest about AD 62, and many scholars take that as the time of writing.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FActs_of_the_Apostles&oldid=11541844. States: Written no earlier than AD 61 or 62 and no later than about the end of AD 63, probably in Rome.
- Written, critical scholars: Most scholars date it to about AD 80 to 90, after the fall of Jerusalem.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Acts_of_the_Apostles&oldid=1385107055, section "Title, unity of Luke-Acts, authorship and date". States: Most scholars date it to AD 80 to 90, as it uses Mark, looks back on the fall of Jerusalem, and shows no knowledge of the letters of Paul. The article cites: James H. Charlesworth, The Historical Jesus: An Essential Guide, 2008.
- Written, conservative scholars: Acts ends about AD 62 with Paul still awaiting trial. Since it does not tell of his defence or release, many scholars hold that it was written then.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-acts/. States: Acts ends about AD 62 with Paul under arrest. Because it leaves out his defence and release, many scholars assume it was written at that time.
- What it is: A history of the early church, from when Jesus went up to heaven to the time of Paul in Rome. It continues Luke and also addresses Theophilus.
  - Berean Standard Bible. States: Chapter 1 addresses Theophilus, refers to the first book, and has Jesus taken up. Chapter 28 ends with Paul two full years in a rented house in Rome.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-acts/. States: Acts follows on from Luke and is dedicated to Theophilus.

### Romans (`romans`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-romans/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Romans&oldid=1378304133 .

- Author: Paul, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-romans/. States: Names the apostle Paul as the writer, to the Christians in Rome.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FRomans%2C_Epistle_to_the&oldid=739867. States: Paul is the writer. Gaius of Corinth was his host at the time, and Phoebe took the letter to Rome.
- Written: By tradition, about AD 57, probably in Corinth.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-romans/. States: Paul probably wrote it in Corinth in AD 57, on his third journey as a missionary.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FRomans%2C_Epistle_to_the&oldid=739867. States: Probably written at Corinth, early in AD 58, before Paul went up to Jerusalem.
- What it is: A letter that explains the gospel for Jews and non-Jews, then turns to daily Christian life. Paul wrote it to the believers in Rome before he had visited them.
  - Berean Standard Bible. States: 1:7 is addressed to all in Rome. 1:13 says Paul often planned to come but was prevented. 12:1 begins the call to daily holy living.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FRomans%2C_Epistle_to_the&oldid=739867. States: The letter sets out the gospel for Jew and Gentile, then gives practical commands in 12:1 to 15:13, then greetings.
- No detail: the sources show no dispute for the Author fact or the Written fact.

### 1 Corinthians (`1-corinthians`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-corinthians/ . Wikipedia https://en.wikipedia.org/w/index.php?title=First_Epistle_to_the_Corinthians&oldid=1379310716 .

- Author: Paul, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-corinthians/. States: Names the apostle Paul as the writer, to the church at Corinth.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FCorinthians%2C_First_Epistle_to_the&oldid=734543. States: Paul wrote it. No critic of any school has doubted that he did.
- Written: By tradition, about AD 54, in Ephesus, near the end of Paul's three years there.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-corinthians/. States: Written in spring of AD 53, 54, or 55, close to the end of Paul's three years of work in Ephesus.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FCorinthians%2C_First_Epistle_to_the&oldid=734543. States: Written from Ephesus, see 16:8, in Paul's third year there, probably AD 57.
- What it is: A letter to the church in Corinth about divisions, sexual conduct, worship, and the resurrection of the dead. Paul answers news he had heard and a letter the church had sent him.
  - Berean Standard Bible. States: 1:2 names the church in Corinth. 1:11 reports quarrels. 7:1 answers what they wrote. Chapter 15 is on the resurrection.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-corinthians/. States: Paul received news by word of mouth and a letter from the church. It struggled with division, immorality, idols, and confused teaching.
- No detail: the sources show no dispute for the Author fact or the Written fact.

### 2 Corinthians (`2-corinthians`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-2-corinthians/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Second_Epistle_to_the_Corinthians&oldid=1348875221 .

- Author: Paul, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-2-corinthians/. States: Names the apostle Paul as the writer. It was his fourth letter to the church at Corinth.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FCorinthians%2C_Second_Epistle_to_the&oldid=734544. States: Paul wrote it after Titus came back from Corinth with good news.
- Written: By tradition, about AD 55 to 56, in Macedonia, about a year after 1 Corinthians.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-2-corinthians/. States: Paul wrote from Macedonia around AD 55 or 56, roughly one year after 1 Corinthians.
- What it is: A letter in which Paul defends his work as an apostle and asks for money for poor believers in Judea. He sent it to the Corinthian church and to the believers across Achaia.
  - Berean Standard Bible. States: 1:1 greets Corinth and all Achaia. 1:16 names Judea. Chapters 8 and 9 are on the gift for the saints. 10:1 starts Paul's defence.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FCorinthians%2C_Second_Epistle_to_the&oldid=734544. States: Contents: Paul's work and love for them, the collection for poor believers in Judea, and the defence of his claim to be an apostle.
- No detail: the sources show no dispute for the Author fact or the Written fact.

### Galatians (`galatians`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-galatians/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Galatians&oldid=1381112578 .

- Author: Paul, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-galatians/. States: Names the apostle Paul as the writer.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FGalatians%2C_Epistle_to_the&oldid=6960740. States: Nobody questions that the letter is genuine. All accept that Paul wrote it.
- Written: By tradition, about AD 48, probably from Antioch in Syria. An older view places it in Corinth in the late 50s AD.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-galatians/. States: Written about AD 48. Paul probably wrote from Antioch in Syria, his home church, before the Jerusalem council.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FGalatians%2C_Epistle_to_the&oldid=6960740. States: Written after the Jerusalem council, in the winter of AD 57 to 58, while Paul stayed in Corinth.
- What it is: A letter in which Paul argues that non-Jewish believers do not need circumcision or the law of Moses. He wrote it to the churches of Galatia.
  - Berean Standard Bible. States: 1:2 is to the churches of Galatia. 1:6 rebukes a turn to another gospel. 5:2 warns against circumcision. 6:15 says neither counts.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FGalatians%2C_Epistle_to_the&oldid=6960740. States: The main question is whether the Jewish law bound Christians. Paul also defends his authority as an apostle.
- No detail: the sources show no dispute for the Author fact or the Written fact.

### Ephesians (`ephesians`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-ephesians/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Ephesians&oldid=1383596087 .

- Author: Paul, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-ephesians/. States: Names the apostle Paul as the writer, to the churches of Ephesus and the region around it.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FEphesians%2C_Epistle_to_the&oldid=735484. States: Paul wrote it at Rome, close in time to Colossians.
- Author, critical scholars: Many scholars doubt that Paul wrote it, because its style, words, and view of the end times differ from his. A survey in 2011 found 39 of 109 scholars for Paul, 42 against, and 28 unsure.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Ephesians&oldid=1383596087, section "Lead". States: Many modern scholars reject the attribution to Paul. The article cites: Bart D. Ehrman, The New Testament: A Historical Introduction to the Early Christian Writings (2004), pp. 381-384; Raymond E. Brown, The Churches the Apostles Left Behind (1984), p. 47.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Ephesians&oldid=1383596087, section "Composition: Authorship". States: Recent challenges to Paul as writer rest on syntax, terms, and teaching on the end that are unlike his. The article cites: Harold W. Attridge and Wayne A. Meeks, editors, The HarperCollins Study Bible, revised edition (2006), pp. 1982-83.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Ephesians&oldid=1383596087, section "Composition: Authorship". States: A 2011 British New Testament Conference survey: 39 of 109 scholars for Paul, 42 against, 28 not sure. The article cites: Paul Foster, Who Wrote 2 Thessalonians? A Fresh Look at an Old Problem, Journal for the Study of the New Testament 35.2 (2012), pp. 150-175.
- Author, conservative scholars: Conservative scholars keep the traditional view that Paul wrote it.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-ephesians/, section "Author, Date, and Recipients". States: Paul wrote the letter to the churches in and around Ephesus. The page gives no grounds for this.
- Written: By tradition, about AD 62, while Paul was in prison in Rome.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-ephesians/. States: Written about AD 62 while Paul was a prisoner in Rome, at the time of Colossians and Philemon.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FEphesians%2C_Epistle_to_the&oldid=735484. States: Written from Rome in Paul's first imprisonment, about the year 62.
- Written, critical scholars: Many scholars who doubt that Paul wrote it date it to about AD 70 to 100.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Ephesians&oldid=1383596087, section "Lead". States: Many modern scholars reject Paul as writer and place the letter in AD 70 to 100. The article cites: Bart D. Ehrman, The New Testament: A Historical Introduction to the Early Christian Writings (2004), pp. 381-384; Raymond E. Brown, The Churches the Apostles Left Behind (1984), p. 47.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Ephesians&oldid=1383596087, section "Place, date, and purpose of the writing of the letter". States: Scholars who reject Paul as writer put the letter in AD 70 to 80. The article cites: Markus Barth, Ephesians: Introduction, Translation, and Commentary on Chapters 1-3 (1974), pp. 50-51.
- Written, conservative scholars: Conservative scholars keep the traditional date of about AD 62. They place it during the house arrest of Paul in Rome, told in Acts 28.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-ephesians/, section "Author, Date, and Recipients". States: Paul wrote it about AD 62 as a prisoner in Rome, at the time of Colossians and Philemon. Tychicus and Onesimus carried the three letters.
- What it is: A letter about God's plan in Christ, the church as one body, and how believers should live day to day. It opens with a greeting to the saints in Ephesus.
  - Berean Standard Bible. States: 1:1 greets the saints in Ephesus. 4:4 speaks of one body. 6:20 calls the writer an ambassador in chains.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FEphesians%2C_Epistle_to_the&oldid=735484. States: Contents: blessings of the gospel, unity in the church in 4:1 to 16, and commands for ordinary life in 4:17 to 6:10.

### Philippians (`philippians`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-philippians/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Philippians&oldid=1379537322 .

- Author: Paul, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-philippians/. States: Names the apostle Paul as the writer, to the Christians at Philippi.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FPhilippians%2C_Epistle_to_the&oldid=759916. States: Paul wrote it while he was in bonds in Rome.
- Written: By tradition, about AD 62, while Paul was in prison, probably in Rome.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-philippians/. States: Paul wrote from prison, probably in Rome, about AD 62.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FPhilippians%2C_Epistle_to_the&oldid=759916. States: Written in Rome during Paul's two years in bonds, probably early in AD 62 or late in 61.
- What it is: A letter that thanks the church for its gifts and urges unity and joy in the Lord. Paul wrote it to the believers at Philippi while he was in chains.
  - Berean Standard Bible. States: 1:1 is to Philippi. 1:7 tells of Paul's chains. 4:2 urges unity. 4:4 urges joy. 4:18 thanks them for gifts.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FPhilippians%2C_Epistle_to_the&oldid=759916. States: The church sent Epaphroditus with gifts for Paul, and Paul sent this letter back with him.
- No detail: the sources show no dispute for the Author fact or the Written fact.

### Colossians (`colossians`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-colossians/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Colossians&oldid=1383782061 .

- Author: Paul, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-colossians/. States: Names the apostle Paul as the writer, to Christians in Colossae, a small city.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FColossians%2C_Epistle_to_the&oldid=734542. States: Paul wrote it at Rome in his first imprisonment. Nobody has questioned that it is genuine.
- Author, critical scholars: Many scholars think an early follower of Paul wrote it, because of its words, style, and teaching. A survey in 2011 found 56 of 109 scholars for Paul, 17 against, and 36 unsure.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Colossians&oldid=1383782061, section "Lead". States: Many scholars doubt Paul and credit an early follower, while others still defend it as his. The article cites: F. L. Cross, editor, The Oxford Dictionary of the Christian Church (2005), entry Colossians, Epistle to the.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Colossians&oldid=1383782061, section "Composition: Authorship". States: Grounds against Paul: words found nowhere else in his letters, a hymn-like style, and teaching on Christ and the end with no parallel in his other letters. The article cites: Helmut Koester, Introduction to the New Testament, vol. 2 (1982); Werner Georg Kummel, Introduction to the New Testament (1975); The New Jerome Biblical Commentary (1990), p. 876.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Colossians&oldid=1383782061, section "Composition: Authorship". States: A 2011 British New Testament Conference survey: 56 of 109 scholars for Paul, 17 against, 36 not sure. The article cites: Paul Foster, Who Wrote 2 Thessalonians? A Fresh Look at an Old Problem, Journal for the Study of the New Testament 35.2 (2012), pp. 150-175.
- Author, conservative scholars: Conservative scholars keep the traditional view that Paul wrote it.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-colossians/, section "Author, Date, and Recipients". States: Paul wrote the letter to the Christians of Colossae. The page gives no grounds for this.
- Written: By tradition, about AD 62, during Paul's imprisonment, probably in Rome.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-colossians/. States: Probably written about AD 62 while Paul was a prisoner in Rome, near the time of Ephesians and Philemon.
- Written, critical scholars: A standard Bible commentary holds that Paul did not write it. It dates the letter after his lifetime, between AD 70 and 80.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Colossians&oldid=1383782061, section "Authorship, footnote". States: A footnote quotes The New Jerome Biblical Commentary: the letter came after the life of Paul, between AD 70 and AD 80. The article cites: The New Jerome Biblical Commentary (1990), p. 877.
- Written, conservative scholars: Conservative scholars keep the view that it was probably written about AD 62. Paul was then in prison, probably in Rome, when he also wrote Ephesians and Philemon.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-colossians/, section "Author, Date, and Recipients". States: Probably about AD 62, with Paul a prisoner in Rome, near the time of Ephesians and Philemon. The Setting section says the prison was probably in Rome.
- What it is: A letter that sets Christ above all creation and warns the church against false teaching. It names Paul and Timothy as senders and greets the believers at Colossae.
  - Berean Standard Bible. States: 1:1 and 1:2 name Paul and Timothy and greet the saints at Colossae. 1:15 calls the Son firstborn over all creation. 2:8 warns against empty philosophy.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FColossians%2C_Epistle_to_the&oldid=734542. States: Its aim was to oppose false teaching. Chapters 1 and 2 are doctrine and chapters 3 and 4 are practical.
- Accepted by Arthur on 2026-11-13, so not on the Not verified list:
  - Colossians, critical strength: the lead of the Wikipedia article says many scholars doubt Paul. A footnote in the Authorship section quotes a reference work that says most modern scholars doubt him. The draft uses many and gives the 2011 survey.

### 1 Thessalonians (`1-thessalonians`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-thessalonians/ . Wikipedia https://en.wikipedia.org/w/index.php?title=First_Epistle_to_the_Thessalonians&oldid=1384544583 .

- Author: Paul, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-thessalonians/. States: Names Paul as the writer, to the church at Thessalonica.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FThessalonians%2C_Epistles_to_the&oldid=6957629. States: It was the first of the letters of Paul.
- Written: By tradition, about AD 50, probably in Corinth.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-thessalonians/. States: Probably written from Corinth in AD 49 to 51, on Paul's second journey as a missionary.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FThessalonians%2C_Epistles_to_the&oldid=6957629. States: Almost surely written from Corinth, early in Paul's stay there, about the end of AD 52.
- What it is: A letter of thanks and encouragement, with teaching on holy living and the coming Day of the Lord. It comes from Paul, Silvanus, and Timothy to the church of the Thessalonians.
  - Berean Standard Bible. States: 1:1 names Paul, Silvanus, Timothy, and the Thessalonian church. 4:3 calls them to holiness. 5:2 says the Day comes like a thief.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FThessalonians%2C_Epistles_to_the&oldid=6957629. States: Paul wrote after Timothy's report, to correct errors and to urge a pure life.
- No detail: the sources show no dispute for the Author fact or the Written fact.

### 2 Thessalonians (`2-thessalonians`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-2-thessalonians/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Second_Epistle_to_the_Thessalonians&oldid=1380546028 .

- Author: Paul, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-2-thessalonians/. States: The apostle Paul sent the church a second letter after news reached him.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FThessalonians%2C_Epistles_to_the&oldid=6957629. States: Paul wrote the second letter to correct a wrong reading of the first.
- Author, critical scholars: Critical commentators are about evenly split on whether Paul wrote it. A wider survey of 111 scholars in 2011 found 63 for Paul, 13 against, and 35 unsure.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Second_Epistle_to_the_Thessalonians&oldid=1380546028, section "Lead and Composition". States: Critical commentators divide roughly evenly on whether Paul wrote it. The article cites: James D. G. Dunn, The Theology of Paul the Apostle (2006), p. 13 n. 39.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Second_Epistle_to_the_Thessalonians&oldid=1380546028, section "Lead". States: Those who reject Paul point to differences of style and theology from 1 Thessalonians. The article cites: David E. Aune, editor, The Blackwell Companion to the New Testament (2010), p. 517.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Second_Epistle_to_the_Thessalonians&oldid=1380546028, section "Composition". States: A 2011 British New Testament Conference survey: 63 of 111 scholars for Paul, 13 against, 35 not sure. The article cites: Paul Foster, Who Wrote 2 Thessalonians? A Fresh Look at an Old Problem, Journal for the Study of the New Testament 35.2 (2012), pp. 150-175.
- Author, conservative scholars: Conservative scholars keep the traditional view that Paul wrote it.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-2-thessalonians/, section "Author, Date, and Recipients". States: Paul wrote this second letter soon after the first one. The page gives no grounds for his authorship.
- Written: By tradition, about AD 50, soon after 1 Thessalonians. Paul was probably in Corinth.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-2-thessalonians/. States: Sent soon after 1 Thessalonians, in AD 49 to 51. Paul was probably in Corinth then.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FThessalonians%2C_Epistles_to_the&oldid=6957629. States: Probably also from Corinth, a few months after the first letter.
- Written, critical scholars: Scholars who think a later writer wrote it date it to about AD 80 to 115.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Second_Epistle_to_the_Thessalonians&oldid=1380546028, section "Lead". States: Those who judge it a later work, not by Paul, give a date near AD 80 to 115. The article cites: Maarten J. J. Menken, 2 Thessalonians (2002), p. 65.
- Written, conservative scholars: Conservative scholars date it to AD 49 to 51, soon after 1 Thessalonians, with Paul probably in Corinth. Paul wrote after he heard that the church believed the day of the Lord was already here.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-2-thessalonians/, section "Author, Date, and Recipients". States: Soon after the first letter, Paul heard that the church believed the day of the Lord was already here. He wrote in AD 49 to 51, probably from Corinth.
- What it is: A letter that corrects a mistaken view about the Lord's return and warns against idle living. It names Paul, Silvanus, and Timothy as senders and goes to the church of the Thessalonians.
  - Berean Standard Bible. States: 1:1 names Paul, Silvanus, and Timothy. 2:2 to 2:3 deny that the Day has already come. 3:6 and 3:11 warn about idle lives.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-2-thessalonians/. States: The church had come to believe that the Lord's day had already arrived.

### 1 Timothy (`1-timothy`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-timothy/ . Wikipedia https://en.wikipedia.org/w/index.php?title=First_Epistle_to_Timothy&oldid=1380614415 .

- Author: Paul, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-timothy/. States: Names the apostle Paul as the writer, to his coworker Timothy.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FTimothy%2C_First_Epistle_to&oldid=740108. States: Paul wrote it after he left Ephesus for Macedonia.
- Author, critical scholars: Most scholars think a later Christian wrote it in Paul's name, in words and a style unlike his. A small and shrinking number of scholars still hold that Paul wrote it.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=First_Epistle_to_Timothy&oldid=1380614415, section "Lead". States: Most modern scholars place the pastoral letters after Paul's death. A small group, getting smaller, still argues for Paul. The article cites: C. Drury, The Pastoral Epistles, in J. Barton and J. Muddiman, editors, The Oxford Bible Commentary (2001), p. 1220.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=First_Epistle_to_Timothy&oldid=1380614415, section "Authorship". States: Most scholars now hold that an unnamed Christian wrote the three letters to Timothy and Titus. One cited work says unknown authors wrote them under the name of Paul. The article cites: Raymond F. Collins, 1 & 2 Timothy and Titus: A Commentary (2004), p. 4; David E. Aune, editor, The Blackwell Companion to the New Testament (2010), p. 9.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=First_Epistle_to_Timothy&oldid=1380614415, section "Authorship". States: Evidence given: 306 words Paul does not use, a different style, and a church order more developed than in Paul's time. The article cites: Stephen L. Harris, The New Testament: A Student's Introduction, 4th edition (2002), p. 366.
- Author, conservative scholars: Conservative scholars keep the traditional view that Paul wrote it.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-timothy/, section "Author, Date, and Recipient". States: Paul wrote it, probably in the mid 60s AD, on a journey that the Bible does not record. The word probably seems to apply to the date.
- Written: By tradition, the 60s AD, between Paul's first and last imprisonments in Rome. The place is not known, but an older view names Macedonia.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-timothy/. States: Probably written in the mid 60s AD, between Paul's first and final imprisonments in Rome. The setting panel says the place is unknown.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FTimothy%2C_First_Epistle_to&oldid=740108. States: Paul wrote it from Macedonia, probably Philippi, between his two imprisonments.
- Written, critical scholars: Most scholars date it after Paul's death, between the late 1st century and the middle of the 2nd century AD.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=First_Epistle_to_Timothy&oldid=1380614415, section "Authorship". States: Scholars place the unnamed writer between the late 1st and the mid 2nd century. Most scholars now hold this view. The article cites: Bart D. Ehrman, The New Testament: A Historical Introduction to the Early Christian Writings (2003), p. 393; Raymond F. Collins, 1 & 2 Timothy and Titus: A Commentary (2004), p. 4.
- Written, conservative scholars: Conservative scholars keep the view that Paul probably wrote it in the 60s AD. He wrote on a journey after the events in Acts, between his two imprisonments in Rome.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-timothy/, section "Author, Date, and Recipient". States: Probably the mid 60s AD, on a journey after Acts, between the first and last Roman imprisonments. The Setting section gives AD 62 to 64 and an unknown place.
- What it is: A letter of instruction on worship, church leaders, and false teaching. It names Paul as its writer and Timothy, at Ephesus, as its reader.
  - Berean Standard Bible. States: 1:1 to 1:3 name Paul and Timothy and ask Timothy to stay at Ephesus. 3:1 is on overseers.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FTimothy%2C_First_Epistle_to&oldid=740108. States: Mainly advice on the worship and order of the church, and on holding to the truth among errors.

### 2 Timothy (`2-timothy`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-2-timothy/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Second_Epistle_to_Timothy&oldid=1380613086 .

- Author: Paul, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-2-timothy/. States: Paul is the writer of this second letter to Timothy.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FTimothy%2C_Second_Epistle_to&oldid=740109. States: Paul wrote it from Rome as a prisoner for the second time, and Tychicus carried it.
- Author, critical scholars: Since the early 1800s, more and more scholars think an unknown follower of Paul wrote it in his name. A number of scholars still hold that Paul wrote it.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Second_Epistle_to_Timothy&oldid=1380613086, section "Lead". States: From the early 19th century, a growing number of scholars see the pastoral letters as by an unnamed follower of Paul. The article cites: Luke Timothy Johnson, The First and Second Letters to Timothy (2001); Stephen L. Harris, Understanding the Bible (1985), pp. 340-45.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Second_Epistle_to_Timothy&oldid=1380613086, section "Lead". States: A number of scholars continue to defend Paul as the writer. The article cites: Luke Timothy Johnson, The First and Second Letters to Timothy (2001); N. T. Wright, Paul: A Biography (2018).
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Second_Epistle_to_Timothy&oldid=1380613086, section "Authorship". States: Some scholars call the writer, who is taken to have used the name of Paul, the Pastor. The article cites: Stephen L. Harris, Understanding the Bible (1985), pp. 340-45.
- Author, conservative scholars: Conservative scholars keep the traditional view that Paul wrote it.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-2-timothy/, section "Author, Date, and Recipient". States: Paul wrote it to Timothy from his second prison term in Rome, a short time before he died. The page gives no grounds for his authorship.
- Written: By tradition, about AD 65, in Rome, while Paul was in prison for the second time, shortly before his death.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-2-timothy/. States: Written in Paul's second Roman imprisonment, not long before he died, probably AD 64 to 65. Some date it as late as 67.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FTimothy%2C_Second_Epistle_to&oldid=740109. States: Probably written a year or so after 1 Timothy, from Rome, during Paul's second imprisonment.
- Written, critical scholars: Some critical scholars date it to about AD 90 to 140.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Second_Epistle_to_Timothy&oldid=1380613086, section "Authorship". States: Some modern critical scholars give the pastoral letters to an unnamed writer of AD 90 to 140. The article cites: Felix Just, New Testament Letter Structure, Catholic Resources; Raymond F. Collins, 1 & 2 Timothy and Titus: A Commentary (2004), p. 4; Stephen L. Harris, Understanding the Bible (1985).
- Written, conservative scholars: Conservative scholars date it to the second prison term of Paul in Rome, probably AD 64 or 65. In chapter 4, Paul says that he expects to die soon.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-2-timothy/, section "Author, Date, and Recipient". States: Written in a second Roman imprisonment, after Acts 28, shortly before Paul died. Probably AD 64 to 65, some say up to 67. Paul expects death, 4:6 to 8.
- What it is: A personal letter that urges Timothy to endure hardship and asks him to come quickly. It names Paul as its writer, a prisoner who expects to die soon.
  - Berean Standard Bible. States: 1:8 calls Paul the Lord's prisoner. 2:3 asks Timothy to share in suffering. 4:6 says his departure is near. 4:9 says come quickly.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FTimothy%2C_Second_Epistle_to&oldid=740109. States: Paul asks Timothy to come before winter and urges him to bear persecution. He expects to die soon.

### Titus (`titus`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-titus/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Epistle_to_Titus&oldid=1380618954 .

- Author: The apostle Paul, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-titus/. States: Paul the apostle is the writer, and Titus, who worked with him, is the receiver.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FTitus%2C_Epistle_to&oldid=4546647. States: Treats the letter as written by Paul after his visit to Crete.
- Author, critical scholars: Most scholars think all three letters to Timothy and Titus were written after Paul's death, by someone using his name.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=First_Epistle_to_Timothy&oldid=1380614415, section "Authorship". States: The article on 1 Timothy says most scholars hold that the three letters to Timothy and Titus are not by Paul and came after his death. The article cites: Bart D. Ehrman, The New Testament: A Historical Introduction (2003), p. 393. Raymond F. Collins, 1 & 2 Timothy and Titus (2004), p. 4.
- Author, conservative scholars: Conservative scholars keep the traditional view that Paul wrote it.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-titus/, section "Author, Date, and Recipient". States: Paul wrote the letter to Titus, who worked with him. The page gives no grounds for this.
- Written: By tradition, the 60s AD, after the first imprisonment of Paul in Rome. The place is not known, but an older view names Nicopolis in Epirus.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-titus/. States: Probably the mid 60s AD, between the first imprisonment of Paul in Rome and a later one. The Setting gives about AD 62 to 64, place unknown.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FTitus%2C_Epistle_to&oldid=4546647. States: Paul wrote it from Nicopolis in Epirus after his release from prison in Rome, about AD 66 or 67.
- Written, critical scholars: Scholars who doubt Paul wrote it date it from the 80s AD to the late 2nd century AD. Most of them place it between about AD 80 and 100.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Epistle_to_Titus&oldid=1380618954, section "Opposition to Pauline authenticity". States: Scholars who reject Paul as the writer date it from the 80s AD to the late 2nd century, and most of them put it between AD 80 and 100. The article cites: Raymond E. Brown, An Introduction to the New Testament, Anchor Bible, pages 662 and 668. The article gives no year for this work..
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Epistle_to_Titus&oldid=1380618954, section "Opposition to Pauline authenticity". States: A Church of England lectionary commentary agrees and places these letters in the late 1st or early 2nd century. The article cites: Houlden and Rogerson, Common Worship Lectionary: a Scriptures Commentary, 2001.
- Written, conservative scholars: Conservative scholars keep the view that Paul probably wrote it in the 60s AD. That was after his first imprisonment in Rome, told in Acts 28, and before his second.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-titus/, section "Author, Date, and Recipient". States: Probably the mid 60s AD, between the Roman imprisonment of Acts 28 and a later one that Acts does not tell. The Setting section gives AD 62 to 64.
- What it is: A letter from Paul to Titus, whom he left in Crete to appoint elders in each town. It also warns against false teachers and urges good works.
  - Berean Standard Bible. States: Titus 1:5: Paul left Titus in Crete to appoint elders. 1:10: deceivers of the circumcision. 3:14: devote themselves to good works. 3:15: greetings.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-titus/. States: Paul left Titus in Crete. False teachers were a problem, and the letter deals with elders and Christian living.

### Philemon (`philemon`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-philemon/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Epistle_to_Philemon&oldid=1361421780 .

- Author: The apostle Paul, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-philemon/. States: A personal letter that the apostle Paul wrote to Philemon of Colossae.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FPhilemon%2C_Epistle_to&oldid=759921. States: Paul found Onesimus at Rome and sends him back to his master with this letter.
- Written: By tradition, about AD 62, while Paul was a prisoner, probably in Rome.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-philemon/. States: Probably written about AD 62, during the imprisonment of Paul that followed his voyage to Rome.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FPhilemon%2C_Epistle_to&oldid=759921. States: Written from Rome at the same time as Colossians and Ephesians.
- What it is: A short personal letter from Paul, a prisoner, to Philemon and the church in his house. Paul asks him to receive Onesimus back as a dear brother, not as a slave.
  - Berean Standard Bible. States: Philemon 1:1-2: Paul, a prisoner, writes to Philemon and his house church. 1:16: Onesimus, no longer a slave but a beloved brother. 1:25: blessing.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FPhilemon%2C_Epistle_to&oldid=759921. States: A private letter that intercedes for Onesimus, who had left his master Philemon.
- No detail. Written: the article gives Caesarea Maritima or Rome as the place, but cites no source for it. Task 4 condition 1 needs a citation.

### Hebrews (`hebrews`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-hebrews/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Hebrews&oldid=1379598353 .

- Author: The letter does not name its writer, and who wrote it is not known. An older view names Paul.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-hebrews/. States: No one knows who wrote Hebrews. The writer knew Timothy and did not see Jesus himself.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FHebrews%2C_Epistle_to_the&oldid=735504. States: Lists Silas, Clement of Rome, Luke, Barnabas, Apollos, and others as proposed authors, and concludes that Paul was the author.
  - Berean Standard Bible. States: Hebrews 1:1 opens with no name of a writer, and 13:22 to 13:25 closes with no name.
- Written: By tradition, before AD 70, probably in Rome.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-hebrews/. States: Probably written before AD 70.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FHebrews%2C_Epistle_to_the&oldid=735504. States: In all probability written at Rome, and certainly before the destruction of Jerusalem.
- Written, critical scholars: Some scholars date it later, between AD 70 and 100.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Hebrews&oldid=1379598353, section "Date". States: Some scholars hold to a date after the fall of the temple, from AD 70 to 100. The article cites: Harold W. Attridge, The Epistle to the Hebrews, 1989. Ellen Bradshaw Aitken, in Hebrews: Contemporary Methods, New Insights, 2008..
- Written, conservative scholars: Conservative scholars keep the view that it was probably written before AD 70.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-hebrews/, section "Author, Date, and Recipients". States: The writer is not known. The page gives a probable date before AD 70, names no place, and gives no grounds for the date.
- What it is: A long letter of encouragement that presents Jesus as greater than the angels, Moses, and the old priesthood of Israel. By tradition, its first readers were Christians who knew the Jewish faith.
  - Berean Standard Bible. States: Hebrews 1:4: the Son is superior to the angels. 13:22: the writer calls it a word of exhortation. 13:24: greetings.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-hebrews/. States: Hebrews urges endurance and shows Christ above angels, Moses, and the OT priesthood. Its title reflects the ancient view that it was for Jewish Christians and Gentiles drawn to Judaism.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FHebrews%2C_Epistle_to_the&oldid=735504. States: Intended for Jewish converts to the gospel.

### James (`james`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-james/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Epistle_of_James&oldid=1381128437 .

- Author: By tradition, James, the brother of Jesus, who led the church in Jerusalem. An older view also counts him among the twelve apostles.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-james/. States: James wrote it. He was the brother of Jesus and led the Jerusalem church.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJames%2C_Epistle_of&oldid=736087. States: The author was James the Less, the brother of the Lord, whom Easton counts as one of the twelve apostles.
- Author, critical scholars: A widely held view among scholars is that another writer used the name of James.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Epistle_of_James&oldid=1381128437, section "Pseudonymous authorship". States: A prevalent scholarly view holds that someone else wrote the letter under the name of James. The article cites: Pheme Perkins, Reading the New Testament: An Introduction, 2012.
- Author, conservative scholars: Conservative scholars keep the traditional view that Jesus's brother James wrote it. James led the church in Jerusalem, as Acts 15 shows.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-james/, section "Author, Date, and Recipients". States: James wrote it. He was a brother of Jesus, Matthew 13:55, and the head of the church in Jerusalem, Acts 15.
- Written: By tradition, the early 40s AD. An older view places it in Jerusalem in the early 60s AD.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-james/. States: Probably written about AD 40 to 45.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJames%2C_Epistle_of&oldid=736087. States: Written at Jerusalem, where James lived, probably about AD 62.
- Written, critical scholars: Scholars who doubt James wrote it usually date it from the late 1st to the mid 2nd century AD. But the debate now seems to lean toward an earlier date than that.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Epistle_of_James&oldid=1381128437, section "Dating and surviving manuscripts". States: Those who see the letter as pseudonymous generally date it from the late 1st to the mid 2nd century. The article cites: Martin Dibelius, James, 1988.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Epistle_of_James&oldid=1381128437, section "Dating and surviving manuscripts". States: The scholarly debate now appears to favor an early date, on indications and probabilities rather than proof. The article cites: Israel M. Gallarte and Jesus Pelaez, In mari via tua: Philological Studies in Honour of Antonio Pinero, 2016.
- Written, conservative scholars: Conservative scholars keep the view that it was probably written about AD 40 to 45.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-james/, section "Author, Date, and Recipients". States: Probably about AD 40 to 45, to Jewish Christians who lived outside Palestine. The page gives no grounds for the date and names no place of writing.
- What it is: A letter of practical teaching on trials, wisdom, speech, wealth, and faith shown by deeds. It is addressed to the twelve tribes of the Dispersion, meaning Jewish believers who lived outside Palestine.
  - Berean Standard Bible. States: James 1:1: to the twelve tribes of the Dispersion. 1:2: trials. 2:26: faith without deeds is dead. 5:1: the rich. 5:20: closing appeal.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJames%2C_Epistle_of&oldid=736087. States: Addressed to the Jews of the dispersion, to enforce the practical duties of the Christian life.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-james/. States: Written to Jewish Christians outside Palestine about trials, wisdom, speech, wealth, and doing the word.

### 1 Peter (`1-peter`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-peter/ . Wikipedia https://en.wikipedia.org/w/index.php?title=First_Epistle_of_Peter&oldid=1371626542 .

- Author: The apostle Peter, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-peter/. States: Peter the apostle is the author of this letter.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FPeter%2C_First_Epistle_of&oldid=759911. States: Treats the letter as written by Peter, the apostle of hope.
- Author, critical scholars: Most scholars think it comes from a Christian circle in Rome linked to Peter, not from the apostle himself. Many note that the writer seems trained in Greek, rhetoric, and philosophy, unlike a fisherman from Galilee.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=First_Epistle_of_Peter&oldid=1371626542, section "Authorship". States: Most scholars judge the letter to come from Christian tradition at Rome tied to Peter, not from Peter in person. The article cites: Steve Moyise, The Old Testament in the New, 2004. Stephen L. Harris, Understanding the Bible, 1992. Adela Collins, Mark, 2007. David G. Horrell and Travis B. Williams, 1 Peter, 2023..
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=First_Epistle_of_Peter&oldid=1371626542, section "Authorship". States: Many scholars reject Peter as author because the writer shows schooling in rhetoric, philosophy, and advanced Greek, which a Galilean fisherman would not usually have. The article cites: Paul Achtemeier, 1 Peter, Hermeneia, 1996.
- Author, conservative scholars: Conservative scholars keep the traditional view that the apostle Peter wrote it. The letter names Peter as its writer, and the writer calls himself a witness of Christ's sufferings.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-peter/. States: Peter wrote it, as 1:1 shows. Once a fisherman, he became a disciple, and 5:1 calls him a witness of what Christ suffered.
- Written: By tradition, the early 60s AD, probably in Rome. An older view places it in Babylon on the Euphrates.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-peter/. States: Written about AD 62 to 63, probably from Rome. Babylon in 5:13 almost certainly means Rome.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FPeter%2C_First_Epistle_of&oldid=759911. States: Written from Babylon on the Euphrates. Easton gives no date.
  - Berean Standard Bible. States: 1 Peter 5:13: the church in Babylon sends greetings.
- Written, critical scholars: Most scholars think it was written after the death of Peter and the other apostles.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=First_Epistle_of_Peter&oldid=1371626542, section "Authorship". States: A quoted passage in a citation states that most scholars see the letter as pseudonymous and from the period after the apostles. The article cites: Stephen L. Harris, Understanding the Bible, 1992, page 388.
- Written, conservative scholars: Conservative scholars date it to about AD 62 or 63, under the emperor Nero, probably in Rome. In 1 Peter 5:13, they read the name Babylon as almost certainly meaning Rome.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-peter/, section "Author, Date, and Recipients". States: Peter probably wrote from Rome about AD 62 to 63, while Nero ruled. The page takes Babylon in 5:13 as almost certainly a name for Rome.
- What it is: A letter that encourages Christians to stay hopeful and faithful while they suffer. It is sent to exiles scattered through five regions of Asia Minor, in what is now Turkey.
  - Berean Standard Bible. States: 1 Peter 1:1: to exiles in five regions: Pontus, Galatia, Cappadocia, Asia, Bithynia. 1:3: a living hope. 5:10: suffering a little while.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-peter/. States: Written to encourage readers to endure suffering. The five named regions lie in Asia Minor, which is modern Turkey.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FPeter%2C_First_Epistle_of&oldid=759911. States: Gives comfort and hope, and counsels steadfastness under persecution. Names the provinces of Asia Minor.
- Accepted by Arthur on 2026-11-13, so not on the Not verified list:
  - 1 Peter written detail: the source places the letter after the time of the apostles but gives no years for that period. I wrote no years.

### 2 Peter (`2-peter`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-2-peter/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Second_Epistle_of_Peter&oldid=1376928962 .

- Author: The apostle Peter, by tradition.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-2-peter/. States: Peter calls himself an apostle and an eyewitness of the transfiguration.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FPeter%2C_Second_Epistle_of&oldid=759912. States: The weight of evidence favors the apostle whose name it bears.
- Author, critical scholars: Most critical scholars think one or more followers of Peter wrote it in his name. They cite its differences from 1 Peter, its use of Jude, and little support from early church writers.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Second_Epistle_of_Peter&oldid=1376928962, section "Lead, and Authorship and date". States: Most critical scholars regard the letter as pseudepigraphal, written by one or more followers of Peter under his name. The article cites: Raymond E. Brown, Introduction to the New Testament, 1997. Bart Ehrman, Misquoting Jesus, 2005..
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Second_Epistle_of_Peter&oldid=1376928962, section "Authorship and date". States: Reasons given include language unlike 1 Peter, apparent use of Jude, possible hints of 2nd century gnosticism, a delayed second coming, and weak support from outside the letter. The article cites: Robert M. Grant, A Historical Introduction to the New Testament, chapter 14. The article gives no year for this work..
- Author, conservative scholars: The letter names Peter as an apostle. The writer says he was with Jesus on the mountain and saw him in glory, at 1:16 to 18.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-2-peter/. States: Peter calls himself an apostle in 1:1, and in 1:16 to 1:18 claims to have seen the transfiguration with his own eyes.
- Written: By tradition, the mid 60s AD, shortly before Peter died, probably from a prison in Rome.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-2-peter/. States: Probably written from prison in Rome, not long before his execution, during AD 64 to 67.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FPeter%2C_Second_Epistle_of&oldid=759912. States: Written a short time before the apostle died, from 1:14.
- Written, critical scholars: Scholars give dates from about AD 60 to 150. Critical scholars generally place it in the 2nd century AD.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Second_Epistle_of_Peter&oldid=1376928962, section "Authorship and date". States: Scholars date the letter anywhere from about AD 60 to 150. The article cites: J. Duff, 2 Peter, in John Barton and John Muddiman, editors, Oxford Bible Commentary, 2001.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Second_Epistle_of_Peter&oldid=1376928962, section "Authorship and date". States: The general critical view dates it within the 2nd century. The article cites: Bart D. Ehrman, Forged, 2011.
- Written, conservative scholars: The writer says his death is near, so the letter comes from late in the life of Peter.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-2-peter/. States: Pointing to 1:12 to 1:15, the page dates the letter shortly before the execution of Peter, during AD 64 to 67.
- What it is: A farewell letter that warns against false teachers and answers those who mock the promise of the Lord's coming. It calls itself the second letter to its readers.
  - Berean Standard Bible. States: 2 Peter 1:14: his death is near. 3:1: my second letter to you. 3:4: scoffers ask about the promise of His coming. 3:18: praise.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-2-peter/. States: Peter writes a final reminder and combats false teachers. Peter says he is writing a second letter to the same people.

### 1 John (`1-john`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-3-john/ . Wikipedia https://en.wikipedia.org/w/index.php?title=First_Epistle_of_John&oldid=1380152678 .

- Author: The letter does not name its writer. By tradition, the apostle John, the son of Zebedee.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-3-john/. States: The three letters were probably written by John the son of Zebedee.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJohn%2C_First_Epistle_of&oldid=736103. States: Written by John the evangelist, whom Easton also calls the apostle.
  - Berean Standard Bible. States: 1 John 1:1 to 1:4 opens with no name of a writer, and 5:21 closes with no name.
- Author, critical scholars: Most critical scholars hold that the apostle John wrote none of the five books that tradition credits to him.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=First_Epistle_of_John&oldid=1380152678, section "Authorship". States: Most critical scholars judge that the apostle John was not the writer of any Johannine work. The article cites: Stephen L. Harris, Understanding the Bible, 1985. Joseph F. Kelly, History and Heresy, 2012..
- Author, conservative scholars: Conservative scholars hold that all three letters of John are probably by John, the son of Zebedee.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-3-john/, section "Author, Date, and Recipients". States: The three letters are probably the work of John, son of Zebedee. The page says he also wrote the Gospel of John and Revelation.
- Written: By tradition, about AD 85, in Ephesus, late in the life of John.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-3-john/. States: Written from Ephesus no later than the 90s AD. The Setting section gives about AD 85.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJohn%2C_First_Epistle_of&oldid=736103. States: Probably written at Ephesus, late in the life of the writer.
- Written, critical scholars: A standard textbook dates it between about AD 95 and 110, probably in Ephesus.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=First_Epistle_of_John&oldid=1380152678, section "Lead". States: The article puts the letter in Ephesus, probably, between AD 95 and 110, and cites one textbook. The article cites: Stephen L. Harris, Understanding the Bible, 1985.
- Written, conservative scholars: Conservative scholars date it to about AD 85, and no later than the 90s AD. John likely wrote it from Ephesus, where he had apparently moved about AD 70.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-3-john/, section "Author, Date, and Recipients; The Setting of 1 John". States: The three letters date from no later than the 90s AD, from Ephesus. The Setting section gives about AD 85 and says John apparently moved to Ephesus near AD 70.
- What it is: A letter about walking in the light, loving one another, and faith in Jesus as God's Son. It has no greeting, and it warns its readers against those who deny the Son.
  - Berean Standard Bible. States: 1 John 1:1: no greeting. 1:7: walk in the light. 2:22: one who denies the Son. 4:7: love one another. 5:13: believers in the Son.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-3-john/. States: First John calls its readers to return to true doctrine, obedient living, and devotion, and speaks of the antichrist and assurance of eternal life.

### 2 John (`2-john`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-3-john/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Second_Epistle_of_John&oldid=1380152630 .

- Author: By tradition, the apostle John, the son of Zebedee. The writer calls himself the elder.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-3-john/. States: All three letters were probably written by John the son of Zebedee.
  - Berean Standard Bible. States: 2 John 1:1: The elder, to the chosen lady and her children.
- Author, critical scholars: Most critical scholars hold that the apostle John wrote none of the five books credited to him. This letter is one of the five.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=First_Epistle_of_John&oldid=1380152678, section "Authorship". States: The article on 1 John says most critical scholars conclude that the apostle John wrote none of the Gospel of John, Revelation, and the three letters of John. The article cites: Stephen L. Harris, Understanding the Bible (1985), p. 355. Joseph F. Kelly, History and Heresy (2012), p. 115.
- Author, conservative scholars: Conservative scholars hold that all three letters of John are probably by John, the son of Zebedee.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-3-john/, section "Author, Date, and Recipients". States: One page covers the three letters. They are probably the work of John, son of Zebedee. The page gives no grounds for this.
- Written: By tradition, in Ephesus, no later than the 90s AD.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-3-john/. States: Written from Ephesus no later than the 90s AD.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJohn%2C_Third_Epistle_of&oldid=736108. States: In the entry for the Third Epistle: the Second and Third Epistles were probably written soon after the First, and from Ephesus.
- What it is: A short letter from the elder to the chosen lady and her children. It urges love and warns against deceivers who deny that Jesus came in the flesh.
  - Berean Standard Bible. States: 2 John 1:1: the elder to the chosen lady. 1:5: love one another. 1:7: deceivers deny Jesus came in the flesh. 1:13: greetings.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJohn%2C_Second_Epistle_of&oldid=736106. States: Addressed to the elect lady, who is commended and warned against false teachers.

### 3 John (`3-john`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-3-john/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Third_Epistle_of_John&oldid=1382161569 .

- Author: By tradition, the apostle John, the son of Zebedee. The writer calls himself the elder.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-3-john/. States: All three letters were probably written by John the son of Zebedee.
  - Berean Standard Bible. States: 3 John 1:1: The elder, to the beloved Gaius.
- Author, critical scholars: Most critical scholars hold that the apostle John wrote none of the five books credited to him. This letter is one of the five.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=First_Epistle_of_John&oldid=1380152678, section "Authorship". States: The article on 1 John says most critical scholars conclude that the apostle John wrote none of the Gospel of John, Revelation, and the three letters of John. The article cites: Stephen L. Harris, Understanding the Bible (1985), p. 355. Joseph F. Kelly, History and Heresy (2012), p. 115.
- Author, conservative scholars: Conservative scholars hold that all three letters of John are probably by John, the son of Zebedee.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-3-john/, section "Author, Date, and Recipients". States: One page covers the three letters. They are probably the work of John, son of Zebedee. The page gives no grounds for this.
- Written: By tradition, in Ephesus, no later than the 90s AD.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-1-3-john/. States: Written from Ephesus no later than the 90s AD.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJohn%2C_Third_Epistle_of&oldid=736108. States: The Second and Third Epistles were probably written soon after the First, and from Ephesus.
- What it is: A short personal letter from the elder to Gaius. It praises his help for traveling believers and warns about Diotrephes, who refuses to welcome them.
  - Berean Standard Bible. States: 3 John 1:1: the elder to Gaius. 1:5: help for traveling brothers. 1:10: Diotrephes refuses to welcome them. 1:14: closing.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJohn%2C_Third_Epistle_of&oldid=736108. States: Addressed to Gaius, to commend Christians who had come to him as preachers of the gospel.

### Jude (`jude`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-jude/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Epistle_of_Jude&oldid=1381122352 .

- Author: By tradition, Jude, a brother of both James and Jesus. An older view counts him among the twelve apostles, as Judas, also called Lebbaeus and Thaddaeus.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-jude/. States: Jude wrote it. He was the brother of James and of Jesus.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJude%2C_Epistle_of&oldid=736126. States: The author was Judas, the brother of James the Less, also called Lebbaeus and Thaddaeus.
  - Berean Standard Bible. States: Matthew 10:2 to 3 and Mark 3:18 list Thaddaeus among the twelve apostles.
- Author, critical scholars: Scholars still debate who the writer was. One view is that a later writer used the name of Jude to make the letter carry more weight.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Epistle_of_Jude&oldid=1381122352, section "Authorship". States: Scholars still argue whether the writer was the apostle Jude, the brother of Jesus, both of these, or neither. The article cites: Richard J. Bauckham, Jude, 2 Peter, Word Biblical Commentary, 1983.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Epistle_of_Jude&oldid=1381122352, section "Authorship". States: One possibility it gives is that the letter is pseudepigrapha, falsely pointing to the better known Jude to gain authority. The article cites: Bart Ehrman, Forgery and Counterforgery, 2012. Bo Reicke, The Epistles of James, Peter, and Jude, 1964..
- Author, conservative scholars: Conservative scholars keep the traditional view that Jude, a brother of James and of Jesus, wrote it. In Matthew 13:55, Jesus has a brother Judas, and in Greek Judas and Jude are one name.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-jude/, section "Author, Date, and Recipients". States: Jude, brother of James and of Jesus, wrote it. Matthew 13:55 and Mark 6:3 name a brother Judas, which is the same Greek name as Jude.
- Written: By tradition, the mid 60s AD, apparently in Palestine.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-jude/. States: The likely date is the mid 60s AD. No place given.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJude%2C_Epistle_of&oldid=736126. States: May have been written about AD 66 or 70, and apparently in Palestine.
- Written, critical scholars: The date is not known, and proposals run from about AD 50 to 110. Scholars who doubt that Jude wrote it generally prefer the later dates, about AD 90 to 110 or after.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Epistle_of_Jude&oldid=1381122352, section "Date". States: Nobody knows the date. Suggestions range loosely from about AD 50 to 110, AD 90 to 110 if it reflects a settled church, and later if it attacks Gnosticism. The article cites: Jerome H. Neyrey, 2 Peter, Jude, Anchor Bible, 1993. Peter S. Perry, Jude, in The Oxford Encyclopedia of the Books of the Bible, 2011..
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Epistle_of_Jude&oldid=1381122352, section "Date". States: Scholars who think the letter is pseudonymous generally prefer the later dates, because of its Greek and how it speaks of the apostles. The article cites: Norman Perrin and Dennis C. Duling, The New Testament: An Introduction, second edition, 1982. Richard J. Bauckham, Jude, 2 Peter, 1983..
- Written, conservative scholars: Conservative scholars keep the view that it probably dates from the mid 60s AD. Jude and 2 Peter share material, so they are dated close together.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-jude/. States: Jude and 2 Peter treat a similar situation and have a literary link, so they are usually dated near each other. Jude itself has little evidence for a date.
- What it is: A short letter that calls believers to stand firm for the faith against ungodly men who crept in. It is addressed to those who are called, loved, and kept.
  - Berean Standard Bible. States: Jude 1:1: from a brother of James to the called, loved, and kept. 1:3 to 1:4: contend for the faith against men who crept in.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-jude/. States: Jude warns against false teachers who have come into the church and urges the church to defend the faith.

### Revelation (`revelation`)

Review: draft. Fixed source pages: ESV https://www.esv.org/resources/esv-global-study-bible/introduction-to-revelation/ . Wikipedia https://en.wikipedia.org/w/index.php?title=Book_of_Revelation&oldid=1382810217 .

- Author: By tradition, the apostle John, the son of Zebedee. The writer calls himself John.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-revelation/. States: John, son of Zebedee, the beloved disciple, recorded these visions.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FRevelation%2C_Book_of&oldid=739847. States: The author was John the apostle. His name occurs four times in the book.
  - Berean Standard Bible. States: Revelation 1:1, 1:4, 1:9, and 22:8: the writer names himself John.
- Author, critical scholars: Modern scholarship generally does not identify the writer with the apostle John. Many hold that nothing is known of him beyond his work as a Christian prophet.
  - Wikipedia, https://en.wikipedia.org/w/index.php?title=Book_of_Revelation&oldid=1382810217, section "Lead, explanatory note". States: A note says modern biblical scholarship generally departs from the early writers who named John the Apostle, and many think only his role as a prophet is known. The article cites: Adela Yarbro Collins, Crisis and Catharsis: The Power of the Apocalypse, 1984. Richard Bauckham, The Theology of the Book of Revelation, 1993..
- Author, conservative scholars: Conservative scholars keep the traditional view that the writer was John, the son of Zebedee. They hold that he also wrote the Gospel of John and the three letters of John.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-revelation/, section "Author and Date". States: Jesus gave the vision to his servant John, the disciple whom Jesus loved and a son of Zebedee. This John also wrote the Gospel and 1 to 3 John.
- Written: By tradition, the mid 90s AD, on the island of Patmos.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-revelation/. States: John recorded these visions on Patmos, an island, in the mid 90s AD.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FRevelation%2C_Book_of&oldid=739847. States: The date has generally been fixed in the reign of Domitian, in the mid 90s AD. Some argue for an earlier date under Nero.
  - Berean Standard Bible. States: Revelation 1:9: John was on the island of Patmos.
- What it is: A book of prophetic visions, opened by letters to seven churches in Asia, a Roman province, now western Turkey. It describes the conflict between God and evil and ends with a new heaven and earth.
  - Berean Standard Bible. States: Revelation 1:4: John to the seven churches in the province of Asia. 21:1: a new heaven and a new earth. 22:21: closing.
  - Easton's Bible Dictionary, https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FRevelation%2C_Book_of&oldid=739847. States: The only prophetical book of the New Testament. Describes the conflict between good and evil.
  - ESV Global Study Bible, https://www.esv.org/resources/esv-global-study-bible/introduction-to-revelation/. States: Addressed to seven churches in Asia, a Roman province that is now western Turkey. Reveals the conflict between God and Satan and the new heaven and earth.

## Not verified

Arthur reads this list. It has only the items that the rules of Tasks 4b and 4c and Arthur's decisions of 2026-11-13 do not settle. Number of items: 2.

1. Period, the time of the judges: no approved source gives the year when the time of the judges began. The site gives only the end, before about 1050 BC.
2. Period, Greek rule: no approved source gives the year when Greek rule ended, or states 332 BC as its start. The site uses the end of Persian rule as the start of Greek rule.
