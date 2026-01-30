import { ChatMistralAI } from "@langchain/mistralai"
import { HumanMessage, SystemMessage } from "langchain"
import * as z from 'zod'
import type { GraphState } from "./state"
import { listFilesTool, readFileTool, runCommandTool } from "./tools"

const llm = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0,
    maxRetries: 2,
})

const llmWithTools = llm.bindTools([readFileTool, listFilesTool, runCommandTool])

export const githubschema = z.object({
    url: z.string().url(),
    techstack: z.array(z.string()),
    rating: z.number(),
    isgenuine: z.boolean(),
    detailedview: z.string(),
    codequality: z.string(),
    projectimpact: z.string(),
    questions: z.array(z.string()),
    flowscore: z.number()
})

const Systemprompt = `You are an expert github agent with experience evaluating u need to go through the whole github repo and evaluate the repo on software engineeering standards u know and the url `

export const githubnode = async (state: typeof GraphState.State) => {
    const response = await llm.withStructuredOutput(githubschema).invoke([
        new SystemMessage(Systemprompt),
        new HumanMessage(`Do the github evaluation for the url ${state.input_url}`),
    ])
    console.log(response)
    console.log("bro calling the github node")
    return {
        github_data: {
            url: state.input_url,
            techstack: response.techstack,
            rating: response.rating,
            isgenuine: response.isgenuine,
            detailedview: response.detailedview,
            codequality: response.codequality,
            projectimpact: response.projectimpact,
            questions: response.questions,
            flowscore: response.flowscore
        }
    }
}