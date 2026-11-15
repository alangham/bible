# Task 19: the King James Version, a report on the source files

Written on 2026-11-15 for Arthur. Arthur uses this report to decide the tasks that add the King James Version. No page and no data file of the site changed.

Each number in this report is from the output of `node scripts/kjv-report.mjs <folder>`, run on 2026-11-15. The folder is the temporary folder `C:\Users\alang\AppData\Local\Temp\claude\7ba447bc64673977\e77fcb88-5f99-4afb-81a1-addbaca8412a\scratchpad\kjv`. It is not in the repository.

The three editions:

- Edition A: eBible.org, the text of 1769 with Strong's numbers. USFM files.
- Edition B: eBible.org, the Cambridge Paragraph Bible. USFM files.
- Edition C: OpenBible.com, `kjv.docx`. The task names OpenBible.com a site of the Berean publisher. The properties of the file give "Bible Hub" as the creator and 2021-07-26 as the date.

## Step 2. Licences

The full record is in section 9 of `docs/DATA-SOURCES.md`. In short:

| Edition | Pages read on 2026-11-15 | Licence statement | Right to print in the United Kingdom |
|---|---|---|---|
| A | `https://ebible.org/details.php?id=eng-kjv2006`, `https://eBible.org/eng-kjv2006/copyright.htm` | "Public Domain" on both pages | Stated: three publishers have the exclusive right in the United Kingdom. The right has no effect outside the United Kingdom. |
| B | `https://www.ebible.org/details.php?id=engkjvcpb`, `https://eBible.org/engkjvcpb/copyright.htm` | "Public Domain" on both pages | The same statement as for edition A. |
| C | `https://openbible.com/doc.htm`, `https://openbible.com/terms.htm` | No statement on the downloads page and none in the file. The terms page gives a free licence for each download, claims no copyright over public-domain texts such as the King James Version, and gives no guarantee of public-domain status. | Not stated. |

- The details pages of A and B do not link to the copyright pages. The HTML edition of each links to its copyright page.
- The terms page of OpenBible.com states that a person who downloads a file accepts its terms by the download. Arthur decided on 2026-11-15 that Claude does not download from OpenBible.com. Claude used Arthur's own copy of `kjv.docx`.
- The PDF file of edition C, `https://openbible.com/pdfs/kjv.pdf`: Arthur decided on 2026-11-15 that it is not necessary. I did not get it and did not read it. So I did not read the first pages and the last pages of the PDF file.

## Step 3. Downloads

| Edition | File | Size in bytes | SHA-256 |
|---|---|---|---|
| A | `https://eBible.org/Scriptures/eng-kjv2006_usfm.zip`, downloaded on 2026-11-15 | 2,466,537 | `b6faa67117ccaba49df9e7df224a553f11758ae7c5d58f0f7979e2b73ac4480b` |
| B | `https://eBible.org/Scriptures/engkjvcpb_usfm.zip`, downloaded on 2026-11-15 | 1,797,997 | `62a1ee0f996a20523663c37e3c7afbc1bb01443488049f32a8178393ac52831b` |
| C | `kjv.docx`, copied from Arthur's file `C:\dev\bible\resources\kjv.docx` | 2,178,091 | `dce0fbe6cb2aae710d3260d7e3ad3ffc44c1e33b524255fbf864e7132d1c4547` |

- The SHA-256 of the edition C file is the same as that of the designer's file.
- The script found each number of the designer's check of edition C. No number differs. The numbers: 66 books, 1,189 chapters, 31,102 verses, 3,016 section headings, 1,325 cross-reference lines, 42 and 38 smaller headings, 6 headings in the middle of a verse, 229 headings with a Hebrew letter, 13,212 text paragraphs, 12,799 paragraphs that start where a Berean block starts, 21,530 groups in square brackets in 14,251 verses, and 22 verses of Psalm 119. Steps 5 and 11 give each of them.
- No paragraph of `word/document.xml` has a statement about rights. The script found the searched words in one heading and in four paragraphs of Bible text only. The other 10 parts of the file have none of the words copyright, public domain, licence, rights reserved, or "©".
- The folders: `a\usfm\`, `b\usfm\`, and `c\docx\` hold the unpacked files.

## Step 5. The content of each edition

### Books, chapters, and verses

| | Edition A | Edition B | Edition C |
|---|---|---|---|
| Books of the 66 | 66 | 66 | 66 |
| Chapters | 1,189 | 1,189 | 1,189 |
| Verses | 31,102 | 31,102 | 31,102 |
| Other books, not counted | none | 17: FRT Front Matter; INT The Translators to the Reader; TOB Tobit; JDT Judith; ESG The Rest of Esther; WIS Wisdom of Solomon; SIR Ecclesiasticus; BAR Baruch; S3Y Song of the Three Holy Children; SUS Susanna; BEL Bel and the Dragon; 1MA 1 Maccabees; 2MA 2 Maccabees; 1ES 1 Esdras; MAN Prayer of Manasses; 2ES 2 Esdras; OTH The Epistle Dedicatory | none |

- In each edition, the last chapter of each book agrees with `public/data/books.json`.
- Edition C names the book of Psalms "Psalm" in its chapter lines. Each other book name agrees with `books.json`.
- Edition C has the same 31,102 verses as edition A.

### USFM markers in the 66 books

Edition A: `\w` 313,813, `\w*` 313,813, `\+w` 35,495, `\+w*` 35,495, `\v` 31,102, `\add` 20,887, `\add*` 20,887, `\f` 6,959, `\f*` 6,959, `\fr` 6,959, `\ft` 6,959, `\nd` 6,876, `\nd*` 6,876, `\p` 4,635, `\q1` 2,461, `\wj` 2,038, `\wj*` 2,038, `\c` 1,189, `\+add` 623, `\+add*` 623, `\b` 209, `\d` 116, `\+nd` 81, `\+nd*` 81, `\h` 66, `\id` 66, `\mt1` 66, `\toc1` 66, `\toc2` 66, `\toc3` 66, `\s1` 36, `\tl` 22, `\tl*` 22, `\mt2` 2.

Edition B: `\v` 31,102, `\add` 28,405, `\add*` 28,405, `\q1` 19,074, `\sc` 6,940, `\sc*` 6,940, `\p` 2,763, `\c` 1,189, `\b` 731, `\d` 117, `\m` 101, `\h` 66, `\id` 66, `\mt1` 66, `\toc1` 66, `\toc2` 66, `\toc3` 66, `\nb` 53, `\mt2` 46, `\mt3` 25, `\qc` 22, `\+sc` 14, `\+sc*` 14, `\mi` 14.

- `\w` holds a word and its Strong's number. `\wj` marks the words of Jesus. `\nd` marks "LORD". `\sc` is small capitals. `\add` marks the words that the translators added.
- Edition A has 4,635 paragraph markers and 2,461 poetry lines. Edition B has 2,763 paragraph markers and 19,074 poetry lines.

### Section headings

Neither edition A nor edition B has section headings of the kind that the site shows. The script lists each heading marker:

- Edition A, `\s1`: 36 headings, each once. 22 are the letter headings of Psalm 119, from "א ALEPH." to "ת TAU.". 14 are the lines at the end of 14 letters of Paul and of Hebrews, for example "Written to the Romans from Corinthus, and sent by Phebe servant of the church at Cenchrea." at the end of Romans 16.
- Edition B, `\qc`: 22 headings, each once: the letter names of Psalm 119, from "ALEPH." to "TAU.".
- Psalm titles, `\d`: edition A has 116, with 69 different texts. Edition B has 117, with 70 different texts. The one more in edition B is "The end of the Acts of the Apostles." in Acts 28. The most frequent: "A Psalm of David." 17 times, "To the chief Musician, A Psalm of David." 13 times, "A Song of degrees." 10 times. This report does not list each title. The full list, with the count and the first place of each title, is only in the script output. The Psalm titles are words of the text, not section headings. Edition A and edition B put each title before verse 1. Edition C puts each title in the words of verse 1.
- Edition C: 3,016 section headings and 1,325 cross-reference lines. Step 11 compares them. Edition C also has 42 smaller headings, 5 headings with the style `suphdg` (from "BOOK I Psalms 1–41" to "BOOK V Psalms 107–150"), and 229 headings with the style `acrostic`: 119 in Psalms, 22 in Proverbs, 88 in Lamentations.

### Footnotes

- Edition A: 6,959 footnotes in 5,844 verses. Five examples, from the whole Bible:
  1. Genesis 1:4: "the light from…: Heb. between the light and between the darkness"
  2. 1 Samuel 1:20: "Samuel: that is, Asked of God"
  3. 2 Chronicles 12:12: "and also…: or, and yet in Judah there were good things"
  4. Psalm 82:5: "out…: Heb. moved"
  5. Jeremiah 25:10: "I will…: Heb. I will cause to perish from them"
- Edition B: no footnotes.
- Edition C: no footnotes. The file has no footnote part, `word/footnotes.xml`.

### The words that the translators added

- Edition A: the markers `\add` and `\+add`. 21,462 groups in 14,224 verses, in the verse text. The script does not count the groups in footnotes and in headings.
- Edition B: the marker `\add`. 28,364 groups in 17,324 verses.
- Edition C: square brackets, for example "[was]" in Genesis 1:2. 21,530 groups in 14,251 verses. In each verse, the number of "[" is the same as the number of "]".

### Other marks in the words

- Edition A has the paragraph sign "¶" in 2,970 verses. Edition B has it in 14 verses. Edition C has it in none.
- In Psalm 119, edition C starts 22 verses with the name of a Hebrew letter, for example "ALEPH." in verse 1 and "LAMED." in verse 89.
- Edition B starts 315 verses with a Hebrew letter in parentheses, for example "(ש)" in Psalm 25:20. By chapter: Psalm 9 10, Psalm 10 5, Psalm 25 21, Psalm 34 22, Psalm 37 20, Psalm 111 9, Psalm 112 9, Psalm 119 176, Psalm 145 21, Proverbs 31 22. Edition A has none.

### Five verses

The plain words: the script removes the USFM markers, the Strong's numbers, the footnotes, the published verse numbers, and the sign "¶". For edition C, it removes the square brackets and keeps the words in them. It changes nothing else.

Genesis 1:1
- A, file: `In the \w beginning|strong="H7225"\w* \w God|strong="H0430"\w* \w created|strong="H1254"\w* the \w heaven|strong="H8064"\w* \w and|strong="H0853"\w* the \w earth|strong="H0776"\w*.`
- B, file: `\sc In\sc* the beginning God created the heaven and the earth.`
- C, file: `In the beginning God created the heaven and the earth.`
- Plain words, the same in A, B, and C: In the beginning God created the heaven and the earth.

Genesis 1:2
- A, file: `And the \w earth|strong="H0776"\w* \w was|strong="H1961"\w* without \w form|strong="H8414"\w*, and \w void|strong="H0922"\w*; and \w darkness|strong="H2822"\w* \add was\add* upon the \w face|strong="H6440"\w* of the \w deep|strong="H8415"\w*. And the \w Spirit|strong="H7307"\w* of \w God|strong="H0430"\w* \w moved|strong="H7363"\w* \w upon|strong="H5921"\w* the \w face|strong="H6440"\w* of the \w waters|strong="H4325"\w*.`
- B, file: `And the earth was without form, and void; and darkness \add was\add* upon the face of the deep. And the Spirit of God moved upon the face of the waters.`
- C, file: `And the earth was without form, and void; and darkness [was] upon the face of the deep. And the Spirit of God moved upon the face of the waters.`
- Plain words, the same in A, B, and C: And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.

Psalm 23:1
- A, file: `The \nd \+w LORD|strong="H3068"\+w*\nd* \add is\add* my \w shepherd|strong="H7462"\w*; I shall not \w want|strong="H2637"\w*.` The title "A Psalm of David." is a `\d` line before the verse.
- B, file: `The \sc Lord\sc* \add is\add* my shepherd; I shall not want.` The title is a `\d` line before the verse.
- C, file: `A Psalm of David. The LORD [is] my shepherd; I shall not want.` The section heading "The LORD Is My Shepherd" is before the verse.
- Plain words: A "The LORD is my shepherd; I shall not want." B "The Lord is my shepherd; I shall not want." C "A Psalm of David. The LORD is my shepherd; I shall not want."

Matthew 5:3
- A, file: `\wj  \+w Blessed|strong="G3107"\+w* \+add are\+add* \+w the poor|strong="G4434"\+w* \+w in spirit|strong="G4151"\+w*: \+w for|strong="G3754"\+w* \+w theirs|strong="G0846"\+w* \+w is|strong="G2076"\+w* \+w the kingdom|strong="G0932"\+w* \+w of heaven|strong="G3772"\+w*.\wj*`
- B, file: `Blessed \add are\add* the poor in spirit: for theirs is the kingdom of heaven.`
- C, file: `Blessed [are] the poor in spirit: for theirs is the kingdom of heaven.`
- Plain words, the same in A, B, and C: Blessed are the poor in spirit: for theirs is the kingdom of heaven.

3 John 1:14, the last verse of 3 John in each edition
- A, file: `\w But|strong="G1161"\w* I \w trust|strong="G1679"\w* I \w shall|strong="G1492"\w* \w shortly|strong="G2112"\w* \w see|strong="G1492"\w* \w thee|strong="G4571"\w*, \w and|strong="G2532"\w* we shall \w speak|strong="G2980"\w* \w face|strong="G4750"\w* \w to|strong="G4314"\w* \w face|strong="G4750"\w*. \w Peace|strong="G1515"\w* \add be\add* to \w thee|strong="G4671"\w*. \add Our\add* \w friends|strong="G5384"\w* \w salute|strong="G0782"\w* \w thee|strong="G4571"\w*. \w Greet|strong="G0782"\w* the \w friends|strong="G5384"\w* \w by|strong="G2596"\w* \w name|strong="G3686"\w*.`
- B, file: `but I trust \add I\add* shall shortly see thee, and we shall speak face to face. Peace \add be\add* to thee. \add Our\add* friends salute thee. Greet the friends by name.`
- C, file: `But I trust I shall shortly see thee, and we shall speak face to face. Peace [be] to thee. [Our] friends salute thee. Greet the friends by name.`
- Plain words: A and C "But I trust I shall shortly see thee, and we shall speak face to face. Peace be to thee. Our friends salute thee. Greet the friends by name." B is the same with "but" in place of "But".

## Step 6. The words of the editions compared

The script compares the plain words of each verse, letter by letter. It sorts each difference into one of three kinds: letter case only; punctuation only, or punctuation and letter case; the letters of the words. A hyphen counts as punctuation, so "Beth-lehem" against "Bethlehem" is a difference in punctuation.

Square brackets of edition C: the script removes the two brackets and keeps the words in them. "[was]" becomes "was". In edition A, the script keeps the words of `\add` and removes the markers. So an added word is in the plain words of each edition, with no mark.

| | A and B | A and C |
|---|---|---|
| Verses in both | 31,102 | 31,102 |
| Verses whose plain words differ | 16,106 | 1,141 |
| Letter case only | 13,108 | 116 |
| Punctuation only, or punctuation and letter case | 1,011 | 655 |
| The letters of the words | 1,987 | 370 |

### Edition A and edition B

Most differences are letter case: 13,108 verses. In the examples below, edition B starts a poetry line with a capital letter, and starts a verse with a small letter where the sentence goes on from the verse before. In the examples, edition B writes "Lord" where edition A writes "LORD", and "Lord God" where edition A writes "Lord GOD". I did not count these causes.

Ten examples, spaced evenly through all 16,106 differences:

| Verse | Edition A | Edition B |
|---|---|---|
| Genesis 1:15 | And let them be for lights in the firmament of the heaven to give light upon the earth: and it was so. | and let them be for lights in the firmament of the heaven to give light upon the earth: and it was so. |
| Numbers 7:23 | And for a sacrifice of peace offerings, two oxen, … | and for a sacrifice of peace offerings, two oxen, … |
| Judges 5:19 | The kings came and fought, then fought the kings of Canaan in Taanach by the waters of Megiddo; they took no gain of money. | The kings came and fought, Then fought the kings of Canaan In Taanach by the waters of Megiddo; They took no gain of money. |
| 1 Chronicles 15:5 | Of the sons of Kohath; Uriel the chief, and his brethren an hundred and twenty: | of the sons of Kohath; Uriel the chief, and his brethren an hundred and twenty: |
| Job 33:15 | In a dream, in a vision of the night, when deep sleep falleth upon men, in slumberings upon the bed; | In a dream, in a vision of the night, When deep sleep falleth upon men, In slumberings upon the bed; |
| Psalm 89:37 | It shall be established for ever as the moon, and as a faithful witness in heaven. Selah. | It shall be established for ever as the moon, And as a faithful witness in heaven. Selah. |
| Proverbs 21:23 | Whoso keepeth his mouth and his tongue keepeth his soul from troubles. | Whoso keepeth his mouth and his tongue Keepeth his soul from troubles. |
| Isaiah 65:6 | … I will not keep silence, but will recompense, even recompense into their bosom, | … I will not keep silence, but will recompense, Even recompense into their bosom, |
| Ezekiel 38:17 | Thus saith the Lord GOD; … which prophesied in those days many years that I would bring thee against them? | Thus saith the Lord God; … which prophesied in those days many years, that I would bring thee against them? |
| Luke 6:23 | … and leap for joy: for, behold, your reward is great in heaven: … | … and leap for joy: for behold, your reward is great in heaven: … |

Ten examples, spaced evenly through the 1,987 differences in the letters of the words:

| Verse | Edition A | Edition B |
|---|---|---|
| Genesis 2:18 | … I will make him an help meet for him. | … I will make him a help meet for him. |
| Numbers 15:9 | … mingled with half an hin of oil. | … mingled with half a hin of oil. |
| 1 Samuel 18:1 | … when he had made an end of speaking unto Saul, … | … when he made an end of speaking unto Saul, … |
| 1 Chronicles 22:7 | … it was in my mind to build an house unto the name of the LORD my God: | … it was in my mind to build a house unto the name of the Lord my God: |
| Psalm 25:20 | O keep my soul, and deliver me: let me not be ashamed; for I put my trust in thee. | (ש) O keep my soul, and deliver me: Let me not be ashamed; for I put my trust in thee. |
| Psalm 119:82 | Mine eyes fail for thy word, saying, When wilt thou comfort me? | (כ) Mine eyes fail for thy word, Saying, When wilt thou comfort me? |
| Isaiah 9:7 | … and to establish it with judgment … | … To order it, and to stablish it with judgment … |
| Ezekiel 23:34 | … and thou shalt break the sherds thereof, … | … and thou shalt break the sheards thereof, … |
| Mark 7:24 | … and entered into an house, … | … and entered into a house, … |
| Acts 28:8 | … sick of a fever and of a bloody flux: … | … sick of a fever and of a bloody flixe: … |

### Edition A and edition C

Ten examples, spaced evenly through all 1,141 differences:

| Verse | Edition A | Edition C |
|---|---|---|
| Genesis 4:22 | … Tubal-cain, … the sister of Tubal-cain was Naamah. | … Tubalcain, … the sister of Tubalcain was Naamah. |
| Deuteronomy 1:2 | … unto Kadesh-barnea.) | … unto Kadeshbarnea.) |
| Joshua 21:25 | … and Gath-rimmon with her suburbs; two cities. | … and Gathrimmon with her suburbs; two cities. |
| 1 Samuel 20:28 | … to go to Beth-lehem: | … to go to Bethlehem: |
| 1 Kings 20:9 | … unto the messengers of Ben-hadad, … | … unto the messengers of Benhadad, … |
| 1 Chronicles 10:11 | And when all Jabesh-gilead heard … | And when all Jabeshgilead heard … |
| Nehemiah 11:5 | … the son of Col-hozeh, … | … the son of Colhozeh, … |
| Psalm 116:19 | In the courts of the LORD’s house, … | In the courts of the LORD’S house, … |
| Jeremiah 41:17 | … which is by Beth-lehem, … | … which is by Bethlehem, … |
| Mark 3:7 | … and from Judæa, | … and from Judaea, |

The 370 verses with a difference in the letters of the words, by cause:

- 116: edition C has the Psalm title in verse 1. Edition A has it as a `\d` line before verse 1.
- 22: edition C starts the verse with the name of a Hebrew letter, in Psalm 119.
- 86: only "æ" or "œ" against "ae" or "oe", for example "Judæa" and "Judaea".
- 146: other differences. Each is listed below, as a word change and the number of verses with that change.

| Verses | Edition A | Edition C | First verse |
|---|---|---|---|
| 47 | enquire | inquire | Genesis 24:57 |
| 31 | enquired | inquired | Deuteronomy 17:4 |
| 20 | counsellors | counsellers | 2 Chronicles 22:4 |
| 14 | counsellor | counseller | 2 Samuel 15:12 |
| 7 | razor | rasor | Numbers 6:5 |
| 5 | can not | cannot | Acts 4:16 |
| 3 | where unto | whereunto | 1 Timothy 2:7 |
| 2 | expenses | expences | Ezra 6:4 |
| 2 | enquiry | inquiry | Proverbs 20:25 |
| 2 | enquire, enquired | inquire, inquired | Ezekiel 20:3 |
| 2 | what soever | whatsoever | Colossians 3:17 |
| 2 | where in | wherein | 2 Timothy 2:9 |
| 1 | Abidah | Abida | Genesis 25:4 |
| 1 | (no word) | and | Exodus 23:23 |
| 1 | Gaba | Geba | Ezra 2:26 |
| 1 | counsellors, enquire | counsellers, inquire | Ezra 7:14 |
| 1 | enquirest | inquirest | Job 10:6 |
| 1 | ankles | ancles | Ezekiel 47:3 |
| 1 | ankle | ancle | Acts 3:7 |
| 1 | instructers | instructors | 1 Corinthians 4:15 |
| 1 | not can | cannot | 2 Timothy 2:13 |

- Exodus 23:23: edition C has "the Canaanites, [and] the Hivites". Edition A and edition B have "the Canaanites, the Hivites", with no "and".

Ten examples, spaced evenly through the 146 other differences: Genesis 24:57, Judges 16:17, 2 Samuel 5:19, 2 Kings 8:8, 2 Chronicles 18:6, Job 3:14, Isaiah 1:26, Ezekiel 20:31, Matthew 2:16, Acts 23:20. Each is one of the word changes of the table: "enquire" or "enquired" against "inquire" or "inquired", "razor" against "rasor", and "counsellors" against "counsellers".

Not checked: the words of edition C against a printed edition. The comparison with edition A shows only where A and C differ. It does not show which of the two is correct.

## Step 7. The verses of edition A and the Berean text

- The verses of edition A that have no line in `sources/bsb/bsb.txt`: none.
- The verses of `sources/bsb/bsb.txt` that edition A does not have: none.
- The verses that have no words in `sources/bsb/bsb.txt`: 16. Edition A has words for each of them:

| Verse | Words in edition A |
|---|---|
| Matthew 17:21 | Howbeit this kind goeth not out but by prayer and fasting. |
| Matthew 18:11 | For the Son of man is come to save that which was lost. |
| Matthew 23:14 | Woe unto you, scribes and Pharisees, hypocrites! … |
| Mark 7:16 | If any man have ears to hear, let him hear. |
| Mark 9:44 | Where their worm dieth not, and the fire is not quenched. |
| Mark 9:46 | Where their worm dieth not, and the fire is not quenched. |
| Mark 11:26 | But if ye do not forgive, … |
| Mark 15:28 | And the scripture was fulfilled, … |
| Luke 17:36 | Two men shall be in the field; … |
| Luke 23:17 | (For of necessity he must release one unto them at the feast.) |
| John 5:4 | For an angel went down at a certain season into the pool, … |
| Acts 8:37 | And Philip said, If thou believest with all thine heart, thou mayest. … |
| Acts 15:34 | Notwithstanding it pleased Silas to abide there still. |
| Acts 24:7 | But the chief captain Lysias came upon us, … |
| Acts 28:29 | And when he had said these words, the Jews departed, … |
| Romans 16:24 | The grace of our Lord Jesus Christ be with you all. Amen. |

- The site data has a note at the place of each of the 16 verses: 16 notes in `public/data/text/*.json`.
- Edition C has the same verse numbers as edition A. Edition A and edition C have no verse without words. So edition C also has words for each of the 16 verses.

## Step 8. The link passages and the verses of edition A

- `public/data/links/*.json` has 3,866 links. Each link is in the file of each of its two books. The script counts each link once.
- 7,732 passages. The first verse and the last verse of each passage are in edition A. No passage needs a change for the King James Version.

## Step 9. The reason lines of the quotation links

- 523 links have the type `quotation`. Each has a reason line.
- 523 reason lines have words between quotation marks. The task states that these words are from the Berean Standard Bible. The script did not compare them with the Berean text.
- Five examples, spaced evenly:
  1. q10: Hebrews repeats that on the seventh day “God rested from all His works”; Genesis tells how God finished and rested from “all His work.”
  2. q157: Mark repeats “Love your neighbor as yourself”; Leviticus has the same words, and ends “I am the LORD.”
  3. q287: Ephesians repeats “Be angry, yet do not sin”; the same words stand in Psalms.
  4. q423: Acts says Jesus is the stone “you builders rejected”, using the words of Psalms about the stone that “has become the cornerstone”.
  5. q587: Mark repeats Isaiah’s words “My house will be called a house of prayer” and “for all the nations.”

I changed no reason line.

## Step 10. Where the structure of the Berean files cuts a verse

### Headings

| Style | Heading blocks | In the middle of a verse |
|---|---|---|
| s1 | 3,016 | 0 |
| s2 | 80 | 6 |
| ms | 5 | 0 |
| d | 5 | 0 |
| qa | 44 | 0 |

The six headings in the middle of a verse are speaker headings of the Song of Solomon:

1. s2 "The Friends" in Song of Solomon 1:4
2. s2 "The Bride" in Song of Solomon 1:4
3. s2 "The Friends" in Song of Solomon 5:1
4. s2 "The Bridegroom" in Song of Solomon 6:13
5. s2 "The Bride" in Song of Solomon 7:9
6. s2 "The Bride" in Song of Solomon 8:5

### Text blocks

| Style | Text blocks | Start in the middle of a verse |
|---|---|---|
| q2 | 12,549 | 12,501 |
| p | 12,274 | 1,089 |
| q1 | 11,563 | 3,994 |
| li1 | 1,343 | 461 |
| pmo | 233 | 73 |
| qr | 223 | 223 |
| li2 | 194 | 143 |
| d | 117 | 0 |
| pc | 11 | 11 |
| qd | 1 | 1 |

### Verses with words in more than one text block

The site data has 31,086 verses with words. The script puts a verse in the poetry group when one of its blocks has a poetry style: q1, q2, qr, or qd. The paragraph styles are p, pmo, li1, pc, li2, and d.

| Verses with words in more than one text block | Verses | Part of all verses |
|---|---|---|
| All | 9,649 | 31.0 % |
| Only in paragraph styles | 1,496 | 4.8 % |
| Only in poetry styles | 7,573 | 24.4 % |
| In a paragraph style and a poetry style | 580 | 1.9 % |

For each of these 9,649 verses, the words of the King James Version have no place where the build script can cut them as the Berean files cut the Berean words.

## Step 11. Edition C and the site data: headings and cross-reference lines

The script reads `word/document.xml` of edition C by the designer's description of its structure:

- A chapter starts with a paragraph with no style and the text of the book name and the chapter number. The next paragraph starts with "KJV".
- The paragraph styles `hdg`, `subhdg`, `suphdg`, and `acrostic` are headings. A cross-reference line comes after a line break, in runs with the style `cross1`.
- The paragraph style `reg` is a text paragraph. A run with the style `reftext1` is a verse number, and a run with the style `thinv1` after it is a narrow space.

The results of the script with this description:

- 66 books, 1,189 chapters, and 31,102 verses, as in edition A.
- 13,212 text paragraphs: 13,127 with the style `reg` and 85 with no style.
- No text paragraph starts in the middle of a verse. No text paragraph is without a verse number. No text after the first chapter line is outside a verse.

The script compares `s1` of the site data with `hdg` of edition C, and `s2` with `subhdg`. The place of a heading is the verse that comes after it.

| | Site data | Edition C |
|---|---|---|
| Main section headings | 3,016 (s1) | 3,016 (hdg) |
| Smaller headings | 80 (s2) | 42 (subhdg) |
| Cross-reference lines | 1,325 | 1,325 |

### Main section headings

- The same words before the same verse: 3,012.
- In one of the two and not in the other: 0.
- Before a different verse: 0.
- Different words before the same verse: 4.

| Place | Site data | Edition C |
|---|---|---|
| Numbers 5:5 | Confession and Restitution | Restitution for Trespasses |
| 2 Kings 7:3 | The Arameans Flee | The Syrians Flee |
| Psalm 77:1 | In the Day of Trouble I Sought the Lord | In the Day of Trouble I Sought the LORD |
| Ecclesiastes 5:1 | Approaching God with Fear | Approaching God with Awe |

### Smaller headings

- The same words before the same verse: 42. Each smaller heading of edition C is in the site data.
- Before a different verse: 0. Different words: 0.
- In the site data and not in edition C: 38. One is "Saying 20" before Proverbs 24:1. The other 37 are the speaker headings of the Song of Solomon, "The Bride", "The Bridegroom", and "The Friends". The script output lists each.
- In edition C and not in the site data: 0.

### Other headings

The script does not compare these headings one by one:

- Site data: 5 `ms` headings, from "BOOK I" to "BOOK V", and 5 `d` headings, from "Psalms 1–41" to "Psalms 107–150", before the same verses. Edition C has 5 `suphdg` headings at the same five verses, each with the two texts in one heading, for example "BOOK I Psalms 1–41".
- Site data: 44 `qa` headings, all in Psalm 119, for example "א" and "SAMEKH". Edition C: 229 `acrostic` headings, in Psalms, Proverbs, and Lamentations, for example "א ALEPH." before Psalm 119:1 and "ב" before Psalm 25:2.

### Cross-reference lines

- Each of the 1,325 cross-reference lines is before the same verse in the two.
- The words of each line are the same in the two.

### The headings of step 10 that are in the middle of a verse

Edition C has none of the six. For each, the script found no heading with the same words in the same chapter of edition C.

### Where edition C starts a new paragraph

Edition C starts a paragraph only at the start of a verse. It starts paragraphs at headings and at other verses:

- 13,212 text paragraphs. Each starts at a verse. None starts in the middle of a verse.
- 8,562 paragraphs have one verse. 4,650 have more than one verse.
- 3,277 paragraphs start after a heading. 9,935 start at a verse with no heading before it.
- 1,189 paragraphs start at verse 1 of a chapter.
- 12,799 paragraphs start at a verse where a paragraph or a poetry line of the site data starts.
- Five of the 413 other paragraphs: Genesis 2:23, Judges 3:15, Isaiah 6:3, Matthew 4:24, John 15:13.
- Edition C has no poetry lines. Its text paragraphs have the style `reg` or no style.

## Proposals

These proposals give options and costs. Arthur decides.

### 1. The edition, and the file from which the build script takes the words, the headings, and the cross-reference lines

Arthur's decision of 2026-11-15 already says that the headings and the cross-reference lines are those of the Berean files in the repository. So the build script can take them from `sources/bsb/usfm/`, as now, for each option. The options below are for the words.

| Option | Cost |
|---|---|
| (a) Edition A, the USFM files of eBible.org. | The pages state "Public Domain". The build script must remove the Strong's numbers and 6,959 footnotes, and must decide what to do with the sign "¶" in 2,970 verses. The Psalm titles are separate lines before verse 1, so the build script must put them where the Berean data has its Psalm titles. |
| (b) Edition C, the `.docx` file of OpenBible.com. | No licence statement in the file and none on its downloads page. The terms page gives a free licence and claims no copyright over the King James Version text, but gives no guarantee. The site would need a new download for each update, and each download accepts the terms. The words differ from edition A in 1,141 verses, mostly spelling and hyphens. The brackets of the added words need a rule. The Psalm titles are in verse 1, and 22 verses of Psalm 119 start with a letter name. The script `scripts/kjv-report.mjs` already reads the file. |
| (c) Edition B, the Cambridge Paragraph Bible of eBible.org. | The pages state "Public Domain". The words differ from edition A in 16,106 verses, 1,987 of them in letters, because edition B has its own spelling and its own poetry lines. The build script must skip 17 other files. It has no footnotes. |

For each option, the site needs a test that compares each verse with the source file, as `src/data/text.test.ts` does for the Berean text.

### 2. The paragraphs and the poetry lines of the King James Version pages, where the Berean files cut a verse

9,649 verses, 31.0 % of all verses, have words in more than one text block of the Berean data. 7,573 of them are only in poetry blocks.

| Option | Cost |
|---|---|
| (a) Keep the text blocks of the Berean data. Put the words of a cut verse whole into the first block of that verse. The next blocks of that verse lose its words. | Simple rule. The poetry pages change most: a block that starts in the middle of a verse has no words, so many poetry lines go away, and the indent of q2 lines is lost for those verses. |
| (b) Use the paragraphs of edition C. | No verse is cut. 12,799 of 13,212 paragraphs start where a Berean block starts. Edition C has no poetry lines, so the Psalms and the prophets are paragraphs, often one verse each. The King James Version pages look different from the Berean pages. |
| (c) Use the paragraphs and the poetry lines of edition B. | Edition B has 19,074 poetry lines of its own, cut in the words of the King James Version. A second source for the structure. The headings of the Berean data stay at the start of a verse, except the six of step 10. |
| (d) Cut the words of the King James Version by hand at a place near each Berean cut. | A decision for each of 9,649 verses. Each decision needs a check. The highest cost. |

For each option, the six speaker headings in the middle of a verse need a rule: put each at the start of its verse, or leave it out. Edition C does not have them.

### 3. The pop-up and a reason line with words of the Berean Standard Bible

523 quotation links have reason lines with Berean words between quotation marks.

| Option | Cost |
|---|---|
| (a) Show the reason line unchanged on the King James Version pages. | No new text. The words between quotation marks differ from the King James Version words in the pop-up above them. A short label can say that the reason line quotes the Berean Standard Bible. |
| (b) Do not show the reason line on the King James Version pages. | A small change to `src/book/LinkPopup.tsx`. The reader of the King James Version does not see why the link is a quotation link. |
| (c) Write a second reason line for each of the 523 links, with the words of the King James Version. | 523 new lines. Each needs the source rule of `docs/CONTENT-SOURCES.md`, a run of the accuracy reviewer, and Arthur's approval. |

### 4. The footnotes of the King James Version

Only edition A has footnotes: 6,959 in 5,844 verses. Editions B and C have none. The site shows only the manuscript notes of the Berean files now.

| Option | Cost |
|---|---|
| (a) Show no footnote of the King James Version. | No cost. The pages show no translators' notes. |
| (b) Show the footnotes of edition A. | Possible only with option 1(a). A new kind of note on the reading page, with a design decision and a test. About one note in five verses. |
| (c) Show the two passage notes of the Berean files, Mark 16:8 and John 7:52, on the King James Version pages also. | A decision on the words, because the notes were written for the Berean text. |

In each option, the 16 notes for verses that the main Berean text does not have do not apply on the King James Version pages: the King James Version has words for each of those verses.
