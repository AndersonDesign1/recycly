import type { Metadata } from "next";

import { PublicPage } from "@/features/marketing/components/public-page";
import { publicPages } from "@/features/marketing/content";

export const metadata: Metadata = {
  title: publicPages["supported-waste"].title,
  description: publicPages["supported-waste"].intro,
};

export default function SupportedWastePage() {
  return <PublicPage slug="supported-waste" />;
}
