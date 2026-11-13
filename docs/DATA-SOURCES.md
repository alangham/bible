# Data sources

This file records each data source of the site, its licence, and the result of each check. Task 1 created this file on 2026-11-13.

Do not add a data source until you read its licence and add it here.

---

## 1. ESV API (Crossway)

- Use: preferred translation, fetched at read time. Task 6.
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

---

## 3. OpenBible.info cross-references

- Use: source for echo links. Task 7.
- Page: `https://www.openbible.info/labs/cross-references/`. Read on 2026-11-13.
- Download: `https://a.openbible.info/data/cross-references.zip`. About 2 MB.
- Licence: Creative Commons Attribution 4.0 (CC BY 4.0). The page states: "Unless otherwise indicated, all content is licensed under a Creative Commons Attribution License." The link goes to `http://creativecommons.org/licenses/by/4.0/`.
- Content: about 340,000 cross-references. The page says that most of the data comes from the Treasury of Scripture Knowledge, which is public domain. The data has votes.

### Conditions

1. Attribution is required. The site must credit OpenBible.info and link to the licence. Put the credit on the site, for example on an "About" or "Sources" page.

### Check (Task 1 step 9)

- Result: PASS. The licence permits use and redistribution with attribution.
- Limit: I did not download the zip file. I did not check the file format or the meaning of the votes. Task 7 does this.
- Limit: the data does not separate quotations from echoes. All links from this source are echo links unless a quotation source confirms them.

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
- Hebrews 9: the file has three rows. Hebrews 9:20 quotes Exodus 24:8. Hebrews 9:19 quotes Exodus 24:8. Hebrews 9:28 quotes Isaiah 53:12. The file has no row for Leviticus 16 or Numbers 19. DESIGN.md section 4.5 names these two passages for Hebrews 9. With this source, those two passages are echo links, not quotation links.

---

## 5. Sources that I read and did not choose

1. Open Bible Data, Freely-Given.org (`https://freely-given.org/OBD/`). It shows the Tyndale Open Bible Dictionary article on quotations as HTML pages. I found no data file and no named licence for the data.
2. STEPBible Data (`https://github.com/STEPBible/STEPBible-Data`). Licence CC BY 4.0 for the repository. I found no file that lists New Testament quotations of the Old Testament.
