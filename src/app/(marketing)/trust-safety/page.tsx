import type { Metadata } from "next";

import { PublicPage } from "@/features/marketing/components/public-page";
import { publicPages } from "@/features/marketing/content";

export const metadata: Metadata = {
  title: publicPages["trust-safety"].title,
  description: publicPages["trust-safety"].intro,
};

export default function TrustSafetyPage() {
  return <PublicPage slug="trust-safety" />;
}
