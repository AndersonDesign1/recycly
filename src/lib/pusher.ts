import Pusher from "pusher"
import PusherClient from "pusher-js"

// Server-side Pusher instance
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
})

// Client-side Pusher instance
export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  authEndpoint: "/api/pusher/auth",
  auth: {
    headers: {
      "Content-Type": "application/json",
    },
  },
})

// Pusher channel names
export const PUSHER_CHANNELS = {
  USER_NOTIFICATIONS: (userId: string) => `user-${userId}`,
  WASTE_BIN_UPDATES: (binId: string) => `waste-bin-${binId}`,
  ADMIN_ALERTS: "admin-alerts",
  GLOBAL_ANNOUNCEMENTS: "global-announcements",
} as const

// Pusher event names
export const PUSHER_EVENTS = {
  POINTS_EARNED: "points-earned",
  LEVEL_UP: "level-up",
  REWARD_AVAILABLE: "reward-available",
  ACHIEVEMENT_UNLOCKED: "achievement-unlocked",
  BIN_STATUS_CHANGED: "bin-status-changed",
  NEW_REPORT: "new-report",
  CAMPAIGN_STARTED: "campaign-started",
  NOTIFICATION: "notification",
} as const

// Helper functions for sending real-time updates
export async function sendUserNotification(userId: string, event: string, data: any) {
  try {
    await pusherServer.trigger(PUSHER_CHANNELS.USER_NOTIFICATIONS(userId), event, data)
    console.log(`✅ Sent ${event} to user ${userId}`)
  } catch (error) {
    console.error(`❌ Failed to send ${event} to user ${userId}:`, error)
  }
}

export async function sendWasteBinUpdate(binId: string, event: string, data: any) {
  try {
    await pusherServer.trigger(PUSHER_CHANNELS.WASTE_BIN_UPDATES(binId), event, data)
    console.log(`✅ Sent ${event} for waste bin ${binId}`)
  } catch (error) {
    console.error(`❌ Failed to send ${event} for waste bin ${binId}:`, error)
  }
}

export async function sendAdminAlert(event: string, data: any) {
  try {
    await pusherServer.trigger(PUSHER_CHANNELS.ADMIN_ALERTS, event, data)
    console.log(`✅ Sent admin alert: ${event}`)
  } catch (error) {
    console.error(`❌ Failed to send admin alert ${event}:`, error)
  }
}

export async function sendGlobalAnnouncement(event: string, data: any) {
  try {
    await pusherServer.trigger(PUSHER_CHANNELS.GLOBAL_ANNOUNCEMENTS, event, data)
    console.log(`✅ Sent global announcement: ${event}`)
  } catch (error) {
    console.error(`❌ Failed to send global announcement ${event}:`, error)
  }
}
