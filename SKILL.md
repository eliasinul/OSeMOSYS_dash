---
name: osemosys-dash
description: Set up and use the OSeMOSYS Result Dash for a modelling study: fill config/*.md from the study's countries, scenarios and technology codes, place results files so the patterns match, validate, and read the dashboard. Use when someone wants to view OSeMOSYS results with this repository.
---

# Using the OSeMOSYS Result Dash

The dashboard is `OSeMOSYS_dash.html`. It reads only `config/*.md` and the
results `.txt` files matched by `config/results.md`. Setting it up for a
study means writing config, not code. Never edit the HTML for a study.

## Before starting, collect

1. The results files: one OSeMOSYS solution text file per country and
   scenario (`index  Variable(args)  value  dual`, objective on line 1).
2. For each country: a code, a display name, and map coordinates.
3. For each scenario code: the case it belongs to, the variant, and the
   discount rate it was solved at. The results file does not record the
   rate; ask for it. Never guess a rate.
4. Optional, for the annualised capital charge: plant lives per technology
   and any committed pipeline (plant, technology, year, MW, capex).

If a value is unknown, leave the cell blank and say so. A blank rate makes
the discount-rate views skip that run, which is correct; an invented rate
makes them wrong.

## Procedure

1. Results layout. Look at where the files are. Prefer writing a pattern in
   `config/results.md` that matches the existing layout over renaming files.
   Each pattern needs `{iso3}` and `{scenario}`; `*` is any characters in one
   name, `**` any number of folders.
2. Countries. Fill the Countries table in `config/countries.md`. Use real
   ISO3 codes for countries, and `XAA` to `XZZ` for anything else. Add
   Profiles rows only with sourced figures; record the source in
   `data/SOURCE.md`.
3. Scenarios. Fill Cases, Variants, Scenarios and, where rates differ by
   country, Country rates in `config/scenarios.md`. Mark exactly one
   scenario `base = yes`.
4. Technologies. Run `python tools/list_codes.py results/` (or the folder
   holding the results). Map every code it reports as "NOT IN
   technologies.md": plants to a family in the Technologies table, storage
   reservoirs in Storage, fuel supply in Fuels, the demand technology in
   Special technologies. Rerun until it reports 0 not mapped.
5. Remove the placeholder results (`results/results_*_XA?.txt`) and the
   placeholder countries, or move them to `archive/`.
6. Validate. Open the HTML in Chrome or Edge, link the repository folder,
   and check: the note lists every expected country with the expected number
   of scenarios; it reports no config warnings (otherwise read them under
   Home, More, Files read); Files read shows one row per expected file.
   If the tests can run, `node tests/smoke.js` must still pass on the
   placeholder copy of the repository.

## Reading the results with a user

- Start from the base case, then compare cases at the same variant.
- Check for the red backstop flag first: a run with unserved demand is not
  a solution to compare.
- Cost totals on the Costs tab are undiscounted sums over the cost window;
  the objective value is discounted over the whole horizon. Do not compare
  the two.
- The Tech Response tab draws each family against the discount rate itself.

## Common failures

| Symptom | Cause |
|---|---|
| "No usable configuration" | linked folder is not the one holding `config/` |
| Config read, no results | path does not match a pattern, or the code in the name is not listed |
| Technology missing from charts | code not in `config/technologies.md` |
| Two runs look merged | two files matched one country and scenario; Files read names them |

See `docs/CONFIG_REFERENCE.md` for every column and `docs/METHODS.md` for
what each view computes.
