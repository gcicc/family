# Family Shelf — the family-sites kit

Greg's sites made for family link to each other through a bar at the foot of each page
("More from the family"). It is **separate from TELEMETRx** by decision (Greg, 2026-11-18):
family sites do not carry the TELEMETRx masthead.

```
family.json          the registry: id, name, url, purpose, live, gated (+ optional note)
src/family-nav.js    renders the bar in a shadow root; registry inlined at build
build.py             validate family.json, write docs/   (python build.py | --check)
docs/                what the gcicc/family Pages repo serves (generated, do not edit)
```

## Sites

| id | Carries the bar | Linked to | Note |
|---|---|---|---|
| foxy-females | yes | yes | `02-Maintain/foxy-females/docs/index.html` |
| trump-corpus | yes | yes | `02-Maintain/trump/site/_quarto.yml`, `include-in-header` |
| bristol | **no** | yes, marked "(sign-in)" | Fullscreen 3D world; a bar would interfere. Behind Cloudflare Access. |
| dads80th | not yet | no (`live: false`) | Offline (repo private, Pages off). Greg will revisit and upgrade it. |

## Add a site

1. Add an entry to `family.json` (`live: false` until its URL serves 200).
2. `python build.py`, then publish `docs/` to `gcicc/family`.
3. In the site's generator (never in generated output), before `</head>`:
   ```html
   <script src="https://gcicc.github.io/family/family-nav.js" data-site="<id>" defer></script>
   ```
4. Flip `live: true`, rebuild, publish. Every other site shows the new link on its next page
   load; none is rebuilt.

## What keeps this current

- `family.json` is the single list. A site going offline: set `live: false`, rebuild, publish.
- **dads80th:** when it is upgraded and public again, add the script tag (Quarto book:
  `include-in-header` in `_quarto.yml`), flip `live: true`, rebuild, publish.
- **bristol:** the link is shown now, but family get in only once their emails are on the
  Cloudflare Access "Family" policy (parked item in `02-Areas/bristol/bristol-model/next-steps.md`).

## More from the author (`docs/more/`)

The one stable address for everything Greg makes for the family:
https://gcicc.github.io/family/more/. Printed cards and booklets carry a QR to this page
rather than to individual links, so a link that moves is fixed in `family.json`, never by
reprinting. Built from the `author` block in `family.json`: each item has `name`, `kind`,
`url`, `blurb` and `section` (`new` for this season, `also` for the rest). An item with an
empty `url` is held back until its link exists. Each season, re-sort the `section` values.
Never change the slug: it is printed on paper.
