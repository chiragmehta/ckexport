import fetch from 'node-fetch';
import { Transaction, TransactionResponse } from './types.js';
import { debug, handleMissingResponseData, HELP_MESSAGE } from './utils.js';
import { CONFIG } from './config.js';
import { GET_TRANSACTIONS_QUERY } from './queries.js';

interface ProcessedTransactionData {
  transactions: Transaction[];
  rawTransactions: any[];
  hasNextPage: boolean;
  endCursor: string;
}

export async function getTransactions(cursor?: string, startDate?: string, endDate?: string): Promise<ProcessedTransactionData> {
  const accessToken = CONFIG.accessToken;
  if (!accessToken) {
    console.log(HELP_MESSAGE);
    throw new Error("No access token (MY_ACCESS_TOKEN) provided");
  }

  const params = {
    operationName: "GetTransactions",
    variables: {
      input: {
        paginationInput: cursor ? { afterCursor: cursor } : {},
        datePeriodInput: startDate || endDate ? {
          datePeriod: `${startDate}_TO_${endDate}`,
        } : { datePeriod: null }
      }
    },
    query: GET_TRANSACTIONS_QUERY
  };

  const response = await fetch('https://api.creditkarma.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken,
      'Accept': 'application/json'
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.log(HELP_MESSAGE);
      console.log();
      const obfuscated = accessToken.length > 10
        ? `${accessToken.slice(0, 6)}...${accessToken.slice(-5)}`
        : accessToken;
      console.log(`401, either MY_ACCESS_TOKEN (${obfuscated}) was invalid or needs refresh`);
      console.log("MY_ACCESS_TOKEN: should look like eyJra...kA2Uh  It'll be pretty long, the ... is just to shorten it for this message");
    }
    throw new Error(`error: ${response.status} body: ${await response.text()}`);
  }

  const resp = await response.json() as TransactionResponse;
  await debug(resp);

  // Check for GraphQL errors
  if (resp.errors) {
    console.log(HELP_MESSAGE);
    console.log("\nGraphQL Error Response:");
    console.log(JSON.stringify(resp.errors, null, 2));
    console.log("\nYou likely need to refresh your access token. Visit https://www.creditkarma.com/networth/transaction and get a new token.");
    throw new Error("GraphQL API returned errors");
  }

  const respData = resp?.data?.prime?.transactionsHub?.transactionPage?.transactions;
  if (!respData) {
    handleMissingResponseData(resp);
    throw new Error("Invalid response data structure");
  }

  const processedTransactions = respData.map(t => {
    // remove __typename (internal CK use only, prefixed with Prime_*)
    if (t.__typename) delete t.__typename;
    if (t.amount.__typename) delete t.amount.__typename;

    const date = t.date;
    const desc = t.description;
    const status = t.status;
    const amt = t.amount.value;
    const traType = amt < 0 ? 'debit' : 'credit';
    const acct = t.account.name;
    const cat = t.category?.name || '';
    const merch = t.merchant?.name || desc;

    return {
      processed: {
        desc, date, status,
        amt: amt.toString(),
        tra_type: traType,
        acct, cat, merch
      },
      raw: t
    };
  });

  const pageInfo = resp.data.prime.transactionsHub.transactionPage.pageInfo;

  return {
    transactions: processedTransactions.map(t => t.processed),
    rawTransactions: processedTransactions.map(t => t.raw),
    hasNextPage: pageInfo.hasNextPage,
    endCursor: pageInfo.endCursor
  };
}
