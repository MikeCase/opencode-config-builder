import React from 'react'
import { ChevronDown } from 'lucide-react'
import styles from './Select.module.css'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label: string
  value: string
  onChange: (v: string) => void
  options: SelectOption[]
  description?: string
}

export default function Select({ label, value, onChange, options, description, children }: SelectProps & { children?: React.ReactNode }) {
  const opts = options ?? []
  return (
    <div className={styles.field} onClick={(e) => e.stopPropagation()}>
      <label className={styles.label}>{label}</label>
      <div className={styles.selectWrapper}>
        <select className={styles.select} value={value} onChange={(e) => onChange(e.target.value)}>
          {opts.length > 0 ? opts.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )) : children}
        </select>
        <ChevronDown size={16} className={styles.arrow} />
      </div>
      {description && <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>{description}</p>}
    </div>
  )
}