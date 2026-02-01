"use client"
import { Button } from '@/components/ui/button'
import axios from 'axios'
import React, { useState,useEffect} from 'react'

const DashboardPage = () => {
  const[subsmissions,setsubmissions] = useState([])
     const submission = async()=>{
    const submission = await axios.get('http://localhost:5050/dashboard/submissions',{
      headers:{
        "Authorization":`Bearer ${localStorage.getItem("token")}`
      }
    })
    setsubmissions(submission.data.submissions)
    console.log(submission.data)
  }
  useEffect(()=>{
    submission()
  },[])
  return (
    <>
    {subsmissions.map((submission:any)=>{
      return(
        <div key={submission.id}>
          <p>{submission.user_id}</p>
          <p>{submission.status}</p>
          <p>{submission.resumeUrl}</p>
          <p>{submission.githubProjectUrl}</p>
          <p>{submission.createdAt}</p>
          <p>{submission.id}</p>
          <p>{submission.updatedAt}</p>
        </div>
      )
    })}
    </>
  )
}

export default DashboardPage