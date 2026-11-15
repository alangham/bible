// The translation switch: the two translation names. docs/DESIGN.md section 8.5, docs/TASKS.md Task 21
// step 4. It is in two places: the line at the bottom of the wall, and the top of the panel of the
// chapter grid on the reading page. The selected name has the ink color and an underline.

import { setTranslation, TRANSLATIONS, useTranslation, type Translation } from './data/translation.ts'

interface TranslationSwitchProps {
  className?: string
  /** After a selection, also when the reader selects the translation that is already selected. */
  onSelect?: (t: Translation, changed: boolean) => void
}

export function TranslationSwitch({ className, onSelect }: TranslationSwitchProps) {
  const current = useTranslation()
  return (
    <div role="group" aria-label="Translation" className={className ? `tr-switch ${className}` : 'tr-switch'}>
      {TRANSLATIONS.map((t) => (
        <button
          key={t.id}
          type="button"
          aria-pressed={t.id === current}
          onClick={() => {
            const changed = t.id !== current
            onSelect?.(t.id, changed)
            setTranslation(t.id)
          }}
        >
          {t.name}
        </button>
      ))}
    </div>
  )
}
