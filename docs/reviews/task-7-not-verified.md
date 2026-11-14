# Task 7: the "Not verified" lists of the accuracy reviewers

## Task 7b: this file is now a record

This file is now a record of the links that changed type in Task 7b. It is not a list of decisions for Arthur.

Arthur decided the fit rule on 2026-11-14 (`docs/DESIGN.md` section 4.5). A link of the Bible Quotation Database with the fit "close" or "weak" is now an echo link, with a light mark and no reason line. No link is removed. The quotation links that the reviewers named below are now echo links, with these exceptions:

- `romans.11.34|isaiah.40.13` is a quotation link. The fit judgment of Task 7b found "of the Lord or" with "Who has" and "His counselor".
- `romans.10.11|isaiah.28.16` and `romans.10.13|joel.2.28` are quotation links. The reviewers named them only as the neighbours of other links.

Correction to items 4 and 5 of quarter 4: Mark 9:44 and Mark 15:28 have no words in the main text of the BSB. A BSB footnote at Mark 9:43 and at Mark 15:27 gives the words of each verse. The accuracy review of Task 7b found this.

The "Not verified" lists of the Task 7b reviews are in `docs/reviews/task-7b-not-verified.md`.

The decisions of the review of Check 3 Parts 1, 3, 4, and 5 are now in `docs/DESIGN.md` section 4.5. Item 8, the overlapping links, is settled by the overlap rule of Task 7b: the site hides an echo link that overlaps a quotation link at its two ends. The list of each link and its new type is in `docs/CONTENT-SOURCES.md`, in the section "Links that changed type in Task 7b".

## The lists of Task 7

The five accuracy reviewers of 2026-11-14 wrote these lists. They are copied here without changes. The links stay in the data: Arthur decided that no person and no agent removes a link from a source.

## Review of Check 3 Parts 1, 3, 4, and 5

1. **Rounding of "1 marked verse for each 5 verses".** The build rounds up, and DESIGN 4.5 does not say how to round. If it rounds down, 208 chapters go over their cap, and the site has 1,898 OpenBible links, not 2,076.
2. **Which links count toward the limit.** The verse limit and the chapter limit count OpenBible links only. DESIGN 4.5 does not say whether quotation and Berean links count. 533 verses are an end of 3 or more links when all sources count.
3. **What counts as a link in the read-with sum.** The build counts a row and its reverse as one link. If each row counts, 836 of the 1,182 lists change their entries. Example: Hebrews 8 enters the list of Jeremiah 24 with 192 votes.
4. **Rules not in DESIGN 4.5.**
   - The tie order is more links first, then Bible order. In 152 chapters, the 5th and 6th entries have the same vote sum, so the tie order chooses the entry.
   - A link counts in the chapter of its first verse. 386 cross-book links have a range that runs into the next chapter.
5. **The "48 links" in DESIGN 4.5.** I could not reproduce the figure for Hebrews 9 against Leviticus 16 and Numbers 19. I count 53 rows, 51 distinct passage pairs and 47 links by start pair.
6. **The 45 rows that start at the same verse.** They need Arthur's approval. See "Your build notes" above.
7. **Joshua to Malachi.** `h1812` links Hebrews 11:30 to Joshua 1:1 from the line "Joshua–Malachi". That line names whole books. Arthur's rule in Task 7 step 1 names whole chapters only.
8. **Overlapping links.** 50 echo links overlap a quotation link at both ends but start at a different verse. Example: `o2728` Matthew 19:5 to Genesis 2:21-24, next to `q14` Matthew 19:5 to Genesis 2:24. The build reads "the same pair of passages" as the same start verses.
9. **`q730` and `q731`.** These are the links in problem 2. They end at verses with no text.
10. **Items outside my scope.** I saw these and did not check them:
    - Part 2: `q754` links 1 Peter 2:8 to Isaiah 28:16. Rows link Romans 10:13 to Joel 2:31 and to Joel 2:28-32.
    - Check 4: the reason lines of `q730` and `q731` say "has no text in this file".
11. **Things I did not check.** I did not render the site. I did not check the OpenBible download record in `docs/DATA-SOURCES.md`.

## Quarter 1 of the quotation links (Check 3 Part 2 and Check 4)

These 18 links are in the source, but the later passage neither quotes the words of the earlier passage nor names it clearly. Per Arthur's rule, no link is removed. The writer's fit agrees with my reading for 17 of them. For `1-corinthians.15.49` I would change the fit to `weak`, as stated above.

1. `romans.1.23|genesis.1.26`: Only "image" and a similar list of creatures are shared.
2. `1-corinthians.15.49|genesis.1.26`: Only "likeness" is shared.
3. `2-corinthians.3.18|genesis.1.26`: Only "image" is shared.
4. `2-corinthians.4.4|genesis.1.26`: Christ as the image of God. Only "image" is shared.
5. `colossians.3.10|genesis.1.26`: The new self is renewed in the image of its Creator. This is a theme only.
6. `1-corinthians.6.17|genesis.2.24`: The theme is union, "one with Him in spirit". Verse 6:16 quotes Genesis 2:24, but 6:17 does not.
7. `james.3.9|genesis.5.2`: Genesis 5:2 has no "image" or "likeness". The writer gave `weak`.
8. `matthew.3.17|genesis.22.2`
9. `matthew.17.5|genesis.22.2`
10. `mark.1.11|genesis.22.2`
11. `mark.9.7|genesis.22.2`
12. `luke.3.22|genesis.22.2`
13. `john.1.14|genesis.22.2`
14. `2-peter.1.17|genesis.22.2`

    For items 8 to 14: "My beloved Son" or "one and only Son" against "your only son Isaac, whom you love". The BSB wording shares only "son".
15. `1-peter.2.9|exodus.23.22`: The passages share no words. The writer gave `weak`.
16. `2-corinthians.3.7|exodus.34.34`: 2 Corinthians names Moses' face, but Exodus 34:34 speaks only of the veil. The writer gave `weak`.
17. `hebrews.6.19|leviticus.16.12`: Both speak of the place behind the curtain or veil. There is no quotation, and Hebrews does not name the incense rite.
18. `acts.13.18|deuteronomy.1.31`: Only "in the wilderness" is shared. The writer gave `weak`.

## Quarter 2 of the quotation links

37 links are not verified. In each one, the later passage does not quote the BSB words of the earlier passage and does not name it clearly. Arthur decided that no link is removed.

**A. No shared wording beyond one or two common words (13 links):**
1. `hebrews.12.21|deuteronomy.9.19`, weak. Only the idea of fear is shared. Deuteronomy 9:19 does not name Moses.
2. `acts.3.22|deuteronomy.18.16`, weak. The words that Acts repeats are in Deuteronomy 18:15, not in 18:16.
3. `romans.11.8|deuteronomy.29.3`, weak. Only "eyes" is shared.
4. `1-corinthians.10.28|deuteronomy.10.14`, weak. No word is shared.
5. `matthew.2.23|judges.13.5`, weak. "Nazarene" and "Nazirite" differ. Matthew names "the prophets", not a passage.
6. `2-corinthians.6.18|2-samuel.7.8`, weak. The verse has no words about a father or sons. Those words are in 2 Samuel 7:14, which is a separate link in this quarter.
7. `philippians.1.19|job.13.16`, weak. Only "my" and "will" are shared.
8. `matthew.22.44|psalms.8.6`, weak. Only "under" and "feet" are shared.
9. `1-corinthians.10.26|deuteronomy.10.14`, close. Only "the earth" is shared. The words of 1 Corinthians 10:26 match Psalm 24:1 exactly, and that pair is a separate link in this quarter.
10. `hebrews.2.13|2-samuel.22.3`, close. No word is shared. In bsb.txt, "I will put my trust in Him" is in Isaiah 8:17. CSV rows 489 and 995 link Hebrews 2:13 to Isaiah 8:17.
11. `matthew.27.48|psalms.69.21`, close. The texts say "sour wine" and "vinegar", and no word is shared.
12. `mark.15.36|psalms.69.21`, close. This is the same case as item 11.
13. `john.19.29|psalms.69.21`, close. This is the same case as item 11.

**B. Borderline: a short phrase of 2 or 3 common words, or the same statement in other words (24 links, all close):**
1. `acts.13.19|deuteronomy.7.1`: only "seven nations" is shared.
2. `matthew.17.5|deuteronomy.18.15`: only "Listen to Him" is shared.
3. `mark.9.7|deuteronomy.18.15`: only "Listen to Him" is shared.
4. `luke.9.35|deuteronomy.18.15`: only "Listen to Him" is shared.
5. `hebrews.12.15|deuteronomy.29.18`: only "no root" and "bitter" are shared.
6. `romans.10.7|deuteronomy.30.13`: only the form "Who will …?" is shared. The neighbouring pair, Romans 10:6 and Deuteronomy 30:12, does share words.
7. `1-corinthians.10.22|deuteronomy.32.21`: only "provoke … jealousy" is shared.
8. `luke.1.48|1-samuel.1.11`: "looked … on … His servant" against "look upon … Your maidservant".
9. `romans.11.2|1-samuel.12.22`: "did not reject His people" against "will not abandon His people".
10. `john.7.42|2-samuel.7.12`: John names "the Scripture", but only "will come from" is shared.
11. `acts.2.30|2-samuel.7.12`: only "descendant(s)" is shared.
12. `matthew.3.17|psalms.2.7`: only "My … Son" is shared.
13. `matthew.17.5|psalms.2.7`: only "My … Son" is shared.
14. `mark.9.7|psalms.2.7`: only "My … Son" is shared.
15. `luke.9.35|psalms.2.7`: only "My … Son" is shared.
16. `2-peter.1.17|psalms.2.7`: only "My … Son" is shared.
17. `revelation.2.26|psalms.2.8`: only "I will" and "the nations" are shared.
18. `1-peter.5.7|psalms.55.22`: only "Cast … your" is shared.
19. `acts.28.28|psalms.67.2`: only "salvation" is shared.
20. `john.19.28|psalms.69.21`: only "thirsty" and "thirst" are shared. John names "the Scripture".
21. `2-thessalonians.1.8|psalms.79.6`: "do not know God" against "do not acknowledge You".
22. `acts.2.30|psalms.89.3`: "on oath" against "sworn".
23. `acts.2.30|psalms.89.4`: only "throne" is shared, with "descendants" against "offspring".
24. `john.12.34|psalms.89.36`: only "forever" is shared. John names "the Law".

## Quarter 3 of the quotation links

In each of these links, the later passage neither quotes the words of the earlier passage nor names it clearly in the BSB. Part 2 step 4 says such a link must be an echo link. By Arthur's rule, none of them is removed.

### A. Only a theme, one shared word or phrase, or a title: 31 links

- `hebrews.4.10|psalms.95.11`: shares only "enter ... rest".
- 10 links to Psalms 110:1 that share only "right hand" and a form of "sit":
  - `matthew.26.64`
  - `mark.14.62`
  - `mark.16.19`
  - `luke.22.69`
  - `ephesians.1.20`
  - `colossians.3.1`
  - `hebrews.1.3`
  - `hebrews.8.1`
  - `hebrews.10.12`
  - `hebrews.12.2`
- `matthew.21.9`, `mark.11.9`, and `john.12.13` with `psalms.118.25`: the passages share no BSB words. "Hosanna" is not in Psalm 118:25.
- `mark.11.10|psalms.118.26`: shares only "Blessed is".
- `1-corinthians.10.28|psalms.24.1`: shares no words and no idea.
- `hebrews.13.6|psalms.27.1`: shares only "The Lord is my" and the idea of not fearing.
- `romans.12.17|proverbs.3.4`: shares an idea only.
- `john.7.38|proverbs.18.4`: shares only a picture of water. "As the Scripture has said" does not name Proverbs.
- `2-corinthians.9.7|proverbs.22.8`: shares no words and no idea.
- `ephesians.5.18|proverbs.23.31`: shares only "Do not ... wine".
- `matthew.21.33`, `mark.12.1`, and `luke.20.9` with `isaiah.5.1`: share only "a vineyard".
- `james.5.4|isaiah.5.9`: shares only the title "the Lord of Hosts".
- `matthew.2.23|isaiah.11.1`: shares no words. Matthew names "the prophets", not Isaiah.
- `ephesians.6.17|isaiah.11.4`: shares no words.
- `luke.21.35|isaiah.24.17`: shares only "dwell ... the earth".
- `hebrews.10.37|isaiah.26.20`: shares only "a little while".
- `hebrews.2.16|isaiah.41.8`: shares only "descendant(s) of Abraham".
- `hebrews.2.16|isaiah.41.9`: shares no words.

### B. The same saying or picture in other words: 39 links

In these links, fewer than 4 words are shared in a run, and the passage does not name the earlier book.

- `romans.11.2|psalms.94.14`: "reject" where Psalms has "forsake".
- `hebrews.1.6|psalms.97.7`: "angels" where Psalms has "gods".
- `james.5.11|psalms.103.8`
- `romans.1.23|psalms.106.20`
- `1-corinthians.15.25|psalms.110.1`
- `titus.2.14|psalms.130.8`
- `romans.3.20|psalms.143.2`
- `galatians.2.16|psalms.143.2`
- `2-corinthians.8.21|proverbs.3.4`
- `revelation.3.19|proverbs.3.12`
- `1-peter.4.8|proverbs.10.12`
- `matthew.16.27|proverbs.24.12`
- `2-thessalonians.1.9|isaiah.2.19`
- `matthew.21.33|isaiah.5.2`
- `mark.12.1|isaiah.5.2`
- `luke.8.10|isaiah.6.9`
- `mark.4.12|isaiah.6.10`
- `1-peter.3.15|isaiah.8.13`
- `1-peter.4.14|isaiah.11.2`
- `ephesians.6.14|isaiah.11.5`
- `matthew.11.23|isaiah.14.13`
- `luke.10.15|isaiah.14.13`
- `1-corinthians.15.54|isaiah.25.8`: says "the saying that is written" but names no book.
- `hebrews.10.27|isaiah.26.11`
- `romans.11.27|isaiah.27.9`
- `romans.11.8|isaiah.29.10`: says "as it is written" but names no book.
- `colossians.2.22|isaiah.29.13`
- `luke.7.22|isaiah.35.5`
- `luke.7.22|isaiah.35.6`
- `james.1.11|isaiah.40.7`
- `john.12.15|isaiah.40.9`
- `romans.11.34|isaiah.40.13`: "mind" where Isaiah has "Spirit".
- `1-corinthians.2.16|isaiah.40.13`
- `james.2.23|isaiah.41.8`
- `matthew.3.17|isaiah.42.1`
- `matthew.17.5|isaiah.42.1`
- `mark.1.11|isaiah.42.1`
- `luke.3.22|isaiah.42.1`
- `luke.9.35|isaiah.42.1`

### Fit labels on these 70 links

- Group A holds 19 close labels and all 12 weak labels.
- Group B holds 38 close labels and 1 quote label, `john.12.15|isaiah.40.9`.

## Quarter 4 of the quotation links

**Check 3 Part 2: links where the New Testament verse does not quote the Old Testament verse or name it.** In the BSB text, these links share only a theme or one word. Each one stays in the data by Arthur's rule. For each link, the writer's fit agrees with my reading.

Fit weak (17):
1. `acts.13.22|isaiah.44.28`: Acts is about David and Isaiah is about Cyrus. The two verses share no wording.
2. `acts.15.17|isaiah.45.21`: The verses share no wording. The words in Acts match Amos 9:12, which has its own link.
3. `1-corinthians.2.9|isaiah.52.15`: The verses share only the theme of seeing and hearing. The words in 1 Corinthians match Isaiah 64:4, which has its own link.
4. `mark.9.44|isaiah.66.24`: Mark 9:44 has no words in the BSB, so I cannot compare the two verses. I did not check how the site shows a mark on a verse with no words.
5. `mark.15.28|isaiah.53.12`: Mark 15:28 has no words in the BSB. The limits are the same as for item 4.
6. `romans.10.11|isaiah.8.14`: The verses share no wording. `romans.10.11|isaiah.28.16` is also a link.
7. `1-peter.2.6|isaiah.8.14`: The verses share only the word "stone".
8. `1-peter.2.8|isaiah.28.16`: The verses share only the word "stone". The pairs for 1 Peter 2:6 and 2:8 look crossed with Isaiah 28:16 and 8:14. The crossed pairs are also links.
9. `1-corinthians.2.9|jeremiah.3.16`: The verses share only the idea of something that does not come to mind.
10. `john.6.45|jeremiah.31.33`: The verses share only the idea of being taught by God.
11. `2-corinthians.6.17|jeremiah.31.9`: The verses share only the word "come". The word "Father" in 2 Corinthians is in 6:18, and 6:18 has no link to Jeremiah 31:9.
12. `acts.2.21|joel.2.31`: The matching words are in Joel 2:32, and no link `acts.2.21|joel.2.32` exists.
13. `romans.10.13|joel.2.31`: The matching words are in Joel 2:32. The link `romans.10.13|joel.2.28`, with the range Joel 2:28-32, covers that verse.
14. `acts.15.18|amos.9.12`: The verses share no wording.
15. `romans.1.17|habakkuk.2.3`: The matching words are in Habakkuk 2:4, which has its own link.
16. `galatians.3.11|habakkuk.2.3`: This is the same case as item 15.
17. `luke.3.10|malachi.3.7`: The verses share only the form of a question from the people.

Fit close, but only a theme in the BSB (3):
18. `acts.15.18|isaiah.45.21`: The verses share no words, only the idea of things known long ago.
19. `ephesians.6.17|isaiah.49.2`: The verses share only the word "sword".
20. `ephesians.6.17|hosea.6.5`: The verses share only "word/words" and the idea of God's word as a weapon.

**Other items I did not verify:**
- Copyright: I checked only 2 of the 194 lines against outside sources. The other 192 lines have no outside check.
- I read the crossed or shifted pairs in items 8, 11, 12, 13, 15 and 16 from the BSB text only. I did not check them against the database's own notes.
