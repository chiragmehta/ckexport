export const HELP_MESSAGE = `
  First you'll need to set or update your access token, which you can get from the browser console on the creditkarma site. Then update the MY_ACCESS_TOKEN env var in your .env file:

    MY_ACCESS_TOKEN=your_new_access_token_here

  If the token expires, you can restart where you left off by setting START_CURSOR to a cursor from reviewed private debug output. Do not share cursor values.

  See the README for more details:
    https://github.com/chiragmehta/ckexport

  For more details, see the original Ruby script's README with screenshots:
    https://github.com/mmrobins/creditkarma_export_transactions?tab=readme-ov-file#access-token
  `;

export function debug(msg: unknown): void {
  const debugEnabled = process.env.DEBUG === "1" || process.env.DEBUG?.toLowerCase() === "true";
  if (debugEnabled) {
    console.log(JSON.stringify(msg, null, 2));
  }
}

export function parseDateRangeArgs(
  args: readonly string[],
): readonly [string | undefined, string | undefined] {
  const dateArgs = args[0] === "--" ? args.slice(1) : args;
  return [dateArgs[0], dateArgs[1]];
}

export function toCsvField(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export function handleMissingResponseData(resp: unknown): void {
  void resp;
  console.log("Expected transaction data was not in the API response.");
  console.log(
    "\nIf the response has an empty transactionsHub object, re-authentication is probably required.\n",
  );
  console.log(
    "then you probably need to re-authenticate on the website visiting https://www.creditkarma.com/networth/transaction",
  );
}
