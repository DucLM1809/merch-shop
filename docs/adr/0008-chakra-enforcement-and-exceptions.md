# Chakra UI enforcement: ESLint ban + permitted exceptions

ADR 0007 established Chakra UI v3 as the design system. This ADR records how that rule is enforced and where exceptions are permitted.

## Enforcement

ESLint `no-restricted-elements` bans raw HTML elements that have direct Chakra equivalents:
`div`, `span`, `p`, `button`, `a`, `h1`–`h6`, `ul`, `ol`, `li`, `img`.

The `/chakra-ui-refactor` skill is run before merging UI changes to catch subtler issues (wrong v3 prop names, palette tokens instead of semantic tokens, v2 patterns) that lint cannot express.

## Permitted exceptions

- **Elements with no Chakra equivalent** (`form`, `table`, `thead`, `tbody`, `tr`, `td`): use `Box as="form"` etc. so Chakra style props remain available. Do not use bare native elements.
- **`style={{}}` prop**: allowed only for truly dynamic runtime values that cannot be expressed as Chakra tokens (e.g. an accent color supplied by the API). Static values must use Chakra style props.
- **`styles.css`**: kept for global concerns only — resets and font-face imports. Nothing that can live in a component belongs here.
- **Shell HTML** (`html`, `head`, `body` in `__root.tsx`): outside the rule; no Chakra equivalent exists.
