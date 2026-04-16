import { signOut, withAuth } from "@workos-inc/authkit-nextjs";
import RecyclyDashboard from "@/components/recycly-dashboard";
import { createViewerProfile } from "@/lib/auth";

export default async function DashboardPage() {
  const { user } = await withAuth({ ensureSignedIn: true });
  const viewer = createViewerProfile(user);

  const signOutAction = async () => {
    "use server";

    await signOut({ returnTo: "/" });
  };

  return <RecyclyDashboard onSignOut={signOutAction} viewer={viewer} />;
}
