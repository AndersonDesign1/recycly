"use client";

import type React from "react";
import { useEffect, useId, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// ── Icons ──────────────────────────────────────────────────────────────────
const HomeIcon = () => (
  <svg
    aria-hidden="true"
    className="size-4"
    fill="none"
    focusable="false"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
  >
    <path
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const CalendarIcon = () => (
  <svg
    aria-hidden="true"
    className="size-4"
    fill="none"
    focusable="false"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
  >
    <path
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const GiftIcon = () => (
  <svg
    aria-hidden="true"
    className="size-4"
    fill="none"
    focusable="false"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
  >
    <path
      d="M20 12v10H4V12M2 7h20v5H2zM12 22V7m0 0a2 2 0 01-2-2V3m2 4a2 2 0 002-2V3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const LayersIcon = () => (
  <svg
    aria-hidden="true"
    className="size-4"
    fill="none"
    focusable="false"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
  >
    <path
      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const UserIcon = () => (
  <svg
    aria-hidden="true"
    className="size-4"
    fill="none"
    focusable="false"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
  >
    <path
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const CheckIcon = () => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={9}
    stroke="white"
    strokeWidth={3}
    viewBox="0 0 24 24"
    width={9}
  >
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg
    aria-hidden="true"
    className="size-3"
    fill="none"
    focusable="false"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
  >
    <path
      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Count-up hook ──────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800): number {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>(0);
  useEffect(() => {
    let start = 0,
      last = 0;
    const step = target / 60,
      t = duration / 60;
    const run = (ts: number) => {
      if (!last) {
        last = ts;
      }
      start = Math.min(start + step * ((ts - last) / t), target);
      last = ts;
      setCount(Math.floor(start));
      if (start < target) {
        frameRef.current = requestAnimationFrame(run);
      } else {
        setCount(target);
      }
    };
    const timer = setTimeout(() => {
      frameRef.current = requestAnimationFrame(run);
    }, 350);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration]);
  return count;
}

// ── Data ───────────────────────────────────────────────────────────────────
const sparkData = [
  { v: 180 },
  { v: 220 },
  { v: 195 },
  { v: 280 },
  { v: 310 },
  { v: 270 },
  { v: 390 },
  { v: 460 },
];
const histData = [
  { w: "Feb 3", pts: 240 },
  { w: "Feb 10", pts: 310 },
  { w: "Feb 17", pts: 280 },
  { w: "Feb 24", pts: 420 },
  { w: "Mar 3", pts: 390 },
  { w: "Mar 10", pts: 510 },
  { w: "Mar 17", pts: 480 },
  { w: "Mar 24", pts: 640 },
];
const matData = [
  { name: "Plastic", value: 46, color: "oklch(0.6 0.15 151)" },
  { name: "Glass", value: 28, color: "oklch(0.45 0.12 151)" },
  { name: "Paper", value: 16, color: "oklch(0.75 0.13 151)" },
  { name: "Cans", value: 10, color: "oklch(0.85 0.08 151)" },
];
const navItems = [
  { label: "Overview", icon: <HomeIcon />, badge: null },
  { label: "Pickups", icon: <CalendarIcon />, badge: "2" },
  { label: "Rewards", icon: <GiftIcon />, badge: null },
  { label: "Materials", icon: <LayersIcon />, badge: null },
  { label: "Profile", icon: <UserIcon />, badge: null },
];
const timelineItems = [
  {
    status: "confirmed" as const,
    title: "Estate pickup",
    time: "Tomorrow, 09:30 AM",
    detail: "6 sorted bags, stair access.",
  },
  {
    status: "preparing" as const,
    title: "Office drop consolidation",
    time: "Thursday, 03:00 PM",
    detail: "Awaiting carton count.",
  },
];

const streakCells = Array.from({ length: 10 }, (_, index) => ({
  filled: index < 7,
  id: `streak-${index + 1}`,
  opacity: index < 7 ? 0.4 + index * 0.085 : 1,
}));
interface Task {
  desc: string;
  done: boolean;
  id: number;
  priority: boolean;
  text: string;
}
const initialTasks: Task[] = [
  {
    id: 1,
    text: "Sort one more bag before pickup",
    desc: "Add the mixed paper bundle before 8 AM.",
    priority: true,
    done: false,
  },
  {
    id: 2,
    text: "Review reward catalog",
    desc: "Close to a home essentials voucher.",
    priority: false,
    done: false,
  },
];

const materialMixFormatter: NonNullable<
  React.ComponentProps<typeof Tooltip>["formatter"]
> = (value, name) => [`${value ?? 0}%`, String(name ?? "")];

// ── Tooltip ────────────────────────────────────────────────────────────────
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (!(active && payload?.length)) {
    return null;
  }
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="mb-0.5 font-sans text-[11px] text-muted-foreground">
        {label}
      </p>
      <p className="font-data font-semibold text-[13px] text-primary">
        {payload[0].value.toLocaleString()} pts
      </p>
    </div>
  );
};

// ── Recycly Sidebar ────────────────────────────────────────────────────────
function RecyclySidebar({
  activeNav,
  setActiveNav,
}: {
  activeNav: string;
  setActiveNav: (v: string) => void;
}) {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="border-sidebar-border border-b px-4 py-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <span className="font-semibold text-[13.5px] text-sidebar-foreground tracking-tight">
            Recycly
          </span>
          <span className="ml-auto rounded border border-primary/20 bg-primary/10 px-1.5 py-0.5 font-data font-medium text-[10px] text-primary leading-none">
            Live
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  isActive={activeNav === item.label}
                  onClick={() => setActiveNav(item.label)}
                  tooltip={item.label}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </SidebarMenuButton>
                {item.badge && (
                  <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border border-t p-3">
        <div className="flex items-center gap-2.5 px-1">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/15 font-bold text-[11px] text-primary">
            JO
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-[12.5px] text-sidebar-foreground leading-none">
              Joshua O.
            </p>
            <p className="mt-1 truncate text-[11px] text-muted-foreground">
              Premium tier
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function RecyclyDashboard() {
  const gradientId = useId();
  const sparkGradientId = `${gradientId}-sg`;
  const historyGradientId = `${gradientId}-hg`;
  const pts = useCountUp(3240, 1800);
  const streak = useCountUp(7, 1200);
  const [progWidth, setProgWidth] = useState("0%");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeNav, setActiveNav] = useState("Overview");

  useEffect(() => {
    const timeout = setTimeout(() => setProgWidth("64.8%"), 600);
    return () => clearTimeout(timeout);
  }, []);

  const toggleTask = (id: number) =>
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );

  const doneCount = tasks.filter((task) => task.done).length;

  return (
    <SidebarProvider>
      <RecyclySidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <main className="flex min-h-screen flex-1 flex-col overflow-hidden bg-background">
        {/* ── Topbar ────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-border border-b bg-card/80 px-6 py-3.5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-muted-foreground transition-colors hover:text-foreground" />
            <div className="h-4 w-px bg-border" />
            <div>
              <h1 className="font-semibold text-[14.5px] text-foreground leading-none tracking-tight">
                Good afternoon, Joshua
              </h1>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                Next pickup confirmed · reward balance on track
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 font-medium text-[12.5px] text-foreground transition-colors hover:bg-secondary"
              type="button"
            >
              View history
            </button>
            <button
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 font-medium text-[12.5px] text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              type="button"
            >
              Schedule pickup
              <ArrowRightIcon />
            </button>
          </div>
        </header>

        {/* ── Content ───────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1180px] space-y-5 px-6 py-6 pb-16">
            {/* ── Stat cards ──────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-4">
              {/* Next Pickup */}
              <div
                className="group relative animate-fade-up overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
                style={{ "--stagger": 0 } as React.CSSProperties}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-semibold text-[10.5px] text-muted-foreground uppercase tracking-widest">
                    Next pickup
                  </span>
                  <span className="rounded border border-primary/20 bg-primary/8 px-2 py-0.5 font-data font-semibold text-[10px] text-primary">
                    Scheduled
                  </span>
                </div>
                <div className="font-data font-semibold text-[34px] text-foreground leading-none tracking-tight">
                  24
                  <span className="mx-0.5 font-normal text-[16px] text-muted-foreground">
                    h
                  </span>
                  12
                  <span className="ml-0.5 font-normal text-[16px] text-muted-foreground">
                    m
                  </span>
                </div>
                <p className="mt-2 text-[12px] text-muted-foreground">
                  Tomorrow, 09:30 AM · Estate Route
                </p>
                {/* accent strip */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
              </div>

              {/* Verified Points */}
              <div
                className="group relative animate-fade-up overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
                style={{ "--stagger": 1 } as React.CSSProperties}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-semibold text-[10.5px] text-muted-foreground uppercase tracking-widest">
                    Verified points
                  </span>
                </div>
                <div className="font-data font-semibold text-[34px] text-foreground leading-none tracking-tight">
                  {pts.toLocaleString()}
                </div>
                <p className="mt-2 text-[12px] text-muted-foreground">
                  <span className="font-semibold text-primary">+120</span>{" "}
                  earned this week
                </p>
                {/* Background sparkline */}
                <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-14 opacity-[0.12] transition-opacity group-hover:opacity-25">
                  <ResponsiveContainer height="100%" width="100%">
                    <AreaChart
                      data={sparkData}
                      margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id={sparkGradientId}
                          x1="0"
                          x2="0"
                          y1="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="oklch(0.6 0.15 151)"
                            stopOpacity={1}
                          />
                          <stop
                            offset="100%"
                            stopColor="oklch(0.6 0.15 151)"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        animationDuration={1200}
                        dataKey="v"
                        dot={false}
                        fill={`url(#${sparkGradientId})`}
                        isAnimationActive
                        stroke="oklch(0.6 0.15 151)"
                        strokeWidth={1.5}
                        type="monotone"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
              </div>

              {/* Current Streak */}
              <div
                className="group relative animate-fade-up overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
                style={{ "--stagger": 2 } as React.CSSProperties}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-semibold text-[10.5px] text-muted-foreground uppercase tracking-widest">
                    Current streak
                  </span>
                </div>
                {/* contribution-style squares */}
                <div className="mb-2.5 flex gap-1">
                  {streakCells.map((cell) => (
                    <div
                      className="h-5 w-5 rounded-[3px] border"
                      key={cell.id}
                      style={{
                        background: cell.filled
                          ? "oklch(0.6 0.15 151)"
                          : "oklch(0.6 0.15 151 / 0.15)",
                        borderColor: cell.filled
                          ? "oklch(0.5 0.15 151)"
                          : "oklch(0.6 0.15 151 / 0.2)",
                        opacity: cell.opacity,
                      }}
                    />
                  ))}
                </div>
                <div className="font-data font-semibold text-[34px] text-foreground leading-none tracking-tight">
                  {streak}
                  <span className="ml-1.5 font-normal font-sans text-[15px] text-muted-foreground">
                    weeks
                  </span>
                </div>
                <p className="mt-2 text-[12px] text-muted-foreground">
                  Consistency pays off
                </p>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
              </div>
            </div>

            {/* ── Body grid: 2/3 + 1/3 ────────────────────────────── */}
            <div className="grid grid-cols-[1fr_320px] gap-4">
              {/* Left col */}
              <div className="space-y-4">
                {/* Pickup Timeline */}
                <div
                  className="animate-fade-up rounded-xl border border-border bg-card px-5 py-5"
                  style={{ "--stagger": 3 } as React.CSSProperties}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="font-semibold text-[13px] text-foreground tracking-tight">
                      Pickup overview
                    </h2>
                    <button
                      className="flex items-center gap-1 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
                      type="button"
                    >
                      View all <ArrowRightIcon />
                    </button>
                  </div>
                  <div className="relative pl-5">
                    {/* dashed vertical line */}
                    <div
                      className="absolute top-2 bottom-2 left-[5px] w-px"
                      style={{
                        background:
                          "repeating-linear-gradient(to bottom, oklch(0.92 0.008 90) 0, oklch(0.92 0.008 90) 4px, transparent 4px, transparent 8px)",
                      }}
                    />
                    {timelineItems.map((item) => (
                      <div className="relative pb-5 last:pb-0" key={item.title}>
                        {/* dot */}
                        <div
                          className={`absolute top-[5px] -left-[19px] size-[10px] rounded-full border-2 border-card ${
                            item.status === "confirmed"
                              ? "bg-primary shadow-[0_0_0_3px_oklch(0.6_0.15_151/0.15)]"
                              : "bg-muted-foreground/40"
                          }`}
                        />
                        <div className="mb-1.5 flex items-baseline justify-between">
                          <span className="font-medium text-[13px] text-foreground">
                            {item.title}
                          </span>
                          <span className="font-data text-[11px] text-muted-foreground">
                            {item.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded px-1.5 py-0.5 font-data font-semibold text-[9.5px] uppercase tracking-wider ${
                              item.status === "confirmed"
                                ? "border border-primary/20 bg-primary/10 text-primary"
                                : "border border-border bg-secondary text-muted-foreground"
                            }`}
                          >
                            {item.status}
                          </span>
                          <span className="text-[12px] text-muted-foreground">
                            {item.detail}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Points History */}
                <div
                  className="animate-fade-up rounded-xl border border-border bg-card px-5 py-5"
                  style={{ "--stagger": 4 } as React.CSSProperties}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-semibold text-[13px] text-foreground tracking-tight">
                      Points history
                    </h2>
                    <div className="flex items-center gap-1.5">
                      <span className="size-1.5 animate-pulse-dot rounded-full bg-primary" />
                      <span className="text-[12px] text-muted-foreground">
                        Last 8 weeks
                      </span>
                    </div>
                  </div>
                  <div style={{ height: 190 }}>
                    <ResponsiveContainer height="100%" width="100%">
                      <AreaChart
                        data={histData}
                        margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id={historyGradientId}
                            x1="0"
                            x2="0"
                            y1="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="oklch(0.6 0.15 151)"
                              stopOpacity={0.16}
                            />
                            <stop
                              offset="95%"
                              stopColor="oklch(0.6 0.15 151)"
                              stopOpacity={0.01}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          stroke="oklch(0.92 0.008 90)"
                          strokeDasharray="0"
                          strokeWidth={0.5}
                          vertical={false}
                        />
                        <XAxis
                          axisLine={false}
                          dataKey="w"
                          tick={{
                            fontSize: 10,
                            fill: "oklch(0.55 0.01 90)",
                            fontFamily: "var(--font-data)",
                          }}
                          tickLine={false}
                        />
                        <YAxis
                          axisLine={false}
                          tick={{
                            fontSize: 10,
                            fill: "oklch(0.55 0.01 90)",
                            fontFamily: "var(--font-data)",
                          }}
                          tickLine={false}
                        />
                        <Tooltip
                          content={<CustomTooltip />}
                          cursor={{
                            stroke: "oklch(0.92 0.008 90)",
                            strokeWidth: 1,
                            strokeDasharray: "4 4",
                          }}
                        />
                        <Area
                          activeDot={{
                            r: 4,
                            fill: "oklch(0.6 0.15 151)",
                            strokeWidth: 0,
                          }}
                          animationDuration={1000}
                          dataKey="pts"
                          dot={false}
                          fill={`url(#${historyGradientId})`}
                          isAnimationActive
                          stroke="oklch(0.6 0.15 151)"
                          strokeWidth={1.5}
                          type="monotone"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  {/* mini stat row */}
                  <div className="mt-3 grid grid-cols-3 gap-3 border-border border-t pt-3">
                    {[
                      { label: "Total earned", value: "4,270" },
                      { label: "Best week", value: "640" },
                      { label: "Avg / week", value: "409" },
                    ].map((s) => (
                      <div key={s.label}>
                        <p className="text-[10.5px] text-muted-foreground">
                          {s.label}
                        </p>
                        <p className="mt-0.5 font-data font-semibold text-[15px] text-foreground">
                          {s.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right col */}
              <div className="space-y-4">
                {/* Reward Progress */}
                <div
                  className="animate-fade-up rounded-xl border border-border bg-card p-5"
                  style={{ "--stagger": 3 } as React.CSSProperties}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h2 className="font-semibold text-[13px] text-foreground tracking-tight">
                        Nearest reward
                      </h2>
                      <p className="mt-0.5 text-[12px] text-muted-foreground">
                        Grocery voucher
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-data font-semibold text-[20px] text-foreground leading-none">
                        {pts.toLocaleString()}
                      </p>
                      <p className="mt-0.5 font-data text-[11px] text-muted-foreground">
                        / 5,000 pts
                      </p>
                    </div>
                  </div>
                  {/* Progress */}
                  <div className="relative mb-2">
                    <div className="h-1.5 w-full overflow-visible rounded-full border border-border bg-secondary">
                      <div
                        className="relative h-full rounded-full bg-primary transition-[width] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{ width: progWidth }}
                      >
                        {/* end cap dot */}
                        <span className="absolute -top-[3px] -right-1 size-3 rounded-full border-2 border-card bg-primary shadow-[0_0_0_2px_oklch(0.6_0.15_151/0.25)]" />
                      </div>
                    </div>
                  </div>
                  <p className="flex items-center gap-1 text-[11.5px] text-muted-foreground">
                    <ArrowRightIcon /> 1,760 points to unlock
                  </p>
                </div>

                {/* Material Mix */}
                <div
                  className="animate-fade-up rounded-xl border border-border bg-card p-5"
                  style={{ "--stagger": 4 } as React.CSSProperties}
                >
                  <h2 className="mb-4 font-semibold text-[13px] text-foreground tracking-tight">
                    Material mix
                  </h2>
                  <div className="relative" style={{ height: 154 }}>
                    <ResponsiveContainer height="100%" width="100%">
                      <PieChart>
                        <Tooltip
                          contentStyle={{
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            fontSize: 12,
                            fontFamily: "var(--font-data)",
                          }}
                          formatter={materialMixFormatter}
                        />
                        <Pie
                          animationBegin={200}
                          animationDuration={900}
                          cx="50%"
                          cy="50%"
                          data={matData}
                          dataKey="value"
                          innerRadius={48}
                          isAnimationActive
                          outerRadius={68}
                          paddingAngle={2}
                          stroke="none"
                        >
                          {matData.map((entry) => (
                            <Cell fill={entry.color} key={entry.name} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <p className="font-data font-semibold text-[20px] text-foreground leading-none">
                        46%
                      </p>
                      <p className="mt-1 text-[10.5px] text-muted-foreground">
                        Plastic
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
                    {matData.map((m) => (
                      <div className="flex items-center gap-1.5" key={m.name}>
                        <div
                          className="size-2 flex-shrink-0 rounded-[2px]"
                          style={{ background: m.color }}
                        />
                        <span className="flex-1 truncate text-[11.5px] text-muted-foreground">
                          {m.name}
                        </span>
                        <span className="font-data font-medium text-[11.5px] text-foreground">
                          {m.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Actions */}
                <div
                  className="animate-fade-up rounded-xl border border-border bg-card p-5"
                  style={{ "--stagger": 5 } as React.CSSProperties}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-semibold text-[13px] text-foreground tracking-tight">
                      Next actions
                    </h2>
                    <span className="rounded border border-border bg-secondary px-2 py-0.5 font-data text-[10.5px] text-muted-foreground">
                      {doneCount}/{tasks.length} done
                    </span>
                  </div>
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <button
                        className="group flex w-full select-none items-start gap-2.5 rounded-lg border border-border bg-background p-3 text-left transition-all hover:border-primary/30 hover:bg-card"
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        type="button"
                      >
                        <div
                          className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-all ${
                            task.done
                              ? "border-primary bg-primary"
                              : "border-border bg-card group-hover:border-primary/50"
                          }`}
                        >
                          {task.done && <CheckIcon />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`font-medium text-[12.5px] leading-snug transition-colors ${task.done ? "text-muted-foreground line-through" : "text-foreground"}`}
                          >
                            {task.text}
                          </p>
                          <p
                            className={`mt-0.5 text-[11.5px] transition-colors ${task.done ? "text-muted-foreground/60" : "text-muted-foreground"}`}
                          >
                            {task.desc}
                          </p>
                        </div>
                        {task.priority && !task.done && (
                          <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
