"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const Page = () => {
  const recorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
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
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      })
      const formData = new FormData()
      formData.append("audio", audioBlob, "answer.webm")
      const audioUrl = URL.createObjectURL(audioBlob)
      new Audio(audioUrl).play()
    }
    recorder.start()
    setTimeout(() => recorder.stop(), 5000)
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

          <div className="rounded-lg bg-muted p-4">
            <p className="text-xs text-muted-foreground mb-1">
              Question 1
            </p>
            <p className="text-base font-medium">
              Explain event delegation in JavaScript.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button variant="secondary" className="w-full" onClick={handleVoice}>
              🎙 Talk
            </Button>
            <Button className="w-full">
              Next Question →
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