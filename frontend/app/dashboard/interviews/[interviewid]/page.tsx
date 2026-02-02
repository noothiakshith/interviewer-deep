"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import axios from "axios"

const Page = () => {
  const recorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [evaluation, setEvaluation] = useState<any>(null)

  const playAudio = (base64Audio: string) => {
    try {
      const binaryString = window.atob(base64Audio)
      const len = binaryString.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const audioBlob = new Blob([bytes], { type: 'audio/mp3' })
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.play()
    } catch (error) {
      console.error("Error playing audio:", error)
    }
  }

  const handleStart = async () => {
    setIsProcessing(true)
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post('http://localhost:5050/voice', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      console.log(res.data)

      const state = res.data

      if (state.completed) {
        setCurrentQuestion("Interview already completed.")
        return;
      }

      if (state.questions && state.questions.length > 0) {
        const questionText = state.questions[state.currentQuestionIndex]?.content
        setCurrentQuestion(questionText)
      }

      if (state.questionAudio) {
        playAudio(state.questionAudio)
      }
    } catch (error) {
      console.error("Error starting interview:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVoice = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream, {
      mimeType: "audio/webm",
    })
    recorderRef.current = recorder
    audioChunksRef.current = []
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data)
      }
    }
    recorder.onstop = async () => {
      setIsProcessing(true)
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      })
      const formData = new FormData()
      formData.append("audio", audioBlob, "answer.webm")

      const token = localStorage.getItem("token");
      try {
        const res = await axios.post('http://localhost:5050/send-buffer', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        })
        console.log("Buffer sent:", res.data)

        const state = res.data
        if (state.evaluation) {
          setEvaluation(state.evaluation)
          setCurrentQuestion("Interview Complete!")
        }
        else if (state.questions && state.questions.length > 0) {
          const idx = state.currentQuestionIndex
          if (idx < state.questions.length) {
            setCurrentQuestion(state.questions[idx].content)
          } else {
            setCurrentQuestion("Interview Complete! Processing results...")
          }
        }

        if (state.questionAudio) {
          playAudio(state.questionAudio)
        }

      } catch (error) {
        console.error("Error sending buffer:", error)
      } finally {
        setIsProcessing(false)
      }

      // Optional: Play back what user recorded
      // const audioUrl = URL.createObjectURL(audioBlob)
      // new Audio(audioUrl).play()
    }
    recorder.start()
    setTimeout(() => {
      if (recorder.state === "recording") {
        recorder.stop()
      }
    }, 5000)
  }

  if (evaluation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6 flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold">Interview Results</h1>
              <p className="text-muted-foreground">Here is how you performed</p>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
              <div className="text-5xl font-extrabold text-blue-600 mb-2">
                {evaluation.totalScore}/100
              </div>
              <p className="text-lg font-medium">Total Score</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Summary</h3>
              <p className="text-gray-700">{evaluation.summaryFeedback}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Question Breakdown</h3>
              {evaluation.questionBreakdown.map((q: any, i: number) => (
                <div key={i} className="border p-4 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Question {i + 1}</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${q.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {q.passed ? "PASSED" : "NEEDS IMPROVEMENT"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 italic mb-2">Score: {q.score}/10</p>
                  <p className="text-sm">{q.feedback}</p>
                </div>
              ))}
            </div>

            <Button onClick={() => window.location.reload()} className="w-full mt-4">
              Start New Interview
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">AI Interview</h1>
            <p className="text-sm text-muted-foreground">
              Voice-based technical interview
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4 min-h-[100px] flex items-center justify-center">
            {currentQuestion ? (
              <p className="text-base font-medium text-center">{currentQuestion}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Press Start to begin...</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleStart}
              disabled={isProcessing}
            >
              Start
            </Button>
            <Button
              variant="secondary"
              className="w-full bg-red-100 hover:bg-red-200 text-red-900"
              onClick={handleVoice}
              disabled={isProcessing}
            >
              🎙 Record Answer (5s)
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Powered by AI Interview Engine
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page