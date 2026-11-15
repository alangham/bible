// One fact of the introduction, with the "Scholars differ" control where the fact is disputed.
// docs/DESIGN.md section 4.2, the authorship rule in two layers. The rule is the same as on the
// built cover: one control for each disputed fact. Task 13 changes only the look.

import { useId, useState } from 'react'
import type { ScholarsDetail } from '../data/intros.ts'

interface FactProps {
  label: string
  text: string
  detail?: ScholarsDetail
}

export function Fact({ label, text, detail }: FactProps) {
  const [open, setOpen] = useState(false)
  const detailId = useId()

  return (
    <div className="rd-fact">
      <dt>{label}</dt>
      <dd>
        <p className="rd-fact-text">{text}</p>
        {detail && (
          <>
            <button
              type="button"
              className="rd-scholars-control"
              aria-expanded={open}
              aria-controls={detailId}
              onClick={() => setOpen((o) => !o)}
            >
              Scholars differ <span aria-hidden="true">›</span>
            </button>
            <div id={detailId} className="rd-scholars-detail" role="region" aria-label={`${label}: scholars differ`} hidden={!open}>
              <div className="rd-scholars-part">
                <h3>Critical scholars</h3>
                <p>{detail.critical}</p>
              </div>
              {detail.conservative && (
                <div className="rd-scholars-part">
                  <h3>Conservative scholars</h3>
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
