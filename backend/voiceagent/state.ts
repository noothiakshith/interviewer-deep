// 1. The Question Structure (from DB)
export interface Question {
  id: string;
  content: string;
  expectedKeyPoints: string[]; // For validation later
}

export interface userid {
  id: string
}

// 2. The User's Answer Structure (Accumulated during the loop)
export interface UserAnswer {
  questionId: string;
  audioTranscript: string; // The text from Speech-to-Text
}

// 3. The Final Score Structure (Generated at the very end)
export interface EvaluationReport {
  totalScore: number;
  summaryFeedback: string;
  questionBreakdown: {
    questionId: string;
    passed: boolean;
    feedback: string;
  }[];
}


import { Annotation } from "@langchain/langgraph";

// Define the State Graph with Reducers
export const InterviewState = Annotation.Root({
  /**
   * 1. Questions
   * Stores the 3 questions fetched from the DB.
   */
  questions: Annotation<Question[]>(),
  userid: Annotation<userid>(),

  /**
   * 2. Current Index
   * Tracks which question we are on (0, 1, or 2).
   */
  currentQuestionIndex: Annotation<number>({
    default: () => 0,
    reducer: (x, y) => y,
  }),

  /**
   * 3. Answers
   * Stores the candidate's answers. 
   */
  answers: Annotation<UserAnswer[]>({
    default: () => [],
    reducer: (existing, newAnswers) => [...existing, ...newAnswers],
  }),

  /**
   * 4. State tracking
   */
  lastTranscript: Annotation<string>(),
  audioBuffer: Annotation<Buffer | null>({
    default: () => null,
    reducer: (x, y) => y,
  }),
  awaitingAnswer: Annotation<boolean>({
    default: () => false,
    reducer: (x, y) => y,
  }),

  /**
   * 5. Final Evaluation
   * Stores the result after the batch validation node runs.
   */
  evaluation: Annotation<EvaluationReport | null>(),

  /**
   * 6. Question Audio (Base64)
   * Stores the TTS audio for the current question to be sent to frontend.
   */
  questionAudio: Annotation<string | null>({
    default: () => null,
    reducer: (x, y) => y,
  }),
});