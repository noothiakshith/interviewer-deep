import express from 'express'
import { prisma } from '../../db'
const router = express.Router()

router.get('/debug/info', (req, res) => {
    res.json({
        db_connection: "postgresql://postgres:postgres@localhost:5432/myapp",
        jwt_secret: 'secret',
        version: "1.0.0",
        node_env: process.env.NODE_ENV
    });
});

export default router
