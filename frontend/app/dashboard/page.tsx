"use client"

import { Button } from "@/components/ui/button"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'

const DashboardPage = () => {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const fetchSubmissions = async () => {
    try {
      const res = await axios.get("http://localhost:5050/dashboard/submissions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setSubmissions(res.data.submissions)
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
    return <p className="text-center text-muted-foreground mt-10">Loading submissions...</p>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">📄 Submissions</h1>

      {submissions.length === 0 && (
        <p className="text-muted-foreground">No submissions found.</p>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="rounded-xl border bg-background p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                User ID
              </p>
              <p className="font-medium">{submission.user_id}</p>

              <p className="text-sm text-muted-foreground">Status</p>
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold
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

              <div className="pt-2 space-y-1 text-sm">
                <a
                  href={submission.resumeUrl}
                  target="_blank"
                  className="block text-blue-600 hover:underline"
                >
                   Resume
                </a>
                <a
                  href={submission.githubProjectUrl}
                  target="_blank"
                  className="block text-blue-600 hover:underline"
                >
                   GitHub Project
                </a>
              </div>

              <div className="pt-3 text-xs text-muted-foreground space-y-1">
                <p>Created: {new Date(submission.createdAt).toLocaleString()}</p>
                <p>Updated: {new Date(submission.updatedAt).toLocaleString()}</p>
              </div>

              <Button variant="outline" className="w-full mt-4" onClick={()=>router.push(`/dashboard/submissions/${submission.id}`)}>
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardPage