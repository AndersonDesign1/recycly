import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Leaf } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";
import { publicNavigation } from "@/features/marketing/content";

export function MarketingShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-border/70 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link className="flex items-center gap-3" href="/">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_14px_32px_-20px_rgba(58,102,69,0.8)]">
              <Leaf size={20} weight="fill" />
            </span>
            <div>
              <p className="eyebrow text-primary">Recycly</p>
              <p className="mt-1 max-w-52 text-[color:var(--ink-soft)] text-sm">
                Pickup-first recycling built for dense city life.
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-[color:var(--ink-soft)] text-sm lg:flex">
            {publicNavigation.map((item) => (
              <Link
                className="tactile hover:text-foreground"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
            <Link className="tactile hover:text-foreground" href="/docs">
              Docs
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Show when="signed-in">
              <div className="flex items-center gap-3">
                <Link
                  className={buttonVariants({
                    className:
                      "tactile h-10 rounded-full border border-border/70 bg-card px-4 text-sm",
                    variant: "outline",
                  })}
                  href="/dashboard"
                >
                  Open dashboard
                </Link>
                <UserButton />
              </div>
            </Show>
            <Show when="signed-out">
              <div className="flex items-center gap-2">
                <SignInButton>
                  <button
                    className={buttonVariants({
                      className: "tactile h-10 rounded-full px-4 text-sm",
                      size: "sm",
                      variant: "ghost",
                    })}
                    type="button"
                  >
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button
                    className={buttonVariants({
                      className:
                        "tactile h-10 rounded-full border border-primary/20 px-4 text-sm shadow-[0_16px_34px_-18px_rgba(58,102,69,0.75)]",
                      size: "sm",
                    })}
                    type="button"
                  >
                    Start recycling
                  </button>
                </SignUpButton>
              </div>
            </Show>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[1400px] gap-2 overflow-x-auto px-4 pb-4 md:px-6 lg:hidden">
          <Link
            className="tactile whitespace-nowrap rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-primary text-sm"
            href="/docs"
          >
            Docs
          </Link>
          {publicNavigation.map((item) => (
            <Link
              className="tactile whitespace-nowrap rounded-full border border-border bg-card/80 px-4 py-2 text-[color:var(--ink-soft)] text-sm"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      {children}
    </div>
  );
}
