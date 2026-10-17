#!/usr/bin/env node

import fs from "fs/promises";
import { debug, parseDateRangeArgs, toCsvField } from "./utils.ts";
import { CONFIG } from "./config.ts";
import { getTransactions } from "./api.ts";

async function initializeFiles(): Promise<{
  csvFile: fs.FileHandle;
  jsonFile: fs.FileHandle;
}> {
  // Delete existing file before first write
  try {
    await fs.unlink("creditkarma_transactions.csv");
  } catch {
    // Ignore error if file doesn't exist
  }
  try {
    await fs.unlink("creditkarma_transactions.json");
  } catch {
    // Ignore error if file doesn't exist
  }

  const csvFile = await fs.open("creditkarma_transactions.csv", "a");
  await csvFile.write(
    '"Date","Description","Original Description","Amount","Transaction Type","Category","Account Name","Labels","Notes"\n',
  );

  const jsonFile = await fs.open("creditkarma_transactions.json", "a");
  await jsonFile.write("[\n");

  return { csvFile, jsonFile };
}

async function main(startDate?: string, endDate?: string) {
  let hasWrittenTransaction = false;
  let hasNextPage = true;
  let cursor = CONFIG.startCursor;
  let csvFile: fs.FileHandle | undefined;
  let jsonFile: fs.FileHandle | undefined;

  try {
    while (hasNextPage) {
      const {
        transactions,
        rawTransactions,
        hasNextPage: nextPage,
        endCursor,
      } = await getTransactions(cursor, startDate, endDate);

      if (!csvFile || !jsonFile) {
        ({ csvFile, jsonFile } = await initializeFiles());
      }

      for (let i = 0; i < transactions.length; i++) {
        const tra = transactions[i];
        const rawTra = rawTransactions[i];
        if (!tra || !rawTra) {
          throw new Error("Transaction response arrays are inconsistent");
        }

        const csvLine =
          [tra.date, tra.merch, tra.desc, tra.amt, tra.tra_type, tra.cat, tra.acct, "", ""]
            .map(toCsvField)
            .join(",") + "\n";
        await csvFile.write(csvLine);
        if (hasWrittenTransaction) {
          await jsonFile.write(",\n");
        }
        await jsonFile.write(JSON.stringify(rawTra, null, 2));
        hasWrittenTransaction = true;
        debug(tra);
      }

      cursor = endCursor;
      hasNextPage = nextPage;
    }
  } finally {
    await csvFile?.close();
    if (jsonFile) {
      await jsonFile.write("\n]"); // Close the JSON array
      await jsonFile.close();
    }
  }

  console.log("done");
}

// Parse command line arguments for date range. pnpm forwards its separator.
const [startDate, endDate] = parseDateRangeArgs(process.argv.slice(2));

if (startDate && !startDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
  console.error("Start date must be in YYYY-MM-DD format");
  process.exit(1);
}

if (endDate && !endDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
  console.error("End date must be in YYYY-MM-DD format");
  process.exit(1);
}

if (startDate && endDate && startDate > endDate) {
  console.error("Start date must be before end date");
  process.exit(1);
}

if (startDate && endDate) {
  console.log(`Exporting transactions from ${startDate} to ${endDate}...`);
} else {
  console.log("Exporting all transactions...");
}

main(startDate, endDate).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
