# -*- coding: utf-8 -*-
"""
Write synthetic OSeMOSYS-style results files for the demonstration countries.

Author: EL

The numbers are invented. They follow simple rules (demand growth, a
renewable share that rises faster under the net-zero case and falls with the
discount rate, capacity derived from activity and a capacity factor) so the
charts show plausible shapes, but they describe no real system. Do not cite
them.

Run from the repository root:
    python tools/make_placeholder_results.py

Writes results/results_<SCENARIO>_<ISO3>.txt, one per country and scenario.
The output is deterministic: the same script writes the same bytes.
"""
import math
import os
import random

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "results")

YEARS = list(range(2020, 2051))
SLICES = ["S1D1", "S1D2", "S2D1", "S2D2"]            # season x day/night
YEARSPLIT = 0.25
DEMAND_SHAPE = [0.22, 0.28, 0.23, 0.27]
CAU = 31.536                                          # PJ per GW-year
REGION = "RE1"

# capacity factor, capex (M USD/GW), fixed O&M (M USD/GW/yr), slice shape
TECH = {
    "PWRCOA":    (0.70, 1600, 45, None),
    "PWRNGS":    (0.55,  900, 25, None),
    "PWROIL":    (0.30,  850, 20, None),
    "PWRHYD001": (0.45, 2400, 40, [0.30, 0.30, 0.20, 0.20]),
    "PWRSOL":    (0.19,  700, 12, [0.50, 0.00, 0.50, 0.00]),
    "PWRWND001": (0.32, 1250, 30, [0.20, 0.30, 0.22, 0.28]),
    "PWRGEO":    (0.80, 3800, 90, None),
    "PWRBAT":    (0.12,  600, 10, [0.00, 0.50, 0.00, 0.50]),
    "BACKSTOP":  (1.00,    0,  0, None),
}
# fuel tech, plant efficiency, fuel price (M USD/PJ), Mt CO2 per PJ fuel
FUEL = {"PWRCOA": ("MINCOA", 0.36, 3.0, 0.0946),
        "PWRNGS": ("IMPNGS", 0.48, 8.0, 0.0561),
        "PWROIL": ("IMPOIL", 0.35, 14.0, 0.0733)}

# 2020 demand (PJ), growth, starting mix shares, renewable mix at the end
COUNTRIES = {
    "XAA": dict(d0=300, g=0.045, start={"PWRNGS": .55, "PWRCOA": .25, "PWROIL": .07, "PWRHYD001": .08, "PWRSOL": .05},
                re={"PWRSOL": .55, "PWRWND001": .25, "PWRHYD001": .20}, re0=.13),
    "XAB": dict(d0=40, g=0.060, start={"PWRHYD001": .88, "PWRSOL": .04, "PWROIL": .08},
                re={"PWRHYD001": .80, "PWRSOL": .20}, re0=.92),
    "XAC": dict(d0=45, g=0.050, start={"PWRGEO": .45, "PWRHYD001": .30, "PWRWND001": .10, "PWROIL": .15},
                re={"PWRGEO": .45, "PWRHYD001": .20, "PWRWND001": .20, "PWRSOL": .15}, re0=.85),
}
SCEN = {"LDR": 0.06, "MDR": 0.10}
CDR = {"XAA": 0.115, "XAB": 0.14, "XAC": 0.085}


def renewable_share(case, rate, re0, t):
    """Share of renewables in year index t (0..30)."""
    x = t / (len(YEARS) - 1)
    end = 1.0 if case == "NZE" else min(0.95, re0 + 0.35)
    end -= 1.6 * max(0.0, rate - 0.06) * (0.4 if case == "NZE" else 1.0)
    end = max(re0, min(1.0, end))
    return re0 + (end - re0) * (3 * x * x - 2 * x * x * x)     # smooth S-curve


def build(iso, case, rate):
    c = COUNTRIES[iso]
    rnd = random.Random("%s-%s-%.4f" % (iso, case, rate))
    act = {t: [0.0] * len(YEARS) for t in TECH}
    dem = []
    for i, y in enumerate(YEARS):
        d = c["d0"] * (1 + c["g"]) ** i
        dem.append(d)
        s = renewable_share(case, rate, c["re0"], i)
        fossil = {k: v for k, v in c["start"].items() if k in FUEL}
        ftot = sum(fossil.values()) or 1
        # fossil part shrinks; coal leaves first in the net-zero case
        for k, v in fossil.items():
            w = v / ftot
            if case == "NZE" and k == "PWRCOA":
                w *= max(0.0, 1 - i / 15)
            act[k][i] = d * (1 - s) * w
        gap = d * (1 - s) - sum(act[k][i] for k in fossil)
        if gap > 0:
            act["PWRNGS"][i] += gap
        start_re = {k: v for k, v in c["start"].items() if k not in FUEL}
        rs = sum(start_re.values()) or 1
        x = i / (len(YEARS) - 1)
        for k in sorted(set(start_re) | set(c["re"])):
            w = (1 - x) * start_re.get(k, 0) / rs + x * c["re"].get(k, 0)
            act[k][i] += d * s * w * (1 + rnd.uniform(-0.01, 0.01))
        if case == "NZE":
            act["PWRBAT"][i] = act["PWRSOL"][i] * 0.15 * x
    # a small shortfall at the end of one run, to show the backstop warning
    if iso == "XAC" and case == "NZE" and rate >= 0.10:
        for i in range(len(YEARS) - 3, len(YEARS)):
            act["BACKSTOP"][i] = dem[i] * 0.01 * (i - len(YEARS) + 4)
    return act, dem


def rows_for(iso, case, variant, rate):
    act, dem = build(iso, case, rate)
    out = []
    obj = 0.0

    def row(var, args, val, dual=0.0):
        if abs(val) < 1e-9 and abs(dual) < 1e-12:
            return
        out.append("%7d %s(%s) %18.6f %18.6f" % (len(out), var, ",".join(args), val, dual))

    cap = {}
    for t, (cf, capex, fom, shape) in TECH.items():
        if t == "BACKSTOP":
            continue
        cap[t] = []
        run = 0.0
        for i, y in enumerate(YEARS):
            need = act[t][i] / (cf * CAU)
            run = max(run, need)                     # no early retirement
            cap[t].append(run)
    for i, y in enumerate(YEARS):
        ys = str(y)
        df = (1 + rate) ** -(y - YEARS[0])
        for t, (cf, capex, fom, shape) in TECH.items():
            a = act[t][i]
            if t == "BACKSTOP":
                row("TotalTechnologyAnnualActivity", [REGION, t, ys], a)
                obj += a * 1000 * df
                continue
            k = cap[t][i]
            new = k - (cap[t][i - 1] if i else 0.0) if i else 0.0
            row("TotalCapacityAnnual", [REGION, t, ys], k)
            row("NewCapacity", [REGION, t, ys], new)
            row("CapitalInvestment", [REGION, t, ys], new * capex)
            row("AnnualFixedOperatingCost", [REGION, t, ys], k * fom)
            obj += (new * capex + k * fom) * df
            if t == "PWRBAT":
                charge = a / 0.85
                row("TotalTechnologyAnnualActivity", [REGION, t, ys], a + charge)
                row("TotalAnnualTechnologyActivityByMode", [REGION, t, "1", ys], charge)
                row("TotalAnnualTechnologyActivityByMode", [REGION, t, "2", ys], a)
                for j, l in enumerate(SLICES):
                    row("RateOfActivity", [REGION, l, t, "2", ys], a * shape[j] / YEARSPLIT)
                stg = k * 4 * 3.6e-3                  # 4 h of storage, PJ
                prev = (cap[t][i - 1] * 4 * 3.6e-3) if i else 0.0
                row("AccumulatedNewStorageCapacity", [REGION, "STOBAT", ys], stg)
                row("CapitalInvestmentStorage", [REGION, "STOBAT", ys], max(0.0, stg - prev) * 50000)
                continue
            row("TotalTechnologyAnnualActivity", [REGION, t, ys], a)
            sh = shape or [YEARSPLIT] * 4
            for j, l in enumerate(SLICES):
                row("RateOfTotalActivity", [REGION, t, l, ys], a * sh[j] / YEARSPLIT)
            if t in FUEL:
                ft, eff, price, ef = FUEL[t]
                fuel = a / eff
                row("TotalTechnologyAnnualActivity", [REGION, ft, ys], fuel)
                row("AnnualVariableOperatingCost", [REGION, ft, ys], fuel * price)
                row("AnnualTechnologyEmission", [REGION, ft, "CO2", ys], fuel * ef)
                obj += fuel * price * df
        row("TotalTechnologyAnnualActivity", [REGION, "DEMELCST", ys], dem[i])
        for j, l in enumerate(SLICES):
            row("RateOfTotalActivity", [REGION, "DEMELCST", l, ys], dem[i] * DEMAND_SHAPE[j] / YEARSPLIT)
        if case == "NZE" and y >= 2040:
            row("E8_AnnualEmissionsLimit", [REGION, "CO2", ys], 0.0, -(y - 2039) * 4.0 * df)
    head = "Optimal - objective value %.6f" % obj
    note = "# SYNTHETIC PLACEHOLDER written by tools/make_placeholder_results.py. Not model output."
    return [head, note] + out


def main():
    os.makedirs(OUT, exist_ok=True)
    n = 0
    for iso in sorted(COUNTRIES):
        for case in ("REF", "NZE"):
            for variant in ("LDR", "MDR", "CDR"):
                rate = CDR[iso] if variant == "CDR" else SCEN[variant]
                lines = rows_for(iso, case, variant, rate)
                path = os.path.join(OUT, "results_%s_%s_%s.txt" % (case, variant, iso))
                with open(path, "w", encoding="utf-8", newline="\n") as fh:
                    fh.write("\n".join(lines) + "\n")
                n += 1
    print("wrote %d files to %s" % (n, os.path.relpath(OUT, ROOT)))


if __name__ == "__main__":
    main()
