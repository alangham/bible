# Data sources

This file records each data source of the site, its licence, and the result of each check. Task 1 created this file on 2026-11-13.

Do not add a data source until you read its licence and add it here.

---

## 1. ESV API (Crossway)

Not used in version 1. Decision by Arthur on 2026-11-13.

- Use: none. Before the decision above, the plan was to fetch the preferred translation at read time in Task 6.
- Address: `https://api.esv.org/v3/passage/html/`
- Terms: `https://api.esv.org/`, section "What are the conditions of use for the text?". Read on 2026-11-13.
- Licence: Crossway terms of use. Not an open licence. Non-commercial use only.

### Conditions that affect the site

Quoted or summarised from the terms page on 2026-11-13:

1. Non-commercial use only. No charge for access, no ads, no sponsorship, no donation requests.
2. One query: a maximum of 500 verses or half of a book, whichever is less. Books of one or two chapters are an exception.
3. Rate limits: 5,000 queries in one day, 1,000 in one hour, 60 in one minute.
4. Storage: "You may not locally store more than 500 verses or one-half of any book of the Bible (whichever is less)."
5. Display: "You may not display more than 500 verses or one-half of any book (whichever is less) on any page."
6. Each page that shows ESV text must show the copyright notice that the API sends, and a link to `www.esv.org`.
7. Do not change the words of the text.
8. "You may not sell, share, or publish your access key."

### Differences from `docs/DESIGN.md`

These are findings. Arthur must decide on them. They do not change the design.

1. Condition 8 conflicts with DESIGN.md section 5: "The ESV API key is in the client bundle." A key in a public GitHub Pages bundle is readable by each visitor.
2. Conditions 4 and 5 have a "one-half of any book" limit. DESIGN.md section 5 gives only the 500-verse limit. For a short book, one chapter can be more than half the book. Example: Obadiah has one chapter.

### Check (Task 1 step 7)

- Date: 2026-11-13.
- Method: a module on the Vite dev server at `http://localhost:5173` read `VITE_ESV_API_KEY` from `.env`. It sent `fetch('https://api.esv.org/v3/passage/html/?q=John+1:1')` with the header `Authorization: Token <key>`. I ran the module from the browser pane of the Claude desktop app. I deleted the module after the check.
- Result: PASS. The browser gave the page the response. Status 200. `canonical` was `John 1:1`. One passage, 515 characters of HTML.
- Limit: the page script cannot read the `Access-Control-Allow-Origin` header, because the API does not expose it. The browser gave the body to the script, so the cross-origin check passed. I did not test from a GitHub Pages origin.
- I did not write the ESV response to a file.

---

## 2. Berean Standard Bible (BSB)

- Use: the bundled translation. Task 5.
- Text download: `https://bereanbible.com/bsb.txt`. Other formats on `https://berean.bible/downloads.htm`: USFM, USX, USJ, xlsx, docx.
- Licence pages: `https://berean.bible/licensing.htm` and `https://berean.bible/terms.htm`. Read on 2026-11-13.
- Licence: public domain. The licensing page states: "The Berean Bible and Majority Bible texts are officially placed into the public domain as of April 30, 2023." The terms page links the dedication to CC0 1.0.

### Conditions

1. "Licensing is not required for any use." Attribution is appreciated. Attribution is not required.
2. Name use: a work that keeps the verbatim text may use the Berean name. A work that changes the text must not use the Berean name. The site does not change the text, so the site may say "Berean Standard Bible".

### Check (Task 1 step 8)

- Result: PASS. The full text can be committed to a public repository. The licence permits all uses.
- Limit: I did not download `bsb.txt` in Task 1. I did not check the file format. Task 5 does this.

### Use in Task 2: chapter counts in `public/data/books.json`

- Date: 2026-11-13. I downloaded `https://bereanbible.com/bsb.txt` to a temporary folder. I did not commit the file.
- Format: UTF-8 with a byte order mark, CRLF line ends. Three header lines, then one verse on each line: `<Book> <chapter>:<verse>`, a tab, the verse text.
- Method: a script took the highest chapter number of each book. Result: 66 books, 1,189 chapters.
- The text file names the book of Psalms "Psalm" in each verse reference. `books.json` uses the name "Psalms" and the id `psalms`, as in mockup D1.
- The groups, stack numbers, and positions in `books.json` come from `docs/DESIGN.md` sections 2 and 4.1. They are not from the BSB.

### Use in Task 5: the bundled text in `public/data/text/`

- Text file: `sources/bsb/bsb.txt`, the file of 2026-11-13 from `https://bereanbible.com/bsb.txt`. 4,331,393 bytes. SHA-256 `2ac3af1de52d4e68261cba91d85c320b7eadc6560e830d99e591767b8ff5ca96`. Committed in Task 5.
- USFM download: `https://bereanbible.com/bsb_usfm.zip`, linked as "Berean Standard Bible - USFM" on `https://berean.bible/downloads.htm`. Downloaded on 2026-11-14. 1,598,038 bytes. SHA-256 `f0c56438eb89c98e8f62c5c00461e25cc35b098ad5b179bc350cede759ee5f87`.
- The zip file holds 66 USFM files, one for each book, dated 2026-03-08. Each starts `\id <code> Autogenerated BSB by bsb2usfm`. They are committed in `sources/bsb/usfm/`. The zip file is not committed.
- What the site takes from each file:
  - `bsb.txt`: the words of each verse. The USFM words have faults, for example "vvv" in Genesis 35:18 and `[’’]` after 59 verses, so the site takes no word from the USFM files.
  - USFM: the section headings, the paragraphs, the poetry lines, the blank lines between stanzas, the 18 manuscript notes of `docs/DESIGN.md` section 4.3, and the 1,325 cross-reference lines.
- Script: `scripts/build-text.mjs` makes one JSON file for each book. The unit test `src/data/text.test.ts` checks that the words of each of the 31,086 verses are the same as in `bsb.txt`.

### Check (Task 5 step 2): does the public-domain statement cover the USFM files?

- Pages read on 2026-11-14: `https://berean.bible/licensing.htm`, `https://berean.bible/terms.htm`, and `https://berean.bible/downloads.htm`.
- The licensing page states: "The Berean Bible and Majority Bible texts are officially placed into the public domain as of April 30, 2023." It also states: "Licensing is not required for any use."
- The terms page states that the texts are "dedicated to the public domain", with a link to CC0 1.0, and that "All uses are freely permitted." It also says that publishers may "produce and sell the full Berean Bible in any print format."
- The downloads page lists the USFM file as a format of the "Berean Standard Bible", beside the text file, Word, USX, and USJ. No page names a separate licence for a format, a heading, a footnote, or a cross-reference line. The USFM files hold no licence line.
- Result: PASS. The statement covers the Berean Standard Bible, and the publisher offers the USFM file as that Bible, with its headings and footnotes.
- Limit: no page names headings, footnotes, or cross-reference lines one by one. The result rests on the publisher's label of the file and the words "the full Berean Bible" and "any use".

---

## 3. OpenBible.info cross-references

- Use: source for echo links. Task 7.
- Page: `https://www.openbible.info/labs/cross-references/`. Read on 2026-11-13.
- Download: `https://a.openbible.info/data/cross-references.zip`. About 2 MB.
- Licence: Creative Commons Attribution 4.0 (CC BY 4.0). The page states: "Unless otherwise indicated, all content is licensed under a Creative Commons Attribution License." The link goes to `http://creativecommons.org/licenses/by/4.0/`.
- Content: about 340,000 cross-references. The page says that most of the data comes from the Treasury of Scripture Knowledge, which is public domain. The data has votes.

### Conditions

1. Attribution is required. The site must credit OpenBible.info and link to the licence. Put the credit on the site, for example on an "About" or "Sources" page.
   - Task 6: the "Sources" page credits OpenBible.info with a link to its page and to the CC BY 4.0 licence. Task 7 adds a statement of any change to the data, if it changes the data (CC BY 4.0 section 3(a)(1)(B)).

### Check (Task 1 step 9)

- Result: PASS. The licence permits use and redistribution with attribution.
- Limit: I did not download the zip file. I did not check the file format or the meaning of the votes. Task 7 does this.
- Limit: the data does not separate quotations from echoes. All links from this source are echo links unless a quotation source confirms them.

### Use in Task 7: echo links and read-with lists

- Download: `https://a.openbible.info/data/cross-references.zip`, on 2026-11-14. 1,984,024 bytes. SHA-256 `d31c71a7b124227769a0bc8a24f048f53b327294e47033e64b5d2ae4aaf12b87`. The zip file is not committed.
- The zip file holds one file, `cross_references.txt`, with the header line "From Verse, To Verse, Votes, #www.openbible.info CC-BY 2026-11-09". It is committed as `sources/openbible/cross_references.txt`: 8,303,274 bytes, SHA-256 `3916a74371a83fb1d461574a970e631957c84879f695c7e67951d078b6ecc315`, 344,799 rows.
- Strength: each row has a vote count, from −86 to 1,318.
- The site counts a row and its reverse as one link, with the higher votes. It leaves out 64 rows: 18 that cross two books, 1 with a verse that the Bible text does not have (3 John 1:15), and 45 that link a verse to a passage that starts at the same verse. 301,528 links remain.
- Marks: the limit that Arthur approved on 2026-11-14 (docs/DESIGN.md section 4.5) keeps 2,076 echo links. Links that another source gives for the same pair are not counted twice.
- Read-with lists: the sum of the votes between two chapters, by the rule in docs/DESIGN.md section 4.5.
- Changes to the data, for the CC BY 4.0 credit: the site uses a part of the links, and adds their votes between chapters. The "Sources" page says so.
- Script: `scripts/build-links.mjs`.

---

## 4. Bible Quotation Database (Luke Plant)

- Use: source for quotation links. Task 7.
- Page: `https://lukeplant.me.uk/bible-quotation-database/`.
- Repository: `https://github.com/spookylukey/bible-quotation-database`. Licence file: `LICENSE.txt`. Read on 2026-11-13.
- Download: `quotations_range.csv`, `quotations_single.csv`, JSON forms of the two, and `quotations.db`. All are in the repository root.
- Licence: public domain. `LICENSE.txt` states that the code is placed into the public domain. It states that the database is a non-creative work, and that "the database is also placed into the public domain."
- Content: New Testament passages that quote the Old Testament. `quotations_range.csv` has 1,046 rows. Two sources: `bible-researcher.com/quote02.html` (about 719 pairs) and `kalvesmaki.com/LXX/NTChart.htm` (about 327 pairs as ranges).

### Check (Task 1 step 9)

- Result: PASS. The licence permits all uses.
- Limit: the licence is the claim of the database author. I did not read the terms of the two upstream web pages. The database author states that the list of references is not a creative work.
- Use in Task 7: `quotations_range.csv` from `https://raw.githubusercontent.com/spookylukey/bible-quotation-database/refs/heads/main/quotations_range.csv`, downloaded on 2026-11-13 in Task 1. 48,175 bytes. SHA-256 `5a96d76a9ec85961acd2d6ea251d45eb4884d9e6da87441a551060012f6dddc0`. Committed as `sources/quotations/quotations_range.csv`. The 1,046 rows give 782 quotation links, because the two upstream lists give some pairs twice.
- Hebrews 9: the file has three rows. Hebrews 9:20 quotes Exodus 24:8. Hebrews 9:19 quotes Exodus 24:8. Hebrews 9:28 quotes Isaiah 53:12. The file has no row for Leviticus 16 or Numbers 19. DESIGN.md section 4.5 names these two passages for Hebrews 9. With this source, those two passages are echo links, not quotation links.

---

## 5. Sources that I read and did not choose

1. Open Bible Data, Freely-Given.org (`https://freely-given.org/OBD/`). It shows the Tyndale Open Bible Dictionary article on quotations as HTML pages. I found no data file and no named licence for the data.
2. STEPBible Data (`https://github.com/STEPBible/STEPBible-Data`). Licence CC BY 4.0 for the repository. I found no file that lists New Testament quotations of the Old Testament.

---

## 6. Fonts

The site uses two fonts, Inter and Lora. Section 7.3 of `docs/DESIGN.md` names them. The site bundles them from npm. It does not load them from Google Fonts.

| Font | Package | Licence | Licence file |
|---|---|---|---|
| Inter, weights 300, 400, 500, 600, 700, and 800, for the redesign (Task 11) | `@fontsource/inter` 5.3.0 | SIL Open Font License 1.1 | `node_modules/@fontsource/inter/LICENSE` |
| Lora, weight 400, regular and italic, for the Bible text of the redesign (Task 11) | `@fontsource/lora` 5.3.0 | SIL Open Font License 1.1 | `node_modules/@fontsource/lora/LICENSE` |

- Copyright lines in the licence files, read on 2026-11-14: "Copyright 2016 The Inter Project Authors (https://github.com/rsms/inter)" and "Copyright 2011 The Lora Project Authors (https://github.com/cyrealtype/Lora-Cyrillic), with Reserved Font Name "Lora"."
- Conditions, from OFL 1.1 sections 1 to 3:
  1. The fonts must not be sold alone.
  2. The fonts can be bundled and redistributed with the site. Each copy must contain the copyright notice and the licence. These can be text files, readable headers, or machine-readable metadata fields in the font files.
  3. A changed font must not use a Reserved Font Name. The site does not change the fonts.
- Reserved Font Name: Lora has the Reserved Font Name "Lora". The site does not change the font, so the condition has no effect.
- Check, 2026-11-14: fontTools read the `name` table of `inter-latin-800-normal.woff2` and `lora-latin-400-normal.woff2`. Each keeps its copyright line (name 0) and a licence address (name 14). The licence text (name 13) is empty. So the site ships the licence files `public/licenses/OFL-inter.txt` and `public/licenses/OFL-lora.txt`, copied from the packages.
- Check, Task 17, 2026-11-14: `cmp` found each of the two files in `public/licenses/` the same as the `LICENSE` file of its package.
- The Sources page shows the copyright line of each font and links to its licence file. Task 17 added this credit.
- Task 17 removed the two fonts of the first build, Cormorant Garamond and Newsreader, because no page uses them. It removed the packages `@fontsource/cormorant-garamond` and `@fontsource/newsreader` and the licence files `public/licenses/OFL-cormorant-garamond.txt` and `public/licenses/OFL-newsreader.txt`.

## 7. Code libraries with a licence that is not open source

| Library | Package | Licence | Read |
|---|---|---|---|
| GSAP, for transition timing (CLAUDE.md, Stack) | `gsap` 3.15.1, added in Task 4 | GSAP Standard "no charge" licence, https://gsap.com/standard-license | 2026-11-13 |

- The licence permits use on any website at no charge, commercial use included.
- It does not require a credit. It forbids the removal of the notices in the GSAP files.
- It forbids use of GSAP in a visual tool that competes with the Webflow animation builder. The site is not such a tool.

## 8. Content sources

The sources of the facts about the Bible are in `docs/CONTENT-SOURCES.md`. Arthur approved them in Task 4.

---

## 9. King James Version

- The report of Task 19 is `docs/reviews/task-19-kjv-report.md`.
- Since Task 20, the USFM files of edition A are in the repository, in `sources/kjv/usfm/`, and the site data made from them is in `public/data/text-kjv/`. No file of edition B or edition C is in the repository. The other downloads of Task 19 are in a temporary folder outside `C:\dev\bible`.

### Edition A: eBible.org, the text of 1769 with Strong's numbers

- Use: Read for Task 19. Since Task 20, the source of the words of the King James Version. Arthur chose this edition on 2026-11-15 (`docs/DESIGN.md` section 8.2).
- Details page: `https://ebible.org/details.php?id=eng-kjv2006`. Read on 2026-11-15.
- Copyright page: `https://eBible.org/eng-kjv2006/copyright.htm`. Read on 2026-11-15. The details page does not link to this page. The HTML edition `https://eBible.org/eng-kjv2006/` links to it. The zip file holds the same page as `copr.htm`.
- Description on the details page: the King James Version, the standardized text of 1769, the 66 books only, with Strong's numbers added.
- Licence statement: both pages state "Public Domain". The copyright page also states that the reader may copy the text freely.
- The right to print in the United Kingdom: both pages state that letters patent of King James have no end date. Cambridge University Press, Oxford University Press, and Collins have the exclusive right to print this translation in the United Kingdom, and to import printed copies. The pages state that this right has no effect outside the United Kingdom, where the text is in the public domain.

### Use of edition A in Task 20: the King James Version data in `public/data/text-kjv/`

- Source file: `eng-kjv2006_usfm.zip`, the download of Task 19. SHA-256 `b6faa67117ccaba49df9e7df224a553f11758ae7c5d58f0f7979e2b73ac4480b`, checked again on 2026-11-15.
- In the repository: the 66 USFM files of the 66 books in `sources/kjv/usfm/`, and the copyright page of the zip file, `sources/kjv/copr.htm`. No other file of the zip file is in the repository.
- Script: `scripts/build-text-kjv.mjs`. It reads `sources/kjv/usfm/` and `public/data/text/<id>.json`, and writes `public/data/text-kjv/<id>.json`, one file for each book.
- What the site takes from the source files: the words of each verse, the added words (`\add`), and the Psalm titles (`\d`).
- What the site does not take from the source files: the Strong's numbers, the 6,959 footnotes, the paragraph signs "¶", the marks of the words of Jesus (`\wj`) and of the name LORD (`\nd`), the paragraphs and the poetry lines (`\p`, `\q1`, `\b`), and the `\s1` lines. The structure of each chapter comes from the Berean data in `public/data/text/`, by `docs/DESIGN.md` section 8.3.
- Test: `src/data/textKjv.test.ts` checks that the words of each of the 31,102 verses are the same as in the source files, except the 13 verses of the next section.

### Exception in Task 20b: 13 split words

- Arthur decided on 2026-11-15 that the site joins one word in 13 verses, where the source has the word in two parts. `docs/DESIGN.md` section 8.2 has the decision.
- In each of the 13 verses, the site removes one space. It changes no letter. The files in `sources/kjv/usfm/` do not change.
- Each joined word is in edition B. Task 20b confirmed each verse in the USFM files of `engkjvcpb_usfm.zip`, SHA-256 `62a1ee0f996a20523663c37e3c7afbc1bb01443488049f32a8178393ac52831b`, checked again on 2026-11-15. In two verses, edition B has a small letter at the start of the word and edition A a capital letter. The site keeps the capital letter of edition A.
- Script: the list `SPLIT` in `scripts/build-text-kjv.mjs`. The script stops with an error if the two words are not in the verse exactly once, or not in one string.
- Test: `src/data/textKjv.test.ts` has its own list. It checks the joined word in each verse, and that the verse equals the source when the space is put back.

| Verse | Source, edition A | Site | Edition B |
|---|---|---|---|
| Acts 4:16 | can not | cannot | cannot |
| Acts 4:20 | can not | cannot | cannot |
| Acts 5:39 | can not | cannot | cannot |
| Colossians 3:17 | what soever | whatsoever | whatsoever |
| Colossians 3:23 | what soever | whatsoever | whatsoever |
| 1 Timothy 2:7 | Where unto | Whereunto | Whereunto |
| 1 Timothy 5:25 | can not | cannot | cannot |
| 1 Timothy 6:12 | where unto | whereunto | whereunto |
| 2 Timothy 1:11 | Where unto | Whereunto | whereunto |
| 2 Timothy 2:9 | Where in | Wherein | wherein |
| 2 Timothy 2:13 | can not | cannot | cannot |
| Hebrews 6:17 | Where in | Wherein | Wherein |
| Hebrews 9:5 | can not | cannot | cannot |

### Edition B: eBible.org, the Cambridge Paragraph Bible

- Use: Read for Task 19. Read for Task 20b, to confirm the 13 joined words. The site takes no words from this edition.
- Details page: `https://www.ebible.org/details.php?id=engkjvcpb`. Read on 2026-11-15.
- Copyright page: `https://eBible.org/engkjvcpb/copyright.htm`. Read on 2026-11-15. The details page does not link to this page. The HTML edition `https://eBible.org/engkjvcpb/` links to it.
- Description on the details page: the King James Version, Cambridge Paragraph Bible edition.
- Licence statement: both pages state "Public Domain".
- The right to print in the United Kingdom: the same statement as for edition A.
- The zip file has 17 files that are not in the 66 books, for example the Apocrypha and the preface "The Translators to the Reader". The report does not count them.

### Edition C: OpenBible.com

- Use: Read for Task 19. Not used on the site.
- Task 19 names OpenBible.com a site of the Berean publisher. I did not check this.
- Downloads page: `https://openbible.com/doc.htm`. Read on 2026-11-15. It lists "King James Version - docx" at `https://openbible.com/docx/kjv.docx`. It has no licence statement.
- Terms page: `https://openbible.com/terms.htm`, dated June 28, 2021. Read on 2026-11-15. The page states:
  1. Most content and code of the site have a CC0 licence.
  2. Exception: some Bible texts have a copyright notice. A copy of such a text must keep the notice, and the Bible text must not be changed.
  3. Section 16 is a free licence for each file that a person downloads from the site. The person who downloads a file accepts the terms by the download. The courts of the United States have jurisdiction.
  4. Section 16 also states that OpenBible.com claims no copyright over public-domain texts such as the King James Version, and that it gives no guarantee that a source is in the public domain.
- The `.docx` file has no statement about rights. The script `scripts/kjv-report.mjs` searched each paragraph of `word/document.xml` for the words copyright, public domain, licence, rights, permission, and "©". It found one heading and four paragraphs of Bible text. It searched the other 10 parts of the file for the words copyright, public domain, licence, rights reserved, and "©", and found none. The file properties give "Bible Hub" as the creator and 2021-07-26 as the date.
- The right to print in the United Kingdom: no page of edition C states it.
- The PDF file `https://openbible.com/pdfs/kjv.pdf`: Arthur decided on 2026-11-15 that Task 19 does not need it. I did not get it and did not read it.

### Downloads (Task 19 step 3)

| Edition | Address | Got | Size in bytes | SHA-256 |
|---|---|---|---|---|
| A | `https://eBible.org/Scriptures/eng-kjv2006_usfm.zip` | Downloaded by Claude on 2026-11-15 | 2,466,537 | `b6faa67117ccaba49df9e7df224a553f11758ae7c5d58f0f7979e2b73ac4480b` |
| B | `https://eBible.org/Scriptures/engkjvcpb_usfm.zip` | Downloaded by Claude on 2026-11-15 | 1,797,997 | `62a1ee0f996a20523663c37e3c7afbc1bb01443488049f32a8178393ac52831b` |
| C | `https://openbible.com/docx/kjv.docx` | Downloaded by Arthur on 2026-11-15. Claude copied Arthur's file and did not download from OpenBible.com | 2,178,091 | `dce0fbe6cb2aae710d3260d7e3ad3ffc44c1e33b524255fbf864e7132d1c4547` |

- The SHA-256 of the edition C file is the same as that of the file that the designer examined.
- Arthur's download from OpenBible.com accepted the terms of section 16 of the terms page.
