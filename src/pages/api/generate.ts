import { openAIStream, OpenAIStreamPayload } from "@/utils/open-ai-stream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
}

export default async function handler(req: Request) {
  const { prompt } = (await req.json()) as {
    prompt?: string;
  };
  
  const payload: OpenAIStreamPayload = {
    model: "text-davinci-003",
    prompt: prompt ?? '',
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream:true,
    n: 1,
  };

  const stream = await openAIStream(payload)
  return new Response(stream)
}