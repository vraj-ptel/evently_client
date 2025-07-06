import Header from '@/components/Header'
import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div>
         <header>
              <Header/>
            </header>
      {children}
    </div>
  )
}

export default layout
