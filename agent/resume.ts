import { ChatMistralAI } from "@langchain/mistralai"
import { PDFParse } from "pdf-parse"
import * as z from 'zod'
import { SystemMessage, HumanMessage } from "langchain"
import { GraphState } from "./state"
const llm = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0,
    maxRetries: 2,
})
const systemprompt = `
You are a senior technical recruiter and resume analyst with experience evaluating
high-quality software engineers at top technology companies.

Your task:
1. Parse the resume text provided by the user.
2. Extract accurate candidate information.
3. Evaluate the candidate as if they are being compared against a pool of 10,000
   experienced engineers.
4. Score the candidate out of 100 based on clear, professional criteria.
5. Decide whether the candidate should be recommended for an interview with a
   senior engineering panel.

Evaluation Guidelines:
- Assume a HIGH hiring bar.
- Be strict, realistic, and evidence-based.
- Do NOT hallucinate experience or skills not explicitly mentioned.
- If information is missing, infer conservatively or flag it.

Scoring Criteria (100 points total):
- Technical Skills Depth & Relevance (30 points)
- Years and Quality of Professional Experience (20 points)
- Project Impact & Ownership (20 points)
- Problem Solving, System Design, or Architecture Exposure (15 points)
- Communication, Leadership, or Collaboration Signals (10 points)
- Resume Clarity, Structure, and Signal-to-Noise Ratio (5 points)

Assessment Rules:
- A score ≥ 75 indicates strong interview potential.
- 60–74 indicates borderline; interview only if the role is flexible.
- < 60 indicates not recommended at this time.
- “isinterviewable” should be TRUE only if you would confidently
  shortlist this candidate in a competitive hiring pipeline.

Output Requirements:
- Follow the provided JSON schema exactly.
- Provide concise but meaningful feedback.
- Red flags should highlight real hiring concerns.
- Strengths should be specific, not generic.
- Recommendations should be actionable and career-focused.
- Priority should reflect urgency relative to other candidates:
  high / medium / low.
`;

const filepath = './akshith-latest (1).pdf'

export const resumeschema = z.object({
    name: z.string().describe("Give the candidate name"),
    experience: z.number(),
    skills: z.array(z.string()),
    githuburl: z.string().url(),
    mobilenumber: z.number(),
    email: z.string().email(),
    assesment: z.object({
        rating: z.number(),
        feedback: z.string(),
        redflags: z.array(z.string()),
        strengths: z.array(z.string()),
        recommendations: z.array(z.string()),
        isinterviewable: z.boolean(),
        comments: z.string(),
        priority: z.enum(['high', 'medium', 'low'])
    })

})
export const resumenode = async (state: typeof GraphState.State) => {
    const test = new PDFParse({ url: filepath });
    const result = await test.getText();
    console.log(result.text);

    const response = await llm.withStructuredOutput(resumeschema).invoke([
        new SystemMessage(systemprompt),
        new HumanMessage(result.text),
    ])
    console.log(response);
    console.log("returning bro")
    return {
        resume_data: {
            experience: response.experience,
            skills: response.skills,
            rating: response.assesment.rating,
            feedback: response.assesment.feedback,
            redflags: response.assesment.redflags,
            strengths: response.assesment.strengths,
            comments: response.assesment.comments,
            priority: response.assesment.priority
        }
    }
}