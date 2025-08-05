# CreditKarma Transaction Export

A TypeScript port of [Matt Robinson's Ruby script](https://github.com/mmrobins/creditkarma_export_transactions) to export transactions from CreditKarma to CSV and JSON formats.

## Prerequisites

- Node.js 24 or higher
- pnpm (recommended) or npm

## Installation

```bash
# Clone the repository
git clone https://github.com/chiragmehta/ckexport
cd ckexport

# Install dependencies
pnpm install

# Copy the sample environment file
cp sample.env .env
```

## Configuration

1. Visit https://www.creditkarma.com/networth/transaction
2. Open your browser's developer tools (F12)
3. Go to the Network tab
4. Look for a request to `graphql`
5. Find the `Authorization` header in the request headers
6. Copy the entire value (including "Bearer ") to your `.env` file as `MY_ACCESS_TOKEN`

## Usage

```bash
# Run with TypeScript (needs Node 24+)
pnpm dev

# Or build and run with older Node.js
pnpm build
pnpm start

# Optional: Specify date range (YYYY-MM-DD format)
pnpm dev "2023-01-01" "2024-01-01"
# OR
pnpm start "2023-01-01" "2024-01-01"
```

The script will create two files:
- `creditkarma_transactions.csv`: CSV format suitable for importing into spreadsheets
- `creditkarma_transactions.json`: Raw JSON data from CreditKarma's API

## Debugging

Set `DEBUG=1` in your `.env` file to enable detailed logging.

If your export stops midway, you can resume from the last cursor by setting `START_CURSOR` in your `.env` file with the last cursor value from the logs.

## License

MIT - See [LICENSE](LICENSE) for details.

## Acknowledgments

Based on the original Ruby implementation by [Matt Robinson](https://github.com/mmrobins/creditkarma_export_transactions).