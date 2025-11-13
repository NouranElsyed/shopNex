"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LogoutButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return; 

    setIsLoading(true);

    try {
      await fetch("/api/logout", { method: "POST" });

      await signOut({ redirect: false });

      // توجيه
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/login");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`
        text-sm font-medium transition-colors
        ${isLoading 
          ? "text-gray-400 cursor-not-allowed  border-2 border-gray-400 px-2 py-1 rounded-md" 
          : "text-red-600 hover:text-red-700 cursor-pointer border-2 border-red-600 px-2 py-1 rounded-md"
        }
      `}
    >
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;