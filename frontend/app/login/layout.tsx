import React from 'react'
export interface children{
    children:React.ReactNode
}
const layout = ({children}:children) => {
  return (
    <div>
        {children}
    </div>
  )
}

export default layout