import express, { Response, NextFunction } from 'express'
import multer from 'multer'
import path from 'path'
import axios from 'axios'
import { GraphState } from '../../agent/state';
import { app } from '../../agent/graph'
import { authmiddleware, AuthRequest } from '../../middleware'
import { prisma } from '../../db'

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

router.post('/resume-parse', authmiddleware, upload.single('resume'), async (req: AuthRequest, res: Response, next: NextFunction) => {

    const file = req.file
    const github_url = req.body.github_url

    if (!file) {
        return res.status(400).json({ message: "Resume file is required" })
    }

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const submission = await prisma.submission.create({
        data: {
            userId: req.user.id,
            resumeUrl: file.path,
            githubProjectUrl: github_url || "",
            status: "PENDING_ANALYSIS"
        }
    })

    const input_url = path.resolve(file.path)
    const initialConfig: typeof GraphState.State = {
        messages: [],
        input_url: input_url,
        github_url: github_url || "",
        resume_data: {
            name: "",
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
            detailedview: [],
            codequality: [],
            projectimpact: [],
            questions: [],
            flowscore: 0
        },
    } as any;

    try {
        console.log("Invoking agent with config:", JSON.stringify(initialConfig, null, 2));
        const agentResponse = await app.invoke(initialConfig);
        console.log("Agent response received");

        const { resume_data, github_data } = agentResponse;

        const report = await prisma.aiAnalysisReport.create({
            data: {
                submissionId: submission.id,
                resumeScore: Math.round(resume_data.rating),
                githubScore: github_data.rating,
                totalScore: Math.round((resume_data.rating + github_data.rating * 10) / 2),
                finalVerdict: resume_data.feedback,
                resumeAnalysis: {
                    create: {
                        name: resume_data.name,
                        experience: resume_data.experience,
                        skills: resume_data.skills,
                        rating: resume_data.rating,
                        feedback: resume_data.feedback,
                        redflags: resume_data.redflags,
                        strengths: resume_data.strengths,
                        comments: resume_data.comments,
                        priority: resume_data.priority,
                    }
                },
                githubAnalysis: {
                    create: {
                        url: github_data.url,
                        techstack: github_data.techstack,
                        rating: github_data.rating,
                        isgenuine: github_data.isgenuine,
                        detailedview: github_data.detailedview,
                        codequality: github_data.codequality,
                        projectimpact: github_data.projectimpact,
                        questions: github_data.questions,
                        flowscore: github_data.flowscore,
                    }
                }
            }
        });


        await prisma.submission.update({
            where: { id: submission.id },
            data: { status: "ANALYSIS_COMPLETE" }
        });

        res.json({
            message: "Analysis completed and stored",
            submissionId: submission.id,
            reportId: report.id,
            data: agentResponse
        });
    } catch (error: any) {
        console.error("Agent execution failed:", error);

        await prisma.submission.update({
            where: { id: submission.id },
            data: { status: "REJECTED" }
        });

        res.status(500).json({
            message: "Agent analysis failed",
            error: error.message
        });
    }
})
router.get('/repos', authmiddleware, async (req: AuthRequest, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        });
        const url = user?.githubProfileUrl;
        if (!url) {
            return res.status(404).json({ message: "Github profile URL not found for user" });
        }
        const username = url.split('/').filter(Boolean).pop();
        const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
            params: {
                per_page: 10,
                sort: "updated",
                direction: "desc",
            },
        });
        return res.status(200).json({ repos: response.data });
    } catch (error: any) {
        console.error("Error fetching repos:", error);
        return res.status(500).json({ message: "Error fetching repos" });
    }
});

export default router