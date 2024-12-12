import { resolve } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { type ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import HotpotQa from '../../../data/hotpotqa/hotpot_dev_v1_simplified.json' assert { type: 'json' };
import { cotHotpotQaPrompt } from '../../config/prompts/cot-hotpotqa.js';
import { AiProvider } from '../ai.js';
import { shuffleArray } from '../shuffle.js';
import { score } from './score.js';

const saveEvalResults = async (results: any[]) => {
  const date = new Date();
  const path = resolve(
    'data/hotpotqa/runs/cot',
    `${date.getFullYear()}${
      date.getMonth() + 1
    }${date.getDay()}-${date.getHours()}:${date.getMinutes()}.json`,
  );

  const correctAnswers = results.filter(
    (result: any) => result.verdict.toLowerCase() === 'correct'.toLowerCase(),
  ).length;

  const totalAnswers = results.length;

  const percentScore = (correctAnswers / totalAnswers) * 100;

  const summary = {
    correctAnswers,
    totalAnswers,
    percentScore,
  };

  const data = {
    summary,
    results,
  };

  await writeFile(path, JSON.stringify(data, null, 2));
  return path;
};

const evalCotHotpotQa = async () => {
  shuffleArray(HotpotQa);
  const hotpotQa = HotpotQa.slice(0, 20);

  const ai = AiProvider.getInstance({
    openaiKey: process.env?.['OPENAI_API_KEY'] ?? '',
  });
  const openai = ai.getOpenAi();

  const resultsPromises = hotpotQa.map(async ({ question, answer }) => {
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: cotHotpotQaPrompt({ question }) },
      { role: 'user', content: question },
    ];
    const result = await openai.chat.completions.create({
      messages,
      model: 'gpt-3.5-turbo-1106',
      max_tokens: 4000,
      stream: false,
      temperature: 0.3,
    });

    if (!result.choices[0]?.message?.content) {
      throw new Error('No response in hotpotqa eval');
    }

    const answerScore = await score({
      question,
      correctAnswer: answer,
      answer: result.choices[0].message.content,
    });

    const verdict = answerScore > 6 ? 'correct' : 'incorrect';

    return {
      question,
      answer,
      response: result.choices[0].message.content,
      answerScore,
      verdict,
    };
  });
  const results = await Promise.all(resultsPromises);

  const savedPath = await saveEvalResults(results);
  console.log(`saved results to ${savedPath}`);
};

export { evalCotHotpotQa };
