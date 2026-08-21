import type { ResourceTree } from "./resources";

/**
 * Resource trees keyed by locale, then by namespace — the shape `src/i18n/resources.ts`
 * ships and the shape the parity script reads off disk. Kept loose (plain strings rather
 * than `SupportedLocale`/`Namespace`) so tests can feed it small made-up bundles.
 */
export type LocaleResources = Record<string, Record<string, ResourceTree>>;

/** CLDR plural categories, which i18next encodes as a `_suffix` on the base key. */
const PLURAL_CATEGORIES = ["zero", "one", "two", "few", "many", "other"] as const;

export type PluralCategory = (typeof PLURAL_CATEGORIES)[number];

export type ParityGap = {
  locale: string;
  namespace: string;
  /** For a plural group this is the base key, without the `_category` suffix. */
  key: string;
  /** Set when the missing key is one form of a plural group. */
  pluralCategory?: PluralCategory;
};

function isTree(value: unknown): value is ResourceTree {
  return typeof value === "object" && value !== null;
}

/** Dot-joined paths to every leaf — the same strings `t()` is called with. */
function flattenKeys(tree: ResourceTree, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([key, value]) => {
    const path = prefix === "" ? key : `${prefix}.${key}`;

    return isTree(value) ? flattenKeys(value, path) : [path];
  });
}

function pluralBaseOf(key: string): string | undefined {
  const category = PLURAL_CATEGORIES.find((candidate) => key.endsWith(`_${candidate}`));

  return category === undefined ? undefined : key.slice(0, -(category.length + 1));
}

/**
 * The plural forms a locale actually needs. This is why parity isn't just "the same set
 * of keys": French requires a `many` form that English has no use for, and Polish needs
 * `few` on top of that. Comparing raw key sets would demand nonsense forms of one locale
 * and quietly accept a missing form in another.
 */
function requiredPluralCategories(locale: string): PluralCategory[] {
  const { pluralCategories } = new Intl.PluralRules(locale).resolvedOptions();

  return PLURAL_CATEGORIES.filter((category) => pluralCategories.includes(category));
}

function partitionKeys(keys: string[]): { plain: string[]; pluralBases: string[] } {
  const plain: string[] = [];
  const pluralBases = new Set<string>();

  for (const key of keys) {
    const base = pluralBaseOf(key);

    if (base === undefined) plain.push(key);
    else pluralBases.add(base);
  }

  return { plain, pluralBases: [...pluralBases] };
}

/**
 * Every key the default locale declares that some other locale doesn't supply.
 *
 * react-i18next has no such check of its own — a missing key silently falls back to the
 * default locale's copy, so a half-translated release looks fine at runtime and ships
 * English into a French page. This is the gate that makes that a build failure instead.
 *
 * Extra keys in a non-default locale are not reported: they're dead copy, not a hole a
 * visitor can fall into, and the missing-key report already catches the typo that usually
 * causes them.
 */
export function findKeyParityGaps(bundles: LocaleResources, defaultLocale: string): ParityGap[] {
  const reference = bundles[defaultLocale];

  if (reference === undefined) {
    throw new Error(`No resources to compare against for the default locale "${defaultLocale}".`);
  }

  const gaps: ParityGap[] = [];

  for (const [locale, namespaces] of Object.entries(bundles)) {
    if (locale === defaultLocale) continue;

    const categories = requiredPluralCategories(locale);

    for (const [namespace, tree] of Object.entries(reference)) {
      const present = new Set(flattenKeys(namespaces[namespace] ?? {}));
      const { plain, pluralBases } = partitionKeys(flattenKeys(tree));

      for (const key of plain) {
        if (!present.has(key)) gaps.push({ locale, namespace, key });
      }

      for (const base of pluralBases) {
        for (const category of categories) {
          if (present.has(`${base}_${category}`)) continue;

          gaps.push({ locale, namespace, key: base, pluralCategory: category });
        }
      }
    }
  }

  return gaps;
}

/** The gaps as lines a human can act on, naming the file each one belongs in. */
export function formatParityGaps(gaps: ParityGap[]): string {
  return gaps
    .map(({ locale, namespace, key, pluralCategory }) =>
      pluralCategory === undefined
        ? `${locale}/${namespace}.json is missing "${key}"`
        : `${locale}/${namespace}.json is missing "${key}_${pluralCategory}" — ${locale} needs a "${pluralCategory}" plural form`
    )
    .join("\n");
}
