import { setDefaultOpenAIClient, setDefaultOpenAIKey } from "@openai/agents";
import { AzureOpenAI } from "openai";
import { AiProvider } from "../../config/models/ai-provider.model";
import { AppConfiguration } from "../../config/models/app-configuration.model";

export function configureAiProvider(config: AppConfiguration): string {
  if (config.aiProvider === AiProvider.Azure) {
    setDefaultOpenAIClient(
      new AzureOpenAI({
        endpoint: config.azureAI.endpoint,
        apiKey: config.azureAI.apiKey,
        apiVersion: config.azureAI.apiVersion,
        deployment: config.azureAI.deployment,
      }),
    );
    return config.azureAI.deployment;
  }

  setDefaultOpenAIKey(config.openAI.apiKey);
  return config.openAI.model;
}
