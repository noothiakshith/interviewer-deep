"use client"

import React, { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const SignupPage = () => {
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const formsubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget

    const data = {
      fullName: (form.fullname as HTMLInputElement).value,
      email: (form.email as HTMLInputElement).value,
      password: (form.password as HTMLInputElement).value,
      githuburl: (form.githuburl as HTMLInputElement).value,
    }

    try {
      const response = await axios.post(
        "http://localhost:5050/auth/signup",
        data
      )
      console.log(response.data)
      alert("Signup successful 🎉")
      form.reset()
    } catch (err) {
      console.error(err)
      alert("Signup failed ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Create an Account
        </h1>

        <form onSubmit={formsubmit} className="space-y-4">
          <input
            type="text"
            name="fullname"
            placeholder="Full name"
            required
            className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            required
            className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            minLength={6}
            required
            className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="url"
            name="githuburl"
            placeholder="GitHub profile URL"
            className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
            onClick={()=>{router.push('/login')}}
          >
            {loading ? "Signing up..." : "Signup"}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default SignupPage