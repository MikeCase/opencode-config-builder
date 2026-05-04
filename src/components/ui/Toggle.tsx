import React from 'react'
import styles from './Toggle.module.css'

interface ToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
}

export default function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <div className={styles.toggleField} onClick={(e) => e.stopPropagation()}>
      <div>
        <div className={styles.toggleLabel}>{label}</div>
        {description && <div className={styles.toggleDesc}>{description}</div>}
      </div>
      <label className={styles.toggle}>
        <input type="checkbox" checked={checked} onChange={(e) => { e.stopPropagation(); onChange(e.target.checked) }} />
        <span className={styles.toggleSlider} />
      </label>
    </div>
  )
}