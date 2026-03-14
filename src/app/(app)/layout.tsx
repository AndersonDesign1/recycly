import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="app-shell min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-6 px-6 py-6">
        <aside className="hidden w-72 shrink-0 rounded-[2rem] border border-border bg-card p-6 lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Recycly app
          </p>
          <div className="mt-6 space-y-2">
            <Link
              className="block rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="block rounded-2xl px-4 py-3 text-sm text-muted-foreground transition hover:bg-muted"
              href="/docs"
            >
              Docs
            </Link>
          </div>
        </aside>

        <div className="flex min-h-[calc(100vh-3rem)] flex-1 flex-col rounded-[2rem] border border-border bg-card">
          <header className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Protected app
              </p>
              <p className="mt-1 text-lg font-medium text-foreground">
                Phase 1 dashboard shell
              </p>
            </div>
            <UserButton />
          </header>
          <div className="flex-1 p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
