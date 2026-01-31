import express from 'express'
import { GraphState } from '../../agent/state';
import { app } from '../../agent/graph'
const router = express.Router()

router.post('/resume-parse', async (req, res, next) => {

    const { input_url } = req.body
    if (!input_url) {
        return res.status(400).json({ message: "Input URL is required" })
    }
    const initialConfig: typeof GraphState.State = {
        messages: [],
        input_url: input_url,
        resume_data: {
            experience: 0,
            skills: [],
            rating: 0,
            feedback: "",
            redflags: [],
            strengths: [],
            comments: [],
            priority: "low"
        },
        github_data: {
            url: "",
            techstack: [],
            rating: 0,
            isgenuine: false,
            detailedview: "",
            codequality: "",
            projectimpact: "",
            questions: [],
            flowscore: 0
        },
    } as any;
    const response = await app.invoke(initialConfig);
    console.log(response)
})
export default router