import React from 'react'
import styles from './Card.module.css'

interface CardProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
}

export default function Card({ title, subtitle, children }: CardProps) {
  return (
    <section className={styles.card}>
      {(title || subtitle) && (
        <div className={styles.cardHeader}>
          <div>
            {title && <h3 className={styles.cardTitle}>{title}</h3>}
            {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </section>
  )
}