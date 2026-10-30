# Configuration reference

The dashboard reads six markdown files from `config/` under the linked
folder. A table is found by the heading directly above it (any heading
level), so keep the headings. Column order is free; column names are not.
Names are matched without case, and spaces become underscores
(`Discount rate pct` reads as `discount_rate_pct`). Backticks around a cell
are ignored. A cell cannot contain `|`. Text outside the tables is free.

A row that cannot be used is skipped and reported: the note under the
buttons gives the count and Home, More, Files read lists each problem. The
read stops only when one of the four required files is missing or yields
no families, countries, scenarios or patterns.

When several copies of a file exist under the linked folder, the shallowest
is read and the others are listed as ignored. Config inside an ignored
folder (archive, old, ...) is never read.

## config/dashboard.md (optional)

Table under a heading containing "settings" or "dashboard", columns `key`, `value`.

| key | default | meaning |
|---|---|---|
| title | OSeMOSYS Result Dash | page and rail title |
| cost_from_year | 2025 | first year of the cost window (four digits) |
| cau_pj_per_gw | 31.536 | capacity-to-activity unit, PJ per GW-year |
| comments_folder | _comments | folder for review comments, one name, no slashes |
| export_prefix | OSD | first part of exported PNG names |

## config/results.md (required)

| Table | Columns | Rules |
|---|---|---|
| Patterns | `pattern` | path relative to the linked folder; must contain `{iso3}` and `{scenario}`; `*` and `**` allowed; first match wins |
| Ignored folders | `folder` | a path through any of these folder names is never read |

## config/countries.md (required)

| Table | Columns | Rules |
|---|---|---|
| Countries | `iso3`, `name`, `lat`, `lon`, `label` | `iso3`: 2 to 8 letters or digits, unique. `lat` -90..90, `lon` -180..180, decimal degrees; without them the country has no marker. `label`: `left` or `right` |
| Profiles | `iso3`, `field`, `value` | free fields shown on hover, in order, first seven. Field `Mix`: `Family share, Family share, ...` drawn as a bar in family colours |

Use codes from the ISO 3166-1 user-assigned range (`XAA` to `XZZ`) for
anything that is not a country, so they cannot collide with a real code.

## config/scenarios.md (required)

| Table | Columns | Rules |
|---|---|---|
| Cases | `case`, `style`, `emission_cap`, `description` | `style`: `reference` or `policy` (colour in the switch). `emission_cap`: `yes` adds a note that the cap is an input, not in the results |
| Variants | `variant`, `label` | order of the variant buttons inside a case |
| Scenarios | `code`, `case`, `variant`, `discount_rate_pct`, `base`, `description` | `code` as it appears in file names, unique. Exactly one row `base = yes`. Rate in per cent; blank = unknown |
| Country rates | `iso3`, `variant`, `discount_rate_pct` | overrides the scenario rate for that country and variant |

A scenario with no variant is shown on its own, outside the case cards, and
is not part of the discount-rate comparison.

## config/technologies.md (required)

| Table | Columns | Rules |
|---|---|---|
| Families | `family`, `order`, `role`, `colour_light`, `colour_dark`, `renewable`, `vre`, `fossil` | `role`: `generation`, `storage`, `import`, `backstop` (at most one). Colours `#rrggbb` or `#rgb`; `colour_dark` blank = same as light. Flags `yes` or blank |
| Technologies | `tech`, `family`, `discharge_mode` | `family` must be in Families. `discharge_mode` only for a two-mode store technology |
| Storage | `storage`, `family`, `label` | storage (reservoir) technology, the power family it belongs to, chart label |
| Fuels | `tech`, `fuel`, `emission` | fuel-supply technologies; `emission = yes` charts their `AnnualTechnologyEmission` |
| Fuel colours | `fuel`, `order`, `colour_light`, `colour_dark` | a fuel without a row is drawn in a default colour and reported |
| Special technologies | `role`, `tech` | `demand` (required for demand and peak views), `export` (optional) |

A technology code found in a results file but not listed is ignored by
every chart. `python tools/list_codes.py` lists the unmapped codes.

## config/investment.md (optional)

Used only by the annualised capital charge on the Costs tab.

| Table | Columns | Rules |
|---|---|---|
| Operational life | `iso3`, `tech`, `life_years` | `iso3 = *` applies to all countries; a country row overrides it. Storage technologies need a row too |
| Committed pipeline | `iso3`, `plant`, `tech`, `year`, `capacity_mw`, `capex_musd_per_gw`, `life_years` | plant committed but not in the model's new build; `life_years` blank = operational life |

Capital investment in the results is in the model's currency unit; the
pipeline capex must be in the same unit (M USD per GW in the placeholders).
