import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "../src/i18n/locales.ts";

import type { LocaleResources } from "../src/i18n/keyParity.ts";
import type { ResourceTree } from "../src/i18n/resources.ts";

// Node can't `import` a `.json` the way the bundler does (it wants an import attribute),
// so build tooling reads the locale files off disk instead. Reading the directory also
// means a namespace file that exists but was never registered in `resources.ts` still
// gets compared, rather than being invisible to the check.

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const LOCALES_DIR = path.join(ROOT, "src/i18n/locales");

/** Namespace names, taken from the default locale — the source of truth for what exists. */
export function namespaceNames(): string[] {
  const names = readdirSync(path.join(LOCALES_DIR, DEFAULT_LOCALE))
    .filter((file) => file.endsWith(".json"))
    .map((file) => path.basename(file, ".json"))
    .sort();

  if (names.length === 0) {
    throw new Error(`No namespace files found in ${path.join(LOCALES_DIR, DEFAULT_LOCALE)}`);
  }

  return names;
}

function namespacePath(locale: string, namespace: string): string {
  return path.join(LOCALES_DIR, locale, `${namespace}.json`);
}

export function readNamespace(locale: string, namespace: string): ResourceTree {
  // Malformed JSON throws rather than being reported as an absent file — "cart.json is
  // missing every key" is a confusing way to say "cart.json has a trailing comma".
  return JSON.parse(readFileSync(namespacePath(locale, namespace), "utf8")) as ResourceTree;
}

/**
 * Every supported locale's namespaces. A namespace file a locale hasn't been given yet is
 * left out rather than defaulted to `{}`, so the parity check reports its keys as missing
 * instead of silently comparing against nothing.
 */
export function readLocaleResources(): LocaleResources {
  const namespaces = namespaceNames();

  return Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [
      locale,
      Object.fromEntries(
        namespaces
          .filter((namespace) => existsSync(namespacePath(locale, namespace)))
          .map((namespace) => [namespace, readNamespace(locale, namespace)])
      ),
    ])
  );
}
