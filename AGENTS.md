# Portfolio working instructions

This repository contains Annam Poshak's personal portfolio. It is separate from
CRICKET-ANALYTICS. Do not resume or mutate the cricket repository from this task.

At resume: inspect `git status --short`, `git log -1 --oneline` (an unborn branch
is possible), `docs/CHECKPOINT.md`, and relevant implementation and QA receipts.
Use the latest verified checkpoint; older evidence is historical. Do not repeat
passing checks unless their inputs changed. Preserve user edits.

Source of truth: `src/content.mjs`, the supplied resume, the portfolio brief,
and the source inventory in `docs/ASSETS.md`. Never fabricate project results,
employment, screenshots, links, or platform completion. Keep synthetic imagery
and reported/estimated metrics labeled. No private cricket data in public assets.

Use small in-place patches. No package installs, commits, pushes, history changes,
or publication without user authorization. Keep C: and D: above 30 GiB free;
they share a physical SSD. No source recovery or full dataset operations.

Run `npm run build` and `npm test` for relevant changes. Browser QA uses the
installed Chrome through Node's native WebSocket; it installs nothing. Update
`docs/CHECKPOINT.md` with actual results, incomplete work, and next action.
