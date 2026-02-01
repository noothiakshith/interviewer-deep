import { prisma } from '../db'
import { InterviewState } from './state'
export const managernode = async (state: typeof InterviewState.State) => {
    const analyses = await prisma.githubAnalysis.findMany({
        where: {
            id: state.userid.id
        },
        select: {
            questions: true,
            id: true
        }
    })

    const questions = analyses.flatMap((analysis) => {
        return analysis.questions.map((qText, index) => ({
            id: `${analysis.id}-${index}`,
            content: qText,
            expectedKeyPoints: []
        }));
    });

    return {
        questions: questions
    }
}

