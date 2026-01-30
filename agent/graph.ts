import { StateGraph, START, END } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatMistralAI } from "@langchain/mistralai";
import { readFileTool, listFilesTool, runCommandTool } from "./tools";
import { GraphState } from "./state";
import { BaseMessage } from "@langchain/core/messages";

const tools = [readFileTool, listFilesTool, runCommandTool];
const toolNode = new ToolNode(tools);

const model = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0,
}).bindTools(tools);

function shouldContinue(state: typeof GraphState.State) {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1] as any;

    if (lastMessage.tool_calls?.length) {
        return "tools";
    }
    return END;
}

async function callModel(state: typeof GraphState.State) {
    const messages = state.messages;
    const response = await model.invoke(messages);
    return { messages: [response] };
}

const workflow = new StateGraph(GraphState)
    .addNode("agent", callModel)
    .addNode("tools", toolNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent");

export const graph = workflow.compile();
