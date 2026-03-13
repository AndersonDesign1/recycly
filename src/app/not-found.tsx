import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md rounded-[2rem] border border-border bg-card p-10 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Lost route
        </p>
        <h1 className="mt-4 text-3xl font-semibold">This page does not exist.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The route may have moved during the rebuild. Head back to the landing
          page to continue.
        </p>
        <Link className={buttonVariants({ className: "mt-6" })} href="/">
          Return home
        </Link>
      </div>
    </main>
  );
}
