import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

const fallbackQuestions = [
  "What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?",
  "What's the best book you've read recently?||Where is your dream vacation destination?||What's a skill you'd love to learn?",
  "What's your favorite childhood memory?||Do you prefer coffee or tea?||What is your go-to comfort movie?"
];

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      max_tokens: 400,
      stream: true,
      prompt,
    });

    const stream = OpenAIStream(response);
    
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.warn('OpenAI API call failed, falling back to local questions:', error);

    const randomSet = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
    
    const fallbackStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(randomSet));
        controller.close();
      }
    });

    return new StreamingTextResponse(fallbackStream);
  }
}
