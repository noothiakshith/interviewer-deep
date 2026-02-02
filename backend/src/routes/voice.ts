import express from "express"
import { app } from "../../voiceagent/graph"
import { authmiddleware } from "../../middleware"
import { InterviewState } from "../../voiceagent/state"
import multer from "multer"

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

import { prisma } from "../../db"

router.post('/voice', authmiddleware, async (req, res) => {
    try {
        const userId = (req as any).user.id;
        const submission = await prisma.submission.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        if (submission) {
            const session = await prisma.interviewSession.findUnique({
                where: { submissionId: submission.id }
            });
            if (session && session.status === "COMPLETED") {
                return res.status(200).json({
                    message: "Interview already completed",
                    completed: true
                });
            }
        }
    } catch (e) {
        console.error("Error checking interview status", e);
    }

    const initialstate = {
        userid: {
            id: (req as any).user.id
        },
        questions: [],
        currentQuestionIndex: 0,
        answers: [],
        evaluation: null
    }
    try {
        const response = await app.invoke(initialstate, {
            configurable: {
                thread_id: (req as any).user.id
            }
        })
        res.status(200).json(response)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Internal Server Error" })
    }
})
router.post('/send-buffer', authmiddleware, upload.single('audio'), async (req, res, next) => {
    try {
        const audiobuffer = req.file?.buffer;
        if (!audiobuffer) {
            return res.status(400).json({ error: "Audio buffer is required" })
        }

        const thread_id = (req as any).user.id;

        // 1. Update the state with the audio buffer
        await app.updateState({
            configurable: {
                thread_id
            }
        }, {
            audioBuffer: audiobuffer,
            userid: {
                id: thread_id
            }
        })

        // 2. Resume the graph (starts from 'stt' and goes until next 'interview' interrupt)
        const updatedState = await app.invoke(null, {
            configurable: {
                thread_id
            }
        })

        res.status(200).json(updatedState)
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
})
export default router