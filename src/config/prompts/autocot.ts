export const autoCotPrompt = ({ question }: { question: string }) => {
  return `You will formulate Chain of Thought (CoT) reasoning traces.
  CoT is a prompting technique that helps you to think about a problem in a structured way. It breaks down a problem into a series of logical reasoning traces.
  
  You will be given a question and using this question you will decompose the question into a series of logical reasoning traces. Only write the reasoning traces and do not answer the question yourself.
  
  Here are some examples of CoT reasoning traces:
  
  Question: Did Brazilian jiu-jitsu Gracie founders have at least a baker's dozen of kids between them?
  
  Reasoning traces:
  - Who were the founders of Brazilian jiu-jitsu?
  - What is the number represented by the baker's dozen?
  - How many children do Gracie founders have altogether
  - Is this number bigger than baker's dozen?
  
  Question: Is cow methane safer for environment than cars
  
  Reasoning traces:
  - How much methane is produced by cars annually?
  - How much methane is produced by cows annually?
  - Is methane produced by cows less than methane produced by cars?
  
  Question: ${question}
  
  Reasoning traces:
  `;
};
