# AutoReason: Automatic Few-Shot Reasoning Decomposition

## Abstract

Chain of Thought (CoT) was introduced in recent research as a method for improving step-by-step reasoning in Large Language Models. However, CoT has limited applications such as its need for hand-crafted few-shot exemplar prompts and no capability to adjust itself to different queries.

In this work, we propose a system to automatically generate rationales using CoT. Our method improves multi-step implicit reasoning capabilities by decomposing the implicit query into several explicit questions. This provides interpretability for the model, improving reasoning in weaker LLMs. We test our approach with two Q&A datasets: StrategyQA and HotpotQA. We show an increase in accuracy with both, especially on StrategyQA.

## Usage

1. Copy `.env.example` to `.env` and put your OpenAI API key in there.
2. Compile to JS from TS with `pnpm build`
3. Run the CLI with `node ./dist/src/cli.js`

## File-Folder Conventions

- `src/data`: Datasets used in the evals.
- `src/config/prompts`: AutoReason prompts, CoT prompts and base prompts for each of the datasets. These are used in the evals.
- `src/utils/evals`: Evaluation/Testing methods for each dataset and method.

## Citation

Please cite our paper if you are using it in your studies:

```tex
@misc{sevinc2024autoreasonautomaticfewshotreasoning,
      title={AutoReason: Automatic Few-Shot Reasoning Decomposition},
      author={Arda Sevinc and Abdurrahman Gumus},
      year={2024},
      eprint={2412.06975},
      archivePrefix={arXiv},
      primaryClass={cs.CL},
      url={https://arxiv.org/abs/2412.06975},
}
```
