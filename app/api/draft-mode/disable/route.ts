import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  (await draftMode()).disable();
  const back = new URL(request.url).searchParams.get("redirect") || "/";
  return NextResponse.redirect(new URL(back, request.url));
}
