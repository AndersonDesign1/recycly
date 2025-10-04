import { z } from "zod";
import { fetchRouter, fetchUserProcedure } from "../../lib/trpc";

// Constants for pagination limits
const MAX_NOTIFICATIONS_LIMIT = 100;
const DEFAULT_NOTIFICATIONS_LIMIT = 20;

export const notificationRouter = fetchRouter({
  // Get user's notifications
  getNotifications: fetchUserProcedure
    .input(
      z.object({
        limit: z
          .number()
          .min(1)
          .max(MAX_NOTIFICATIONS_LIMIT)
          .default(DEFAULT_NOTIFICATIONS_LIMIT),
        cursor: z.string().optional(),
        unreadOnly: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const notifications = await ctx.db.notification.findMany({
        where: {
          userId: ctx.user.id,
          ...(input.unreadOnly && { isRead: false }),
        },
        orderBy: { createdAt: "desc" },
        take: input.limit + 1,
        ...(input.cursor && {
          cursor: { id: input.cursor },
          skip: 1,
        }),
      });

      let nextCursor: typeof input.cursor | undefined;
      if (notifications.length > input.limit) {
        const nextItem = notifications.pop();
        nextCursor = nextItem?.id;
      }

      return {
        notifications,
        nextCursor,
      };
    }),

  // Mark notification as read
  markAsRead: fetchUserProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const notification = await ctx.db.notification.update({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
        data: { isRead: true },
      });

      return notification;
    }),

  // Mark all notifications as read
  markAllAsRead: fetchUserProcedure.mutation(async ({ ctx }) => {
    await ctx.db.notification.updateMany({
      where: {
        userId: ctx.user.id,
        isRead: false,
      },
      data: { isRead: true },
    });

    return { success: true };
  }),

  // Get unread count
  getUnreadCount: fetchUserProcedure.query(async ({ ctx }) => {
    const count = await ctx.db.notification.count({
      where: {
        userId: ctx.user.id,
        isRead: false,
      },
    });

    return { count };
  }),
});
