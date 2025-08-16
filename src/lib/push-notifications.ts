import webpush from "web-push"
import { prisma } from "./prisma"

// Configure VAPID keys
webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

export interface PushNotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

export async function sendPushNotification(userId: string, payload: PushNotificationPayload) {
  try {
    // Get user's push subscriptions
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    })

    if (subscriptions.length === 0) {
      console.log(`No push subscriptions found for user ${userId}`)
      return { success: false, reason: "No subscriptions" }
    }

    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || "/icons/icon-192x192.png",
      badge: payload.badge || "/icons/badge-72x72.png",
      image: payload.image,
      data: payload.data || {},
      actions: payload.actions || [],
    })

    // Send to all user's devices
    const results = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.p256dh,
                auth: subscription.auth,
              },
            },
            notificationPayload,
          )
          return { success: true, subscriptionId: subscription.id }
        } catch (error: any) {
          // Remove invalid subscriptions
          if (error.statusCode === 410 || error.statusCode === 404) {
            await prisma.pushSubscription.delete({
              where: { id: subscription.id },
            })
            console.log(`Removed invalid push subscription: ${subscription.id}`)
          }
          throw error
        }
      }),
    )

    const successful = results.filter((result) => result.status === "fulfilled").length
    const failed = results.filter((result) => result.status === "rejected").length

    console.log(`✅ Push notifications sent: ${successful} successful, ${failed} failed`)

    return {
      success: successful > 0,
      successful,
      failed,
      total: subscriptions.length,
    }
  } catch (error) {
    console.error("❌ Failed to send push notification:", error)
    return { success: false, error }
  }
}

// Predefined notification templates
export const pushNotificationTemplates = {
  pointsEarned: (points: number, wasteType: string): PushNotificationPayload => ({
    title: "Points Earned! 🎉",
    body: `You earned ${points} points for disposing ${wasteType.toLowerCase()} waste!`,
    icon: "/icons/points-icon.png",
    data: { type: "points_earned", points, wasteType },
    actions: [
      {
        action: "view_profile",
        title: "View Profile",
      },
    ],
  }),

  levelUp: (newLevel: number): PushNotificationPayload => ({
    title: "Level Up! 🚀",
    body: `Congratulations! You've reached Level ${newLevel}!`,
    icon: "/icons/level-up-icon.png",
    data: { type: "level_up", newLevel },
    actions: [
      {
        action: "view_achievements",
        title: "View Achievements",
      },
    ],
  }),

  rewardAvailable: (rewardName: string, pointsRequired: number): PushNotificationPayload => ({
    title: "New Reward Available! 🎁",
    body: `${rewardName} is now available for ${pointsRequired} points!`,
    icon: "/icons/reward-icon.png",
    data: { type: "reward_available", rewardName, pointsRequired },
    actions: [
      {
        action: "view_rewards",
        title: "View Rewards",
      },
    ],
  }),

  achievementUnlocked: (achievementName: string): PushNotificationPayload => ({
    title: "Achievement Unlocked! 🏆",
    body: `You've unlocked the "${achievementName}" achievement!`,
    icon: "/icons/achievement-icon.png",
    data: { type: "achievement_unlocked", achievementName },
    actions: [
      {
        action: "view_achievements",
        title: "View Achievements",
      },
    ],
  }),

  binNearby: (binName: string, distance: number): PushNotificationPayload => ({
    title: "Waste Bin Nearby! 📍",
    body: `${binName} is ${distance}m away from you`,
    icon: "/icons/bin-icon.png",
    data: { type: "bin_nearby", binName, distance },
    actions: [
      {
        action: "navigate",
        title: "Navigate",
      },
    ],
  }),

  campaignStarted: (campaignName: string): PushNotificationPayload => ({
    title: "New Campaign Started! 🌟",
    body: `Join the "${campaignName}" campaign and earn bonus points!`,
    icon: "/icons/campaign-icon.png",
    data: { type: "campaign_started", campaignName },
    actions: [
      {
        action: "view_campaign",
        title: "View Campaign",
      },
    ],
  }),
}

export async function subscribeToPushNotifications(
  userId: string,
  subscription: {
    endpoint: string
    keys: {
      p256dh: string
      auth: string
    }
  },
) {
  try {
    // Check if subscription already exists
    const existingSubscription = await prisma.pushSubscription.findFirst({
      where: {
        userId,
        endpoint: subscription.endpoint,
      },
    })

    if (existingSubscription) {
      return { success: true, subscriptionId: existingSubscription.id }
    }

    // Create new subscription
    const newSubscription = await prisma.pushSubscription.create({
      data: {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    })

    console.log(`✅ Push subscription created for user ${userId}`)
    return { success: true, subscriptionId: newSubscription.id }
  } catch (error) {
    console.error("❌ Failed to create push subscription:", error)
    return { success: false, error }
  }
}
