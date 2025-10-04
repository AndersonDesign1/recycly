import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '../../../../server/trpc/root'
import { db } from '../../../../lib/db'
import { auth } from '../../../../lib/auth'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async (opts) => {
      const session = await auth.api.getSession({
        headers: opts.req.headers,
      })
      return {
        db,
        session,
        req: opts.req,
      }
    },
  })

export { handler as GET, handler as POST }
