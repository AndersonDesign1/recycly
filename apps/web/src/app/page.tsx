import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <section className="rounded-3xl border border-border bg-card px-8 py-10 shadow-sm">
          <div className="max-w-3xl">
            <p className="mb-3 font-data text-[11px] uppercase tracking-[0.24em] text-primary">
              Recycly demo
            </p>
            <h1 className="max-w-2xl font-semibold text-4xl leading-tight tracking-tight">
              Pickup-first recycling rewards for real households, collectors,
              and staff teams.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              The public root is now a simple demo surface. Use the auth routes
              below to create an account or sign in, then continue into the
              authenticated dashboard.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              href="/signup"
            >
              Create account
            </Link>
            <Link
              className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
              href="/login"
            >
              Sign in
            </Link>
            <Link
              className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
              href="/dashboard"
            >
              Open dashboard demo
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Recycler flow",
              body: "Book pickups, track status, and earn verified points.",
            },
            {
              title: "Collector ops",
              body: "Accept jobs, manage fulfillment, and upload proof quickly.",
            },
            {
              title: "Staff controls",
              body: "Review collections, disputes, redemptions, and reward rules.",
            },
          ].map((item) => (
            <article
              className="rounded-2xl border border-border bg-card px-5 py-5"
              key={item.title}
            >
              <h2 className="font-semibold text-lg tracking-tight">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
