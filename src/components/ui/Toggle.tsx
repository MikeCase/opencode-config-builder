import React from 'react'
import { Info } from 'lucide-react'
import styles from './Toggle.module.css'

interface ToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
  docUrl?: string
}

export default function Toggle({ label, description, checked, onChange, docUrl }: ToggleProps) {
  return (
    <div className={styles.toggleField} onClick={(e) => e.stopPropagation()}>
      <div>
        <div className={styles.toggleLabelRow}>
          <div className={styles.toggleLabel}>{label}</div>
          {docUrl && (
            <a href={docUrl} target="_blank" rel="noopener noreferrer" className={styles.docLink} onClick={(e) => e.stopPropagation()} aria-label={`Docs: ${label}`}>
              <Info size={13} />
            </a>
          )}
        </div>
        {description && <div className={styles.toggleDesc}>{description}</div>}
      </div>
      <label className={styles.toggle}>
        <input type="checkbox" checked={checked} onChange={(e) => { e.stopPropagation(); onChange(e.target.checked) }} />
        <span className={styles.toggleSlider} />
      </label>
    </div>
  )
}