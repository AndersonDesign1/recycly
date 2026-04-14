import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

export default authkitMiddleware();

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/collector/:path*",
    "/staff/:path*",
    "/admin/:path*",
  ],
};
