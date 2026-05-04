import React from 'react'
import { Plus, X } from 'lucide-react'
import styles from './ArrayField.module.css'

interface ArrayFieldProps {
  label?: string
  description?: string
  values: string[]
  onChange: (v: string[]) => void
  placeholder?: string
}

export default function ArrayField({ label, description, values = [], onChange, placeholder = 'Add item...' }: ArrayFieldProps) {
  const arr = Array.isArray(values) ? values : []
const setIndex = (idx: number, v: string) => {
    const next = [...arr]
    next[idx] = v
    onChange(next)
  }

  const add = () => {
    onChange([...arr, ''])
  }

  const remove = (idx: number) => {
    const next = arr.filter((_, i) => i !== idx)
    onChange(next)
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {label && <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>{label}</label>}
      {description && <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>{description}</p>}
      <div className={styles.arrayField}>
        {arr.map((v, i) => (
          <div key={i} className={styles.item}>
            <input
              className={styles.itemInput}
              value={v}
              placeholder={placeholder}
              onChange={(e) => setIndex(i, e.target.value)}
            />
            <button type="button" className={styles.removeBtn} onClick={() => remove(i)}>
              <X size={14} />
            </button>
          </div>
        ))}
        <button type="button" className={styles.addBtn} onClick={add}>
          <Plus size={14} />
          Add
        </button>
      </div>
    </div>
  )
}