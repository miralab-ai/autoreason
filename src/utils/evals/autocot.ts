import { type ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { autoCotPrompt } from '../../config/prompts/autocot.js';
import { AiProvider } from '../ai.js';

export const autoCotGenerator = async ({ question }: { question: string }) => {
  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: autoCotPrompt({ question }) },
  ];

  const aiProvider = AiProvider.getInstance({
    openaiKey: process.env?.['OPENAI_API_KEY'] ?? '',
  });
  const autocot = aiProvider.getAutoCot();

  try {
    const response = await autocot.chat.completions.create({
      messages,
      model: 'gpt-4-1106-preview',
      max_tokens: 4000,
      stream: false,
      temperature: 0.7,
    });

    if (!response.choices[0]?.message?.content) {
      throw new Error('No response in autocot generator');
    }

    const { content } = response.choices[0].message;

    const formattedPrompt = formatAutoCot(content);

    return formattedPrompt;
  } catch (error) {
    throw new Error(`error in autocot generator: ${error as string}`);
  }
};

const formatAutoCot = (reasoningTraces: string) => {
  return `Use these reasoning traces below to answer the question:

  ${reasoningTraces}
  Indicate your FINAL answer clearly below:
  `;
};
