import { NextResponse } from "next/server";
import { z } from "zod";

import { savePickupProof } from "@/app/(app)/dashboard/actions";

const pickupProofPayloadSchema = z.object({
  pickupRequestId: z.string().trim().min(1),
  fileKey: z.string().trim().min(1),
  fileUrl: z.url(),
  fileName: z.string().trim().min(1).nullable().optional(),
  fileSize: z.number().int().nonnegative().nullable().optional(),
  mimeType: z.string().trim().min(1).nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const payload = pickupProofPayloadSchema.parse(await request.json());

    await savePickupProof({
      pickupRequestId: payload.pickupRequestId,
      fileKey: payload.fileKey,
      fileUrl: payload.fileUrl,
      fileName: payload.fileName ?? null,
      fileSize: payload.fileSize ?? null,
      mimeType: payload.mimeType ?? null,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    let message = "Unable to save pickup proof.";
    let status = 400;

    if (error instanceof z.ZodError) {
      message = "Invalid pickup proof payload.";
      status = 422;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status }
    );
  }
}
