"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface AnalysisData {
    submission: {
        id: string;
        resumeUrl: string;
        githubProjectUrl: string;
        status: string;
        createdAt: string;
        aiAnalysisReport: {
            resumeScore: number;
            githubScore: number;
            totalScore: number;
            finalVerdict: string;
            resumeAnalysis: {
                name: string;
                experience: number;
                skills: string[];
                rating: number;
                feedback: string;
                redflags: string[];
                strengths: string[];
                comments: string[];
                priority: string;
            };
            githubAnalysis: {
                url: string;
                techstack: string[];
                rating: number;
                isgenuine: boolean;
                detailedview: string;
                codequality: string;
                projectimpact: string;
                questions: string[];
                flowscore: number;
            };
        };
    };
}

export default function SubmissionDetailsPage() {
    const params = useParams();
    const submissionId = params.submissionid;
    const [data, setData] = useState<AnalysisData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`http://localhost:5050/dashboard/submissions/${submissionId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch submission data");
                const json = await res.json();
                setData(json);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (submissionId) fetchData();
    }, [submissionId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
                <div className="bg-red-500/10 border border-red-500 p-6 rounded-xl">
                    <h1 className="text-xl font-bold mb-2">Error</h1>
                    <p>{error || "Submission not found"}</p>
                </div>
            </div>
        );
    }

    const { submission } = data;
    const report = submission.aiAnalysisReport;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                            Analysis Report
                        </h1>
                        <p className="text-slate-400">Submission ID: {submission.id}</p>
                    </div>
                    <div className="text-right">
                        <span className={`px-4 py-1 rounded-full text-sm font-medium ${submission.status === "ANALYSIS_COMPLETE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}>
                            {submission.status}
                        </span>
                    </div>
                </header>

                {/* Scoring Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <ScoreCard title="Total Score" score={report.totalScore} subtext="Weighted Overall" color="from-blue-600 to-indigo-600" />
                    <ScoreCard title="Resume Score" score={report.resumeScore} subtext="Based on Skills/Exp" color="from-purple-600 to-pink-600" />
                    <ScoreCard title="GitHub Score" score={report.githubScore * 20} subtext="Code Quality & Impact" color="from-emerald-600 to-teal-600" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Resume Analysis Section */}
                    <Section title="Resume Analysis">
                        <div className="space-y-6">
                            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                                <h3 className="text-lg font-semibold text-white mb-4">Candidate Profile</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Name</p>
                                        <p className="text-white">{report.resumeAnalysis.name || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Experience</p>
                                        <p className="text-white">{report.resumeAnalysis.experience} Years</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-slate-400 uppercase mb-3">Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {report.resumeAnalysis.skills.map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl">
                                    <h4 className="text-emerald-400 font-bold text-sm mb-2 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        Strengths
                                    </h4>
                                    <ul className="text-sm text-slate-300 space-y-1">
                                        {report.resumeAnalysis.strengths.slice(0, 4).map((s, i) => <li key={i}>• {s}</li>)}
                                    </ul>
                                </div>
                                <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl">
                                    <h4 className="text-red-400 font-bold text-sm mb-2 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        Red Flags
                                    </h4>
                                    <ul className="text-sm text-slate-300 space-y-1">
                                        {report.resumeAnalysis.redflags.length > 0 ? report.resumeAnalysis.redflags.map((s, i) => <li key={i}>• {s}</li>) : <li>No major concerns</li>}
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-slate-400 uppercase mb-3">Feedback</h4>
                                <p className="text-slate-300 leading-relaxed bg-slate-800/30 p-4 rounded-xl italic">
                                    "{report.resumeAnalysis.feedback}"
                                </p>
                            </div>
                        </div>
                    </Section>
                    
                    {/* GitHub Analysis Section */}
                    <Section title="GitHub Repository Analysis">
                        <div className="space-y-6">
                            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-white">Repository Health</h3>
                                    <span className={`px-3 py-1 rounded text-xs font-bold ${report.githubAnalysis.isgenuine ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                                        {report.githubAnalysis.isgenuine ? "GENUINE PROJECT" : "SUSPICIOUS ACTIVITY"}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Tech Stack</p>
                                        <div className="flex flex-wrap gap-2">
                                            {report.githubAnalysis.techstack.map((tech, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs border border-slate-600">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <AnalysisPoint title="Code Quality" value={report.githubAnalysis.codequality} />
                                <AnalysisPoint title="Project Impact" value={report.githubAnalysis.projectimpact} />
                                <div className="bg-slate-800/30 p-4 rounded-xl">
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Detailed View</p>
                                    <p className="text-slate-300 text-sm leading-relaxed">{report.githubAnalysis.detailedview}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-slate-400 uppercase mb-3">Interview Questions Generated</h4>
                                <div>
                                    {
                                        report.totalScore>=60?
                                        <Button onClick={()=>{router.push(`/dashboard/interviews/${submission.id}`)}}>Go for an interview</Button>:
                                        <Button disabled>Not Eligible</Button>

                                    }
    
                                </div>
                                <div className="space-y-2">
                                </div>
                            </div>
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    );
}
function ScoreCard({ title, score, subtext, color }: { title: string; score: number; subtext: string; color: string }) {
    return (
        <div className={`bg-gradient-to-br ${color} p-6 rounded-3xl shadow-2xl relative overflow-hidden group`}>
            <div className="relative z-10 text-white">
                <p className="text-sm font-bold opacity-80 uppercase tracking-widest">{title}</p>
                <div className="my-2 flex items-baseline">
                    <span className="text-5xl font-black">{score}</span>
                    <span className="text-xl opacity-60 ml-1">/100</span>
                </div>
                <p className="text-xs opacity-70 font-medium">{subtext}</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                {title}
                <div className="ml-4 h-px flex-grow bg-slate-800"></div>
            </h2>
            {children}
        </div>
    );
}

function AnalysisPoint({ title, value }: { title: string; value: string }) {
    return (
        <div className="group">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1 group-hover:text-blue-400 transition-colors">{title}</p>
            <p className="text-slate-300 text-sm leading-relaxed">{value}</p>
        </div>
    );
}