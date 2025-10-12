
import React from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { AnimatedButton } from "@/components/ui/MotionButton";
import { cookies } from "next/headers";
import { IUser } from "@/interfaces";

const Navbar = async() => {
  const cookieStore = await cookies()
  const token = cookieStore.get("Token")?.value
  const userCookie = cookieStore.get("User")?.value
  const user :IUser = userCookie? JSON.parse(userCookie) :null

  return (
    <nav className="px-5 py-3 flex justify-between">
      <Link
        href="/"
        className="flex gap-1 items-center hover:opacity-90 transition"
      >
        <Image width={55} height={60} alt={"logo"} src={"/logo.svg"}></Image>
        <h1 className="text-2xl text-[#79ac31] font-bold">ShopNex</h1>
      </Link>

      <div className="flex gap-3 items-center text-[#79ac31]">
        <ShoppingBag size={32} />
       {!token && <Link  href="/login"><AnimatedButton>Login</AnimatedButton></Link> || <p>Hello, <span>{user?.name.split(" ")[0]}</span></p>}
      </div>
    </nav>
  );
};

export default Navbar;
