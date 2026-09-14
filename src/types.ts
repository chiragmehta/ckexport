export interface Transaction {
  desc: string;
  date: string;
  status: string;
  amt: string;
  tra_type: string;
  acct: string;
  cat: string;
  merch: string;
}

export interface TransactionResponse {
  errors?: object;
  data: {
    prime: {
      transactionsHub: {
        transactionPage: {
          transactions: Array<{
            __typename?: string;
            date: string;
            description: string;
            status: string;
            amount: {
              __typename?: string;
              value: number;
            };
            account: {
              name: string;
            };
            category?: {
              name: string;
            };
            merchant?: {
              name: string;
            };
          }>;
          pageInfo: {
            endCursor: string;
            hasNextPage: boolean;
          };
        };
      };
    };
  };
}
