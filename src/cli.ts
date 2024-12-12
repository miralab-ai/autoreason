#!/usr/bin/env node
import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import { select } from '@inquirer/prompts';
import { evalHotpotQa } from './utils/evals/hotpotqa.js';
import { evalStrategyQa } from './utils/evals/strategyqa.js';
import { evalCotStrategyQa } from './utils/evals/cot-strategyqa.js';
import { evalCotHotpotQa } from './utils/evals/cot-hotpotqa.js';
import { evalAutoCotHotpotQa } from './utils/evals/autocot-hotpotqa.js';
import { evalAutoCotStrategyQa } from './utils/evals/autocot-strategyqa.js';

const runMode = await select({
  message: 'Select run mode',
  choices: [
    {
      name: 'Testing',
      value: 'test',
    },
    {
      name: 'Evaluation',
      value: 'eval',
    },
    {
      name: 'Exit',
      value: 'exit',
    },
  ],
});

switch (runMode) {
  case 'test': {
    break;
  }

  case 'eval': {
    const evalType = await select({
      message: 'Select Evaluation Dataset',
      choices: [
        {
          name: 'HotpotQA',
          value: 'hotpotqa',
        },
        {
          name: 'CoT HotpotQA',
          value: 'cothotpotqa',
        },
        { name: 'Auto CoT HotpotQA', value: 'autocothotpotqa' },
        {
          name: 'StrategyQA',
          value: 'strategyqa',
        },
        {
          name: 'CoT StrategyQA',
          value: 'cotstrategyqa',
        },
        { name: 'Auto CoT StrategyQA', value: 'autocotstrategyqa' },
        {
          name: 'Exit',
          value: 'exit',
        },
      ],
    });

    switch (evalType) {
      case 'hotpotqa': {
        await evalHotpotQa();
        break;
      }

      case 'cothotpotqa': {
        await evalCotHotpotQa();
        break;
      }

      case 'autocothotpotqa': {
        await evalAutoCotHotpotQa();
        break;
      }

      case 'strategyqa': {
        await evalStrategyQa();
        break;
      }

      case 'cotstrategyqa': {
        await evalCotStrategyQa();
        break;
      }

      case 'autocotstrategyqa': {
        await evalAutoCotStrategyQa();
        break;
      }

      case 'exit': {
        process.exit(0);
      }

      // eslint-disable-next-line no-fallthrough
      default: {
        console.log('default');
        process.exit(1);
      }
    }

    break;
  }

  case 'exit': {
    process.exit(0);
  }

  // eslint-disable-next-line no-fallthrough
  default: {
    console.log('default');
    process.exit(1);
  }
}
