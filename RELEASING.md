# Releasing

This repository distributes source code through GitHub. It does not publish an npm package or attach built artifacts.

## One-time GitHub setup

1. Confirm that `chiragmehta/ckexport` is public and that `main` is the default branch.
2. Enable Issues, private vulnerability reporting, secret scanning, push protection, Dependabot alerts, and dependency security updates.
3. Set the Actions default token permission to read-only.
4. Protect `main` after the first CI run. Require the observed CI check names. Disable force pushes and branch deletion.
5. Enable automatic branch deletion after merge if desired.

Do not require guessed status-check names. Select them after CI reports their exact names.

## Source release checks

Before you update the public repository, use a clean tree on `main`:

```bash
corepack enable
corepack install --global pnpm@11.24.0
pnpm install --frozen-lockfile
pnpm run validate
```

Review the diff and tracked files. They must not contain credentials, `.env`, transaction exports, debug logs, dependency directories, generated `dist` files, or personal paths.

## GitHub source updates

1. Merge or push only the validated source commit to `main`.
2. Confirm that GitHub CI passes for the exact commit.
3. Verify the README commands from a fresh clone when setup or runtime behavior changed.

Tags and GitHub Releases are optional source snapshots. If you use them, use Semantic Versioning, update `CHANGELOG.md`, create an annotated `vX.Y.Z` tag from a validated commit, and use the matching changelog section as the GitHub Release notes. Do not attach locally built files.

## Recovery

Correct a defective source update with a new reviewed commit. Do not rewrite public history. If a credential or private record is exposed, rotate the credential or address the data exposure first, then clean Git history before further publication.

## GitHub repository settings

- Description: `Export Credit Karma transaction history to CSV and JSON from the command line.`
- Website: `https://github.com/chiragmehta/ckexport`
- Topics: `credit-karma`, `csv`, `export`, `finance`, `nodejs`, `transactions`, `typescript`.
- Add a social preview only if a real project asset is available.
- Verify the GitHub community profile after the source is public.
