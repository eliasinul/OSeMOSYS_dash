# Methods

What the dashboard computes from the results, and the assumptions it makes.
Everything else is drawn as read.

## Units

- Energy is read in PJ. TWh = PJ / 3.6.
- Power is read in GW. MW = GW x 1000. The default unit follows the
  country: when its largest total installed capacity in any loaded run is
  below 2 GW, power is shown in MW.
- Capacity factor = activity / (capacity x CAU), with CAU, the
  capacity-to-activity unit, from `config/dashboard.md` (31.536 PJ per
  GW-year by default: 8760 h x 3.6 PJ/TWh / 1000).

## Families and roles

Technologies are summed into families through `config/technologies.md`.
The role of a family decides where it is counted:

- storage: the power half of a store. Its annual activity is charge plus
  discharge, so it never enters a supply total. Only the discharge mode
  (set per technology) is shown, and only in the tightest-slice chart.
- import: counted in supply, left out of capacity-factor views.
- backstop: unserved demand. Never supply, never an investment; a run where
  it is non-zero is flagged in red.

## Peak and tightest slice

Peak demand is the largest `RateOfTotalActivity` of the demand technology
over the slices of a year. The tightest slice is the slice with the largest
residual load, demand minus the output of the variable renewables
(`vre = yes`), which is where adequacy is decided; it is often not the
demand peak.

## Costs

All cost figures on the Costs tab are summed over the cost window, from
`cost_from_year` to the last model year, and are undiscounted; each is
marked so. The objective value is shown as written by the solver: the
discounted total over the whole horizon, which cannot be re-based to the
window.

## Annualised capital charge

Each investment is converted into equal yearly payments over the plant's
life with the capital recovery factor

    CRF(r, n) = r (1 + r)^n / ((1 + r)^n - 1),     CRF(0, n) = 1/n

where r is the run's discount rate (`config/scenarios.md`, with any country
override) and n the operational life (`config/investment.md`). Payments
start in the commissioning year and stop at the last model year. Capital
spent before the cost window is sunk and not charged.

Two kinds of investment are charged: the model's new build
(`CapitalInvestment`, `CapitalInvestmentStorage`) and the committed
pipeline (MW x capex in the commissioning year). The pipeline is charged at
the scenario rate. For a project already financed at a fixed rate this
overstates how far its cost moves with the rate. The comparison across
discount rates is the undiscounted sum of payments over the cost window;
discounting each run at its own rate would largely cancel the effect being
shown.

Known answer, tested in `tests/known_answers.js`: 200 MW at 750 M USD/GW
commissioned in 2026, life 25 years, rate 6 %: 150 x CRF(0.06, 25) =
11.734 M USD per year for 2026 to 2050, 293.35 M USD in total.

## Discount rates

A results file does not record the rate it was solved at. The rate comes
from `config/scenarios.md`: the country rate for that variant when given,
otherwise the scenario rate. The discount-rate charts are drawn against the
rate itself, because a country rate can fall below a shared one.
