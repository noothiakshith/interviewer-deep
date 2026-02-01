import { InterviewState } from "./state";
import { ElevenLabsClient, play } from '@elevenlabs/elevenlabs-js';
import { Readable } from 'stream';

export const interviewnode = async(state: typeof InterviewState.State)=>{
    const questionindex = state.currentQuestionIndex;
    const question = state.questions[questionindex]?.content||"";
    console.log(question)
    const elevenlabs = new ElevenLabsClient({
        apiKey:process.env.ELEVENLABS_API_KEY
    });
const audio = await elevenlabs.textToSpeech.convert('JBFqnCBsd6RMkjVDRZzb', {
  text:question,
  modelId: 'eleven_multilingual_v2',
  outputFormat: 'mp3_44100_128',
});
const reader = audio.getReader();
const stream = new Readable({
  async read() {
    const { done, value } = await reader.read();
    if (done) {
      this.push(null);
    } else {
      this.push(value);
    }
  },
});
await play(stream);
return{
    currentQuestionIndex:questionindex+1
}
}