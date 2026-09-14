# Contributing

## Prerequisites

- Node.js 24 or later.
- pnpm 11 or later.
- Gitleaks and actionlint.

## Setup

On macOS, install the repository-managed tools and project dependencies:

```bash
brew bundle
pnpm install --frozen-lockfile
```

On another operating system, install Node.js, pnpm, [Gitleaks](https://github.com/gitleaks/gitleaks), and [actionlint](https://github.com/rhysd/actionlint) from their official distributions. If Corepack is available, use:

```bash
corepack enable
corepack install --global pnpm@11.24.0
pnpm install --frozen-lockfile
```

Use pnpm as the repository package manager.

Do not use a real Credit Karma authorization value or private transaction fixture in development, tests, issues, or pull requests.

## Run a local checkout

Copy `sample.env` to `.env`, add your own short-lived authorization value, and run:

```bash
pnpm run dev
```

For a date range, pass both dates. The `--` separator is optional:

```bash
pnpm run dev -- 2026-01-01 2026-08-31
```

The command can replace `creditkarma_transactions.csv` and `creditkarma_transactions.json` in the current directory.

## Validation

Write formatting after an intentional edit:

```bash
pnpm run format
```

Run the complete non-mutating gate before a pull request:

```bash
pnpm run validate
```

The gate scans Git history for secrets, checks formatting and lint, typechecks with TypeScript 7 and TypeScript 6, builds the command, runs unit tests, analyzes the repository with Knip and Madge, and checks installed peer dependencies. Use `pnpm run test:coverage` for a native Node.js coverage report.

## Structure

- `src/index.ts`: command arguments, pagination, and output files.
- `src/api.ts`: Credit Karma request and response processing.
- `src/queries.ts`: GraphQL query used by Credit Karma's web application.
- `src/types.ts`: response and export types.
- `src/config.ts`: environment configuration.
- `src/utils.ts`: diagnostics and CSV helpers.
- `test/`: unit tests.
- `.quality/`: local quality workspace.
- `.github/`: dependency updates and CI.

Keep access-token values out of errors. Treat API responses, transaction exports, cursors, and debug logs as private data. Keep the CSV and JSON output names stable unless a user-facing change is intentional and documented.

## Pull requests

Keep each change narrow. Add a focused test for changed public behavior. Update README and CHANGELOG entries when users will see the change. Do not commit `dist`, `.env`, output files, logs, dependency directories, coverage, or generated package archives.

For a security defect, do not open a public issue. Use the repository's [private security advisory form](https://github.com/chiragmehta/ckexport/security/advisories/new).
