import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AiProvider } from "./models/ai-provider.model";
import { AppConfiguration } from "./models/app-configuration.model";

@Injectable()
export class ConfigurationService {
  private readonly config: AppConfiguration;

  constructor(configService: ConfigService) {
    this.config = {
      port: parseInt(configService.get<string>("PORT") ?? "3000", 10),
      azure: {
        tenantId: configService.getOrThrow<string>("AZURE_TENANT_ID"),
        clientId: configService.getOrThrow<string>("AZURE_CLIENT_ID"),
        clientSecret: configService.getOrThrow<string>("AZURE_CLIENT_SECRET"),
        tenantName: configService.getOrThrow<string>("TENANT_NAME"),
      },
      aiProvider: (configService.get<string>("AI_PROVIDER") ??
        AiProvider.OpenAI) as AiProvider,
      openAI: {
        apiKey: configService.get<string>("OPENAI_API_KEY") ?? "",
        model: configService.get<string>("OPENAI_MODEL") ?? "gpt-4o-mini",
      },
      azureAI: {
        endpoint: configService.get<string>("AZURE_AI_ENDPOINT") ?? "",
        apiKey: configService.get<string>("AZURE_AI_API_KEY") ?? "",
        deployment: configService.get<string>("AZURE_AI_DEPLOYMENT") ?? "",
        apiVersion:
          configService.get<string>("AZURE_AI_API_VERSION") ??
          "2025-01-01-preview",
      },
    };

    validateAiProviderConfig(this.config);
  }

  getConfiguration(): AppConfiguration {
    return this.config;
  }
}

export function validateAiProviderConfig(config: AppConfiguration): void {
  if (config.aiProvider === AiProvider.Azure) {
    if (
      !config.azureAI.endpoint ||
      !config.azureAI.apiKey ||
      !config.azureAI.deployment
    ) {
      throw new Error(
        "Azure AI provider requires azureAI.endpoint, azureAI.apiKey, and azureAI.deployment to be configured",
      );
    }
  } else {
    if (!config.openAI.apiKey) {
      throw new Error(
        "OpenAI provider requires openai.apiKey to be configured",
      );
    }
  }
}
