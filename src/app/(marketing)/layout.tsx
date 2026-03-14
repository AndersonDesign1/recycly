import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-border/70 border-b bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <Link className="flex items-center gap-3" href="/">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary font-bold text-primary-foreground text-sm">
              R
            </span>
            <div>
              <p className="font-semibold text-muted-foreground text-sm uppercase tracking-[0.25em]">
                Recycly
              </p>
              <p className="text-foreground text-sm">
                Recycling that pays back.
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-muted-foreground text-sm md:flex">
            <Link href="/docs">Docs</Link>
            <Link href="/dashboard">Dashboard</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Show when="signed-in">
              <div className="flex items-center gap-3">
                <Link
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                  href="/dashboard"
                >
                  Open app
                </Link>
                <UserButton />
              </div>
            </Show>
            <Show when="signed-out">
              <div className="flex items-center gap-3">
                <SignInButton>
                  <button
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                    type="button"
                  >
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button
                    className={buttonVariants({ size: "sm" })}
                    type="button"
                  >
                    Start now
                  </button>
                </SignUpButton>
              </div>
            </Show>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
