import React from 'react'

export default function ContentArea({children}:{children: React.ReactNode}){
  return (
    <main className="content">
      {children}
    </main>
  )
}
