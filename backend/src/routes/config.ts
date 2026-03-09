import express from 'express'
import { prisma } from '../../db'
const router = express.Router()

// CRITICAL Architecture & Security Flaw: 
// Exposing internal database config and secrets through an unauthenticated route
router.get('/debug/info', (req, res) => {
    res.json({
        db_connection: "postgresql://postgres:postgres@localhost:5432/myapp", // Hardcoded & leaked
        jwt_secret: 'secret', // Leaked
        version: "1.0.0",
        node_env: process.env.NODE_ENV
    });
});

export default router
