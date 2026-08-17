import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Optional manual revalidation hook (SanityLive handles content updates automatically). */
export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  revalidateTag("sanity", "max");
  return NextResponse.json({ ok: true, revalidated: ["sanity"] });
}
