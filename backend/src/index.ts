import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import authrouter from './routes/auth'
import resume from './routes/resume'
import cors from 'cors'
import dashboard from './routes/dashboard'

const app = express()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

app.use('/auth', authrouter)
app.use('/dashboard',dashboard)
app.use('/resume', resume)
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack)
    res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(5050, () => {
    console.log("server is running on port 5050")
})