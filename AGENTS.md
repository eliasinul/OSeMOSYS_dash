# AGENTS.md: OSeMOSYS Result Dash

Instructions for an AI agent (or a new contributor) working in this
repository. Read this file and `README.md` before changing anything. If
`E:\CoWork\GUIDELINES\AGENTS.md` is reachable, its rules apply as well and
take precedence.

## What this repository is

A single-file browser dashboard (`OSeMOSYS_dash.html`) that reads OSeMOSYS
results text files and markdown configuration. No build step, no server,
no runtime dependency.

## Two kinds of task

1. Using the dashboard for a study (most tasks): edit `config/*.md`, place
   results in `results/`. Do not edit the HTML. Follow `SKILL.md`.
2. Changing the dashboard itself: edit `OSeMOSYS_dash.html`, then follow the
   rules below.

## Map

| Path | Role | Agent may edit |
|---|---|---|
| `OSeMOSYS_dash.html` | the tool: parser, config reader, charts | only for task 2 |
| `config/*.md` | single source of truth for everything study-specific | yes |
| `results/*.txt` | model output | never by hand; replace whole files |
| `data/` | inputs and sources, not read by the tool | yes; record provenance in `data/SOURCE.md` |
| `docs/` | user guide, config reference, results format, methods | keep in step with the code |
| `tools/` | placeholder generator, code lister | yes |
| `tests/` | known-answer and smoke tests | add tests; never weaken one to make it pass |
| `archive/` | superseded files | move files here instead of deleting |
| `LICENSE` | Apache-2.0 | never |

## Commands

```
node tests/known_answers.js     # arithmetic and matching against hand-computed values
node tests/smoke.js             # loads the repository, opens every tab, both themes
node tests/refresh.js           # Refresh with a stand-in linked folder
python tools/list_codes.py      # technology codes in results not mapped in config
python tools/make_placeholder_results.py   # regenerate the synthetic results
```

The tests need Playwright with Chromium (`npm install`, then
`npx playwright install chromium`). Set `PLAYWRIGHT_PATH` or
`CHROMIUM_PATH` if they are installed elsewhere.

## Rules for task 2 (changing the HTML)

- Nothing study-specific in the HTML: no country, scenario, technology
  code, rate or colour. If a chart needs one, add a column or table to
  `config/` and read it in `applyConfig()`.
- Config tables are mutated in place (`FAMS.length = 0; FAMS.push(...)`),
  never reassigned: other code holds references to them.
- Fail loudly: a config row that cannot be used is pushed to the problem
  list in `applyConfig()`, never silently dropped.
- One results file per country and scenario; `put()` sums values, so never
  allow a second file to merge into the first.
- Keep every existing feature unless the owner asks for its removal.
- Browser storage names start with "osemosys-dash" or "osd-". Pages opened from file:// share
  one storage origin, so a name shared with another local dashboard makes them read each other's folder.
- Change notes of ten lines or fewer in `CHANGELOG.md`; non-obvious choices
  in `DECISIONS.md`; shortcuts in `DEBT.md`.
- Versioning: 0.MINOR.PATCH until the first public release. A new feature
  raises MINOR, a fix raises PATCH.
- Done means: both tests pass, the docs describe the new behaviour, the
  change note is written, and what was not verified is stated.

## Writing

Plain scientific prose: lead with the finding, one idea per sentence, units
in every number, no invented figures. Office files are authored as EL.
