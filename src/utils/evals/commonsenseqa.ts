import { type ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import CommonsenseQa from '../../../data/commonsenseqa/dev-rand-split.json' assert { type: 'json' };
import { baseHotpotqaPrompt } from '../../config/prompts/hotpotqa.js';
import { AiProvider } from '../ai.js';
import { shuffleArray } from '../shuffle.js';
import { score } from './score.js';

const evalHotpotQa = async () => {
  shuffleArray(HotpotQa);
  const hotpotQa = HotpotQa.slice(0, 10);

  const ai = AiProvider.getInstance({
    openaiKey: process.env?.['OPENAI_API_KEY'] ?? '',
  });
  const openai = ai.getOpenAi();

  const resultsPromises = hotpotQa.map(async ({ question, answer }) => {
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: baseHotpotqaPrompt },
      { role: 'user', content: question },
    ];
    const result = await openai.chat.completions.create({
      messages,
      model: 'gpt-3.5-turbo-1106',
      max_tokens: 2048,
      stream: false,
      temperature: 0.5,
    });

    if (!result.choices[0]?.message?.content) {
      throw new Error('No response in hotpotqa eval');
    }

    const answerScore = Number(
      await score({
        question,
        answer,
        correctAnswer: result.choices[0].message.content,
      }),
    );

    if (Number.isNaN(answerScore)) {
      throw new TypeError('Answer score is NaN');
    }

    return {
      question,
      answer,
      response: result.choices[0].message.content,
      answerScore,
      verdict: answerScore > 6 ? 'correct' : 'incorrect',
    };
  });
  const results = await Promise.all(resultsPromises);
  console.log(results);
};

export { evalHotpotQa };
