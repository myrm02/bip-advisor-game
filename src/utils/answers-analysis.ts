import { Mistral } from '@mistralai/mistralai';

const VITE_MISTRAL_API_KEY = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_MISTRAL_API_KEY) || '';

const client = new Mistral({
  apiKey: VITE_MISTRAL_API_KEY,
});

export default async function answerAnalysis(question: string, answer: string) {

  const inputJson = JSON.stringify({ question, answer });

  const response = await client.beta.conversations.start({
    agentId: 'ag_019ef9991bbe726385c8d9a515ecffc8',
    agentVersion: 10,
    inputs: inputJson
  });

  const messageOutput = response.outputs.find(
    (o: any) => o.type === "message.output"
  );

  if (!messageOutput) {
    throw new Error("No final message output found");
  }

  return JSON.parse(messageOutput?.content || '{}');
}
