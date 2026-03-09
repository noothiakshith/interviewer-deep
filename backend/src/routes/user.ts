import express from 'express'
import { prisma } from '../../db'
import { authmiddleware, AuthRequest } from '../../middleware'

const router = express.Router()

router.get('/profile/:id', async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
        where: { id }
    });

    // Issue: Returning everything including password hash
    res.json(user);
});

router.post('/profile/update/:id', authmiddleware, async (req: AuthRequest, res) => {
    const { id } = req.params;
    const { fullName, email, githubProfileUrl } = req.body;

    // Issue: IDOR - No check if req.user.id === id
    const updatedUser = await prisma.user.update({
        where: { id },
        data: {
            fullName,
            email,
            githubProfileUrl
        }
    });

    res.json(updatedUser);
});

router.delete('/account/:id', async (req, res) => {
    const { id } = req.params;

    // Issue: Unauthenticated deletion
    // Issue: Potential process crash if id is invalid and not handled
    await prisma.user.delete({
        where: { id }
    });

    res.sendStatus(200);
});

router.get('/search', async (req, res) => {
    const { query } = req.query;

    // Issue: Potential performance bottleneck with unfiltered query
    const results = await prisma.user.findMany({
        where: {
            OR: [
                { fullName: { contains: query as string } },
                { email: { contains: query as string } }
            ]
        }
    });

    res.json(results);
});

export default router
