/**
 * Deep Trading: webinar leads -> Google Sheet + Gmail
 *
 * Paste this whole file into Extensions -> Apps Script of your leads Google Sheet.
 * Setup steps: see SETUP.md in this folder.
 *
 * The website's /api/register route POSTs each registration here as JSON. This script:
 *   1. adds the lead as a new row in the "Leads" tab
 *   2. emails the attendee their confirmation, from the Gmail account that deployed this script
 *   3. emails you a new-lead alert
 * The email wording comes from the website (src/components/sites/deep-trading/emails.ts).
 */

// Gmail allows about 100 emails a day on a free account, and each signup uses 2.
// On a busy day, set this to false: you'll stop getting alerts, but attendees keep
// getting confirmations and every lead is still saved in the sheet.
var SEND_OWNER_ALERT = true;

var SHEET_NAME = "Leads";
var HEADERS = ["Registered (IST)", "Name", "Email", "WhatsApp", "Page", "utm_source", "utm_medium", "utm_campaign"];

function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: "Bad JSON" });
  }

  var secret = PropertiesService.getScriptProperties().getProperty("LEADS_SECRET");
  if (!secret || data.secret !== secret) {
    return json({ ok: false, error: "Unauthorized" });
  }

  var lead = {
    name: str(data.name, 80),
    email: str(data.email, 254),
    phone: str(data.phone, 30),
    page: str(data.page, 500),
    utmSource: str(data.utm_source, 100),
    utmMedium: str(data.utm_medium, 100),
    utmCampaign: str(data.utm_campaign, 100),
  };
  if (!lead.name || !lead.email || !lead.phone) {
    return json({ ok: false, error: "Missing fields" });
  }

  // 1. Save the row (locked so simultaneous signups never overwrite each other).
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    getSheet().appendRow([
      Utilities.formatDate(new Date(), "Asia/Kolkata", "dd-MM-yyyy HH:mm:ss"),
      cell(lead.name),
      cell(lead.email),
      "'" + lead.phone, // always text, so a leading 0 or + is kept
      cell(lead.page),
      cell(lead.utmSource),
      cell(lead.utmMedium),
      cell(lead.utmCampaign),
    ]);
  } finally {
    lock.releaseLock();
  }

  // 2. Send the emails. A failed email never undoes the saved row.
  var emailErrors = [];
  var emails = Array.isArray(data.emails) ? data.emails.slice(0, 2) : [];
  emails.forEach(function (m) {
    if (!m || typeof m.to !== "string" || typeof m.subject !== "string") return;
    if (m.isOwnerAlert && !SEND_OWNER_ALERT) return;
    var text = str(m.text, 20000);
    var html = str(m.html, 100000);
    if (m.isOwnerAlert) {
      var sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();
      text += "\n\nAll leads: " + sheetUrl;
      html += '<p style="font-family:Arial,sans-serif;font-size:14px"><a href="' + sheetUrl + '">Open all leads</a></p>';
    }
    try {
      MailApp.sendEmail({
        to: m.to,
        replyTo: typeof m.replyTo === "string" ? m.replyTo : undefined,
        name: m.isOwnerAlert ? "Deep Trading Leads" : "Deep Trading",
        subject: str(m.subject, 250),
        body: text,
        htmlBody: html || undefined,
      });
    } catch (err) {
      console.error("Email to " + m.to + " failed: " + err);
      emailErrors.push(String(err));
    }
  });

  return json({ ok: true, emailErrors: emailErrors });
}

// Opening the web app URL in a browser shows this, which is handy for checking the deployment.
function doGet() {
  return json({ ok: true, service: "deep-trading-leads" });
}

// Run this once from the editor (select "authorize" -> Run) to grant Sheets + Gmail access.
function authorize() {
  getSheet();
  console.log("Emails left today: " + MailApp.getRemainingDailyQuota());
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function str(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// Store as plain text and block formula injection (values starting with = + - @).
function cell(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
