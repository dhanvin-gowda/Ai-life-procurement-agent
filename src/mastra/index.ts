import { Mastra } from '@mastra/core'
import { testAgent } from "./agent/test-agent"

export const mastra = new Mastra({
  agents: { testAgent },
})

async function main() {

    const agent = mastra.getAgentById("test-agent");
    const resp = await agent.generate("explain export const mastra = new Mastra({");
    console.log(resp.text);
}

main();