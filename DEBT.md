# Debt

| ID | Opened | Location | Debt | Why taken | Risk | Size | Fix trigger | Status |
|---|---|---|---|---|---|---|---|---|
| T001 | 2026-10-30 | OSeMOSYS_dash.html, MILES | milestone years for labels are fixed at 2020, 2026, 2030 ... 2050 | inherited; horizon is 2020-2050 in the placeholder and CVF studies | labels missing for another horizon | S | first study with another horizon | open |
| T002 | 2026-10-30 | CHART_INFO | a few chart notes name the default families (Hydro (pumped), Battery storage) | text only; logic uses the config roles | notes read oddly if families are renamed | S | first study that renames storage families | open |
| T003 | 2026-10-30 | tools/list_codes.py | duplicates the markdown table reader of the HTML | lets the check run without a browser | the two readers could drift | S | any change to mdTables() | open |
| T004 | 2026-10-30 | parseResultsTxt | one region assumed; regions are summed | inherited | wrong totals for a multi-region model | M | first multi-region study | open |
| T005 | 2026-10-30 | OSeMOSYS_dash.html | internal names still say "discount rate" for variants (drFor, drRuns) | keeps the diff from 3.6.1 small | a variant that is not a rate reads oddly in code | S | a study whose variants are not rates | open |
| T006 | 2026-10-30 | tests | the native folder picker and permission prompt are not tested; tests/refresh.js covers the read behind them with a stand-in handle | Playwright cannot answer the native picker | a regression in the picker or permission call is caught only by hand | S | any change to linkBtn or the permission calls | partly fixed in 0.1.1 |
