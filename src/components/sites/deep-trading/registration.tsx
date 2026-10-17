"use client";

import { createContext, useCallback, useContext, useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { site } from "./site";

const RegistrationContext = createContext<{ open: () => void }>({ open: () => {} });

export const useRegistration = () => useContext(RegistrationContext);

export function RegistrationProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);

  return (
    <RegistrationContext.Provider value={{ open }}>
      {children}
      {isOpen && <RegistrationDialog onClose={() => setIsOpen(false)} />}
    </RegistrationContext.Provider>
  );
}

export function RegisterButton({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  const { open } = useRegistration();
  return (
    <button
      type="button"
      onClick={open}
      className={`inline-flex h-12 items-center justify-center rounded-xl bg-gold px-6 text-[15px] font-bold text-ink transition hover:bg-gold-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${className}`}
    >
      {children ?? "Book your free seat"}
    </button>
  );
}

const fieldClass =
  "h-12 w-full rounded-xl border border-input bg-ink/60 px-4 text-[15px] text-text placeholder:text-subtle/70 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25";

function RegistrationDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const titleId = useId();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && status !== "sending" && onClose();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, status]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.error ?? "Something went wrong. Please try again.");
      router.push("/thank-you");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={() => status !== "sending" && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-t-3xl border border-line bg-surface p-6 shadow-2xl sm:rounded-3xl sm:p-8"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-subtle transition hover:bg-white/5 hover:text-text"
        >
          <X className="h-5 w-5" />
        </button>

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Free live webinar</p>
        <h2 id={titleId} className="mt-2 text-2xl font-bold tracking-tight">
          Book your free seat
        </h2>
        <p className="mt-1 text-sm text-subtle">
          {site.webinar.dateLabel} · {site.webinar.timeLabel}
        </p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Full name
            <input name="name" required minLength={2} maxLength={80} autoComplete="name" placeholder="Your name" className={fieldClass} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Email
            <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={fieldClass} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            WhatsApp number
            <input
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              pattern="[+0-9 ()-]{10,20}"
              title="Enter a 10-digit mobile number, with country code if outside India"
              placeholder="+91 98765 43210"
              className={fieldClass}
            />
          </label>
          {/* Honeypot: hidden from people, filled in by bots. */}
          <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

          {status === "error" && (
            <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gold text-[15px] font-bold text-ink transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
            {status === "sending" ? "Booking your seat…" : "Confirm my free seat"}
          </button>
          <p className="text-center text-xs text-subtle">
            We&apos;ll email your confirmation and share the joining link on WhatsApp.
          </p>
        </form>
      </div>
    </div>
  );
}
