# Security Policy

## Supported versions

`ckexport` is distributed as source through GitHub, not as a published package. Security fixes are made on the default branch (`main`). Update to the latest source from `main` before you report a defect that might already be fixed.

## Private reports

Report a vulnerability through [GitHub Security Advisories](https://github.com/chiragmehta/ckexport/security/advisories/new). Do not open a public issue for an uncorrected vulnerability.

Include the affected version, operating system, Node.js version, reproduction steps, expected result, actual result, and possible impact. Remove authorization values, account details, transaction data, cursors, and other private data from all text and attachments.

## Runtime model

The command reads environment variables and an optional `.env` file. It sends an authorization value and GraphQL request to `https://api.creditkarma.com/graphql`. It starts no subprocesses and has no telemetry. It replaces CSV and JSON export files in the current directory after the first successful response. It has the network and filesystem permissions of the user who starts it.

Debug mode prints API and transaction data. Export files and debug logs are sensitive financial records. Spreadsheet software can interpret formula-like CSV fields; review exports before opening them in software that evaluates formulas.

Because you run this tool from your own source checkout, review the code and the dependencies you install. A passing CI run links the source to its checks, but it does not prove the tool is free of defects or that its dependencies are safe.
