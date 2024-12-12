import { type ScorePromptParameters } from '../../types/score.js';

export const scorePrompt = ({
  question,
  answer,
  correctAnswer,
}: ScorePromptParameters) => {
  return `Your job is to score an answer's correctness from 0 to 10. You will be given the question, the correct answer, and the answer you need to score.
  0 means the answer is completely wrong, 10 means the answer is completely correct. Explain your reasoning first shortly, and then write the score as a literal number (0 to 10).

  Question: ${question}
  Answer: ${answer}
  Correct Answer: ${correctAnswer}
  Score: `;
};
