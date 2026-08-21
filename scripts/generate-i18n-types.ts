import { writeFileSync } from "node:fs";
import path from "node:path";
import { format } from "prettier";

import { DEFAULT_LOCALE } from "../src/i18n/locales.ts";
import { ROOT, namespaceNames, readNamespace } from "./localeFiles.ts";

// TypeScript widens every string in an imported `.json` to `string`, which is enough to
// check that a key exists but throws away the `{{placeholder}}` names i18next needs to
// type a `t()` call's interpolation argument. This script re-emits the default locale's
// resources as an interface of string *literal* types, which `src/i18n/i18next.d.ts`
// feeds to i18next's `CustomTypeOptions` — so both an unknown key and a wrong
// interpolation argument become compile errors.
//
// Run it after editing any `en-US` namespace file: `pnpm i18n:types`.

const OUTPUT_FILE = path.join(ROOT, "src/i18n/resources.generated.ts");

const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function propertyKey(key: string): string {
  return IDENTIFIER.test(key) ? key : JSON.stringify(key);
}

/** A resource subtree as a type literal — leaves become the exact string they hold. */
function toTypeLiteral(value: unknown, depth: number): string {
  if (typeof value !== "object" || value === null) return JSON.stringify(value);

  const indent = "  ".repeat(depth + 1);
  const members = Object.entries(value).map(
    ([key, child]) => `${indent}${propertyKey(key)}: ${toTypeLiteral(child, depth + 1)};`
  );

  return `{\n${members.join("\n")}\n${"  ".repeat(depth)}}`;
}

async function main(): Promise<void> {
  const namespaces = namespaceNames();

  const members = namespaces.map(
    (namespace) =>
      `  ${propertyKey(namespace)}: ${toTypeLiteral(readNamespace(DEFAULT_LOCALE, namespace), 1)};`
  );

  const source = [
    `// Generated from src/i18n/locales/${DEFAULT_LOCALE} by \`pnpm i18n:types\`. Do not edit by hand.`,
    "",
    "/** The default locale's resources, as literal types — the shape every locale must match. */",
    "export interface GeneratedResources {",
    ...members,
    "}",
    "",
  ].join("\n");

  writeFileSync(OUTPUT_FILE, await format(source, { filepath: OUTPUT_FILE }), "utf8");

  console.log(`Wrote ${path.relative(ROOT, OUTPUT_FILE)} (${namespaces.join(", ")})`);
}

await main();
