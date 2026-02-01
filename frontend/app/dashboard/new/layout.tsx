"use client"

import React from "react"
import Github from "./Github"

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 border-r flex items-center justify-center bg-background">
        <Github />
      </div>
      <div className="w-1/2 flex items-center justify-center bg-muted">
        {children}
      </div>
    </div>
  )
}

export default layout