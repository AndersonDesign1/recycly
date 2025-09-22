import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ user: null, session: null }, { status: 200 });
    }

    return NextResponse.json({
      user: session.user,
      session: session.session,
    });
  } catch (error) {
    logger.error("Session check failed: %o", error);
    return NextResponse.json({ user: null, session: null }, { status: 200 });
  }
}
