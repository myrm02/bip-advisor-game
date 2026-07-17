import { Mistral } from '@mistralai/mistralai';

const VITE_MISTRAL_API_KEY = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_MISTRAL_API_KEY) || '';

const client = new Mistral({
  apiKey: VITE_MISTRAL_API_KEY,
});

export default async function generatedQuestion(
  language: string,
  profile_type: string
) {

  const inputJson = JSON.stringify({ language, profile_type });

  const response = await client.beta.conversations.start({
    agentId: 'ag_019ef996332e740aa7891185c9680c9d',
    agentVersion: 25,
    inputs: inputJson
  });

  const messageOutput = response.outputs.find(
    (o: any) => o.type === "message.output"
  );

  if (!messageOutput) {
    throw new Error("No final message output found");
  }

  return JSON.parse(messageOutput.content);
}