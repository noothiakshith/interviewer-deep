import { InterviewState } from "./state"
export const questioncheck=async(state:typeof InterviewState.State)=>{
    if(state.currentQuestionIndex<state.questions.length){
        return "interviewer"
    }
    return "end"
}