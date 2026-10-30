# Technologies

Maps the model's technology codes onto the families the dashboard draws.
The dashboard reads every table below by its heading, so keep the headings
as they are. Column order does not matter; column names do.

A technology that appears in a results file but not in this file is ignored
by every chart. The **Files read** panel on Home lists nothing for it, so
check this table first when a technology seems to be missing.

## Families

One row per family, drawn in the `order` given (lowest at the bottom of a stack).

- `role`: `generation`, `storage` (the power half of a store, kept out of
  every supply total), `import` (counted in supply, not in capacity factors)
  or `backstop` (unserved demand, never counted as supply or investment).
  At most one family may carry `backstop`.
- `colour_light` / `colour_dark`: hex colours for the light and dark themes.
- `renewable`, `vre`, `fossil`: `yes` or blank. `vre` marks the variable
  sources used in the solar-and-wind share chart.

| family | order | role | colour_light | colour_dark | renewable | vre | fossil |
|---|---|---|---|---|---|---|---|
| Coal | 1 | generation | #3A3A3A | #8C8C8C | | | yes |
| Nuclear | 2 | generation | #7030A0 | #9B55C7 | | | |
| Gas | 3 | generation | #D1D1D1 | #D1D1D1 | | | yes |
| Oil | 4 | generation | #C00000 | #E03A3A | | | yes |
| Hydro | 5 | generation | #00B0F0 | #00B0F0 | yes | | |
| Hydro (pumped) | 6 | storage | #6FC9EE | #6FC9EE | | | |
| Wind onshore | 7 | generation | #F2CFEE | #F2CFEE | yes | yes | |
| Wind offshore | 8 | generation | #D86ECC | #D86ECC | yes | yes | |
| Solar | 9 | generation | #FFC000 | #FFC000 | yes | yes | |
| Biomass | 10 | generation | #92D050 | #92D050 | yes | | |
| Waste | 11 | generation | #3B7D23 | #5BA83A | | | |
| Geothermal | 12 | generation | #996600 | #C98A10 | yes | | |
| Imports | 13 | import | #F2AA84 | #F2AA84 | | | |
| Battery storage | 14 | storage | #E97132 | #E97132 | | | |
| Backstop | 15 | backstop | #e11d48 | #fb4d70 | | | |

## Technologies

Power-plant technologies. `discharge_mode` is filled only for a two-mode
store technology: the mode that delivers electricity to the grid (OSeMOSYS
convention here: mode 1 charges, mode 2 discharges).

| tech | family | discharge_mode |
|---|---|---|
| PWRCOA | Coal | |
| PWRNUC | Nuclear | |
| PWRNGS | Gas | |
| PWROIL | Oil | |
| PWRHYD001 | Hydro | |
| PWRHYD002 | Hydro | |
| PWRPHS | Hydro (pumped) | 2 |
| PWRWND001 | Wind onshore | |
| PWRWND002 | Wind offshore | |
| PWRSOL | Solar | |
| PWRCSP | Solar | |
| PWRBIO | Biomass | |
| PWRWTE | Waste | |
| PWRGEO | Geothermal | |
| PWRIMP | Imports | |
| PWRBAT | Battery storage | 2 |
| BACKSTOP | Backstop | |

## Storage

Storage technologies (the energy reservoir, not the power unit). `family`
is the power family the store belongs to; `label` is the name on the
storage chart.

| storage | family | label |
|---|---|---|
| STOBAT | Battery storage | Battery storage |
| STOPHS | Hydro (pumped) | Pumped-hydro storage |

## Fuels

Fuel-supply technologies, for the fuel-cost and emissions views. Set
`emission` to `yes` where `AnnualTechnologyEmission` on that technology
should be charted.

| tech | fuel | emission |
|---|---|---|
| MINCOA | Coal | yes |
| IMPCOA | Coal | yes |
| MINNGS | Natural gas | yes |
| IMPNGS | Natural gas | yes |
| MINOIL | Crude oil | yes |
| IMPOIL | Crude oil | yes |
| IMPFOA | Fuel oil | yes |
| MINBIO | Biomass | |
| IMPBIO | Biomass | |
| MINURN | Uranium | |
| IMPURN | Uranium | |
| MINWTE | Waste | |
| IMPWTE | Waste | |

## Fuel colours

| fuel | order | colour_light | colour_dark |
|---|---|---|---|
| Coal | 1 | #3A3A3A | #8C8C8C |
| Natural gas | 2 | #D1D1D1 | #D1D1D1 |
| Crude oil | 3 | #C00000 | #E03A3A |
| Fuel oil | 4 | #F2AA84 | #F2AA84 |
| Biomass | 5 | #92D050 | #92D050 |
| Waste | 6 | #3B7D23 | #5BA83A |
| Uranium | 7 | #7030A0 | #9B55C7 |

## Special technologies

| role | tech | notes |
|---|---|---|
| demand | DEMELCST | final electricity demand; its slice rates give the peak |
| export | PWREXP | electricity leaving the system; optional |
