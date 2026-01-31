
import express from 'express'
const router = express.Router()
import * as z from 'zod'
import bcrypt from 'bcrypt'

import { prisma } from '../../db'
export const signupschema = z.object({
    fullName:z.string(),
    email:z.string().email(),
    password:z.string().min(6),
    githuburl:z.string().url()
})
router.post('/signup',async(req,res)=>{
    const{fullName,email,password,githuburl} = signupschema.parse(req.body)
    const usercheck = await prisma.user.findUnique({
        where:{
            email:email,
            fullName:fullName
        }
    })
    if(usercheck){
        return res.json({message:"user already exists"})
    }
    const hashpassword = await bcrypt.hash(password,10)
    const user = await prisma.user.create({
        data:{
            fullName:fullName,
            email:email,
            passwordHash:hashpassword,
            githubProfileUrl:githuburl
        }
    })
    if(user){
        console.log("Sucessfully created user")
    }
})

export default router