import { prisma } from '../db'
import { InterviewState } from './state'

export const managernode = async (state: typeof InterviewState.State) => {
    // Check if userid exists in state
    if (!state.userid?.id) {
        console.error("User ID missing in state");
        return { questions: [] };
    }

    // Find the most recent submission for the user
    const submission = await prisma.submission.findFirst({
        where: {
            userId: state.userid.id
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            aiAnalysisReport: {
                include: {
                    githubAnalysis: true
                }
            }
        }
    })

    const githubAnalysis = submission?.aiAnalysisReport?.githubAnalysis

    if (!githubAnalysis || !githubAnalysis.questions || githubAnalysis.questions.length === 0) {
        console.log("No analysis or questions found for user:", state.userid.id);
        return {
            questions: []
        }
    }

    const questions = githubAnalysis.questions.map((qText, index) => ({
        id: `${githubAnalysis.id}-${index}`,
        content: qText,
        expectedKeyPoints: []
    }));

    return {
        questions: questions
    }
}
