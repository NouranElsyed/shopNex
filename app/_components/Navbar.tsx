import React from "react";
import Image from "next/image";
import Link from "next/link";
import UserMenu from "@/components/ui/UserMenu";

const Navbar = async () => {


  return (
    <nav className="px-5 py-3 flex justify-between">
      <Link
        href="/"
        className="flex gap-1 items-center hover:opacity-90 transition"
      >
        <Image width={40} height={50} alt={"logo"} src={"/logo.svg"}></Image>
        <h1 className="text-xl text-[#79ac31] font-bold">ShopNex</h1>
      </Link>
      <div className="links">
        <Link href="/products" className="text-[#79ac31] font-semibold hover:text-[#628e24]">Our products</Link>
      </div>
      <UserMenu ></UserMenu>
    </nav>
  );
};

export default Navbar;
