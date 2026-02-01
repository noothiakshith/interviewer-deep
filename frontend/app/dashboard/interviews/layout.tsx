import React from 'react'
import { children } from '@/app/login/layout'
const layout = ({children}: {children: React.ReactNode}) => {
  return ( 
    <div>{children}</div>
  )
}

export default layout