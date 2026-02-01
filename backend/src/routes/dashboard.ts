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
        })
        return res.status(200).json({ submissions })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal server error" })
    }
})



export default router