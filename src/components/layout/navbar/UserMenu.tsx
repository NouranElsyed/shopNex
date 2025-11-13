"use client";
import { useSession } from "next-auth/react";
import { Heart, ShoppingBag, Menu, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import LogoutButton from "../../ui/custom/LogoutButton";
import { AnimatedButton } from "../../ui/custom/MotionButton";
import { useCounts } from "@/src/hooks/useCounts"; 

const UserMenu = () => {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { wishlistCount, cartCount } = useCounts();

  useEffect(() => {
    setMounted(true);
  }, []);
  const goTo = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  if (!mounted || status === "loading") {
    return (
      <div className="flex gap-3 items-center">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    );
  }


  if (!session) {
    return (
      <div className="flex gap-3 items-center">
        <div className="hidden md:block">
          <Link href="/register">
            <AnimatedButton>
              Register
            </AnimatedButton>
          </Link>
        </div>

        <div className="md:hidden">
          <Menu
            size={30}
            className="cursor-pointer text-[#79ac31] hover:text-[#6a8f2a]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </div>

        {mobileMenuOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl rounded-lg border border-gray-200 md:hidden z-50">
            <div className="p-3">
              <AnimatedButton
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push("/register");
                }}
                className="w-full text-center"
              >
                Register
              </AnimatedButton>
            </div>
          </div>
        )}
      </div>
    );
  }


  return (
    <div className="flex gap-3 items-center text-[#79ac31] relative">
      <div className="md:hidden">
        <Menu
          size={30}
          className="cursor-pointer hover:text-[#6a8f2a]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
      </div>

      {/* Desktop */}
      <div className="hidden md:flex gap-1 lg:gap-4 items-center">
        <div
          className="flex items-center gap-2  hover:text-[#6a8f2a]"
         
        >
          <User size={20} />
          <p className="text-sm font-semibold">
            Hello, <span>{session.user?.name?.split(" ")[0]}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Wishlist */}
          <div
            className="relative cursor-pointer"
            onClick={() => goTo("/wishlist")}
          >
            <Heart className="text-[#db1a00] hover:text-[#c11500]" size={23} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </div>

          {/* Cart */}
          <div className="relative cursor-pointer" onClick={() => goTo("/cart")}>
            <ShoppingBag size={25} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#79ac31] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </div>

          <LogoutButton />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div className="absolute top-full right-0 mt-2 w-64 bg-white shadow-2xl rounded-xl border border-gray-100 md:hidden z-50">
            <div className="p-4 bg-gradient-to-r from-[#79ac31] to-[#6a8f2a] text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-semibold">{session.user?.name?.split(" ")[0]}</p>
                  <p className="text-sm opacity-90">{session.user?.email}</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <div
                className="flex items-center justify-between p-3  hover:bg-gray-50 rounded-lg"
              
              >
                <div className="flex items-center gap-3">
                  <User size={18} className="text-[#79ac31]" />
                  <span>My Profile</span>
                </div>
              </div>

              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 rounded-lg"
                onClick={() => goTo("/wishlist")}
              >
                <div className="flex items-center gap-3">
                  <Heart size={18} className="text-[#db1a00]" />
                  <span>Wishlist</span>
                </div>
                {wishlistCount > 0 && (
                  <span className="bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </div>

              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 rounded-lg"
                onClick={() => goTo("/cart")}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag size={18} className="text-[#79ac31]" />
                  <span>Cart</span>
                </div>
                {cartCount > 0 && (
                  <span className="bg-[#79ac31] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </div>

              <div className="border-t border-gray-200 mt-2 pt-2">
                <div className="p-2">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>

          <div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default UserMenu;