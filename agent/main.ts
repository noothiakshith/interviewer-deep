import { app } from "./graph";
import { GraphState } from "./state";

export const main = async () => {
    const initialConfig: typeof GraphState.State = {
        messages: [],
        input_url: "https://github.com/noothiakshith/iomp1.git", 
        resume_data: {
            experience: 0,
            skills: [],
            rating: 0,
            feedback: "",
            redflags: [],
            strengths: [],
            comments: [],
            priority: "low"
        },
        github_data: {
            url: "",
            techstack: [],
            rating: 0,
            isgenuine: false,
            detailedview: "",
            codequality: "",
            projectimpact: "",
            questions: [],
            flowscore: 0
        },
    } as any; 

    console.log("Invoking agent...");
    const response = await app.invoke(initialConfig);
    console.log("Agent finished!");
    console.log("Final State:", JSON.stringify(response, null, 2));
}

main()