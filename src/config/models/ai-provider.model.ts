export const AiProvider = {
  OpenAI: "openai",
  Azure: "azure",
} as const;

export type AiProvider = (typeof AiProvider)[keyof typeof AiProvider];
