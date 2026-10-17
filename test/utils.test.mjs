import assert from "node:assert/strict";
import test from "node:test";

import { debug, parseDateRangeArgs, toCsvField } from "../src/utils.ts";

test("parseDateRangeArgs accepts pnpm's argument separator", () => {
  assert.deepEqual(parseDateRangeArgs(["--", "2026-01-01", "2026-08-31"]), [
    "2026-01-01",
    "2026-08-31",
  ]);
  assert.deepEqual(parseDateRangeArgs(["2026-01-01", "2026-08-31"]), ["2026-01-01", "2026-08-31"]);
});

test("toCsvField quotes fields and doubles embedded quotes", () => {
  assert.equal(toCsvField('Coffee, "large"'), '"Coffee, ""large"""');
});

test("toCsvField preserves newlines inside a quoted field", () => {
  assert.equal(toCsvField("first\nsecond"), '"first\nsecond"');
});

test("debug output requires 1 or true", (context) => {
  const messages = [];
  context.mock.method(console, "log", (message) => messages.push(message));

  process.env.DEBUG = "false";
  debug({ private: true });
  assert.deepEqual(messages, []);

  process.env.DEBUG = "true";
  debug({ expected: true });
  assert.deepEqual(messages, ['{\n  "expected": true\n}']);

  delete process.env.DEBUG;
});
