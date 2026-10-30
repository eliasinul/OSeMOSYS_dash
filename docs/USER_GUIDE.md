# User guide

## 1. Get the tool

Download the repository as a zip from GitHub and unzip it, or clone it:

```
git clone https://github.com/eliasinul/OSeMOSYS_dash
```

Nothing needs to be installed. The dashboard is `OSeMOSYS_dash.html`.

## 2. Open it and link the folder

1. Open `OSeMOSYS_dash.html` in Chrome or Edge (double-click, or drag it
   into a browser window).
2. Wait for the opening animation; a prompt then points at the link button.
3. Click it and choose the repository folder, the one that holds `config/`.
   Do not choose `results/`: without `config/` nothing can be read.
4. Allow read access when the browser asks.

The dashboard walks the folder, reads `config/` first, then every `.txt`
file that matches a pattern in `config/results.md`. The note under the
buttons says how many scenarios were read, for which countries, and how
many files were ignored.

Chrome and Edge keep the link. On the next visit press Refresh and grant
access again (browsers ask once per session). Firefox and Safari fall back
to a folder dialog on every read.

## 3. Read the results

Screenshots of each step, in both themes: `docs/TOUR.md`.

- Home: the map. A lit marker has results; a grey one is listed in
  `config/countries.md` with nothing read yet. Hover a marker for its
  profile, click it to open the country. More opens four panels: reading
  the map, the scenario table with the rates in use, the list of files read
  (with any configuration warnings), and the loading rules.
- Overview, Generation, Capacity, Costs, Emissions: one scenario at a time.
  Pick the case and variant in the switch at the top.
- Tech Response: compares the runs of one case across its variants, drawn
  against the discount rate itself.
- The i button on each chart explains how to read it. The arrow exports the
  chart as PNG; the speech bubble adds a review comment.

Units: PJ or TWh for energy, GW or MW for power, value or per cent for
stacks, area or bars for the chart form. All are switches in the top bar.

## 4. Keep the folder in order

- One results file per country and scenario. A second file that resolves
  to the same pair is refused and named in Files read.
- Move a superseded run into a folder named `archive` (or `old`,
  `archived`, `superseded`); such folders are never read.
- Keep model inputs and source data in `data/`; the dashboard never reads it.
- After a new model run, overwrite the results file and press Refresh. With
  a country open, Refresh re-reads that country only; from Home it re-reads
  everything.

## 5. Review comments

Comments are written to `_comments/<ISO3>_comments.md` under the linked
folder (the folder name is set in `config/dashboard.md`). The browser asks
for write access on the first save. The file is plain markdown and is read
back on Refresh, so it can be edited by hand and shared through git.

## 6. Troubleshooting

| What you see | Likely cause | Fix |
|---|---|---|
| "No usable configuration" | the linked folder has no `config/`, or a required file is missing | link the repository folder; check the four required files exist |
| Config read but no results | no path matches `config/results.md`, or the code in the name is not listed | compare a file path with the patterns; check the codes in `countries.md` and `scenarios.md` |
| A technology is missing from charts | its code is not in `config/technologies.md` | run `python tools/list_codes.py` |
| A family is grey | its colour is missing or not a hex value | set `colour_light` and `colour_dark` |
| Discount-rate views say no rate | `discount_rate_pct` blank for that scenario | fill it in `config/scenarios.md` |
| Annualised capital charge says inputs missing | no `config/investment.md`, or no life for a technology | add the life row it names |
| Warnings count in the note | a row in config could not be used | Home, More, Files read lists each one |
