# -*- coding: utf-8 -*-
"""
List the technology codes in OSeMOSYS results files and flag the ones that
config/technologies.md does not map.

Author: EL

Run from the repository root:
    python tools/list_codes.py                       # every .txt under results/
    python tools/list_codes.py path/to/results.txt   # one file or folder

A code the dashboard does not know is silently left out of every chart, so
run this whenever a new technology enters the model. Standard library only.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROW = re.compile(r"^\s*\d+\s+([A-Za-z0-9_]+)\(([^)]*)\)\s+(\S+)\s+(\S+)\s*$")
# variables whose second argument is a technology, as the dashboard reads them
TECH_VARS = {"TotalCapacityAnnual", "TotalTechnologyAnnualActivity", "NewCapacity",
             "CapitalInvestment", "AnnualFixedOperatingCost", "AnnualVariableOperatingCost",
             "AnnualTechnologyEmission", "AccumulatedNewStorageCapacity",
             "CapitalInvestmentStorage", "RateOfTotalActivity",
             "TotalAnnualTechnologyActivityByMode"}


def md_tables(path):
    """{heading: [row dict]} for every pipe table in a markdown file.

    Mirrors mdTables() in OSeMOSYS_dash.html; the dashboard is the reference.
    """
    out, head, lines = {}, "", open(path, encoding="utf-8").read().splitlines()
    cells = lambda l: [c.strip().strip("`").strip() for c in l.strip().strip("|").split("|")]
    i = 0
    while i < len(lines):
        h = re.match(r"^\s{0,3}#{1,6}\s+(.*?)\s*#*\s*$", lines[i])
        if h:
            head = h.group(1).strip()
        elif lines[i].lstrip().startswith("|") and i + 1 < len(lines) \
                and re.match(r"^\s*\|?\s*:?-{3,}", lines[i + 1]):
            cols = [re.sub(r"[^a-z0-9]+", "_", c.lower()).strip("_") for c in cells(lines[i])]
            rows, i = [], i + 2
            while i < len(lines) and lines[i].lstrip().startswith("|"):
                v = cells(lines[i])
                rows.append({c: (v[j] if j < len(v) else "") for j, c in enumerate(cols)})
                i += 1
            out[head.lower()] = rows
            continue
        i += 1
    return out


def known_codes():
    t = md_tables(os.path.join(ROOT, "config", "technologies.md"))
    known = {}
    for r in t.get("technologies", []):
        known[r.get("tech", "").upper()] = "plant -> " + r.get("family", "")
    for r in t.get("storage", []):
        known[r.get("storage", "").upper()] = "storage -> " + r.get("family", "")
    for r in t.get("fuels", []):
        known[r.get("tech", "").upper()] = "fuel -> " + r.get("fuel", "")
    for r in t.get("special technologies", []):
        known[r.get("tech", "").upper()] = r.get("role", "")
    return known


def files(arg):
    if os.path.isfile(arg):
        return [arg]
    out = []
    for d, _, fs in os.walk(arg):
        out += [os.path.join(d, f) for f in fs if f.lower().endswith(".txt")]
    return sorted(out)


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "results")
    seen = {}
    for f in files(target):
        for line in open(f, encoding="utf-8", errors="replace"):
            m = ROW.match(line)
            if not m or m.group(1) not in TECH_VARS:
                continue
            args = m.group(2).split(",")
            if len(args) > 1:
                seen.setdefault(args[1].upper(), set()).add(m.group(1))
    known = known_codes()
    missing = 0
    for code in sorted(seen):
        k = known.get(code)
        if not k:
            missing += 1
        print("%-12s %-28s %s" % (code, k or "NOT IN technologies.md", ", ".join(sorted(seen[code]))[:80]))
    print("\n%d codes, %d not mapped" % (len(seen), missing))
    sys.exit(1 if missing else 0)


if __name__ == "__main__":
    main()
