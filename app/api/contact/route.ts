import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { isLocale, type Locale } from "@/lib/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContactPayload = Partial<
  Record<"name" | "company" | "email" | "phone" | "country" | "interest" | "message" | "locale" | "website" | "pagePath", unknown>
> & { startedAt?: unknown };

const REQUIRED_ENV_VARS = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "FROM_EMAIL", "TO_EMAIL"] as const;

const FIELD_LIMITS = { name: 100, company: 120, email: 254, phone: 40, country: 80, interest: 120, message: 5_000, pagePath: 300 } as const;

const SUBJECT_PREFIX: Record<Locale, string> = {
  en: "Website enquiry",
  de: "Website-Anfrage",
  fr: "Demande via le site",
  pl: "Zapytanie ze strony",
  ja: "ウェブサイトからのお問い合わせ",
};

function readText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return value.replace(/[&<>"']/g, (c) => entities[c] ?? c);
}

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/** Soft same-origin check (CSRF hygiene, not auth). */
function hasValidOrigin(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "same-origin") return true;
  if (fetchSite && fetchSite !== "none") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const requestHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
    return Boolean(requestHost && new URL(origin).host === requestHost);
  } catch {
    return false;
  }
}

const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > 20_000) return fail("Request is too large.", 413);
  if (!hasValidOrigin(request)) return fail("Invalid request origin.", 403);

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return fail("Invalid request body.", 400);
  }

  // Honeypot: acknowledge silently.
  if (readText(payload.website, 200)) return NextResponse.json({ ok: true });

  const startedAt = typeof payload.startedAt === "number" ? payload.startedAt : 0;
  const elapsed = Date.now() - startedAt;
  if (!startedAt || elapsed < 1_200 || elapsed > 86_400_000) return fail("Please wait a moment and try again.", 400);

  const name = readText(payload.name, FIELD_LIMITS.name);
  const company = readText(payload.company, FIELD_LIMITS.company);
  const email = readText(payload.email, FIELD_LIMITS.email).toLowerCase();
  const phone = readText(payload.phone, FIELD_LIMITS.phone);
  const country = readText(payload.country, FIELD_LIMITS.country);
  const interest = readText(payload.interest, FIELD_LIMITS.interest);
  const message = readText(payload.message, FIELD_LIMITS.message);
  const pagePath = readText(payload.pagePath, FIELD_LIMITS.pagePath);
  const locale: Locale = isLocale(payload.locale as string) ? (payload.locale as Locale) : "en";

  if (!name || !email || !message || !isValidEmail(email)) {
    return fail("Name, a valid email address, and a message are required.", 400);
  }

  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    console.error("Contact form configuration is incomplete:", missing);
    return fail("The contact form is temporarily unavailable.", 503);
  }
  const port = Number(process.env.SMTP_PORT);
  if (!Number.isInteger(port) || port <= 0) return fail("The contact form is temporarily unavailable.", 503);

  const fields = [
    ["Name", name], ["Company", company], ["Email", email], ["Phone", phone], ["Country", country], ["Interest", interest], ["Language", locale], ["Page", pagePath],
  ].filter(([, value]) => value);
  const textDetails = fields.map(([label, value]) => `${label}: ${value}`).join("\n");
  const htmlDetails = fields
    .map(([label, value]) => `<tr><th align="left" style="padding:6px 18px 6px 0">${label}</th><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`)
    .join("");

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE?.trim().toLowerCase() === "true" || port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    const prefix = SUBJECT_PREFIX[locale];
    const clean = (v: string) => v.replace(/[\r\n]+/g, " ");
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      replyTo: email,
      subject: `${prefix}: ${clean(name)}${interest ? ` · ${clean(interest)}` : ""}`,
      text: `${textDetails}\n\nMessage:\n${message}`,
      html: `<h2>${prefix}</h2><table role="presentation">${htmlDetails}</table><h3>Message</h3><p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>`,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact email failed:", error instanceof Error ? error.message : "Unknown SMTP error");
    return fail("The message could not be sent. Please try again later.", 502);
  }
}
