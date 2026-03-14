"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { UploadButton } from "@/lib/uploadthing";

interface PickupProofUploaderProps {
  pickupRequestId: string;
}

export function PickupProofUploader({
  pickupRequestId,
}: PickupProofUploaderProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-3 rounded-2xl border border-border border-dashed bg-background/70 p-4">
      <div>
        <p className="font-medium text-foreground text-sm">
          Upload pickup proof
        </p>
        <p className="text-muted-foreground text-xs leading-5">
          Add photo evidence after collection so the request can move into staff
          review.
        </p>
      </div>

      <UploadButton
        appearance={{
          button:
            "ut-ready:bg-primary ut-ready:text-primary-foreground ut-ready:hover:bg-primary/90 ut-uploading:cursor-not-allowed ut-uploading:bg-muted ut-uploading:text-muted-foreground rounded-full px-4 py-2 text-xs font-medium",
          allowedContent: "text-xs text-muted-foreground",
        }}
        endpoint="pickupProof"
        onClientUploadComplete={(files) => {
          startTransition(async () => {
            const file = files[0];

            const response = await fetch("/api/pickups/proof", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                pickupRequestId,
                fileKey: file.key,
                fileUrl: file.ufsUrl,
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type,
              }),
            });

            if (!response.ok) {
              setMessage("Upload finished but proof could not be saved.");
              return;
            }

            setMessage("Proof uploaded and saved.");
            router.refresh();
          });
        }}
        onUploadError={(error) => {
          setMessage(error.message);
        }}
      />

      {message ? (
        <p className="text-muted-foreground text-xs">
          {isPending ? "Saving proof..." : message}
        </p>
      ) : null}
    </div>
  );
}
