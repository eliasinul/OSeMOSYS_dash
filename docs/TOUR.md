# Interface tour

A walk through the dashboard with the placeholder results shipped in
`results/`, in the light and the dark theme. The theme follows the operating
system; the sun or moon button at the top right switches it.

All figures in these screenshots come from synthetic data and describe no
real system. The screenshots are regenerated with
`node tools/make_screenshots.js` (1440 x 900 px, Chromium).

## 1. Connect the folder

`OSeMOSYS_dash.html` opens on an empty map. (The demo page, `docs/index.html`,
skips this step: it opens on the placeholder results, marked "sample", with no
prompt.) When the opening animation ends, a prompt points at the link button. Click it and choose the repository folder (the
one holding `config/`). If a read finds nothing, the same prompt says why.

| Light | Dark |
|---|---|
| ![Connect prompt, light](img/01_connect_light.png) | ![Connect prompt, dark](img/01_connect_dark.png) |

## 2. The map

Each country in `config/countries.md` is a marker at its coordinates. A lit
marker has results; a grey one has none yet. Hover a marker for its profile
card (rows and mix bar from the Profiles table) and the number of scenarios
read. Click it to open the country.

| Light | Dark |
|---|---|
| ![Map with hover card, light](img/02_map_hover_light.png) | ![Map with hover card, dark](img/02_map_hover_dark.png) |

## 3. More: the scenario table

More, at the bottom left of the map, opens four panels: Reading the map,
Scenarios, Files read and Loading results. Scenarios lists every code in
`config/scenarios.md` with its case, variant and the discount rate in use.
Files read lists every file read and any configuration warning.

| Light | Dark |
|---|---|
| ![Scenario table, light](img/03_more_scenarios_light.png) | ![Scenario table, dark](img/03_more_scenarios_dark.png) |

## 4. Overview

With a country open, the layout has three parts:

- The left rail holds the link and Refresh buttons, the read summary and the
  selected scenario: its description, discount rate and objective value.
- The top bar holds the country switch and one card per case, with the
  variants inside each card. It also holds the tabs and the unit switches
  (PJ/TWh, GW/MW, value/%, area/bars).
- Overview shows the headline numbers for the last model year, then supply
  by family, CO2 emissions and the solar-and-wind share of supply.

| Light | Dark |
|---|---|
| ![Overview, light](img/04_overview_light.png) | ![Overview, dark](img/04_overview_dark.png) |

## 5. Generation

Generation by family, as a stack over time and at five-year steps. The
storage families are never counted as generation. Shown here for the
net-zero case.

| Light | Dark |
|---|---|
| ![Generation, light](img/05_generation_light.png) | ![Generation, dark](img/05_generation_dark.png) |

## 6. Capacity

Installed capacity, new storage energy capacity, capacity added each year,
capacity at five-year steps, total capacity against peak demand, and supply
in the tightest time slice.

| Light | Dark |
|---|---|
| ![Capacity, light](img/06_capacity_light.png) | ![Capacity, dark](img/06_capacity_dark.png) |

## 7. Tech Response

This tab compares the runs of one case across its variants, so it reads all
the variants at once and they go grey in the switch. Each family is drawn
against the discount rate itself. Here Country A's country-specific rate
(11.5 %) sits above the median (10 %).

| Light | Dark |
|---|---|
| ![Tech Response, light](img/07_techresp_light.png) | ![Tech Response, dark](img/07_techresp_dark.png) |

## 8. Costs

Capital, fixed O&M and fuel are summed over the cost window, from
`cost_from_year` in `config/dashboard.md` to the last year. These sums are
undiscounted and marked so. The objective value is the solver's discounted
total over the whole horizon. Do not compare the two.

| Light | Dark |
|---|---|
| ![Costs, light](img/08_costs_light.png) | ![Costs, dark](img/08_costs_dark.png) |

## 9. Annualised capital charge

Further down the Costs tab, capital is turned into yearly payments with the
capital recovery factor at the run's discount rate. The new build comes
from the results file and the committed pipeline from
`config/investment.md`. The pipeline is drawn in a shade of the family
colour blended toward the background: lighter in light mode, darker in dark
mode, and the note under the chart says which. The bar chart below it
compares the undiscounted sum across the variants. Method:
`docs/METHODS.md`.

| Light | Dark |
|---|---|
| ![Annualised capital charge, light](img/09_annualised_light.png) | ![Annualised capital charge, dark](img/09_annualised_dark.png) |

## 10. Emissions

Emissions by fuel source, for the fuel technologies marked
`emission = yes` in `config/technologies.md`. The total CO2 line is on
Overview. The emission cap is a model input that a results file does not
carry, so the rail notes that no cap line can be drawn.

| Light | Dark |
|---|---|
| ![Emissions, light](img/10_emissions_light.png) | ![Emissions, dark](img/10_emissions_dark.png) |

## 11. Reading aids and warnings

The i button beside a chart title explains how to read that chart. A run
that used the backstop (unserved demand) carries a red banner, a red pill
in the rail, a red dot on its variant button and red triangles above the
affected years. The run shown, Country C NZE_MDR, has a placeholder
shortfall from 2048 to 2050. Beside the i button, the arrow exports the
chart as PNG and the speech bubble adds a review comment.

| Light | Dark |
|---|---|
| ![Chart info and backstop warning, light](img/11_info_light.png) | ![Chart info and backstop warning, dark](img/11_info_dark.png) |
