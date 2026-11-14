// Book introductions: the three facts on the cover page. docs/DESIGN.md section 4.2.
// The text is in public/data/intros.json. The source of each fact is in
// docs/CONTENT-SOURCES.md. Only Arthur changes `review` to "approved".

export interface Intro {
  /** Book id, the same as in books.json. */
  id: string
  /** Who wrote it. The traditional view first, then one line where scholars differ. */
  author: string
  /** When and where it was written. */
  written: string
  /** One or two sentences of context. */
  whatItIs: string
  review: 'draft' | 'approved'
}

export async function loadIntros(): Promise<Intro[]> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/intros.json`)
  if (!res.ok) throw new Error(`intros.json: HTTP ${res.status}`)
  return (await res.json()) as Intro[]
}
