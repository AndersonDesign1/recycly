import { NextResponse } from "next/server";

import { savePickupProof } from "@/app/(app)/dashboard/actions";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    await savePickupProof({
      pickupRequestId: String(payload.pickupRequestId),
      fileKey: String(payload.fileKey),
      fileUrl: String(payload.fileUrl),
      fileName: payload.fileName ? String(payload.fileName) : null,
      fileSize:
        typeof payload.fileSize === "number" ? payload.fileSize : Number(payload.fileSize ?? 0),
      mimeType: payload.mimeType ? String(payload.mimeType) : null,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to save pickup proof.",
      },
      { status: 400 },
    );
  }
}
