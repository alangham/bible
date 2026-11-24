# Task 53: the introductions against Wikipedia and Easton's Bible Dictionary

Date: 2026-11-23. This report changes no page of the site, no statement of `public/data/intros.json`, and no record of `docs/CONTENT-SOURCES.md`.

## The result

- Check 1, the 92 `critical` parts: 85 SUPPORTED, 3 STRONGER, 3 WEAKER, 1 ONE SCHOLAR. Of the 7 that are not SUPPORTED, the accuracy reviewer confirmed 1.
- Check 2, the 119 `author` and `written` statements whose record names Easton: 97 SUPPORTED, 19 STRONGER, 2 WEAKER, 1 NOT IN THE PAGE. The accuracy reviewer confirmed 10 of 22.
- Check 3, the 40 missing details: the page shows a dispute for 17, and the accuracy reviewer confirmed 15 of these. For 11 of the 15, the record gives no reason, or a reason that does not name the doubt.
- Check 4: 28 common views that a `critical` part does not have. The accuracy reviewer confirmed 19.
- Pages: 133 fixed pages. 0 did not load or had a different revision. No page had text addressed to a reader or a model.

## Read first

These are the findings that Arthur must read first, in order of their effect on the site.

1. Check 2, a question of the rule. The two readings do not agree on 12 of the 22 findings of check 2. One of them, F13, is a different question. For most of the other 11, the first reading says that "An older view names Samuel" drops the "probably" of Easton, and the second reading says that "An older view" reports a view and does not assert it. A decision on this reading settles most of these 11 findings: F09, F10, F12, F15, F19, F20, F21, F22, F23, F25, F28. The twelfth, F13, is a different question, in item 9.
2. Check 2, the confirmed findings: 10. Eight statements do not have a hedge word of Easton: Judges, 2 Samuel, 1 Chronicles, Isaiah, Joel, 2 Peter, 1 John, and 3 John. See F08, F11, F14, F17, F18, F26, F27, F29. Two statements are weaker than Easton because their main line follows the ESV page, by rule 3: Ezra `author`, F16, and Philemon `written`, F24.
3. Check 1, the one confirmed finding: F02, Zechariah `authorDetail.critical`. The part says that some think a disciple wrote or edited chapters 9 to 14. The page has "may have been" for the disciple.
4. Check 1, the six findings that are not confirmed. The second reading gives SUPPORTED to F01, F03, F04, F05, and F06. For F07, 1 John `writtenDetail.critical`, both readings find a difference: the first reading calls the line weaker than the page, because it credits a general view of the page to one textbook, and the second reading calls it stronger, because it keeps "probably" for the place only.
5. Check 3, the confirmed disputes: 15 of the 40 missing details. For 4 of them, the record names the point and gives the reason: F36 Jeremiah, F39 and F40 Haggai, F43 Philemon. For the other 11, the record gives no reason, or a reason that does not name the doubt of the page: F30 Joshua, F31 Judges, F32 Ruth, F33 1 Samuel, F34 2 Samuel, F35 Song of Solomon, F37 Lamentations, F41 Galatians, F42 Philippians, F44 Hebrews, F46 3 John.
6. F42, Philippians `writtenDetail`. The record says that the sources show no dispute for the Written fact. The page says that the place of writing is not certain, and names Ephesus and Caesarea Maritima as other places.
7. Check 4, the confirmed findings: 19. Two of them are already in the record, with a decision of Arthur of 2026-11-13: F48 for 1 Chronicles, and F56 for Ezekiel. The other 17 are views that the page gives as common and that a `critical` part does not have, for Nehemiah, Job, Psalms, Isaiah, Nahum, Malachi, Matthew, Luke, Acts, Titus, 1 Peter, 1 John, 3 John, and Jude.
8. F55, Isaiah `writtenDetail.critical`. The page says that the three-collection view still has wide support in 2023. The one citation of that sentence is a website article. The Haggai note of the record says that Task 4 condition 1 does not accept a website.
9. F13, 1 Kings `written`. The first reading says that "By tradition" is not in the Easton page, because Easton gives the date 561 to 538 BC as its own conclusion. The second reading gives SUPPORTED. The approved sources table of `docs/CONTENT-SOURCES.md` gives Easton the role of the traditional author, date, and place.
10. Two points outside the four checks. Lamentations `written` says "by an eyewitness". The Lamentations page says in one place that the writers need not have seen the events, and in a different place it calls the fourth and fifth poems eyewitness reports. Hosea `written` says "just before the northern kingdom of Israel fell", and the Hosea page puts most of the book in the reign of Jeroboam II, about 793 to 753 BCE.

## How I did the checks

1. I got each fixed page with the MediaWiki API, by its `oldid`: `action=parse`, `prop=text|revid`. I made a text copy of each page outside the repository. The first line of each text copy gives the title, the `oldid` of the record, and the revision of the answer.
2. Six agents read the text copies, each for one group of 11 books. Each agent used only the text copies as evidence, and wrote each finding in its own words, with one phrase of the page of 15 words or fewer.
3. The first text copies had no footnotes. One agent found a statement that rests on a footnote. I made the text copies again with the footnote markers and the footnote lists, and the six agents did their checks again with the new copies.
4. The strength rule: a statement that does not have a hedge word of its page, such as "probably" or "most probably", is STRONGER than the page.
5. The accuracy reviewer agent read each finding that is not SUPPORTED a second time, in three runs. For checks 1 to 3 it got the statement, the record, the text copy, and the question, but not the first verdict. For check 4 it got the view of the finding, and it read the page to say if the view is there and common. A finding is "confirmed" when the two readings agree. Each other finding is "not confirmed", with the two readings.
6. A finding has a number, F01 to F74, in the order: check 1, check 2, check 3, check 4, and the Bible order in each check.

## Check 1: the `critical` parts

One row for each of the 92 parts, in the order of the Bible. "Status" is for the findings that are not SUPPORTED.

| No. | Book | Field | Verdict | Finding | Status |
|---|---|---|---|---|---|
| 1 | Genesis | `authorDetail.critical` | SUPPORTED |  |  |
| 2 | Genesis | `writtenDetail.critical` | SUPPORTED |  |  |
| 3 | Exodus | `authorDetail.critical` | SUPPORTED |  |  |
| 4 | Exodus | `writtenDetail.critical` | SUPPORTED |  |  |
| 5 | Leviticus | `authorDetail.critical` | SUPPORTED |  |  |
| 6 | Leviticus | `writtenDetail.critical` | SUPPORTED |  |  |
| 7 | Numbers | `authorDetail.critical` | SUPPORTED |  |  |
| 8 | Numbers | `writtenDetail.critical` | SUPPORTED |  |  |
| 9 | Deuteronomy | `authorDetail.critical` | SUPPORTED |  |  |
| 10 | Deuteronomy | `writtenDetail.critical` | SUPPORTED |  |  |
| 11 | Joshua | `writtenDetail.critical` | SUPPORTED |  |  |
| 12 | Judges | `authorDetail.critical` | SUPPORTED |  |  |
| 13 | Ruth | `writtenDetail.critical` | SUPPORTED |  |  |
| 14 | 1 Samuel | `writtenDetail.critical` | SUPPORTED |  |  |
| 15 | 2 Samuel | `writtenDetail.critical` | SUPPORTED |  |  |
| 16 | 1 Kings | `authorDetail.critical` | SUPPORTED |  |  |
| 17 | 1 Kings | `writtenDetail.critical` | SUPPORTED |  |  |
| 18 | 2 Kings | `authorDetail.critical` | SUPPORTED |  |  |
| 19 | 2 Kings | `writtenDetail.critical` | SUPPORTED |  |  |
| 20 | 1 Chronicles | `authorDetail.critical` | SUPPORTED |  |  |
| 21 | 1 Chronicles | `writtenDetail.critical` | SUPPORTED |  |  |
| 22 | 2 Chronicles | `authorDetail.critical` | SUPPORTED |  |  |
| 23 | 2 Chronicles | `writtenDetail.critical` | SUPPORTED |  |  |
| 24 | Ezra | `authorDetail.critical` | SUPPORTED |  |  |
| 25 | Nehemiah | `authorDetail.critical` | SUPPORTED |  |  |
| 26 | Nehemiah | `writtenDetail.critical` | SUPPORTED |  |  |
| 27 | Esther | `writtenDetail.critical` | SUPPORTED |  |  |
| 28 | Job | `authorDetail.critical` | SUPPORTED |  |  |
| 29 | Job | `writtenDetail.critical` | SUPPORTED |  |  |
| 30 | Psalms | `authorDetail.critical` | SUPPORTED |  |  |
| 31 | Psalms | `writtenDetail.critical` | SUPPORTED |  |  |
| 32 | Proverbs | `authorDetail.critical` | SUPPORTED |  |  |
| 33 | Proverbs | `writtenDetail.critical` | SUPPORTED |  |  |
| 34 | Ecclesiastes | `authorDetail.critical` | SUPPORTED |  |  |
| 35 | Ecclesiastes | `writtenDetail.critical` | SUPPORTED |  |  |
| 36 | Song of Solomon | `writtenDetail.critical` | SUPPORTED |  |  |
| 37 | Isaiah | `authorDetail.critical` | SUPPORTED |  |  |
| 38 | Isaiah | `writtenDetail.critical` | SUPPORTED |  |  |
| 39 | Jeremiah | `authorDetail.critical` | SUPPORTED |  |  |
| 40 | Ezekiel | `authorDetail.critical` | SUPPORTED |  |  |
| 41 | Daniel | `authorDetail.critical` | SUPPORTED |  |  |
| 42 | Daniel | `writtenDetail.critical` | SUPPORTED |  |  |
| 43 | Joel | `authorDetail.critical` | SUPPORTED |  |  |
| 44 | Joel | `writtenDetail.critical` | SUPPORTED |  |  |
| 45 | Amos | `authorDetail.critical` | SUPPORTED |  |  |
| 46 | Amos | `writtenDetail.critical` | SUPPORTED |  |  |
| 47 | Obadiah | `writtenDetail.critical` | SUPPORTED |  |  |
| 48 | Jonah | `writtenDetail.critical` | SUPPORTED |  |  |
| 49 | Micah | `authorDetail.critical` | SUPPORTED |  |  |
| 50 | Micah | `writtenDetail.critical` | SUPPORTED |  |  |
| 51 | Nahum | `writtenDetail.critical` | SUPPORTED |  |  |
| 52 | Habakkuk | `authorDetail.critical` | SUPPORTED |  |  |
| 53 | Zephaniah | `writtenDetail.critical` | STRONGER | F01 | not confirmed |
| 54 | Zechariah | `authorDetail.critical` | STRONGER | F02 | confirmed |
| 55 | Zechariah | `writtenDetail.critical` | SUPPORTED |  |  |
| 56 | Malachi | `authorDetail.critical` | WEAKER | F03 | not confirmed |
| 57 | Malachi | `writtenDetail.critical` | ONE SCHOLAR | F04 | not confirmed |
| 58 | Matthew | `authorDetail.critical` | SUPPORTED |  |  |
| 59 | Matthew | `writtenDetail.critical` | SUPPORTED |  |  |
| 60 | Mark | `authorDetail.critical` | SUPPORTED |  |  |
| 61 | Mark | `writtenDetail.critical` | SUPPORTED |  |  |
| 62 | Luke | `authorDetail.critical` | WEAKER | F05 | not confirmed |
| 63 | Luke | `writtenDetail.critical` | SUPPORTED |  |  |
| 64 | John | `authorDetail.critical` | SUPPORTED |  |  |
| 65 | Acts | `authorDetail.critical` | SUPPORTED |  |  |
| 66 | Acts | `writtenDetail.critical` | SUPPORTED |  |  |
| 67 | Ephesians | `authorDetail.critical` | SUPPORTED |  |  |
| 68 | Ephesians | `writtenDetail.critical` | SUPPORTED |  |  |
| 69 | Colossians | `authorDetail.critical` | SUPPORTED |  |  |
| 70 | Colossians | `writtenDetail.critical` | SUPPORTED |  |  |
| 71 | 2 Thessalonians | `authorDetail.critical` | SUPPORTED |  |  |
| 72 | 2 Thessalonians | `writtenDetail.critical` | SUPPORTED |  |  |
| 73 | 1 Timothy | `authorDetail.critical` | SUPPORTED |  |  |
| 74 | 1 Timothy | `writtenDetail.critical` | SUPPORTED |  |  |
| 75 | 2 Timothy | `authorDetail.critical` | SUPPORTED |  |  |
| 76 | 2 Timothy | `writtenDetail.critical` | SUPPORTED |  |  |
| 77 | Titus | `authorDetail.critical` | SUPPORTED |  |  |
| 78 | Titus | `writtenDetail.critical` | SUPPORTED |  |  |
| 79 | Hebrews | `writtenDetail.critical` | SUPPORTED |  |  |
| 80 | James | `authorDetail.critical` | SUPPORTED |  |  |
| 81 | James | `writtenDetail.critical` | SUPPORTED |  |  |
| 82 | 1 Peter | `authorDetail.critical` | SUPPORTED |  |  |
| 83 | 1 Peter | `writtenDetail.critical` | SUPPORTED |  |  |
| 84 | 2 Peter | `authorDetail.critical` | STRONGER | F06 | not confirmed |
| 85 | 2 Peter | `writtenDetail.critical` | SUPPORTED |  |  |
| 86 | 1 John | `authorDetail.critical` | SUPPORTED |  |  |
| 87 | 1 John | `writtenDetail.critical` | WEAKER | F07 | not confirmed |
| 88 | 2 John | `authorDetail.critical` | SUPPORTED |  |  |
| 89 | 3 John | `authorDetail.critical` | SUPPORTED |  |  |
| 90 | Jude | `authorDetail.critical` | SUPPORTED |  |  |
| 91 | Jude | `writtenDetail.critical` | SUPPORTED |  |  |
| 92 | Revelation | `authorDetail.critical` | SUPPORTED |  |  |

### The findings of check 1

#### F01. Zephaniah, `writtenDetail.critical`: STRONGER

- The statement: "Some scholars keep the time of Josiah. Others think editors expanded an early core of messages after Judah fell in 586 BC, or later still."
- The first reading: The lead says some scholars hold that the book was 'probably' made under Josiah (Renz 2021; Timmer 2024), and others that an early core grew and was edited in the exile or later (Quine 2021; Hagedorn 2011). The section Authorship and date says others date part of the book after 586 BC, when Judah fell (Berlin et al. 2004). The statement drops the hedge 'probably' of the Josiah view.
- Evidence, a phrase of the page: "the book was probably composed during the reign of Josiah"
- The section of the page: Lead; Authorship and date
- The address: <https://en.wikipedia.org/w/index.php?title=Book_of_Zephaniah&oldid=1381816563>
- The reading of the accuracy reviewer: SUPPORTED. The lead says some scholars argue the book was probably written under Josiah, while others hold that an early core of oracles was enlarged in or after the exile. The body names Richards and DeRouchie for the Josiah view without a hedge, and says others put part of the book after 586 BC, when Judah fell. Section: Lead; Authorship and date.
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Make the strength word match the page: keep the hedge 'probably' of the Josiah view.

#### F02. Zechariah, `authorDetail.critical`: STRONGER

- The statement: "Most modern scholars think at least two writers produced the book. Some think a disciple of the prophet wrote or edited chapters 9 to 14."
- The first reading: Most modern scholars hold that at least two people wrote the book (Coogan 2009, p. 346). Some believe that the writer or editor of chapters 9 to 14 'may have been' a disciple of Zechariah (Meyers, New Interpreter's Study Bible, 2003). The first sentence matches. The second sentence drops the hedge 'may have been'.
- Evidence, a phrase of the page: "the writer(s) or editor(s) of Second Zechariah may have been a disciple"
- The section of the page: Authorship
- The address: <https://en.wikipedia.org/w/index.php?title=Book_of_Zechariah&oldid=1336450203>
- The reading of the accuracy reviewer: STRONGER. The page gives 'most modern scholars' for two or more writers, which matches. For chapters 9 to 14 it says only that some think a follower of the prophet possibly wrote or edited them (Meyers 2003). The part drops the hedge 'may have been', a small difference. Section: Authorship.
- Status: confirmed.
- A change: Make the strength word match the page: keep the hedge 'may have been' in the disciple view.

#### F03. Malachi, `authorDetail.critical`: WEAKER

- The statement: "Some scholars think the writer is unknown and that Malachi, meaning my messenger, is a title rather than a name. Others argue from the grammar that it is a name."
- The first reading: The section says the identity of the author is uncertain, and some scholars count the book as anonymous. It reports from Easton that some scholars take the name as an abbreviation of 'messenger of Yah', not a proper noun. It then says that 'many' take the name as a pen name with no known person behind it. A different group, among them the editors of the Catholic Encyclopedia, argue from the grammar that it is a name. The statement has 'Some' where the page has 'many' for the pen-name view. The 'many' sentence has no footnote marker. The 'some scholars' sentences cite Easton and Eissfeldt 1965, p. 440; the grammar view cites van Hoonacker 1910.
- Evidence, a phrase of the page: "many believe that "Malachi" is an anonymous pseudonym"
- The section of the page: Authorship
- The address: <https://en.wikipedia.org/w/index.php?title=Book_of_Malachi&oldid=1383150392>
- The reading of the accuracy reviewer: SUPPORTED. The page says some scholars (Eissfeldt cited) count the book anonymous and some (Easton cited) read Malachi as no proper name, adds that many take it as a pseudonym, and says other scholars, the Catholic Encyclopedia among them, argue from grammar that it is a name. The part uses 'some' and 'others' for these, which is not stronger than the page, and 'other scholars' with one citation is a general view that rule 5 permits. Section: Authorship.
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Make the strength word match the page: 'many' for the pseudonym view.

#### F04. Malachi, `writtenDetail.critical`: ONE SCHOLAR

- The statement: "Most scholars think editors added to the book in several stages. Its oldest parts date to about 500 BC, and it was almost complete by about 180 BC."
- The first reading: The lead body says most scholars believe the book went through several stages of redaction (Kessler 2011), the oldest parts are from about 500 BCE, and later changes came in the Hellenistic period. The date 'about 180 BC' is only in footnote 6, a quotation of Aaron Schart, Oxford Handbook of the Minor Prophets (2021): Sirach names the twelve prophets around 180 BCE, so at that time the book 'must have been almost finished'. That is the reasoning of one scholar, and the body text does not give it as a general view. The same footnote says Kessler dates the final form to the fourth century.
- Evidence, a phrase of the page: "the book of Malachi must have been almost finished"
- The section of the page: Lead
- The address: <https://en.wikipedia.org/w/index.php?title=Book_of_Malachi&oldid=1383150392>
- The reading of the accuracy reviewer: SUPPORTED. The lead says most scholars see several stages of redaction, with the oldest parts from about 500 BCE and later changes in the Hellenistic period. The 180 BCE point is only in the footnote quotation of Schart, which says the book must have been almost finished by then, and the Period section says the writer of Sirach apparently knew Malachi. Section: Lead, with footnote [6]; Period.
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Name a page statement that gives 'about 180 BC' as a general view, or remove that date and keep what the body states (later changes in the Hellenistic period).

#### F05. Luke, `authorDetail.critical`: WEAKER

- The statement: "Late in the 20th century, critical scholars were about evenly split on whether Luke wrote it. Most now hold that the writer did travel with Paul, but some point to differences with his letters."
- The first reading: The section says that critical opinion on the tradition was judged to be split about equally in the late 20th century (Brown 1997, pp. 267-268), and that most scholars hold that the author travelled with Paul (Keener 2020, Immanuel 2017, Longenecker and Hess 2026; the Keener footnote says 'probably still the majority'). The lead says 'some' cite differences with the letters of Paul (Theissen and Merz 1998; Keener 2020). But the section calls these differences 'the consensus', challenged in recent years. Its footnote names Vielhauer and limits this to German scholarship, challenged by Porter. So the part matches the lead and is weaker than the section.
- Evidence, a phrase of the page: "the consensus that Luke-Acts contains differences in theology and historical narrative"
- The section of the page: Lead; Luke-Acts: unity, authorship and date
- The address: <https://en.wikipedia.org/w/index.php?title=Gospel_of_Luke&oldid=1382641630>
- The reading of the accuracy reviewer: SUPPORTED. Composition says that critical opinion on the tradition was judged to be split about equally in the late 20th century (Brown 1997), and the lead says most critical scholars hold that the writer travelled with Paul, while some cite differences with his letters. Limits: the cited Keener note says only that many scholars hold it, and probably still most, and the body calls the differences with the letters of Paul a 'consensus' that has been challenged. Section: Composition: Luke–Acts: unity, authorship and date; Lead.
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Arthur decides whether the part follows the lead ('some') or the section ('consensus', since challenged), and the strength word then matches that text.

#### F06. 2 Peter, `authorDetail.critical`: STRONGER

- The statement: "Most critical scholars think one or more followers of Peter wrote it in his name. They cite its differences from 1 Peter, its use of Jude, and little support from early church writers."
- The first reading: The lead says most critical scholars take the letter as pseudepigraphal, by one or more followers of Peter. The reasons in the section include the 'apparent' use of Jude and weak external support. The statement drops 'apparent', and the page section 'Relationship with the Epistle of Jude' leaves open which letter copied which, or a common source. The page does not say that the external support means early church writers; that is a reading of 'external support'.
- Evidence, a phrase of the page: "its apparent use of Jude"
- The section of the page: Lead, and Authorship and date
- The address: <https://en.wikipedia.org/w/index.php?title=Second_Epistle_of_Peter&oldid=1376928962>
- The reading of the accuracy reviewer: SUPPORTED. The lead and Authorship and date say most critical scholars take the letter as pseudepigraphal, by one or more followers of Peter, with reasons that include language unlike 1 Peter, apparent use of Jude, and weak external support (Grant). The part drops 'apparent', but the Content section calls Jude the source by scholarly consensus, so I read the part as no stronger than the page. Section: Lead; Authorship and date; Content.
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Make the strength word for the use of Jude match the page.

#### F07. 1 John, `writtenDetail.critical`: WEAKER

- The statement: "A standard textbook dates it between about AD 95 and 110, probably in Ephesus."
- The first reading: The lead states, as the view of the page and with no named scholar in the text, that Ephesus and the years 95 to 110 are probable for the letter. The statement gives this as the view of one textbook. The record says the page cites one textbook, Harris; rule 5 and Task 4c rule 3 keep a general view that the article states with one citation.
- Evidence, a phrase of the page: "probably written in Ephesus between 95 and 110 AD"
- The section of the page: Lead
- The address: <https://en.wikipedia.org/w/index.php?title=First_Epistle_of_John&oldid=1380152678>
- The reading of the accuracy reviewer: STRONGER. The lead gives Ephesus and AD 95 to 110 for the letter, with 'probably', with one citation, Harris, Understanding the Bible. The hedge of the page covers both the place and the date, but the statement keeps it only for the place; the word standard is not in the page, but it follows the example wording of Task 4c step 3. Section: Lead.
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Make the strength match the page, which states the date as a general view with 'probably'.

## Check 2: the older views from Easton's Bible Dictionary

One row for each `author` and `written` statement whose record names an Easton page: 119 statements. The designer counted 29 statements with the words "older view"; check 2 covers these 29 and the other statements whose record names Easton.

| No. | Book | Field | Verdict | Finding | Status |
|---|---|---|---|---|---|
| 1 | Genesis | `author` | SUPPORTED |  |  |
| 2 | Genesis | `written` | SUPPORTED |  |  |
| 3 | Exodus | `author` | SUPPORTED |  |  |
| 4 | Exodus | `written` | SUPPORTED |  |  |
| 5 | Leviticus | `author` | SUPPORTED |  |  |
| 6 | Leviticus | `written` | SUPPORTED |  |  |
| 7 | Numbers | `author` | SUPPORTED |  |  |
| 8 | Numbers | `written` | SUPPORTED |  |  |
| 9 | Deuteronomy | `author` | SUPPORTED |  |  |
| 10 | Deuteronomy | `written` | SUPPORTED |  |  |
| 11 | Joshua | `author` | SUPPORTED |  |  |
| 12 | Joshua | `written` | SUPPORTED |  |  |
| 13 | Judges | `author` | STRONGER | F08 | confirmed |
| 14 | Judges | `written` | SUPPORTED |  |  |
| 15 | Ruth | `author` | STRONGER | F09 | not confirmed |
| 16 | 1 Samuel | `author` | STRONGER | F10 | not confirmed |
| 17 | 2 Samuel | `author` | STRONGER | F11 | confirmed |
| 18 | 1 Kings | `author` | STRONGER | F12 | not confirmed |
| 19 | 1 Kings | `written` | NOT IN THE PAGE | F13 | not confirmed |
| 20 | 2 Kings | `author` | SUPPORTED |  |  |
| 21 | 2 Kings | `written` | SUPPORTED |  |  |
| 22 | 1 Chronicles | `author` | SUPPORTED |  |  |
| 23 | 1 Chronicles | `written` | STRONGER | F14 | confirmed |
| 24 | 2 Chronicles | `author` | SUPPORTED |  |  |
| 25 | 2 Chronicles | `written` | STRONGER | F15 | not confirmed |
| 26 | Ezra | `author` | WEAKER | F16 | confirmed |
| 27 | Ezra | `written` | SUPPORTED |  |  |
| 28 | Nehemiah | `author` | SUPPORTED |  |  |
| 29 | Nehemiah | `written` | SUPPORTED |  |  |
| 30 | Esther | `author` | SUPPORTED |  |  |
| 31 | Esther | `written` | SUPPORTED |  |  |
| 32 | Job | `author` | SUPPORTED |  |  |
| 33 | Job | `written` | SUPPORTED |  |  |
| 34 | Psalms | `author` | SUPPORTED |  |  |
| 35 | Psalms | `written` | SUPPORTED |  |  |
| 36 | Proverbs | `author` | SUPPORTED |  |  |
| 37 | Ecclesiastes | `author` | SUPPORTED |  |  |
| 38 | Ecclesiastes | `written` | SUPPORTED |  |  |
| 39 | Song of Solomon | `author` | SUPPORTED |  |  |
| 40 | Isaiah | `author` | SUPPORTED |  |  |
| 41 | Isaiah | `written` | STRONGER | F17 | confirmed |
| 42 | Jeremiah | `author` | SUPPORTED |  |  |
| 43 | Jeremiah | `written` | SUPPORTED |  |  |
| 44 | Lamentations | `author` | SUPPORTED |  |  |
| 45 | Lamentations | `written` | SUPPORTED |  |  |
| 46 | Ezekiel | `author` | SUPPORTED |  |  |
| 47 | Ezekiel | `written` | SUPPORTED |  |  |
| 48 | Daniel | `author` | SUPPORTED |  |  |
| 49 | Daniel | `written` | SUPPORTED |  |  |
| 50 | Hosea | `author` | SUPPORTED |  |  |
| 51 | Hosea | `written` | SUPPORTED |  |  |
| 52 | Joel | `author` | STRONGER | F18 | confirmed |
| 53 | Joel | `written` | STRONGER | F19 | not confirmed |
| 54 | Amos | `author` | SUPPORTED |  |  |
| 55 | Amos | `written` | SUPPORTED |  |  |
| 56 | Obadiah | `written` | SUPPORTED |  |  |
| 57 | Jonah | `author` | SUPPORTED |  |  |
| 58 | Jonah | `written` | SUPPORTED |  |  |
| 59 | Micah | `author` | SUPPORTED |  |  |
| 60 | Micah | `written` | STRONGER | F20 | not confirmed |
| 61 | Nahum | `author` | SUPPORTED |  |  |
| 62 | Nahum | `written` | SUPPORTED |  |  |
| 63 | Habakkuk | `author` | SUPPORTED |  |  |
| 64 | Habakkuk | `written` | STRONGER | F21 | not confirmed |
| 65 | Zephaniah | `author` | SUPPORTED |  |  |
| 66 | Zephaniah | `written` | SUPPORTED |  |  |
| 67 | Zechariah | `author` | SUPPORTED |  |  |
| 68 | Zechariah | `written` | SUPPORTED |  |  |
| 69 | Malachi | `author` | SUPPORTED |  |  |
| 70 | Matthew | `author` | SUPPORTED |  |  |
| 71 | Matthew | `written` | SUPPORTED |  |  |
| 72 | Mark | `author` | SUPPORTED |  |  |
| 73 | Mark | `written` | SUPPORTED |  |  |
| 74 | Luke | `author` | SUPPORTED |  |  |
| 75 | Luke | `written` | STRONGER | F22 | not confirmed |
| 76 | John | `author` | SUPPORTED |  |  |
| 77 | John | `written` | SUPPORTED |  |  |
| 78 | Acts | `author` | SUPPORTED |  |  |
| 79 | Acts | `written` | SUPPORTED |  |  |
| 80 | Romans | `author` | SUPPORTED |  |  |
| 81 | Romans | `written` | SUPPORTED |  |  |
| 82 | 1 Corinthians | `author` | SUPPORTED |  |  |
| 83 | 1 Corinthians | `written` | SUPPORTED |  |  |
| 84 | 2 Corinthians | `author` | SUPPORTED |  |  |
| 85 | Galatians | `author` | SUPPORTED |  |  |
| 86 | Galatians | `written` | SUPPORTED |  |  |
| 87 | Ephesians | `author` | SUPPORTED |  |  |
| 88 | Ephesians | `written` | SUPPORTED |  |  |
| 89 | Philippians | `author` | SUPPORTED |  |  |
| 90 | Philippians | `written` | SUPPORTED |  |  |
| 91 | Colossians | `author` | SUPPORTED |  |  |
| 92 | 1 Thessalonians | `author` | SUPPORTED |  |  |
| 93 | 1 Thessalonians | `written` | SUPPORTED |  |  |
| 94 | 2 Thessalonians | `author` | SUPPORTED |  |  |
| 95 | 2 Thessalonians | `written` | SUPPORTED |  |  |
| 96 | 1 Timothy | `author` | SUPPORTED |  |  |
| 97 | 1 Timothy | `written` | SUPPORTED |  |  |
| 98 | 2 Timothy | `author` | SUPPORTED |  |  |
| 99 | 2 Timothy | `written` | SUPPORTED |  |  |
| 100 | Titus | `author` | SUPPORTED |  |  |
| 101 | Titus | `written` | STRONGER | F23 | not confirmed |
| 102 | Philemon | `author` | SUPPORTED |  |  |
| 103 | Philemon | `written` | WEAKER | F24 | confirmed |
| 104 | Hebrews | `author` | SUPPORTED |  |  |
| 105 | Hebrews | `written` | SUPPORTED |  |  |
| 106 | James | `author` | SUPPORTED |  |  |
| 107 | James | `written` | STRONGER | F25 | not confirmed |
| 108 | 1 Peter | `author` | SUPPORTED |  |  |
| 109 | 1 Peter | `written` | SUPPORTED |  |  |
| 110 | 2 Peter | `author` | SUPPORTED |  |  |
| 111 | 2 Peter | `written` | STRONGER | F26 | confirmed |
| 112 | 1 John | `author` | SUPPORTED |  |  |
| 113 | 1 John | `written` | STRONGER | F27 | confirmed |
| 114 | 2 John | `written` | STRONGER | F28 | not confirmed |
| 115 | 3 John | `written` | STRONGER | F29 | confirmed |
| 116 | Jude | `author` | SUPPORTED |  |  |
| 117 | Jude | `written` | SUPPORTED |  |  |
| 118 | Revelation | `author` | SUPPORTED |  |  |
| 119 | Revelation | `written` | SUPPORTED |  |  |

### The findings of check 2

#### F08. Judges, `author`: STRONGER

- The statement: "Scripture names no author. An older view names Samuel."
- What it takes from Easton: An older view names Samuel.
- The first reading: Easton says the author was most probably Samuel, from internal evidence. The statement says the older view names Samuel, with no hedge, so it drops Easton's 'most probably'.
- Evidence, a phrase of the page: "was most probably Samuel"
- The address: <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJudges%2C_Book_of&oldid=736128>
- The reading of the accuracy reviewer: STRONGER. Easton says that the author was most probably Samuel, from internal evidence, and that the book was probably composed under Saul or early under David. 'An older view names Samuel' drops the hedge 'most probably', a small difference; carry the hedge of the page. Section: Judges, Book of (last paragraph).
- Status: confirmed.
- A change: Make the strength word match the page: carry Easton's 'most probably' into the older view.

#### F09. Ruth, `author`: STRONGER

- The statement: "The book names no author. An older view, from Jewish tradition, names Samuel."
- What it takes from Easton: An older view, from Jewish tradition, names Samuel.
- The first reading: Easton says the author was probably Samuel, according to Jewish tradition. The statement says the older view names Samuel, with no hedge, so it drops Easton's 'probably'.
- Evidence, a phrase of the page: "was probably Samuel, according to Jewish tradition"
- The address: <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FRuth%2C_Book_of&oldid=739870>
- The reading of the accuracy reviewer: SUPPORTED. Easton says the writer was probably Samuel, according to Jewish tradition. The statement reports this as an older view from Jewish tradition and does not assert it as fact, so it matches. Section: Ruth, Book of (whole entry).
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Make the strength word match the page: carry Easton's 'probably' into the older view.

#### F10. 1 Samuel, `author`: STRONGER

- The statement: "The author is not known. An older view names Samuel, Gad, and Nathan."
- What it takes from Easton: An older view names Samuel, Gad, and Nathan.
- The first reading: Easton says the authors were probably Samuel, Gad, and Nathan: Samuel wrote the first 24 chapters, Gad continued, and Nathan completed the books. The statement names the three with no hedge, so it drops Easton's 'probably'.
- Evidence, a phrase of the page: "were probably Samuel, Gad, and Nathan"
- The address: <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FSamuel%2C_Books_of&oldid=14300183>
- The reading of the accuracy reviewer: SUPPORTED. Easton says the authors were probably Samuel, Gad, and Nathan, with Samuel writing the first 24 chapters of the first book. The statement only reports that an older view names the three, so it is not stronger than the page. Section: Samuel, Books of (second paragraph).
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Make the strength word match the page: carry Easton's 'probably' into the older view.

#### F11. 2 Samuel, `author`: STRONGER

- The statement: "The author is not known. An older view names Gad and Nathan."
- What it takes from Easton: An older view names Gad and Nathan.
- The first reading: Easton names Samuel, Gad, and Nathan as the probable writers of the books of Samuel, with Gad continuing the history and Nathan completing it. The statement names Gad and Nathan with no hedge, so it drops Easton's 'probably'.
- Evidence, a phrase of the page: "were probably Samuel, Gad, and Nathan"
- The address: <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FSamuel%2C_Books_of&oldid=14300183>
- The reading of the accuracy reviewer: STRONGER. Easton names Samuel, Gad, and Nathan as the probable writers of the books of Samuel, with Gad continuing the history and Nathan completing it. The sentences on Gad and Nathan have no hedge of their own but follow the hedged first sentence, so 'names Gad and Nathan' drops 'probably', a small difference. Section: Samuel, Books of (second paragraph).
- Status: confirmed.
- A change: Make the strength word match the page: carry Easton's 'probably' into the older view.

#### F12. 1 Kings, `author`: STRONGER

- The statement: "The book does not name its writer. An older view names Ezra as the compiler, and a tradition names Jeremiah."
- What it takes from Easton: An older view names Ezra as the compiler, and a tradition names Jeremiah.
- The first reading: Easton says the authorship is uncertain. Some facts support 'in some degree' a tradition that Jeremiah wrote Kings, and the statement's 'a tradition names Jeremiah' matches that. For Ezra, Easton gives only 'the more probable supposition'. The statement says the older view names Ezra as the compiler, with no hedge, so it drops that strength word.
- Evidence, a phrase of the page: "But the more probable supposition is that Ezra, after the Captivity, compiled them"
- The address: <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FKings%2C_Books_of&oldid=736129>
- The reading of the accuracy reviewer: SUPPORTED. Easton calls the authorship uncertain, says some facts support a tradition that Jeremiah wrote the books, and calls Ezra compiling them after the exile the more probable supposition. The statement reports both as views, not as facts, so it matches. Section: Kings, Books of (authorship paragraph).
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Make the strength word match the page: carry Easton's 'more probable' into the older view of Ezra.

#### F13. 1 Kings, `written`: NOT IN THE PAGE

- The statement: "By tradition, in the 6th century BC, after Babylon took Jerusalem."
- What it takes from Easton: The 6th century BC, after Babylon took Jerusalem.
- The first reading: Easton dates the composition between 561 BC, the release of Jehoiachin, and 538 BC, the decree of Cyrus. Easton gives this date as its own conclusion from the last chapter of 2 Kings, not as a tradition. The one tradition that the page names is that Jeremiah wrote Kings, and the page gives no date for that tradition. The same entry calls Ezra after the captivity the more probable compiler, which would be later than 538 BC. So 'By tradition' states a fact that the page does not state. Arthur accepted the Ezra problem on 2026-11-13; that acceptance does not cover the words 'By tradition'.
- Evidence, a phrase of the page: "some time between B.C. 561"
- The address: <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FKings%2C_Books_of&oldid=736129>
- The reading of the accuracy reviewer: SUPPORTED. Easton puts the composition between 561 BC, the release of Jehoiachin, and 538 BC, the decree of Cyrus, so after the Babylonian conquest and in the 6th century BC. The same entry calls it more probable that Ezra compiled the books after the Captivity, a point the record already lists as accepted by Arthur on 2026-11-13. Section: Kings, Books of (last paragraph).
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Name a page that gives the 6th-century date as a tradition, or remove 'By tradition' from the line.

#### F14. 1 Chronicles, `written`: STRONGER

- The statement: "In the Persian period, 539 to 332 BC, after the Jews came back from Babylon. An older view gives the 5th century BC."
- What it takes from Easton: An older view gives the 5th century BC.
- The first reading: Easton says there is every ground to conclude that Chronicles was composed after the exile, and gives the years with a hedge word: probably between 450 and 435 BC. The 5th century BC rests on those probable years, and the statement drops 'probably'. The drop is small, because the statement reports what an older view gives.
- Evidence, a phrase of the page: "probably between 450 and 435 B.C."
- The address: <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FChronicles%2C_Books_of&oldid=734537>
- The reading of the accuracy reviewer: STRONGER. Easton puts the composition after the exile, probably between 450 and 435 BC, and gives Jewish tradition for Ezra as the author. The 5th century BC follows from those years, but the statement drops the hedge 'probably', a small difference. Section: Chronicles, Books of (third paragraph).
- Status: confirmed.
- A change: Make the older view carry Easton's strength word 'probably'.

#### F15. 2 Chronicles, `written`: STRONGER

- The statement: "In the Persian period, 539 to 332 BC, after the Jews came back from Babylon. An older view gives the 5th century BC."
- What it takes from Easton: An older view gives the 5th century BC.
- The first reading: Easton says there is every ground to conclude that Chronicles was composed after the exile, and gives the years with a hedge word: probably between 450 and 435 BC. The 5th century BC rests on those probable years, and the statement drops 'probably'. The drop is small, because the statement reports what an older view gives.
- Evidence, a phrase of the page: "probably between 450 and 435 B.C."
- The address: <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FChronicles%2C_Books_of&oldid=734537>
- The reading of the accuracy reviewer: SUPPORTED. Easton puts the writing after the exile, probably between 450 and 435 BC, which lies in the 5th century BC. The statement reports this as an older view and widens it to the century, which is not stronger. Section: Chronicles, Books of (paragraph on the time of composition).
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Make the older view carry Easton's strength word 'probably'.

#### F16. Ezra, `author`: WEAKER

- The statement: "The book does not name its writer, but Ezra wrote the part told in the first person. Either Ezra or a later writer may have put the parts together."
- What it takes from Easton: That Ezra may be the writer who put the parts together.
- The first reading: Easton says Ezra was probably the author of the book, or at least of most of it, as he was of Chronicles. The statement gives Ezra only as one of two possible writers, with 'may'. The main line follows the ESV Global Study Bible, which rule 3 lets lead.
- Evidence, a phrase of the page: "Ezra was probably the author of this book, at least of the greater part"
- The address: <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FEzra%2C_Book_of&oldid=735496>
- The reading of the accuracy reviewer: WEAKER. Easton says Ezra was probably the author of the book, at least of the greater part, and points to 7:27-28 and 8:1. The statement gives Ezra only the first-person part and leaves the compiling open to Ezra or a later writer, which is weaker than Easton; the unhedged first-person claim rests on the ESV GSB, not on Easton. Section: Ezra, Book of (last paragraph).
- Status: confirmed.
- A change: If the record keeps Easton as a source for this statement, give Easton's view as an older view with its strength word 'probably', or remove Easton from this record.

#### F17. Isaiah, `written`: STRONGER

- The statement: "By tradition, the late 8th and early 7th centuries BC. Isaiah was called about 740 BC and outlived the Assyrian king Sennacherib."
- What it takes from Easton: Isaiah served under Uzziah, Jotham, Ahaz, and Hezekiah, and probably lived past Hezekiah into the reign of Manasseh: the late 8th and early 7th centuries.
- The first reading: Easton dates the start of his work to probably 762 BC. It says he in all likelihood outlived Hezekiah, who died in 698 BC, and may have lived into the reign of Manasseh. So the early 7th century rests on hedge words in Easton, and the statement has none. The record's ESV line gives 681 BC with no hedge word; I did not check the ESV page. Point 3 of section 21.2 of docs/DESIGN.md says that 'By tradition' takes the place of an ESV 'probably' in a main line; it does not name Easton. Easton's start date of 762 BC also differs from the 740 BC of the statement, which comes from the ESV line.
- Evidence, a phrase of the page: "in all likelihood outlived that monarch (who died B.C. 698)"
- The address: <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FIsaiah&oldid=735521>
- The reading of the accuracy reviewer: STRONGER. Easton dates the start of Isaiah's work probably to 762 BC and says he in all likelihood outlived Hezekiah, who died 698 BC, and possibly lived into Manasseh's reign, so the early 7th century rests on hedged words in Easton; the ESV gives 681 BC with no hedge. Easton's chronology, with Uzziah dead in 759 BC, does not match 'called about 740 BC' in the same statement, which comes from the ESV. Section: Isaiah (1.), second and fifth paragraphs.
- Status: confirmed.
- A change: Name only the ESV page as the source of the early 7th century, or make the strength word match Easton.

#### F18. Joel, `author`: STRONGER

- The statement: "Joel son of Pethuel, a prophet from Judah, by tradition. Little is known about him."
- What it takes from Easton: Joel lived in Judah.
- The first reading: Easton says Joel was probably a resident of Judah, because his task was to that people. The statement calls him a prophet from Judah with no hedge word. The record's ESV line also gives Judah, with no hedge word; I did not check the ESV page.
- Evidence, a phrase of the page: "Joel was probably a resident in Judah"
- The address: <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJoel%2C_Book_of&oldid=736099>
- The reading of the accuracy reviewer: STRONGER. Easton says Joel was probably a resident of Judah, an inference from his commission to that people, and does not call it a tradition. The statement drops 'probably' and puts the fact under 'by tradition'; the record also names the ESV page for this fact, which I did not check. Section: Joel, Book of (first paragraph).
- Status: confirmed.
- A change: Name only the ESV page as the source of 'from Judah', or make the strength word match Easton.

#### F19. Joel, `written`: STRONGER

- The statement: "Probably after Judah's people came home from the captivity in Babylon, 586 to 538 BC, perhaps about 500 BC. An older view places Joel about 800 BC, when Uzziah was king."
- What it takes from Easton: An older view places Joel about 800 BC, when Uzziah was king.
- The first reading: Easton says Joel probably flourished under Uzziah, about 800 BC. The statement gives this as an older view, but it drops the word 'probably' of Easton. The word 'about' stays.
- Evidence, a phrase of the page: "probably flourished in the reign of Uzziah (about B.C. 800)"
- The address: <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJoel%2C_Book_of&oldid=736099>
- The reading of the accuracy reviewer: SUPPORTED. Easton says Joel probably flourished in the reign of Uzziah, about 800 BC. The statement reports this only as an older view, so it is not stronger than the page. Section: Joel, Book of (second paragraph).
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Make the strength word of the older view match Easton.

#### F20. Micah, `written`: STRONGER

- The statement: "By tradition, the late 8th and early 7th centuries BC, while Jotham, Ahaz, and Hezekiah ruled Judah."
- What it takes from Easton: The ministry of Micah under the three kings, 759 to 698 BC or 743 to 726 BC: the late 8th and early 7th centuries.
- The first reading: Easton gives two ways to count: 759 to 698 BC, about 59 years, or 743 to 726 BC, only 16 years. Only the first reaches the 7th century, and only to 698 BC. The statement gives the late 8th and early 7th centuries as the tradition and does not show the second count. The record's ESV line, from 750 BC for perhaps 20 to 25 years, also ends in the 8th century.
- Evidence, a phrase of the page: "his ministry lasted only sixteen years"
- The address: <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FMicah%2C_Book_of&oldid=759890>
- The reading of the accuracy reviewer: SUPPORTED. Easton gives the reigns of Jotham, Ahaz, and Hezekiah as 759 to 698 BC, or a ministry of 743 to 726 BC by a shorter count, and does not choose. The three kings and the late 8th century are in Easton; the early 7th century reaches only 698 BC in Easton's longer count and rests mainly on the ESV. Section: Micah, Book of (first paragraph).
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Make the span match the two counts of Easton, or name the source that reaches the early 7th century.

#### F21. Habakkuk, `written`: STRONGER

- The statement: "By tradition, late in the 7th century BC, shortly before Babylon invaded Judah. An older view dates it a little earlier, in the mid 7th century BC."
- What it takes from Easton: An older view: a little earlier, in the mid 7th century BC.
- The first reading: Easton says the prophecies were 'probably' written about 650 to 627 BC, or by some views a few years later. The statement gives the older view with no hedge. The range also runs into the third quarter of the century.
- Evidence, a phrase of the page: "probably written about B.C. 650-627, or, as some think, a few years later"
- The address: <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FHabakkuk%2C_Prophecies_of&oldid=5175902>
- The reading of the accuracy reviewer: SUPPORTED. Easton says the prophecies were probably written about 650 to 627 BC, or a few years later in some views. The statement reports this as an older view in the mid 7th century BC, a little before the late-7th-century tradition, which matches. Section: Habakkuk, Prophecies of (first sentence).
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Make the strength word match the page: keep Easton's hedge 'probably' in the older view.

#### F22. Luke, `written`: STRONGER

- The statement: "By tradition, no earlier than about AD 62, just after the last events in Acts. An older view dates it to about AD 60 to 63, a little before Acts."
- What it takes from Easton: An older view: about AD 60 to 63, a little before Acts.
- The first reading: Easton says the date is uncertain, that the gospel came before Acts, and that it was 'probably' written about 60 or 63. The statement gives the older view with no hedge, and gives '60 to 63' where Easton gives '60 or 63'.
- Evidence, a phrase of the page: "written, therefore, probably about 60 or 63"
- The address: <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FLuke%2C_Gospel_according_to&oldid=736155>
- The reading of the accuracy reviewer: SUPPORTED. Easton calls the date uncertain, says the Gospel came before Acts, which is generally dated about 63 or 64, and gives probably about 60 or 63. The statement makes 60 or 63 into the range 60 to 63 and reports it only as an older view, which is not stronger. Section: Luke, Gospel according to (date paragraph).
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Make the strength word match the page: keep Easton's hedge 'probably' in the older view.

#### F23. Titus, `written`: STRONGER

- The statement: "By tradition, the 60s AD, after the first imprisonment of Paul in Rome. The place is not known, but an older view names Nicopolis in Epirus."
- What it takes from Easton: An older view names Nicopolis in Epirus as the place.
- The first reading: Easton gives the journey after Paul's release, and the writing from Nicopolis in Epirus about AD 66 or 67, as a supposition: 'We may warrantably suppose'. The statement says an older view names Nicopolis, with no hedge word.
- Evidence, a phrase of the page: "thence to Nicopolis in Epirus, from which place he wrote to Titus"
- The address: <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FTitus%2C_Epistle_to&oldid=4546647>
- The reading of the accuracy reviewer: SUPPORTED. Easton reasons that Paul wrote to Titus after his release from prison in Rome, from Nicopolis in Epirus, about AD 66 or 67, and calls the route a warranted supposition. The 60s AD, the time after the first imprisonment, and 'an older view names Nicopolis in Epirus' match the page. Section: Titus, Epistle to (second and third paragraphs).
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Make the strength word of the older view match Easton, which gives the place as a supposition.

#### F24. Philemon, `written`: WEAKER

- The statement: "By tradition, about AD 62, while Paul was a prisoner, probably in Rome."
- What it takes from Easton: Rome as the place.
- The first reading: Easton says with no strength word that the letter was written from Rome, at the same time as Colossians and Ephesians. Easton gives no year and does not use the word prisoner. The statement has 'probably in Rome'; the ESV record has 'probably' for the date.
- Evidence, a phrase of the page: "Was written from Rome at the same time as the epistles to the Colossians"
- The address: <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FPhilemon%2C_Epistle_to&oldid=759921>
- The reading of the accuracy reviewer: WEAKER. Easton states with no hedge that the letter was written from Rome, at the same time as Colossians and Ephesians. The statement says 'probably in Rome', which is weaker than Easton; the hedge matches the ESV page that the record also names, which I did not check. Section: Philemon, Epistle to (first paragraph).
- Status: confirmed.
- A change: Make the strength word for the place match its source; Easton has none, and the ESV record has 'probably' only for the date.

#### F25. James, `written`: STRONGER

- The statement: "By tradition, the early 40s AD. An older view places it in Jerusalem in the early 60s AD."
- What it takes from Easton: An older view places it in Jerusalem in the early 60s AD.
- The first reading: Easton places the writing in Jerusalem, in the time between the first and the second Roman imprisonment of Paul, with 'probably' for the year AD 62. The statement gives the early 60s AD with no strength word, so it drops Easton's 'probably'.
- Evidence, a phrase of the page: "probably about A.D. 62"
- The address: <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJames%2C_Epistle_of&oldid=736087>
- The reading of the accuracy reviewer: SUPPORTED. Easton places the writing at Jerusalem, the home of James, in the years between the two Roman imprisonments of Paul, with 'probably' for AD 62. An older view of Jerusalem in the early 60s AD matches this. Section: James, Epistle of, item (3).
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Make the strength word for the date of the older view match Easton.

#### F26. 2 Peter, `written`: STRONGER

- The statement: "By tradition, the mid 60s AD, shortly before Peter died, probably from a prison in Rome."
- What it takes from Easton: Shortly before Peter died.
- The first reading: Easton says that the letter seems to come from a time shortly before the death of the apostle, from 1:14. Easton gives no year and no place. The statement has no strength word for the time; the ESV record has 'probably'.
- Evidence, a phrase of the page: "written shortly before the apostle's death"
- The address: <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FPeter%2C_Second_Epistle_of&oldid=759912>
- The reading of the accuracy reviewer: STRONGER. Easton says that the letter seems to come from a time shortly before the death of the apostle, citing 1:14, and gives no year and no place. 'Shortly before Peter died' drops the hedge 'appears to', a small difference; the mid 60s and Rome come from the ESV, which the record also gives with 'probably'. Section: Peter, Second Epistle of (first paragraph).
- Status: confirmed.
- A change: Make the strength word match Easton, or name the ESV page as the source of this part of the main line.

#### F27. 1 John, `written`: STRONGER

- The statement: "By tradition, about AD 85, in Ephesus, late in the life of John."
- What it takes from Easton: In Ephesus, late in the life of John.
- The first reading: Easton says the letter was probably written at Ephesus, late in the life of the writer. The statement has 'in Ephesus' with no strength word. The conservative part of the same entry has 'likely' for Ephesus.
- Evidence, a phrase of the page: "probably also at Ephesus, and when the writer was in advanced age"
- The address: <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJohn%2C_First_Epistle_of&oldid=736103>
- The reading of the accuracy reviewer: STRONGER. Easton says John the evangelist evidently wrote it, probably at Ephesus, when he was old. The statement gives Ephesus and late life under 'by tradition' with no hedge, so for Ephesus it drops the 'probably' of Easton; the record also names the ESV page, which I did not check. Section: John, First Epistle of (entry).
- Status: confirmed.
- A change: Make the strength word match Easton, or name the ESV page as the source of this part of the main line.

#### F28. 2 John, `written`: STRONGER

- The statement: "By tradition, in Ephesus, no later than the 90s AD."
- What it takes from Easton: In Ephesus.
- The first reading: In the entry for the Third Epistle, Easton says that the second and third letters 'probably' followed the first soon, and came from Ephesus. The statement has 'in Ephesus' with no strength word.
- Evidence, a phrase of the page: "probably written soon after the First, and from Ephesus"
- The address: <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJohn%2C_Third_Epistle_of&oldid=736108>
- The reading of the accuracy reviewer: SUPPORTED. Easton says the two shorter letters 'probably' came soon after the first, from Ephesus. The statement takes only Ephesus from Easton and gives it as tradition. Easton gives no year, and 'no later than the 90s AD' comes from the ESV page. Section: John, Third Epistle of (last sentence).
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Make the strength word match Easton, or name the ESV page as the source of this part of the main line.

#### F29. 3 John, `written`: STRONGER

- The statement: "By tradition, in Ephesus, no later than the 90s AD."
- What it takes from Easton: In Ephesus.
- The first reading: Easton says that the second and third letters 'probably' followed the first soon, and came from Ephesus. The statement has 'in Ephesus' with no strength word.
- Evidence, a phrase of the page: "probably written soon after the First, and from Ephesus"
- The address: <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJohn%2C_Third_Epistle_of&oldid=736108>
- The reading of the accuracy reviewer: STRONGER. Easton says the two shorter letters 'probably' came soon after the first, from Ephesus, and gives no year. 'In Ephesus' drops the 'probably' of Easton, a small difference. The 90s AD come from the ESV page, not from Easton. Section: John, Third Epistle of (second paragraph).
- Status: confirmed.
- A change: Make the strength word match Easton, or name the ESV page as the source of this part of the main line.

## Check 3: a dispute that does not show

One row for each of the 40 missing details: 21 entries with no `authorDetail` and 19 with no `writtenDetail`. "Dispute" is "yes" when the fixed Wikipedia page of the book says that scholars doubt the traditional author, date, or place.

| No. | Book | Missing | Dispute | Finding | Status |
|---|---|---|---|---|---|
| 1 | Joshua | `authorDetail` | yes | F30 | confirmed |
| 2 | Judges | `writtenDetail` | yes | F31 | confirmed |
| 3 | Ruth | `authorDetail` | yes | F32 | confirmed |
| 4 | 1 Samuel | `authorDetail` | yes | F33 | confirmed |
| 5 | 2 Samuel | `authorDetail` | yes | F34 | confirmed |
| 6 | Ezra | `writtenDetail` | no |  |  |
| 7 | Esther | `authorDetail` | no |  |  |
| 8 | Song of Solomon | `authorDetail` | yes | F35 | confirmed |
| 9 | Jeremiah | `writtenDetail` | yes | F36 | confirmed |
| 10 | Lamentations | `authorDetail` | yes | F37 | confirmed |
| 11 | Lamentations | `writtenDetail` | no |  |  |
| 12 | Ezekiel | `writtenDetail` | no |  |  |
| 13 | Hosea | `authorDetail` | yes | F38 | not confirmed |
| 14 | Hosea | `writtenDetail` | no |  |  |
| 15 | Obadiah | `authorDetail` | no |  |  |
| 16 | Jonah | `authorDetail` | no |  |  |
| 17 | Nahum | `authorDetail` | no |  |  |
| 18 | Habakkuk | `writtenDetail` | no |  |  |
| 19 | Zephaniah | `authorDetail` | no |  |  |
| 20 | Haggai | `authorDetail` | yes | F39 | confirmed |
| 21 | Haggai | `writtenDetail` | yes | F40 | confirmed |
| 22 | John | `writtenDetail` | no |  |  |
| 23 | Romans | `authorDetail` | no |  |  |
| 24 | Romans | `writtenDetail` | no |  |  |
| 25 | 1 Corinthians | `authorDetail` | no |  |  |
| 26 | 1 Corinthians | `writtenDetail` | no |  |  |
| 27 | 2 Corinthians | `authorDetail` | no |  |  |
| 28 | 2 Corinthians | `writtenDetail` | no |  |  |
| 29 | Galatians | `authorDetail` | no |  |  |
| 30 | Galatians | `writtenDetail` | yes | F41 | confirmed |
| 31 | Philippians | `authorDetail` | no |  |  |
| 32 | Philippians | `writtenDetail` | yes | F42 | confirmed |
| 33 | 1 Thessalonians | `authorDetail` | no |  |  |
| 34 | 1 Thessalonians | `writtenDetail` | no |  |  |
| 35 | Philemon | `authorDetail` | no |  |  |
| 36 | Philemon | `writtenDetail` | yes | F43 | confirmed |
| 37 | Hebrews | `authorDetail` | yes | F44 | confirmed |
| 38 | 2 John | `writtenDetail` | yes | F45 | not confirmed |
| 39 | 3 John | `writtenDetail` | yes | F46 | confirmed |
| 40 | Revelation | `writtenDetail` | no |  |  |

### The findings of check 3

#### F30. Joshua, `authorDetail`: a dispute that does not show

- The entry has no `authorDetail`. The `author` statement: "The book does not name its author, though it mentions Joshua writing. An older view, from Jewish tradition, names Joshua, except for the last verses."
- The strength word of the page: No quantifier for the doubt: the Talmud attribution 'was rejected' by Calvin, and by Hobbes's time 'it was recognised' that the book was written much later. The date that follows is given as 'general agreement'.
- The work that the page cites: Footnote 10, de Pury and Romer 2000, pp. 26-30, for the Talmud, Calvin, and Hobbes sentence. Footnotes 11 and 10, Younger 2003 and de Pury and Romer 2000, for the date sentence.
- The first reading: The page calls the book anonymous. The Babylonian Talmud gave it to Joshua, but Calvin rejected this as untenable, and later it was recognised that the book was written much later than its events.
- Evidence, a phrase of the page: "this idea was rejected as untenable by John Calvin"
- The section of the page: Composition: Authorship and date
- The address: <https://en.wikipedia.org/w/index.php?title=Book_of_Joshua&oldid=1382152172>
- The record: Partly. The Author statement and its record say the book is anonymous and name the Talmud view as an older view. The record gives no reason why the Author fact has no detail.
- The reading of the accuracy reviewer: yes. The page calls the book anonymous, says Calvin rejected the attribution of the Talmud to Joshua as untenable, and says that by the time of Hobbes the book was recognised as much later, in the article voice with no count word, citing de Pury and Romer 2000, pp. 26 to 30. The record names the anonymity and the Talmud view but not the rejection, and it gives no reason for the missing authorDetail. Section: Composition: Authorship and date.
- Status: confirmed.
- A change: State in the record why the Author fact has no detail, or add a critical part from the section 'Composition: Authorship and date'.

#### F31. Judges, `writtenDetail`: a dispute that does not show

- The entry has no `writtenDetail`. The `written` statement: "Most of it was probably written by the time of King David, 1010 to 970 BC."
- The strength word of the page: 'most scholars have agreed' applies to Noth's thesis of one history; the dates of that history are given as the views of Noth (early exile, 6th century BCE) and Cross (Josiah's time, late 7th century BCE). The refrain on 'no king' 'implies' a redaction in the monarchic period.
- The work that the page cites: Footnote 42, Soggin 1981, for the final Deuteronomistic revision. Footnote 49, Knoppers 2000, for 'most scholars' and Noth's thesis. Footnotes 50 and 51, Walton 2009 and Knoppers 2000, for Noth's date. Footnote 52, Eynikel 1996, for Cross's date.
- The first reading: The page does not name a traditional date. It says the stories were given a final Deuteronomistic revision, and that most scholars accept Noth's thesis that Deuteronomy to Kings is one work. Noth dates that work to the 6th century BCE and Cross dates a first edition to Josiah's time. These dates are later than the time of David in the Written fact.
- Evidence, a phrase of the page: "before being given the final Deuteronomistic revision"
- The section of the page: Composition: Sources; Composition: The Deuteronomistic History
- The address: <https://en.wikipedia.org/w/index.php?title=Book_of_Judges&oldid=1383106058>
- The record: No. The record gives no reason why the Written fact has no detail. docs/TASKS.md, line 209, says an earlier Written detail of Judges had no date and was moved to the Author detail.
- The reading of the accuracy reviewer: yes. Since about 1950, most scholars accept the thesis of Noth that Deuteronomy to Kings is one work. Noth dated it to the mid-6th century BCE, and Cross dated a first edition to the time of Josiah in the late 7th century BCE (cited: Knoppers 2000, Walton 2009). The page also says that the refrain that Israel had no king implies editing under the kings (Malamat 1971). The Judges record does not name this point and gives no reason for the missing Written detail. Task 4c step 6 in docs/TASKS.md moved the old Written detail, which had no date, to the Author detail. Section: Composition: The Deuteronomistic History.
- Status: confirmed.
- A change: State in the record why the Written fact has no detail, or add a critical part from the section 'Composition: The Deuteronomistic History'.

#### F32. Ruth, `authorDetail`: a dispute that does not show

- The entry has no `authorDetail`. The `author` statement: "The book names no author. An older view, from Jewish tradition, names Samuel."
- The strength word of the page: No quantifier for the doubt about Samuel: the page says the content 'suggests' a 5th-century origin, set against the ascription to Samuel with 'but'. The Persian date that follows has 'a substantial number of scholars'.
- The work that the page cites: Footnote 16, Hubbard 1988, p. 23, for 'does not name its author'. Footnote 17, Leith 2007, p. 391, for the Samuel tradition and the 5th-century origin. Footnote 3, Grabbe 2004, p. 105, for 'a substantial number of scholars'.
- The first reading: The page says the book names no author and is traditionally ascribed to Samuel, 11th century BCE, but its attitude to foreigners suggests an origin in the 5th century BCE. A date that late rules out Samuel, but the page does not say so in words.
- Evidence, a phrase of the page: "traditionally ascribed to the prophet Samuel (11th century BCE)"
- The section of the page: Composition and genre
- The address: <https://en.wikipedia.org/w/index.php?title=Book_of_Ruth&oldid=1374486736>
- The record: Partly. The record line accepted by Arthur on 2026-11-13 says the article sets the Persian date against the tradition that Samuel wrote it, and gives that as the reason for the Written detail. It gives no reason why the Author fact has no detail.
- The reading of the accuracy reviewer: yes. The page says the book names no author and is traditionally ascribed to Samuel, but its stress on welcoming foreigners suggests the 5th century BC, so 'a substantial number of scholars' date it to the Persian period, and the lead says 'likely' (Leith 2007; Grabbe 2004). The doubt about Samuel is implied by the date, not said in words; the record names the contrast only in Arthur's accepted note on the date detail and gives no reason for the missing authorDetail. Section: Composition and genre; Lead.
- Status: confirmed.
- A change: State in the record why the Author fact has no detail, given that the Written detail already answers the Samuel tradition.

#### F33. 1 Samuel, `authorDetail`: a dispute that does not show

- The entry has no `authorDetail`. The `author` statement: "The author is not known. An older view names Samuel, Gad, and Nathan."
- The strength word of the page: No quantifier such as 'most': the page says that critical scholars since the 19th century reject the Talmud attribution.
- The work that the page cites: The sentence on the critical scholars has no footnote. Footnote 2, Hirsch, Jewish Encyclopedia 1906, is on the Talmud sentence. Footnotes 19 to 21, Garsiel 2010 and Lawee 2012 and 1996, are on the Abarbanel sentence.
- The first reading: The page says the Talmud gives the book to Samuel up to 1 Samuel 25, and the rest to Gad and Nathan. Critical scholars from the 19th century rejected this. Earlier, Abarbanel saw signs of a later editor.
- Evidence, a phrase of the page: "onward have rejected this idea"
- The section of the page: Composition: Authorship and date of composition
- The address: <https://en.wikipedia.org/w/index.php?title=Books_of_Samuel&oldid=1381292867>
- The record: No. The Author statement says the author is not known and names the older view, but the record gives no reason why the Author fact has no detail.
- The reading of the accuracy reviewer: yes. The page says critical scholars from the 19th century on rejected the attribution of the Talmud to Samuel, Gad, and Nathan, with no count word and no citation on that sentence; the medieval doubt of Abarbanel cites Garsiel 2010 and Lawee 1996 and 2012. The record does not name this point and gives no reason for the missing authorDetail. Section: Composition: Authorship and date of composition.
- Status: confirmed.
- A change: State in the record why the Author fact has no detail, or add a critical part from the section 'Composition: Authorship and date of composition'.

#### F34. 2 Samuel, `authorDetail`: a dispute that does not show

- The entry has no `authorDetail`. The `author` statement: "The author is not known. An older view names Gad and Nathan."
- The strength word of the page: No quantifier such as 'most': the page says that critical scholars, from the 19th century on, reject the Talmud attribution.
- The work that the page cites: The sentence on the critical scholars has no footnote. Footnote 2, Hirsch, Jewish Encyclopedia 1906, is on the Talmud sentence. Footnotes 19 to 21, Garsiel 2010 and Lawee 2012 and 1996, are on the Abarbanel sentence.
- The first reading: The page says the Talmud gives the part after 1 Samuel 25 to Gad and Nathan. Critical scholars since the 19th century reject the Talmud attribution. Earlier, Abarbanel saw signs of a later editor.
- Evidence, a phrase of the page: "the remainder by the prophets Gad and Nathan"
- The section of the page: Composition: Authorship and date of composition
- The address: <https://en.wikipedia.org/w/index.php?title=Books_of_Samuel&oldid=1381292867>
- The record: No. The Author statement says the author is not known and names the older view, but the record gives no reason why the Author fact has no detail.
- The reading of the accuracy reviewer: yes. After the Talmud attribution to Samuel, Gad, and Nathan, the page says critical scholars from the 19th century onward rejected it, with no strength word and no citation on that sentence (the next sentence cites Garsiel 2010 and Lawee 1996 and 2012); the lead dates the whole Deuteronomistic history to about 630-540 BCE (Knight 1995, Jones 2001). The 2 Samuel record does not name this point and gives no reason for the missing Author detail, but the Author fact already says that the author is not known. Section: Composition: Authorship and date of composition; Lead.
- Status: confirmed.
- A change: State in the record why the Author fact has no detail, or add a critical part from the section 'Composition: Authorship and date of composition'.

#### F35. Song of Solomon, `authorDetail`: a dispute that does not show

- The entry has no `authorDetail`. The `author` statement: "Solomon was probably not the writer, and the song may have been made in his honor. An older view names Solomon as the author."
- The strength word of the page: 'remain uncertain' in the lead. Modern scholarship 'argues' that there is no evidence that Solomon wrote it. The language points to 'centuries after King Solomon'.
- The work that the page cites: Shaye J. D. Cohen, quoted as a summary of modern Bible scholarship, named in the page text. The quotation and the lead sentence have no footnote marker in the text copy.
- The first reading: The authorship, date, and origins remain uncertain. The heading calls the song Solomon's, but the page says the heading is not a claim of authorship in the modern sense. The language points to a date centuries after Solomon, to whom the song is traditionally attributed. Cohen summarizes modern scholarship as finding no evidence that Solomon wrote it. The page gives no place of writing.
- Evidence, a phrase of the page: "there is no evidence that Solomon wrote it"
- The section of the page: Lead; Composition; Genre
- The address: <https://en.wikipedia.org/w/index.php?title=Song_of_Songs&oldid=1382222334>
- The record: No. The record gives no reason that the Song has no authorDetail. The author line already says, from the ESV Global Study Bible, that Solomon was probably not the writer.
- The reading of the accuracy reviewer: yes. Composition says the language points to a date centuries after Solomon, to whom the song is traditionally attributed, and 'most scholars' since the 1800s date it to the 3rd century BC (Elgvin 2020; Bloch and Bloch 1995); Genre quotes Shaye Cohen that modern scholarship finds no evidence that Solomon wrote it. The author fact already says Solomon was probably not the writer, but the record gives no stated reason for the missing authorDetail. Section: Composition; Genre; Lead.
- Status: confirmed.
- A change: Add a line to the record that gives the reason for no authorDetail, or add an authorDetail from the page.

#### F36. Jeremiah, `writtenDetail`: a dispute that does not show

- The entry has no `writtenDetail`. The `written` statement: "By tradition, the late 7th and early 6th centuries BC. Jeremiah is thought to have added some chapters later, in Egypt."
- The strength word of the page: The growth over a long time is stated flat, with no footnote on that sentence; 'can be suggested' and 'may have been' are used for the dates of the final forms.
- The work that the page cites: Sweeney 2010 for the Hebrew form and its 2nd-century perspectives; Allen 2008 for the Greek form in the late exile; Coogan 2008 for the editing by followers and Deuteronomists.
- The first reading: The page says the book grew over a long time and was heavily edited and expanded by followers and later Deuteronomists. It says the Greek form may have been complete in the late exile, the second half of the 6th century BCE, and that the Hebrew form shows views realised only in the 2nd century BCE. This doubts that the whole book is from the time of Jeremiah.
- Evidence, a phrase of the page: "grew over a long period of time"
- The section of the page: Lead; Composition: Composition history; Composition: Literary development
- The address: <https://en.wikipedia.org/w/index.php?title=Book_of_Jeremiah&oldid=1376288136>
- The record: yes: the note accepted by Arthur on 2026-11-13 names both dates and says that Rule 5 removes them, each from one work, and the detail with them.
- The reading of the accuracy reviewer: yes. The page says the book grew over a long time: the Hebrew form shows outlooks not realised until the 2nd century BCE ('can be suggested', Sweeney 2010), and the Greek stage may have been complete in the late exile (Allen 2008). The record names both and says that Arthur accepted their removal under rule 5 on 2026-11-13; the page states the 2nd-century point in its own voice, not as the view of a named scholar, so whether rule 5 applies stays the decision of Arthur. Section: Lead; Composition: Composition history; Literary development.
- Status: confirmed.
- A change: None if Arthur keeps his decision of 2026-11-13; the record does not name the flat sentence that the book grew over a long time.

#### F37. Lamentations, `authorDetail`: a dispute that does not show

- The entry has no `authorDetail`. The `author` statement: "The author is not known. An older view names Jeremiah."
- The strength word of the page: 'prevailing scholarly consensus'; 'modern consensus'; 'Scholars are divided' on one author or several
- The work that the page cites: Salters 2010 for the consensus; Dobbs-Allsopp 2002 for the division on one or several authors.
- The first reading: The page says the modern consensus is that Jeremiah did not write the book and that the author or authors are anonymous. This agrees with the cover line 'The author is not known'. The page also says scholars are divided on whether one author or several wrote it.
- Evidence, a phrase of the page: "the modern consensus amongst scholars is that Jeremiah did not write Lamentations"
- The section of the page: Lead; Composition
- The address: <https://en.wikipedia.org/w/index.php?title=Book_of_Lamentations&oldid=1384960722>
- The record: yes, in part: the record says the sources show no dispute for the Author fact. It does not say that the cover already follows the consensus, or name the division on one or several authors.
- The reading of the accuracy reviewer: yes. The lead says doubt of Jeremiah as author has become the prevailing scholarly consensus (Salters 2010), and Composition says the modern consensus is that Jeremiah did not write it and that the poems were not necessarily by eyewitnesses. The record gives a reason, that the sources show no dispute, which fits the Author fact (not known) but does not mention the doubt about the older view that names Jeremiah. Section: Lead; Composition.
- Status: confirmed.
- A change: Say in the record that the cover line follows the consensus, and name the division on one or several authors or say why it is left out.

#### F38. Hosea, `authorDetail`: a dispute that does not show

- The entry has no `authorDetail`. The `author` statement: "Hosea son of Beeri, by tradition."
- The strength word of the page: 'Some redaction-critical studies'; against it, 'many scholars agree' with 'probably'
- The work that the page cites: Irvine 2021, Oxford Handbook of the Minor Prophets, for the redaction studies; Gruber 2017 ('most scholars') and Kelle 2024 ('Many scholars') for the date under Jeroboam II.
- The first reading: The lead says some redaction studies since the 1980s hold that editors made the unity of the book, and that scholars differ on how much the 8th-century prophet wrote. It then says many scholars agree that most of the book was probably composed under Jeroboam II, about 793 to 753 BCE. The footnote of Kelle says many scholars see most or all of the book as coming from the prophet Hosea.
- Evidence, a phrase of the page: "Some redaction-critical studies of Hosea since the 1980s have postulated"
- The section of the page: Lead
- The address: <https://en.wikipedia.org/w/index.php?title=Book_of_Hosea&oldid=1367237111>
- The record: yes: the record says only some studies hold that later editors shaped the book, so the view is not shown, as for Haggai; Arthur accepted this on 2026-11-13.
- The reading of the accuracy reviewer: no. Only 'some' redaction-critical studies since the 1980s hold that editors made the book's unity (Irvine 2021), while 'many scholars' place the bulk of the book, 'probably', around the time of Jeroboam II, c. 793 to 753 BC (Gruber 2017; Kelle 2024). The record names this and gives the reason, the Haggai rule; note that the Jeroboam II dating is earlier than the Written fact's 'just before the northern kingdom fell'. Section: Lead.
- Status: not confirmed.
- A change: If Arthur accepts the first reading: None.

#### F39. Haggai, `authorDetail`: a dispute that does not show

- The entry has no `authorDetail`. The `author` statement: "The prophet Haggai, by tradition."
- The strength word of the page: 'uncertain'; 'unlikely' that Haggai wrote it; 'more probable' that a disciple wrote it; the traditional view has only 'Some presume'
- The work that the page cites: A website: biblicaltraining.org ('Haggai - Search results provided by BiblicalTraining'). This matches the record.
- The first reading: The page says the authorship is uncertain. Haggai is named in the third person, so it is unlikely he wrote the book, and more probably a disciple of Haggai wrote it.
- Evidence, a phrase of the page: "it is more probable that the book was written by a disciple of Haggai"
- The section of the page: Authorship
- The address: <https://en.wikipedia.org/w/index.php?title=Book_of_Haggai&oldid=1331048975>
- The record: yes; the record says the article cites only a website, which Task 4 condition 1 does not accept
- The reading of the accuracy reviewer: yes. The page calls the authorship uncertain, says some presume Haggai wrote it, and says the third-person references make a disciple of Haggai more probable; its only citation is a search page of biblicaltraining.org. The record names this point and gives its reason: the claim cites only a website, which Task 4 condition 1 does not accept. Section: Authorship.
- Status: confirmed.
- A change: No change needed while the Task 4 condition stands; the record names the point and the reason.

#### F40. Haggai, `writtenDetail`: a dispute that does not show

- The entry has no `writtenDetail`. The `written` statement: "By tradition, about 520 BC, after the Jews returned from Babylon in 538 BC."
- The strength word of the page: 'A traditional consensus' (completion about 515 BC); 'Other scholars' (about 417 BC, Darius II); 'most likely' within a generation of Haggai
- The work that the page cites: Britannica (website) for 'within a generation'; Joachimsen 2022, Religions 13(3), for the traditional consensus (footnote: 'many have concluded' a date before 515 BCE) and for Darius II (footnote: 'most scholars' take Darius I, 'some' Darius II).
- The first reading: The body says the date of the written text is uncertain, most likely within a generation of Haggai. A traditional consensus puts the completion at about 515 BC. Other scholars put it about 417 BC, reading the king as Darius II. The events are in 520 BC. The footnote to the Darius II sentence says most scholars take Darius I and some Darius II, which matches the record; the body says 'A traditional consensus' and 'Other scholars'.
- Evidence, a phrase of the page: "dates the completion of the text to c. 515 BC"
- The section of the page: Date
- The address: <https://en.wikipedia.org/w/index.php?title=Book_of_Haggai&oldid=1331048975>
- The record: yes; the record says the view of some scholars (Darius II) is not shown, as the designer asked
- The reading of the accuracy reviewer: yes. The page says the exact date is uncertain but most likely within a generation of Haggai (Britannica), a traditional consensus puts completion about 515 BC (Joachimsen 2022), and other scholars put completion about 417 BC under Darius II; the footnote says most scholars take the king as Darius I and some as Darius II. The record names this point and gives its reason: only the view of some scholars differs, so no detail is shown, as the designer asked. Section: Date, with footnotes [8] and [9].
- Status: confirmed.
- A change: No change needed; the record matches the footnote, and the body words are 'A traditional consensus' and 'Other scholars'.

#### F41. Galatians, `writtenDetail`: a dispute that does not show

- The entry has no `writtenDetail`. The `written` statement: "By tradition, about AD 48, probably from Antioch in Syria. An older view places it in Corinth in the late 50s AD."
- The strength word of the page: a majority of scholars: late 40s to early 50s; some: about 50 to 60
- The work that the page cites: The New Oxford Annotated Bible (2001) and Early Christian Writings for the majority view; the ESV Study Bible (2008) for 48 as the most plausible date; Lee Martin McDonald (2004) for the North Galatian date in Macedonia and the South Galatian date of 49; John P. Meier and Helmut Koester are named.
- The first reading: The page says a majority date the letter to the late 40s or early 50s, but some date it about 50 to 60. It gives three views: the North Galatian view, after the Jerusalem council, about 56 to 57, during Paul's stay in Macedonia; the South Galatian view, about 49; and the earliest-letter view, about 47. In reporting Jordan, it calls 48 the most plausible date. The page does not name Antioch as the place. For the North Galatian view it names Macedonia, where Easton names Corinth. The sentence that calls 48 the most plausible date cites the ESV Study Bible.
- Evidence, a phrase of the page: "although some date the original composition to"
- The section of the page: Date; North Galatian view; South Galatian view; Earliest epistle
- The address: <https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Galatians&oldid=1381112578>
- The record: partly: the main line gives the older view of Easton, Corinth in the late 50s, but the record gives the reason that the sources show no dispute, and it does not name the competing views of the page.
- The reading of the accuracy reviewer: yes. A majority of scholars date the letter between the late 40s and early 50s (Coogan, New Oxford Annotated Bible, 2001), which includes AD 48, but 'some' date it to about 50 to 60, and the North Galatian view puts it in Macedonia about 56 to 57 (McDonald 2004); the page names no place of writing for AD 48. The record says the sources show no dispute, so it does not name the later date of 'some' or the place Macedonia. Section: Background: Date; North Galatian view; South Galatian view.
- Status: confirmed.
- A change: Name the majority view and the competing views of the page in the record, and give the reason for no detail, or add a detail.

#### F42. Philippians, `writtenDetail`: a dispute that does not show

- The entry has no `writtenDetail`. The `written` statement: "By tradition, about AD 62, while Paul was in prison, probably in Rome."
- The strength word of the page: The place is not certain; Rome around AD 62 is 'most likely'.
- The work that the page cites: Stephen L. Harris (1985) for Rome as most likely; Bird and Gupta (2020) for the 50s or early 60s; Philippians 1:7 and 1:13 for the uncertain place; Philip Sellew and G. Walter Hansen on the fragments; Jim Reiher (2012) for a second Roman imprisonment.
- The first reading: The page says that the place of Paul at the time of writing is not certain. It names Ephesus, AD 52 to 55, and Caesarea Maritima, AD 57 to 59, as other places, but calls Rome around AD 62 the most likely. It says scholars agree the material is from the 50s or early 60s. The probably of the main line matches the strength most likely.
- Evidence, a phrase of the page: "uncertain where Paul was when he wrote the letter(s)"
- The section of the page: Lead; Composition; Place of writing
- The address: <https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Philippians&oldid=1379537322>
- The record: no: the record says the sources show no dispute for the Written fact; it does not name the uncertainty of the place or the other places.
- The reading of the accuracy reviewer: yes. The page calls the place uncertain, names Ephesus (52 to 55) and Caesarea (57 to 59) as options, calls Rome about AD 62 the most likely (Harris 1985), and calls the letter a composite of fragments by general consensus (Sellew 1994, Hansen 2009). The record says the sources show no dispute for the Written fact, so it does not name the uncertain place or the composite letter. Section: Lead; Composition; Composition: Place of writing.
- Status: confirmed.
- A change: Name the uncertainty of the place in the record and give the reason for no detail, or add a detail.

#### F43. Philemon, `writtenDetail`: a dispute that does not show

- The entry has no `writtenDetail`. The `written` statement: "By tradition, about AD 62, while Paul was a prisoner, probably in Rome."
- The strength word of the page: no strength word; the page gives two places without choosing
- The work that the page cites: None. The sentence on Caesarea Maritima or Rome has no footnote. The next sentence, on Colossians, has footnote 6, Cope (1985).
- The first reading: The page dates the letter about AD 57 to 62, with Paul in prison either at Caesarea Maritima for the early date or in Rome for the later date. It does not say that scholars doubt Rome; it gives the two places as alternatives.
- Evidence, a phrase of the page: "in prison at Caesarea Maritima (early date) or from Rome (later date)"
- The section of the page: Composition
- The address: <https://en.wikipedia.org/w/index.php?title=Epistle_to_Philemon&oldid=1361421780>
- The record: yes; the record says the article gives Caesarea Maritima or Rome but cites no source, and Task 4 condition 1 needs a citation
- The reading of the accuracy reviewer: yes. The page says Paul wrote the letter about AD 57-62 in prison, at Caesarea Maritima for an early date or at Rome for a later date, in its own voice, with no strength word and no citation on that sentence. The record names the point and gives its reason: the article cites no source, so Task 4 condition 1 is not met. Section: Composition.
- Status: confirmed.
- A change: None needed; the text copy with footnotes confirms that the sentence on the place has no citation, as the record says.

#### F44. Hebrews, `authorDetail`: a dispute that does not show

- The entry has no `authorDetail`. The `author` statement: "The letter does not name its writer, and who wrote it is not known. An older view names Paul."
- The strength word of the page: mostly rejected; considers authorship unknown; many scholars now believe
- The work that the page cites: Footnote 8: Alan C. Mitchell, Hebrews (2007), p. 6, for 'authorship unknown'. Footnote 30: the Catholic Encyclopedia (1910), 'Epistle to the Hebrews', for 'many scholars now believe' a pupil or associate of Paul.
- The first reading: Modern scholarship takes the writer as unknown and mostly rejects Paul. Many scholars now think the writer was a pupil or associate of Paul. A minority see the letter as an imitation of Paul's style. The author statement already says the writer is not known and gives Paul only as an older view.
- Evidence, a phrase of the page: "with Pauline authorship mostly rejected"
- The section of the page: Lead and Composition, Authorship
- The address: <https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Hebrews&oldid=1379598353>
- The record: no; the record gives no reason for the missing authorDetail, but the author statement itself says that the writer is not known
- The reading of the accuracy reviewer: yes. The page says that modern scholars do not give Hebrews to Paul (Ellingworth 1993; Ehrman 2011), and that 'many scholars' now see the writer as a pupil or associate of Paul (Catholic Encyclopedia 1910). So it doubts the older view that names Paul. The author fact already says the writer is not known, but the record gives no reason for the missing authorDetail. The page does not dispute Rome as the place. Section: Composition: Authorship.
- Status: confirmed.
- A change: Record why there is no author detail, or add a detail with the 'many' view of a pupil or associate of Paul.

#### F45. 2 John, `writtenDetail`: a dispute that does not show

- The entry has no `writtenDetail`. The `written` statement: "By tradition, in Ephesus, no later than the 90s AD."
- The strength word of the page: may; can not be assured
- The work that the page cites: None. The sentence has no footnote and names no scholar.
- The first reading: The page says the rejection of gnostic teaching may show a later date than the traditional one, but that this cannot be assured. It gives no years and no place. It also says that an early-date theory would need a much earlier date than modern scholars suggest.
- Evidence, a phrase of the page: "may reveal a later date of authorship than orthodox Christianity claims"
- The section of the page: Composition
- The address: <https://en.wikipedia.org/w/index.php?title=Second_Epistle_of_John&oldid=1380152630>
- The record: no; the record gives no reason for the missing writtenDetail
- The reading of the accuracy reviewer: no. The page says the attack of the letter on gnostic ideas may point to a later date than orthodox Christianity claims but that this cannot be assured (cf. Ehrman 2003); it names no place and no scholars who doubt the date. The record has no line on the missing writtenDetail and gives no reason. Section: Composition.
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Record why there is no written detail; the page gives the doubt only with 'may' and no years.

#### F46. 3 John, `writtenDetail`: a dispute that does not show

- The entry has no `writtenDetail`. The `written` statement: "By tradition, in Ephesus, no later than the 90s AD."
- The strength word of the page: likely; individual scholars named for each date
- The work that the page cites: The lead sentence on the end of the 1st century has no footnote. The section names Dodd (96 to 110), Marshall (60s to 90s), Rensberger (about 100), Brown (100 to 110), and, in the lead, Robinson (about 60 to 65).
- The first reading: The lead gives a date late in the 1st century, with 'likely'. The section gives dates of named scholars, several after the 90s: Dodd 96 to 110, Rensberger about 100, Brown 100 to 110. For the place, the page says the letters give none, it is likely Asia, and tradition places them in Ephesus.
- Evidence, a phrase of the page: "tradition places it in Ephesus"
- The section of the page: Lead and Authorship, Date and location of writing
- The address: <https://en.wikipedia.org/w/index.php?title=Third_Epistle_of_John&oldid=1382161569>
- The record: no; the record gives no reason for the missing writtenDetail
- The reading of the accuracy reviewer: yes. The own view of the page is a date in the second half, likely near the end, of the first century, but it names scholars with other dates: Dodd 96-110, Rensberger about 100, Brown 100-110, Marshall 60s-90s, and Robinson about 60-65, each the view of one named scholar with no word like most; for the place it says the location is unknown and tradition places it in Ephesus. The 3 John record does not name the date point and gives no reason for the missing Written detail. Section: Lead; Authorship: Date and location of writing.
- Status: confirmed.
- A change: Record why there is no written detail, or add a detail if a general view on the date is found; each date on the page is of one named scholar.

### The entries of check 3 with no dispute

For these entries the page shows no doubt. The record column says if the record names the point.

| Book | Missing | The page, in my words | The record |
|---|---|---|---|
| Ezra | `writtenDetail` | One scholar, Eskenazi, puts the final form of Ezra in the late Persian period, c. 370 to 350 BCE, with small Hellenistic additions. The Date section says that scholars are divided on the order of the missions of Ezra and Nehemiah, which dates the events, not the writing. The page gives no place of writing. | Yes, in part. The record, accepted by Arthur on 2026-11-13, says that neither Easton nor the ESV Global Study Bible states a traditional date of writing. It does not name Eskenazi's date or say that rule 5 excludes it. |
| Esther | `authorDetail` | By the Talmud, the book is the Great Assembly's redaction of an original text by Mordecai. The page does not say that scholars doubt this. It says that most scholars see the book as a novella, and that the mainstream consensus sees it as fiction written to explain Purim. With the usual 4th-century BCE date, this bears on a writer who lived at the time of Mordecai, but the page does not draw that conclusion. The page gives no place of writing. | No. The record gives no reason that Esther has no authorDetail. |
| Lamentations | `writtenDetail` | The page says most scholars agree the book was composed shortly after the fall of Jerusalem in 586 BCE, which matches the cover. It says the poems probably came from Judeans who stayed in the land, that the exact place is unknown, and that the writers need not have seen the events. The cover line says 'by an eyewitness'. | yes: the record says the sources show no dispute for the Written fact. It does not name the point on eyewitnesses. |
| Ezekiel | `writtenDetail` | The page dates the visions from 593 to 571 BCE, in the exile. Critical history says that after the Second World War scholars more and more accepted the unity of the book and its place in the exile, after earlier scholars had put it in the 3rd century BCE or the 8th or 7th century. The page does not say that scholars now doubt the traditional date or the place, but it says most scholars see significant additions by later followers. | no: the record gives no reason for the missing writtenDetail. Its only note on a detail is the author note accepted by Arthur on 2026-11-13. |
| Hosea | `writtenDetail` | The page does not doubt the traditional date. It says many scholars agree that most of the book probably comes from the reign of Jeroboam II, about 793 to 753 BCE, and that Hosea prophesied as the northern kingdom declined and fell in the 8th century BCE. The span 793 to 753 BCE is earlier than the cover's 'just before the northern kingdom of Israel fell'; the page dates that fall to 722 BCE. | no: the record's 'No detail' line names only the Author fact. It names the Jeroboam II date there, but gives no reason for the missing writtenDetail. |
| Obadiah | `authorDetail` | The page says the book is attributed to Obadiah and that little is known of him. It does not say that scholars doubt that Obadiah is the author. The view of other scholars, that the book took shape through redaction in the 5th and 4th centuries BCE, bears on the author only by implication; the writtenDetail already has it. | no: the record gives no reason for the missing authorDetail. |
| Jonah | `authorDetail` | The page has no sentence on who wrote the book. It says only that the book tells of the prophet Jonah son of Amittai. Its view that most scholars date the book long after the events implies that the 8th-century prophet did not write it, but the page does not say so. The writtenDetail already gives the late date. | no: the record gives no reason for the missing authorDetail. Its note accepted by Arthur on 2026-11-13 is on the Written fact only. |
| Nahum | `authorDetail` | The lead says the book is attributed to the prophet Nahum. The subsection Author says little is known of his life, and scholars try to identify his home town Elkosh with several places; that is his home, not the place of writing. Only Davidson, one named scholar, says the line 'The burden of Nineveh' is probably an editorial addition. | no; the record gives no reason for the missing author detail |
| Habakkuk | `writtenDetail` | The page does not say that scholars doubt the traditional date. It says most scholars agree the content fits the reign of Jehoiakim, 609 to 597 BC, and that the prophet is generally believed to have written in the middle or the later part of the 7th century BC. Historical context says it is unknown when he lived. | yes; Arthur accepted it on 2026-11-13: the record names the Jehoiakim date and judges the gap too small for a detail |
| Zephaniah | `authorDetail` | The page does not say in words that scholars doubt the author. But it says no outside evidence links the writing of the book to a prophet named Zephaniah, as with many prophets. It speaks of 'some' who think a historical Zephaniah wrote most of the book. The later-expansion view is already in writtenDetail.critical. | no; the record gives no reason for the missing author detail |
| John | `writtenDetail` | The page agrees with the traditional date and place: most scholars and the scholarly consensus date the gospel to AD 90 to 100, and most critical commentaries say it was likely composed in Ephesus. | no; the record gives no reason for the missing written detail |
| Romans | `authorDetail` | The page says scholars agree that Paul wrote the letter, and quotes Cranfield that no responsible criticism disputes it. | yes: the record says the sources show no dispute for the Author fact. |
| Romans | `writtenDetail` | The page says the majority date the letter to late 55 or early 56, or late 56 or early 57, and that the letter was most probably written in Corinth. It calls Lüdemann's early date the only serious challenge to the consensus. About AD 57 is at the late edge of the majority range. | yes: the record says the sources show no dispute for the Written fact. |
| 1 Corinthians | `authorDetail` | The page says Paul's authorship is undisputed. Some passages, for example 14:34 to 35, are taken by many as later additions; this is not a doubt about the writer of the letter. | yes: the record says the sources show no dispute for the Author fact. |
| 1 Corinthians | `writtenDetail` | The page says some scholars place the letter in Paul's stay in Ephesus, usually 53 to 57. It may be from the first short stay, about early 54, but the long stay is more likely. The page gives no doubt of Ephesus. | yes: the record says the sources show no dispute for the Written fact. |
| 2 Corinthians | `authorDetail` | The page says scholars have little doubt that Paul is the writer. It reports a discussion whether the letter was one letter or was put together from two or more letters of Paul. | yes: the record says the sources show no dispute for the Author fact. |
| 2 Corinthians | `writtenDetail` | The page says that the usual date is after Paul went from Ephesus to Macedonia, and it names Philippi or Thessalonica as the place. It gives no year for 2 Corinthians; the stay in Ephesus is roughly AD 53 to 57. The Composition section says many infer that chapters 10 to 13 are part of the earlier letter of tears, and some take chapters 8 and 9 as separate letters; this bears on whether all parts have one date. | yes for the date and place: the record says the sources show no dispute. The record does not name the question of the unity of the letter. |
| Galatians | `authorDetail` | The page says biblical scholars agree that Paul wrote the letter and that its authenticity is unquestioned. | yes: the record says the sources show no dispute for the Author fact. |
| Philippians | `authorDetail` | The page says there is a general consensus that the letter is authentic Pauline material. It also says that since the 1960s a consensus holds that the letter is put together from fragments of three letters of Paul. | yes: the record says the sources show no dispute for the Author fact. |
| 1 Thessalonians | `authorDetail` | The page says most scholars hold the letter to be by Paul. Some scholars of the mid 19th century contested it. Some passages, 2:13 to 16 and 5:1 to 11, are debated; the page says a consensus now takes 2:13 to 16 as Pauline. | yes: the record says the sources show no dispute for the Author fact. |
| 1 Thessalonians | `writtenDetail` | The page says a majority date the letter to AD 49 to 51, during Paul's stay in Corinth, and most scholars hold that he wrote from Corinth. Notes added in some early manuscripts name Athens; the page gives these as manuscript notes, not as a view of scholars. | yes: the record says the sources show no dispute for the Written fact. |
| Philemon | `authorDetail` | The page says Paul's authorship has rarely been questioned and that the letter is now generally counted among the undisputed letters of Paul. The one challenge, from the 19th-century Tuebingen School, is described as outdated. | no; the record gives a reason only for the missing writtenDetail |
| Revelation | `writtenDetail` | The page says the book is commonly dated to about AD 95, from clues to the reign of Domitian. It says the allusions to Nero do not mean a date in the 60s. The place, Patmos, is from 1:9, and the page calls the writer John of Patmos. | no; the record gives no reason for the missing writtenDetail |

## Check 4: a common view that a `critical` part does not have

One row for each finding: 28. Books with a detail and no row have no finding.

| Book | Part | Strength word of the page | Finding | Status |
|---|---|---|---|---|
| 1 Chronicles | `authorDetail.critical` | 'likely' in the lead and 'probably' in Origins, in the page's own voice. The page uses no word such as 'most' or 'many' for this view. | F47 | not confirmed |
| 1 Chronicles | `authorDetail.critical` | 'many scholars', marked citation needed. | F48 | confirmed |
| 2 Chronicles | `authorDetail.critical` | 'likely' in the lead and 'probably' in Origins, in the page's own voice. The page uses no word such as 'most' or 'many' for this view. | F49 | not confirmed |
| 2 Chronicles | `authorDetail.critical` | 'many scholars', marked citation needed. | F50 | not confirmed |
| Nehemiah | `writtenDetail.critical` | 'commonly accepted'. | F51 | confirmed |
| Job | `authorDetail.critical` | 'It is common'. | F52 | confirmed |
| Psalms | `writtenDetail.critical` | 'Many scholars believe'. | F53 | confirmed |
| Isaiah | `authorDetail.critical` | 'widely accepted' | F54 | confirmed |
| Isaiah | `writtenDetail.critical` | 'wide support' | F55 | confirmed |
| Ezekiel | `authorDetail.critical` | 'Most scholars today' | F56 | confirmed |
| Nahum | `writtenDetail.critical` | 'current majority opinion' | F57 | confirmed |
| Habakkuk | `authorDetail.critical` | 'generally believed' | F58 | not confirmed |
| Malachi | `writtenDetail.critical` | 'most scholars' | F59 | confirmed |
| Malachi | `authorDetail.critical` | 'most Jews and some Christians' | F60 | not confirmed |
| Matthew | `authorDetail.critical` | 'Most scholars agree' | F61 | confirmed |
| Matthew | `writtenDetail.critical` | Stated as fact in the lead, with no strength word. | F62 | confirmed |
| Luke | `authorDetail.critical` | 'Scholars largely agree' | F63 | confirmed |
| Luke | `writtenDetail.critical` | 'Many scholars' | F64 | confirmed |
| John | `authorDetail.critical` | 'the current scholarly tendency' | F65 | not confirmed |
| John | `authorDetail.critical` | 'commonly believed' | F66 | not confirmed |
| Acts | `authorDetail.critical` | Stated as fact in the lead, with no strength word. | F67 | confirmed |
| Acts | `writtenDetail.critical` | 'Many scholars' | F68 | not confirmed |
| Titus | `authorDetail.critical` | many scholars | F69 | confirmed |
| 1 Peter | `writtenDetail.critical` | one common supposition | F70 | confirmed |
| 1 John | `authorDetail.critical` | most scholars | F71 | confirmed |
| 3 John | `authorDetail.critical` | almost certainly; a minority argue against | F72 | confirmed |
| Jude | `writtenDetail.critical` | most likely | F73 | not confirmed |
| Jude | `writtenDetail.critical` | many scholars; most favoring | F74 | confirmed |

### The findings of check 4

#### F47. 1 Chronicles, `authorDetail.critical`: a common view that the part does not have

- The part: "Many now think it unlikely that the writer of Chronicles also wrote the story parts of Ezra and Nehemiah."
- The view of the page: The writer was likely one well-educated priestly writer, probably a Levite, based in Jerusalem, who wrote for the elite of the Persian or Hellenistic era.
- The strength word of the page: 'likely' in the lead and 'probably' in Origins, in the page's own voice. The page uses no word such as 'most' or 'many' for this view.
- The work that the page cites: None. The lead sentence and the Origins sentence have no footnote marker in the text copy.
- The first reading: as above.
- Evidence, a phrase of the page: "likely written by a highly educated Jerusalem-based priestly author"
- The section of the page: Lead; Composition: Origins
- The address: <https://en.wikipedia.org/w/index.php?title=Books_of_Chronicles&oldid=1385511143>
- The reading of the accuracy reviewer: NO FINDING. The page gives the profile of the writer, probably a Levite from Jerusalem who wrote for the elite, in its own voice with 'probably' and 'likely', one citation (McKenzie 2004), and no word such as 'most' or 'many'. The author fact and the conservative part already call the writer a priest or Levite, so no common view is missing. Section: Lead; Composition: Origins.
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Decide whether this view, which the page states in its own voice, belongs in the critical part.

#### F48. 1 Chronicles, `authorDetail.critical`: a common view that the part does not have

- The part: "Many now think it unlikely that the writer of Chronicles also wrote the story parts of Ezra and Nehemiah."
- The view of the page: Many scholars still support Ezra as the author, from the likeness of language to Ezra-Nehemiah.
- The strength word of the page: 'many scholars', marked citation needed.
- The work that the page cites: None. The sentence has [citation needed]. Menahem Haran is quoted after it.
- The first reading: as above.
- Evidence, a phrase of the page: "many scholars [citation needed] maintain support for Ezra's authorship"
- The section of the page: Composition: Origins
- The address: <https://en.wikipedia.org/w/index.php?title=Books_of_Chronicles&oldid=1385511143>
- The reading of the accuracy reviewer: CONFIRMED FINDING. The page says many scholars still support Ezra as the writer from shared language with Ezra-Nehemiah, but it marks 'many scholars' citation needed, and the only cited support is a quotation of one scholar, Haran. The view is absent from the critical part, and the record already names it as accepted by Arthur on 2026-11-13. Section: Composition: Origins.
- Status: confirmed.
- A change: No change: the record names this sentence, and Arthur accepted on 2026-11-13 that it stays out because it has no citation.

#### F49. 2 Chronicles, `authorDetail.critical`: a common view that the part does not have

- The part: "Many now think it unlikely that the writer of Chronicles also wrote the story parts of Ezra and Nehemiah."
- The view of the page: The writer was likely one well-educated priestly writer, probably a Levite, based in Jerusalem, who wrote for the elite of the Persian or Hellenistic era.
- The strength word of the page: 'likely' in the lead and 'probably' in Origins, in the page's own voice. The page uses no word such as 'most' or 'many' for this view.
- The work that the page cites: None. The lead sentence and the Origins sentence have no footnote marker in the text copy.
- The first reading: as above.
- Evidence, a phrase of the page: "likely written by a highly educated Jerusalem-based priestly author"
- The section of the page: Lead; Composition: Origins
- The address: <https://en.wikipedia.org/w/index.php?title=Books_of_Chronicles&oldid=1385511143>
- The reading of the accuracy reviewer: NO FINDING. The lead says the book was likely written by an educated Jerusalem priestly author, 400-250 BC, for the elite of the Persian or Hellenistic era, with no citation, and Origins says the writer was probably a Levite from Jerusalem, citing McKenzie 2004. The page gives this in its own voice with likely and probably, not as a common view with a word like most or many, and the priest-or-Levite part is already in the Author fact and the conservative part. Section: Lead; Composition: Origins.
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Decide whether this view, which the page states in its own voice, belongs in the critical part.

#### F50. 2 Chronicles, `authorDetail.critical`: a common view that the part does not have

- The part: "Many now think it unlikely that the writer of Chronicles also wrote the story parts of Ezra and Nehemiah."
- The view of the page: Many scholars still support Ezra as the author, from the likeness of language to Ezra-Nehemiah.
- The strength word of the page: 'many scholars', marked citation needed.
- The work that the page cites: None. The sentence has [citation needed]. Menahem Haran is quoted after it.
- The first reading: as above.
- Evidence, a phrase of the page: "many scholars [citation needed] maintain support for Ezra's authorship"
- The section of the page: Composition: Origins
- The address: <https://en.wikipedia.org/w/index.php?title=Books_of_Chronicles&oldid=1385511143>
- The reading of the accuracy reviewer: NO FINDING. The page says many scholars still support Ezra as the author, but it marks the claim 'citation needed', and its only support is a quotation of one scholar, Menahem Haran. The Ezra view is already the older view of the author fact, and the critical part follows the cited view that many now find it unlikely. Section: Composition: Origins.
- Status: not confirmed.
- A change: If Arthur accepts the first reading: No change: the record names this sentence, and Arthur accepted on 2026-11-13 that it stays out because it has no citation.

#### F51. Nehemiah, `writtenDetail.critical`: a common view that the part does not have

- The part: "Ezra and Nehemiah as one book may have had a first edition early in the 4th century BC."
- The view of the page: The page says it is commonly accepted that the king was Artaxerxes I. So the first stay of Nehemiah was 445 to 433 BC, and the memoir can be no earlier than the close of the 5th century BC. Editing went on for centuries after that.
- The strength word of the page: 'commonly accepted'.
- The work that the page cites: M. P. Graham and Steven L. McKenzie, The Hebrew Bible Today (1998), pp. 205 and 213 (footnotes [9] and [10]).
- The first reading: as above.
- Evidence, a phrase of the page: "commonly accepted that "Artaxerxes" was Artaxerxes I"
- The section of the page: Composition and date
- The address: <https://en.wikipedia.org/w/index.php?title=Book_of_Nehemiah&oldid=1382984300>
- The reading of the accuracy reviewer: CONFIRMED FINDING. The page calls Artaxerxes I commonly accepted, so the first stay of Nehemiah was 445 to 433 BC, and the memoir can be no earlier than the close of the 5th century BC (Graham and McKenzie 1998). It adds that editing went on for centuries. The critical part has only the possible early-4th-century first edition. The strength word covers the king and the years; the memoir date is a deduction of the page, and the later editing has no strength word. Section: Composition and date.
- Status: confirmed.
- A change: Decide whether the critical part names the earliest date of the memoir, the end of the 5th century BC, and the later editing.

#### F52. Job, `authorDetail.critical`: a common view that the part does not have

- The part: "It is widely held that a different writer added the speeches of Elihu later, because their style differs. Recent work leans more toward reading the book as one edited whole."
- The view of the page: The page calls it common to read the prose story at the start and the end as the oldest part, with the poetry added later, and the Elihu speeches and the poem of chapter 28 as late additions.
- The strength word of the page: 'It is common'.
- The work that the page cites: J. H. Walton (2008), p. 343 (footnote [5]).
- The first reading: as above.
- Evidence, a phrase of the page: "common to view the narrative frame as the original core of the book"
- The section of the page: Structure
- The address: <https://en.wikipedia.org/w/index.php?title=Book_of_Job&oldid=1385369652>
- The reading of the accuracy reviewer: CONFIRMED FINDING. The page says it is common to view the prose frame as the original core, enlarged later by the poetry, with the Elihu speeches and the chapter 28 poem as late insertions, though recent trends stress editorial unity (Walton 2008). The critical part has the Elihu point and the recent trend, but not the frame-as-core view or chapter 28; this is a general view with one citation, not the view of one scholar. Section: Structure.
- Status: confirmed.
- A change: Decide whether the critical part names the prose frame as the older core and chapter 28 as a late insertion.

#### F53. Psalms, `writtenDetail.critical`: a common view that the part does not have

- The part: "The psalms were written over at least five centuries, from the 10th to the 5th century BC or later. Scholars of the Septuagint, the early Greek translation, argue that the collection stayed open until the 1st century AD."
- The view of the page: Many scholars believe that the single psalms were edited into one collection in the Second Temple period.
- The strength word of the page: 'Many scholars believe'.
- The work that the page cites: Footnote [40], which by my count of the reference list is Kevin Joseph Haley, a doctoral thesis (University of Notre Dame, 2012). One citation for a general view, so Task 4c rule 3 keeps it.
- The first reading: as above.
- Evidence, a phrase of the page: "redacted into a single collection during the Second Temple period"
- The section of the page: Composition: Editorial agenda
- The address: <https://en.wikipedia.org/w/index.php?title=Psalms&oldid=1384360902>
- The reading of the accuracy reviewer: CONFIRMED FINDING. The page says many scholars believe the single psalms were edited into one collection in the Second Temple period, a general view with one citation (Haley 2012). The critical part does not have it; the view does not conflict with the Written fact, which runs to the time of Ezra, and the sentence gives no years for the Second Temple period. Section: Composition: Editorial agenda.
- Status: confirmed.
- A change: Decide whether the critical part names the time of the collection, the Second Temple period.

#### F54. Isaiah, `authorDetail.critical`: a common view that the part does not have

- The part: "Scholars widely accept that the prophet Isaiah did not write the whole book. Few scholars today credit one person with all of it, or even most of it."
- The view of the page: The book has its roots in a historic 8th-century prophet named Isaiah who lived in Judah. The part says only what he did not write.
- The strength word of the page: 'widely accepted'
- The work that the page cites: Brueggemann 2003; Stromberg 2011.
- The first reading: as above.
- Evidence, a phrase of the page: "widely accepted that the book of Isaiah is rooted in a historic prophet"
- The section of the page: Composition: Authorship
- The address: <https://en.wikipedia.org/w/index.php?title=Book_of_Isaiah&oldid=1385341420>
- The reading of the accuracy reviewer: CONFIRMED FINDING. The page says it is widely accepted that the book is rooted in a historic 8th-century prophet Isaiah of Judah, and also widely accepted that he did not write all of it, with two citations. The critical part gives only the second half, so the first half is absent; it is not the view of one scholar. Section: Composition: Authorship.
- Status: confirmed.
- A change: Add the view that the book is rooted in the prophet to the part, or record why it is left out.

#### F55. Isaiah, `writtenDetail.critical`: a common view that the part does not have

- The part: "Much of the book shows signs of writing after Babylon took Judah's leaders captive in 586 BC, or later still. For most of the 20th century, scholars agreed that chapters 40 to 55 date from that captivity."
- The view of the page: The three-collection view, with chapters 40 to 55 from the exile, still has wide support among critical scholars as of 2023. The part puts the agreement in the 20th century only.
- The strength word of the page: 'wide support'
- The work that the page cites: One footnote: Marko Marina, 2023, an article on bartehrman.com. The page gives the view as general and names Marina as one supporter.
- The first reading: as above.
- Evidence, a phrase of the page: "the old consensus still as of 2023 enjoys wide support from critical Bible scholars"
- The section of the page: Structure
- The address: <https://en.wikipedia.org/w/index.php?title=Book_of_Isaiah&oldid=1385341420>
- The reading of the accuracy reviewer: CONFIRMED FINDING. After the challenge of the last quarter of the 20th century, the page says that part of the older agreement remains (Petersen 2002), and that the old three-collection view still has wide support among critical scholars as of 2023. The critical part puts the agreement only in the 20th century. The wide-support claim is a general view, but its one citation is a website article by Marko Marina, and the Haggai note of the record says that Task 4 condition 1 does not accept a website. Section: Structure.
- Status: confirmed.
- A change: Say in the part that the view still has wide support, or record why it is left out; Arthur may judge whether the one cited article is enough.

#### F56. Ezekiel, `authorDetail.critical`: a common view that the part does not have

- The part: "The book took shape through a long, complex process and may not keep the prophet's exact words. Scholars do agree that Ezekiel himself wrote the prophecy down."
- The view of the page: Most scholars hold that the core of the book is from Ezekiel, with large additions by later followers of the prophet.
- The strength word of the page: 'Most scholars today'
- The work that the page cites: None: the sentence has no footnote in the text copy, as the record says.
- The first reading: as above.
- Evidence, a phrase of the page: "see in it significant additions by a school of later followers"
- The section of the page: Composition: Life and times of Ezekiel
- The address: <https://en.wikipedia.org/w/index.php?title=Book_of_Ezekiel&oldid=1376542749>
- The reading of the accuracy reviewer: CONFIRMED FINDING. The page says in its own voice that most scholars now hold the book to be mainly genuine, with large additions by later followers of the prophet. That sentence has no footnote of its own. The critical part has the long, complex process but not the additions by later followers, and the section Textual history calls the book largely self-authored, so the two sections of the page differ. Section: Composition: Life and times of Ezekiel.
- Status: confirmed.
- A change: None if Arthur keeps his decision of 2026-11-13; the record names this view and the reason it is left out.

#### F57. Nahum, `writtenDetail.critical`: a common view that the part does not have

- The part: "Scholars debate when the book took shape. Proposals run from soon after 663 BC to about 175 to 165 BC."
- The view of the page: The current majority view puts the writing after the sack of Thebes in 663 BC, because the Hebrew text speaks of Thebes in the past tense.
- The strength word of the page: 'current majority opinion'
- The work that the page cites: The paragraph cites only the Septuagint and Vulgate texts (biblehub.com, Bible Gateway); it names no scholarly work.
- The first reading: as above.
- Evidence, a phrase of the page: "the current majority opinion"
- The section of the page: Background
- The address: <https://en.wikipedia.org/w/index.php?title=Book_of_Nahum&oldid=1382362641>
- The reading of the accuracy reviewer: CONFIRMED FINDING. The page calls a date after the sack of Thebes in 663 BC the current majority opinion, because the Masoretic text speaks of Thebes in the past tense; the two notes of that paragraph cite Bible texts, not scholars. The critical part gives only the range of proposals and does not say which one is the majority view. Section: Background.
- Status: confirmed.
- A change: Arthur decides whether the critical part names the majority view next to the range of proposals.

#### F58. Habakkuk, `authorDetail.critical`: a common view that the part does not have

- The part: "Scholars debate whether chapter 3 has the same author as chapters 1 and 2, or was added later. Every copy of the Septuagint, the Greek translation finished by 132 BC, includes it."
- The view of the page: The page gives as the general belief that the prophet Habakkuk wrote the book, in the middle or the later part of the 7th century BC. The critical part speaks only of chapter 3.
- The strength word of the page: 'generally believed'
- The work that the page cites: The sentence has no footnote marker.
- The first reading: as above.
- Evidence, a phrase of the page: "generally believed to have written his book"
- The section of the page: Background
- The address: <https://en.wikipedia.org/w/index.php?title=Book_of_Habakkuk&oldid=1384644727>
- The reading of the accuracy reviewer: NO FINDING. The page gives as the general belief that Habakkuk wrote the book in the middle or the later part of the 7th century BC, with no citation on that sentence. This is the traditional view that the Author fact, the Written fact, and the conservative part already give, so it is not a critical view that the critical part does not have. Section: Background.
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Arthur decides whether the critical part names the general view that Habakkuk wrote the book.

#### F59. Malachi, `writtenDetail.critical`: a common view that the part does not have

- The part: "Most scholars think editors added to the book in several stages. Its oldest parts date to about 500 BC, and it was almost complete by about 180 BC."
- The view of the page: Most scholars place the book after Haggai and Zechariah, near the arrival of Ezra and Nehemiah in Jerusalem, 445 BCE.
- The strength word of the page: 'most scholars'
- The work that the page cites: Plaut, My Jewish Learning (website); hatanakh.com (website); Cheyne, The Biblical World, 1899.
- The first reading: as above.
- Evidence, a phrase of the page: "most scholars assign it to a position after the Book of Haggai"
- The section of the page: Period
- The address: <https://en.wikipedia.org/w/index.php?title=Book_of_Malachi&oldid=1383150392>
- The reading of the accuracy reviewer: CONFIRMED FINDING. The page says most scholars place the book after Haggai and Zechariah, close to the coming of Ezra and Nehemiah to Jerusalem in 445 BCE; the cited works are a popular article (Plaut, My Jewish Learning), hatanakh.com, and Cheyne 1899. The critical part has only the stages of editing from about 500 to 180 BC, so this 'most scholars' view, which is close to the Written fact, is missing. Section: Period.
- Status: confirmed.
- A change: Arthur decides whether the critical part names this majority placing.

#### F60. Malachi, `authorDetail.critical`: a common view that the part does not have

- The part: "Some scholars think the writer is unknown and that Malachi, meaning my messenger, is a title rather than a name. Others argue from the grammar that it is a name."
- The view of the page: The Talmud and some Targums name Ezra as the author. The page calls this the traditional view of most Jews and some Christians. It is a religious tradition, not a view of scholars.
- The strength word of the page: 'most Jews and some Christians'
- The work that the page cites: Megillah 15a (William Davidson Talmud); the introduction to the Targum of Jonathan on Malachi.
- The first reading: as above.
- Evidence, a phrase of the page: "the traditional view held by most Jews and some Christians"
- The section of the page: Authorship
- The address: <https://en.wikipedia.org/w/index.php?title=Book_of_Malachi&oldid=1383150392>
- The reading of the accuracy reviewer: NO FINDING. The page says the Talmud and some Targums name Ezra, and it calls this the traditional view of most Jews and some Christians, citing the Talmud and a Targum introduction. This is a religious tradition, not a view of critical scholars, so it does not belong in the critical part; the Author fact names only Malachi as the tradition, which is a separate question. Section: Authorship.
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Arthur decides whether the detail names the Ezra tradition.

#### F61. Matthew, `authorDetail.critical`: a common view that the part does not have

- The part: "Most scholars doubt the apostle wrote it, and see it as the work of the next generation of Christians. It also draws on the Gospel of Mark, and some scholars still defend the apostle."
- The view of the page: Most scholars agree the author was a Jew who knew Hebrew, the Torah, and the legal debates of his time.
- The strength word of the page: 'Most scholars agree'
- The work that the page cites: Davies and Allison 1988, pp. 9, 25, 58, 128; Duling 2010, p. 302.
- The first reading: as above.
- Evidence, a phrase of the page: "the author was a Jew who stood on the margin between traditional and non-traditional"
- The section of the page: Author and date
- The address: <https://en.wikipedia.org/w/index.php?title=Gospel_of_Matthew&oldid=1382126669>
- The reading of the accuracy reviewer: CONFIRMED FINDING. The page says most scholars agree, from the early attributions and the knowledge of Hebrew, the Torah, and the legal debates of the time, that the author was a Jew (Davies and Allison 1988, Duling 2010). The critical part does not have this view; it is a general view with three citations, and it does not contradict the traditional author. Section: Composition: Author and date.
- Status: confirmed.
- A change: Arthur decides whether the critical part names the majority view that the author was a Jew.

#### F62. Matthew, `writtenDetail.critical`: a common view that the part does not have

- The part: "Most scholars date it after AD 70, because it seems to know of the fall of Jerusalem. Other scholars argue for the 40s or 50s AD."
- The view of the page: The lead dates the gospel to the last 25 years of the first century; the infobox gives c. 80 to 90 AD. The critical part says only 'after AD 70'.
- The strength word of the page: Stated as fact in the lead, with no strength word.
- The work that the page cites: The lead sentence has no marker; footnote b gives the grounds of the majority view, with France 2007, p. 18.
- The first reading: as above.
- Evidence, a phrase of the page: "written in the last quarter of the first century"
- The section of the page: Lead
- The address: <https://en.wikipedia.org/w/index.php?title=Gospel_of_Matthew&oldid=1382126669>
- The reading of the accuracy reviewer: CONFIRMED FINDING. The lead says in its own voice, with no citation, that the gospel comes from the last 25 years of the first century, the infobox gives c. 80 to 90 AD, and note b gives the reasons of 'the majority', one of them the split of church and synagogue about AD 85 (France 2007). The critical part says only 'after AD 70', so the narrower range of the page is missing. Section: Lead; infobox; Composition: Author and date, note b.
- Status: confirmed.
- A change: Arthur decides whether the critical part gives the date range that the lead states; the part 'after AD 70' agrees with it.

#### F63. Luke, `authorDetail.critical`: a common view that the part does not have

- The part: "Late in the 20th century, critical scholars were about evenly split on whether Luke wrote it. Most now hold that the writer did travel with Paul, but some point to differences with his letters."
- The view of the page: Scholars largely agree that one author wrote this Gospel and Acts. The critical part does not say it; the conservative part does.
- The strength word of the page: 'Scholars largely agree'
- The work that the page cites: Wolter, The Gospel According to Luke (2021), p. 4.
- The first reading: as above.
- Evidence, a phrase of the page: "Scholars largely agree with the tradition attributing the Gospel to the same author"
- The section of the page: Luke-Acts: unity, authorship and date
- The address: <https://en.wikipedia.org/w/index.php?title=Gospel_of_Luke&oldid=1382641630>
- The reading of the accuracy reviewer: CONFIRMED FINDING. The page says scholars largely agree with the tradition that one writer wrote this Gospel and Acts (Wolter 2021), and the lead states the shared writer with no hedge. The critical part does not state this; only the conservative part does. Section: Composition: Luke-Acts: unity, authorship and date; Lead.
- Status: confirmed.
- A change: Arthur decides whether the critical part names the shared author of Luke and Acts.

#### F64. Luke, `writtenDetail.critical`: a common view that the part does not have

- The part: "Most scholars date it to about AD 80 to 90, after Mark and after the fall of Jerusalem."
- The view of the page: Many scholars disagree with a late date, because the work does not mention events such as the burning of Rome or the trial of Paul. The page does not say which date these scholars prefer, or whether 'late' means 80 to 90 or the early 2nd century.
- The strength word of the page: 'Many scholars'
- The work that the page cites: Paul Maier, 'Luke as a Hellenistic Historian Author' (2013).
- The first reading: as above.
- Evidence, a phrase of the page: "disagree with a late dating of Luke-Acts"
- The section of the page: Luke-Acts: unity, authorship and date
- The address: <https://en.wikipedia.org/w/index.php?title=Gospel_of_Luke&oldid=1382641630>
- The reading of the accuracy reviewer: CONFIRMED FINDING. The page says many scholars disagree with a late dating, because the work does not mention the burning of Rome, the first persecution, or the fall of Jerusalem, and Acts ends with no word of the trial of Paul before Nero; it cites one work, Maier 2013, with the odd marker [45.1]. The critical part has only the majority date of 80-90; the page does not say which date these scholars prefer, and their point about Jerusalem conflicts with the 80-90 argument, so late can include 80-90. Section: Composition: Luke-Acts: unity, authorship and date.
- Status: confirmed.
- A change: Arthur decides whether the critical part names this view; the page text does not show which date it means.

#### F65. John, `authorDetail.critical`: a common view that the part does not have

- The part: "Most scholars now prefer another writer, such as John the Elder, with the disciple Jesus loved as a main source. Many still hold that the apostle wrote it."
- The view of the page: The current tendency of scholars is to read the gospel as a coherent whole by a single author; the view of many editions by a community is in retreat.
- The strength word of the page: 'the current scholarly tendency'
- The work that the page cites: Mendez, The Gospel of John: A New History (2025); his quoted words speak of 'recent scholarly trends' and his own argument. The general view rests on this one citation, which Task 4c rule 3 allows.
- The first reading: as above.
- Evidence, a phrase of the page: "approach the work as a coherent whole by a single author"
- The section of the page: Lead; Structure and content
- The address: <https://en.wikipedia.org/w/index.php?title=Gospel_of_John&oldid=1384537258>
- The reading of the accuracy reviewer: NO FINDING. The page says the current scholarly tendency is to read the gospel as a coherent whole by a single author, and that the view of a communal product of many editions is in retreat; both statements cite one work, Méndez 2025, which itself speaks of recent trends. The critical part already speaks of one other writer and does not hold the many-editions view, so no view on the author is missing. Section: Lead; Authorship: Composition.
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Arthur decides whether the critical part names the single-author view.

#### F66. John, `authorDetail.critical`: a common view that the part does not have

- The part: "Most scholars now prefer another writer, such as John the Elder, with the disciple Jesus loved as a main source. Many still hold that the apostle wrote it."
- The view of the page: The page calls it a common belief that chapters 15 to 17 and 21 were added, by the author of the rest or by somebody else.
- The strength word of the page: 'commonly believed'
- The work that the page cites: Reinhartz 2020, p. 45; Attridge, Oxford Handbook of Johannine Studies (2018), p. 47; Moloney 1998, p. 23; Thompson 2015, p. 432.
- The first reading: as above.
- Evidence, a phrase of the page: "commonly believed to be added"
- The section of the page: Structure and content
- The address: <https://en.wikipedia.org/w/index.php?title=Gospel_of_John&oldid=1384537258>
- The reading of the accuracy reviewer: NO FINDING. The page calls it a common belief that chapters 15 to 17 and 21 were added, by the writer of the rest or by somebody else, notes that stages need not mean a new writer, and says a growing number see chapter 21 as original. The view leaves the writer open and gives no date, so I read it as no view on the author or the date that the critical part lacks. Section: Structure and content.
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Arthur decides whether the critical part names the common view of later chapters.

#### F67. Acts, `authorDetail.critical`: a common view that the part does not have

- The part: "Late in the 20th century, critical scholars were about evenly split on whether Luke wrote it. Most still hold that the writer travelled with Paul, but others note tensions with his letters."
- The view of the page: Acts and the Gospel of Luke have one author. The lead states it; the critical part does not say it, and the conservative part does.
- The strength word of the page: Stated as fact in the lead, with no strength word.
- The work that the page cites: Friedeman, The Revelation of the Messiah (2023), p. 14.
- The first reading: as above.
- Evidence, a phrase of the page: "share the same author"
- The section of the page: Lead
- The address: <https://en.wikipedia.org/w/index.php?title=Acts_of_the_Apostles&oldid=1385107055>
- The reading of the accuracy reviewer: CONFIRMED FINDING. The lead states as fact that Acts and the Gospel of Luke have the same author (Friedeman 2023), and the comparison section speaks of a consensus that Luke and Acts are one literary work. The critical part does not have this view. The view agrees with the tradition and with the conservative part, so the gap is small, and Arthur decides whether to add it. Section: Lead; Comparison with other writings: Gospel of Luke.
- Status: confirmed.
- A change: Arthur decides whether the critical part names the shared author of Luke and Acts.

#### F68. Acts, `writtenDetail.critical`: a common view that the part does not have

- The part: "Most scholars date it to about AD 80 to 90, after the fall of Jerusalem."
- The view of the page: Many scholars disagree with a late date, because Acts does not mention events such as the burning of Rome or the trial of Paul before Nero. The page does not say which date these scholars prefer, or whether 'late' means 80 to 90 or the early 2nd century.
- The strength word of the page: 'Many scholars'
- The work that the page cites: Paul Maier, 'Luke as a Hellenistic Historian Author' (2013).
- The first reading: as above.
- Evidence, a phrase of the page: "disagree with a late dating of Luke-Acts"
- The section of the page: Title, unity of Luke-Acts, authorship and date
- The address: <https://en.wikipedia.org/w/index.php?title=Acts_of_the_Apostles&oldid=1385107055>
- The reading of the accuracy reviewer: NO FINDING. The page says many scholars disagree with a late dating because Acts does not mention the burning of Rome, the first persecution, the fall of Jerusalem, or Paul's trial before Nero, but it names no date that they prefer and does not say whether 'late' means 80 to 90 or the early 2nd century. The conservative part already gives this view with the same reason, from the ESV, with 'many scholars'; I could not match the marker [36.1] to one entry of the list. Section: Composition and setting: Title, unity of Luke–Acts, authorship and date.
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Arthur decides whether the critical part names this view; the page text does not show which date it means.

#### F69. Titus, `authorDetail.critical`: a common view that the part does not have

- The part: "Most scholars think all three letters to Timothy and Titus were written after Paul's death, by someone using his name."
- The view of the page: Many scholars think Titus has the same writer as 1 and 2 Timothy, sometimes called 'the Pastor'.
- The strength word of the page: many scholars
- The work that the page cites: Footnote 12: Harris, Understanding the Bible (1985), 'The Pastoral Epistles', pp. 340 to 345.
- The first reading: as above.
- Evidence, a phrase of the page: "many scholars to believe that it was written by the same author"
- The section of the page: Opposition to Pauline authenticity
- The address: <https://en.wikipedia.org/w/index.php?title=Epistle_to_Titus&oldid=1380618954>
- The reading of the accuracy reviewer: CONFIRMED FINDING. The page says the close likeness to 1 Timothy has led many scholars to hold that one writer, sometimes called the Pastor, wrote all three letters (Harris 1985). The critical part says the three letters were written by someone using the name of Paul, which implies one writer but does not state it. Section: Authenticity: Opposition to Pauline authenticity.
- Status: confirmed.
- A change: Decide if the critical part names the common writer of the three letters.

#### F70. 1 Peter, `writtenDetail.critical`: a common view that the part does not have

- The part: "Most scholars think it was written after the death of Peter and the other apostles."
- The view of the page: A common supposition puts the letter in the reign of Domitian, AD 81 to 96.
- The strength word of the page: one common supposition
- The work that the page cites: The sentence has no footnote. The section names Achtemeier and Warden in the discussion.
- The first reading: as above.
- Evidence, a phrase of the page: "common supposition is that 1 Peter was written during the reign of Domitian"
- The section of the page: Context, Official persecution of Christians
- The address: <https://en.wikipedia.org/w/index.php?title=First_Epistle_of_Peter&oldid=1371626542>
- The reading of the accuracy reviewer: CONFIRMED FINDING. The page calls a date under Domitian, AD 81-96, one common supposition, then cites Achtemeier and says other scholars such as Warden dispute it; the next paragraph gives the setting under Pliny and Trajan, about AD 112, as often advanced. The critical part gives no date range; the common-supposition sentence has no citation of its own, so Task 4 condition 1 may not be met. Section: Context: Official persecution of Christians.
- Status: confirmed.
- A change: Decide if the critical part gives the Domitian date with the strength word of the page.

#### F71. 1 John, `authorDetail.critical`: a common view that the part does not have

- The part: "Most critical scholars hold that the apostle John wrote none of the five books that tradition credits to him."
- The view of the page: Most scholars think the three letters of John have the same writer; there is no consensus whether this writer also wrote the Gospel.
- The strength word of the page: most scholars
- The work that the page cites: Footnote 20: Hugo Mendez, The Gospel of John: A New History (2025).
- The first reading: as above.
- Evidence, a phrase of the page: "believe the three Johannine epistles have the same author"
- The section of the page: Lead and Authorship
- The address: <https://en.wikipedia.org/w/index.php?title=First_Epistle_of_John&oldid=1380152678>
- The reading of the accuracy reviewer: CONFIRMED FINDING. The page says most scholars believe the three Johannine letters have the same author, with no consensus whether this author also wrote the Gospel; the citation (Méndez 2025) says most critical commentators 'speculate' that one writer penned the three letters. The critical part gives only that the apostle wrote none of the five books, so this 'most scholars' view is missing. Section: Lead; Authorship.
- Status: confirmed.
- A change: Decide if the critical part gives the common writer of the three letters.

#### F72. 3 John, `authorDetail.critical`: a common view that the part does not have

- The part: "Most critical scholars hold that the apostle John wrote none of the five books credited to him. This letter is one of the five."
- The view of the page: 3 John has the same writer as 2 John, and likely 1 John; only a minority of scholars argue against a common writer of 2 and 3 John.
- The strength word of the page: almost certainly; a minority argue against
- The work that the page cites: Footnote 28: Brooke, pages lxxiii and lxxv. The page names Bultmann for the minority view.
- The first reading: as above.
- Evidence, a phrase of the page: "almost certainly written by the same author who wrote 2 John"
- The section of the page: Authorship
- The address: <https://en.wikipedia.org/w/index.php?title=Third_Epistle_of_John&oldid=1382161569>
- The reading of the accuracy reviewer: CONFIRMED FINDING. The page says 3 John was almost certainly by the writer of 2 John and likely of 1 John (Brooke), and that a minority argue against a common writer of 2 and 3 John (Brown). The critical part says only that most critical scholars reject the apostle for all five books, so the common-writer view is absent; it is not the view of one scholar. Section: Authorship.
- Status: confirmed.
- A change: Decide if the critical part gives the common writer of 2 and 3 John.

#### F73. Jude, `writtenDetail.critical`: a common view that the part does not have

- The part: "The date is not known, and proposals run from about AD 50 to 110. Scholars who doubt that Jude wrote it generally prefer the later dates, about AD 90 to 110 or after."
- The view of the page: The lead gives the late 1st century as the most likely time of writing.
- The strength word of the page: most likely
- The work that the page cites: The lead sentence has no footnote. The Date section names Reicke, Raisanen, and Ehrman for about AD 90 or the end of the 1st century.
- The first reading: as above.
- Evidence, a phrase of the page: "most likely written in the late first century"
- The section of the page: Lead
- The address: <https://en.wikipedia.org/w/index.php?title=Epistle_of_Jude&oldid=1381122352>
- The reading of the accuracy reviewer: NO FINDING. The lead gives the late first century as the most likely time, in the own voice of the page with no citation, and the Date section says the date is not known and gives a late first century date only from named scholars: Reicke, Raisanen, and Ehrman. Most likely is a word of probability, not of a common view, and the critical part already has the dates of 90 to 110 that pseudonymity scholars generally favour. Section: Lead; Authorship: Date.
- Status: not confirmed.
- A change: If Arthur accepts the first reading: Decide if the critical part gives the late 1st century with the strength word of the page.

#### F74. Jude, `writtenDetail.critical`: a common view that the part does not have

- The part: "The date is not known, and proposals run from about AD 50 to 110. Scholars who doubt that Jude wrote it generally prefer the later dates, about AD 90 to 110 or after."
- The view of the page: Most of the many scholars who see borrowing between Jude and 2 Peter think Jude is the earlier text.
- The strength word of the page: many scholars; most favoring
- The work that the page cites: The text names no cited work for this sentence.
- The first reading: as above.
- Evidence, a phrase of the page: "with most favoring Jude as the earlier text"
- The section of the page: Lead
- The address: <https://en.wikipedia.org/w/index.php?title=Epistle_of_Jude&oldid=1381122352>
- The reading of the accuracy reviewer: CONFIRMED FINDING. The lead says many scholars see borrowing between Jude and 2 Peter, or a shared source, and that most of them put Jude first. The section on 2 Peter says most scholars take Jude as the source of the shared passages. The critical part does not have this order of the two letters. The view gives an order, not years, and I could not match the markers [50], [52], [53] to the list with certainty. Section: Lead; Similarity to 2 Peter.
- Status: confirmed.
- A change: Decide if the critical part gives the order of Jude and 2 Peter.

## Other points of the readers

The readers found these points outside the four checks. They have no verdict, and the accuracy reviewer did not read each of them a second time.

- Lamentations `written` says "by an eyewitness". The Lamentations page says in one place that the writers need not have seen the events, and in a different place it calls the fourth and fifth poems eyewitness reports.
- Hosea `written` says "just before the northern kingdom of Israel fell". The Hosea page puts most of the book in the reign of Jeroboam II, about 793 to 753 BCE, and dates the fall to 722 BCE.
- Titus `authorDetail.critical` has "Most scholars" from the 1 Timothy page, which its record names. The Titus page has "some scholars" for the same view.
- John has no `writtenDetail`. The John page gives AD 90 to 100 as the consensus, and the `written` statement agrees with it, so check 3 gives no dispute.
- 2 Corinthians: the record does not name the question of the unity of the letter. The page says that many take chapters 10 to 13 as part of an earlier letter.
- Micah `writtenDetail.critical` has the years 539 to 332 BC and from 332 BC. The Micah page does not give these years. Task 4c rule 1 makes `public/data/periods.json` their source.
- Amos `writtenDetail.critical`: both of its facts are only in a footnote of the page, a quotation of Couey 2021, not in the body of the article.
- Obadiah: the footnote of the sentence on the majority of scholars is an article with the title "Dating Obadiah to 801 BC". No reader checked what that article says.
- Isaiah `written`: Easton gives the start of the work of Isaiah as probably 762 BC. The statement has "called about 740 BC" from the ESV page.
- The pages of Daniel, Hosea, Jonah, Micah, and some others have a list of notes before the list of references. On those pages, the readers matched a footnote marker to the list of references. For Psalms footnote [40], and for Acts and Jude markers [36.1], [50], [52], and [53], a reader did not find a second way to check the match.
- F48 and F50 have the same view, the same page, and the same record note, for 1 and 2 Chronicles. The accuracy reviewer read them in two different runs, and gave F48 as a finding and F50 as no finding. The record already names this view, with a decision of Arthur of 2026-11-13.

## The pages

Each fixed page that the records name: 63 pages of Wikipedia and 70 pages of Easton's Bible Dictionary on Wikisource. Task 53 gives 69 Easton pages. The records name 70 different Easton addresses, because the entry "Joshua" for the person and the entry "Joshua, Book of" are two pages. For each page, the revision of the API answer is the same as the `oldid` of the record. The size is the size of the text copy, in bytes and in words.

| Address | Revision | Same as oldid | Bytes | Words |
|---|---|---|---|---|
| <https://en.wikipedia.org/w/index.php?title=Acts_of_the_Apostles&oldid=1385107055> | 1385107055 | yes | 52190 | 7936 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Amos&oldid=1384657256> | 1384657256 | yes | 16127 | 2418 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Daniel&oldid=1366297531> | 1366297531 | yes | 57471 | 9086 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Deuteronomy&oldid=1381459516> | 1381459516 | yes | 31366 | 4690 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Esther&oldid=1383126666> | 1383126666 | yes | 59023 | 9063 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Exodus&oldid=1383653829> | 1383653829 | yes | 25978 | 4023 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Ezekiel&oldid=1376542749> | 1376542749 | yes | 24335 | 3808 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Ezra&oldid=1368563443> | 1368563443 | yes | 21640 | 3347 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Genesis&oldid=1385020338> | 1385020338 | yes | 42115 | 6439 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Habakkuk&oldid=1384644727> | 1384644727 | yes | 34882 | 5097 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Haggai&oldid=1331048975> | 1331048975 | yes | 9503 | 1425 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Hosea&oldid=1367237111> | 1367237111 | yes | 17316 | 2706 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Isaiah&oldid=1385341420> | 1385341420 | yes | 25813 | 3996 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Jeremiah&oldid=1376288136> | 1376288136 | yes | 23298 | 3521 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Job&oldid=1385369652> | 1385369652 | yes | 41264 | 6570 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Joel&oldid=1359511431> | 1359511431 | yes | 20651 | 3104 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Jonah&oldid=1384944152> | 1384944152 | yes | 28383 | 4464 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Joshua&oldid=1382152172> | 1382152172 | yes | 61935 | 9308 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Judges&oldid=1383106058> | 1383106058 | yes | 31755 | 4841 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Lamentations&oldid=1384960722> | 1384960722 | yes | 20851 | 3141 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Leviticus&oldid=1383765592> | 1383765592 | yes | 28765 | 4224 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Malachi&oldid=1383150392> | 1383150392 | yes | 24396 | 3841 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Micah&oldid=1338589698> | 1338589698 | yes | 24950 | 3876 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Nahum&oldid=1382362641> | 1382362641 | yes | 17069 | 2677 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Nehemiah&oldid=1382984300> | 1382984300 | yes | 15499 | 2361 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Numbers&oldid=1384977761> | 1384977761 | yes | 28697 | 4451 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Obadiah&oldid=1385495705> | 1385495705 | yes | 9876 | 1504 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Proverbs&oldid=1383125765> | 1383125765 | yes | 21771 | 3262 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Revelation&oldid=1382810217> | 1382810217 | yes | 93294 | 14262 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Ruth&oldid=1374486736> | 1374486736 | yes | 22654 | 3554 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Zechariah&oldid=1336450203> | 1336450203 | yes | 14574 | 2209 |
| <https://en.wikipedia.org/w/index.php?title=Book_of_Zephaniah&oldid=1381816563> | 1381816563 | yes | 13343 | 1974 |
| <https://en.wikipedia.org/w/index.php?title=Books_of_Chronicles&oldid=1385511143> | 1385511143 | yes | 15646 | 2379 |
| <https://en.wikipedia.org/w/index.php?title=Books_of_Kings&oldid=1383630651> | 1383630651 | yes | 61519 | 10245 |
| <https://en.wikipedia.org/w/index.php?title=Books_of_Samuel&oldid=1381292867> | 1381292867 | yes | 63348 | 10620 |
| <https://en.wikipedia.org/w/index.php?title=Ecclesiastes&oldid=1383994169> | 1383994169 | yes | 40444 | 6110 |
| <https://en.wikipedia.org/w/index.php?title=Epistle_of_James&oldid=1381128437> | 1381128437 | yes | 45953 | 7157 |
| <https://en.wikipedia.org/w/index.php?title=Epistle_of_Jude&oldid=1381122352> | 1381122352 | yes | 32563 | 5237 |
| <https://en.wikipedia.org/w/index.php?title=Epistle_to_Philemon&oldid=1361421780> | 1361421780 | yes | 22242 | 3453 |
| <https://en.wikipedia.org/w/index.php?title=Epistle_to_Titus&oldid=1380618954> | 1380618954 | yes | 7703 | 1164 |
| <https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Colossians&oldid=1383782061> | 1383782061 | yes | 21623 | 3326 |
| <https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Ephesians&oldid=1383596087> | 1383596087 | yes | 19155 | 2933 |
| <https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Galatians&oldid=1381112578> | 1381112578 | yes | 40728 | 6313 |
| <https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Hebrews&oldid=1379598353> | 1379598353 | yes | 33138 | 5134 |
| <https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Philippians&oldid=1379537322> | 1379537322 | yes | 44876 | 6978 |
| <https://en.wikipedia.org/w/index.php?title=Epistle_to_the_Romans&oldid=1378304133> | 1378304133 | yes | 45728 | 7319 |
| <https://en.wikipedia.org/w/index.php?title=First_Epistle_of_John&oldid=1380152678> | 1380152678 | yes | 22216 | 3503 |
| <https://en.wikipedia.org/w/index.php?title=First_Epistle_of_Peter&oldid=1371626542> | 1371626542 | yes | 22006 | 3407 |
| <https://en.wikipedia.org/w/index.php?title=First_Epistle_to_Timothy&oldid=1380614415> | 1380614415 | yes | 23182 | 3596 |
| <https://en.wikipedia.org/w/index.php?title=First_Epistle_to_the_Corinthians&oldid=1379310716> | 1379310716 | yes | 59547 | 9189 |
| <https://en.wikipedia.org/w/index.php?title=First_Epistle_to_the_Thessalonians&oldid=1384544583> | 1384544583 | yes | 16484 | 2482 |
| <https://en.wikipedia.org/w/index.php?title=Gospel_of_John&oldid=1384537258> | 1384537258 | yes | 90082 | 13645 |
| <https://en.wikipedia.org/w/index.php?title=Gospel_of_Luke&oldid=1382641630> | 1382641630 | yes | 52250 | 7900 |
| <https://en.wikipedia.org/w/index.php?title=Gospel_of_Mark&oldid=1382234826> | 1382234826 | yes | 66759 | 10259 |
| <https://en.wikipedia.org/w/index.php?title=Gospel_of_Matthew&oldid=1382126669> | 1382126669 | yes | 47787 | 7171 |
| <https://en.wikipedia.org/w/index.php?title=Psalms&oldid=1384360902> | 1384360902 | yes | 65059 | 9961 |
| <https://en.wikipedia.org/w/index.php?title=Second_Epistle_of_John&oldid=1380152630> | 1380152630 | yes | 9278 | 1445 |
| <https://en.wikipedia.org/w/index.php?title=Second_Epistle_of_Peter&oldid=1376928962> | 1376928962 | yes | 41803 | 6670 |
| <https://en.wikipedia.org/w/index.php?title=Second_Epistle_to_Timothy&oldid=1380613086> | 1380613086 | yes | 12027 | 1896 |
| <https://en.wikipedia.org/w/index.php?title=Second_Epistle_to_the_Corinthians&oldid=1348875221> | 1348875221 | yes | 10732 | 1680 |
| <https://en.wikipedia.org/w/index.php?title=Second_Epistle_to_the_Thessalonians&oldid=1380546028> | 1380546028 | yes | 26696 | 4081 |
| <https://en.wikipedia.org/w/index.php?title=Song_of_Songs&oldid=1382222334> | 1382222334 | yes | 40828 | 6518 |
| <https://en.wikipedia.org/w/index.php?title=Third_Epistle_of_John&oldid=1382161569> | 1382161569 | yes | 20738 | 3421 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FActs_of_the_Apostles&oldid=11541844> | 11541844 | yes | 5887 | 1032 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FAmos&oldid=734512> | 734512 | yes | 2561 | 438 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FChronicles%2C_Books_of&oldid=734537> | 734537 | yes | 5601 | 946 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FColossians%2C_Epistle_to_the&oldid=734542> | 734542 | yes | 3154 | 531 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FCorinthians%2C_First_Epistle_to_the&oldid=734543> | 734543 | yes | 3995 | 660 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FCorinthians%2C_Second_Epistle_to_the&oldid=734544> | 734544 | yes | 3255 | 539 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FDaniel%2C_Book_of&oldid=734493> | 734493 | yes | 2955 | 507 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FDeuteronomy&oldid=12568368> | 12568368 | yes | 5540 | 937 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FEcclesiastes&oldid=735483> | 735483 | yes | 1698 | 283 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FEphesians%2C_Epistle_to_the&oldid=735484> | 735484 | yes | 7336 | 1232 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FEsther%2C_Book_of&oldid=735489> | 735489 | yes | 1496 | 255 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FExodus%2C_Book_of&oldid=721436> | 721436 | yes | 1949 | 329 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FEzekiel&oldid=735493> | 735493 | yes | 1699 | 290 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FEzekiel%2C_Book_of&oldid=735491> | 735491 | yes | 3317 | 533 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FEzra%2C_Book_of&oldid=735496> | 735496 | yes | 1988 | 351 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FGalatians%2C_Epistle_to_the&oldid=6960740> | 6960740 | yes | 4535 | 763 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FGenesis&oldid=2961148> | 2961148 | yes | 2497 | 418 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FHabakkuk%2C_Prophecies_of&oldid=5175902> | 5175902 | yes | 1753 | 289 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FHaggai%2C_Book_of&oldid=735502> | 735502 | yes | 1298 | 212 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FHebrews%2C_Epistle_to_the&oldid=735504> | 735504 | yes | 3175 | 528 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FHosea&oldid=735515> | 735515 | yes | 1336 | 222 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FHosea%2C_Prophecies_of&oldid=735514> | 735514 | yes | 2554 | 403 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FIsaiah&oldid=735521> | 735521 | yes | 4548 | 771 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FIsaiah%2C_Book_of&oldid=735519> | 735519 | yes | 4169 | 708 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJames%2C_Epistle_of&oldid=736087> | 736087 | yes | 2487 | 400 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJeremiah&oldid=736090> | 736090 | yes | 3802 | 669 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJeremiah%2C_Book_of&oldid=736089> | 736089 | yes | 2277 | 382 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJob%2C_Book_of&oldid=7352541> | 7352541 | yes | 3792 | 653 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJoel%2C_Book_of&oldid=736099> | 736099 | yes | 1580 | 268 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJohn%2C_First_Epistle_of&oldid=736103> | 736103 | yes | 1384 | 240 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJohn%2C_Gospel_of&oldid=736102> | 736102 | yes | 2700 | 466 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJohn%2C_Second_Epistle_of&oldid=736106> | 736106 | yes | 1093 | 180 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJohn%2C_Third_Epistle_of&oldid=736108> | 736108 | yes | 1199 | 202 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJonah%2C_Book_of&oldid=736109> | 736109 | yes | 2461 | 418 |
| <https://en.wikisource.org/w/index.php?title=Easton%27s_Bible_Dictionary_(1897)/Joshua&oldid=736115> | 736115 | yes | 3828 | 670 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJoshua%2C_Book_of&oldid=809141> | 809141 | yes | 6008 | 1015 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJude%2C_Epistle_of&oldid=736126> | 736126 | yes | 2493 | 423 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FJudges%2C_Book_of&oldid=736128> | 736128 | yes | 3654 | 658 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FKings%2C_Books_of&oldid=736129> | 736129 | yes | 2996 | 508 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FLamentations%2C_Book_of&oldid=736134> | 736134 | yes | 3352 | 572 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FLeviticus&oldid=736142> | 736142 | yes | 3511 | 594 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FLuke&oldid=736153> | 736153 | yes | 1921 | 325 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FLuke%2C_Gospel_according_to&oldid=736155> | 736155 | yes | 4557 | 768 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FMalachi%2C_Prophecies_of&oldid=759883> | 759883 | yes | 1624 | 268 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FMark&oldid=759889> | 759889 | yes | 2208 | 383 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FMark%2C_Gospel_according_to&oldid=6923055> | 6923055 | yes | 3900 | 639 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FMatthew&oldid=4792053> | 4792053 | yes | 1580 | 280 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FMatthew%2C_Gospel_according_to&oldid=6923052> | 6923052 | yes | 4374 | 737 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FMicah%2C_Book_of&oldid=759890> | 759890 | yes | 2109 | 359 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FNahum%2C_Book_of&oldid=759948> | 759948 | yes | 2112 | 352 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FNehemiah%2C_Book_of&oldid=759893> | 759893 | yes | 2172 | 372 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FNumbers%2C_Book_of&oldid=759898> | 759898 | yes | 3029 | 519 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FObadiah%2C_Book_of&oldid=759909> | 759909 | yes | 1941 | 331 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FPeter%2C_First_Epistle_of&oldid=759911> | 759911 | yes | 1796 | 296 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FPeter%2C_Second_Epistle_of&oldid=759912> | 759912 | yes | 1932 | 322 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FPhilemon%2C_Epistle_to&oldid=759921> | 759921 | yes | 1792 | 297 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FPhilippians%2C_Epistle_to_the&oldid=759916> | 759916 | yes | 4053 | 676 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FProverbs%2C_Book_of&oldid=759934> | 759934 | yes | 2519 | 427 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FPsalms&oldid=759929> | 759929 | yes | 4581 | 811 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FRevelation%2C_Book_of&oldid=739847> | 739847 | yes | 2282 | 397 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FRomans%2C_Epistle_to_the&oldid=739867> | 739867 | yes | 3274 | 559 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FRuth%2C_Book_of&oldid=739870> | 739870 | yes | 1468 | 255 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FSamuel%2C_Books_of&oldid=14300183> | 14300183 | yes | 2541 | 430 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FSolomon%2C_Song_of&oldid=739885> | 739885 | yes | 1410 | 238 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FThessalonians%2C_Epistles_to_the&oldid=6957629> | 6957629 | yes | 2431 | 392 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FTimothy%2C_First_Epistle_to&oldid=740108> | 740108 | yes | 1568 | 253 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FTimothy%2C_Second_Epistle_to&oldid=740109> | 740109 | yes | 1383 | 237 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FTitus%2C_Epistle_to&oldid=4546647> | 4546647 | yes | 2743 | 472 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FZechariah&oldid=740119> | 740119 | yes | 4203 | 740 |
| <https://en.wikisource.org/w/index.php?title=Easton's_Bible_Dictionary_(1897)%2FZephaniah&oldid=740124> | 740124 | yes | 2070 | 344 |

## Not checked

- The ESV pages. The records also name pages of the ESV Global Study Bible. This task checks only the Wikipedia pages and the Easton pages.
- The facts of a statement that come from a different source of the site, for example the years of a period from `public/data/periods.json`, or a verse of the Berean Standard Bible.
- The works that a footnote cites. The checks read the footnote in the page, not the book or the article that it names.
- The current pages of Wikipedia and Wikisource. The checks used only the fixed revisions.
- The `whatItIs` statements. They are not in the four checks of the task.
- Check 4 for the books with no detail. The task asks check 4 only for the books with a detail. Check 3 covers the other books.
- The numbers of the footnotes on some pages. On pages with a list of notes before the list of references, two agents matched a footnote marker to the list of references. One agent did not find a second way to check footnote [40] of the Psalms page.
- The full browser test run. No file of the site changed, so I ran only `npm run lint`, `npm run build`, and `npm test`.
