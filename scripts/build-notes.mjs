// Builds the Biblica notes of "About this chapter": public/data/notes/<book id>.json.
// docs/TASKS.md Task 47 steps 5 and 6, docs/DESIGN.md sections 19.4 and 19.5.
//
// Usage: node scripts/build-notes.mjs
//
// The script reads the source files in sources/biblica/json/, with no change: 01.content.json is Genesis, and
// 66.content.json is Revelation. It checks each fact of the list "Facts about the 66 files" of section 19.4, and it
// stops with an error when one does not fit. It does not guess.
//
// The text of a paragraph is the characters between <p> and </p>, with the three changes of the format of
// section 19.4 and no other change:
//   1. Each <data ...>, </data>, <span>, and </span> tag is removed. The words between the tags stay.
//   2. &apos; becomes the character '.
//   3. &shy; becomes the character U+00AD, the soft hyphen.
// No paragraph is trimmed, joined, or cut.
//
// The script prints the numbers of sections 19.4 and 19.5 and the SHA-256 of section 19.4. Two runs give the
// same bytes.

import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')
const SOURCE = join(ROOT, 'sources', 'biblica', 'json')
const OUT = join(ROOT, 'public', 'data', 'notes')
const books = JSON.parse(readFileSync(join(ROOT, 'public', 'data', 'books.json'), 'utf8'))

function fail(message) {
  throw new Error(`build-notes: ${message}`)
}

/** The range label of section 19.7: the name of the book, a space, and the range, with an en dash. src/data/notes.ts has the same rule. */
function rangeLabel(name, from, to) {
  return from[0] === to[0] ? `${name} ${from[0]}:${from[1]}–${to[1]}` : `${name} ${from[0]}:${from[1]}–${to[0]}:${to[1]}`
}

/** One end of the range: 2 digits for the book, 3 for the chapter, and 3 for the verse. */
function end(code, bookNumber, where) {
  const m = /^(\d{2})(\d{3})(\d{3})$/.exec(code)
  if (!m) fail(`${where}: the end ${code} is not 8 digits`)
  if (Number(m[1]) !== bookNumber) fail(`${where}: the end ${code} is not in the book of its file`)
  return [Number(m[2]), Number(m[3])]
}

/** The tags that rule 1 removes. A different tag stops the script. */
const TAG = /<[^>]*>/g
const REMOVED_TAG = /^(<data\s[^>]*>|<\/data>|<span>|<\/span>)$/

/** The paragraphs of a content, with the three changes of the format. */
function paragraphs(content, where, counts) {
  if (!content.startsWith('<p>') || !content.endsWith('</p>')) fail(`${where}: the content is not a row of <p> elements`)
  const raw = content.slice(3, -4).split('</p><p>')
  return raw.map((text, i) => {
    if (text.includes('<p') || text.includes('</p')) fail(`${where} paragraph ${i + 1}: text between the <p> elements, or a <p> in a <p>`)
    for (const tag of text.match(TAG) ?? []) {
      if (!REMOVED_TAG.test(tag)) fail(`${where} paragraph ${i + 1}: the tag ${tag} is not <p>, <data>, or <span>`)
      // Section 19.4 counts each <span> and </span> tag: 4 tags, in 2 notes.
      if (tag === '<span>' || tag === '</span>') counts.span++
      if (tag.startsWith('<data')) counts.data++
    }
    for (const ref of text.match(/&[^;\s]*;/g) ?? []) if (ref !== '&apos;' && ref !== '&shy;') fail(`${where}: the character reference ${ref}`)
    const out = text.replace(TAG, '').replaceAll('&apos;', "'").replaceAll('&shy;', '­')
    if (/[<>&]/.test(out)) fail(`${where} paragraph ${i + 1}: a character < > or & stays after the changes`)
    return out
  })
}

const words = (text) => text.split(/\s+/).filter(Boolean).length

// ---- read and check the 66 files ----

const files = readdirSync(SOURCE).filter((f) => /^\d{2}\.content\.json$/.test(f)).sort()
if (files.length !== 66 || files.some((f, i) => f !== `${String(i + 1).padStart(2, '0')}.content.json`)) fail('the folder does not have the 66 files 01 to 66')

const counts = { notes: 0, paragraphs: 0, words: 0, span: 0, data: 0, spanNotes: 0 }
const lines = []
const result = []
for (const [i, file] of files.entries()) {
  const book = books[i]
  const source = JSON.parse(readFileSync(join(SOURCE, file), 'utf8'))
  if (!Array.isArray(source)) fail(`${file}: not a list of notes`)
  const notes = []
  let last = [0, 0]
  for (const note of source) {
    const where = `${file} ${note.content_id}`
    if (typeof note.content_id !== 'string' || !/^\d+$/.test(note.content_id)) fail(`${where}: content_id`)
    const parts = /^(\d{8})-(\d{8})$/.exec(note.index_reference ?? '')
    if (!parts) fail(`${where}: index_reference ${note.index_reference}`)
    const from = end(parts[1], i + 1, where)
    const to = end(parts[2], i + 1, where)
    if (from[0] > to[0] || (from[0] === to[0] && from[1] > to[1])) fail(`${where}: the range ends before it starts`)
    if (from[0] < 1 || to[0] > book.chapters) fail(`${where}: a chapter that ${book.name} does not have`)
    // The order of the Bible: each note starts at or after the start of the note before it.
    if (from[0] < last[0] || (from[0] === last[0] && from[1] < last[1])) fail(`${where}: not in the order of the Bible`)
    last = from
    const label = rangeLabel(book.name, from, to)
    if (note.title !== label) fail(`${where}: the title "${note.title}" is not the range label "${label}"`)
    const spanBefore = counts.span
    const p = paragraphs(note.content, where, counts)
    if (counts.span > spanBefore) counts.spanNotes++
    counts.notes++
    counts.paragraphs += p.length
    counts.words += p.reduce((n, t) => n + words(t), 0)
    lines.push(note.content_id, ...p, '')
    notes.push({ id: note.content_id, from, to, p })
  }
  result.push({ book: book.id, notes })
}

// ---- the facts of section 19.4 ----

const FACTS = { notes: 751, paragraphs: 3228, words: 131406, span: 4, spanNotes: 2 }
for (const [k, v] of Object.entries(FACTS)) if (counts[k] !== v) fail(`the number of ${k} is ${counts[k]}, and section 19.4 says ${v}`)

const hashInput = Buffer.from(lines.map((l) => `${l}\n`).join(''), 'utf8')
const sha = createHash('sha256').update(hashInput).digest('hex')

// ---- write the 66 files ----

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })
let bytes = 0
for (const r of result) {
  const text = `${JSON.stringify(r)}\n`
  writeFileSync(join(OUT, `${r.book}.json`), text)
  bytes += statSync(join(OUT, `${r.book}.json`)).size
}

// ---- the numbers of section 19.5 ----

const panels = []
for (const [i, r] of result.entries()) {
  for (let c = 1; c <= books[i].chapters; c++) {
    const shown = r.notes.filter((n) => n.from[0] <= c && c <= n.to[0])
    panels.push({ book: books[i], chapter: c, notes: shown.length, words: shown.reduce((n, x) => n + x.p.reduce((m, t) => m + words(t), 0), 0) })
  }
}
const withNote = panels.filter((p) => p.notes > 0)
const without = panels.filter((p) => p.notes === 0)
const byCount = {}
for (const p of withNote) byCount[p.notes] = (byCount[p.notes] ?? 0) + 1
const most = Math.max(...withNote.map((p) => p.notes))
const sortedWords = withNote.map((p) => p.words).sort((a, b) => a - b)
const longest = sortedWords.at(-1)
const allNotes = result.flatMap((r) => r.notes)
const job = result[17].notes.find((n) => n.from[0] === 4 && n.from[1] === 1)

console.log('==== Section 19.4')
console.log('notes', counts.notes)
console.log('paragraphs', counts.paragraphs)
console.log('words', counts.words)
console.log('<data> tags', counts.data)
console.log('<span> tags', counts.span, 'in notes', counts.spanNotes)
console.log('bytes of the text of the SHA-256', hashInput.length)
console.log('SHA-256', sha)
console.log('==== Section 19.5')
console.log('chapters', panels.length)
console.log('chapters with a note', withNote.length)
console.log('chapters with no note', without.length, 'all psalms:', without.every((p) => p.book.id === 'psalms'))
console.log('psalms with a note', withNote.filter((p) => p.book.id === 'psalms').map((p) => p.chapter).join(', '))
console.log('chapters by the number of notes', JSON.stringify(byCount))
console.log('chapters with', most, 'notes:', withNote.filter((p) => p.notes === most).map((p) => `${p.book.name} ${p.chapter}`).join(', '))
console.log('the note', job ? rangeLabel('Job', job.from, job.to) : 'none', 'shows in', job ? job.to[0] - job.from[0] + 1 : 0, 'chapters')
console.log('notes with a range of 9 chapters or more', allNotes.filter((n) => n.to[0] - n.from[0] + 1 >= 9).length)
console.log('longest panels', longest, 'words:', withNote.filter((p) => p.words === longest).map((p) => `${p.book.name} ${p.chapter}`).join(', '))
console.log('median panel', sortedWords[(sortedWords.length - 1) / 2] ?? `${sortedWords[sortedWords.length / 2 - 1]} and ${sortedWords[sortedWords.length / 2]}`, 'words')
// The numbers of section 19.5. A difference stops the script after the print, so that the report can give it.
const median = sortedWords[(sortedWords.length - 1) / 2]
const FACTS_19_5 = [
  ['chapters', panels.length, 1189],
  ['chapters with a note', withNote.length, 1057],
  ['chapters with no note that are not psalms', without.filter((p) => p.book.id !== 'psalms').length, 0],
  ['psalms with a note', withNote.filter((p) => p.book.id === 'psalms').map((p) => p.chapter).join(','), '1,2,8,22,23,51,73,105,106,110,116,119,137,146,147,148,149,150'],
  ['chapters by the number of notes', JSON.stringify(byCount), '{"1":817,"2":160,"3":65,"4":9,"5":5,"6":1}'],
  ['the chapter with 6 notes', withNote.filter((p) => p.notes === 6).map((p) => `${p.book.name} ${p.chapter}`).join(','), 'Matthew 26'],
  ['chapters of the note Job 4:1–31:40', job ? job.to[0] - job.from[0] + 1 : 0, 28],
  ['notes with a range of 9 chapters or more', allNotes.filter((n) => n.to[0] - n.from[0] + 1 >= 9).length, 19],
  ['words of the longest panels', `${longest} ${withNote.filter((p) => p.words === longest).map((p) => `${p.book.name} ${p.chapter}`).join(',')}`, '745 1 Chronicles 9,Isaiah 8'],
  ['words of the median panel', median, 285],
]
const differ = FACTS_19_5.filter(([, got, want]) => got !== want)
for (const [name, got, want] of differ) console.log(`DIFFERENT: ${name}: ${got}, and section 19.5 says ${want}`)

console.log('==== Output')
console.log('files', result.length, 'in public/data/notes, bytes', bytes)
if (differ.length) fail(`${differ.length} numbers of section 19.5 differ`)
console.log('Each number of sections 19.4 and 19.5 is that of docs/DESIGN.md.')
