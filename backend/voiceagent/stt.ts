import { InterviewState } from "./state"
import { createClient } from "@deepgram/sdk"
import { Readable } from "stream"

export const sttNode = async (
    state: typeof InterviewState.State
) => {
    let finalAudioBuffer = state.audioBuffer;

    // Ensure it is a Buffer (handle serialization cases)
    if (finalAudioBuffer && !Buffer.isBuffer(finalAudioBuffer)) {
        if ((finalAudioBuffer as any).data) {
            finalAudioBuffer = Buffer.from((finalAudioBuffer as any).data);
        } else {
            finalAudioBuffer = Buffer.from(finalAudioBuffer as any);
        }
    }

    if (!finalAudioBuffer || !Buffer.isBuffer(finalAudioBuffer)) {
        console.error("STT Node: Invalid audio buffer format");
        return { awaitingAnswer: false };
    }

    try {
        const deepgram = createClient(process.env.DEEPGRAM_API_KEY!)
        const stream = Readable.from(finalAudioBuffer as Buffer);

        const { result, error } =
            await deepgram.listen.prerecorded.transcribeFile(
                stream,
                {
                    model: "nova-3",
                    smart_format: true,
                    mimetype: "audio/webm",
                }
            )

        if (error) {
            throw error
        }

        const transcript =
            result.results.channels[0].alternatives[0].transcript

        const currentQuestion = state.questions[state.currentQuestionIndex];

        return {
            lastTranscript: transcript,
            answers: [{
                questionId: currentQuestion?.id || "unknown",
                audioTranscript: transcript
            }],
            currentQuestionIndex: state.currentQuestionIndex + 1,
            awaitingAnswer: false,
            audioBuffer: null,
            questionAudio: null
        }
    } catch (err) {
        console.error("STT Node Error:", err)
        throw err
    }
}