// The Aquifer notes of the site. docs/DESIGN.md section 20, docs/TASKS.md Task 48.
// The files public/data/study/ come from scripts/build-study-notes.mjs, with the words of the Aquifer Open Study Notes
// and no change. Task 48 uses only about-psalms.json: the 132 psalms with no Biblica note, each with one Aquifer note
// in "About this chapter". Section 20.5.

/**
 * The content of a note: a list of nodes. A node is a string of text, or an element: a list with the name of the
 * element first and its nodes after it, for example ["p", "The ", ["em", "LORD"]]. An element has no attribute.
 * The page makes each element itself, and it puts no string of a file into the page as HTML.
 */
export type StudyNode = string | [StudyElement, ...StudyNode[]]

/** The elements of point 1 of section 20.3. The page makes no other element. */
export const STUDY_ELEMENTS = ['p', 'ul', 'ol', 'li', 'em', 'strong', 'sup', 'br'] as const
export type StudyElement = (typeof STUDY_ELEMENTS)[number]

/** One Aquifer note: its number, the chapter and the verse of the two ends of its range, and its content. */
export interface AquiferNote {
  id: string
  from: [number, number]
  to: [number, number]
  /** True for a title note. */
  title?: true
  c: StudyNode[]
}

/** One of the 132 psalms of section 20.5, with its note. */
export interface AboutPsalm extends AquiferNote {
  psalm: number
}

let cache: Promise<AboutPsalm[]> | null = null

/** The 132 psalms of section 20.5. The page gets the file with the Biblica notes file of Psalms. */
export function loadAboutPsalms(): Promise<AboutPsalm[]> {
  if (!cache) {
    const p = fetch(`${import.meta.env.BASE_URL}data/study/about-psalms.json`).then((res) => {
      if (!res.ok) throw new Error(`about-psalms.json: HTTP ${res.status}`)
      return res.json().then((data: { psalms: AboutPsalm[] }) => data.psalms)
    })
    p.catch(() => {
      cache = null
    })
    cache = p
  }
  return cache
}

/** The text of a content: each string, with no tag. */
export function textOfNodes(nodes: readonly StudyNode[]): string {
  return nodes.map((n) => (typeof n === 'string' ? n : textOfNodes(n.slice(1) as StudyNode[]))).join('')
}

/**
 * The Aquifer credit of section 20.6, in parts for its two links. Do not change a word of it. The whole text:
 * "From the Aquifer Open Study Notes, © 2026 Mission Mutual, licensed under CC BY-SA 4.0. They are an adaptation of
 * the Tyndale Open Study Notes, © 2023 Tyndale House Publishers. The words have no changes."
 */
export const AQUIFER_CREDIT = {
  before: 'From the ',
  source: { text: 'Aquifer Open Study Notes', href: 'https://github.com/BibleAquifer/AquiferOpenStudyNotes' },
  middle: ', © 2026 Mission Mutual, licensed under ',
  license: { text: 'CC BY-SA 4.0', href: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  after: '. They are an adaptation of the Tyndale Open Study Notes, © 2023 Tyndale House Publishers. The words have no changes.',
} as const
