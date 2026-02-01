import express from 'express'
import { authmiddleware, AuthRequest } from '../../middleware'
const router = express.Router()
import { prisma } from '../../db'
import { Response, NextFunction } from 'express'

router.get('/submissions', authmiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const submissions = await prisma.submission.findMany({
            where: {
                userId: req.user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return res.status(200).json({ submissions })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal server error" })
    }
})

router.get('/submissions/:id', authmiddleware, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const submission = await prisma.submission.findUnique({
            where: {
                id: id as string,
                userId: req.user.id
            },
            include: {
                aiAnalysisReport: {
                    include: {
                        resumeAnalysis: true,
                        githubAnalysis: true,
                    }
                }
            }
        });

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        return res.status(200).json({ submission });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router