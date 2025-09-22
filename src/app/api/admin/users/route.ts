import type { Account, Session, User } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
  try {
    // Get all users with basic info
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        createdAt: true,
        role: true,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    logger.error("Failed to fetch users: %o", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    if (!(userId || email)) {
      return NextResponse.json(
        { success: false, error: "User ID or email is required" },
        { status: 400 }
      );
    }

    const user: (User & { sessions: Session[]; accounts: Account[] }) | null =
      userId
        ? await prisma.user.findUnique({
            where: { id: userId },
            include: { sessions: true, accounts: true },
          })
        : email
        ? await prisma.user.findUnique({
            where: { email },
            include: { sessions: true, accounts: true },
          })
        : null;

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Delete all related data first (Better Auth will handle this with cascade)
    // But we'll do it explicitly to ensure proper cleanup
    await prisma.$transaction(async (tx) => {
      // Delete sessions first
      if (user.sessions.length > 0) {
        await tx.session.deleteMany({
          where: { userId: user.id },
        });
      }

      // Delete accounts (OAuth connections)
      if (user.accounts.length > 0) {
        await tx.account.deleteMany({
          where: { userId: user.id },
        });
      }

      // Delete verifications
      await tx.verification.deleteMany({
        where: { identifier: user.email },
      });

      // Finally delete the user (this will cascade to other related data)
      await tx.user.delete({
        where: { id: user.id },
      });
    });

    return NextResponse.json({
      success: true,
      message: `User ${user.email} and all related data deleted successfully`,
    });
  } catch (error) {
    logger.error("Failed to delete user: %o", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
