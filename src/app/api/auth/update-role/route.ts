import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user from the session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = await request.json();

    // Validate role
    const validRoles = ["USER", "WASTE_MANAGER", "ADMIN", "SUPERADMIN"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Update the user's role
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { role },
    });

    // Invalidate the current session to force re-authentication
    await auth.api.invalidateSession({
      headers: request.headers,
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Role updated successfully",
    });
  } catch (error) {
    logger.error("Error updating user role: %o", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}
