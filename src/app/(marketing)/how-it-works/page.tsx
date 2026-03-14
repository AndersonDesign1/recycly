import type { Metadata } from "next";

import { PublicPage } from "@/features/marketing/components/public-page";
import { publicPages } from "@/features/marketing/content";

export const metadata: Metadata = {
  title: publicPages["how-it-works"].title,
  description: publicPages["how-it-works"].intro,
};

export default function HowItWorksPage() {
  return <PublicPage slug="how-it-works" />;
}
