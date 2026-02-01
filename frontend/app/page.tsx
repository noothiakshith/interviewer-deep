"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const LandingPage = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            The Smartest Interviewer You’ll Ever Meet
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload your resume, connect your GitHub, and experience
            AI-driven interviews tailored exactly for you.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/signup")}
          >
            Get Started
          </Button>
        </div>

        {/* Footer hint */}
        <p className="text-sm text-muted-foreground">
          Built for developers. Powered by intelligence.
        </p>
      </div>
    </div>
  )

}

export default LandingPage