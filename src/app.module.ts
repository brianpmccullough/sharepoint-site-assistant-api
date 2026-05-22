import { Module } from "@nestjs/common";
import { ConfigModule } from "./config/config.module";
import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./health/health.module";
import { SiteAssistantModule } from "./site-assistant/site-assistant.module";

@Module({
  imports: [ConfigModule, AuthModule, HealthModule, SiteAssistantModule],
})
export class AppModule {}
