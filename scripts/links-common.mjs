// Shared by scripts/build-links.mjs and the unit tests: the book codes of the sources,
// the reading of the OpenBible.info file, and the read-with rule of docs/DESIGN.md section 4.5.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/** OpenBible.info book codes, in Bible order. */
export const OSIS = 'Gen Exod Lev Num Deut Josh Judg Ruth 1Sam 2Sam 1Kgs 2Kgs 1Chr 2Chr Ezra Neh Esth Job Ps Prov Eccl Song Isa Jer Lam Ezek Dan Hos Joel Amos Obad Jonah Mic Nah Hab Zeph Hag Zech Mal Matt Mark Luke John Acts Rom 1Cor 2Cor Gal Eph Phil Col 1Thess 2Thess 1Tim 2Tim Titus Phlm Heb Jas 1Pet 2Pet 1John 2John 3John Jude Rev'.split(' ')
/** USFM book codes, in Bible order. */
export const USFM = 'GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM EZK DAN HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV'.split(' ')

const ref = (s) => {
  const m = /^(\w+)\.(\d+)\.(\d+)$/.exec(s)
  return m ? { b: OSIS.indexOf(m[1]), c: +m[2], v: +m[3] } : null
}

/**
 * The OpenBible.info links. A row and its reverse are one link, with the higher votes. Rows that cross
 * two books, and rows with a verse that the Bible text does not have, are left out (Arthur, 2026-11-14).
 * `verses` holds "book index:chapter:verse" for each verse of the Bible text.
 */
export function readOpenBible(root, verses) {
  const links = new Map()
  const leftOut = []
  for (const line of readFileSync(join(root, 'sources/openbible/cross_references.txt'), 'utf8').split(/\r?\n/).slice(1)) {
    if (!line.trim()) continue
    const [f, t, v] = line.split('\t')
    const [t1, t2] = t.split('-')
    const a = ref(f)
    const b = ref(t1)
    const e = t2 ? ref(t2) : null
    if (!a || !b || a.b < 0 || b.b < 0 || (t2 && (!e || e.b !== b.b))) {
      leftOut.push(`${line} (crosses two books)`)
      continue
    }
    const keyOf = (p) => `${p.b}:${p.c}:${p.v}`
    if (!verses.has(keyOf(a)) || !verses.has(keyOf(b)) || (e && !verses.has(keyOf(e)))) {
      leftOut.push(`${line} (a verse that the Bible text does not have)`)
      continue
    }
    if (e) {
      b.c2 = e.c
      b.v2 = e.v
    }
    const ka = keyOf(a)
    const kb = keyOf(b)
    // A link goes to a different passage: a row from a verse to a passage that starts at that verse is left out.
    if (ka === kb) {
      leftOut.push(`${line} (from a verse to a passage that starts at the same verse)`)
      continue
    }
    const k = ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`
    const votes = Number(v)
    const old = links.get(k)
    if (!old || votes > old.votes) links.set(k, { k, a, b, votes })
  }
  return { links, leftOut }
}

/**
 * The read-with list of each chapter: "book index:chapter" -> [{ b, c, votes, links }].
 * For a chapter and each chapter in a different book, add the votes of all links between the two
 * chapters, with 1 vote or more. A link sits in the chapter of the first verse of each end. Keep the
 * chapters with 3 links or more, and take the 5 with the highest sums. On a tie: more links first,
 * then Bible order.
 */
export function readWithLists(links) {
  const sums = new Map()
  const add = (x, y, votes) => {
    if (!sums.has(x)) sums.set(x, new Map())
    const m = sums.get(x)
    const e = m.get(y) ?? { votes: 0, links: 0 }
    e.votes += votes
    e.links += 1
    m.set(y, e)
  }
  for (const { a, b, votes } of links.values()) {
    if (votes < 1 || a.b === b.b) continue
    add(`${a.b}:${a.c}`, `${b.b}:${b.c}`, votes)
    add(`${b.b}:${b.c}`, `${a.b}:${a.c}`, votes)
  }
  const result = new Map()
  for (const [k, m] of sums) {
    const list = [...m]
      .map(([kk, e]) => {
        const [b, c] = kk.split(':').map(Number)
        return { b, c, ...e }
      })
      .filter((e) => e.links >= 3)
      .sort((x, y) => y.votes - x.votes || y.links - x.links || x.b - y.b || x.c - y.c)
      .slice(0, 5)
    if (list.length) result.set(k, list)
  }
  return result
}
