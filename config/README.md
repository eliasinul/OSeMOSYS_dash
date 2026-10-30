# config/

What the dashboard reads, and how to label it. The dashboard reads only the
six files named below; this README is not read.

| File | Required | Controls |
|---|---|---|
| results.md | yes | which `.txt` files are results, and where the codes sit in each path |
| countries.md | yes | country codes, names, map coordinates, hover profiles |
| scenarios.md | yes | scenario codes, cases, variants, discount rates, base case |
| technologies.md | yes | technology to family mapping, roles, colours, fuels, storage, demand technology |
| dashboard.md | no | title, cost window, CAU, comments folder, export prefix |
| investment.md | no | plant lives and committed pipeline for the annualised capital charge |

Column-by-column rules: `docs/CONFIG_REFERENCE.md`.
