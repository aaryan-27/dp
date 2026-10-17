import Image from "next/image";
import { CalendarDays, Clock, Globe2, LineChart, Mail, MessageCircle, Send, Video } from "lucide-react";
import { RegisterButton, RegistrationProvider } from "./registration";
import { site } from "./site";

const curriculum = [
  { title: "Smart Money Concepts", short: "SMC", points: ["Liquidity", "Market structure"] },
  { title: "Market Auction Theory", short: "MAT", points: ["Demand & supply", "Value areas", "Price discovery"] },
  { title: "Institutional Footprints", short: "IF", points: ["Big players tracking", "Volume analysis", "Smart money moves"] },
  { title: "Order Flow & Volume Profile", short: "OF", points: ["Order flow analysis", "Volume profile analysis", "Auction market tracking"] },
];

const course: { label: string; value: string; note?: string }[] = [
  { label: "Course duration", value: "Detailed 3-month journey", note: "Beginner to advanced" },
  { label: "1:1 personal classes", value: "Customized learning" },
  { label: "Practical training", value: "Live chart practice" },
];

const webinarIncludes = [
  "Live interactive roadmap of the full course",
  "Open Q&A session",
  "Details of personal 1:1 customized classes",
  "Special discount & pricing revealed live",
  "Fee structure & lifetime access perks",
];

const faqs = [
  {
    q: "Is the webinar really free?",
    a: "Yes. The live webinar is 100% free. Seats are limited, so book yours in advance.",
  },
  {
    q: "Where does it happen?",
    a: `Live on ${site.webinar.platform} on ${site.webinar.dateLabel} at ${site.webinar.timeLabel}. Joining links are shared in our WhatsApp group.`,
  },
  {
    q: "What language is the webinar in?",
    a: "Hindi.",
  },
  {
    q: "Do I need any trading experience?",
    a: "No. The course runs from beginner to advanced, and the webinar walks through the complete roadmap.",
  },
  {
    q: "Which markets do you cover?",
    a: "Indian equity markets (Nifty & BankNifty) and the Forex market (global currencies).",
  },
  {
    q: "How do I contact you?",
    a: `WhatsApp us on ${site.phoneDisplay}, message ${site.telegramHandle} on Telegram, or email ${site.email}.`,
  },
];

function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{children}</p>;
}

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5">
      <Image src={site.images.logo} alt="" width={185} height={187} className="h-9 w-9 object-contain" preload />
      <span className="text-[17px] font-bold tracking-tight">{site.name}</span>
    </a>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <a
            href={site.whatsappChat}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="hidden h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-subtle transition hover:bg-white/5 hover:text-text sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <RegisterButton className="h-10 px-4 text-sm">Register free</RegisterButton>
        </div>
      </Container>
    </header>
  );
}

function Hero() {
  const details = [
    { icon: CalendarDays, text: site.webinar.dateLabel },
    { icon: Clock, text: site.webinar.timeLabel },
    { icon: Video, text: `Live on ${site.webinar.platform}` },
  ];

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_60%_at_70%_0%,rgba(95,183,178,0.14),transparent_70%),radial-gradient(50%_50%_at_10%_10%,rgba(226,176,74,0.10),transparent_70%)]"
      />
      <Container className="relative grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-text">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Free live webinar · Limited seats
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Trading &amp; Investing Webinar
            <span className="mt-2 block text-gold">Indian &amp; Forex markets</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-subtle">
            We&apos;re revealing our complete trading course: smart money concepts, market auction theory, institutional
            footprints and order flow, from beginner to advanced.
          </p>
          <ul className="mt-8 flex flex-col gap-3 text-[15px] sm:flex-row sm:flex-wrap sm:gap-x-6">
            {details.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2 text-text">
                <Icon className="h-4 w-4 text-teal" />
                {text}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <RegisterButton />
            <a
              href={site.whatsappGroup}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-line px-6 text-[15px] font-semibold text-text transition hover:bg-white/5"
            >
              <MessageCircle className="h-4 w-4" /> Join WhatsApp group
            </a>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div aria-hidden="true" className="absolute -inset-4 rounded-[2rem] bg-gold/10 blur-2xl" />
          <Image
            src={site.images.webinarPoster}
            alt={`${site.name} free live webinar on ${site.webinar.dateLabel} at ${site.webinar.timeLabel}`}
            width={1600}
            height={1600}
            sizes="(min-width: 1024px) 480px, 90vw"
            preload
            className="relative rounded-3xl border border-line shadow-2xl"
          />
        </div>
      </Container>
    </section>
  );
}

function VideoSection() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Watch first</Eyebrow>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">The webinar &amp; course, explained</h2>
          <p className="mt-3 text-subtle">A quick walkthrough of what we cover on 25th October (in Hindi).</p>
        </div>
        <div className="mx-auto mt-10 aspect-video max-w-4xl overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${site.youtubeVideoId}?rel=0`}
            title={`${site.name} on YouTube`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </Container>
    </section>
  );
}

function Markets() {
  const markets = [
    { icon: LineChart, title: "Indian Equity Market", text: "Trade Nifty & BankNifty." },
    { icon: Globe2, title: "Forex Market", text: "Trade global currencies." },
  ];
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Eyebrow>Specializing in</Eyebrow>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Indian &amp; Forex markets</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {markets.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl border border-line bg-surface p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal/10 text-teal">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-subtle">{text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Curriculum() {
  return (
    <section id="learn" className="py-16 sm:py-24">
      <Container>
        <Eyebrow>What you&apos;ll learn</Eyebrow>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          Read the market the way institutions do
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {curriculum.map((topic, i) => (
            <div key={topic.title} className="flex flex-col rounded-3xl border border-line bg-surface p-6">
              <span className="text-sm font-semibold text-gold">0{i + 1}</span>
              <h3 className="mt-3 text-lg font-bold leading-snug">{topic.title}</h3>
              <ul className="mt-4 flex flex-col gap-2 text-[15px] text-subtle">
                {topic.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Course() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <Image
            src={site.images.coursePoster}
            alt={`${site.name} trading & investing course: Learn, Practice, Grow`}
            width={765}
            height={1024}
            sizes="(min-width: 1024px) 460px, 90vw"
            className="mx-auto w-full max-w-sm rounded-3xl border border-line shadow-2xl lg:max-w-md"
          />
        </div>
        <div className="order-1 lg:order-2">
          <Eyebrow>The full course</Eyebrow>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Learn. Practice. Grow.</h2>
          <dl className="mt-8 flex flex-col divide-y divide-line border-y border-line">
            {course.map((item) => (
              <div key={item.label} className="grid gap-1 py-5 sm:grid-cols-[180px_1fr] sm:gap-6">
                <dt className="text-sm text-subtle">{item.label}</dt>
                <dd>
                  <p className="font-semibold">{item.value}</p>
                  {item.note && <p className="text-sm text-subtle">{item.note}</p>}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 rounded-3xl border border-gold/20 bg-gold/[0.06] p-6">
            <h3 className="font-bold text-gold-soft">In the free webinar</h3>
            <ul className="mt-3 grid gap-2 text-[15px] text-text sm:grid-cols-2">
              {webinarIncludes.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="text-gold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Faq() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Questions, answered</h2>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {faqs.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-subtle transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 pr-12 leading-relaxed text-subtle">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="pb-16 sm:pb-24">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-line bg-navy px-6 py-14 text-center sm:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(226,176,74,0.16),transparent_70%)]"
          />
          <div className="relative">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{site.tagline}</h2>
            <p className="mx-auto mt-4 max-w-lg text-subtle">
              Free live webinar · {site.webinar.dateLabel} · {site.webinar.timeLabel}
            </p>
            <RegisterButton className="mt-8" />
          </div>
        </div>
      </Container>
    </section>
  );
}

function Footer() {
  const contacts = [
    { icon: MessageCircle, label: site.phoneDisplay, href: site.whatsappChat },
    { icon: Send, label: `Telegram ${site.telegramHandle}`, href: site.telegram },
    { icon: Mail, label: site.email, href: `mailto:${site.email}` },
  ];
  return (
    <footer className="border-t border-line pb-28 pt-12 sm:pb-12">
      <Container>
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-subtle">{site.tagline}</p>
          </div>
          <ul className="flex flex-col gap-3 text-sm">
            {contacts.map(({ icon: Icon, label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-subtle transition hover:text-text"
                >
                  <Icon className="h-4 w-4 text-teal" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-10 border-t border-line pt-6 text-xs leading-relaxed text-subtle/80">
          For educational purposes only. Nothing on this page is investment advice. Trading in equity, derivatives and
          forex involves substantial risk of loss.
          <br />© {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}

function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/90 px-4 py-3 backdrop-blur-md sm:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm leading-tight">
          <p className="font-bold">Free live webinar</p>
          <p className="text-subtle">
            {site.webinar.shortDateLabel} · {site.webinar.timeLabel}
          </p>
        </div>
        <RegisterButton className="h-11 px-5 text-sm">Register free</RegisterButton>
      </div>
    </div>
  );
}

export function DeepTradingLanding() {
  return (
    <RegistrationProvider>
      <div id="top" className="min-h-screen overflow-x-clip">
        <Header />
        <main>
          <Hero />
          <VideoSection />
          <Markets />
          <Curriculum />
          <Course />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
        <MobileBar />
      </div>
    </RegistrationProvider>
  );
}
