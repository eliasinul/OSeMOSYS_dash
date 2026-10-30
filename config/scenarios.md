# Scenarios

A results file does not record what it was solved for, so this file says
what each scenario code means. A scenario is one *case* (the policy or
storyline) solved at one *variant* (here, a discount rate).

The rates below are placeholders for the demonstration results.

## Cases

- `style`: `reference` or `policy`; sets the colour of the case in the
  scenario switch.
- `emission_cap`: `yes` when the case is solved under an emission limit; the
  dashboard then explains that the cap itself is a model input and not in
  the results file.

| case | style | emission_cap | description |
|---|---|---|---|
| REF | reference | | Reference: least-cost expansion with no emission constraint |
| NZE | policy | yes | Net-zero emissions: the same system under an annual emission limit that falls to zero by the last year |

## Variants

Shown inside each case card, in this order.

| variant | label |
|---|---|
| LDR | Low discount rate |
| MDR | Median discount rate |
| CDR | Country-specific discount rate |

## Scenarios

- `discount_rate_pct`: the rate the run was solved at, in per cent. Leave
  blank when unknown; the cost-of-capital views then skip the run.
- `base`: `yes` for exactly one scenario, the base case every other is
  compared against.

| code | case | variant | discount_rate_pct | base | description |
|---|---|---|---|---|---|
| REF_LDR | REF | LDR | 6.0 | yes | |
| REF_MDR | REF | MDR | 10.0 | | |
| REF_CDR | REF | CDR | 12.0 | | |
| NZE_LDR | NZE | LDR | 6.0 | | |
| NZE_MDR | NZE | MDR | 10.0 | | |
| NZE_CDR | NZE | CDR | 12.0 | | |

## Country rates

Overrides `discount_rate_pct` for one country and one variant. A
country-specific rate can fall below the median, which is why the
discount-rate charts are drawn against the rate and not the variant order.

| iso3 | variant | discount_rate_pct |
|---|---|---|
| XAA | CDR | 11.5 |
| XAB | CDR | 14.0 |
| XAC | CDR | 8.5 |
