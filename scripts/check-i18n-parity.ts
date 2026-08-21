import { DEFAULT_LOCALE } from "../src/i18n/locales.ts";
import { findKeyParityGaps, formatParityGaps } from "../src/i18n/keyParity.ts";
import { readLocaleResources } from "./localeFiles.ts";

// Thin I/O around `findKeyParityGaps` — the comparison itself lives in src/i18n and is
// covered by src/i18n/keyParity.test.ts, so this file has nothing to get wrong.
//
// Run it with `pnpm i18n:parity`.

const gaps = findKeyParityGaps(readLocaleResources(), DEFAULT_LOCALE);

if (gaps.length > 0) {
  console.error(`Translation keys are out of parity with ${DEFAULT_LOCALE}:\n`);
  console.error(formatParityGaps(gaps));
  console.error(`\n${gaps.length} missing key(s).`);
  process.exit(1);
}

console.log(`Every locale matches ${DEFAULT_LOCALE}.`);
