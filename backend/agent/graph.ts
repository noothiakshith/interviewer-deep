import { END, START, StateGraph } from "@langchain/langgraph";
import { GraphState } from "./state";
import { resumenode } from "./resume";
import { githubnode } from "./github";
import { scoringnode } from "./scoring";

const routeToScoring = (state: typeof GraphState.State) => {
    const hasResume = state.resume_data && typeof state.resume_data.rating === 'number';
    const hasGithub = state.github_data && typeof state.github_data.rating === 'number';

    if (hasResume && hasGithub) {
        return "scoringnode";
    }
    return END;
};

const workflow = new StateGraph(GraphState)
    .addNode("resumenode", resumenode)
    .addNode("githubnode", githubnode)
    .addNode("scoringnode", scoringnode)
    .addEdge(START, "resumenode")
    .addEdge(START, "githubnode")
    .addConditionalEdges("resumenode", routeToScoring)
    .addConditionalEdges("githubnode", routeToScoring)
    .addEdge("scoringnode", END)

export const app = workflow.compile()
const drawableGraph = await app.getGraphAsync();
const png = await drawableGraph.drawMermaidPng();
Bun.write(process.cwd() + '/graph.png', png);