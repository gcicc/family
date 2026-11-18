"""Build the Family Shelf kit from family.json into docs/.

    python build.py            # validate family.json, write docs/
    python build.py --check    # validate only

docs/ is what the gcicc/family Pages repo serves: family-nav.js (registry inlined)
and index.html (a plain list of the sites).
"""

from __future__ import annotations

import argparse
import html
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REGISTRY = ROOT / "family.json"
SRC = ROOT / "src" / "family-nav.js"
DIST = ROOT / "docs"
SITE_KEYS = {"id", "name", "url", "purpose", "live", "gated"}


def validate(reg: dict) -> list[str]:
    errors = [
        f"missing top-level key: {k}"
        for k in ("network", "home", "sites")
        if k not in reg
    ]
    if errors:
        return errors
    seen: set[str] = set()
    for i, s in enumerate(reg["sites"]):
        label = s.get("id", f"sites[{i}]")
        missing = SITE_KEYS - s.keys()
        if missing:
            errors.append(f"{label}: missing {sorted(missing)}")
            continue
        if s["id"] in seen:
            errors.append(f"{label}: duplicate id")
        seen.add(s["id"])
        if not s["url"].startswith("https://"):
            errors.append(f"{label}: url must be https")
        for flag in ("live", "gated"):
            if not isinstance(s[flag], bool):
                errors.append(f"{label}: {flag} must be true or false")
    return errors


def build(reg: dict) -> None:
    DIST.mkdir(exist_ok=True)
    public = {
        "network": reg["network"],
        "sites": [
            {k: s[k] for k in ("id", "name", "url", "purpose", "live", "gated")}
            for s in reg["sites"]
        ],
    }
    js = SRC.read_text(encoding="utf-8").replace(
        "__REGISTRY__", json.dumps(public, ensure_ascii=False)
    )
    (DIST / "family-nav.js").write_text(js, encoding="utf-8")

    items = "\n".join(
        f'<li><a href="{html.escape(s["url"])}">{html.escape(s["name"])}</a> '
        f"<span>{html.escape(s['purpose'])}{' (family sign-in)' if s['gated'] else ''}</span></li>"
        for s in reg["sites"]
        if s["live"]
    )
    (DIST / "index.html").write_text(
        f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(reg["network"])}</title>
<style>
body{{margin:0;padding:32px 16px;background:#1d1a16;color:#efe6d6;font:16px/1.6 system-ui,sans-serif}}
main{{max-width:640px;margin:0 auto}} h1{{color:#c9a24a;font-weight:600}}
a{{color:#efe6d6}} li{{margin:10px 0}} span{{display:block;font-size:14px;color:#b8ad99}}
</style></head>
<body><main><h1>{html.escape(reg["network"])}</h1><ul>
{items}
</ul></main></body></html>
""",
        encoding="utf-8",
    )


def main() -> int:
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    ap.add_argument("--check", action="store_true", help="validate only")
    args = ap.parse_args()
    reg = json.loads(REGISTRY.read_text(encoding="utf-8"))
    errors = validate(reg)
    if errors:
        print("family.json is invalid:\n  " + "\n  ".join(errors), file=sys.stderr)
        return 1
    if not args.check:
        build(reg)
        live = sum(s["live"] for s in reg["sites"])
        print(f"wrote docs/ - {len(reg['sites'])} sites ({live} live)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
