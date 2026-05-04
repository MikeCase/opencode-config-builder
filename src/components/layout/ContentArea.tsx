import React from 'react'

export default function ContentArea({children}:{children: React.ReactNode}){
  return (
    <main className="content" style={{padding:24}}>
      {children}
    </main>
  )
}
