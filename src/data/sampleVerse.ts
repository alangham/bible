// The verse of the section "The three translations" of the Sources page: 1 Corinthians 13:4 in each translation.
// docs/DESIGN.md section 14.4, docs/TASKS.md Task 33 step 5.
// The words are those of the site data, with no change, so that the page needs no data file. The unit test
// src/data/sampleVerse.test.ts compares them with passageVerses for this verse in the data file of each translation.
// The verse has no words-of-Jesus mark in the data, so no part has `j`.

import type { VersePart } from './passage.ts'
import type { Translation } from './translation.ts'

/** The verse: 1 Corinthians 13:4. */
export const SAMPLE_VERSE = { book: '1-corinthians', c: 13, v: 4 } as const

/** The words of the verse in parts. `a`: an added word of the King James Version, in italics. */
export const SAMPLE_PARTS: Record<Translation, readonly VersePart[]> = {
  bsb: [{ t: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.' }],
  kjv: [{ t: 'Charity suffereth long, ' }, { t: 'and', a: true }, { t: ' is kind; charity envieth not; charity vaunteth not itself, is not puffed up,' }],
  web: [{ t: 'Love is patient and is kind. Love doesn’t envy. Love doesn’t brag, is not proud,' }],
}
