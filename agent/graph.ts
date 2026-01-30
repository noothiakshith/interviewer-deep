import { END, START, StateGraph } from "@langchain/langgraph";
import { GraphState } from "./state";
import { resumenode } from "./resume";


const workflow = new StateGraph(GraphState)
.addNode("resumenode",resumenode)
.addEdge(START,"resumenode")
.addEdge("resumenode",END)

export const app = workflow.compile()
const drawableGraph = await app.getGraphAsync();
const png = await drawableGraph.drawMermaidPng();
Bun.write(process.cwd() + '/graph.png', png);