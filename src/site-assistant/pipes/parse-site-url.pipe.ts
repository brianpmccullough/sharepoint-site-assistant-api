import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { SharePointSite } from "../models/sharepoint-site.model";

// Parses the Graph API colon-notation site path segment from the URL.
// Format: {hostname}:{server-relative-path}: (trailing colon closes path mode)
// e.g. 'mytenant.sharepoint.com:/teams/mysite:'
// See: https://learn.microsoft.com/en-us/graph/api/resources/sharepoint?view=graph-rest-1.0#sharepoint-api-root-resources
// Sites can also be addressed by path by using the SharePoint hostname, followed by a colon and the relative path to the site. You can optionally transition back to addressing the resource model by putting another colon at the end.
@Injectable()
export class ParseSiteUrlPipe implements PipeTransform<string, SharePointSite> {
  transform(value: string | string[]): SharePointSite {
    const raw = Array.isArray(value) ? value.join("/") : value;
    const normalized = raw.endsWith(":") ? raw.slice(0, -1) : raw;
    const colonIndex = normalized.indexOf(":");

    if (colonIndex === -1) {
      throw new BadRequestException(`Invalid site path: ${raw}`);
    }

    const hostname = normalized.slice(0, colonIndex);
    const serverRelativePath = normalized.slice(colonIndex + 1);

    if (!hostname || !serverRelativePath) {
      throw new BadRequestException(`Invalid site path: ${raw}`);
    }

    return {
      hostname,
      serverRelativePath,
      absoluteUrl: `https://${hostname}${serverRelativePath}`,
    };
  }
}
