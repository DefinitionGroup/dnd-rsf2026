import "server-only";
import type { ProductMenuDocument } from "@/blocks/types";
import { t } from "@/lib/i18n";

/**
 * The Products mega menu as a self-contained HTML snippet (inline CSS + JS) for
 * other sites, served at /lpmenu.html. The menu renders in a shadow root so the
 * host page's CSS can't reach it and its CSS can't leak out. Any element with
 * class "lpmenu-trigger" opens it under that element's <header> (or the closest
 * [data-lpmenu-anchor]). Same look and behaviour as components/layout/ProductsMenu.tsx.
 */

type SnippetLine = { name: string; href: string | null; badge: string | null; code: string; own: boolean };
type SnippetMenu = {
  label: string;
  ownBrand: string | null;
  allProducts: { label: string; href: string } | null;
  categories: { title: string; groups: { title: string; items: SnippetLine[] }[] }[];
};

/** Site paths become absolute on `origin`; only web, mail and phone links survive (no javascript: on the host page). */
function absolute(href: string | null | undefined, origin: string) {
  const value = href?.trim();
  if (!value) return null;
  if (value.startsWith("/") && !value.startsWith("//")) return origin + value;
  return /^(https?:|mailto:|tel:)/i.test(value) ? value : null;
}

/** Menu data trimmed to what the snippet renders; half-filled entries from the Studio are skipped. */
function snippetData(menu: ProductMenuDocument, origin: string): SnippetMenu {
  const categories = (menu.categories ?? [])
    .map((category) => ({
      title: category.title,
      groups: (category.groups ?? [])
        .map((group) => ({
          title: group.title,
          items: (group.items ?? [])
            .filter((item) => item.name)
            .map((item) => ({
              name: item.name,
              href: absolute(item.href, origin),
              badge: item.badge || null,
              code: item.brand?.code ?? "",
              own: item.brand?.house === true,
            })),
        }))
        .filter((group) => group.title && group.items.length),
    }))
    .filter((category) => category.title && category.groups.length);
  const ownBrand = (menu.categories ?? []).flatMap((c) => c.groups ?? []).flatMap((g) => g.items ?? []).find((i) => i.brand?.house)?.brand?.name ?? null;
  const allHref = absolute(menu.allProductsLink?.href, origin);
  return {
    label: menu.label || "Products",
    ownBrand,
    allProducts: allHref && menu.allProductsLink?.label ? { label: menu.allProductsLink.label, href: allHref } : null,
    categories,
  };
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);

const CSS = String.raw`
:host { all: initial; }
.mm {
  --lime: #92d402; --lime-deep: #99cc33; --carbon: #1d1d1f; --pebble: #2c2c2e; --hairline: #424245;
  --ash: #86868b; --mist: #a1a1a6; --fg: #f5f5f7; --white: #fff;
  --ease: cubic-bezier(.16, 1, .3, 1); --ease-io: cubic-bezier(.4, 0, .6, 1); --rise: 560ms;
  --gutter: clamp(1.25rem, 4vw, 2.75rem); --top: 44px; --z: var(--lpmenu-z, 9998);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", Inter, "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif;
  font-size: 17px; line-height: 1.47; letter-spacing: -.016em; color: var(--fg); text-align: left;
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color-scheme: dark;
}
.mm *, .mm *::before, .mm *::after { box-sizing: border-box; margin: 0; padding: 0; }
a { color: inherit; text-decoration: none; }
button { font: inherit; color: inherit; letter-spacing: inherit; background: none; border: 0; cursor: pointer; text-align: left; }
ul { list-style: none; }
:focus { outline: none; }
:focus-visible { outline: 2px solid var(--lime); outline-offset: 2px; border-radius: 4px; }
::selection { background: var(--lime); color: #000; }

/* curtain + flyout: the page dims, the menu is a layer under the host's header */
.curtain { position: fixed; inset: var(--top) 0 0; z-index: var(--z); background: rgb(0 0 0 / .55); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); opacity: 0; visibility: hidden; transition: opacity 320ms var(--ease-io), visibility 0s 320ms; }
.flyout { position: fixed; left: 0; right: 0; top: var(--top); z-index: calc(var(--z) + 1); max-height: calc(100vh - var(--top)); max-height: calc(100dvh - var(--top)); overflow-y: auto; overscroll-behavior: contain; background: rgb(22 22 23 / .86); -webkit-backdrop-filter: saturate(180%) blur(20px); backdrop-filter: saturate(180%) blur(20px); border-bottom: 1px solid rgb(255 255 255 / .08); opacity: 0; visibility: hidden; transform: translateY(-6px); transition: opacity 320ms var(--ease-io), transform 420ms var(--ease), visibility 0s 420ms; }
.open .curtain, .open .flyout { opacity: 1; visibility: visible; transform: none; transition-delay: 0s; }
.flyout-in { margin-inline: auto; width: 100%; max-width: 1200px; padding: 40px var(--gutter) 56px; }

/* staggered rise on open; a category change replays a shorter swap */
.rise { opacity: 0; transform: translateY(14px); transition: opacity var(--rise) var(--ease), transform var(--rise) var(--ease); }
.open .rise { opacity: 1; transform: none; }
.open .rise[data-i="1"] { transition-delay: 60ms; }
.open .rise[data-i="2"] { transition-delay: 120ms; }
.open .rise[data-i="3"] { transition-delay: 180ms; }
.open .rise[data-i="4"] { transition-delay: 240ms; }
.open .rise[data-i="5"] { transition-delay: 300ms; }
.open .rise[data-i="6"] { transition-delay: 360ms; }
.open .rise[data-i="7"] { transition-delay: 420ms; }
.open .rise[data-i="8"] { transition-delay: 480ms; }
.swap { animation: swap 350ms var(--ease) both; }
@keyframes swap { from { opacity: 0; transform: translateY(12px); } }

.panel { display: grid; grid-template-columns: 236px minmax(0, 1fr); column-gap: 32px; }
.panel > * { min-width: 0; }
.label { font-size: 12px; line-height: 1.33; letter-spacing: -.01em; color: var(--ash); }
.head { display: flex; align-items: center; min-height: 28px; }
/* left: categories as the big list */
.cats { display: flex; flex-direction: column; gap: 1px; margin-top: 10px; }
.cat { display: inline-flex; align-items: center; align-self: flex-start; margin-left: -12px; padding: 4px 12px; border-radius: 980px; font-size: 17px; line-height: 1.2; font-weight: 600; letter-spacing: -.022em; color: var(--ash); white-space: nowrap; transition: color 200ms var(--ease-io), background-color 200ms var(--ease-io); }
.cat:hover { color: var(--fg); }
.cat[aria-selected="true"] { background: var(--lime); color: var(--carbon); }
.cat[data-empty] { opacity: .35; pointer-events: none; }
.all { display: inline-flex; align-items: center; gap: 5px; margin-top: 22px; font-size: 14px; letter-spacing: -.016em; color: var(--lime-deep); }
.all:hover { text-decoration: underline; }
.all svg { transition: transform 200ms var(--ease); }
.all:hover svg { transform: translateX(2px); }
/* right: product lines in group columns, a hairline away from the categories */
.main { border-left: 1px solid var(--hairline); padding-left: 32px; }
.prod-head { display: flex; align-items: center; justify-content: flex-end; min-height: 28px; }
.only { display: inline-flex; align-items: center; gap: 7px; padding: 5px 12px 5px 10px; border-radius: 980px; background: var(--pebble); color: var(--ash); font-size: 12px; line-height: 1.33; letter-spacing: -.01em; white-space: nowrap; transition: color 200ms var(--ease-io), background-color 200ms var(--ease-io); }
.only:hover { color: var(--fg); }
.only[aria-pressed="true"] { background: var(--lime); color: var(--carbon); }
.only svg { width: 10px; height: 10px; opacity: 0; transition: opacity 150ms; }
.only[aria-pressed="true"] svg { opacity: 1; }
.only .n { opacity: .6; }
.only:disabled { opacity: .35; pointer-events: none; }
.groups { display: grid; grid-template-columns: var(--track, repeat(auto-fill, minmax(204px, 1fr))); column-gap: 32px; row-gap: 28px; align-items: start; margin-top: 22px; }
.group { min-width: 0; }
.group-title { margin-bottom: 8px; border-bottom: 1px solid var(--hairline); padding-bottom: 8px; font-size: 12px; font-weight: 400; line-height: 1.33; letter-spacing: -.01em; color: var(--ash); }
.item { display: flex; align-items: baseline; gap: 10px; padding-block: 3px; }
.code { flex: none; width: 52px; font-size: 12px; line-height: 1.33; letter-spacing: -.01em; color: var(--ash); transition: color 200ms var(--ease-io); }
.name { flex: 1; min-width: 0; font-size: 14px; line-height: 1.36; letter-spacing: -.016em; color: var(--ash); transition: color 200ms var(--ease-io); }
.item[data-own] .code { color: var(--lime-deep); }
.item[data-own] .name { color: var(--fg); }
a.item:hover .name { color: var(--white); }
a.item:hover .code { color: var(--mist); }
a.item[data-own]:hover .code { color: var(--lime-deep); }
.groups[data-own] .code { display: none; }
.chip { flex: none; align-self: center; border-radius: 980px; padding: 2px 8px; background: var(--pebble); color: var(--mist); font-size: 11px; line-height: 1.3; letter-spacing: -.01em; }

/* narrow screens: categories scroll sideways, one column of lines */
@media (max-width: 1023px) {
  .flyout-in { padding-top: 24px; padding-bottom: 40px; }
  .panel { grid-template-columns: minmax(0, 1fr); row-gap: 28px; }
  .cats { flex-direction: row; gap: 4px; margin: 12px calc(var(--gutter) * -1) 0; padding-inline: var(--gutter); overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding-inline: var(--gutter); scrollbar-width: none; }
  .cats::-webkit-scrollbar { display: none; }
  .cat { flex: 0 0 auto; margin-left: 0; padding: 8px 14px; font-size: 15px; scroll-snap-align: start; }
  .all { margin-top: 14px; }
  .main { border-left: 0; padding-left: 0; }
  .groups { grid-template-columns: minmax(0, 1fr); row-gap: 22px; }
  .item { padding-block: 7px; }
}
@media (prefers-reduced-motion: reduce) {
  .curtain, .flyout, .rise { transition: none !important; }
  .swap { animation: none; }
}
`;

/* Plain ES2017 for the host page, called with the menu data. No backticks or template placeholders in here (String.raw). */
const SCRIPT = String.raw`
(function (MENU) {
  "use strict";
  var host = document.getElementById("lpmenu");
  var tpl = document.getElementById("lpmenu-template");
  if (window.__lpmenu || !host || !tpl || !host.attachShadow || !MENU.categories.length) return;
  window.__lpmenu = true;
  var TRIGGER = ".lpmenu-trigger";
  var root = host.attachShadow({ mode: "open" });
  root.appendChild(tpl.content.cloneNode(true));
  var mm = root.querySelector(".mm");
  var flyout = root.querySelector(".flyout");
  var catsEl = root.querySelector(".cats");
  var groupsEl = root.querySelector(".groups");
  var onlyBtn = root.querySelector(".only");
  var state = { open: false, cat: 0, own: false, trigger: null };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function groupsOf(cat, own) {
    return cat.groups
      .map(function (g) { return { title: g.title, items: g.items.filter(function (i) { return !own || i.own; }) }; })
      .filter(function (g) { return g.items.length; });
  }
  function count(cat, own) { return groupsOf(cat, own).reduce(function (n, g) { return n + g.items.length; }, 0); }
  function live(own) { var out = []; MENU.categories.forEach(function (c, i) { if (count(c, own)) out.push(i); }); return out; }
  function current() { var l = live(state.own); return l.indexOf(state.cat) !== -1 ? state.cat : l.length ? l[0] : -1; }

  catsEl.innerHTML = MENU.categories.map(function (c, i) {
    return '<button type="button" role="tab" class="cat" id="lpm-tab-' + i + '" aria-controls="lpm-lines" data-i="' + i + '">' + esc(c.title) + "</button>";
  }).join("");
  var tabs = [].slice.call(catsEl.children);

  function syncCats() {
    var cur = current();
    tabs.forEach(function (b, i) {
      var empty = !count(MENU.categories[i], state.own);
      b.setAttribute("aria-selected", String(i === cur));
      b.tabIndex = i === cur ? 0 : -1;
      b.toggleAttribute("data-empty", empty);
      if (empty) b.setAttribute("aria-disabled", "true"); else b.removeAttribute("aria-disabled");
    });
  }

  function line(i) {
    var body = '<span class="code">' + esc(i.code) + '</span><span class="name">' + esc(i.name) + "</span>" + (i.badge ? '<span class="chip">' + esc(i.badge) + "</span>" : "");
    var own = i.own ? " data-own" : "";
    return "<li>" + (i.href ? '<a class="item"' + own + ' href="' + esc(i.href) + '">' + body + "</a>" : '<span class="item"' + own + ">" + body + "</span>") + "</li>";
  }

  /* swap = a category or filter change while open; otherwise the columns take part in the open rise */
  function renderGroups(swap) {
    var cur = current();
    if (cur === -1) { groupsEl.innerHTML = ""; return; }
    var gs = groupsOf(MENU.categories[cur], state.own);
    groupsEl.setAttribute("aria-labelledby", "lpm-tab-" + cur);
    groupsEl.toggleAttribute("data-own", state.own);
    groupsEl.style.setProperty("--track", gs.length >= 4 ? "repeat(auto-fill, minmax(204px, 1fr))" : "repeat(" + gs.length + ", minmax(204px, 312px))");
    groupsEl.innerHTML = gs.map(function (g, gi) {
      var anim = swap ? 'class="group swap" style="animation-delay:' + gi * 40 + 'ms"' : 'class="group rise" data-i="' + Math.min(gi + 2, 8) + '"';
      return "<div " + anim + '><h3 class="group-title">' + esc(g.title) + "</h3><ul>" + g.items.map(line).join("") + "</ul></div>";
    }).join("");
    if (onlyBtn) {
      var here = count(MENU.categories[cur], true);
      onlyBtn.setAttribute("aria-pressed", String(state.own));
      onlyBtn.disabled = !here && !state.own;
      onlyBtn.querySelector(".n").textContent = here;
    }
  }

  function select(i) {
    if (i === current()) return;
    state.cat = i;
    syncCats();
    renderGroups(true);
  }

  function anchorOf(t) { return t.closest("[data-lpmenu-anchor]") || t.closest("header") || t.closest("nav") || t; }
  function place() { mm.style.setProperty("--top", Math.max(0, Math.round(anchorOf(state.trigger).getBoundingClientRect().bottom)) + "px"); }
  function setExpanded() {
    document.querySelectorAll(TRIGGER).forEach(function (t) { t.setAttribute("aria-expanded", String(state.open && t === state.trigger)); });
  }

  function open(trigger, keyboard) {
    state.open = true;
    state.trigger = trigger;
    place();
    syncCats();
    renderGroups(false);
    flyout.inert = false;
    void flyout.offsetHeight; /* settle the hidden state so the rise transitions run */
    mm.classList.add("open");
    setExpanded();
    if (keyboard) requestAnimationFrame(function () { var t = catsEl.querySelector('[aria-selected="true"]'); if (t) t.focus(); });
  }

  function close(refocus) {
    if (!state.open) return;
    state.open = false;
    mm.classList.remove("open");
    flyout.inert = true;
    setExpanded();
    if (refocus && state.trigger) state.trigger.focus();
  }

  catsEl.addEventListener("click", function (e) {
    var b = e.target.closest("[data-i]");
    if (b && !b.hasAttribute("data-empty")) select(Number(b.getAttribute("data-i")));
  });
  catsEl.addEventListener("keydown", function (e) {
    var l = live(state.own), at = l.indexOf(current()), next;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = l[at + 1];
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = l[at - 1];
    else if (e.key === "Home") next = l[0];
    else if (e.key === "End") next = l[l.length - 1];
    else return;
    e.preventDefault();
    if (next === undefined) return;
    select(next);
    tabs[next].focus();
  });
  if (onlyBtn) onlyBtn.addEventListener("click", function () {
    state.own = !state.own;
    state.cat = current();
    syncCats();
    renderGroups(true);
  });
  root.addEventListener("click", function (e) { if (e.target.closest("a")) close(false); });

  document.addEventListener("click", function (e) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var t = e.target.closest ? e.target.closest(TRIGGER) : null;
    if (!t) return;
    e.preventDefault();
    if (state.open && state.trigger === t) close(false); else open(t, e.detail === 0);
  });
  /* a press anywhere outside the flyout (the curtain included) closes it */
  document.addEventListener("pointerdown", function (e) {
    if (!state.open) return;
    var path = e.composedPath();
    if (path.indexOf(flyout) !== -1) return;
    for (var k = 0; k < path.length; k++) if (path[k].matches && path[k].matches(TRIGGER)) return;
    close(false);
  });
  document.addEventListener("keydown", function (e) { if (state.open && e.key === "Escape") close(true); });
  root.addEventListener("focusout", function (e) {
    var to = e.relatedTarget;
    if (state.open && to && !root.contains(to) && !(to.closest && to.closest(TRIGGER))) close(false);
  });
  var frame = 0;
  function follow() { if (state.open && !frame) frame = requestAnimationFrame(function () { frame = 0; place(); }); }
  window.addEventListener("resize", follow);
  window.addEventListener("scroll", follow, { passive: true });

  syncCats();
  renderGroups(false);
  setExpanded();
})`;

const CHEVRON = '<svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 2l4 4-4 4"/></svg>';
const TICK = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 6.3l2.6 2.6L10 3.5"/></svg>';

export function renderLpMenu(menu: ProductMenuDocument, { origin, generatedAt = new Date() }: { origin: string; generatedAt?: Date }) {
  const data = snippetData(menu, origin);
  const stamp = generatedAt.toISOString();
  const categoriesLabel = t("en", "categories");
  // JSON inside <script>: escape "<" so no value can close the tag
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  const loader = `<script>fetch("${origin}/lpmenu.html").then(function (r) { return r.text(); }).then(function (html) { document.body.appendChild(document.createRange().createContextualFragment(html)); });</script>`;

  return `<!--
  D-D Products menu, generated ${stamp} from the Sanity "Products menu" (${origin}/lpmenu.html).
  1. Include this snippet once, just before </body>. To always show the latest menu, load it live instead:
     ${loader}
  2. Give the nav link or button that should open it the class "lpmenu-trigger".
     The menu drops down under that trigger's <header>; mark another element with data-lpmenu-anchor to drop under that instead.
-->
<div id="lpmenu" data-generated="${stamp}"></div>
<template id="lpmenu-template">
<style>${CSS}</style>
<div class="mm">
  <div class="curtain"></div>
  <div class="flyout" role="region" aria-label="${esc(data.label)}" inert>
    <div class="flyout-in">
      <div class="panel">
        <div class="rise" data-i="0">
          <p class="label head">${esc(categoriesLabel)}</p>
          <div class="cats" role="tablist" aria-orientation="vertical" aria-label="${esc(categoriesLabel)}"></div>
          ${data.allProducts ? `<a class="all" href="${esc(data.allProducts.href)}">${esc(data.allProducts.label)}${CHEVRON}</a>` : ""}
        </div>
        <div class="main">
          <div class="prod-head rise" data-i="1">
            ${data.ownBrand ? `<button type="button" class="only" aria-pressed="false">${TICK}${esc(t("en", "brandOnly").replace("{brand}", data.ownBrand))} <span class="n"></span></button>` : ""}
          </div>
          <div class="groups" id="lpm-lines" role="tabpanel"></div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
${SCRIPT.trim()}(${json});
</script>
`;
}

/** A stand-in host page around the snippet, for trying it out: /lpmenu.html?preview */
export function renderLpMenuPreview(snippet: string) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Products menu snippet: preview</title>
<style>
  body { margin: 0; font: 15px/1.5 Georgia, serif; color: #222; background: #f4f1ea; }
  header { position: sticky; top: 0; display: flex; align-items: center; gap: 28px; height: 64px; padding: 0 32px; background: #fff; border-bottom: 1px solid #ddd; }
  header strong { margin-right: auto; font: 700 18px/1 Arial, sans-serif; }
  header a { color: #1a5a96; text-decoration: underline; }
  header a[aria-expanded="true"] { font-weight: 700; }
  main { max-width: 720px; margin: 64px auto; padding: 0 32px; }
  main p { margin: 0 0 1em; }
</style>
</head>
<body>
<header>
  <strong>Host site</strong>
  <a href="#products" class="lpmenu-trigger">Products</a>
  <a href="#">Support</a>
  <a href="#">Dealers</a>
</header>
<main>
  <h1>Snippet preview</h1>
  <p>This page stands in for the site that embeds the menu. Its own styles (serif type, underlined blue links) don't touch the menu, and the menu's styles don't touch it.</p>
  <p>"Products" carries the class <code>lpmenu-trigger</code>. Click it, or tab to it and press Enter.</p>
  ${"<p>Scroll filler.</p>".repeat(30)}
</main>
${snippet}
</body>
</html>
`;
}
