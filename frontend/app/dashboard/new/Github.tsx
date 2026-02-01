"use client"

import { Button } from "@/components/ui/button"
import axios from "axios"
import React, { useEffect, useState } from "react"

type Repo = {
  id: number
  name: string
  html_url: string
}

const Github = () => {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedRepoId, setCopiedRepoId] = useState<number | null>(null)

  const fetchurl = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      const response = await axios.get(
        "http://localhost:5050/resume/repos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setRepos(response.data.repos ?? [])
    } catch (err) {
      console.error(err)
      setError("Failed to fetch repositories.")
    } finally {
      setLoading(false)
    }
  }

  const copyCloneUrl = async (repo: Repo) => {
    const cloneUrl = `${repo.html_url}.git`
    await navigator.clipboard.writeText(cloneUrl)
    setCopiedRepoId(repo.id)

    setTimeout(() => setCopiedRepoId(null), 1500)
  }

  useEffect(() => {
    fetchurl()
  }, [])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">GitHub Repositories</h2>
        <Button onClick={fetchurl} disabled={loading}>
          {loading ? "Fetching..." : "Refresh"}
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Empty State */}
      {repos.length === 0 && !error && (
        <p className="text-sm text-muted-foreground">
          No repositories available.
        </p>
      )}

      {/* Repo List */}
      <ul className="space-y-3">
        {repos.map((repo) => (
          <li
            key={repo.id}
            className="flex items-center justify-between rounded-lg border bg-background px-4 py-3 hover:bg-muted transition"
          >
            {/* Repo Name */}
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline truncate"
            >
              {repo.name}
            </a>

            {/* Copy Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyCloneUrl(repo)}
            >
              {copiedRepoId === repo.id ? "Copied!" : "Copy"}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Github