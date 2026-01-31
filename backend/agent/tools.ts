import Sandbox from "@e2b/code-interpreter"
import { tool } from "@langchain/core/tools"
import * as z from "zod"

export const readFileTool = tool(
    async ({ path }, config) => {
        const sandbox = await Sandbox.connect(
            config.configurable.sandboxId
        )
        return await sandbox.files.read(path)
    },
    {
        name: "read_file",
        description: "Read a file from the sandbox",
        schema: z.object({
            path: z.string(),
        }),
    }
)

export const listFilesTool = tool(
    async ({ path }, config) => {
        const sandbox = await Sandbox.connect(
            config.configurable.sandboxId
        )
        const files = await sandbox.files.list(path)
        return JSON.stringify(files)
    },
    {
        name: "list_files",
        description: "List files in a directory",
        schema: z.object({
            path: z.string(),
        }),
    }
)

export const runCommandTool = tool(
    async ({ command }, config) => {
        const sandbox = await Sandbox.connect(
            config.configurable.sandboxId
        )
        const { stdout, stderr, exitCode } = await sandbox.commands.run(command)
        return JSON.stringify({ stdout, stderr, exitCode })
    },
    {
        name: "run_command",
        description: "Run a shell command in the sandbox",
        schema: z.object({
            command: z.string(),
        }),
    }
)
