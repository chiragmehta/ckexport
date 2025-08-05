import fs from 'fs/promises';
import { debug } from './utils.ts';
import { CONFIG } from './config.ts';
import { getTransactions } from './api.ts';
import type { Transaction } from './types.ts';

async function initializeFiles(): Promise<{ csvFile: fs.FileHandle; jsonFile: fs.FileHandle }> {
  // Delete existing file before first write
  try {
    await fs.unlink('creditkarma_transactions.csv');
  } catch (e) {
    // Ignore error if file doesn't exist
  }
  try {
    await fs.unlink('creditkarma_transactions.json');
  } catch (e) {
    // Ignore error if file doesn't exist
  }

  const csvFile = await fs.open('creditkarma_transactions.csv', 'a');
  await csvFile.write('"Date","Description","Original Description","Amount","Transaction Type","Category","Account Name","Labels","Notes"\n');

  const jsonFile = await fs.open('creditkarma_transactions.json', 'a');
  await jsonFile.write('[\n');

  return { csvFile, jsonFile };
}

async function main(startDate?: string, endDate?: string) {
  const totalTransactions: Transaction[] = [];
  let hasNextPage = true;
  let cursor = CONFIG.startCursor;
  let csvFile: fs.FileHandle | undefined;
  let jsonFile: fs.FileHandle | undefined;

  try {
    while (hasNextPage) {
      if (cursor) console.log(`getting next page cursor: ${cursor}`);

      const { transactions, rawTransactions, hasNextPage: nextPage, endCursor } = await getTransactions(cursor, startDate, endDate);

      if (!csvFile || !jsonFile) {
        ({ csvFile, jsonFile } = await initializeFiles());
      }

      for (let i = 0; i < transactions.length; i++) {
        const tra = transactions[i];
        const rawTra = rawTransactions[i];

        const csvLine = `"${tra.date}","${tra.merch}","${tra.desc}","${tra.amt}","${tra.tra_type}","${tra.cat}","${tra.acct}","",""\n`;
        await csvFile.write(csvLine);
        if (totalTransactions.length > 0 || i > 0) {
          await jsonFile.write(',\n');
        }
        await jsonFile.write(JSON.stringify(rawTra, null, 2));
        debug(tra);
      }

      totalTransactions.push(...transactions);
      console.log(`total transactions: ${totalTransactions.length}, last date: ${transactions[transactions.length - 1]?.date}`);

      cursor = endCursor;
      hasNextPage = nextPage;
    }
  } finally {
    await csvFile?.close();
    if (jsonFile) {
      await jsonFile.write('\n]'); // Close the JSON array
      await jsonFile.close();
    }
  }

  console.log("done");
}

// Parse command line arguments for date range
const args = process.argv.slice(2);
const startDate = args[0]; // Format: YYYY-MM-DD
const endDate = args[1];   // Format: YYYY-MM-DD

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

main(startDate, endDate).catch(console.error);
