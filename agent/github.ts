import 'dotenv/config'
import { Sandbox } from '@e2b/code-interpreter'
import { SystemMessage, HumanMessage } from '@langchain/core/messages'
import { graph } from "./graph"

const githubUrl = 'https://github.com/noothiakshith/interviewer-deep.git'
const sandboxDir = '/home/user'

export const githubnode = async () => {
    const name = githubUrl.split('/').pop()?.replace('.git', '')
    if (!name) throw new Error('Invalid GitHub URL')

    console.log(`Creating sandbox...`)
    const sbx = await Sandbox.create({
        apiKey: process.env.E2B_API_KEY,
    })
    console.log(`Sandbox created: ${sbx.sandboxId}`)

    try {
        const repoDir = `${sandboxDir}/${name}`
        console.log(`Cloning ${githubUrl} to ${repoDir}...`)
        await sbx.commands.run(`git clone ${githubUrl} ${repoDir}`, { timeoutMs: 60000 })

        console.log(`Running agent...`)
        const result = await graph.invoke(
            {
                messages: [
                    new SystemMessage(
                        `You are an expert in reading repositories.
             You have access to a sandbox environment where the repository is cloned at ${repoDir}.
             You must explore the repo using tools only.
             Start by listing the files in the repository directory.`
                    ),
                    new HumanMessage("Give me a 30-line detailed summary of this repository."),
                ],
            },
            {
                configurable: {
                    sandboxId: sbx.sandboxId,
                },
            }
        )

        const finalMessages = result.messages;
        console.log("Final Response:");
        if (finalMessages && finalMessages.length > 0) {
            console.log(finalMessages[finalMessages.length - 1].content)
        }

    } catch (error) {
        console.error(error)
    } finally {
        // Keep sandbox alive for inspection if needed, or kill it. 
        // await sbx.kill() 
    }
}

githubnode()
