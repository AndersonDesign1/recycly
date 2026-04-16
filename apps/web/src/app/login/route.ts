import { getSignInUrl } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const GET = async () => {
  const signInUrl = await getSignInUrl({
    returnTo: "/dashboard",
  });
  return redirect(signInUrl);
};
