import type { Metadata } from "next";

import { PublicPage } from "@/features/marketing/components/public-page";
import { publicPages } from "@/features/marketing/content";

export const metadata: Metadata = {
  title: publicPages.faq.title,
  description: publicPages.faq.intro,
};

export default function FaqPage() {
  return <PublicPage slug="faq" />;
}
