# SharePoint Site Assistant API (NestJS)

A NestJS API backend for an SPFx-based SharePoint site assistant. Includes Microsoft Entra ID authentication (passport-azure-ad) and routes that follow the Microsoft Graph API colon-notation convention for addressing SharePoint sites.

## Quick start

1. Copy `.env.example` to `.env` and fill in the values.
2. `npm install`
3. `npm run start:dev`
4. Swagger UI available at `http://localhost:<PORT>/api`

### Core settings

| Variable | Required | Description |
|----------|----------|-------------|
| `AZURE_TENANT_ID` | Yes | Entra ID tenant ID |
| `AZURE_CLIENT_ID` | Yes | App registration client ID |
| `AZURE_CLIENT_SECRET` | Yes | App registration client secret (store in a vault) |
| `TENANT_NAME` | Yes | Your tenant short name (e.g. `myco`) — used for CORS |
| `AI_PROVIDER` | No | `openai` (default) or `azure` |

### OpenAI provider (`AI_PROVIDER=openai`)

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key (store in a vault) |
| `OPENAI_MODEL` | No | Model name, defaults to `gpt-4o-mini` |

### Azure AI provider (`AI_PROVIDER=azure`)

Works with both Azure OpenAI Service and Azure AI Foundry model deployments.

| Variable | Required | Description |
|----------|----------|-------------|
| `AZURE_AI_ENDPOINT` | Yes | Azure resource endpoint URL |
| `AZURE_AI_API_KEY` | Yes | Azure AI API key (store in a vault) |
| `AZURE_AI_DEPLOYMENT` | Yes | Deployment name (used as the model identifier) |
| `AZURE_AI_API_VERSION` | No | API version, defaults to `2025-01-01-preview` |

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
