// The Sources page: the translation and a credit for each source. docs/TASKS.md Task 6.
// The conditions of each licence are in docs/DATA-SOURCES.md. The sources of the book
// introductions are in docs/CONTENT-SOURCES.md.
// The look of the Reference section: docs/DESIGN.md section 7.8, docs/TASKS.md Task 15 step 9.
// Task 17 changes the fonts section.

import { useEffect } from 'react'
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

        <section aria-labelledby="sources-text">
          <h2 id="sources-text">The Bible text</h2>
          <p>
            The text on this site is the <a href="https://berean.bible/">Berean Standard Bible</a> (BSB). The Berean Standard Bible is in the public
            domain. The publisher placed it in the public domain on April 30, 2023, with the{' '}
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

        <section aria-labelledby="sources-fonts">
          <h2 id="sources-fonts">Fonts</h2>
          <ul>
            <li>
              Cormorant Garamond. Copyright 2015 The Cormorant Project Authors (github.com/CatharsisFonts/Cormorant). Under the{' '}
              <a href={`${LICENSES}OFL-cormorant-garamond.txt`}>SIL Open Font License, Version 1.1</a>.
            </li>
            <li>
              Newsreader. Copyright 2020 The Newsreader Project Authors (http://github.com/productiontype/Newsreader). Under the{' '}
              <a href={`${LICENSES}OFL-newsreader.txt`}>SIL Open Font License, Version 1.1</a>.
            </li>
          </ul>
        </section>
      </main>
    </div>
  )
}
