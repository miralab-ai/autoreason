import { resolve } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { type ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import StrategyQa from '../../../data/strategyqa/strategyqa_dev.json' assert { type: 'json' };
import { baseStrategyQaPrompt } from '../../config/prompts/strategyqa.js';
import { AiProvider } from '../ai.js';
import { shuffleArray } from '../shuffle.js';
import { score } from './score.js';

const saveEvalResults = async (results: any[]) => {
  const date = new Date();
  const path = resolve(
    'data/strategyqa/runs',
    `GPT4-${date.getFullYear()}${
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

const evalStrategyQa = async () => {
  shuffleArray(StrategyQa);
  const strategyQa = StrategyQa.slice(0, 20);

  const ai = AiProvider.getInstance({
    openaiKey: process.env?.['OPENAI_API_KEY'] ?? '',
  });
  const openai = ai.getOpenAi();

  const resultsPromises = strategyQa.map(async ({ question, answer }) => {
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: baseStrategyQaPrompt },
      { role: 'user', content: question },
    ];
    const result = await openai.chat.completions.create({
      messages,
      model: 'gpt-4-1106-preview',
      max_tokens: 4000,
      stream: false,
      temperature: 0.4,
    });

    if (!result.choices[0]?.message?.content) {
      throw new Error('No response in strategyqa eval');
    }

    const answerScore = await score({
      question,
      correctAnswer: answer.toString(),
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
  const path = await saveEvalResults(results);
  console.log(`Saved eval results to ${path}`);
};

export { evalStrategyQa };
