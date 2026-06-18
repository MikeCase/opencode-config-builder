import React, { useState } from 'react'
import styles from './Accordion.module.css'

interface AccordionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export default function Accordion({ title, children, defaultOpen = true }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`${styles.accordion} ${open ? styles.open : ''}`}>
      <div
        className={styles.header}
        onClick={() => setOpen(v => !v)}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(v => !v) }}}
      >
        <span className={styles.title}>{title}</span>
        <span className={styles.icon}>{open ? '−' : '+'}</span>
      </div>
      {open && <div className={styles.content}>{children}</div>}
    </div>
  )
}