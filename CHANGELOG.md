# Changelog

## 0.2.0 (2026-10-30)

Date: 2026-10-30
Files: docs/TOUR.md, docs/img/ (22 PNG), tools/make_screenshots.js, README.md, AGENTS.md, DEBT.md, NOTICE, package.json
What changed: added the interface tour and light/dark screenshots, a screenshot regeneration script,
third-party credits, clarification that fonts load online when available, and agent debt-reporting guidance.
Why: users can preview the interface before connecting a results folder.
Verified by: version references and debt table reviewed; screenshots inspected; tour checked against chart headings.
Not verified: automated tests (Node/npm unavailable) and GitHub rendering of the tour images.

## 0.1.1 (2026-10-30)

Date: 2026-10-30
Files: OSeMOSYS_dash.html, tests/refresh.js (new), package.json, README.md, AGENTS.md, DEBT.md, DECISIONS.md
What changed: the linked folder, comments cache and theme are stored under names of their own
("osemosys-dash", "osd-*") instead of the CVF dash's "moya-desk"/"mv-*". A read that finds no
config/ or no matching results now says so on the map prompt, and no longer keeps stale config.
Why: file:// pages share one storage origin, so Refresh re-read the folder last linked in the CVF
dash; the failure message went to the rail, hidden on Home, so Refresh appeared to do nothing.
Verified by: tests/refresh.js (6 checks; 2 fail on 0.1.0), known_answers.js, smoke.js, Chromium.
Not verified: Refresh in your Chrome/Edge with the real folder picker. After updating, link the
folder once more; the 0.1.0 link is not carried over.

## 0.1.0 (2026-10-30)

Date: 2026-10-30
Files: all (initial version)
What changed: generalised from the CVF Result Dash 3.6.1. Every study-specific
table (countries, coordinates, scenarios, rates, technology mapping, colours,
fuels, storage, lives, pipeline) moved to `config/*.md`; result files are found
by patterns in `config/results.md`. The built-in sample, profiles, country
outlines and csv inputs were removed. Synthetic results for three placeholder
countries, docs, tools and tests added.
Why: one dashboard for any OSeMOSYS study without editing code.
Verified by: tests/known_answers.js (21 checks) and tests/smoke.js (24 checks), Chromium.
Not verified: Firefox and Safari; the linked-folder Refresh path (File System
Access API) in a real browser session; results files from solvers other than
the format described in docs/RESULTS_FORMAT.md; multi-region models.
