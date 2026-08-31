/**
 * YouTube / Vimeo URL → privacy-friendly embed URL. Framework-free and free of
 * any "use client" boundary so both server and client blocks can call it.
 */
export type Embed = { provider: "youtube" | "vimeo"; src: string };

/** Parse YouTube / Vimeo watch, share and short URLs into a privacy-friendly embed URL. */
export function parseEmbed(raw: string | undefined | null): Embed | null {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\.|^m\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id ? youtube(id, url) : null;
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com" || host === "music.youtube.com") {
    const v = url.searchParams.get("v");
    if (v) return youtube(v, url);
    const m = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{6,})/);
    return m ? youtube(m[1], url) : null;
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    // vimeo.com/123456, vimeo.com/123456/hash, vimeo.com/channels/x/123456, player.vimeo.com/video/123456
    const m = url.pathname.match(/\/(\d{6,})(?:\/([\da-f]+))?/i);
    if (!m) return null;
    const params = new URLSearchParams({ autoplay: "1", dnt: "1" });
    if (m[2]) params.set("h", m[2]);
    return { provider: "vimeo", src: `https://player.vimeo.com/video/${m[1]}?${params}` };
  }
  return null;
}

function youtube(id: string, url: URL): Embed {
  const params = new URLSearchParams({ autoplay: "1", rel: "0" });
  const t = url.searchParams.get("t") ?? url.searchParams.get("start");
  if (t) params.set("start", String(parseInt(t, 10) || 0));
  return { provider: "youtube", src: `https://www.youtube-nocookie.com/embed/${id}?${params}` };
}
