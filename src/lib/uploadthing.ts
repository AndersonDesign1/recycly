import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getAuthUser } from "./auth";

const f = createUploadthing();

export const ourFileRouter = {
  // Waste disposal image upload
  wasteDisposalImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // Get user from Better Auth session
      const user = await getAuthUser(req);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Waste disposal image uploaded:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // User avatar upload
  userAvatar: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const user = await getAuthUser(req);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("User avatar uploaded:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Waste bin image upload (for waste managers and admins)
  wasteBinImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const user = await getAuthUser(req);
      if (
        !user ||
        !["WASTE_MANAGER", "ADMIN", "SUPERADMIN"].includes(user.role || "")
      ) {
        throw new Error("Insufficient permissions");
      }
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Waste bin image uploaded:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Report image upload
  reportImage: f({ image: { maxFileSize: "4MB", maxFileCount: 3 } })
    .middleware(async ({ req }) => {
      const user = await getAuthUser(req);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Report image uploaded:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Reward image upload (for admins)
  rewardImage: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const user = await getAuthUser(req);
      if (!user || !["ADMIN", "SUPERADMIN"].includes(user.role || "")) {
        throw new Error("Insufficient permissions");
      }
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Reward image uploaded:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
