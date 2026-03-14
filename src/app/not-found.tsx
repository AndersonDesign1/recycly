import Link from "next/link";

import { buttonVariants } from "@/components/ui/button-variants";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md rounded-[2rem] border border-border bg-card p-10 text-center shadow-sm">
        <p className="font-semibold text-muted-foreground text-sm uppercase tracking-[0.2em]">
          Lost route
        </p>
        <h1 className="mt-4 font-semibold text-3xl">
          This page does not exist.
        </h1>
        <p className="mt-3 text-muted-foreground text-sm leading-6">
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
