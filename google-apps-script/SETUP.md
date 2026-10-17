# Leads → Google Sheet: setup (about 5 minutes)

Every webinar registration on thedeeptrading.in becomes a new row in a Google Sheet.
If the site's own email (Resend) isn't set up, this also emails you each lead and sends the
attendee their confirmation from your Gmail.

On a phone, open these pages in Chrome with **"Desktop site"** turned on.

## 1. Create the Sheet and add the script
1. Go to sheets.google.com and create a blank spreadsheet. Name it **Deep Trading Leads**.
2. Click **Extensions → Apps Script**.
3. Delete the sample code, paste the whole of `Code.gs` from this folder, and click **Save**.

## 2. Add the secret
1. In Apps Script, click the **gear icon (Project Settings)**.
2. Under **Script Properties**, click **Add script property**.
3. Property: `LEADS_SECRET`. Value: a long random string (20+ letters and numbers). Keep a copy; you'll need it in step 4.
4. Click **Save script properties**.

## 3. Deploy it as a web app
1. Click **Deploy → New deployment**. Click the gear next to "Select type" and choose **Web app**.
2. Execute as: **Me**. Who has access: **Anyone**.
3. Click **Deploy**, then **Authorize access**. Pick your Google account. If you see "Google hasn't verified this app", click **Advanced → Go to (project name) → Allow**. That's normal for your own script.
4. Copy the **Web app URL** (it ends in `/exec`).

Check: open that URL in your browser. You should see `{"ok":true,"service":"deep-trading-leads"}`.

## 4. Add two environment variables to the website
In Vercel: **Project → Settings → Environment Variables**, add for Production:

| Name | Value |
|---|---|
| `LEADS_WEBHOOK_URL` | the `/exec` URL from step 3 |
| `LEADS_SECRET` | the same secret from step 2 |

While you're there, also add `NEXT_PUBLIC_SITE_URL` = `https://www.thedeeptrading.in`.

Then **Deployments → ⋯ on the latest → Redeploy**. Environment variables only apply after a redeploy.

## 5. Test
Register on the live site with your own details. Within a few seconds you should see a new row in the
**Leads** tab and an email in your inbox.

## Good to know
- **Editing the script later:** after changing `Code.gs`, go to **Deploy → Manage deployments → ✏️ Edit**,
  set Version to **New version**, and click Deploy. This keeps the same URL. Using "New deployment" instead
  creates a new URL that you'd have to update in Vercel.
- **Gmail limit:** Apps Script can send about 100 emails a day from a free Gmail account. Rows are always
  saved even after that limit. For more confirmation emails, set up Resend with your own domain (see `.env.example`).
- **Columns:** Registered (IST), Name, Email, WhatsApp, Page, utm_source, utm_medium, utm_campaign.
  Add `?utm_source=instagram&utm_campaign=oct-webinar` to links in your ads to see which ad each lead came from.
