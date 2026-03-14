import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import { publicNavigation, publicPages } from "@/features/marketing/content";

export function PublicPage({ slug }: { slug: keyof typeof publicPages }) {
  const page = publicPages[slug];

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-12 md:px-6 md:py-16">
      <section className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="reveal-up">
          <p className="eyebrow text-primary">{page.eyebrow}</p>
          <h1 className="display-title mt-5 max-w-4xl text-5xl md:text-7xl">
            {page.title}
          </h1>
          <p className="mt-6 max-w-[66ch] text-[color:var(--ink-soft)] text-base leading-8 md:text-lg">
            {page.intro}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className={buttonVariants({
                className: "tactile h-11 rounded-full px-5 text-sm",
                variant: "outline",
              })}
              href="/"
            >
              <ArrowLeft size={16} weight="bold" />
              Back to overview
            </Link>
            <Link
              className={buttonVariants({
                className: "tactile h-11 rounded-full px-5 text-sm",
                variant: "ghost",
              })}
              href="/docs"
            >
              Open docs
            </Link>
          </div>
        </div>

        <aside className="shell-panel reveal-up rounded-[2.5rem] border border-white/45 px-6 py-6 [animation-delay:90ms] md:px-8">
          <p className="eyebrow text-[color:var(--ink-faint)]">
            Keep exploring
          </p>
          <div className="mt-5 grid gap-3">
            {publicNavigation.map((item) => (
              <Link
                className={`tactile surface-wash flex items-center justify-between rounded-[1.45rem] border border-border/70 px-4 py-4 font-medium text-sm ${
                  item.href === `/${slug}`
                    ? "border-primary/30 bg-primary/8 text-primary"
                    : "text-foreground"
                }`}
                href={item.href}
                key={item.href}
              >
                {item.label}
                <ArrowUpRight size={14} />
              </Link>
            ))}
          </div>
        </aside>
      </section>

      <section className="mt-16 grid gap-5">
        {page.sections.map((section, index) => (
          <section
            className={`reveal-up grid gap-4 border-border/75 border-t py-6 [animation-delay:${index * 70}ms] lg:grid-cols-[0.42fr_0.58fr]`}
            key={section.title}
          >
            <h2 className="font-display font-semibold text-3xl tracking-tight">
              {section.title}
            </h2>
            <p className="max-w-[68ch] text-[color:var(--ink-soft)] text-sm leading-8">
              {section.body}
            </p>
          </section>
        ))}
      </section>
    </main>
  );
}
