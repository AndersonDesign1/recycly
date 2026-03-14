import {
  BellRing,
  CalendarClock,
  ChartColumn,
  LifeBuoy,
  MapPinned,
  PackageCheck,
  ShieldCheck,
  Ticket,
  Truck,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PickupProofUploader } from "@/features/dashboard/components/pickup-proof-uploader";
import {
  acceptAssignedPickup,
  createDispute,
  createPickupRequest,
  createRedemptionRequest,
  createReward,
  createSupportTicket,
  getCollectorDashboardData,
  getRecentNotifications,
  getStaffDashboardData,
  getSuperAdminDashboardData,
  getUserPickupHistory,
  getUserRewardsAndSupport,
  reviewRedemptionRequest,
  updateCollectorAvailability,
  updateDisputeStatus,
  updatePickupStatus,
  updateProfileRole,
  updateSupportTicketStatus,
  verifyPickupRequest,
} from "@/features/dashboard/server/actions";
import { publicNavigation } from "@/features/marketing/content";
import { type AppRole, roleLabels } from "@/lib/roles";
import { ensureProfile } from "@/server/auth/permissions";
import { db } from "@/server/db/client";

type UserPickup = Awaited<ReturnType<typeof getUserPickupHistory>>[number];
type UserRewardsSupport = Awaited<ReturnType<typeof getUserRewardsAndSupport>>;
type DashboardNotifications = Awaited<
  ReturnType<typeof getRecentNotifications>
>;

function formatDate(value: Date | null) {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function statusTone(status: string) {
  switch (status) {
    case "completed":
    case "verified":
    case "fulfilled":
    case "resolved":
      return "border border-emerald-200/70 bg-emerald-100/80 text-emerald-900";
    case "assigned":
    case "accepted":
    case "en_route":
    case "collected":
    case "pending":
    case "approved":
    case "in_review":
    case "escalated":
      return "border border-amber-200/70 bg-amber-100/80 text-amber-900";
    case "cancelled":
    case "rejected":
    case "closed":
      return "border border-orange-200/70 bg-orange-100/80 text-orange-900";
    default:
      return "border border-border bg-muted/80 text-foreground";
  }
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Wallet;
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <Card className="rounded-[1.5rem] border-white/70 bg-white/82">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardDescription className="font-semibold text-xs uppercase tracking-[0.22em]">
              {label}
            </CardDescription>
            <p className="mt-3 font-display font-semibold text-3xl tracking-tight">
              {value}
            </p>
          </div>
          <div className="rounded-full border border-border/70 bg-background/70 p-3">
            <Icon className="size-5 text-primary" />
          </div>
        </div>
        <p className="mt-3 text-muted-foreground text-sm">{hint}</p>
      </CardContent>
    </Card>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[1.5rem] border border-border border-dashed bg-background/55 p-6">
      <p className="font-medium text-sm">{title}</p>
      <p className="mt-2 text-muted-foreground text-sm leading-6">{body}</p>
    </div>
  );
}

function OpsKpiCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card className="rounded-[1.35rem] border-white/70 bg-white/78">
      <CardContent className="p-4">
        <p className="font-semibold text-muted-foreground text-xs uppercase tracking-[0.22em]">
          {label}
        </p>
        <p className="mt-3 font-display font-semibold text-3xl tracking-tight">
          {value}
        </p>
        <p className="mt-2 text-muted-foreground text-sm">{detail}</p>
      </CardContent>
    </Card>
  );
}

function OpsKpiStrip({
  metrics,
}: {
  metrics: {
    pickupCompletionRate: number;
    collectorAcceptanceRate: number;
    verificationTurnaroundHours: number;
    redemptionCompletionRate: number;
    openCaseCount: number;
  };
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-5">
      <OpsKpiCard
        detail="Share of pickups that reached verified or completed outcomes."
        label="Pickup completion"
        value={`${metrics.pickupCompletionRate}%`}
      />
      <OpsKpiCard
        detail="Assigned jobs that progressed into accepted or later states."
        label="Collector acceptance"
        value={`${metrics.collectorAcceptanceRate}%`}
      />
      <OpsKpiCard
        detail="Average hours between collection and successful verification."
        label="Verification turnaround"
        value={`${metrics.verificationTurnaroundHours || 0}h`}
      />
      <OpsKpiCard
        detail="Share of redemption requests that reached fulfilled status."
        label="Redemption completion"
        value={`${metrics.redemptionCompletionRate}%`}
      />
      <OpsKpiCard
        detail="Open tickets and disputes still waiting for operational action."
        label="Open cases"
        value={`${metrics.openCaseCount}`}
      />
    </section>
  );
}

function NotificationPanel({
  notifications,
}: {
  notifications: DashboardNotifications;
}) {
  return (
    <Card className="rounded-[2rem] border-white/70 bg-white/82">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge variant="secondary">In-app notifications</Badge>
            <h2 className="mt-3 font-display font-semibold text-2xl tracking-tight">
              Keep up with every operational update.
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2 font-medium text-xs">
            <BellRing className="size-4 text-primary" />
            {notifications.unreadCount} unread
          </div>
        </div>

        <div className="mt-5 grid gap-3 xl:grid-cols-2">
          {notifications.items.length ? (
            notifications.items.map((item) => (
              <article
                className="rounded-[1.35rem] border border-border/70 bg-background/50 p-4"
                key={item.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-2 text-muted-foreground text-sm leading-6">
                      {item.body}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 font-medium text-xs ${
                      item.readAt
                        ? "border border-border bg-muted/70 text-foreground"
                        : "border border-primary/20 bg-primary/12 text-primary"
                    }`}
                  >
                    {item.readAt ? "Seen" : "New"}
                  </span>
                </div>
                <p className="mt-3 text-muted-foreground text-xs">
                  {formatDate(item.createdAt)}
                </p>
              </article>
            ))
          ) : (
            <EmptyState
              body="Notifications will appear here when pickups, rewards, support, or verification events change."
              title="No notifications yet"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function UserPickupRequestSection({ city }: { city: string | null }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[2rem] border border-border bg-background/70 p-8">
        <p className="font-semibold text-primary text-sm uppercase tracking-[0.25em]">
          Schedule a pickup
        </p>
        <h2 className="mt-4 font-semibold text-2xl">
          Create your next recycling request
        </h2>
        <p className="mt-3 text-muted-foreground text-sm leading-7">
          Pick a waste category, choose a collection window, and Recycly will
          try to assign the nearest available collector in your city.
        </p>
      </div>

      <div className="rounded-[2rem] border border-border bg-card p-8">
        <form
          action={createPickupRequest}
          className="grid gap-4 md:grid-cols-2"
        >
          <label className="grid gap-2 text-sm">
            <span className="font-medium">Waste type</span>
            <select
              className="rounded-2xl border border-border bg-background px-4 py-3"
              name="wasteType"
              required
            >
              <option value="plastic">Plastic</option>
              <option value="paper">Paper</option>
              <option value="glass">Glass</option>
              <option value="metal">Metal</option>
              <option value="electronic">Electronic</option>
              <option value="textile">Textile</option>
              <option value="organic">Organic</option>
              <option value="mixed">Mixed</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-medium">Quantity estimate</span>
            <input
              className="rounded-2xl border border-border bg-background px-4 py-3"
              defaultValue="1"
              min="1"
              name="quantity"
              type="number"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-medium">Estimated weight (kg)</span>
            <input
              className="rounded-2xl border border-border bg-background px-4 py-3"
              min="0"
              name="estimatedWeightKg"
              placeholder="12.5"
              step="0.1"
              type="number"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-medium">Pickup window</span>
            <select
              className="rounded-2xl border border-border bg-background px-4 py-3"
              name="pickupWindowLabel"
              required
            >
              <option value="Morning (8am - 12pm)">Morning (8am - 12pm)</option>
              <option value="Afternoon (12pm - 4pm)">
                Afternoon (12pm - 4pm)
              </option>
              <option value="Evening (4pm - 7pm)">Evening (4pm - 7pm)</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-medium">Address line 1</span>
            <input
              className="rounded-2xl border border-border bg-background px-4 py-3"
              name="addressLine1"
              placeholder="12 Admiralty Way"
              required
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-medium">Address line 2</span>
            <input
              className="rounded-2xl border border-border bg-background px-4 py-3"
              name="addressLine2"
              placeholder="Apartment, estate, landmark"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-medium">City</span>
            <input
              className="rounded-2xl border border-border bg-background px-4 py-3"
              defaultValue={city ?? "Lagos"}
              name="city"
              required
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-medium">State</span>
            <input
              className="rounded-2xl border border-border bg-background px-4 py-3"
              defaultValue="Lagos"
              name="state"
              required
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-medium">Scheduled date and time</span>
            <input
              className="rounded-2xl border border-border bg-background px-4 py-3"
              name="scheduledFor"
              required
              type="datetime-local"
            />
          </label>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="font-medium">Notes</span>
            <textarea
              className="min-h-28 rounded-2xl border border-border bg-background px-4 py-3"
              name="notes"
              placeholder="Anything the collector should know before arriving"
            />
          </label>

          <button className={buttonVariants({ size: "lg" })} type="submit">
            Create pickup request
          </button>
        </form>
      </div>
    </section>
  );
}

function UserPickupHistorySection({ pickups }: { pickups: UserPickup[] }) {
  return (
    <section className="rounded-[2rem] border border-border bg-card p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-muted-foreground text-sm uppercase tracking-[0.25em]">
            Pickup history
          </p>
          <h2 className="mt-2 font-semibold text-2xl">Track every request</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-muted-foreground text-xs">
          <PackageCheck className="size-4" />
          {pickups.length} requests
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {pickups.length ? (
          pickups.map((pickup) => (
            <article
              className="rounded-[1.5rem] border border-border bg-background/70 p-5"
              key={pickup.id}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg capitalize">
                    {pickup.wasteType} pickup
                  </h3>
                  <p className="mt-1 text-muted-foreground text-sm">
                    {pickup.addressLine1}, {pickup.city}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 font-medium text-xs capitalize ${statusTone(
                    pickup.status
                  )}`}
                >
                  {pickup.status.replaceAll("_", " ")}
                </span>
              </div>
              <div className="mt-4 grid gap-3 text-muted-foreground text-sm md:grid-cols-3">
                <div className="flex items-center gap-2">
                  <CalendarClock className="size-4" />
                  {formatDate(pickup.scheduledFor)}
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="size-4" />
                  Window: {pickup.pickupWindowLabel ?? "Not set"}
                </div>
                <div className="flex items-center gap-2">
                  <MapPinned className="size-4" />
                  Qty {pickup.quantity ?? 1}
                  {pickup.estimatedWeightKg
                    ? ` • ${pickup.estimatedWeightKg}kg`
                    : ""}
                </div>
              </div>
            </article>
          ))
        ) : (
          <EmptyState
            body="Create your first request above to start the collection and verification flow."
            title="No pickups yet"
          />
        )}
      </div>
    </section>
  );
}

function UserRewardsAndCasesSection({
  rewardsAndSupport,
}: {
  rewardsAndSupport: UserRewardsSupport;
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <section className="rounded-[2rem] border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-muted-foreground text-sm uppercase tracking-[0.25em]">
                Rewards
              </p>
              <h2 className="mt-2 font-semibold text-xl">Redeem your points</h2>
            </div>
            <div className="rounded-full border border-border bg-background px-4 py-2 font-medium text-xs">
              {rewardsAndSupport.pointsBalance} pts
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {rewardsAndSupport.rewardCatalog.length ? (
              rewardsAndSupport.rewardCatalog.map((reward) => (
                <article
                  className="rounded-[1.25rem] border border-border bg-background/70 p-4"
                  key={reward.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{reward.title}</h3>
                      <p className="mt-1 text-muted-foreground text-sm">
                        {reward.description ?? "Reward ready for redemption."}
                      </p>
                    </div>
                    <div className="rounded-full border border-border bg-card px-3 py-1 font-medium text-xs">
                      {reward.pointsCost} pts
                    </div>
                  </div>

                  <form
                    action={createRedemptionRequest}
                    className="mt-4 grid gap-3"
                  >
                    <input name="rewardId" type="hidden" value={reward.id} />
                    <input
                      className="rounded-2xl border border-border bg-card px-4 py-3 text-sm"
                      name="payoutMethod"
                      placeholder="Bank transfer, wallet, voucher email"
                    />
                    <textarea
                      className="min-h-20 rounded-2xl border border-border bg-card px-4 py-3 text-sm"
                      name="notes"
                      placeholder="Optional payout note"
                    />
                    <button
                      className={buttonVariants({ variant: "outline" })}
                      type="submit"
                    >
                      Request redemption
                    </button>
                  </form>
                </article>
              ))
            ) : (
              <EmptyState
                body="A staff or super admin needs to create active rewards before redemption options appear here."
                title="No rewards configured yet"
              />
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-border bg-card p-6">
          <p className="font-semibold text-muted-foreground text-sm uppercase tracking-[0.25em]">
            Help and disputes
          </p>
          <h2 className="mt-2 font-semibold text-xl">Raise support fast</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <form
              action={createSupportTicket}
              className="grid gap-3 rounded-[1.25rem] border border-border bg-background/70 p-4"
            >
              <h3 className="font-medium">Support ticket</h3>
              <input
                className="rounded-2xl border border-border bg-card px-4 py-3 text-sm"
                name="subject"
                placeholder="Delayed pickup, redemption issue, collector no-show"
                required
              />
              <select
                className="rounded-2xl border border-border bg-card px-4 py-3 text-sm"
                defaultValue="medium"
                name="priority"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <textarea
                className="min-h-24 rounded-2xl border border-border bg-card px-4 py-3 text-sm"
                name="message"
                placeholder="Tell staff exactly what happened"
                required
              />
              <input
                className="rounded-2xl border border-border bg-card px-4 py-3 text-sm"
                name="pickupRequestId"
                placeholder="Optional pickup request ID"
              />
              <button
                className={buttonVariants({ variant: "outline" })}
                type="submit"
              >
                Submit support ticket
              </button>
            </form>

            <form
              action={createDispute}
              className="grid gap-3 rounded-[1.25rem] border border-border bg-background/70 p-4"
            >
              <h3 className="font-medium">Open dispute</h3>
              <input
                className="rounded-2xl border border-border bg-card px-4 py-3 text-sm"
                name="category"
                placeholder="Wrong points, missed items, rejection appeal"
                required
              />
              <textarea
                className="min-h-24 rounded-2xl border border-border bg-card px-4 py-3 text-sm"
                name="description"
                placeholder="Describe the dispute clearly"
                required
              />
              <input
                className="rounded-2xl border border-border bg-card px-4 py-3 text-sm"
                name="pickupRequestId"
                placeholder="Optional pickup request ID"
              />
              <button
                className={buttonVariants({ variant: "outline" })}
                type="submit"
              >
                Submit dispute
              </button>
            </form>
          </div>
        </section>
      </div>

      <div className="space-y-4">
        <article className="rounded-[2rem] border border-border bg-card p-6">
          <p className="font-semibold text-muted-foreground text-sm uppercase tracking-[0.25em]">
            Redemption history
          </p>
          <h2 className="mt-2 font-semibold text-xl">
            See every reward request
          </h2>
          <div className="mt-5 space-y-3">
            {rewardsAndSupport.redemptions.length ? (
              rewardsAndSupport.redemptions.map((redemption) => (
                <div
                  className="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-border bg-background/70 p-4"
                  key={redemption.id}
                >
                  <div>
                    <p className="font-medium">
                      {redemption.rewardTitle ?? "Reward request"}
                    </p>
                    <p className="mt-1 text-muted-foreground text-sm">
                      {redemption.pointsSpent} pts •{" "}
                      {formatDate(redemption.createdAt)}
                    </p>
                    {redemption.rejectionReason ? (
                      <p className="mt-1 text-rose-700 text-sm">
                        {redemption.rejectionReason}
                      </p>
                    ) : null}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 font-medium text-xs capitalize ${statusTone(
                      redemption.status
                    )}`}
                  >
                    {redemption.status.replaceAll("_", " ")}
                  </span>
                </div>
              ))
            ) : (
              <EmptyState
                body="Reward requests will show here once you spend points on an active reward."
                title="No redemption requests yet"
              />
            )}
          </div>
        </article>

        <article className="rounded-[2rem] border border-border bg-card p-6">
          <p className="font-semibold text-muted-foreground text-sm uppercase tracking-[0.25em]">
            Case snapshots
          </p>
          <h2 className="mt-2 font-semibold text-xl">Support and disputes</h2>
          <div className="mt-5 space-y-3">
            {rewardsAndSupport.tickets.map((ticket) => (
              <div
                className="rounded-[1.25rem] border border-border bg-background/70 p-4"
                key={ticket.id}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{ticket.subject}</p>
                  <span
                    className={`rounded-full px-3 py-1 font-medium text-xs capitalize ${statusTone(
                      ticket.status
                    )}`}
                  >
                    {ticket.status.replaceAll("_", " ")}
                  </span>
                </div>
                <p className="mt-2 text-muted-foreground text-sm">
                  {ticket.priority} priority • {formatDate(ticket.createdAt)}
                </p>
              </div>
            ))}

            {rewardsAndSupport.userDisputes.map((dispute) => (
              <div
                className="rounded-[1.25rem] border border-border bg-background/70 p-4"
                key={dispute.id}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{dispute.category}</p>
                  <span
                    className={`rounded-full px-3 py-1 font-medium text-xs capitalize ${statusTone(
                      dispute.status
                    )}`}
                  >
                    {dispute.status.replaceAll("_", " ")}
                  </span>
                </div>
                <p className="mt-2 text-muted-foreground text-sm">
                  {formatDate(dispute.createdAt)}
                </p>
                {dispute.resolution ? (
                  <p className="mt-2 text-muted-foreground text-sm">
                    {dispute.resolution}
                  </p>
                ) : null}
              </div>
            ))}

            {rewardsAndSupport.tickets.length ||
            rewardsAndSupport.userDisputes.length ? null : (
              <EmptyState
                body="Your support tickets and disputes will appear here once a case is created."
                title="No support tickets or disputes yet"
              />
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

async function UserDashboard({
  profileId,
  city,
}: {
  profileId: string;
  city: string | null;
}) {
  const [pickups, rewardsAndSupport] = await Promise.all([
    getUserPickupHistory(profileId),
    getUserRewardsAndSupport(profileId),
  ]);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          hint="Available for redemptions and reward requests."
          icon={Wallet}
          label="Points balance"
          value={rewardsAndSupport.pointsBalance}
        />
        <StatCard
          hint="Support and dispute records you can track from here."
          icon={Ticket}
          label="Open support items"
          value={
            rewardsAndSupport.tickets.length +
            rewardsAndSupport.userDisputes.length
          }
        />
        <StatCard
          hint="Pickup history moving through collection and verification."
          icon={PackageCheck}
          label="Pickup requests"
          value={pickups.length}
        />
      </section>
      <UserPickupRequestSection city={city} />
      <UserPickupHistorySection pickups={pickups} />
      <UserRewardsAndCasesSection rewardsAndSupport={rewardsAndSupport} />
    </div>
  );
}

async function CollectorDashboard({ profileId }: { profileId: string }) {
  const { collectorProfile, assignedRequests } =
    await getCollectorDashboardData(profileId);

  if (!collectorProfile) {
    redirect("/dashboard/onboarding");
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          hint="Keep this set to available to receive new matching jobs."
          icon={Truck}
          label="Availability"
          value={collectorProfile.availability.replaceAll("_", " ")}
        />
        <StatCard
          hint="Current city-based assignments waiting for action."
          icon={PackageCheck}
          label="Assigned jobs"
          value={assignedRequests.length}
        />
        <StatCard
          hint="Set your coverage area to influence future matching."
          icon={MapPinned}
          label="Coverage radius"
          value={`${collectorProfile.coverageRadiusKm} km`}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[2rem] border border-border bg-background/70 p-8">
          <p className="font-semibold text-primary text-sm uppercase tracking-[0.25em]">
            Collector control
          </p>
          <h2 className="mt-4 font-semibold text-2xl">
            Manage availability and route load
          </h2>
          <p className="mt-3 text-muted-foreground text-sm leading-7">
            Keep your availability current so new requests can be assigned to
            you. Assigned jobs move through accept, en route, collected, and
            completed here.
          </p>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-8">
          <form
            action={updateCollectorAvailability}
            className="grid gap-4 md:grid-cols-3"
          >
            <label className="grid gap-2 text-sm">
              <span className="font-medium">Availability</span>
              <select
                className="rounded-2xl border border-border bg-background px-4 py-3"
                defaultValue={collectorProfile.availability}
                name="availability"
              >
                <option value="offline">Offline</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
              </select>
            </label>

            <label className="grid gap-2 text-sm">
              <span className="font-medium">Vehicle type</span>
              <input
                className="rounded-2xl border border-border bg-background px-4 py-3"
                defaultValue={collectorProfile.vehicleType ?? ""}
                name="vehicleType"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="font-medium">Coverage radius</span>
              <input
                className="rounded-2xl border border-border bg-background px-4 py-3"
                defaultValue={collectorProfile.coverageRadiusKm}
                min="1"
                name="coverageRadiusKm"
                step="1"
                type="number"
              />
            </label>

            <button className={buttonVariants({ size: "lg" })} type="submit">
              Save collector settings
            </button>
          </form>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-muted-foreground text-sm uppercase tracking-[0.25em]">
              Assigned jobs
            </p>
            <h2 className="mt-2 font-semibold text-2xl">
              Work through your current pickups
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-muted-foreground text-xs">
            <Truck className="size-4" />
            {assignedRequests.length} assigned
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {assignedRequests.length ? (
            assignedRequests.map((pickup) => (
              <article
                className="space-y-4 rounded-[1.5rem] border border-border bg-background/70 p-5"
                key={pickup.id}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-lg capitalize">
                      {pickup.wasteType} pickup for{" "}
                      {pickup.requesterName ?? "user"}
                    </h3>
                    <p className="mt-1 text-muted-foreground text-sm">
                      {pickup.addressLine1}, {pickup.city}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 font-medium text-xs capitalize ${statusTone(
                      pickup.status
                    )}`}
                  >
                    {pickup.status.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="grid gap-3 text-muted-foreground text-sm md:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="size-4" />
                    {formatDate(pickup.scheduledFor)}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinned className="size-4" />
                    Window: {pickup.pickupWindowLabel ?? "Not set"}
                  </div>
                  <div className="flex items-center gap-2">
                    <PackageCheck className="size-4" />
                    Qty {pickup.quantity ?? 1}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {pickup.status === "assigned" ? (
                    <form action={acceptAssignedPickup}>
                      <input
                        name="pickupRequestId"
                        type="hidden"
                        value={pickup.id}
                      />
                      <button className={buttonVariants()} type="submit">
                        Accept pickup
                      </button>
                    </form>
                  ) : null}

                  {["accepted", "en_route", "collected"].includes(
                    pickup.status
                  ) ? (
                    <form
                      action={updatePickupStatus}
                      className="flex items-center gap-3"
                    >
                      <input
                        name="pickupRequestId"
                        type="hidden"
                        value={pickup.id}
                      />
                      <select
                        className="rounded-full border border-border bg-card px-4 py-2 text-xs"
                        defaultValue={pickup.status}
                        name="status"
                      >
                        <option value="accepted">Accepted</option>
                        <option value="en_route">En route</option>
                        <option value="collected">Collected</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        className={buttonVariants({ variant: "outline" })}
                        type="submit"
                      >
                        Update status
                      </button>
                    </form>
                  ) : null}
                </div>

                {["accepted", "en_route", "collected"].includes(
                  pickup.status
                ) ? (
                  <PickupProofUploader pickupRequestId={pickup.id} />
                ) : null}
              </article>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-border border-dashed bg-background/70 p-8 text-muted-foreground text-sm">
              No assigned collector jobs yet. Set your availability to available
              and new city-matched requests will start flowing here.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

async function StaffDashboard() {
  const {
    disputeQueue,
    opsKpis,
    pendingRedemptions,
    ticketQueue,
    verificationQueue,
  } = await getStaffDashboardData();

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard
          hint="Pickups waiting for review and point decisions."
          icon={ShieldCheck}
          label="Verification queue"
          value={verificationQueue.length}
        />
        <StatCard
          hint="Reward requests that need approval or fulfillment."
          icon={Wallet}
          label="Redemptions"
          value={pendingRedemptions.length}
        />
        <StatCard
          hint="Customer support requests needing attention."
          icon={LifeBuoy}
          label="Support tickets"
          value={ticketQueue.length}
        />
        <StatCard
          hint="Disputes that may need investigation or escalation."
          icon={Ticket}
          label="Disputes"
          value={disputeQueue.length}
        />
      </section>

      <OpsKpiStrip metrics={opsKpis} />

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[2rem] border border-border bg-card p-6">
          <p className="font-semibold text-muted-foreground text-sm uppercase tracking-[0.25em]">
            Verification queue
          </p>
          <h2 className="mt-2 font-semibold text-xl">
            Approve or reject pickups
          </h2>
          <div className="mt-5 space-y-3">
            {verificationQueue.length ? (
              verificationQueue.map((pickup) => (
                <div
                  className="rounded-[1.25rem] border border-border bg-background/70 p-4"
                  key={pickup.id}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium capitalize">
                        {pickup.wasteType} pickup for{" "}
                        {pickup.requesterName ?? "user"}
                      </p>
                      <p className="mt-1 text-muted-foreground text-sm">
                        {pickup.city} • Qty {pickup.quantity ?? 1} •{" "}
                        {formatDate(pickup.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 font-medium text-xs capitalize ${statusTone(
                        pickup.status
                      )}`}
                    >
                      {pickup.status.replaceAll("_", " ")}
                    </span>
                  </div>

                  <form
                    action={verifyPickupRequest}
                    className="mt-4 grid gap-3"
                  >
                    <input
                      name="pickupRequestId"
                      type="hidden"
                      value={pickup.id}
                    />
                    <select
                      className="rounded-2xl border border-border bg-card px-4 py-3 text-sm"
                      defaultValue="verified"
                      name="decision"
                    >
                      <option value="verified">Verify pickup</option>
                      <option value="rejected">Reject pickup</option>
                    </select>
                    <input
                      className="rounded-2xl border border-border bg-card px-4 py-3 text-sm"
                      name="pointsValue"
                      placeholder="Optional point override"
                      type="number"
                    />
                    <textarea
                      className="min-h-20 rounded-2xl border border-border bg-card px-4 py-3 text-sm"
                      name="reason"
                      placeholder="Reason or verification note"
                    />
                    <button
                      className={buttonVariants({ variant: "outline" })}
                      type="submit"
                    >
                      Submit decision
                    </button>
                  </form>
                </div>
              ))
            ) : (
              <div className="rounded-[1.25rem] border border-border border-dashed bg-background/70 p-5 text-muted-foreground text-sm">
                No pickups are waiting for verification.
              </div>
            )}
          </div>
        </article>

        <article className="rounded-[2rem] border border-border bg-card p-6">
          <p className="font-semibold text-muted-foreground text-sm uppercase tracking-[0.25em]">
            Redemption queue
          </p>
          <h2 className="mt-2 font-semibold text-xl">Review reward requests</h2>
          <div className="mt-5 space-y-3">
            {pendingRedemptions.length ? (
              pendingRedemptions.map((redemption) => (
                <div
                  className="rounded-[1.25rem] border border-border bg-background/70 p-4"
                  key={redemption.id}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">
                        {redemption.rewardTitle ?? "Reward"} for{" "}
                        {redemption.requesterName ?? "user"}
                      </p>
                      <p className="mt-1 text-muted-foreground text-sm">
                        {redemption.pointsSpent} pts •{" "}
                        {formatDate(redemption.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 font-medium text-xs capitalize ${statusTone(
                        redemption.status
                      )}`}
                    >
                      {redemption.status.replaceAll("_", " ")}
                    </span>
                  </div>

                  <form
                    action={reviewRedemptionRequest}
                    className="mt-4 grid gap-3"
                  >
                    <input
                      name="redemptionRequestId"
                      type="hidden"
                      value={redemption.id}
                    />
                    <select
                      className="rounded-2xl border border-border bg-card px-4 py-3 text-sm"
                      defaultValue={
                        redemption.status === "approved"
                          ? "fulfilled"
                          : "approved"
                      }
                      name="decision"
                    >
                      <option value="approved">Approve</option>
                      <option value="fulfilled">Mark fulfilled</option>
                      <option value="rejected">Reject</option>
                    </select>
                    <textarea
                      className="min-h-20 rounded-2xl border border-border bg-card px-4 py-3 text-sm"
                      name="reason"
                      placeholder="Optional review note"
                    />
                    <button
                      className={buttonVariants({ variant: "outline" })}
                      type="submit"
                    >
                      Update redemption
                    </button>
                  </form>
                </div>
              ))
            ) : (
              <div className="rounded-[1.25rem] border border-border border-dashed bg-background/70 p-5 text-muted-foreground text-sm">
                No redemption requests are waiting right now.
              </div>
            )}
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[2rem] border border-border bg-card p-6">
          <p className="font-semibold text-muted-foreground text-sm uppercase tracking-[0.25em]">
            Support queue
          </p>
          <h2 className="mt-2 font-semibold text-xl">
            Work through customer tickets
          </h2>
          <div className="mt-5 space-y-3">
            {ticketQueue.length ? (
              ticketQueue.map((ticket) => (
                <div
                  className="rounded-[1.25rem] border border-border bg-background/70 p-4"
                  key={ticket.id}
                >
                  <p className="font-medium">{ticket.subject}</p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    {ticket.priority} priority • {formatDate(ticket.createdAt)}
                  </p>
                  <p className="mt-2 text-muted-foreground text-sm">
                    {ticket.message}
                  </p>
                  <form
                    action={updateSupportTicketStatus}
                    className="mt-4 grid gap-3"
                  >
                    <input name="ticketId" type="hidden" value={ticket.id} />
                    <select
                      className="rounded-2xl border border-border bg-card px-4 py-3 text-sm"
                      defaultValue={ticket.status}
                      name="status"
                    >
                      <option value="open">Open</option>
                      <option value="in_review">In review</option>
                      <option value="escalated">Escalated</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button
                      className={buttonVariants({ variant: "outline" })}
                      type="submit"
                    >
                      Update ticket
                    </button>
                  </form>
                </div>
              ))
            ) : (
              <div className="rounded-[1.25rem] border border-border border-dashed bg-background/70 p-5 text-muted-foreground text-sm">
                No active support tickets.
              </div>
            )}
          </div>
        </article>

        <article className="rounded-[2rem] border border-border bg-card p-6">
          <p className="font-semibold text-muted-foreground text-sm uppercase tracking-[0.25em]">
            Dispute queue
          </p>
          <h2 className="mt-2 font-semibold text-xl">
            Resolve or escalate disputes
          </h2>
          <div className="mt-5 space-y-3">
            {disputeQueue.length ? (
              disputeQueue.map((dispute) => (
                <div
                  className="rounded-[1.25rem] border border-border bg-background/70 p-4"
                  key={dispute.id}
                >
                  <p className="font-medium">{dispute.category}</p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    {formatDate(dispute.createdAt)}
                  </p>
                  <p className="mt-2 text-muted-foreground text-sm">
                    {dispute.description}
                  </p>
                  <form
                    action={updateDisputeStatus}
                    className="mt-4 grid gap-3"
                  >
                    <input name="disputeId" type="hidden" value={dispute.id} />
                    <select
                      className="rounded-2xl border border-border bg-card px-4 py-3 text-sm"
                      defaultValue={dispute.status}
                      name="status"
                    >
                      <option value="open">Open</option>
                      <option value="in_review">In review</option>
                      <option value="escalated">Escalated</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                    <textarea
                      className="min-h-20 rounded-2xl border border-border bg-card px-4 py-3 text-sm"
                      name="resolution"
                      placeholder="Resolution or escalation note"
                    />
                    <button
                      className={buttonVariants({ variant: "outline" })}
                      type="submit"
                    >
                      Update dispute
                    </button>
                  </form>
                </div>
              ))
            ) : (
              <div className="rounded-[1.25rem] border border-border border-dashed bg-background/70 p-5 text-muted-foreground text-sm">
                No active disputes.
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}

async function SuperAdminDashboard() {
  const { opsKpis, rewardList, roleList } = await getSuperAdminDashboardData();

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          hint="Quality of launch operations across pickup, review, and rewards."
          icon={PackageCheck}
          label="Pickup completion"
          value={`${opsKpis.pickupCompletionRate}%`}
        />
        <StatCard
          hint="How often assigned work is being accepted by collectors."
          icon={ShieldCheck}
          label="Collector acceptance"
          value={`${opsKpis.collectorAcceptanceRate}%`}
        />
        <StatCard
          hint="Profiles currently stored in the system."
          icon={Truck}
          label="Total profiles"
          value={roleList.length}
        />
      </section>

      <OpsKpiStrip metrics={opsKpis} />

      <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <article className="rounded-[2rem] border border-border bg-card p-6">
          <p className="font-semibold text-muted-foreground text-sm uppercase tracking-[0.25em]">
            Reward controls
          </p>
          <h2 className="mt-2 font-semibold text-xl">
            Configure redemption options
          </h2>

          <form action={createReward} className="mt-5 grid gap-3">
            <input
              className="rounded-2xl border border-border bg-background px-4 py-3 text-sm"
              name="title"
              placeholder="Cashout to bank account"
              required
            />
            <input
              className="rounded-2xl border border-border bg-background px-4 py-3 text-sm"
              name="slug"
              placeholder="cashout-bank-account"
              required
            />
            <select
              className="rounded-2xl border border-border bg-background px-4 py-3 text-sm"
              defaultValue="cashout"
              name="type"
            >
              <option value="cashout">Cashout</option>
              <option value="voucher">Voucher</option>
              <option value="partner_reward">Partner reward</option>
            </select>
            <input
              className="rounded-2xl border border-border bg-background px-4 py-3 text-sm"
              min="1"
              name="pointsCost"
              placeholder="500"
              required
              type="number"
            />
            <input
              className="rounded-2xl border border-border bg-background px-4 py-3 text-sm"
              min="0"
              name="cashValueMinor"
              placeholder="500000 for NGN 5,000.00"
              type="number"
            />
            <textarea
              className="min-h-24 rounded-2xl border border-border bg-background px-4 py-3 text-sm"
              name="description"
              placeholder="Explain what the user gets and how fulfillment works."
            />
            <button className={buttonVariants()} type="submit">
              Create reward
            </button>
          </form>

          <div className="mt-5 space-y-3">
            {rewardList.map((reward) => (
              <div
                className="rounded-[1.25rem] border border-border bg-background/70 p-4"
                key={reward.id}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{reward.title}</p>
                  <span className="rounded-full border border-border bg-card px-3 py-1 font-medium text-xs">
                    {reward.pointsCost} pts
                  </span>
                </div>
                <p className="mt-2 text-muted-foreground text-sm">
                  {reward.description ?? "No description provided."}
                </p>
              </div>
            ))}

            {rewardList.length ? null : (
              <div className="rounded-[1.25rem] border border-border border-dashed bg-background/70 p-5 text-muted-foreground text-sm">
                No rewards created yet.
              </div>
            )}
          </div>
        </article>

        <article className="rounded-[2rem] border border-border bg-card p-6">
          <p className="font-semibold text-muted-foreground text-sm uppercase tracking-[0.25em]">
            Access controls
          </p>
          <h2 className="mt-2 font-semibold text-xl">
            Manage roles and operational access
          </h2>

          <div className="mt-5 space-y-3">
            {roleList.map((entry) => (
              <div
                className="rounded-[1.25rem] border border-border bg-background/70 p-4"
                key={entry.id}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {entry.fullName ?? "Unnamed profile"}
                    </p>
                    <p className="mt-1 text-muted-foreground text-sm">
                      {entry.email} • {entry.city ?? "No city"} •{" "}
                      {entry.onboardingCompleted
                        ? "Onboarded"
                        : "Not onboarded"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 font-medium text-xs ${statusTone(
                      entry.onboardingCompleted ? "verified" : "pending"
                    )}`}
                  >
                    {roleLabels[entry.role as AppRole]}
                  </span>
                </div>

                <form
                  action={updateProfileRole}
                  className="mt-4 flex flex-wrap items-center gap-3"
                >
                  <input name="profileId" type="hidden" value={entry.id} />
                  <select
                    className="rounded-full border border-border bg-card px-4 py-2 text-xs"
                    defaultValue={entry.role}
                    name="role"
                  >
                    <option value="user">User</option>
                    <option value="collector">Collector</option>
                    <option value="staff">Staff</option>
                    <option value="super_admin">Super admin</option>
                  </select>
                  <button
                    className={buttonVariants({ variant: "outline" })}
                    type="submit"
                  >
                    Update role
                  </button>
                </form>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

export default async function DashboardPage() {
  const profile = await ensureProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  if (!db) {
    throw new Error("Database is not configured.");
  }

  if (
    !profile.onboardingCompleted &&
    (profile.role === "user" || profile.role === "collector")
  ) {
    redirect("/dashboard/onboarding");
  }

  const notifications = await getRecentNotifications(profile.id);

  return (
    <main className="space-y-8">
      <Card className="rounded-[2.2rem] border-white/70 bg-white/84">
        <CardContent className="p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge variant="default">Dashboard</Badge>
              <h1 className="mt-4 font-display font-semibold text-3xl tracking-tight md:text-4xl">
                {profile.fullName ?? "Welcome"}, here is the live operating
                picture.
              </h1>
              <p className="mt-4 max-w-2xl text-[color:var(--ink-soft)] text-sm leading-7">
                Pickups, rewards, support work, disputes, and notifications all
                stay in one place so the next action is easier to spot.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge variant="secondary">
                  Role: {roleLabels[profile.role]}
                </Badge>
                <Badge variant="secondary">Queues connected</Badge>
              </div>
            </div>
            <div className="space-y-3 sm:text-right">
              <div className="flex flex-wrap gap-3 sm:justify-end">
                <Link
                  className={buttonVariants({
                    className: "tactile rounded-full px-4 text-sm",
                    variant: "outline",
                  })}
                  href="/docs"
                >
                  Read the docs
                </Link>
                <Link
                  className={buttonVariants({
                    className: "tactile rounded-full px-4 text-sm",
                    variant: "outline",
                  })}
                  href={publicNavigation[0]?.href ?? "/how-it-works"}
                >
                  <ChartColumn className="size-4" />
                  Launch guide
                </Link>
              </div>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="grid gap-3 md:grid-cols-3">
            <Card className="rounded-[1.4rem] border-border/70 bg-background/55 shadow-none">
              <CardContent className="p-4">
                <p className="text-[color:var(--ink-faint)] text-xs uppercase tracking-[0.22em]">
                  Workspace focus
                </p>
                <p className="mt-2 font-display font-semibold text-xl tracking-tight">
                  Pickups, verification, and case resolution
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-[1.4rem] border-border/70 bg-background/55 shadow-none">
              <CardContent className="p-4">
                <p className="text-[color:var(--ink-faint)] text-xs uppercase tracking-[0.22em]">
                  Product view
                </p>
                <p className="mt-2 font-display font-semibold text-xl tracking-tight">
                  Shared by households and ops teams
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-[1.4rem] border-border/70 bg-background/55 shadow-none">
              <CardContent className="p-4">
                <p className="text-[color:var(--ink-faint)] text-xs uppercase tracking-[0.22em]">
                  Guidance
                </p>
                <p className="mt-2 font-display font-semibold text-xl tracking-tight">
                  Docs and help pages stay one click away
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <NotificationPanel notifications={notifications} />

      {profile.role === "collector" ? (
        <CollectorDashboard profileId={profile.id} />
      ) : null}
      {profile.role === "user" ? (
        <UserDashboard city={profile.city} profileId={profile.id} />
      ) : null}
      {profile.role === "staff" ? <StaffDashboard /> : null}
      {profile.role === "super_admin" ? <SuperAdminDashboard /> : null}
    </main>
  );
}
