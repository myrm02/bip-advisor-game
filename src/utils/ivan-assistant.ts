import { Mistral } from '@mistralai/mistralai';

const VITE_MISTRAL_API_KEY = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_MISTRAL_API_KEY) || '';

const client = new Mistral({
  apiKey: VITE_MISTRAL_API_KEY,
});

export default async function supportAgent(question: string) {

  const response = await client.beta.conversations.start({
    agentId: 'ag_019f0986bc4376d09e65a1100e52af23',
    agentVersion: 9,
    inputs: [
      {
        ...history,
        role: "user",
        content: question,
      },
    ]
  });

  const message = response.outputs?.find(
    (o: any) => o.type === "message.output"
  );

  return message?.content ?? "";
}