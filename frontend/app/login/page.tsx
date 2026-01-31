"use client"

import React, { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"

const LoginPage = () => {
  const [loading, setLoading] = useState(false)

  const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const email = (form.email as HTMLInputElement).value
    const password = (form.password as HTMLInputElement).value

    try {
      const res = await axios.post("http://localhost:5050/auth/login", {
        email,
        password,
      })

      localStorage.setItem("token", res.data.token)
      alert("Login successful 🎉")
    } catch (err) {
      console.error(err)
      alert("Invalid email or password ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Welcome Back
        </h1>

        <form onSubmit={handlesubmit} className="space-y-4">
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
            placeholder="Password"
            required
            className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <span className="text-black font-medium cursor-pointer hover:underline">
            Sign up
          </span>
        </p>
      </div>
    </div>
  )
}

export default LoginPage