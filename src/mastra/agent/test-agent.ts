import { Mastra } from '@mastra/core'
import { Agent } from '@mastra/core/agent'
import dotenv from "dotenv"
dotenv.config()
export const testAgent = new Agent({
    id:'test-agent',
    name:'test-agent',
    instructions:"you are coding agent",
   model: "groq/llama-3.1-8b-instant",

})

