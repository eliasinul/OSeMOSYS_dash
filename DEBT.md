# Debt

## Agent reporting rule

Agents must record potential comprehension debt (unclear assumptions, naming, or explanations) and
technical debt (shortcuts, limitations, or deferred work) found or introduced during a task in this
file. Add an actionable row with its location, reason, risk, size, fix trigger, and status before
finishing. If a concern is uncertain, record it as a candidate and say what needs confirmation.

| ID | Opened | Location | Debt | Why taken | Risk | Size | Fix trigger | Status |
|---|---|---|---|---|---|---|---|---|
| T001 | 2026-10-30 | OSeMOSYS_dash.html, MILES | Milestone labels use fixed years from 2020 through 2050. | Inherited from the placeholder and CVF horizons. | Labels may not match another study's horizon. | S | First study with a different horizon. | open |
| T002 | 2026-10-30 | CHART_INFO | Some chart notes use the default family names “Hydro (pumped)” and “Battery storage.” | Notes are descriptive; chart logic uses config roles. | Notes may be confusing if a study renames those families. | S | First study that renames a storage family. | open |
| T003 | 2026-10-30 | tools/list_codes.py | Reimplements the HTML markdown-table reader. | Allows the check to run without a browser. | The readers may drift apart. | S | Any change to `mdTables()`. | open |
| T004 | 2026-10-30 | parseResultsTxt | Assumes one region and sums regional values. | Inherited behavior. | Totals may be wrong for a multi-region model. | M | First multi-region study. | open |
| T005 | 2026-10-30 | OSeMOSYS_dash.html | Internal names for variants still refer to “discount rate” (`drFor`, `drRuns`). | Keeps the diff from 3.6.1 small. | Names may mislead when variants are not rates. | S | A study whose variants are not rates. | open |
| T006 | 2026-10-30 | tests | The native folder picker and permission prompt are not tested; `tests/refresh.js` uses a stand-in handle. | Playwright cannot operate the native picker. | Picker or permission regressions may be caught only by manual testing. | S | Any change to `linkBtn` or permission calls. | open |
