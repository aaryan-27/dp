/**
 * Deep Trading: webinar leads -> Google Sheet (+ email backup)
 *
 * Paste this whole file into Extensions -> Apps Script of your leads Google Sheet.
 * Setup steps: see SETUP.md in this folder.
 *
 * The website's /api/register route POSTs each registration here as JSON.
 * Every lead is added as a new row in the "Leads" tab.
 * If the website could not send an email itself (Resend not set up or failed),
 * this script sends it from your Gmail instead, so no lead is ever missed.
 */

var SHEET_NAME = "Leads";
var HEADERS = ["Registered (IST)", "Name", "Email", "WhatsApp", "Page", "utm_source", "utm_medium", "utm_campaign"];

var WEBINAR = {
  date: "Sunday, 25 October 2026",
  time: "7:00 PM IST",
  platform: "Google Meet & YouTube",
  whatsappGroup: "https://chat.whatsapp.com/Hk7tMfTAGFo8meUSFRbfr8",
  contact: "WhatsApp +91 95403 66555 or Telegram @deeptradezz",
};

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
    var sheet = getSheet();
    sheet.appendRow([
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

  // 2. Backup emails. A failed email never undoes the saved row.
  if (data.notifyOwner && data.notifyTo) {
    try {
      MailApp.sendEmail({
        to: data.notifyTo,
        replyTo: lead.email,
        subject: "New webinar signup: " + lead.name,
        body: [
          "Name: " + lead.name,
          "Email: " + lead.email,
          "WhatsApp: " + lead.phone,
          "Registered: " + Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, h:mm a") + " IST",
          lead.utmSource ? "Source: " + [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(String).join(" / ") : null,
          "",
          "All leads: " + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
        ].filter(function (l) { return l !== null; }).join("\n"),
      });
    } catch (err) {
      console.error("Owner email failed: " + err);
    }
  }

  if (data.sendConfirmation) {
    try {
      var firstName = lead.name.split(" ")[0];
      MailApp.sendEmail({
        to: lead.email,
        name: "Deep Trading",
        subject: "You're in: Deep Trading free webinar, " + WEBINAR.date,
        body: [
          "Hi " + firstName + ",",
          "",
          "Your free seat for the Trading & Investing Webinar is confirmed.",
          "",
          "Date: " + WEBINAR.date,
          "Time: " + WEBINAR.time,
          "Where: Live on " + WEBINAR.platform,
          "",
          "Joining links are shared in our WhatsApp group. Join now so you don't miss them:",
          WEBINAR.whatsappGroup,
          "",
          "Questions? " + WEBINAR.contact + ".",
          "",
          "Deep Trading: Plan Your Trade, Trade Your Plan",
        ].join("\n"),
      });
    } catch (err) {
      console.error("Confirmation email failed: " + err);
    }
  }

  return json({ ok: true });
}

// Opening the web app URL in a browser shows this, which is handy for checking the deployment.
function doGet() {
  return json({ ok: true, service: "deep-trading-leads" });
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

// Store as plain text: stops "+91..." being read as a number and blocks formula injection.
function cell(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
