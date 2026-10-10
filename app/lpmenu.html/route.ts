import { renderLpMenu, renderLpMenuPreview } from "@/lib/lpmenu";
import { loadProductMenu } from "@/sanity/lib/loaders";

/**
 * /lpmenu.html: the Products menu as an embeddable snippet for other sites
 * (lib/lpmenu.ts), built from the published Sanity menu on request. The CDN
 * keeps a copy for a minute, so a published change shows up within about a
 * minute, no deploy needed. `?preview` wraps it in a stand-in host page.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const menu = await loadProductMenu("en");
  const snippet = menu ? renderLpMenu(menu, { origin: url.origin }) : "<!-- D-D Products menu: no Products menu published in Sanity yet -->\n";
  const body = url.searchParams.has("preview") ? renderLpMenuPreview(snippet) : snippet;

  return new Response(body, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "access-control-allow-origin": "*",
      "cache-control": "public, max-age=0, s-maxage=60",
      "x-robots-tag": "noindex",
    },
  });
}
