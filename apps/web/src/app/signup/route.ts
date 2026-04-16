import { getSignUpUrl } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const GET = async () => {
  const signUpUrl = await getSignUpUrl({
    returnTo: "/dashboard",
  });

  return redirect(signUpUrl);
};
