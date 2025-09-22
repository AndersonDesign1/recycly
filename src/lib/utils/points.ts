import type { WasteType } from "@prisma/client";

export function calculatePointsForDisposal(
  wasteType: WasteType,
  weightKg?: number
): number {
  const basePoints: Record<WasteType, number> = {
    RECYCLING: 10,
    COMPOST: 8,
    ELECTRONIC: 15,
    HAZARDOUS: 20,
    TEXTILE: 12,
    GLASS: 10,
    METAL: 12,
    PAPER: 8,
    PLASTIC: 10,
    GENERAL: 5,
  };

  const base = basePoints[wasteType] || 5;
  const weightMultiplier = weightKg ? Math.min(weightKg * 2, 10) : 1;

  return Math.round(base * weightMultiplier);
}

export function calculateLevel(points: number): number {
  return Math.floor(points / 100) + 1;
}

export function getPointsForNextLevel(currentLevel: number): number {
  return currentLevel * 100;
}
