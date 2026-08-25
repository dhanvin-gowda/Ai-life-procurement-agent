import { Agent } from '@mastra/core/agent';

export const testAgent = new Agent({
    id:'test-agent',
    name:'Test-agnet',
    instructions:"You are helpful assistent",
    model:"groq/allam-2-7b"
})


