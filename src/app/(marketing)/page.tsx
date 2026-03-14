import { ArrowRight, Leaf, MapPinned, Wallet } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";

const highlights = [
  {
    title: "Pickup-first by design",
    description:
      "Users request collection from home instead of figuring out where waste should go.",
    icon: MapPinned,
  },
  {
    title: "Verification before rewards",
    description:
      "Points are issued only after review, so the system stays credible as operations grow.",
    icon: Leaf,
  },
  {
    title: "Rewards with real value",
    description:
      "The product is built around a points ledger that can support vouchers and cashout workflows later.",
    icon: Wallet,
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto grid min-h-[calc(100vh-81px)] w-full max-w-7xl gap-14 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
        <div>
          <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 font-semibold text-primary text-xs uppercase tracking-[0.25em]">
            Lagos-first MVP rebuild
          </div>
          <h1 className="mt-8 max-w-3xl font-semibold text-5xl leading-[1.02] tracking-tight md:text-7xl">
            Recycle properly. Schedule pickup. Earn back value.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-8">
            Recycly is a pickup-first recycling platform for urban households in
            Nigeria. Users book a collection, track the process, and earn points
            after verified recycling.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link className={buttonVariants({ size: "lg" })} href="/sign-up">
              Create account
              <ArrowRight className="size-4" />
            </Link>
            <Link
              className={buttonVariants({ variant: "secondary", size: "lg" })}
              href="/docs"
            >
              Read the docs
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-8 shadow-[0_24px_80px_-40px_rgba(16,35,26,0.35)]">
          <p className="font-semibold text-muted-foreground text-sm uppercase tracking-[0.25em]">
            Phase 1 foundation
          </p>
          <div className="mt-6 space-y-4">
            {highlights.map(({ title, description, icon: Icon }) => (
              <div
                className="rounded-[1.5rem] border border-border bg-background/60 p-5"
                key={title}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-accent p-3 text-accent-foreground">
                    <Icon className="size-5" />
                  </div>
                  <h2 className="font-semibold text-lg">{title}</h2>
                </div>
                <p className="mt-3 text-muted-foreground text-sm leading-6">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
