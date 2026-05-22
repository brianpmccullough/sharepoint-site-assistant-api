import { plainToInstance } from "class-transformer";
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  validateSync,
} from "class-validator";

class EnvironmentVariables {
  @IsInt()
  @Min(1)
  PORT: number = 3000;

  @IsString()
  AZURE_TENANT_ID: string = "";

  @IsString()
  AZURE_CLIENT_ID: string = "";

  @IsString()
  AZURE_CLIENT_SECRET: string = "";

  @IsString()
  TENANT_NAME: string = "";

  @IsString()
  OPENAI_API_KEY: string = "";

  @IsOptional()
  @IsString()
  OPENAI_MODEL?: string;
}

export function validateConfig(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validated;
}

export const appConfig = () => ({
  port: parseInt(process.env.PORT ?? "3000", 10),
  azure: {
    tenantId: process.env.AZURE_TENANT_ID ?? "",
    clientId: process.env.AZURE_CLIENT_ID ?? "",
    clientSecret: process.env.AZURE_CLIENT_SECRET ?? "",
  },
  tenantName: process.env.TENANT_NAME ?? "",
  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? "",
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
  },
});
