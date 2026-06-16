import React from 'react'
import { Info } from 'lucide-react'
import styles from './Card.module.css'

interface CardProps {
  title?: string
  subtitle?: string
  docUrl?: string
  children: React.ReactNode
}

export default function Card({ title, subtitle, docUrl, children }: CardProps) {
  return (
    <section className={styles.card}>
      {(title || subtitle) && (
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.cardTitleRow}>
              {title && <h3 className={styles.cardTitle}>{title}</h3>}
              {docUrl && (
                <a href={docUrl} target="_blank" rel="noopener noreferrer" className={styles.cardDocLink} onClick={(e) => e.stopPropagation()} aria-label={`Docs: ${title}`}>
                  <Info size={14} />
                </a>
              )}
            </div>
            {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </section>
  )
}