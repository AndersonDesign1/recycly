import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext } from "@/server/context";
import { appRouter } from "@/server/trpc/root";
import { logger } from "@/lib/logger";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            logger.error(
              "❌ tRPC failed on %s: %o",
              path ?? "<no-path>",
              error
            );
          }
        : undefined,
  });

export { handler as GET, handler as POST };
