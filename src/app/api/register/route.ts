import { Resend } from "resend";
import { confirmationEmail, signupNotification, type Registration } from "@/components/sites/deep-trading/emails";
import { site } from "@/components/sites/deep-trading/site";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function parse(body: unknown): Registration | string {
  if (!body || typeof body !== "object") return "Invalid request.";
  const { name, email, phone, company } = body as Record<string, unknown>;
  // Hidden honeypot field: real visitors never fill it in.
  if (typeof company === "string" && company.trim() !== "") return "Invalid request.";
  const clean = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const registration = { name: clean(name), email: clean(email).toLowerCase(), phone: clean(phone) };
  if (registration.name.length < 2 || registration.name.length > 80) return "Please enter your full name.";
  if (!EMAIL_PATTERN.test(registration.email) || registration.email.length > 254) return "Please enter a valid email address.";
  const digits = registration.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return "Please enter a valid WhatsApp number.";
  return registration;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const registration = parse(body);
  if (typeof registration === "string") {
    return Response.json({ error: registration }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[register] RESEND_API_KEY is not set; skipping emails for", registration.email);
      return Response.json({ ok: true, emailed: false });
    }
    console.error("[register] RESEND_API_KEY is not set");
    return Response.json({ error: "Registration is temporarily unavailable." }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM ?? `${site.name} <onboarding@resend.dev>`;
  const notifyTo = process.env.REGISTRATION_NOTIFY_EMAIL ?? site.email;

  const [attendee, owner] = await Promise.allSettled([
    resend.emails.send({ from, to: registration.email, replyTo: site.email, ...confirmationEmail(registration) }),
    resend.emails.send({ from, to: notifyTo, replyTo: registration.email, ...signupNotification(registration) }),
  ]);

  const failed = (r: typeof attendee) => r.status === "rejected" || Boolean(r.value.error);
  if (failed(attendee)) console.error("[register] confirmation email failed", attendee.status === "rejected" ? attendee.reason : attendee.value.error);
  if (failed(owner)) console.error("[register] signup notification failed", owner.status === "rejected" ? owner.reason : owner.value.error);

  // Keep the visitor's registration if at least one email went out, so the lead is never lost silently.
  if (failed(attendee) && failed(owner)) {
    return Response.json({ error: "We couldn't complete your registration. Please try again or message us on WhatsApp." }, { status: 502 });
  }
  return Response.json({ ok: true, emailed: !failed(attendee) });
}
