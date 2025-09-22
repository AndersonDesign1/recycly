import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    await auth.api.signOut({
      headers: request.headers,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Sign out failed: %o", error);
    return NextResponse.json({ error: "Failed to sign out" }, { status: 500 });
  }
}
