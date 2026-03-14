import type { Metadata } from "next";

import { PublicPage } from "@/features/marketing/components/public-page";
import { publicPages } from "@/features/marketing/content";

export const metadata: Metadata = {
  title: publicPages.rewards.title,
  description: publicPages.rewards.intro,
};

export default function RewardsPage() {
  return <PublicPage slug="rewards" />;
}
