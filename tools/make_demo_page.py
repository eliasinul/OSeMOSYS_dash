# -*- coding: utf-8 -*-
"""
Write docs/index.html: OSeMOSYS_dash.html with the placeholder study inside it.

Author: EL

Run from the repository root after any change to OSeMOSYS_dash.html, config/
or results/:
    python tools/make_demo_page.py

GitHub Pages serves docs/ only, so that page cannot fetch ../results, and a page
opened from file:// cannot fetch at all. The config and results therefore travel
inside the page, as a JSON tag that loadSample() reads when the page opens.
OSeMOSYS_dash.html itself stays free of data (DECISIONS.md, D004 and D008).
Standard library only.
"""
import glob
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ANCHOR = "</head><body>"
NOTE = "Placeholder results: synthetic figures for invented countries."


def read_text(path):
    # Universal newlines: the page comes out the same whatever line endings the
    # checkout has (git may turn LF into CRLF on Windows).
    with open(path, encoding="utf-8") as f:
        return f.read()


def rel(path):
    return os.path.relpath(path, ROOT).replace(os.sep, "/")


def main():
    config = [p for p in sorted(glob.glob(os.path.join(ROOT, "config", "*.md")))
              if os.path.basename(p) != "README.md"]
    results = sorted(glob.glob(os.path.join(ROOT, "results", "*.txt")))
    if not results:
        print("No results files in results/.", file=sys.stderr)
        return 1
    # The page is published. Results without the synthetic mark on line 2
    # (DECISIONS.md, D006) may be real study data, so they are refused.
    unmarked = [rel(p) for p in results
                if "synthetic" not in (read_text(p).splitlines() + ["", ""])[1].lower()]
    if unmarked:
        print("Not marked synthetic on line 2, not embedded:\n  " + "\n  ".join(unmarked), file=sys.stderr)
        return 1

    page = read_text(os.path.join(ROOT, "OSeMOSYS_dash.html"))
    if page.count(ANCHOR) != 1:
        print(f"Expected exactly one {ANCHOR} in OSeMOSYS_dash.html.", file=sys.stderr)
        return 1

    files = [{"path": rel(p), "text": read_text(p)} for p in config + results]
    # "<" is escaped so that no file can close the tag or open a comment.
    data = json.dumps({"note": NOTE, "files": files}, ensure_ascii=False,
                      separators=(",", ":")).replace("<", "\\u003c")
    tag = f'<script id="osd-sample" type="application/json">{data}</script>'
    with open(os.path.join(ROOT, "docs", "index.html"), "w", encoding="utf-8", newline="") as f:
        f.write(page.replace(ANCHOR, ANCHOR + tag))
    print(f"Wrote docs/index.html: {len(config)} config files, {len(results)} results files.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
