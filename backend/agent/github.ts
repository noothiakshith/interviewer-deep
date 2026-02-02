import { ChatMistralAI } from "@langchain/mistralai"
import { HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages"
import * as z from 'zod'
import type { GraphState } from "./state"
import { listFilesTool, readFileTool, runCommandTool } from "./tools"
import Sandbox from "@e2b/code-interpreter"

const llm = new ChatMistralAI({
    model: "mistral-large-latest",
    temperature: 0,
    maxRetries: 2,
})

const llmWithTools = llm.bindTools([readFileTool, listFilesTool, runCommandTool])

export const githubschema = z.object({
    url: z.string().url(),
    techstack: z.array(z.string()),
    rating: z.number(),
    isgenuine: z.boolean(),
    detailedview: z.array(z.string()),
    codequality: z.array(z.string()),
    projectimpact: z.array(z.string()),
    questions: z.array(z.string()),
    flowscore: z.number()
})


export const githubnode = async (state: typeof GraphState.State) => {
    const sandbox = await Sandbox.create()
    console.log(sandbox.sandboxId);
    console.log("sandbox has been running");

    if (!state.github_url) {
        console.log("githubnode: No github_url provided, skipping GitHub analysis.");
        return {
            github_data: {
                url: "",
                techstack: [],
                rating: 0,
                isgenuine: false,
                detailedview: ["No GitHub URL provided"],
                codequality: [],
                projectimpact: [],
                questions: [],
                flowscore: 0
            }
        }
    }

    const gitclone = await sandbox.commands.run(`git clone ${state.github_url}`)
    console.log(gitclone)
    const Systemprompt = `You are an expert github agent with experience evaluating u need to go through the whole github repo and evaluate the repo on software engineeering standards u know and the url and you are also having all the tools like readfile, listfiles, runcommand to evaluate the github repo use them and read completely You need not to read all packages or files u need read the core content not lockfiles or test files just core content if u feel that read information is enough then stop`

    const toolsByName = {
        read_file: readFileTool,
        list_files: listFilesTool,
        run_command: runCommandTool
    };

    const messages: any[] = [
        new SystemMessage(Systemprompt),
        new HumanMessage(`Do the github evaluation for the url ${state.github_url}. The repo is cloned. Start by listing files to understand the structure.`),
    ];

    for (let i = 0; i < 5; i++) {
        const response = await llmWithTools.invoke(messages, {
            configurable: {
                sandboxId: sandbox.sandboxId
            }
        });
        messages.push(response);

        if (response.tool_calls && response.tool_calls.length > 0) {
            console.log("Tool calls:", response.tool_calls.map(tc => tc.name));

            for (const toolCall of response.tool_calls) {
                const tool = toolsByName[toolCall.name as keyof typeof toolsByName];
                if (tool) {
                    try {
                        let toolOutput = await (tool as any).invoke(toolCall.args, {
                            configurable: { sandboxId: sandbox.sandboxId }
                        });

                        // Truncate output to prevent hitting context limits
                        if (typeof toolOutput === 'string' && toolOutput.length > 1500) {
                            toolOutput = toolOutput.substring(0, 1500) + "\n... [Output Truncated]";
                        }

                        messages.push(new ToolMessage({
                            content: toolOutput,
                            tool_call_id: toolCall.id!,
                            name: toolCall.name
                        }));
                    } catch (e) {
                        messages.push(new ToolMessage({
                            content: `Error executing tool: ${e}`,
                            tool_call_id: toolCall.id!,
                            name: toolCall.name
                        }));
                    }
                } else {
                    messages.push(new ToolMessage({
                        content: `Tool ${toolCall.name} not found.`,
                        tool_call_id: toolCall.id!,
                        name: toolCall.name
                    }));
                }
            }
        } else {
            break;
        }
    }

    console.log("Generating structured report...");
    messages.push(new HumanMessage("You have finished exploring the code. Now generate the final evaluation report based on the findings above."));
    const response = await llm.withStructuredOutput(githubschema).invoke(messages)

    console.log(response)

    if (!response) {
        throw new Error("Failed to generate structured report.");
    }

    console.log("bro calling the github node")

    return {
        github_data: {
            url: state.github_url,
            techstack: response.techstack,
            rating: response.rating,
            isgenuine: response.isgenuine,
            detailedview: response.detailedview,
            codequality: response.codequality,
            projectimpact: response.projectimpact,
            questions: response.questions,
            flowscore: response.flowscore
        }
    }
}