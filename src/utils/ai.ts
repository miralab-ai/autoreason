import OpenAI from 'openai';

type ApiKeys = {
  openaiKey: string;
};

class AiProvider {
  public static getInstance({ openaiKey }: ApiKeys): AiProvider {
    if (!AiProvider.instance) {
      AiProvider.instance = new AiProvider(openaiKey);
    }

    return AiProvider.instance;
  }

  private static instance: AiProvider;
  private readonly openAi: OpenAI;
  private readonly scorer: OpenAI;
  private readonly autocot: OpenAI;

  private constructor(private readonly apiKey: string) {
    this.apiKey = apiKey;
    this.openAi = new OpenAI({
      apiKey: this.apiKey,
      maxRetries: 10,
      timeout: 60_000,
    });
    this.scorer = new OpenAI({
      apiKey: this.apiKey,
      maxRetries: 10,
      timeout: 60_000,
    });
    this.autocot = new OpenAI({
      apiKey: this.apiKey,
      maxRetries: 10,
      timeout: 60_000,
    });
  }

  public getOpenAi(): OpenAI {
    return this.openAi;
  }

  public getScorer(): OpenAI {
    return this.scorer;
  }

  public getAutoCot(): OpenAI {
    return this.autocot;
  }
}

export { AiProvider };
