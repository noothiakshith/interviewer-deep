"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import React, { useState } from "react"
import axios from "axios"

const NewSubmission = () => {
  const [loading, setLoading] = useState(false)

  const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const pdf = (form.elements.namedItem("pdf") as HTMLInputElement)?.files?.[0]
    const github = (form.elements.namedItem("github") as HTMLInputElement)?.value

    if (!pdf || !github) {
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("resume", pdf)
    formData.append("github_url", github)

    const token = localStorage.getItem("token")

    try {
      const response = await axios.post(
        "http://localhost:5050/resume/resume-parse",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      console.log(response.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-center">
            Resume Submission
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmission} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Resume (PDF)</label>
              <input
                type="file"
                name="pdf"
                accept="application/pdf"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">GitHub Profile URL</label>
              <input
                type="url"
                name="github"
                placeholder="https://github.com/username"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              variant="destructive"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default NewSubmission