import fetch from "node-fetch";
import { debug, handleMissingResponseData, HELP_MESSAGE } from "./utils.ts";
import { CONFIG } from "./config.ts";
import { GET_TRANSACTIONS_QUERY_HASH } from "./queries.ts";
import type { Transaction, TransactionResponse } from "./types.ts";

type RawTransaction =
  TransactionResponse["data"]["prime"]["transactionsHub"]["transactionPage"]["transactions"][number];

interface ProcessedTransactionData {
  transactions: Transaction[];
  rawTransactions: RawTransaction[];
  hasNextPage: boolean;
  endCursor: string;
}

export async function getTransactions(
  cursor?: string,
  startDate?: string,
  endDate?: string,
): Promise<ProcessedTransactionData> {
  const accessToken = CONFIG.accessToken;
  if (!accessToken) {
    console.log(HELP_MESSAGE);
    throw new Error("No access token (MY_ACCESS_TOKEN) provided");
  }

  if (
    [...accessToken].some((char) => {
      const code = char.codePointAt(0);
      return (
        code !== undefined && (code < 0x20 || code === 0x7f || code > 0xff)
      );
    })
  ) {
    throw new Error(
      "MY_ACCESS_TOKEN contains invalid authorization-header characters; copy the complete Authorization value again",
    );
  }

  const params = {
    extensions: {
      persistedQuery: {
        version: 1,
        sha256Hash: GET_TRANSACTIONS_QUERY_HASH,
      },
    },
    operationName: "GetTransactions",
    variables: {
      input: {
        paginationInput: { afterCursor: cursor ?? null },
        categoryInput: { categoryId: null, primeCategoryType: null },
        datePeriodInput:
          startDate || endDate
            ? {
                datePeriod: `${startDate}_TO_${endDate}`,
              }
            : { datePeriod: null },
        accountInput: {},
      },
    },
  };

  const response = await fetch("https://api.creditkarma.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
      Accept: "application/json",
      "ck-client-name": "prime_web",
      "ck-client-version": "2.0.31",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.log(HELP_MESSAGE);
      console.log();
      console.log("401: MY_ACCESS_TOKEN was invalid or has expired.");
      console.log(
        "Get a new Authorization header value from Credit Karma and try again.",
      );
    }
    throw new Error(
      `Credit Karma API request failed with HTTP ${response.status}`,
    );
  }

  const resp = (await response.json()) as TransactionResponse;
  debug(resp);

  // Check for GraphQL errors
  if (resp.errors) {
    console.log(HELP_MESSAGE);
    console.log(
      "\nCredit Karma returned a GraphQL error. You likely need to refresh your access token. Visit https://www.creditkarma.com/networth/transaction and get a new token.",
    );
    throw new Error("GraphQL API returned errors");
  }

  const respData =
    resp?.data?.prime?.transactionsHub?.transactionPage?.transactions;
  if (!respData) {
    handleMissingResponseData(resp);
    throw new Error("Invalid response data structure");
  }

  const processedTransactions = respData.map((t) => {
    // remove __typename (internal CK use only, prefixed with Prime_*)
    if (t.__typename) delete t.__typename;
    if (t.amount.__typename) delete t.amount.__typename;

    const date = t.date;
    const desc = t.description;
    const status = t.status;
    const amt = t.amount.value;
    const traType = amt < 0 ? "debit" : "credit";
    const acct = t.account.name;
    const cat = t.category?.name || "";
    const merch = t.merchant?.name || desc;

    return {
      processed: {
        desc,
        date,
        status,
        amt: amt.toString(),
        tra_type: traType,
        acct,
        cat,
        merch,
      },
      raw: t,
    };
  });

  const pageInfo = resp.data.prime.transactionsHub.transactionPage.pageInfo;

  return {
    transactions: processedTransactions.map((t) => t.processed),
    rawTransactions: processedTransactions.map((t) => t.raw),
    hasNextPage: pageInfo.hasNextPage,
    endCursor: pageInfo.endCursor,
  };
}
