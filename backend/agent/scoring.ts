import { ChatMistralAI } from "@langchain/mistralai"
import { HumanMessage, SystemMessage } from "langchain"
import { GraphState } from './state'
import * as z from 'zod'

const llm = new ChatMistralAI({
  model: "mistral-large-latest",
  temperature: 0,
  maxRetries: 2,
})

const systemprompt = `You are an expert technical evaluator. Your task is to synthesize data from a candidate's resume and a GitHub repository analysis into a final, comprehensive scoring report.

You will be provided with:
1. Resume Analysis (experience, skills, ratings, red flags, strong points).
2. GitHub Analysis (code quality, complexity, tech stack, ratings).

Your Goal:
1. Calculate an 'overallrating' (0-100) that intelligently weighs both inputs. 
   - Resume normally accounts for ~40% (experience, fit).
   - GitHub accounts for ~60% (actual coding ability, best practices).
   - Be critical; do not inflate scores.
2. Provide a 'verdict' text summarizing why this candidate is a Hire/No-Hire.
3. Consolidate the data into the final structured format.

Ensure 'url' matches the input URL. Use the exact data provided for 'resume' and 'github' fields, do not hallucinate new values.`

const questionsSchema = z.object({
  url: z.string(),
  resume: z.any(),
  github: z.any(),
  overallrating: z.number(),
  verdict: z.string()
});

const generalschema = z.object({
  url: z.string(),
  resume: z.object({
    experience: z.number(),
    skills: z.array(z.string()),
    rating: z.number(),
    feedback: z.string(),
    redflags: z.array(z.string()),
    strengths: z.array(z.string()),
    comments: z.array(z.string()),
    priority: z.string()
  }),
  github: z.object({
    url: z.string(),
    techstack: z.array(z.string()),
    rating: z.number(),
    isgenuine: z.boolean(),
    detailedview: z.array(z.string()),
    codequality: z.array(z.string()),
    projectimpact: z.array(z.string()),
    questions: z.array(z.string()),
    flowscore: z.number()
  }),
  overallrating: z.number(),
  verdict: z.string()
})

export const scoringnode = async (state: typeof GraphState.State) => {
  const data = {
    resume: state.resume_data,
    github: state.github_data,
    input_url: state.input_url,
  }



  const response = await llm.withStructuredOutput(generalschema).invoke([
    new SystemMessage(systemprompt),
    new HumanMessage(`Analyze this candidate data and produce the final report:\n${JSON.stringify(data, null, 2)}`)
  ])

  console.log("--------------------------------------------------")
  console.log("FINAL SCORING REPORT")
  console.log("--------------------------------------------------")
  console.log(`Candidate Name: ${state.resume_data.name || "N/A"}`)
  console.log(`Overall Rating: ${response.overallrating}/100`)
  console.log(`Verdict: ${response.verdict}`)
  console.log("--------------------------------------------------")
  console.log("Resume Rating:", response.resume.rating)
  console.log("GitHub Rating:", response.github.rating)
  console.log("--------------------------------------------------")

  return {
    final_report: response
  }
}

