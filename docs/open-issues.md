# Open Issues

| Date | Status | Description |
|------|--------|-------------|
| 2026-05-21 | Open | **Pre-existing config default duplication for `PORT`** — `PORT = 3000` appears in `EnvironmentVariables` class, `appConfig()`, and `ConfigurationService`. Violates the "defaults in `appConfig()` only" rule added in this session. Needs a follow-up cleanup pass across all pre-existing required env vars. |
| 2026-05-21 | Open | **No unit or e2e tests exist** — `npm test` and `npm run test:e2e` both fail because no `*.spec.ts` files or `test/` directory have been created. Test coverage should be added before this project ships. |
