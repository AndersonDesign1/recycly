import { auth } from "@clerk/nextjs/server";
import { createRouteHandler, createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const uploadRouter = {
  pickupProof: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 6,
    },
  })
    .middleware(async () => {
      const { userId } = await auth();

      if (!userId) {
        throw new Error("Unauthorized");
      }

      return {
        userId,
        kind: "pickup_proof" as const,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => ({
      uploadedBy: metadata.userId,
      kind: metadata.kind,
      fileKey: file.key,
      fileUrl: file.ufsUrl,
    })),

  supportAttachment: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 4,
    },
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 2,
    },
  })
    .middleware(async () => {
      const { userId } = await auth();

      if (!userId) {
        throw new Error("Unauthorized");
      }

      return {
        userId,
        kind: "support_attachment" as const,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => ({
      uploadedBy: metadata.userId,
      kind: metadata.kind,
      fileKey: file.key,
      fileUrl: file.ufsUrl,
    })),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
});
