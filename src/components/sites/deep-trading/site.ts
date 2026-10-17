// Every business detail on the page lives here. Edit this file to update the site.

const WEBINAR_START = "2026-10-25T19:00:00+05:30";
// Used only for the calendar invite; the page does not state a duration.
const WEBINAR_MINUTES = 120;

export const site = {
  name: "Deep Trading",
  tagline: "Plan Your Trade, Trade Your Plan",
  email: "deepanshu29dy@gmail.com",
  phoneDisplay: "+91 95403 66555",
  whatsappChat: "https://wa.me/919540366555",
  whatsappGroup: "https://chat.whatsapp.com/Hk7tMfTAGFo8meUSFRbfr8",
  telegramHandle: "@deeptradezz",
  telegram: "https://t.me/deeptradezz",
  youtubeVideoId: "_hnOAcezZTg",

  webinar: {
    start: WEBINAR_START,
    minutes: WEBINAR_MINUTES,
    dateLabel: "Sunday, 25 October 2026",
    shortDateLabel: "Sun, 25 Oct",
    timeLabel: "7:00 PM IST",
    platform: "Google Meet & YouTube",
    // Paste the live links here when you have them; they are added to the confirmation email.
    meetLink: "",
    youtubeLiveLink: "",
  },

  images: {
    logo: "/sites/deep-trading/logo-emblem.png",
    webinarPoster: "/sites/deep-trading/webinar-poster.jpg",
    coursePoster: "/sites/deep-trading/course-poster.jpg",
  },
};

export function calendarLink() {
  const start = new Date(site.webinar.start);
  const end = new Date(start.getTime() + site.webinar.minutes * 60_000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${site.name}: Free Live Trading & Investing Webinar`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `Live on ${site.webinar.platform}. Joining links are shared in the WhatsApp group: ${site.whatsappGroup}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
