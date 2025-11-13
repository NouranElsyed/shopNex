import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuthRedirect = (options: {
  requireAuth?: boolean;
  redirectTo?: string;
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { requireAuth = false, redirectTo = "/" } = options;

  useEffect(() => {
   
    if (status === "loading") return;

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("Token="))
      ?.split("=")[1];

    const isAuthenticated = !!token || !!session;

  
    if (requireAuth && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!requireAuth && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [status, session, requireAuth, redirectTo, router]);
};
