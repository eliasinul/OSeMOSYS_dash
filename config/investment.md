# Investment inputs

Needed only for the annualised capital charge on the Costs tab. Without
this file the rest of the dashboard works and that chart says what is
missing. All values below are placeholders.

## Operational life

Plant life in years. `iso3` set to `*` applies to every country; a row for
one country overrides it.

| iso3 | tech | life_years |
|---|---|---|
| * | PWRCOA | 40 |
| * | PWRNGS | 30 |
| * | PWROIL | 30 |
| * | PWRHYD001 | 60 |
| * | PWRPHS | 60 |
| * | PWRWND001 | 25 |
| * | PWRSOL | 25 |
| * | PWRGEO | 30 |
| * | PWRBAT | 15 |
| * | STOBAT | 15 |
| XAB | PWRHYD001 | 80 |

## Committed pipeline

Plant already committed but not yet commissioned. It is not in the results
file, so it is listed here. `life_years` blank takes the operational life
above.

| iso3 | plant | tech | year | capacity_mw | capex_musd_per_gw | life_years |
|---|---|---|---|---|---|---|
| XAA | Placeholder solar 1 | PWRSOL | 2026 | 200 | 750 | |
| XAA | Placeholder gas 1 | PWRNGS | 2027 | 450 | 900 | |
| XAB | Placeholder hydro 1 | PWRHYD001 | 2028 | 300 | 2400 | |
| XAC | Placeholder geothermal 1 | PWRGEO | 2027 | 100 | 3800 | 30 |
