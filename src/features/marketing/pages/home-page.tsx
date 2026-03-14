import {
  ArrowRight,
  ChartBar,
  CheckCircle,
  ClockCountdown,
  HandCoins,
  Leaf,
  ShieldCheck,
  TrendUp,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  marketingHighlights,
  publicNavigation,
  supportedWasteTypes,
  trustPrinciples,
} from "@/features/marketing/content";

const dashboardMetrics = [
  { label: "Pickups completed", value: "1,284", delta: "+18%" },
  { label: "Verified this week", value: "462", delta: "+12%" },
  { label: "Points released", value: "92,400", delta: "+9%" },
];

const weeklyPickupBars = [
  { day: "Mon", height: 52 },
  { day: "Tue", height: 76 },
  { day: "Wed", height: 61 },
  { day: "Thu", height: 88 },
  { day: "Fri", height: 72 },
  { day: "Sat", height: 96 },
  { day: "Sun", height: 81 },
];

const operatingSignals = [
  {
    icon: ClockCountdown,
    title: "Pickup status stays visible",
    body: "Requested, assigned, on the way, collected, and verified are all tracked in one flow.",
  },
  {
    icon: ShieldCheck,
    title: "Review comes before value",
    body: "Collectors upload proof and staff checks it before points are released.",
  },
  {
    icon: HandCoins,
    title: "Rewards stay accountable",
    body: "Redemption requests are approved or fulfilled through the same operating workspace.",
  },
];

function HeroPreview() {
  return (
    <div className="reveal-up relative [animation-delay:120ms]">
      <div className="absolute inset-x-[18%] top-6 h-40 rounded-full bg-[radial-gradient(circle,_rgba(125,164,132,0.3),_transparent_68%)] blur-3xl" />
      <Card className="relative overflow-hidden rounded-[2.3rem] border-white/60 bg-white/88 shadow-[0_24px_90px_-44px_rgba(45,63,48,0.28)]">
        <CardContent className="p-4 md:p-5">
          <div className="rounded-[1.7rem] border border-border/70 bg-[linear-gradient(180deg,rgba(248,249,245,0.92),rgba(240,237,229,0.88))] p-4">
            <div className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-border/70 bg-white/82 px-4 py-3 shadow-[0_10px_35px_-28px_rgba(45,63,48,0.26)]">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Leaf size={18} weight="fill" />
                </span>
                <div>
                  <p className="font-medium text-foreground text-sm">
                    Recycly Ops
                  </p>
                  <p className="text-[color:var(--ink-faint)] text-xs">
                    Pickup-first recycling workspace
                  </p>
                </div>
              </div>
              <div className="hidden items-center gap-2 md:flex">
                {["Overview", "Pickups", "Rewards", "Support"].map((item) => (
                  <span
                    className="rounded-full px-3 py-1.5 text-[color:var(--ink-faint)] text-xs"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
                <span className="rounded-full bg-primary px-3 py-1.5 text-primary-foreground text-xs">
                  Open app
                </span>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[0.24fr_0.76fr]">
              <Card className="rounded-[1.6rem] border-white/80 bg-white/80">
                <CardContent className="space-y-3 p-4">
                  <div className="rounded-[1rem] bg-primary px-3 py-3 text-primary-foreground">
                    <p className="font-medium text-sm">Overview</p>
                  </div>
                  {[
                    "Pickup queue",
                    "Verification",
                    "Redemptions",
                    "Support",
                  ].map((item) => (
                    <div
                      className="rounded-[1rem] px-3 py-2 text-[color:var(--ink-soft)] text-sm"
                      key={item}
                    >
                      {item}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-3">
                  {dashboardMetrics.map((item) => (
                    <Card
                      className="rounded-[1.5rem] border-white/80 bg-white/86"
                      key={item.label}
                    >
                      <CardContent className="p-4">
                        <p className="text-[color:var(--ink-faint)] text-xs">
                          {item.label}
                        </p>
                        <div className="mt-2 flex items-end justify-between gap-3">
                          <p className="font-display font-semibold text-2xl tracking-tight">
                            {item.value}
                          </p>
                          <Badge variant="default">{item.delta}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                  <Card className="rounded-[1.7rem] border-white/80 bg-white/86">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <CardDescription>Pickup performance</CardDescription>
                          <CardTitle className="mt-2 text-2xl">
                            Weekly operations at a glance
                          </CardTitle>
                        </div>
                        <TrendUp
                          className="text-primary"
                          size={20}
                          weight="duotone"
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex h-44 items-end gap-3">
                        {weeklyPickupBars.map((item) => (
                          <div
                            className="flex flex-1 flex-col justify-end gap-2"
                            key={item.day}
                          >
                            <div
                              className="rounded-t-[1rem] bg-[linear-gradient(180deg,rgba(90,138,101,0.92),rgba(163,194,164,0.54))]"
                              style={{ height: `${item.height}%` }}
                            />
                            <span className="text-[0.65rem] text-[color:var(--ink-faint)]">
                              {item.day}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[1.7rem] border-white/80 bg-white/86">
                    <CardHeader className="pb-3">
                      <CardDescription>Live queue</CardDescription>
                      <CardTitle className="mt-2 text-xl">
                        Verification work
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        [
                          "Lekki Phase 1",
                          "Plastic and glass",
                          "Awaiting review",
                        ],
                        [
                          "Yaba",
                          "Mixed recyclables",
                          "Collector uploaded proof",
                        ],
                        [
                          "Surulere",
                          "Paper and cans",
                          "Points ready to release",
                        ],
                      ].map(([place, waste, status]) => (
                        <div
                          className="rounded-[1.2rem] border border-border/70 bg-background/60 px-4 py-3"
                          key={place}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-medium text-sm">{place}</p>
                              <p className="mt-1 text-[color:var(--ink-faint)] text-xs">
                                {waste}
                              </p>
                            </div>
                            <Badge variant="secondary">{status}</Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid min-h-[100dvh] w-full max-w-[1400px] gap-14 px-4 pt-10 pb-18 md:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:pt-16">
          <div className="reveal-up relative z-10">
            <Badge className="mb-6" variant="default">
              Lagos-first recycling operations
            </Badge>
            <h1 className="display-title max-w-4xl text-5xl text-foreground md:text-7xl">
              A recycling platform people can trust because the process stays
              visible.
            </h1>
            <p className="mt-6 max-w-[62ch] text-[color:var(--ink-soft)] text-base leading-8 md:text-lg">
              Recycly turns home pickup, verification, and rewards into one
              trackable product. Households book from home. Collectors upload
              proof. Staff checks the result. Points move after that.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                className={buttonVariants({
                  className:
                    "tactile h-12 rounded-full px-5 text-sm shadow-[0_20px_36px_-20px_rgba(58,102,69,0.75)]",
                  size: "lg",
                })}
                href="/sign-up"
              >
                Start recycling
                <ArrowRight size={16} weight="bold" />
              </Link>
              <Link
                className={buttonVariants({
                  className:
                    "tactile h-12 rounded-full border border-border/80 bg-card px-5 text-sm",
                  size: "lg",
                  variant: "outline",
                })}
                href="/dashboard"
              >
                Preview the dashboard
              </Link>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {operatingSignals.map(({ body, icon: Icon, title }) => (
                <Card
                  className="rounded-[1.7rem] border-white/70 bg-white/76"
                  key={title}
                >
                  <CardContent className="p-5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/12 text-primary">
                      <Icon size={20} weight="duotone" />
                    </span>
                    <h2 className="mt-4 font-display font-semibold text-xl tracking-tight">
                      {title}
                    </h2>
                    <p className="mt-3 text-[color:var(--ink-soft)] text-sm leading-7">
                      {body}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <HeroPreview />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-16 md:px-6">
        <div className="grid gap-14 lg:grid-cols-[0.86fr_1.14fr]">
          <div>
            <Badge variant="secondary">Why it works</Badge>
            <h2 className="display-title mt-5 max-w-xl text-4xl md:text-5xl">
              The product is designed around the handoff, not around slogans.
            </h2>
            <p className="mt-5 max-w-[56ch] text-[color:var(--ink-soft)] text-sm leading-8">
              Your references lean on product previews, crisp sections, and real
              software cues. Recycly should do the same, just with a greener,
              more grounded voice.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {marketingHighlights.map((item, index) => (
              <Card
                className={`rounded-[1.9rem] border-white/70 bg-white/78 ${index === 2 ? "md:col-span-2" : ""}`}
                key={item.title}
              >
                <CardContent className="p-6">
                  <Badge variant="secondary">Built for launch</Badge>
                  <h3 className="mt-4 font-display font-semibold text-2xl tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[color:var(--ink-soft)] text-sm leading-7">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-16 md:px-6">
        <Card className="overflow-hidden rounded-[2.4rem] border-white/70 bg-white/82">
          <CardContent className="grid gap-10 p-6 md:p-8 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <Badge variant="secondary">Supported waste</Badge>
              <h2 className="display-title mt-5 max-w-lg text-4xl md:text-5xl">
                A practical launch list for real households.
              </h2>
              <p className="mt-5 max-w-[54ch] text-[color:var(--ink-soft)] text-sm leading-8">
                Keep the categories simple enough to separate at home and
                structured enough to verify after collection.
              </p>
              <Separator className="my-6" />
              <div className="space-y-3">
                {trustPrinciples.map((item) => (
                  <div className="flex items-start gap-3" key={item}>
                    <CheckCircle
                      className="mt-0.5 shrink-0 text-primary"
                      size={18}
                      weight="fill"
                    />
                    <p className="text-[color:var(--ink-soft)] text-sm leading-7">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {supportedWasteTypes.map((item) => (
                <Card
                  className="rounded-[1.5rem] border-border/70 bg-background/55 shadow-none"
                  key={item}
                >
                  <CardContent className="p-4">
                    <p className="text-sm leading-7">{item}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-16 md:px-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {publicNavigation.map((item) => (
            <Card
              className="rounded-[1.8rem] border-white/70 bg-white/78"
              key={item.href}
            >
              <CardContent className="flex min-h-40 flex-col justify-between p-6">
                <div>
                  <Badge variant="secondary">Public page</Badge>
                  <h3 className="mt-4 font-display font-semibold text-2xl tracking-tight">
                    {item.label}
                  </h3>
                </div>
                <Link
                  className={buttonVariants({
                    className: "tactile h-10 rounded-full px-4 text-sm",
                    variant: "outline",
                  })}
                  href={item.href}
                >
                  Open page
                  <ChartBar size={16} weight="duotone" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
