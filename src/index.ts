import express from 'express'
import authrouter from './routes/auth'
const app= express()
app.use(express.json())
app.use('/auth',authrouter)

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})