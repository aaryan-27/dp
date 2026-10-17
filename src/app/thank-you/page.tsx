import type { Metadata } from "next";
import { ThankYou } from "@/components/sites/deep-trading/thank-you";
import { site } from "@/components/sites/deep-trading/site";

export const metadata: Metadata = {
  title: `You're registered | ${site.name}`,
  robots: { index: false },
};

export default function ThankYouPage() {
  return <ThankYou />;
}
