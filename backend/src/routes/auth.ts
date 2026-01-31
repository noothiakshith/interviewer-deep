
import express from 'express'
const router = express.Router()
import * as z from 'zod'
import dotenv from 'dotenv'
dotenv.config()
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
    return res.status(200).json({
        message:"user created successfully"
    })
})


router.post('/login',async(req,res,next)=>{
    const{email,password} = req.body;
    const checkuser = await prisma.user.findUnique({
        where:{
            email:email,
        }
    })
    if(!checkuser){
        return res.status(401).json({message:"You are not signedup"})
    }
    else{
        const checkpassword  = await bcrypt.compare(password,checkuser.passwordHash);
        if(!checkpassword){
            return res.status(401).json({message:"You are not signedup"})
        }
        else{
            const token = jwt.sign({
                data:{
                    id:checkuser.id,
                    email:checkuser.email,
                    role:checkuser.Role
                }
            },'secret',{expiresIn:"1h"})
            return res.status(200).json({message:"You are logged in successfully",token})
        }
    }
})
export default router