import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Database, ShieldCheck, Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button-variants";
import { roleLabels } from "@/lib/roles";
import { ensureProfile } from "@/server/auth/permissions";

const phaseOneWins = [
  {
    title: "Auth foundation",
    description: "Clerk-protected app routes are in place for the new build.",
    icon: ShieldCheck,
  },
  {
    title: "App architecture",
    description: "Public, docs, and authenticated experiences now share one App Router codebase.",
    icon: Sparkles,
  },
  {
    title: "Data setup",
    description: "Drizzle config and a starter profile schema are ready for Phase 2 expansion.",
    icon: Database,
  },
];

export default async function DashboardPage() {
  const profile = await ensureProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  return (
    <main className="space-y-8">
      <section className="rounded-[2rem] border border-border bg-background/70 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
          Welcome back
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          The new Recycly foundation is live.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          This dashboard is intentionally lean. Phase 1 establishes auth, route
          groups, app shell, and data foundations so we can move into workflows
          next without carrying legacy structure.
        </p>
        <div className="mt-6 inline-flex rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground">
          Current role foundation: {roleLabels[profile.role]}
        </div>
        <Link className={buttonVariants({ className: "mt-6" })} href="/docs">
          Review project docs
          <ArrowRight className="size-4" />
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {phaseOneWins.map(({ title, description, icon: Icon }) => (
          <article
            key={title}
            className="rounded-[1.5rem] border border-border bg-background/60 p-5"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-accent p-3 text-accent-foreground">
                <Icon className="size-5" />
              </div>
              <h2 className="text-lg font-semibold">{title}</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
