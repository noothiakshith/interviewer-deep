import { InterviewState } from "./state";
import { prisma } from "../db";
import { ChatMistralAI } from "@langchain/mistralai";
import { z } from "zod";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

const evaluationSchema = z.object({
    totalScore: z.number().describe("The total score out of 100 based on the candidate's performance across all questions."),
    summaryFeedback: z.string().describe("Changes to the overall performance of the candidate, highlighting strengths and areas for improvement."),
    questionBreakdown: z.array(z.object({
        questionId: z.string(),
        passed: z.boolean().describe("Whether the candidate passed this specific question."),
        feedback: z.string().describe("Specific feedback for this question."),
        score: z.number().describe("Score for this individual question out of 10.")
    }))
});

export const validationNode = async (state: typeof InterviewState.State) => {
    console.log("Starting Validation Node...");

    const questions = state.questions;
    const answers = state.answers;

    if (!questions || questions.length === 0) {
        console.log("No questions to evaluate.");
        return { evaluation: null };
    }

    // Construct the transcript for the LLM
    let transcript = "Here is the interview transcript:\n\n";

    questions.forEach((q) => {
        const answer = answers.find(a => a.questionId === q.id);
        transcript += `Question (${q.id}): ${q.content}\n`;
        if (q.expectedKeyPoints && q.expectedKeyPoints.length > 0) {
            transcript += `Expected Key Points: ${q.expectedKeyPoints.join(", ")}\n`;
        }
        transcript += `Candidate Answer: ${answer ? answer.audioTranscript : "No answer provided."}\n\n`;
    });

    const systemPrompt = `You are an expert technical interviewer. 
Your task is to evaluate a candidate's responses to a series of technical interview questions.
For each question, compare the candidate's answer to the expected key points (if provided) and general technical accuracy.
be very lenient in your scoring.
Provide a boolean 'passed' status, a score out of 10, and constructive feedback for each question.
Finally, provide an overall total score out of 100 and a summary of the candidate's performance.`;

    const llm = new ChatMistralAI({
        apiKey: process.env.MISTRAL_API_KEY,
        model: "mistral-large-latest",
        temperature: 0,
    });

    try {
        const response = await llm.withStructuredOutput(evaluationSchema).invoke([
            new SystemMessage(systemPrompt),
            new HumanMessage(transcript)
        ]);

        console.log("Validation complete:", response);

        // --- DATABASE PERSISTENCE ---
        const userId = state.userid.id;
        if (userId) {
            const submission = await prisma.submission.findFirst({
                where: { userId: userId },
                orderBy: { createdAt: 'desc' }
            });

            if (submission) {
                // Find or create session (it should usually exist, but ensure robust)
                const session = await prisma.interviewSession.upsert({
                    where: { submissionId: submission.id },
                    create: {
                        submissionId: submission.id,
                        status: "COMPLETED",
                        completedAt: new Date(),
                    },
                    update: {
                        status: "COMPLETED",
                        completedAt: new Date(),
                    }
                });
                console.log(`Marked INTERVIEW_SESSION ${session.id} as COMPLETED.`);
            }
        }
        // -----------------------------

        return {
            evaluation: response
        };

    } catch (error) {
        console.error("Error in Validation Node:", error);
        // Return a dummy evaluation or null in case of failure to allow graph to end gracefully
        return {
            evaluation: {
                totalScore: 0,
                summaryFeedback: "Error occurred during evaluation.",
                questionBreakdown: []
            }
        }
    }
};
