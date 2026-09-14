# ckexport

[![CI](https://github.com/chiragmehta/ckexport/actions/workflows/ci.yml/badge.svg)](https://github.com/chiragmehta/ckexport/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Export your Credit Karma transaction history to spreadsheet-ready CSV and raw JSON files.

`ckexport` is a command-line tool for Credit Karma users who need a local copy of the transactions shown in Net Worth. It pages through the Credit Karma GraphQL response and supports an optional date range and cursor-based resume.

## Features

- Exports Mint-compatible CSV and raw JSON.
- Exports all transactions or a specified date range.
- Supports resume from a Credit Karma pagination cursor.
- Writes data only to the current directory.

## Requirements

- Node.js 24 or later.
- A Credit Karma account with Net Worth transaction data.
- A current Credit Karma web-session authorization value.

Source development also requires pnpm 11 or later, Gitleaks, and actionlint.

The tool uses an undocumented Credit Karma GraphQL API. Credit Karma can change it without notice. This project is not affiliated with or endorsed by Credit Karma.

## Install from source

On macOS:

```bash
git clone https://github.com/chiragmehta/ckexport.git
cd ckexport
brew bundle
pnpm install --frozen-lockfile
cp sample.env .env
```

On another operating system, install Node.js 24 or later, pnpm 11 or later, [Gitleaks](https://github.com/gitleaks/gitleaks), and [actionlint](https://github.com/rhysd/actionlint) from their official distributions. If the Node.js distribution includes Corepack, it can install the current pnpm release:

```bash
corepack enable
corepack install --global pnpm@11.24.0
pnpm install --frozen-lockfile
```

## Quick start

1. Open <https://www.creditkarma.com/networth/transaction> and sign in.
2. Open the browser developer tools and select **Network**.
3. Select a request to `graphql`.
4. Copy the complete `Authorization` request-header value, including `Bearer`.
5. Set it for the command without saving it in shell history:

```bash
read -s "MY_ACCESS_TOKEN?Credit Karma Authorization value: " && echo
export MY_ACCESS_TOKEN
pnpm run dev
unset MY_ACCESS_TOKEN
```

The command replaces these files in the current directory after the first successful API response:

- `creditkarma_transactions.csv`
- `creditkarma_transactions.json`

Treat both files as private financial data.

## Date ranges

Dates use `YYYY-MM-DD`. Supply both dates:

```bash
pnpm run dev -- 2023-01-01 2024-01-01
```

The `--` separator is optional. Both forms are valid:

```bash
pnpm run dev 2023-01-01 2024-01-01
pnpm run dev -- 2023-01-01 2024-01-01
```

A start date must not be later than the end date.

## Configuration

The tool reads the process environment and an optional `.env` file in the current directory.

| Variable          | Required | Purpose                                                              |
| ----------------- | -------- | -------------------------------------------------------------------- |
| `MY_ACCESS_TOKEN` | Yes      | Complete Credit Karma `Authorization` header value.                  |
| `START_CURSOR`    | No       | Resume with a cursor from reviewed private debug output.             |
| `DEBUG`           | No       | Set to `1` or `true` to print API responses and transaction details. |

The authorization value must be the complete one-line header value. Do not use a shortened or redacted value, add line breaks, or replace ASCII characters with typographic punctuation. If the tool reports invalid authorization-header characters, copy the `Authorization` header again. `DEBUG` output contains financial data. Do not share or retain debug logs without review. Access tokens expire. The tool does not refresh or store a token outside the environment or optional `.env` file.

## Data, permissions, and network use

`ckexport` sends the authorization value and persisted query parameters to `https://api.creditkarma.com/graphql`. Credit Karma can rotate the persisted query and reject an old hash with HTTP 400. It does not send data to this project or to a telemetry service. It starts no subprocesses. It reads `.env` when present and replaces the two output files in the current directory. It runs with the current user's filesystem and network permissions.

CSV content can start with spreadsheet formula characters because transaction text comes from Credit Karma. Review the CSV before opening it in software that evaluates formulas.

## Development

Use [CONTRIBUTING.md](CONTRIBUTING.md) for contribution and security rules.

| Command                  | Purpose                                                      |
| ------------------------ | ------------------------------------------------------------ |
| `pnpm run dev`           | Run the TypeScript source directly.                          |
| `pnpm run build`         | Build the command into `dist/`.                              |
| `pnpm run format`        | Write Prettier formatting.                                   |
| `pnpm run format:check`  | Check formatting without changes.                            |
| `pnpm run lint`          | Check JavaScript, TypeScript, and GitHub Actions.            |
| `pnpm run typecheck`     | Check source with TypeScript 7 and TypeScript 6.             |
| `pnpm run test`          | Run unit tests and build the command.                        |
| `pnpm run test:coverage` | Report native Node.js test coverage.                         |
| `pnpm run analyze`       | Find unused files, exports, dependencies, and module cycles. |
| `pnpm run quality`       | Check installed peer dependency policy.                      |
| `pnpm run secrets:check` | Scan Git history with Gitleaks.                              |
| `pnpm run validate`      | Run the complete non-mutating local and CI gate.             |

### Architecture

- `src/index.ts` parses arguments, controls pagination, and writes export files.
- `src/api.ts` sends GraphQL requests and converts Credit Karma responses.
- `src/config.ts`, `src/queries.ts`, `src/types.ts`, and `src/utils.ts` provide configuration, query, type, diagnostic, and CSV support.
- `test/` contains unit tests.
- `.quality/` contains the local quality workspace.
- `.github/workflows/ci.yml` runs `pnpm run validate` on Node.js 24.

## Support and security

Use [GitHub Issues](https://github.com/chiragmehta/ckexport/issues) for reproducible defects. Report vulnerabilities privately through [GitHub Security Advisories](https://github.com/chiragmehta/ckexport/security/advisories/new). Never include an authorization value or transaction data in a report.

Maintained by [Chirag Mehta](https://chir.ag). Licensed under the [MIT License](LICENSE).

## Acknowledgments

Based on [Matt Robinson's Ruby implementation](https://github.com/mmrobins/creditkarma_export_transactions).
