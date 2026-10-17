"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarPlus, CheckCircle2, MessageCircle } from "lucide-react";
import { calendarLink, site } from "./site";

const REDIRECT_SECONDS = 5;

export function ThankYou() {
  const [seconds, setSeconds] = useState(REDIRECT_SECONDS);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (cancelled) return;
    if (seconds === 0) {
      window.location.href = site.whatsappGroup;
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, cancelled]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <Image src={site.images.logo} alt="" width={185} height={187} className="h-10 w-10 object-contain" />
          <span className="text-lg font-bold tracking-tight">{site.name}</span>
        </Link>

        <div className="mt-10 rounded-3xl border border-line bg-surface p-8 sm:p-10">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight">You&apos;re registered!</h1>
          <p className="mt-3 text-subtle">
            Your free seat is confirmed for <span className="text-text">{site.webinar.dateLabel}</span> at{" "}
            <span className="text-text">{site.webinar.timeLabel}</span>, live on {site.webinar.platform}. Check your
            inbox for the confirmation email.
          </p>

          <a
            href={site.whatsappGroup}
            className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold text-[15px] font-bold text-ink transition hover:bg-gold-soft"
          >
            <MessageCircle className="h-4 w-4" /> Join the WhatsApp group
          </a>
          <p className="mt-3 text-sm text-subtle" aria-live="polite">
            {cancelled ? (
              "Joining links are shared in the group before the session."
            ) : (
              <>
                Taking you to the group in {seconds}s ·{" "}
                <button type="button" onClick={() => setCancelled(true)} className="underline underline-offset-2 hover:text-text">
                  stay here
                </button>
              </>
            )}
          </p>

          <a
            href={calendarLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line px-5 text-sm font-semibold transition hover:bg-white/5"
          >
            <CalendarPlus className="h-4 w-4" /> Add to Google Calendar
          </a>
        </div>
      </div>
    </main>
  );
}
