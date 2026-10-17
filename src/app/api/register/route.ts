import { Resend } from "resend";
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

async function sendEmails(apiKey: string, registration: Registration, notifyTo: string) {
  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM ?? `${site.name} <onboarding@resend.dev>`;

  const [attendee, owner] = await Promise.allSettled([
    resend.emails.send({ from, to: registration.email, replyTo: site.email, ...confirmationEmail(registration) }),
    resend.emails.send({ from, to: notifyTo, replyTo: registration.email, ...signupNotification(registration) }),
  ]);

  const failed = (r: typeof attendee) => r.status === "rejected" || Boolean(r.value.error);
  if (failed(attendee)) console.error("[register] confirmation email failed", attendee.status === "rejected" ? attendee.reason : attendee.value.error);
  if (failed(owner)) console.error("[register] signup notification failed", owner.status === "rejected" ? owner.reason : owner.value.error);
  return { attendeeEmailed: !failed(attendee), ownerNotified: !failed(owner) };
}

// Adds the lead as a row in the Google Sheet (see google-apps-script/SETUP.md).
// Any email Resend couldn't send is sent by the script from Gmail instead.
async function saveToSheet(
  webhookUrl: string,
  secret: string,
  lead: Lead,
  backup: { notifyTo: string; notifyOwner: boolean; sendConfirmation: boolean },
) {
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, ...backup, secret }),
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });
    const result = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!res.ok || !result?.ok) {
      console.error("[register] Google Sheet save failed", res.status, result?.error ?? "non-JSON response");
      return false;
    }
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

  const apiKey = process.env.RESEND_API_KEY;
  const webhookUrl = process.env.LEADS_WEBHOOK_URL;
  const secret = process.env.LEADS_SECRET;
  const sheetReady = Boolean(webhookUrl && secret);
  const notifyTo = process.env.REGISTRATION_NOTIFY_EMAIL ?? site.email;

  if (!apiKey && !sheetReady) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[register] Neither RESEND_API_KEY nor LEADS_WEBHOOK_URL/LEADS_SECRET is set; lead not saved:", lead.email);
      return Response.json({ ok: true, emailed: false });
    }
    console.error("[register] No lead destination configured: set LEADS_WEBHOOK_URL + LEADS_SECRET and/or RESEND_API_KEY");
    return Response.json({ error: "Registration is temporarily unavailable." }, { status: 500 });
  }

  const { name, email, phone } = lead;
  const emails = apiKey
    ? await sendEmails(apiKey, { name, email, phone }, notifyTo)
    : { attendeeEmailed: false, ownerNotified: false };

  const savedToSheet = webhookUrl && secret
    ? await saveToSheet(webhookUrl, secret, lead, {
        notifyTo,
        notifyOwner: !emails.ownerNotified,
        sendConfirmation: !emails.attendeeEmailed,
      })
    : false;

  // Accept the registration if the lead landed anywhere, so it is never lost silently.
  if (!savedToSheet && !emails.attendeeEmailed && !emails.ownerNotified) {
    return Response.json({ error: "We couldn't complete your registration. Please try again or message us on WhatsApp." }, { status: 502 });
  }
  return Response.json({ ok: true, emailed: emails.attendeeEmailed || savedToSheet });
}
