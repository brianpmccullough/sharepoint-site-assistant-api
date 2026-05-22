import { Body, Controller, Param, Post, Request, Res } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Response } from "express";
import { AuthenticatedUser } from "../auth/models/authenticated-user.model";
import { SharePointSite } from "./models/sharepoint-site.model";
import { ParseSiteUrlPipe } from "./pipes/parse-site-url.pipe";
import { ChatRequest } from "./models/chat-request.model";
import { SiteAssistantService } from "./site-assistant.service";

@ApiBearerAuth()
@ApiTags("site-assistant")
@Controller("sites")
export class SiteAssistantController {
  constructor(private readonly siteAssistantService: SiteAssistantService) {}

  @ApiOperation({
    summary: "Chat with the site assistant",
    description:
      "Streams the assistant response as Server-Sent Events. " +
      "Events: `delta` (text chunk) and `done` (history for the next turn).",
  })
  @ApiParam({
    name: "sitePath",
    description:
      "Graph API colon-notation site path, e.g. mytenant.sharepoint.com:/teams/mysite:",
  })
  @Post("*siteSegment/assistant/chat")
  async chat(
    @Param("siteSegment", ParseSiteUrlPipe) site: SharePointSite,
    @Body() chatRequest: ChatRequest,
    @Request() req: { user: AuthenticatedUser },
    @Res() res: Response,
  ): Promise<void> {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    for await (const event of this.siteAssistantService.streamChat(
      site,
      chatRequest,
      req.user,
    )) {
      res.write(event);
    }

    res.end();
  }

  @ApiOperation({ summary: "Get context-aware suggested prompts for a site" })
  @ApiParam({
    name: "sitePath",
    description:
      "Graph API colon-notation site path, e.g. mytenant.sharepoint.com:/teams/mysite:",
  })
  @Post("*siteSegment/assistant/prompts")
  prompts() {
    // TODO: return context-aware prompts based on the user's location within the site
    return [
      "What is this site about?",
      "Find information in this site.",
      "Summarize this page.",
    ];
  }
}
