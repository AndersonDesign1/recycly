import Link from "next/link";
import { redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button-variants";
import { saveOnboarding } from "@/features/dashboard/server/actions";
import { requireProfile } from "@/server/auth/permissions";

export default async function OnboardingPage() {
  const profile = await requireProfile();

  if (profile.onboardingCompleted) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8">
      <section className="rounded-[2rem] border border-border bg-background/70 p-8">
        <p className="font-semibold text-primary text-sm uppercase tracking-[0.25em]">
          Onboarding
        </p>
        <h1 className="mt-4 font-semibold text-3xl tracking-tight">
          Complete your Recycly profile
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground text-sm leading-7">
          This sets the minimum profile details we need for either a recycling
          user account or a collector account. Staff and Super Admin flows will
          come later in a dedicated operations phase.
        </p>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-8">
        <form action={saveOnboarding} className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm">
            <span className="font-medium">Full name</span>
            <input
              className="rounded-2xl border border-border bg-background px-4 py-3 outline-none ring-0"
              defaultValue={profile.fullName ?? ""}
              name="fullName"
              placeholder="Jane Doe"
              required
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-medium">Phone number</span>
            <input
              className="rounded-2xl border border-border bg-background px-4 py-3 outline-none ring-0"
              defaultValue={profile.phoneNumber ?? ""}
              name="phoneNumber"
              placeholder="+234..."
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-medium">City</span>
            <input
              className="rounded-2xl border border-border bg-background px-4 py-3 outline-none ring-0"
              defaultValue={profile.city ?? "Lagos"}
              name="city"
              placeholder="Lagos"
              required
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-medium">Role</span>
            <select
              className="rounded-2xl border border-border bg-background px-4 py-3 outline-none ring-0"
              defaultValue={profile.role}
              name="role"
            >
              <option value="user">User</option>
              <option value="collector">Collector</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-medium">Vehicle type (collectors)</span>
            <input
              className="rounded-2xl border border-border bg-background px-4 py-3 outline-none ring-0"
              name="vehicleType"
              placeholder="Van, tricycle, pickup truck"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-medium">
              Coverage radius in km (collectors)
            </span>
            <input
              className="rounded-2xl border border-border bg-background px-4 py-3 outline-none ring-0"
              defaultValue="10"
              min="1"
              name="coverageRadiusKm"
              step="1"
              type="number"
            />
          </label>

          <div className="flex flex-wrap gap-3 pt-2 md:col-span-2">
            <button className={buttonVariants()} type="submit">
              Save and continue
            </button>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/docs"
            >
              Review docs first
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
