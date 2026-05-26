import { Injectable, Logger } from "@nestjs/common";
import { Agent, run } from "@openai/agents";
import type { AgentInputItem } from "@openai/agents";
import { ConfigurationService } from "../config/configuration.service";
import { AuthenticatedUser } from "../auth/models/authenticated-user.model";
import { SharePointSite } from "./models/sharepoint-site.model";
import { ChatRequest } from "./models/chat-request.model";
import { currentDateTimeTool } from "./tools/current-date-time.tool";
import { configureAiProvider } from "./factories/ai-client.factory";

@Injectable()
export class SiteAssistantService {
  private readonly logger = new Logger(SiteAssistantService.name);
  private readonly agent: Agent;

  constructor(config: ConfigurationService) {
    const model = configureAiProvider(config.getConfiguration());

    this.agent = new Agent({
      name: "SharePoint Site Assistant",
      model,
      instructions:
        "You are a helpful assistant for SharePoint Online sites. " +
        "Help users find information, understand content, and navigate the site. " +
        "Be concise and accurate.  NEVER make things up.  If you don't know, are unsure, say so.",
      tools: [currentDateTimeTool],
    });
  }

  async *streamChat(
    site: SharePointSite,
    chatRequest: ChatRequest,
    user: AuthenticatedUser,
  ): AsyncGenerator<string> {
    this.logger.log(
      `Chat turn — threadId=${chatRequest.threadId ?? "none"} site=${site.hostname}:${site.serverRelativePath} user=${user.objectId}`,
    );

    const input: AgentInputItem[] = [
      ...(chatRequest.previousMessages ?? []),
      { role: "user", content: chatRequest.message },
    ];

    const streamResult = await run(this.agent, input, { stream: true });
    const textStream = streamResult.toTextStream({
      compatibleWithNodeStreams: true,
    });

    for await (const chunk of textStream) {
      const text = Buffer.isBuffer(chunk)
        ? chunk.toString("utf8")
        : String(chunk);
      yield `event: delta\ndata: ${JSON.stringify({ text })}\n\n`;
    }

    await streamResult.completed;

    yield `event: done\ndata: ${JSON.stringify({
      threadId: chatRequest.threadId,
      history: streamResult.history,
    })}\n\n`;
  }
}
