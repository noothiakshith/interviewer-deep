"use client"

import { Button } from '@/components/ui/button'
import axios from 'axios'
import React, { useState } from 'react'

const ResumePage = () => {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handleresume = async (e: any) => {
        e.preventDefault()
        setLoading(true)

        const file = e.target.resume.files[0]
        const github = e.target.github.value

        if (!file) {
            alert("Please select a resume file")
            setLoading(false)
            return
        }

        const formData = new FormData()
        formData.append('resume', file)
        formData.append('github_url', github)

        try {
            console.log("Uploading resume...");
            const response = await axios.post('http://localhost:5050/resume/resume-parse', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log("Analysis Result:", response.data)
            setResult(response.data)
            alert("Analysis complete! 🎉")
        } catch (err: any) {
            console.error("Upload Error:", err)
            alert(`Analysis failed: ${err.response?.data?.message || err.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Resume AI Analyst
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Upload your resume and enter your GitHub project for a deep analysis.
                    </p>
                </div>

                <form onSubmit={handleresume} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Resume (PDF)</label>
                        <input
                            type='file'
                            name='resume'
                            accept=".pdf"
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">GitHub Project URL</label>
                        <input
                            type='url'
                            name='github'
                            placeholder='https://github.com/username/project'
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <Button
                        type='submit'
                        disabled={loading}
                        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transform hover:scale-[1.01] transition-all"
                    >
                        {loading ? "Analyzing..." : "Start Analysis"}
                    </Button>
                </form>

                {result && (
                    <div className="mt-8 p-6 bg-gray-900 rounded-xl text-white overflow-hidden animate-in zoom-in duration-300">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-2xl">📊</span> Analysis Results
                        </h2>
                        <div className="space-y-4">
                            {result.resume_data && (
                                <div className="border border-gray-700 p-4 rounded-lg">
                                    <h3 className="text-blue-400 font-bold mb-2">Resume Score: {result.resume_data.rating}/100</h3>
                                    <p className="text-sm text-gray-300">{result.resume_data.feedback}</p>
                                </div>
                            )}
                            {result.github_data && (
                                <div className="border border-gray-700 p-4 rounded-lg">
                                    <h3 className="text-green-400 font-bold mb-2">GitHub Score: {result.github_data.rating}/100</h3>
                                    <p className="text-sm text-gray-300">Impact: {result.github_data.projectimpact}</p>
                                </div>
                            )}
                            <pre className="text-xs bg-gray-800 p-4 rounded-lg overflow-x-auto max-h-64 custom-scrollbar">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ResumePage