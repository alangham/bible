// Builds the study notes of the site from the Aquifer Open Study Notes: public/data/study/.
// docs/TASKS.md Task 48 steps 5 and 6, docs/DESIGN.md sections 20.3, 20.4, and 20.5.
//
// Usage: node scripts/build-study-notes.mjs
//
// The script reads the source files in sources/aquifer/json/, with no change: 01.content.json is Genesis, and
// 66.content.json is Revelation. It checks each fact of section 20.3 and each number of section 20.5, and it stops
// with an error when one does not fit. It does not guess.
//
// The script writes:
//   public/data/study/<book id>.json: all the notes of the book, in the order of the source file.
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
// The script prints the numbers of sections 20.3 and 20.5 and the two SHA-256. Two runs give the same bytes.

import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

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

/** The text of the nodes of the site: each string, with no tag. */
function textOf(nodes) {
  return nodes.map((n) => (typeof n === 'string' ? n : textOf(n.slice(1)))).join('')
}

/** The words of a content, when a tag counts as a space: section 20.5. */
const words = (content) => decode(content.replace(/<[^>]*>/g, ' ')).split(/\s+/).filter(Boolean).length

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

for (const [i, file] of files.entries()) {
  const book = books[i]
  const bookNumber = String(i + 1).padStart(2, '0')
  const source = JSON.parse(readFileSync(join(SOURCE, file), 'utf8'))
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
if (differ.length || !medianOk) fail('a number differs from docs/DESIGN.md')
console.log('Each number of sections 20.3 and 20.5 is that of docs/DESIGN.md.')
