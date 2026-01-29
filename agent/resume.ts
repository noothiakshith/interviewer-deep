import { ChatMistralAI } from "@langchain/mistralai"
import { PDFParse } from "pdf-parse"
import * as z from 'zod'
import { SystemMessage,HumanMessage } from "langchain"

const llm = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0,
    maxRetries: 2,
    // other params...
})
const systemprompt = 'You are an expert resume parser and analyst u need to parse the resume and understand teh resume and then rank the resume in the form of rating for 100 points '
const filepath = './akshith-latest (1).pdf'

export const resumeschema = z.object({
    name:z.string().describe("Give the candidate name"),
    experience:z.number(),
    skills:z.array(z.string()),
    githuburl:z.string().url(),
    mobilenumber:z.number(),
    email:z.string().email(),
    assesment:z.object({
        rating:z.number(),
        feedback:z.string(),
        redflags:z.array(z.string()),
        strengths:z.array(z.string()),
        recommendations:z.array(z.string()),
        isinterviewable:z.boolean(),
        comments:z.string(),
        priority:z.enum(['high','medium','low'])
    })
    
})
export const resumenode = async()=>{
    const test = new PDFParse({url:filepath});
    const result = await test.getText();
    console.log(result.text);

    const response = await llm.withStructuredOutput(resumeschema).invoke([
        new SystemMessage(systemprompt),
        new HumanMessage(result.text),
    ])
    console.log(response)
}

resumenode()