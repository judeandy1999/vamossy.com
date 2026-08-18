import OpenAI from "openai";

let client;

export function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

export const openai = new Proxy(
  {},
  {
    get(_target, prop) {
      return getOpenAI()[prop];
    },
  }
);
