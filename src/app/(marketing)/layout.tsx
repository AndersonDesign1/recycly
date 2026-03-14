import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

import { buttonVariants } from "@/components/ui/button-variants";

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <Link className="flex items-center gap-3" href="/">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
              R
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Recycly
              </p>
              <p className="text-sm text-foreground">Recycling that pays back.</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
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
                  <button className={buttonVariants({ variant: "ghost", size: "sm" })}>
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className={buttonVariants({ size: "sm" })}>Start now</button>
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
