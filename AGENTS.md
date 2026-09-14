# ckexport agent guide

## Scope and architecture

- This repository contains one command-line tool distributed as GitHub source.
- `src/index.ts` owns command arguments, pagination, and output files.
- The CLI accepts dates as `pnpm run dev [--] YYYY-MM-DD YYYY-MM-DD`; the `--` separator is optional.
- `src/api.ts` owns Credit Karma GraphQL requests and response processing.
- `src/config.ts`, `src/queries.ts`, `src/types.ts`, and `src/utils.ts` support the command; `src/queries.ts` stores the current Credit Karma persisted-query hash.
- `test/` contains unit tests.
- `.quality/` contains the local quality workspace.

## Invariants

- Use Node.js 24 or later and pnpm 11 or later for repository work.
- Use pnpm as the only package manager.
- Keep `ckexport`, `dist/index.js`, the two transaction output names, and the environment-variable names stable unless a product change requires otherwise.
- Never expose an authorization value, cursor, API response, transaction export, or debug log.
- Do not commit `dist/`, `.env`, transaction exports, package archives, coverage, or dependency directories.

## Checks

- Write formatting: `pnpm run format`
- Check formatting: `pnpm run format:check`
- Fix code lint: `pnpm run lint:fix`
- Check lint: `pnpm run lint`
- Typecheck: `pnpm run typecheck`
- Unit tests and build: `pnpm run test`
- Coverage: `pnpm run test:coverage`
- Repository analysis: `pnpm run analyze`
- Peer dependency policy: `pnpm run quality`
- Complete gate: `pnpm run validate`

Do not stage, commit, publish, deploy, tag, or change remote state unless the user explicitly requests that lifecycle operation.
