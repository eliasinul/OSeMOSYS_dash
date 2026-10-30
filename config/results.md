# Results files

Tells the dashboard which `.txt` files under the linked folder are results,
and how to read the country and scenario out of each path.

## Patterns

Each pattern is a path relative to the linked folder. Tokens:

- `{iso3}`: a country code listed in `config/countries.md`;
- `{scenario}`: a scenario code listed in `config/scenarios.md`;
- `*`: any run of characters inside one folder or file name;
- `**`: any number of folders.

Matching ignores case. Every pattern must contain both `{iso3}` and
`{scenario}`. A file is read by the first pattern it matches.

| pattern | example |
|---|---|
| `results/*_{scenario}_{iso3}.txt` | `results/results_REF_LDR_XAA.txt` |
| `results/{iso3}/{scenario}.txt` | `results/XAA/REF_LDR.txt` |

## Ignored folders

A path with any of these folder names is never read, so a superseded run
kept beside the current one cannot be merged into it.

| folder |
|---|
| archive |
| archived |
| old |
| superseded |
