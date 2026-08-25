import dotenv from "dotenv"
import { testAgent } from "./agent/select-product-client";
import { Mastra } from "@mastra/core";
dotenv.config();
export const resp = new Mastra({
  agents:{testAgent}
})

const agent = resp.getAgentById('test-agent');

  const response = await agent.generate("what is photosynthesis");
  console.log(response.text);

