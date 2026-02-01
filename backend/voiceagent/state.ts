// 1. The Question Structure (from DB)
export interface Question {
  id: string;
  content: string;
  expectedKeyPoints: string[]; // For validation later
}

export interface userid{
    id:string
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
   * Reducer: Overwrite (default). When the first node runs, it sets this list.
   */
  questions: Annotation<Question[]>(),
  userid:Annotation<userid>(),

  /**
   * 2. Current Index
   * Tracks which question we are on (0, 1, or 2).
   * Reducer: Overwrite. We just update the number directly.
   */
  currentQuestionIndex: Annotation<number>({
    default: () => 0,
    reducer: (x, y) => y, // Simply replace the old index with the new one
  }),

  /**
   * 3. Answers (CRITICAL REDUCER)
   * Stores the candidate's answers. 
   * Reducer: Append. We want to ADD to this list, not replace it, 
   * so we can validate all 3 at the end.
   */
  answers: Annotation<UserAnswer[]>({
    default: () => [],
    reducer: (existing, newAnswers) => [...existing, ...newAnswers],
  }),

  /**
   * 4. Final Evaluation
   * Stores the result after the batch validation node runs.
   * Reducer: Overwrite.
   */
  evaluation: Annotation<EvaluationReport | null>(),
});