import React from 'react'

export const metadata = {
    title:'My Events',
    description:'Events I Booked'
}

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default layout
