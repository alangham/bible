// Builds the study notes of the site from the Aquifer Open Study Notes: public/data/study/.
// docs/TASKS.md Task 48 steps 5 and 6, docs/DESIGN.md sections 20.3, 20.4, and 20.5.
//
// Usage: node scripts/build-study-notes.mjs
//
// Node 22.18 or newer: the script imports the TypeScript file src/data/studyGroups.ts, and Node removes its types
// from version 22.18. An older Node stops at the import with an error. The build of Task 49 used Node 22.20.0.
//
// The script reads the source files in sources/aquifer/json/, with no change: 01.content.json is Genesis, and
// 66.content.json is Revelation. It checks each fact of section 20.3 and each number of section 20.5, and it stops
// with an error when one does not fit. It does not guess.
//
// The script writes:
//   public/data/study/<book id>.json: all the notes of the book, in the order of the source file, and the groups of
//   blocks with a note: section 20.8, Task 49. The two rules of section 20.8 are in src/data/studyGroups.ts.
//   public/data/study/about-psalms.json: the 132 psalms with no Biblica note, each with its note. Section 20.5.
//
// The form of a note in the files:
//   { "id": "24356", "from": [3, 1], "to": [3, 8], "c": [...] }, and "title": true for a title note.
//   "c" is the content, as a list of nodes. A node is a string of text, or an element: a list with the name of the
//   element first and its nodes after it, for example ["p", "The ", ["em", "LORD"], " is ..."]. The names are only
//   those of point 1 of section 20.3: p, ul, ol, li, em, strong, sup, br. An element has no attribute. So the page
//   makes each element itself, and it never puts a string of a file into the page as HTML.
//
// The format of the content, section 20.3, with no other change:
//   1. The page keeps p, ul, ol, li, em, strong, sup, and br, with no attribute.
//   2. Each data, span, and a tag is removed. The words between the tags stay.
//   3. An element with no text is removed. A br has no text by its nature, and it stays.
//   4. &apos; becomes ', &quot; becomes ", and &nbsp; becomes U+00A0.
// Two strings next to each other in an element become one string. This changes no character of the text.
//
// The links of section 22, Task 55. A data tag of the source is removed by point 2, with two exceptions:
//   ["ref", {"b": "romans", "c": 7, "v": 23}, "7:23"]: a passage link, from a bible-ref tag, by rule 1 of section
//   22.3. A passage of more than one verse has "c2" and "v2" also. A link of rule 2 of section 22.4 has "first": true.
//   ["note", {"b": "romans", "id": "25719", "c": 6, "v": 19}, "study note on 6:19"]: a note link, from a resource-ref
//   tag, by rule 3 of section 22.3. "b" is the book of the note, and "id" is its number. "c" and "v" are the chapter
//   and the verse of the start of the range of the note on the site, for the href of the link: section 22.11.
// The nodes after the object are the words between the tags, with no change. Each other bible-ref tag and resource-ref
// tag is removed, and its words stay plain text: rules 2 and 4 of section 22.3. No other element has an object.
//
// The script prints the numbers of sections 20.3 and 20.5 and the two SHA-256. Two runs give the same bytes.

import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { alignBlocks, groupOfNote, groupsOfChapter } from '../src/data/studyGroups.ts'

const ROOT = join(import.meta.dirname, '..')
const SOURCE = join(ROOT, 'sources', 'aquifer', 'json')
const OUT = join(ROOT, 'public', 'data', 'study')
const books = JSON.parse(readFileSync(join(ROOT, 'public', 'data', 'books.json'), 'utf8'))

function fail(message) {
  throw new Error(`build-study-notes: ${message}`)
}

const KEPT = new Set(['p', 'ul', 'ol', 'li', 'em', 'strong', 'sup', 'br'])
const REMOVED_TAGS = new Set(['data', 'span', 'a'])
const ALL = new Set([...KEPT, ...REMOVED_TAGS, 'h3'])
const VOID = new Set(['br'])
const ENTITIES = { '&apos;': "'", '&quot;': '"', '&nbsp;': ' ' }
const decode = (s) => s.replace(/&[^;\s]*;/g, (e) => ENTITIES[e] ?? fail(`the character reference ${e}`))

// ---- the parse of a content: a tree of elements and text ----

/** The tree of a content. Each element must close, in order. */
function parse(content, where) {
  const root = { name: '#root', children: [] }
  const stack = [root]
  const TOKEN = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s[^>]*)?)>|([^<]+)|(<)/g
  for (const m of content.matchAll(TOKEN)) {
    if (m[5]) fail(`${where}: a < that is not a tag`)
    if (m[4] !== undefined) {
      if (m[4].includes('>')) fail(`${where}: a > in the text`)
      stack.at(-1).children.push(m[4])
      continue
    }
    const [, close, rawName, rest] = m
    const name = rawName.toLowerCase()
    if (!ALL.has(name)) fail(`${where}: the element <${name}>`)
    if (close) {
      if (VOID.has(name)) fail(`${where}: </${name}>`)
      const open = stack.pop()
      if (open.name !== name) fail(`${where}: </${name}> closes <${open.name}>`)
      continue
    }
    const element = { name, attributes: rest.trim(), children: [] }
    stack.at(-1).children.push(element)
    if (!VOID.has(name) && !rest.trim().endsWith('/')) stack.push(element)
  }
  if (stack.length !== 1) fail(`${where}: <${stack.at(-1).name}> does not close`)
  return root.children
}

const rawText = (nodes) => nodes.map((n) => (typeof n === 'string' ? n : rawText(n.children))).join('')

/** The nodes of the site from the nodes of the source, by the four points. */
function convert(nodes, where, counts) {
  const out = []
  const push = (node) => {
    if (typeof node === 'string' && typeof out.at(-1) === 'string') out[out.length - 1] += node
    else out.push(node)
  }
  for (const n of nodes) {
    if (typeof n === 'string') {
      push(decode(n))
      continue
    }
    counts[n.name] = (counts[n.name] ?? 0) + 1
    if (n.name === 'h3') {
      if (rawText(n.children) !== '') fail(`${where}: an <h3> with text`)
      counts.emptyH3++
      continue
    }
    // An empty p of section 20.3 has no content. Two more p elements have only a br: point 3 removes them also.
    if (n.name === 'p' && n.children.length === 0) counts.emptyP++
    if (n.name === 'p' && n.children.length && rawText(n.children) === '') counts.brOnlyP = (counts.brOnlyP ?? 0) + 1
    const children = convert(n.children, where, counts)
    if (n.name === 'data') {
      const link = linkOf(n, where)
      if (link) {
        if (textOf(children) === '') fail(`${where}: a link with no words`)
        if (JSON.stringify(children).includes('{')) fail(`${where}: a link inside a link`)
        out.push([link.kind, link.object, ...children])
        continue
      }
    }
    if (REMOVED_TAGS.has(n.name)) {
      for (const c of children) push(c)
      continue
    }
    if (n.name === 'br') {
      if (n.children.length) fail(`${where}: a <br> with content`)
      out.push(['br'])
      continue
    }
    // Point 3: an element with no text is removed.
    if (textOf(children) === '') {
      counts.removedEmpty++
      continue
    }
    out.push([n.name, ...children])
  }
  return out
}

/** The nodes of an element after its name: after the object also, for a link of section 22.5. */
const childrenOf = (n) => n.slice(n[1] !== null && typeof n[1] === 'object' && !Array.isArray(n[1]) ? 2 : 1)

/** The text of the nodes of the site: each string, with no tag. The object of a link has no text. */
function textOf(nodes) {
  return nodes.map((n) => (typeof n === 'string' ? n : textOf(childrenOf(n)))).join('')
}

/** The words of a content, when a tag counts as a space: section 20.5. */
const words = (content) => decode(content.replace(/<[^>]*>/g, ' ')).split(/\s+/).filter(Boolean).length

// ---- section 22: the two tags of the source that become links ----

/** The attributes of a tag, from the text after its name. */
function attributesOf(text, where) {
  const out = {}
  const rest = text.replace(/([a-z-]+)="([^"]*)"/g, (_, k, v) => {
    out[k] = v
    return ''
  })
  if (rest.trim() !== '') fail(`${where}: an attribute that the script cannot read: ${text}`)
  return out
}

/**
 * The verses of each chapter of a book in the Berean data: each verse number of a text block, and each verse that the
 * data has only as a note, an item with "o". The pop-up shows such a verse with its note, as built for all links. Three
 * references of the source end at such a verse: Mark 9:44, Mark 9:46, and Mark 11:26.
 */
const bereanVerses = new Map()
function versesOfBook(id) {
  if (!bereanVerses.has(id)) {
    const text = JSON.parse(readFileSync(join(ROOT, 'public', 'data', 'text', `${id}.json`), 'utf8'))
    const chapters = new Map()
    for (const ch of text.chapters) {
      const set = new Set()
      for (const block of ch.blocks) if (block.k === 'p') for (const item of block.c) if (item && typeof item === 'object') {
            if (typeof item.v === 'number') set.add(item.v)
            if (typeof item.o === 'number') set.add(item.o)
          }
      chapters.set(ch.n, { set, last: Math.max(...set) })
    }
    bereanVerses.set(id, chapters)
  }
  return bereanVerses.get(id)
}
const isVerse = (book, c, v) => versesOfBook(book.id).get(c)?.set.has(v) === true

/** The book of each note of the source, by its number. Filled from the 66 files before the convert. */
const bookOfNote = new Map()

/** The numbers of section 22. Each tag of the source counts one time. */
const links = {
  passage: 0,
  allVerses: 0,
  first: 0,
  wholeChapters: 0,
  twoChapters: 0,
  plainRef: { twoBooks: 0, endNotInBerean: 0, startNotInBerean: 0, endBeforeStart: 0 },
  note: 0,
  noteSameBook: 0,
  noteOtherBook: 0,
  plainResource: {},
  tagsInside: {},
}

const REF = /^(\d{2})(\d{3})(\d{3})$/

/** The link of a data tag, or null when its words stay plain text. Rules 1 to 4 of section 22.3, rules 1 and 2 of 22.4. */
function linkOf(n, where) {
  const a = attributesOf(n.attributes, where)
  if (a.class === 'bible-ref') {
    for (const c of n.children) if (typeof c !== 'string') links.tagsInside[c.name] = (links.tagsInside[c.name] ?? 0) + 1
    const s = REF.exec(a['data-start-ref'] ?? '')
    const e = REF.exec(a['data-end-ref'] ?? '')
    if (!s || !e) fail(`${where}: a bible-ref tag with the ends ${a['data-start-ref']} ${a['data-end-ref']}`)
    if (s[1] !== e[1]) {
      links.plainRef.twoBooks++
      return null
    }
    const book = books[Number(s[1]) - 1]
    if (!book) fail(`${where}: the book ${s[1]}`)
    const [c, v, c2, v2] = [s[2], s[3], e[2], e[3]].map(Number)
    if (!isVerse(book, c, v)) {
      links.plainRef.startNotInBerean++
      return null
    }
    if (!isVerse(book, c2, v2)) {
      links.plainRef.endNotInBerean++
      return null
    }
    if (c2 < c || (c2 === c && v2 < v)) {
      links.plainRef.endBeforeStart++
      return null
    }
    links.passage++
    const object = { b: book.id, c, v }
    if (c2 !== c || v2 !== v) Object.assign(object, { c2, v2 })
    // Rule 2 of section 22.4: one whole chapter or more, or two ends in two chapters. A whole chapter starts at verse 1
    // and ends at the last verse of the chapter in the Berean data.
    const whole = v === 1 && v2 === versesOfBook(book.id).get(c2).last
    if (whole) links.wholeChapters++
    else if (c2 !== c) links.twoChapters++
    if (whole || c2 !== c) {
      object.first = true
      links.first++
    } else links.allVerses++
    return { kind: 'ref', object }
  }
  if (a.class === 'resource-ref') {
    const code = a['data-resource-code']
    const id = a['data-content-id']
    if (code === 'AquiferOpenStudyNotes' && bookOfNote.has(id)) {
      links.note++
      const b = bookOfNote.get(id)
      if (where.startsWith(`${String(books.findIndex((x) => x.id === b) + 1).padStart(2, '0')}.`)) links.noteSameBook++
      else links.noteOtherBook++
      return { kind: 'note', object: { b, id } }
    }
    const key = code === 'AquiferOpenStudyNotes' ? 'AquiferOpenStudyNotes, not a note of the site' : code
    links.plainResource[key] = (links.plainResource[key] ?? 0) + 1
    return null
  }
  fail(`${where}: a data tag of the class ${a.class}`)
}

/** Stops on an object that is not the object of a link of section 22.5, or that has a different key. */
const KEYS = { ref: ['b', 'c', 'v', 'c2', 'v2', 'first'], note: ['b', 'id', 'c', 'v'] }
const isObject = (x) => x !== null && typeof x === 'object' && !Array.isArray(x)
function checkObjects(nodes, where) {
  for (const n of nodes) {
    if (typeof n === 'string') continue
    const rest = n.slice(1)
    if (rest.length && isObject(rest[0])) {
      const keys = KEYS[n[0]]
      if (!keys) fail(`${where}: the element ${n[0]} has an object`)
      for (const k of Object.keys(rest[0])) if (!keys.includes(k)) fail(`${where}: the key ${k} in the object of ${n[0]}`)
      if (rest.slice(1).some(isObject)) fail(`${where}: two objects in one element`)
      checkObjects(rest.slice(1), where)
    } else {
      if (KEYS[n[0]]) fail(`${where}: the element ${n[0]} has no object`)
      if (rest.some(isObject)) fail(`${where}: an object that is not after the name`)
      checkObjects(rest, where)
    }
  }
}

// ---- read and check the 66 files ----

const files = readdirSync(SOURCE).filter((f) => /^\d{2}\.content\.json$/.test(f)).sort()
if (files.length !== 66 || files.some((f, i) => f !== `${String(i + 1).padStart(2, '0')}.content.json`)) fail('the folder does not have the 66 files 01 to 66')

const counts = { emptyH3: 0, emptyP: 0, removedEmpty: 0 }
const kinds = { verse: 0, chapter: 0, chapters: 0, psalm: 0 }
const ids = new Set()
const titleNotes = []
const exceptions = []
const lines = []
const result = []
const wordsOf = new Map()

const sources = files.map((file) => JSON.parse(readFileSync(join(SOURCE, file), 'utf8')))
for (const [i, source] of sources.entries()) if (Array.isArray(source)) for (const note of source) bookOfNote.set(note.content_id, books[i].id)

for (const [i, file] of files.entries()) {
  const book = books[i]
  const bookNumber = String(i + 1).padStart(2, '0')
  const source = sources[i]
  if (!Array.isArray(source)) fail(`${file}: not a list of notes`)
  const notes = []
  for (const note of source) {
    const where = `${file} ${note.content_id}`
    const { content_id: id, title, index_reference: ref, content } = note
    if (typeof id !== 'string' || !/^\d+$/.test(id)) fail(`${where}: content_id`)
    if (ids.has(id)) fail(`${where}: the content_id occurs two times`)
    ids.add(id)
    if (typeof content !== 'string' || typeof title !== 'string') fail(`${where}: content or title`)
    if (/[\n\t]/.test(content)) fail(`${where}: a line feed or a tab in the content`)
    const m = /^(\d{2})(\d{3})(\d{3})(?:-(\d{2})(\d{3})(\d{3}))?$/.exec(ref ?? '')
    if (!m) fail(`${where}: index_reference ${ref}`)
    if (m[1] !== bookNumber || (m[4] !== undefined && m[4] !== bookNumber)) fail(`${where}: not in the book of its file`)
    let from = [Number(m[2]), Number(m[3])]
    let to = m[4] === undefined ? from : [Number(m[5]), Number(m[6])]
    if (from[0] > to[0] || (from[0] === to[0] && from[1] > to[1])) fail(`${where}: the range ends before it starts`)
    if (from[0] < 1 || to[0] > book.chapters) fail(`${where}: a chapter that ${book.name} does not have`)
    let isTitle = false
    if (m[4] === undefined) kinds.verse++
    else if (from[0] !== to[0]) kinds.chapters++
    else if (to[1] !== 999) kinds.chapter++
    else if (from[1] === 1 && book.id === 'psalms') {
      kinds.psalm++
      if (title.endsWith(':title')) {
        isTitle = true
        titleNotes.push(from[0])
      } else if (id === '24105' && title === 'Psalms 142:7') {
        // The one exception of section 20.3: a fault of the source. The site uses verse 7.
        from = [142, 7]
        to = [142, 7]
        exceptions.push(id)
      } else fail(`${where}: a range from verse 1 to verse 999 that is not a title note`)
    } else fail(`${where}: a range in one chapter that ends at verse 999`)

    const tree = parse(content, where)
    const c = convert(tree, where, counts)
    checkObjects(c, where)
    const text = decode(content.replace(/<[^>]*>/g, ''))
    // The text of the nodes is the text of the note: the format changed, and no character changed.
    if (textOf(c) !== text) fail(`${where}: the text of the nodes is not the text of the note`)
    if (/[<>&]/.test(text.replace(/[ ]/g, ''))) fail(`${where}: a character < > or & in the text`)
    lines.push(`${id}\t${text}`)
    wordsOf.set(id, words(content))
    notes.push({ id, from, to, ...(isTitle ? { title: true } : {}), c })
  }
  result.push({ book: book.id, notes })
}

// ---- section 22.11: the start of the range of the note of each note link ----

// The convert gives a note link its book and its number. Its "c" and "v" come after all notes have their range, because
// a note link can point to a note later in the files. The start is that of the site: for the exception 24105 it is
// Psalms 142:7. about-psalms.json has the same objects, so it gets the same keys.
const startOf = new Map(result.flatMap((r) => r.notes.map((n) => [n.id, n.from])))
let startsAdded = 0
const addStarts = (nodes) => {
  for (const n of nodes) {
    if (typeof n === 'string') continue
    if (n[0] === 'note') {
      const from = startOf.get(n[1].id)
      if (!from) fail(`the note link to ${n[1].id}: no note of the site`)
      n[1].c = from[0]
      n[1].v = from[1]
      startsAdded++
    }
    addStarts(childrenOf(n))
  }
}
for (const r of result) for (const note of r.notes) addStarts(note.c)
if (startsAdded !== links.note) fail(`${startsAdded} note links got a start, and the convert made ${links.note}`)
for (const r of result) for (const note of r.notes) checkObjects(note.c, note.id)

// ---- the facts of section 20.3 ----

const total = ids.size
const facts = [
  ['notes', total, 16923],
  ['notes with one verse', kinds.verse, 10581],
  ['notes with a range in one chapter', kinds.chapter, 6012],
  ['notes with a range of more than one chapter', kinds.chapters, 322],
  ['notes from verse 1 to verse 999 of one psalm', kinds.psalm, 8],
  ['title notes', titleNotes.join(','), '7,9,30,51,57,73,89'],
  ['the exception', exceptions.join(','), '24105'],
  ['h3 elements, all empty', `${counts.h3 ?? 0} ${counts.emptyH3}`, '6 6'],
  ['a elements', counts.a ?? 0, 1],
  ['empty p elements', counts.emptyP, 20],
]
for (const [name, got, want] of facts) if (got !== want) fail(`${name}: ${got}, and section 20.3 says ${want}`)

const studyText = Buffer.from(lines.map((l) => `${l}\n`).join(''), 'utf8')
const studySha = createHash('sha256').update(studyText).digest('hex')

// ---- section 20.5: the psalms in "About this chapter" ----

/** The last verse of each psalm in the Berean data. */
const psalmText = JSON.parse(readFileSync(join(ROOT, 'public', 'data', 'text', 'psalms.json'), 'utf8'))
const lastVerse = new Map()
const findVerses = (x, found) => {
  if (Array.isArray(x)) for (const y of x) findVerses(y, found)
  else if (x && typeof x === 'object') {
    if (typeof x.v === 'number') found.push(x.v)
    for (const v of Object.values(x)) if (typeof v === 'object') findVerses(v, found)
  }
  return found
}
for (const ch of psalmText.chapters) lastVerse.set(ch.n, Math.max(...findVerses(ch.blocks, [])))
if (lastVerse.size !== 150) fail('the Berean data does not have 150 psalms')

/** The psalms with a Biblica note: the rule of section 19.5, from public/data/notes/psalms.json. */
const biblica = JSON.parse(readFileSync(join(ROOT, 'public', 'data', 'notes', 'psalms.json'), 'utf8')).notes
const hasBiblica = (p) => biblica.some((n) => n.from[0] <= p && p <= n.to[0])

const before = (a, b) => a[0] < b[0] || (a[0] === b[0] && a[1] <= b[1])
const psalmNotes = result.find((r) => r.book === 'psalms').notes
const about = []
for (let p = 1; p <= 150; p++) {
  if (hasBiblica(p)) continue
  // Rule 1: the notes whose range has each verse of the psalm. A title note is not in the list.
  const candidates = psalmNotes.filter((n) => !n.title && before(n.from, [p, 1]) && before([p, lastVerse.get(p)], n.to))
  if (!candidates.length) fail(`Psalms ${p}: no note has each verse of the psalm`)
  // Rule 2: the note whose range has the smallest number of chapters. Two such notes stop the script.
  const span = (n) => n.to[0] - n.from[0] + 1
  const least = Math.min(...candidates.map(span))
  const best = candidates.filter((n) => span(n) === least)
  if (best.length > 1) fail(`Psalms ${p}: ${best.length} notes have the smallest number of chapters: ${best.map((n) => n.id).join(', ')}`)
  about.push({ psalm: p, ...best[0] })
}

const exact = about.filter((a) => a.from[0] === a.psalm && a.to[0] === a.psalm && a.from[1] === 1 && a.to[1] === lastVerse.get(a.psalm))
const distinct = new Set(about.map((a) => a.id))
const psalmLines = about.map((a) => `${a.psalm}\t${a.id}\n`).join('')
const psalmSha = createHash('sha256').update(Buffer.from(psalmLines, 'utf8')).digest('hex')
const range = (a) => `${a.from[0]}:${a.from[1]}-${a.to[0]}:${a.to[1]}`
const psalmWords = about.map((a) => wordsOf.get(a.id)).sort((x, y) => x - y)
const noteWords = [...distinct].map((id) => wordsOf.get(id)).sort((x, y) => x - y)
const median = (list) => (list.length % 2 ? list[(list.length - 1) / 2] : (list[list.length / 2 - 1] + list[list.length / 2]) / 2)

const facts205 = [
  ['psalms with an Aquifer note', about.length, 132],
  ['psalms with a note for exactly the psalm', exact.length, 129],
  ['the note of Psalms 9', range(about.find((a) => a.psalm === 9)), '9:1-10:18'],
  ['the notes of Psalms 42 and 43', `${range(about.find((a) => a.psalm === 42))} ${range(about.find((a) => a.psalm === 43))}`, '42:1-43:5 42:1-43:5'],
  ['different notes', distinct.size, 131],
  ['SHA-256 of the psalms', psalmSha, '651b7fe88ce7ff10d006247efe364b5f58807fe86f19dbbb5f0f497ae01b3b07'],
  ['words of the shortest note', noteWords[0], 7],
  ['words of the longest note', noteWords.at(-1), 151],
]

// ---- section 20.8: the groups of blocks, and the group of blocks of each note ----

const TRANSLATIONS = [
  ['bsb', 'text'],
  ['kjv', 'text-kjv'],
  ['web', 'text-web'],
]
const aboutOf = new Map(about.map((a) => [a.psalm, a.id]))
const groupStats = { notes: 0, onlyAbout: 0, groups: 0, oneVerse: 0, perChapter: new Map(), most: [], missing: [] }
for (const [i, r] of result.entries()) {
  const book = books[i]
  const texts = TRANSLATIONS.map(([, folder]) => JSON.parse(readFileSync(join(ROOT, 'public', 'data', folder, `${book.id}.json`), 'utf8')))
  const groups = []
  for (const chapter of texts[0].chapters) {
    const blocks = chapter.blocks
    const chapterGroups = groupsOfChapter(blocks)
    // The Berean block of each block of the two other translations: src/data/studyGroups.ts alignBlocks.
    const aligned = texts.slice(1).map((t) => alignBlocks(t.chapters.find((c) => c.n === chapter.n).blocks, blocks))
    const notesOf = new Map()
    for (const note of r.notes) {
      if (note.from[0] !== chapter.n) continue
      const aboutHere = book.id === 'psalms' && aboutOf.get(chapter.n) === note.id
      const g = groupOfNote(note, chapterGroups, aboutHere)
      if (g === null) {
        groupStats.onlyAbout++
        continue
      }
      groupStats.notes++
      if (!notesOf.has(g)) notesOf.set(g, [])
      notesOf.get(g).push(note.id)
    }
    for (const [g, ids] of [...notesOf].sort((a, b) => a[0] - b[0])) {
      const { start, end, verses } = chapterGroups[g]
      // The last block of the group of blocks on the page of each translation. Null when the page of a translation
      // has no block of the group: the rule of section 13.4 for links, applied to the notes. This is Romans 16:25 to
      // 16:27 on the World English Bible pages only. The script checks that no other group of blocks has null.
      const ends = aligned.map((map, t) => {
        const last = map.findLastIndex((j) => j >= start && j <= end)
        if (last < 0) groupStats.missing.push(`${TRANSLATIONS[t + 1][0]} ${book.name} ${chapter.n}:${verses[0]}-${verses.at(-1)} (${ids.length} notes)`)
        return last < 0 ? null : last
      })
      groups.push({ c: chapter.n, v: [verses[0], verses.at(-1)], end: { bsb: end, kjv: ends[0], web: ends[1] }, notes: ids })
      groupStats.groups++
      if (new Set(verses).size === 1) groupStats.oneVerse++
      groupStats.most.push([`${book.name} ${chapter.n}:${verses[0]}-${verses.at(-1)}`, ids.length])
      const key = `${book.name} ${chapter.n}`
      groupStats.perChapter.set(key, (groupStats.perChapter.get(key) ?? 0) + 1)
    }
  }
  r.groups = groups
}
const chapterCounts = [...groupStats.perChapter.values()].sort((a, b) => a - b)
const allChapters = books.flatMap((b) => Array.from({ length: b.chapters }, (_, i) => `${b.name} ${i + 1}`))
const most = groupStats.most.sort((a, b) => b[1] - a[1])
const facts208 = [
  ['notes in the groups of blocks', groupStats.notes, 16792],
  ['notes only in "About this chapter"', groupStats.onlyAbout, 131],
  ['groups of blocks with a note', groupStats.groups, 10562],
  ['groups of blocks with a note and one verse', groupStats.oneVerse, 3663],
  ['chapters with a group of blocks with a note', groupStats.perChapter.size, 1186],
  ['chapters with none', allChapters.filter((k) => !groupStats.perChapter.has(k)).join(', '), 'Exodus 36, Psalms 108, Psalms 123'],
  ['median of the 1,186 chapters', median(chapterCounts), 8],
  ['Mark 14, Matthew 26, Luke 22', ['Mark 14', 'Matthew 26', 'Luke 22'].map((k) => groupStats.perChapter.get(k)).join(' '), '35 32 31'],
  ['groups of blocks that the page of a translation does not have', groupStats.missing.join('; '), 'web Romans 16:25-27 (3 notes)'],
  ['the group of blocks with the most notes', `${most[0][0]} ${most[0][1]}, then ${most[1][1]}`, 'Exodus 20:3-17 15, then 10'],
]
for (const [name, got, want] of facts208) if (got !== want) fail(`${name}: ${got}, and section 20.8 says ${want}`)

// ---- section 22: the numbers of sections 22.2, 22.3, and 22.4 ----

const plainRefs = Object.values(links.plainRef).reduce((x, y) => x + y, 0)
const plainResources = Object.values(links.plainResource).reduce((x, y) => x + y, 0)
const facts22 = [
  ['bible-ref tags', links.passage + plainRefs, 39112],
  ['passage links', links.passage, 39103],
  ['plain bible-ref tags', plainRefs, 9],
  ['plain bible-ref tags: two books, end not in the Berean data, start not in the Berean data, end before start', Object.values(links.plainRef).join(' '), '5 3 1 0'],
  ['bible-ref tags with a tag inside', Object.values(links.tagsInside).reduce((x, y) => x + y, 0), 6],
  ['resource-ref tags', links.note + plainResources, 1244],
  ['note links', links.note, 1123],
  ['note links to the same book, to a different book', `${links.noteSameBook} ${links.noteOtherBook}`, '918 205'],
  ['plain resource-ref tags', plainResources, 121],
  ['plain resource-ref tags: themes, profiles, book introductions', ['AquiferOpenStudyNotesThemes', 'AquiferOpenStudyNotesProfiles', 'AquiferOpenStudyNotesBookIntros'].map((k) => links.plainResource[k] ?? 0).join(' '), '92 25 4'],
  ['links with all verses', links.allVerses, 37132],
  ['links with "first": true', links.first, 1971],
  ['links of one whole chapter or more, links with ends in two chapters', `${links.wholeChapters} ${links.twoChapters}`, '1614 357'],
]

// ---- write the files ----

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })
let bytes = 0
let gzipBytes = 0
const write = (name, data) => {
  const text = `${JSON.stringify(data)}\n`
  writeFileSync(join(OUT, name), text)
  bytes += statSync(join(OUT, name)).size
  gzipBytes += gzipSync(text, { level: 9 }).length
}
for (const r of result) write(`${r.book}.json`, r)
write('about-psalms.json', { psalms: about.map(({ psalm, id, from, to, c }) => ({ psalm, id, from, to, c })) })

// ---- print ----

console.log('==== Section 20.3')
console.log('notes', total, JSON.stringify(kinds))
console.log('title notes in psalms', titleNotes.join(', '), '; the exception', exceptions.join(', '))
console.log('elements', JSON.stringify(Object.fromEntries(Object.entries(counts).filter(([k]) => ALL.has(k)).sort())))
console.log('empty h3', counts.emptyH3, '; empty p', counts.emptyP, '; p with no text and a child', counts.brOnlyP, '; elements removed by point 3', counts.removedEmpty)
console.log('bytes of the text of the SHA-256', studyText.length)
console.log('SHA-256 of the notes', studySha)
console.log('==== Section 20.5')
for (const [name, got] of facts205) console.log(name, got)
console.log('median words: of the 132 psalms', median(psalmWords), '; of the 131 notes', median(noteWords))
console.log('==== Section 20.8')
for (const [name, got] of facts208) console.log(name, got)
console.log('==== Section 22')
for (const [name, got] of facts22) console.log(name, got)
console.log('tags inside a bible-ref tag', JSON.stringify(links.tagsInside), '; plain resource-ref tags', JSON.stringify(links.plainResource))
console.log('==== Output')
console.log('files', result.length + 1, 'in public/data/study, bytes', bytes, ', with gzip', gzipBytes)

// The numbers that must be those of docs/DESIGN.md. A difference stops the script after the print.
const differ = [
  ...[['bytes of the text of the SHA-256', studyText.length, 4584237], ['SHA-256 of the notes', studySha, '8f5f57da1f500459091552bb4806747e6ee811c2779f23dd735b1c4a783e0ae1']],
  ...facts205.map(([name, got]) => [name, got, facts205.find((f) => f[0] === name)[2]]),
  ['median words', `${median(psalmWords)} ${median(noteWords)}`, null],
].filter(([, got, want]) => want !== null && got !== want)
// The median of section 20.5 is that of the 131 different notes.
const medianOk = median(noteWords) === 41
for (const [name, got, want] of differ) console.log(`DIFFERENT: ${name}: ${got}, and docs/DESIGN.md says ${want}`)
if (!medianOk) console.log('DIFFERENT: median words of the 131 notes, and section 20.5 says 41')
const differ22 = facts22.filter(([, got, want]) => got !== want)
for (const [name, got, want] of differ22) console.log(`DIFFERENT: ${name}: ${got}, and section 22 says ${want}`)
if (differ.length || !medianOk || differ22.length) fail('a number differs from docs/DESIGN.md')
console.log('Each number of sections 20.3, 20.5, 20.8, and 22 is that of docs/DESIGN.md.')
