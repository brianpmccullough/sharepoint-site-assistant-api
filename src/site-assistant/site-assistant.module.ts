import { Module } from "@nestjs/common";
import { SiteAssistantController } from "./site-assistant.controller";
import { SiteAssistantService } from "./site-assistant.service";

@Module({
  controllers: [SiteAssistantController],
  providers: [SiteAssistantService],
})
export class SiteAssistantModule {}
