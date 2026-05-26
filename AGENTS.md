# AGENTS.md — SharePoint Site Assistant

Guidance for AI agents working in this codebase.

---

## Project Overview

A NestJS (Node.js + TypeScript) REST API that powers AI-assistant for SharePoint Online sites. An SPFx Application Customizer is the primary client; it authenticates users via EntraID and calls this API with a bearer token. The API uses the On-Behalf-Of (OBO) flow to query the Microsoft Graph Search API on each user's behalf.  No other clients planned, however, we should build as if there may be other clients (applications, automations, etc).

---

## Architecture & Module Layout

```
src/
  main.ts              # Bootstrap: CORS (SharePoint-origin regex), Swagger setup, global ValidationPipe, port binding
  app.module.ts        # Root module — imports ConfigModule, AuthModule, HealthModule, SiteAssistantModule
  config/
    config.module.ts        # Wraps @nestjs/config; globally available, no need to import elsewhere
    configuration.service.ts  # Single source of truth: maps env vars to typed properties
    models/                 # Shared config types (e.g. AiProvider)
  auth/
    auth.module.ts
    decorators/   # @NoAuthentication() opt-out decorator
    guards/       # JwtBearerGuard — global, validates Azure AD bearer tokens
    models/       # AuthenticatedUser — shape of req.user
    strategies/   # AzureAdJwtStrategy — JWKS validation via Passport
    microsoft-authentication.service.ts  # OBO token exchange (user → Graph-scoped token)
  site-assistant/      # SiteAssistantModule — POST .../assistant/chat and .../assistant/prompts; routes use Graph API colon-notation site paths
    factories/         # configureAiProvider — constructs and registers the AI client from AppConfiguration
    models/            # SharePointSite, ChatRequest — site identity and request shapes
    pipes/             # ParseSiteUrlPipe — extracts site host + path from the wildcard route segment
    tools/             # OpenAI agent tool definitions (*.tool.ts)
  health/
    health.module.ts
    health.controller.ts  # GET /health via @nestjs/terminus
```

Each feature lives in its own module folder: `module.ts`, `controller.ts`, `service.ts`, `models/`. New features follow this pattern — do not put logic in `app.module.ts`.

`ConfigModule` is global (`isGlobal: true`, `@Global()`). Inject `ConfigurationService` directly in any provider without re-importing `ConfigModule`. Do not inject NestJS's raw `ConfigService` — use `ConfigurationService` for all typed config access.

---

## Coding Conventions

- **TypeScript strict mode is on.** No `any`. No `// @ts-ignore`. Fix the type, don't suppress it.
- **models use `class-validator` decorators.** Every controller input must be a typed model class. The global `ValidationPipe` enforces `whitelist: true` and `forbidNonWhitelisted: true`.
- **Swagger decorators on all controllers.** Use `@ApiTags`, `@ApiOperation`, and `@ApiBearerAuth` on every controller and endpoint. The Swagger doc is the API contract.
- **No barrel/index files.** Import directly from the source file.
- **No comments explaining what code does.** Only add a comment if the *why* is non-obvious (a constraint, workaround, or subtle invariant).
- **File Naming:** controllers are `*.controller.ts`, services are `*.service.ts`, modules are `*.module.ts`, models are `*.model.ts`, guards are `*.guard.ts`.  If not specified here, follow typical NestJS and TypeScript conventions. **No `dto/` folders and no `*.dto.ts` files** — request/response shapes are models and live in `models/`.
- **Variable Naming:** avoid abbreviations, unless very commonly abbreviated (e.g. Api, Http, Aad).  Avoid vague naming such as obj or single letters (unless a very quick iterator). Good: MicrosoftGraphSearchService | Bad: MsftGraphSearchSvc
- **Function Naming:** avoid abbreviations, unless very commmonly abbreviated (e.g. Api, Http, Aad).  The function should be self-documenting in it's name.
- **Use `const` objects over string discriminated unions.** Define sets of known string values as `const` objects with `as const` and a matching type alias, placed in `models/`. Example: `AiProvider` in `src/config/models/ai-provider.model.ts`. Always reference the constant values in code — never use bare string literals for values that belong to a defined set.
- **Config validation belongs in `ConfigurationService`.** Startup errors and cross-field validation (e.g. "provider X requires field Y") go in the `ConfigurationService` constructor. Factories and services receive a fully-validated, typed config object and must not reference raw environment variable names.

---

## Patterns

Follow patterns already established in the codebase. If a new pattern is needed that has no precedent here, stop and discuss it with the operator before implementing.

Prefer well-established software engineering principles and patterns — SOLID, DRY, and Gang of Four design patterns — over novel or complex approaches. When in doubt, choose the simpler solution.

---

## Commands

```bash
npm run build          # Compile TypeScript
npm run start          # Start in production mode (requires npm run build first)
npm run start:dev      # Start with file watcher (hot reload)
npm run typecheck      # Type-check src and test without emitting (tsc --noEmit)
npm test               # Unit tests (Jest)
npm run test:e2e       # End-to-end tests
npm run test:cov       # Coverage report
npm run lint           # ESLint (auto-fix)
npm run format         # Prettier (auto-fix)
```

Use `/pr-prepare` before submitting any PR. It runs all checks in order and will stop and alert you if anything fails.

After every batch of changes, run the following in order. All must pass with no errors or warnings before the work is considered complete:

```bash
npm run typecheck
npm run lint
npm run format
npm test
npm run test:e2e
```

Local dev requires a `.env` file. Copy `.env.example` and fill in Azure credentials.

**Environment variables:** `ConfigurationService` (`src/config/configuration.service.ts`) is the single place where environment variables are read and mapped to typed properties. It uses NestJS `ConfigService.getOrThrow<T>("ENV_VAR_NAME")` for required vars and `ConfigService.get<T>("ENV_VAR_NAME") ?? default` for optional ones. Whenever a new env var is added or removed, update both `.env.example` (template) and `README.md` (documentation) to match. `AI_PROVIDER` controls which provider block is active (`openai` | `azure`); provider-specific required vars are validated in the `ConfigurationService` constructor.

---

## Open Issues

When a decision is skipped, deferred, or needs follow-up, add a row to `docs/open-issues.md` with the date (`yyyy-mm-dd`) and a clear description of what needs to be revisited. Do not remove resolved entries — update their status to `Resolved` instead.

---

## Do Not

- **Do not bypass the JWT guard** on any endpoint except `/health`. Use `@NoAuthentication()` on the health controller to opt out of the global guard. Every route that touches Graph API or returns user data must be protected.
- **Do not store or log tokens.** Bearer tokens and OBO tokens must never appear in logs, error messages, or responses.
- **Keep controllers lightweight** API calls, such as Graph calls, belong in a service (`site-assistant.service.ts`). Controllers only handle HTTP in/out.
- **Do not use `any` in TypeScript.** Strict mode is intentional; use proper types or generics.
- **Do not add dependencies without considering maintenance cost especially vulnerabilities.** Prefer packages already in use (`axios`, `class-validator`, `@azure/msal-node`) over introducing new ones.
- **Do not skip model validation.** Never accept raw `body: any` in a controller. Always use a decorated model class.
- **Do not disable ESLint or Prettier rules inline** without a comment explaining why.