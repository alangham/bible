// The move of a book name from the wall into the heading of the reading page, and back.
// docs/DESIGN.md section 7.6, docs/TASKS.md Task 13 step 13. It uses the View Transitions
// function of the browser. A browser without that function, and a reader who asks for reduced
// motion, get a direct change: the caller then follows the link as usual.

const NAME = 'book-name'
/** The new page has this long to show the name. After that, the move ends without it. */
const WAIT_MS = 1000

let waiting: { id: string; arrive: () => void } | null = null
let moved: HTMLElement | null = null

type StartViewTransition = (update: () => Promise<void>) => { finished: Promise<void> }

function startViewTransition(): StartViewTransition | null {
  const doc = document as Document & { startViewTransition?: StartViewTransition }
  return typeof doc.startViewTransition === 'function' ? doc.startViewTransition.bind(doc) : null
}

/** True when the browser can move the name and the reader did not ask for reduced motion. */
export function canMoveBookName(reducedMotion: boolean): boolean {
  return !reducedMotion && typeof document !== 'undefined' && startViewTransition() !== null
}

/**
 * Moves the name `from` to the page that `navigate` opens. That page calls `arriveBookName`
 * with the same book id when its name is on screen.
 */
export function moveBookName(from: HTMLElement, bookId: string, navigate: () => void) {
  const start = startViewTransition()
  if (!start) {
    navigate()
    return
  }
  from.style.setProperty('view-transition-name', NAME)
  const transition = start(
    () =>
      new Promise<void>((resolve) => {
        // The browser has the picture of the old page now.
        from.style.removeProperty('view-transition-name')
        const done = () => {
          window.clearTimeout(timer)
          if (waiting?.arrive === done) waiting = null
          resolve()
        }
        const timer = window.setTimeout(done, WAIT_MS)
        waiting = { id: bookId, arrive: done }
        navigate()
      }),
  )
  const clear = () => {
    moved?.style.removeProperty('view-transition-name')
    moved = null
  }
  transition.finished.then(clear, clear)
}

/** The id of the book whose name is on the way to a new page, or null. */
export function movingBookId(): string | null {
  return waiting?.id ?? null
}

/** The new page shows the name of `bookId` in `el`. Ends the wait of a move to this book, if there is one. */
export function arriveBookName(bookId: string, el: HTMLElement | null): boolean {
  if (!waiting || waiting.id !== bookId || !el) return false
  el.style.setProperty('view-transition-name', NAME)
  moved = el
  waiting.arrive()
  return true
}
