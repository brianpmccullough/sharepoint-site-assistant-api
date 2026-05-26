import { AiProvider } from "./ai-provider.model";

export interface AzureAdConfiguration {
  readonly tenantId: string;
  readonly clientId: string;
  readonly clientSecret: string;
  readonly tenantName: string;
}

export interface OpenAIConfiguration {
  readonly apiKey: string;
  readonly model: string;
}

export interface AzureAIConfiguration {
  readonly endpoint: string;
  readonly apiKey: string;
  readonly deployment: string;
  readonly apiVersion: string;
}

export interface AppConfiguration {
  readonly port: number;
  readonly azure: AzureAdConfiguration;
  readonly aiProvider: AiProvider;
  readonly openAI: OpenAIConfiguration;
  readonly azureAI: AzureAIConfiguration;
}
