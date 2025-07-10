import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from "@/lib/trpc/server";
import {
  createWasteBinSchema,
  updateWasteBinSchema,
  wasteBinFilterSchema,
} from "@/lib/validations/waste-bin";
import QRCode from "qrcode";
import type { WasteBin } from "@prisma/client";

type WasteBinWithRelations = WasteBin & {
  _count: {
    wasteDisposals: number;
    reports: number;
  };
  manager: {
    name: string;
    email: string;
  } | null;
};

type WasteBinWithDistance = WasteBinWithRelations & {
  distance: number;
};

export const wasteBinRouter = createTRPCRouter({
  // Get all waste bins
  getAll: publicProcedure
    .input(wasteBinFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = {};

      if (input?.type) where.type = input.type;
      if (input?.status) where.status = input.status;

      const bins = await ctx.basePrisma.wasteBin.findMany({
        where,
        include: {
          _count: {
            select: {
              wasteDisposals: true,
              reports: true,
            },
          },
          manager: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Filter by location if provided
      if (input?.nearLocation) {
        const { latitude, longitude, radiusKm } = input.nearLocation;
        return bins.filter((bin: WasteBinWithRelations) => {
          const distance = calculateDistance(
            latitude,
            longitude,
            Number(bin.latitude),
            Number(bin.longitude)
          );
          return distance <= radiusKm;
        });
      }

      return bins;
    }),

  // Get waste bin by ID
  getById: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.basePrisma.wasteBin.findUnique({
        where: { id: input.id },
        include: {
          wasteDisposals: {
            include: { user: { select: { name: true, avatarUrl: true } } },
            orderBy: { createdAt: "desc" },
            take: 10,
          },
          reports: {
            include: { user: { select: { name: true } } },
            orderBy: { createdAt: "desc" },
            take: 5,
          },
          manager: {
            select: {
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              wasteDisposals: true,
              reports: true,
            },
          },
        },
      });
    }),

  // Get waste bin by QR code
  getByQRCode: publicProcedure
    .input(z.object({ qrCode: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.basePrisma.wasteBin.findUnique({
        where: { qrCode: input.qrCode },
        include: {
          _count: {
            select: {
              wasteDisposals: true,
              reports: true,
            },
          },
        },
      });
    }),

  // Create waste bin (admin only)
  create: adminProcedure
    .input(createWasteBinSchema)
    .mutation(async ({ ctx, input }) => {
      const qrCode = await QRCode.toDataURL(`waste-bin:${Date.now()}`);

      return ctx.basePrisma.wasteBin.create({
        data: {
          ...input,
          qrCode,
        },
      });
    }),

  // Update waste bin (admin only)
  update: adminProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        data: updateWasteBinSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.basePrisma.wasteBin.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  // Delete waste bin (admin only)
  delete: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.basePrisma.wasteBin.delete({
        where: { id: input.id },
      });
    }),

  // Get nearby bins
  getNearby: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        radiusKm: z.number().default(5),
      })
    )
    .query(async ({ ctx, input }) => {
      const bins = await ctx.basePrisma.wasteBin.findMany({
        where: { status: "ACTIVE" },
        include: {
          _count: {
            select: {
              wasteDisposals: true,
              reports: true, // Added missing reports count
            },
          },
          manager: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return bins
        .map(
          (bin): WasteBinWithDistance => ({
            ...bin,
            distance: calculateDistance(
              input.latitude,
              input.longitude,
              Number(bin.latitude),
              Number(bin.longitude)
            ),
          })
        )
        .filter((bin: WasteBinWithDistance) => bin.distance <= input.radiusKm)
        .sort(
          (a: WasteBinWithDistance, b: WasteBinWithDistance) =>
            a.distance - b.distance
        );
    }),
});

// Helper function to calculate distance between two coordinates
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in kilometers
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
