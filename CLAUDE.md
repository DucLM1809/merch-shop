## UI conventions

All UI uses Chakra UI v3 components. Raw HTML elements that have a Chakra equivalent are banned (`div`→`Box`, `button`→`Button`, `img`→`Image`, etc.). Elements with no Chakra equivalent (`form`, `table`, `tr`, `td`, etc.) use `Box as="form"`. The `style={{}}` prop is allowed only for dynamic runtime values (e.g. API-supplied accent colors) that cannot be expressed as Chakra tokens. Run `/chakra-ui-refactor` before merging UI changes. See `docs/adr/0008-chakra-enforcement-and-exceptions.md`.

## Testing conventions

No Playwright or Cypress. Vitest is the full test surface — unit tests and `renderRoute` integration tests are both in scope and both required. Every new feature needs at least one Vitest test before merge. "Done" = Vitest passes + golden path verified in browser (or via `/verify`). See `docs/adr/0009-vitest-only-no-browser-automation.md`.

## Agent skills

### Issue tracker

Issues live in GitHub Issues (no external PRs as triage surface). See `docs/agents/issue-tracker.md`.

### Triage labels

Default label vocabulary — `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context repo — one `CONTEXT.md` and `docs/adr/` at root. See `docs/agents/domain.md`.


<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:7510c1e2 -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->
