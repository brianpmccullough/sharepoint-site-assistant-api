import { Controller, Param, Post, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { AuthenticatedUser } from "../auth/models/authenticated-user.model";
import { SharePointSite } from "./models/sharepoint-site.model";
import { ParseSiteUrlPipe } from "./pipes/parse-site-url.pipe";

@ApiBearerAuth()
@ApiTags("site-assistant")
@Controller("sites")
export class SiteAssistantController {
  @ApiParam({
    name: "sitePath",
    description:
      "Graph API colon-notation site path, e.g. mytenant.sharepoint.com:/teams/mysite:",
  })
  @Post("*siteSegment/assistant/chat")
  chat(
    @Param("siteSegment", ParseSiteUrlPipe) site: SharePointSite,
    @Request() req: { user: AuthenticatedUser },
  ) {
    return { site, user: req.user };
  }

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
