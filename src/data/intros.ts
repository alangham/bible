// Book introductions: the three facts of "About this book" on the reading page. docs/DESIGN.md sections 4.2 and 7.5.
// The text is in public/data/intros.json. The source of each fact is in
// docs/CONTENT-SOURCES.md. Only Arthur changes `review` to "approved".

/**
 * Layer 2 of the authorship rule: what critical scholars say, and what
 * conservative scholars answer. The conservative part is left out where no
 * approved source gives it.
 */
export interface ScholarsDetail {
  critical: string
  conservative?: string
}

export interface Intro {
  /** Book id, the same as in books.json. */
  id: string
  /** Who wrote it. The traditional view only (layer 1). */
  author: string
  /** Only for a book where the author is disputed. */
  authorDetail?: ScholarsDetail
  /** When and where it was written. The traditional view only (layer 1). */
  written: string
  /** Only for a book where the date is disputed. */
  writtenDetail?: ScholarsDetail
  /** One or two sentences of context. */
  whatItIs: string
  review: 'draft' | 'approved'
}

export async function loadIntros(): Promise<Intro[]> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/intros.json`)
  if (!res.ok) throw new Error(`intros.json: HTTP ${res.status}`)
  return (await res.json()) as Intro[]
}
