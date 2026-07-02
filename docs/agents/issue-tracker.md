# Issue tracker: Beads

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

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See <https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md> for details and anti-patterns.

## Branching & PRs

**One PR per issue.** Never commit or push code changes directly to `main`.

1. Branch off `main` for the issue (e.g. `<type>/<short-desc>` or `issue-<id>-<slug>`)
2. Do all commits for that issue on the branch
3. Push the branch and open a PR (`gh pr create`) — do not merge it yourself unless explicitly told to
4. User reviews and merges

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until the issue's branch is pushed and a PR is open (or updated).

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH THE BRANCH + OPEN/UPDATE PR** - This is MANDATORY for any code change:

   ```bash
   git push -u origin <branch>
   gh pr create --fill   # skip if a PR already exists for this branch
   ```

   Do NOT push code changes straight to `main`.

5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed and pushed to the branch, PR open
7. **Hand off** - Provide context for next session, including the PR link

**CRITICAL RULES:**

- Work is NOT complete until the branch is pushed and PR is open
- NEVER stop before pushing - that leaves work stranded locally
- NEVER push code changes directly to `main` - always branch + PR
- NEVER say "ready to push when you are" - YOU must push the branch and open the PR
- If push fails, resolve and retry until it succeeds
  <!-- END BEADS INTEGRATION -->
