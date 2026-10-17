import { confirmationEmail, signupNotification, type Registration } from "@/components/sites/deep-trading/emails";
import { site } from "@/components/sites/deep-trading/site";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Lead = Registration & { page: string; utm_source: string; utm_medium: string; utm_campaign: string };

function parse(body: unknown): Lead | string {
  if (!body || typeof body !== "object") return "Invalid request.";
  const { name, email, phone, company, page } = body as Record<string, unknown>;
  // Hidden honeypot field: real visitors never fill it in.
  if (typeof company === "string" && company.trim() !== "") return "Invalid request.";
  const clean = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const registration = { name: clean(name), email: clean(email).toLowerCase(), phone: clean(phone) };
  if (registration.name.length < 2 || registration.name.length > 80) return "Please enter your full name.";
  if (!EMAIL_PATTERN.test(registration.email) || registration.email.length > 254) return "Please enter a valid email address.";
  const digits = registration.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return "Please enter a valid WhatsApp number.";
  return { ...registration, ...pageDetails(clean(page)) };
}

// The page the visitor registered from, plus any ad-campaign tags (utm_*) in its URL.
function pageDetails(page: string) {
  try {
    const url = new URL(page);
    const utm = (key: string) => (url.searchParams.get(key) ?? "").slice(0, 100);
    return {
      page: page.slice(0, 500),
      utm_source: utm("utm_source"),
      utm_medium: utm("utm_medium"),
      utm_campaign: utm("utm_campaign"),
    };
  } catch {
    return { page: "", utm_source: "", utm_medium: "", utm_campaign: "" };
  }
}

// Sends the lead to the Google Apps Script (see google-apps-script/SETUP.md), which adds it
// to the Google Sheet and sends both emails from Gmail.
async function saveLead(webhookUrl: string, secret: string, lead: Lead) {
  const { name, email, phone } = lead;
  const registration = { name, email, phone };
  const notifyTo = process.env.REGISTRATION_NOTIFY_EMAIL || site.email;

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...lead,
        secret,
        emails: [
          { to: email, replyTo: site.email, ...confirmationEmail(registration) },
          { to: notifyTo, replyTo: email, ...signupNotification(registration), isOwnerAlert: true },
        ],
      }),
      signal: AbortSignal.timeout(20_000),
      cache: "no-store",
    });
    const result = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; emailErrors?: string[] } | null;
    if (!res.ok || !result?.ok) {
      console.error("[register] Google Sheet save failed", res.status, result?.error ?? "non-JSON response");
      return false;
    }
    if (result.emailErrors?.length) console.error("[register] saved, but Gmail could not send:", result.emailErrors);
    return true;
  } catch (err) {
    console.error("[register] Google Sheet save failed", err);
    return false;
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const lead = parse(body);
  if (typeof lead === "string") {
    return Response.json({ error: lead }, { status: 400 });
  }

  const webhookUrl = process.env.LEADS_WEBHOOK_URL;
  const secret = process.env.LEADS_SECRET;
  if (!webhookUrl || !secret) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[register] LEADS_WEBHOOK_URL / LEADS_SECRET not set; lead not saved:", lead.email);
      return Response.json({ ok: true });
    }
    console.error("[register] LEADS_WEBHOOK_URL and LEADS_SECRET must be set (see google-apps-script/SETUP.md)");
    return Response.json({ error: "Registration is temporarily unavailable. Please message us on WhatsApp." }, { status: 500 });
  }

  if (!(await saveLead(webhookUrl, secret, lead))) {
    return Response.json({ error: "We couldn't complete your registration. Please try again or message us on WhatsApp." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
