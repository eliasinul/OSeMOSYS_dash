# Countries

The countries the dashboard knows. Only codes listed here are read from
result file names.

All entries below are placeholders. `XAA` to `XAF` sit in the ISO 3166-1
user-assigned range, so they cannot collide with a real country code. The
coordinates place each marker on the landing map; they are approximate and
carry no meaning beyond position.

## Countries

- `lat`, `lon`: decimal degrees (south and west negative).
- `label`: `left` or `right` of the marker.

| iso3 | name | lat | lon | label |
|---|---|---|---|---|
| XAA | Country A | 23.7 | 90.4 | right |
| XAB | Country B | 28.4 | 84.1 | left |
| XAC | Country C | -1.3 | 36.8 | right |
| XAD | Country D | -9.2 | -75.0 | right |
| XAE | Country E | -17.8 | 178.0 | left |
| XAF | Country F | 14.9 | -23.5 | left |

## Profiles

Shown when the reader hovers a marker. Any `field` is allowed and shown in
the order given, up to seven rows per country. A `Mix` row is drawn as a
stacked bar: `Family share, Family share`, family names as in
`config/technologies.md`.

| iso3 | field | value |
|---|---|---|
| XAA | Population | placeholder |
| XAA | Electricity demand | placeholder |
| XAA | Mix | Gas 55, Coal 25, Solar 12, Hydro 8 |
| XAB | Population | placeholder |
| XAB | Electricity demand | placeholder |
| XAB | Mix | Hydro 85, Solar 10, Imports 5 |
| XAC | Population | placeholder |
| XAC | Electricity demand | placeholder |
| XAC | Mix | Geothermal 45, Hydro 30, Wind onshore 15, Oil 10 |
| XAD | Note | no results in this demo |
| XAE | Note | no results in this demo |
| XAF | Note | no results in this demo |
