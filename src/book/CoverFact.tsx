// One fact on the cover, with the "Scholars differ" control where the fact is disputed.
// docs/DESIGN.md section 4.2, the authorship rule in two layers.

import { useId, useState } from 'react'
import type { ScholarsDetail } from '../data/intros.ts'

interface CoverFactProps {
  label: string
  text: string
  detail?: ScholarsDetail
}

export function CoverFact({ label, text, detail }: CoverFactProps) {
  const [open, setOpen] = useState(false)
  const detailId = useId()

  return (
    <div className="fact">
      <dt>{label}</dt>
      <dd>
        <p className="fact-text">{text}</p>
        {detail && (
          <>
            <button
              type="button"
              className="scholars-control"
              aria-expanded={open}
              aria-controls={detailId}
              onClick={() => setOpen((o) => !o)}
            >
              Scholars differ
            </button>
            <div id={detailId} className="scholars-detail" role="region" aria-label={`${label}: scholars differ`} hidden={!open}>
              <div className="scholars-part">
                <h2>Critical scholars</h2>
                <p>{detail.critical}</p>
              </div>
              {detail.conservative && (
                <div className="scholars-part">
                  <h2>Conservative scholars</h2>
                  <p>{detail.conservative}</p>
                </div>
              )}
            </div>
          </>
        )}
      </dd>
    </div>
  )
}
