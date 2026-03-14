import {
  BookOpen,
  Lifebuoy,
  MapTrifold,
  Question,
  SealCheck,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import {
  docsGuide,
  publicNavigation,
  supportedWasteTypes,
} from "@/features/marketing/content";

const guideSignals = [
  {
    icon: BookOpen,
    title: "Written for real use",
    body: "This guide sticks to what the app does today.",
  },
  {
    icon: MapTrifold,
    title: "Pickup flow explained",
    body: "From request to verification, the steps stay visible.",
  },
  {
    icon: SealCheck,
    title: "Rewards stay checked",
    body: "Points and redemption still pass through review.",
  },
];

export function DocsPage() {
  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-12 md:px-6 md:py-16">
      <section className="grid gap-8 lg:grid-cols-[1fr_0.92fr]">
        <div className="reveal-up">
          <p className="eyebrow text-primary">Docs</p>
          <h1 className="display-title mt-5 max-w-4xl text-5xl md:text-7xl">
            A practical guide to how Recycly works right now.
          </h1>
          <p className="mt-6 max-w-[66ch] text-[color:var(--ink-soft)] text-base leading-8 md:text-lg">
            If you are trying to understand what can be recycled, how pickup
            moves, when points land, or where to go when something goes wrong,
            start here. This page is meant to answer those questions plainly.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className={buttonVariants({
                className: "tactile h-11 rounded-full px-5 text-sm",
              })}
              href="/sign-up"
            >
              Start with an account
            </Link>
            <Link
              className={buttonVariants({
                className: "tactile h-11 rounded-full px-5 text-sm",
                variant: "outline",
              })}
              href="/faq"
            >
              Open the FAQ
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {guideSignals.map(({ icon: Icon, title, body }) => (
              <article
                className="surface-wash rounded-[1.6rem] border border-border/70 p-4"
                key={title}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/12 text-primary">
                  <Icon size={18} weight="duotone" />
                </span>
                <h2 className="mt-4 font-display font-semibold text-xl tracking-tight">
                  {title}
                </h2>
                <p className="mt-2 text-[color:var(--ink-soft)] text-sm leading-7">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>

        <aside className="shell-panel reveal-up rounded-[2.5rem] border border-white/45 px-6 py-6 [animation-delay:100ms] md:px-8 md:py-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/12 text-primary">
              <Question size={20} weight="duotone" />
            </span>
            <div>
              <p className="eyebrow text-[color:var(--ink-faint)]">
                Quick orientation
              </p>
              <p className="mt-1 text-[color:var(--ink-soft)] text-sm">
                Public pages that answer the questions new users usually ask
                first.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {publicNavigation.map((item) => (
              <Link
                className="tactile surface-wash rounded-[1.45rem] border border-border/70 px-4 py-4 font-medium text-foreground text-sm"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </aside>
      </section>

      <section className="mt-16 grid gap-5">
        {docsGuide.map((section, index) => (
          <article
            className={`reveal-up border-border/75 border-t py-6 [animation-delay:${index * 70}ms]`}
            key={section.title}
          >
            <h2 className="font-display font-semibold text-3xl tracking-tight">
              {section.title}
            </h2>
            <p className="mt-4 max-w-[78ch] text-[color:var(--ink-soft)] text-sm leading-8">
              {section.body}
            </p>
          </article>
        ))}
      </section>

      <section className="shell-panel mt-16 rounded-[2.5rem] border border-white/45 px-6 py-8 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/12 text-primary">
                <Lifebuoy size={20} weight="duotone" />
              </span>
              <div>
                <p className="eyebrow text-primary">Supported waste snapshot</p>
                <h2 className="mt-1 font-display font-semibold text-3xl tracking-tight">
                  Start with what homes already separate most often.
                </h2>
              </div>
            </div>
            <p className="mt-5 max-w-[54ch] text-[color:var(--ink-soft)] text-sm leading-7">
              The list stays focused so collection and review remain manageable
              during rollout. If a category is supported, the app should make
              that clear before pickup.
            </p>
            <div className="mt-6">
              <Link
                className={buttonVariants({
                  className: "tactile h-11 rounded-full px-5 text-sm",
                  variant: "outline",
                })}
                href="/supported-waste"
              >
                Full supported waste page
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {supportedWasteTypes.map((item) => (
              <div
                className="surface-wash rounded-[1.45rem] border border-border/70 px-4 py-4 text-sm leading-7"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
