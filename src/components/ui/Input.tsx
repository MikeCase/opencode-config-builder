import React from 'react'
import { Info } from 'lucide-react'
import styles from './Input.module.css'

interface InputProps {
  label: string
  description?: string
  value: string | number
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  mono?: boolean
  docUrl?: string
}

export default function Input({ label, description, value, onChange, type = 'text', placeholder, mono, docUrl }: InputProps) {
  return (
    <div className={styles.field} onClick={(e) => e.stopPropagation()}>
      <div className={styles.labelRow}>
        <label className={styles.label}>{label}</label>
        {docUrl && (
          <a href={docUrl} target="_blank" rel="noopener noreferrer" className={styles.docLink} onClick={(e) => e.stopPropagation()} aria-label={`Docs: ${label}`}>
            <Info size={13} />
          </a>
        )}
      </div>
      <input
        className={`${styles.input} ${mono ? styles.mono : ''}`}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {description && <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>{description}</p>}
    </div>
  )
}