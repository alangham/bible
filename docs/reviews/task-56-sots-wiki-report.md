# Task 56: the wiki of the Society for Old Testament Study as a possible source

Date: 2026-11-24. This report changes no page of the site, no statement of `public/data/intros.json`, no record of `docs/CONTENT-SOURCES.md`, and no `review` value.

In this report, "the wiki" is the wiki at <https://www.sots.ac.uk/wiki/>. "The site" is Bible Wall. "The part" is a `critical` part of an introduction. "The review" is `docs/reviews/intros-review-model-2026-11-24.md`.

## The result

- Terms: no page that I read gives a licence, or a permission to use the content on a different site. Each page has the line "© 2026 The Society for Old Testament Study. Registered charity X81994." at its foot.
- Kind: the wiki has an article for 38 of the 39 books. No article that I read shows a named author or a date, and the pages have no revision.
- Step 5, the 27 `critical` parts: 12 DIFFERENT, 12 WEAKER, 3 STRONGER, 0 AGREES, 0 SILENT. The second reading confirmed 18 of the 27 verdicts.
- Step 6, the 36 `author` and `written` statements: 5 findings, 4 confirmed. Two of the confirmed, Ecclesiastes and Song of Solomon, are only a different critical view, by the report of the reviewer agent.
- Step 7, the 78 claims and new sentences of the 18 notes: 32 SUPPORTED, 44 NOT IN THE ARTICLE, 2 AGAINST THE ARTICLE. Of the last two groups, 42 of 46 are confirmed.
- Step 9: if the article leads, 14 of the 27 parts get a different count word and 8 lose their count word, by the first reading. If Wikipedia leads, 0 confirmed findings of Task 53 change a count word.

## Read first

These are the findings that Arthur must read first, ten at most.

1. Terms. No page that I read permits or forbids the use of the content by a different site. I found no sentence on copyright, quotation, or links in the home page, the wiki page, the page of policies, the Rules page, the page on cookies, the news page, or the page "How to contribute". The foot line is the only copyright sentence on the content of the website. One news item of 2019 has a copyright line for a photo. The approved sources table of the site has one source under copyright, the ESV Global Study Bible, with the rule "Facts only. No sentence is copied."
2. The wiki says that its articles are signed. No article that I read has a name at its head or its foot, and no article page has a date of its last change. The 18 copies of the Internet Archive that I compared have no name either. I searched the page code for a class or a field with an author and found none.
3. Two parts have a direct opposite in the article, and both readings agree. W18: Ezekiel. The site says that scholars agree that Ezekiel wrote the prophecy down, and the article says that others likely did the writing after his death. W05: Nehemiah. The site says that the genuineness is very controversial, and the article says that most scholars see the account as more or less authentic.
4. Four more parts are DIFFERENT in both readings: W06 Nehemiah `written`, W11 Psalms `written`, W25 Zechariah `written`, and W27 Malachi `written`. For Psalms, the article puts the compilation probably by the 2nd century BCE at the latest, and the site reports an argument for an open collection until the 1st century AD.
5. The article for Numbers and the article for the Pentateuch of the same wiki differ. Numbers says that there is no consensus now on how the first five books were formed. Pentateuch says that it is generally held that they reached their present form in the 5th century BCE or later. The site says "Most modern scholars think", for after about 520 BC. The note on Numbers cites only the article "Numbers". Task 4c rule 2 lets an article about a group of books count as a source for each book.
6. Two new sentences of the review are against its own source, and both readings agree. W66: Ezekiel "about 593 to 571 BC". The article ends its dates at 573. That end is an oddity of the article: the Berean text of Ezekiel 29:17 has a later year than 40:1, so the review is not shown to be wrong. W68: Jonah "When the book was written is disputed". The article says that modern scholars agree on the post-exilic period.
7. The review cites the wiki for 18 notes. Of its 78 claims and new sentences, 31 are SUPPORTED in both readings and 40 are NOT IN THE ARTICLE in both. The new sentences often add a count word, "Many", that the article does not have.
8. Four cover statements have a confirmed finding of step 6: W28 Psalms `author`, W29 Proverbs `written`, W30 Ecclesiastes `author`, and W31 Song of Solomon `written`. The cover gives the traditional view, and the article gives the critical view. Section 4.2 permits this. For Psalms, Proverbs, and Song of Solomon, the statement does not have the words "By tradition". The reviewer agent reads Ecclesiastes and Song of Solomon as only a different critical view, which step 6 does not count. For these two, the question is open. W32 Malachi `author` is not confirmed.
9. The wiki has errors or odd points that a reader can see: see "Oddities". I found five, in Numbers, Deuteronomy, Psalms, Proverbs, and Ezekiel, all of them books of this task. Two are on a date: Numbers gives "the 19th century" for a source that its other article puts earlier in the monarchy, and Deuteronomy gives "the 5th century BCE" for the chronology of the Bible, for a book set before the Judges.
10. The text of the 18 articles is old. The Internet Archive copies of 2024 to 2026 give publication in July or August 2020 and a last change in 2021, and they have the same words as the live pages. The rebuild of 1 September 2026 did not change the words that I compared. The live pages show no date, so a reader cannot see this.

## How I did the checks

1. I got each page with `curl` on 2026-11-24, between 22:52 and 23:20 UTC. I made a text copy of each page outside the repository, in UTF-8, from the part of the page inside `main`. Each text copy has a SHA-256.
2. I read the 18 articles and wrote a first verdict for each item. Each finding of steps 5 and 6 has a phrase of 15 words or fewer of the article, and a script found each phrase in the text copy.
3. Three agents of the kind accuracy reviewer read each item of steps 5 to 7 a second time, from the text copies, without the first verdicts. They read all the items, also the ones that I had as SUPPORTED, so that the selection did not show a verdict. A finding is "confirmed" when the two readings agree on the verdict.
4. No article had text addressed to a reader or to a model. The page "How to contribute" asks users to contact the editor; I did not contact anyone.
5. The verdicts of step 5 compare the article with the part. WEAKER means that the strength word of the article is weaker than that of the part. STRONGER means that it is stronger. A part with two points has the verdict of the first of these that occurs: DIFFERENT, then WEAKER or STRONGER, then AGREES. SILENT is the verdict only if the article speaks about no point. A point that the article does not speak about is named as SILENT in the block.
6. The verdicts of step 7 judge each part of a sentence. One part against the article makes the sentence AGAINST THE ARTICLE. Otherwise one part that the article does not have, also a count word that it does not give, makes it NOT IN THE ARTICLE. "Many" counts as SUPPORTED where the article says "most".
7. Only the note on Nehemiah says what the Society says. The other 17 notes cite the wiki at the end of the note. I checked the sentences of new words against the article of that book, and the claim on the Septuagint of Habakkuk against the article "The Septuagint", which the note cites.

## The terms, step 1

| Page | What it says on the use of its content |
|---|---|
| Home page | Nothing on copyright, licence, quotation, or links. It calls the wiki a reference wiki that its members write. |
| Wiki page | Nothing on use. It says that articles are signed, short, and revised as the field moves, and that the wiki "is not an encyclopaedia of record". |
| Policies | Four documents: the Rules, a GDPR policy, the essay prize, and the cookies page. None is a policy on the use of the content by a different site. |
| Rules, web page | I searched for copyright, licence, permission, and wiki. None found, apart from the menu. I did not open the PDF of the Rules. |
| Cookies | Nothing on use. It has a date: 14 October 2026. |
| How to contribute | Only members in good standing can write an article. It names an editor, Dr David Firth. |
| Foot of each page | "© 2026 The Society for Old Testament Study. Registered charity X81994." |
| `robots.txt` | Permits all pages, except `/admin`, the members pages, and the shop. |
| The old website, a copy of 2025 | The foot has "©SOTS 2015" and "© 2024 The Society for Old Testament Study". It names no licence. |

The policies PDF files and the GDPR policy page are outside this search. The answer to "does the Society permit the use of the content?" is not on a page that I read.

## What the wiki is, step 2

- Publisher: the Society for Old Testament Study, a learned society of the British Isles from 1917, a registered charity with the number X81994. Its members write the articles.
- Who writes: members. The wiki page says that entries are by working scholars. The page "How to contribute" names an editor, Dr David Firth. The committee page says that the post of the wiki editor is vacant now, and that the Information Officer helps with the wiki.
- Named author and date: none on the 36 pages of the book articles that I read (35 articles and the placeholder for Ezra), in text or in page code. The wiki page says "signed".
- Works cited: 35 of 35 book articles have a list "Further reading" (Lamentations: "Further Reading"). Inside the date part, 5 of the 18 articles name a scholar with a year from 1805 or later: Deuteronomy (de Wette, 1805), Nehemiah, Proverbs, Ecclesiastes (Fox, 1977, for the frame of the book), and Jeremiah. Malachi names R. J. Coggins and David L. Petersen with no year. Lamentations names Ian W. Provan with no year, for one view. Zechariah names Joseph Mede of about 1630.
- Can a text change: yes. The wiki page says that entries are "revised as the field moves". There is no version, no history, and no date of the last change. The reply header `x-sf-version` gave 2026-11-20 for the website, not for an article.
- Can an address change: the website was built again on 1 September 2026. The address with a slash at the end, as in the Internet Archive, answers 301 to the address with no slash: I got this for `/wiki/numbers/` at 2026-11-24 23:19:31 UTC. I did not find a promise that an address will stay.
- A page that does not exist answers 404: I got this for `/wiki/this-page-does-not-exist` at 2026-11-24 23:19:31 UTC.
- 19 entries of the index have "in preparation", and the article on Ezra is one of them. The article on Micah has "t.b.a." in its part on reception history, and one line of Malachi has old wiki markup.

### Oddities of the articles

I checked each with the bundled Berean Standard Bible or with a different page of the wiki. I did not use memory.

1. Numbers: J "belonged to the 19th century". In the same paragraph, the article says that the traditional dating of J is in the period of the monarchy. The article "Pentateuch" puts J and E in the monarchy.
2. Deuteronomy: the chronology of the Bible would place the book in "the 5th century BCE". The sentence before it puts the setting shortly after the exodus, before the Judges and the monarchy.
3. Psalms: the five books are given as Psalms 90–105 and 106–150. The Berean text has 90–106 and 107–150.
4. Proverbs: the article puts Ahithophel, as a counselor of David and Absalom, in "2 Kgs 15–16". The Berean text has him in 2 Samuel 15.
5. Ezekiel: the dates are said to end at 573, in 40:1. The Berean text of 29:17 has the twenty-seventh year, and 40:1 has the twenty-fifth year.

### The Internet Archive

The address of the newest copy that has the text of the article. The site index of the Internet Archive gave these copies. I opened each copy, and I compared its words with the live text copy: each paragraph of more than 60 characters of the live copy is in the archive copy, for 18 of 18. The archive copy has no article text that the live copy does not have. The dates of publication and of the last change are in the page code of the copies.

| Book | Newest copy with the text | Published | Last change |
|---|---|---|---|
| Numbers | `https://web.archive.org/web/20260301092739/https://www.sots.ac.uk/wiki/numbers/` | 2020-08-01 | 2021-04-13 |
| Deuteronomy | `https://web.archive.org/web/20240519011151/https://www.sots.ac.uk/wiki/deuteronomy/` | 2020-08-01 | 2021-04-02 |
| Nehemiah | `https://web.archive.org/web/20250517124240/https://www.sots.ac.uk/wiki/nehemiah/` | 2020-08-01 | 2021-04-13 |
| Esther | `https://web.archive.org/web/20250519145724/https://www.sots.ac.uk/wiki/esther/` | 2020-08-01 | 2021-04-03 |
| Job | `https://web.archive.org/web/20250517114609/https://www.sots.ac.uk/wiki/job/` | 2020-08-01 | 2021-04-05 |
| Psalms | `https://web.archive.org/web/20250805080248/https://www.sots.ac.uk/wiki/psalms/` | 2020-08-01 | 2021-04-15 |
| Proverbs | `https://web.archive.org/web/20250517114652/https://www.sots.ac.uk/wiki/proverbs/` | 2020-08-01 | 2021-04-15 |
| Ecclesiastes | `https://web.archive.org/web/20250519191827/https://www.sots.ac.uk/wiki/ecclesiastes/` | 2020-08-01 | 2021-03-09 |
| Song of Solomon | `https://web.archive.org/web/20250517114047/https://www.sots.ac.uk/wiki/song-of-songs/` | 2020-08-01 | 2021-04-17 |
| Jeremiah | `https://web.archive.org/web/20250519201045/https://www.sots.ac.uk/wiki/jeremiah/` | 2020-08-01 | 2021-04-03 |
| Lamentations | `https://web.archive.org/web/20250517115522/https://www.sots.ac.uk/wiki/lamentations/` | 2020-08-01 | 2021-01-13 |
| Ezekiel | `https://web.archive.org/web/20250517123733/https://www.sots.ac.uk/wiki/ezekiel/` | 2020-08-01 | 2021-04-03 |
| Jonah | `https://web.archive.org/web/20250517113342/https://www.sots.ac.uk/wiki/jonah/` | 2020-07-31 | 2021-04-05 |
| Micah | `https://web.archive.org/web/20250519163750/https://www.sots.ac.uk/wiki/micah/` | 2020-07-31 | 2021-04-10 |
| Nahum | `https://web.archive.org/web/20250517115607/https://www.sots.ac.uk/wiki/nahum/` | 2020-07-31 | 2021-04-13 |
| Habakkuk | `https://web.archive.org/web/20250517130236/https://www.sots.ac.uk/wiki/habakkuk/` | 2020-07-31 | 2021-04-03 |
| Zechariah | `https://web.archive.org/web/20250517114707/https://www.sots.ac.uk/wiki/zechariah/` | 2020-07-31 | 2021-04-22 |
| Malachi | `https://web.archive.org/web/20250517120217/https://www.sots.ac.uk/wiki/malachi/` | 2020-07-31 | 2021-04-09 |

For Numbers, the newest entry of the index is of 2026-05-17 with status 202. It is a page with no article text. The table gives the newest copy with the text, of 2026-03-01. I found no copy of the 18 pages from after the rebuild of 1 September 2026 in the index that I got.

## Coverage, step 3

The number of words is that of the text copy, with the title, the breadcrumb, and the list "Further reading". Each page has one address; 1 and 2 Samuel, 1 and 2 Kings, and 1 and 2 Chronicles share one article each.

| Book | Article | Address | Words | Part on date and author |
|---|---|---|---|---|
| Genesis | Yes | https://www.sots.ac.uk/wiki/genesis | 1,222 | Date |
| Exodus | Yes | https://www.sots.ac.uk/wiki/exodus | 2,292 | Date and authorship |
| Leviticus | Yes | https://www.sots.ac.uk/wiki/leviticus | 1,025 | Date |
| Numbers | Yes | https://www.sots.ac.uk/wiki/numbers | 1,770 | Date and authorship |
| Deuteronomy | Yes | https://www.sots.ac.uk/wiki/deuteronomy | 1,117 | Date and authorship |
| Joshua | Yes | https://www.sots.ac.uk/wiki/joshua | 991 | Date and authorship |
| Judges | Yes | https://www.sots.ac.uk/wiki/judges | 1,393 | Date and authorship |
| Ruth | Yes | https://www.sots.ac.uk/wiki/ruth | 1,293 | Date and authorship |
| 1 Samuel | Yes | https://www.sots.ac.uk/wiki/samuel | 2,492 | Date and authorship |
| 2 Samuel | Yes | https://www.sots.ac.uk/wiki/samuel | 2,492 | Date and authorship |
| 1 Kings | Yes | https://www.sots.ac.uk/wiki/kings | 1,243 | Date and authorship |
| 2 Kings | Yes | https://www.sots.ac.uk/wiki/kings | 1,243 | Date and authorship |
| 1 Chronicles | Yes | https://www.sots.ac.uk/wiki/chronicles | 1,179 | Date and authorship |
| 2 Chronicles | Yes | https://www.sots.ac.uk/wiki/chronicles | 1,179 | Date and authorship |
| Ezra | No. The page says "in preparation". | https://www.sots.ac.uk/wiki/ezra | 36 | No |
| Nehemiah | Yes | https://www.sots.ac.uk/wiki/nehemiah | 1,577 | Date and authorship |
| Esther | Yes | https://www.sots.ac.uk/wiki/esther | 971 | Date and authorship |
| Job | Yes | https://www.sots.ac.uk/wiki/job | 1,323 | Date and authorship |
| Psalms | Yes | https://www.sots.ac.uk/wiki/psalms | 3,031 | Date and authorship |
| Proverbs | Yes | https://www.sots.ac.uk/wiki/proverbs | 1,529 | Date and authorship |
| Ecclesiastes | Yes | https://www.sots.ac.uk/wiki/ecclesiastes | 1,749 | Date and authorship |
| Song of Solomon | Yes | https://www.sots.ac.uk/wiki/song-of-songs | 882 | Date |
| Isaiah | Yes | https://www.sots.ac.uk/wiki/isaiah | 1,293 | Date and authorship |
| Jeremiah | Yes | https://www.sots.ac.uk/wiki/jeremiah | 813 | Date and authorship |
| Lamentations | Yes | https://www.sots.ac.uk/wiki/lamentations | 1,379 | Date and authorship |
| Ezekiel | Yes | https://www.sots.ac.uk/wiki/ezekiel | 1,335 | Date and authorship |
| Daniel | Yes | https://www.sots.ac.uk/wiki/daniel | 682 | Date and authorship |
| Hosea | Yes | https://www.sots.ac.uk/wiki/hosea | 787 | Date and authorship |
| Joel | Yes | https://www.sots.ac.uk/wiki/joel | 778 | Date and authorship |
| Amos | Yes | https://www.sots.ac.uk/wiki/amos | 999 | Date and authorship |
| Obadiah | Yes | https://www.sots.ac.uk/wiki/obadiah | 916 | Date and authorship |
| Jonah | Yes | https://www.sots.ac.uk/wiki/jonah | 1,422 | Date and authorship |
| Micah | Yes | https://www.sots.ac.uk/wiki/micah | 990 | Date and authorship |
| Nahum | Yes | https://www.sots.ac.uk/wiki/nahum | 756 | Date and authorship |
| Habakkuk | Yes | https://www.sots.ac.uk/wiki/habakkuk | 1,026 | Date and authorship |
| Zephaniah | Yes | https://www.sots.ac.uk/wiki/zephaniah | 726 | Date and authorship |
| Haggai | Yes | https://www.sots.ac.uk/wiki/haggai | 2,299 | Date and authorship |
| Zechariah | Yes | https://www.sots.ac.uk/wiki/zechariah | 989 | Date and authorship |
| Malachi | Yes | https://www.sots.ac.uk/wiki/malachi | 1,109 | Date and authorship |

## The `critical` parts, step 5

One row for each of the 27 parts, in the order of the Bible. Lamentations has no `critical` part. The verdict is that of the first reading. The second reading is in the column "Second reading".

| No. | Book | Field | Verdict | Second reading | Status | Finding |
|---|---|---|---|---|---|---|
| 1 | Numbers | `authorDetail.critical` | DIFFERENT | WEAKER | not confirmed | W01 |
| 2 | Numbers | `writtenDetail.critical` | WEAKER | WEAKER | confirmed | W02 |
| 3 | Deuteronomy | `authorDetail.critical` | WEAKER | SILENT | not confirmed | W03 |
| 4 | Deuteronomy | `writtenDetail.critical` | WEAKER | WEAKER | confirmed | W04 |
| 5 | Nehemiah | `authorDetail.critical` | DIFFERENT | DIFFERENT | confirmed | W05 |
| 6 | Nehemiah | `writtenDetail.critical` | DIFFERENT | DIFFERENT | confirmed | W06 |
| 7 | Esther | `writtenDetail.critical` | WEAKER | WEAKER | confirmed | W07 |
| 8 | Job | `authorDetail.critical` | WEAKER | WEAKER | confirmed | W08 |
| 9 | Job | `writtenDetail.critical` | WEAKER | AGREES | not confirmed | W09 |
| 10 | Psalms | `authorDetail.critical` | WEAKER | AGREES | not confirmed | W10 |
| 11 | Psalms | `writtenDetail.critical` | DIFFERENT | DIFFERENT | confirmed | W11 |
| 12 | Proverbs | `authorDetail.critical` | DIFFERENT | WEAKER | not confirmed | W12 |
| 13 | Proverbs | `writtenDetail.critical` | STRONGER | STRONGER | confirmed | W13 |
| 14 | Ecclesiastes | `authorDetail.critical` | WEAKER | WEAKER | confirmed | W14 |
| 15 | Ecclesiastes | `writtenDetail.critical` | DIFFERENT | AGREES | not confirmed | W15 |
| 16 | Song of Solomon | `writtenDetail.critical` | WEAKER | WEAKER | confirmed | W16 |
| 17 | Jeremiah | `authorDetail.critical` | WEAKER | WEAKER | confirmed | W17 |
| 18 | Ezekiel | `authorDetail.critical` | DIFFERENT | DIFFERENT | confirmed | W18 |
| 19 | Jonah | `writtenDetail.critical` | STRONGER | STRONGER | confirmed | W19 |
| 20 | Micah | `authorDetail.critical` | DIFFERENT | SILENT | not confirmed | W20 |
| 21 | Micah | `writtenDetail.critical` | DIFFERENT | WEAKER | not confirmed | W21 |
| 22 | Nahum | `writtenDetail.critical` | DIFFERENT | WEAKER | not confirmed | W22 |
| 23 | Habakkuk | `authorDetail.critical` | WEAKER | WEAKER | confirmed | W23 |
| 24 | Zechariah | `authorDetail.critical` | WEAKER | WEAKER | confirmed | W24 |
| 25 | Zechariah | `writtenDetail.critical` | DIFFERENT | DIFFERENT | confirmed | W25 |
| 26 | Malachi | `authorDetail.critical` | STRONGER | STRONGER | confirmed | W26 |
| 27 | Malachi | `writtenDetail.critical` | DIFFERENT | DIFFERENT | confirmed | W27 |

### The findings of step 5

#### W01. Numbers, `authorDetail.critical`: DIFFERENT

- The part: "Scholars often trace the first five books of the Bible to four sources. They generally see each source as the work of a school of writers, not one person."
- The strength words: the part has "often; generally". The article has "general consensus (the older view); no consensus (now)".
- The first reading: Four sources: the article says that a consensus on three independent sources in Numbers (J, E, and P) held from the late 19th to the mid 20th century, that many doubts followed, and that there is no consensus now. It does not name a fourth source for Numbers. The second sentence of the part, on schools of writers: SILENT.
- Evidence, a phrase of the article: "there is no consensus as to how the books of the Pentateuch"
- The section of the article: Date and authorship
- The address: <https://www.sots.ac.uk/wiki/numbers>
- The second reading, of the accuracy reviewer: WEAKER. "Often" in the part. A general consensus only until the mid 20th century, for three sources in Numbers, then no consensus. Schools of writers: silent. DIFFERENT is arguable.
- Status: not confirmed.

#### W02. Numbers, `writtenDetail.critical`: WEAKER

- The part: "Most modern scholars think the first five books of the Bible reached their present form after about 520 BC."
- The strength words: the part has "Most modern scholars". The article has "general consensus (the older view); no consensus (now)".
- The first reading: The older consensus put the last editing at about the 5th century BCE, which fits the part. The article gives that consensus as a past one, and it says that there is no consensus now on how the first five books were formed. It gives no present view on the date of the finished text.
- Evidence, a phrase of the article: "a succession of editors until about the 5th century BCE"
- The section of the article: Date and authorship
- The address: <https://www.sots.ac.uk/wiki/numbers>
- The second reading, of the accuracy reviewer: WEAKER. Editors to about the 5th century in the older consensus, and no consensus today. No present majority for a date. DIFFERENT is arguable.
- Status: confirmed.

#### W03. Deuteronomy, `authorDetail.critical`: WEAKER

- The part: "Nearly all secular scholars reject the view that Moses wrote it. So do most scholars who are Christian or Jewish."
- The strength words: the part has "Nearly all secular scholars; most scholars who are Christian or Jewish". The article has "The majority of critical scholars".
- The first reading: The article says that the book was traditionally given to Moses, and that the majority of critical scholars place its first version in the 7th century BCE. It does not say how many scholars reject Moses as author, and it gives no count for secular, Christian, or Jewish scholars. It adds that conservative scholars have always argued for an earlier date.
- Evidence, a phrase of the article: "There have also always been conservative scholars who advocate an earlier dating"
- The section of the article: Date and authorship
- The address: <https://www.sots.ac.uk/wiki/deuteronomy>
- The second reading, of the accuracy reviewer: SILENT. Moses is named only as the traditional author. No count of scholars who reject Moses. The rejection is only implied by the 7th-century majority. WEAKER is arguable.
- Status: not confirmed.

#### W04. Deuteronomy, `writtenDetail.critical`: WEAKER

- The part: "Nearly all secular scholars date it from the 7th to 5th century BC, as do most Christian and Jewish scholars. Most scholars place its core of laws, chapters 12 to 26, in the 7th century BC."
- The strength words: the part has "Nearly all secular scholars; most (two times)". The article has "The majority of critical scholars; some".
- The first reading: The article gives the 7th century BCE for the first version, with "the majority of critical scholars", and an exilic or early post-exilic origin with "some". It has no count by faith. A separate date for chapters 12 to 26: SILENT.
- Evidence, a phrase of the article: "some who have argued that the book comes from the exilic or early post-exilic period"
- The section of the article: Date and authorship
- The address: <https://www.sots.ac.uk/wiki/deuteronomy>
- The second reading, of the accuracy reviewer: WEAKER. "Nearly all" against "majority" and "some". For the laws, "most" against "majority" for a 7th-century first version: agrees, but chapters 12 to 26 are not named there.
- Status: confirmed.

#### W05. Nehemiah, `authorDetail.critical`: DIFFERENT

- The part: "Whether Nehemiah's account in his own voice is genuine is now very controversial. Minimalists, scholars who accept little of the story as history, doubt that he existed."
- The strength words: the part has "very controversial". The article has "The majority of scholarship".
- The first reading: The article says that most scholars take the first-person account as one unit and as more or less authentic. It reports that some passages are usually seen as later, and that some scholars find only a small original account. The view of minimalists, and a doubt that Nehemiah existed: SILENT.
- Evidence, a phrase of the article: "deems it to be more or less authentic"
- The section of the article: Date and authorship
- The address: <https://www.sots.ac.uk/wiki/nehemiah>
- The second reading, of the accuracy reviewer: DIFFERENT. The majority takes the memoir as a unity and as more or less authentic. The doubt that he existed: silent.
- Status: confirmed.

#### W06. Nehemiah, `writtenDetail.critical`: DIFFERENT

- The part: "Ezra and Nehemiah as one book may have had a first edition early in the 4th century BC."
- The strength words: the part has "may have had". The article has "might; points rather to".
- The first reading: The article puts additions to the Nehemiah account perhaps in the 4th century BCE, and it says that the work that joined Nehemiah to Ezra points more to the Hellenistic period, the 3rd or early 2nd century. The part puts a first edition of the joined book early in the 4th century. A first edition as such: SILENT.
- Evidence, a phrase of the article: "points rather to the Hellenistic period (3rd or early 2nd century)"
- The section of the article: Date and authorship
- The address: <https://www.sots.ac.uk/wiki/nehemiah>
- The second reading, of the accuracy reviewer: DIFFERENT. The 4th century is for additions to the memoir. The joining with Ezra points to the 3rd or early 2nd century.
- Status: confirmed.

#### W07. Esther, `writtenDetail.critical`: WEAKER

- The part: "The usual date for the book is the 4th century BC."
- The strength words: the part has "The usual date". The article has "presumably; possibly".
- The first reading: The article says that little is known of the date. Its first choice is the end of Persian rule, with "presumably", and its second is the start of Greek rule, with "possibly". Its range is 400 to 200 BCE, and it includes the 4th century, but the article does not call it the usual date.
- Evidence, a phrase of the article: "or possibly the early Hellenistic period, before 200 BCE"
- The section of the article: Date and authorship
- The address: <https://www.sots.ac.uk/wiki/esther>
- The second reading, of the accuracy reviewer: WEAKER. "Presumably" late Persian or "possibly" early Hellenistic. The same main period, a weaker word, and a wider range. DIFFERENT is arguable.
- Status: confirmed.

#### W08. Job, `authorDetail.critical`: WEAKER

- The part: "It is widely held that a different writer added the speeches of Elihu later, because their style differs. Recent work leans more toward reading the book as one edited whole."
- The strength words: the part has "widely held; leans more toward". The article has "may be; prefers".
- The first reading: The Elihu speeches: the article says that there may be later additions, with no count and no reason from style. The book as a whole: the article says that modern scholarship prefers to read it as a totality, which is a stronger word than "leans more toward".
- Evidence, a phrase of the article: "There may be later additions to the main text in the Elihu speeches"
- The section of the article: Date and authorship
- The address: <https://www.sots.ac.uk/wiki/job>
- The second reading, of the accuracy reviewer: WEAKER. "Widely held" against "may be" for the Elihu speeches. Style: silent. One whole: agrees.
- Status: confirmed.

#### W09. Job, `writtenDetail.critical`: WEAKER

- The part: "Its Hebrew is from after the captivity in Babylon, 586 to 538 BC, with words and forms from Aramaic. Aramaic grew into a main language under Persian rule, 539 to 332 BC, which points to that time."
- The strength words: the part has "is; points to". The article has "probably; the favoured date".
- The first reading: The article says that the date is probably post-exilic and that the 4th century BCE is favored. This is inside Persian rule, as in the part. Its reasons are the stance on the individual and on suffering. The Hebrew and the Aramaic of the book as a reason: SILENT.
- Evidence, a phrase of the article: "probably post-exilic and the favoured date is 4th century BCE"
- The section of the article: Date and authorship
- The address: <https://www.sots.ac.uk/wiki/job>
- The second reading, of the accuracy reviewer: AGREES. Probably post-exilic, with the 4th century favored, against "points to" Persian rule. The language reason: silent.
- Status: not confirmed.

#### W10. Psalms, `authorDetail.critical`: WEAKER

- The part: "Modern scholars do not accept as history that David wrote the psalms. They see the names as a way to tie the writings to famous figures."
- The strength words: the part has "Modern scholars do not". The article has "would generally not".
- The first reading: The article says that scholars would generally not give the psalms to the persons in the headings, and that the headings on David are not to be taken seriously. The second sentence of the part, that the names tie the writings to famous figures: SILENT. The article says that the headings may show a theme or give clues on a context.
- Evidence, a phrase of the article: "scholars would generally not attribute authorship of the psalms"
- The section of the article: Date and authorship
- The address: <https://www.sots.ac.uk/wiki/psalms>
- The second reading, of the accuracy reviewer: AGREES. Scholars would generally not give the psalms to the named persons. The tie to famous figures: silent.
- Status: not confirmed.

#### W11. Psalms, `writtenDetail.critical`: DIFFERENT

- The part: "The psalms were written over at least five centuries, from the 10th to the 5th century BC or later. Scholars of the Septuagint, the early Greek translation, argue that the collection stayed open until the 1st century AD."
- The strength words: the part has "no count word; argue". The article has "almost no agreement; probably".
- The first reading: The range of the writing: the article says that scholars almost do not agree on when single psalms were written. It reports views from before the 10th century to the 2nd century BCE. The end of the collection: the article says that the book was probably compiled by the 2nd century BCE at the latest. The part says that scholars of the Septuagint argue for a collection that stayed open until the 1st century AD.
- Evidence, a phrase of the article: "probably compiled by the 2nd century BCE at the latest"
- The section of the article: Date and authorship
- The address: <https://www.sots.ac.uk/wiki/psalms>
- The second reading, of the accuracy reviewer: DIFFERENT. Almost no agreement on single psalms: weaker. The compilation was probably done by the 2nd century BCE at the latest: different.
- Status: confirmed.

#### W12. Proverbs, `authorDetail.critical`: DIFFERENT

- The part: "The heading Proverbs of Solomon comes at 1:1, 10:1, and 25:1. It sorts the material into groups rather than naming an author."
- The strength words: the part has "no count word". The article has "the majority of recent scholars".
- The first reading: The article says that the titles do give sections to Solomon and to others, and that most recent scholars question if Solomon was the author of the sections given to him. It explains the names by his fame as a wise king. The part says that the heading sorts the material and does not name an author.
- Evidence, a phrase of the article: "assigned to him on the basis of his reputation"
- The section of the article: Modern doubts about Solomonic authorship
- The address: <https://www.sots.ac.uk/wiki/proverbs>
- The second reading, of the accuracy reviewer: WEAKER. The part has no strength word. The article has "at first sight", "equally plausible", and a majority that questions Solomon as author. AGREES is arguable.
- Status: not confirmed.

#### W13. Proverbs, `writtenDetail.critical`: STRONGER

- The part: "Some argue that the sections differ in date, and chapters 1 to 9 and 30 to 31 are the latest. They put the final editing late in Persian rule, 539 to 332 BC, or under Greek rule, from 332 BC."
- The strength words: the part has "Some argue". The article has "the majority of recent scholars; almost certainly".
- The first reading: The article gives the same order of parts with stronger words: most recent scholars put chapters 1 to 9 after the exile, and the last two collections are almost certainly later than Hezekiah. For the last collections, it permits a date before the exile. The final editor in the Persian or Hellenistic period is in a quotation of one scholar, Bruce Waltke.
- Evidence, a phrase of the article: "the majority of recent scholars have dated the entire section in the post-exilic period"
- The section of the article: Dates for the different parts
- The address: <https://www.sots.ac.uk/wiki/proverbs>
- The second reading, of the accuracy reviewer: STRONGER. "Some" against "the majority of recent scholars" and "almost certainly". The final editor is the view of one scholar.
- Status: confirmed.

#### W14. Ecclesiastes, `authorDetail.critical`: WEAKER

- The part: "Critical scholars have long rejected any date before the captivity in Babylon, 586 to 538 BC. Words borrowed from Persian and Aramaic point to no earlier than about 450 BC, long after Solomon."
- The strength words: the part has "Critical scholars have long rejected". The article has "Most critical commentators".
- The first reading: The article says that most critical commentators reject Solomon, that the Hebrew cannot definitely be called late, and that the book has two words from Persian that are not likely before the Persian period. The limit of about 450 BC, and words borrowed from Aramaic: SILENT.
- Evidence, a phrase of the article: "it cannot definitively be described as"
- The section of the article: Date and authorship
- The address: <https://www.sots.ac.uk/wiki/ecclesiastes>
- The second reading, of the accuracy reviewer: WEAKER. "Most critical commentators" reject Solomon, and the two Persian words are "unlikely" earlier. Aramaic words and 450 BC: silent.
- Status: confirmed.

#### W15. Ecclesiastes, `writtenDetail.critical`: DIFFERENT

- The part: "Critical scholars date it between about 450 BC and 180 BC, the year Ben Sira, a Jewish writer, quotes it. They differ over whether it shows Greek thought, which would point to Greek rule, from 332 BC."
- The strength words: the part has "Critical scholars; differ". The article has "Most scholars; a few".
- The first reading: The article says that most scholars put the book in the Hellenistic period and a few in the Persian period. The part gives the range 450 to 180 BC for critical scholars and does not say which period most prefer. Ben Sira: SILENT. Greek thought: the article reports a long study of possible links to Greek thought, and it does not use them for the date.
- Evidence, a phrase of the article: "with a few preferring the Persian period"
- The section of the article: Date and authorship
- The address: <https://www.sots.ac.uk/wiki/ecclesiastes>
- The second reading, of the accuracy reviewer: AGREES. The same Persian to Greek range, with a lean to the Hellenistic period. Ben Sira and the two years: silent. STRONGER is arguable.
- Status: not confirmed.

#### W16. Song of Solomon, `writtenDetail.critical`: WEAKER

- The part: "Most scholars since the 1800s place the song in the 3rd century BC, chiefly because of its language. Others doubt that the language requires a date after the return from Babylon, late in the 6th century BC."
- The strength words: the part has "Most scholars since the 1800s". The article has "likely".
- The first reading: The article gives the same century and the same reason, the language, in its own voice and with "likely". It has no count. The second sentence of the part, on scholars who doubt that the language needs a late date: SILENT. The article says that some poems might be from before the exile.
- Evidence, a phrase of the article: "this is likely to be when the book was completed"
- The section of the article: Date
- The address: <https://www.sots.ac.uk/wiki/song-of-songs>
- The second reading, of the accuracy reviewer: WEAKER. The same date and reason with "likely" and no count. Others who doubt the language: silent. AGREES is arguable.
- Status: confirmed.

#### W17. Jeremiah, `authorDetail.critical`: WEAKER

- The part: "Scholars generally agree that the book mixes material from different groups of writers. His own messages are probably the poems in chapters 1 to 25, and followers and later editors added much."
- The strength words: the part has "Scholars generally agree; probably". The article has "most modern scholars".
- The first reading: The article says that most modern scholars see a long and complex reshaping of the book. Groups of writers: SILENT. The poems of chapters 1 to 25 as his own messages: SILENT. The article says that much of chapters 1 to 25 records words that the book gives to the prophet.
- Evidence, a phrase of the article: "it has undergone a lengthy and complex process of reshaping"
- The section of the article: Date and authorship
- The address: <https://www.sots.ac.uk/wiki/jeremiah>
- The second reading, of the accuracy reviewer: WEAKER. "Generally agree" against "most modern scholars" for a long reshaping, with no groups of writers. The poems and the followers: silent.
- Status: confirmed.

#### W18. Ezekiel, `authorDetail.critical`: DIFFERENT

- The part: "The book took shape through a long, complex process and may not keep the prophet's exact words. Scholars do agree that Ezekiel himself wrote the prophecy down."
- The strength words: the part has "Scholars do agree". The article has "many; as is likely".
- The first reading: The long process: the article gives it with "many believe", for a core from Ezekiel with later editing. The writer: the article says that other persons, after the death of Ezekiel, likely did the writing. The part says that scholars agree that Ezekiel wrote the prophecy down.
- Evidence, a phrase of the article: "the actual writing of the book was done by others after his death"
- The section of the article: Date and authorship
- The address: <https://www.sots.ac.uk/wiki/ezekiel>
- The second reading, of the accuracy reviewer: DIFFERENT. "Many" for editing of a core: weaker. The writing was likely done by others after his death: different.
- Status: confirmed.

#### W19. Jonah, `writtenDetail.critical`: STRONGER

- The part: "Most scholars think it was written long after the events, since it uses words known only from much later writings. Mainstream scholars generally read the story as fiction."
- The strength words: the part has "Most scholars; generally". The article has "is agreed by modern scholars; is a work of fiction".
- The first reading: The article says that modern scholars agree on the post-exilic period, probably the 4th century BCE. It calls the book fiction in its own voice. Its reasons are historical points and late words.
- Evidence, a phrase of the article: "is agreed by modern scholars to date from the post-exilic period"
- The section of the article: Date and authorship; Name
- The address: <https://www.sots.ac.uk/wiki/jonah>
- The second reading, of the accuracy reviewer: STRONGER. "Most" and "generally" in the part. The article says that modern scholars agree on the late date, and it calls the book fiction with no limiting word. Both points are stronger.
- Status: confirmed.

#### W20. Micah, `authorDetail.critical`: DIFFERENT

- The part: "Some scholars, though not all, hold that only chapters 1 to 3 go back to Micah himself."
- The strength words: the part has "Some scholars, though not all". The article has "critical scholars (of the late 19th century)".
- The first reading: The article says that critical scholars of the late 19th century gave little of the book to the prophet, and that modern readers argue for and against unity and an 8th-century setting. Chapters 1 to 3 as the part of Micah: SILENT.
- Evidence, a phrase of the article: "with little of it attributable to the prophet himself"
- The section of the article: Date and authorship
- The address: <https://www.sots.ac.uk/wiki/micah>
- The second reading, of the accuracy reviewer: SILENT. The article does not say that chapters 1 to 3 go back to Micah. It reports only that critics of the late 19th century left him little of the book. A close call.
- Status: not confirmed.

#### W21. Micah, `writtenDetail.critical`: DIFFERENT

- The part: "Scholars agree its last stage came under Persian rule, 539 to 332 BC, or even Greek rule, from 332 BC. They dispute how much took shape then, and date the latest parts after the temple's rebuilding in 515 BC."
- The strength words: the part has "Scholars agree". The article has "no count word".
- The first reading: The article gives a post-exilic book as the view of critical scholars of the late 19th century. For the present, it reports many different readings and no agreement. The part says that scholars agree on the last stage. The year 515 BC: SILENT.
- Evidence, a phrase of the article: "a welter of modern readings"
- The section of the article: Date and authorship
- The address: <https://www.sots.ac.uk/wiki/micah>
- The second reading, of the accuracy reviewer: WEAKER. Agreement: weaker, because post-exilic is a view of the late 19th century and arguments now go both ways. The dispute on the extent: agrees. 515 BC: silent.
- Status: not confirmed.

#### W22. Nahum, `writtenDetail.critical`: DIFFERENT

- The part: "Scholars debate when the book took shape. Proposals run from soon after 663 BC to about 175 to 165 BC."
- The strength words: the part has "Scholars debate". The article has "no count word".
- The first reading: The article puts the setting near 612 BCE. It says that no outside factor makes a date before 587 unlikely, and that editing lasted into the post-exilic period, perhaps far into it. It reports no debate on the main date. The limits 663 BC and 175 to 165 BC: SILENT.
- Evidence, a phrase of the article: "the process of editing lasted (perhaps quite far) into the post-exilic period"
- The section of the article: Date and authorship
- The address: <https://www.sots.ac.uk/wiki/nahum>
- The second reading, of the accuracy reviewer: WEAKER. Nothing external against a writing in the decades before 587, and editing into the post-exilic period. Opinions differ only on the acrostic. The years of the range: silent. A close call with DIFFERENT.
- Status: not confirmed.

#### W23. Habakkuk, `authorDetail.critical`: WEAKER

- The part: "Scholars debate whether chapter 3 has the same author as chapters 1 and 2, or was added later. Every copy of the Septuagint, the Greek translation finished by 132 BC, includes it."
- The strength words: the part has "Scholars debate; Every copy". The article has "it has often been argued; early texts (e.g.)".
- The first reading: The dispute on chapter 3 is the same in the article: it has often been argued that the chapter is later, and a final decision is not possible. The Septuagint: the article names it as one early text that has chapter 3, and it does not say "every copy". The year 132 BC: SILENT in this article. The article also says that the Qumran text has only chapters 1 and 2.
- Evidence, a phrase of the article: "there are early texts (e.g., Septuagint) which do include chapter 3"
- The section of the article: Contents
- The address: <https://www.sots.ac.uk/wiki/habakkuk>
- The second reading, of the accuracy reviewer: WEAKER. The debate: agrees. The Septuagint: weaker, because the article names it only as one early text with chapter 3. 132 BC: silent. The main point alone is AGREES.
- Status: confirmed.

#### W24. Zechariah, `authorDetail.critical`: WEAKER

- The part: "Most modern scholars think at least two writers produced the book. Some think a disciple of the prophet may have written or edited chapters 9 to 14."
- The strength words: the part has "Most modern scholars; Some". The article has "often".
- The first reading: The article says that most scholars see a clear break between the two halves, and that chapters 9 to 14 are often considered the work of more than one author. It does not say "most" for two writers of the book. A disciple: SILENT.
- Evidence, a phrase of the article: "often considered to be the work of more than one author"
- The section of the article: Date and authorship
- The address: <https://www.sots.ac.uk/wiki/zechariah>
- The second reading, of the accuracy reviewer: WEAKER. "Most" for at least two writers: weaker, because authorship of 9 to 14 is questioned and those chapters are often given to more than one author. The disciple: silent.
- Status: confirmed.

#### W25. Zechariah, `writtenDetail.critical`: DIFFERENT

- The part: "Most scholars date chapters 9 to 14 to the 5th century BC, well after chapters 1 to 8. Those later chapters name no event that can be dated."
- The strength words: the part has "Most scholars". The article has "has tended".
- The first reading: The article gives a wider range: recent scholarship has tended to the Persian or early Hellenistic period, from the late 6th to the late 3rd century BCE. The part gives the 5th century with "Most scholars". Events that can be dated: the article says that historical references are sparse and ambiguous, which is weaker than "no event".
- Evidence, a phrase of the article: "from late 6th to late 3rd centuries BCE"
- The section of the article: Date and authorship; Contents
- The address: <https://www.sots.ac.uk/wiki/zechariah>
- The second reading, of the accuracy reviewer: DIFFERENT. Recent scholarship has tended to the late 6th to late 3rd centuries, and "later than 1 to 8" is a possibility. A close call with WEAKER.
- Status: confirmed.

#### W26. Malachi, `authorDetail.critical`: STRONGER

- The part: "Some scholars think the writer is unknown and that Malachi, meaning my messenger, is a title rather than a name. Others argue from the grammar that it is a name."
- The strength words: the part has "Some scholars; Others". The article has "probably".
- The first reading: The article says in its own voice that the word is probably not a name of a person, and that the author is anonymous. The argument from grammar for a name: SILENT.
- Evidence, a phrase of the article: "the last word here is probably not a person’s name"
- The section of the article: Name; Date and authorship
- The address: <https://www.sots.ac.uk/wiki/malachi>
- The second reading, of the accuracy reviewer: STRONGER. The article says that the word is probably not a name and that the author is anonymous. The argument from grammar: silent.
- Status: confirmed.

#### W27. Malachi, `writtenDetail.critical`: DIFFERENT

- The part: "Most scholars think editors added to the book in several stages. Its oldest parts date to about 500 BC, and it was almost complete by about 180 BC."
- The strength words: the part has "Most scholars". The article has "All agree; some".
- The first reading: The article says that all agree on the Persian period, 539 to 330 BCE, and that a more exact date is not possible. It says that the book gives the impression of one writer, with the epilogue as a possible exception and 3:1b-4 as a later text for some. The part says that most scholars see several stages of editing, from about 500 BC to about 180 BC. The stages with "most", and the year 180 BC: SILENT.
- Evidence, a phrase of the article: "It is not possible to be more precise"
- The section of the article: Date and authorship
- The address: <https://www.sots.ac.uk/wiki/malachi>
- The second reading, of the accuracy reviewer: DIFFERENT. All agree on the Persian period, and the book seems to come from one person, with an epilogue that may be an exception.
- Status: confirmed.

### A note on Numbers, finding W02

The article "Pentateuch", <https://www.sots.ac.uk/wiki/pentateuch>, has a part "Completion". It gives the 5th century BCE or a little later for the present form, with the strength word "generally held". This is the same view as the part of the site, with "generally held" for "Most modern scholars think". The second reading did not read this article for this point.

### A note on Habakkuk, finding W23

The year 132 BC is not in the article "Habakkuk". The article "The Septuagint", <https://www.sots.ac.uk/wiki/the-septuagint>, dates the translations from the 3rd century BCE to the 1st century CE. It says that some books existed for the translator of Sirach, whom it puts after 132 BCE. The part says that the Septuagint was finished by 132 BC.

## The `author` and `written` statements, step 6

The cover gives the traditional view, so a different critical view in the article is not a contradiction. I report a fact of the statement that the article says is false or not certain. 31 of the 36 statements have no finding in the first reading, and the second reading agrees on all 31. No statement of Lamentations, of Jeremiah, of Ezekiel, or of the minor prophets has a finding, except Malachi `author`.

| Finding | Book | Field | First reading | Second reading | Status |
|---|---|---|---|---|---|
| W28 | Psalms | `author` | CONTRADICTS | CONTRADICTS | confirmed |
| W29 | Proverbs | `written` | CONTRADICTS | CONTRADICTS | confirmed |
| W30 | Ecclesiastes | `author` | CONTRADICTS | CONTRADICTS | confirmed |
| W31 | Song of Solomon | `written` | CONTRADICTS | CONTRADICTS | confirmed |
| W32 | Malachi | `author` | CONTRADICTS | NONE | not confirmed |

#### W28. Psalms, `author`

- The statement: "The psalms have many writers. David wrote about half, and others are linked to Asaph, the sons of Korah, Solomon, and Moses."
- The first reading: The statement says that David wrote about half of the psalms, with no "By tradition". The article says that scholars would generally not give the psalms to David, and that no single author can be identified reliably.
- Evidence, a phrase of the article: "There is no way of reliably identifying the particular author of any given psalm"
- The section of the article: Date and authorship
- The address: <https://www.sots.ac.uk/wiki/psalms>
- The second reading, of the accuracy reviewer: CONTRADICTS. "David wrote about half" is the traditional view as a fact, with no "by tradition". The headings on David are not to be taken seriously, and no author can be identified reliably.
- Status: confirmed.

#### W29. Proverbs, `written`

- The statement: "Begun under Solomon in the 10th century BC, and probably complete in its present form under Hezekiah, about 700 BC."
- The first reading: The statement says, with no "By tradition", that the book was probably complete under Hezekiah. The article says that the last two collections are almost certainly later than his reign.
- Evidence, a phrase of the article: "are almost certainly from a later period than Hezekiah’s reign"
- The section of the article: Dates for the different parts
- The address: <https://www.sots.ac.uk/wiki/proverbs>
- The second reading, of the accuracy reviewer: CONTRADICTS. The traditional view with no "by tradition". The last two collections are almost certainly later than Hezekiah.
- Status: confirmed.

#### W30. Ecclesiastes, `author`

- The statement: "The writer calls himself the Teacher, son of David and king in Jerusalem, but gives no name. Tradition names Solomon."
- The first reading: The statement says that the writer calls himself the Teacher. The article says that the book seems to hold the speech of the Teacher and not to be composed by him, and that in one reading he is a character of the writer.
- Evidence, a phrase of the article: "appears to contain Qohelet’s speech, but not itself to have been composed by Qohelet"
- The section of the article: Date and authorship
- The address: <https://www.sots.ac.uk/wiki/ecclesiastes>
- The second reading, of the accuracy reviewer: CONTRADICTS. A small one, and NONE is arguable. The statement takes the Teacher as the writer. In its present form the book seems not to be composed by him.
- Status: confirmed.

#### W31. Song of Solomon, `written`

- The statement: "Probably in the time of Solomon, perhaps under his oversight, in the 10th century BC."
- The first reading: The statement says, with no "By tradition", that the song is probably from the time of Solomon. The article says that it was likely completed in the 3rd century BCE.
- Evidence, a phrase of the article: "this is likely to be when the book was completed"
- The section of the article: Date
- The address: <https://www.sots.ac.uk/wiki/song-of-songs>
- The second reading, of the accuracy reviewer: CONTRADICTS. The traditional view with no "by tradition". The completion was likely in the 3rd century BCE, and an early northern origin is highly unlikely.
- Status: confirmed.

#### W32. Malachi, `author`

- The statement: "The prophet Malachi, by tradition. His name means my messenger."
- The first reading: The second sentence says that "His name" means my messenger. The article says that the word is probably not a name of a person.
- Evidence, a phrase of the article: "the last word here is probably not a person’s name"
- The section of the article: Name
- The address: <https://www.sots.ac.uk/wiki/malachi>
- The second reading, of the accuracy reviewer: NONE. The meaning agrees. "His name" is the traditional view, which the article says is probably not a name. The first sentence has "by tradition".
- Status: not confirmed.

The reviewer agent read the findings on Ecclesiastes `author` and Song of Solomon `written`. It says that these are a different critical view and not a contradiction by the rule of step 6, and that those on Psalms and Proverbs are defensible. The two readings say CONTRADICTS. I left the verdicts of the readings as they are.

A point that is not a finding: Lamentations `written` has "by an eyewitness" and an old tradition of a cave outside Jerusalem. The article says that the book was probably written in Jerusalem. It does not speak of an eyewitness or of a cave.

## The notes of the review, step 7

One row for each claim and for each sentence of new words. "New" is a sentence that the note proposes. "Claim" is what the note says. I shortened the words of a claim; the words of a "New" row are those of the note, with one exception for Song of Solomon. A finding number is given where the verdict is not SUPPORTED.

| Book | Kind | The words | First reading | Second reading | Status | Finding |
|---|---|---|---|---|---|---|
| Numbers | New | Critical scholars see several layers of writing and editing in Numbers. | SUPPORTED | SUPPORTED | confirmed |  |
| Numbers | New | Some use the traditional source theory; others explain its growth through collections of traditions and later additions. | SUPPORTED | SUPPORTED | confirmed |  |
| Numbers | New | Many place substantial editing in the exile or Persian period, but the stages and dates are debated. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W33 |
| Numbers | Claim | The critical account presents one source theory as settled. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W34 |
| Deuteronomy | New | Most critical scholars see Deuteronomy as a work composed and expanded by later writers in the voice of Moses. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W35 |
| Deuteronomy | New | Many date an early form of its law collection to the 7th century BC, with further editing during or after the Babylonian exile. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W36 |
| Deuteronomy | New | Other scholars propose different stages and dates. | SUPPORTED | SUPPORTED | confirmed |  |
| Deuteronomy | New | On a chronology placing the exodus about 1446 BC, these speeches date to about 1406 BC. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W37 |
| Nehemiah | Claim | The Society for Old Testament Study explicitly describes broad acceptance of an authentic memoir core. | SUPPORTED | SUPPORTED | confirmed |  |
| Nehemiah | New | Many scholars accept an authentic core of Nehemiah's memoir, while debating how much later writers added and how it was combined with Ezra. | SUPPORTED | SUPPORTED | confirmed |  |
| Nehemiah | Claim | The present description as "very controversial", followed by doubts that he existed, gives a fringe position disproportionate prominence. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W38 |
| Esther | New | Many scholars place the Hebrew book in the late Persian or early Greek period, but its date is uncertain. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W39 |
| Esther | Claim | "The usual date ... 4th century BC" implies more precision than the evidence supports. | SUPPORTED | SUPPORTED | confirmed |  |
| Job | New | probably an Israelite | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W40 |
| Job | New | Many critical scholars place the book in or after the Babylonian exile. | NOT IN THE ARTICLE | SUPPORTED | not confirmed | W41 |
| Job | New | Its unusual Hebrew and Aramaic features contribute to that view, but its language does not establish a precise date. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W42 |
| Job | Claim | Aramaic influence alone is not proof of a Persian-period composition. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W43 |
| Psalms | New | A collection by many writers. | SUPPORTED | SUPPORTED | confirmed |  |
| Psalms | New | The Hebrew headings associate 73 psalms with David; others name Asaph, the sons of Korah, Solomon, and Moses. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W44 |
| Psalms | New | Many critical scholars treat these headings as later attributions and question whether they identify the original authors. | SUPPORTED | SUPPORTED | confirmed |  |
| Psalms | New | The collection developed over centuries. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W45 |
| Psalms | New | Scholars debate when its contents and order became fixed. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W46 |
| Psalms | Claim | Differing ancient collections do not by themselves prove that the standard 150-psalm collection was still open. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W47 |
| Proverbs | Claim | Proverbs 25:1 dates the copying of one collection to Hezekiah's reign, not completion of the whole book. | SUPPORTED | SUPPORTED | confirmed |  |
| Proverbs | New | The book contains collections linked to Solomon and material copied under Hezekiah, about 700 BC. | SUPPORTED | SUPPORTED | confirmed |  |
| Proverbs | New | Its final date is uncertain. | SUPPORTED | SUPPORTED | confirmed |  |
| Proverbs | Claim | Conservative scholars also allow later compilation. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W48 |
| Proverbs | New | Some scholars understand the Solomonic headings as linking collections to Solomon's wisdom tradition, rather than proving that he composed every saying. | SUPPORTED | SUPPORTED | confirmed |  |
| Proverbs | Claim | The headings actually do attribute material; the disagreement concerns how to understand the attribution. | SUPPORTED | SUPPORTED | confirmed |  |
| Ecclesiastes | New | A book in which the Teacher reflects on the fleeting nature of life, the limits of wisdom, and the search for lasting gain. | SUPPORTED | SUPPORTED | confirmed |  |
| Ecclesiastes | New | It closes by calling readers to fear God and keep his commands. | SUPPORTED | SUPPORTED | confirmed |  |
| Ecclesiastes | Claim | "Finds everything futile" is too reductive given its repeated calls to enjoy God's gifts. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W49 |
| Ecclesiastes | New | The Teacher is presented as a son of David and king in Jerusalem, but is not named. | NOT IN THE ARTICLE | SUPPORTED | not confirmed | W50 |
| Ecclesiastes | New | Tradition identifies him with Solomon; scholars debate whether this is a literary persona. | SUPPORTED | SUPPORTED | confirmed |  |
| Ecclesiastes | New | Many critical scholars date it to the Persian or early Greek period, often the 3rd century BC, on linguistic and other grounds. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W51 |
| Ecclesiastes | Claim | About 180 is an approximate date for Ben Sira's work, not a securely dated quotation establishing an exact deadline. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W52 |
| Song of Solomon | New | The heading links the song to Solomon. | SUPPORTED | SUPPORTED | confirmed |  |
| Song of Solomon | New | Tradition names him as author; others understand the link as a dedication or association, and the writer or writers are unknown. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W53 |
| Song of Solomon | New | The date is disputed. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W54 |
| Song of Solomon | New | Some place it in Solomon's time; others see older poems collected or edited much later. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W55 |
| Song of Solomon | Claim | Not all conservative scholars endorse the oversight theory or the range 960-931 BC. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W56 |
| Song of Solomon | New | "Many critical scholars" for the proposal of the 3rd century | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W57 |
| Jeremiah | New | Jeremiah's ministry belongs to the late 7th and early 6th centuries BC. | SUPPORTED | SUPPORTED | confirmed |  |
| Jeremiah | New | The book includes later material: chapter 52 ends with Jehoiachin's release about 561 BC. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W58 |
| Jeremiah | New | Many scholars see further collection and editing after Jeremiah's lifetime; the shorter Greek and longer Hebrew forms preserve different editions. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W59 |
| Jeremiah | New | Scholars debate which passages preserve Jeremiah's own words and which reflect later writers. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W60 |
| Lamentations | New | possibly drawing on eyewitness experience | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W61 |
| Lamentations | Claim | The vivid poetry does not establish the author's identity or eyewitness status. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W62 |
| Lamentations | New | Probably written in the aftermath of Jerusalem's destruction, about 586 BC. | SUPPORTED | SUPPORTED | confirmed |  |
| Lamentations | New | The author or authors are unknown. | NOT IN THE ARTICLE | SUPPORTED | not confirmed | W63 |
| Lamentations | Claim | The cave location supplies no reliable evidence about composition. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W64 |
| Ezekiel | New | Many scholars trace a substantial core to Ezekiel, while debating what later writers added and who put it into written form. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W65 |
| Ezekiel | New | Its dated messages run from about 593 to 571 BC, during Ezekiel's exile in Babylonia; the extent and date of later editing are disputed. | AGAINST THE ARTICLE | AGAINST THE ARTICLE | confirmed | W66 |
| Ezekiel | Claim | The asserted agreement on personal writing is not supported. | SUPPORTED | SUPPORTED | confirmed |  |
| Jonah | New | The book does not name its author. | SUPPORTED | NOT IN THE ARTICLE | not confirmed |  |
| Jonah | New | Tradition attributes it to Jonah son of Amittai. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W67 |
| Jonah | New | Jonah lived in the 8th century BC under Jeroboam II. | SUPPORTED | SUPPORTED | confirmed |  |
| Jonah | New | When the book was written is disputed. | AGAINST THE ARTICLE | AGAINST THE ARTICLE | confirmed | W68 |
| Jonah | Claim | 2 Kings 14:25 dates Jonah's ministry, not the writing of this book. | SUPPORTED | SUPPORTED | confirmed |  |
| Jonah | Claim | Some conservative readers favor composition in or near his lifetime. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W69 |
| Jonah | Claim | The later critical proposal is the view of many critical scholars. | SUPPORTED | SUPPORTED | confirmed |  |
| Micah | New | Many critical scholars see later additions to Micah's 8th-century messages, sometimes dating the final shaping to the Persian or early Greek period. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W70 |
| Micah | New | The extent and dates of these additions remain disputed. | SUPPORTED | SUPPORTED | confirmed |  |
| Micah | Claim | "Scholars agree" is too strong. | SUPPORTED | SUPPORTED | confirmed |  |
| Micah | Claim | 750-687 BC is a proposed span for the kings named in 1:1, not an established 63-year ministry for Micah. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W71 |
| Nahum | New | Usually dated to the 7th century BC, after the sack of Thebes in 663 BC and before Nineveh fell in 612 BC. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W72 |
| Nahum | New | Some scholars argue that the book continued to be edited after the exile. | SUPPORTED | SUPPORTED | confirmed |  |
| Nahum | Claim | The 8th-century alternative is obsolete. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W73 |
| Habakkuk | New | Chapter 3 is included in the ancient Greek version, though scholars debate whether it originally belonged with chapters 1-2. | SUPPORTED | SUPPORTED | confirmed |  |
| Habakkuk | Claim | The Septuagint was translated book by book over a long period, not finished as a whole by 132 BC. (The note cites the article "The Septuagint".) | SUPPORTED | SUPPORTED | confirmed |  |
| Habakkuk | Claim | "Every copy" also overlooks fragmentary witnesses. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W74 |
| Habakkuk | Claim | Its inclusion shows early attachment, not necessarily common authorship. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W75 |
| Zechariah | New | Many critical scholars date chapters 9-14 later than chapters 1-8, often within the Persian or early Greek period. | NOT IN THE ARTICLE | SUPPORTED | not confirmed | W76 |
| Zechariah | New | The dates and number of writers remain disputed. | SUPPORTED | SUPPORTED | confirmed |  |
| Zechariah | Claim | Their historical references are difficult to identify. | SUPPORTED | SUPPORTED | confirmed |  |
| Zechariah | New | contain no explicit dates like those in chapters 1-8 | SUPPORTED | SUPPORTED | confirmed |  |
| Malachi | New | Many scholars place the main work in the Persian period, often the 5th century BC. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W77 |
| Malachi | New | Some see the closing verses and other passages as later additions; their dates are debated. | NOT IN THE ARTICLE | NOT IN THE ARTICLE | confirmed | W78 |

The number of verdicts of the first reading for each book:

| Book | Claims and sentences | SUPPORTED | NOT IN THE ARTICLE | AGAINST THE ARTICLE |
|---|---|---|---|---|
| Numbers | 4 | 2 | 2 | 0 |
| Deuteronomy | 4 | 1 | 3 | 0 |
| Nehemiah | 3 | 2 | 1 | 0 |
| Esther | 2 | 1 | 1 | 0 |
| Job | 4 | 0 | 4 | 0 |
| Psalms | 6 | 2 | 4 | 0 |
| Proverbs | 6 | 5 | 1 | 0 |
| Ecclesiastes | 7 | 3 | 4 | 0 |
| Song of Solomon | 6 | 1 | 5 | 0 |
| Jeremiah | 4 | 1 | 3 | 0 |
| Lamentations | 5 | 1 | 4 | 0 |
| Ezekiel | 3 | 1 | 1 | 1 |
| Jonah | 7 | 4 | 2 | 1 |
| Micah | 4 | 2 | 2 | 0 |
| Nahum | 3 | 1 | 2 | 0 |
| Habakkuk | 4 | 2 | 2 | 0 |
| Zechariah | 4 | 3 | 1 | 0 |
| Malachi | 2 | 0 | 2 | 0 |
| Total | 78 | 32 | 44 | 2 |

### The findings of step 7

#### W33. Numbers: NOT IN THE ARTICLE

- The words of the note: "Many place substantial editing in the exile or Persian period, but the stages and dates are debated."
- The first reading: The debate is in the article. "Many" for this editing is not: the article gives an older consensus of editors until about the 5th century, and "some critics" for a Priestly source of the exile.
- The address: <https://www.sots.ac.uk/wiki/numbers>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. "Some critics" for an exilic Priestly source, and a past consensus. No count for a present "many".
- Status: confirmed.

#### W34. Numbers: NOT IN THE ARTICLE

- The words of the note: "The critical account presents one source theory as settled."
- The first reading: This is a claim on the words of the site. The article says that there is no consensus now.
- The address: <https://www.sots.ac.uk/wiki/numbers>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. A claim on the words of the site. The article cannot show what the site presents.
- Status: confirmed.

#### W35. Deuteronomy: NOT IN THE ARTICLE

- The words of the note: "Most critical scholars see Deuteronomy as a work composed and expanded by later writers in the voice of Moses."
- The first reading: The later first version has "the majority of critical scholars", and the later expansion has "many scholars". The article does not join the two with "most".
- The address: <https://www.sots.ac.uk/wiki/deuteronomy>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. For the expansion the article has only "many scholars".
- Status: confirmed.

#### W36. Deuteronomy: NOT IN THE ARTICLE

- The words of the note: "Many date an early form of its law collection to the 7th century BC, with further editing during or after the Babylonian exile."
- The first reading: The article dates the first version of the book, not the law collection, and it gives no time for the later editing.
- The address: <https://www.sots.ac.uk/wiki/deuteronomy>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. No time for the later editing, and the law collection is not named as the early form.
- Status: confirmed.

#### W37. Deuteronomy: NOT IN THE ARTICLE

- The words of the note: "On a chronology placing the exodus about 1446 BC, these speeches date to about 1406 BC."
- The first reading: The article says only that the own chronology of the Bible places the book in "the 5th century BCE". See the oddities in the part on what the wiki is.
- The address: <https://www.sots.ac.uk/wiki/deuteronomy>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. No 1446 and no 1406. AGAINST is arguable from the printed "5th century BCE".
- Status: confirmed.

#### W38. Nehemiah: NOT IN THE ARTICLE

- The words of the note: "The present description as "very controversial", followed by doubts that he existed, gives a fringe position disproportionate prominence."
- The first reading: The article does not speak of a doubt that he existed, so it does not say that the doubt is a fringe position.
- The address: <https://www.sots.ac.uk/wiki/nehemiah>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. No doubt that he existed is named, and no position is called fringe.
- Status: confirmed.

#### W39. Esther: NOT IN THE ARTICLE

- The words of the note: "Many scholars place the Hebrew book in the late Persian or early Greek period, but its date is uncertain."
- The first reading: The two periods and the uncertain date are in the article. "Many scholars" is not: the article gives no count.
- The address: <https://www.sots.ac.uk/wiki/esther>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. No count that includes "many".
- Status: confirmed.

#### W40. Job: NOT IN THE ARTICLE

- The words of the note: "probably an Israelite"
- The first reading: The article says nothing on the people of the writer.
- The address: <https://www.sots.ac.uk/wiki/job>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. Nothing on the nation of the writer.
- Status: confirmed.

#### W41. Job: NOT IN THE ARTICLE

- The words of the note: "Many critical scholars place the book in or after the Babylonian exile."
- The first reading: The article says "probably post-exilic", with no count, and not "in" the exile.
- The address: <https://www.sots.ac.uk/wiki/job>
- The second reading, of the accuracy reviewer: SUPPORTED. "Probably" and "the favoured date" carry "many" for a date after the exile. NOT IN is arguable.
- Status: not confirmed.

#### W42. Job: NOT IN THE ARTICLE

- The words of the note: "Its unusual Hebrew and Aramaic features contribute to that view, but its language does not establish a precise date."
- The first reading: The article gives no reason from language.
- The address: <https://www.sots.ac.uk/wiki/job>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. No argument from the Hebrew or from Aramaic.
- Status: confirmed.

#### W43. Job: NOT IN THE ARTICLE

- The words of the note: "Aramaic influence alone is not proof of a Persian-period composition."
- The first reading: The article does not speak about this.
- The address: <https://www.sots.ac.uk/wiki/job>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. Aramaic is not named.
- Status: confirmed.

#### W44. Psalms: NOT IN THE ARTICLE

- The words of the note: "The Hebrew headings associate 73 psalms with David; others name Asaph, the sons of Korah, Solomon, and Moses."
- The first reading: The article names David, the sons of Asaph, and the sons of Korah. It does not give 73, Solomon, or Moses.
- The address: <https://www.sots.ac.uk/wiki/psalms>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. No 73, no Solomon, no Moses.
- Status: confirmed.

#### W45. Psalms: NOT IN THE ARTICLE

- The words of the note: "The collection developed over centuries."
- The first reading: The article says that the compilation was a long time after single psalms. It does not say how long the collection took.
- The address: <https://www.sots.ac.uk/wiki/psalms>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. The article does not say that the collection grew over centuries. SUPPORTED is arguable.
- Status: confirmed.

#### W46. Psalms: NOT IN THE ARTICLE

- The words of the note: "Scholars debate when its contents and order became fixed."
- The first reading: The article gives "probably" the 2nd century BCE at the latest for the compilation. It reports no debate on that date.
- The address: <https://www.sots.ac.uk/wiki/psalms>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. No debate on when the contents and the order became fixed.
- Status: confirmed.

#### W47. Psalms: NOT IN THE ARTICLE

- The words of the note: "Differing ancient collections do not by themselves prove that the standard 150-psalm collection was still open."
- The first reading: The article does not speak about this.
- The address: <https://www.sots.ac.uk/wiki/psalms>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. Different ancient collections are not discussed.
- Status: confirmed.

#### W48. Proverbs: NOT IN THE ARTICLE

- The words of the note: "Conservative scholars also allow later compilation."
- The first reading: The article quotes one commentary for a later final editor, and it does not call it conservative.
- The address: <https://www.sots.ac.uk/wiki/proverbs>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. The article calls nobody conservative.
- Status: confirmed.

#### W49. Ecclesiastes: NOT IN THE ARTICLE

- The words of the note: ""Finds everything futile" is too reductive given its repeated calls to enjoy God's gifts."
- The first reading: The article says that scholars do not agree if the message is despair or gladness. It does not call one of the two too narrow.
- The address: <https://www.sots.ac.uk/wiki/ecclesiastes>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. The article does not judge the phrase.
- Status: confirmed.

#### W50. Ecclesiastes: NOT IN THE ARTICLE

- The words of the note: "The Teacher is presented as a son of David and king in Jerusalem, but is not named."
- The first reading: The first half is in the article. For the second half, the article says that it is not clear if the word is a name or a title.
- The address: <https://www.sots.ac.uk/wiki/ecclesiastes>
- The second reading, of the accuracy reviewer: SUPPORTED. Solomon is not identified explicitly. The word can be a name or a title.
- Status: not confirmed.

#### W51. Ecclesiastes: NOT IN THE ARTICLE

- The words of the note: "Many critical scholars date it to the Persian or early Greek period, often the 3rd century BC, on linguistic and other grounds."
- The first reading: The article has "most" for the Hellenistic period and "a few" for the Persian period. The 3rd century is not in it.
- The address: <https://www.sots.ac.uk/wiki/ecclesiastes>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. "Early" Greek and "often the 3rd century" are not in the article.
- Status: confirmed.

#### W52. Ecclesiastes: NOT IN THE ARTICLE

- The words of the note: "About 180 is an approximate date for Ben Sira's work, not a securely dated quotation establishing an exact deadline."
- The first reading: The article does not speak about this.
- The address: <https://www.sots.ac.uk/wiki/ecclesiastes>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. No Ben Sira and no 180 BC.
- Status: confirmed.

#### W53. Song of Solomon: NOT IN THE ARTICLE

- The words of the note: "Tradition names him as author; others understand the link as a dedication or association, and the writer or writers are unknown."
- The first reading: The article says that the chapters are attributed to Solomon, possibly because of his 1005 songs. A dedication, and writers who are not known, are not in it.
- The address: <https://www.sots.ac.uk/wiki/song-of-songs>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. No dedication, and no writers who are not known.
- Status: confirmed.

#### W54. Song of Solomon: NOT IN THE ARTICLE

- The words of the note: "The date is disputed."
- The first reading: The article gives its date with "likely" and reports no dispute.
- The address: <https://www.sots.ac.uk/wiki/song-of-songs>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. The article does not say that the date is disputed.
- Status: confirmed.

#### W55. Song of Solomon: NOT IN THE ARTICLE

- The words of the note: "Some place it in Solomon's time; others see older poems collected or edited much later."
- The first reading: The second half is near the article. The first half is not in it.
- The address: <https://www.sots.ac.uk/wiki/song-of-songs>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. No scholars who place it in the time of Solomon.
- Status: confirmed.

#### W56. Song of Solomon: NOT IN THE ARTICLE

- The words of the note: "Not all conservative scholars endorse the oversight theory or the range 960-931 BC."
- The first reading: The article does not speak of conservative scholars on the date.
- The address: <https://www.sots.ac.uk/wiki/song-of-songs>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. No conservative scholars and no oversight theory.
- Status: confirmed.

#### W57. Song of Solomon: NOT IN THE ARTICLE

- The words of the note: ""Many critical scholars" for the proposal of the 3rd century"
- The first reading: The 3rd century is in the article. A count is not.
- The address: <https://www.sots.ac.uk/wiki/song-of-songs>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. No count of scholars.
- Status: confirmed.

#### W58. Jeremiah: NOT IN THE ARTICLE

- The words of the note: "The book includes later material: chapter 52 ends with Jehoiachin's release about 561 BC."
- The first reading: Later reshaping is in the article. Chapter 52 is not.
- The address: <https://www.sots.ac.uk/wiki/jeremiah>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. Chapter 52 and 561 BC are not named.
- Status: confirmed.

#### W59. Jeremiah: NOT IN THE ARTICLE

- The words of the note: "Many scholars see further collection and editing after Jeremiah's lifetime; the shorter Greek and longer Hebrew forms preserve different editions."
- The first reading: The first half is in the article, with "most modern scholars". For the second half, the article says that the Greek shows a different and possibly earlier Hebrew text. It does not give the lengths or the word "editions".
- The address: <https://www.sots.ac.uk/wiki/jeremiah>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. The shorter Greek and the longer Hebrew are not named.
- Status: confirmed.

#### W60. Jeremiah: NOT IN THE ARTICLE

- The words of the note: "Scholars debate which passages preserve Jeremiah's own words and which reflect later writers."
- The first reading: The article speaks of the link of the book to the prophet, not of single passages.
- The address: <https://www.sots.ac.uk/wiki/jeremiah>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. No debate on which passages are his own words.
- Status: confirmed.

#### W61. Lamentations: NOT IN THE ARTICLE

- The words of the note: "possibly drawing on eyewitness experience"
- The first reading: The article does not speak about this.
- The address: <https://www.sots.ac.uk/wiki/lamentations>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. Nothing on an eyewitness.
- Status: confirmed.

#### W62. Lamentations: NOT IN THE ARTICLE

- The words of the note: "The vivid poetry does not establish the author's identity or eyewitness status."
- The first reading: The article does not speak about this.
- The address: <https://www.sots.ac.uk/wiki/lamentations>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. Nothing on vividness or an eyewitness.
- Status: confirmed.

#### W63. Lamentations: NOT IN THE ARTICLE

- The words of the note: "The author or authors are unknown."
- The first reading: The article says that Jeremiah is rarely defended now, and that some see more than one author. It does not say that the author is not known.
- The address: <https://www.sots.ac.uk/wiki/lamentations>
- The second reading, of the accuracy reviewer: SUPPORTED. By implication: Jeremiah is rarely defended and no author is named. NOT IN is arguable.
- Status: not confirmed.

#### W64. Lamentations: NOT IN THE ARTICLE

- The words of the note: "The cave location supplies no reliable evidence about composition."
- The first reading: The article does not speak about this.
- The address: <https://www.sots.ac.uk/wiki/lamentations>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. The cave is not named.
- Status: confirmed.

#### W65. Ezekiel: NOT IN THE ARTICLE

- The words of the note: "Many scholars trace a substantial core to Ezekiel, while debating what later writers added and who put it into written form."
- The first reading: A core from Ezekiel, with "many", and the dispute on the added parts are in the article. "Substantial" is not, and the article gives a view on who wrote, not a debate.
- The address: <https://www.sots.ac.uk/wiki/ezekiel>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. "Substantial", and a debate on who wrote, are not in the article.
- Status: confirmed.

#### W66. Ezekiel: AGAINST THE ARTICLE

- The words of the note: "Its dated messages run from about 593 to 571 BC, during Ezekiel's exile in Babylonia; the extent and date of later editing are disputed."
- The first reading: The article ends its series of dates at 573, in 40:1. The Berean text of 29:17 has the twenty-seventh year, two years later than 40:1.
- The address: <https://www.sots.ac.uk/wiki/ezekiel>
- The second reading, of the accuracy reviewer: AGAINST THE ARTICLE. The dates run from 593 to 573, not 571.
- Status: confirmed.

#### W67. Jonah: NOT IN THE ARTICLE

- The words of the note: "Tradition attributes it to Jonah son of Amittai."
- The first reading: The article does not speak about this.
- The address: <https://www.sots.ac.uk/wiki/jonah>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. The article gives no traditional author.
- Status: confirmed.

#### W68. Jonah: AGAINST THE ARTICLE

- The words of the note: "When the book was written is disputed."
- The first reading: The article says that modern scholars agree on the post-exilic period.
- The address: <https://www.sots.ac.uk/wiki/jonah>
- The second reading, of the accuracy reviewer: AGAINST THE ARTICLE. Modern scholars agree on a post-exilic date. Only the century has "probably".
- Status: confirmed.

#### W69. Jonah: NOT IN THE ARTICLE

- The words of the note: "Some conservative readers favor composition in or near his lifetime."
- The first reading: The article does not speak about this.
- The address: <https://www.sots.ac.uk/wiki/jonah>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. No conservative view of the date of writing.
- Status: confirmed.

#### W70. Micah: NOT IN THE ARTICLE

- The words of the note: "Many critical scholars see later additions to Micah's 8th-century messages, sometimes dating the final shaping to the Persian or early Greek period."
- The first reading: The article has "post-exilic", for critical scholars of the late 19th century. The two periods are not in it.
- The address: <https://www.sots.ac.uk/wiki/micah>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. No "many" for present scholars, and no Persian or early Greek period.
- Status: confirmed.

#### W71. Micah: NOT IN THE ARTICLE

- The words of the note: "750-687 BC is a proposed span for the kings named in 1:1, not an established 63-year ministry for Micah."
- The first reading: The article says that the reigns are hard to date with precision, and it gives about 747 to about 698.
- The address: <https://www.sots.ac.uk/wiki/micah>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. About 747 to about 698, not 750 to 687, and no number of years.
- Status: confirmed.

#### W72. Nahum: NOT IN THE ARTICLE

- The words of the note: "Usually dated to the 7th century BC, after the sack of Thebes in 663 BC and before Nineveh fell in 612 BC."
- The first reading: The article says that the setting is the years around 612, and that a date before 587 is not unlikely. It does not name Thebes, and it does not say before 612.
- The address: <https://www.sots.ac.uk/wiki/nahum>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. No Thebes, no 663, and no usual date between the two events.
- Status: confirmed.

#### W73. Nahum: NOT IN THE ARTICLE

- The words of the note: "The 8th-century alternative is obsolete."
- The first reading: The article does not speak about this.
- The address: <https://www.sots.ac.uk/wiki/nahum>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. No 8th-century date.
- Status: confirmed.

#### W74. Habakkuk: NOT IN THE ARTICLE

- The words of the note: ""Every copy" also overlooks fragmentary witnesses."
- The first reading: The article does not speak about this.
- The address: <https://www.sots.ac.uk/wiki/habakkuk>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. No fragmentary Greek witnesses.
- Status: confirmed.

#### W75. Habakkuk: NOT IN THE ARTICLE

- The words of the note: "Its inclusion shows early attachment, not necessarily common authorship."
- The first reading: The article says that little is known of the process and that a final decision is not possible.
- The address: <https://www.sots.ac.uk/wiki/habakkuk>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. No decision is possible. The article does not conclude an early attachment. A close call with SUPPORTED.
- Status: confirmed.

#### W76. Zechariah: NOT IN THE ARTICLE

- The words of the note: "Many critical scholars date chapters 9-14 later than chapters 1-8, often within the Persian or early Greek period."
- The first reading: The two periods are in the article. "Many" for a date later than chapters 1 to 8 is not: the article calls it a possibility.
- The address: <https://www.sots.ac.uk/wiki/zechariah>
- The second reading, of the accuracy reviewer: SUPPORTED. Recent scholarship tends to the two periods. A close call: a date later than 1 to 8 is a possibility, and there is no "many".
- Status: not confirmed.

#### W77. Malachi: NOT IN THE ARTICLE

- The words of the note: "Many scholars place the main work in the Persian period, often the 5th century BC."
- The first reading: The Persian period is in the article, with "all". The 5th century is not: the article says that a more exact date is not possible.
- The address: <https://www.sots.ac.uk/wiki/malachi>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. The Persian period is supported. "Often the 5th century" is not in the article.
- Status: confirmed.

#### W78. Malachi: NOT IN THE ARTICLE

- The words of the note: "Some see the closing verses and other passages as later additions; their dates are debated."
- The first reading: The first half is in the article. A debate on the dates of the additions is not.
- The address: <https://www.sots.ac.uk/wiki/malachi>
- The second reading, of the accuracy reviewer: NOT IN THE ARTICLE. The later verses are there. The article does not say that their dates are debated.
- Status: confirmed.

One item that the first reading gives as SUPPORTED has a different second reading:

- Jonah: "The book does not name its author." First reading SUPPORTED. Second reading NOT IN THE ARTICLE. The article says that the author is not known. It does not say that the book gives no name of its author. A close call. Status: not confirmed.

## The wiki and the rules of the site, step 9

These are facts. The report recommends no rule.

1. Rule 5 and "a standard reference work". Rule 5 says that a standard reference work counts as a source, and Task 4b gives the Oxford Dictionary of the Christian Church as its example. The wiki page says that the wiki is not an encyclopaedia of record, that its entries are for students, teachers, and persons who want a starting point, and that members write it. No text of the site says if such a work counts. Arthur decides.
2. Task 4 condition 1. Its words are on Wikipedia only: a "scholars differ" line needs a published scholar for that claim in the article, and the record names the scholar, the work, and the revision. It does not name the wiki. The record of Haggai says that the condition does not accept a claim that cites only a website. If the condition applied to the articles of the wiki, 4 of the 27 parts would have a named scholar with a year for the view that the article gives on the same point, or on one point of the part: Nehemiah `author`, Deuteronomy `written` (de Wette, 1805), Jeremiah `author`, and Proverbs `written` (Waltke, 2004, for the final editor only). For Proverbs, the view of the final editor is that of one scholar. The other articles name a scholar for a side point, or only in "Further reading": Ecclesiastes (Fox, for the frame), Malachi (Coggins and Petersen, with no year), Lamentations (Provan, with no year), and Nehemiah `written` (Kratz, for the additions).
3. A fixed revision. An article has none. The record can name these in its place: the address, the date and time of the download, and the SHA-256 of the text copy. It can also name a copy of the Internet Archive with its time stamp, where a copy exists, or the date of the last change in the copy. The Internet Archive can also make a new copy of a live page, which I did not ask it to do.
4. Count words. The table gives the 27 parts in three groups. The first reading decides the group.

| Group | Parts | Number |
|---|---|---|
| The article has a different count word for the point of the part | Deuteronomy `author`, Deuteronomy `written`, Nehemiah `author`, Psalms `author`, Proverbs `author`, Proverbs `written`, Ecclesiastes `author`, Ecclesiastes `written`, Jeremiah `author`, Ezekiel `author`, Jonah `written`, Micah `author`, Zechariah `written`, Malachi `written` | 14 |
| The part has a count word or a word on scholars, and the article has none for the present | Numbers `author`, Numbers `written`, Esther `written`, Job `author`, Song of Solomon `written`, Micah `written`, Zechariah `author`, Malachi `author` | 8 |
| Neither has a count word on the main point | Nehemiah `written`, Job `written`, Psalms `written`, Nahum `written`, Habakkuk `author` | 5 |

- If the article leads: 14 parts get a different count word and 8 lose theirs, which is 22 of 27, by the first reading. For 18 of these 22, the second reading also gives WEAKER, STRONGER, or DIFFERENT. It does not for Deuteronomy `author`, Psalms `author`, Ecclesiastes `written`, Micah `author`. The second reading did not count the words for this table.
- If Wikipedia leads: Task 53 gave SUPPORTED to 24 of these 27 parts. Of the other three, F02 for Zechariah `author` is confirmed and Task 54 changed it. F03 for Malachi `author`, "some" for "many", is not confirmed, and it would be 1 count word. F04 for Malachi `written` is on a date, not a count word, and it is not confirmed. Thus 0 confirmed findings of Task 53 change a count word now, and 1 if F03 is accepted.
- The site uses Wikipedia for the `critical` parts, with a fixed revision for each book. The wiki covers the Old Testament only, so a second source for the 27 books of the New Testament is not possible from it.

## The pages

I got the pages with `curl` from `https://www.sots.ac.uk/`. I got the home page, the wiki page, and the page of policies two times; the table has the second time. I also opened `robots.txt` at 22:52:25 UTC and `sitemap.xml` at 22:52:26 UTC. They are not pages of text, so I made no text copy of them. The size and the SHA-256 are of the text copy, in bytes, in UTF-8. The text copies are outside the repository.

| Page | Address | Time of the download, UTC | Size | SHA-256 of the text copy |
|---|---|---|---|---|
| home | https://www.sots.ac.uk/ | 2026-11-24 22:52:15 | 2,792 | `257aaa36984de338c21c9b689f8f2bf47594d8a1e0ab2ae3fec19017ec457a1a` |
| wiki | https://www.sots.ac.uk/wiki/ | 2026-11-24 22:52:17 | 3,815 | `173e09e0131297d42439eb65e5a74b82271288ea99e01d73e5402025d5ed95a5` |
| policies | https://www.sots.ac.uk/about-the-society/policies/ | 2026-11-24 22:52:18 | 1,634 | `c8b94053ca7b41db6154ef2c7b721c77f1b4c06b27618c2ceee827b1f53e35e1` |
| rules | https://www.sots.ac.uk/about-the-society/rules-of-the-society-for-old-testament-study/ | 2026-11-24 22:52:23 | 7,577 | `bb4f426e19f23536a4cb5048b04539239aedea80aa2e5bd6bb4164bea2917ec4` |
| cookies | https://www.sots.ac.uk/cookies/ | 2026-11-24 22:52:21 | 2,414 | `b1efe2b46f2ce436e440ba12f391a6e1a7d6c4300d430e572a2a5fccc47da213` |
| news | https://www.sots.ac.uk/news/ | 2026-11-24 22:52:20 | 17,582 | `85a7b045578b8bbe0536ebc88f44d9c48ffe23cf09d3763dfeaab4053071ec56` |
| news-launch | https://www.sots.ac.uk/news/new-sots-website-launched-mt5mnue2 | 2026-11-24 23:03:22 | 197 | `e7f4b6e54bfa9de384b1d74423137d6cc816055e0ab0ea9c3b8b4ddffc9bab02` |
| committee | https://www.sots.ac.uk/about-the-society/committee/ | 2026-11-24 23:20:06 | 7,312 | `71520a74f5925ae91ea5c5c1754c8f536562ac395a4f659917b9eaa42866c97b` |
| how-to-contribute-to-the-sots-wiki | https://www.sots.ac.uk/wiki/how-to-contribute-to-the-sots-wiki | 2026-11-24 22:52:28 | 425 | `ee228c00b5857e73764ec75cf603805eb3aa9765f96099a411dee49bfe169123` |
| note-on-abbreviations | https://www.sots.ac.uk/wiki/note-on-abbreviations | 2026-11-24 22:52:29 | 1,498 | `0943cab3659e059d1c68094cd5ea743bb8f92557fd15fa6be778aa2efaff7c3e` |
| groupings-of-books-of-the-bible | https://www.sots.ac.uk/wiki/groupings-of-books-of-the-bible | 2026-11-24 22:53:28 | 487 | `2571f9e678847d24fa0d32508faf196509472b09ee55a655f8c2c4946b76c7e2` |
| documentary-hypothesis | https://www.sots.ac.uk/wiki/documentary-hypothesis | 2026-11-24 22:59:44 | 83 | `0831f496d8b2ea857dd10a0c661528f13edbe9de39ec19f4e7f42ee21f7856ea` |
| pentateuch | https://www.sots.ac.uk/wiki/pentateuch | 2026-11-24 22:52:33 | 16,601 | `fae6e8a1a323a7451f9eee7df6bb94972a50a54e1c4e5034481d0d097128cabf` |
| the-septuagint | https://www.sots.ac.uk/wiki/the-septuagint | 2026-11-24 22:52:31 | 9,226 | `784d2c18e5460a3720025507b487c564b01c419d31cfc3e1733b95b41188c1da` |
| numbers | https://www.sots.ac.uk/wiki/numbers | 2026-11-24 22:52:39 | 10,738 | `d565459cbae48c8a38f55be85ead7bb5092d59ce0c3e40daa54f6d14a10e3527` |
| deuteronomy | https://www.sots.ac.uk/wiki/deuteronomy | 2026-11-24 22:52:40 | 6,987 | `2890329f8fbca469f98e1a239a0c497fa2d4249168b353ab2c5541bb55b1561e` |
| nehemiah | https://www.sots.ac.uk/wiki/nehemiah | 2026-11-24 22:52:53 | 9,647 | `83709474646c016642b008e8c1cf31837cc1dc290b3d298dca661d2cd84dc8a9` |
| esther | https://www.sots.ac.uk/wiki/esther | 2026-11-24 22:52:54 | 5,892 | `bffc8f016bfeeb60619ed93f11dd49836bbfc88c4f1e0901924ab341bcd5c8e6` |
| job | https://www.sots.ac.uk/wiki/job | 2026-11-24 22:52:56 | 7,795 | `745bd37a98346dc2f81951716174b19f0503a5a1a48dfc43838908ae823bf098` |
| psalms | https://www.sots.ac.uk/wiki/psalms | 2026-11-24 22:52:57 | 18,720 | `c65b4981190f29c375e933304db556fb3332c5c8255220db786b52749053a425` |
| proverbs | https://www.sots.ac.uk/wiki/proverbs | 2026-11-24 22:52:59 | 9,610 | `7d71d0512f15f5c88f360eb23c87d42a864874088f5790d654dbc5ff2cfe0502` |
| ecclesiastes | https://www.sots.ac.uk/wiki/ecclesiastes | 2026-11-24 22:53:00 | 10,727 | `d50375e70ac3eefa6a0f74cde42ef25ec5ee1541eca41189ac33ae0cdedf616d` |
| song-of-songs | https://www.sots.ac.uk/wiki/song-of-songs | 2026-11-24 22:53:02 | 5,382 | `4ee5ca6bcc2fe8a6bea14831aebb2565952abaf8c92fa7b17840f18b63721982` |
| jeremiah | https://www.sots.ac.uk/wiki/jeremiah | 2026-11-24 22:53:05 | 5,085 | `c4f5789069ab10434897151242d2b8be7dee3ae15baaa796d11ee006d4ab6943` |
| lamentations | https://www.sots.ac.uk/wiki/lamentations | 2026-11-24 22:53:06 | 8,372 | `8708f2b5985e82fc822d510f90d61eb07942c91772be019eb2d2205f8d391886` |
| ezekiel | https://www.sots.ac.uk/wiki/ezekiel | 2026-11-24 22:53:08 | 7,781 | `66abbfac548a2ba5e6d327afa9e22a934f8cc19815b7b508ff417cdca2407ae3` |
| jonah | https://www.sots.ac.uk/wiki/jonah | 2026-11-24 22:53:16 | 8,415 | `c4d29c09b32c510ff3361611946c24c607007f3082a10d818ecc4155399641d4` |
| micah | https://www.sots.ac.uk/wiki/micah | 2026-11-24 22:53:18 | 6,202 | `2badfdb613f44ff788fd4aef8dcd23dff2c1cad1217ed215105a9ca625a4e5e9` |
| nahum | https://www.sots.ac.uk/wiki/nahum | 2026-11-24 22:53:19 | 4,584 | `79f84486c9d7fe62b901a6d32ac6894a7f0352833a091b5bce514e998f69f739` |
| habakkuk | https://www.sots.ac.uk/wiki/habakkuk | 2026-11-24 22:53:21 | 5,975 | `583c46e3df2e2e801884ae529d0f50403eb446b4b4cf2e4e7a1916e689bbce47` |
| zechariah | https://www.sots.ac.uk/wiki/zechariah | 2026-11-24 22:53:25 | 6,370 | `dc73c8bcc70f89e40862498157764caed51ffb929d3786c7653ed5670f5666fe` |
| malachi | https://www.sots.ac.uk/wiki/malachi | 2026-11-24 22:53:26 | 6,548 | `c07e285b364e3ab6bcce4c7f77a77c46346595ad3a53d9525ea347941738bc2a` |

The other pages of the coverage table:

| Page | Address | Time of the download, UTC | Size | SHA-256 of the text copy |
|---|---|---|---|---|
| genesis | https://www.sots.ac.uk/wiki/genesis | 2026-11-24 22:52:35 | 7,433 | `b41dc645892b2bc8234c9b5cd9bee5754f57afbe1148007b37f58278752dd482` |
| exodus | https://www.sots.ac.uk/wiki/exodus | 2026-11-24 22:52:36 | 13,643 | `b8cb49ea95be5633701d9cc6b9d1824b79ba61e2711278f8627e40b8c949b2d2` |
| leviticus | https://www.sots.ac.uk/wiki/leviticus | 2026-11-24 22:52:37 | 6,289 | `06b5d30d4efa8eef7c50631b7081913ffd72a7c0f5c9101c5c3f833a640a6a6b` |
| joshua | https://www.sots.ac.uk/wiki/joshua | 2026-11-24 22:52:42 | 6,042 | `dd1a0e7e15a9353c54fc6226c00f9854273d63cb598dbeec78b6d3d5874e1512` |
| judges | https://www.sots.ac.uk/wiki/judges | 2026-11-24 22:52:43 | 8,702 | `12da3667db65cef9d75b7ea79abf0a8ee2949789ef262b578883fc7b631ffff5` |
| ruth | https://www.sots.ac.uk/wiki/ruth | 2026-11-24 22:52:45 | 7,544 | `4574badd6da36a87fc128cc7daf836fc517e3e63484099263c6c310456711bab` |
| samuel | https://www.sots.ac.uk/wiki/samuel | 2026-11-24 22:52:46 | 15,086 | `94e91b5fa4ed0ad1c1787b67fdb6355567710a94a65924e61387020d4b77d434` |
| kings | https://www.sots.ac.uk/wiki/kings | 2026-11-24 22:52:48 | 7,528 | `347cc36746bdc3ce33b8686734520b7e9000235f2bbe360b8a80773101cc6c87` |
| chronicles | https://www.sots.ac.uk/wiki/chronicles | 2026-11-24 22:52:50 | 7,655 | `f84e7eca2b402f9cdade2eb6012e5c1b69ff7a3e1acacfaafbfb64b937aaf0a6` |
| ezra | https://www.sots.ac.uk/wiki/ezra | 2026-11-24 22:52:51 | 195 | `0afd3c60666a956477e99cc105c9b66fafa0d67ed5aaa5351e9cf8d48bdab2e8` |
| isaiah | https://www.sots.ac.uk/wiki/isaiah | 2026-11-24 22:53:03 | 7,842 | `8c9d836c27f1fcacf6059a88fe9b41ae275726d8c1a7870d176c8b83f0606f03` |
| daniel | https://www.sots.ac.uk/wiki/daniel | 2026-11-24 22:53:09 | 4,106 | `5aad5033e920aaf2a145934675ea439334e9744c2b3b2b22a2afa6eb772b3095` |
| hosea | https://www.sots.ac.uk/wiki/hosea | 2026-11-24 22:53:11 | 4,924 | `c2f6f57e7115d189c1bcffbb46585234a8170125f3adc487ee96b43e58f72b2b` |
| joel | https://www.sots.ac.uk/wiki/joel | 2026-11-24 22:53:12 | 4,633 | `0dd710035696883e83c34869d6f945b74ba5799b746cc67762023d66fadb2962` |
| amos | https://www.sots.ac.uk/wiki/amos | 2026-11-24 22:53:13 | 5,860 | `ae48b1265830e7c0a9b2c225baabb719a7a0bf119e7a58ee4453bcd6cce9941a` |
| obadiah | https://www.sots.ac.uk/wiki/obadiah | 2026-11-24 22:53:15 | 5,486 | `b089b7d8d8c90fcedff45c0828f04d8713192d61f00a370507526190fb30376c` |
| zephaniah | https://www.sots.ac.uk/wiki/zephaniah | 2026-11-24 22:53:22 | 4,426 | `5c3101a63b9855e3506f568ae6b65d6f463a4eb6fed8d9a5d555e5497987f823` |
| haggai | https://www.sots.ac.uk/wiki/haggai | 2026-11-24 22:53:24 | 13,540 | `fc376609f2c23492aee792ce1f5d8b3c18388c8885c8107a080fd94073f25823` |

The copies of the Internet Archive. The size and the SHA-256 are of the text copy:

| Page | Copy of | Time of the download, UTC | Size | SHA-256 of the text copy |
|---|---|---|---|---|
| how-to-contribute-to-the-sots-wiki | `https://web.archive.org/web/20251102212121/https://www.sots.ac.uk/wiki/how-to-contribute-to-the-sots-wiki/` | 2026-11-24 22:55:25 | 4,346 | `df6fe27260510823d19752f985691fd738d85f852d913ca25fe28abf3d21495a` |
| numbers | `https://web.archive.org/web/20260301092739/https://www.sots.ac.uk/wiki/numbers/` | 2026-11-24 22:55:34 | 14,883 | `9921ed895e8dad3c0fa9ff9503f889eca819aae05a8fb2bfd10b1b2066e9f9a2` |
| deuteronomy | `https://web.archive.org/web/20240519011151/https://www.sots.ac.uk/wiki/deuteronomy/` | 2026-11-24 22:55:38 | 11,113 | `91a382d9c6ab0b8d563fa8c878888992fb60d7751e81248b88923cda3fc6af5e` |
| nehemiah | `https://web.archive.org/web/20250517124240/https://www.sots.ac.uk/wiki/nehemiah/` | 2026-11-24 22:55:42 | 13,931 | `2b21433a295178d82557bd97511622172c281e7ca6abef3d4e11d9b8cc464968` |
| esther | `https://web.archive.org/web/20250519145724/https://www.sots.ac.uk/wiki/esther/` | 2026-11-24 22:55:46 | 10,041 | `f5941bf64a28e492d1de0a866b0f4f4fa1853d62a27a83313e1903132e9b88a8` |
| job | `https://web.archive.org/web/20250517114609/https://www.sots.ac.uk/wiki/job/` | 2026-11-24 22:55:51 | 11,948 | `b4d02588dafd682d58b5ce196fd10c11b42ed4017c50f0c16b0ec565f4bca2cd` |
| psalms | `https://web.archive.org/web/20250805080248/https://www.sots.ac.uk/wiki/psalms/` | 2026-11-24 22:55:56 | 23,326 | `45a3fb228eabfec529dfd2cf9611d81ee3351b1541013b00794ca12d6a5cb924` |
| proverbs | `https://web.archive.org/web/20250517114652/https://www.sots.ac.uk/wiki/proverbs/` | 2026-11-24 22:56:00 | 14,010 | `3dfad1858e7e46c9ff69d5c86545de794240822321dc00f48fb15bde08f1a39c` |
| ecclesiastes | `https://web.archive.org/web/20250519191827/https://www.sots.ac.uk/wiki/ecclesiastes/` | 2026-11-24 22:56:04 | 14,948 | `d20decbfe4397fa2a9ba601b6b64586f43f3ac5605d8ca58d923b0bd018b4499` |
| song-of-songs | `https://web.archive.org/web/20250517114047/https://www.sots.ac.uk/wiki/song-of-songs/` | 2026-11-24 22:56:09 | 9,506 | `0e9ea91c5ef4c3ee4c5068a33730ea8bcd46b882a260ab67a3c325635ce0a3eb` |
| jeremiah | `https://web.archive.org/web/20250519201045/https://www.sots.ac.uk/wiki/jeremiah/` | 2026-11-24 22:56:13 | 9,236 | `1c70339639692f0fdcbbed519cf7950424affc907ac77670d7ea4fb8b30c3180` |
| lamentations | `https://web.archive.org/web/20250517115522/https://www.sots.ac.uk/wiki/lamentations/` | 2026-11-24 22:56:17 | 12,747 | `d596fd8b70b28b3539fb8995c64b1a58c38119d764cc32d329dc90108d675643` |
| ezekiel | `https://web.archive.org/web/20250517123733/https://www.sots.ac.uk/wiki/ezekiel/` | 2026-11-24 22:56:21 | 12,112 | `93a4999fc0284170995d41559861947e79ec0af3f2ebadcce729121b7d53a615` |
| jonah | `https://web.archive.org/web/20250517113342/https://www.sots.ac.uk/wiki/jonah/` | 2026-11-24 22:56:25 | 12,677 | `c9fc37e7104e820ae04fba65b0a8b8856ffc7e35c2f0ab4497de864eca5f50f2` |
| micah | `https://web.archive.org/web/20250519163750/https://www.sots.ac.uk/wiki/micah/` | 2026-11-24 22:56:29 | 10,399 | `deb556fb541d3e46f8cfb530a6cf44a648f505bcb2e4789effdbb2efe9bfb7bc` |
| nahum | `https://web.archive.org/web/20250517115607/https://www.sots.ac.uk/wiki/nahum/` | 2026-11-24 22:56:33 | 8,729 | `d6986041379556c1b0290960bdc06fcdd70ec42fd7903256f3e5c24b1a031c19` |
| habakkuk | `https://web.archive.org/web/20250517130236/https://www.sots.ac.uk/wiki/habakkuk/` | 2026-11-24 22:56:37 | 10,126 | `694d357e0d930cd024ea6f14d1719508770b57868080b3468b3121c3cd55d4e3` |
| zechariah | `https://web.archive.org/web/20250517114707/https://www.sots.ac.uk/wiki/zechariah/` | 2026-11-24 22:56:42 | 10,531 | `6997f4bada4fb4fc461533e995263ac67227e33135ca112cc5ea0d5882662121` |
| malachi | `https://web.archive.org/web/20250517120217/https://www.sots.ac.uk/wiki/malachi/` | 2026-11-24 22:56:46 | 10,761 | `524093592700ac2c3cc97a7e949b2d4598035ee394984b6840e5a7c12f257fce` |

## Not checked

- I did not ask the Society for permission, and I did not write to any person. The question of use has no answer on the pages.
- I did not open the PDF files: the Rules of 2017 and the rules of the essay prize. I did not open the GDPR policy. They are not on the use of content, by their titles.
- I did not open the pages of the Members' Space, the shop, or the publications.
- I did not check who wrote any article, or compare an article with the works that it lists.
- I did not compare an article with the pages of Wikipedia for the same book. Task 53 compared the site with Wikipedia.
- I did not check any claim of the review that is not on the wiki or on the Berean text: for example the cited ESV pages, the USCCB pages, and the paper of Paul Foster.
- The review sentences that instruct the site, such as "Keep ..." or "Remove ...", have no claim on the wiki, so they are not in the table of step 7.
- The second reading is by the same model family as the first reading. It read the same text copies. It did not see the first verdicts.
- For the Internet Archive, I compared the 18 articles of this task only, and only the newest copy that has the text. I did not check the newest copy of the other 17 articles.
- The text copy of an article has no page pictures and no page layout. I did not look at the pages in a browser.
- I did not check if the pages of the wiki change in the days after 2026-11-24.
