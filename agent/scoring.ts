import { ChatMistralAI } from "@langchain/mistralai"
import { HumanMessage, SystemMessage } from "langchain"
import {GraphState} from './state'
const llm = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0,
    maxRetries: 2,
    // other params...
})
export const mockData = {
  repository: {
    name: "Lovable",
    type: "full-stack",
    purpose:
      "A modern web application with authentication, AI/agent capabilities, and a scalable architecture.",
    overview: {
      frontend: true,
      backend: true,
      aiAgents: true,
      dockerized: true,
      cloudReady: true,
    },
    backend: {
      path: "/backend",
      runtime: "Bun",
      language: "TypeScript",
      framework: "Express.js",
      database: {
        orm: "Prisma",
        supported: ["PostgreSQL", "SQLite"],
        configPath: "/backend/prisma",
      },
      authentication: {
        enabled: true,
        method: "JWT / Middleware-based",
        file: "auth-middleware.ts",
      },
      api: {
        style: "REST",
        structure: "/api",
      },
      agentSystem: {
        enabled: true,
        path: "/agent",
        description: "AI/automation agents for advanced workflows",
      },
      docker: {
        enabled: true,
        files: ["e2b.Dockerfile", "e2b.toml"],
      },
      customModules: ["sathwik"],
      dependencyManagement: ["package.json", "bun.lock"],
    },
    frontend: {
      path: "/frontend",
      framework: "React",
      bundler: "Vite",
      language: "TypeScript",
      styling: "Tailwind CSS / Component-based UI",
      linting: "ESLint",
      routing: "React Router (assumed)",
      staticAssets: "/public",
      deployment: {
        platform: "Vercel",
        config: "vercel.json",
      },
    },
    documentation: {
      deploymentGuides: ["DEPLOYMENT.md", "QUICK_DEPLOY.md"],
      gitignoreConfigured: true,
    },
    keyFeatures: [
      "Full-stack TypeScript architecture",
      "Authentication & authorization",
      "Prisma-based database layer",
      "AI/agent system",
      "Dockerized backend",
      "Modern frontend tooling (Vite + React)",
      "Cloud-ready deployment",
    ],
    summary:
      "A modular, scalable full-stack application using modern TypeScript tooling, AI agents, and cloud-first deployment practices.",
  },

  candidate: {
    personalInfo: {
      name: "Noothi Akshith",
      experienceYears: 1.5,
      email: "akshith166@gmail.com",
      mobileNumber: "916281651078",
      github: "https://github.com/noothiakshith",
    },
    skills: {
      languages: ["C++", "JavaScript (ES6+)"],
      frontend: ["React.js", "Next.js", "Tailwind CSS"],
      backend: ["Node.js", "Express.js", "Prisma"],
      databases: ["PostgreSQL", "MongoDB", "Redis"],
      realtime: ["WebSockets", "SSE", "Redis Pub/Sub"],
      infra: [
        "Docker",
        "Kubernetes (Pods, HPA, Ingress)",
        "Nginx",
        "AWS (EC2, S3)",
        "CI/CD (GitHub, GitLab)",
      ],
      aiAndMedia: ["WhisperX", "Modal", "Gemini API"],
      problemSolving: {
        platform: "LeetCode",
        problemsSolved: 600,
        contestRating: 1563,
      },
    },
    assessment: {
      rating: 78,
      priority: "high",
      isInterviewable: true,
      summary:
        "High-potential mid-level engineer with strong backend, DevOps, and distributed systems experience.",
      strengths: [
        "Strong backend and infrastructure skills",
        "Hands-on Kubernetes and cloud experience",
        "Experience building scalable distributed systems",
        "Demonstrated performance and latency optimizations",
        "Clear ownership of complex projects",
      ],
      redFlags: [
        "Limited professional experience (1.5 years)",
        "Limited leadership or mentorship exposure",
        "Kubernetes experience not yet deeply production-heavy",
        "LeetCode performance is solid but not elite",
      ],
      recommendations: [
        "Gain 1–2 more years of industry experience",
        "Take ownership of larger systems",
        "Mentor junior engineers",
        "Contribute to open source or write technical blogs",
        "Deepen system design knowledge (caching, consensus, DB internals)",
      ],
      finalComment:
        "A strong mid-level candidate with excellent technical fundamentals and clear growth trajectory. Best suited for backend or DevOps-focused roles.",
    },
  },
} as const

const systemprompt = 'you are an expert scoring agent with lot of experience and now u are given data of candiate with their projects and resume detailed ansalysis and score it based on a neat predictable formula'

export const scoringnode = async(state:typeof GraphState.State)=>{
  const data = {
    resume:state.resume_data,
    github:state.github_data,
    input_url:state.input_url,
    messages:state.messages,
  }
    const response = await llm.invoke([
        new SystemMessage(systemprompt),
        new HumanMessage(JSON.stringify(data))
    ])
    console.log(response.content)
}

