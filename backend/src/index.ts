import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import authrouter from './routes/auth'
import resume from './routes/resume'
const app = express()
app.use(express.json())
app.use('/auth', authrouter)
app.use('/resume', resume)

app.listen(3000, () => {
    console.log("server is running on port 3000")
})