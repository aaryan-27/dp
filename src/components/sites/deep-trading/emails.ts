import { calendarLink, site } from "./site";

export type Registration = { name: string; email: string; phone: string };

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const button = (href: string, label: string, primary = true) =>
  `<a href="${href}" style="display:inline-block;padding:12px 22px;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none;${
    primary ? "background:#e2b04a;color:#07111f;" : "background:#16263d;color:#e9eef6;"
  }">${label}</a>`;

export function confirmationEmail({ name }: Registration) {
  const { webinar } = site;
  const firstName = escape(name.split(" ")[0]);
  const joinLines = [
    webinar.meetLink && `<li>Google Meet: <a href="${webinar.meetLink}" style="color:#e2b04a">${webinar.meetLink}</a></li>`,
    webinar.youtubeLiveLink &&
      `<li>YouTube Live: <a href="${webinar.youtubeLiveLink}" style="color:#e2b04a">${webinar.youtubeLiveLink}</a></li>`,
  ].filter(Boolean);

  const html = `<!doctype html>
<html><body style="margin:0;background:#07111f;font-family:Arial,Helvetica,sans-serif;color:#e9eef6">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px">
    <p style="margin:0 0 24px;font-size:18px;font-weight:700;letter-spacing:.2px">${site.name}</p>
    <div style="background:#0f1d32;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:28px">
      <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3">You're registered, ${firstName}!</h1>
      <p style="margin:0 0 20px;color:#9aa8bc;font-size:15px;line-height:1.6">
        Your free seat for the Trading &amp; Investing Webinar is confirmed.
      </p>
      <table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 24px;font-size:15px">
        <tr><td style="padding:8px 0;color:#9aa8bc;width:90px">Date</td><td style="padding:8px 0;font-weight:700">${webinar.dateLabel}</td></tr>
        <tr><td style="padding:8px 0;color:#9aa8bc">Time</td><td style="padding:8px 0;font-weight:700">${webinar.timeLabel}</td></tr>
        <tr><td style="padding:8px 0;color:#9aa8bc">Where</td><td style="padding:8px 0;font-weight:700">Live on ${webinar.platform}</td></tr>
      </table>
      ${
        joinLines.length
          ? `<p style="margin:0 0 8px;font-size:15px">Join here:</p><ul style="margin:0 0 24px;padding-left:18px;font-size:15px;line-height:1.7">${joinLines.join("")}</ul>`
          : `<p style="margin:0 0 24px;color:#9aa8bc;font-size:15px;line-height:1.6">The joining links will be shared in our WhatsApp group before the session. Join it now so you don't miss them.</p>`
      }
      <p style="margin:0 0 12px">${button(site.whatsappGroup, "Join the WhatsApp group")}</p>
      <p style="margin:0">${button(calendarLink(), "Add to Google Calendar", false)}</p>
    </div>
    <p style="margin:24px 0 0;color:#9aa8bc;font-size:13px;line-height:1.6">
      Questions? Reply to this email, WhatsApp us on ${site.phoneDisplay} or message ${site.telegramHandle} on Telegram.<br>
      ${site.name}: ${site.tagline}
    </p>
  </div>
</body></html>`;

  const text = [
    `You're registered, ${name.split(" ")[0]}!`,
    "",
    "Your free seat for the Trading & Investing Webinar is confirmed.",
    `Date: ${webinar.dateLabel}`,
    `Time: ${webinar.timeLabel}`,
    `Where: Live on ${webinar.platform}`,
    webinar.meetLink && `Google Meet: ${webinar.meetLink}`,
    webinar.youtubeLiveLink && `YouTube Live: ${webinar.youtubeLiveLink}`,
    "",
    `Join the WhatsApp group for joining links and updates: ${site.whatsappGroup}`,
    `Add to Google Calendar: ${calendarLink()}`,
    "",
    `Questions? WhatsApp ${site.phoneDisplay} or Telegram ${site.telegramHandle}.`,
  ]
    .filter((line) => line !== "")
    .join("\n");

  return { subject: `You're in: ${site.name} free webinar, ${webinar.dateLabel}`, html, text };
}

export function signupNotification({ name, email, phone }: Registration) {
  const rows = [
    ["Name", name],
    ["Email", email],
    ["WhatsApp", phone],
    ["Registered", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })],
  ];
  return {
    subject: `New webinar signup: ${name}`,
    html: `<table style="font-family:Arial,sans-serif;font-size:14px">${rows
      .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td style="padding:4px 0"><b>${escape(v)}</b></td></tr>`)
      .join("")}</table>`,
    text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
  };
}
