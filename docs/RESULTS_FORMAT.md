# Results format

## The file

The dashboard reads the plain-text solution file that OSeMOSYS solvers
write (for example through CBC or GLPK, as produced by MUIO): the objective
value on the first line, then one line per non-zero variable or constraint:

```
Optimal - objective value 132528.324012
      0 TotalCapacityAnnual(RE1,PWRCOA,2020)     3.397478     0.000000
      1 NewCapacity(RE1,PWRSOL,2026)             0.120000     0.000000
```

Each line must match `index  Name(arg,arg,...)  value  dual`. Lines that do
not match (headers, comments) are skipped. The year is always the last
argument. Only `.txt` files are considered; csv exports do not carry the
duals and are not read.

## Variables read

| Variable | Arguments as read | Used for |
|---|---|---|
| TotalCapacityAnnual | region, tech, year | capacity |
| NewCapacity | region, tech, year | new build |
| TotalTechnologyAnnualActivity | region, tech, year | generation, demand, exports, fuel use |
| CapitalInvestment | region, tech, year | capital cost, annualised charge |
| AnnualFixedOperatingCost | region, tech, year | fixed O&M |
| AnnualVariableOperatingCost | region, tech, year | fuel cost (fuel techs) or variable O&M |
| AnnualTechnologyEmission | region, tech, emission, year | emissions (techs with `emission = yes`) |
| AccumulatedNewStorageCapacity | region, storage, year | storage energy |
| CapitalInvestmentStorage | region, storage, year | storage capital, annualised charge |
| RateOfTotalActivity | region, tech, slice, year | peak demand, tightest slice |
| TotalAnnualTechnologyActivityByMode | region, tech, mode, year | store discharge |
| RateOfActivity | region, slice, tech, mode, year | store discharge by slice |

Binding constraints are read from the dual of these rows:
`TCC1_TotalAnnualMaxCapacityConstraint`, `TCC2_TotalAnnualMinCapacityConstraint`,
`AAC2_TotalAnnualTechnologyActivityUpperLimit`,
`AAC3_TotalAnnualTechnologyActivityLowerLimit`,
`NCC1_TotalAnnualMaxNewCapacityConstraint`, `E8_AnnualEmissionsLimit`,
`UDC1_UserDefinedConstraintInequality`.

Only one region is assumed: values for the same technology and year are
added across regions.

## Where the files go

`config/results.md` lists path patterns relative to the linked folder.
Tokens:

| Token | Matches |
|---|---|
| `{iso3}` | one country code from `config/countries.md` |
| `{scenario}` | one scenario code from `config/scenarios.md` |
| `*` | any characters inside one folder or file name |
| `**` | any number of folders |

Matching ignores case and works whether the linked folder is the repository
or a folder above it. Codes are tried longest first, so `REF_LDR` cannot be
read as `REF`. Example layouts and the patterns that read them:

| Layout | Pattern |
|---|---|
| `results/results_REF_LDR_XAA.txt` | `results/*_{scenario}_{iso3}.txt` |
| `results/XAA/REF_LDR.txt` | `results/{iso3}/{scenario}.txt` |
| `Country A/results_XAA/results_xaa_REF_LDR.txt` | `**/results_{iso3}/results_*_{scenario}.txt` |

## Rules

- One file per country and scenario. A second match is refused and listed,
  because values are summed as they are read and two runs would merge.
- A path through a folder named in the Ignored folders table is never read.
- Regenerate the placeholders with `python tools/make_placeholder_results.py`;
  delete them before adding real results so the two cannot mix.
