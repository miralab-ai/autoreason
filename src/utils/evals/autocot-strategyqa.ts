import { resolve } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { type ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import StrategyQa from '../../../data/strategyqa/strategyqa_dev.json' assert { type: 'json' };
import { AiProvider } from '../ai.js';
import { shuffleArray } from '../shuffle.js';
import { score } from './score.js';
import { autoCotGenerator } from './autocot.js';

const saveEvalResults = async (results: any[]) => {
  const date = new Date();
  const path = resolve(
    'data/strategyqa/runs/autocot',
    `GPT-4-${date.getFullYear()}${
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

const evalAutoCotStrategyQa = async () => {
  shuffleArray(StrategyQa);
  const strategyQa = StrategyQa.slice(0, 20);

  const ai = AiProvider.getInstance({
    openaiKey: process.env?.['OPENAI_API_KEY'] ?? '',
  });
  const openai = ai.getOpenAi();

  const resultsPromises = strategyQa.map(async ({ question, answer }) => {
    const prompt = await autoCotGenerator({ question });

    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: prompt },
      { role: 'user', content: question },
    ];
    const result = await openai.chat.completions.create({
      messages,
      model: 'gpt-4-1106-preview',
      max_tokens: 4000,
      stream: false,
      temperature: 0.5,
    });

    if (!result.choices[0]?.message?.content) {
      throw new Error('No response in autocot strategyqa eval');
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
  const savedPath = await saveEvalResults(results);
  console.log(`saved results to ${savedPath}`);
};

export { evalAutoCotStrategyQa };
