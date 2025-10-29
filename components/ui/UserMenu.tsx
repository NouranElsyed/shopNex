"use client";
import { AnimatedButton } from "@/components/ui/customButton/MotionButton";
import LogoutButton from "@/components/ui/customButton/LogoutButton";
import {
  Heart,
  ListTree,
  LogOut,
  Menu,
  Ribbon,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/store/user.store";
import { useCartStore } from "@/store/cart.store";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useWishListStore } from "@/store/wishList.store";
import { useState } from "react";
import { Menu as AntdMenu } from "antd";

const UserMenu = () => {
  const { user } = useUserStore();
  const { wishList, fetchwishList } = useWishListStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { fetchCart, cart } = useCartStore();
  const router = useRouter();

  const getCart = () => {
    router.push("/cart");
    fetchCart();
    setMobileMenuOpen(false);
  };

  const goToWishList = () => {
    router.push("/wishlist");
    fetchwishList();
    setMobileMenuOpen(false);
  };

  const itemCount = user
    ? cart?.numOfCartItems ?? cart?.data?.products?.length ?? 0
    : 0;
  const wishCount = user ? wishList?.count ?? 0 : 0;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="flex gap-3 items-center text-[#79ac31] relative">
      {(!user && (
        <Link href="/login">
          <AnimatedButton>Login</AnimatedButton>
        </Link>
      )) || (
        <>
          <div className="md:hidden">
            <Menu
              size={30}
              className="cursor-pointer text-[#79ac31]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>

          <div className="hidden md:flex gap-3 items-center">
             <p className="text-sm font-semibold">
              Hello, <span>{user?.name.split(" ")[0]}</span>
            </p>
            <div className="relative cursor-pointer" onClick={goToWishList}>
              {wishCount > 0 && (
                <motion.span
                  key={wishCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center"
                >
                  {wishCount}
                </motion.span>
              )}
              <Heart className="text-[#db1a00]" size={25} />
            </div>

            <div className="relative cursor-pointer" onClick={getCart}>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
              <ShoppingBag size={27} />
            </div>

           
            <LogoutButton />
          </div>

          <AntdMenu
            className={`
              absolute top-full right-0 my-2 w-56 bg-amber-400 shadow-xl rounded-lg
              md:hidden z-50 border border-gray-200
              ${mobileMenuOpen ? "block" : "hidden"}
            `}
            mode="vertical"
            selectable={false}
            items={[
              {
                key: "profile",
                label: `👋 Hello, ${user?.name.split(" ")[0]}`,
                className: "font-medium py-3 ",
              },
              {
                key: "wishlist",
                label: (
                  <div
                    className="flex items-center gap-3 py-2 cursor-pointer rounded"
                    onClick={goToWishList}
                  >
                    <Heart size={18} className="text-[#db1a00]" />
                    <span>Wishlist</span>
                    {wishCount > 0 && (
                      <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-auto">
                        {wishCount}
                      </span>
                    )}
                  </div>
                ),
              },
              {
                key: "cart",
                label: (
                  <div
                    className="flex items-center gap-3 py-2 cursor-pointer rounded"
                    onClick={getCart}
                  >
                    <ShoppingBag size={18} />
                    <span>Cart</span>
                    {itemCount > 0 && (
                      <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-auto">
                        {itemCount}
                      </span>
                    )}
                  </div>
                ),
              },
              {
                key: "products",
                label: (
                  <div
                    className="flex items-center gap-3 py-2 cursor-pointer rounded"
                    onClick={() => {
                      router.push("/products");
                    }}
                  >
                    <ShoppingCart size={18} />
                    <span>Our products</span>
                  </div>
                ),
              },
              {
                key: "categories",
                label: (
                  <div
                    className="flex items-center gap-3 py-2 cursor-pointer rounded"
                    onClick={() => {
                      router.push("/categories");
                    }}
                  >
                    <ListTree size={18} />
                    <span>Categories</span>
                  </div>
                ),
              },
              {
                key: "brands",
                label: (
                  <div
                    className="flex items-center gap-3 py-2 cursor-pointer rounded"
                    onClick={() => {
                      router.push("/brands");
                    }}
                  >
                    {/* <ShoppingBag size={18} /> */}
                    <Ribbon size={18} />
                    <span>Brands</span>
                  </div>
                ),
              },
              {
                key: "logout",
                label: (
                  <div
                    className="flex items-center gap-3 py-2 cursor-pointer  text-red-600  rounded border-t"
                    onClick={closeMobileMenu}
                  >
                    <LogOut />
                    Logout
                  </div>
                ),
              },
            ]}
          />
        </>
      )}
    </div>
  );
};

export default UserMenu;
