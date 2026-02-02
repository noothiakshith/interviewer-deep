import { END, START, StateGraph, MemorySaver } from "@langchain/langgraph";
import { InterviewState } from "./state";
import { managernode } from "./manager";
import { interviewnode } from "./interview";
import { questioncheck } from "./questioncheck";
import { sttNode } from "./stt";
import { validationNode } from "./validation";

export const workflow = new StateGraph(InterviewState)
    .addNode("manageer", managernode)
    .addNode("interview", interviewnode)
    .addNode("stt", sttNode)
    .addNode("validation", validationNode)
    .addEdge(START, "manageer")
    .addEdge("manageer", "interview")
    .addEdge("interview", "stt")
    .addConditionalEdges("stt", questioncheck, {
        interviewer: "interview",
        end: "validation"
    })
    .addEdge("validation", END)

export const app = workflow.compile({
    checkpointer: new MemorySaver(),
    interruptAfter: ["interview"]
})