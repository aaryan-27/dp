# Leads → Google Sheet + Gmail: setup (about 5 minutes)

Every webinar registration on thedeeptrading.in:
- becomes a new row in a Google Sheet,
- gets a confirmation email (date, time, WhatsApp group link, calendar button), sent from your Gmail,
- sends you a new-lead alert.

**Use the Gmail account you want confirmations to come from** (for example deepanshu29dy@gmail.com)
for every step below. Attendees' replies go to deepanshu29dy@gmail.com either way.

On a phone, open these pages in Chrome with **"Desktop site"** turned on.

## 1. Create the Sheet and add the script
1. Go to sheets.google.com and create a blank spreadsheet. Name it **Deep Trading Leads**.
2. Click **Extensions → Apps Script**.
3. Delete the sample code, paste the whole of `Code.gs` from this folder, and click **Save** (💾).

## 2. Add the secret
1. In Apps Script, click the **gear icon (Project Settings)**.
2. Under **Script Properties**, click **Add script property**.
3. Property: `LEADS_SECRET`. Value: a long random string (20+ letters and numbers). Keep a copy; you'll need it in step 5.
4. Click **Save script properties**.

## 3. Give the script permission
1. Go back to the **Editor** (the `< >` icon).
2. In the function dropdown at the top, pick **authorize**, then click **Run**.
3. Click **Review permissions** and pick your Google account. If you see "Google hasn't verified this app", click
   **Advanced → Go to (project name) → Allow**. That's normal for your own script.

## 4. Deploy it as a web app
1. Click **Deploy → New deployment**. Click the gear next to "Select type" and choose **Web app**.
2. Execute as: **Me**. Who has access: **Anyone**.
3. Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).

Check: open that URL in your browser. You should see `{"ok":true,"service":"deep-trading-leads"}`.

## 5. Add environment variables in Vercel
**Project → Settings → Environment Variables**. Add these for **Production**, then delete any old
`RESEND_API_KEY` and `RESEND_FROM` variables, since they're no longer used:

| Name | Value |
|---|---|
| `LEADS_WEBHOOK_URL` | the `/exec` URL from step 4 |
| `LEADS_SECRET` | the same secret from step 2 |
| `NEXT_PUBLIC_SITE_URL` | `https://www.thedeeptrading.in` |

Then **Deployments → ⋯ on the latest → Redeploy**. Environment variables only apply after a redeploy.

## 6. Test
Register on the live site with your own details. Within a few seconds you should see a new row in the
**Leads** tab, the confirmation email, and the new-lead alert.

## Good to know
- **Gmail limit:** a free Gmail account can send about **100 emails a day**, and each signup uses 2
  (confirmation + your alert), so roughly 50 signups a day. Rows are always saved, even past the limit.
  If you expect more, set `SEND_OWNER_ALERT = false` at the top of the script so that all 100 go to
  attendees, and check the sheet instead. A Google Workspace account allows 1,500 a day.
- **Editing the script later:** after changing `Code.gs`, go to **Deploy → Manage deployments → ✏️ Edit**,
  set Version to **New version**, and click Deploy. This keeps the same URL. Using "New deployment" instead
  creates a new URL that you'd have to update in Vercel.
- **Changing the email wording:** edit `src/components/sites/deep-trading/emails.ts` in the website. Webinar
  details such as the Meet and YouTube links live in `site.ts`.
- **Columns:** Registered (IST), Name, Email, WhatsApp, Page, utm_source, utm_medium, utm_campaign.
  Add `?utm_source=instagram&utm_campaign=oct-webinar` to links in your ads to see which ad each lead came from.
