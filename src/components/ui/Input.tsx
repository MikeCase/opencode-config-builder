import React from 'react'
import styles from './Input.module.css'

interface InputProps {
  label: string
  description?: string
  value: string | number
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  mono?: boolean
}

export default function Input({ label, description, value, onChange, type = 'text', placeholder, mono }: InputProps) {
  return (
    <div className={styles.field} onClick={(e) => e.stopPropagation()}>
      <label className={styles.label}>{label}</label>
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