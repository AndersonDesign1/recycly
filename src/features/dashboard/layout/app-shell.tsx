import { UserButton } from "@clerk/nextjs";
import {
  BookOpenText,
  ChartBar,
  HouseLine,
  Leaf,
  Lifebuoy,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { publicNavigation } from "@/features/marketing/content";

const appNav = [
  { href: "/dashboard", label: "Dashboard", icon: HouseLine },
  { href: "/docs", label: "Docs", icon: BookOpenText },
  {
    href: publicNavigation[0]?.href ?? "/how-it-works",
    label: "Pickup guide",
    icon: ChartBar,
  },
];

export function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="app-shell min-h-screen">
      <div className="mx-auto w-full max-w-[1460px] px-4 py-4 md:px-6 md:py-6">
        <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
          <Card className="hidden rounded-[2rem] border-white/70 bg-white/82 xl:block">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Leaf size={20} weight="fill" />
                </span>
                <div>
                  <p className="font-display font-semibold text-lg tracking-tight">
                    Recycly
                  </p>
                  <p className="text-[color:var(--ink-faint)] text-xs">
                    Pickup and verification workspace
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                {appNav.map(({ href, icon: Icon, label }) => (
                  <Link
                    className={`tactile flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-sm ${
                      href === "/dashboard"
                        ? "bg-primary text-primary-foreground shadow-[0_18px_34px_-22px_rgba(58,102,69,0.9)]"
                        : "text-[color:var(--ink-soft)] hover:bg-background/60 hover:text-foreground"
                    }`}
                    href={href}
                    key={href}
                  >
                    <Icon size={18} weight="duotone" />
                    {label}
                  </Link>
                ))}
              </div>

              <Card className="mt-6 rounded-[1.5rem] border-border/70 bg-background/60 shadow-none">
                <CardHeader className="pb-3">
                  <CardDescription>Operations signal</CardDescription>
                  <CardTitle className="mt-2 text-xl">
                    Trust stays visible
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "Proof required",
                    "Reviewable rewards",
                    "Support tied to records",
                  ].map((item) => (
                    <div className="flex items-center gap-3" key={item}>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/12 text-primary">
                        <Sparkle size={15} weight="fill" />
                      </span>
                      <span className="text-[color:var(--ink-soft)] text-sm">
                        {item}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="mt-6">
                <p className="mb-3 text-[color:var(--ink-faint)] text-xs uppercase tracking-[0.24em]">
                  Public links
                </p>
                <div className="space-y-2">
                  {publicNavigation.slice(0, 4).map((item) => (
                    <Link
                      className="tactile flex items-center gap-3 rounded-[1rem] px-3 py-2 text-[color:var(--ink-soft)] text-sm hover:bg-background/60 hover:text-foreground"
                      href={item.href}
                      key={item.href}
                    >
                      <Lifebuoy size={15} weight="duotone" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[2rem] border-white/70 bg-white/84">
            <CardContent className="p-0">
              <header className="border-border/70 border-b px-4 py-4 md:px-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <Badge variant="secondary">Protected app</Badge>
                    <p className="mt-3 max-w-2xl text-[color:var(--ink-soft)] text-sm leading-7">
                      A cleaner operating view for collectors, staff, and
                      households.
                    </p>
                  </div>
                  <UserButton />
                </div>

                <div className="mt-5 flex gap-2 overflow-x-auto xl:hidden">
                  {appNav.map(({ href, label }) => (
                    <Link
                      className={`tactile whitespace-nowrap rounded-full px-4 py-2 text-sm ${
                        href === "/dashboard"
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-background/70 text-[color:var(--ink-soft)]"
                      }`}
                      href={href}
                      key={href}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </header>

              <div className="p-4 md:p-6">{children}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
