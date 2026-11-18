// The Sources page: the translation and a credit for each source. docs/TASKS.md Task 6.
// The conditions of each licence are in docs/DATA-SOURCES.md. The sources of the book
// introductions are in docs/CONTENT-SOURCES.md.
// The look of the Reference section: docs/DESIGN.md section 7.8, docs/TASKS.md Task 15 step 9.
// The fonts section names the fonts that the site uses, Inrond and Lora: docs/TASKS.md Task 17 step 11 and Task 41 step 14.
// The credit of the King James Version: docs/TASKS.md Task 21 step 9.
// The first section, "The three translations": docs/DESIGN.md section 14.4, docs/TASKS.md Task 33 step 5.
// The section "Places", the credit of the map data: docs/DESIGN.md section 15.9, docs/TASKS.md Task 37 step 8.
// The section "Videos", the credit of the videos of BibleProject: docs/DESIGN.md section 17.6, docs/TASKS.md Task 42 step 7.

import { Fragment, useEffect } from 'react'
import { SAMPLE_PARTS } from './data/sampleVerse.ts'
import { TRANSLATIONS } from './data/translation.ts'
import { SUMMARY_VIDEOS, videoHref } from './data/videos.ts'
import { VideoCredit } from './reading/AboutBook.tsx'
import { RefBar } from './reference/RefBar.tsx'

const LICENSES = `${import.meta.env.BASE_URL}licenses/`

export function SourcesPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className="ref-page" data-page="sources">
      <RefBar current="sources" />
      <main className="ref-main sources-page">
        <h1>Sources</h1>

        {/* The three translations: the line of each translation and one verse in each. docs/DESIGN.md section 14.4,
            docs/TASKS.md Task 33 step 5. The verse has no red letters. */}
        <section aria-labelledby="sources-translations">
          <h2 id="sources-translations">The three translations</h2>
          <p>
            The site has three translations of the Bible into English. The translation list in the top bar of a chapter selects one. Here is one
            verse, 1 Corinthians 13:4, in each translation.
          </p>
          <ul className="sources-versions">
            {TRANSLATIONS.map((t) => (
              <li key={t.id} data-translation={t.id}>
                <p className="sources-version-name">
                  <b>{t.name}</b> <span className="sources-version-short">{t.short}</span>
                </p>
                <p className="sources-version-line">{t.line}</p>
                <p className="sources-version-verse" lang="en">
                  {SAMPLE_PARTS[t.id].map((part, i) =>
                    part.a ? (
                      <i key={i} className="added">
                        {part.t}
                      </i>
                    ) : (
                      <Fragment key={i}>{part.t}</Fragment>
                    ),
                  )}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="sources-text">
          <h2 id="sources-text">The Bible text</h2>
          <p>
            The site has three translations: the <a href="https://berean.bible/">Berean Standard Bible</a> (BSB), the King James Version (KJV), and
            the World English Bible (WEB). The Berean Standard Bible is in the public domain. The publisher placed it in the public domain on April 30, 2023, with the{' '}
            <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0</a> dedication. The site shows the words without change.
          </p>
          <p>
            The section headings, the paragraphs, the poetry lines, and the notes about manuscripts come from the USFM files of the same
            publisher.
          </p>
          <p>
            The Holy Bible, Berean Standard Bible, BSB is produced in cooperation with Bible Hub, Discovery Bible, unfoldingWord, Bible Aquifer,
            OpenBible.com, and the Berean Bible Translation Committee.
          </p>
          {/* The King James Version: docs/DESIGN.md section 8.6, docs/TASKS.md Task 21 step 9. The facts are from sources/kjv/copr.htm. */}
          <p>
            The King James Version on this site is the standardized text of 1769, from the files of{' '}
            <a href="https://ebible.org/eng-kjv2006">eBible.org</a>, by courtesy of the <a href="https://crosswire.org/">Crosswire Bible Society</a>{' '}
            and eBible.org. It is in the public domain. In the United Kingdom, three publishers have the exclusive right to print this translation:
            Cambridge University Press, Oxford University Press, and Collins. eBible.org states that this right has no effect outside the United
            Kingdom.
          </p>
          {/* Task 31b: the lines of the files that the site does not show. docs/DESIGN.md section 8.6. */}
          <p>
            The site does not show the Strong's numbers, the footnotes, and the paragraph signs of these files. It also does not show these lines of
            the files: the title lines of the books, for example "The First Book of Moses, called Genesis", the names of the Hebrew letters in Psalm
            119, and the line at the end of 14 letters, for example "Written from Rome unto the Ephesians by Tychicus". The words that the
            translators added show in italics. In 13 verses, the files write one word as two words, for example "can not", and the site joins the
            word.
          </p>
          {/* The World English Bible: docs/DESIGN.md section 13.7, docs/TASKS.md Task 31 step 8. The facts are from sources/web/copr.htm
              and section 11 of docs/DATA-SOURCES.md. */}
          <p>
            The World English Bible on this site is the edition that does not have the books of the Apocrypha, from the files of{' '}
            <a href="https://ebible.org/details.php?id=engwebp">eBible.org</a>. eBible.org names it the 2020 stable text edition, and gives it the
            abbreviation "WEBP". The World English Bible is in the public domain. "World English Bible" is a trademark of eBible.org.
          </p>
          {/* Task 31b: the lines of the files that the site does not show. docs/DESIGN.md section 13.7. */}
          <p>
            The site shows the words of these files without change. It does not show the Strong's numbers, the footnotes, and the cross-reference
            notes of these files. It also does not show these lines of the files: the title lines of the books, for example "Paul’s Letter to the
            Romans", the names of the speakers in the Song of Solomon, the lines "BOOK 1" to "BOOK 5" in the Psalms, and the names of the Hebrew
            letters in Psalm 119.
          </p>
          <p>
            The verse numbers of the World English Bible are those of the files. Romans 14 has 26 verses, and Romans 16 ends at verse 24. In the two
            other translations of this site, the words of the last three verses of Romans 14 are Romans 16:25 to 16:27. Five verse numbers have no
            words in the files, and the site does not show them: Luke 17:36, Acts 8:37, Acts 15:34, Acts 24:7, and Romans 16:25.
          </p>
          <p>
            On the King James Version pages and the World English Bible pages, the section headings, the cross-reference lines, the paragraphs, and
            the lines of poetry are those of the Berean Standard Bible files. They are not part of these translations.
          </p>
          <p>
            The words of Jesus are in red. They are the words that the files of each translation mark as words of Jesus. The three translations do
            not mark the same words in each verse. The site changes one mark: in Mark 12:37 of the King James Version, the file also marks the
            sentence "And the common people heard him gladly.", and the site does not.
          </p>
        </section>

        <section aria-labelledby="sources-links">
          <h2 id="sources-links">Links between passages</h2>
          <p className="credit-openbible">
            Cross-references: <a href="https://www.openbible.info/labs/cross-references/">OpenBible.info</a>, under the{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International licence (CC BY 4.0)</a>. The
            site shows a part of these links, the ones with the most votes, and adds their votes between chapters for the read-with list of each
            chapter.
          </p>
          <p>
            Cross-reference lines under the section headings: the USFM files of the Berean Standard Bible, in the public domain.
          </p>
          <p>
            Quotations of the Old Testament in the New Testament: the{' '}
            <a href="https://lukeplant.me.uk/bible-quotation-database/">Bible Quotation Database</a> by Luke Plant, in the public domain.
          </p>
        </section>

        <section aria-labelledby="sources-introductions">
          <h2 id="sources-introductions">Book introductions</h2>
          <p>The introductions of the books use facts from these sources. The text of each introduction is written for this site.</p>
          <ul>
            <li>
              <a href="https://en.wikisource.org/wiki/Easton%27s_Bible_Dictionary_(1897)">Easton’s Bible Dictionary</a>, 1897, on Wikisource. In the
              public domain.
            </li>
            <li>
              The{' '}
              <a href="https://www.esv.org/resources/esv-global-study-bible/introduction-a-users-guide-to-the-global-study-bible/">
                ESV Global Study Bible
              </a>
              , by Crossway: the introduction to each book, on esv.org.
            </li>
            <li>
              <a href="https://en.wikipedia.org/">Wikipedia</a>, the article on each book, under the{' '}
              <a href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International licence (CC BY-SA 4.0)</a>.
            </li>
          </ul>
          <p>
            The source of each fact is in the file{' '}
            <a href="https://github.com/alangham/bible/blob/main/docs/CONTENT-SOURCES.md">CONTENT-SOURCES.md</a> of this site.
          </p>
        </section>

        {/* The map data: docs/DESIGN.md section 15.9 "The credit", docs/TASKS.md Task 37 step 8. The licences are in
            section 12 of docs/DATA-SOURCES.md. */}
        <section aria-labelledby="sources-places">
          <h2 id="sources-places">Places</h2>
          <p>Each book with places has a map of them. The link is in “About this book”.</p>
          <p>
            The places that each book names, the verses that name them, and their positions come from the{' '}
            <a href="https://www.openbible.info/geo/">Bible Geocoding Data of OpenBible.info</a>, with a{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 licence</a>. The site changed the data: it keeps
            one position for each place, and it leaves out the places that are inside a city and the places with the name East, North, or
            South.
          </p>
          <p>
            Some positions in that data come from OpenStreetMap. <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>.
            That data has the Open Database License.
          </p>
          <p>
            The coast, the rivers, and the lakes come from <a href="https://www.naturalearthdata.com/">Natural Earth</a>, which is in the public
            domain.
          </p>
        </section>

        {/* The videos of BibleProject: links only. docs/DESIGN.md section 17.6, docs/TASKS.md Task 42 step 7. The terms
            are in section 13 of docs/DATA-SOURCES.md. The credit is in the words that BibleProject gives, section 17.3. */}
        <section aria-labelledby="sources-videos">
          <h2 id="sources-videos">Videos</h2>
          <p>
            Each book has a link to a video about the book. The link is in “About this book”. The videos are by BibleProject, and each link opens
            a video on YouTube. A video gives the view of BibleProject. The introductions of this site do not come from the videos. BibleProject
            has no connection with this site.
          </p>
          <p>BibleProject also has a video about each part of the Bible:</p>
          <ul className="sources-video-links">
            <li>
              <SummaryLink id={SUMMARY_VIDEOS.oldTestament} words="Old Testament overview" />
            </li>
            <li>
              <SummaryLink id={SUMMARY_VIDEOS.newTestament} words="New Testament overview" />
            </li>
          </ul>
          <VideoCredit />
        </section>

        <section aria-labelledby="sources-fonts">
          <h2 id="sources-fonts">Fonts</h2>
          <ul>
            <li>
              Inrond (https://github.com/Hairline-UI/inrond), based on Inter. Copyright 2026 The Inrond Project Authors. Copyright (c) 2016
              The Inter Project Authors (https://github.com/rsms/inter). The site uses a changed copy of Inrond: the roundness of the corners
              is set to 20 of 100, and the files have only the Latin characters. Under the{' '}
              <a href={`${LICENSES}OFL-inrond.txt`}>SIL Open Font License, Version 1.1</a>.
            </li>
            <li>
              Lora. Copyright 2011 The Lora Project Authors (https://github.com/cyrealtype/Lora-Cyrillic), with Reserved Font Name "Lora". Under the{' '}
              <a href={`${LICENSES}OFL-lora.txt`}>SIL Open Font License, Version 1.1</a>.
            </li>
          </ul>
        </section>
      </main>
    </div>
  )
}

/** A link to a summary video: it opens in a new tab, with the name of section 17.3 for a screen reader. */
function SummaryLink({ id, words }: { id: string; words: string }) {
  return (
    <a href={videoHref(id)} target="_blank" rel="noopener noreferrer" aria-label={`${words}, on YouTube, in a new tab`}>
      {words}
    </a>
  )
}
