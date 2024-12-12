import { type ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { AiProvider } from '../ai.js';
import { scorePrompt } from '../../config/prompts/score.js';
import { type ScorePromptParameters } from '../../types/score.js';

const score = async ({
  question,
  answer,
  correctAnswer,
}: ScorePromptParameters) => {
  const ai = AiProvider.getInstance({
    openaiKey: process.env?.['OPENAI_API_KEY'] ?? '',
  });
  const openai = ai.getScorer();

  const messages = [
    {
      role: 'system',
      content: scorePrompt({ question, answer, correctAnswer }),
    },
  ] as ChatCompletionMessageParam[];

  try {
    const aiResponse = await openai.chat.completions.create({
      temperature: 0.3,
      max_tokens: 4000,
      messages,
      model: 'gpt-4-1106-preview',
      stream: false,
    });

    if (!aiResponse.choices[0]?.message?.content) {
      throw new Error('No response in score eval');
    }

    const { content } = aiResponse.choices[0].message;

    const scoreNumber = Number.parseInt(content, 10);

    if (Number.isNaN(scoreNumber)) {
      // console.log(`Score is NaN: ${aiResponse.choices[0].message.content}`);
      // console.log('attempting to extract the score from the response');

      const pattern = /\d+/;
      const match = pattern.exec(content);
      const number = match ? Number.parseInt(match[0], 10) : 0;

      return number;
    }

    return scoreNumber;
  } catch (error) {
    throw new Error(error as string);
  }
};

export { score };
