import { InterviewState } from "./state";
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

export const interviewnode = async (state: typeof InterviewState.State) => {
  const questionindex = state.currentQuestionIndex;
  const question = state.questions[questionindex]?.content || "";
  console.log("Generating audio for question:", question)

  if (!question) {
    return {
      awaitingAnswer: true,
      questionAudio: null
    }
  }

  const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY
  });

  try {
    const audioStream = await elevenlabs.textToSpeech.convert('JBFqnCBsd6RMkjVDRZzb', {
      text: question,
      modelId: 'eleven_multilingual_v2',
      outputFormat: 'mp3_44100_128',
    });

    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(Buffer.from(chunk));
    }
    const audioBuffer = Buffer.concat(chunks);
    const audioBase64 = audioBuffer.toString('base64');

    return {
      awaitingAnswer: true,
      questionAudio: audioBase64
    }
  } catch (error) {
    console.error("Error generating text to speech:", error);
    return {
      awaitingAnswer: true,
      questionAudio: null
    }
  }
}