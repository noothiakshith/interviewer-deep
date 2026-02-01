"use client"

import { Button } from "@/components/ui/button"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const DashboardPage = () => {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5050/dashboard/submissions",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      setSubmissions(res.data.submissions ?? [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  if (loading) {
    return (
      <p className="text-center text-muted-foreground mt-20">
        Loading submissions…
      </p>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Submissions</h1>

        <Button onClick={() => router.push("/dashboard/new")}>
          New Submission
        </Button>
      </div>

      {/* Empty State */}
      {submissions.length === 0 && (
        <div className="rounded-lg border bg-muted p-10 text-center text-muted-foreground">
          No submissions yet.
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="rounded-xl border bg-background p-5 hover:shadow-md transition"
          >
            {/* Status */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">
                Submission #{submission.id}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium
                  ${
                    submission.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : submission.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {submission.status}
              </span>
            </div>

            {/* Links */}
            <div className="space-y-2 text-sm">
              <a
                href={submission.resumeUrl}
                target="_blank"
                className="text-blue-600 hover:underline block"
              >
                Resume
              </a>

              <a
                href={submission.githubProjectUrl}
                target="_blank"
                className="text-blue-600 hover:underline block"
              >
                GitHub Project
              </a>
            </div>

            {/* Metadata */}
            <div className="mt-4 text-xs text-muted-foreground">
              <p>
                Created {new Date(submission.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Action */}
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() =>
                router.push(`/dashboard/submissions/${submission.id}`)
              }
            >
              View Details
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardPage