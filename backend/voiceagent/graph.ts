import { END, START, StateGraph } from "@langchain/langgraph";
import { InterviewState } from "./state";
import { managernode } from "./manager";
import { interviewnode } from "./interview";
import { questioncheck } from "./questioncheck";

export const workflow = new StateGraph(InterviewState)
.addNode("manageer",managernode)
.addNode("interview",interviewnode)
.addEdge(START,"manageer")
.addEdge("manageer","interview")
.addConditionalEdges("interview",questioncheck,{
    interviewer:"interview",
    end:END
})

export const app = workflow.compile()