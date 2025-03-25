export const HELP_MESSAGE = `
  First you'll need to set or update your access token, which you can get from the browser console on the creditkarma site. Then update the MY_ACCESS_TOKEN env var in your .env file:

    MY_ACCESS_TOKEN=your_new_access_token_here

  If the token expires, you can restart where you left off by setting the START_CURSOR env var to the last attempted value

  See the README for more details:
    https://github.com/chiragmehta/ckexport

  For more details, see the original Ruby script's README with screenshots:
    https://github.com/mmrobins/creditkarma_export_transactions?tab=readme-ov-file#access-token
  `;

export async function debug(msg: unknown): Promise<void> {
  if (process.env.DEBUG) {
    console.log(JSON.stringify(msg, null, 2));
  }
}

export function handleMissingResponseData(resp: unknown): void {
  console.log("expected data not in response: \n\n", resp);
  console.log("\nIf your response looks like \n\n{\"data\"=>{\"prime\"=>{\"transactionsHub\"=>{}}}}\n");
  console.log("then you probably need to re-authenticate on the website visiting https://www.creditkarma.com/networth/transaction");
}
