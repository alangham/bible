# Task 29: the World English Bible, a report on the source files

Written on 2026-11-16 for Arthur. Arthur uses this report to decide the tasks that add the World English Bible. No page and no data file of the site changed.

Each count in steps 5 to 12 is from the output of `node scripts/web-report.mjs <folder>`, run on 2026-11-16, or is a sum or a difference of counts in that output. The sizes and the SHA-256 values of step 3 are from the downloaded files. The dates of step 2 are from the pages. The line numbers of steps 9 and 12 are from my reading of the code. The folder is the temporary folder `C:\Users\alang\AppData\Local\Temp\claude\7ba447bc64673977\e77fcb88-5f99-4afb-81a1-addbaca8412a\scratchpad\web`. It is not in the repository. The output is in that folder, in `report.txt`.

The three editions:

- Edition A: eBible.org, `engwebp`, the World English Bible with no Deuterocanon. USFM files.
- Edition B: eBible.org, `eng-web`, the World English Bible Classic. USFM files.
- Edition C: `resources/web.docx`, Arthur's copy of a file of OpenBible.com. The properties of the file give "Bible Hub" as the creator and 2021-07-26 as the date.

## Step 2. Licences

The full record is in section 11 of `docs/DATA-SOURCES.md`. In short:

| Edition | Pages read on 2026-11-16 | Public domain statement | Trademark statement |
|---|---|---|---|
| A | `https://ebible.org/details.php?id=engwebp`, `https://eBible.org/engwebp/copyright.htm` | "The World English Bible is in the Public Domain. That means that it is not copyrighted." On both pages. | "However, "World English Bible" is a Trademark of eBible.org." On both pages. |
| B | `https://ebible.org/details.php?id=eng-web`, `https://eBible.org/eng-web/copyright.htm` | The same words, on both pages. | The same words, on both pages. |
| C | No page. Claude did not open a page of OpenBible.com in this task. | No statement in the file. | No statement in the file. |

What the pages say about the name "World English Bible":

- The reader may copy, publish, distribute, post on the Internet, and use the World English Bible as much as the reader wants.
- The one request: if a person changes the actual text in any way, that person must not call the result the World English Bible. The pages give the reason: to avoid confusion, not to limit freedom.
- The pages say nothing about headings, paragraphs, or notes from a different source next to the text. The site would show the text with the headings and the paragraphs of the Berean data. The pages do not say whether this is a change of the text.

Other facts from the pages:

- The details pages do not link to the copyright pages. The HTML edition of each links to its copyright page. The `copr.htm` file in each zip file has the same public domain statement and the same trademark statement.
- Edition A, details page: "This edition omits the Deuterocanon/Apocrypha, but is otherwise identical to the World English Bible Updated." The copyright page states "2020 stable text edition". Title "World English Bible", abbreviation "WEBP".
- Edition B, details page: "Includes Apocrypha/Deuterocanon. The Classic edition is in American English. It uses "Yahweh" for God's proper name in the Old Testament." The copyright page states that this is the 2020 stable text edition. Title "World English Bible Classic", abbreviation "WEB".
- The details page of edition A shows "Last updated 2026-10-30". The details page of edition B shows "Last updated 2026-11-13". The copyright pages state that eBible.org generated them on 13 Nov 2026.

## Step 3. Downloads

| Edition | Address | Got | Size in bytes | SHA-256 |
|---|---|---|---|---|
| A | `https://eBible.org/Scriptures/engwebp_usfm.zip` | Downloaded by Claude on 2026-11-16 | 2,907,972 | `3bb1ac4fe06e9adf50fe6659237fa0b3743bf651ce15cc9acebc36c5070ae62d` |
| B | `https://eBible.org/Scriptures/eng-web_usfm.zip` | Downloaded by Claude on 2026-11-16 | 3,249,697 | `107c0c220a67b9e43baa18e849e19076d41b8e169a0c71d4b9fd2d77db94c152` |
| C | `resources/web.docx` | Arthur's copy. Claude copied it to the temporary folder. | 2,133,656 | `949f67d0f965eda1d048a696bc7ef69549fab10bdb7bbe8aaec161a3bb140312` |

- Claude downloaded each zip file from its address directly. No page came before the download, so no page asked to accept terms.
- The size and the SHA-256 of `resources/web.docx` are the values of the task.

## Step 5. The content of each edition

### Books, chapters, and verses

| | Edition A | Edition B | Edition C |
|---|---:|---:|---:|
| Books of the 66 | 66 | 66 | 66 |
| Chapters | 1,189 | 1,189 | 1,189 |
| Verses | 31,103 | 31,103 | 31,102 |
| Other files, not counted | 2 | 17 | 0 |
| Verses with a number and no words | 5 | 5 | 4 |

- Edition A, other files: FRT Preface, GLO Glossary.
- Edition B, other files: FRT Preface, GLO Glossary, TOB Tobit, JDT Judith, ESG Esther (Greek), WIS Wisdom of Solomon, SIR Sirach, BAR Baruch, 1MA 1 Maccabees, 2MA 2 Maccabees, 1ES 1 Esdras, MAN Prayer of Manasses, PS2 Psalm 151, 3MA 3 Maccabees, 2ES 2 Esdras, 4MA 4 Maccabees, DAG Daniel (Greek).
- The book names in the `\h` lines of A and B are those of `public/data/books.json`. Edition C writes "Psalm" for Psalms in its chapter lines. In each edition, the last chapter of each book is that of `books.json`.
- Verses with a number and no words, editions A and B: Luke 17:36, Acts 8:37, Acts 15:34, Acts 24:7, Romans 16:25. Each of the five has a footnote in place of words. Example, Acts 8:37: the footnote states that the TR adds the verse, and gives its words. Romans 16:25: the footnote states that the TR places Romans 14:24-26 at the end of Romans and numbers these verses 16:25-27.
- Verses with a number and no words, edition C: Luke 17:36, Acts 8:37, Acts 15:34, Acts 24:7. Edition C has words for Romans 16:25 to 16:27, and has no Romans 14:24 to 14:26. Step 6 gives the lists.

### USFM markers in the 66 books

Edition A, each marker with the number of times that it occurs:

```
\w 645751, \w* 645751, \+w 38122, \+w* 38122, \v 31103, \q2 10676, \q1 8176, \p 8170, \wj 2290, \wj* 2290,
\ft 1240, \f 1231, \f* 1231, \fr 1231, \c 1189, \b 764, \x 340, \x* 340, \xo 340, \xt 340, \d 138, \+wh 135,
\+wh* 135, \m 80, \qs 74, \qs* 74, \li1 72, \h 66, \id 66, \ide 66, \mt1 66, \toc1 66, \toc2 66, \toc3 66,
\pi1 39, \mt2 36, \sp 33, \fqa 19, \mi 7, \ms1 5, \mt3 5, \nb 4, \fq 2, \bk 1, \bk* 1, \cl 1
```

Edition B:

```
\w 639571, \w* 639571, \+w 38121, \+w* 38121, \v 31103, \q2 10676, \q1 8176, \p 8170, \wj 2290, \wj* 2290,
\c 1189, \ft 1139, \f 1130, \f* 1130, \fr 1130, \b 764, \x 340, \x* 340, \xo 340, \xt 340, \d 138, \m 80,
\+wh 78, \+wh* 78, \qs 74, \qs* 74, \li1 72, \h 66, \id 66, \ide 66, \mt1 66, \toc1 66, \toc2 66, \toc3 66,
\pi1 39, \mt2 36, \sp 33, \fqa 19, \mi 7, \ms1 5, \mt3 5, \nb 4, \fq 2, \bk 1, \bk* 1, \cl 1
```

- `\w` holds a word with its Strong's number. `\+w` is the same inside a `\wj` mark.
- The script read each line. 0 lines were not words or headings. 0 heading lines have a verse marker.
- Headings, editions A and B: 5 `\ms1` lines, "BOOK 1" to "BOOK 5" in the Psalms. 33 `\sp` lines in the Song of Solomon, with 4 texts: "Beloved" 15, "Lover" 10, "Friends" 7, "Brothers" 1. 138 `\d` lines, all in the Psalms. The next section has the `\d` lines.
- Edition A and edition B have no `\s` section headings.

Edition C is a `.docx` file. Its form, from `word/document.xml`:

- 20,148 paragraphs. Paragraph styles: `reg` 13,131, no style 2,536, `hdg` 3,016, `acrostic` 229, `subhdg` 42, `suphdg` 5.
- Run styles: `reftext1` 31,102, the verse numbers. `thinv1` 31,102. `cross1` 3,358. `Hyperlink` 2,103.
- 0 text paragraphs with no verse number. 0 pieces of text that the script did not give to a verse. 0 verse numbers that occur a second time in a chapter.

These numbers confirm the designer's numbers for the paragraphs and for the verse numbers.

### Footnotes and cross-reference notes

| | Edition A | Edition B | Edition C |
|---|---:|---:|---:|
| Footnotes in the words of a verse | 1,228 in 1,114 verses | 1,127 in 1,031 verses | none |
| Footnotes in a Psalm title | 3 | 3 | none |
| Cross-reference notes | 340 in 322 verses | 340 in 322 verses | none |

- The 3 footnotes in a Psalm title are in the `\d` lines of Psalms 46, 90, and 145, in A and in B.
- Edition C has no part `word/footnotes.xml` and no part `word/endnotes.xml`.

Five footnotes of edition A:

- Genesis 1:1: `\f + \fr 1:1 \ft The Hebrew word rendered “God” is “\+wh אֱלֹהִ֑ים\+wh*” (Elohim).\f*`
- 1 Samuel 1:24: `\f + \fr 1:24 \ft 1 ephah is about 22 liters or about 2/3 of a bushel\f*`
- Psalms 106:48: `\f + \fr 106:48 \ft Hebrew: יה Yah\f*`
- Zechariah 5:7: `\f + \fr 5:7 \ft A talent is about 30 kilograms or 66 pounds.\f*`
- Acts 2:30: `\f + \fr 2:30 \ft “Christ” means “Anointed One”.\f*`

Five footnotes of edition B:

- Genesis 1:1: the same footnote as in edition A.
- 1 Samuel 1:20: `\f + \fr 1:20 \ft Samuel sounds like the Hebrew for “heard by God.”\f*`
- Psalms 90:1: `\f + \fr 90:1 \ft The word translated “Lord” is “Adonai.”\f*`
- Matthew 9:20: `\f + \fr 9:20 \ft or, tassel\f*`
- Acts 9:38: `\f + \fr 9:38 \ft Reading from NU, TR; MT omits “two men”\f*`

Five cross-reference notes, the same in A and B:

- 2 Kings 12:4: `\x + \xo 12:4 \xt Exodus 30:12\x*`
- Mark 11:9: `\x + \xo 11:9 \xt Psalms 118:25-26\x*`
- John 19:36: `\x + \xo 19:36 \xt Exodus 12:46; Numbers 9:12; Psalms 34:20 \x*`
- Romans 10:20: `\x + \xo 10:20 \xt Isaiah 65:1\x*`
- Hebrews 1:7: `\x + \xo 1:7 \xt Psalms 104:4\x*`

### The words that the translators added

No edition shows them. Editions A and B have 0 `\add` groups and 0 verses with "[" or "]". Edition C has 0 groups in square brackets.

### The title of a Psalm

Editions A and B give the title in a `\d` line of its own, before verse 1. Edition C gives the title in the words of verse 1.

| | Edition A | Edition B | Edition C |
|---|---|---|---|
| Psalm 3, title | `\d` "A Psalm by David, when he fled from Absalom his son." | The same | In verse 1. The heading `hdg` "Deliver Me, O LORD!" is before verse 1. |
| Psalm 3:1, plain words | LORD, how my adversaries have increased! Many are those who rise up against me. | Yahweh, how my adversaries have increased! Many are those who rise up against me. | A Psalm by David, when he fled from Absalom his son. Yahweh, how my adversaries have increased! Many are those who rise up against me. |
| Psalm 23, title | `\d` "A Psalm by David." | The same | In verse 1. The heading `hdg` "The LORD Is My Shepherd" is before verse 1. |
| Psalm 23:1, plain words | The LORD is my shepherd; I shall lack nothing. | Yahweh is my shepherd; I shall lack nothing. | A Psalm by David. Yahweh is my shepherd: I shall lack nothing. |

- Editions A and B have 138 `\d` lines. 117 chapters have a `\d` line before verse 1.
- Psalm 119 has 22 `\d` lines: "ALEPH" before verse 1, and 21 letter names before verses 9 to 169, from "BETH" before verse 9. These 21 are the only `\d` lines that are not before verse 1.
- Edition C has 229 paragraphs in the style `acrostic`. The script did not read their text.

### The names of God in the plain words

| Word | A, verses | A, headings and titles | B, verses | B, headings and titles | C, verses | C, headings |
|---|---:|---:|---:|---:|---:|---:|
| Yahweh | 0 | 0 | 6,830 | 6 | 6,836 | 0 |
| Yah | 0 | 0 | 48 | 0 | 47 | 0 |
| LORD | 6,570 | 6 | 1 | 0 | 2 | 93 |
| GOD | 314 | 0 | 1 | 0 | 2 | 0 |
| Jehovah | 0 | 0 | 0 | 0 | 0 | 0 |

The script counts whole words with the same letters and the same letter case. The numbers confirm the designer's numbers for edition C: "Yahweh" more than 6,800 times, and "LORD" 2 times in the verses. The 93 "LORD" in the headings of edition C are in its section headings. Step 11 shows that 3,012 of the 3,016 main headings of edition C have the words of the Berean headings of the site.

### Seven verses

In A and B, the file form has a Strong's number on most words. The table gives the plain words only. The file form of each verse is in `report.txt` in the temporary folder, not in this report. In edition C, the file form and the plain words are the same for the seven verses.

| Verse | Edition A, plain words | Edition B, plain words | Edition C |
|---|---|---|---|
| Genesis 1:1 | In the beginning, God created the heavens and the earth. | The same as A | In the beginning God created the heavens and the earth. |
| Genesis 2:4 | ... in the day that the LORD God made the earth and the heavens. | ... in the day that Yahweh God made the earth and the heavens. | The same as B |
| Psalm 23:1 | The LORD is my shepherd; I shall lack nothing. | Yahweh is my shepherd; I shall lack nothing. | A Psalm by David. Yahweh is my shepherd: I shall lack nothing. |
| Isaiah 12:2 | ... for the LORD, the LORD, is my strength and song ... | ... for Yah, Yahweh, is my strength and song ... | The same as B |
| Matthew 5:3 | “Blessed are the poor in spirit, for theirs is the Kingdom of Heaven. | The same as A | The same as A |
| John 3:16 | ... he gave his only born Son ... | The same as A | ... he gave his one and only Son ... |
| 3 John 1:14 | but I hope to see you soon. Then we will speak face to face. ... | The same as A | but I hope to see you soon, and we will speak face to face. ... |

- Genesis 2:4, edition A: a footnote states that "LORD" or "GOD" in capital letters translates the Proper Name of God. Edition B has a footnote that names "Yahweh" as God's proper Name.
- Isaiah 12:2, edition A: a footnote marks the first "LORD" as "Yah".
- Matthew 5:3 and John 3:16 are in `\wj` marks in A and in B.

## Step 6. The words of the editions compared

### Edition A and edition B

- Verses in both: 31,103. Verses whose plain words differ: 5,821.
- Class "the name of God only": 582.
- Class "other": 5,239.

The sign of the script replaces the word "LORD", but not the word "the" before it. So "the LORD" in A and "Yahweh" in B fall in the class "other". When the script also removes "the" or "The" before the sign, 5,233 of the 5,239 verses are the same. The other 6 verses:

| Verse | Edition A | Edition B |
|---|---|---|
| Genesis 2:5 | No plant of the field was yet on the earth ... | No plant of the field was yet in the earth ... |
| Exodus 28:36 | ‘HOLY TO THE LORD.’ | ‘HOLY TO YAHWEH.’ |
| Exodus 39:30 | “HOLY TO THE LORD”. | “HOLY TO YAHWEH”. |
| Deuteronomy 28:58 | ... this glorious and fearful name, THE LORD your God, | ... this glorious and fearful name, YAHWEH your God, |
| Psalms 68:29 | ... kings will bring presents to you. | ... kings shall bring presents to you. |
| Zechariah 14:20 | “HOLY TO THE LORD” ... the LORD’s house ... | “HOLY TO YAHWEH” ... Yahweh’s house ... |

So 4 of the 6 differ in the name of God in capital letters. 2 verses differ in other words: Genesis 2:5 and Psalms 68:29.

15 examples of the class "other", from the output. Each differs only in "the LORD" and "Yahweh", with "the LORD’s" and "Yahweh’s":

| Verse | Edition A | Edition B |
|---|---|---|
| Genesis 2:4 | ... in the day that the LORD God made ... | ... in the day that Yahweh God made ... |
| Exodus 19:22 | ... who come near to the LORD ... lest the LORD break out on them.” | ... who come near to Yahweh ... lest Yahweh break out on them.” |
| Leviticus 23:9 | The LORD spoke to Moses, saying, | Yahweh spoke to Moses, saying, |
| Numbers 29:13 | ... of a pleasant aroma to the LORD: ... | ... of a pleasant aroma to Yahweh: ... |
| Deuteronomy 22:5 | ... is an abomination to the LORD your God. | ... is an abomination to Yahweh your God. |
| Judges 4:14 | ... in which the LORD has delivered ... Hasn’t the LORD gone out ... | ... in which Yahweh has delivered ... Hasn’t Yahweh gone out ... |
| 1 Samuel 30:23 | ... with that which the LORD has given to us ... | ... with that which Yahweh has given to us ... |
| 2 Kings 3:18 | This is an easy thing in the LORD’s sight. ... | This is an easy thing in Yahweh’s sight. ... |
| 2 Chronicles 6:7 | ... for the name of the LORD, the God of Israel. | ... for the name of Yahweh, the God of Israel. |
| Psalms 3:4 | I cry to the LORD with my voice ... | I cry to Yahweh with my voice ... |
| Psalms 118:20 | This is the gate of the LORD; ... | This is the gate of Yahweh; ... |
| Isaiah 37:1 | ... and went into the LORD’s house. | ... and went into Yahweh’s house. |
| Jeremiah 16:11 | ... says the LORD, ... | ... says Yahweh, ... |
| Jeremiah 48:15 | ... whose name is the LORD of Armies. | ... whose name is Yahweh of Armies. |
| Joel 1:1 | The LORD’s word that came to Joel ... | Yahweh’s word that came to Joel ... |

### Edition A and edition C

- Verses in both: 31,100. Verses whose plain words differ: 18,785.
- Verses only in A: 3, Romans 14:24, Romans 14:25, Romans 14:26. Verses only in C: 2, Romans 16:26, Romans 16:27.
- The differences by cause: only punctuation or letter case 3,758. Edition C has the Psalm title in verse 1, and the rest is the same: 46. Other differences: 14,981.

15 examples of the other differences:

| Verse | Edition A | Edition C |
|---|---|---|
| Genesis 1:2 | The earth was formless and empty. Darkness was on the surface of the deep and God’s Spirit was hovering ... | Now the earth was formless and empty. Darkness was on the surface of the deep. God’s Spirit was hovering ... |
| Exodus 22:12 | ... the one who stole shall make restitution to its owner. | ... he shall make restitution to its owner. |
| Numbers 6:21 | ... in addition to that which he is able to afford. ... | ... besides that which he is able to get. ... |
| Deuteronomy 15:14 | You shall furnish him liberally ... As the LORD your God has blessed you ... | you shall furnish him liberally ... as Yahweh your God has blessed you ... |
| Judges 11:8 | ... You will be our head over all the inhabitants of Gilead.” | ... and you shall be our head over all the inhabitants of Gilead.” |
| 2 Samuel 8:13 | ... from striking down eighteen thousand men of the Syrians in the Valley of Salt. | ... from smiting the Syrians in the Valley of Salt, even eighteen thousand men. |
| 2 Kings 9:8 | For the whole house of Ahab will perish. ... | For the whole house of Ahab shall perish. ... |
| 2 Chronicles 3:3 | ... for the building of God’s house: ... and the width twenty cubits. | ... for the building of the house of God. ... and the breadth twenty cubits. |
| Nehemiah 13:22 | ... Remember me for this also, my God, ... | ... Remember to me, my God, this also, ... |
| Psalms 116:11 | I said in my haste, “All people are liars.” | I said in my haste, “All men are liars.” |
| Isaiah 52:15 | so he will cleanse many nations. ... | so shall he sprinkle many nations; ... |
| Jeremiah 36:21 | ... Jehudi read it in the hearing of the king ... | ... Jehudi read it in the ears of the king ... |
| Ezekiel 26:7 | “For the Lord GOD says: ... and an army with many people. | For thus says the Lord Yahweh: ... and a company, and many people. |
| Jonah 1:10 | ... “What have you done?” ... | ... “What is this that you have done?” ... |
| John 15:20 | ... they will also keep yours. | ... they will keep yours also. |

### Edition B and edition C

- Verses in both: 31,100. Verses whose plain words differ: 16,978.
- Verses only in B: 3, Romans 14:24 to 14:26. Verses only in C: 2, Romans 16:26 and 16:27.
- The differences by cause: only punctuation or letter case 4,377. Edition C has the Psalm title in verse 1, and the rest is the same: 94. Other differences: 12,507.

15 examples of the other differences:

| Verse | Edition B | Edition C |
|---|---|---|
| Genesis 1:2 | The earth was formless and empty. Darkness was on the surface of the deep and God’s Spirit ... | Now the earth was formless and empty. Darkness was on the surface of the deep. God’s Spirit ... |
| Exodus 26:10 | ... the one curtain that is outermost ... | ... the one curtain that is outmost ... |
| Numbers 17:13 | Everyone who keeps approaching Yahweh’s tabernacle, dies! ... | Everyone who comes near, who comes near to the tabernacle of Yahweh, dies! ... |
| Deuteronomy 28:2 | All these blessings will come upon you ... if you listen to Yahweh your God’s voice. | and all these blessings shall come on you ... if you shall listen to the voice of Yahweh your God. |
| Ruth 2:22 | ... and that they not harm you in any other field.” | ... and that they not meet you in any other field.” |
| 2 Samuel 20:11 | One of Joab’s young men stood by him, ... | There stood by him one of Joab’s young men, ... |
| 2 Kings 15:12 | This was Yahweh’s word ... | This was the word of Yahweh ... |
| 2 Chronicles 5:7 | ... the ark of Yahweh’s covenant ... into the inner sanctuary of the house ... | ... the ark of the covenant of Yahweh ... into the oracle of the house ... |
| Nehemiah 11:22 | ... the singers responsible for the service of God’s house. | ... the singers, over the business of the house of God. |
| Isaiah 1:4 | ... offspring of evildoers ... | ... a seed of evildoers ... |
| Jeremiah 14:10 | Yahweh says to this people: “Even so they have loved to wander. ... | Thus says Yahweh to this people, Even so have they loved to wander; ... |
| Lamentations 2:1 | ... He has cast the beauty of Israel down from heaven to the earth, and hasn’t ... | ... He has cast down from heaven to the earth the beauty of Israel, And hasn’t ... |
| Ezekiel 36:38 | ... so the waste cities will be filled with flocks of men. Then they will know ... | ... so shall the waste cities be filled with flocks of men; and they shall know ... |
| Zechariah 12:2 | ... and it will also be on Judah in the siege against Jerusalem. | ... and on Judah also will it be in the siege against Jerusalem. |
| Acts 21:3 | ... for the ship was there to unload her cargo. | ... for there the ship was to unload her cargo. |

### Which of A and B is nearer to C

Edition B is nearer to C. B and C differ in 16,978 verses, and A and C in 18,785. Edition C uses "Yahweh", as B does. In some of the examples, edition C has "shall" where A or B has "will", for example 2 Kings 9:8 and Ezekiel 36:38. I did not count this.

## Step 7. The verses of editions A and B and the Berean text

The output is the same for edition A and edition B.

- Verses of the edition with no line in `sources/bsb/bsb.txt`: 3, Romans 14:24, Romans 14:25, Romans 14:26.
- Verses of `sources/bsb/bsb.txt` that the edition does not have: 2, Romans 16:26 and Romans 16:27.
- Verses with words in `sources/bsb/bsb.txt` that the edition has with no words: 1, Romans 16:25.
- Chapters whose number of verses differs: Romans 14, edition 26 and `bsb.txt` 23. Romans 16, edition 25 and `bsb.txt` 27.

The 16 verses with no words in `sources/bsb/bsb.txt`:

| Verse | Edition A and edition B |
|---|---|
| Matthew 17:21 | Words: But this kind doesn’t go out except by prayer and fasting.” |
| Matthew 18:11 | Words: For the Son of Man came to save that which was lost. |
| Matthew 23:14 | Words: “But woe to you, scribes and Pharisees, hypocrites! ... |
| Mark 7:16 | Words: If anyone has ears to hear, let him hear!” |
| Mark 9:44 | Words: ‘where their worm doesn’t die, and the fire is not quenched.’ |
| Mark 9:46 | Words: ‘where their worm doesn’t die, and the fire is not quenched.’ |
| Mark 11:26 | Words: But if you do not forgive, neither will your Father in heaven forgive your transgressions.” |
| Mark 15:28 | Words: The Scripture was fulfilled which says, “He was counted with transgressors.” |
| Luke 17:36 | The number and no words |
| Luke 23:17 | Words: Now he had to release one prisoner to them at the feast. |
| John 5:4 | Words: for an angel went down at certain times into the pool ... |
| Acts 8:37 | The number and no words |
| Acts 15:34 | The number and no words |
| Acts 24:7 | The number and no words |
| Acts 28:29 | Words: When he had said these words, the Jews departed, having a great dispute among themselves. |
| Romans 16:24 | Words: The grace of our Lord Jesus Christ be with you all! Amen. |

So the edition has words in 12 of the 16 verses, and no words in 4.

## Step 8. The link passages and the verses of edition A

- `public/data/links/*.json` has 3,866 links and 7,732 passages.
- 3 passages have a first verse or a last verse that is not in edition A, or has no words in edition A. All 3 are echo links.

| Link `id` | Passage | Cause |
|---|---|---|
| `o3385` | b: Romans 16:25 to Romans 16:26 | Romans 16:25 has no words in A. Romans 16:26 is not in A. |
| `h1733` | a: Romans 16:25 | Romans 16:25 has no words in A. |
| `o3515` | b: Romans 16:25 | Romans 16:25 has no words in A. |

## Step 9. The fit of the text blocks

The method of the King James Version data of Task 20 puts each verse in the Berean block where the verse starts, with `{ v }` or `{ o }`. The script checked the places that the method uses: the items `{ v }` and `{ o }` of each Berean block, and the d blocks.

- Verses of edition A that the method cannot place: 3, Romans 14:24, Romans 14:25, Romans 14:26. No Berean block starts them.
- Verses that a Berean block starts and that edition A does not have: 2, Romans 16:26 and Romans 16:27.
- Chapters where edition A has a `\d` title and the Berean data has no d block: 1, Psalms 119. The title is "ALEPH".
- Chapters where the Berean data has a d block and edition A has no `\d` title: 1, Zechariah 12.
- Verses of edition A with no words that a Berean block starts: 5, Luke 17:36, Acts 8:37, Acts 15:34, Acts 24:7, Romans 16:25.

What the method of `scripts/build-text-kjv.mjs` does in each case. I read the code. I did not run the method on edition A.

- A verse that edition A has and the Berean data does not have: the build stops with the error "verse of the source with no place in the Berean structure" (line 477). This applies to Romans 14:24 to 14:26.
- A verse that a Berean block starts and the source does not have: the build stops with the error "the source has no such verse" (line 417). This applies to Romans 16:26 and 16:27.
- A `\d` line after a verse: the build stops with the error "\d after a verse or a second \d" (line 94). This applies to the 21 letter names of Psalm 119 after verse 1.
- A `\d` title in a chapter with no Berean d block: the build stops with an error (line 413). This applies to "ALEPH" in Psalm 119.
- A Berean d block in a chapter with no `\d` title: the build makes no d block, and verse 1 goes in the next block (lines 442 to 447). This applies to Zechariah 12.
- A verse with a number and no words: I did not check what the method does with it.

The step 9 lists are for edition A. The script did not run step 9 on edition B. Steps 5 and 7 give the same verses and the same `\d` lines for B.

## Step 10. The words-of-Jesus marks

Editions A and B have the marker `\wj`. Their numbers are the same.

| Book | Start markers | End markers | Verses with marked words |
|---|---:|---:|---:|
| Matthew | 740 | 740 | 645 |
| Mark | 317 | 317 | 287 |
| Luke | 646 | 646 | 587 |
| John | 459 | 459 | 436 |
| Acts | 33 | 33 | 31 |
| 1 Corinthians | 2 | 2 | 2 |
| 2 Corinthians | 1 | 1 | 1 |
| 1 Timothy | 1 | 1 | 1 |
| Revelation | 91 | 91 | 69 |
| Total | 2,290 | 2,290 | 2,059 |

- The script found 0 problems: no end marker with no start marker, no start marker inside an open mark, no mark open at the end of a chapter, and no `\wj` in a heading line.
- Classes of the verses with words, as in the report of Task 25: "all" 1,405, "part" 654, "none" 29,039. The same in A and in B.
- I did not count the words-of-Jesus marks that go on over a verse marker.

Edition A (rows) against the Berean Standard Bible site data (columns), verses in both:

| A \ Berean Standard Bible | all | part | none |
|---|---:|---:|---:|
| all | 1,393 | 1 | 4 |
| part | 9 | 633 | 12 |
| none | 3 | 8 | 29,020 |

Edition A (rows) against the King James Version site data (columns), verses in both:

| A \ King James Version | all | part | none |
|---|---:|---:|---:|
| all | 1,397 | 3 | 5 |
| part | 3 | 624 | 27 |
| none | 0 | 0 | 29,036 |

Verses where edition A has "none" and the Berean Standard Bible has words-of-Jesus marks: 11.

- Matthew 27:43, Matthew 27:63, Mark 5:31, Mark 8:23, Luke 24:7, Hebrews 10:5, Hebrews 10:6, Hebrews 10:7, Hebrews 10:8, Hebrews 10:9, Revelation 4:1.

Verses where edition A has words-of-Jesus marks and the Berean Standard Bible has "none": 16.

- Luke 9:55, Luke 9:56, Luke 20:23, John 5:12, John 8:33, John 8:52, John 9:11, John 12:34, 1 Timothy 5:18, Revelation 1:8, Revelation 21:5, Revelation 21:6, Revelation 21:7, Revelation 21:8, Revelation 22:14, Revelation 22:15.

Neither list has more than 100 verses.

## Step 11. Edition C and the site data: headings and cross-reference lines

| | Site data | Edition C |
|---|---:|---:|
| Main section headings (s1, hdg) | 3,016 | 3,016 |
| Smaller headings (s2, subhdg) | 80 | 42 |
| Other headings | ms 5, d 5, qa 44 | suphdg 5, acrostic 229 |
| Cross-reference lines | 1,325 | 1,325 |

The script compared the main section headings and the smaller headings. It did not compare the other headings.

Main section headings:

- The same words at the same place: 3,012.
- Different words at the same place: 4.
- The same words before a different verse: 0. Only in the site data: 0. Only in edition C: 0.

| Place | Site data | Edition C |
|---|---|---|
| Numbers 5:5 | Confession and Restitution | Restitution for Trespasses |
| 2 Kings 7:3 | The Arameans Flee | The Syrians Flee |
| Psalms 77:1 | In the Day of Trouble I Sought the Lord | In the Day of Trouble I Sought the LORD |
| Ecclesiastes 5:1 | Approaching God with Fear | Approaching God with Awe |

Smaller headings:

- The same words at the same place: 42. Different words: 0. Before a different verse: 0. Only in edition C: 0.
- Only in the site data: 38. One is Proverbs 24:1 "Saying 20". 37 are the speaker headings of the Song of Solomon: "The Bride", "The Bridegroom", and "The Friends", from Song of Solomon 1:2 to 8:14. 6 of the 37 are in the middle of a verse.

Cross-reference lines: 1,325 at the same verse in both. 0 with different words. 0 only in the site data. 0 only in edition C.

## Step 12. The places in the code that are written for two translations

The script searched the `.ts`, `.tsx`, `.mjs`, `.js`, `.css`, and `.json` files of `src/`, `scripts/`, and `e2e/`. It searched for the names and the codes of the two translations, for "two translations", and for `toHaveLength(2)`. It found 385 lines in 38 files. 26 of the lines are in `scripts/web-report.mjs`, the script of this task. The full list is in `report.txt`.

I read each line and the code around it. The table gives the places that must change for a third translation. This sort is my reading of the code. The other lines name one translation in a comment, or test the data of one translation, and I expect that they stay.

The site code:

| File and line | What it is | The change for a third translation |
|---|---|---|
| `src/data/translation.ts:7` | `export type Translation = 'bsb' \| 'kjv'` | A third value. |
| `src/data/translation.ts:9` to `12` | The list `TRANSLATIONS`, with the comment "The two translations of the site" | A third row: the id, the full name, the short name. |
| `src/data/translation.ts:21` | `readTranslation` reads only `'kjv'`, and gives `'bsb'` for each other value | Read the third value also. |
| `src/data/text.ts:132` | `FOLDER: Record<Translation, string> = { bsb: 'text', kjv: 'text-kjv' }` | A third folder, for example `text-web`. |
| `src/book/LinkPopup.tsx:220` | The label "The quoted words are from the Berean Standard Bible." shows only when `translation === 'kjv'` | The label must show for each translation that is not the Berean Standard Bible. |
| `src/SourcesPage.tsx:26` | "The site has two translations: ..." | New words, and a credit paragraph for the third translation. |
| `src/SourcesPage.tsx:51` to `52` | "On the King James Version pages, the section headings ... are those of the Berean Standard Bible files." | The same statement for the third translation. |
| `src/SourcesPage.tsx:55` to `57` | "The two translations do not mark the same words in each verse." | New words. |
| `src/data/redLetters.ts:5` | The comment "the two translations" | A comment only. |

`src/reading/ReadingPage.tsx` makes the translation list from `TRANSLATIONS` (lines 368 and 552). I expect a third row with no change in this file. I did not render a list with three rows.

The scripts:

| File | What it is | The change for a third translation |
|---|---|---|
| `scripts/build-text-kjv.mjs` | The build of the King James Version data. It has the lists `SPLIT` and `MARK_EXCEPTIONS` of that translation. | A new build script for the third translation, or a shared part of this script. |
| `scripts/build-text.mjs`, `scripts/build-links.mjs`, `scripts/check-links.mjs` | The Berean data and the links | No change. |
| `scripts/kjv-report.mjs`, `scripts/wj-report.mjs`, `scripts/web-report.mjs` | Report scripts | No change. |

The unit tests:

| File and line | What it is |
|---|---|
| `src/data/translation.test.ts:35` to `37` and `81` | The exact list of the two translations and of the two short names |
| `src/data/translation.test.ts:98` to `106` | The two folders of the text data |
| `src/data/translation.test.ts:33` | The name of the test: "has the two translations with their full names" |
| `src/data/marks.test.ts:15`, `58`, `157` | The data and the source files of the two translations |
| `src/data/marks.test.ts:19`, `142`, `186` | The source files of the King James Version in `sources/kjv/usfm`, and their count of 2,038 words-of-Jesus marks. A third translation needs the same checks for its own files. |
| `src/data/marks.test.ts:197` to `198`, `204` to `205`, `208` to `209`, `227` | The class counts and the books with words-of-Jesus marks, for each of the two translations |
| `src/data/textKjv.test.ts` | The test of the King James Version data. A third translation needs a test of its own of this kind. |

The browser tests:

| File and line | What it is |
|---|---|
| `e2e/redletters.spec.ts:15` | `const TRANSLATIONS = ['bsb', 'kjv']`. The tests at lines 217 to 218, 272, and 335 to 336 go through this list. |
| `e2e/redletters-breaks.json` | 8 keys: "bsb" and "kjv", each at 1440 and 390 px, for Matthew 4 and John 14. `e2e/redletters.spec.ts` lines 33 and 279 use them. A third translation needs 4 more keys, measured on a build. |
| `e2e/redletters.spec.ts:446` | The words of the Sources page, "The two translations do not mark the same words ..." |
| `e2e/translation.spec.ts:21` | `dataVerse` takes the folder `'text' \| 'text-kjv'` |
| `e2e/translation.spec.ts:74` to `79` | The function that opens a chapter with the King James Version selected |
| `e2e/translation.spec.ts:88` | `selectTranslation` takes one of the two full names |
| `e2e/translation.spec.ts:224` to `232` | The label of the pop-up of a quotation link, with the King James Version |
| `e2e/translation.spec.ts:254` | The words of the Sources page, "The site has two translations: ..." |
| `e2e/translation.spec.ts:285` to `294` | The keyboard test of the translation list: Tab from the first row to the second row |
| `e2e/marks.spec.ts:18` | `dataVerses` takes the folder `'text' \| 'text-kjv'` |
| `e2e/marks.spec.ts:64` | The name of the test: "... in the two translations" |
| `e2e/marks.spec.ts:67` to `68` | The list of the two translations and their folders |
| `e2e/popup-side.spec.ts:11` | `translation: 'bsb' \| 'kjv'` |
| `e2e/topbar.spec.ts:77` | The wall has no text with the names of the two translations. A third name belongs in this check. |
| `e2e/topbar.spec.ts:260` | `expect(rows).toHaveLength(2)`: the translation list has two rows |
| `e2e/topbar.spec.ts:275` | The second row of the translation list |
| `e2e/a11y.spec.ts:284` to `326` | The axe-core checks with the King James Version stored. A third translation needs the same checks. |

The documents:

- `CLAUDE.md`, the hard rules: "The site has two translations ... Do not add a different translation." and "Do not change the words of a Bible text. This applies to the two translations."
- `CLAUDE.md`, the table of names: "translation: One of the two Bible texts of the site".
- `docs/DESIGN.md` section 8, line 409: the links and the other content are "the same for the two translations".
- `docs/DESIGN.md` section 9.9, point 2: the rule of `CLAUDE.md` stays until Arthur changes it.
- `docs/DESIGN.md` section 11.1, line 618: "The source files of the two translations have marks for the words of Jesus."
- `docs/DESIGN.md` section 11.5 states that one red-letters selection applies to "the two translations". Section 11.6 states that "the two translations differ in some verses".

## Proposals

These proposals give options and costs. Arthur decides.

### 1. The edition: edition A with "LORD", or edition B with "Yahweh"

The two editions have the same 66 books, the same verse numbers, and the same number of `\d` lines. Each has 340 cross-reference notes and 2,290 words-of-Jesus marks. The script did not compare the notes or the marks verse by verse. The words differ in 5,821 verses. In all but 2 of them, the difference is the name of God.

| Option | Cost |
|---|---|
| (a) Edition A, `engwebp`, with "LORD" and "GOD". | The build reads the 66 book files, and leaves out 2 other files: the preface and the glossary. "LORD" occurs 6,570 times and "GOD" 314 times in the verses. The pages call this edition "World English Bible", abbreviation "WEBP". |
| (b) Edition B, `eng-web`, with "Yahweh". | The build leaves out 17 other files: the preface, the glossary, and 15 books. The 15 books are Tobit, Judith, Esther (Greek), Wisdom of Solomon, Sirach, Baruch, 1 Maccabees, 2 Maccabees, 1 Esdras, Prayer of Manasses, Psalm 151, 3 Maccabees, 2 Esdras, 4 Maccabees, and Daniel (Greek). "Yahweh" occurs 6,830 times and "Yah" 48 times in the verses. The section headings of the Berean data say "LORD" next to "Yahweh" in the text, for example "The LORD Is My Shepherd" above "Yahweh is my shepherd". The pages call this edition "World English Bible Classic", abbreviation "WEB". |

For each option, the build must remove the Strong's numbers of the `\w` and `\+w` words, 1,231 or 1,130 footnotes, and 340 cross-reference notes. Edition A has 645,751 `\w` and 38,122 `\+w`. Edition B has 639,571 `\w` and 38,121 `\+w`. For each option, the site needs a test that compares each verse with the source file, as `src/data/textKjv.test.ts` does.

Edition C is not an option of this task. The file has no licence statement. Its words differ from A in 18,785 verses and from B in 16,978 verses. The script did not look for words-of-Jesus marks in edition C.

### 2. Verses with no words, and chapters whose number of verses differs

Four verses have a number and no words in the edition and in `bsb.txt`: Luke 17:36, Acts 8:37, Acts 15:34, Acts 24:7. Romans 14 and Romans 16 differ: the edition has Romans 14:24 to 14:26, where the Berean text has Romans 16:25 to 16:27. Romans 16:25 has a number and a footnote, and no words. The method of Task 20 stops at these places. 12 verses have words in the edition and none in `bsb.txt`. The method of Task 20 places them, as for the King James Version.

For the four verses with no words:

| Option | Cost |
|---|---|
| (a) Show no words for the verse, as the Berean data does. | The build needs a rule for a verse with no words. I did not check what the King James Version pages show for these verses. |
| (b) Show the footnote of the edition as a note of the verse. | The Berean pages show notes about manuscripts from the Berean files. The King James Version pages show no notes. The build needs a rule to keep these five footnotes and no other footnote. The words are those of the source, so the site writes no content. |

For Romans 14 and Romans 16:

| Option | Cost |
|---|---|
| (a) Keep the verse numbers of the edition: Romans 14 has 26 verses, and Romans 16 has 25. | The build puts Romans 14:24 to 14:26 after the last Berean block of Romans 14, and Romans 16 ends at verse 25 with no words. A new rule in the build for verses that no Berean block starts. All 3 link passages of step 8 contain Romans 16:25, which has no words. One of them, `o3385`, also ends at Romans 16:26, which the edition does not have. |
| (b) Show the three verses at the place and with the numbers of the Berean data: Romans 16:25 to 16:27. | No change to a word, but a change to three verse numbers of the edition. The trademark terms ask that a changed text is not called the World English Bible. The pages do not say whether a change of verse numbers is a change of the text. The 3 link passages of step 8 then have words. |

### 3. Red letters

The rule of section 11.2 of `docs/DESIGN.md`: each translation uses the words-of-Jesus marks of its own source files. The edition has 2,290 words-of-Jesus marks in 2,059 verses, with 0 problems. The numbers are the same in A and B.

| Option | Cost |
|---|---|
| (a) Use the words-of-Jesus marks of the edition, by section 11.2. | The build must find each words-of-Jesus mark in the words of its verse, as for the King James Version. Inside a words-of-Jesus mark, the Strong's numbers are `\+w`, so the build must read them there. In 27 verses, one of the two has words-of-Jesus marks and the other has "none": 11 and 16, step 10 lists them. For example, the Berean Standard Bible has words-of-Jesus marks in Hebrews 10:5 to 10:9, and the edition does not. I did not count the words-of-Jesus marks that go on over a verse marker. |
| (b) No red letters on the pages of the third translation. | The red letters switch has no effect on those pages. The Sources page must say so. This is not the rule of section 11.2, so it needs a change of the design. |

The files have the marker `\wj`, so the case "no words-of-Jesus marks" does not occur.

### 4. The name and the short name of the translation

The pages state that "World English Bible" is a trademark of eBible.org. They ask that a changed text is not called the World English Bible. The site would show the text with no changed word, with the headings and the paragraphs of the Berean data. The pages say nothing about this.

| Option | Cost |
|---|---|
| (a) The name of the details page of the edition: "World English Bible", short name "WEBP", for edition A. "World English Bible Classic", short name "WEB", for edition B. | The names of the source. The build must change no word. A list of exceptions such as the 13 split words of the King James Version would be a change of the text. |
| (b) "World English Bible", short name "WEB", for either edition. | The short name that the pages give to edition B. For edition A, it is not the abbreviation of its details page. |
| (c) Arthur asks eBible.org whether the site can use the name with the headings and the paragraphs of the Berean data. | A message and a wait for an answer. It removes the doubt of the trademark terms. |

If option (b) of point 2 moves the three verses of Romans, each option of this point has the doubt of point 2.

### 5. The words of the credit on the Sources page

The credit of the King James Version names the edition, the source, the licence, and the structure from the Berean files. A credit of the same form, from the pages of step 2:

| Option | Cost |
|---|---|
| (a) One paragraph: the name, the edition, the files of eBible.org with a link, "public domain", and the statement that "World English Bible" is a trademark of eBible.org. One more sentence: on these pages, the section headings, the cross-reference lines, the paragraphs, and the lines of poetry are those of the Berean Standard Bible files. | The words come from the pages of step 2. The sentence about the structure is the sentence of the King James Version. |
| (b) Option (a), and a sentence that the site does not show the Strong's numbers, the footnotes, and the cross-reference notes of the files. | The same as option (a), with one more sentence. The King James Version credit has such a sentence. |

For each option, the first sentence "The site has two translations" and the sentence "The two translations do not mark the same words in each verse" must change. If option (a) of point 2 keeps the verse numbers of Romans, or option (b) moves them, the credit can say so.

### 6. The work in the code, and the rule of two translations

Step 12 lists the places. The rule of `CLAUDE.md` says that the site has two translations and that no different translation is added.

| Option | Cost |
|---|---|
| (a) Add a third translation. | Arthur changes the hard rules and the table of names in `CLAUDE.md`, and sections 8, 9.9, 11.1, 11.5, and 11.6 of `docs/DESIGN.md`. In the site code: the type `Translation`, the list `TRANSLATIONS`, `readTranslation`, the folder list in `src/data/text.ts`, the label in `src/book/LinkPopup.tsx`, and the Sources page. A new build script, the source files in `sources/`, and a new data folder in `public/data/`. A new data test as `src/data/textKjv.test.ts`, and changes to the 24 test places of step 12. The translation list gets a third row. I did not render a list with three rows. |
| (b) Replace the King James Version with the World English Bible. | The rule of two translations stays. The same work in the code as option (a), less the third row. The King James Version pages, its data, its tests, and its exceptions of sections 8.2 and 11.3 go away. |
| (c) Do not add the World English Bible now. | No work. The site stays as it is. |

For options (a) and (b), the build tasks also need the decisions of points 1 to 5.
