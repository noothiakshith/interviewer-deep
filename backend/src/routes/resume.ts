import express, { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import path from 'path'
import { GraphState } from '../../agent/state';
import { app } from '../../agent/graph'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage })
const router = express.Router()

router.post('/resume-parse', upload.single('resume'), async (req: Request, res: Response, next: NextFunction) => {

    const file = req.file
    const { github_url } = req.body

    if (!file) {
        return res.status(400).json({ message: "Resume file is required" })
    }

    const input_url = path.resolve(file.path)
    const initialConfig: typeof GraphState.State = {
        messages: [],
        input_url: input_url,
        github_url: github_url || "",
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
            isGenuine: false,
            detailedview: "",
            codequality: "",
            projectimpact: "",
            questions: [],
            flowscore: 0
        },
    } as any;
    try {
        console.log("Invoking agent with config:", JSON.stringify(initialConfig, null, 2));
        const response = await app.invoke(initialConfig);
        console.log("Agent response:", response);
        res.json(response);
    } catch (error: any) {
        console.error("Agent execution failed:", error);
        res.status(500).json({
            message: "Agent analysis failed",
            error: error.message,
            stack: error.stack
        });
    }
})
export default router