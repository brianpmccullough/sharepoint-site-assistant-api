# SharePoint Site Assistant API (NestJS)

A NestJS API backend for an SPFx-based SharePoint site assistant. Includes Microsoft Entra ID authentication (passport-azure-ad) and routes that follow the Microsoft Graph API colon-notation convention for addressing SharePoint sites.

## Quick start

1. Copy `.env.example` to `.env` and fill in the values:
   - `AZURE_TENANT_ID` — your Entra ID tenant ID
   - `AZURE_CLIENT_ID` — app registration client ID
   - `AZURE_CLIENT_SECRET` — app registration client secret (store in a vault in production)
   - `TENANT_NAME` — your tenant short name (e.g. `myco`)
   - `OPENAI_API_KEY` — OpenAI API key (store in a vault in production)
   - `OPENAI_MODEL` — *(optional)* model name, defaults to `gpt-4o-mini`
2. `npm install`
3. `npm run start:dev`
4. Swagger UI available at `http://localhost:<PORT>/api`

## Routes

Site paths use the [Graph API colon-notation](https://learn.microsoft.com/en-us/graph/api/resources/sharepoint?view=graph-rest-1.0) convention: `{hostname}:{server-relative-path}:`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/sites/{hostname}:{site-path}:/assistant/chat` | Chat with the site assistant |
| POST | `/sites/{hostname}:{site-path}:/assistant/prompts` | Get suggested prompts for the site |

**Example:**
```
POST /sites/mytenant.sharepoint.com:/teams/mysite:/assistant/chat
POST /sites/mytenant.sharepoint.com:/teams/mysite:/assistant/prompts
```

All routes require a Bearer token (`Authorization: Bearer <access_token>`).
