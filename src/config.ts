import { config } from "dotenv";

// Load environment variables from .env file
config();

export const CONFIG = {
  accessToken: process.env.MY_ACCESS_TOKEN,
  startCursor: process.env.START_CURSOR,
  debug:
    process.env.DEBUG === "1" || process.env.DEBUG?.toLowerCase() === "true",
} as const;
