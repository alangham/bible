import { GROUPS, type GroupName } from '../data/books.ts'

interface LegendProps {
  picked: GroupName | null
  onPick: (group: GroupName | null) => void
}

/** The ten groups. Select a group to light its spines. Select it again to clear. */
export function Legend({ picked, onPick }: LegendProps) {
  return (
    <div className="legend" role="group" aria-label="Groups">
      {GROUPS.map((g) => {
        const state = picked === null ? 'all' : picked === g.name ? 'on' : 'off'
        return (
          <button
            key={g.name}
            type="button"
            className="legend-entry"
            data-state={state}
            aria-pressed={picked === g.name}
            onClick={() => onPick(picked === g.name ? null : g.name)}
          >
            <span className="legend-swatch" style={{ background: g.cloth }} aria-hidden="true" />
            <span>{g.name}</span>
          </button>
        )
      })}
    </div>
  )
}
