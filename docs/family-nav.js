/* Family Shelf: a bar at the foot of each family site linking to the others.
 * Built by ../build.py, which replaces {"network": "Family Shelf", "sites": [{"id": "dads80th", "name": "This Is Your Life, Vic", "url": "https://gcicc.github.io/dads80th/", "purpose": "Dad's 80th birthday biography", "live": false, "gated": false}, {"id": "foxy-females", "name": "Uncle Frankie's FOXy Females", "url": "https://gcicc.github.io/foxy-females/", "purpose": "Trading-card fan site for Uncle Frankie", "live": true, "gated": false}, {"id": "trump-corpus", "name": "Trump: In His Own Words", "url": "https://gcicc.github.io/trump-corpus/", "purpose": "Archive of public messaging, for family reading", "live": true, "gated": false}, {"id": "bristol", "name": "Bristol", "url": "https://bristol-family.pages.dev/", "purpose": "3D model of Bristol, PA", "live": true, "gated": true}]} with family.json.
 * Usage: <script src="https://gcicc.github.io/family/family-nav.js" data-site="<id>" defer></script>
 * Rendered in a shadow root so it never touches the host page's styles. */
(function () {
  "use strict";
  var REG = {"network": "Family Shelf", "sites": [{"id": "dads80th", "name": "This Is Your Life, Vic", "url": "https://gcicc.github.io/dads80th/", "purpose": "Dad's 80th birthday biography", "live": false, "gated": false}, {"id": "foxy-females", "name": "Uncle Frankie's FOXy Females", "url": "https://gcicc.github.io/foxy-females/", "purpose": "Trading-card fan site for Uncle Frankie", "live": true, "gated": false}, {"id": "trump-corpus", "name": "Trump: In His Own Words", "url": "https://gcicc.github.io/trump-corpus/", "purpose": "Archive of public messaging, for family reading", "live": true, "gated": false}, {"id": "bristol", "name": "Bristol", "url": "https://bristol-family.pages.dev/", "purpose": "3D model of Bristol, PA", "live": true, "gated": true}]};
  var me = document.currentScript && document.currentScript.dataset.site;

  function render() {
    if (document.getElementById("family-shelf")) return;
    var others = REG.sites.filter(function (s) { return s.live && s.id !== me; });
    if (!others.length) return;

    var host = document.createElement("div");
    host.id = "family-shelf";
    var root = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;

    var css =
      ":host{all:initial;display:block}" +
      "nav{box-sizing:border-box;width:100%;padding:14px 16px;background:#1d1a16;color:#efe6d6;" +
      "font:14px/1.5 system-ui,-apple-system,'Segoe UI',sans-serif;text-align:center;border-top:3px solid #c9a24a}" +
      ".lbl{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#c9a24a;margin-bottom:6px}" +
      "ul{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;justify-content:center;gap:6px 18px}" +
      "a{color:#efe6d6;text-decoration:none;border-bottom:1px solid rgba(239,230,214,.35)}" +
      "a:hover,a:focus-visible{color:#fff;border-bottom-color:#c9a24a;outline:none}" +
      ".lock{font-size:11px;color:#b8ad99;margin-left:4px}";

    var html = '<style>' + css + '</style><nav aria-label="' + esc(REG.network) + '">' +
      '<span class="lbl">More from the family</span><ul>';
    others.forEach(function (s) {
      html += '<li><a href="' + esc(s.url) + '" title="' + esc(s.purpose) + '">' + esc(s.name) + '</a>' +
        (s.gated ? '<span class="lock" title="Family sign-in required">(sign-in)</span>' : '') + '</li>';
    });
    root.innerHTML = html + '</ul></nav>';
    document.body.appendChild(host);
  }

  function esc(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();
