# Task 7b: the "Not verified" lists of the accuracy reviewers

The five accuracy reviewers of Task 7b wrote these lists on 2026-11-14. They are copied here without changes. The links on these lists keep the type that the reviewers left them with.

## Quarter 1 of the quotation links

1. `q73`, key `acts.7.34|exodus.2.24`.
   - Shared words: "heard their groaning" (3 words, plus "and"). In the BSB, the phrase is only in these two verses.
   - The rule makes 3 common words an echo link. "groaning" is not a common word, and the rule does not decide a rare 3-word phrase.
   - Acts 7:34 also has a quotation link to Exodus 3:7 (`q80`), which has a long run of shared words.
2. `q81`, key `acts.7.34|exodus.3.8`.
   - Shared words: "have come down to" (4 common words, in 6 BSB verses), plus "them".
   - The verb differs: "deliver" and "rescue".
   - The Task 7b judge's Test 1 accepts a run of 4 words. But the 4 words are common, and the rest of the statement is in other words. I could not decide the link with the rule.
3. `q108`, key `ephesians.6.3|exodus.20.12`.
   - Shared words: only "that", "may", and "long". Ephesians 6:3 gives the same promise in other words.
   - The judge's "quote" depends on a name in the verse before. Ephesians 6:2 names "the first commandment with a promise" in the same sentence. The rule says that the later passage must name the earlier passage, and it does not say whether a name in the verse before counts.
   - `q180`, Ephesians 6:3 to Deuteronomy 5:16, passes on its own: it shares "that it may go well with you".

## Quarter 2 of the quotation links

1. q247, Hebrews 10:30 to Deuteronomy 32:36. Hebrews has "The Lord will judge His people". Deuteronomy has "the LORD will vindicate His people". The shared words are "the Lord will" and "His people", which are two runs of common words. The main verb is different. Psalm 135:14 has the Deuteronomy words exactly. If a changed verb makes this "the same statement in other words", the correction is "fit close". Arthur must decide.
2. q344, 2 Timothy 4:14 to Psalm 62:12. The shared words are "will repay" and "according to his deeds". `bsb.txt` has the phrase "according to his deeds" in 6 verses. 2 Timothy speaks of one man, but the Psalm speaks of "each man". Hosea 12:2 has "repay him according to his deeds" word for word. If that phrase counts as a common phrase, the correction is "fit close".
3. q267, Mark 6:34 to 1 Kings 22:17. The shared words are "like sheep without a shepherd", which is 5 words. Numbers 27:17 and 2 Chronicles 18:16 also have this phrase. The rest of Mark 6:34 does not follow 1 Kings 22:17. The link passes the word rule. I cannot tell from the rule whether a stock simile in three Old Testament verses is "the words of the earlier passage".
4. q720 to q725: Matthew 22:37, Mark 12:30, and Luke 10:27, each to Deuteronomy 10:12 and to Deuteronomy 30:6. These six links pass the rule. Each verse has "love ... with all your heart and with all your soul". But the phrase is in 9 Old Testament verses. Deuteronomy 11:13 and Joshua 22:5 match no less closely than 10:12 and 30:6. These links are in the source data, so this is a note only. It is not a correction.
5. I did not check that `public/data/links/` holds these 134 links with the same reason lines as `review-q2.json`. My check used the entry text only.
6. For the passages, I used the text in the entries. I read `bsb.txt` only to count phrases and to read the verses before. I did not compare the entry text with `bsb.txt` for each of the 134 links.

## Quarter 3 of the quotation links

- **q442**, `revelation.10.6|psalms.146.6`
  - Revelation 10:6 rearranges the creation statement: "created heaven and everything in it, the earth and everything in it, and the sea and everything in it".
  - The words shared with Psalms 146:6 are "heaven", "earth", and "the sea and everything in it/them". That last phrase is 5 words, with a pronoun changed.
  - I am not sure whether this is a repeat of Psalms 146:6 or the same statement in other words. Nehemiah 9:6 has the same structure.
- **q513**, `romans.10.11|isaiah.28.16`
  - The shared words are "who believes ... will never be". These are five common words, and the verb differs: "put to shame" against "shaken".
  - "The Scripture says" does not name Isaiah.
  - I passed q512 because Romans 9:33 also repeats "See, I lay ... in Zion a stone". Romans 10:11 has only the clause, so I am not sure that the clause alone is enough.

## Quarter 4 of the quotation links

These five links share more than one short phrase, and the phrases are in the same sentence form. I could not decide them by the rule. Arthur or the lead agent must choose "quote" or "close".

1. **q538**, `romans.11.34|isaiah.40.13`.
   - Shared words: "Who has", "of the Lord" and "His counselor". "His counselor" is in 7 BSB verses.
   - The BSB of Isaiah 40:13 does not have "the mind of the Lord". Each shared string is 2 or 3 words.
2. **q580**, `1-peter.2.22|isaiah.53.9`.
   - Shared words: "deceit" and "in His mouth". "deceit in His mouth" is in 1 BSB verse, Isaiah 53:9.
   - 1 Peter has "no deceit was found in His mouth".
3. **q585**, `acts.13.34|isaiah.55.3`.
   - Shared words: "promised to David", which is in 2 BSB verses: these two. Also "I will ... you".
   - "As He has said" marks a quotation but does not name a book.
4. **q747**, `romans.9.25|hosea.1.10`.
   - Romans 9:25 names Hosea. Shared words: "are not My people". "not My people" is in 5 BSB verses.
   - The words of Romans 9:25 match Hosea 2:23, which is link q661. Romans 9:26 quotes Hosea 1:10, which is link q659.
   - This is the same kind of case as q590: the verse names a book, but its words are from a different verse. q747 shares more words than q590.
5. **q758**, `2-corinthians.6.16|jeremiah.30.22`.
   - Shared words: "will be My people" and "I will be ... God". Jeremiah has them in the reverse order, with "you" and "your".
   - "will be My people" is a formula in 17 BSB verses.
   - The other four links from 2 Corinthians 6:16 have the clause "they will be My people" word for word: q645, q759, q760 and q761. I passed those four.

## Check 3 Parts 1, 3, 4, and 5, and the Task 7b rules

1. Part 2 and Check 4. They are not my part.
2. The unit tests. I did not run `vitest`, because it writes a cache inside the repository.
3. How the site shows echo links, a mark on Mark 9:44 or Mark 15:28, or the BSB footnotes. I did not open the site.
4. Whether the fit rule reads BSB footnote text. Only Arthur can decide this. See problem 1.
5. The Part 3 judgments on theme. The test is my reading of the two passages, and no source settles it.
6. The merge of a row and its reverse with the higher votes. That rule is in DATA-SOURCES.md line 118, not in DESIGN.md. If the votes are added instead, 882 chapters get a different read-with list.
7. The upstream websites, bible-researcher.com and kalvesmaki.com. I checked links only against the bundled CSV.
8. Which section heading each Berean link uses. I checked only that the USFM `\r` line before that verse names the target.
9. The Task 7b edits to `docs/reviews/task-7-not-verified.md` and `docs/CONTENT-SOURCES.md`, beyond the Mark lines in problem 1.
