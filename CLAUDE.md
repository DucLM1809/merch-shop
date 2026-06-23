## UI conventions

All UI uses Chakra UI v3 components. Raw HTML elements that have a Chakra equivalent are banned (`div`→`Box`, `button`→`Button`, `img`→`Image`, etc.). Elements with no Chakra equivalent (`form`, `table`, `tr`, `td`, etc.) use `Box as="form"`. The `style={{}}` prop is allowed only for dynamic runtime values (e.g. API-supplied accent colors) that cannot be expressed as Chakra tokens. Run `/chakra-ui-refactor` before merging UI changes. See `docs/adr/0008-chakra-enforcement-and-exceptions.md`.

## Testing conventions

No Playwright or Cypress. Vitest is the full test surface — unit tests and `renderRoute` integration tests are both in scope and both required. Every new feature needs at least one Vitest test before merge. "Done" = Vitest passes + golden path verified in browser (or via `/verify`). See `docs/adr/0009-vitest-only-no-browser-automation.md`.

## Agent skills

### Issue tracker

Issues live in Beads Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

Default label vocabulary — `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context repo — one `CONTEXT.md` and `docs/adr/` at root. See `docs/agents/domain.md`.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
