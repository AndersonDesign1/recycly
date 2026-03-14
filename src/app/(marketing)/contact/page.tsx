import type { Metadata } from "next";

import { PublicPage } from "@/features/marketing/components/public-page";
import { publicPages } from "@/features/marketing/content";

export const metadata: Metadata = {
  title: publicPages.contact.title,
  description: publicPages.contact.intro,
};

export default function ContactPage() {
  return <PublicPage slug="contact" />;
}
