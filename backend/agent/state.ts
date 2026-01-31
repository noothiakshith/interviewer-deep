import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";



export interface resume {
    name: string;
    experience: number;
    skills: string[];
    rating: number;
    feedback: string;
    redflags: string[];
    strengths: string[];
    comments: string[];
    priority: string;
}

export interface github {
    url: string;
    techstack: string[];
    rating: number;
    isgenuine: boolean;
    detailedview: string;
    codequality: string;
    projectimpact: string;
    questions: string[];
    flowscore: number;
}

export interface general {
    url: string;
    resume: resume;
    github: github;
    overallrating: number;
    verdict: string;
}


export const GraphState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
        reducer: (x, y) => x.concat(y),
        default: () => [],
    }),
    input_url: Annotation<string>(),
    github_url: Annotation<string>(),
    resume_data: Annotation<resume>({
        reducer: (current, update) => ({ ...current, ...update }),
        default: () => ({} as resume),
    }),
    github_data: Annotation<github>({
        reducer: (current, update) => ({ ...current, ...update }),
        default: () => ({} as github),
    }),

    final_report: Annotation<general>(),
});